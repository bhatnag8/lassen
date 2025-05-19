"use client";

import { useState } from "react";
import axios from "axios";

interface UploadImageProps {
  onDetected: (ingredients: string[]) => void;
  setStep: (step: 1 | 2 | 3) => void;
}

export default function UploadImage({ onDetected, setStep }: UploadImageProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setStep(1); // Clarifai started

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload-image`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      const filename = uploadRes.data.filename;

      const detectRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/detect-ingredients`,
        { filename },
      );

      setStep(2); // OpenAI filtering started

      const detected = detectRes.data.ingredients || [];
      onDetected(detected);
      setStep(3); // Spoonacular triggered after confirm step
    } catch (err: any) {
      console.error(err);
      setError("Failed to upload or detect ingredients.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Custom File Upload */}
      <div className="flex items-center gap-4">
        <label
          htmlFor="image-upload"
          className="cursor-pointer inline-block px-6 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
        >
          {selectedFile ? "Change Image" : "Browse Image"}
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {selectedFile && (
          <span className="text-sm text-zinc-600 dark:text-zinc-400 truncate max-w-xs">
            {selectedFile.name}
          </span>
        )}
      </div>

      {/* Preview */}
      {previewUrl && (
        <div>
          <p className="text-sm text-gray-600 dark:text-zinc-400 mb-1">
            Preview:
          </p>
          <img
            src={previewUrl}
            alt="Preview"
            className="w-64 rounded-lg shadow-md"
          />
        </div>
      )}

      {/* Detect Button */}
      {selectedFile && (
        <button
          className="bg-black text-white px-5 py-2 rounded hover:bg-zinc-800 disabled:opacity-50"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Processing..." : "Detect Ingredients"}
        </button>
      )}

      {/* Error */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
