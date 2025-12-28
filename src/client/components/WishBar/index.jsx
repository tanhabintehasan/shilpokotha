import React from "react";
import { Drawer, IconButton, Button } from "@mui/material";
import { MdClose, MdDeleteOutline, MdOutlineShoppingCart } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useShop } from "../../../Context/ShopContext"; 
import { getImageUrl } from "../../../utils/imageHelper";

const WishBar = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, addToCart, isWishOpen, setIsWishOpen } = useShop();

  const handleClose = () => setIsWishOpen(false);

  // Helper to ensure wishlistItems is always iterable
  const safeWishlist = Array.isArray(wishlistItems) ? wishlistItems : [];

  return (
    <Drawer anchor="right" open={!!isWishOpen} onClose={handleClose}>
      <div className="w-[350px] sm:w-[400px] h-full flex flex-col bg-white">
        
        {/* HEADER */}
        <div className="p-4 flex items-center justify-between border-b bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">My Wishlist ({safeWishlist.length})</h2>
          <IconButton onClick={handleClose}><MdClose /></IconButton>
        </div>

        {/* WISHLIST ITEMS */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {safeWishlist.length > 0 ? (
            safeWishlist.map((item, index) => {
              // Robust ID extraction to handle both populated and unpopulated MongoDB references
              const pId = item?.productId?._id || item?.productId || item?._id || `wish-${index}`;

              return (
                <div key={pId} className="flex gap-4 py-4 border-b last:border-0 hover:bg-gray-50 transition-colors">
                  
                  {/* Image Container */}
                  <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
                    <img 
                      src={getImageUrl(item)} 
                      className="w-full h-full object-cover" 
                      alt={item?.name || "Wishlist Item"} 
                      onError={(e) => { 
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/150x200?text=No+Image"; 
                      }} 
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h4 className="text-sm font-bold truncate pr-2 text-gray-800">
                        {item?.name || item?.productId?.name || "Unnamed Product"}
                      </h4>
                      <p className="font-bold text-sm text-[#691414] mt-1">
                        ৳{(Number(item?.price || item?.productId?.price) || 0).toLocaleString()}
                      </p>
                    </div>

                    <Button 
                      size="small" 
                      variant="outlined" 
                      startIcon={<MdOutlineShoppingCart />}
                      onClick={() => { 
                        // Pass the full product object, default qty 1, and default size M
                        const productData = item?.productId || item;
                        addToCart(productData, 1, "M"); 
                        removeFromWishlist(pId); 
                      }}
                      sx={{ 
                        mt: 1, 
                        fontSize: '10px', 
                        color: '#691414', 
                        borderColor: '#691414', 
                        fontWeight: '900',
                        borderRadius: '8px',
                        "&:hover": { borderColor: "#4a0e0e", backgroundColor: "rgba(105, 20, 20, 0.04)" }
                      }}
                    >
                      MOVE TO CART
                    </Button>
                  </div>

                  {/* Remove Button */}
                  <IconButton 
                    onClick={() => removeFromWishlist(pId)} 
                    className="self-start !p-1.5 hover:!bg-red-50"
                  >
                    <MdDeleteOutline className="text-gray-400 hover:text-red-600 transition-colors" size={20} />
                  </IconButton>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                <MdOutlineShoppingCart size={32} className="opacity-20" />
              </div>
              <p className="text-sm font-medium">Your wishlist is empty</p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t bg-gray-50">
          <Button 
            fullWidth 
            variant="contained" 
            onClick={() => { handleClose(); navigate("/wishlist"); }} 
            sx={{ 
              backgroundColor: "#691414", 
              py: 1.8, 
              fontWeight: '900', 
              borderRadius: '12px',
              boxShadow: "0 4px 12px rgba(105, 20, 20, 0.2)",
              "&:hover": { backgroundColor: "#4a0e0e" } 
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