import React, { useState, useEffect } from "react";
import { 
  TextField, 
  Button, 
  Divider, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl,
  CircularProgress
} from "@mui/material";
import { MdOutlinePayments, MdLocalShipping, MdLock, MdCheckCircle } from "react-icons/md";
import { useCart } from "../../../Context/CartContext"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CheckOut = () => {
  // Pull totalAmount directly from Context
  const { cartItems, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    notes: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    
    // 1. Validation
    if (!formData.phone || !formData.address || !formData.firstName) {
      alert("Please fill in all required shipping details.");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // 2. Ensure totalAmount is a valid number
    const finalTotal = Number(totalAmount);
    if (isNaN(finalTotal) || finalTotal <= 0) {
      alert("Invalid order total. Please check your cart.");
      return;
    }

    setLoading(true);

    // 3. Construct payload to match Backend Controller
    const orderData = {
      orderItems: cartItems.map(item => ({
        name: item.name,
        qty: item.qty,
        price: Number(item.price),
        product: item._id, // MongoDB ID
        size: item.size || "N/A",
        image: item.image
      })),
      shippingAddress: {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
      },
      paymentMethod: paymentMethod,
      totalPrice: finalTotal, // This maps to 'total' in your controller logic
    };

    try {
      const config = {
        headers: { 
          Authorization: userInfo?.token ? `Bearer ${userInfo.token}` : "",
          "Content-Type": "application/json"
        }
      };

      const response = await axios.post("http://localhost:5000/api/orders", orderData, config);
      
      if (response.status === 201 || response.status === 200) {
        setIsOrderPlaced(true);
        clearCart(); 
        // Auto-redirect after 5 seconds
        setTimeout(() => navigate("/"), 5000);
      }
    } catch (err) {
      console.error("Order Submission Error:", err);
      alert(err.response?.data?.message || "Failed to place order. Connection error.");
    } finally {
      setLoading(false);
    }
  };

  if (isOrderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4 text-center">
        <MdCheckCircle className="text-green-500 text-8xl mb-4" />
        <h2 className="text-3xl font-bold text-gray-800">Order Placed Successfully!</h2>
        <p className="text-gray-600 mt-2">Total Amount Paid: ৳{totalAmount?.toLocaleString()}</p>
        <p className="text-sm text-gray-400 mt-1">Redirecting to home page shortly...</p>
        <Button 
          variant="contained" 
          onClick={() => navigate("/")}
          sx={{ mt: 4, backgroundColor: "#691414", borderRadius: '50px', px: 4 }}
        >
          Back to Shopping
        </Button>
      </div>
    );
  }

  return (
    <section className="bg-[#f8f9fa] py-12 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT: FORM FIELDS */}
          <div className="lg:w-2/3 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-8">
                <div className="bg-[#691414]/10 p-2 rounded-lg">
                  <MdLocalShipping className="text-[#691414] text-2xl" />
                </div>
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Shipping Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <TextField fullWidth label="First Name *" name="firstName" value={formData.firstName} onChange={handleChange} variant="outlined" />
                <TextField fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} variant="outlined" />
                <TextField fullWidth label="Email Address" name="email" value={formData.email} onChange={handleChange} variant="outlined" className="md:col-span-2" />
                <TextField fullWidth label="Phone Number *" name="phone" value={formData.phone} onChange={handleChange} variant="outlined" />
                <TextField fullWidth label="City *" name="city" value={formData.city} onChange={handleChange} variant="outlined" />
                <TextField fullWidth label="Detailed Address *" name="address" value={formData.address} onChange={handleChange} variant="outlined" multiline rows={3} className="md:col-span-2" />
              </div>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY & TOTAL */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 sticky top-6 overflow-hidden">
              <div className="bg-[#691414] p-6 text-white text-center">
                <h2 className="text-xl font-bold uppercase tracking-widest">Order Summary</h2>
              </div>
              
              <div className="p-6">
                <div className="max-h-[250px] overflow-y-auto mb-6 pr-2">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start py-3 border-b border-gray-50">
                      <div>
                        <p className="text-sm font-bold text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.qty} × ৳{item.price}</p>
                      </div>
                      <p className="font-bold text-gray-900">৳{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold">৳{totalAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-bold uppercase text-[10px] bg-green-50 px-2 py-1 rounded">Free</span>
                  </div>
                  <Divider />
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-bold text-gray-800">Total Amount</span>
                    <span className="text-2xl font-black text-[#691414]">৳{totalAmount?.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-8">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest">Select Payment</p>
                  <FormControl component="fieldset" className="w-full">
                    <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                      <div className={`border-2 rounded-xl p-2 transition-all ${paymentMethod === "cod" ? "border-[#691414] bg-[#691414]/5" : "border-gray-100"}`}>
                        <FormControlLabel 
                          value="cod" 
                          control={<Radio sx={{ color: "#691414", "&.Mui-checked": { color: "#691414" } }} />} 
                          label={<span className="font-black text-gray-700 uppercase text-xs">Cash on Delivery</span>} 
                        />
                      </div>
                    </RadioGroup>
                  </FormControl>
                </div>

                <Button
                  variant="contained"
                  fullWidth
                  disabled={loading || cartItems.length === 0}
                  onClick={handlePlaceOrder}
                  sx={{ 
                    backgroundColor: "#691414", 
                    height: "65px", 
                    borderRadius: "15px",
                    fontWeight: "900", 
                    fontSize: "1rem",
                    mt: 4,
                    boxShadow: "0 10px 20px -5px rgba(105, 20, 20, 0.4)",
                    "&:hover": { backgroundColor: "#4a0e0e" },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : `CONFIRM ORDER ৳${totalAmount?.toLocaleString()}`}
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CheckOut;