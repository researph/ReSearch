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


  // Ensure filtering works correctly for multiple search terms
  const filteredProfessors = savedProfessors.filter((professor) => {
    const lowerQuery = query.toLowerCase().split(" "); // ✅ Split multiple terms
    return lowerQuery.every(
      (term) =>
        professor.name.toLowerCase().includes(term) ||
        professor.department.toLowerCase().includes(term) ||
        professor.school.toLowerCase().includes(term) || 
        professor.title.toLowerCase().includes(term) ||
        (professor.research_areas && professor.research_areas.toLowerCase().includes(term))
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
