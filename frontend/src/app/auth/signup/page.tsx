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
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Create an Account</h3>
          <p className="text-sm text-gray-500">Sign up with your details below</p>
        </div>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="flex flex-col space-y-4 px-4 py-6 sm:px-16">
            {["first_name", "last_name", "email", "password", "confirm_password"].map((field) => (
              <input
                key={field}
                name={field}
                type={field.includes("password") ? "password" : "text"}
                placeholder={field.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase())}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            ))}
            <button
              type="submit"
              className="w-full rounded-md border py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-400"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
            <p className="text-center text-sm">
              Already have an account?{" "}
              <a href="/auth/login" className="hover:underline font-semibold">
                Sign in
              </a>
            </p>
            {message && <p className="text-green-600 mt-2 text-center">{message}</p>}
            {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}