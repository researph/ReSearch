"use client";

import { ChangeEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void; // Ensure setQuery is required
}

export default function SearchBar({ query, setQuery }: SearchBarProps) {
  const router = useRouter();

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (typeof setQuery === "function") {
      setQuery(e.target.value || "");
    } else {
      console.error("setQuery is not defined! Make sure it is passed from the parent.");
    }
  };

  // Redirect on Enter
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim() !== "") {
      router.push(`/professors?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 shadow-md text-md bg-white focus:outline-none focus:ring-0"
        />
      </div>
    </div>
  );
}