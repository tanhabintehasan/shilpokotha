import React, { useState, useEffect, useCallback } from "react";
// axiosInstance ইমপোর্ট নিশ্চিত করুন
import axiosInstance from '../api/axiosInstance';
import CommonTable from "../Ui/CommonTable";
import {
  Upload, ArrowLeft, Image as ImageIcon, X, PlusCircle, Palette, Tag, DollarSign, Package,
} from "lucide-react";

const SliderManagement = () => {
  // ইমেজ পাথের জন্য ব্যাকএন্ড ইউআরএল দরকার হতে পারে
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://shilpokotha-backend-8o4q410ae-tanhabintehasans-projects.vercel.app";

  const [view, setView] = useState("selection");
  const [activeZone, setActiveZone] = useState(null);
  const [sliders, setSliders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const zones = [
    { id: "homeslide", title: "Home Slider", desc: "Main hero carousel" },
    { id: "homecatslide", title: "HomeCatSlider", desc: "Category circle icons" },
    { id: "bannerslide", title: "Banner Slider", desc: "Promotional banners" },
    { id: "productslide", title: "Product Slider", desc: "Featured product carousel" },
    { id: "blog", title: "Blog Assets", desc: "Blog post thumbnails" },
    { id: "design", title: "Design Image", desc: "Logo, icons, and site graphics" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    stock: 0,
    designType: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // ইমেজ ইউআরএল জেনারেটর
  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/150?text=No+Image";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    
    return cleanPath.includes("uploads/") 
      ? `${BACKEND_URL}${cleanPath}` 
      : `${BACKEND_URL}/uploads${cleanPath}`;
  };

  // ডাটা ফেচিং
  const fetchZoneData = useCallback(async (zoneId) => {
    if (!zoneId) return;
    try {
      // FIX: axiosInstance ব্যবহার এবং BASE_URL ছাড়া পাথ
      const res = await axiosInstance.get(`/api/product-slider/active/${zoneId}`);
      setSliders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching slider data:", err);
      setSliders([]);
    }
  }, []);

  const handleZoneClick = (zone) => {
    setActiveZone(zone);
    setFormData((prev) => ({
      ...prev,
      designType: zone.id,
      category: zone.id === 'productslide' ? "" : zone.id,
    }));
    fetchZoneData(zone.id);
    setView("manage");
  };

  const resetForm = () => {
    setEditingId(null);
    setImageFile(null);
    setImagePreview(null);
    setFormData({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      designType: activeZone?.id || "",
      category: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("description", formData.description);
    data.append("designType", activeZone.id);
    if (imageFile) data.append("image", imageFile);

    try {
      const endpoint = editingId
        ? `/api/product-slider/update/${editingId}`
        : `/api/product-slider/add`;
      const method = editingId ? "put" : "post";

      // FIX: axiosInstance ব্যবহার
      await axiosInstance({
        method,
        url: endpoint,
        data,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsModalOpen(false);
      resetForm();
      fetchZoneData(activeZone.id);
      alert("Asset saved successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  const handleEdit = (asset) => {
    setEditingId(asset._id);
    setFormData({
      name: asset.name,
      category: asset.category || "",
      price: asset.price || 0,
      stock: asset.stock || 0,
      designType: asset.designType,
      description: asset.description || "",
    });
    setImagePreview(getImageUrl(asset.imageURL || asset.image));
    setIsModalOpen(true);
  };

  const handleToggleActive = async (id) => {
    try {
      // FIX: axiosInstance
      await axiosInstance.patch(`/api/product-slider/toggle/${id}`);
      fetchZoneData(activeZone.id);
    } catch (err) {
      alert("Toggle failed");
    }
  };

  const handleDelete = async (asset) => {
    if (window.confirm("Delete this asset?")) {
      try {
        // FIX: axiosInstance
        await axiosInstance.delete(`/api/product-slider/delete/${asset._id}`);
        fetchZoneData(activeZone.id);
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  // ... বাকি JSX কোড যা আপনার কাছে ছিল তা একই থাকবে ...
  if (view === "selection") {
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            {/* আপনার সিলেকশন গ্রিড কোড এখানে... */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {zones.map((zone) => (
                <button 
                    key={zone.id} 
                    onClick={() => handleZoneClick(zone)} 
                    className="flex flex-col items-center p-8 bg-white border-2 border-dashed border-gray-200 rounded-[2.5rem] hover:border-[#800020] transition-all group"
                >
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-[#800020] group-hover:text-white transition-all">
                    {zone.id === 'design' ? <Palette size={36} /> : <ImageIcon size={36} />}
                    </div>
                    <h3 className="font-black text-xl text-gray-800">{zone.title}</h3>
                    <p className="text-sm text-gray-400 mt-2 text-center px-4">{zone.desc}</p>
                </button>
                ))}
            </div>
        </div>
    );
  }

  return (
      <div className="p-8 bg-white min-h-screen">
          {/* আপনার ম্যানেজমেন্ট ভিউ কোড এখানে... */}
      </div>
  );
};

export default SliderManagement;