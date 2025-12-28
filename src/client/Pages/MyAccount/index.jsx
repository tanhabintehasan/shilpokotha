import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Avatar,
  Divider,
  Autocomplete,
  Badge,
} from "@mui/material";
import {
  MdPerson,
  MdShoppingBag,
  MdLocationOn,
  MdLogout,
  MdCameraAlt,
  MdEdit,
  MdFavorite,
  MdArrowBack,
  MdShoppingCart
} from "react-icons/md";
import { useShop } from "../../../Context/ShopContext";

const countryList = [
  { code: "BD", label: "Bangladesh", phone: "880" },
  { code: "IN", label: "India", phone: "91" },
  { code: "US", label: "United States", phone: "1" },
];

const MyAccount = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const { wishlistItems, cartItems, removeItem, updateQty } = useShop();

  const [user, setUser] = useState({
    name: "User",
    email: "",
    phone: "",
    avatar: "",
  });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (savedUser) {
      setUser({
        name: savedUser.name || "User",
        email: savedUser.email || "",
        phone: savedUser.phone || "",
        avatar: savedUser.avatar || "",
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
    window.location.reload(); 
  };

  // Sidebar configuration with dynamic counts
  const sidebarItems = [
    { id: "profile", label: "My Profile", icon: <MdPerson /> },
    { id: "orders", label: "My Orders", icon: <MdShoppingBag />, count: 0 },
    { id: "cart", label: "My Cart", icon: <MdShoppingCart />, count: cartItems?.length || 0 },
    { id: "wishlist", label: "My Wishlist", icon: <MdFavorite />, count: wishlistItems?.length || 0 },
    { id: "address", label: "Address", icon: <MdLocationOn /> },
  ];

  return (
    <section className="bg-[#f8f9fa] py-12 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* TOP NAVIGATION / BACK BUTTON */}
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
                  {cartItems.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">Your cart is currently empty.</div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={`${item.productId}-${item.size}`} className="flex items-center gap-4 p-4 border rounded-lg">
                          <img src={item.img} alt={item.name} className="w-16 h-20 object-cover rounded" />
                          <div className="flex-1">
                            <h4 className="font-bold text-sm">{item.name}</h4>
                            <p className="text-xs text-gray-500">Size: {item.size}</p>
                            <p className="text-[#691414] font-bold">৳{item.price}</p>
                          </div>
                          <div className="flex items-center gap-2">
                             <button onClick={() => updateQty(item.productId, item.size, -1)} className="px-2 border rounded">-</button>
                             <span className="text-sm font-bold">{item.qty}</span>
                             <button onClick={() => updateQty(item.productId, item.size, 1)} className="px-2 border rounded">+</button>
                          </div>
                          <Button onClick={() => removeItem(item.productId, item.size)} color="error">Remove</Button>
                        </div>
                      ))}
                      <div className="pt-6 border-t flex justify-between items-center">
                         <h3 className="text-xl font-bold">Total: ৳{cartItems.reduce((acc, curr) => acc + (curr.price * curr.qty), 0).toLocaleString()}</h3>
                         <Button variant="contained" sx={{ backgroundColor: "#691414" }} onClick={() => navigate("/checkout")}>Checkout Now</Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* WISHLIST REDIRECT TAB (Optional: Show preview instead of redirect) */}
              {activeTab === "wishlist" && (
                <div className="text-center py-20">
                    <MdFavorite className="text-6xl text-gray-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-4">You have {wishlistItems.length} items saved</h3>
                    <Button variant="contained" sx={{ backgroundColor: "#691414" }} onClick={() => navigate("/wishlist")}>
                        Go to Wishlist Page
                    </Button>
                </div>
              )}

              {/* Empty state for Orders */}
              {activeTab === "orders" && (
                  <div className="text-center py-20">
                      <MdShoppingBag className="text-6xl text-gray-200 mx-auto mb-4" />
                      <h3 className="text-xl font-bold">No orders yet</h3>
                      <p className="text-gray-400 mt-2">When you buy items, they will appear here.</p>
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