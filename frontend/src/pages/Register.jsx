import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!form.name.trim()) {
      setErr("Name is required");
      return false;
    }
    if (form.name.length < 2) {
      setErr("Name must be at least 2 characters");
      return false;
    }
    if (!form.email.trim()) {
      setErr("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErr("Please enter a valid email address");
      return false;
    }
    if (!form.password) {
      setErr("Password is required");
      return false;
    }
    if (form.password.length < 6) {
      setErr("Password must be at least 6 characters");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setErr("Passwords do not match");
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
      const { data } = await api.post("/users/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: "user"
      });
      login(data, data.token);
      setLoading(false);
      navigate("/"); // or your dashboard route
    } catch (error) {
      setErr(error.response?.data?.message || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-purple-200 via-purple-100 to-blue-100 flex items-center justify-center p-8">
      <div className="flex gap-8 w-full max-w-6xl h-screen max-h-screen">
        
        {/* Left Side - Image Section */}
        <div className="w-1/2 rounded-3xl overflow-hidden shadow-2xl">
          <div className="relative w-full h-full bg-gradient-to-br from-green-400 via-emerald-400 to-green-500 flex flex-col items-center justify-end p-8">
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
                    background: `hsl(${Math.random() * 60 + 100}, 80%, 60%)`,
                    animation: `float ${Math.random() * 3 + 3}s infinite ease-in-out`,
                  }}
                />
              ))}
            </div>

            {/* Placeholder for image - using gradient and text */}
            <div className="relative z-10 text-center">
              <div className="text-6xl mb-4">📚✍️</div>
              <h2 className="text-4xl font-bold text-white mb-4">Join ABC Library Management System</h2>
              <p className="text-white text-lg leading-relaxed">
                Create an account and start exploring thousands of books. Join our community of readers and learners.
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

        {/* Right Side - Register Form */}
        <div className="w-1/2 flex flex-col justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-12 max-h-screen overflow-y-auto">
            {/* Error Message */}
            {err && (
              <div className="mb-6 text-red-600 bg-red-100 border-2 border-red-300 rounded-lg px-4 py-3 text-sm text-center font-semibold">
                {err}
              </div>
            )}

            <h1 className="text-5xl font-bold text-black mb-2">Register</h1>
            <p className="text-gray-400 text-lg mb-8">Create your account to get started</p>

            <div className="flex flex-col gap-6">
              {/* Name Field */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-800">
                  Full Name
                </label>
                <input
                  className="w-full rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none px-5 py-4 bg-white border-2 border-gray-200 text-gray-700 placeholder-gray-400 text-lg"
                  placeholder="Enter Your Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={loading}
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-800">
                  Email Address
                </label>
                <input
                  className="w-full rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none px-5 py-4 bg-white border-2 border-gray-200 text-gray-700 placeholder-gray-400 text-lg"
                  placeholder="Enter Your Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                    className="w-full rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none px-5 py-4 pr-12 bg-white border-2 border-gray-200 text-gray-700 placeholder-gray-400 text-lg"
                    placeholder="Enter Password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition"
                  >
                    {showPassword ? (
                      <EyeOff size={22} />
                    ) : (
                      <Eye size={22} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-800">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    className="w-full rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none px-5 py-4 pr-12 bg-white border-2 border-gray-200 text-gray-700 placeholder-gray-400 text-lg"
                    placeholder="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={22} />
                    ) : (
                      <Eye size={22} />
                    )}
                  </button>
                </div>
              </div>

              {/* Register Button */}
              <button
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-4 rounded-xl shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-lg"
                type="button"
                onClick={submit}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Creating Account...
                  </span>
                ) : (
                  "Register"
                )}
              </button>
            </div>

            {/* Sign In Link */}
            <div className="mt-8 text-center text-sm text-gray-700">
              Already have an account?{" "}
              <a
                href="#"
                className="text-emerald-600 font-bold hover:text-emerald-700 transition"
              >
                Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}