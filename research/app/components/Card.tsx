"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export interface CardProps {
  name: string;
  school: string;
  department: string;
  title?: string;
  email?: string;
  research_areas?: string;
  image?: string;
  website?: string;
}

export default function Card({
  name,
  school,
  department,
  title,
  email,
  research_areas,
  image,
  website,
}: CardProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedProfessors = JSON.parse(localStorage.getItem("savedProfessors") || "[]");
    setIsSaved(savedProfessors.some((prof: CardProps) => prof.name === name));
  }, [name]);

  const handleSave = () => {
    let savedProfessors = JSON.parse(localStorage.getItem("savedProfessors") || "[]");

    if (isSaved) {
      savedProfessors = savedProfessors.filter((prof: CardProps) => prof.name !== name);
    } else {
      savedProfessors.push({ name, school, department, title, email, research_areas, image, website });
    }

    localStorage.setItem("savedProfessors", JSON.stringify(savedProfessors));
    setIsSaved(!isSaved);
  };

  // 🏫 **Assign School-Specific Colors**
  const schoolColorClass =
    school.includes("UNC") ? "text-[var(--unc)]" :
    school.includes("NC State") ? "text-[var(--nc-state)]" :
    school.includes("Duke") ? "text-[var(--duke)]" :
    "text-black";

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-[300px] border flex flex-col h-full">
      {/* Header - Profile Image + Name */}
      <div className="flex items-center space-x-3 mb-2">
        <div className="flex-grow">
          <h2 className="text-lg font-bold">{name}</h2>
          <p className={`text-sm font-semibold ${schoolColorClass}`}>{school}</p> {/* 🔥 School Name Colored */}
          <p className="text-sm text-gray-600">{department}</p>
        </div>

        {/* Profile Image */}
        <div className="w-[50px] h-[50px] rounded-full overflow-hidden border border-gray-300">
          {image ? (
            <Image
              src={image}
              alt={`${name}'s profile`}
              width={50}
              height={50}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-gray-300" />
          )}
        </div>
      </div>

      {/* Title (Optional) */}
      {title && <p className="text-sm text-gray-700">🎓 {title}</p>}

      {/* Research Areas */}
      {research_areas && (
        <div className="text-sm text-gray-700">
          🎯 {research_areas.slice(0, 300) + (research_areas.length > 300 ? "..." : "")}
          {research_areas.length > 300}
        </div>
      )}

      {/* Push Icons to Bottom */}
      <div className="flex-grow"></div>

      {/* Icons - Website, Heart, Email */}
      <div className="flex justify-between items-center text-xl pt-3 border-t mt-3">
        <div className="flex space-x-4">
          {website && website !== "N/A" && (
            <Link href={website} target="_blank" rel="noopener noreferrer">
              <p className="text-sm hover:underline">🔗</p>
            </Link>
          )}
          {email && email !== "N/A" && (
            <Link href={`mailto:${email}`} target="_blank">
              <p className="text-sm hover:underline">✉️</p>
            </Link>
          )}
        </div>

        {/* Heart Icon */}
        <button onClick={handleSave} className="text-sm">
          {isSaved ? "❤️" : "🤍"}
        </button>
      </div>
    </div>
  );
}
