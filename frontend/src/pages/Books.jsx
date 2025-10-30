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
      toast.error(
        err.response?.data?.message || "Failed to request borrow",
        { position: "top-center" }
      );
    }
  };

  const notifyMe = async (bookId) => {
    try {
      await api.post(`/books/${bookId}/waitlist`);
      toast.success("You will be notified when this book is available.", { position: "top-center" });
    } catch (err) {
      toast.error("Failed to join waitlist", { position: "top-center" });
    }
  };

  return (
  <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-white p-6">
  <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-linear-to-r from-purple-700 to-blue-700 drop-shadow-sm">
        Explore Books
      </h2>

      <div className="max-w-4xl mx-auto mb-8">
        <SearchBar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          onSearch={onSearch}
        />
      </div>

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center">
        {books.length > 0 ? (
          books.map((b) => (
            <div
              key={b._id}
              className="relative bg-white/70 backdrop-blur-md shadow-lg hover:shadow-2xl border border-purple-200 rounded-2xl p-5 w-[220px] transition-all duration-300 hover:scale-105"
            >
              {b.coverUrl ? (
                <img
                  src={b.coverUrl}
                  alt={b.title}
                  className="w-full h-56 object-cover rounded-xl mb-4 shadow"
                />
              ) : (
                <div className="w-full h-56 bg-linear-to-r from-purple-200 to-blue-200 rounded-xl flex items-center justify-center text-gray-600 italic">
                  No Cover
                </div>
              )}

              <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                {b.title}
              </h3>
              <p className="text-sm text-gray-600 mb-1">{b.author}</p>
              <p className="text-sm text-gray-700 mb-3">
                Available:{" "}
                <span
                  className={`font-semibold ${
                    b.availableCopies < 1
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {b.availableCopies}/{b.totalCopies}
                </span>
              </p>

              {user ? (
                <>
                  <button
                    onClick={() => requestBorrow(b._id)}
                    disabled={b.availableCopies < 1}
                    className={`w-full py-2 rounded-lg font-medium text-white shadow-md transition-all duration-300 ${
                      b.availableCopies < 1
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-[1.03]"
                    }`}
                  >
                    {b.availableCopies < 1
                      ? "Not Available"
                      : "Request Borrow"}
                  </button>
                  {b.availableCopies < 1 && (
                    <button
                      onClick={() => notifyMe(b._id)}
                      className="w-full mt-2 py-2 rounded-lg font-medium text-white bg-yellow-500 hover:bg-yellow-600 shadow-md transition-all duration-300"
                    >
                      Notify Me When Available
                    </button>
                  )}
                </>
              ) : (
                <p className="text-center text-sm text-gray-500 mt-2 italic">
                  Login to request
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600 text-lg">
            No books found.
          </p>
        )}
      </div>
    </div>
  );
}
