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
  const BACKEND_URL = "http://localhost:5000";
  const [value, setValue] = React.useState(0);

  // ডাটা স্টেটসমূহ
  const [homeSlides, setHomeSlides] = useState([]);
  const [catSlides, setCatSlides] = useState([]);
  const [productSlides, setProductSlides] = useState([]);
  const [bannerSlides, setBannerSlides] = useState([]);
  const [designAssets, setDesignAssets] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // ডাটা ফেচিং ফাংশন
  const fetchAllAssets = useCallback(async () => {
    try {
      // একসাথেই সব জোনের ডাটা কল করা হচ্ছে
      const [homeRes, catRes, productRes, bannerRes, designRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/product-slider/active/homeslide`),
        axios.get(`${BACKEND_URL}/api/product-slider/active/homecatslide`),
        axios.get(`${BACKEND_URL}/api/product-slider/active/productslide`),
        axios.get(`${BACKEND_URL}/api/product-slider/active/bannerslide`),
        axios.get(`${BACKEND_URL}/api/product-slider/active/design`),
      ]);

      setHomeSlides(homeRes.data);
      setCatSlides(catRes.data);
      setProductSlides(productRes.data);
      setBannerSlides(bannerRes.data);
      setDesignAssets(designRes.data);
    } catch (err) {
      console.error("Error fetching home assets:", err);
    }
  }, [BACKEND_URL]);

  useEffect(() => {
    fetchAllAssets();
  }, [fetchAllAssets]);

  // ডিজাইন ইমেজের জন্য হেল্পার (যেমন: ব্যানার বা লোগো)
  const getAssetByName = (name) => {
    const asset = designAssets.find(a => a.name === name) || bannerSlides.find(a => a.name === name);
    if (!asset) return "/banner.png"; // Fallback
    const path = asset.imageURL;
    return path.startsWith("http") ? path : `${BACKEND_URL}${path.startsWith("/") ? path : `/${path}`}`;
  };

  return (
    <>
      {/* ১. মেইন স্লাইডার (homeslide) */}
      <div className="HomeSlider-Wrapper pt-[30px] md:pt-[50px]">
        <HomeSlider data={homeSlides} />
      </div>

      <section className="pt-8">
        <div className="container mx-auto px-4">
          <HeroBanner />
        </div>
      </section>

      {/* ২. ক্যাটাগরি স্লাইডার (homecatslide) */}
      <HomeCatSlider data={catSlides} />

      {/* ৩. পপুলার প্রোডাক্ট সেকশন (productslide) */}
      <section className="py-8">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="leftsec w-[40%] pl-[30px]">
              <h2 className="text-[22px] font-[600]">Popular Product</h2>
              <p className="text-[14px] font-[400]">
                Do Not Miss The Current Product Until The End Of December
              </p>
            </div>
            <div className="rightsection w-[60%]">
              <Box className="w-[90%] bg-[#B89B7A] rounded-lg overflow-hidden">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{ "& .MuiTab-root": { color: "white", fontWeight: "bold" } }}
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
          {/* ফিল্টার করা প্রোডাক্ট স্লাইডার */}
          <ProductsSlider data={productSlides} items={5} />
        </div>
      </section>

      {/* শিপিং ইনফো */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="FreeShipping w-[100%] p-4 border border-[#7a3e2d] flex items-center rounded-md">
            <div className="col1 flex items-center gap-4 w-[30%] text-right ">
              <LiaShippingFastSolid className="text-[35px]" />
              <span className="font-[18px] font-[600] uppercase">Free Shipping</span>
            </div>
            <div className="col2 w-[40%] text-left mb-0 font-[500]">
              <p>Free Shipping On Your First Order and over $200</p>
            </div>
            <div className="col3 w-[30%] text-right">
              <p className="font-bold text-[25px]">-Only $200*</p>
            </div>
          </div>
        </div>
      </section>

      {/* ৪. ডাইনামিক ব্যানার (design / bannerslide) */}
      <section className="w-full max-w-[1000px] mx-auto px-1 py-8">
        <div className="border-[2px] border-[#b8860b] rounded-sm p-0.5 shadow-lg ">
          <div className="border border-[#b8860b]/20">
            <img
              src={getAssetByName("Main Banner")} // অ্যাডমিনে যে নাম দিবেন
              alt="ShilpoKotha Banner"
              className="w-full h-[200px] object-cover block"
            />
          </div>
        </div>
      </section>

      {/* ৫. ক্রাফট এবং বেস্ট সেলিং সেকশন */}
      <section className="">
        <div className="container">
          <h2 className="text-[22px] font-[600] pb-[0px] pt-[10px]">
            Craft and Heritage
          </h2>
          <ProductsSlider data={productSlides.filter(p => p.category === 'Craft')} items={5} />
        </div>
        <SecondBanner />
      </section>

      <section className="pb-10">
        <div className="container">
          <h2 className="text-[22px] font-[600] pb-[0px] pt-[10px]">
            Best Selling
          </h2>
          <ProductsSlider data={productSlides} items={5} />
        </div>
      </section>

      <section>
        <div className="container mx-auto">
          <BlogItem />
        </div>
      </section>
    </>
  );
};

export default Home;