const Order = require('../models/order.model');
const Customer = require('../models/customer.model');
const Product = require('../models/product.model');
const razorpay = require('../config/razorpay');
const crypto = require('crypto');

// 1. POST /orders/create-payment-order
exports.createPaymentOrder = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { shippingAddress } = req.body;

    // Validate Shipping Address
    if (
      !shippingAddress ||
      !shippingAddress.fullName?.trim() ||
      !shippingAddress.phone?.trim() ||
      !shippingAddress.addressLine1?.trim() ||
      !shippingAddress.city?.trim() ||
      !shippingAddress.state?.trim() ||
      !shippingAddress.pincode?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'All shipping address fields are required.',
      });
    }

    if (!/^\d{6}$/.test(shippingAddress.pincode.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Pincode must be exactly 6 digits.',
      });
    }

    // Load customer cart with populated products
    const customer = await Customer.findById(userId).populate('cart.product');
    if (!customer || !customer.cart || customer.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Cannot checkout.',
      });
    }

    let calculatedTotal = 0;
    const orderItems = [];

    // Revalidate each product stock & price from DB (Never trust frontend totals)
    for (const item of customer.cart) {
      const product = await Product.findById(item.product._id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product in cart no longer exists.`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        });
      }

      const itemTotal = product.price * item.quantity;
      calculatedTotal += itemTotal;

      // Create historic snapshot object
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });
    }

    // Create pending ShopKart order in MongoDB
    const shopKartOrder = new Order({
      customer: userId,
      items: orderItems,
      shippingAddress,
      totalAmount: calculatedTotal,
      paymentStatus: 'PENDING',
      status: 'PENDING_PAYMENT',
    });

    await shopKartOrder.save();

    // Create Razorpay Order (Amount must be converted to paise)
    const razorpayOptions = {
      amount: Math.round(calculatedTotal * 100),
      currency: 'INR',
      receipt: shopKartOrder._id.toString(),
    };

    const razorpayOrder = await razorpay.orders.create(razorpayOptions);

    shopKartOrder.razorpayOrderId = razorpayOrder.id;
    await shopKartOrder.save();

    return res.status(201).json({
      success: true,
      shopKartOrderId: shopKartOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error in createPaymentOrder:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. POST /orders/verify-payment
exports.verifyPayment = async (req, res) => {
  try {
    const { shopKartOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const userId = req.user._id || req.user.id;

    const order = await Order.findById(shopKartOrderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Verify HMAC SHA256 Signature using Razorpay Secret
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${order.razorpayOrderId}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      order.paymentStatus = 'FAILED';
      await order.save();
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature. Payment verification failed.',
      });
    }

    // Mark order as PAID & PLACED
    order.paymentStatus = 'PAID';
    order.status = 'PLACED';
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    // Deduct stock for purchased items
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear Customer Cart only after successful payment verification
    const customer = await Customer.findById(userId);
    if (customer) {
      customer.cart = [];
      await customer.save({ validateModifiedOnly: true });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified and order placed successfully.',
      order,
    });
  } catch (error) {
    console.error('Error in verifyPayment:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. GET /orders - Get current user's order history
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const orders = await Order.find({ customer: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. GET /orders/:id - Get single order details
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Enforce ownership check
    if (order.customer.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error fetching single order:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};