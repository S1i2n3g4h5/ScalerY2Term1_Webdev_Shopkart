import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useState } from 'react';


const Register = () =>{
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName:'',
        email:'',
        password:'',
        phone:'',
    });


    // UI States
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    // INPUT changes
    const handleChange =  (e)=>{
        setFormData({
            ...formData,
            [e.target.name] : e.target.value,
        });
    };


    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('--- Register button clicked! ---');
        console.log('Sending payload:', formData);

        setError('');
        setLoading(true);

        try {
        const response = await API.post('/customers/register', formData);
        console.log('Backend response:', response.data);

        if (response.data.success) {
            alert('Registration successful! Redirecting to login...');
            navigate('/login');
        }
        } catch (err) {
        console.error('Registration Error:', err);
        if (err.response && err.response.data) {
            setError(err.response.data.message);
        } else {
            setError('Something went wrong. Please try again.');
        }
        } finally {
        setLoading(false);
        }
    };



    return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Sign up to get started with ShopKart</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="john@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="9876543210"
              value={formData.phone}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );

}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '75vh',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '420px',
  },
  title: {
    margin: '0 0 0.5rem 0',
    color: '#1e293b',
    fontSize: '1.75rem',
    textAlign: 'center',
  },
  subtitle: {
    margin: '0 0 1.5rem 0',
    color: '#64748b',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '0.75rem',
    borderRadius: '6px',
    marginBottom: '1rem',
    fontSize: '0.875rem',
    textAlign: 'center',
    border: '1px solid #fecaca',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '0.95rem',
    outline: 'none',
  },
  button: {
    marginTop: '0.5rem',
    padding: '0.85rem',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  footerText: {
    marginTop: '1.5rem',
    fontSize: '0.875rem',
    color: '#64748b',
    textAlign: 'center',
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '600',
  },
};

export default Register;