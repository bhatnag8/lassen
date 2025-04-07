"use client";

import { useState } from "react";
import axios from "axios";

interface UploadImageProps {
  onDetected: (ingredients: string[]) => void;
}

export default function UploadImage({ onDetected }: UploadImageProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setIngredients(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const filename = uploadRes.data.filename;

      const detectRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/detect-ingredients`,
        { filename }
      );
      const detected = detectRes.data.ingredients || [];
      setIngredients(detected);
      onDetected(detected);
    } catch (err: any) {
      console.error(err);
      setError("Failed to upload or detect ingredients.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {previewUrl && (
        <div>
          <p className="text-sm text-gray-600">Preview:</p>
          <img src={previewUrl} alt="Preview" className="w-64 h-auto rounded" />
        </div>
      )}

      {selectedFile && (
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Detecting..." : "Detect Ingredients"}
        </button>
      )}

      {ingredients && (
        <div>
          <h2 className="text-xl font-semibold mt-6 mb-2">Detected Ingredients:</h2>
          <ul className="list-disc list-inside">
            {ingredients.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}