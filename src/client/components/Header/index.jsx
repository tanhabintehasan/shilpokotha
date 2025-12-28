import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Search from "../Search";
import Navigation from "./Navigation";
import { Button, Badge, IconButton, styled } from "@mui/material";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaHeart, FaRegUser } from "react-icons/fa"; 

import CartBar from "../CartBar";
import WishBar from "../WishBar";

import { useShop } from "../../../Context/ShopContext";
import { useCart } from "../../../Context/CartContext";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    backgroundColor: "#EADDCA", 
    color: "#000",
    fontWeight: "bold",
    fontSize: "10px"
  },
}));

const Header = () => {
  const navigate = useNavigate();
  
  const { wishlistItems, setIsWishOpen } = useShop();
  const { cartItems, setIsCartOpen } = useCart();

  // --- CRASH PREVENTION GATE ---
  // We force these to be arrays so .length never fails
  const safeWishlist = Array.isArray(wishlistItems) ? wishlistItems : [];
  const safeCart = Array.isArray(cartItems) ? cartItems : [];

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
    window.location.reload(); 
  };

  return (
    <header className="bg-white sticky top-0 z-[1000] shadow-sm">
      {/* Top Strip */}
      <div className="top-strip bg-[#F0EDE5] py-2 border-y border-[#B89B7A]">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <p className="text-[11px] md:text-[13px] font-medium text-gray-600">
            Get Up to 50% off new styles
          </p>
          <ul className="flex gap-4 text-[11px] md:text-[13px] font-medium text-gray-600">
            <li><Link to="/order-tracking" className="hover:text-black">Order Tracking</Link></li>
            <li className="border-l border-gray-300 pl-4">
              <Link to="/help-center" className="hover:text-black">Help Center</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Header */}
      <div className="header h-[80px] md:h-[100px] border-b border-[#B89B7A]">
        <div className="container mx-auto px-4 flex items-center justify-between h-full">
          
          {/* Logo */}
          <div className="w-[20%]">
            <Link to="/">
              <img src="/logo.png" className="h-[50px] md:h-[70px] object-contain" alt="Logo" />
            </Link>
          </div>

          {/* Search */}
          <div className="w-[45%] hidden md:block">
            <Search />
          </div>

          {/* Actions */}
          <div className="w-[35%] flex justify-end items-center gap-1 md:gap-3">
            
            {userInfo ? (
              <Button 
                onClick={handleLogout} 
                className="!bg-[#691414] !text-white !text-[12px] !px-4 !py-1.5 !rounded-full !normal-case hover:!bg-black transition-all"
              >
                Logout
              </Button>
            ) : (
              <Button 
                component={Link} 
                to="/login" 
                className="!bg-[#EADDCA] !text-black !text-[12px] !px-4 !py-1.5 !rounded-full !normal-case hover:!bg-[#d8c8b4] transition-all"
              >
                Sign In
              </Button>
            )}

            <div className="flex items-center ml-2 border-l pl-2 border-gray-200">
              {/* Wishlist Icon */}
              <IconButton onClick={() => setIsWishOpen(true)} className="hover:bg-gray-50">
                <StyledBadge badgeContent={safeWishlist.length}>
                  <FaHeart 
                    size={20} 
                    className={safeWishlist.length > 0 ? "text-red-600" : "text-gray-700"} 
                  />
                </StyledBadge>
              </IconButton>

              {/* Cart Icon */}
              <IconButton onClick={() => setIsCartOpen(true)} className="hover:bg-gray-50">
                <StyledBadge badgeContent={safeCart.length}>
                  <MdOutlineShoppingCart size={24} className="text-gray-700" />
                </StyledBadge>
              </IconButton>

              {/* User Account */}
              <IconButton component={Link} to="/myaccount" className="hover:bg-gray-50">
                <FaRegUser size={18} className="text-gray-700" />
              </IconButton>
            </div>
          </div>
        </div>
      </div>

      {/* Global Drawers */}
      <CartBar />
      <WishBar />
      <Navigation />
    </header>
  );
};

export default Header;