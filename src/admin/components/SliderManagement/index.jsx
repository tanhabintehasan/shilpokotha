import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CommonTable from "../Ui/CommonTable";
import {
  Upload,
  ArrowLeft,
  Image as ImageIcon,
  X,
  PlusCircle,
  Palette,
  Tag,
  DollarSign,
  Package,
} from "lucide-react";

const SliderManagement = () => {
  const BACKEND_URL = "http://localhost:5000";

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

  // --- হেল্পার ফাংশন: আপনার দেওয়া নতুন ইমেজ লজিক ---
  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/150?text=No+Image";
    if (path.startsWith("http")) return path;
    
    // ডাটাবেসে যদি "/uploads/name.png" বা "uploads/name.png" থাকে
    if (path.includes("uploads/")) {
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      return `${BACKEND_URL}${cleanPath}`;
    }

    // ডাটাবেসে যদি শুধু "banner.png" থাকে
    const fileName = path.startsWith("/") ? path.slice(1) : path;
    return `${BACKEND_URL}/uploads/${fileName}`;
  };

  const fetchZoneData = useCallback(async (zoneId) => {
    if (!zoneId) return;
    try {
      const res = await axios.get(`${BACKEND_URL}/api/product-slider/active/${zoneId}`);
      setSliders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching slider data:", err);
    }
  }, [BACKEND_URL]);

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
      const url = editingId
        ? `${BACKEND_URL}/api/product-slider/update/${editingId}`
        : `${BACKEND_URL}/api/product-slider/add`;
      const method = editingId ? "put" : "post";

      await axios({
        method,
        url,
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
    setImagePreview(getImageUrl(asset.imageURL));
    setIsModalOpen(true);
  };

  const handleToggleActive = async (id) => {
    try {
      await axios.patch(`${BACKEND_URL}/api/product-slider/toggle/${id}`);
      fetchZoneData(activeZone.id);
    } catch (err) {
      alert("Toggle failed");
    }
  };

  const handleDelete = async (asset) => {
    if (window.confirm("Delete this asset?")) {
      try {
        await axios.delete(`${BACKEND_URL}/api/product-slider/delete/${asset._id}`);
        fetchZoneData(activeZone.id);
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  if (view === "selection") {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-black text-gray-800 mb-2">Website Asset Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {zones.map((zone) => (
            <button key={zone.id} onClick={() => handleZoneClick(zone)} className="flex flex-col items-center p-8 bg-white border-2 border-dashed border-gray-200 rounded-[2.5rem] hover:border-[#800020] transition-all group">
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
      <button onClick={() => setView("selection")} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#800020] mb-8 group">
        <ArrowLeft size={18} /> Back to Selection
      </button>

      <div className="flex justify-between items-end mb-10">
        <h2 className="text-4xl font-black text-gray-800">{activeZone.title}</h2>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-[#800020] text-white px-8 py-4 rounded-2xl font-black flex gap-3 items-center">
          <PlusCircle size={20} /> Add New Asset
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-2xl overflow-hidden">
        <CommonTable
          columns={[
            {
              header: "Preview",
              render: (row) => (
                <div className={`overflow-hidden border-2 border-white ring-1 ring-gray-100 ${activeZone.id === 'homecatslide' ? 'w-14 h-14 rounded-full' : 'w-24 h-12 rounded-xl'}`}>
                  <img src={getImageUrl(row.imageURL)} className="w-full h-full object-cover" alt={row.name} onError={(e) => { e.target.src = "https://placehold.co/150?text=Error"; }} />
                </div>
              ),
            },
            { header: "Name", key: "name", render: (row) => <span className="font-bold">{row.name}</span> },
            // Product Slide হলে ক্যাটাগরি, প্রাইস, স্টক দেখাবে, নাহলে শুধু টাইপ
            ...(activeZone.id === 'productslide' ? [
                { header: "Category", key: "category", render: (row) => <span className="text-xs px-2 py-1 bg-gray-100 rounded font-bold uppercase">{row.category}</span> },
                { header: "Price", render: (row) => <span className="font-black text-[#800020]">৳{row.price}</span> },
                { header: "Stock", render: (row) => <span className="font-bold">{row.stock} pcs</span> },
            ] : [
                { header: "Category", render: () => <span className="text-gray-400">Slider Asset</span> }
            ]),
            {
              header: "Status",
              render: (row) => (
                <button onClick={() => handleToggleActive(row._id)} className={`px-3 py-1 rounded-full text-[10px] font-black ${row.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  {row.isActive ? 'ACTIVE' : 'HIDDEN'}
                </button>
              )
            },
          ]}
          data={sliders}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-10 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3"><Upload className="text-[#800020]" /> New Entry</h3>
               <button onClick={() => setIsModalOpen(false)}><X size={28} className="text-gray-300 hover:text-red-500" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                {!imagePreview ? (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-4 border-dashed border-gray-100 rounded-[2rem] cursor-pointer hover:bg-gray-50 transition-all">
                    <Upload size={32} className="text-gray-300 mb-2" />
                    <p className="text-xs font-bold text-gray-400">Upload Image</p>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
                    }} />
                  </label>
                ) : (
                  <div className="relative h-48">
                    <img src={imagePreview} className="w-full h-full object-cover rounded-[2rem] border-4 border-white shadow-md" alt="Preview" />
                    <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full"><X size={16} /></button>
                  </div>
                )}
              </div>

              {/* Input Grid: শুধুমাত্র productslide এর জন্য বিস্তারিত ফিল্ড */}
              {activeZone.id === 'productslide' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Tag size={12}/> Category</label>
                      <input className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#800020] outline-none font-bold text-sm" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="e.g. Silk" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><DollarSign size={12}/> Price</label>
                      <input type="number" className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#800020] outline-none font-bold text-sm" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Package size={12}/> Stock</label>
                    <input type="number" className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#800020] outline-none font-bold text-sm" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Asset Title</label>
                <input required placeholder="Item Name..." className="w-full p-5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#800020] font-bold" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-[2] p-5 bg-[#800020] text-white rounded-2xl font-black shadow-xl hover:bg-[#600018]">Save Asset</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 p-5 text-gray-400 font-bold hover:bg-gray-50 rounded-2xl">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SliderManagement;