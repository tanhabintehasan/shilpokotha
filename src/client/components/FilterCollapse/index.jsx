import React, { useState, useEffect } from "react";
import { ChevronDown, Plus, Minus, Star } from "lucide-react";

const FilterCollapse = () => {
  // 1. Unified State - Initialized as empty arrays to prevent .includes/find errors
  const [selectedCategories, setSelectedCategories] = useState(["Fashion"]);
  const [openSections, setOpenSections] = useState({});
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [price, setPrice] = useState(60000);
  const [selectedSize, setSelectedSize] = useState("M");

  // Data Configuration
  const categoryData = [
    { name: "Fashion", sub: ["Men", "Women", "Boys", "Girls"] },
    { name: "Bags", list: ["Hand Bags", "Tote Bags", "Jute Bags", "Backpacks"] },
    { name: "Footwear", sub: ["Men", "Women", "Boys", "Girls"] },
    { name: "Beauty", list: ["Multani Mati", "Herbal Soaps", "Natural Face Packs", "Other Local Products"] },
    { name: "Jewellery", list: ["Gold", "Silver", "Tribal", "Handmade"] },
    { name: "Wellness", list: ["Herbal Oils", "Natural Teas", "Traditional Remedies"] },
    { name: "Home Decor", list: ["Bamboo & Cane", "Pottery", "Fabrics", "Brass"] },
  ];

  // Auto-initialize openSections based on data
  useEffect(() => {
    const initialOpen = {};
    categoryData.forEach(cat => {
      initialOpen[cat.name] = cat.name === "Fashion"; // Default 'Fashion' to open
    });
    setOpenSections(initialOpen);
  }, []);

  const toggleSection = (name) => {
    setOpenSections(prev => ({ 
      ...(prev || {}), 
      [name]: !prev?.[name] 
    }));
  };

  const handleToggleCategory = (cat) => {
    setSelectedCategories(prev => {
      // Defensive check: ensure prev is always an array
      const current = Array.isArray(prev) ? prev : [];
      return current.includes(cat) 
        ? current.filter(item => item !== cat) 
        : [...current, cat];
    });
  };

  const getSliderBackground = () => {
    const percentage = (price / 60000) * 100;
    return `linear-gradient(to right, #ff4d4d ${percentage}%, rgba(255, 255, 255, 0.2) ${percentage}%)`;
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 bg-gray-100 min-h-screen">
      <aside className="w-full max-w-[320px] bg-[#631212] h-screen sticky top-0 p-5 text-white shadow-xl overflow-y-auto 
        [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-[#5a1111]
        [&::-webkit-scrollbar-thumb]:bg-[#B89B7A]/40 [&::-webkit-scrollbar-thumb]:rounded-full">
        
        <h2 className="text-[18px] font-bold mb-6 flex items-center justify-between uppercase tracking-tight">
          Shop by Category
          <ChevronDown size={20} />
        </h2>

        {/* --- DYNAMIC CATEGORY RENDERING --- */}
        {/* Safety Check: ensure categoryData exists before mapping */}
        {(categoryData || []).map((section) => (
          <div key={section.name} className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <input
                type="checkbox"
                // x.includes crash prevention
                checked={(selectedCategories || []).includes(section.name)}
                onChange={() => handleToggleCategory(section.name)}
                className="w-5 h-5 accent-white rounded cursor-pointer"
              />
              <button
                onClick={() => toggleSection(section.name)}
                className="text-[15px] font-medium flex-1 text-left hover:text-[#B89B7A] transition-colors"
              >
                {section.name}
              </button>
              <span onClick={() => toggleSection(section.name)} className="cursor-pointer p-1">
                {openSections?.[section.name] ? <Minus size={14} /> : <Plus size={14} />}
              </span>
            </div>

            {openSections?.[section.name] && (
              <ul className="pl-8 space-y-1 mb-4 border-l border-white/10 ml-2">
                {/* Gender based sub-menus */}
                {section.sub?.map((cat, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => setActiveSubMenu(activeSubMenu === `${section.name}-${idx}` ? null : `${section.name}-${idx}`)}
                      className="text-white/70 hover:text-white text-[13px] py-1 w-full text-left flex justify-between items-center group"
                    >
                      {cat} 
                      <span className="text-white/30 group-hover:text-white">
                        {activeSubMenu === `${section.name}-${idx}` ? <Minus size={10}/> : <Plus size={10}/>}
                      </span>
                    </button>
                    {activeSubMenu === `${section.name}-${idx}` && (
                      <div className="pl-4 py-1 text-[12px] text-white/50 space-y-1 animate-in fade-in slide-in-from-left-1">
                        {["Traditional", "Handcrafted", "Contemporary"].map(item => (
                          <p key={item} className="cursor-pointer hover:text-white hover:translate-x-1 transition-transform">{item}</p>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
                
                {/* Simple List Sections */}
                {section.list?.map((item, idx) => (
                  <li key={idx} className="text-white/70 hover:text-white text-[13px] py-1 cursor-pointer hover:translate-x-1 transition-transform">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {/* --- FILTER BY PRICE --- */}
        <div className="mb-8 pt-6 border-t border-white/10">
          <h3 className="text-[15px] font-bold mb-4 uppercase tracking-wider text-white/90">Price Range</h3>
          <input
            type="range" min="0" max="60000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ background: getSliderBackground() }}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-white"
          />
          <div className="flex justify-between mt-3 text-[12px]">
            <span className="text-white/60">Min: <b className="text-white">৳ 0</b></span>
            <span className="text-white/60">Max: <b className="text-white">৳ {price}</b></span>
          </div>
        </div>

        {/* --- FILTER BY RATING --- */}
        <div className="mb-8 pt-4 border-t border-white/10">
          <h3 className="text-[15px] font-bold mb-4 uppercase tracking-wider text-white/90">Rating</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2].map((num) => (
              <label key={num} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 accent-white rounded" />
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} 
                      fill={i < num ? "#facc15" : "none"} 
                      stroke={i < num ? "#facc15" : "rgba(255,255,255,0.3)"} 
                    />
                  ))}
                </div>
                <span className="text-[11px] text-white/40 group-hover:text-white">& Up</span>
              </label>
            ))}
          </div>
        </div>

        {/* --- FILTER BY SIZE --- */}
        <div className="pb-10 pt-4 border-t border-white/10">
          <h3 className="text-[15px] font-bold mb-4 uppercase tracking-wider text-white/90">Available Sizes</h3>
          <div className="flex flex-wrap gap-2">
            {["XS", "S", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-10 h-10 flex items-center justify-center text-[12px] font-bold rounded-lg transition-all duration-300
                  ${selectedSize === size 
                    ? "bg-white text-[#631212] shadow-lg scale-110" 
                    : "bg-white/10 text-white border border-white/10 hover:bg-white/20"}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default FilterCollapse;