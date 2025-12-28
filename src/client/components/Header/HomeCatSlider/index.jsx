import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";

const HomeCatSlider = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Use environment variables for URLs when possible
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";

  /**
   * Defensive Image Handling
   */
  const getImageUrl = (path) => {
    if (!path || path === "null" || path === "undefined") {
      return "https://placehold.co/150x150?text=Category";
    }
    if (path.startsWith("http")) return path;
    
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    // Prevents double "uploads" in the path
    return cleanPath.includes("/uploads") 
      ? `${BACKEND_URL}${cleanPath}` 
      : `${BACKEND_URL}/uploads${cleanPath}`;
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    axios.get(`${BACKEND_URL}/api/product-slider/active/homecatslide`)
      .then(res => {
        if (isMounted) {
          // Ensure data is an array before setting state
          setCategories(Array.isArray(res.data) ? res.data : []);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Slider fetch error:", err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [BACKEND_URL]);

  // Loading State (Skeleton Circles)
  if (loading) {
    return (
      <div className="mt-4 px-4 flex justify-center gap-4 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gray-200" />
            <div className="h-3 w-16 bg-gray-200 mt-3 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="HomeCatSlider mt-[10px] px-4 pt-4 select-none">
      <div className="container mx-auto">
        <Swiper
          spaceBetween={15}
          navigation={true}
          loop={categories.length > 8} // Only loop if there are enough items
          modules={[Navigation]}
          breakpoints={{
            320: { slidesPerView: 3, spaceBetween: 10 },
            480: { slidesPerView: 4 },
            768: { slidesPerView: 6 },
            1024: { slidesPerView: 8 },
            1440: { slidesPerView: 9 },
          }}
          className="mySwiper HomeCatSwiper !pb-4"
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat?._id || Math.random()}>
              <Link 
                to={`/category/${cat?.name?.toLowerCase().replace(/\s+/g, '-')}`} 
                className="block group"
              >
                <div className="flex flex-col items-center">
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-[110px] md:h-[110px] 
                               rounded-full overflow-hidden 
                               border border-[#eaddca] bg-[#fdf7f0] 
                               flex items-center justify-center 
                               shadow-sm transition-all duration-500 
                               group-hover:shadow-lg group-hover:border-[#b58e58] group-hover:-translate-y-1"
                  >
                    <img
                      src={getImageUrl(cat?.imageURL || cat?.image)}
                      alt={cat?.name || "Category"}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="mt-3 text-[12px] md:text-[14px] font-semibold text-gray-700 group-hover:text-[#b58e58] transition-colors line-clamp-1 text-center">
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