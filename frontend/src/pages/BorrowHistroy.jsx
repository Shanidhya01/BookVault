import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function BorrowHistory() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    api.get(user.role === "admin" ? "/borrow/admin/history" : "/borrow/history").then(({ data }) => setRecords(data));
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-100 to-blue-50 py-10 px-4">
      <h2 className="text-3xl font-bold text-purple-700 mb-8 text-center drop-shadow">Borrow History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-2xl shadow-lg border border-purple-100">
          <thead>
            <tr>
              {user.role === "admin" && <th className="px-4 py-2">Student</th>}
              <th className="px-4 py-2">Book</th>
              <th className="px-4 py-2">Borrow Date</th>
              <th className="px-4 py-2">Return Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Fine</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r._id} className="border-t">
                {user.role === "admin" && <td className="px-4 py-2">{r.user?.name}</td>}
                <td className="px-4 py-2">{r.book?.title}</td>
                <td className="px-4 py-2">{new Date(r.borrowDate).toLocaleDateString()}</td>
                <td className="px-4 py-2">{r.returnDate ? new Date(r.returnDate).toLocaleDateString() : "-"}</td>
                <td className={`px-4 py-2 font-semibold ${r.status === "overdue" ? "text-red-600" : r.status === "returned" ? "text-green-600" : "text-yellow-600"}`}>{r.status}</td>
                <td className="px-4 py-2">{r.fine ? `₹${r.fine}` : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}