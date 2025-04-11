"use client";

import { useState } from "react";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/request-password-reset`, { email });
      setMessage(res.data.message || "Check your inbox for the reset link.");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to request password reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Forgot your password?</h3>
          <p className="text-sm text-gray-500">
            Enter your email to receive a password reset link
          </p>
        </div>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="flex flex-col space-y-4 px-4 py-6 sm:px-16">
            <input
              type="email"
              name="email"
              placeholder="user@example.com"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md border py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            {message && <p className="text-green-600 text-center">{message}</p>}
            {error && <p className="text-red-600 text-center">{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}