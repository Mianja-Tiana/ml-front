"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Shield, User, MessageSquare, Package, History, Trash2, Phone } from "lucide-react";
import CreateFeedback from "@/components/user/create-feedback";
import CreateModel from "@/components/user/create-model";

export default function UserDashboard() {
  const router = useRouter();
  const apiUrl = "https://api.telcopredict.live"; // Your real ML Backend

  const [activeSection, setActiveSection] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [predictLoading, setPredictLoading] = useState(false);
  const [sessionPredictLoading, setSessionPredictLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    MonthlyRevenue: 0, MonthlyMinutes: 0, OverageMinutes: 0, UnansweredCalls: 0,
    CustomerCareCalls: 0, PercChangeMinutes: 0, PercChangeRevenues: 0, ReceivedCalls: 0,
    TotalRecurringCharge: 0, CurrentEquipmentDays: 0, DroppedBlockedCalls: 0, MonthsInService: 0,
    ActiveSubs: 0, RespondsToMailOffers: "N", RetentionCalls: 0, RetentionOffersAccepted: 0,
    MadeCallToRetentionTeam: "N", ReferralsMadeBySubscriber: 0,
    CreditRating: "A", IncomeGroup: "Medium", Occupation: "Professional", PrizmCode: "U", TotalCalls: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    const fetchData = async () => {
      try {
        const userRes = await fetch(`${apiUrl}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userRes.ok) throw new Error();
        const userData = await userRes.json();
        if (userData.role === "admin") {
          router.replace("/dashboard/admin");
          return;
        }
        setUser(userData);

        const predRes = await fetch(`${apiUrl}/predict/predictions/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (predRes.ok) setPredictions(await predRes.json());
      } catch {
        localStorage.removeItem("token");
        router.replace("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setPredictLoading(true);
    setResult(null);
    setErrorMsg("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${apiUrl}/predict/predictions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setResult(data);
        setPredictions(prev => [data, ...prev]);
      } else {
        setErrorMsg(data.detail?.[0]?.msg || "Prediction failed");
      }
    } catch {
      setErrorMsg("ML Server unreachable");
    } finally {
      setPredictLoading(false);
    }
  };

  const handlePredictFromCallSession = async () => {
    setSessionPredictLoading(true);
    setResult(null);
    setErrorMsg("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${apiUrl}/prediction/predict-from-call-session/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({}),
      });
      const data = await res.json();

      if (res.ok) {
        setResult(data);
        setPredictions(prev => [data, ...prev]);
      } else {
        setErrorMsg(data.detail?.[0]?.msg || "No active call session");
      }
    } catch {
      setErrorMsg("ML Server unreachable");
    } finally {
      setSessionPredictLoading(false);
    }
  };

  const deletePrediction = async (id: number) => {
    if (!confirm("Delete this prediction?")) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${apiUrl}/predict/predictions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPredictions(prev => prev.filter(p => p.id !== id));
      } else {
        const err = await res.json();
        alert(err.detail?.[0]?.msg || "Cannot delete");
      }
    } catch {
      alert("Network error");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/auth/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-xl text-slate-300">Connecting to ML Backend...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const menuItems = [
    { id: "profile", label: "My Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { id: "predict", label: "Predict Churn", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
    { id: "session", label: "From Call", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
    { id: "history", label: "History", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "feedback", label: "Feedback", icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" },
    { id: "model", label: "Create Model", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
  ];

  return (
    <div className="min-h-screen flex bg-slate-900">
      {/* SIDEBAR */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
            <Package className="w-7 h-7" />
            ChurnPredict
          </h1>
          <p className="text-xs text-cwhite mt-1">User dashboard</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeSection === item.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-700"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
              {user.username[0].toUpperCase()}
            </div>
            <div>
              <p className="text-white font-medium">{user.username}</p>
              <p className="text-xs text-slate-400">User</p>
            </div>
          </div>
          <button onClick={logout} className="w-full text-red-400 hover:bg-red-900/50 py-2 rounded-lg transition">
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 lg:p-12">
          <div className="max-w-6xl mx-auto">

            {/* PROFILE WITH QUICK ACTIONS */}
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
                        <p><span className="text-slate-400">Location:</span> Dakar, Senegal</p>
                        <p><span className="text-slate-400">Local Time:</span> {new Date().toLocaleString("en-US", { timeZone: "Africa/Dakar" })}</p>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-slate-300 mb-3">Quick Actions</h3>
                      <div className="space-y-3">
                        <Button onClick={() => setActiveSection("predict")} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                          Predict Churn
                        </Button>
                        <Button onClick={() => setActiveSection("session")} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                          <Phone className="w-4 h-4 mr-2" />
                          Analyze Live Call
                        </Button>
                        <Button onClick={() => setActiveSection("feedback")} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Submit Feedback
                        </Button>
                        <Button onClick={() => setActiveSection("model")} variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                          <Package className="w-4 h-4 mr-2" />
                          Create New Model
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* MANUAL PREDICTION */}
            {activeSection === "predict" && (
              <Card className="bg-slate-800/70 border-slate-700 backdrop-blur-xl shadow-2xl">
                <div className="p-10">
                  <h2 className="text-3xl font-bold text-white mb-8">Manual Churn Prediction</h2>
                  {errorMsg && <div className="mb-6 p-4 bg-red-900/30 border border-red-600 rounded-lg text-red-300">{errorMsg}</div>}
                  {result && (
                    <div className="mb-8 p-6 bg-slate-900/50 rounded-xl border border-slate-600">
                      <p className="text-2xl font-bold text-white">
                        {result.prediction === 1 ? "High Churn Risk" : "Loyal Customer"}
                      </p>
                      <p className="text-lg text-slate-300">Probability: {(result.probability * 100).toFixed(1)}%</p>
                    </div>
                  )}
                  <form onSubmit={handlePredict} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.keys(form).map((key) => (
                      <div key={key}>
                        <Label className="text-slate-300 text-sm">{key}</Label>
                        <Input
                          type={typeof form[key as keyof typeof form] === "number" ? "number" : "text"}
                          value={form[key as keyof typeof form]}
                          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                          className="mt-1 bg-slate-900/50 border-slate-600 text-white"
                        />
                      </div>
                    ))}
                    <div className="col-span-full">
                      <Button type="submit" disabled={predictLoading} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600">
                        {predictLoading ? "Predicting..." : "Predict Churn"}
                      </Button>
                    </div>
                  </form>
                </div>
              </Card>
            )}

            {/* FROM CALL SESSION */}
            {activeSection === "session" && (
              <Card className="bg-slate-800/70 border-slate-700 backdrop-blur-xl shadow-2xl">
                <div className="p-10 text-center">
                  <Phone className="w-20 h-20 text-blue-400 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-white mb-6">Real-Time Call Analysis</h2>
                  <p className="text-slate-400 mb-8">Predict churn from ongoing call</p>
                  {errorMsg && <div className="mb-6 p-4 bg-red-900/30 border border-red-600 rounded-lg text-red-300">{errorMsg}</div>}
                  {result && (
                    <div className="mb-8 p-6 bg-slate-900/50 rounded-xl border border-slate-600">
                      <p className="text-2xl font-bold text-white">
                        {result.prediction === 1 ? "High Risk Detected" : "Customer Calm"}
                      </p>
                      <p className="text-lg text-slate-300">Probability: {(result.probability * 100).toFixed(1)}%</p>
                    </div>
                  )}
                  <Button onClick={handlePredictFromCallSession} disabled={sessionPredictLoading} className="bg-gradient-to-r from-blue-600 to-cyan-600 text-xl px-12 py-6">
                    {sessionPredictLoading ? "Analyzing..." : "Analyze Current Call"}
                  </Button>
                </div>
              </Card>
            )}

            {/* HISTORY */}
            {activeSection === "history" && (
              <Card className="bg-slate-800/70 border-slate-700 backdrop-blur-xl shadow-2xl">
                <div className="p-10">
                  <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                    <History className="w-8 h-8" /> Prediction History
                  </h2>
                  {predictions.length === 0 ? (
                    <p className="text-slate-400 text-center py-10">No predictions yet</p>
                  ) : (
                    <div className="space-y-4">
                      {predictions.map((p) => (
                        <div key={p.id} className="bg-slate-900/50 rounded-xl p-6 flex justify-between items-center border border-slate-700">
                          <div>
                            <p className="text-white font-medium">ID: {p.id}</p>
                            <p className="text-sm text-slate-400">
                              {new Date(p.created_at).toLocaleString("en-US", { timeZone: "Africa/Dakar" })}
                            </p>
                            <p className={`text-lg font-bold ${p.prediction === 1 ? "text-red-400" : "text-blue-400"}`}>
                              {p.prediction === 1 ? "Churn" : "Loyal"} • {(p.probability * 100).toFixed(1)}%
                            </p>
                          </div>
                          <button onClick={() => deletePrediction(p.id)} className="text-red-400 hover:text-red-300">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            )}

            {activeSection === "feedback" && <CreateFeedback />}
            {activeSection === "model" && <CreateModel />}

          </div>
        </div>
      </div>
    </div>
  );
}