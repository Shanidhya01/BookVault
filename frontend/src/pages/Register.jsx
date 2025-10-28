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
    <div className="card">
      <h2>Register</h2>
      {err && <div className="error">{err}</div>}
      <form onSubmit={submit}>
        <input placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required/>
        <input placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} required/>
        <input placeholder="Password" type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} required/>
        <button className="btn" type="submit">Register</button>
      </form>
    </div>
  );
}
