import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders');
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error('Error loading orders:', err);
        setError('Could not load order history.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div style={styles.centerState}>Loading your orders...</div>;
  if (error) return <div style={styles.centerState}><p style={{ color: '#dc2626' }}>{error}</p></div>;

  if (orders.length === 0) {
    return (
      <div style={styles.centerState}>
        <h2>You have not placed any orders yet.</h2>
        <Link to="/products" style={styles.shopBtn}>Start Shopping</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>My Orders</h1>

      <div style={styles.list}>
        {orders.map((order) => (
          <div key={order._id} style={styles.orderCard}>
            <div style={styles.cardHeader}>
              <div>
                <span style={styles.orderId}>Order #{order._id}</span>
                <div style={styles.date}>
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>
              <span style={order.paymentStatus === 'PAID' ? styles.paidBadge : styles.pendingBadge}>
                {order.status}
              </span>
            </div>

            <div style={styles.itemsList}>
              {order.items.map((item, index) => (
                <div key={index} style={styles.itemRow}>
                  <span>{item.name} × {item.quantity}</span>
                  <strong>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong>
                </div>
              ))}
            </div>

            <div style={styles.cardFooter}>
              <span>Total Amount: <strong>₹{order.totalAmount.toLocaleString('en-IN')}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '1rem' },
  heading: { fontSize: '2rem', color: '#0f172a', marginBottom: '1.5rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  orderCard: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1rem' },
  orderId: { fontWeight: 'bold', fontSize: '1rem', color: '#0f172a' },
  date: { fontSize: '0.8rem', color: '#64748b' },
  paidBadge: { backgroundColor: '#dcfce7', color: '#166534', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' },
  pendingBadge: { backgroundColor: '#fef3c7', color: '#92400e', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' },
  itemsList: { marginBottom: '1rem' },
  itemRow: { display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', fontSize: '0.9rem', color: '#334155' },
  cardFooter: { borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '1rem' },
  centerState: { textAlign: 'center', padding: '4rem 1rem' },
  shopBtn: { display: 'inline-block', padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', marginTop: '1rem' },
};

export default Orders;