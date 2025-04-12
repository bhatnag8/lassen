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

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
        formData
      );
      const token = res.data.access_token;
      Cookies.set("token", token, { path: "/", sameSite: "strict" });
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
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Sign In</h3>
          <p className="text-sm text-gray-500">
            Use your email and password to sign in
          </p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} autoComplete="off">
          <div className="flex flex-col space-y-4 px-4 py-6 sm:px-16">
            <input
              name="email"
              type="email"
              placeholder="user@example.com"
              defaultValue={formData.email}
              onInput={handleChange}
              required
              autoComplete="off"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              defaultValue={formData.password}
              onInput={handleChange}
              required
              autoComplete="new-password"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <button
              type="submit"
              className="w-full rounded-md border py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-400"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Sign in"}
            </button>
            <p className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/auth/signup" className="hover:underline font-semibold">
                Sign up
              </a>{" "}
              for free.
            </p>
            <p className="text-center text-sm hover:underline font-semibold">
              <a href="/auth/forgot-password">Forgot password?</a>
            </p>
            {error && <p className="text-red-600 mt-2 text-center font-medium">{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}