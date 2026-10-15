import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { cartItems, addToCart } = useCart();
  const [savingWishlist, setSavingWishlist] = useState(false);
  const [savedWishlist, setSavedWishlist] = useState(false);
  const [addingCart, setAddingCart] = useState(false);
  const [cartError, setCartError] = useState('');

  // Check if item already exists in global cart state
  const existingCartItem = cartItems.find((item) => item.product?._id === product._id);

  const handleAddToCart = async () => {
    setAddingCart(true);
    setCartError('');
    const result = await addToCart(product._id);
    if (!result.success) {
      setCartError(result.message);
    }
    setAddingCart(false);
  };

  const handleAddToWishlist = async () => {
    if (savingWishlist || savedWishlist) return;
    setSavingWishlist(true);

    try {
      await API.post(`/wishlist/${product._id}`);
      setSavedWishlist(true);
    } catch (err) {
      if (err.response?.status === 409) {
        setSavedWishlist(true);
      }
    } finally {
      setSavingWishlist(false);
    }
  };

  return (
    <div style={styles.card}>
      <img src={product.image} alt={product.name} style={styles.image} />
      <div style={styles.content}>
        <span style={styles.category}>{product.category}</span>
        <h3 style={styles.title}>{product.name}</h3>
        <p style={styles.price}>₹{product.price?.toLocaleString('en-IN')}</p>
        <p style={styles.stock}>
          {product.stock > 0 ? `${product.stock} units left` : 'Out of Stock'}
        </p>

        {cartError && <p style={styles.errorText}>{cartError}</p>}

        <div style={styles.actions}>
          <button
            onClick={handleAddToCart}
            disabled={addingCart || product.stock === 0}
            style={product.stock === 0 ? styles.disabledBtn : styles.cartBtn}
          >
            {addingCart ? 'Adding...' : existingCartItem ? `In Cart (${existingCartItem.quantity}) +` : 'Add to Cart 🛒'}
          </button>

          <button
            onClick={handleAddToWishlist}
            disabled={savingWishlist || savedWishlist}
            style={savedWishlist ? styles.savedWishlistBtn : styles.wishlistBtn}
          >
            {savingWishlist ? '⏳' : savedWishlist ? '♥ Saved' : '♡ Wishlist'}
          </button>
        </div>

        <Link to={`/products/${product._id}`} style={styles.detailsLink}>
          View Details
        </Link>
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
    color: '#64748b',
    marginBottom: '0.75rem',
  },
  errorText: {
    color: '#dc2626',
    fontSize: '0.8rem',
    marginBottom: '0.5rem',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  cartBtn: {
    flex: 1.2,
    padding: '0.6rem',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  disabledBtn: {
    flex: 1.2,
    padding: '0.6rem',
    backgroundColor: '#e2e8f0',
    color: '#94a3b8',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'not-allowed',
    fontSize: '0.85rem',
  },
  wishlistBtn: {
    flex: 0.8,
    padding: '0.6rem',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  savedWishlistBtn: {
    flex: 0.8,
    padding: '0.6rem',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '0.85rem',
  },
  detailsLink: {
    textAlign: 'center',
    padding: '0.5rem',
    backgroundColor: '#f1f5f9',
    color: '#0f172a',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.85rem',
  },
};

export default ProductCard;