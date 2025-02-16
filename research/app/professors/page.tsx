"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // ✅ Import search params
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
  const initialQuery = searchParams.get("query") || ""; // ✅ Read query parameter
  const [query, setQuery] = useState<string>(initialQuery);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/professors");
        if (!response.ok) throw new Error("Failed to fetch professors");

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

  // 🔍 **Filter Professors Based on Search Query**
  const filteredProfessors = professors.filter((professor) =>
    [
      professor.name,
      professor.school,
      professor.department,
      professor.title,
      professor.email,
      professor.research_areas,
      professor.website,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Pass query and setQuery to NavBar */}
      <NavBar query={query} setQuery={setQuery} />

      {/* Loading State */}
      {loading && (
        <div className="flex flex-grow items-center justify-center">
          <p className="text-gray-500 text-lg">Loading professors...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex flex-grow items-center justify-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      )}

      {/* Professors Grid */}
      {!loading && !error && (
        <div className="mt-[125px] pb-8 px-4 flex justify-center w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
            {filteredProfessors.length > 0 ? (
              filteredProfessors.map((professor) => <Card key={professor.id} {...professor} />)
            ) : (
              <p className="text-gray-500 text-lg col-span-full text-center">
                No professors match your search.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
