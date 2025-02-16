"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

interface LetterData {
  firstName: string;
  lastName: string;
  email: string;
  major: string;
  minor?: string;
  year: string;
  professor: string;
  researchInterest?: string;
}

export default function Letter() {
  const { register, handleSubmit } = useForm<LetterData>();
  const [letter, setLetter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LetterData) => {
    setLoading(true);
    const response = await fetch("http://localhost:5001/api/generateLetter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    setLetter(result.letter);
    setLoading(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-[500px] flex flex-col space-y-3 border">
      {/* Header */}
      <h2 className="text-lg font-bold">✏️ Generate a Cover Letter</h2>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-2">
        <input
          {...register("firstName")}
          placeholder="First Name"
          required
          className="w-full p-2 border rounded-md"
        />
        <input
          {...register("lastName")}
          placeholder="Last Name"
          required
          className="w-full p-2 border rounded-md"
        />
        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          required
          className="w-full p-2 border rounded-md"
        />
        <input
          {...register("major")}
          placeholder="Major"
          required
          className="w-full p-2 border rounded-md"
        />
        <input
          {...register("minor")}
          placeholder="Minor (optional)"
          className="w-full p-2 border rounded-md"
        />
        <input
          {...register("year")}
          placeholder="Year (e.g., Sophomore)"
          required
          className="w-full p-2 border rounded-md"
        />
        <input
          {...register("professor")}
          placeholder="Professor's Name"
          required
          className="w-full p-2 border rounded-md"
        />
        <input
          {...register("researchInterest")}
          placeholder="Research Interest (optional)"
          className="w-full p-2 border rounded-md"
        />

        <button
          type="submit"
          className="w-full text-white p-2 rounded-md transition duration-300"
          style={{ backgroundColor: "var(--blue)" }}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {/* Display Generated Letter */}
      {letter && (
        <div className="p-3 border rounded-md bg-gray-50">
          <h3 className="text-sm font-semibold mb-2">📄 Generated Cover Letter</h3>
          <div className="text-sm bg-white border rounded-md p-2" dangerouslySetInnerHTML={{ __html: letter }} />
        </div>
      )}
    </div>
  );
}
