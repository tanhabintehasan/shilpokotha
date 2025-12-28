import React from "react";
import { Button, IconButton, Breadcrumbs, Link } from "@mui/material";
import { MdDeleteOutline, MdOutlineShoppingCart, MdChevronRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useShop } from "../../../Context/ShopContext";

const WishPage = () => {
  const navigate = useNavigate();
  const { wishlistItems = [], removeFromWishlist, addToCart } = useShop();

  const getDisplayImage = (item) => {
    const BACKEND_URL = "http://localhost:5000";
    const rawPath = item.productId?.imageURL || item.productId?.image || item.imageURL || item.img || item.image;

    if (!rawPath || rawPath === "undefined") return "https://placehold.co/150x200?text=No+Image";
    if (rawPath.startsWith('http')) return rawPath;

    const cleanPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
    return cleanPath.includes('uploads') 
      ? `${BACKEND_URL}${cleanPath}` 
      : `${BACKEND_URL}/uploads${cleanPath}`;
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-400">Your wishlist is empty</h2>
        <Button onClick={() => navigate("/")} sx={{ color: "#691414", mt: 2, fontWeight: "bold" }}>
          Explore Products
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 min-h-[70vh]">
      <h1 className="text-3xl font-bold mb-10 text-gray-800 font-serif">My Wishlist</h1>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
            <tr>
              <th className="p-5 font-bold">Product</th>
              <th className="p-5 font-bold">Price</th>
              <th className="p-5 font-bold text-center">Action</th>
              <th className="p-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {wishlistItems.map((item, index) => {
              const pId = item.productId?._id || item._id || `wishpage-${index}`;
              
              return (
                <tr key={`${pId}-${index}`} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={getDisplayImage(item)}
                        className="w-16 h-20 object-cover rounded shadow-sm border border-gray-100"
                        alt={item.name}
                        onError={(e) => { e.target.src = "https://placehold.co/150x200?text=Error"; }}
                      />
                      <span className="font-bold text-gray-800">{item.name}</span>
                    </div>
                  </td>
                  <td className="p-5 font-bold text-[#691414]">
                    ৳{item.price?.toLocaleString()}
                  </td>
                  <td className="p-5 text-center">
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<MdOutlineShoppingCart />}
                      onClick={() => addToCart(item.productId || item, 1, "M")} 
                      sx={{
                        backgroundColor: "#691414",
                        "&:hover": { backgroundColor: "#4a0e0e" },
                        textTransform: "none",
                        fontWeight: "bold",
                        px: 3
                      }}
                    >
                      Add to Cart
                    </Button>
                  </td>
                  <td className="p-5 text-right">
                    <IconButton 
                        color="error" 
                        onClick={() => removeFromWishlist(pId)}
                    >
                      <MdDeleteOutline size={24} />
                    </IconButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WishPage;