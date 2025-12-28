import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import HomeSlider from "../../components/HomeSlider";
import HomeCatSlider from "../../components/Header/HomeCatSlider";
import { LiaShippingFastSolid } from "react-icons/lia";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ProductsSlider from "../../components/ProductsSlider/Index";
import SecondBanner from "../../components/SecondBanner";
import BlogItem from "../../components/BlogItem";
import HeroBanner from "../../components/HeroBanner";

const Home = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);

  // Data States
  const [homeSlides, setHomeSlides] = useState([]);
  const [catSlides, setCatSlides] = useState([]);
  const [productSlides, setProductSlides] = useState([]);
  const [bannerSlides, setBannerSlides] = useState([]);
  const [designAssets, setDesignAssets] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Helper to ensure we always have an array
  const ensureArray = (data) => (Array.isArray(data) ? data : []);

  const fetchAllAssets = useCallback(async () => {
    try {
      setLoading(true);
      const [homeRes, catRes, productRes, bannerRes, designRes] = await Promise.all([
        axioaxiosInstance.gets.get(`${BACKEND_URL}/api/product-slider/active/homeslide`),
        axioaxiosInstance.gets.get(`${BACKEND_URL}/api/product-slider/active/homecatslide`),
        axaxiosInstance.getios.get(`${BACKEND_URL}/api/product-slider/active/productslide`),
        axiaxiosInstance.getos.get(`${BACKEND_URL}/api/product-slider/active/bannerslide`),
        axios.axiosInstance.getget(`${BACKEND_URL}/api/product-slider/active/design`),
      ]);

      setHomeSlides(ensureArray(homeRes.data));
      setCatSlides(ensureArray(catRes.data));
      setProductSlides(ensureArray(productRes.data));
      setBannerSlides(ensureArray(bannerRes.data));
      setDesignAssets(ensureArray(designRes.data));
    } catch (err) {
      console.error("Error fetching home assets:", err);
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL]);

  useEffect(() => {
    fetchAllAssets();
  }, [fetchAllAssets]);

  const getAssetByName = (name) => {
    // Defensively search through arrays
    const searchPool = [...ensureArray(designAssets), ...ensureArray(bannerSlides)];
    const asset = searchPool.find(a => a?.name === name);
    
    if (!asset || !asset.imageURL) return "/banner.png"; 

    const path = asset.imageURL;
    return path.startsWith("http") ? path : `${BACKEND_URL}${path.startsWith("/") ? path : `/${path}`}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-[#B89B7A] font-bold text-xl">Loading ShilpoKotha...</div>
      </div>
    );
  }

  return (
    <>
      {/* 1. Main Slider */}
      <div className="HomeSlider-Wrapper pt-[30px] md:pt-[50px]">
        <HomeSlider data={homeSlides} />
      </div>

      <section className="pt-8">
        <div className="container mx-auto px-4">
          <HeroBanner />
        </div>
      </section>

      {/* 2. Category Slider */}
      <HomeCatSlider data={catSlides} />

      {/* 3. Popular Product Section */}
      <section className="py-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="leftsec w-full md:w-[40%] md:pl-[30px]">
              <h2 className="text-[22px] font-[600] text-gray-800 uppercase tracking-wide">Popular Product</h2>
              <p className="text-[14px] font-[400] text-gray-500">
                Do Not Miss The Current Product Until The End Of December
              </p>
            </div>
            <div className="rightsection w-full md:w-[60%]">
              <Box className="w-full md:w-[95%] bg-[#B89B7A] rounded-lg overflow-hidden shadow-sm">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{ 
                    "& .MuiTab-root": { color: "rgba(255,255,255,0.8)", fontWeight: "bold" },
                    "& .Mui-selected": { color: "#fff !important" },
                    "& .MuiTabs-indicator": { backgroundColor: "#fff" }
                  }}
                >
                  <Tab label="Fashion" />
                  <Tab label="Bags" />
                  <Tab label="Footware" />
                  <Tab label="Beauty" />
                  <Tab label="Jewellery" />
                  <Tab label="Wellness" />
                  <Tab label="Home Decor" />
                </Tabs>
              </Box>
            </div>
          </div>
          <div className="mt-8">
            <ProductsSlider data={productSlides} items={5} />
          </div>
        </div>
      </section>

      {/* Shipping Info */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto">
          <div className="FreeShipping w-full p-6 border-2 border-[#7a3e2d]/20 flex flex-col md:flex-row items-center justify-between rounded-xl bg-white gap-4">
            <div className="flex items-center gap-4">
              <LiaShippingFastSolid className="text-[40px] text-[#7a3e2d]" />
              <span className="text-[18px] font-[700] uppercase text-[#7a3e2d]">Free Shipping</span>
            </div>
            <div className="text-center md:text-left font-[500] text-gray-600">
              <p>Free Shipping On Your First Order and over ৳2000</p>
            </div>
            <div className="text-[#7a3e2d]">
              <p className="font-bold text-[25px]">Only ৳2000*</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Dynamic Banner */}
      <section className="w-full max-w-[1200px] mx-auto px-4 py-12">
        <div className="border-[2px] border-[#b8860b] rounded-lg p-1.5 shadow-xl transition-transform hover:scale-[1.01] duration-300">
          <div className="rounded overflow-hidden">
            <img
              src={getAssetByName("Main Banner")}
              alt="ShilpoKotha Exclusive"
              className="w-full h-auto md:h-[280px] object-cover block"
            />
          </div>
        </div>
      </section>

      {/* 5. Craft & Best Selling */}
      <section className="py-10">
        <div className="container mx-auto">
          <h2 className="text-[24px] font-[700] text-gray-800 border-l-4 border-[#7a3e2d] pl-4 mb-6">
            Craft and Heritage
          </h2>
          <ProductsSlider data={ensureArray(productSlides).filter(p => p?.category === 'Craft')} items={5} />
        </div>
        <div className="mt-12">
            <SecondBanner />
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto">
          <h2 className="text-[24px] font-[700] text-gray-800 border-l-4 border-[#7a3e2d] pl-4 mb-6">
            Best Selling
          </h2>
          <ProductsSlider data={productSlides} items={5} />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-[28px] font-serif font-bold text-gray-900">From Our Blog</h2>
            <div className="w-20 h-1 bg-[#B89B7A] mx-auto mt-2"></div>
          </div>
          <BlogItem />
        </div>
      </section>
    </>
  );
};

export default Home;