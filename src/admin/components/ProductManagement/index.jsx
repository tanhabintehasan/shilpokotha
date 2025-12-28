import React, { useState, useEffect, useRef, useCallback } from "react";
// Import axiosInstance (Make sure the path is correct)
import axiosInstance from '../api/axiosInstance'; 
import CommonTable from "../Ui/CommonTable";
import {
  PlusCircle, Package, X, Search, UploadCloud,
} from "lucide-react";

const ProductManagement = () => {
  // CONFIG: Local fallback needed only for images
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://shilpokotha-backend-8o4q410ae-tanhabintehasans-projects.vercel.app";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [categorySearch, setCategorySearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

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

  const getImageUrl = (path) => {
    if (!path || path === "null" || path === "undefined") {
      return "https://placehold.co/150?text=No+Image";
    }
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return cleanPath.includes("uploads/") 
      ? `${BACKEND_URL}${cleanPath}` 
      : `${BACKEND_URL}/uploads${cleanPath}`;
  };

  // FETCH PRODUCTS
  const fetchProducts = useCallback(async () => {
    try {
      // FIX: Use axiosInstance and relative path only
      const response = await axiosInstance.get('/api/products');
      const rawData = response.data;
      
      let allData = [];
      if (Array.isArray(rawData)) allData = rawData;
      else if (rawData?.products && Array.isArray(rawData.products)) allData = rawData.products;
      else if (rawData?.data && Array.isArray(rawData.data)) allData = rawData.data;

      const filtered = allData.filter(item => 
        item.designType === 'product' || item.designType === 'productslide'
      );
      setProducts(filtered);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    }
  }, []);

  // FETCH CATEGORIES
  const fetchCategories = async () => {
    try {
      const catRes = await axiosInstance.get('/api/categories');
      const rawCat = catRes.data;
      
      let finalCats = [];
      if (Array.isArray(rawCat)) finalCats = rawCat;
      else if (rawCat?.categories && Array.isArray(rawCat.categories)) finalCats = rawCat.categories;
      else if (rawCat?.data && Array.isArray(rawCat.data)) finalCats = rawCat.data;

      setCategories(finalCats);
    } catch (err) {
      console.error("Fetch Error:", err);
      setCategories([]);
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
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (imageFile) data.append("image", imageFile);

    try {
      const endpoint = editingId ? `/api/products/${editingId}` : `/api/products/add`;
      const method = editingId ? "put" : "post";

      // Use axiosInstance for global config
      await axiosInstance({
        method: method,
        url: endpoint,
        data: data,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsModalOpen(false);
      resetForm();
      fetchProducts();
      alert("Success!");
    } catch (err) {
      console.error("Submission error:", err);
      alert(err.response?.data?.message || "Error saving product.");
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
    setImagePreview(getImageUrl(product.imageURL || product.image)); 
    setIsModalOpen(true);
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Delete "${product.name}"?`)) {
      try {
        await axiosInstance.delete(`/api/products/${product._id}`);
        fetchProducts();
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  const filteredCategories = (categories || []).filter(cat => 
    cat?.name?.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    // ... আপনার বাকি JSX কোড একই থাকবে (কোনো পরিবর্তন নেই) ...
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* (বাকি JSX কোড এখান থেকে শুরু হবে যা আপনার ফাইলে ছিল) */}
    </div>
  );
};

export default ProductManagement;