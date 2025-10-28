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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-100 to-blue-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
        <h2 className="text-3xl font-bold text-purple-700 mb-4 text-center drop-shadow">Dashboard</h2>
        <p className="text-lg text-gray-700 mb-8 text-center">Welcome, <span className="font-semibold text-purple-600">{user?.name}</span></p>
        <h3 className="text-xl font-semibold text-purple-600 mb-4">Borrow Records</h3>
        <ul className="space-y-4">
          {records.length > 0 ? records.map(r => (
            <li key={r._id} className="bg-purple-50 rounded-xl px-4 py-3 shadow flex flex-col md:flex-row md:items-center justify-between border border-purple-200 hover:shadow-lg transition-all">
              <div>
                {r.user ? <span className="font-semibold text-blue-700 mr-2">{r.user.name}</span> : null}
                <span className="font-bold text-purple-700 text-lg">{r.book.title}</span>
              </div>
              <span className={`ml-2 text-sm font-semibold ${r.status === "borrowed" ? "text-yellow-600" : "text-green-600"}`}>{r.status}</span>
            </li>
          )) : (
            <li className="text-center text-gray-500 text-lg">No borrow records found.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
