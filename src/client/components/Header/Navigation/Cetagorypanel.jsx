import React, { useState } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { IoClose } from "react-icons/io5";
import { FaPlus, FaMinus } from "react-icons/fa6";

const Cetagorypanel = ({ isOpenCatPanel, setIsOpenCatPanel }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleDrawer = (newOpen) => () => {
    setIsOpenCatPanel(newOpen);
  };

  const toggleSubmenu = (e, index) => {
    // Prevent navigation when just clicking the toggle icon
    e.preventDefault();
    e.stopPropagation();
    setOpenIndex(openIndex === index ? null : index);
  };

  const categories = [
    { name: "Fashion", link: "/fashion", submenu: ["Traditional", "Handcrafted", "Contemporary", "Winter"] },
    { name: "Bags", link: "/bags", submenu: ["Hand Bags", "Tote Bags", "Jute Bags", "Backpacks"] },
    { name: "Footwear", link: "/footwear", submenu: ["Traditional", "Leather Sandals", "Flats", "Sneakers", "Ethnic"] },
    { name: "Beauty", link: "/beauty", submenu: ["Multani Mati", "Herbal Soaps", "Face Packs", "Local Products"] },
    { name: "Jewellery", link: "/jewellery", submenu: ["Gold", "Silver", "Tribal", "Handmade"] },
    { name: "Wellness", link: "/wellness", submenu: ["Herbal Oils", "Natural Teas", "Traditional Remedies"] },
    { name: "Home Decor", link: "/home-decor", submenu: ["Bamboo & Cane", "Pottery", "Fabrics", "Brass Items"] },
  ];

  return (
    <Drawer
      anchor="left"
      open={isOpenCatPanel}
      onClose={toggleDrawer(false)}
      PaperProps={{ 
        sx: { 
          backgroundColor: "#FDF7F0", // Softer cream background
          width: { xs: "280px", sm: "320px" },
          borderRight: "4px solid #631212" // Maroon accent border
        } 
      }}
    </Drawer>
      <Box sx={{ p: 0 }}>
        {/* Header Section */}
        <div className="flex items-center justify-between p-5 bg-[#631212] text-white">
          <h3 className="text-[16px] font-semibold uppercase tracking-widest">Categories</h3>
          <IoClose
            onClick={toggleDrawer(false)}
            className="cursor-pointer text-[24px] hover:rotate-90 transition-transform duration-300"
          />
        </div>

        <div className="p-4">
          <ul className="w-full space-y-1">
            {categories.map((cat, idx) => (
              <li key={idx} className="list-none border-b border-gray-200 last:border-0">
                <div className="flex items-center justify-between w-full">
                  <Link 
                    to={cat.link} 
                    onClick={toggleDrawer(false)}
                    className="flex-1 py-3 text-[14px] font-medium text-gray-800 hover:text-[#631212] transition-colors"
                  >
                    {cat.name}
                  </Link>
                  
                  <button
                    onClick={(e) => toggleSubmenu(e, idx)}
                    className="p-3 text-[#631212] hover:bg-gray-100 rounded-md transition-all"
                  >
                    {openIndex === idx ? <FaMinus size={12} /> : <FaPlus size={12} />}
                  </button>
                </div>

                {/* Submenu with Smooth Transition */}
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    openIndex === idx ? "max-h-[400px] mb-4" : "max-h-0"
                  }`}
                >
                  <ul className="bg-[#EADDCA]/30 rounded-lg py-2">
                    {cat.submenu.map((item, subIdx) => (
                      <li key={subIdx} className="list-none">
                        <Link
                          to={`${cat.link}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={toggleDrawer(false)}
                          className="block w-full px-6 py-2 text-[13px] text-gray-600 hover:text-[#631212] hover:translate-x-2 transition-all border-l-2 border-transparent hover:border-[#631212]"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Branding Footer inside Drawer */}
        <div className="absolute bottom-0 w-full p-6 text-center bg-[#FDF7F0]">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">
              Shilpokotha Tradition
            </p>
        </div>
      </Box>
    </Drawer>
  );
};

export default Cetagorypanel;