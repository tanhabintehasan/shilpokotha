import React from "react";
import { Truck, RotateCcw, Wallet, Gift, Headphones } from "lucide-react";

const IconSection = () => {
  const features = [
    {
      icon: <Truck size={32} />,
      title: "Free Shipping",
      description: "For all Orders Over $100",
    },
    {
      icon: <RotateCcw size={32} />,
      title: "30 Days Returns",
      description: "For an Exchange Product",
    },
    {
      icon: <Wallet size={32} />,
      title: "Secured Payment",
      description: "Payment Cards Accepted",
    },
    {
      icon: <Gift size={32} />,
      title: "Special Gifts",
      description: "Our First Product Order",
    },
    {
      icon: <Headphones size={32} />,
      title: "Support 24/7",
      description: "Contact us Anytime",
    },
  ];

  return (
    <div className="bg-[#e1dcd3] py-16 px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {features.map((item, index) => (
          <div
            key={index}
            className="group flex flex-col items-center text-center cursor-pointer transition-all duration-300"
          >
            {/* Icon Container with Hover Logic */}
            <div className="mb-4 text-gray-800 group-hover:text-[#ea304c] transition-colors duration-300">
              {item.icon}
            </div>

            {/* Title with Hover Logic */}
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#ea304c] transition-colors duration-300 mb-1">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600">{item.description}</p>

            {/* Subtle border indicator using your secondary color */}
            <div className="mt-4 w-0 group-hover:w-12 border-b-2 border-[#006a4e] transition-all duration-500"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconSection;
