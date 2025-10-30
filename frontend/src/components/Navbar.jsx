import React, { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BookOpen, Menu, X } from "lucide-react"; // install: npm i lucide-react

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const confirmLogout = () => {
    logout();
    setShowPopup(false);
    nav("/login");
  };

  return (
    <>
      {/* NAVBAR */}
  <nav className="sticky top-0 z-50 backdrop-blur-md bg-linear-to-r from-purple-700/70 via-blue-700/60 to-purple-700/70 border-b border-white/20 shadow-lg px-6 py-3 flex items-center justify-between">
        {/* Brand Section */}
        <div className="flex items-center gap-3">
          <BookOpen className="text-white drop-shadow-md w-7 h-7" />
          <Link
            to="/"
            className="text-2xl font-extrabold bg-linear-to-r from-white to-blue-200 bg-clip-text text-transparent tracking-wide drop-shadow-sm"
          >
            BookVault
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-white font-medium">
          <NavLinks user={user} setShowPopup={setShowPopup} />
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white hover:scale-110 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
  <div className="md:hidden absolute top-[60px] left-0 w-full bg-linear-to-b from-purple-800/95 to-blue-800/95 backdrop-blur-md text-white flex flex-col items-center py-4 gap-3 border-b border-white/20 z-40">
          <NavLinks user={user} setShowPopup={setShowPopup} closeMenu={() => setMenuOpen(false)} />
          <ThemeToggle />
        </div>
      )}

      {/* Logout Confirmation Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl text-center max-w-sm w-[90%] border border-white/20">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Confirm Logout
            </h2>
            <p className="text-gray-600 mb-5">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-linear-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:scale-105 transition"
                onClick={confirmLogout}
              >
                Yes, Logout
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium shadow-sm hover:scale-105 transition"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ✅ Reusable NavLinks component for desktop & mobile */
function NavLinks({ user, setShowPopup, closeMenu }) {
  return (
    <>
      <NavLink to="/" closeMenu={closeMenu}>
        Books
      </NavLink>
      {user && (
        <NavLink to="/borrowed" closeMenu={closeMenu}>
          My Borrowed
        </NavLink>
      )}
      {user && user.role === "admin" && (
        <>
          <NavLink to="/admin/books" closeMenu={closeMenu}>
            Add/Delete Book
          </NavLink>
          <NavLink to="/admin" closeMenu={closeMenu}>
            Admin
          </NavLink>
        </>
      )}

      {user ? (
        <>
          <span className="ml-2 px-3 py-1 bg-white/10 rounded-full text-sm font-semibold">
            Hi, {user.name}
          </span>
          <button
            className="bg-linear-to-r from-purple-500 to-blue-500 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-1.5 px-5 rounded-xl shadow-lg hover:shadow-purple-300/40 transition-all duration-300 hover:scale-105 ml-2"
            onClick={() => {
              setShowPopup(true);
              closeMenu && closeMenu();
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <NavLink to="/login" closeMenu={closeMenu}>
            Login
          </NavLink>
          <NavLink to="/register" closeMenu={closeMenu}>
            Register
          </NavLink>
        </>
      )}
    </>
  );
}

/* ✅ Custom NavLink with hover underline animation */
function NavLink({ to, children, closeMenu }) {
  return (
    <Link
      to={to}
      onClick={closeMenu}
      className="relative group transition text-white/90 hover:text-white font-medium"
    >
      {children}
  <span className="absolute left-0 bottom-[-3px] w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
}
