"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 w-full bg-white px-6 py-4 flex items-center justify-between">
      {/* Left - Logo (does not show on home page) */}
      <div className="w-[150px]">
        {pathname !== "/" && (
          <Link href="/">
            <Image
              src="/assets/title.png"
              alt="ReSearch Logo"
              width={150}
              height={50}
              priority
              className="cursor-pointer"
            />
          </Link>
        )}
      </div>

      {/* Right - Navigation Links */}
      <div className="flex items-center space-x-6">
        <Link href="/saved" className="nav-link">
          Saved
        </Link>
        <Link href="/mail" className="nav-link">
          Mail
        </Link>

        {/* User Profile Image */}
        <Image
          src="/assets/pic-placeholder-lg.png"
          alt="User Profile"
          width={40}
          height={40}
          className="rounded-full border border-gray-300 cursor-pointer"
        />
      </div>
    </nav>
  );
}
