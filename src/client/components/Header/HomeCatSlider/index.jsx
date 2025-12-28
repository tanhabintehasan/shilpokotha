import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "./HomeCatSlider.css";

const HomeCatSlider = () => {
  const [categories, setCategories] = useState([]);
  const BACKEND_URL = "";

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return path.includes("uploads/") ? `${BACKEND_URL}${cleanPath}` : `${BACKEND_URL}/uploads/${path.startsWith("/") ? path.slice(1) : path}`;
  };

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/product-slider/active/homecatslide`)
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="HomeCatSlider mt-[10px] px-4 pt-4">
      <div className="container mx-auto">
        <Swiper
          spaceBetween={20}
          navigation={true}
          loop={true}
          modules={[Navigation]}
          breakpoints={{
            320: { slidesPerView: 3, spaceBetween: 10 },
            640: { slidesPerView: 4 },
            768: { slidesPerView: 5 },
            1024: { slidesPerView: 7 },
            1280: { slidesPerView: 8 },
          }}
          className="mySwiper HomeCatSwiper"
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat._id}>
             <Link to={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`} className="block group">
  <div className="flex flex-col items-center">
    <div
      className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] 
                 rounded-full overflow-hidden 
                 border border-[#eaddca] bg-[#fdf7f0] 
                 flex items-center justify-center 
                 shadow-sm transition-all duration-300 
                 group-hover:shadow-md group-hover:scale-105"
    >
      <img
        src={getImageUrl(cat.imageURL)}
        alt={cat.name}
        className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
      />
    </div>
    <h3 className="mt-3 text-[13px] md:text-[14px] font-[500] text-gray-800 group-hover:text-[#b58e58]">
      {cat.name}
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