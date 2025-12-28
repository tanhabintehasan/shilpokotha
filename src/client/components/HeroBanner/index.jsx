import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const HeroBanner = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = "";

  // --- ইমেজ পাথ হ্যান্ডলিং লজিক ---
  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/1200x500?text=No+Banner+Image";
    if (path.startsWith("http")) return path;
    
    if (path.includes("uploads/")) {
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      return `${BACKEND_URL}${cleanPath}`;
    }

    const fileName = path.startsWith("/") ? path.slice(1) : path;
    return `${BACKEND_URL}/uploads/${fileName}`;
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        // 'bannerslide' জোন থেকে একটিভ ডাটা আনা হচ্ছে
        const res = await axios.get(`${BACKEND_URL}/api/product-slider/active/bannerslide`);
        setSlides(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("HeroBanner fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  if (loading) return <div className="h-[400px] flex items-center justify-center font-bold">Loading Banners...</div>;
  if (slides.length === 0) return null;

  return (
    <div className="hero-banner-wrapper">
      <Swiper
        spaceBetween={10}
        centeredSlides={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        loop={slides.length > 1}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide._id}>
            <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden">
              <img
                src={getImageUrl(slide.imageURL)}
                alt={slide.name}
                className="w-full h-full object-cover rounded-2xl"
              />
              {/* ওভারলে এবং টাইটেল ডাটাবেস থেকে আসছে */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <h2 className="text-white text-4xl font-bold drop-shadow-lg">
                  {slide.name}
                </h2>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroBanner;