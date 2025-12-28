import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import CommonTable from "../Ui/CommonTable";
import {
  PlusCircle, Package, X, Search, UploadCloud, Layers,
} from "lucide-react";

const ProductManagement = () => {
  // --- CONFIG ---
  const BACKEND_URL = "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // States for Searchable Category dropdown
  const [categorySearch, setCategorySearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    size: "",
    description: "",
    designType: "product",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // --- হেল্পার ফাংশন: ইমেজ পাথ সঠিকভাবে তৈরি করা ---
  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/150?text=No+Image";
    
    // ১. যদি পূর্ণাঙ্গ URL (Cloudinary/External) থাকে
    if (path.startsWith("http")) return path;

    // ২. ডাটাবেসে যদি "/uploads/name.png" বা "uploads/name.png" থাকে
    if (path.includes("uploads/")) {
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      return `${BACKEND_URL}${cleanPath}`;
    }

    // ৩. ডাটাবেসে যদি শুধু "banner.png" থাকে (যেমন আপনার seed.js থেকে এসেছে)
    const fileName = path.startsWith("/") ? path.slice(1) : path;
    return `${BACKEND_URL}/uploads/${fileName}`;
  };

  // --- FETCH FUNCTIONS ---
  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/products`);
      const allData = Array.isArray(response.data) ? response.data : response.data.products || [];
      
      // শুধুমাত্র স্টোর প্রোডাক্ট বা প্রোডাক্ট স্লাইডার ফিল্টার করা
      const filtered = allData.filter(item => 
        item.designType === 'product' || item.designType === 'productslide'
      );
      
      setProducts(filtered);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  }, [BACKEND_URL]);

  const fetchCategories = async () => {
    try {
      const catRes = await axios.get(`${BACKEND_URL}/api/categories`);
      setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data.categories || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [fetchProducts]);

  // --- FORM LOGIC ---
  const resetForm = () => {
    setEditingId(null);
    setImageFile(null);
    setImagePreview(null);
    setCategorySearch("");
    setFormData({
      name: "", category: "", price: "", stock: "", size: "", description: "", designType: "product",
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    // সব টেক্সট ডাটা FormData-তে যোগ করা
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    
    // ফাইল যোগ করা
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      const url = editingId 
        ? `${BACKEND_URL}/api/products/${editingId}` 
        : `${BACKEND_URL}/api/products/add`;
      
      const method = editingId ? "put" : "post";

      await axios({
        method: method,
        url: url,
        data: data,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsModalOpen(false);
      resetForm();
      fetchProducts();
      alert(editingId ? "Product Updated Successfully!" : "Product Created Successfully!");
    } catch (err) {
      console.error("Submission error:", err);
      alert(err.response?.data?.message || "Error saving product. Check server console.");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      size: product.size || "",
      description: product.description || "",
      designType: product.designType || "product",
    });
    setCategorySearch(product.category || "");
    setImagePreview(getImageUrl(product.imageURL)); 
    setIsModalOpen(true);
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await axios.delete(`${BACKEND_URL}/api/products/${product._id}`);
        fetchProducts();
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  // ক্যাটাগরি ফিল্টারিং লজিক
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <Package className="text-[#800020]" size={32} /> Product Inventory
          </h2>
          <p className="text-gray-500 text-sm mt-1">Manage your store products and sliders</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-[#800020] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl hover:shadow-[#80002033] hover:-translate-y-0.5 transition-all"
        >
          <PlusCircle size={20} /> Add New Product
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <CommonTable
          columns={[
            { 
              header: "Preview", 
              render: (row) => (
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                  <img 
                    src={getImageUrl(row.imageURL)} 
                    className="w-full h-full object-cover" 
                    alt={row.name} 
                    onError={(e) => { e.target.src = "https://placehold.co/150?text=Error"; }}
                  /> 
                </div>
              )
            },
            { header: "Product Name", key: "name" },
            { 
              header: "Design Type", 
              render: (row) => (
                <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-tighter ${
                  row.designType === 'productslide' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                }`}>
                  {row.designType}
                </span>
              )
            },
            { header: "Category", key: "category" },
            { header: "Price", render: (row) => <span className="font-bold text-gray-700">৳{row.price}</span> },
            { header: "Stock", render: (row) => <span className={row.stock < 5 ? "text-red-500 font-bold" : ""}>{row.stock} pcs</span> },
          ]}
          data={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-3xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
              <h3 className="text-2xl font-black text-gray-800">
                {editingId ? "Edit Product Information" : "Add New Product to Shop"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"><X /></button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Image Upload */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Media</label>
                  {!imagePreview ? (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-200 rounded-[1.5rem] cursor-pointer hover:bg-gray-50 hover:border-[#800020] transition-all group">
                      <div className="p-4 bg-gray-50 rounded-full group-hover:bg-[#80002011] transition-colors">
                        <UploadCloud className="w-10 h-10 text-gray-300 group-hover:text-[#800020]" />
                      </div>
                      <span className="text-sm font-bold text-gray-400 mt-4">Drop image here or click</span>
                      <p className="text-[10px] text-gray-300 uppercase mt-1">PNG, JPG up to 5MB</p>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  ) : (
                    <div className="relative w-full h-64">
                      <img src={imagePreview} className="w-full h-full object-cover rounded-[1.5rem] border border-gray-100" alt="Preview" />
                      <button 
                        type="button" 
                        onClick={() => { setImageFile(null); setImagePreview(null); }} 
                        className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-xl hover:bg-red-600 transition-colors border-4 border-white"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Layers size={14} /> Display Strategy
                  </label>
                  <select 
  className="..."
  value={formData.designType}
  onChange={(e) => setFormData({...formData, designType: e.target.value})}
>
  <option value="product">Store (Standard Product)</option>
  <option value="productslide">Product (Featured Slider)</option>
  <option value="homeslide">Home slider (Main)</option>
  <option value="homecatslide">Home Cat Slider</option>
  <option value="bannerslide">Banner Slider</option> {/* এখানে ভুল ছিল */}
  <option value="blog">Blog</option>
  <option value="design">Other Design</option>
</select>
                </div>
              </div>

              {/* Right Column: Details */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Name</label>
                  <input 
                    required 
                    placeholder="e.g. Traditional Handloom Saree"
                    className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl outline-none focus:border-[#800020] focus:bg-white font-bold transition-all" 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  />
                </div>

                <div className="relative" ref={dropdownRef}>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Collection / Category</label>
                  <div className="relative mt-2">
                    <input 
                      type="text" 
                      required 
                      className="w-full p-4 pl-12 bg-gray-50 border-2 border-gray-50 rounded-2xl outline-none focus:border-[#800020] focus:bg-white font-bold transition-all" 
                      placeholder="Search category..." 
                      value={categorySearch} 
                      onChange={(e) => { 
                        setCategorySearch(e.target.value); 
                        setFormData({ ...formData, category: e.target.value }); 
                        setShowDropdown(true); 
                      }} 
                      onFocus={() => setShowDropdown(true)} 
                    />
                    <Search className="absolute left-4 top-4.5 text-gray-400" size={20} />
                  </div>
                  
                  {/* Category Dropdown */}
                  {showDropdown && filteredCategories.length > 0 && (
                    <div className="absolute w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 max-h-48 overflow-y-auto">
                      {filteredCategories.map((cat) => (
                        <button
                          key={cat._id}
                          type="button"
                          className="w-full text-left p-4 hover:bg-gray-50 font-bold text-gray-600 transition-colors border-b border-gray-50 last:border-0"
                          onClick={() => {
                            setFormData({ ...formData, category: cat.name });
                            setCategorySearch(cat.name);
                            setShowDropdown(false);
                          }}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price (৳)</label>
                    <input 
                      type="number" 
                      required
                      placeholder="0.00" 
                      className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl outline-none focus:border-[#800020] focus:bg-white font-bold" 
                      value={formData.price} 
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inventory</label>
                    <input 
                      type="number" 
                      required
                      placeholder="0" 
                      className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl outline-none focus:border-[#800020] focus:bg-white font-bold" 
                      value={formData.stock} 
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Short Description</label>
                    <textarea 
                      rows="3"
                      placeholder="Tell more about the product..."
                      className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl outline-none focus:border-[#800020] focus:bg-white font-bold resize-none" 
                      value={formData.description} 
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    />
                </div>
              </div>

              {/* Actions */}
              <div className="md:col-span-2 flex gap-4 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 p-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] p-4 bg-[#800020] text-white rounded-2xl font-black text-lg shadow-xl shadow-[#80002033] hover:bg-[#600018] transition-all"
                >
                  {editingId ? "Update Product" : "Confirm & Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;