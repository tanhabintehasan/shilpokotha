import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosInstance from '../utils/axiosInstance';

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]); 
  const [isWishOpen, setIsWishOpen] = useState(false);
  
  // ব্যাকএন্ড ইউআরএল (ইমেজ বা অন্যান্য হার্ডকোডেড পাথের জন্য)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://shilpokotha-backend.vercel.app";

  const ensureArray = (data) => (Array.isArray(data) ? data : []);

  // ইউজার ইনফো গেট করা
  const getUserAuth = useCallback(() => {
    const rawData = localStorage.getItem("userInfo");
    if (!rawData || rawData === "undefined" || rawData === "null") 
      return { userId: null, config: { headers: {} } };
    try {
      const userInfo = JSON.parse(rawData);
      return {
        userId: userInfo?._id,
        config: { headers: userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {} },
      };
    } catch (e) { 
      return { userId: null, config: { headers: {} } }; 
    }
  }, []);

  // উইশলিস্ট ডাটা ফেচ করা
  const fetchWishlist = useCallback(async () => {
    const { userId, config } = getUserAuth();
    if (userId && config.headers?.Authorization) {
      try {
        // FIX: axiosInstance ব্যবহার করলে রিলেটিভ পাথ দিতে হয়
        const { data } = await axiosInstance.get(`/api/wishlist/${userId}`, config);
        const items = Array.isArray(data) ? data : (data?.items || []);
        setWishlistItems(ensureArray(items));
      } catch (err) { 
        console.error("Wishlist Fetch Error:", err.message);
        setWishlistItems([]); 
      }
    }
  }, [getUserAuth]);

  useEffect(() => { 
    fetchWishlist(); 
  }, [fetchWishlist]);

  // উইশলিস্টে আইটেম যোগ করা
  const addToWishlist = async (product) => {
    if (!product || !product._id) return;
    
    const { userId, config } = getUserAuth();
    if (!userId) return alert("Please login first to add to wishlist");
    
    // লোকাল স্টেট আপডেট
    setWishlistItems(prev => {
      const currentItems = ensureArray(prev);
      const exists = currentItems.some(w => {
        const wishId = w.productId?._id || w.productId || w._id;
        return wishId === product._id;
      });

      if (exists) return currentItems;
      return [...currentItems, { ...product, productId: product._id }];
    });

    // ব্যাকএন্ডে সেভ করা
    if (config.headers?.Authorization) {
      try { 
        await axiosInstance.post('/api/wishlist/add', { userId, productId: product._id }, config); 
      } catch (err) { 
        console.error("Wishlist Sync Fail:", err.message); 
      }
    }
  };

  // উইশলিস্ট থেকে রিমুভ করা
  const removeFromWishlist = async (id) => {
    if (!id) return;

    setWishlistItems(prev => {
      const currentItems = ensureArray(prev);
      return currentItems.filter(i => {
        const wishId = i.productId?._id || i.productId || i._id;
        return wishId !== id;
      });
    });

    const { userId, config } = getUserAuth();
    if (userId && config.headers?.Authorization) {
      try { 
        // FIX: axios এর বদলে axiosInstance ব্যবহার করা হয়েছে
        await axiosInstance.delete(`/api/wishlist/remove?userId=${userId}&productId=${id}`, config); 
      } catch (err) { 
        console.error("Wishlist Remove Fail:", err.message); 
      }
    }
  };

  return (
    <ShopContext.Provider value={{ 
      wishlistItems: ensureArray(wishlistItems), 
      addToWishlist, 
      removeFromWishlist, 
      isWishOpen, 
      setIsWishOpen, 
      getUserAuth,
      fetchWishlist 
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};