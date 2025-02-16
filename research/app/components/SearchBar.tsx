"use client";

import { ChangeEvent } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
}

export default function SearchBar({ query, setQuery }: SearchBarProps) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value); // Update the query state when the user types
  };

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 shadow-md text-md bg-white focus:outline-none focus:ring-0"
          placeholder="Search professors..."
        />
      </div>
    </div>
  );
}
