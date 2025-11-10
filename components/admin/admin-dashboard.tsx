"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UsersList from "@/components/admin/users-list";
import FeedbackList from "@/components/admin/feedback-list";
import ModelsList from "@/components/admin/models-list";
import LogsList from "@/components/admin/logs-list";

export default function AdminDashboard() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.telcopredict.live/docs#/";


  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState("users");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  const toggleMode = () => setIsDarkMode(!isDarkMode);

  
  useEffect(() => {
    const token = localStorage.getItem("token");

   
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    // On fetch le profil
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
          setProfile(data);
        } else {
          
          localStorage.removeItem("token");
          router.replace("/auth/login");
        }
      } catch (err) {
        console.error("Erreur réseau ou serveur:", err);
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


  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-500">Vérification de la session...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null; 
  }

  const menuItems = [
    { id: "users", label: "Users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { id: "feedback", label: "Feedback", icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" },
    { id: "models", label: "ML Models", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
    { id: "logs", label: "Prediction Logs", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { id: "profile", label: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ];

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'} transition-colors duration-300`}>
      
      {/* === SIDEBAR === */}
      <div className={`w-64 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-r ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} flex flex-col`}>
        <div className="p-6 border-b border-slate-700">
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            ChurnPredict
          </h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === item.id
                  ? 'bg-blue-600 text-white'
                  : isDarkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700 space-y-3">
          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isDarkMode ? 'text-red-400 hover:bg-slate-700' : 'text-red-600 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>

          <button
            onClick={toggleMode}
            className={`w-full py-2 text-sm rounded-lg ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-700'}`}
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>

     
      <div className="flex-1 ml-64">
        <div className="p-10">
          <div className="max-w-6xl mx-auto">

            {activeSection === "users" && <div className="p-8"><UsersList /></div>}
            {activeSection === "feedback" && <div className="p-8"><FeedbackList /></div>}
            {activeSection === "models" && <div className="p-8"><ModelsList /></div>}
            {activeSection === "logs" && <div className="p-8"><LogsList /></div>}

            {activeSection === "profile" && profile && (
              <div className={`p-8 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Admin Profile
                </h2>
                <div className="space-y-4 text-lg">
                  <p><strong>Username:</strong> {profile.username}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Role:</strong> <span className="px-3 py-1 rounded-full bg-blue-600 text-white">Administrateur</span></p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}