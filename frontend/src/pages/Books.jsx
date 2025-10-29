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
    const res = await api.get("/books", { params: { search, category, available: "" }});
    setBooks(res.data);
  };

  useEffect(() => { fetchBooks(); }, []);

  const onSearch = () => fetchBooks();

  // instead of immediate borrow, create a request
  const requestBorrow = async (bookId) => {
    try {
      await api.post(`/borrow/request/${bookId}`);
      toast("Borrow request submitted. Wait for admin approval.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to request borrow");
    }
  };
  console.log(books);

  return (
    <div>
      <h2>Books</h2>
      <SearchBar search={search} setSearch={setSearch} category={category} setCategory={setCategory} onSearch={onSearch} />
      <div className="grid">
        {books.map(b => (
          <div className="book-card" key={b._id}>
            {b.coverUrl && (
              <img
                src={b.coverUrl}
                alt={b.title}
                style={{ width: '120px', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }}
              />
            )}
            <h3>{b.title}</h3>
            <p>{b.author}</p>
            <p>Available: {b.availableCopies}/{b.totalCopies}</p>
            {user ? (
              <button className="btn" onClick={() => requestBorrow(b._id)} disabled={b.availableCopies < 1}>
                Request Borrow
              </button>
            ) : (
              <p className="muted">Login to request</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
