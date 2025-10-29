import React from "react";

export default function SearchBar({ search, setSearch, category, setCategory, onSearch }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-center bg-white/30 backdrop-blur-md border border-purple-200 shadow-md rounded-2xl p-4 transition-all duration-300 hover:shadow-lg">
      <input
        className="flex-1 w-full sm:w-auto px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/60 placeholder-gray-500 text-gray-800 backdrop-blur-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Search by title, author, or ISBN..."
      />

      <select
        className="px-4 py-2 rounded-lg border border-purple-300 bg-white/60 text-gray-800 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        <option value="Fiction">Fiction</option>
        <option value="Science">Science</option>
        <option value="History">History</option>
        <option value="Computer">Computer</option>
      </select>

      <button
        onClick={onSearch}
        className="px-5 py-2 font-semibold text-white rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 shadow-md hover:from-purple-700 hover:to-blue-700 hover:scale-105 transition-all duration-200"
      >
        Search
      </button>
    </div>
  );
}
