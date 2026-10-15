import React, { useState, useEffect } from 'react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState(''); // 1. Add sort state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (sort) params.append('sort', sort); // 2. Append sort parameter

      const response = await API.get(`/products?${params.toString()}`);
      setProducts(response.data.products);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Something went wrong while loading products.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Re-fetch when search, category, OR sort changes
  useEffect(() => {
    fetchProducts();
  }, [search, category, sort]);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Discover Products</h1>

      {/* Search, Category, and Sort Controls */}
      <SearchBar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        sort={sort}
        setSort={setSort}
      />

      {loading && <div style={styles.messageState}>Loading products...</div>}

      {!loading && error && <div style={styles.errorState}>{error}</div>}

      {!loading && !error && products.length === 0 && (
        <div style={styles.messageState}>No products found.</div>
      )}

      {!loading && !error && products.length > 0 && (
        <div style={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '1.5rem',
  },
  messageState: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.1rem',
    color: '#64748b',
  },
  errorState: {
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    borderRadius: '8px',
    border: '1px solid #fecaca',
  },
};

export default Products;