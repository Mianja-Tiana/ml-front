"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, MessageSquare, Send, Loader2 } from "lucide-react";

interface FeedbackResponse {
  id: number;
  prediction_id: number;
  user_id: number;
  correct: boolean;
  comment: string;
  created_at: string;
}

export default function SubmitFeedback() {
  const [predictionId, setPredictionId] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    if (!predictionId || isCorrect === null) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in.");

      const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.telcopredict.live";

      const res = await fetch(`${BACKEND_URL}/api/feedback/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prediction_id: Number(predictionId),
          correct: isCorrect,
          comment: comment.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to submit feedback");
      }

      const data: FeedbackResponse = await res.json();
      setSuccess(true);
      setPredictionId("");
      setIsCorrect(null);
      setComment("");
      
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
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
              <MessageSquare className="w-9 h-9 text-cyan-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">Submit Feedback</h2>
            <p className="text-slate-400 mt-2">Help us improve predictions</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-5 bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-xl border border-green-700/60 shadow-lg shadow-green-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500 rounded-full blur-xl animate-ping opacity-70"></div>
                    <div className="relative p-3 bg-green-600 rounded-full">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-green-300 text-sm">Thank you!</p>
                    <p className="text-2xl font-bold text-white">Feedback submitted</p>
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
            {/* Prediction ID */}
            <div>
              <label className="flex items-center gap-3 text-slate-300 text-sm font-medium mb-3">
                Prediction ID
              </label>
              <input
                type="number"
                required
                min="1"
                value={predictionId}
                onChange={(e) => setPredictionId(e.target.value)}
                className="w-full px-5 py-4 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                placeholder="Enter prediction ID..."
              />
            </div>

            {/* Was it correct? */}
            <div>
              <p className="text-slate-300 text-sm font-medium mb-4">Was the prediction correct?</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setIsCorrect(true)}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${
                    isCorrect === true
                      ? "border-green-500 bg-green-900/30 shadow-lg shadow-green-500/20"
                      : "border-slate-700 bg-slate-800/50 hover:border-green-500/50"
                  }`}
                >
                  <CheckCircle2 className={`w-10 h-10 ${isCorrect === true ? "text-green-400" : "text-slate-500"}`} />
                  <span className="font-semibold text-white">Yes, correct</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCorrect(false)}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${
                    isCorrect === false
                      ? "border-red-500 bg-red-900/30 shadow-lg shadow-red-500/20"
                      : "border-slate-700 bg-slate-800/50 hover:border-red-500/50"
                  }`}
                >
                  <XCircle className={`w-10 h-10 ${isCorrect === false ? "text-red-400" : "text-slate-500"}`} />
                  <span className="font-semibold text-white">No, incorrect</span>
                </button>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="flex items-center gap-3 text-slate-300 text-sm font-medium mb-3">
                Additional Comment (optional)
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-5 py-4 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition resize-none"
                placeholder="Share more details (optional)..."
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !predictionId || isCorrect === null}
              className="w-full py-6 text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  Submit Feedback
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-700 text-center">
            <p className="text-slate-500 text-xs flex items-center justify-center gap-2">
              Your feedback helps improve our models
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}