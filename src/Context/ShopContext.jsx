import React, { createContext, useContext, useState } from "react";

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
    alert("Added to cart!");
  };

  const onAddToWishlist = (product) => {
    console.log("Added to wishlist", product);
  };

  return (
    <ShopContext.Provider value={{ cartItems, addToCart, onAddToWishlist }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};