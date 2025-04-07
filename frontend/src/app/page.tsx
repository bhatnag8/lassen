"use client";

import Link from "next/link";
import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="min-h-screen max-w-4xl mx-auto px-4 py-10">
      <Header />
      <h1 className="text-4xl font-bold mb-6">Welcome to Lassen</h1>
      <p className="text-lg text-gray-600">
        Upload a food photo and discover recipes based on what’s inside.
      </p>
    </main>
  );
}