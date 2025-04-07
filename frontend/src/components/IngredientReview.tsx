"use client";

import { useState } from "react";

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
    if (newIngredient.trim() === "") return;
    setIngredients((prev) => [...prev, newIngredient.trim()]);
    setNewIngredient("");
  };

  const handleConfirm = () => {
    onConfirm(ingredients);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Review & Edit Ingredients</h2>
      <ul className="list-disc list-inside">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="flex items-center space-x-2">
            <span>{ingredient}</span>
            <button
              onClick={() => removeIngredient(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Add ingredient"
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={addIngredient}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      <button
        onClick={handleConfirm}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Confirm Ingredients
      </button>
    </div>
  );
}