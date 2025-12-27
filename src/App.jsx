import React from "react";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";

// Styles
import "./App.css";

// Context
import { ShopProvider } from "./Context/ShopContext"; 

// Components & Pages
import Header from "./client/components/Header";
import Home from "./client/Pages/Home";
import ProductListing from "./client/components/ProductListing";
import Footer from "./client/components/Footer";
import IconSection from "./client/components/IconSection";
import ProductDetails from "./client/Pages/ProductDetails";
import Login from "./client/Pages/Singin"; 
import CartPage from "./client/Pages/CartPage";
import WishPage from "./client/Pages/WishPage";
import CheckOut from "./client/Pages/CheckOut";
import MyAccount from "./client/Pages/MyAccount";
import MyOrders from "./client/Pages/MyOder";
import AdminDashboard from "./admin/components/AdminDashboard";
import AdminLogin from "./admin/components/AdminLogin";

// Guards
import UserProtectedRoute from "./client/components/UserProtectedRoute";
import AdminRoute from "./admin/components/AdminRoute"; 

const ContentWrapper = ({ children }) => {
  const location = useLocation();
  const path = location.pathname.toLowerCase();
  const isAdminPath = path.includes("/adminlogin") || path.includes("/admindashboard");

  return (
    <>
      {!isAdminPath && <Header />}
      <main className={isAdminPath ? "admin-layout" : "min-h-screen"}>{children}</main>
      {!isAdminPath && (
        <>
          <IconSection />
          <Footer />
        </>
      )}
    </>
  );
};

function App() {
  return (
    <ShopProvider> {/* এই লাইনটি আপনার এরর ফিক্স করবে */}
      <BrowserRouter>
        <ContentWrapper>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/productlisting" element={<ProductListing />} />
            <Route path="/products/:category" element={<ProductListing />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishPage />} />

            <Route element={<UserProtectedRoute />}>
              <Route path="/myaccount" element={<MyAccount />} />
              <Route path="/myoder" element={<MyOrders />} />
              <Route path="/checkout" element={<CheckOut />} />
            </Route>

            <Route path="/adminlogin" element={<AdminLogin />} />
            <Route element={<AdminRoute />}>
              <Route path="/admindashboard/*" element={<AdminDashboard />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ContentWrapper>
      </BrowserRouter>
    </ShopProvider>
  );
}

export default App;