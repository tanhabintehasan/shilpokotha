import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]); 
  const [isWishOpen, setIsWishOpen] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

  // Helper to ensure we never run array methods on non-arrays
  const ensureArray = (data) => (Array.isArray(data) ? data : []);

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

  const fetchWishlist = useCallback(async () => {
    const { userId, config } = getUserAuth();
    if (userId && config.headers?.Authorization) {
      try {
        const { data } = await axiosInstance.get(`${BACKEND_URL}/api/wishlist/${userId}`, config);
        // Robust extraction: API might return { items: [] } or just []
        const items = Array.isArray(data) ? data : (data?.items || []);
        setWishlistItems(ensureArray(items));
      } catch (err) { 
        console.error("Wishlist Fetch Error:", err.message);
        setWishlistItems([]); 
      }
    }
  }, [getUserAuth, BACKEND_URL]);

  useEffect(() => { 
    fetchWishlist(); 
  }, [fetchWishlist]);

  const addToWishlist = async (product) => {
    if (!product || !product._id) return;
    
    const { userId, config } = getUserAuth();
    if (!userId) return alert("Please login first");
    
    setWishlistItems(prev => {
      const currentItems = ensureArray(prev);
      
      // Safety: Normalize the ID comparison to handle both populated objects and strings
      const exists = currentItems.some(w => {
        const wishId = w.productId?._id || w.productId || w._id;
        return wishId === product._id;
      });

      if (exists) return currentItems;

      // Add with a normalized structure
      return [...currentItems, { ...product, productId: product._id }];
    });

    if (config.headers?.Authorization) {
      try { 
        await axiosInstance.post(`${BACKEND_URL}/api/wishlist/add`, { userId, productId: product._id }, config); 
      } catch (err) { 
        console.error("Wishlist Sync Fail:", err.message); 
      }
    }
  };

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
        await axios.delete(`${BACKEND_URL}/api/wishlist/remove?userId=${userId}&productId=${id}`, config); 
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
      fetchWishlist // Added to context in case you need to refresh manually
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