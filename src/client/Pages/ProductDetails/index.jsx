import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductZoom from "../../components/ProductZoom";
import { useShop } from "../../../Context/ShopContext"; 
import { useCart } from "../../../Context/CartContext"; 
import { Rating, Button, Divider, IconButton } from "@mui/material";
import { ShoppingCart, FavoriteBorder, Add, Remove } from "@mui/icons-material";
import ProductsSlider from "../../components/ProductsSlider/Index";

const ProductDetails = () => {
  const { id } = useParams();
  
  // These two hooks are likely where the .find() crash is hiding
  const { addToCart } = useCart();
  const { addToWishlist } = useShop();
  
  const BACKEND_URL = "";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [activeSize, setActiveSize] = useState("M");

  const getImageUrl = (imgSource) => {
    if (!imgSource || imgSource === "undefined") return "https://placehold.co/600x800?text=No+Image";
    if (imgSource.startsWith("http")) return imgSource;
    const cleanPath = imgSource.startsWith("/") ? imgSource : `/${imgSource}`;
    return `${BACKEND_URL}${cleanPath.includes("uploads") ? cleanPath : "/uploads" + cleanPath}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${BACKEND_URL}/api/products/${id}`);
        if (data) {
          setProduct(data);
          const imagesArray = Array.isArray(data.images) ? data.images : [];
          const initialImg = imagesArray.length > 0 
            ? imagesArray[0] 
            : (data.image || data.imageURL);
          setActiveImage(getImageUrl(initialImg));
        }
      } catch (err) { 
        console.error("Fetch error:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    if (id) fetchProduct();
    window.scrollTo(0, 0);
  }, [id, BACKEND_URL]); // Added dependencies

  if (loading) return <div className="py-40 text-center text-[#891b1b] font-bold text-xl">Loading...</div>;
  if (!product) return <div className="py-40 text-center font-bold">Product not found</div>;

  const productImages = Array.isArray(product?.images) && product.images.length > 0 
    ? product.images 
    : [product?.image || product?.imageURL];

  return (
    <section className="product-details-section py-10 bg-[#fdfdfd]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12">
          
          <div className="md:w-1/2 flex flex-row gap-4">
            <div className="flex flex-col gap-3 min-w-[80px] max-h-[500px] overflow-y-auto custom-scrollbar">
              {productImages.map((img, i) => {
                const url = getImageUrl(img);
                return (
                  <div 
                    key={i} 
                    onMouseEnter={() => setActiveImage(url)}
                    className={`w-20 h-24 border-2 cursor-pointer rounded-lg overflow-hidden transition-all ${
                      activeImage === url ? "border-[#891b1b]" : "border-gray-200 hover:border-[#891b1b]"
                    }`}
                  >
                    <img src={url} className="w-full h-full object-cover" alt={`view-${i}`} />
                  </div>
                );
              })}
            </div>
            <div className="flex-1 border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm h-[500px]">
              <ProductZoom image={activeImage} altText={product?.name} />
            </div>
          </div>

          <div className="md:w-1/2 flex flex-col gap-4">
            <header>
              <span className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">
                {product?.brand || "Artisan Collection"}
              </span>
              <h1 className="text-4xl font-serif font-bold text-gray-900 mt-2">{product?.name}</h1>
              <div className="flex items-center gap-2 mt-3">
                <Rating value={Number(product?.rating) || 0} readOnly size="small" precision={0.5} />
                <span className="text-gray-400 text-sm">({product?.numReviews || 0} Reviews)</span>
              </div>
            </header>

            <div className="price-container flex items-baseline gap-4 py-2">
              <span className="text-3xl font-bold text-[#891b1b]">৳{Number(product?.price || 0).toLocaleString()}</span>
              {product?.oldPrice > product?.price && (
                <span className="text-xl text-gray-400 line-through">৳{product?.oldPrice.toLocaleString()}</span>
              )}
            </div>

            <Divider />

            <div className="options mt-4">
              <span className="font-bold text-sm uppercase text-gray-700">Select Size</span>
              <div className="flex gap-3 mt-3">
                {(Array.isArray(product?.sizes) && product.sizes.length > 0 ? product.sizes : ["S", "M", "L", "XL"]).map((size) => (
                  <button 
                    key={size} 
                    onClick={() => setActiveSize(size)} 
                    className={`w-12 h-12 border rounded-md font-bold transition-all ${
                      activeSize === size ? "bg-[#891b1b] text-white border-[#891b1b]" : "bg-[#F5F0E6] text-black hover:border-[#891b1b]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="quantity-selector mt-6">
              <span className="font-bold text-sm uppercase text-gray-700">Quantity</span>
              <div className="flex items-center w-max border border-gray-300 rounded-lg overflow-hidden bg-[#F5F0E6] mt-3">
                <IconButton onClick={() => quantity > 1 && setQuantity(quantity - 1)} disabled={quantity <= 1}>
                  <Remove fontSize="small" />
                </IconButton>
                <span className="px-6 font-bold text-lg min-w-[60px] text-center">{quantity}</span>
                <IconButton onClick={() => setQuantity(quantity + 1)} disabled={product?.countInStock > 0 && quantity >= product.countInStock}>
                  <Add fontSize="small" />
                </IconButton>
              </div>
            </div>

            <div className="actions flex gap-4 mt-8">
              <Button 
                variant="contained" 
                fullWidth 
                size="large" 
                startIcon={<ShoppingCart />} 
                onClick={() => product && addToCart(product, quantity, activeSize)} 
                disabled={!product || product.countInStock === 0}
                sx={{ backgroundColor: "#891b1b", height: "56px", fontWeight: "bold", borderRadius: "8px", "&:hover": { backgroundColor: "#691414" } }}
              >
                {product?.countInStock > 0 ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => product && addToWishlist(product)} 
                sx={{ minWidth: "56px", height: "56px", borderColor: "#ddd", backgroundColor: "#F5F0E6", color: "#891b1b" }}
              >
                <FavoriteBorder />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="flex gap-2">
            <button onClick={() => setActiveTab(0)} className={`px-8 py-3 font-bold rounded-t-xl border-t border-x transition-colors ${activeTab === 0 ? "bg-[#F5F0E6] text-[#891b1b] border-[#891b1b]" : "text-gray-400 bg-transparent border-transparent"}`}>Description</button>
            <button onClick={() => setActiveTab(1)} className={`px-8 py-3 font-bold rounded-t-xl border-t border-x transition-colors ${activeTab === 1 ? "bg-[#F5F0E6] text-[#891b1b] border-[#891b1b]" : "text-gray-400 bg-transparent border-transparent"}`}>Reviews ({product?.numReviews || 0})</button>
          </div>
          <div className="p-8 border border-[#891b1b] rounded-b-2xl rounded-tr-2xl bg-[#F5F0E6] min-h-[200px]">
            {activeTab === 0 ? (
              <div className="prose max-w-none text-gray-700 leading-relaxed">
                {product?.description || "No description available."}
              </div>
            ) : (
              <div className="reviews-section">
                <p className="text-gray-600">No reviews yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;