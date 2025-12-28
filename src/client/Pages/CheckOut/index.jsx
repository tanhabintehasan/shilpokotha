import React, { useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import { useCart } from "../../../Context/CartContext"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CheckOut = () => {
  const { cartItems, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", phone: "", city: "", address: "" });

  const handlePlaceOrder = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const safeCart = Array.isArray(cartItems) ? cartItems : [];

    if (!formData.phone || !formData.address || safeCart.length === 0) {
      return alert("Complete your details and cart first.");
    }

    setLoading(true);
    const orderData = {
      orderItems: safeCart.map(item => ({
        name: item.name,
        qty: item.qty,
        price: Number(item.price),
        product: item.productId?._id || item.productId || item._id,
        size: item.size || "M",
        image: item.img || item.image
      })),
      shippingAddress: { name: `${formData.firstName} ${formData.lastName}`, phone: formData.phone, address: formData.address, city: formData.city },
      paymentMethod: "cod",
      totalPrice: Number(totalAmount),
    };

    try {
      const config = { headers: { Authorization: userInfo?.token ? `Bearer ${userInfo.token}` : "" } };
      await axios.paxiosInstance.postost(`${BACKEND_URL}/api/orders`, orderData, config);
      setIsOrderPlaced(true);
      if (typeof clearCart === 'function') clearCart();
      setTimeout(() => navigate("/"), 4000);
    } catch (err) {
      alert(err.response?.data?.message || "Order failed.");
    } finally { setLoading(false); }
  };

  if (isOrderPlaced) return <div className="text-center py-20"><h2>Order Success!</h2><p>Redirecting...</p></div>;

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-6">
      <div className="md:w-2/3 bg-white p-6 rounded shadow">
        <h3>Shipping Info</h3>
        <TextField fullWidth label="First Name" margin="normal" onChange={e => setFormData({...formData, firstName: e.target.value})} />
        <TextField fullWidth label="Phone" margin="normal" onChange={e => setFormData({...formData, phone: e.target.value})} />
        <TextField fullWidth multiline rows={3} label="Address" margin="normal" onChange={e => setFormData({...formData, address: e.target.value})} />
      </div>
      <div className="md:w-1/3 bg-gray-50 p-6 rounded shadow">
        <h3>Summary</h3>
        <p className="flex justify-between font-bold text-xl mt-4">Total: <span>৳{totalAmount.toLocaleString()}</span></p>
        <Button fullWidth variant="contained" sx={{mt:3, bgcolor:'#691414'}} onClick={handlePlaceOrder} disabled={loading}>
          {loading ? <CircularProgress size={20}/> : "CONFIRM ORDER"}
        </Button>
      </div>
    </div>
  );
};
export default CheckOut;