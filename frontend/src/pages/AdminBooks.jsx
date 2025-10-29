import React, { useEffect, useState } from "react";
import api from "../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
    totalCopies: 1,
  });
  const [file, setFile] = useState(null);

  // popup modal states
  const [showModal, setShowModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  // Load all books
  const load = async () => {
    try {
      const res = await api.get("/books");
      setBooks(res.data);
    } catch (err) {
      console.error(err);
      setBooks([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Add book (mock for now)
  const submit = async (e) => {
    e.preventDefault();
    try {
      toast.success("Book added successfully!");
      load();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add book.");
    }

    setForm({
      title: "",
      author: "",
      category: "",
      isbn: "",
      totalCopies: 1,
    });
    setFile(null);
  };

  // Open confirmation modal
  const confirmDelete = (book) => {
    setBookToDelete(book);
    setShowModal(true);
  };

  // Actually delete the book
  const remove = async () => {
    if (!bookToDelete) return;
    try {
      await api.delete(`/books/${bookToDelete._id}`);
      toast.success("Book deleted successfully!");
      setShowModal(false);
      setBookToDelete(null);
      load();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete the book. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-6 px-8 shadow-lg">
        <h2 className="text-4xl font-extrabold drop-shadow">
          📚 Admin - Manage Books
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex gap-6 p-8">
        {/* ➕ Add Book Form */}
        <div className="w-1/3 bg-white shadow-xl rounded-2xl p-8 flex flex-col gap-5 overflow-y-auto">
          <h3 className="text-2xl font-semibold text-purple-700 mb-3">
            Add New Book
          </h3>

          <input
            className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none text-gray-700 placeholder-gray-400 text-base transition-all"
            placeholder="Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none text-gray-700 placeholder-gray-400 text-base transition-all"
            placeholder="Author"
            required
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />

          <input
            className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none text-gray-700 placeholder-gray-400 text-base transition-all"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <input
            className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none text-gray-700 placeholder-gray-400 text-base transition-all"
            placeholder="ISBN"
            value={form.isbn}
            onChange={(e) => setForm({ ...form, isbn: e.target.value })}
          />

          <input
            className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none text-gray-700 text-base transition-all"
            placeholder="Total Copies"
            type="number"
            min="1"
            value={form.totalCopies}
            onChange={(e) => setForm({ ...form, totalCopies: e.target.value })}
          />

          <input
            type="file"
            className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none text-gray-700 text-base transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button
            onClick={submit}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 mt-auto"
          >
            Add Book
          </button>
        </div>

        {/* 📘 Books List */}
        <div className="flex-1 bg-white shadow-xl rounded-2xl p-8 flex flex-col">
          <h3 className="text-2xl font-semibold text-purple-700 mb-6">
            Library Books
          </h3>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {books.length === 0 ? (
              <p className="text-gray-500 text-center py-12 text-lg">
                No books available
              </p>
            ) : (
              books.map((b) => (
                <div
                  key={b._id}
                  className="flex items-center justify-between bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-200"
                >
                  <div className="flex items-center gap-4">
                    {b.coverUrl ? (
                      <img
                        src={b.coverUrl}
                        alt={b.title}
                        className="w-14 h-20 object-cover rounded-md shadow-sm border border-gray-300"
                      />
                    ) : (
                      <div className="w-14 h-20 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-xs text-center font-semibold">
                        No Cover
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-800 text-lg">
                        {b.title}
                      </p>
                      <p className="text-gray-600 text-sm">by {b.author}</p>
                      <p className="text-purple-600 text-xs mt-1 font-medium">
                        {b.availableCopies}/{b.totalCopies} available
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => confirmDelete(b)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg whitespace-nowrap ml-4"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 🔔 Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 text-center animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-500">
                {bookToDelete?.title}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={remove}
                className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium shadow-md transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
