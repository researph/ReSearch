"use client";

import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Card from "../components/Card";
import "../globals.css";

export default function Saved() {
  const [savedProfessors, setSavedProfessors] = useState<CardProps[]>([]);

  useEffect(() => {
    const storedProfessors = JSON.parse(localStorage.getItem("savedProfessors") || "[]");
    setSavedProfessors(storedProfessors);
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-auto">
      {/* NavBar Component */}
      <NavBar />

      {/* Empty State */}
      {savedProfessors.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500 text-lg">❤️ No saved professors yet</p>
        </div>
      ) : (
        <div className="mt-[125px] pb-8 px-4 overflow-auto flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
            {savedProfessors.map((professor, index) => (
              <Card key={index} {...professor} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
