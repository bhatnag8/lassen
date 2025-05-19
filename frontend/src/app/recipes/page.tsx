"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

interface Recipe {
  id: number;
  title: string;
  image: string;
  source_url: string;
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      const token = Cookies.get("token");
      if (!token) return;

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/recipes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setRecipes(res.data);
      } catch (err) {
        console.error("Failed to fetch saved recipes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <main className="min-h-screen max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Your Saved Recipes
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : recipes.length === 0 ? (
        <p className="text-center text-gray-500">No recipes saved yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <a
              key={recipe.id}
              href={recipe.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg overflow-hidden shadow-md bg-white dark:bg-zinc-900 hover:shadow-xl transition flex flex-col"
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {recipe.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
