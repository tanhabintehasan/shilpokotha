import React, { useState, useEffect } from "react";
import { Dialog, IconButton, Rating, Button } from "@mui/material";
import { MdClose, MdOutlineShoppingCart } from "react-icons/md";
import { FavoriteBorder, Add, Remove, CompareArrows } from "@mui/icons-material";
import ProductZoom from "../ProductZoom";

const ProductModal = ({ closeModal, product }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeSize, setActiveSize] = useState(null);
  const [modalImage, setModalImage] = useState("");
  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    if (product) {
      const path = product.imageURL || product.image;
      if (path) {
        setModalImage(path.startsWith("http") ? path : `${BACKEND_URL}${path.startsWith("/") ? "" : "/"}${path}`);
      }
    }
  }, [product]);

  if (!product) return null;

  return (
    <Dialog open={true} onClose={closeModal} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
      <div className="relative bg-white p-8">
        <IconButton onClick={closeModal} className="!absolute top-4 right-4 z-50 bg-gray-50"><MdClose /></IconButton>

        <div className="flex flex-col md:flex-row gap-10">
          <div className="md:w-1/2">
            <div className="border rounded-2xl overflow-hidden bg-gray-50 min-h-[400px] flex items-center justify-center">
              <ProductZoom image={modalImage} />
            </div>
          </div>

          <div className="md:w-1/2 flex flex-col gap-5">
            <header>
              <h2 className="text-3xl font-bold text-gray-800">{product.name}</h2>
              <div className="flex items-center gap-3 mt-2">
                <Rating value={4.5} precision={0.5} size="small" readOnly />
                <span className="text-sm text-gray-400">| Heritage Collection</span>
              </div>
            </header>

            <div className="flex items-center gap-4 py-4 border-t border-b">
              <span className="text-4xl font-black text-[#891b1b]">৳{product.price}</span>
              <span className="ml-auto text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase">In Stock</span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">Select Size</h4>
              <div className="flex gap-2">
                {["S", "M", "L", "XL"].map((s) => (
                  <button key={s} onClick={() => setActiveSize(s)} 
                    className={`w-11 h-11 border-2 rounded-xl font-bold transition-all ${activeSize === s ? "bg-[#891b1b] border-[#891b1b] text-white" : "border-gray-100 text-gray-600 hover:border-[#891b1b]"}`}>{s}</button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 mt-auto">
              <div className="flex items-center border-2 border-gray-100 rounded-xl bg-gray-50">
                <IconButton onClick={() => quantity > 1 && setQuantity(quantity - 1)} className="!px-4"><Remove /></IconButton>
                <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                <IconButton onClick={() => setQuantity(quantity + 1)} className="!px-4"><Add /></IconButton>
              </div>
              <Button variant="contained" fullWidth startIcon={<MdOutlineShoppingCart />} 
                sx={{ bgcolor: "#891b1b", h: "56px", fontWeight: "bold", borderRadius: "12px", "&:hover": { bgcolor: "#691414" } }}>Add to Cart</Button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ProductModal;