import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import axiosInstance from '../../../utils/axiosInstance';
import SideBar from "../SideBar/Index";
import ProductItem from "../ProductItem/Index";
import ProductModal from "../ProductModal/index"; 
import { useShop } from "../../../Context/ShopContext"; 
import { useCart } from "../../../Context/CartContext"; 
import { IoGrid } from "react-icons/io5";
import { MdOutlineFormatListBulleted } from "react-icons/md";
import Pagination from "@mui/material/Pagination";

const ProductListing = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("Newest Arrivals");

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const { addToWishlist } = useShop(); 
  const { addToCart } = useCart(); 

  const productsPerPage = 8;

  // ফেচিং লজিক
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      // FIX: axiosInstance ব্যবহার করলে baseURL অটোমেটিক যুক্ত হয়
      const res = await axiosInstance.get('/api/products');
      
      // ডাটা স্ট্রাকচার চেক
      const allData = Array.isArray(res.data) 
        ? res.data 
        : (res.data.products || res.data.data || []);

      const filtered = allData.filter(item => 
        item.designType === 'product' || item.designType === 'productslide'
      );
      
      setProducts(filtered);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]); // এরর হলে খালি অ্যারে সেট করা নিরাপদ
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenModal = (e, product) => {
    e.stopPropagation(); 
    setSelectedProduct(product);
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setSelectedProduct(null);
  };

  // সর্টিং লজিক
  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sortBy === "Price: Low to High") return list.sort((a, b) => a.price - b.price);
    if (sortBy === "Price: High to Low") return list.sort((a, b) => b.price - a.price);
    if (sortBy === "Best Rating") return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return list;
  }, [products, sortBy]);

  // পেজিনেশন লজিক
  const currentItems = sortedProducts.slice(
    (currentPage - 1) * productsPerPage, 
    currentPage * productsPerPage
  );

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#d1c9bd]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#891b1b] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-[#891b1b]">Loading Collection...</h2>
      </div>
    </div>
  );

  return (
    <section className="py-8 px-3 bg-[#d1c9bd] min-h-screen">
      <div className="container mx-auto flex flex-col lg:flex-row gap-6 items-start">
        {/* SIDEBAR */}
        <div className="sidebarWrapper hidden lg:block lg:w-[280px] sticky top-4 self-start">
          <SideBar />
        </div>

        <div className="rightcontent flex-1 w-full">
          {/* HEADER SECTION */}
          <div className="productHeader flex flex-col md:flex-row gap-4 items-center justify-between bg-white/80 backdrop-blur-md p-5 rounded-3xl mb-8 shadow-sm border border-white/40">
            <div className="flex items-center gap-6">
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button onClick={() => setView("grid")} className={`p-2.5 rounded-lg transition-all ${view === "grid" ? "bg-white text-[#891b1b] shadow-sm" : "text-gray-400"}`}><IoGrid size={20} /></button>
                <button onClick={() => setView("list")} className={`p-2.5 rounded-lg transition-all ${view === "list" ? "bg-white text-[#891b1b] shadow-sm" : "text-gray-400"}`}><MdOutlineFormatListBulleted size={20} /></button>
              </div>
              <span className="text-sm font-bold text-gray-600">Total <span className="text-[#891b1b]">{products.length}</span> Products</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase text-gray-400">Sort By</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-white border rounded-xl px-4 py-2 text-xs font-bold outline-none cursor-pointer hover:border-[#891b1b] transition-colors">
                <option>Newest Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Best Rating</option>
              </select>
            </div>
          </div>

          {/* PRODUCT GRID/LIST */}
          {products.length === 0 ? (
            <div className="text-center py-20 bg-white/50 rounded-3xl">
              <p className="text-gray-500 font-bold">No products found in this category.</p>
            </div>
          ) : (
            <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-6"}>
              {currentItems.map((product) => (
                <ProductItem 
                  key={product._id} 
                  item={product} 
                  view={view}
                  onQuickView={handleOpenModal}
                  addToCart={addToCart}
                  addToWishlist={addToWishlist}
                />
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {products.length > productsPerPage && (
            <div className="mt-12 flex justify-center">
               <Pagination 
                  count={Math.ceil(products.length / productsPerPage)} 
                  page={currentPage} 
                  onChange={(e, v) => {
                    setCurrentPage(v);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  sx={{ 
                    "& .Mui-selected": { backgroundColor: "#891b1b !important", color: "white" },
                    "& .MuiPaginationItem-root": { fontWeight: "bold" }
                  }}
               />
            </div>
          )}
        </div>
      </div>

      {/* QUICK VIEW MODAL */}
      {isOpenModal && selectedProduct && (
        <ProductModal closeModal={handleCloseModal} product={selectedProduct} />
      )}
    </section>
  );
};

export default ProductListing;