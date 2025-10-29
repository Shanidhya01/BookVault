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
    if (!window.confirm("Delete book?")) return;
    await api.delete(`/books/${id}`);
    load();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-100 to-blue-50 py-10 px-4">
      <h2 className="text-3xl font-bold text-purple-700 mb-8 text-center drop-shadow">Admin - Manage Books</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
        <form className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-5 border border-purple-100" onSubmit={submit}>
          <h3 className="text-xl font-semibold text-purple-600 mb-2">Add Book</h3>
          <input className="input input-bordered w-full" placeholder="Title" required value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})}/>
          <input className="input input-bordered w-full" placeholder="Author" required value={form.author} onChange={(e)=>setForm({...form,author:e.target.value})}/>
          <input className="input input-bordered w-full" placeholder="Category" value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})}/>
          <input className="input input-bordered w-full" placeholder="ISBN" value={form.isbn} onChange={(e)=>setForm({...form,isbn:e.target.value})}/>
          <input className="input input-bordered w-full" placeholder="Total Copies" type="number" min="1" value={form.totalCopies} onChange={(e)=>setForm({...form,totalCopies:e.target.value})}/>
          <input className="file-input file-input-bordered w-full" type="file" onChange={(e)=>setFile(e.target.files[0])}/>
          <button className="btn bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-2 rounded-xl shadow hover:scale-105 transition-all duration-200" type="submit">Add Book</button>
        </form>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
          <h3 className="text-xl font-semibold text-purple-600 mb-4">Books</h3>
          <ul className="space-y-4">
            {books.map(b => (
              <li key={b._id} className="flex items-center justify-between bg-purple-50 rounded-xl px-4 py-3 shadow hover:shadow-lg transition-all">
                <div>
                  <span className="font-bold text-purple-700 text-lg">{b.title}</span>
                  <span className="text-gray-600 ml-2">by {b.author}</span>
                  <span className="ml-4 text-sm text-blue-600">({b.availableCopies}/{b.totalCopies} available)</span>
                </div>
                <button className="btn btn-sm bg-red-500 text-white rounded-lg px-4 py-1 hover:bg-red-600 transition-all" onClick={()=>remove(b._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

