import React from "react";

export default function SearchBar({ search, setSearch, category, setCategory, onSearch }) {
  return (
    <div className="flex gap-2 items-center mb-4">
      <input
        className="p-2 border rounded flex-1"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by title, author, or isbn..."
      />
      <select className="p-2 border rounded" value={category} onChange={e => setCategory(e.target.value)}>
        <option value="">All categories</option>
        <option value="Fiction">Fiction</option>
        <option value="Science">Science</option>
        <option value="History">History</option>
        <option value="Computer">Computer</option>
      </select>
      <button className="btn" onClick={onSearch}>Search</button>
    </div>
  );
}
