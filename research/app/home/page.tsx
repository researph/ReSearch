import Image from "next/image";
import SearchBar from "../components/SearchBar";
import Link from "next/link";
import "../globals.css";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* Logo / Title Image */}
      <Image
        src="/assets/title.png"
        alt="ReSearch Logo"
        width={300} // Adjust width as needed
        height={80} // Adjust height as needed
        priority
      />

      {/* Search Bar Component */}
      <SearchBar />

      {/* Top Right Menu */}
      <div className="absolute top-5 right-5 flex items-center space-x-6">
        <Link href="/saved" className="menu-text">
          Saved
        </Link>
        <Link href="/mail" className="menu-text">
          Mail
        </Link>
        {/* User Icon using Image */}
        <Image
          src="/assets/pic-placeholder-lg.png"
          alt="User Profile"
          width={30} // Adjust as needed
          height={30}
          className="rounded-full border border-gray-300"
        />
      </div>

      {/* Bottom Right Info Icon */}
      <div className="info-icon">ℹ️</div>
    </div>
  );
}
