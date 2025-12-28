import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, IconButton, Divider } from "@mui/material";
import { MdDeleteOutline, MdAdd, MdRemove } from "react-icons/md";
import { useCart } from "../../../Context/CartContext"; 

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeItem, updateQty } = useCart();

  const getDisplayImage = (item) => {
    const BACKEND_URL = "";
    const rawPath = item.productId?.images?.[0] || item.productId?.image || item.img || item.image;

    if (!rawPath || rawPath === "undefined" || rawPath === "null") {
      return "https://placehold.co/150x200?text=No+Image";
    }
    if (rawPath.startsWith('http')) return rawPath;
    const cleanPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
    return cleanPath.includes('uploads') 
      ? `${BACKEND_URL}${cleanPath}` 
      : `${BACKEND_URL}/uploads${cleanPath}`;
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.qty || 1),
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-400">Your cart is empty</h2>
        <Button onClick={() => navigate("/")} sx={{ color: "#691414", mt: 2 }}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 pb-10 px-4 min-h-[70vh]">
      <h1 className="text-3xl font-bold mb-10 text-gray-800 font-serif">Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-2/3 bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
              <tr>
                <th className="p-5 font-bold">Product</th>
                <th className="p-5 font-bold text-center">Quantity</th>
                <th className="p-5 font-bold text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cartItems.map((item, index) => {
                const pId = item.productId?._id || item.productId || `item-${index}`;
                return (
                  <tr key={`${pId}-${item.size}-${index}`}>
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <img src={getDisplayImage(item)} className="w-16 h-20 object-cover rounded shadow-sm border border-gray-100" alt={item.name} />
                        <div>
                          <h4 className="font-bold text-gray-800 leading-tight">{item.name}</h4>
                          <p className="text-xs text-[#891b1b] font-bold mt-1 uppercase">Size: {item.size || "N/A"}</p>
                          <p className="text-xs text-gray-400">৳{(item.price || 0).toLocaleString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-[#F5F0E6]">
                          <IconButton size="small" onClick={() => updateQty(pId, item.size, -1)}><MdRemove size={18} /></IconButton>
                          <span className="px-4 font-bold text-sm min-w-[30px]">{item.qty || 1}</span>
                          <IconButton size="small" onClick={() => updateQty(pId, item.size, 1)}><MdAdd size={18} /></IconButton>
                        </div>
                        <IconButton color="error" onClick={() => removeItem(pId, item.size)}><MdDeleteOutline size={22} /></IconButton>
                      </div>
                    </td>
                    <td className="p-5 text-right font-bold text-gray-800">৳{((item.price || 0) * (item.qty || 1)).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-xl border-2 border-[#691414]/10 shadow-lg sticky top-24">
            <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4 font-serif">Order Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-bold text-gray-900">৳{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span className="text-green-600 font-bold uppercase text-xs">Free</span></div>
              <Divider />
              <div className="flex justify-between text-2xl font-black text-[#691414] py-4"><span>Total</span><span>৳{subtotal.toLocaleString()}</span></div>
              <Button fullWidth variant="contained" onClick={() => navigate("/checkout")} sx={{ backgroundColor: "#691414", height: "55px", fontWeight: "bold", borderRadius: "8px", "&:hover": { backgroundColor: "#4a0e0e" } }}>PROCEED TO CHECKOUT</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CartPage;