import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/orders/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error('Failed to fetch order details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div style={styles.centerState}>Loading order details...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>✅</div>
        <h1 style={styles.title}>Order Placed Successfully!</h1>
        <p style={styles.subtitle}>Thank you for shopping with ShopKart.</p>

        <div style={styles.detailsBox}>
          <p><strong>Order ID:</strong> {order?._id}</p>
          <p><strong>Payment Status:</strong> <span style={{ color: '#16a34a', fontWeight: 'bold' }}>{order?.paymentStatus}</span></p>
          <p><strong>Order Status:</strong> <span style={{ color: '#2563eb', fontWeight: 'bold' }}>{order?.status}</span></p>
          <p><strong>Total Paid:</strong> ₹{order?.totalAmount?.toLocaleString('en-IN')}</p>
        </div>

        <div style={styles.actions}>
          <Link to="/orders" style={styles.ordersBtn}>View My Orders</Link>
          <Link to="/products" style={styles.shopBtn}>Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '600px', margin: '3rem auto', padding: '1rem' },
  card: { backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  icon: { fontSize: '3.5rem', marginBottom: '1rem' },
  title: { fontSize: '1.8rem', color: '#0f172a', margin: '0 0 0.5rem 0' },
  subtitle: { color: '#64748b', marginBottom: '1.5rem' },
  detailsBox: { backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', textAlign: 'left', marginBottom: '1.5rem', lineHeight: '1.8' },
  actions: { display: 'flex', gap: '1rem', justifyContent: 'center' },
  ordersBtn: { padding: '0.75rem 1.25rem', backgroundColor: '#2563eb', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' },
  shopBtn: { padding: '0.75rem 1.25rem', backgroundColor: '#f1f5f9', color: '#0f172a', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' },
  centerState: { textAlign: 'center', padding: '4rem 1rem' },
};

export default OrderSuccess;