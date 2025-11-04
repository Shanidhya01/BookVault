// frontend/src/pages/Books.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import SearchBar from "../components/SearchBar";
import { toast } from "react-toastify";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const { user } = useAuth();

  const fetchBooks = async () => {
    const res = await api.get("/books", {
      params: { search, category, available: "" },
    });
    setBooks(res.data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const onSearch = () => fetchBooks();

  const requestBorrow = async (bookId) => {
    try {
      await api.post(`/borrow/request/${bookId}`);
      toast("📚 Borrow request submitted! Wait for admin approval.", {
        position: "top-center",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to request borrow", {
        position: "top-center",
      });
    }
  };

  const notifyMe = async (bookId) => {
    try {
      await api.post(`/books/${bookId}/waitlist`);
      toast.success("You will be notified when this book is available.", {
        position: "top-center",
      });
    } catch (err) {
      toast.error("Failed to join waitlist", { position: "top-center" });
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-tr from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-r from-purple-100/20 to-blue-100/20 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <div className="relative z-10">
        <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-linear-to-r from-purple-700 via-blue-700 to-indigo-700 drop-shadow-lg">
          📚 Explore Our Library Collection
        </h2>

        <div className="max-w-5xl mx-auto mb-12">
          <SearchBar
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            onSearch={onSearch}
          />
        </div>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 place-items-center max-w-7xl mx-auto">
          {books.length > 0 ? (
            books.map((b) => (
              <div
                key={b._id}
                className="group relative bg-white/80 backdrop-blur-lg shadow-xl hover:shadow-2xl border border-purple-200/50 rounded-3xl p-6 w-60 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:bg-white/90"
              >
                {/* Floating glow effect */}
                <div className="absolute inset-0 bg-linear-to-r from-purple-400/20 to-blue-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                
                {/* Book cover */}
                <div className="relative mb-4 overflow-hidden rounded-2xl">
                  {b.coverUrl ? (
                    <img
                      src={b.coverUrl}
                      alt={b.title}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-64 bg-linear-to-br from-purple-300 to-blue-300 flex items-center justify-center text-white text-lg font-medium shadow-inner">
                      📖 No Cover
                    </div>
                  )}
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Book info */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 truncate group-hover:text-purple-700 transition-colors duration-300">
                    {b.title}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">
                    ✍️ {b.author}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                      📚 Available:
                    </p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        b.availableCopies < 1 
                          ? "bg-red-100 text-red-700 border border-red-200" 
                          : "bg-green-100 text-green-700 border border-green-200"
                      }`}
                    >
                      {b.availableCopies}/{b.totalCopies}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-6 space-y-3">
                  {user ? (
                    <>
                      <button
                        onClick={() => requestBorrow(b._id)}
                        disabled={b.availableCopies < 1}
                        className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 transform ${
                          b.availableCopies < 1
                            ? "bg-gray-400 cursor-not-allowed opacity-60"
                            : "bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105 hover:shadow-xl active:scale-95"
                        }`}
                      >
                        {b.availableCopies < 1 ? "📚 Not Available" : "📖 Request Borrow"}
                      </button>
                      {b.availableCopies < 1 && (
                        <button
                          onClick={() => notifyMe(b._id)}
                          className="w-full py-3 rounded-xl font-semibold text-white bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                          🔔 Notify Me When Available
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-3 px-4 bg-gray-100 rounded-xl border border-gray-200">
                      <p className="text-sm text-gray-600 font-medium">
                        🔐 Login to request books
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-12 shadow-xl border border-purple-200/50 max-w-md mx-auto">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-xl text-gray-600 font-medium mb-2">No books found</p>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
