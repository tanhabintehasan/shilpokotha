import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  // 1. Specifically get 'adminInfo' (Admin Session)
  const adminInfoRaw = localStorage.getItem("adminInfo");

  let admin = null;
  try {
    // Check if it exists and isn't the string "undefined" before parsing
    admin = adminInfoRaw && adminInfoRaw !== "undefined" ? JSON.parse(adminInfoRaw) : null;
  } catch (error) {
    console.error("Admin session corrupted:", error);
    localStorage.removeItem("adminInfo");
    admin = null;
  }

  // 2. STRICT AUTHORIZATION CHECK
  // Must have the object, a valid token, and the correct role/flag
  const isAuthorized = 
    admin && 
    admin.token && 
    (admin.role === "admin" || admin.isAdmin === true);

  // 3. Redirect if not authorized
  if (!isAuthorized) {
    // 'replace' prevents the user from using the back button to return to the dashboard
    return <Navigate to="/adminlogin" replace />;
  }

  // 4. If authorized, render the child routes (the Dashboard) via Outlet
  return <Outlet />;
};

export default AdminRoute;