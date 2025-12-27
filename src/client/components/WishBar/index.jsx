import React from "react";
import { Drawer, IconButton, Button } from "@mui/material";
import { MdClose, MdDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const WishBar = ({ isOpen, closeWish }) => {
  const navigate = useNavigate();

  return (
    <Drawer anchor="right" open={isOpen} onClose={closeWish}>
      <div className="w-[350px] sm:w-[400px] h-full flex flex-col bg-white">
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-lg font-bold text-gray-800">Your Wishlist (1)</h2>
          <IconButton onClick={closeWish}>
            <MdClose />
          </IconButton>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex gap-4 items-center py-4 border-b border-gray-50">
            <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden">
              <img
                src="/Product1.webp"
                className="w-full h-full object-cover"
                alt="product"
              />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-800">
                Men Opaque Casual Shirt
              </h4>
              <p className="font-bold text-[#691414]">৳1,650</p>
            </div>
            <IconButton color="error">
              <MdDeleteOutline />
            </IconButton>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              closeWish();
              navigate("/wishlist");
            }}
            sx={{
              backgroundColor: "#691414",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#891b1b" },
            }}
          >
            VIEW FULL WISHLIST
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default WishBar;
