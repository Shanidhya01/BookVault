import React, { useEffect, useState } from "react";
import api from "../api";

export default function Borrowed() {
  const [records, setRecords] = useState([]);

  const load = async () => {
    const { data } = await api.get("/borrow/me");
    setRecords(data);
  };

  useEffect(() => { load(); }, []);

  const doReturn = async (id) => {
    if (!confirm("Return this book?")) return;
    await api.post(`/borrow/return/${id}`);
    load();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-100 to-blue-50 py-10 px-4">
      <h2 className="text-3xl font-bold text-purple-700 mb-8 text-center drop-shadow">My Borrowed Books</h2>
      <ul className="space-y-4 max-w-2xl mx-auto">
        {records.length > 0 ? records.map(r => (
          <li key={r._id} className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center justify-between border border-purple-100 hover:shadow-lg transition-all">
            <div>
              <span className="font-bold text-purple-700 text-lg">{r.book.title}</span>
              <span className="ml-2 text-gray-600 text-sm">Borrowed: {new Date(r.borrowDate).toLocaleString()}</span>
            </div>
            <div className="mt-3 md:mt-0">
              {r.status === "borrowed" ? (
                <button
                  className="btn btn-sm bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg px-4 py-1 shadow hover:scale-105 transition-all duration-200"
                  onClick={() => doReturn(r._id)}
                >
                  Return
                </button>
              ) : (
                <span className="text-green-600 font-semibold">Returned: {new Date(r.returnDate).toLocaleString()}</span>
              )}
            </div>
          </li>
        )) : (
          <li className="text-center text-gray-500 text-lg">No borrowed books found.</li>
        )}
      </ul>
    </div>
  );
}
