import React, { useState, useEffect } from "react";
import axios from "axios";
import CommonTable from "../Ui/CommonTable";
import { PlusCircle, X, LayoutGrid, Eye, Loader2, AlertCircle } from "lucide-react";
import axiosInstance from '../api/axiosInstance';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    parent: "None",
    icon: "📦",
    description: "",
  });

  // --- API Base URL ---
  const API_BASE = "http://localhost:5000/api/categories";

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axiosInstance.get(API_BASE);
      
      // Safety check for data structure
      const finalData = Array.isArray(res.data) ? res.data : [];
      setCategories(finalData);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to load categories. Is the server running?");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedCategory(null);
    setFormData({ name: "", parent: "None", icon: "📦", description: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setIsEditing(true);
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      parent: category.parent || "None",
      icon: category.icon || "📦",
      description: category.description || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && selectedCategory?._id) {
        await axios.put(`${API_BASE}/${selectedCategory._id}`, formData);
      } else {
        await axiosInstance.post(`${API_BASE}/add`, formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      alert("❌ Error: " + (err.response?.data?.message || "Server Error"));
    }
  };

  const handleDelete = async (row) => {
    if (window.confirm(`Are you sure you want to delete "${row.name}"?`)) {
      try {
        await axios.delete(`${API_BASE}/${row._id}`);
        fetchCategories();
      } catch (err) {
        alert("Could not delete item.");
      }
    }
  };

  const columns = [
    {
      header: "Category Name",
      key: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <span className="text-2xl">{row.icon || "📦"}</span>
          <span className="font-bold text-gray-800">{row.name}</span>
        </div>
      ),
    },
    {
      header: "Type",
      key: "parent",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold ${
            row.parent === "None"
              ? "bg-indigo-50 text-indigo-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {row.parent === "None" ? "Main Category" : `Sub of ${row.parent}`}
        </span>
      ),
    },
    {
        header: "Slug",
        key: "slug",
        render: (row) => <code className="text-[10px] bg-gray-100 px-2 py-1 rounded">{row.slug}</code>
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
          <LayoutGrid className="text-[#800020]" /> Category Management
        </h2>
        <button
          onClick={handleOpenAdd}
          className="bg-[#800020] text-white px-6 py-2.5 rounded-xl font-bold flex gap-2 hover:bg-red-900 transition-all shadow-lg shadow-red-900/20"
        >
          <PlusCircle size={18} /> Add New Category
        </button>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="animate-spin text-[#800020] mb-2" size={40} />
          <p className="text-gray-500 font-medium">Fetching your data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl flex items-center gap-4 text-red-700">
          <AlertCircle />
          <p>{error}</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="text-5xl mb-4 text-gray-300 flex justify-center"><LayoutGrid size={48} /></div>
          <h3 className="text-xl font-bold text-gray-600">No Categories Found</h3>
          <p className="text-gray-400">Click "Add New" to get started or run your seed script.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <CommonTable
            columns={columns}
            data={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}

      {/* Modal - Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">
                {isEditing ? "📝 Edit Category" : "✨ New Category"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Category Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#800020] outline-none"
                  placeholder="e.g. Traditional Wear"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Parent Category</label>
                <select
                  value={formData.parent}
                  onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                  className="w-full p-3 border rounded-xl bg-white"
                >
                  <option value="None">None (Make this a Main Category)</option>
                  {categories
                    .filter(c => c.parent === "None" && c._id !== selectedCategory?._id)
                    .map(cat => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))
                  }
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 p-3 border rounded-xl font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 p-3 bg-[#800020] text-white rounded-xl font-bold hover:bg-red-900 transition-all shadow-md shadow-red-900/20"
                >
                  {isEditing ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;