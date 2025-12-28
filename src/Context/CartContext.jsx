import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const BACKEND_URL = "http://localhost:5000";

  // --- NEW: TOTAL AMOUNT CALCULATION ---
  // This calculates the total price of all items in the cart
  const totalAmount = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 0;
      return acc + (price * qty);
    }, 0);
  }, [cartItems]);

  const getUserAuth = useCallback(() => {
    const rawData = localStorage.getItem("userInfo");
    if (!rawData || rawData === "undefined" || rawData === "null") {
      return { userId: null, config: { headers: {} } };
    }

    try {
      const userInfo = JSON.parse(rawData);
      const token = userInfo?.token;
      if (token && token.split('.').length === 3) {
        return {
          userId: userInfo?._id,
          config: { headers: { Authorization: `Bearer ${token}` } },
        };
      }
      return { userId: userInfo?._id, config: { headers: {} } };
    } catch (e) {
      return { userId: null, config: { headers: {} } };
    }
  }, []);

  const fetchCart = useCallback(async () => {
    const { userId, config } = getUserAuth();
    if (userId && config.headers.Authorization) {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/cart/${userId}`, config);
        setCartItems(data.items || []);
      } catch (err) {
        console.error("Cart fetch error:", err.message);
      }
    }
  }, [getUserAuth]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // --- NEW: CLEAR CART FUNCTION ---
  // Used after a successful checkout to empty the cart
  const clearCart = async () => {
    const { userId, config } = getUserAuth();
    
    // Clear Local State
    setCartItems([]);
    
    // Clear Database (if logged in)
    if (userId && config.headers.Authorization) {
      try {
        // This assumes you have a 'clear' endpoint on your backend
        await axios.delete(`${BACKEND_URL}/api/cart/clear/${userId}`, config);
      } catch (err) {
        console.error("Clear Cart Sync Error:", err.message);
      }
    }
  };

  const addToCart = async (product, quantity, size) => {
    const { userId, config } = getUserAuth();
    const itemData = {
      productId: product._id,
      name: product.name,
      price: product.price,
      qty: quantity,
      size: size,
      img: product.images?.[0] || product.image || product.imageURL
    };

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(item => {
        const itemId = item.productId?._id || item.productId;
        return itemId === product._id && item.size === size;
      });
      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex].qty += quantity;
        return newCart;
      }
      return [...prev, itemData];
    });

    setIsCartOpen(true);
    if (userId && config.headers.Authorization) {
      try {
        await axios.post(`${BACKEND_URL}/api/cart/add`, { userId, item: itemData }, config);
        fetchCart(); 
      } catch (err) {
        console.error("Sync Error:", err.message);
      }
    }
  };

  const updateQty = async (productId, size, delta) => {
    const { userId, config } = getUserAuth();
    setCartItems(prev => prev.map(item => {
      const itemId = item.productId?._id || item.productId;
      if (itemId === productId && item.size === size) {
        return { ...item, qty: Math.max(1, item.qty + delta) };
      }
      return item;
    }));

    if (userId && config.headers.Authorization) {
      try {
        await axios.put(`${BACKEND_URL}/api/cart/update-qty`, { userId, productId, size, delta }, config);
      } catch (err) {
        console.error("Update Qty Error:", err.message);
      }
    }
  };

  const removeItem = async (productId, size) => {
    const { userId, config } = getUserAuth();
    setCartItems(prev => prev.filter(item => {
      const itemId = item.productId?._id || item.productId;
      return !(itemId === productId && item.size === size);
    }));

    if (userId && config.headers.Authorization) {
      try {
        await axios.delete(`${BACKEND_URL}/api/cart/remove?userId=${userId}&productId=${productId}&size=${size}`, config);
      } catch (err) {
        console.error("Remove Item Error:", err.message);
      }
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      totalAmount, // Provided to Checkout
      clearCart,   // Provided to Checkout
      addToCart, 
      updateQty, 
      removeItem, 
      isCartOpen, 
      setIsCartOpen, 
      fetchCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);