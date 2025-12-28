import React, { useState, useEffect, useCallback } from "react";
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
import axiosInstance from '../../../utils/axiosInstance';

const Home = () => {
  // ইমেজ পাথের জন্য ব্যাকএন্ড ইউআরএল
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://shilpokotha-backend-8o4q410ae-tanhabintehasans-projects.vercel.app";
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

  const ensureArray = (data) => (Array.isArray(data) ? data : []);

  // মেইন ডাটা ফেচিং লজিক
  const fetchAllAssets = useCallback(async () => {
    try {
      setLoading(true);
      
      // FIX: axiosInstance ব্যবহার করলে baseURL অটোমেটিক যুক্ত হয়, তাই `${BACKEND_URL}` দরকার নেই
      const [homeRes, catRes, productRes, bannerRes, designRes] = await Promise.all([
        axiosInstance.get('/api/product-slider/active/homeslide'),
        axiosInstance.get('/api/product-slider/active/homecatslide'),
        axiosInstance.get('/api/product-slider/active/productslide'),
        axiosInstance.get('/api/product-slider/active/bannerslide'),
        axiosInstance.get('/api/product-slider/active/design'),
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
  }, []);

  useEffect(() => {
    fetchAllAssets();
  }, [fetchAllAssets]);

  // ডিজাইন এসেট খুঁজে বের করার লজিক
  const getAssetByName = (name) => {
    const searchPool = [...ensureArray(designAssets), ...ensureArray(bannerSlides)];
    const asset = searchPool.find(a => a?.name === name);
    
    if (!asset || !asset.imageURL) return "https://placehold.co/1200x300?text=Banner+Not+Found"; 

    const path = asset.imageURL;
    return path.startsWith("http") ? path : `${BACKEND_URL}${path.startsWith("/") ? path : `/${path}`}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#7a3e2d] border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="animate-pulse text-[#7a3e2d] font-bold text-xl">Loading ShilpoKotha...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 1. Main Slider */}
      <div className="HomeSlider-Wrapper pt-[10px] md:pt-[20px]">
        <HomeSlider data={homeSlides} />
      </div>

      <section className="pt-4">
        <div className="container mx-auto px-4">
          <HeroBanner />
        </div>
      </section>

      {/* 2. Category Slider */}
      <HomeCatSlider data={catSlides} />

      {/* 3. Popular Product Section */}
      <section className="py-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
            <div className="leftsec w-full md:w-[40%]">
              <h2 className="text-[22px] font-[600] text-gray-800 uppercase tracking-wide border-l-4 border-[#7a3e2d] pl-4">
                Popular Product
              </h2>
              <p className="text-[14px] font-[400] text-gray-500 mt-1">
                Do Not Miss The Current Product Until The End Of December
              </p>
            </div>
            <div className="rightsection w-full md:w-[60%]">
              <Box className="w-full bg-[#B89B7A] rounded-lg overflow-hidden shadow-sm">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{ 
                    "& .MuiTab-root": { color: "rgba(255,255,255,0.8)", fontWeight: "bold", fontSize: '12px' },
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
          <div className="mt-8 px-4">
            <ProductsSlider data={productSlides} />
          </div>
        </div>
      </section>

      {/* Shipping Info */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
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
      <section className="w-full max-w-[1200px] mx-auto px-4 py-8">
        <div className="border-[2px] border-[#b8860b]/30 rounded-lg p-1.5 shadow-lg transition-transform hover:scale-[1.005] duration-300">
          <div className="rounded overflow-hidden bg-gray-100">
            <img
              src={getAssetByName("Main Banner")}
              alt="ShilpoKotha Exclusive"
              className="w-full h-auto min-h-[150px] md:h-[280px] object-cover block"
              onError={(e) => { e.target.src = "https://placehold.co/1200x300?text=Banner+Image+Error"; }}
            />
          </div>
        </div>
      </section>

      {/* 5. Craft & Best Selling */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-[24px] font-[700] text-gray-800 border-l-4 border-[#7a3e2d] pl-4 mb-6">
            Craft and Heritage
          </h2>
          <ProductsSlider data={ensureArray(productSlides).filter(p => p?.category === 'Craft')} />
        </div>
        <div className="mt-12">
            <SecondBanner />
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-[24px] font-[700] text-gray-800 border-l-4 border-[#7a3e2d] pl-4 mb-6">
            Best Selling
          </h2>
          <ProductsSlider data={productSlides} />
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
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