import React, { useEffect, useState } from "react";
import api from "../api";

export default function FinesWidget() {
  const [totalFine, setTotalFine] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/borrow/me");
        // res is array of records enriched with currentFine
        const sum = res.data.reduce((acc, r) => acc + (r.currentFine || 0), 0);
        setTotalFine(sum);
      } catch (err) {
        console.warn("Failed to load fines", err.message);
      }
    };
    load();
  }, []);

  return (
    <div className="card p-4 mb-4">
      <h4 className="text-sm text-gray-600">Outstanding Fines</h4>
      <div className="text-2xl font-bold">₹{totalFine}</div>
    </div>
  );
}
