import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Search from "../Search";
import Navigation from "./Navigation";
import { Button, Badge, IconButton, Tooltip, styled } from "@mui/material";
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
  },
}));

const Header = () => {
  const navigate = useNavigate();
  
  // From ShopContext (Wishlist & Auth)
  const { wishlistItems, setIsWishOpen } = useShop();
  
  // From CartContext (Cart)
  const { cartItems, setIsCartOpen } = useCart();

  // Mock user check (Replace with your actual auth state if stored in a Context)
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
    window.location.reload(); // Hard refresh to clear states
  };

  return (
    <header className="bg-white sticky top-0 z-[1000] shadow-sm">
      <div className="top-strip bg-[#F0EDE5] py-2 border-y border-[#B89B7A]">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <p className="text-[12px] md:text-[14px]">Get Up to 50% off new styles</p>
          <ul className="flex gap-3 text-[12px] md:text-[14px]">
            <li><Link to="/order-tracking">Order Tracking</Link></li>
            <li className="border-l border-gray-400 pl-3"><Link to="/help-center">Help Center</Link></li>
          </ul>
        </div>
      </div>

      <div className="header h-[100px] md:h-[120px] border-b border-[#B89B7A]">
        <div className="container mx-auto px-4 flex items-center justify-between h-full">
          <div className="w-[20%]">
            <Link to="/"><img src="/logo.png" className="h-[70px] md:h-[90px]" alt="Logo" /></Link>
          </div>

          <div className="w-[45%] hidden md:block"><Search /></div>

          <div className="w-[35%] flex justify-end items-center gap-3">
            {userInfo ? (
              <Button onClick={handleLogout} className="!bg-[#691414] !text-white !normal-case">Logout</Button>
            ) : (
              <Button component={Link} to="/login" className="!bg-[#EADDCA] !text-black !normal-case">Sign In</Button>
            )}

            <IconButton onClick={() => setIsWishOpen(true)}>
              <StyledBadge badgeContent={wishlistItems?.length || 0}>
                <FaHeart size={20} className={wishlistItems?.length > 0 ? "text-red-600" : "text-black"} />
              </StyledBadge>
            </IconButton>

            <IconButton onClick={() => setIsCartOpen(true)}>
              <StyledBadge badgeContent={cartItems?.length || 0}>
                <MdOutlineShoppingCart size={24} color="black" />
              </StyledBadge>
            </IconButton>

            <IconButton component={Link} to="/myaccount">
              <FaRegUser size={18} color="black" />
            </IconButton>
          </div>
        </div>
      </div>

      <CartBar />
      <WishBar />
      <Navigation />
    </header>
  );
};

export default Header;