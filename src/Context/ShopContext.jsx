import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]); 
  const [isWishOpen, setIsWishOpen] = useState(false);
  const BACKEND_URL = "";

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

  const fetchWishlist = useCallback(async () => {
    const { userId, config } = getUserAuth();
    if (userId && config.headers.Authorization) {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/wishlist/${userId}`, config);
        const items = Array.isArray(data) ? data : (data?.items || []);
        setWishlistItems(items);
      } catch (err) { 
        console.error("Wishlist Error:", err.message);
        setWishlistItems([]); 
      }
    }
  }, [getUserAuth]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const addToWishlist = async (product) => {
    const { userId, config } = getUserAuth();
    if (!userId) return alert("Please login first");
    
    setWishlistItems(prev => {
      const exists = prev.some(w => (w.productId?._id || w.productId || w._id) === product._id);
      return exists ? prev : [...prev, { ...product, productId: product._id }];
    });

    if (config.headers.Authorization) {
      try { 
        await axios.post(`${BACKEND_URL}/api/wishlist/add`, { userId, productId: product._id }, config); 
        fetchWishlist(); 
      } catch (err) { console.error(err.message); }
    }
  };

  const removeFromWishlist = async (id) => {
    setWishlistItems(prev => prev.filter(i => (i.productId?._id || i.productId || i._id) !== id));
    const { userId, config } = getUserAuth();
    if (userId && config.headers.Authorization) {
      try { await axios.delete(`${BACKEND_URL}/api/wishlist/remove?userId=${userId}&productId=${id}`, config); }
      catch (err) { console.error(err.message); }
    }
  };

  return (
    <ShopContext.Provider value={{ 
      wishlistItems, addToWishlist, removeFromWishlist, isWishOpen, setIsWishOpen, getUserAuth 
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);