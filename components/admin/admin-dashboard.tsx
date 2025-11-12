"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UsersList from "@/components/admin/users-list";
import FeedbackList from "@/components/admin/feedback-list";
import LogsList from "@/components/admin/logs-list";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Loader2, 
  UserPlus, 
  CheckCircle, 
  XCircle, 
  Shield, 
  Crown, 
  User, 
  Mail, 
  Lock,
  ArrowLeft,
  Check
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const apiUrl = "https://api.telcopredict.live";

  const [activeSection, setActiveSection] = useState("users");
  const [previousSection, setPreviousSection] = useState<string | null>(null);
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
  const [createSuccess, setCreateSuccess] = useState(false);

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
      } catch {
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
    setCreateSuccess(false);
    setCreateLoading(true);

    if (!formData.username || !formData.email || !formData.password || !formData.confirm_password) {
      setCreateError("All fields are required");
      setCreateLoading(false);
      return;
    }

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
      const res = await fetch(`${apiUrl}/admin/create-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirm_password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setCreateSuccess(true);
        setFormData({ username: "", email: "", password: "", confirm_password: "" });
      } else {
        const msg = data.detail?.[0]?.msg || data.detail || "Failed to create admin";
        setCreateError(msg);
      }
    } catch {
      setCreateError("Network error. Please try again.");
    } finally {
      setCreateLoading(false);
    }
  };

  const goBack = () => {
    if (previousSection) {
      setActiveSection(previousSection);
      setPreviousSection(null);
    }
  };

  const openCreateAdmin = () => {
    setPreviousSection(activeSection);
    setActiveSection("create-admin");
    setCreateSuccess(false);
    setCreateError("");
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
              onClick={item.id === "create-admin" ? openCreateAdmin : () => setActiveSection(item.id)}
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
            {activeSection === "logs" && <LogsList />}

            {/* === PROFILE === */}
            {activeSection === "profile" && profile && (
              <Card className="bg-slate-800/70 border-slate-700 backdrop-blur-xl shadow-2xl max-w-2xl mx-auto">
                <div className="p-12 text-center">
                  <div className="w-36 h-36 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full mx-auto mb-8 flex items-center justify-center text-7xl font-bold text-white shadow-2xl ring-8 ring-slate-900/50">
                    {profile.username[0].toUpperCase()}
                  </div>
                  <h1 className="text-5xl font-bold text-white">{profile.username}</h1>
                  <p className="text-2xl text-blue-400 mt-4 flex items-center justify-center gap-3">
                    <Shield className="w-8 h-8" />
                    Super Administrateur
                  </p>
                  <div className="mt-10 space-y-4 text-left bg-slate-900/60 rounded-2xl p-8 border border-slate-700">
                    <p className="text-slate-300 text-lg"><span className="text-slate-400">Email:</span> {profile.email || "Non défini"}</p>
                    <p className="text-slate-300 text-lg"><span className="text-slate-400">Rôle:</span> <span className="text-blue-400 font-bold">Root Admin</span></p>
                    <p className="text-slate-300 text-lg"><span className="text-slate-400">Connexion:</span> Dakar, Sénégal</p>
                    <p className="text-slate-300 text-lg"><span className="text-slate-400">Heure locale:</span> {new Date().toLocaleString("fr-SN", { timeZone: "Africa/Dakar" })}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* === SUCCESS PAGE – PROPRE, SANS CLIGNOTEMENT === */}
            {activeSection === "create-admin" && createSuccess && (
              <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-2xl shadow-2xl max-w-2xl mx-auto">
                <div className="p-16 text-center">
                  {/* Flèche verte FIXE */}
                  <div className="w-24 h-24 bg-emerald-600 rounded-full mx-auto mb-8 flex items-center justify-center shadow-xl">
                    <Check className="w-14 h-14 text-white" />
                  </div>

                  <h2 className="text-4xl font-bold text-white mb-4">
                    Admin Created Successfully
                  </h2>
                  <p className="text-xl text-slate-300 mb-3">
                    <span className="font-bold text-emerald-400">{formData.username}</span>  <span className="font-bold text-blue-400"></span>
                  </p>
                  <p className="text-lg text-slate-400 mb-12">
                    Full system access granted.
                  </p>

                  {/* BOUTON BLEU NUIT SIMPLE */}
                  <Button
                    onClick={goBack}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg px-12 py-6 rounded-xl shadow-lg flex items-center gap-3 mx-auto"
                  >
                    <ArrowLeft className="w-6 h-6" />
                    Return
                  </Button>
                </div>
              </Card>
            )}

            {/* === CREATE ADMIN FORM === */}
            {activeSection === "create-admin" && !createSuccess && (
              <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-2xl shadow-2xl max-w-2xl mx-auto">
                <div className="p-12">
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-6 shadow-2xl">
                      <UserPlus className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold text-white">Create New Admin</h2>
                    <p className="text-slate-400 mt-4 text-lg">Give full system access to a new super admin</p>
                  </div>

                  {createError && (
                    <div className="mb-8 p-6 bg-red-900/50 border border-red-600/70 rounded-2xl flex items-center gap-4">
                      <XCircle className="w-12 h-12 text-red-400" />
                      <p className="text-red-300 font-medium text-lg">{createError}</p>
                    </div>
                  )}

                  <form onSubmit={handleCreateAdmin} className="space-y-8">
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="username" className="text-slate-300 text-lg flex items-center gap-3">
                          <User className="w-6 h-6 text-blue-400" />
                          Username
                        </Label>
                        <Input
                          id="username"
                          type="text"
                          required
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          className="mt-3 bg-slate-900/70 border-slate-600 text-white text-lg py-7 placeholder-slate-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all rounded-xl"
                          placeholder="Username"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-slate-300 text-lg flex items-center gap-3">
                          <Mail className="w-6 h-6 text-blue-400" />
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="mt-3 bg-slate-900/70 border-slate-600 text-white text-lg py-7 placeholder-slate-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 rounded-xl"
                          placeholder="admin@telcopredict.sn"
                        />
                      </div>

                      <div>
                        <Label htmlFor="password" className="text-slate-300 text-lg flex items-center gap-3">
                          <Lock className="w-6 h-6 text-blue-400" />
                          Password
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="mt-3 bg-slate-900/70 border-slate-600 text-white text-lg py-7 placeholder-slate-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 rounded-xl"
                          placeholder="........."
                        />
                      </div>

                      <div>
                        <Label htmlFor="confirm" className="text-slate-300 text-lg flex items-center gap-3">
                          <Lock className="w-6 h-6 text-blue-400" />
                          Confirm Password
                        </Label>
                        <Input
                          id="confirm"
                          type="password"
                          required
                          value={formData.confirm_password}
                          onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                          className="mt-3 bg-slate-900/70 border-slate-600 text-white text-lg py-7 placeholder-slate-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 rounded-xl"
                          placeholder="........."
                        />

                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={createLoading}
                      className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 hover:from-blue-700 hover:via-cyan-700 hover:to-blue-700 text-white font-bold text-2xl py-8 rounded-2xl shadow-2xl hover:shadow-cyan-500/50 transition-all duration-500"
                    >
                      {createLoading ? (
                        <>
                          <Loader2 className="w-10 h-10 mr-4 animate-spin" />
                          Creating Admin...
                        </>
                      ) : (
                        <>
                          <Crown className="w-10 h-10 mr-4" />
                          Create Administrator
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