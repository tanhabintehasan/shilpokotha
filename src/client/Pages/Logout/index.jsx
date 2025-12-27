import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { MdLogout } from "react-icons/md";

const Logout = ({ isAdmin = false }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (isAdmin) {
      // Clear Admin specific data
      localStorage.removeItem("adminInfo");
      // Redirect to Admin Login
      navigate("/adminlogin");
    } else {
      // Clear Customer specific data
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      // Redirect to Customer Login
      navigate("/login");
    }
    
    // Optional: Refresh page to clear any remaining states in memory
    window.location.reload();
  };

  return (
    <Button
      variant="outlined"
      color="error"
      startIcon={<MdLogout />}
      onClick={handleLogout}
      sx={{
        textTransform: "none",
        fontWeight: "bold",
        borderRadius: "8px",
        padding: "8px 20px",
        borderColor: "#691414",
        color: "#691414",
        "&:hover": {
          backgroundColor: "#691414",
          color: "#fff",
          borderColor: "#691414",
        },
      }}
    >
      Logout
    </Button>
  );
};

export default Logout;