import React from 'react';
import { Link } from 'react-router-dom';


const WishlistCard = ({ product, onRemove, removingId }) => {
  const isRemoving = removingId === product._id;

  return(
    <div style={styles.card}>
      <img src={product.image} alt={product.name} style={styles.image} />
      <div style={styles.content}>
        <span style={styles.category}>{product.category}</span>
        <h3 style={styles.title}>{product.name}</h3>
        <p style={styles.price}>₹{product.price?.toLocaleString('en-IN')}</p>
        
        <p style={styles.stock}>
          {product.stock > 0 ? (
            <span style={{ color: '#16a34a' }}>In Stock ({product.stock} left)</span>
          ) : (
            <span style={{ color: '#dc2626' }}>Out of Stock</span>
          )}
        </p>

        <div style={styles.actions}>
          <Link to={`/products/${product._id}`} style={styles.viewBtn}>
            View Details
          </Link>

          <button
            onClick={() => onRemove(product._id)}
            disabled={isRemoving}
            style={isRemoving ? styles.removeBtnDisabled : styles.removeBtn}
          >
            {isRemoving ? 'Removing...' : 'Remove ♥'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
  },
  content: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  category: {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    color: '#2563eb',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: '1.1rem',
    margin: '0.4rem 0',
    color: '#0f172a',
  },
  price: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#0f172a',
    margin: '0 0 0.5rem 0',
  },
  stock: {
    fontSize: '0.85rem',
    marginBottom: '1rem',
    fontWeight: '500',
  },
  actions: {
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  viewBtn: {
    textAlign: 'center',
    padding: '0.6rem',
    backgroundColor: '#f1f5f9',
    color: '#0f172a',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  removeBtn: {
    padding: '0.6rem',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  removeBtnDisabled: {
    padding: '0.6rem',
    backgroundColor: '#f1f5f9',
    color: '#94a3b8',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'not-allowed',
    fontSize: '0.9rem',
  },
};

export default WishlistCard;