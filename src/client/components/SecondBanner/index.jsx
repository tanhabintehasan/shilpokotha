import React from "react";
import { useNavigate } from "react-router-dom";

const SecondBanner = () => {
  const navigate = useNavigate();

  // হ্যান্ডলার ফাংশন যা ইউজারকে লিস্টিং পেজে নিয়ে যাবে
  // আপনি চাইলে কুয়েরি প্যারামিটার পাঠাতে পারেন যেমন: /shop?category=beauty
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[300px]">
        
        {/* LEFT SIDE: BEAUTY SECTION */}
        <div className="relative flex-1 group overflow-hidden rounded-sm border-[3px] border-[#006a4e] shadow-md">
          <img
            src="/Beautybanner.jpg"
            alt="Natural Beauty"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
            <h2 className="text-xl md:text-2xl font-serif mb-3 drop-shadow-md">
              Natural Beauty
            </h2>
            <button
              onClick={() => handleNavigation("/products/beauty")} // আপনার রাউট অনুযায়ী চেঞ্জ করুন
              className="px-6 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all"
            >
              Shop Beauty
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: WELLNESS SECTION */}
        <div className="relative flex-1 group overflow-hidden rounded-sm border-[3px] border-[#006a4e] shadow-md">
          <img
            src="/Wellnessbanner.jpg"
            alt="Pure Wellness"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
            <h2 className="text-xl md:text-2xl font-serif mb-3 drop-shadow-md">
              Pure Wellness
            </h2>
            <button
              onClick={() => handleNavigation("/products/wellness")} // আপনার রাউট অনুযায়ী চেঞ্জ করুন
              className="px-6 py-2 bg-[#006a4e] text-white text-[10px] font-bold uppercase tracking-wider hover:bg-white hover:text-[#006a4e] transition-all"
            >
              Shop Wellness
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecondBanner;