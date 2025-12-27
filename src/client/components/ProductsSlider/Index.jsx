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

  const BACKEND_URL = "http://localhost:5000";

  // --- অ্যাডমিন প্যানেল থেকে আনা একই ইমেজ লজিক ---
  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/300x400?text=No+Image";
    if (path.startsWith("http")) return path;
    
    // ডাটাবেসে যদি "/uploads/name.png" থাকে
    if (path.includes("uploads/")) {
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      return `${BACKEND_URL}${cleanPath}`;
    }

    // ডাটাবেসে যদি শুধু ফাইলের নাম থাকে
    const fileName = path.startsWith("/") ? path.slice(1) : path;
    return `${BACKEND_URL}/uploads/${fileName}`;
  };

  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        setLoading(true);
        // এপিআই কল
        const res = await axios.get(`${BACKEND_URL}/api/product-slider/active/productslide`);
        
        // প্রতিটি আইটেমের imageURL প্রসেস করা
        const processedData = (res.data || []).map(item => ({
            ...item,
            imageURL: getImageUrl(item.imageURL) // এখানে ইমেজ পাথ ঠিক করা হচ্ছে
        }));
        
        setProducts(processedData);
      } catch (err) {
        console.error("Slider fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSliderData();
  }, []);

  const openProductDetailsModal = (product) => {
    setViewProduct(product);
    setIsOpenModal(true);
  };

  if (loading) return <div className="h-60 flex items-center justify-center font-bold text-gray-400">Loading Products...</div>;

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
          {products.map((item) => (
            <SwiperSlide key={item._id}>
              <ProductItem
                item={item} // এখন item.imageURL অলরেডি ফুল পাথ হিসেবে যাবে
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