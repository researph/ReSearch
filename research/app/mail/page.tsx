"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import NavBar from "../components/NavBar";

interface ResumeData {
  resumeText: string;
  professor: string;
}

interface Professor {
  name: string;
  research_areas?: string;
}

export default function LetterPage() {
  const { register, handleSubmit } = useForm<ResumeData>();
  const [letter, setLetter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedProfessors, setSavedProfessors] = useState<Professor[]>([]);
  const [query, setQuery] = useState(""); // Required for NavBar component

  // Load saved professors from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedProfessors") || "[]");
    setSavedProfessors(saved);
  }, []);

  const onSubmit = async (data: ResumeData) => {
    setLoading(true);
    setError(null);
    setLetter(null);
  
    console.log("Submitting to API:", process.env.NEXT_PUBLIC_API_URL);
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generateLetter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      console.log("API Response Status:", response.status);
  
      if (!response.ok) {
        throw new Error(`Failed to generate letter. Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("API Result:", result);
  
      // ✅ Set letter directly (no need to extract from JSON structure)
      setLetter(result.letter);
    } catch (error) {
      console.error("Error in API request:", error);
      setError("Failed to generate letter. Please try again.");
    } finally {
      setLoading(false);
    }
  };  
  
  return (
    <div className="flex flex-col min-h-screen mt-[50px]">
      {/* NavBar Component */}
      <NavBar query={query} setQuery={setQuery} />

      {/* Content */}
      <div className="flex flex-col items-center justify-center flex-grow p-6 pt-20">
        <div className="bg-white p-6 rounded-lg shadow-md w-[500px] flex flex-col space-y-4 border">
          <h2 className="text-lg font-bold">📄 Upload Resume & Select Professor</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-3">
            <textarea
              {...register("resumeText")}
              placeholder="Paste your resume here..."
              required
              className="w-full p-2 border rounded-md h-40 resize-none"
            />

            <select
              {...register("professor")}
              required
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select a Professor</option>
              {savedProfessors.length > 0 ? (
                savedProfessors.map((prof, index) => (
                  <option key={index} value={prof.name}>
                    {prof.name} ({prof.research_areas || "Research Unknown"})
                  </option>
                ))
              ) : (
                <option disabled>No saved professors</option>
              )}
            </select>

            <button
              type="submit"
              className="w-full text-white p-2 rounded-md transition duration-300"
              style={{ backgroundColor: "var(--blue)" }}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </form>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {letter && (
            <div className="p-3 border rounded-md mt-4">
              <h3 className="text-sm font-semibold mb-2">📄 Generated Email Draft</h3>
              <pre className="text-sm bg-white border rounded-md p-2 whitespace-pre-wrap">
                {letter}
              </pre>
            </div>
          )}


        </div>
      </div>
    </div>
  );
}
