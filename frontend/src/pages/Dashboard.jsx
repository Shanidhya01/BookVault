import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (user && user.role === "admin") {
        const { data } = await api.get("/borrow"); // admin: all records
        setRecords(data);
      } else {
        const { data } = await api.get("/borrow/me");
        setRecords(data);
      }
    };
    load();
  }, [user]);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user?.name}</p>
      <h3>Borrow Records</h3>
      <ul className="list">
        {records.map(r => (
          <li key={r._id}>
            {r.user ? `${r.user.name} — ` : ""}<strong>{r.book.title}</strong> — {r.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
