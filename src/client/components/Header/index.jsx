import React, { useState } from "react";
import { Link } from "react-router-dom";
import Search from "../Search";
import Navigation from "./Navigation";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { MdOutlineShoppingCart } from "react-icons/md";
import { colors } from "@mui/material";
import { IoIosGitCompare } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import CartBar from "../CartBar";
import WishBar from "../Wishbar";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    backgroundColor: "#EADDCA", // আপনার ওয়েবসাইটের theme color
    color: "#000000ff", // badge content color (number)
  },
}));

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [isWishOpen, setIsWishOpen] = useState(false);
  return (
    <>
      <header className="bg-white">
        <div className="top-strip bg-[#F0EDE5] py-2 border-t-[1px] border-[#B89B7A] border-b-[1px] border-[#B89B7A]">
          <div className="container">
            <div className="flex items-center justify-between">
              <div className="w-[50%]">
                <p className="text-[14px] font-[400]">
                  Get Up to 50% off new season styles, limited time only
                </p>
              </div>

              <div className="flex items-center justify-end">
                <ul className="flex item-center gap-3">
                  <li className="list-none">
                    <Link
                      to="/help-center"
                      className="text-[14px] link font-[400] transition"
                    >
                      Oder Tracking
                    </Link>
                  </li>

                  <li className="list-none">
                    <Link
                      to="/help-center"
                      className="text-[14px] link font-[400] transition"
                    >
                      Help Center
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="header h-[120px] border-b-[1px] border-[#B89B7A]">
          <div className="container flex items-center justify-between">
            <div
              className="col1 w-[22%] overflow-hidden pr-[110px] "
              style={{ height: "150px" }}
            >
              <Link to="/">
                <img
                  src="/logo.png"
                  className="h-[115px]  w-auto !object-cover object-center"
                  alt="Shilpokotha Logo"
                />
              </Link>
            </div>

            <div className="col2 w-[45%] pb-[20px]">
              <Search />
            </div>

            <div className="col3 w-[33%] flex items-center">
              <ul className="flex items-center justify-end gap-4 pb-[45px] pl-[20px]  w-full ">
                <li className="list-none ">
                  <Button
                    component={Link}
                    to="/login" // Use 'to' instead of 'onClick' with the Link component
                    className="!text-black text-[14px] px-[10px] py-[5px] rounded-[5px] !bg-[#EADDCA] transition-colors duration-150 !normal-case"
                  >
                    Sign In
                  </Button>
                </li>

                <li>
                  <Tooltip title="Add to Cart" placement="top">
                    {/* Added onClick to open the CartBar */}
                    <IconButton
                      aria-label="cart"
                      onClick={() => setIsCartOpen(true)}
                    >
                      <StyledBadge badgeContent={4} color="secondary">
                        <MdOutlineShoppingCart size={22} color="black" />
                      </StyledBadge>
                    </IconButton>
                  </Tooltip>
                </li>

                {/* The Hidden Sidebar Component */}
                <CartBar
                  isOpen={isCartOpen}
                  closeCart={() => setIsCartOpen(false)}
                />

                <li>
                  <Tooltip title="Wishlist" placement="top">
                    {/* Add onClick to open the WishBar */}
                    <IconButton
                      aria-label="Favourite"
                      onClick={() => setIsWishOpen(true)}
                    >
                      <StyledBadge badgeContent={1} color="secondary">
                        <FaHeart size={22} color="red" />
                      </StyledBadge>
                    </IconButton>
                  </Tooltip>
                </li>

                {/* Include the WishBar component */}
                <WishBar
                  isOpen={isWishOpen}
                  closeWish={() => setIsWishOpen(false)}
                />

                <li>
                  <Tooltip title="Compare" placement="top">
                    <IconButton aria-label="Compare">
                      <StyledBadge color="secondary">
                        <IoIosGitCompare size={22} color="black" />
                      </StyledBadge>
                    </IconButton>
                  </Tooltip>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Navigation />
      </header>
    </>
  );
};

export default Header;
