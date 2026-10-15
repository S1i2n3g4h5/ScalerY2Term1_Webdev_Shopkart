import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Axios automatically passes the HttpOnly cookie
        const response = await API.get('/customers/me');
        setUser(response.data);
      } catch (err) {
        // If 401 Unauthorized (no cookie / expired token), bounce to login
        console.error('Not authorized, redirecting to login:', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return <div style={styles.loading}>Loading profile...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.heroCard}>
        <h1 style={styles.welcomeTitle}>
          Welcome to ShopKart, <span style={styles.highlight}>{user?.fullName}</span>!
        </h1>
        <p style={styles.subtitle}>You have successfully accessed the protected dashboard.</p>

        <div style={styles.profileBox}>
          <h3 style={styles.boxHeader}>Customer Account Details</h3>
          <div style={styles.detailRow}>
            <strong>Full Name:</strong> <span>{user?.fullName}</span>
          </div>
          <div style={styles.detailRow}>
            <strong>Email Address:</strong> <span>{user?.email}</span>
          </div>
          <div style={styles.detailRow}>
            <strong>Phone Number:</strong> <span>{user?.phone}</span>
          </div>
          <div style={styles.detailRow}>
            <strong>Customer ID:</strong> <span>{user?._id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '2rem',
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    marginTop: '3rem',
    color: '#64748b',
  },
  heroCard: {
    backgroundColor: '#ffffff',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    maxWidth: '600px',
    width: '100%',
  },
  welcomeTitle: {
    margin: '0 0 0.5rem 0',
    color: '#0f172a',
    fontSize: '2rem',
  },
  highlight: {
    color: '#2563eb',
  },
  subtitle: {
    color: '#64748b',
    marginBottom: '2rem',
  },
  profileBox: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '1.5rem',
  },
  boxHeader: {
    margin: '0 0 1rem 0',
    color: '#1e293b',
    borderBottom: '1px solid #cbd5e1',
    paddingBottom: '0.5rem',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    color: '#334155',
  },
};

export default Home;