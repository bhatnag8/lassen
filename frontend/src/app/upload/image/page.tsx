"use client";

import { useState } from "react";
import axios from "axios";
import UploadImage from "@/components/UploadImage";
import IngredientReview from "@/components/IngredientReview";
import Cookies from "js-cookie";

export default function UploadPage() {
  const [detectedIngredients, setDetectedIngredients] = useState<
    string[] | null
  >(null);
  const [confirmedIngredients, setConfirmedIngredients] = useState<
    string[] | null
  >(null);
  const [recipes, setRecipes] = useState<any[] | null>(null);
  const [step, setStep] = useState<1 | 2 | 3 | null>(null);
  const [loadingSpoonacular, setLoadingSpoonacular] = useState(false);

  const handleDetected = (ingredients: string[]) => {
    setDetectedIngredients(ingredients);
    setStep(2);
  };

  const handleConfirmIngredients = async (ingredients: string[]) => {
    setConfirmedIngredients(ingredients);
    setLoadingSpoonacular(true);
    setStep(3);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/get-recipes`,
        { ingredients },
      );
      setRecipes(res.data.recipes || []);
    } catch (err) {
      console.error("Failed to fetch recipes:", err);
    } finally {
      setLoadingSpoonacular(false);
    }
  };

  const handleSave = async (recipe: any) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("You must be logged in to save recipes.");
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/save-recipe`,
        {
          title: recipe.title,
          image: recipe.image,
          source_url: `https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, "-")}-${recipe.id}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Recipe saved!");
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save recipe. Try again.");
    }
  };

  return (
    <main className="min-h-screen max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold">Upload an Image</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Detect ingredients from your food photo and get recipes instantly.
        </p>
      </div>

      <UploadImage onDetected={handleDetected} setStep={setStep} />

      {step && (
        <div className="flex justify-center items-center gap-4">
          {["Clarifai", "OpenAI", "Spoonacular"].map((label, idx) => {
            const index = idx + 1;
            let bg = "bg-zinc-200 dark:bg-zinc-800 text-zinc-600";
            let content = `${index}. ${label}`;

            if (step > idx) {
              bg = "bg-green-500 text-white";
              content = `${label}`;
            } else if (index === 3 && step === 3 && loadingSpoonacular) {
              bg = "bg-yellow-400 text-black";
              content = `${index}. ${label}`;
            }

            return (
              <div
                key={label}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${bg}`}
              >
                {content}
              </div>
            );
          })}
        </div>
      )}

      {detectedIngredients && (
        <IngredientReview
          initialIngredients={detectedIngredients}
          onConfirm={handleConfirmIngredients}
        />
      )}

      {confirmedIngredients && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Final Ingredients:</h2>
          <div className="flex flex-wrap gap-2">
            {confirmedIngredients.map((ing, idx) => (
              <span
                key={idx}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
              >
                {ing}
              </span>
            ))}
          </div>
        </div>
      )}

      {recipes && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Suggested Recipes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
              <div
                key={index}
                className="rounded-lg overflow-hidden shadow-md bg-white dark:bg-zinc-900 hover:shadow-xl transition flex flex-col"
              >
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 flex flex-col flex-grow justify-between">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                    {recipe.title}
                  </h3>
                  <div className="flex gap-2 mt-auto">
                    <a
                      href={`https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, "-")}-${recipe.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleSave(recipe)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
