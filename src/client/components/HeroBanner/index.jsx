import React, { useState, useEffect } from "react";
// axiosInstance ব্যবহার করলে আলাদা axios দরকার নেই
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import axiosInstance from '../api/axiosInstance';

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const HeroBanner = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ইমেজ পাথের জন্য ব্যাকএন্ড ইউআরএল (Env থেকে অথবা সরাসরি লিংক)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://shilpokotha-backend-8o4q410ae-tanhabintehasans-projects.vercel.app";

  /**
   * Safe Image Path Resolver
   */
  const getImageUrl = (path) => {
    if (!path || path === "null" || path === "undefined") {
      return "https://placehold.co/1200x500?text=No+Banner+Image";
    }
    if (path.startsWith("http")) return path;
    
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    
    // ব্যাকএন্ডে যদি অলরেডি আপলোড ফোল্ডার থাকে তবে তা হ্যান্ডেল করা
    return cleanPath.includes("uploads/") 
      ? `${BACKEND_URL}${cleanPath}` 
      : `${BACKEND_URL}/uploads${cleanPath}`;
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchBanners = async () => {
      try {
        setLoading(true);
        // FIX: axiosInstance ব্যবহার করার সময় শুধু রিলেটিভ পাথ দিতে হবে
        const res = await axiosInstance.get('/api/product-slider/active/bannerslide');
        
        if (isMounted) {
          const rawData = res.data;
          let finalArray = [];

          // ডাটা স্ট্রাকচার চেক (যাতে ম্যাপ এরর না দেয়)
          if (Array.isArray(rawData)) {
            finalArray = rawData;
          } else if (rawData && typeof rawData === 'object') {
            if (Array.isArray(rawData.data)) finalArray = rawData.data;
            else if (Array.isArray(rawData.banners)) finalArray = rawData.banners;
            else if (Array.isArray(rawData.slides)) finalArray = rawData.slides;
            else {
              const foundArray = Object.values(rawData).find(val => Array.isArray(val));
              finalArray = foundArray || [];
            }
          }
          
          setSlides(finalArray);
        }
      } catch (err) {
        console.error("HeroBanner fetch failed:", err);
        if (isMounted) setSlides([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBanners();
    return () => { isMounted = false; };
  }, []); // BACKEND_URL ডিপেন্ডেন্সি রিমুভ করা হয়েছে

  if (loading) {
    return (
      <div className="h-[400px] md:h-[500px] w-full bg-gray-200 animate-pulse flex items-center justify-center rounded-2xl">
        <span className="text-gray-400 font-black tracking-widest uppercase">Loading Gallery...</span>
      </div>
    );
  }

  if (!Array.isArray(slides) || slides.length === 0) return null;

  return (
    <div className="hero-banner-wrapper px-4 md:px-0 mt-4">
      <Swiper
        spaceBetween={10}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        loop={slides.length > 1}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper rounded-2xl overflow-hidden"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide._id || `banner-${index}`}>
            <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden group">
              <img
                src={getImageUrl(slide.imageURL || slide.image)}
                alt={slide.name || "Promotion Banner"}
                className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
                onError={(e) => { e.target.src = "https://placehold.co/1200x500?text=Banner+Error"; }}
              />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {slide.name && (
                  <h2 className="text-white text-3xl md:text-5xl font-black drop-shadow-2xl text-center px-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {slide.name}
                  </h2>
                )}
                {slide.description && (
                  <p className="text-white/90 mt-4 font-medium text-lg hidden md:block">
                    {slide.description}
                  </p>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroBanner;