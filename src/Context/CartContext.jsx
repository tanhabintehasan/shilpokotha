import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

  // Crash-proof Total Calculation
  const totalAmount = useMemo(() => {
    const items = Array.isArray(cartItems) ? cartItems : [];
    return items.reduce((acc, item) => {
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
      return {
        userId: userInfo?._id,
        config: { headers: token ? { Authorization: `Bearer ${token}` } : {} },
      };
    } catch (e) {
      return { userId: null, config: { headers: {} } };
    }
  }, []);

  const fetchCart = useCallback(async () => {
    const { userId, config } = getUserAuth();
    if (userId && config.headers?.Authorization) {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/cart/${userId}`, config);
        // Ensure we extract the array regardless of response structure
        const items = Array.isArray(data) ? data : (data?.items || []);
        setCartItems(items);
      } catch (err) {
        console.error("Cart fetch error:", err.message);
        setCartItems([]);
      }
    }
  }, [getUserAuth, BACKEND_URL]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const clearCart = async () => {
    const { userId, config } = getUserAuth();
    setCartItems([]);
    if (userId && config.headers?.Authorization) {
      try {
        await axios.delete(`${BACKEND_URL}/api/cart/clear/${userId}`, config);
      } catch (err) {
        console.error("Clear Cart Sync Error:", err.message);
      }
    }
  };

  const addToCart = async (product, quantity, size) => {
    if (!product) return;
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
      const currentItems = Array.isArray(prev) ? prev : [];
      const existingIndex = currentItems.findIndex(item => {
        const itemId = item.productId?._id || item.productId;
        return itemId === product._id && item.size === size;
      });

      if (existingIndex > -1) {
        const newCart = [...currentItems];
        newCart[existingIndex] = { 
          ...newCart[existingIndex], 
          qty: newCart[existingIndex].qty + quantity 
        };
        return newCart;
      }
      return [...currentItems, itemData];
    });

    setIsCartOpen(true);

    if (userId && config.headers?.Authorization) {
      try {
        await axios.post(`${BACKEND_URL}/api/cart/add`, { userId, item: itemData }, config);
      } catch (err) {
        console.error("Sync Error:", err.message);
      }
    }
  };

  const updateQty = async (productId, size, delta) => {
    setCartItems(prev => {
      const currentItems = Array.isArray(prev) ? prev : [];
      return currentItems.map(item => {
        const itemId = item.productId?._id || item.productId;
        if (itemId === productId && item.size === size) {
          return { ...item, qty: Math.max(1, item.qty + delta) };
        }
        return item;
      });
    });

    const { userId, config } = getUserAuth();
    if (userId && config.headers?.Authorization) {
      try {
        await axios.put(`${BACKEND_URL}/api/cart/update-qty`, { userId, productId, size, delta }, config);
      } catch (err) {
        console.error("Update Qty Error:", err.message);
      }
    }
  };

  const removeItem = async (productId, size) => {
    setCartItems(prev => {
      const currentItems = Array.isArray(prev) ? prev : [];
      return currentItems.filter(item => {
        const itemId = item.productId?._id || item.productId;
        return !(itemId === productId && item.size === size);
      });
    });

    const { userId, config } = getUserAuth();
    if (userId && config.headers?.Authorization) {
      try {
        await axios.delete(`${BACKEND_URL}/api/cart/remove?userId=${userId}&productId=${productId}&size=${size}`, config);
      } catch (err) {
        console.error("Remove Item Error:", err.message);
      }
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems: Array.isArray(cartItems) ? cartItems : [], 
      totalAmount, clearCart, addToCart, updateQty, removeItem, isCartOpen, setIsCartOpen, fetchCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);