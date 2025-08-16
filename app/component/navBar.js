"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Home", path: "/home" },
  { label: "Explore", path: "/explore" },
  { label: "Profile", path: "/profile" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="flex justify-around bg-gray-900 py-3 fixed top-0 w-full z-10">
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;
        return (
          <Link
            key={tab.path}
            href={tab.path}
            className={`px-4 py-2 rounded-md transition-colors duration-300 
              ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-white"
              }
            `}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
