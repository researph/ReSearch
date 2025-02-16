import Image from "next/image";
import NavBar from "./components/NavBar";
import SearchBar from "./components/SearchBar";
import InfoIcon from "./components/InfoIcon";
import "./globals.css";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* NavBar Component */}
      <NavBar />

      {/* Logo / Title Image */}
      <Image
        src="/assets/title.png"
        alt="ReSearch Logo"
        width={300}
        height={80}
        priority
        className="mb-8"
      />

      {/* Search Bar Component */}
      <SearchBar />

      {/* Bottom Right Info Icon Component */}
      <InfoIcon />

    </div>
  );
}
