import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineShoppingCart, MdFullscreen } from "react-icons/md";
import { FaHeart, FaStar } from "react-icons/fa";
import { useShop } from "../../../Context/ShopContext"; 
import { useCart } from "../../../Context/CartContext"; // ADDED: Import Cart Context
import { getImageUrl } from "../../../utils/imageHelper";

const ProductItem = ({ item, view, onQuickView }) => {
  // FIXED: addToCart now comes from useCart() to ensure the drawer opens
  const { addToWishlist, wishlistItems } = useShop();
  const { addToCart } = useCart(); 

  if (!item) return null;

  // Check if item is already in wishlist for UI feedback
  const isIdInWishlist = (id) => 
    (wishlistItems || []).some(wish => (wish?.productId?._id || wish?.productId || wish?._id) === id);

  const handleAction = (e, actionFn, ...args) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof actionFn === 'function') {
      actionFn(...args);
    }
  };

  return (
    <div className={`productItem group bg-white border border-gray-100 overflow-hidden transition-all duration-300 mb-4 rounded-xl ${view === "list" ? "flex flex-row items-start gap-8 p-6 shadow-sm hover:shadow-md" : "flex flex-col hover:shadow-lg"}`}>
      
      {/* IMAGE CONTAINER */}
      <div className={`imgWrapper relative overflow-hidden bg-[#f9f9f9] shrink-0 flex items-center justify-center ${view === "list" ? "w-[200px] min-h-[250px] py-4 border border-gray-50 rounded-lg" : "w-full aspect-[3/4]"}`}>
        <Link to={`/product/${item._id}`} className="w-full h-full">
          <img
            src={getImageUrl(item)} 
            alt={item.name}
            className={`transition-transform duration-500 group-hover:scale-105 ${view === "list" ? "max-h-full w-auto object-contain mx-auto" : "w-full h-full object-cover"}`}
            onError={(e) => { e.target.src = "https://placehold.co/300x400?text=Error"; }}
          />
        </Link>

        {/* Hover Actions (Grid View) */}
        {view !== "list" && (
          <div className="absolute top-3 right-[-50px] group-hover:right-3 flex flex-col gap-2 transition-all duration-300 opacity-0 group-hover:opacity-100 z-10">
            <button onClick={(e) => onQuickView && onQuickView(e, item)} className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md text-black hover:bg-[#B89B7A] hover:text-white transition-all">
              <MdFullscreen size={22} />
            </button>

            <button 
              onClick={(e) => handleAction(e, addToWishlist, item)}
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all ${isIdInWishlist(item._id) ? "bg-[#891b1b] text-white" : "bg-white text-black hover:bg-[#891b1b] hover:text-white"}`}
            >
              <FaHeart size={16} />
            </button>

            {item.designType !== 'homeslide' && (
              <button 
                onClick={(e) => handleAction(e, addToCart, item, 1, item.size || "M")} 
                className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md text-black hover:bg-[#006a4e] hover:text-white transition-all"
              >
                <MdOutlineShoppingCart size={18} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* TEXT DETAILS */}
      <div className={`flex-1 flex flex-col ${view === "list" ? "text-left pt-2" : "p-3 text-center"}`}>
        <p className="text-[10px] uppercase tracking-[2px] text-gray-400 font-bold mb-1">
          {item.category || "Collection"}
        </p>

        <Link to={`/product/${item._id}`}>
          <h3 className={`font-semibold text-gray-800 mb-2 hover:text-[#891b1b] transition-colors cursor-pointer ${view === "list" ? "text-2xl" : "text-sm truncate"}`}>
            {item.name || "Heritage Wear"}
          </h3>
        </Link>

        {/* RATING */}
        <div className={`flex mb-3 ${view === "list" ? "justify-start" : "justify-center"} gap-1`}>
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} size={12} className={i < (item.rating || 4) ? "text-yellow-400" : "text-gray-200"} />
          ))}
        </div>

        {/* PRICE */}
        <div className={`flex items-center gap-3 ${view === "list" ? "justify-start" : "justify-center"}`}>
          <span className="text-[#891b1b] font-bold text-2xl">
            ৳{item.price ? item.price.toLocaleString() : "0"}
          </span>
        </div>

        {/* Action Buttons for List View */}
        {view === "list" && (
          <div className="flex items-center gap-4 mt-auto pt-6">
            <button 
              onClick={(e) => handleAction(e, addToCart, item, 1, item.size || "M")} 
              className="px-10 py-3 bg-[#891b1b] text-white text-sm font-bold rounded-lg hover:bg-black transition-all flex items-center gap-2"
            >
              <MdOutlineShoppingCart size={18} /> ADD TO CART
            </button>
            <button onClick={(e) => onQuickView && onQuickView(e, item)} className="p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-[#B89B7A] hover:text-white transition-all">
              <MdFullscreen size={22} />
            </button>
            <button 
                onClick={(e) => handleAction(e, addToWishlist, item)} 
                className={`p-3 rounded-lg transition-all ${isIdInWishlist(item._id) ? "bg-[#891b1b] text-white" : "bg-gray-100 text-gray-700 hover:bg-[#891b1b] hover:text-white"}`}
            >
              <FaHeart size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItem;