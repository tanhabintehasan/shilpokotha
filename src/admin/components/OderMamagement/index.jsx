import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CommonTable from "../Ui/CommonTable";
import { Eye, Trash2, Loader2, RefreshCw } from "lucide-react";
import axiosInstance from '../../../utils';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Helper to get Admin Token with safety checks
  const getAdminConfig = useCallback(() => {
    const rawData = localStorage.getItem("userInfo");
    if (!rawData || rawData === "undefined") return { headers: {} };
    
    try {
      const userInfo = JSON.parse(rawData);
      return {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };
    } catch (e) {
      return { headers: {} };
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get(`${BACKEND_URL}/api/orders`, getAdminConfig());
      // Safety: ensure data is always an array
      const data = Array.isArray(res.data) ? res.data : (res.data?.orders || []);
      setOrders(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [BACKEND_URL, getAdminConfig]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (id, newStatus) => {
    // Optimistic Update: Change UI immediately
    const previousOrders = [...orders];
    setOrders((prev) =>
      prev.map((o) => (o._id === id ? { ...o, status: newStatus } : o))
    );

    try {
      await axios.put(
        `${BACKEND_URL}/api/orders/status/${id}`,
        { status: newStatus },
        getAdminConfig()
      );
    } catch (err) {
      // Rollback on failure
      setOrders(previousOrders);
      alert("Update failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure? This cannot be undone.")) {
      try {
        await axios.delete(`${BACKEND_URL}/api/orders/${id}`, getAdminConfig());
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
      render: (row) => <span className="text-[10px] font-mono uppercase text-gray-500">#{row._id?.slice(-6)}</span>
    },
    { 
      header: "Customer", 
      key: "customer",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-800">{row.customer || row.name || "Guest User"}</span>
          <span className="text-[10px] text-gray-400">{row.phone || row.email}</span>
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
      key: "total",
      render: (row) => <span className="font-bold text-[#891b1b]">৳{Number(row.total || 0).toLocaleString()}</span>,
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <select
          value={row.status || "Pending"}
          onChange={(e) => handleStatusChange(row._id, e.target.value)}
          className={`text-[10px] font-black uppercase rounded-lg px-2 py-1 border-none outline-none cursor-pointer transition-all hover:ring-2 hover:ring-gray-200 ${
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
            title="Quick View"
            className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"
            onClick={() => {
                const itemNames = row.items?.map(i => `${i.name} (${i.qty})`).join(', ') || "No items";
                alert(`SHIPPING INFO:\nName: ${row.customer}\nPhone: ${row.phone}\nAddress: ${row.address}, ${row.city}\n\nITEMS:\n${itemNames}`);
            }}
          >
            <Eye size={18} />
          </button>
          <button
            title="Delete Order"
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
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchOrders}
            className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-gray-600"
            title="Refresh Orders"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
          <span className="bg-[#891b1b] text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-sm">
            {isLoading ? "Syncing..." : `${orders.length} Total Orders`}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200/50 overflow-hidden">
        {isLoading && orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 gap-4">
            <Loader2 className="animate-spin text-[#891b1b]" size={40} />
            <p className="text-sm font-medium text-gray-400">Loading orders...</p>
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
            <button onClick={fetchOrders} className="mt-4 text-[#891b1b] text-sm font-bold underline">Check again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;