import React, { useState } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { IoClose } from "react-icons/io5";
import { FaRegSquarePlus } from "react-icons/fa6";

const Cetagorypanel = ({ isOpenCatPanel, setIsOpenCatPanel }) => {
  const [openIndex, setOpenIndex] = useState(null); // Track which submenu is open

  const toggleDrawer = (newOpen) => () => {
    setIsOpenCatPanel(newOpen);
  };

  // Toggle submenu open/close
  const toggleSubmenu = (index) => {
    if (openIndex === index) {
      setOpenIndex(null); // Close if already open
    } else {
      setOpenIndex(index); // Open clicked submenu
    }
  };

  const categories = [
    {
      name: "Fashion",
      link: "/fashion",
      submenu: ["Traditional", "Handcrafted", "Contemporary", "Winter"],
    },
    {
      name: "Bags",
      link: "/bags",
      submenu: ["Hand Bags", "Tote Bags", "Jute Bags", "Backpacks"],
    },
    {
      name: "Footwear",
      link: "/footwear",
      submenu: [
        "Traditional Footwear",
        "Leather Sandals",
        "Flats",
        "Sneakers",
        "Ethnic Footwear",
      ],
    },
    {
      name: "Beauty",
      link: "/beauty",
      submenu: [
        "Multani Mati",
        "Herbal Soaps",
        "Natural Face Packs",
        "Other Local Products",
      ],
    },
    {
      name: "Jewellery",
      link: "/jewellery",
      submenu: [
        "Gold Jewellery",
        "Silver Jewellery",
        "Tribal/Traditional Jewellery",
        "Handmade Jewellery",
      ],
    },
    {
      name: "Wellness",
      link: "/wellness",
      submenu: [
        "Herbal Oils",
        "Natural Teas",
        "Traditional Remedies",
        "Other Local Products",
      ],
    },
    {
      name: "Home Decor",
      link: "/home-decor",
      submenu: [
        "Bamboo & Cane Products",
        "Pottery & Clay Items",
        "Handcrafted Fabrics & Textiles",
        "Brass & Bell Metal Items",
        "Other Traditional Products",
      ],
    },
  ];

  return (
    <Drawer
      open={isOpenCatPanel}
      onClose={toggleDrawer(false)}
      PaperProps={{ style: { backgroundColor: "#EADDCA" } }} // Full sidebar background
    >
      <Box sx={{ width: 250, p: 4 }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-[500]">Shop By Categories</h3>
          <IoClose
            onClick={toggleDrawer(false)}
            className="cursor-pointer text-[20px]"
          />
        </div>

        <ul className="w-full">
          {categories.map((cat, idx) => (
            <li key={idx} className="list-none relative mb-2">
              <Button
                className="!w-full !justify-between !bg-[#EADDCA] !text-black !normal-case !text-[13px] font-[400]"
                onClick={() => toggleSubmenu(idx)}
              >
                <Link to={cat.link} className="link">
                  {cat.name}
                </Link>
                <FaRegSquarePlus
                  className={`transition-transform ${
                    openIndex === idx ? "rotate-45" : ""
                  }`}
                />
              </Button>

              {/* Submenu */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  openIndex === idx
                    ? "max-h-[500px] opacity-100 visible"
                    : "max-h-0 opacity-0 invisible"
                }`}
              >
                <ul className="ml-4 mt-1">
                  {cat.submenu.map((item, subIdx) => (
                    <li key={subIdx} className="list-none mb-1">
                      <Button className="!w-full !justify-start !bg-[#B89B7A] !text-black !text-[13px] !normal-case font-[400]">
                        {item}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </Box>
    </Drawer>
  );
};

export default Cetagorypanel;
