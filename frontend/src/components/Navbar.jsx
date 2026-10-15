import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart(); // Consume dynamic cart item count from global state

  const handleLogout = async () => {
    try {
      await API.post('/logout');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>ShopKart</h2>
      <div style={styles.links}>
        <Link to="/products" style={styles.link}>Products</Link>
        <Link to="/wishlist" style={styles.link}>Wishlist</Link>
        <Link to="/cart" style={styles.cartLink}>Cart ({cartCount}) 🛒</Link>
        <Link to="/orders" style={styles.link}>My Orders</Link>
        <Link to="/home" style={styles.link}>Profile</Link>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#1e293b',
    color: '#fff',
  },
  logo: {
    margin: 0,
    fontSize: '1.5rem',
  },
  links: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
  },
  link: {
    color: '#cbd5e1',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  cartLink: {
    color: '#38bdf8',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  logoutBtn: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default Navbar;