const Customer = require('../models/customer.model');
const Product = require('../models/product.model');
const mongoose = require('mongoose');

const getPopulatedCart = async (userId) => {
  const customer = await Customer.findById(userId).populate({
    path: 'cart.product',
    select: 'name price category image stock',
  });
  // Filter out any orphaned/deleted product references
  if (!customer) return [];
  return customer.cart.filter((item) => item.product !== null);
};

// 1. POST /cart/:productId - Add product to cart (or increment quantity if present)
exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id || req.user.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID format.' });
    }

    // Check if product exists and check its stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (product.stock < 1) {
      return res.status(400).json({ success: false, message: 'Product is out of stock.' });
    }

    const customer = await Customer.findById(userId);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Check if item already exists in user's cart
    const cartItemIndex = customer.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      // Item exists: check if incrementing exceeds stock
      const currentQty = customer.cart[cartItemIndex].quantity;
      if (currentQty + 1 > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Stock limit reached (${product.stock} available).`,
        });
      }
      customer.cart[cartItemIndex].quantity += 1;
    } else {
      // Item does not exist: add new entry with quantity 1
      customer.cart.push({ product: productId, quantity: 1 });
    }

await customer.save({ validateModifiedOnly: true });

    const updatedCart = await getPopulatedCart(userId);
    return res.status(200).json({
      success: true,
      message: 'Product added to cart.',
      cart: updatedCart,
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GET /cart - Fetch current user's populated cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const cart = await getPopulatedCart(userId);

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. PATCH /cart/:productId - Update specific quantity
exports.updateQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id || req.user.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID format.' });
    }

    // Validate quantity parameter
    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a valid number and at least 1.',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Validate stock limit
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity exceeds available stock (${product.stock} available).`,
      });
    }

    const customer = await Customer.findById(userId);
    const cartItem = customer.cart.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Product not found in cart.' });
    }

    // Update quantity and save
    cartItem.quantity = quantity;
await customer.save({ validateBeforeSave: false });

    const updatedCart = await getPopulatedCart(userId);
    return res.status(200).json({
      success: true,
      message: 'Cart quantity updated.',
      cart: updatedCart,
    });
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. DELETE /cart/:productId - Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id || req.user.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID format.' });
    }

    const customer = await Customer.findById(userId);
    const itemExists = customer.cart.some(
      (item) => item.product.toString() === productId
    );

    if (!itemExists) {
      return res.status(404).json({ success: false, message: 'Product not found in cart.' });
    }

    // Filter out product from cart array
    customer.cart = customer.cart.filter(
      (item) => item.product.toString() !== productId

    );

await customer.save({ validateBeforeSave: false });

    const updatedCart = await getPopulatedCart(userId);
    return res.status(200).json({
      success: true,
      message: 'Product removed from cart.',
      cart: updatedCart,
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};