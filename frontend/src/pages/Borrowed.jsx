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
    <div>
      <h2>My Borrowed Books</h2>
      <ul className="list">
        {records.map(r => (
          <li key={r._id}>
            <strong>{r.book.title}</strong> — Borrowed: {new Date(r.borrowDate).toLocaleString()}
            {r.status === "borrowed" ? <button className="btn small" onClick={()=>doReturn(r._id)}>Return</button> : <span>Returned: {new Date(r.returnDate).toLocaleString()}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
