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
    <nav className="nav">
      <div className="nav-left">
        <Link to="/">Library</Link>
      </div>
      <div className="nav-right">
        <Link to="/">Books</Link>
        {user && <Link to="/borrowed">My Borrowed</Link>}
        {user && user.role === "admin" && <Link to="/admin/books">Admin</Link>}
        {user ? (
          <>
            <span className="nav-user">Hi, {user.name}</span>
            <button className="btn" onClick={signOut}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
