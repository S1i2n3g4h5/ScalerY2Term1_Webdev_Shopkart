import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCartState } = useCart();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (cartItems.length === 0) {
    return (
      <div style={styles.centerState}>
        <h2>Your cart is empty.</h2>
        <p>Add some items before proceeding to checkout.</p>
        <Link to="/products" style={styles.browseBtn}>Browse Products</Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend Form Validation
    const { fullName, phone, addressLine1, city, state, pincode } = shippingAddress;
    if (!fullName.trim() || !phone.trim() || !addressLine1.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      setError('Please fill in all required shipping address fields.');
      return;
    }

    if (!/^\d{6}$/.test(pincode.trim())) {
      setError('Pincode must contain exactly 6 digits.');
      return;
    }

    setLoading(true);

    try {
      // 1. Load Razorpay Script dynamically
      const res = await loadRazorpayScript();
      if (!res) {
        setError('Razorpay SDK failed to load. Please check your internet connection.');
        setLoading(false);
        return;
      }


      // 2. Call backend to create pending ShopKart order & Razorpay order
      const createRes = await API.post('/orders/create-payment-order', {
        shippingAddress,
      });

      const { key, amount, currency, razorpayOrderId, shopKartOrderId } = createRes.data;

      
      // 3. Open Razorpay Checkout Modal
      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: 'ShopKart',
        description: 'Order Payment',
        order_id: razorpayOrderId,

        handler: async function (response) {
          try {
            // 4. Verify Payment Signature on Backend
            const verifyRes = await API.post('/orders/verify-payment', {
              shopKartOrderId: shopKartOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              clearCartState(); // Wipe global cart context state
              navigate(`/order-success/${shopKartOrderId}`);
            }
          } catch (verifyErr) {
            console.error('Payment verification failed:', verifyErr);
            alert('Payment verification failed. Please contact support.');
          }
        },

        prefill: {
          name: shippingAddress.fullName,
          contact: shippingAddress.phone,
        },
        theme: {
          color: '#2563eb',
        },
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response) {
        console.error('Payment Failed:', response.error);
        alert(`Payment failed: ${response.error.description}`);
      });

      paymentObject.open();
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.response?.data?.message || 'Failed to initiate checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Checkout</h1>

      {error && <div style={styles.errorBox}>{error}</div>}

      <div style={styles.layout}>
        {/* Shipping Address Form */}
        <form onSubmit={handlePlaceOrder} style={styles.formCard}>
          <h2 style={styles.subHeading}>1. Shipping Details</h2>

          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={shippingAddress.fullName}
              onChange={handleChange}
              style={styles.input}
              placeholder="Aarav Sharma"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone Number *</label>
            <input
              type="text"
              name="phone"
              value={shippingAddress.phone}
              onChange={handleChange}
              style={styles.input}
              placeholder="9876543210"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Address Line 1 *</label>
            <input
              type="text"
              name="addressLine1"
              value={shippingAddress.addressLine1}
              onChange={handleChange}
              style={styles.input}
              placeholder="22 MG Road"
            />
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>City *</label>
              <input
                type="text"
                name="city"
                value={shippingAddress.city}
                onChange={handleChange}
                style={styles.input}
                placeholder="Bengaluru"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>State *</label>
              <input
                type="text"
                name="state"
                value={shippingAddress.state}
                onChange={handleChange}
                style={styles.input}
                placeholder="Karnataka"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Pincode (6 Digits) *</label>
            <input
              type="text"
              name="pincode"
              value={shippingAddress.pincode}
              onChange={handleChange}
              style={styles.input}
              placeholder="560001"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={loading ? styles.disabledBtn : styles.submitBtn}
          >
            {loading ? 'Initiating Payment...' : 'Proceed to Pay with Razorpay'}
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <div style={styles.summaryCard}>
          <h2 style={styles.subHeading}>2. Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.product._id} style={styles.itemRow}>
              <div>
                <div style={styles.itemName}>{item.product.name}</div>
                <div style={styles.itemQty}>Qty: {item.quantity}</div>
              </div>
              <div style={styles.itemPrice}>
                ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
              </div>
            </div>
          ))}

          <div style={styles.divider} />

          <div style={styles.totalRow}>
            <span>Total Payable:</span>
            <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '1rem' },
  heading: { fontSize: '2rem', color: '#0f172a', marginBottom: '1.5rem' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' },
  formCard: { backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' },
  summaryCard: { backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', height: 'fit-content' },
  subHeading: { fontSize: '1.25rem', color: '#0f172a', marginTop: 0, marginBottom: '1rem' },
  formGroup: { marginBottom: '1rem' },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#334155', marginBottom: '0.3rem' },
  input: { width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem', boxSizing: 'border-box' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  submitBtn: { width: '100%', padding: '0.8rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '1rem' },
  disabledBtn: { width: '100%', padding: '0.8rem', backgroundColor: '#94a3b8', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem', cursor: 'not-allowed', marginTop: '1rem' },
  itemRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' },
  itemName: { fontWeight: '600', color: '#0f172a' },
  itemQty: { fontSize: '0.8rem', color: '#64748b' },
  itemPrice: { fontWeight: 'bold', color: '#0f172a' },
  divider: { height: '1px', backgroundColor: '#cbd5e1', margin: '1rem 0' },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', color: '#0f172a' },
  errorBox: { backgroundColor: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', border: '1px solid #fecaca' },
  centerState: { textAlign: 'center', padding: '4rem 1rem' },
  browseBtn: { display: 'inline-block', padding: '0.75rem 1.5rem', backgroundColor: '#0f172a', color: '#fff', borderRadius: '6px', textDecoration: 'none', marginTop: '1rem' },
};

export default Checkout;