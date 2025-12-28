import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import axiosInstance from '../api/axiosInstance'; // ডাবল ইমপোর্ট ফিক্সড

// Swiper Styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

import ProductItem from "../ProductItem/Index";
import ProductModal from "../ProductModal/index";

const ProductsSlider = () => {
  const [products, setProducts] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // ব্যাকএন্ড ইউআরএল ফিক্স (ইমেজ পাথের জন্য)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://shilpokotha-backend-8o4q410ae-tanhabintehasans-projects.vercel.app";

  const getImageUrl = (path) => {
    if (!path || path === "null" || path === "undefined") {
      return "https://placehold.co/300x400?text=No+Image";
    }
    if (path.startsWith("http")) return path;
    
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    
    return cleanPath.includes("uploads/") 
      ? `${BACKEND_URL}${cleanPath}` 
      : `${BACKEND_URL}/uploads${cleanPath}`;
  };

  useEffect(() => {
    let isMounted = true;

    const fetchSliderData = async () => {
      try {
        setLoading(true);
        // FIX: axiosInstance ব্যবহার করলে শুধু রিলেটিভ পাথ দিতে হবে
        const res = await axiosInstance.get('/api/product-slider/active/productslide');
        
        if (isMounted) {
          const rawData = res.data;
          let finalArray = [];

          // Robust Array Extraction
          if (Array.isArray(rawData)) {
            finalArray = rawData;
          } else if (rawData && typeof rawData === 'object') {
            finalArray = rawData.data || rawData.products || rawData.items || [];
            
            if (!Array.isArray(finalArray)) {
              const foundArray = Object.values(rawData).find(val => Array.isArray(val));
              finalArray = foundArray || [];
            }
          }

          // ইমেজ পাথ প্রসেস করা
          const processedData = finalArray.map(item => ({
            ...item,
            imageURL: getImageUrl(item.imageURL || item.image)
          }));
          
          setProducts(processedData);
        }
      } catch (err) {
        console.error("Slider fetch failed:", err);
        if (isMounted) setProducts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSliderData();
    return () => { isMounted = false; };
  }, []); // ডিপেন্ডেন্সি অ্যারে ক্লিন করা হয়েছে

  const openProductDetailsModal = (product) => {
    setViewProduct(product);
    setIsOpenModal(true);
  };

  if (loading) {
    return (
      <div className="h-60 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#800020]"></div>
        <span className="ml-3 font-bold text-gray-400">Loading Products...</span>
      </div>
    );
  }

  if (!Array.isArray(products) || products.length === 0) return null;

  return (
    <>
      <div className="ProductsSlider w-full max-w-[1440px] mx-auto px-4 my-8 relative">
        <Swiper
          slidesPerView={5}
          spaceBetween={15}
          navigation={true}
          loop={products.length > 5}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          modules={[Navigation, Autoplay]}
          className="product-swiper"
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 10 },
            768: { slidesPerView: 3, spaceBetween: 12 },
            1024: { slidesPerView: 5, spaceBetween: 15 },
          }}
        >
          {products.map((item, index) => (
            <SwiperSlide key={item._id || `prod-slide-${index}`}>
              <ProductItem
                item={item}
                onViewDetails={() => openProductDetailsModal(item)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {isOpenModal && (
        <ProductModal
          closeModal={() => setIsOpenModal(false)}
          product={viewProduct}
        />
      )}
    </>
  );
};

export default ProductsSlider;