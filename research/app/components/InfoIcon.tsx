"use client"; // Ensure this is a client component

import Link from "next/link";

export default function InfoIcon() {
  return (
    <div className="info-icon">
      <Link
        href="https://github.com/researph/ReSearch"
        target="_blank"
        rel="noopener noreferrer"
      >
        ℹ️
      </Link>
    </div>
  );
}
