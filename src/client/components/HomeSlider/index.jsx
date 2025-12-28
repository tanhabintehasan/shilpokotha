import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import "./HomeSlider.css";

const HomeSlider = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // VITE FIX: Use environment variable
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

  /**
   * Helper to resolve image paths correctly
   */
  const getImageUrl = (path) => {
    if (!path || path === "null" || path === "undefined") {
      return "https://placehold.co/800x450?text=No+Image";
    }
    if (path.startsWith("http")) return path;

    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    
    return cleanPath.includes("uploads/") 
      ? `${BACKEND_URL}${cleanPath}` 
      : `${BACKEND_URL}/uploads${cleanPath}`;
  };

  useEffect(() => {
    let isMounted = true;
    const fetchHomeSlides = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BACKEND_URL}/api/product-slider/active/homeslide`);
        
        if (isMounted) {
          const rawData = res.data;
          let finalArray = [];

          // Robust Data Extraction
          if (Array.isArray(rawData)) {
            finalArray = rawData;
          } else if (rawData && typeof rawData === 'object') {
            if (Array.isArray(rawData.data)) finalArray = rawData.data;
            else if (Array.isArray(rawData.slides)) finalArray = rawData.slides;
            else if (Array.isArray(rawData.products)) finalArray = rawData.products;
            else {
              // Fallback: Find any array in the object
              const foundArray = Object.values(rawData).find(val => Array.isArray(val));
              finalArray = foundArray || [];
            }
          }

          setSlides(finalArray);
        }
      } catch (err) {
        console.error("Error fetching home slides:", err);
        if (isMounted) setSlides([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHomeSlides();
    return () => { isMounted = false; };
  }, [BACKEND_URL]);

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto mt-6 aspect-[16/9] md:aspect-[21/9] bg-gray-200 animate-pulse rounded-2xl flex items-center justify-center text-gray-400 font-bold">
        Loading Main Slider...
      </div>
    );
  }

  // Prevent rendering if no data
  if (!Array.isArray(slides) || slides.length === 0) return null;

  return (
    <div className="max-w-[1200px] mx-auto bg-[#f3efe9] rounded-2xl overflow-hidden mt-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-4 items-center">
        
        {/* LEFT CONTENT */}
        <div className="p-8 md:p-12">
          <h2 className="text-[30px] md:text-[34px] leading-tight font-[600] text-[#3b2f2a] mb-4">
            Bangladeshi Handcrafted Fashion
          </h2>
          <p className="text-[15px] text-[#6b5f58] mb-6">
            Explore timeless sarees and artisan-made ethnic wear inspired by
            Bangladeshi heritage.
          </p>
          <button className="px-6 py-3 bg-[#7a3e2d] text-white rounded-lg text-[14px] font-bold hover:bg-[#633226] transition shadow-md hover:-translate-y-0.5 active:translate-y-0">
            Shop Collection
          </button>
        </div>

        {/* RIGHT SLIDER */}
        <div className="p-4">
          <div className="p-2 border border-[#cbb8a0] rounded-2xl bg-[#efe7dc] shadow-inner">
            <div className="overflow-hidden rounded-xl HomeSwiper">
              <Swiper
                modules={[Navigation, Autoplay]}
                navigation={true}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                loop={slides.length > 1}
                spaceBetween={0}
                slidesPerView={1}
                className="aspect-[16/9] w-full"
              >
                {slides.map((slide, index) => (
                  <SwiperSlide key={slide._id || `home-slide-${index}`} className="flex items-center justify-center bg-white">
                    <img
                      src={getImageUrl(slide.imageURL || slide.image)}
                      alt={slide.name || "Main Slide"}
                      className="w-full h-full object-cover transition-opacity duration-500"
                      onError={(e) => { e.target.src = "https://placehold.co/800x450?text=Image+Not+Found"; }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSlider;