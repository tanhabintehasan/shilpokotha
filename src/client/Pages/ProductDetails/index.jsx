import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductZoom from "../../components/ProductZoom";
import { useShop } from "../../../Context/ShopContext"; 
import { useCart } from "../../../Context/CartContext"; 
import { Rating, Button, Divider, IconButton, Avatar, TextField } from "@mui/material";
import { ShoppingCart, FavoriteBorder, Add, Remove } from "@mui/icons-material";
import ProductsSlider from "../../components/ProductsSlider/Index";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist } = useShop();
  const BACKEND_URL = "http://localhost:5000";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [userRating, setUserRating] = useState(5);
  const [activeSize, setActiveSize] = useState("M");

  const getImageUrl = (imgSource) => {
    if (!imgSource) return "https://placehold.co/600x800?text=No+Image";
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
          const initialImg = data.images?.[0] || data.image || data.imageURL;
          setActiveImage(getImageUrl(initialImg));
        }
      } catch (err) { console.error("Fetch error:", err); } 
      finally { setLoading(false); }
    };
    if (id) fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="py-40 text-center">Loading...</div>;
  if (!product) return <div className="py-40 text-center font-bold">Product not found</div>;

  return (
    <section className="product-details-section py-10 bg-[#fdfdfd]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Gallery & Zoom */}
          <div className="md:w-1/2 flex flex-row gap-4">
            <div className="flex flex-col gap-3 min-w-[80px]">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-20 h-24 border-2 cursor-pointer rounded-lg overflow-hidden hover:border-[#8B4513]">
                  <img src={activeImage} className="w-full h-full object-cover" alt="view" />
                </div>
              ))}
            </div>
            <div className="flex-1 border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
              <ProductZoom image={activeImage} altText={product.name} />
            </div>
          </div>

          {/* Info & Actions */}
          <div className="md:w-1/2 flex flex-col gap-4">
            <header>
              <span className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">{product.brand || "Aarong Style"}</span>
              <h1 className="text-4xl font-serif font-bold text-gray-900 mt-2">{product.name}</h1>
              <div className="flex items-center gap-2 mt-3">
                <Rating value={product.rating || 4.5} readOnly size="small" />
                <span className="text-gray-400 text-sm">{product.numReviews || 3} Reviews</span>
              </div>
            </header>
            <div className="price-container flex items-baseline gap-4 py-4">
              <span className="text-3xl font-bold text-[#8B4513]">৳{product.price}</span>
              {product.oldPrice && <span className="text-xl text-gray-400 line-through">৳{product.oldPrice}</span>}
            </div>
            <Divider />
            <div className="options mt-4">
              <span className="font-bold text-sm uppercase">Select Size</span>
              <div className="flex gap-3 mt-3">
                {["S", "M", "L", "XL"].map((size) => (
                  <button key={size} onClick={() => setActiveSize(size)} className={`w-12 h-12 border rounded-md font-bold transition-all ${activeSize === size ? "bg-[#8B4513] text-white" : "bg-[#F5F0E6] text-black hover:border-[#8B4513]"}`}>{size}</button>
                ))}
              </div>
            </div>
            <div className="quantity-selector mt-6">
              <span className="font-bold text-sm uppercase">Quantity</span>
              <div className="flex items-center w-max border border-gray-300 rounded-lg overflow-hidden bg-[#F5F0E6] mt-3">
                <IconButton onClick={() => quantity > 1 && setQuantity(quantity - 1)}><Remove fontSize="small" /></IconButton>
                <span className="px-6 font-bold text-lg min-w-[60px] text-center">{quantity}</span>
                <IconButton onClick={() => setQuantity(quantity + 1)}><Add fontSize="small" /></IconButton>
              </div>
            </div>
            <div className="actions flex gap-4 mt-8">
              <Button variant="contained" fullWidth size="large" startIcon={<ShoppingCart />} onClick={() => addToCart(product, quantity, activeSize)} sx={{ backgroundColor: "#891b1b", height: "56px", fontWeight: "bold", borderRadius: "8px", "&:hover": { backgroundColor: "#5D2E0C" } }}>Add to Cart</Button>
              <Button variant="outlined" onClick={() => addToWishlist(product)} sx={{ minWidth: "56px", height: "56px", borderColor: "#ddd", backgroundColor: "#F5F0E6" }}><FavoriteBorder /></Button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-20">
          <div className="flex gap-2">
            <button onClick={() => setActiveTab(0)} className={`px-8 py-3 font-bold rounded-t-xl border-t border-x ${activeTab === 0 ? "bg-[#F5F0E6] text-[#891b1b]" : "text-gray-400"}`}>Description</button>
            <button onClick={() => setActiveTab(1)} className={`px-8 py-3 font-bold rounded-t-xl border-t border-x ${activeTab === 1 ? "bg-[#F5F0E6] text-[#891b1b]" : "text-gray-400"}`}>Reviews (3)</button>
          </div>
          <div className="p-8 border border-[#891b1b] rounded-b-2xl rounded-tr-2xl bg-[#F5F0E6] min-h-[200px]">
            {activeTab === 0 ? <p className="text-gray-700 leading-relaxed">{product.description || "Handcrafted elegance."}</p> : <p>Review section content here...</p>}
          </div>
        </div>
        <div className="mt-24 pt-12 border-t border-gray-100">
           <h2 className="text-3xl font-serif font-bold mb-8">Related Products</h2>
           <ProductsSlider />
        </div>
      </div>
    </section>
  );
};
export default ProductDetails;