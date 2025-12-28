import React, { useState, useEffect } from "react";
import { Dialog, IconButton, Rating, Button } from "@mui/material";
import { MdClose, MdOutlineShoppingCart } from "react-icons/md";
import { Add, Remove } from "@mui/icons-material";
import ProductZoom from "../ProductZoom";
import { useCart } from "../../../Context/CartContext"; // FIXED: Import from CartContext

const ProductModal = ({ closeModal, product }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeSize, setActiveSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  
  // FIXED: Destructure from useCart() hook to use the drawer-opening logic
  const { addToCart } = useCart();
  
  const BACKEND_URL = "http://localhost:5000";

  const getImageUrl = (imgSource) => {
    if (!imgSource || imgSource === "undefined" || imgSource === "null") {
      return "https://placehold.co/400x500?text=No+Image+Available";
    }
    if (imgSource.startsWith("http")) return imgSource;
    const cleanPath = imgSource.startsWith("/") ? imgSource : `/${imgSource}`;
    return cleanPath.includes("uploads") 
      ? `${BACKEND_URL}${cleanPath}` 
      : `${BACKEND_URL}/uploads${cleanPath}`;
  };

  useEffect(() => {
    if (product) {
      const initialPath = product.images?.[0] || product.image || product.imageURL;
      setSelectedImage(getImageUrl(initialPath));
      setQuantity(1);
      setActiveSize(null);
    }
  }, [product]);

  if (!product) return null;

  const sizes = ["S", "M", "L", "XL"];

  const handleAddToCart = () => {
    if (!activeSize) {
      alert("Please select a size first!");
      return;
    }
    
    // This now calls the CartContext version which sets setIsCartOpen(true)
    addToCart(product, quantity, activeSize);
    
    // Optionally keep the modal open or close it
    closeModal(); 
  };

  return (
    <Dialog
      open={true}
      onClose={closeModal}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: "10px", overflow: "hidden" } }}
    >
      <div className="relative bg-white p-6 md:p-8">
        <IconButton 
          onClick={closeModal} 
          className="!absolute top-2 right-2 z-50 hover:bg-gray-100"
        >
          <MdClose className="text-gray-600" />
        </IconButton>

        <div className="flex flex-col md:flex-row gap-8">
          {/* LEFT: Image Gallery */}
          <div className="md:w-[45%] flex gap-4">
            <div className="flex flex-col gap-3">
              {(product.images?.length > 0 ? product.images : [product.image || product.imageURL]).map((img, index) => {
                const url = getImageUrl(img);
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(url)}
                    className={`w-14 h-16 border rounded overflow-hidden cursor-pointer transition-all ${
                      selectedImage === url ? "border-[#891b1b] ring-1 ring-[#891b1b]" : "border-gray-200"
                    }`}
                  >
                    <img 
                      src={url} 
                      className="w-full h-full object-cover" 
                      alt={`thumb-${index}`} 
                      onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = "https://placehold.co/100?text=Error"; 
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex-1 border border-gray-100 rounded-lg overflow-hidden bg-[#f9f9f9] flex items-center justify-center min-h-[400px]">
              <ProductZoom image={selectedImage} />
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="md:w-[55%] flex flex-col gap-4">
            <header>
              <h2 className="text-2xl font-bold text-gray-800 leading-tight">{product.name}</h2>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-sm text-gray-400">
                  Brand: <span className="text-gray-700 font-medium">{product.brand || "Shilpo Kotha"}</span>
                </span>
                <Rating value={product.rating || 4} readOnly size="small" />
              </div>
            </header>

            <div className="flex items-center gap-4 border-t border-b py-3">
              <span className="text-3xl font-bold text-[#891b1b]">
                ৳{(product.price || 0).toLocaleString()}
              </span>
              <span className={`ml-auto text-sm font-bold px-2 py-1 rounded ${
                product.countInStock > 0 ? "text-[#00a651] bg-[#e6f6ee]" : "text-red-600 bg-red-50"
              }`}>
                {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
              {product.description}
            </p>

            <div className="size-selection">
              <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase">Select Size:</h4>
              <div className="flex gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setActiveSize(size)}
                    className={`w-10 h-10 border rounded flex items-center justify-center font-bold transition-all ${
                      activeSize === size 
                        ? "bg-[#891b1b] border-[#891b1b] text-white shadow-md" 
                        : "border-gray-200 text-gray-600 hover:border-[#891b1b] bg-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center border border-gray-300 rounded h-12 bg-white overflow-hidden">
                <IconButton onClick={() => quantity > 1 && setQuantity(quantity - 1)} disabled={quantity <= 1}>
                  <Remove fontSize="small" />
                </IconButton>
                <span className="px-4 font-bold min-w-[40px] text-center">{quantity}</span>
                <IconButton onClick={() => setQuantity(quantity + 1)}>
                  <Add fontSize="small" />
                </IconButton>
              </div>

              <Button
                variant="contained"
                fullWidth
                disabled={product.countInStock === 0}
                onClick={handleAddToCart}
                startIcon={<MdOutlineShoppingCart />}
                sx={{ 
                  backgroundColor: "#891b1b", 
                  height: "48px", 
                  fontWeight: "bold", 
                  "&:hover": { backgroundColor: "#691414" }
                }}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ProductModal;