import React, { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [pending, setPending] = useState([]);
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadAllRecords = async (p = 1) => {
    const res = await api.get("/borrow", { params: { page: p, limit: 10 } });
    setRecords(res.data.data);
    setPage(res.data.page);
    setTotalPages(res.data.totalPages);
  };

  const loadStats = async () => {
    const res = await api.get("/admin/stats");
    setStats(res.data);
  };

  const loadPending = async () => {
    const res = await api.get("/borrow/requests");
    setPending(res.data);
  };

  useEffect(() => {
    loadStats();
    loadPending();
    loadAllRecords(1);
  }, []);

  const approve = async (id) => {
    try {
      await api.post(`/borrow/approve/${id}`);
      loadPending();
      loadAllRecords();
      loadStats();
      alert("Approved");
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  const reject = async (id) => {
    try {
      await api.post(`/borrow/reject/${id}`);
      loadPending();
      loadAllRecords();
      loadStats();
      alert("Rejected");
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div>
      {/* <Navbar /> */}
      <div className="container p-6">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="card">
            <h3>Total Users</h3>
            <p className="text-xl">{stats.totalUsers ?? 0}</p>
          </div>
          <div className="card">
            <h3>Total Books</h3>
            <p className="text-xl">{stats.totalBooks ?? 0}</p>
          </div>
          <div className="card">
            <h3>Borrowed Records</h3>
            <p className="text-xl">{stats.totalBorrowedRecords ?? 0}</p>
          </div>
          <div className="card">
            <h3>Currently Borrowed</h3>
            <p className="text-xl">{stats.currentlyBorrowed ?? 0}</p>
          </div>
        </div>

        <h3 className="text-xl mb-2">Pending Requests</h3>
        {pending.length === 0 ? (
          <p>No pending requests</p>
        ) : (
          pending.map((req) => (
            <div
              key={req._id}
              className="card mb-2 flex justify-between items-center"
            >
              <div>
                <strong>{req.user?.name}</strong> requested{" "}
                <em>{req.book?.title}</em> at{" "}
                {new Date(req.requestedAt).toLocaleString()}
              </div>
              <div className="flex gap-2">
                <button className="btn" onClick={() => approve(req._id)}>
                  Approve
                </button>
                <button className="btn small" onClick={() => reject(req._id)}>
                  Reject
                </button>
              </div>
            </div>
          ))
        )}

        <h3 className="text-xl mt-6 mb-2">All Borrow Records</h3>
        <div>
          {records.map((r) => (
            <div key={r._id} className="card mb-2">
              <div className="flex justify-between">
                <div>
                  <strong>{r.user?.name}</strong> — <em>{r.book?.title}</em>
                  <div>
                    Status: {r.status}{" "}
                    {r.status === "borrowed" && r.dueDate
                      ? ` (Due: ${new Date(r.dueDate).toLocaleDateString()})`
                      : ""}
                  </div>
                </div>
                <div>
                  {r.status === "borrowed" && r.isOverdue && (
                    <div className="text-red-600">
                      Overdue — Fine: ₹{r.currentFine}
                    </div>
                  )}
                  {r.status === "returned" && (
                    <div>Fine charged: ₹{r.fine}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <button className="btn small" disabled={page <= 1} onClick={() => loadAllRecords(page - 1)}>Prev</button>
        <div>Page {page} of {totalPages}</div>
        <button className="btn small" disabled={page >= totalPages} onClick={() => loadAllRecords(page + 1)}>Next</button>
      </div>
    </div>
  );
}
