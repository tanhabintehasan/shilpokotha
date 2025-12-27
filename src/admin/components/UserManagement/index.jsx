import React, { useState } from "react";
import CommonTable from "../Ui/CommonTable";
import { UserPlus, Shield, User, Mail, Calendar } from "lucide-react";

const UserManagement = () => {
  // Mock Data for Customers and Staff
  const [users] = useState([
    {
      id: 1,
      name: "Siddique Ahmed",
      email: "siddique@shilpokotha.com",
      role: "Super Admin",
      status: "Active",
      joined: "01 Jan 2024",
      spend: "N/A",
    },
    {
      id: 2,
      name: "Anika Rahman",
      email: "anika.r@gmail.com",
      role: "Customer",
      status: "Active",
      joined: "12 Feb 2024",
      spend: "৳12,500",
    },
    {
      id: 3,
      name: "Tanvir Hossain",
      email: "tanvir88@yahoo.com",
      role: "Customer",
      status: "Inactive",
      joined: "05 Mar 2024",
      spend: "৳4,200",
    },
    {
      id: 4,
      name: "Maya Islam",
      email: "maya.staff@shilpokotha.com",
      role: "Editor",
      status: "Active",
      joined: "10 Mar 2024",
      spend: "N/A",
    },
    {
      id: 5,
      name: "Zayan Khan",
      email: "zayan@outlook.com",
      role: "Customer",
      status: "Banned",
      joined: "15 Mar 2024",
      spend: "৳0",
    },
  ]);

  const columns = [
    {
      header: "User Details",
      key: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-[#800020] font-bold text-xs">
            {row.name.charAt(0)}
          </div>
          <div>
            <span className="font-bold text-gray-800 block text-sm">
              {row.name}
            </span>
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              <Mail size={10} />
              {row.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      key: "role",
      render: (row) => (
        <span
          className={`flex items-center gap-1 text-xs font-semibold ${
            row.role.includes("Admin") ? "text-[#800020]" : "text-blue-600"
          }`}
        >
          {row.role.includes("Admin") || row.role === "Editor" ? (
            <Shield size={12} />
          ) : (
            <User size={12} />
          )}
          {row.role}
        </span>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
            row.status === "Active"
              ? "bg-green-100 text-green-700"
              : row.status === "Inactive"
              ? "bg-gray-100 text-gray-600"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Joined",
      key: "joined",
      render: (row) => (
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Calendar size={12} /> {row.joined}
        </span>
      ),
    },
    { header: "Total Spend", key: "spend" },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <p className="text-sm text-gray-500">
            Manage your staff permissions and view customer purchase history.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#800020] text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-md hover:bg-[#600018] transition-all">
          <UserPlus size={18} /> Add New Staff
        </button>
      </div>

      {/* User Type Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Total Customers
          </p>
          <p className="text-3xl font-black text-gray-800 mt-2">1,482</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Active Staff
          </p>
          <p className="text-3xl font-black text-gray-800 mt-2">5</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            New Today
          </p>
          <p className="text-3xl font-black text-[#800020] mt-2">+12</p>
        </div>
      </div>

      <CommonTable
        columns={columns}
        data={users}
        onEdit={(r) => console.log("Edit User", r.id)}
        onDelete={(r) => console.log("Delete User", r.id)}
        onView={(r) => alert(`Opening profile for ${r.name}`)}
      />
    </div>
  );
};

export default UserManagement;
