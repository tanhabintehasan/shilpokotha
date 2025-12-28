import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import axiosInstance from '../utils/axiosInstance';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // ব্যাকএন্ড ইউআরএল (ইমেজ পাথের জন্য প্রয়োজন হতে পারে)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://shilpokotha-backend-8o4q410ae-tanhabintehasans-projects.vercel.app";

  const ensureArray = (data) => (Array.isArray(data) ? data : []);

  // কার্টের মোট টাকার হিসাব
  const totalAmount = useMemo(() => {
    const items = ensureArray(cartItems);
    return items.reduce((acc, item) => {
      const price = Number(item?.price || 0);
      const qty = Number(item?.qty || 0);
      return acc + (price * qty);
    }, 0);
  }, [cartItems]);

  // ইউজার অথেন্টিকেশন ডাটা গেট করা
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

  // কার্ট ডাটা ফেচ করা
  const fetchCart = useCallback(async () => {
    const { userId, config } = getUserAuth();
    if (userId && config.headers.Authorization) {
      try {
        // FIX: axiosInstance ব্যবহার করলে baseURL দিতে হয় না
        const { data } = await axiosInstance.get(`/api/cart/${userId}`, config);
        const fetchedItems = Array.isArray(data) ? data : (data?.items || []);
        setCartItems(ensureArray(fetchedItems));
      } catch (err) { 
        console.error("Fetch Cart Error:", err);
        setCartItems([]); 
      }
    }
  }, [getUserAuth]);

  useEffect(() => { 
    fetchCart(); 
  }, [fetchCart]);

  // কার্টে আইটেম যোগ করা
  const addToCart = async (product, quantity, size) => {
    if (!product || !product._id) return;
    
    const { userId, config } = getUserAuth();
    const itemSize = size || "M";

    const itemData = {
      productId: product._id,
      name: product.name,
      price: product.price,
      qty: Number(quantity),
      size: itemSize,
      img: product.images?.[0] || product.image || product.imageURL
    };

    // লোকাল স্টেট আপডেট (তাত্ক্ষণিক ফিডব্যাক)
    setCartItems((prev) => {
      const current = ensureArray(prev);
      const idx = current.findIndex(i => {
        const iD = i.productId?._id || i.productId;
        return iD === product._id && i.size === itemSize;
      });

      if (idx > -1) {
        const updated = [...current];
        updated[idx] = { 
          ...updated[idx], 
          qty: Number(updated[idx].qty || 0) + Number(quantity) 
        };
        return updated;
      }
      return [...current, itemData];
    });

    setIsCartOpen(true);

    // ব্যাকএন্ডে সিঙ্ক করা
    if (userId && config.headers.Authorization) {
      try { 
        // FIX: axios.axiosInstance.postpost এরর ফিক্স করা হয়েছে
        await axiosInstance.post('/api/cart/add', { 
          userId, 
          item: itemData 
        }, config); 
      } catch (err) { 
        console.error("Cart sync failed", err); 
      }
    }
  };

  // পরিমাণ পরিবর্তন (Increment/Decrement)
  const updateQty = async (productId, size, delta) => {
    setCartItems(prev => ensureArray(prev).map(item => {
      const itemId = item.productId?._id || item.productId;
      if (itemId === productId && item.size === size) {
        return { ...item, qty: Math.max(1, (Number(item.qty) || 1) + delta) };
      }
      return item;
    }));

    const { userId, config } = getUserAuth();
    if (userId && config.headers.Authorization) {
      try { 
        await axiosInstance.put('/api/cart/update-qty', { userId, productId, size, delta }, config); 
      } catch (e) {
        console.error("Update Qty Failed:", e);
      }
    }
  };

  // আইটেম রিমুভ করা
  const removeItem = async (productId, size) => {
    setCartItems(prev => ensureArray(prev).filter(item => {
      const itemId = item.productId?._id || item.productId;
      return !(itemId === productId && item.size === size);
    }));

    const { userId, config } = getUserAuth();
    if (userId && config.headers.Authorization) {
      try { 
        await axiosInstance.delete(`/api/cart/remove?userId=${userId}&productId=${productId}&size=${size}`, config); 
      } catch (e) {
        console.error("Remove Item Failed:", e);
      }
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems: ensureArray(cartItems), 
      totalAmount, 
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

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};