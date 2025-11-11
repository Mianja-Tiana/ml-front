"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UsersList from "@/components/admin/users-list";
import FeedbackList from "@/components/admin/feedback-list";
import ModelsList from "@/components/admin/models-list";
import LogsList from "@/components/admin/logs-list";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserPlus, CheckCircle, XCircle, Shield } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const apiUrl = "https://api.telcopredict.live";

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState("users");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  // Create Admin Form
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

  const toggleMode = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.role !== "admin") {
            router.replace("/dashboard/users");
            return;
          }
          setProfile(data);
        } else {
          localStorage.removeItem("token");
          router.replace("/auth/login");
        }
      } catch (err) {
        localStorage.removeItem("token");
        router.replace("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/auth/login");
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setCreateSuccess("");
    setCreateLoading(true);

    if (formData.password !== formData.confirm_password) {
      setCreateError("Passwords do not match");
      setCreateLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setCreateError("Password must be at least 6 characters");
      setCreateLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          is_admin: true,
        }),
      });

      if (res.ok) {
        setCreateSuccess("Admin created successfully!");
        setFormData({ username: "", email: "", password: "", confirm_password: "" });
      } else {
        const err = await res.json();
        setCreateError(err.detail || "Failed to create admin");
      }
    } catch (err) {
      setCreateError("Network error. Please try again.");
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-slate-400">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const menuItems = [
    { id: "users", label: "Users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { id: "feedback", label: "Feedback", icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" },
    { id: "models", label: "ML Models", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
    { id: "logs", label: "Prediction Logs", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { id: "create-admin", label: "Create Admin", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { id: "profile", label: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ];

  return (
    <div className="min-h-screen flex bg-slate-900">
      {/* === SIDEBAR === */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
            <Shield className="w-7 h-7" />
            ChurnPredict
          </h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeSection === item.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700 space-y-3">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-slate-700 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* === MAIN CONTENT === */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">

            {activeSection === "users" && <UsersList />}
            {activeSection === "feedback" && <FeedbackList />}
            {activeSection === "models" && <ModelsList />}
            {activeSection === "logs" && <LogsList />}

            {/* === PROFILE SECTION === */}
            {activeSection === "profile" && profile && (
              <Card className="bg-slate-800/70 border-slate-700 backdrop-blur-xl shadow-2xl">
                <div className="p-10">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                      {profile.username[0].toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">Admin Profile</h2>
                      <p className="text-slate-400">Welcome back, {profile.username}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                    <div className="space-y-4">
                      <div>
                        <span className="text-slate-400">Username:</span>
                        <p className="text-white font-semibold">{profile.username}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Role:</span>
                        <p className="inline-flex items-center gap-2 mt-2">
                          <Shield className="w-5 h-5 text-blue-400" />
                          <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-bold">
                            Administrator
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* === CREATE ADMIN SECTION === */}
            {activeSection === "create-admin" && (
              <Card className="bg-slate-800/70 border-slate-700 backdrop-blur-xl shadow-2xl">
                <div className="p-10">
                  <div className="flex items-center gap-4 mb-8">
                    <UserPlus className="w-10 h-10 text-blue-400" />
                    <h2 className="text-3xl font-bold text-white">Create New Admin</h2>
                  </div>

                  {createSuccess && (
                    <div className="mb-6 p-4 bg-green-900/30 border border-green-700/50 rounded-lg flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <p className="text-green-300 font-medium">{createSuccess}</p>
                    </div>
                  )}

                  {createError && (
                    <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-lg flex items-center gap-3">
                      <XCircle className="w-6 h-6 text-red-400" />
                      <p className="text-red-300 font-medium">{createError}</p>
                    </div>
                  )}

                  <form onSubmit={handleCreateAdmin} className="space-y-6 max-w-2xl">
                    <div>
                      <Label htmlFor="username" className="text-slate-300">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        required
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="mt-2 bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500"
                        placeholder="admin123"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-slate-300">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-2 bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500"
                        placeholder="admin@telcopredict.live"
                      />
                    </div>

                    <div>
                      <Label htmlFor="password" className="text-slate-300">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="mt-2 bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500"
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirm" className="text-slate-300">Confirm Password</Label>
                      <Input
                        id="confirm"
                        type="password"
                        required
                        value={formData.confirm_password}
                        onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                        className="mt-2 bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500"
                        placeholder="••••••••"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={createLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {createLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Creating Admin...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5 mr-2" />
                          Create Admin Account
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </Card>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}