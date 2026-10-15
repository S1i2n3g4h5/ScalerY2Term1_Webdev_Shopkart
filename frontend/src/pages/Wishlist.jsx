import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import WishlistCard from '../components/WishlistCard.jsx';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState(null);

  const fetchWishlist = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await API.get('/wishlist');

      const validProducts = (response.data.wishlist || []).filter(item => item !== null);
      setWishlist(validProducts);
    }
     catch (err) {
      console.error('Error fetching wishlist:', err);
      setError("We couldn't load your wishlist. Please check your login session.");
    } 
    
    finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchWishlist();
  }, []);




  const handleRemove = async (productId) => {
    setRemovingId(productId);

    try {
      await API.delete(`/wishlist/${productId}`);

      setWishlist((prev) => prev.filter((item) => item._id !== productId));
    }
     catch (err) {
      console.error('Failed to remove item:', err);
      alert('Unable to remove item from wishlist. Please try again.');
    }
     finally {
      setRemovingId(null);
    }
  };



  if (loading) {
    return (
      <div style={styles.centerState}>
        <h2>Loading your wishlist...</h2>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div style={styles.centerState}>
        <h2 style={{ color: '#dc2626' }}>Something went wrong.</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>{error}</p>
        <button onClick={fetchWishlist} style={styles.retryBtn}>
          Try Again
        </button>
      </div>
    );
  }

  // 3. Empty State
  if (wishlist.length === 0) {
    return (
      <div style={styles.centerState}>
        <div style={styles.heartIcon}>❤️</div>
        <h2 style={styles.emptyTitle}>Your wishlist is empty</h2>
        <p style={styles.emptySubtitle}>
          Save products you love and find them here later.
        </p>
        <Link to="/products" style={styles.browseBtn}>
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.heading}>My Wishlist</h1>
        <span style={styles.subheading}>{wishlist.length} products saved</span>
      </div>

      <div style={styles.grid}>
        {wishlist.map((product) => (
          <WishlistCard
            key={product._id}
            product={product}
            onRemove={handleRemove}
            removingId={removingId}
          />
        ))}
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
  header: {
    marginBottom: '2rem',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '1rem',
  },
  heading: {
    fontSize: '2rem',
    color: '#0f172a',
    margin: 0,
  },
  subheading: {
    fontSize: '0.95rem',
    color: '#64748b',
    fontWeight: '500',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '1.5rem',
  },
  centerState: {
    textAlign: 'center',
    padding: '4rem 1rem',
    maxWidth: '500px',
    margin: '0 auto',
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
  heartIcon: {
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
};

export default Wishlist;