import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Avatar,
  Divider,
  Autocomplete,
} from "@mui/material";
import {
  MdPerson,
  MdShoppingBag,
  MdLocationOn,
  MdLogout,
  MdFavorite,
  MdArrowBack,
  MdShoppingCart
} from "react-icons/md";
import { useShop } from "../../../Context/ShopContext";
import { useCart } from "../../../Context/CartContext"; // Correct Context Import

const countryList = [
  { code: "BD", label: "Bangladesh", phone: "880" },
  { code: "IN", label: "India", phone: "91" },
  { code: "US", label: "United States", phone: "1" },
];

const MyAccount = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Split the context imports correctly
  const { wishlistItems } = useShop();
  const { cartItems, removeItem, updateQty, totalAmount } = useCart();

  const [user, setUser] = useState({
    name: "User",
    email: "",
    phone: "",
    avatar: "",
  });

  useEffect(() => {
    const rawData = localStorage.getItem("userInfo");
    if (rawData && rawData !== "undefined" && rawData !== "null") {
      try {
        const savedUser = JSON.parse(rawData);
        setUser({
          name: savedUser.name || "User",
          email: savedUser.email || "",
          phone: savedUser.phone || "",
          avatar: savedUser.avatar || "",
        });
      } catch (e) {
        console.error("Failed to parse user info");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
    window.location.reload(); 
  };

  // Safe checks for lengths
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const safeWishlistItems = Array.isArray(wishlistItems) ? wishlistItems : [];

  const sidebarItems = [
    { id: "profile", label: "My Profile", icon: <MdPerson /> },
    { id: "orders", label: "My Orders", icon: <MdShoppingBag />, count: 0 },
    { id: "cart", label: "My Cart", icon: <MdShoppingCart />, count: safeCartItems.length },
    { id: "wishlist", label: "My Wishlist", icon: <MdFavorite />, count: safeWishlistItems.length },
    { id: "address", label: "Address", icon: <MdLocationOn /> },
  ];

  return (
    <section className="bg-[#f8f9fa] py-12 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* TOP NAVIGATION */}
        <div className="mb-6 flex items-center justify-between">
            <Button 
                onClick={() => navigate("/")} 
                startIcon={<MdArrowBack />}
                sx={{ color: '#666', textTransform: 'none', fontWeight: 'bold' }}
            >
                Back to Shop
            </Button>
            {activeTab !== "profile" && (
                <Button 
                    onClick={() => setActiveTab("profile")}
                    sx={{ color: '#691414', textTransform: 'none', fontWeight: 'bold' }}
                >
                    Account Dashboard
                </Button>
            )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* LEFT SIDEBAR */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-4">
              <div className="p-6 text-center bg-[#691414]/5">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Avatar src={user.avatar} sx={{ width: 96, height: 96, bgcolor: "#691414", fontSize: "2.5rem" }}>
                    {user.name.charAt(0)}
                  </Avatar>
                </div>
                <h3 className="font-bold text-gray-800 text-lg leading-tight">{user.name}</h3>
                <p className="text-gray-500 text-xs mt-1">{user.email}</p>
              </div>

              <nav className="p-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-bold transition-all mb-1 ${
                      activeTab === item.id ? "bg-[#691414] text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                        <span className="text-xl">{item.icon}</span>
                        {item.label}
                    </div>
                    {item.count > 0 && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === item.id ? 'bg-white text-[#691414]' : 'bg-gray-100 text-gray-500'}`}>
                            {item.count}
                        </span>
                    )}
                  </button>
                ))}
                <Divider className="my-2" />
                <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 transition-all" onClick={handleLogout}>
                  <MdLogout className="text-xl" /> Logout
                </button>
              </nav>
            </div>
          </div>

          {/* RIGHT CONTENT AREA */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[550px]">
              
              {/* PROFILE TAB */}
              {activeTab === "profile" && (
                <div className="animate-in fade-in duration-500">
                  <h2 className="text-2xl font-bold text-gray-800 mb-8">Account Details</h2>
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextField fullWidth label="Full Name" value={user.name} variant="outlined" />
                    <TextField fullWidth label="Email Address" value={user.email} variant="outlined" disabled />
                    <Autocomplete options={countryList} getOptionLabel={(option) => option.label} renderInput={(params) => <TextField {...params} label="Country" />} />
                    <TextField fullWidth label="Phone Number" value={user.phone} variant="outlined" />
                    <div className="md:col-span-2 mt-4">
                      <Button variant="contained" sx={{ backgroundColor: "#691414", px: 6, py: 1.5, fontWeight: "bold", "&:hover": { backgroundColor: "#4a0e0e" } }}>
                        Update Profile
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* CART TAB */}
              {activeTab === "cart" && (
                <div className="animate-in fade-in duration-500">
                  <h2 className="text-2xl font-bold text-gray-800 mb-8">My Shopping Cart</h2>
                  {safeCartItems.length === 0 ? (
                    <div className="text-center py-10">
                        <MdShoppingCart className="text-6xl text-gray-100 mx-auto mb-4" />
                        <p className="text-gray-400">Your cart is currently empty.</p>
                        <Button onClick={() => navigate("/")} sx={{ mt: 2, color: "#691414" }}>Go Shopping</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {safeCartItems.map((item) => (
                        <div key={`${item.productId}-${item.size}`} className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow">
                          <img src={item.img} alt={item.name} className="w-16 h-20 object-cover rounded shadow-sm" />
                          <div className="flex-1">
                            <h4 className="font-bold text-sm">{item.name}</h4>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Size: {item.size}</p>
                            <p className="text-[#691414] font-bold">৳{item.price}</p>
                          </div>
                          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                             <button onClick={() => updateQty(item.productId, item.size, -1)} className="w-8 h-8 flex items-center justify-center border rounded bg-white hover:bg-gray-100">-</button>
                             <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                             <button onClick={() => updateQty(item.productId, item.size, 1)} className="w-8 h-8 flex items-center justify-center border rounded bg-white hover:bg-gray-100">+</button>
                          </div>
                          <Button onClick={() => removeItem(item.productId, item.size)} color="error" size="small" sx={{ textTransform: 'none', fontWeight: 'bold' }}>Remove</Button>
                        </div>
                      ))}
                      <div className="pt-6 border-t mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                         <h3 className="text-xl font-bold">Total: <span className="text-[#691414]">৳{totalAmount.toLocaleString()}</span></h3>
                         <Button variant="contained" size="large" sx={{ backgroundColor: "#691414", px: 8, fontWeight: 'bold' }} onClick={() => navigate("/checkout")}>Checkout Now</Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* WISHLIST TAB */}
              {activeTab === "wishlist" && (
                <div className="text-center py-20 animate-in fade-in duration-500">
                    <MdFavorite className="text-6xl text-gray-100 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-4">You have {safeWishlistItems.length} items saved</h3>
                    <Button variant="contained" sx={{ backgroundColor: "#691414", fontWeight: 'bold' }} onClick={() => navigate("/wishlist")}>
                        Go to Wishlist Page
                    </Button>
                </div>
              )}

              {/* ORDERS TAB */}
              {activeTab === "orders" && (
                  <div className="text-center py-20 animate-in fade-in duration-500">
                      <MdShoppingBag className="text-6xl text-gray-100 mx-auto mb-4" />
                      <h3 className="text-xl font-bold">No orders yet</h3>
                      <p className="text-gray-400 mt-2">When you buy items, they will appear here.</p>
                      <Button onClick={() => navigate("/")} variant="outlined" sx={{ mt: 3, borderColor: "#691414", color: "#691414" }}>Start Shopping</Button>
                  </div>
              )}

              {/* ADDRESS TAB */}
              {activeTab === "address" && (
                  <div className="animate-in fade-in duration-500">
                      <h2 className="text-2xl font-bold text-gray-800 mb-8">Shipping Address</h2>
                      <div className="p-10 border-2 border-dashed border-gray-100 rounded-xl text-center">
                          <MdLocationOn className="text-5xl text-gray-200 mx-auto mb-4" />
                          <p className="text-gray-400 mb-4">No address saved yet</p>
                          <Button variant="outlined" sx={{ color: "#691414", borderColor: "#691414" }}>Add New Address</Button>
                      </div>
                  </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyAccount;