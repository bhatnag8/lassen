"use client";

import { useState } from "react";
import axios from "axios";

export default function SignupPage() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);
    
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/signup`,
            formData
          );
          setMessage("Signup successful! You can now log in.");
        } catch (err: any) {
          setError(err.response?.data?.detail || "Something went wrong");
        } finally {
          setLoading(false);
        }
      };

      return (
        <main className="min-h-screen max-w-md mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold mb-4">Create an Account</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {["first_name", "last_name", "email", "password", "confirm_password"].map((field) => (
              <input
                key={field}
                name={field}
                type={field.includes("password") ? "password" : "text"}
                placeholder={field.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase())}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            ))}
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
    
          {message && <p className="text-green-600 mt-4">{message}</p>}
          {error && <p className="text-red-600 mt-4">{error}</p>}
        </main>
      );


}