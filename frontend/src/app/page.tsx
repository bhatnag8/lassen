"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!Cookies.get("token"));
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    window.location.reload();
  };

  return (
    <main className="min-h-screen max-w-2xl mx-auto px-4 py-10 text-center">
      <h1 className="text-3xl font-bold mb-6">Welcome to Lassen</h1>
      {loggedIn ? (
        <button
          onClick={handleLogout}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Log out
        </button>
      ) : (
        <a
          href="/auth/login"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Log in
        </a>
      )}
    </main>
  );
}