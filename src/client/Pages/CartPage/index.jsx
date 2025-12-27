import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, IconButton, Divider } from "@mui/material";
import { MdDeleteOutline, MdAdd, MdRemove } from "react-icons/md";

const CartPage = () => {
  const navigate = useNavigate(); // 2. Initialize the function
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Men Opaque Casual Shirt",
      price: 1650,
      quantity: 1,
      image: "/Product1.webp",
    },
  ]);

  // 2. Handle Quantity Increase/Decrease
  const handleQuantity = (id, type) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          let newQty = type === "add" ? item.quantity + 1 : item.quantity - 1;
          return { ...item, quantity: Math.max(1, newQty) }; // Prevents going below 1
        }
        return item;
      })
    );
  };

  // 3. Handle Delete Item
  const handleDelete = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // 4. Calculate Totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-400">Your cart is empty</h2>
        <Button href="/" sx={{ color: "#691414", mt: 2 }}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 pb-10 px-4 min-h-[70vh]">
      <h1 className="text-3xl font-bold mb-10 text-gray-800">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-2/3 bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="p-5 font-bold">Product</th>
                <th className="p-5 font-bold text-center">Quantity</th>
                <th className="p-5 font-bold text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        className="w-16 h-20 object-cover rounded"
                        alt={item.name}
                      />
                      <div>
                        <h4 className="font-bold text-gray-800">{item.name}</h4>
                        <p className="text-xs text-gray-400">
                          ৳{item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        {/* DECREASE BUTTON */}
                        <IconButton
                          size="small"
                          onClick={() => handleQuantity(item.id, "sub")}
                        >
                          <MdRemove />
                        </IconButton>
                        <span className="px-4 font-bold">{item.quantity}</span>
                        {/* INCREASE BUTTON */}
                        <IconButton
                          size="small"
                          onClick={() => handleQuantity(item.id, "add")}
                        >
                          <MdAdd />
                        </IconButton>
                      </div>
                      {/* DELETE BUTTON */}
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(item.id)}
                      >
                        <MdDeleteOutline />
                      </IconButton>
                    </div>
                  </td>
                  <td className="p-5 text-right font-bold text-gray-800">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-xl border-2 border-[#691414]/10">
            <h3 className="text-xl font-bold mb-6 text-gray-800">
              Order Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-bold uppercase text-xs">
                  Free
                </span>
              </div>
              <Divider />
              <div className="flex justify-between text-2xl font-black text-[#691414] py-4">
                <span>Total</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate("/checkout")} // 3. Add the click handler
                sx={{
                  backgroundColor: "#691414",
                  height: "55px",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  "&:hover": { backgroundColor: "#4a0e0e" },
                }}
              >
                PROCEED TO CHECKOUT
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
