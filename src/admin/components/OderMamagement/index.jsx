import React, { useState, useEffect } from "react";
import axios from "axios";
import CommonTable from "../Ui/CommonTable";
import { Eye, Trash2, Loader2 } from "lucide-react";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:5000/api/orders");

      // Ensure we are setting an array even if the response is unexpected
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
      await axios.put(`http://localhost:5000/api/orders/status/${id}`, {
        status: newStatus,
      });
      fetchOrders();
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this order?")) {
      await axios.delete(`http://localhost:5000/api/orders/${id}`);
      fetchOrders();
    }
  };

  const columns = [
    { header: "Order ID", key: "orderId" },
    { header: "Customer", key: "customer" },
    {
      header: "Date",
      key: "date",
      render: (row) =>
        row.date ? new Date(row.date).toLocaleDateString() : "N/A",
    },
    {
      header: "Amount",
      key: "total",
      render: (row) => `$${Number(row.total).toFixed(2)}`,
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row._id, e.target.value)}
          className={`text-xs font-bold rounded p-1 border outline-none ${
            row.status === "Delivered"
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(
            (s) => (
              <option key={s} value={s}>
                {s}
              </option>
            )
          )}
        </select>
      ),
    },
    {
      header: "Actions",
      key: "actions",
      render: (row) => (
        <div className="flex gap-2">
          <button className="text-blue-500 hover:bg-blue-50 p-1 rounded">
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="text-red-500 hover:bg-red-50 p-1 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-gray-800">Order Tracking</h2>
        <span className="bg-[#800020] text-white px-4 py-1 rounded-full text-xs font-bold">
          {isLoading ? "Syncing..." : `${orders.length} Active Orders`}
        </span>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-gray-300" size={48} />
          </div>
        ) : orders.length > 0 ? (
          <CommonTable columns={columns} data={orders} />
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <p>No orders found in database.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
