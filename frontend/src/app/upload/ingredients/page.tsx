"use client";
import { useState } from "react";
import axios from "axios";

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [recipes, setRecipes] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const addIngredient = () => {
    const trimmed = input.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setInput("");
    }
  };

  const getRecipes = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/get-recipes`,
        { ingredients },
      );
      setRecipes(res.data.recipes || []);
    } catch (err) {
      console.error("Error fetching recipes", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold">Enter Ingredients</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Type your ingredients below and discover recipes instantly.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. banana"
          className="border px-4 py-2 rounded w-full"
        />
        <button
          onClick={addIngredient}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {ingredients.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ing, idx) => (
              <span
                key={idx}
                className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-sm"
              >
                {ing}
                <button
                  className="ml-2 text-red-500"
                  onClick={() =>
                    setIngredients((prev) => prev.filter((_, i) => i !== idx))
                  }
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <button
            onClick={getRecipes}
            disabled={loading}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            {loading ? "Fetching..." : "Get Recipes"}
          </button>
        </div>
      )}

      {recipes && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6">Suggested Recipes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
              <a
                key={index}
                href={`https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, "-")}-${recipe.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg overflow-hidden shadow-md bg-white dark:bg-zinc-900 hover:shadow-xl transition"
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
        </div>
      )}
    </main>
  );
}
