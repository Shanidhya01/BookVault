import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

function BookCard({ book, onBorrow }) {
  return (
    <div className="book-card">
      {book.coverUrl && <img src={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}${book.coverUrl}`} alt="cover" />}
      <h3>{book.title}</h3>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Category:</strong> {book.category}</p>
      <p><strong>Available:</strong> {book.availableCopies}/{book.totalCopies}</p>
      {onBorrow && <button className="btn" onClick={() => onBorrow(book._id)} disabled={book.availableCopies < 1}>Borrow</button>}
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
    <div>
      <h2>Books</h2>
      <div className="search">
        <input placeholder="Search by title, author or isbn" onChange={(e)=>setQ(e.target.value)} />
      </div>
      <div className="grid">
        {Array.isArray(books) && books.length > 0
         ? books.map(book => <BookCard key={book._id} book={book} onBorrow={user ? borrow : null} />)
         : <p>No books found.</p>
        }
      </div>
    </div>
  );
}
