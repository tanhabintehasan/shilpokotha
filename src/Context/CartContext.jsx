import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

  const totalAmount = useMemo(() => {
    const items = Array.isArray(cartItems) ? cartItems : [];
    return items.reduce((acc, item) => acc + (Number(item.price || 0) * Number(item.qty || 0)), 0);
  }, [cartItems]);

  const getUserAuth = useCallback(() => {
    const rawData = localStorage.getItem("userInfo");
    if (!rawData || rawData === "undefined" || rawData === "null") return { userId: null, config: { headers: {} } };
    try {
      const userInfo = JSON.parse(rawData);
      return {
        userId: userInfo?._id,
        config: { headers: userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {} },
      };
    } catch (e) { return { userId: null, config: { headers: {} } }; }
  }, []);

  const fetchCart = useCallback(async () => {
    const { userId, config } = getUserAuth();
    if (userId && config.headers.Authorization) {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/cart/${userId}`, config);
        setCartItems(Array.isArray(data) ? data : (data?.items || []));
      } catch (err) { setCartItems([]); }
    }
  }, [getUserAuth, BACKEND_URL]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (product, quantity, size) => {
    if (!product) return;
    const { userId, config } = getUserAuth();
    const itemData = {
      productId: product._id,
      name: product.name,
      price: product.price,
      qty: quantity,
      size: size || "M",
      img: product.images?.[0] || product.image || product.imageURL
    };

    setCartItems((prev) => {
      const current = Array.isArray(prev) ? prev : [];
      const idx = current.findIndex(i => (i.productId?._id || i.productId) === product._id && i.size === size);
      if (idx > -1) {
        const updated = [...current];
        updated[idx].qty += quantity;
        return updated;
      }
      return [...current, itemData];
    });

    setIsCartOpen(true);
    if (userId && config.headers.Authorization) {
      try { await axios.post(`${BACKEND_URL}/api/cart/add`, { userId, item: itemData }, config); } 
      catch (err) { console.error("Sync fail", err); }
    }
  };

  const updateQty = async (productId, size, delta) => {
    setCartItems(prev => (Array.isArray(prev) ? prev : []).map(item => {
      const itemId = item.productId?._id || item.productId;
      if (itemId === productId && item.size === size) {
        return { ...item, qty: Math.max(1, item.qty + delta) };
      }
      return item;
    }));
    const { userId, config } = getUserAuth();
    if (userId && config.headers.Authorization) {
      try { await axios.put(`${BACKEND_URL}/api/cart/update-qty`, { userId, productId, size, delta }, config); } catch (e) {}
    }
  };

  const removeItem = async (productId, size) => {
    setCartItems(prev => (Array.isArray(prev) ? prev : []).filter(item => {
      const itemId = item.productId?._id || item.productId;
      return !(itemId === productId && item.size === size);
    }));
    const { userId, config } = getUserAuth();
    if (userId && config.headers.Authorization) {
      try { await axios.delete(`${BACKEND_URL}/api/cart/remove?userId=${userId}&productId=${productId}&size=${size}`, config); } catch (e) {}
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, totalAmount, addToCart, updateQty, removeItem, isCartOpen, setIsCartOpen, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => useContext(CartContext);