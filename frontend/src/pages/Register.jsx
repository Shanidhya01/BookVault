import React, { useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/users/register", form);
      login({ _id: data._id, name: data.name, email: data.email, role: data.role }, data.token);
      nav("/");
    } catch (error) {
      setErr(error.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-purple-100 to-blue-50 py-10 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-purple-100">
        <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center drop-shadow">Register</h2>
        {err && <div className="mb-4 text-red-600 bg-red-100 border border-red-200 rounded-lg px-4 py-2 text-center font-semibold">{err}</div>}
        <form onSubmit={submit} className="flex flex-col gap-5">
          <input
            className="input input-bordered w-full rounded-xl shadow focus:ring-2 focus:ring-purple-400"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="input input-bordered w-full rounded-xl shadow focus:ring-2 focus:ring-purple-400"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            type="email"
          />
          <input
            className="input input-bordered w-full rounded-xl shadow focus:ring-2 focus:ring-purple-400"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button
            className="btn bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-2 rounded-xl shadow hover:scale-105 transition-all duration-200"
            type="submit"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
