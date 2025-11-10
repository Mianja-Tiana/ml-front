"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdminDashboard() {
  const router = useRouter();

  // Thème (true = dark, false = light)
  const [isDarkMode, setIsDarkMode] = useState(true);
  const toggleMode = () => setIsDarkMode(!isDarkMode);

  // Menu actif
  const [activeSection, setActiveSection] = useState("dashboard");

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { id: "profile", label: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { id: "ml-model", label: "ML Model", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
    { id: "users", label: "Users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { id: "predictions", label: "Predictions", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { id: "settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
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
                  ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                  : isDarkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700 space-y-3">
          <Button onClick={logout} variant="outline" className="w-full">
            Logout
          </Button>
          <button
            onClick={toggleMode}
            className={`w-full py-2 rounded-lg text-sm ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-700'}`}
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>

      {/* === CONTENU PRINCIPAL === */}
      <div className="flex-1 p-10">
        <div className="max-w-5xl mx-auto">
          {/* Dashboard Home */}
          {activeSection === "dashboard" && (
            <Card className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-8`}>
              <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Bienvenue, Admin
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <p className="text-sm text-gray-400">Total Users</p>
                  <p className={`text-3xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>1,234</p>
                </div>
                <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <p className="text-sm text-gray-400">Predictions Today</p>
                  <p className={`text-3xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>89</p>
                </div>
                <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <p className="text-sm text-gray-400">Model Accuracy</p>
                  <p className={`text-3xl font-bold ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>94.2%</p>
                </div>
              </div>
            </Card>
          )}

          {/* Profile */}
          {activeSection === "profile" && (
            <Card className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-8`}>
              <h2 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Profile</h2>
              <div className="flex items-center gap-8">
                <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center text-white text-5xl font-bold">
                  A
                </div>
                <div>
                  <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Admin User</h3>
                  <p className="text-gray-400">admin@churnprediction.com</p>
                  <p className={`mt-2 px-4 py-1 rounded-full inline-block ${isDarkMode ? 'bg-blue-600' : 'bg-blue-100'} text-white`}>
                    Administrateur
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* ML Model */}
          {activeSection === "ml-model" && (
            <Card className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-8`}>
              <h2 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>ML Model Performance</h2>
              <div className="space-y-6">
                {[
                  { label: "Accuracy", value: 94.2 },
                  { label: "Precision", value: 92.8 },
                  { label: "Recall", value: 89.5 },
                  { label: "F1 Score", value: 91.1 },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-400">{stat.label}</span>
                      <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stat.value}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${stat.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-8 w-full">Retrain Model</Button>
            </Card>
          )}

          {/* Users / Predictions / Settings */}
          {["users", "predictions", "settings"].includes(activeSection) && (
            <Card className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-12 text-center`}>
              <p className={`text-2xl ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                Section "{activeSection}" en cours de développement
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}