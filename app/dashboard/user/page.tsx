"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, User, MessageSquare, History, Trash2, Phone, Info, LogOut } from "lucide-react";
import CreateFeedback from "@/components/user/create-feedback";

export default function UserDashboard() {
  const router = useRouter();
  const apiUrl = "https://api.telcopredict.live";

  const [activeSection, setActiveSection] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [predictLoading, setPredictLoading] = useState(false);
  const [sessionPredictLoading, setSessionPredictLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    MonthlyRevenue: 0,
    MonthlyMinutes: 0,
    OverageMinutes: 0,
    UnansweredCalls: 0,
    CustomerCareCalls: 0,
    PercChangeMinutes: 0,
    PercChangeRevenues: 0,
    ReceivedCalls: 0,
    TotalRecurringCharge: 0,
    CurrentEquipmentDays: 0,
    DroppedBlockedCalls: 0,
    MonthsInService: 0,
    ActiveSubs: 0,
    RespondsToMailOffers: "No",
    RetentionCalls: 0,
    RetentionOffersAccepted: 0,
    MadeCallToRetentionTeam: "No",
    ReferralsMadeBySubscriber: 0,
    CreditRating: "Good",
    IncomeGroup: "",
    Occupation: "",
    PrizmCode: "",
    TotalCalls: 0
  });

  const columnDescriptions: Record<string, string> = {
    MonthlyRevenue: "Monthly revenue in dollars",
    MonthlyMinutes: "Total monthly minutes used",
    OverageMinutes: "Overage minutes used",
    UnansweredCalls: "Unanswered calls during the month",
    CustomerCareCalls: "Number of calls to customer care",
    PercChangeMinutes: "Percentage change in monthly minutes",
    PercChangeRevenues: "Percentage change in monthly revenue",
    ReceivedCalls: "Number of calls received",
    TotalRecurringCharge: "Total recurring charge",
    CurrentEquipmentDays: "Days current equipment has been in service",
    DroppedBlockedCalls: "Dropped or blocked calls",
    MonthsInService: "Total months in service",
    ActiveSubs: "Number of active subscriptions",
    RespondsToMailOffers: "Responds to mail offers? (Yes/No)",
    RetentionCalls: "Number of retention calls",
    RetentionOffersAccepted: "Retention offers accepted",
    MadeCallToRetentionTeam: "Made call to retention team? (Yes/No)",
    ReferralsMadeBySubscriber: "Refer and win",
    CreditRating: "Credit rating (Excellent/Good/Fair/Poor)",
    IncomeGroup: "Income group (enter any text, e.g., Low, Medium, High, etc.)",
    Occupation: "Occupation category (free text)",
    PrizmCode: "PRIZM code (geodemographic segmentation, free text)",
    TotalCalls: "Total calls made"
  };

  const dropdownFields = {
    RespondsToMailOffers: ["No", "Yes"],
    MadeCallToRetentionTeam: ["No", "Yes"],
    CreditRating: ["Excellent", "Good", "Fair", "Poor"]
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    const fetchData = async () => {
      try {
        const userRes = await fetch(`${apiUrl}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        if (!userRes.ok) throw new Error("Unauthorized");
        const userData = await userRes.json();
        if (userData.role === "admin") {
          router.replace("/dashboard/admin");
          return;
        }
        setUser(userData);

        const predRes = await fetch(`${apiUrl}/predict/predictions/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (predRes.ok) {
          const preds = await predRes.json();
          setPredictions(Array.isArray(preds) ? preds : []);
        }
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
      const res = await fetch(`${apiUrl}/predict/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setResult(data);
        const predRes = await fetch(`${apiUrl}/predict/predictions/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (predRes.ok) {
          const preds = await predRes.json();
          setPredictions(Array.isArray(preds) ? preds : []);
        }
      } else {
        setErrorMsg(data.detail?.[0]?.msg || data.detail || "Prediction failed");
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
      const res = await fetch(`${apiUrl}/predict/from-call`, {
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

  const deletePrediction = async (id: string) => {
    if (!confirm("Delete this prediction?")) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${apiUrl}/predict/predictions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const predRes = await fetch(`${apiUrl}/predict/predictions/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (predRes.ok) {
          const preds = await predRes.json();
          setPredictions(Array.isArray(preds) ? preds : []);
        }
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
          <p className="text-xl text-slate-300">Loading dashboard...</p>
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
  ];

  return (
    <div className="min-h-screen flex bg-slate-900">
      {/* === SIDEBAR === */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
            <User className="w-6 h-6" />
            ChurnPredict
          </h1>
          <p className="text-xs text-slate-400 mt-1">User Portal</p>
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

        <div className="p-4 border-t border-slate-700 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
            {user.username[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-300 font-medium">{user.username}</p>
            <p className="text-xs text-slate-500">User</p>
          </div>
          <button
            onClick={logout}
            className="text-red-400 hover:text-red-300 transition"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* === MAIN CONTENT === */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">

            {/* === PROFILE === */}
            {activeSection === "profile" && (
              <Card className="bg-slate-800/70 border-slate-700 backdrop-blur-xl shadow-2xl max-w-3xl mx-auto">
                <div className="p-10">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-5xl font-bold text-white shadow-xl">
                      {user.username[0].toUpperCase()}
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-white">Welcome back,</h1>
                      <p className="text-2xl text-blue-400">{user.username}</p>
                      <p className="text-slate-400">Personal Account</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-10">
                    <Card className="bg-slate-900/50 border-slate-700 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
                      <div className="space-y-3 text-sm">
                        <p className="text-slate-300"><span className="text-slate-400">Username:</span> {user.username}</p>
                        <p className="text-slate-300"><span className="text-slate-400">Email:</span> {user.email}</p>
                        <p className="text-slate-300"><span className="text-slate-400">Role:</span> User</p>
                      </div>
                    </Card>

                    <Card className="bg-slate-900/50 border-slate-700 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        <Button
                          onClick={() => setActiveSection("predict")}
                          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium"
                        >
                          Predict Churn
                        </Button>
                        <Button
                          onClick={() => setActiveSection("feedback")}
                          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium"
                        >
                          Submit Feedback
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              </Card>
            )}

            {/* === MANUAL PREDICTION === */}
            {activeSection === "predict" && (
              <Card className="bg-slate-800/70 border-slate-700 backdrop-blur-xl shadow-2xl">
                <div className="p-10">
                  <h2 className="text-3xl font-bold text-white mb-8">Predict Churn</h2>
                  {errorMsg && <div className="mb-6 p-4 bg-red-900/30 border border-red-600 rounded-lg text-red-300">{errorMsg}</div>}
                  {result && (
                    <div className="mb-8 p-6 bg-slate-900/50 rounded-xl border border-slate-600">
                      <p className="text-2xl font-bold text-white">
                        {result.prediction === 1 ? "Churn Probable" : "Loyal Customer"}
                      </p>
                      <p className="text-lg text-slate-300">Probability: {(result.probability * 100).toFixed(1)}%</p>
                    </div>
                  )}
                  <form onSubmit={handlePredict} className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {Object.keys(form).map((key) => {
                      const isDropdown = key in dropdownFields;
                      const isFreeText = key === "Occupation" || key === "PrizmCode" || key === "IncomeGroup";

                      return (
                        <div key={key} className="relative group">
                          <Label className="text-slate-300 text-sm flex items-center gap-1">
                            {key}
                            <Info className="w-3 h-3 text-slate-500" />
                          </Label>

                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-slate-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            {columnDescriptions[key]}
                          </div>

                          {isDropdown ? (
                            <Select
                              value={form[key as keyof typeof form] as string}
                              onValueChange={(value) => setForm({ ...form, [key]: value })}
                            >
                              <SelectTrigger className="mt-1 bg-slate-900/50 border-slate-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {dropdownFields[key as keyof typeof dropdownFields].map((opt) => (
                                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : isFreeText ? (
                            <Input
                              type="text"
                              value={form[key as keyof typeof form]}
                              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                              className="mt-1 bg-slate-900/50 border-slate-600 text-white"
                              placeholder={`Enter ${key}`}
                            />
                          ) : (
                            <Input
                              type="number"
                              step="any"
                              value={form[key as keyof typeof form]}
                              onChange={(e) => setForm({ ...form, [key]: parseFloat(e.target.value) || 0 })}
                              className="mt-1 bg-slate-900/50 border-slate-600 text-white"
                            />
                          )}
                        </div>
                      );
                    })}
                    <div className="col-span-full">
                      <Button type="submit" disabled={predictLoading} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-6 rounded-xl">
                        {predictLoading ? "Predicting..." : "Predict"}
                      </Button>
                    </div>
                  </form>
                </div>
              </Card>
            )}

            {/* === FROM CALL SESSION === */}
            {activeSection === "session" && (
              <Card className="bg-slate-800/70 border-slate-700 backdrop-blur-xl shadow-2xl max-w-2xl mx-auto">
                <div className="p-12 text-center">
                  <Phone className="w-20 h-20 text-blue-400 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-white mb-4">Predict from Active Call</h2>
                  <p className="text-slate-300 mb-8">Analyze current call session in real-time</p>
                  <Button
                    onClick={handlePredictFromCallSession}
                    disabled={sessionPredictLoading}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-xl px-12 py-6 rounded-xl"
                  >
                    {sessionPredictLoading ? "Analyzing..." : "Start Prediction"}
                  </Button>
                  {result && (
                    <div className="mt-8 p-6 bg-slate-900/50 rounded-xl border border-slate-600">
                      <p className="text-2xl font-bold text-white">
                        {result.prediction === 1 ? "High Risk" : "Loyal"}
                      </p>
                      <p className="text-lg text-slate-300">Probability: {(result.probability * 100).toFixed(1)}%</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* === HISTORY === */}
            {activeSection === "history" && (
              <Card className="bg-slate-800/70 border-slate-700 backdrop-blur-xl shadow-2xl">
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-white mb-6">Prediction History</h2>
                  {predictions.length === 0 ? (
                    <p className="text-slate-400 text-center py-12">No predictions yet</p>
                  ) : (
                    <div className="space-y-4">
                      {predictions.map((pred) => {
                        const date = pred.created_at ? new Date(pred.created_at) : null;
                        const formattedDate = date && !isNaN(date.getTime()) 
                          ? date.toLocaleString("en-US", { timeZone: "Africa/Dakar" }) 
                          : "Unknown date";

                        return (
                          <div key={pred.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 flex justify-between items-center">
                            <div>
                              <p className="text-white font-medium">
                                ID: {pred.id} – {pred.prediction === 1 ? "High Risk" : "Loyal"} – {(pred.probability * 100).toFixed(1)}%
                              </p>
                              <p className="text-sm text-slate-400">{formattedDate}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deletePrediction(pred.id)}
                              className="text-red-400 hover:bg-red-900/30"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* === FEEDBACK === */}
            {activeSection === "feedback" && <CreateFeedback />}

          </div>
        </div>
      </div>
    </div>
  );
}