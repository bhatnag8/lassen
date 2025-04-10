"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [form, setForm] = useState({ new_password: "", confirm_password: "" });
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/reset-password`, {
        token,
        ...form,
      });
      setStatus({ type: "success", message: res.data.message });
    } catch (err: any) {
      setStatus({ type: "error", message: err.response?.data?.detail || "Reset failed" });
    }
  };

  if (!token) {
    return <p className="text-red-600">Invalid reset link</p>;
  }

  return (
    <main className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="new_password"
          type="password"
          placeholder="New Password"
          className="w-full border px-3 py-2 rounded"
          value={form.new_password}
          onChange={handleChange}
          required
        />
        <input
          name="confirm_password"
          type="password"
          placeholder="Confirm Password"
          className="w-full border px-3 py-2 rounded"
          value={form.confirm_password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
          Reset Password
        </button>
      </form>
      {status && (
        <p className={`mt-4 ${status.type === "success" ? "text-green-600" : "text-red-600"}`}>
          {status.message}
        </p>
      )}
    </main>
  );
}