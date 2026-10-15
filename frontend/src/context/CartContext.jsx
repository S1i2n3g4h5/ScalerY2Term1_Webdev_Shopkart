import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fetch initial cart state from MongoDB on app mount
  const fetchCart = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await API.get('/cart');
      setCartItems(response.data.cart || []);
    } catch (err) {
      console.error('Error loading cart:', err);
      // Suppress 401 error logging on initial load if user is not yet logged in
      if (err.response && err.response.status !== 401) {
        setError('Failed to load shopping cart.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 2. Add to Cart
  const addToCart = async (productId) => {
    try {
      const response = await API.post(`/cart/${productId}`);
      setCartItems(response.data.cart);
      return { success: true, message: response.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add item to cart.';
      return { success: false, message: msg };
    }
  };

  // 3. Update Quantity
  const updateQuantity = async (productId, newQuantity) => {
    try {
      const response = await API.patch(`/cart/${productId}`, { quantity: newQuantity });
      setCartItems(response.data.cart);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update quantity.';
      alert(msg);
      return { success: false, message: msg };
    }
  };

  // 4. Remove Item from Cart
  const removeFromCart = async (productId) => {
    try {
      const response = await API.delete(`/cart/${productId}`);
      setCartItems(response.data.cart);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove item.';
      alert(msg);
      return { success: false, message: msg };
    }
  };

  // 5. Derived State Calculations (Zero DB or State duplication)
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cartItems.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0
  );


    const clearCartState = () => {
    setCartItems([]);
    };

    // Return clearCartState in context value:
    return (
    <CartContext.Provider
        value={{
            cartItems,
            cartCount,
            subtotal,
            loading,
            error,
            fetchCart,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCartState,
    }}
    >
    {children}
    </CartContext.Provider>
    );

};

// Custom hook for consuming CartContext cleanly
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};