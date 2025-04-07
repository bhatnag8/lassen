"use client";

import Link from "next/link";

export default function Header() {
  return (
    <div className="flex justify-between items-center mb-8">
      <Link href="/" className="text-xl font-bold text-black hover:opacity-80">
        lassen
      </Link>
      <Link
        href="/upload"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        Upload
      </Link>
    </div>
  );
}