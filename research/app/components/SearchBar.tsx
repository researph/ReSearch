"use client";

import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface SearchBarProps {
  query: string | undefined;
  setQuery: (query: string) => void;
}

export default function SearchBar({ query, setQuery }: SearchBarProps) {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false); // ✅ Ensure hydration is complete before rendering

  useEffect(() => {
    setHydrated(true); // ✅ Mark hydration as complete
  }, []);

  if (!hydrated) return null; // ✅ Prevent mismatched server-client rendering

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value || "");
  };

  // Redirect on Enter
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query && query.trim() !== "") {
      router.push(`/professors?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
        <input
          type="text"
          value={query || ""}  // ✅ Ensure query is never undefined
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 shadow-md text-md bg-white focus:outline-none focus:ring-0"
          placeholder="Search professors..."
        />
      </div>
    </div>
  );
}
