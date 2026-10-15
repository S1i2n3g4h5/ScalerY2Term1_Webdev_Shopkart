import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, cartCount, subtotal, loading, error, fetchCart } = useCart();

  // 1. Loading State
  if (loading) {
    return (
      <div style={styles.centerState}>
        <h2>Loading your cart...</h2>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div style={styles.centerState}>
        <h2 style={{ color: '#dc2626' }}>Something went wrong.</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>{error}</p>
        <button onClick={fetchCart} style={styles.retryBtn}>
          Try Again
        </button>
      </div>
    );
  }

  // 3. Empty State
  if (cartItems.length === 0) {
    return (
      <div style={styles.centerState}>
        <div style={styles.cartIcon}>🛒</div>
        <h2 style={styles.emptyTitle}>Your cart is empty</h2>
        <p style={styles.emptySubtitle}>
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link to="/products" style={styles.browseBtn}>
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>My Shopping Cart</h1>

      <div style={styles.layout}>
        {/* Cart Items List */}
        <div style={styles.itemsList}>
          {cartItems.map((item) => (
            <CartItem key={item.product._id} item={item} />
          ))}
        </div>

        {/* Derived Order Summary Sidebar */}
        <div style={styles.summaryCard}>
          <h2 style={styles.summaryTitle}>Order Summary</h2>
          <div style={styles.summaryRow}>
            <span>Total Units:</span>
            <strong>{cartCount}</strong>
          </div>
          <div style={styles.summaryRow}>
            <span>Subtotal:</span>
            <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
          </div>

          <div style={styles.divider} />

          <button style={styles.checkoutBtn} onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '1rem',
  },
  heading: {
    fontSize: '2rem',
    color: '#0f172a',
    marginBottom: '1.5rem',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: '2rem',
    alignItems: 'start',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  summaryTitle: {
    fontSize: '1.25rem',
    color: '#0f172a',
    marginTop: 0,
    marginBottom: '1rem',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
    fontSize: '0.95rem',
    color: '#334155',
  },
  divider: {
    height: '1px',
    backgroundColor: '#e2e8f0',
    margin: '1rem 0',
  },
  checkoutBtn: {
    width: '100%',
    padding: '0.8rem',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  centerState: {
    textAlign: 'center',
    padding: '4rem 1rem',
    maxWidth: '500px',
    margin: '0 auto',
  },
  cartIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  emptyTitle: {
    fontSize: '1.5rem',
    color: '#0f172a',
    marginBottom: '0.5rem',
  },
  emptySubtitle: {
    color: '#64748b',
    marginBottom: '1.5rem',
  },
  browseBtn: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '600',
  },
  retryBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default Cart;