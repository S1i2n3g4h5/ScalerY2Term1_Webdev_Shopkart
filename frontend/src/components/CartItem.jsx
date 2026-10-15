import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [updating, setUpdating] = useState(false);

  const product = item.product;
  if (!product) return null; // Safety guard against deleted DB records

  const handleDecrease = async () => {
    if (item.quantity <= 1) return;
    setUpdating(true);
    await updateQuantity(product._id, item.quantity - 1);
    setUpdating(false);
  };

  const handleIncrease = async () => {
    if (item.quantity >= product.stock) {
      alert(`Cannot add more. Stock limit is ${product.stock}.`);
      return;
    }
    setUpdating(true);
    await updateQuantity(product._id, item.quantity + 1);
    setUpdating(false);
  };

  const handleRemove = async () => {
    setUpdating(true);
    await removeFromCart(product._id);
    setUpdating(false);
  };

  const itemTotal = (product.price || 0) * item.quantity;

  return (
    <div style={styles.card}>
      <img src={product.image} alt={product.name} style={styles.image} />

      <div style={styles.info}>
        <span style={styles.category}>{product.category}</span>
        <h3 style={styles.title}>{product.name}</h3>
        <p style={styles.unitPrice}>
          ₹{product.price?.toLocaleString('en-IN')} each
        </p>
      </div>

      <div style={styles.quantitySection}>
        <div style={styles.counter}>
          <button
            onClick={handleDecrease}
            disabled={updating || item.quantity <= 1}
            style={item.quantity <= 1 ? styles.counterBtnDisabled : styles.counterBtn}
          >
            -
          </button>
          <span style={styles.qtyText}>{item.quantity}</span>
          <button
            onClick={handleIncrease}
            disabled={updating || item.quantity >= product.stock}
            style={
              item.quantity >= product.stock
                ? styles.counterBtnDisabled
                : styles.counterBtn
            }
          >
            +
          </button>
        </div>

        <button
          onClick={handleRemove}
          disabled={updating}
          style={styles.removeBtn}
        >
          Remove
        </button>
      </div>

      <div style={styles.priceSection}>
        <span style={styles.totalLabel}>Total</span>
        <span style={styles.totalPrice}>₹{itemTotal.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    marginBottom: '1rem',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  image: {
    width: '90px',
    height: '90px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  info: {
    flex: '2',
    minWidth: '180px',
  },
  category: {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    color: '#2563eb',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: '1rem',
    margin: '0.2rem 0',
    color: '#0f172a',
  },
  unitPrice: {
    fontSize: '0.85rem',
    color: '#64748b',
    margin: 0,
  },
  quantitySection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  counter: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  counterBtn: {
    padding: '0.3rem 0.7rem',
    backgroundColor: '#f1f5f9',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  counterBtnDisabled: {
    padding: '0.3rem 0.7rem',
    backgroundColor: '#f8fafc',
    color: '#cbd5e1',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'not-allowed',
  },
  qtyText: {
    padding: '0.3rem 0.8rem',
    fontSize: '0.95rem',
    fontWeight: 'bold',
    color: '#0f172a',
  },
  removeBtn: {
    backgroundColor: 'transparent',
    color: '#dc2626',
    border: 'none',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  priceSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    minWidth: '100px',
  },
  totalLabel: {
    fontSize: '0.75rem',
    color: '#64748b',
  },
  totalPrice: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#0f172a',
  },
};

export default CartItem;