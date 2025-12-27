import React, { useState } from "react";
import { Button, IconButton } from "@mui/material";
import { MdDeleteOutline, MdOutlineShoppingCart } from "react-icons/md";

const WishPage = () => {
  // 1. Initialize state with fixed product data
  const [wishItems, setWishItems] = useState([
    {
      id: 1,
      name: "Men Opaque Casual Shirt",
      price: 1650,
      image: "/Product1.webp",
    },
  ]);

  // 2. Handle Delete from Wishlist
  const handleDelete = (id) => {
    setWishItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // 3. Handle Add to Cart (Simulated)
  const handleAddToCart = (product) => {
    console.log("Adding to cart:", product);
    alert(`${product.name} added to cart!`);
    // In the future, you will call your Cart Context/API here
  };

  if (wishItems.length === 0) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-400">
          Your wishlist is empty
        </h2>
        <Button href="/" sx={{ color: "#691414", mt: 2, fontWeight: "bold" }}>
          Explore Products
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 min-h-[70vh]">
      <h1 className="text-3xl font-bold mb-10 text-gray-800 tracking-tight">
        My Wishlist
      </h1>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="p-5 font-bold">Product</th>
              <th className="p-5 font-bold">Price</th>
              <th className="p-5 font-bold text-center">Action</th>
              <th className="p-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {wishItems.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      className="w-16 h-20 object-cover rounded shadow-sm"
                      alt={item.name}
                    />
                    <span className="font-bold text-gray-800">{item.name}</span>
                  </div>
                </td>
                <td className="p-5 font-bold text-[#691414]">
                  ৳{item.price.toLocaleString()}
                </td>
                <td className="p-5 text-center">
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#691414",
                      "&:hover": { backgroundColor: "#4a0e0e" },
                      textTransform: "none",
                      fontWeight: "bold",
                    }}
                    startIcon={<MdOutlineShoppingCart />}
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </Button>
                </td>
                <td className="p-5 text-right">
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(item.id)}
                    title="Remove from wishlist"
                  >
                    <MdDeleteOutline />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WishPage;
