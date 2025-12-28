import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import ProductItem from "../ProductItem/Index";
import ProductModal from "../ProductModal/index";

const ProductsSlider = () => {
  const [products, setProducts] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vite environment variable fix
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

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
        const res = await axiosInstance.get(`${BACKEND_URL}/api/product-slider/active/productslide`);
        
        if (isMounted) {
          const rawData = res.data;
          let finalArray = [];

          // Robust Array Extraction (Deep Scan)
          if (Array.isArray(rawData)) {
            finalArray = rawData;
          } else if (rawData && typeof rawData === 'object') {
            if (Array.isArray(rawData.data)) finalArray = rawData.data;
            else if (Array.isArray(rawData.products)) finalArray = rawData.products;
            else if (Array.isArray(rawData.items)) finalArray = rawData.items;
            else {
              const foundArray = Object.values(rawData).find(val => Array.isArray(val));
              finalArray = foundArray || [];
            }
          }

          // Process paths and safely map
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
  }, [BACKEND_URL]);

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

  // Prevent rendering if no products
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