"use client";

import { useState } from "react";
import Link from "next/link"; // Aggiunto l'import del Link
import Input from "../components/input";

import MailIcon from "../components/icons/mailIcon";
import LockIcon from "../components/icons/lockIcon";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [form, setForm] = useState<FormData>({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "Error during sign in");
        return;
      }

      setSuccess("Sign In successful!");
      setForm({ email: "", password: "" });

      // Qui potrai inserire il redirect alla dashboard in futuro
    } catch {
      setError("Connection Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-text transition-colors duration-300">
      <form
        onSubmit={handleSubmit}
        className="bg-background/80 backdrop-blur-md border border-primary/20 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-primary mb-6">
          Sign In
        </h1>

        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          icon={<MailIcon />}
        />

        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          icon={<LockIcon />}
        />

        <button className="btn btn-primary w-full mt-2">Login</button>

        {error && (
          <p className="text-secondary text-sm text-center mt-4">{error}</p>
        )}
        {success && (
          <p className="text-primary text-sm text-center mt-4">{success}</p>
        )}

        {/* --- NUOVA SEZIONE LINK AL REGISTER --- */}
        <div className="text-center mt-6 text-sm">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-primary hover:underline font-bold transition-all"
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
