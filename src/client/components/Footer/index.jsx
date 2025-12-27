import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-[#0a0a0a]/85 backdrop-blur-xl pt-16 pb-8 px-6 border-t border-white/5 overflow-hidden">
      {/* Decorative Minimal Art: Alpana Pattern Background */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
        <svg
          width="300"
          height="300"
          viewBox="0 0 100 100"
          fill="none"
          stroke="white"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
          <circle cx="50" cy="50" r="30" strokeWidth="0.5" />
          {[...Array(8)].map((_, i) => (
            <path
              key={i}
              d="M50 10 L55 30 L45 30 Z"
              transform={`rotate(${i * 45} 50 50)`}
              strokeWidth="0.5"
            />
          ))}
        </svg>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
        {/* Column 1: Brand with Decorative Frame */}
        <div className="flex flex-col items-center md:items-start">
          <div className="relative p-4 mb-4 group">
            {/* Minimal Tradition Frame for Logo */}

            <img
              src="/logo.png"
              alt="Shilpokotha Logo"
              className="h-20 w-auto object-contain relative z-10"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150?text=LOGO";
              }} // Fallback if path is wrong
            />
          </div>

          <p className="text-gray-400 text-sm leading-relaxed text-center md:text-left mt-4 max-w-xs">
            Authentic Bangladeshi Handicrafts. <br />
            <span className="italic font-serif text-white/60">
              "Rooted in tradition, crafted with love."
            </span>
          </p>

          <div className="flex gap-4 mt-8">
            {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-full text-white hover:bg-[#ea304c] hover:border-[#ea304c] transition-all duration-300"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Contact Info */}
        <div className="flex flex-col justify-center items-center md:items-start">
          <h4 className="text-white font-light tracking-[0.2em] uppercase text-sm mb-8 border-b border-[#ea304c]/50 pb-2">
            Get in Touch
          </h4>
          <ul className="space-y-6 text-gray-300 text-sm">
            <li className="flex items-start gap-4 group">
              <FaMapMarkerAlt className="text-[#ea304c] mt-1 group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-white transition-colors">
                Ashulia, Savar, Dhaka, <br />
                Bangladesh
              </span>
            </li>
            <li className="flex items-center gap-4 group">
              <FaPhoneAlt className="text-[#ea304c] group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-white transition-colors">
                +880 1XXX-XXXXXX
              </span>
            </li>
            <li className="flex items-center gap-4 group">
              <FaEnvelope className="text-[#ea304c] group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-white transition-colors">
                info@shilpokotha.com
              </span>
            </li>
          </ul>
        </div>

        {/* Column 3: Styled Live Map */}
        <div className="w-full h-56 rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative">
          <iframe
            title="Map Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14594.026362534578!2d90.31174985!3d23.8716335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c230e7f9a15d%3A0x6338b7d72c3d0b2e!2sAshulia%2C%20Savar!5e0!3m2!1sen!2sbd!4v1700000000000"
            width="100%"
            height="100%"
            style={{
              border: 0,
              filter: "grayscale(1) invert(0.92) contrast(1.1) brightness(0.8)",
            }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-white/5 mt-16 pt-8 text-center">
        <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} Handcrafted by{" "}
          <span className="text-[#ea304c] font-medium">Tanha Binte Hasan</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
