"use client";

import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Card, { CardProps } from "../components/Card"; // Import CardProps
import "../globals.css";

export default function Saved() {
  const [savedProfessors, setSavedProfessors] = useState<CardProps[]>([]);
  const [query, setQuery] = useState<string>(""); // Ensure query state exists

  useEffect(() => {
    const storedProfessors = JSON.parse(localStorage.getItem("savedProfessors") || "[]");
    setSavedProfessors(storedProfessors);
  }, []);

  // Filter saved professors based on the search query
  const filteredProfessors = savedProfessors.filter((professor) => {
    const searchTerms = query.toLowerCase().split(" "); // Split into words
  
    return searchTerms.every((term) =>
      Object.values(professor).some(
        (value) =>
          typeof value === "string" && value.toLowerCase().includes(term)
      )
    );
  });
  

  return (
    <div className="min-h-screen flex flex-col overflow-auto">
      {/* Pass query and setQuery to NavBar */}
      <NavBar query={query} setQuery={setQuery} />

      {/* Empty State */}
      {savedProfessors.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center">
          <p className="text-gray-500 text-lg">❤️ No saved professors yet</p>
        </div>
      ) : (
        <div className="mt-[125px] pb-8 px-4 overflow-auto flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
            {filteredProfessors.map((professor, index) => (
              <Card key={index} {...professor} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
