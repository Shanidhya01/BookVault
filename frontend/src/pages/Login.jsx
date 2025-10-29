import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import { toast } from "react-toastify";

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
      toast.error("Email is required", { position: "top-center" });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address", { position: "top-center" });
      return false;
    }
    if (!password) {
      toast.error("Password is required", { position: "top-center" });
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters", { position: "top-center" });
      return false;
    }
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    toast.dismiss("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data } = await api.post("/users/login", { email, password });
      login(data, data.token);
      setLoading(false);
      toast.success("Login successful", { position: "top-center" });
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed", {
        position: "top-center",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-purple-50 flex items-center justify-center p-6 overflow-hidden relative">
      {/* Animated background bubbles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 blur-xl"
            style={{
              width: `${Math.random() * 150 + 50}px`,
              height: `${Math.random() * 150 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `hsl(${Math.random() * 360}, 70%, 70%)`,
              animation: `float ${Math.random() * 6 + 6}s infinite ease-in-out`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-25px) translateX(15px); }
        }
      `}</style>

      {/* Main container */}
      <div className="flex flex-col md:flex-row w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl bg-white/20 backdrop-blur-md border border-white/30">
        {/* Left: Illustration / Welcome Side */}
        <div className="md:w-1/2 w-full bg-gradient-to-br from-orange-400 via-amber-400 to-pink-500 p-10 flex flex-col justify-center text-center text-white relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="relative z-10 space-y-4 animate-fade-in">
            <div className="text-6xl">📚👥</div>
            <h2 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg">
              Welcome to ABC Library
            </h2>
            <p className="text-white/90 text-lg max-w-md mx-auto leading-relaxed">
              Manage, explore, and borrow books effortlessly with a smarter
              library system.
            </p>
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="md:w-1/2 w-full bg-white/80 backdrop-blur-lg p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Login</h1>
          <p className="text-gray-500 mb-8">Access your library dashboard</p>

          {/* Error Alert */}
          {err && (
            <div className="mb-6 text-red-600 bg-red-100 border border-red-300 rounded-lg px-4 py-3 text-sm text-center font-semibold shadow-sm">
              {err}
            </div>
          )}

          <form className="space-y-6" onSubmit={submit}>
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Email or Username
              </label>
              <input
                type="email"
                className="w-full rounded-xl border-2 border-gray-200 bg-white/70 px-5 py-3 text-gray-700 text-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter Email or Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-xl border-2 border-gray-200 bg-white/70 px-5 py-3 pr-12 text-gray-700 text-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            {/* Remember Me / Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-purple-600"
                />
                Remember Me
              </label>
              <a
                href="#"
                className="text-purple-700 hover:text-purple-900 font-medium transition"
              >
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-semibold text-lg shadow-lg hover:shadow-purple-300/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>

            {/* Signup Link */}
            <p className="text-center text-gray-700 text-sm mt-4">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-purple-600 hover:text-purple-800 font-semibold transition"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
