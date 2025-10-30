import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Books from "./pages/Books";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./pages/Dashboard";
import Borrowed from "./pages/Borrowed";
import { useAuth } from "./context/AuthContext";
import "./index.css";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBooks from "./pages/AdminBooks";
import AdminSettings from "./pages/AdminSettings";

function PrivateRoute({ children, adminOnly }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <div>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Books />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/borrowed"
            element={
              <PrivateRoute>
                <Borrowed />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/books"
            element={
              <PrivateRoute adminOnly={true}>
                <AdminBooks />
              </PrivateRoute>
            }
          />
            <Route
              path="/admin/settings"
              element={
                <PrivateRoute adminOnly={true}>
                  <AdminSettings />
                </PrivateRoute>
              }
            />
          <Route path="/books" element={<Books />} />
          <Route
            path="/borrowed"
            element={
              <ProtectedRoute>
                <Borrowed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<h2>Page not found</h2>} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </main>
    </div>
  );
}
