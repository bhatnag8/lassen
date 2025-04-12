'use client';
import Link from "next/link";
import { Menu } from "lucide-react";
import DropdownMenu from "./DropdownMenu";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function NavBar() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
      setLoggedIn(!!Cookies.get("token"));
    }, []);
  
    const handleLogout = () => {
      Cookies.remove("token");
      window.location.reload();
    };

    return (
      <header className="flex items-center justify-between px-6 py-4 shadow-sm">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <img src="/logo.png" alt="Lassen Logo" className="h-8 w-8" />
            Lassen
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <DropdownMenu  label="Upload" items={["Image", "Ingredients"]} />
            <Link className= "hover:text-zinc-600"  href="/recipes">Recipes</Link>
          </nav>
        </div>
        <div className="flex gap-3 items-center">
          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-black text-white px-4 py-2 rounded hover:bg-zinc-800"
            >
              Log out
            </button>
          ) : (
            <>
              <Link href="/auth/login" className="bg-black text-white px-4 py-2 rounded hover:bg-zinc-800">Log In</Link>
              <Link href="/auth/signup" className="bg-black text-white px-4 py-2 rounded hover:bg-zinc-800">Sign Up</Link>
            </>
          )}
        </div>
      </header>
    );
}