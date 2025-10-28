import React, { useEffect, useState } from "react";
import api from "../api";

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: "", author: "", category: "", isbn: "", totalCopies: 1 });
  const [file, setFile] = useState(null);

  const load = async () => {
    const { data } = await api.get("/books");
    setBooks(data);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      if (file) fd.append("cover", file);
      await api.post("/books", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setForm({ title: "", author: "", category: "", isbn: "", totalCopies: 1 });
      setFile(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete book?")) return;
    await api.delete(`/books/${id}`);
    load();
  };

  return (
    <div>
      <h2>Admin - Manage Books</h2>
      <div className="admin-grid">
        <form className="card" onSubmit={submit}>
          <h3>Add Book</h3>
          <input placeholder="Title" required value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})}/>
          <input placeholder="Author" required value={form.author} onChange={(e)=>setForm({...form,author:e.target.value})}/>
          <input placeholder="Category" value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})}/>
          <input placeholder="ISBN" value={form.isbn} onChange={(e)=>setForm({...form,isbn:e.target.value})}/>
          <input placeholder="Total Copies" type="number" min="1" value={form.totalCopies} onChange={(e)=>setForm({...form,totalCopies:e.target.value})}/>
          <input type="file" onChange={(e)=>setFile(e.target.files[0])}/>
          <button className="btn" type="submit">Add Book</button>
        </form>

        <div>
          <h3>Books</h3>
          <ul className="list">
            {books.map(b => (
              <li key={b._id}>
                <strong>{b.title}</strong> — {b.author} ({b.availableCopies}/{b.totalCopies})
                <button className="btn small" onClick={()=>remove(b._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
