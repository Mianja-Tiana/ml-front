"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import querystring from "node:querystring";

export default function LoginPage() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const requestBody = querystring.stringify(formData);

      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: requestBody,
      });

      if (!res.ok) {
        throw new Error("Invalid credentials" + res.status);
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);

      const userRes = await fetch(`${apiUrl}/api/users/me`, {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });

      if (userRes.ok) {
        const userData = await userRes.json();
        const isAdmin =
          userData.roles &&
          userData.roles.some((r: any) => r.role?.name === "admin");
        const dashboard = isAdmin ? "/dashboard/admin" : "/dashboard/user";
        router.push(dashboard);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-center overflow-hidden relative flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold gradient-text mb-4">
            Churn Prediction
          </h1>
          <p className="text-lg text-slate-300">
            Predict customer churn with advanced ML models
          </p>
        </div>

        <Card className="glass">
          <div className="p-8 lg:p-10">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-slate-300">
                Sign in to your account to continue
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm font-medium flex items-center gap-3">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Username
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-smooth"
                  placeholder="your username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-smooth"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full btn-gradient text-white font-bold py-3 rounded-lg transition-smooth disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
              >
                Create one now
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
