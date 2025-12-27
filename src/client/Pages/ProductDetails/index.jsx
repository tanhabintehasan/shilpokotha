import React, { useState, useEffect } from "react";
import ProductZoom from "../../components/ProductZoom";
import { useParams } from "react-router-dom";
import { productData } from "../../components/ProductData";
import {
  Rating,
  Button,
  Divider,
  IconButton,
  Avatar,
  TextField,
} from "@mui/material";
import { ShoppingCart, FavoriteBorder, Add, Remove } from "@mui/icons-material";

// Importing your ready slider component
import ProductsSlider from "../../components/ProductsSlider/Index";

const ProductDetails = () => {
  const { id } = useParams();
  const product = productData.find((item) => item.id === parseInt(id));

  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [userRating, setUserRating] = useState(1);

  useEffect(() => {
    if (product) {
      setActiveImage(`/Product${product.id}.webp`);
    }
  }, [product]);

  const handleQuantity = (type) => {
    if (type === "dec") {
      quantity > 1 && setQuantity(quantity - 1);
    } else {
      setQuantity(quantity + 1);
    }
  };

  if (!product) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
      </div>
    );
  }

  const galleryViews = [
    { label: "Full View", style: "object-top" },
    { label: "Detail View", style: "object-center scale-150" },
    { label: "Fabric View", style: "object-bottom scale-[2.5]" },
  ];

  return (
    <section className="product-details-section py-10 bg-[#fdfdfd]">
      <div className="container mx-auto px-4">
        {/* TOP SECTION: Main Product Info */}
        <div className="flex flex-col md:flex-row gap-12">
          {/* LEFT COLUMN: Image Gallery */}
          <div className="md:w-1/2 flex flex-row gap-4">
            <div className="flex flex-col gap-3 min-w-[80px]">
              {galleryViews.map((view, index) => (
                <div
                  key={index}
                  className="w-20 h-24 border-2 cursor-pointer rounded-lg overflow-hidden transition-all duration-300 border-gray-200 hover:border-[#8B4513]"
                >
                  <img
                    src={activeImage}
                    alt={view.label}
                    className={`w-full h-full object-cover transition-transform duration-500 ${view.style}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex-1 ProductZoomerContainer border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
              <ProductZoom image={activeImage} altText={product.name} />
            </div>
          </div>

          {/* RIGHT COLUMN: Product Details */}
          <div className="md:w-1/2 flex flex-col gap-4">
            <header>
              <span className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">
                {product.brand || "Aarong Style"}
              </span>
              <h1 className="text-4xl font-serif font-bold text-gray-900 mt-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mt-3">
                <Rating value={product.rating || 4.5} readOnly size="small" />
                <span className="text-gray-400 text-sm font-medium">
                  12 Reviews
                </span>
              </div>
            </header>

            <div className="price-container flex items-baseline gap-4 py-4">
              <span className="text-3xl font-bold text-[#8B4513]">
                ৳{product.price}
              </span>
              {product.oldPrice && (
                <span className="text-xl text-gray-400 line-through font-light">
                  ৳{product.oldPrice}
                </span>
              )}
            </div>

            <Divider />

            {/* Selection Options */}
            <div className="options flex flex-col gap-3 mt-4">
              <span className="font-bold text-sm text-gray-700 uppercase">
                Select Size
              </span>
              <div className="flex gap-3">
                {["S", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    style={{ backgroundColor: "#F5F0E6" }}
                    className="w-12 h-12 border border-gray-300 hover:border-[#8B4513] hover:text-[#8B4513] font-bold rounded-md transition-all"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="quantity-selector mt-6 flex flex-col gap-3">
              <span className="font-bold text-sm text-gray-700 uppercase">
                Quantity
              </span>
              <div
                style={{ backgroundColor: "#F5F0E6" }}
                className="flex items-center w-max border border-gray-300 rounded-lg overflow-hidden shadow-sm"
              >
                <IconButton
                  onClick={() => handleQuantity("dec")}
                  className="rounded-none px-4 py-2 hover:bg-[#e9e2d5]"
                  size="small"
                >
                  <Remove fontSize="small" />
                </IconButton>
                <span className="px-6 font-bold text-lg min-w-[60px] text-center select-none border-x border-gray-300">
                  {quantity}
                </span>
                <IconButton
                  onClick={() => handleQuantity("inc")}
                  className="rounded-none px-4 py-2 hover:bg-[#e9e2d5]"
                  size="small"
                >
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
                sx={{
                  backgroundColor: "#891b1b",
                  height: "56px",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#5D2E0C" },
                }}
              >
                Add to Cart
              </Button>
              <Button
                variant="outlined"
                sx={{
                  minWidth: "56px",
                  height: "56px",
                  borderColor: "#ddd",
                  color: "#333",
                  borderRadius: "8px",
                  backgroundColor: "#F5F0E6",
                }}
              >
                <FavoriteBorder />
              </Button>
            </div>
          </div>
        </div>

        {/* --- MIDDLE SECTION: Description & Reviews Tabs --- */}
        <div className="mt-20">
          <div className="flex gap-2 mb-0">
            <button
              onClick={() => setActiveTab(0)}
              style={{
                backgroundColor: activeTab === 0 ? "#F5F0E6" : "transparent",
              }}
              className={`px-8 py-3 text-lg font-bold transition-all duration-300 rounded-t-xl border-t border-l border-r ${
                activeTab === 0
                  ? "text-[#891b1b] border-gray-300"
                  : "text-gray-400 border-transparent"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab(1)}
              style={{
                backgroundColor: activeTab === 1 ? "#F5F0E6" : "transparent",
              }}
              className={`px-8 py-3 text-lg font-bold transition-all duration-300 rounded-t-xl border-t border-l border-r ${
                activeTab === 1
                  ? "text-[#891b1b] border-[#891b1b]"
                  : "text-gray-400 border-transparent"
              }`}
            >
              Reviews (3)
            </button>
          </div>

          <div
            style={{ backgroundColor: "#F5F0E6" }}
            className="p-8 border border-[#891b1b] rounded-b-2xl rounded-tr-2xl shadow-sm min-h-[300px]"
          >
            {activeTab === 0 ? (
              <p className="text-gray-700 leading-relaxed text-lg animate-fadeIn">
                {product.description ||
                  "Handcrafted with premium materials, ensuring both elegance and durability for any occasion."}
              </p>
            ) : (
              <div className="animate-fadeIn bg-white p-6 rounded-xl border border-gray-200">
                <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-2">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Customer Questions & Answers
                  </h3>
                  {[
                    {
                      name: "Anurag Thummar",
                      date: "2025-09-30",
                      comment:
                        "The fabric quality is amazing, definitely worth it!",
                      rating: 4,
                    },
                    {
                      name: "Darwish",
                      date: "2025-10-07",
                      comment: "really awesome website broooo",
                      rating: 3,
                    },
                    {
                      name: "harsh panchal",
                      date: "2025-12-01",
                      comment: "lol",
                      rating: 5,
                    },
                  ].map((rev, i) => (
                    <div
                      key={i}
                      className="flex gap-4 items-start border-b border-gray-50 pb-6 last:border-0"
                    >
                      <Avatar
                        sx={{ width: 50, height: 50, bgcolor: "#891b1b" }}
                      >
                        {rev.name[0]}
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-gray-900">
                              {rev.name}
                            </h4>
                            <p className="text-xs text-gray-400">{rev.date}</p>
                          </div>
                          <Rating size="small" value={rev.rating} readOnly />
                        </div>
                        <p className="text-gray-600 mt-2 text-sm">
                          {rev.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-[#891b1b]">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Add a review
                  </h3>
                  <div className="flex flex-col gap-4">
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="Write a review..."
                      variant="outlined"
                      className="bg-gray-50"
                    />
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-bold text-gray-600">
                        Your Rating:
                      </span>
                      <Rating
                        value={userRating}
                        onChange={(e, val) => setUserRating(val)}
                      />
                    </div>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#891b1b",
                        width: "max-content",
                        px: 5,
                        py: 1.5,
                        fontWeight: "bold",
                        mt: 2,
                        "&:hover": { backgroundColor: "#891b1b" },
                      }}
                    >
                      SUBMIT REVIEW
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- BOTTOM SECTION: Related Products Slider --- */}
        <div className="mt-24 border-t border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-serif font-bold text-gray-900">
              Related Products
            </h2>
          </div>
          {/* Using your imported ready slider */}
          <ProductsSlider />
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
