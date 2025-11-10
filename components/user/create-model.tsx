"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, Cpu, FileText, Send } from "lucide-react";

export default function CreateModel() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in to create a model");

      const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.telcopredict.live";

      const res = await fetch(`${BACKEND_URL}/api/models/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || errData.message || "Failed to create model");
      }

      setSuccess(true);
      setFormData({ name: "", description: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-slate-900/70 backdrop-blur-2xl border border-slate-700 shadow-2xl">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-800 to-blue-900 mb-4">
              <Cpu className="w-9 h-9 text-cyan-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">Create ML Model</h2>
            <p className="text-slate-400 mt-2">Register and deploy your machine learning model</p>
          </div>

          {/* Success Message - CLIGNOTE comme "Active" */}
          {success && (
            <div className="mb-6 p-6 bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-xl border border-green-700/60 shadow-lg shadow-green-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500 rounded-full blur-xl animate-ping opacity-70"></div>
                    <div className="relative p-3 bg-green-600 rounded-full">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-green-300 text-sm">Success!</p>
                    <p className="text-2xl font-bold text-white">Model created successfully</p>
                  </div>
                </div>
                <div className="w-5 h-5 bg-green-400 rounded-full animate-ping"></div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-5 bg-red-900/40 rounded-xl border border-red-700/60">
              <p className="text-red-300 text-center">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Model Name */}
            <div>
              <label className="flex items-center gap-3 text-slate-300 text-sm font-medium mb-3">
                Model Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-4 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                placeholder="e.g., Customer Churn Predictor v2"
              />
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-3 text-slate-300 text-sm font-medium mb-3">
                <FileText className="w-5 h-5" />
                Description
              </label>
              <textarea
                required
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-5 py-4 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition resize-none"
                placeholder="Describe your model's purpose, algorithm, and use case..."
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !formData.name || !formData.description}
              className="w-full py-6 text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Creating Model...
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  Create Model
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-700 text-center">
            <p className="text-slate-500 text-xs flex items-center justify-center gap-2">
              Your model will be reviewed and deployed within 24 hours
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}