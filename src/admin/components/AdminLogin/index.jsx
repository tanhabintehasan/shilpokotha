import React, { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Redirect if already logged in as admin
  useEffect(() => {
    const adminInfo = localStorage.getItem("adminInfo");
    if (adminInfo) {
      navigate("/admindashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Pointing to the dedicated ADMIN endpoint (matching our new structure)
      const response = await axios.post(
        "http://localhost:5000/api/admin/login",
        { email, password }
      );

      if (response.status === 200) {
        const { token, user } = response.data;

        // Construct Admin-only data object
        const adminData = {
          ...user,
          token,
          isAdmin: true, // Explicitly set based on successful admin route response
        };

        // 2. SEPARATION: Use 'adminInfo' key ONLY
        // This prevents the customer 'userInfo' from being touched
        localStorage.setItem("adminInfo", JSON.stringify(adminData));

        // Optional: dedicated token key for easier middleware access
        localStorage.setItem("adminToken", token);

        // 3. Redirect to the admin-specific dashboard
        navigate("/admindashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Access Denied: Invalid Admin credentials"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        <div className="p-8 text-center bg-white">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-20 mx-auto mb-4 object-contain"
          />
          <h2 className="text-2xl font-bold text-gray-800">Admin Central</h2>
          <p className="text-gray-500 text-sm mt-1">
            Authorized Access for{" "}
            <span className="font-bold text-[#800020]">Shilpo Kotha</span>
          </p>
        </div>

        {error && (
          <div className="mx-8 mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="p-8 pt-0 space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Admin Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@shilpokotha.com"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Secret Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#800020] hover:bg-[#600018] text-white font-bold py-4 rounded-xl shadow-lg transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <ShieldCheck size={20} /> Access Dashboard
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
