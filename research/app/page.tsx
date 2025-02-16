"use client";

import { useState } from "react";
import Image from "next/image";
import NavBar from "./components/NavBar";
import SearchBar from "./components/SearchBar";
import InfoIcon from "./components/InfoIcon";
import "./globals.css";

export default function HomePage() {
  const [query, setQuery] = useState<string>("");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Pass query and setQuery to NavBar */}
      <NavBar query={query} setQuery={setQuery} />

      {/* Centered Content */}
      <div className="flex flex-grow flex-col items-center justify-center">
        {/* Title Image */}
        <Image
          src="/assets/title.png"
          alt="ReSearch Logo"
          width={300}
          height={80}
          priority
          className="mb-6"
        />

        {/* Search Bar */}
        <SearchBar query={query} setQuery={setQuery} />
      </div>

      {/* Info Component */}
      <InfoIcon />
    </div>
  );
}
