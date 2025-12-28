import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Package,
  Layers,
  ShoppingCart,
  BarChart3,
  Image as ImageIcon,
  Ticket,
  BellRing,
  ChevronRight,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

// --- IMPORT YOUR COMPONENTS ---
import UserManagement from "../UserManagement";
import ProductManagement from "../ProductManagement";
import CategoryManagement from "../CategoryManagement";
import OrderManagement from "../OderMamagement"; 
import SliderManagement from "../SliderManagement";

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Ensure the role matches 'super_admin' so all buttons appear
  const [userRole, setUserRole] = useState("super_admin");
  const [adminName, setAdminName] = useState("Tanha Binte Hasan");
  const [currentView, setCurrentView] = useState("Dashboard");

  useEffect(() => {
    const savedAdmin = JSON.parse(localStorage.getItem("adminInfo"));
    if (savedAdmin) {
      setAdminName(savedAdmin.name || "Tanha Binte Hasan");
      // If the saved role is valid, use it; otherwise, stay as super_admin
      if(savedAdmin.role) setUserRole(savedAdmin.role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminInfo");
    navigate("/adminlogin");
    window.location.reload();
  };

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, roles: ["super_admin", "support", "marketing"] },
    { name: "User Management", icon: <Users size={20} />, roles: ["super_admin"] },
    { name: "Product Management", icon: <Package size={20} />, roles: ["super_admin", "marketing"] },
    { name: "Category Management", icon: <Layers size={20} />, roles: ["super_admin"] },
    { name: "Slider Management", icon: <ImageIcon size={20} />, roles: ["super_admin", "marketing"] },
    { name: "Order Management", icon: <ShoppingCart size={20} />, roles: ["super_admin", "support"] },
    { name: "Analytics", icon: <BarChart3 size={20} />, roles: ["super_admin"] },
    { name: "Coupons & Promos", icon: <Ticket size={20} />, roles: ["super_admin", "marketing"] },
    { name: "Support Tickets", icon: <BellRing size={20} />, roles: ["super_admin", "support"] },
  ];

  const renderContent = () => {
    switch (currentView) {
      case "User Management": return <UserManagement />;
      case "Product Management": return <ProductManagement />;
      case "Category Management": return <CategoryManagement />;
      case "Order Management": return <OrderManagement />;
      case "Slider Management": return <SliderManagement />;
      case "Dashboard": return <DashboardHome />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-400 italic">
            {currentView} Component coming soon...
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar Section */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-100">
          <div className="text-xs text-gray-400 tracking-widest">
            <img src="/logo.png" alt="logo" className="h-8" />
          </div>
        </div>

        {/* This nav handles the Management Buttons */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {Array.isArray(menuItems) && menuItems.map((item, index) => (
  <li key={index}>
    <button
      onClick={() => setCurrentView(item.name)}
      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all group ${
        currentView === item.name
          ? "bg-[#800020] text-white shadow-md"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-3">
        {item.icon}
        <span className="text-sm font-medium">{item.name}</span>
      </div>
      <ChevronRight 
        size={14} 
        className={`${currentView === item.name ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} 
      />
    </button>
  </li>
))}
          </ul>
        </nav>

        {/* --- LOGOUT BUTTON (Upper the Admin Name) --- */}
        <div className="px-3 py-2">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
          >
            <LogOut size={20} />
            <span>Logout Session</span>
          </button>
        </div>

        {/* Admin Profile Section (Lower Corner) */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
            <div className="h-10 w-10 bg-[#800020] text-white rounded-full flex items-center justify-center font-bold">
              {adminName.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-700 truncate">
                {adminName}
              </p>
              <p className="text-[10px] text-gray-400 uppercase tracking-tighter">
                {userRole.replace("_", " ")}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">{renderContent()}</main>
    </div>
  );
};

// ... Internal DashboardHome remains exactly the same ...
const DashboardHome = () => {
    return (
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Dashboard Overview</h2>
          <p className="text-gray-500 text-sm mb-8">Welcome to Shilpo Kotha Administration.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-gray-400 text-sm">Total Sales</p>
                <h3 className="text-2xl font-bold text-gray-800">৳45,280</h3>
             </div>
             {/* ... more cards as needed ... */}
          </div>
        </div>
    );
};

export default AdminDashboard;