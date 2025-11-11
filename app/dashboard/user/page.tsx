"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, User, MessageSquare, Package } from "lucide-react";
import UserProfile from "@/components/user/user-profile";
import CreateFeedback from "@/components/user/create-feedback";
import CreateModel from "@/components/user/create-model";

export default function UserDashboard() {
  const router = useRouter();
  const apiUrl = "https://api.telcopredict.live";

  const [isDarkMode] = useState(true); // Toujours dark mode (comme admin)
  const [activeSection, setActiveSection] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.role === "admin") {
            router.replace("/dashboard/admin");
            return;
          }
          setUser(data);
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

    fetchUser();
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/auth/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-xl text-slate-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const menuItems = [
    { id: "profile", label: "My Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { id: "feedback", label: "Submit Feedback", icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" },
    { id: "model", label: "Create Model", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
  ];

  return (
    <div className="min-h-screen flex bg-slate-900">
      {/* === SIDEBAR === */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
            <Package className="w-7 h-7" />
            ChurnPredict
          </h1>
          <p className="text-sm text-slate-400 mt-1">User Portal</p>
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

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-4 px-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
              {user.username[0].toUpperCase()}
            </div>
            <div>
              <p className="text-white font-medium">{user.username}</p>
              <p className="text-xs text-slate-400">User</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-900/50 text-red-400 hover:bg-red-900/70 transition"
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
          <div className="max-w-6xl mx-auto">

            {/* === PROFILE === */}
            {activeSection === "profile" && (
              <Card className="bg-slate-800/70 border-slate-700 backdrop-blur-xl shadow-2xl">
                <div className="p-10">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-5xl font-bold text-white shadow-2xl">
                      {user.username[0].toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-4xl font-bold text-white">Welcome back,</h2>
                      <p className="text-2xl text-blue-400 mt-2">{user.username}</p>
                      <p className="text-slate-400 mt-1 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Standard User Account
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-slate-300 mb-3">Account Information</h3>
                      <div className="space-y-3 text-slate-200">
                        <p><span className="text-slate-400">Username:</span> {user.username}</p>
                        <p><span className="text-slate-400">Role:</span> <span className="text-cyan-400 font-bold">User</span></p>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-slate-300 mb-3">Quick Actions</h3>
                      <div className="space-y-3">
                        <Button
                          onClick={() => setActiveSection("feedback")}
                          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Submit Feedback
                        </Button>
                        <Button
                          onClick={() => setActiveSection("model")}
                          variant="outline"
                          className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <Package className="w-4 h-4 mr-2" />
                          Create New Model
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* === FEEDBACK & MODEL === */}
            {activeSection === "feedback" && <CreateFeedback />}
            {activeSection === "model" && <CreateModel />}

          </div>
        </div>
      </div>
    </div>
  );
}