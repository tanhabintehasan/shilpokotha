import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  MdEmail,
  MdLock,
  MdPerson,
  MdVisibility,
  MdVisibilityOff,
  MdArrowBack,
  MdCheckCircle,
} from "react-icons/md";

const Login = () => {
  const [view, setView] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Redirect if already logged in - FIXED PATH
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo && userInfo !== "undefined" && userInfo !== "null") {
      navigate("/myaccount"); 
    }
  }, [navigate]);

  const togglePassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", formData);
      if (response.status === 201) {
        setView("success");
        setFormData({ name: "", email: "", password: "" });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", response.data.token);

      // FIXED PATH: Must match the route in App.js
      navigate("/myaccount");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === "success") {
      const timer = setTimeout(() => setView("login"), 2500);
      return () => clearTimeout(timer);
    }
  }, [view]);

  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-[#f8f9fa] py-12 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border-2 border-[#691414]">
        {(view === "login" || view === "signup") && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">
                {view === "login" ? "Login" : "Register"}
              </h2>
              {error && <Alert severity="error" className="mt-4">{error}</Alert>}
            </div>

            <form className="flex flex-col gap-5" onSubmit={view === "signup" ? handleSignup : handleLogin}>
              {view === "signup" && (
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  required
                  onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><MdPerson /></InputAdornment> }}
                />
              )}
              <TextField
                fullWidth
                label="Email Id"
                name="email"
                type="email"
                value={formData.email}
                required
                onChange={handleChange}
                InputProps={{ startAdornment: <InputAdornment position="start"><MdEmail /></InputAdornment> }}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                required
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><MdLock /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePassword}>
                        {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                type="submit"
                disabled={loading}
                fullWidth
                sx={{ backgroundColor: "#691414", height: "55px", fontWeight: "bold", "&:hover": { backgroundColor: "#4a0e0e" } }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : view === "login" ? "Login" : "Sign Up"}
              </Button>
            </form>

            <p className="mt-8 text-center text-gray-600">
              {view === "login" ? "Not Registered? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => { setView(view === "login" ? "signup" : "login"); setError(""); }}
                className="text-[#691414] font-bold underline ml-1"
              >
                {view === "login" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </>
        )}

        {view === "success" && (
          <div className="text-center py-10">
            <MdCheckCircle className="text-green-500 text-7xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Registration Successful!</h2>
            <p className="text-gray-500">Redirecting to login...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Login;