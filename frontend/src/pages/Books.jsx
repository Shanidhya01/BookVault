import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

function BookCard({ book, onBorrow }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center gap-3 border border-purple-100 hover:shadow-xl transition-all duration-200">
      {book.coverUrl && (
        <img
          src={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}${book.coverUrl}`}
          alt="cover"
          className="w-32 h-44 object-cover rounded-xl mb-2 border border-purple-200 shadow"
        />
      )}
      <h3 className="text-lg font-bold text-purple-700 mb-1 text-center">{book.title}</h3>
      <p className="text-gray-700 text-sm"><span className="font-semibold">Author:</span> {book.author}</p>
      <p className="text-gray-600 text-sm"><span className="font-semibold">Category:</span> {book.category}</p>
      <p className="text-blue-600 text-sm"><span className="font-semibold">Available:</span> {book.availableCopies}/{book.totalCopies}</p>
      {onBorrow && (
        <button
          className="btn bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-2 px-6 rounded-xl shadow hover:scale-105 transition-all duration-200 disabled:opacity-50"
          onClick={() => onBorrow(book._id)}
          disabled={book.availableCopies < 1}
        >
          Borrow
        </button>
      )}
    </div>
  );
}

export default function Books() {
  const [books, setBooks] = useState([]);
  const [q, setQ] = useState("");
  const { user } = useAuth();

  const fetchBooks = async () => {
    const { data } = await api.get("/books", { params: { q } });
    setBooks(data);
  };

  useEffect(() => { fetchBooks(); }, [q]);

  const borrow = async (bookId) => {
    try {
      await api.post(`/borrow/${bookId}`);
      alert("Borrowed successfully");
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.message || "Borrow failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-100 to-blue-50 py-10 px-4">
      <h2 className="text-3xl font-bold text-purple-700 mb-8 text-center drop-shadow">Books</h2>
      <div className="flex justify-center mb-8">
        <input
          className="input input-bordered w-full max-w-md rounded-xl shadow focus:ring-2 focus:ring-purple-400"
          placeholder="Search by title, author or isbn"
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.isArray(books) && books.length > 0
          ? books.map(book => <BookCard key={book._id} book={book} onBorrow={user ? borrow : null} />)
          : <p className="col-span-full text-center text-gray-500 text-lg">No books found.</p>
        }
      </div>
    </div>
  );
}
