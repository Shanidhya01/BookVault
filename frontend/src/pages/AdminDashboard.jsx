import React, { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28BFE",
  "#FEA8B0",
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");

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
      toast.success("Approved");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const reject = async (id) => {
    try {
      await api.post(`/borrow/reject/${id}`);
      loadPending();
      loadAllRecords();
      loadStats();
      toast.info("Rejected");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!stats) return <p className="text-center mt-10">Loading dashboard...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          📊 Admin Dashboard
        </h1>

        {/* Stat cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition">
            <h3 className="text-gray-600 font-medium mb-1">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">
              {stats.totalUsers ?? 0}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition">
            <h3 className="text-gray-600 font-medium mb-1">Total Books</h3>
            <p className="text-3xl font-bold text-green-600">
              {stats.totalBooks ?? 0}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition">
            <h3 className="text-gray-600 font-medium mb-1">Borrowed Records</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {stats.activeBorrows ?? 0}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition">
            <h3 className="text-gray-600 font-medium mb-1">
              Currently Borrowed
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {stats.activeBorrows ?? 0}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
          {stats.categoryDistribution?.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                📚 Book Distribution by Category
              </h3>
              <ResponsiveContainer width="100%" height={360}>
                <PieChart
                  margin={{
                    top: 10,
                    right: 30,
                    bottom: 50,
                    left: 30,
                  }}
                >
                  <Pie
                    data={stats.categoryDistribution}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="45%"
                    outerRadius={85}
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {stats.categoryDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      borderColor: "#ddd",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{
                      paddingTop: 10,
                      fontSize: "0.9rem",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {stats.borrowTrends?.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                📈 Monthly Borrow Trends
              </h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={(stats.borrowTrends ?? []).map((d) => ({
                    month: `Month ${d._id}`,
                    count: d.count,
                  }))}
                  margin={{ top: 10, right: 20, bottom: 20, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fill: "#555" }} />
                  <YAxis tick={{ fill: "#555" }} />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Recent Activities */}
        {stats.recentActivities?.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition mb-10">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              🕒 Recent Activities
            </h3>
            <ul className="divide-y divide-gray-200">
              {stats.recentActivities.map((act, idx) => (
                <li key={idx} className="py-3 flex justify-between">
                  <div>
                    <span className="font-semibold">{act.type}</span> —{" "}
                    <span>{act.userName}</span>{" "}
                    <span className="text-gray-500">({act.bookTitle})</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(act.date).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pending Requests */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition mb-10">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            ⏳ Pending Requests
          </h3>
          {pending.length === 0 ? (
            <p className="text-gray-500">No pending requests</p>
          ) : (
            <div className="space-y-3">
              {pending.map((req) => (
                <div
                  key={req._id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                >
                  <div>
                    <strong>{req.user?.name}</strong> requested{" "}
                    <em>{req.book?.title}</em> at{" "}
                    {new Date(req.requestedAt).toLocaleString()}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                      onClick={() => approve(req._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      onClick={() => reject(req._id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Borrow Records */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            📖 All Borrow Records
          </h3>
          <div className="space-y-3">
            {records.map((r) => (
              <div
                key={r._id}
                className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <strong>{r.user?.name}</strong> — <em>{r.book?.title}</em>
                    <div className="text-sm text-gray-500">
                      Status: {r.status}{" "}
                      {r.status === "borrowed" && r.dueDate
                        ? `(Due: ${new Date(r.dueDate).toLocaleDateString()})`
                        : ""}
                    </div>
                  </div>
                  <div className="text-sm">
                    {r.status === "borrowed" && r.isOverdue && (
                      <div className="text-red-600 font-semibold">
                        Overdue — Fine: ₹{r.currentFine}
                      </div>
                    )}
                    {r.status === "returned" && (
                      <div className="text-gray-700">
                        Fine charged: ₹{r.fine}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-3 mt-6">
            <button
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition disabled:opacity-40"
              disabled={page <= 1}
              onClick={() => loadAllRecords(page - 1)}
            >
              Prev
            </button>
            <span className="text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition disabled:opacity-40"
              disabled={page >= totalPages}
              onClick={() => loadAllRecords(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
