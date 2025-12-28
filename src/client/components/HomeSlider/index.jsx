import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import axiosInstance from '../api/axiosInstance';

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "./HomeSlider.css";

const HomeSlider = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ব্যাকএন্ড ইউআরএল হ্যান্ডেলিং
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://shilpokotha-backend-8o4q410ae-tanhabintehasans-projects.vercel.app";

  /**
   * Helper to resolve image paths correctly
   */
  const getImageUrl = (path) => {
    if (!path || path === "null" || path === "undefined") {
      return "https://placehold.co/800x450?text=No+Image+Available";
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
        // FIX: axiosInstance ব্যবহার করলে BACKEND_URL পাথের শুরুতে দেওয়ার দরকার নেই
        const res = await axiosInstance.get('/api/product-slider/active/homeslide');
        
        if (isMounted) {
          const rawData = res.data;
          let finalArray = [];

          // Robust Data Extraction
          if (Array.isArray(rawData)) {
            finalArray = rawData;
          } else if (rawData && typeof rawData === 'object') {
            finalArray = rawData.data || rawData.slides || rawData.products || [];
            
            if (!Array.isArray(finalArray)) {
              const foundArray = Object.values(rawData).find(val => Array.isArray(val));
              finalArray = foundArray || [];
            }
          }

          setSlides(finalArray);
        }
      } catch (err) {
        console.error("HomeSlider fetch error:", err.message);
        if (isMounted) setSlides([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHomeSlides();
    return () => { isMounted = false; };
  }, []); // Dependency array cleanup

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto mt-6 aspect-[16/9] md:aspect-[21/9] bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center text-gray-400">
        <div className="text-center">
           <div className="mb-2">Loading Handcrafted Collection...</div>
        </div>
      </div>
    );
  }

  if (!Array.isArray(slides) || slides.length === 0) return null;

  return (
    <div className="max-w-[1200px] mx-auto bg-[#f3efe9] rounded-2xl overflow-hidden mt-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-4 items-center">
        
        {/* LEFT BRANDING CONTENT */}
        <div className="p-8 md:p-12">
          <h2 className="text-[30px] md:text-[34px] leading-tight font-bold text-[#3b2f2a] mb-4">
            Bangladeshi Handcrafted Fashion
          </h2>
          <p className="text-[15px] text-[#6b5f58] mb-6">
            Explore timeless sarees and artisan-made ethnic wear inspired by
            Bangladeshi heritage.
          </p>
          <button 
            onClick={() => window.location.href = '/shop'}
            className="px-6 py-3 bg-[#7a3e2d] text-white rounded-lg text-[14px] font-bold hover:bg-[#633226] transition shadow-md hover:-translate-y-0.5"
          >
            Shop Collection
          </button>
        </div>

        {/* RIGHT IMAGE SLIDER */}
        <div className="p-4">
          <div className="p-2 border border-[#cbb8a0] rounded-2xl bg-[#efe7dc] shadow-inner">
            <div className="overflow-hidden rounded-xl">
              <Swiper
                modules={[Navigation, Autoplay]}
                navigation={true}
                autoplay={{
                  delay: 4500,
                  disableOnInteraction: false,
                }}
                loop={slides.length > 1}
                slidesPerView={1}
                className="aspect-[16/9] w-full"
              >
                {slides.map((slide, index) => (
                  <SwiperSlide key={slide._id || `slide-${index}`} className="bg-white">
                    <img
                      src={getImageUrl(slide.imageURL || slide.image)}
                      alt={slide.name || "Handcrafted Fashion Slide"}
                      className="w-full h-full object-cover"
                      loading="eager"
                      onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = "https://placehold.co/800x450?text=Image+Unavailable"; 
                      }}
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