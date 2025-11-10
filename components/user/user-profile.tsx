"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { User, Mail, Shield, Calendar, Hash, CheckCircle2 } from "lucide-react";

interface UserData {
  id?: number;
  username: string;
  email: string;
  role: string;
  full_name?: string;
  created_at?: string;
}

export default function UserProfile() {
  const [profile, setProfile] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.telcopredict.live";

        const res = await fetch(`${BACKEND_URL}/api/users/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || "Failed to load profile");
        }

        const data: UserData = await res.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-slate-600 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700 p-10 text-center">
        <p className="text-red-400 text-xl font-semibold mb-2">Failed to load profile</p>
        <p className="text-slate-400 text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
        >
          Retry
        </button>
      </Card>
    );
  }

  const initials = profile.full_name
    ? profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : profile.username[0].toUpperCase();

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 text-white text-3xl font-bold shadow-2xl shadow-cyan-900/30 ring-4 ring-slate-800 mb-6">
          {initials}
        </div>
        <h1 className="text-4xl font-bold text-white">
          {profile.username}
        </h1>
        <p className="text-slate-400 mt-2">
          Senegal • GMT • {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Profile Card */}
        <Card className="bg-slate-900/70 backdrop-blur-2xl border border-slate-700 shadow-2xl">
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-slate-300 mb-8 flex items-center gap-3">
              <User className="w-6 h-6 text-cyan-500" />
              Profile Information
            </h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <User className="w-10 h-10 text-cyan-500 p-2 bg-slate-700/50 rounded-lg" />
                <div>
                  <p className="text-slate-400 text-sm">Username</p>
                  <p className="text-xl font-medium text-white">{profile.username}</p>
                </div>
              </div>

              {profile.full_name && (
                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <Shield className="w-10 h-10 text-purple-500 p-2 bg-slate-700/50 rounded-lg" />
                  <div>
                    <p className="text-slate-400 text-sm">Full Name</p>
                    <p className="text-xl font-medium text-white">{profile.full_name}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <Mail className="w-10 h-10 text-blue-500 p-2 bg-slate-700/50 rounded-lg" />
                <div>
                  <p className="text-slate-400 text-sm">Email</p>
                  <p className="text-xl font-medium text-white break-all">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-5 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-xl border border-cyan-700/50">
                <div className="flex items-center gap-4">
                  <Shield className="w-11 h-11 text-cyan-400 p-2 bg-cyan-900/40 rounded-lg" />
                  <div>
                    <p className="text-slate-400 text-sm">Account Type</p>
                    <p className="text-2xl font-bold text-white capitalize">
                      {profile.role}
                    </p>
                  </div>
                </div>
                {profile.role === "admin" ? (
                  <span className="px-4 py-2 bg-amber-900/40 text-amber-300 text-xs font-bold rounded-full border border-amber-700/50">
                    ADMIN
                  </span>
                ) : (
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Account Details avec BOUTON ACTIVE QUI CLIGNOTE */}
        <Card className="bg-slate-900/70 backdrop-blur-2xl border border-slate-700 shadow-2xl">
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-slate-300 mb-8 flex items-center gap-3">
              <Hash className="w-6 h-6 text-indigo-500" />
              Account Details
            </h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <Hash className="w-10 h-10 text-indigo-500 p-2 bg-slate-700/50 rounded-lg" />
                <div>
                  <p className="text-slate-400 text-sm">Member ID</p>
                  <p className="font-mono text-xl text-white">
                    #{profile.id ? profile.id.toString().padStart(6, "0") : "—"}
                  </p>
                </div>
              </div>

              {/* BOUTON ACTIVE QUI CLIGNOTE */}
              <div className="p-6 bg-gradient-to-r from-green-900/40 to-emerald-900/40 rounded-xl border border-green-700/60 shadow-lg shadow-green-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500 rounded-full blur-xl animate-ping opacity-70"></div>
                      <div className="relative p-3 bg-green-600 rounded-full">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="text-green-300 text-sm">Account Status</p>
                      <p className="text-3xl font-bold text-white">Active</p>
                    </div>
                  </div>
                  {/* Point qui pulse */}
                  <div className="relative">
                    <div className="w-5 h-5 bg-green-400 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 w-5 h-5 bg-green-400 rounded-full"></div>
                  </div>
                </div>
              </div>

              {profile.created_at && (
                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <Calendar className="w-10 h-10 text-orange-500 p-2 bg-slate-700/50 rounded-lg" />
                  <div>
                    <p className="text-slate-400 text-sm">Member Since</p>
                    <p className="text-lg font-medium text-white">
                      {new Date(profile.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-slate-700 text-center">
                <p className="text-slate-500 text-xs flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4" />
                  Your data is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}