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
  // State: is professor saved?
  const [isSaved, setIsSaved] = useState(false);

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedProfessors = JSON.parse(localStorage.getItem("savedProfessors") || "[]");
    setIsSaved(savedProfessors.some((prof: CardProps) => prof.name === name));
  }, [name]);

  // Toggle save state
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

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-[300px] flex flex-col space-y-3 border">
      {/* Header - Profile Image + Name */}
      <div className="flex items-center space-x-3">
        <div className="flex-grow">
          <h2 className="text-lg font-bold">{name}</h2>
          <p className="text-sm text-gray-600">{school}</p>
          <p className="text-sm text-gray-600">{department}</p>
        </div>

        {/* Profile Image - Circular Fix */}
        <div className="w-[50px] h-[50px] rounded-full overflow-hidden border border-gray-300">
          {image ? (
            <Image
              src={image}
              alt={`${name}'s profile`}
              width={50}
              height={50}
              className="w-full h-full object-cover"
              unoptimized // TEMP FIX for external images
            />
          ) : (
            <div className="w-full h-full bg-gray-300" />
          )}
        </div>
      </div>

      {/* Title */}
      {title && <p className="text-sm text-gray-700">🎓 {title}</p>}

      {/* Research Interests */}
      {research_areas && <p className="text-sm text-gray-700">🎯 {research_areas}</p>}

      {/* Icons - Website, Heart, Email */}
      <div className="flex justify-between items-center mt-3 text-xl">
        <div className="flex space-x-4">
          {website && (
            <Link href={website} target="_blank" rel="noopener noreferrer">
              <p className="text-sm hover:underline">🔗</p>
            </Link>
          )}
          {email && (
            <Link href={`mailto:${email}`} target="_blank">
              <p className="text-sm hover:underline">✉️</p>
            </Link>
          )}
        </div>
        <button onClick={handleSave} className="text-sm">
          {isSaved ? "❤️" : "🤍"}
        </button>
      </div>
    </div>
  );
}
