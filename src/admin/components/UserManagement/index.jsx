import React, { useState, useEffect } from "react";

import axiosInstance from '../../../utils/axiosInstance'; 
import CommonTable from "../Ui/CommonTable";
import { UserPlus, Shield, User, Mail, Calendar, Loader2 } from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- FETCH REAL USERS ---
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      // FIX: localhost সরিয়ে শুধু রিলেটিভ পাথ ব্যবহার করা হয়েছে
      const res = await axiosInstance.get("/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- ACTIONS ---
  const handleDelete = async (user) => {
    if (window.confirm(`Delete user ${user.name}?`)) {
      try {
        // FIX: axiosInstance ব্যবহার করা হয়েছে এবং লোকালহোস্ট সরানো হয়েছে
        await axiosInstance.delete(`/api/users/${user._id}`);
        fetchUsers(); // Refresh table
      } catch (err) {
        alert(err.response?.data?.message || "Error deleting user");
      }
    }
  };

  // --- TABLE COLUMNS ---
  const columns = [
    {
      header: "User Details",
      key: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-[#800020] font-bold text-xs">
            {row.name ? row.name.charAt(0) : "U"}
          </div>
          <div>
            <span className="font-bold text-gray-800 block text-sm">{row.name}</span>
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              <Mail size={10} /> {row.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      key: "role",
      render: (row) => (
        <span className={`flex items-center gap-1 text-xs font-semibold ${
          row.role?.includes("admin") ? "text-[#800020]" : "text-blue-600"
        }`}>
          {row.role?.includes("admin") ? <Shield size={12} /> : <User size={12} />}
          {row.role}
        </span>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
          row.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {row.status || "Active"}
        </span>
      ),
    },
    {
      header: "Joined",
      key: "joined",
      render: (row) => (
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Calendar size={12} /> {row.joined ? new Date(row.joined).toLocaleDateString() : "N/A"}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <button className="bg-[#800020] text-white px-5 py-2 rounded-lg flex items-center gap-2">
          <UserPlus size={18} /> Add New Staff
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#800020]" /></div>
      ) : (
        <CommonTable 
          columns={columns} 
          data={users || []} 
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default UserManagement;