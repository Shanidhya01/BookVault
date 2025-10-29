import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!form.name.trim()) return toast.error("Name is required");
    if (form.name.length < 2) return toast.error("Name must be at least 2 characters");
    if (!form.email.trim()) return toast.error("Email is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return toast.error("Please enter a valid email address");
    if (!form.password) return toast.error("Password is required");
    if (form.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (form.password !== form.confirmPassword)
      return toast.error("Passwords do not match");
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    toast.dismiss("");
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data } = await api.post("/users/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: "user",
      });
      login(data, data.token);
      toast.success("Registration successful 🎉", { position: "top-center" });
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-emerald-100 to-blue-100 flex items-center justify-center p-6">
      <div className="flex flex-col md:flex-row bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden w-full max-w-6xl border border-white/30">
        {/* Left Section */}
        <div className="md:w-1/2 bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 text-white flex flex-col items-center justify-center p-10 relative overflow-hidden">
          {/* Floating shapes */}
          <div className="absolute inset-0 opacity-25">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white blur-xl"
                style={{
                  width: `${Math.random() * 100 + 30}px`,
                  height: `${Math.random() * 100 + 30}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 5 + 5}s infinite ease-in-out`,
                }}
              ></div>
            ))}
          </div>

          <div className="relative z-10 text-center">
            <div className="text-7xl mb-6">📚✨</div>
            <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">
              Welcome to ABC Library
            </h2>
            <p className="text-lg leading-relaxed opacity-90">
              Join thousands of readers. Discover books, borrow easily, and grow
              your knowledge every day.
            </p>
          </div>

          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px) translateX(0px); }
              50% { transform: translateY(-20px) translateX(15px); }
            }
          `}</style>
        </div>

        {/* Right Section (Form) */}
        <div className="md:w-1/2 w-full bg-white p-10 md:p-16 flex flex-col justify-center">
          <h1 className="text-5xl font-bold text-emerald-700 mb-2">
            Create Account
          </h1>
          <p className="text-gray-500 mb-10 text-lg">
            Sign up to explore thousands of books 📖
          </p>

          <form onSubmit={submit} className="flex flex-col gap-6">
            {/* Name */}
            <div>
              <label className="text-sm font-bold text-gray-800">Full Name</label>
              <input
                type="text"
                className="w-full mt-2 px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition text-gray-700"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-bold text-gray-800">Email</label>
              <input
                type="email"
                className="w-full mt-2 px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition text-gray-700"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-bold text-gray-800">Password</label>
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-5 py-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition text-gray-700"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-bold text-gray-800">Confirm Password</label>
              <div className="relative mt-2">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full px-5 py-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition text-gray-700"
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition"
                >
                  {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-4 rounded-xl shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-lg"
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
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center text-sm text-gray-700">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-emerald-600 font-bold hover:text-emerald-800 transition"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
