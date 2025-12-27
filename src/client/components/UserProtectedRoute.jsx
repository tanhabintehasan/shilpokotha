import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const UserProtectedRoute = () => {
  const location = useLocation();
  const userInfoRaw = localStorage.getItem("userInfo");
  const userToken = localStorage.getItem("userToken"); // টোকেন আলাদা চেক করা ভালো

  let user = null;
  try {
    // এখানে চেক করা হচ্ছে ডাটা কি আসলেই অবজেক্ট কি না
    if (userInfoRaw && userInfoRaw !== "undefined" && userInfoRaw !== "null") {
      user = JSON.parse(userInfoRaw);
    }
  } catch (error) {
    console.error("User session corrupted:", error);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userToken");
  }

  // ৩ স্তরের সিকিউরিটি চেক:
  // ১. ইউজার অবজেক্ট থাকতে হবে
  // ২. ইউজারের ভেতর টোকেন থাকতে হবে (অথবা আলাদা userToken থাকতে হবে)
  // ৩. ডাটা টাইপ অবজেক্ট হতে হবে
  const isAuthenticated = user && (user.token || userToken);

  if (!isAuthenticated) {
    // state: { from: location } দিলে লগইন করার পর ইউজার আবার এই পেজেই ফিরে আসবে
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default UserProtectedRoute;