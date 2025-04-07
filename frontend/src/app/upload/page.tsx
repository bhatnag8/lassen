"use client";
import { useState } from "react";
import axios from "axios";

import UploadImage from "@/components/UploadImage";
import Header from "@/components/Header";
import IngredientReview from "@/components/IngredientReview";

export default function UploadPage() {
  const [detectedIngredients, setDetectedIngredients] = useState<string[] | null>(null);
  const [confirmedIngredients, setConfirmedIngredients] = useState<string[] | null>(null);
  const [recipes, setRecipes] = useState<any[] | null>(null);

  const handleDetected = (ingredients: string[]) => {
    setDetectedIngredients(ingredients);
  };

  const handleConfirmIngredients = async (ingredients: string[]) => {
    setConfirmedIngredients(ingredients);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/get-recipes`,
        { ingredients }
      );
      setRecipes(res.data.recipes || []);
    } catch (err) {
      console.error("Failed to fetch recipes:", err);
    }
  };

  return (
    <main className="min-h-screen max-w-4xl mx-auto px-4 py-10">
      <Header />
      <h1 className="text-2xl font-bold mb-6">Upload an Image</h1>
      <UploadImage onDetected={handleDetected} />
      {detectedIngredients && (
        <IngredientReview
          initialIngredients={detectedIngredients}
          onConfirm={handleConfirmIngredients}
        />
      )}
      {confirmedIngredients && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Final Ingredients:</h2>
          <ul className="list-disc list-inside">
            {confirmedIngredients.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>
        </div>
      )}

      {recipes && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Suggested Recipes:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe, index) => (
              <a
                key={index}
                href={`https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, "-")}-${recipe.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border rounded-lg p-4 bg-white text-black hover:shadow-lg transition"
              >
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h3 className="text-lg font-semibold">{recipe.title}</h3>
              </a>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}