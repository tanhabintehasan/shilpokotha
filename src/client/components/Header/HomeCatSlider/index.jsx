import React, { useState, useEffect } from "react";
// axios রিমুভ করে শুধু axiosInstance ব্যবহার করা হয়েছে
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';

import "swiper/css";
import "swiper/css/navigation";

const HomeCatSlider = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ইমেজ পাথের জন্য ব্যাকএন্ড ইউআরএল (Env থেকে অথবা সরাসরি লিংক)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://shilpokotha-backend-8o4q410ae-tanhabintehasans-projects.vercel.app";

  const getImageUrl = (path) => {
    if (!path || path === "null" || path === "undefined") {
      return "https://placehold.co/150x150?text=No+Image";
    }
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return cleanPath.includes("/uploads") 
      ? `${BACKEND_URL}${cleanPath}` 
      : `${BACKEND_URL}/uploads${cleanPath}`;
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // FIX: axiosInstance ব্যবহার করার সময় baseURL অটোমেটিক যোগ হয়, তাই শুধু পাথ দিলেই হবে
    axiosInstance.get('/api/product-slider/active/homecatslide')
      .then(res => {
        if (isMounted) {
          let finalArray = [];
          const rawData = res.data;

          if (Array.isArray(rawData)) {
            finalArray = rawData;
          } else if (rawData && typeof rawData === 'object') {
            if (Array.isArray(rawData.data)) finalArray = rawData.data;
            else if (Array.isArray(rawData.categories)) finalArray = rawData.categories;
            else if (Array.isArray(rawData.items)) finalArray = rawData.items;
            else {
              const detectedArray = Object.values(rawData).find(val => Array.isArray(val));
              finalArray = detectedArray || [];
            }
          }

          setCategories(finalArray);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Slider fetch failed:", err);
        if (isMounted) {
          setCategories([]);
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, []); // BACKEND_URL ডিপেন্ডেন্সি রিমুভ করা হয়েছে কারণ axiosInstance এটি হ্যান্ডেল করে

  if (loading) {
    return (
      <div className="mt-8 px-4 flex justify-center gap-6 animate-pulse overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col items-center min-w-[100px]">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200" />
            <div className="h-3 w-16 bg-gray-200 mt-4 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!Array.isArray(categories) || categories.length === 0) {
    return null;
  }

  return (
    <div className="HomeCatSlider mt-6 px-4 pt-4 select-none">
      <div className="container mx-auto">
        <Swiper
          spaceBetween={20}
          navigation={true}
          loop={categories.length > 8}
          modules={[Navigation]}
          breakpoints={{
            320: { slidesPerView: 3, spaceBetween: 12 },
            480: { slidesPerView: 4, spaceBetween: 15 },
            768: { slidesPerView: 6, spaceBetween: 20 },
            1024: { slidesPerView: 8 },
            1440: { slidesPerView: 9 },
          }}
          className="mySwiper HomeCatSwiper !pb-8"
        >
          {categories.map((cat, index) => (
            <SwiperSlide key={cat?._id || `cat-${index}`}>
              <Link 
                to={`/category/${cat?.name?.toLowerCase().trim().replace(/\s+/g, '-') || 'all'}`} 
                className="block group"
              >
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-[115px] md:h-[115px] 
                               rounded-full overflow-hidden border-2 border-[#eaddca] 
                               bg-[#fdf7f0] flex items-center justify-center 
                               shadow-sm transition-all duration-500 
                               group-hover:shadow-xl group-hover:border-[#b58e58] group-hover:-translate-y-2">
                    <img
                      src={getImageUrl(cat?.imageURL || cat?.image)}
                      alt={cat?.name || "Category"}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="mt-4 text-[12px] md:text-[14px] font-bold text-gray-700 group-hover:text-[#b58e58] transition-colors line-clamp-1 text-center px-1">
                    {cat?.name || "Unnamed"}
                  </h3>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeCatSlider;