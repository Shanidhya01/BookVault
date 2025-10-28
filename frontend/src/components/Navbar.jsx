import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const signOut = () => {
    logout();
    nav("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-purple-700 via-blue-700 to-purple-700 shadow-lg py-3 px-6 flex items-center justify-between border-b border-purple-300">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-2xl font-bold text-white tracking-wide drop-shadow">Library</Link>
      </div>
      <div className="flex items-center gap-4 text-white font-medium">
        <Link to="/" className="hover:text-blue-200 transition">Books</Link>
        {user && <Link to="/borrowed" className="hover:text-blue-200 transition">My Borrowed</Link>}
        {user && user.role === "admin" && <Link to="/admin/books" className="hover:text-blue-200 transition">Add/Delete Book</Link>}
        {user && user.role === "admin" && <Link to="/admin" className="hover:text-blue-200 transition">Admin</Link>}
        {user ? (
          <>
            <span className="ml-2 px-3 py-1 bg-white/10 rounded-full text-sm font-semibold">Hi, {user.name}</span>
            <button
              className="btn bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-1 px-4 rounded-xl shadow hover:scale-105 transition-all duration-200 ml-2"
              onClick={signOut}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-200 transition">Login</Link>
            <Link to="/register" className="hover:text-blue-200 transition">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
