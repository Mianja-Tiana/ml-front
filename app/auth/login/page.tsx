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
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const toggleMode = () => setIsDarkMode(!isDarkMode);

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
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gradient-radial from-slate-900 via-blue-900 to-slate-800"
          : "bg-gradient-to-r from-blue-50 via-white to-blue-100"
      } overflow-hidden relative flex items-center justify-center p-4 transition-all duration-500`}
    >
      
      <div
        className={`absolute inset-0 ${
          isDarkMode
            ? "bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.15)_0%,_transparent_70%)]"
            : "bg-[radial-gradient(circle_at_center,_rgba(147,197,253,0.15)_0%,_transparent_70%)]"
        } blur-3xl opacity-60`}
      ></div>
      <div
        className={`absolute top-1/4 left-1/4 w-96 h-96 ${
          isDarkMode ? "bg-blue-500/15" : "bg-blue-200/20"
        } rounded-full blur-3xl animate-pulse shadow-2xl ${
          isDarkMode ? "shadow-blue-500/20" : "shadow-blue-300/30"
        }`}
      ></div>
      <div
        className={`absolute bottom-1/4 right-1/4 w-80 h-80 ${
          isDarkMode ? "bg-slate-700/25" : "bg-blue-300/25"
        } rounded-full blur-3xl animate-pulse delay-1000 shadow-2xl ${
          isDarkMode ? "shadow-slate-500/20" : "shadow-blue-300/30"
        }`}
      ></div>
      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 ${
          isDarkMode
            ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20"
            : "bg-gradient-to-r from-blue-300/30 to-blue-400/30"
        } rounded-full blur-2xl animate-spin-slow opacity-50`}
      ></div>

      
      <button
        onClick={toggleMode}
        className={`absolute top-4 right-4 p-3 rounded-full ${
          isDarkMode ? "bg-slate-800 text-white" : "bg-blue-200 text-blue-800"
        } shadow-lg hover:shadow-xl transition-all duration-300 z-20`}
        aria-label="Toggle theme"
      >
        {isDarkMode ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <h1
            className={`text-5xl font-bold ${
              isDarkMode
                ? "bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-600"
                : "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800"
            } bg-clip-text text-transparent mb-4 drop-shadow-2xl animate-pulse-slow`}
          >
            Churn Prediction
          </h1>
          <p className={`text-lg ${isDarkMode ? "text-slate-300" : "text-blue-700"} drop-shadow-lg`}>
            Predict customer churn with advanced ML models
          </p>
        </div>

        <Card
          className={`glass backdrop-blur-2xl ${
            isDarkMode
              ? "bg-slate-900/50 border border-slate-700/60 shadow-blue-500/20"
              : "bg-white/70 border border-blue-300/60 shadow-blue-400/30"
          } shadow-2xl rounded-3xl glow-effect`}
        >
          <div className="p-8 lg:p-10">
            <div className="mb-8 text-center">
              <h2 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-blue-800"} mb-2 drop-shadow-2xl`}>
                Welcome Back
              </h2>
              <p className={`${isDarkMode ? "text-slate-300" : "text-blue-600"} drop-shadow-lg`}>
                Sign in to your account to continue
              </p>
            </div>

            {error && (
              <div
                className={`mb-6 p-4 ${
                  isDarkMode ? "bg-red-500/15 border-red-500/40" : "bg-red-100/70 border-red-300/40"
                } border rounded-xl text-red-600 text-sm font-medium flex items-center gap-3 backdrop-blur-md shadow-lg ${
                  isDarkMode ? "shadow-red-500/10" : "shadow-red-300/10"
                }`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
                <label
                  className={`block text-sm font-semibold ${
                    isDarkMode ? "text-white" : "text-blue-800"
                  } mb-3 drop-shadow-lg flex items-center gap-2`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  Username
                </label>
                <input
                  type="text"
                  required
                  className={`w-full px-4 py-3 ${
                    isDarkMode
                      ? "bg-slate-900/60 border-slate-700/60 text-white placeholder-slate-400"
                      : "bg-blue-50/70 border-blue-300/60 text-blue-800 placeholder-blue-500"
                  } border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-500 backdrop-blur-sm shadow-inner glow-input`}
                  placeholder="your username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>

              
              <div className="relative">
                <label
                  className={`block text-sm font-semibold ${
                    isDarkMode ? "text-white" : "text-blue-800"
                  } mb-3 drop-shadow-lg flex items-center gap-2`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className={`w-full pr-10 px-4 py-3 ${
                      isDarkMode
                        ? "bg-slate-900/60 border-slate-700/60 text-white placeholder-slate-400"
                        : "bg-blue-50/70 border-blue-300/60 text-blue-800 placeholder-blue-500"
                    } border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-500 backdrop-blur-sm shadow-inner glow-input`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      isDarkMode ? "text-slate-400 hover:text-slate-300" : "text-blue-500 hover:text-blue-700"
                    } transition-colors`}
                  >
                    {showPassword ? (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className={`w-full ${
                  isDarkMode
                    ? "bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 hover:from-blue-600 hover:via-cyan-600 hover:to-blue-700"
                    : "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700"
                } text-white font-bold py-3 rounded-lg transition-all duration-500 disabled:opacity-50 shadow-lg hover:shadow-2xl ${
                  isDarkMode ? "hover:shadow-blue-500/30" : "hover:shadow-blue-400/30"
                } glow-button`}
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

            <div className={`mt-8 text-center text-sm ${isDarkMode ? "text-slate-400" : "text-blue-600"} drop-shadow-lg`}>
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className={`font-bold transition-colors duration-300 hover:drop-shadow-lg ${
                  isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"
                }`}
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