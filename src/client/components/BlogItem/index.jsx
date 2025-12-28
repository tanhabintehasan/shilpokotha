import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";

// Swiper Styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BlogItem = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = "";

  // --- IMAGE LOGIC (Same as your HomeSlider) ---
  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/600x400?text=No+Image";
    if (path.startsWith("http")) return path;

    if (path.includes("uploads/")) {
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      return `${BACKEND_URL}${cleanPath}`;
    }

    const fileName = path.startsWith("/") ? path.slice(1) : path;
    return `${BACKEND_URL}/uploads/${fileName}`;
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        // Using the same product API but filtering for 'blog'
        const res = await axios.get(`${BACKEND_URL}/api/products?designType=blog`);
        const data = Array.isArray(res.data) ? res.data : res.data.products || [];
        setBlogs(data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <div className="py-20 text-center">Loading Tradition...</div>;
  if (blogs.length === 0) return null;

  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 py-16">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-12">
        <h2 className="text-4xl font-serif text-[#006a4e] mb-3">
          Our Tradition
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-12 h-[2px] bg-red-600"></div>
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-gray-500">
            ShilpoKotha Blog
          </span>
          <div className="w-12 h-[2px] bg-red-600"></div>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={25}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="blog-swiper pb-14"
      >
        {blogs.map((blog) => (
          <SwiperSlide key={blog._id}>
            <div
              className="bg-white group cursor-pointer border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-lg overflow-hidden flex flex-col h-full"
              onClick={() => navigate(`/blog/${blog._id}`)}
            >
              {/* Image Container */}
              <div className="relative h-[240px] w-full overflow-hidden bg-gray-100">
                <img
                  src={getImageUrl(blog.imageURL)}
                  alt={blog.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/600x400?text=Image+Not+Found";
                  }}
                />
                {/* Category Badge */}
                {blog.category && (
                  <div className="absolute top-4 left-4 bg-[#800020] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                    {blog.category}
                  </div>
                )}
              </div>

              {/* Text Area */}
              <div className="p-6 flex flex-col h-[200px]">
                <h3 className="text-xl font-serif text-gray-900 mb-2 leading-tight h-[56px] line-clamp-2">
                  {blog.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-auto line-clamp-3">
                  {blog.description}
                </p>
                <div className="mt-4 flex items-center text-[#006a4e] font-bold text-xs uppercase tracking-widest">
                  <span>Read Article</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx>{`
        .blog-swiper .swiper-button-next,
        .blog-swiper .swiper-button-prev {
          color: #006a4e;
          transform: scale(0.7);
        }
        .blog-swiper .swiper-pagination-bullet-active {
          background: #006a4e;
        }
      `}</style>
    </section>
  );
};

export default BlogItem;