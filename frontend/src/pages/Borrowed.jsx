import React, { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import FinesWidget from "../components/FinesWidget";
import { toast } from "react-toastify";

export default function Borrowed() {
  const [records, setRecords] = useState([]);

  const load = async () => {
    const { data } = await api.get("/borrow/me");
    setRecords(data);
  };

  useEffect(() => { load(); }, []);

  const doReturn = async (id) => {
    if (!confirm("Return this book?")) return;
    const res = await api.put(`/borrow/${id}/return`);
    toast(`Returned. Fine: ₹${res.data.fine}`);
    load();
  };

  return (
    <div>
      {/* <Navbar /> */}
      <div className="container p-6">
        <FinesWidget />
        <h2>My Borrow History</h2>
        {records.length === 0 ? <p>No records</p> :
          records.map(r => (
            <div key={r._id} className="card mb-2">
              <div className="flex justify-between">
                <div>
                  <strong>{r.title}</strong>
                  <div>Borrowed: {r.borrowDate ? new Date(r.borrowDate).toLocaleString() : "N/A"}</div>
                  <div>Due: {r.dueDate ? new Date(r.dueDate).toLocaleDateString() : "N/A"}</div>
                </div>
                <div>
                  <div>Status: {r.status}</div>
                  {r.isOverdue && <div className="text-red-600">Overdue — Current fine: ₹{r.currentFine}</div>}
                  {r.status === "borrowed" && <button className="btn" onClick={() => doReturn(r._id)}>Return</button>}
                  {r.status === "returned" && <div>Fine paid: ₹{r.fine}</div>}
                </div>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
}
