import React from "react";
import { Drawer, IconButton, Button } from "@mui/material";
import { MdClose, MdDeleteOutline, MdAdd, MdRemove } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../Context/CartContext"; 

const CartBar = () => {
  const navigate = useNavigate();
  const { cartItems, removeItem, updateQty, isCartOpen, setIsCartOpen } = useCart();

  // VITE FIX: Use environment variable for images
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  const handleClose = () => setIsCartOpen?.(false);
  
  const totalAmount = safeCartItems.reduce((acc, item) => {
    const price = Number(item?.price) || 0;
    const qty = Number(item?.qty) || 1;
    return acc + (price * qty);
  }, 0);

  const getDisplayImage = (item) => {
    const rawPath = item?.img || 
                    item?.image || 
                    item?.productId?.images?.[0] || 
                    item?.productId?.image;

    if (!rawPath || rawPath === "undefined" || rawPath === "null") {
      return "https://placehold.co/150x200?text=No+Image";
    }
    
    if (String(rawPath).startsWith('http')) return rawPath;

    const cleanPath = String(rawPath).startsWith('/') ? rawPath : `/${rawPath}`;
    return cleanPath.includes('/uploads') 
      ? `${BACKEND_URL}${cleanPath}` 
      : `${BACKEND_URL}/uploads${cleanPath}`;
  };

  return (
    <Drawer anchor="right" open={!!isCartOpen} onClose={handleClose}>
      <div className="w-[350px] sm:w-[400px] h-full flex flex-col bg-white">
        
        {/* HEADER */}
        <div className="p-4 flex items-center justify-between border-b bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Shopping Cart ({safeCartItems.length})</h2>
          <IconButton onClick={handleClose}><MdClose /></IconButton>
        </div>

        {/* ITEMS LIST */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {safeCartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                 <MdDeleteOutline size={40} className="opacity-20" />
              </div>
              <p className="text-sm font-medium">Your cart is feeling a bit light!</p>
            </div>
          ) : (
            safeCartItems.map((item, index) => {
              // Extract ID Safely - prioritizing the nested productId if it exists
              const pId = item?.productId?._id || item?.productId || item?._id;

              return (
                <div key={`${pId}-${item?.size || index}`} className="flex gap-4 py-4 border-b last:border-0 hover:bg-gray-50 transition-colors">
                  
                  {/* Image Container */}
                  <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
                    <img
                      src={getDisplayImage(item)}
                      className="w-full h-full object-cover"
                      alt={item?.name || "Product"}
                      onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = "https://placehold.co/150x200?text=Error"; 
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold truncate pr-2 text-gray-800">
                        {item?.name || "Unnamed Product"}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                        Size: <span className="text-gray-600">{item?.size || "N/A"}</span>
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white">
                        <button 
                          onClick={() => pId && updateQty?.(pId, item?.size, -1)} 
                          className="px-2 py-1 hover:bg-gray-100 text-gray-500 disabled:opacity-20"
                          disabled={item?.qty <= 1}
                        >
                          <MdRemove size={12} />
                        </button>
                        <span className="px-2 text-xs font-black min-w-[25px] text-center text-gray-700">
                          {item?.qty || 1}
                        </span>
                        <button 
                          onClick={() => pId && updateQty?.(pId, item?.size, 1)} 
                          className="px-2 py-1 hover:bg-gray-100 text-gray-500"
                        >
                          <MdAdd size={12} />
                        </button>
                      </div>
                      
                      <span className="font-bold text-sm text-[#691414]">
                        ৳{((Number(item?.price) || 0) * (Number(item?.qty) || 1)).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <IconButton 
                    onClick={() => pId && removeItem?.(pId, item?.size)} 
                    className="self-start !p-1.5 hover:!bg-red-50 group"
                  >
                    <MdDeleteOutline className="text-gray-300 group-hover:text-red-600 transition-colors" size={18} />
                  </IconButton>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t bg-gray-50 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-end mb-6">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Estimated Total</span>
            <span className="text-2xl font-black text-gray-900 leading-none">৳{totalAmount.toLocaleString()}</span>
          </div>
          
          <div className="space-y-3">
            <Button 
              fullWidth 
              variant="contained" 
              disabled={safeCartItems.length === 0}
              onClick={() => { handleClose(); navigate("/checkout"); }} 
              sx={{ 
                backgroundColor: "#691414", 
                py: 2, 
                borderRadius: '12px',
                fontWeight: '900',
                boxShadow: "0 8px 16px -4px rgba(105, 20, 20, 0.3)",
                "&:hover": { backgroundColor: "#4a0e0e", boxShadow: "none" }
              }}
            >
              PROCEED TO CHECKOUT
            </Button>
            
            <Button 
              fullWidth 
              onClick={() => { handleClose(); navigate("/cart"); }}
              sx={{ 
                color: "#691414", 
                fontWeight: 'bold', 
                fontSize: '12px',
                "&:hover": { backgroundColor: "transparent", textDecoration: 'underline' } 
              }}
            >
              Review Full Cart
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default CartBar;