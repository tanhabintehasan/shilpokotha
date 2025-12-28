import React, { useState, useEffect } from "react";
import axios from "axios";
import CommonTable from "../Ui/CommonTable";
import { Eye, Trash2, Loader2 } from "lucide-react";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to get Admin Token
  const getAdminConfig = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    return {
      headers: {
        Authorization: `Bearer ${userInfo?.token}`,
      },
    };
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:5000/api/orders", getAdminConfig());
      const data = Array.isArray(res.data) ? res.data : [];
      setOrders(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Backend route: PUT /api/orders/status/:id
      await axios.put(
        `http://localhost:5000/api/orders/status/${id}`,
        { status: newStatus },
        getAdminConfig()
      );
      // Update local state immediately for better UX
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure? This cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:5000/api/orders/${id}`, getAdminConfig());
        setOrders((prev) => prev.filter((o) => o._id !== id));
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const columns = [
    { 
      header: "Order ID", 
      key: "_id",
      render: (row) => <span className="text-[10px] font-mono uppercase text-gray-500">#{row._id.slice(-6)}</span>
    },
    { 
      header: "Customer", 
      key: "customer",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-800">{row.customer || "Guest User"}</span>
          <span className="text-[10px] text-gray-400">{row.phone}</span>
        </div>
      )
    },
    {
      header: "Date",
      key: "createdAt",
      render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A",
    },
    {
      header: "Amount",
      key: "total", // FIXED: Backend uses 'total'
      render: (row) => <span className="font-bold">৳{Number(row.total).toLocaleString()}</span>,
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <select
          value={row.status || "Pending"}
          onChange={(e) => handleStatusChange(row._id, e.target.value)}
          className={`text-[10px] font-black uppercase rounded-lg px-2 py-1 border-none outline-none cursor-pointer transition-colors ${
            row.status === "Delivered" ? "bg-green-100 text-green-700" :
            row.status === "Cancelled" ? "bg-red-100 text-red-700" :
            row.status === "Processing" ? "bg-blue-100 text-blue-700" :
            "bg-amber-100 text-amber-700"
          }`}
        >
          {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      ),
    },
    {
      header: "Actions",
      key: "actions",
      render: (row) => (
        <div className="flex gap-2">
          <button 
            className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"
            onClick={() => {
                const itemNames = row.items?.map(i => `${i.name} (${i.qty})`).join(', ') || "No items";
                alert(`Address: ${row.address}, ${row.city}\n\nItems: ${itemNames}`);
            }}
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-[#f8f9fa] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight uppercase">Order Management</h2>
          <p className="text-sm text-gray-500">Manage customer orders and fulfillment status</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="bg-[#891b1b] text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-sm">
            {isLoading ? "Syncing..." : `${orders.length} Total Orders`}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200/50 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-80 gap-4">
            <Loader2 className="animate-spin text-[#891b1b]" size={40} />
            <p className="text-sm font-medium text-gray-400">Updating order list...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
             <CommonTable columns={columns} data={orders} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-80 text-gray-400">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Eye size={32} className="opacity-20" />
            </div>
            <p className="font-medium">No orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;