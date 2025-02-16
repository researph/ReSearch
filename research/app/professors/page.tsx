"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // ✅ Import for query reading
import NavBar from "../components/NavBar";
import Card from "../components/Card";
import "../globals.css";

interface Professor {
  id: number;
  name: string;
  school: string;
  department: string;
  title?: string;
  email?: string;
  research_areas?: string;
  image?: string;
  website?: string;
}

export default function Professors() {
  const searchParams = useSearchParams(); // ✅ Get query from URL
  const initialQuery = searchParams.get("query") || ""; // ✅ Extract query param

  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>(initialQuery); // ✅ Set initial state

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/professors");
        if (!response.ok) {
          throw new Error("Failed to fetch professors");
        }
        const data = await response.json();
        setProfessors(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessors();
  }, []);

  // ✅ Automatically update query state when URL changes
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // ✅ Filter professors based on query
  const filteredProfessors = professors.filter((professor) =>
    Object.values(professor).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(query.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen flex flex-col overflow-auto">
      {/* ✅ Pass query and setQuery to NavBar */}
      <NavBar query={query} setQuery={setQuery} />

      {/* Loading State */}
      {loading && (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500 text-lg">Loading professors...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      )}

      {/* Professors Grid */}
      {!loading && !error && (
        <div className="flex-grow mt-[125px] pb-8 px-4 overflow-auto flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl auto-rows-min">
            {filteredProfessors.map((professor) => (
              <Card key={professor.id} {...professor} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
