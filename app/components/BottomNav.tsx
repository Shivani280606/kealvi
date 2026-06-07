"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname =
    usePathname();

  const navItem = (
    href: string,
    icon: string,
    label: string
  ) => {
    const active =
      pathname === href;

    return (
      <Link
        href={href}
        className={`flex flex-col items-center text-xs ${
          active
            ? "font-bold text-blue-600"
            : "text-gray-600"
        }`}
      >
        <span className="text-xl">
          {icon}
        </span>

        <span>
          {label}
        </span>
      </Link>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">

      <div className="max-w-5xl mx-auto flex justify-around py-3">

        {navItem(
          "/",
          "🏠",
          "Home"
        )}

        {navItem(
          "/summary",
          "📊",
          "Summary"
        )}

        {navItem(
          "/questions",
          "❓",
          "Questions"
        )}

        {navItem(
          "/polls",
          "🗳️",
          "Polls"
        )}

        {navItem(
          "/analytics",
          "📈",
          "Analytics"
        )}

        {navItem(
          "/leaderboard",
          "🏆",
          "Leaders"
        )}

      </div>

    </nav>
  );
}