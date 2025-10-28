import React, { useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/users/login", { email, password });
      login({ _id: data._id, name: data.name, email: data.email, role: data.role }, data.token);
      navigate("/");
    } catch (error) {
      setErr(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      {err && <div className="error">{err}</div>}
      <form onSubmit={submit}>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" required/>
        <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" required/>
        <button className="btn" type="submit">Login</button>
      </form>
    </div>
  );
}
