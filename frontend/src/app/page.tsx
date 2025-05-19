"use client";

import Footer from "@/components/Footer";
import ThreeItemGrid from "@/components/Grid";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow w-full mx-auto px-4 py-10 text-center">
        <h1 className="text-3xl font-bold mb-2">
          Turn images into inspiration.
        </h1>
        <h3 className="text-2xl font-regular mb-">
          Discover recipes based on what’s in your fridge.
        </h3>
        <div className="mb-10"></div>
      </main>
      <div className="flex-grow w-full">
        <ThreeItemGrid />
      </div>
      <Footer />
    </div>
  );
}
