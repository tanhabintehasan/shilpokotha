import React from "react";
import { Drawer, IconButton, Button } from "@mui/material";
import { MdClose, MdDeleteOutline, MdOutlineShoppingCart } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useShop } from "../../../Context/ShopContext"; 
import { getImageUrl } from "../../../utils/imageHelper"; // Updated to use helper

const WishBar = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, addToCart, isWishOpen, setIsWishOpen } = useShop();

  const handleClose = () => setIsWishOpen(false);

  return (
    <Drawer anchor="right" open={isWishOpen} onClose={handleClose}>
      <div className="w-[350px] sm:w-[400px] h-full flex flex-col bg-white">
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-lg font-bold">My Wishlist ({wishlistItems?.length || 0})</h2>
          <IconButton onClick={handleClose}><MdClose /></IconButton>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Defensive Check: Prevents .map crash */}
          {Array.isArray(wishlistItems) && wishlistItems.length > 0 ? (
            wishlistItems.map((item, index) => {
              const pId = item.productId?._id || item.productId || item._id || `wish-${index}`;

              return (
                <div key={pId} className="flex gap-4 py-4 border-b hover:bg-gray-50 transition-colors">
                  <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0 border">
                    <img 
                      src={getImageUrl(item)} 
                      className="w-full h-full object-cover" 
                      alt="product" 
                      onError={(e) => { e.target.src = "https://placehold.co/150x200?text=Error"; }} 
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold truncate pr-2 text-gray-800">
                      {item.name || item.productId?.name || "Product"}
                    </h4>
                    <p className="font-bold text-sm text-[#691414] mt-1">
                      ৳{(item.price || item.productId?.price || 0).toLocaleString()}
                    </p>
                    <Button 
                      size="small" variant="outlined" 
                      startIcon={<MdOutlineShoppingCart />}
                      onClick={() => { 
                        addToCart(item.productId || item, 1, "M"); 
                        removeFromWishlist(pId); 
                      }}
                      sx={{ mt: 1.5, fontSize: '10px', color: '#691414', borderColor: '#691414', fontWeight: 'bold' }}
                    >MOVE TO CART</Button>
                  </div>
                  <IconButton onClick={() => removeFromWishlist(pId)} className="self-start">
                    <MdDeleteOutline color="#691414" size={20} />
                  </IconButton>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <p>Your wishlist is empty</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50">
          <Button 
            fullWidth variant="contained" 
            onClick={() => { handleClose(); navigate("/wishlist"); }} 
            sx={{ backgroundColor: "#691414", py: 1.5, fontWeight: 'bold', "&:hover": { backgroundColor: "#4a0e0e" } }}
          >
            VIEW FULL WISHLIST
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default WishBar;