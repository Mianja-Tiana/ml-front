"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import UserProfile from "@/components/user/user-profile";
import CreateFeedback from "@/components/user/create-feedback";
import CreateModel from "@/components/user/create-model";

export default function UserDashboard() {
  const router = useRouter();

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState("profile");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const toggleMode = () => setIsDarkMode(!isDarkMode);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const menuItems = [
    { id: "profile", label: "My Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 6 0 00-7-7z" },
    { id: "feedback", label: "Submit Feedback", icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" },
    { id: "model", label: "Create Model", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
  ];

  if (loading) return null;

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'} transition-colors duration-300`}>
      
      {/* === SIDEBAR FIXE === */}
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

      {/* === CONTENU PRINCIPAL (sans fond gris) === */}
      <div className="flex-1 ml-64">
        <div className="p-10">
          <div className="max-w-5xl mx-auto">

            {/* Profile */}
            {activeSection === "profile" && (
              <div className="p-8">
                <UserProfile />
              </div>
            )}

            {/* Submit Feedback */}
            {activeSection === "feedback" && (
              <div className="p-8">
                <CreateFeedback />
              </div>
            )}

            {/* Create Model */}
            {activeSection === "model" && (
              <div className="p-8">
                <CreateModel />
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}