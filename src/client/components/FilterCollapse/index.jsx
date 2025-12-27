import React, { useState } from "react";
import { ChevronDown, Plus, Minus, Star } from "lucide-react";

const FilterCollapse = () => {
  // 1. Manage checkbox states (Fashion starts checked, others unchecked)
  const [selectedCategories, setSelectedCategories] = useState(["Fashion"]);
  const [isFashionOpen, setIsFashionOpen] = useState(true);
  const [isBagsOpen, setIsBagsOpen] = useState(false);
  const [isFootwearOpen, setIsFootwearOpen] = useState(false);
  const [isBeautyOpen, setIsBeautyOpen] = useState(false);
  const [isJewelleryOpen, setIsJewelleryOpen] = useState(false);
  const [isWellnessOpen, setIsWellnessOpen] = useState(false);
  const [isHomeDecorOpen, setIsHomeDecorOpen] = useState(false); // Add this line

  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [price, setPrice] = useState(60000);
  const [selectedSize, setSelectedSize] = useState("M");

  // Toggle Checkbox Logic
  const handleToggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((item) => item !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const getSliderBackground = () => {
    const percentage = (price / 60000) * 100;
    return `linear-gradient(to right, #ff4d4d ${percentage}%, rgba(255, 255, 255, 0.2) ${percentage}%)`;
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 bg-gray-100 min-h-screen">
      <aside
        className="w-full max-w-[320px] bg-[#631212] h-screen sticky top-0 p-5 text-white shadow-xl overflow-y-auto 
  [&::-webkit-scrollbar]:w-[6px]
  [&::-webkit-scrollbar-track]:bg-[#5a1111]
  [&::-webkit-scrollbar-thumb]:bg-[#B89B7A]/40 
  [&::-webkit-scrollbar-thumb]:rounded-full
  hover:[&::-webkit-scrollbar-thumb]:bg-[#B89B7A]/70"
      >
        <h2 className="text-[18px] font-bold mb-6 flex items-center justify-between uppercase tracking-tight">
          Shop by Category
          <ChevronDown size={20} />
        </h2>

        {/* --- 1. FASHION --- */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <input
              type="checkbox"
              checked={selectedCategories.includes("Fashion")}
              onChange={() => handleToggleCategory("Fashion")}
              className="w-5 h-5 accent-white rounded cursor-pointer"
            />
            <button
              onClick={() => setIsFashionOpen(!isFashionOpen)}
              className="text-[15px] font-medium flex-1 text-left"
            >
              Fashion
            </button>
            <span
              onClick={() => setIsFashionOpen(!isFashionOpen)}
              className="cursor-pointer"
            >
              {isFashionOpen ? <Minus size={14} /> : <Plus size={14} />}
            </span>
          </div>

          {isFashionOpen && (
            <ul className="pl-8 space-y-1 mb-4">
              {["Men", "Women", "Boys", "Girls"].map((cat, idx) => (
                <li key={idx}>
                  <button
                    onClick={() =>
                      setActiveSubMenu(
                        activeSubMenu === `fashion-${idx}`
                          ? null
                          : `fashion-${idx}`
                      )
                    }
                    className="text-white/70 hover:text-white text-[13px] py-1 w-full text-left flex justify-between items-center"
                  >
                    {cat} {activeSubMenu === `fashion-${idx}` ? "-" : "+"}
                  </button>
                  {activeSubMenu === `fashion-${idx}` && (
                    <div className="pl-4 py-1 text-[12px] text-white/50 space-y-1">
                      <p className="cursor-pointer hover:text-white">
                        Traditional
                      </p>
                      <p className="cursor-pointer hover:text-white">
                        Handcrafted
                      </p>
                      <p className="cursor-pointer hover:text-white">
                        Contemporary
                      </p>
                      <p className="cursor-pointer hover:text-white">Winter</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* --- 2. BAGS (NEW INTEGRATED SECTION) --- */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <input
              type="checkbox"
              checked={selectedCategories.includes("Bags")}
              onChange={() => handleToggleCategory("Bags")}
              className="w-5 h-5 accent-white rounded cursor-pointer"
            />
            <button
              onClick={() => setIsBagsOpen(!isBagsOpen)}
              className="text-[15px] font-medium flex-1 text-left"
            >
              Bags
            </button>
            <span
              onClick={() => setIsBagsOpen(!isBagsOpen)}
              className="cursor-pointer"
            >
              {isBagsOpen ? <Minus size={14} /> : <Plus size={14} />}
            </span>
          </div>

          {isBagsOpen && (
            <ul className="pl-8 space-y-1 mb-4">
              {["Hand Bags", "Tote Bags", "Jute Bags", "Backpacks"].map(
                (bag, idx) => (
                  <li
                    key={idx}
                    className="text-white/70 hover:text-white text-[13px] py-1 cursor-pointer"
                  >
                    {bag}
                  </li>
                )
              )}
            </ul>
          )}
        </div>

        {/* --- FOOTWEAR SECTION --- */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <input
              type="checkbox"
              checked={selectedCategories.includes("Footwear")}
              onChange={() => handleToggleCategory("Footwear")}
              className="w-5 h-5 accent-white rounded cursor-pointer"
            />
            <button
              onClick={() => setIsFootwearOpen(!isFootwearOpen)}
              className="text-[15px] font-medium flex-1 text-left"
            >
              Footwear
            </button>
            <span
              onClick={() => setIsFootwearOpen(!isFootwearOpen)}
              className="cursor-pointer"
            >
              {isFootwearOpen ? <Minus size={14} /> : <Plus size={14} />}
            </span>
          </div>

          {isFootwearOpen && (
            <ul className="pl-8 space-y-1 mb-4">
              {["Men", "Women", "Boys", "Girls"].map((cat, idx) => (
                <li key={idx}>
                  <button
                    onClick={() =>
                      setActiveSubMenu(
                        activeSubMenu === `footwear-${idx}`
                          ? null
                          : `footwear-${idx}`
                      )
                    }
                    className="text-white/70 hover:text-white text-[13px] py-1 w-full text-left flex justify-between items-center"
                  >
                    {cat} {activeSubMenu === `footwear-${idx}` ? "-" : "+"}
                  </button>

                  {/* Sub-categories specific to each gender */}
                  {activeSubMenu === `footwear-${idx}` && (
                    <div className="pl-4 py-1 text-[12px] text-white/50 space-y-1">
                      <p className="cursor-pointer hover:text-white">
                        Traditional Footwear
                      </p>
                      <p className="cursor-pointer hover:text-white">
                        Leather Sandals
                      </p>
                      <p className="cursor-pointer hover:text-white">Flats</p>
                      <p className="cursor-pointer hover:text-white">
                        Sneakers
                      </p>
                      <p className="cursor-pointer hover:text-white">
                        Ethnic Footwear
                      </p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* --- BEAUTY SECTION --- */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <input
              type="checkbox"
              checked={selectedCategories.includes("Beauty")}
              onChange={() => handleToggleCategory("Beauty")}
              className="w-5 h-5 accent-white rounded cursor-pointer"
            />
            <button
              onClick={() => setIsBeautyOpen(!isBeautyOpen)}
              className="text-[15px] font-medium flex-1 text-left"
            >
              Beauty
            </button>
            <span
              onClick={() => setIsBeautyOpen(!isBeautyOpen)}
              className="cursor-pointer"
            >
              {isBeautyOpen ? <Minus size={14} /> : <Plus size={14} />}
            </span>
          </div>

          {isBeautyOpen && (
            <ul className="pl-8 space-y-1 mb-4">
              {[
                "Multani Mati",
                "Herbal Soaps",
                "Natural Face Packs",
                "Other Local Products",
              ].map((item, idx) => (
                <li key={idx}>
                  <button className="text-white/70 hover:text-white text-[13px] py-1 w-full text-left">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* --- JEWELLERY SECTION --- */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <input
              type="checkbox"
              checked={selectedCategories.includes("Jewellery")}
              onChange={() => handleToggleCategory("Jewellery")}
              className="w-5 h-5 accent-white rounded cursor-pointer"
            />
            <button
              onClick={() => setIsJewelleryOpen(!isJewelleryOpen)}
              className="text-[15px] font-medium flex-1 text-left"
            >
              Jewellery
            </button>
            <span
              onClick={() => setIsJewelleryOpen(!isJewelleryOpen)}
              className="cursor-pointer"
            >
              {isJewelleryOpen ? <Minus size={14} /> : <Plus size={14} />}
            </span>
          </div>

          {isJewelleryOpen && (
            <ul className="pl-8 space-y-1 mb-4">
              {[
                "Gold Jewellery",
                "Silver Jewellery",
                "Tribal/Traditional Jewellery",
                "Handmade Jewellery",
              ].map((item, idx) => (
                <li key={idx}>
                  <button className="text-white/70 hover:text-white text-[13px] py-1 w-full text-left">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* --- WELLNESS SECTION --- */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <input
              type="checkbox"
              checked={selectedCategories.includes("Wellness")}
              onChange={() => handleToggleCategory("Wellness")}
              className="w-5 h-5 accent-white rounded cursor-pointer"
            />
            <button
              onClick={() => setIsWellnessOpen(!isWellnessOpen)}
              className="text-[15px] font-medium flex-1 text-left"
            >
              Wellness
            </button>
            <span
              onClick={() => setIsWellnessOpen(!isWellnessOpen)}
              className="cursor-pointer"
            >
              {isWellnessOpen ? <Minus size={14} /> : <Plus size={14} />}
            </span>
          </div>

          {isWellnessOpen && (
            <ul className="pl-8 space-y-1 mb-4">
              {[
                "Herbal Oils",
                "Natural Teas",
                "Traditional Remedies",
                "Other Local Products",
              ].map((item, idx) => (
                <li key={idx}>
                  <button className="text-white/70 hover:text-white text-[13px] py-1 w-full text-left">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* --- HOME DECOR SECTION --- */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <input
              type="checkbox"
              checked={selectedCategories.includes("Home Decor")}
              onChange={() => handleToggleCategory("Home Decor")}
              className="w-5 h-5 accent-white rounded cursor-pointer"
            />
            <button
              onClick={() => setIsHomeDecorOpen(!isHomeDecorOpen)}
              className="text-[15px] font-medium flex-1 text-left"
            >
              Home Decor
            </button>
            <span
              onClick={() => setIsHomeDecorOpen(!isHomeDecorOpen)}
              className="cursor-pointer"
            >
              {isHomeDecorOpen ? <Minus size={14} /> : <Plus size={14} />}
            </span>
          </div>

          {isHomeDecorOpen && (
            <ul className="pl-8 space-y-1 mb-4">
              {[
                "Bamboo & Cane Products",
                "Pottery & Clay Items",
                "Handcrafted Fabrics & Textiles",
                "Brass & Bell Metal Items",
                "Other Traditional Products",
              ].map((item, idx) => (
                <li key={idx}>
                  <button className="text-white/70 hover:text-white text-[13px] py-1 w-full text-left">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* --- FILTER BY PRICE --- */}
        <div className="mb-8 pt-4 border-t border-white/10">
          <h3 className="text-[15px] font-bold mb-4">Filter By Price</h3>
          <input
            type="range"
            min="0"
            max="60000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ background: getSliderBackground() }}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[#ff4d4d]"
          />
          <div className="flex justify-between mt-3 text-[12px]">
            <span className="text-white/70">
              From: <b className="text-white">BDT 0</b>
            </span>
            <span className="text-white/70">
              To: <b className="text-white">BDT {price}</b>
            </span>
          </div>
        </div>

        {/* --- FILTER BY RATING --- */}
        <div className="mb-8">
          <h3 className="text-[15px] font-bold mb-4">Filter By Rating</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2].map((num) => (
              <label
                key={num}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input type="checkbox" className="w-5 h-5 accent-white" />
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < num ? "#facc15" : "none"}
                      stroke={i < num ? "none" : "white"}
                    />
                  ))}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* --- FILTER BY SIZE --- */}
        <div className="pb-10">
          <h3 className="text-[15px] font-bold mb-4">Filter By Size</h3>
          <div className="flex flex-wrap gap-2">
            {["XS", "S", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`min-w-[50px] h-[38px] flex items-center justify-center border text-[13px] font-bold rounded transition-all
                  ${
                    selectedSize === size
                      ? "bg-[#2587d1] text-white border-[#2587d1]"
                      : "bg-white text-black border-gray-300 hover:border-[#2587d1]"
                  }
                `}
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
