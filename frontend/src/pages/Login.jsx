import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email.trim()) {
      setErr("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr("Please enter a valid email address");
      return false;
    }
    if (!password) {
      setErr("Password is required");
      return false;
    }
    if (password.length < 6) {
      setErr("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/users/login", { email, password });
      login(data, data.token);
      setLoading(false);
      navigate("/"); // or your dashboard route
    } catch (error) {
      setErr(error.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-100% bg-gradient-to-br from-purple-200 via-purple-100 to-blue-100 flex items-center justify-center p-8">
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl h-auto md:h-screen max-h-screen">
        {/* Left Side - Image Section */}
        <div className="md:w-1/2 w-full rounded-3xl overflow-hidden shadow-2xl mb-8 md:mb-0">
          <div className="relative w-full h-80 md:h-full bg-gradient-to-br from-orange-400 via-amber-400 to-orange-500 flex flex-col items-center justify-end p-8">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-30 overflow-hidden">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full opacity-40"
                  style={{
                    width: `${Math.random() * 100 + 20}px`,
                    height: `${Math.random() * 100 + 20}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: `hsl(${Math.random() * 60 + 200}, 80%, 60%)`,
                    animation: `float ${Math.random() * 3 + 3}s infinite ease-in-out`,
                  }}
                />
              ))}
            </div>

            {/* Placeholder for image - using gradient and text */}
            <div className="relative z-10 text-center">
              <div className="text-6xl mb-4">📚👥</div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Welcome to ABC Library Management System
              </h2>
              <p className="text-white text-lg leading-relaxed">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
                commodo ligula eget dolor.
              </p>
              <div className="flex gap-2 justify-center mt-6">
                <div className="w-3 h-3 rounded-full bg-white"></div>
                <div className="w-3 h-3 rounded-full bg-white opacity-50"></div>
                <div className="w-3 h-3 rounded-full bg-white opacity-50"></div>
              </div>
            </div>

            <style>{`
              @keyframes float {
                0%, 100% { transform: translateY(0px) translateX(0px); }
                50% { transform: translateY(-20px) translateX(10px); }
              }
            `}</style>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="md:w-1/2 w-full flex flex-col justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-12">
            {/* Error Message */}
            {err && (
              <div className="mb-6 text-red-600 bg-red-100 border-2 border-red-300 rounded-lg px-4 py-3 text-sm text-center font-semibold">
                {err}
              </div>
            )}

            <h1 className="text-5xl font-bold text-black mb-2">Login</h1>
            <p className="text-gray-400 text-lg mb-8">
            </p>

            <div className="flex flex-col gap-6">
              {/* Email Field */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-800">
                  Email or Username
                </label>
                <input
                  className="w-full rounded-xl shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none px-5 py-4 bg-white border-2 border-gray-200 text-gray-700 placeholder-gray-400 text-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email or Username"
                  type="email"
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-800">
                  Password
                </label>
                <div className="relative">
                  <input
                    className="w-full rounded-xl shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none px-5 py-4 pr-12 bg-white border-2 border-gray-200 text-gray-700 placeholder-gray-400 text-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    type={showPassword ? "text" : "password"}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-5 h-5 rounded cursor-pointer accent-purple-600"
                    disabled={loading}
                  />
                  <label className="text-sm text-gray-700 font-medium cursor-pointer">
                    Remember Me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm text-gray-700 font-medium hover:text-purple-600 transition"
                >
                  Forget Password ?
                </a>
              </div>
              <div
                  className="text-center text-sm font-medium text-gray-700"
                >
                  Don't have an account ?
                <Link to="/register" className="text-blue-600 position-absolute text-sm font-medium hover:text-purple-600 transition">Signup</Link>
              </div>

              {/* Login Button */}
              <button
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 rounded-xl shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-lg"
                type="button"
                onClick={submit}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}