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
  const [query, setQuery] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedProfessors") || "[]");
    setSavedProfessors(saved);
  }, []);

  const onSubmit = async (data: ResumeData) => {
    setLoading(true);
    setError(null);
    setLetter(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generateLetter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate letter. Status: ${response.status}`);
      }

      const result = await response.json();
      setLetter(typeof result.letter === "string" ? result.letter : JSON.stringify(result.letter, null, 2));
    } catch (error) {
      setError("Failed to generate letter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* NavBar Component */}
      <NavBar query={query} setQuery={setQuery} />

      {/* Center Content Wrapper with extra spacing */}
      <div className="flex flex-col items-center justify-center flex-grow px-4 space-y-6 mt-[100px]">
        {/* Input Form Card */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl flex flex-col space-y-4 border">
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
              className="w-full text-white p-2 rounded-md transition duration-300 bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </form>
        </div>

        {/* Generated Email Draft Card */}
        {letter && (
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl border mt-4">
            <h3 className="text-md font-semibold mb-3">📩 Generated Email Draft</h3>
            <pre className="text-sm bg-gray-100 border rounded-md p-4 whitespace-pre-wrap">
              {letter}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
