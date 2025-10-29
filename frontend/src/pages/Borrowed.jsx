import React, { useEffect, useState } from "react";
import api from "../api";
import FinesWidget from "../components/FinesWidget";
import { toast } from "react-toastify";

export default function Borrowed() {
  const [records, setRecords] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const load = async () => {
    const { data } = await api.get("/borrow/me");
    setRecords(data);
  };

  useEffect(() => {
    load();
  }, []);

  const openPopup = (record) => {
    setSelectedRecord(record);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedRecord(null);
  };

  const confirmReturn = async () => {
    if (!selectedRecord) return;
    const res = await api.put(`/borrow/${selectedRecord._id}/return`);
    toast.success(`Returned. Fine: ₹${res.data.fine}`, { position: "top-center" });
    closePopup();
    load();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-white p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <FinesWidget />

        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          My Borrow History
        </h2>

        {records.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No borrowed books yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {records.map((r) => (
              <div
                key={r._id}
                className="bg-white/70 backdrop-blur-md border border-purple-100 shadow-lg rounded-2xl p-5 transition-all hover:shadow-xl hover:scale-[1.02]"
              >
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-700">{r.title}</h3>
                    <p className="text-gray-600 mt-1">
                      Borrowed:{" "}
                      <span className="font-medium text-gray-800">
                        {r.borrowDate ? new Date(r.borrowDate).toLocaleDateString() : "N/A"}
                      </span>
                    </p>
                    <p className="text-gray-600">
                      Due:{" "}
                      <span className="font-medium text-gray-800">
                        {r.dueDate ? new Date(r.dueDate).toLocaleDateString() : "N/A"}
                      </span>
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-gray-700 font-medium">
                      Status:{" "}
                      <span
                        className={`${
                          r.status === "borrowed"
                            ? "text-blue-600"
                            : r.status === "returned"
                            ? "text-green-600"
                            : "text-gray-500"
                        } font-semibold`}
                      >
                        {r.status}
                      </span>
                    </p>

                    {r.isOverdue && (
                      <p className="text-red-600 mt-2 font-semibold">
                        ⚠️ Overdue — Fine: ₹{r.currentFine}
                      </p>
                    )}

                    {r.status === "borrowed" ? (
                      <button
                        onClick={() => openPopup(r)}
                        className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold shadow-md hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                      >
                        Return Book
                      </button>
                    ) : (
                      <p className="mt-3 text-green-700 font-medium">
                        ✅ Fine Paid: ₹{r.fine || 0}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 📦 Return Confirmation Popup */}
      {showPopup && selectedRecord && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-[90%] max-w-md text-center border border-purple-100 animate-scaleIn">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Confirm Return</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to return{" "}
              <span className="font-semibold text-purple-700">{selectedRecord.title}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={closePopup}
                className="bg-gray-300 px-5 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmReturn}
                className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-5 py-2 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-800 transition-all"
              >
                Confirm
              </button>
            </div>
          </div>

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleIn {
              from { transform: scale(0.9); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            .animate-fadeIn { animation: fadeIn 0.3s ease forwards; }
            .animate-scaleIn { animation: scaleIn 0.25s ease forwards; }
          `}</style>
        </div>
      )}
    </div>
  );
}
