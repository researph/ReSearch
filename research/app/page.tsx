"use client";

import { useState } from "react";
import Image from "next/image";
import NavBar from "./components/NavBar";
import SearchBar from "./components/SearchBar";
import InfoIcon from "./components/InfoIcon";
import "./globals.css";

export default function HomePage() {
  const [query, setQuery] = useState<string>(""); // ✅ Ensure setQuery exists

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* ✅ Pass query and setQuery to NavBar */}
      <NavBar query={query} setQuery={setQuery} />

      {/* Title Image */}
      <Image
        src="/assets/title.png"
        alt="ReSearch Logo"
        width={300}
        height={80}
        priority
        className="mb-8"
      />

      {/* ✅ Pass query and setQuery to SearchBar */}
      <SearchBar query={query} setQuery={setQuery} />

      {/* Info Component */}
      <InfoIcon />
    </div>
  );
}
