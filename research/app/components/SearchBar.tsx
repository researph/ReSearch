"use client"; // Ensure this is a client component

import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div className="mt-6 relative w-96">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-bar"
      />
      <Search className="search-icon" size={20} />
    </div>
  );
}
