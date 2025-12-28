import React from "react";
import { Drawer, IconButton, Button } from "@mui/material";
import { MdClose, MdDeleteOutline, MdAdd, MdRemove } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../Context/CartContext"; // FIXED: Using CartContext instead of ShopContext

const CartBar = () => {
  const navigate = useNavigate();
  
  // FIXED: Destructuring from useCart hook
  const { cartItems, removeItem, updateQty, isCartOpen, setIsCartOpen } = useCart();

  const handleClose = () => setIsCartOpen(false);
  
  // Calculate total price safely
  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.qty || 1), 0);

  /**
   * REFINED IMAGE LOGIC
   * Handles relative paths, full URLs, and missing images
   */
  const getDisplayImage = (item) => {
    const BACKEND_URL = "";
    
    // Check for nested productId image (DB population) or flat img field (local state)
    const rawPath = item.img || item.image || item.productId?.images?.[0] || item.productId?.image;

    if (!rawPath || rawPath === "undefined" || rawPath === "null") {
      return "https://placehold.co/150x200?text=No+Image";
    }
    
    if (rawPath.startsWith('http')) return rawPath;

    // Ensure path starts with / and doesn't double-up on 'uploads'
    const cleanPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
    return cleanPath.includes('/uploads') 
      ? `${BACKEND_URL}${cleanPath}` 
      : `${BACKEND_URL}/uploads${cleanPath}`;
  };

  return (
    <Drawer anchor="right" open={isCartOpen} onClose={handleClose}>
      <div className="w-[350px] sm:w-[400px] h-full flex flex-col bg-white">
        
        {/* HEADER */}
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-lg font-bold">Shopping Cart ({cartItems.length})</h2>
          <IconButton onClick={handleClose}><MdClose /></IconButton>
        </div>

        {/* ITEMS LIST */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item, index) => {
              // Extract ID: productId might be an object or a string depending on population
              const pId = item.productId?._id || item.productId;

              return (
                <div key={`${pId}-${item.size}-${index}`} className="flex gap-4 py-4 border-b hover:bg-gray-50 transition-colors">
                  
                  {/* Image Container */}
                  <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-100">
                    <img
                      src={getDisplayImage(item)}
                      className="w-full h-full object-cover"
                      alt={item.name || "Product"}
                      onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = "https://placehold.co/150x200?text=Error"; 
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h4 className="text-sm font-bold truncate pr-2 text-gray-800">
                      {item.name || "Unnamed Product"}
                    </h4>
                    <p className="text-xs text-gray-500 font-medium uppercase">Size: {item.size || "N/A"}</p>
                    
                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Logic */}
                      <div className="flex items-center border border-gray-200 rounded bg-white">
                        <button 
                          onClick={() => pId && updateQty(pId, item.size, -1)} 
                          className="px-2 py-1 hover:bg-gray-100 text-gray-600 disabled:opacity-30"
                          disabled={item.qty <= 1}
                        >
                          <MdRemove size={14} />
                        </button>
                        <span className="px-3 text-xs font-bold border-x border-gray-200 min-w-[30px] text-center">
                          {item.qty || 1}
                        </span>
                        <button 
                          onClick={() => pId && updateQty(pId, item.size, 1)} 
                          className="px-2 py-1 hover:bg-gray-100 text-gray-600"
                        >
                          <MdAdd size={14} />
                        </button>
                      </div>
                      
                      <span className="font-bold text-sm text-[#691414]">
                        ৳{((item.price || 0) * (item.qty || 1)).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <IconButton 
                    onClick={() => pId && removeItem(pId, item.size)} 
                    className="self-start !p-1 hover:!bg-red-50"
                  >
                    <MdDeleteOutline color="#691414" size={20} />
                  </IconButton>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between font-bold text-lg mb-4 text-gray-800">
            <span>Subtotal:</span>
            <span>৳{totalAmount.toLocaleString()}</span>
          </div>
          
          <Button 
            fullWidth 
            variant="contained" 
            disabled={cartItems.length === 0}
            onClick={() => { handleClose(); navigate("/checkout"); }} 
            sx={{ 
              backgroundColor: "#691414", 
              py: 1.5, mb: 2, fontWeight: 'bold',
              "&:hover": { backgroundColor: "#4a0e0e" },
              "&.Mui-disabled": { backgroundColor: "#d1d1d1" }
            }}
          >
            PROCEED TO CHECKOUT
          </Button>
          
          <Button 
            fullWidth 
            variant="outlined" 
            onClick={() => { handleClose(); navigate("/cart"); }}
            sx={{ 
              borderColor: "#691414", color: "#691414", fontWeight: 'bold',
              "&:hover": { borderColor: "#4a0e0e", backgroundColor: "rgba(105, 20, 20, 0.04)" }
            }}
          >
            VIEW FULL CART
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default CartBar;