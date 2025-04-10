"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [target.name]: target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
        formData
      );

      const token = res.data.access_token;
      Cookies.set("token", token, { path: "/", sameSite: "strict" }); // ✅ middleware will now see it
      router.push("/upload");
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail[0]?.msg || "Invalid input");
      } else {
        setError(detail || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Log In</h1>
      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        <input
          name="email"
          type="email"
          placeholder="Email"
          defaultValue={formData.email}
          onInput={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
          autoComplete="off"
          // autoComplete="email"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          defaultValue={formData.password}
          onInput={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
          autoComplete="new-password"
          // autoComplete="current-password"
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
      <p className="text-sm text-right mt-2">
        <a href="/auth/forgot-password" className="text-blue-600 hover:underline">
          Forgot password?
        </a>
      </p>
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </main>
  );
}