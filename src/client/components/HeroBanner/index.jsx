import React, { useState, useEffect } from "react";
import axios from "axios";
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
  
  // Use Vite environment variable for the backend URL
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

  /**
   * Safe Image Path Resolver
   */
  const getImageUrl = (path) => {
    if (!path || path === "null" || path === "undefined") {
      return "https://placehold.co/1200x500?text=No+Banner+Image";
    }
    if (path.startsWith("http")) return path;
    
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    
    return cleanPath.includes("uploads/") 
      ? `${BACKEND_URL}${cleanPath}` 
      : `${BACKEND_URL}/uploads${cleanPath}`;
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`${BACKEND_URL}/api/product-slider/active/bannerslide`);
        
        if (isMounted) {
          const rawData = res.data;
          let finalArray = [];

          // Robust Array Extraction (Prevents mapping crashes)
          if (Array.isArray(rawData)) {
            finalArray = rawData;
          } else if (rawData && typeof rawData === 'object') {
            if (Array.isArray(rawData.data)) finalArray = rawData.data;
            else if (Array.isArray(rawData.banners)) finalArray = rawData.banners;
            else if (Array.isArray(rawData.slides)) finalArray = rawData.slides;
            else {
              // Final fallback: find any array property
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
  }, [BACKEND_URL]);

  if (loading) {
    return (
      <div className="h-[400px] md:h-[500px] w-full bg-gray-200 animate-pulse flex items-center justify-center rounded-2xl">
        <span className="text-gray-400 font-black tracking-widest uppercase">Loading Gallery...</span>
      </div>
    );
  }

  // Hide component if no slides are available
  if (!Array.isArray(slides) || slides.length === 0) return null;

  return (
    <div className="hero-banner-wrapper px-4 md:px-0">
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