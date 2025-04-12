'use client';
import Link from "next/link";
import { Menu } from "lucide-react";
import DropdownMenu from "./DropdownMenu";

export default function NavBar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 shadow-sm">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <img src="/logo.png" alt="Lassen Logo" className="h-8 w-8" />
          Lassen
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <DropdownMenu label="Upload" items={["Image", "Ingredients"]} />
          <Link href="/recipes">Recipes</Link>
        </nav>
      </div>
      <div className="flex gap-3 items-center">
        <Link href="/auth/login" className="px-4 py-2 border rounded">Log In</Link>
        <Link href="/auth/signup" className="px-4 py-2 bg- rounded">Sign Up</Link>
      </div>
    </header>
  );
}