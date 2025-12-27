import React, { useState } from "react";
import { Drawer, IconButton, Button, Divider } from "@mui/material";
import { MdClose, MdDeleteOutline, MdAdd, MdRemove } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const CartBar = ({ isOpen, closeCart }) => {
  const navigate = useNavigate();

  // 1. Local state to make the sidebar interactive
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Men Opaque Casual Shirt",
      price: 1650,
      qty: 1,
      img: "/Product1.webp",
      size: "M",
    },
  ]);

  // 2. Quantity Handler
  const updateQty = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  // 3. Remove Item Handler
  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 4. Calculate Subtotal
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // 5. Navigation Handler for Checkout
  const handleCheckout = () => {
    closeCart(); // Always close drawer before navigating
    navigate("/checkout");
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={closeCart}>
      <div className="w-[350px] sm:w-[400px] h-full flex flex-col bg-white">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-lg font-bold text-gray-800 uppercase tracking-tight">
            Shopping Cart ({cartItems.length})
          </h2>
          <IconButton onClick={closeCart}>
            <MdClose />
          </IconButton>
        </div>

        {/* Product List */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 items-start py-4 border-b border-gray-50"
              >
                <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-100">
                  <img
                    src={item.img}
                    className="w-full h-full object-cover"
                    alt={item.name}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-800 leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Size: {item.size}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="px-2 py-1 hover:bg-gray-100 transition-colors"
                      >
                        <MdRemove size={14} />
                      </button>
                      <span className="px-3 text-xs font-bold w-8 text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="px-2 py-1 hover:bg-gray-100 transition-colors"
                      >
                        <MdAdd size={14} />
                      </button>
                    </div>
                    <span className="font-bold text-sm text-[#691414]">
                      ৳{(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                </div>
                <IconButton
                  size="small"
                  onClick={() => removeItem(item.id)}
                  sx={{ color: "#999", "&:hover": { color: "#ef4444" } }}
                >
                  <MdDeleteOutline />
                </IconButton>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p>Your cart is empty</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t bg-gray-50 space-y-3">
          <div className="flex justify-between font-bold text-lg mb-2 text-gray-800">
            <span>Subtotal:</span>
            <span className="text-[#691414]">
              ৳{totalAmount.toLocaleString()}
            </span>
          </div>

          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              closeCart();
              navigate("/cart");
            }}
            sx={{
              backgroundColor: "#691414",
              fontWeight: "bold",
              height: "50px",
              boxShadow: "none",
              "&:hover": { backgroundColor: "#891b1b", boxShadow: "none" },
            }}
          >
            VIEW CART
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={handleCheckout}
            sx={{
              borderColor: "#691414",
              color: "#691414",
              fontWeight: "bold",
              height: "50px",
              "&:hover": {
                borderColor: "#4a0e0e",
                backgroundColor: "rgba(105, 20, 20, 0.04)",
              },
            }}
          >
            CHECKOUT
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default CartBar;
