import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

  // Helper to ensure we always work with an array
  const ensureArray = (data) => (Array.isArray(data) ? data : []);

  const totalAmount = useMemo(() => {
    const items = ensureArray(cartItems);
    return items.reduce((acc, item) => {
      const price = Number(item?.price || 0);
      const qty = Number(item?.qty || 0);
      return acc + (price * qty);
    }, 0);
  }, [cartItems]);

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

  const fetchCart = useCallback(async () => {
    const { userId, config } = getUserAuth();
    if (userId && config.headers.Authorization) {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/cart/${userId}`, config);
        // Safety: API might return { items: [] } or just []
        const fetchedItems = Array.isArray(data) ? data : (data?.items || []);
        setCartItems(ensureArray(fetchedItems));
      } catch (err) { 
        setCartItems([]); 
      }
    }
  }, [getUserAuth, BACKEND_URL]);

  useEffect(() => { 
    fetchCart(); 
  }, [fetchCart]);

  const addToCart = async (product, quantity, size) => {
    if (!product || !product._id) return;
    
    const { userId, config } = getUserAuth();
    const itemSize = size || "M";

    // Item structure for local state
    const itemData = {
      productId: product._id, // Store as string for easy local comparison
      name: product.name,
      price: product.price,
      qty: Number(quantity),
      size: itemSize,
      img: product.images?.[0] || product.image || product.imageURL
    };

    setCartItems((prev) => {
      const current = ensureArray(prev);
      
      // Safety: Use optional chaining to avoid "cannot read _id of undefined"
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

    if (userId && config.headers.Authorization) {
      try { 
        // Sync with backend
        await axios.post(`${BACKEND_URL}/api/cart/add`, { 
          userId, 
          item: itemData 
        }, config); 
      } catch (err) { 
        console.error("Cart sync failed", err); 
      }
    }
  };

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
        await axios.put(`${BACKEND_URL}/api/cart/update-qty`, { userId, productId, size, delta }, config); 
      } catch (e) {}
    }
  };

  const removeItem = async (productId, size) => {
    setCartItems(prev => ensureArray(prev).filter(item => {
      const itemId = item.productId?._id || item.productId;
      return !(itemId === productId && item.size === size);
    }));

    const { userId, config } = getUserAuth();
    if (userId && config.headers.Authorization) {
      try { 
        await axios.delete(`${BACKEND_URL}/api/cart/remove?userId=${userId}&productId=${productId}&size=${size}`, config); 
      } catch (e) {}
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