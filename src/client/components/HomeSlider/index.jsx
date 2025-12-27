import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import "./HomeSlider.css";

const HomeSlider = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = "http://localhost:5000";

  // --- ইমেজ লজিক (আপনার ম্যানেজমেন্ট টেবিল থেকে নেওয়া) ---
  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/800x450?text=No+Image";
    if (path.startsWith("http")) return path;

    if (path.includes("uploads/")) {
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      return `${BACKEND_URL}${cleanPath}`;
    }

    const fileName = path.startsWith("/") ? path.slice(1) : path;
    return `${BACKEND_URL}/uploads/${fileName}`;
  };

  useEffect(() => {
    const fetchHomeSlides = async () => {
      try {
        setLoading(true);
        // 'homeslide' আইডি ব্যবহার করে এপিআই কল
        const res = await axios.get(`${BACKEND_URL}/api/product-slider/active/homeslide`);
        setSlides(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching home slides:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeSlides();
  }, []);

  if (loading) return <div className="h-[400px] flex items-center justify-center">Loading Slider...</div>;
  if (slides.length === 0) return null;

  return (
    <div className="max-w-[1200px] mx-auto bg-[#f3efe9] rounded-2xl overflow-hidden mt-6">
      <div className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-4 items-center">
        {/* LEFT CONTENT */}
        <div className="p-8 md:p-12">
          <h2 className="text-[34px] leading-tight font-[500] text-[#3b2f2a] mb-4">
            Bangladeshi Handcrafted Fashion
          </h2>
          <p className="text-[15px] text-[#6b5f58] mb-6">
            Explore timeless sarees and artisan-made ethnic wear inspired by
            Bangladeshi heritage.
          </p>
          <button className="px-6 py-3 bg-[#7a3e2d] text-white rounded-lg text-[14px] font-medium hover:bg-[#633226] transition shadow-md">
            Shop Collection
          </button>
        </div>

        {/* RIGHT SLIDER */}
        <div className="p-4">
          <div className="p-2 border border-[#cbb8a0] rounded-2xl bg-[#efe7dc] shadow-sm">
            <div className="overflow-hidden rounded-xl HomeSwiper">
              <Swiper
                modules={[Navigation, Autoplay]}
                navigation
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                loop={slides.length > 1}
                spaceBetween={0}
                slidesPerView={1}
                className="aspect-[16/9] w-full"
              >
                {slides.map((slide) => (
                  <SwiperSlide key={slide._id} className="flex items-center justify-center bg-white">
                    <img
                      src={getImageUrl(slide.imageURL)}
                      alt={slide.name}
                      className="w-full h-full object-cover"
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