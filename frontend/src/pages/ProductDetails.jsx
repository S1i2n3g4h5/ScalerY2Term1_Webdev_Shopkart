import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import API from '../services/api';

const ProductDetails = () => {
    const {id} = useParams();   // used to extract product id form the url parameter;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const[ error, setError] = useState('');


    useEffect(()=>{
        const fetchProduct = async ()=>{
            try{
                setLoading(true);

                const response = await API.get(`/products/${id}`);
                setProduct(response.data.product);

            }catch(err){
                console.error('Error loading product details : ', err);
                setError('Failed to load product details or product doesnt exist');
            }
            finally{
                setLoading(false);
            }
        };

        fetchProduct();
    
    }, [id]);


    // Loading state
    if(loading){
        return <div style={StyleSheet.centerState}>Loading product details...</div>;
    }

    // Error
    if(error || !product){
        return (
            <div style={styles.centerState}>
                <p style={styles.errorText}>{error || 'Product not found.'}</p>
                <Link to="/products" style={styles.backLink}>
                ← Back to Products
                </Link>
            </div>
        )
    }

    return (
    <div style={styles.container}>
      <Link to="/products" style={styles.backLink}>
        ← Back to Products
      </Link>

      <div style={styles.card}>
        <img src={product.image} alt={product.name} style={styles.image} />

        <div style={styles.info}>
          <span style={styles.category}>{product.category}</span>
          <h1 style={styles.title}>{product.name}</h1>
          <p style={styles.price}>₹{product.price.toLocaleString('en-IN')}</p>

          <p style={styles.description}>{product.description}</p>

          <div style={styles.stockStatus}>
            Status:{' '}
            <strong style={{ color: product.stock > 0 ? '#16a34a' : '#dc2626' }}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </strong>
          </div>

          <button
            style={product.stock > 0 ? styles.button : styles.buttonDisabled}
            disabled={product.stock === 0}
            onClick={() => alert('Add to Cart clicked! (Cart backend coming in Lab-04)')}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );

}


const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '1rem',
  },
  centerState: {
    textAlign: 'center',
    padding: '4rem 1rem',
    fontSize: '1.1rem',
    color: '#64748b',
  },
  errorText: {
    color: '#dc2626',
    marginBottom: '1rem',
  },
  backLink: {
    display: 'inline-block',
    marginBottom: '1.5rem',
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '2rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  image: {
    width: '100%',
    maxHeight: '350px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  category: {
    fontSize: '0.85rem',
    fontWeight: 'bold',
    color: '#2563eb',
    textTransform: 'uppercase',
  },
  title: {
    margin: '0.5rem 0',
    fontSize: '1.75rem',
    color: '#0f172a',
  },
  price: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#0f172a',
    margin: '0 0 1rem 0',
  },
  description: {
    color: '#475569',
    lineHeight: '1.6',
    marginBottom: '1.5rem',
  },
  stockStatus: {
    marginBottom: '1.5rem',
    fontSize: '0.95rem',
    color: '#334155',
  },
  button: {
    padding: '0.85rem',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  buttonDisabled: {
    padding: '0.85rem',
    backgroundColor: '#cbd5e1',
    color: '#64748b',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'not-allowed',
  },
};


export default ProductDetails;