import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Avatar,
  Divider,
  Autocomplete,
  Box,
} from "@mui/material";
import {
  MdPerson,
  MdShoppingBag,
  MdLocationOn,
  MdLogout,
  MdCameraAlt,
  MdEdit,
  MdFavoriteBorder,
} from "react-icons/md";

const countryList = [
  { code: "BD", label: "Bangladesh", phone: "880" },
  { code: "IN", label: "India", phone: "91" },
  { code: "US", label: "United States", phone: "1" },
  // ... rest of your countries
];

const MyAccount = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  
  // 1. Load Real User Data from LocalStorage
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
        phone: savedUser.phone || "+880 1XXX-XXXXXX",
        avatar: savedUser.avatar || "",
      });
    }
  }, []);

  // 2. Integrated Logout Logic
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userToken");
    navigate("/login");
    window.location.reload(); // Ensures state is fully wiped
  };

  const sidebarItems = [
    { id: "profile", label: "My Profile", icon: <MdPerson /> },
    { id: "orders", label: "My Orders", icon: <MdShoppingBag /> },
    { id: "wishlist", label: "My List", icon: <MdFavoriteBorder /> },
    { id: "address", label: "Address", icon: <MdLocationOn /> },
  ];

  const handleTabClick = (id) => {
    if (id === "wishlist") {
      navigate("/wishlist");
    } else {
      setActiveTab(id);
    }
  };

  return (
    <section className="bg-[#f8f9fa] py-12 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* LEFT SIDEBAR */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-4">
              <div className="p-6 text-center bg-[#691414]/5">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Avatar
                    src={user.avatar}
                    sx={{
                      width: 96,
                      height: 96,
                      bgcolor: "#691414",
                      fontSize: "2rem",
                    }}
                  >
                    {user.name.charAt(0)}
                  </Avatar>
                  <label className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md cursor-pointer border border-gray-100 hover:bg-gray-50 transition-colors">
                    <MdCameraAlt className="text-[#691414]" />
                    <input type="file" className="hidden" />
                  </label>
                </div>
                <h3 className="font-bold text-gray-800 text-lg leading-tight">{user.name}</h3>
                <p className="text-gray-500 text-xs mt-1">{user.email}</p>
              </div>

              <nav className="p-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-bold transition-all mb-1 ${
                      activeTab === item.id
                        ? "bg-[#691414] text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {item.label}
                  </button>
                ))}

                <Divider className="my-2" />

                {/* LOGOUT BUTTON - Adjusted Style */}
                <button
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
                  onClick={handleLogout}
                >
                  <MdLogout className="text-xl" />
                  Logout
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
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Account Details</h2>
                    <Button
                      variant="text"
                      startIcon={<MdEdit />}
                      sx={{ color: "#691414", fontWeight: "bold", textTransform: "none" }}
                    >
                      Edit Profile
                    </Button>
                  </div>

                  <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextField fullWidth label="Full Name" value={user.name} variant="outlined" />
                    <TextField fullWidth label="Email Address" value={user.email} variant="outlined" disabled />
                    
                    <Autocomplete
                      options={countryList}
                      autoHighlight
                      getOptionLabel={(option) => option.label}
                      renderInput={(params) => <TextField {...params} label="Country" />}
                    />

                    <TextField fullWidth label="Phone Number" value={user.phone} variant="outlined" />

                    <div className="md:col-span-2 mt-4">
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#691414",
                          px: 6,
                          py: 1.5,
                          fontWeight: "bold",
                          borderRadius: "8px",
                          textTransform: "none",
                          "&:hover": { backgroundColor: "#4a0e0e" },
                        }}
                      >
                        Update Profile
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* ORDERS TAB */}
              {activeTab === "orders" && (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MdShoppingBag className="text-4xl text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">No Orders Found</h3>
                    <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm">
                      You haven't placed any orders yet.
                    </p>
                    <Button
                      variant="contained"
                      onClick={() => navigate("/productlisting")}
                      sx={{
                        backgroundColor: "#691414",
                        px: 4,
                        py: 1.2,
                        fontWeight: "bold",
                        textTransform: "none",
                        "&:hover": { backgroundColor: "#4a0e0e" },
                      }}
                    >
                      Go to Shop
                    </Button>
                  </div>
                </div>
              )}

              {/* ADDRESS TAB */}
              {activeTab === "address" && (
                <div className="animate-in fade-in duration-500">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Shipping Addresses</h2>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ backgroundColor: "#691414", fontWeight: "bold", textTransform: "none" }}
                    >
                      + Add New
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 p-5 rounded-xl bg-white shadow-sm relative hover:border-[#691414] transition-all">
                      <span className="absolute top-4 right-4 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase">Default</span>
                      <h4 className="font-bold text-gray-800 mb-1">Home Address</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">Dhaka, Bangladesh</p>
                    </div>
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