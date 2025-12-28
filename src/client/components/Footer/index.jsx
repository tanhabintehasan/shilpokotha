import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaArrowUp,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Social Media Configuration
  const socialLinks = [
    { Icon: FaFacebookF, url: "https://facebook.com", label: "Facebook" },
    { Icon: FaInstagram, url: "https://instagram.com", label: "Instagram" },
    { Icon: FaTwitter, url: "https://twitter.com", label: "Twitter" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#0a0a0a] pt-16 pb-8 px-6 border-t border-white/5 overflow-hidden">
      
      {/* --- BACKGROUND DECORATION (ALPANA) --- */}
      <div className="absolute top-[-50px] right-[-50px] opacity-10 pointer-events-none select-none">
        <svg width="400" height="400" viewBox="0 0 100 100" fill="none" stroke="white">
          <circle cx="50" cy="50" r="45" strokeWidth="0.2" strokeDasharray="1 1" />
          <circle cx="50" cy="50" r="35" strokeWidth="0.5" />
          {[...Array(12)].map((_, i) => (
            <path
              key={i}
              d="M50 5 L53 25 L47 25 Z"
              transform={`rotate(${i * 30} 50 50)`}
              strokeWidth="0.3"
              fill="white"
            />
          ))}
        </svg>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
        
        {/* --- COLUMN 1: BRAND --- */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="mb-4">
            <img
              src="/logo.png"
              alt="Shilpokotha Logo"
              className="h-16 w-auto object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/200x80?text=SHILPOKOTHA";
              }}
            />
          </div>

          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Authentic Bangladeshi Handicrafts. <br />
            <span className="italic font-serif text-white/50 block mt-2">
              "Rooted in tradition, crafted with love."
            </span>
          </p>

          <div className="flex gap-4 mt-8">
            {socialLinks.map(({ Icon, url, label }, idx) => (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-full text-white hover:bg-[#ea304c] hover:border-[#ea304c] hover:-translate-y-1 transition-all duration-300"
                aria-label={label}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* --- COLUMN 2: CONTACT INFO --- */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-white font-bold tracking-widest uppercase text-xs mb-8 border-b-2 border-[#ea304c] pb-2">
            Get in Touch
          </h4>
          <ul className="space-y-6 text-gray-300 text-sm">
            <li className="flex items-start gap-4 group cursor-default">
              <FaMapMarkerAlt className="text-[#ea304c] mt-1 group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-white transition-colors">
                Ashulia, Savar, Dhaka, <br />
                Bangladesh
              </span>
            </li>
            <li className="flex items-center gap-4 group cursor-default">
              <FaPhoneAlt className="text-[#ea304c] group-hover:scale-110 transition-transform" />
              <a href="tel:+8801700000000" className="group-hover:text-white transition-colors">
                +880 1XXX-XXXXXX
              </a>
            </li>
            <li className="flex items-center gap-4 group cursor-default">
              <FaEnvelope className="text-[#ea304c] group-hover:scale-110 transition-transform" />
              <a href="mailto:info@shilpokotha.com" className="group-hover:text-white transition-colors">
                info@shilpokotha.com
              </a>
            </li>
          </ul>
        </div>

        {/* --- COLUMN 3: MAP --- */}
        <div className="w-full h-56 rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative group">
          <iframe
            title="Shilpokotha Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58371.32832537242!2d90.287895!3d23.882835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c09f3e430311%3A0x89e87515b130a08!2sSavar!5e0!3m2!1sen!2sbd!4v1700000000000"
            width="100%"
            height="100%"
            style={{
              border: 0,
              filter: "grayscale(1) invert(0.9) contrast(1.2)",
            }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors pointer-events-none" />
        </div>
      </div>

      {/* --- FOOTER BOTTOM --- */}
      <div className="border-t border-white/5 mt-16 pt-8 relative">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] text-center md:text-left">
            © {currentYear} Handcrafted by{" "}
            <span className="text-[#ea304c] font-medium">Tanha Binte Hasan</span>
          </p>
          
          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
          >
            Back to top 
            <FaArrowUp className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;