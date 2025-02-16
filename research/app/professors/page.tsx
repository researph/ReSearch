"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // ✅ Get query from URL
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
  const router = useRouter();
  const initialQuery = searchParams.get("query") || ""; // ✅ Start with URL query
  const [query, setQuery] = useState<string>(initialQuery); // ✅ Use local state for query
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // ✅ Ensure filtering works correctly for multiple search terms
  const filteredProfessors = professors.filter((professor) => {
    const lowerQuery = query.toLowerCase().split(" "); // ✅ Split multiple terms
    return lowerQuery.every(
      (term) =>
        professor.name.toLowerCase().includes(term) ||
        professor.department.toLowerCase().includes(term) ||
        professor.school.toLowerCase().includes(term) ||
        (professor.research_areas && professor.research_areas.toLowerCase().includes(term))
    );
  });

  return (
    <div className="min-h-screen flex flex-col overflow-auto">
      {/* ✅ Pass query state to NavBar */}
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
        <div className="mt-[125px] pb-8 px-4 overflow-auto flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
            {filteredProfessors.length > 0 ? (
              filteredProfessors.map((professor) => <Card key={professor.id} {...professor} />)
            ) : (
              <p className="text-gray-500 text-lg">No results found for "{query}"</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
