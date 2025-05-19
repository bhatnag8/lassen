"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Plus, Trash2 } from "lucide-react";

interface IngredientReviewProps {
  initialIngredients: string[];
  onConfirm: (ingredients: string[]) => void;
}

export default function IngredientReview({
  initialIngredients,
  onConfirm,
}: IngredientReviewProps) {
  const [ingredients, setIngredients] = useState<string[]>(initialIngredients);
  const [newIngredient, setNewIngredient] = useState("");

  const removeIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const addIngredient = () => {
    const trimmed = newIngredient.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients((prev) => [...prev, trimmed]);
      setNewIngredient("");
    }
  };

  const handleConfirm = () => {
    onConfirm(ingredients);
  };

  return (
    <div className="space-y-6 mt-10">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
          Review Ingredients
        </h2>
        <div className="flex items-center gap-1 text-green-600 font-semibold">
          <CheckCircle size={20} />
          Step 3 of 3
        </div>
      </div>

      {/* Ingredient pills */}
      <div className="flex flex-wrap gap-2">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="flex items-center bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-sm text-zinc-800 dark:text-zinc-100"
          >
            {ingredient}
            <button
              onClick={() => removeIngredient(index)}
              className="ml-2 text-red-500 hover:text-red-700"
              title="Remove"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Add new ingredient */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Add ingredient"
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addIngredient()}
          className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-900"
        />
        <button
          onClick={addIngredient}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center gap-1"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      {/* Confirm button */}
      <div>
        <button
          onClick={handleConfirm}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium transition w-full sm:w-auto"
        >
          Confirm & View Recipes
        </button>
      </div>
    </div>
  );
}
