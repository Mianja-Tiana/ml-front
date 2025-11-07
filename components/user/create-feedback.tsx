"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CreateFeedback() {
  const [formData, setFormData] = useState({
    prediction_id: "",
    correct: true,
    comment: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("You must be logged in to submit feedback")
      }

     
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
      if (!BACKEND_URL) {
        throw new Error("Backend URL is not configured. Check .env.local")
      }

      const res = await fetch(`${BACKEND_URL}/api/feedback/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prediction_id: Number.parseInt(formData.prediction_id),
          correct: formData.correct,
          comment: formData.comment,
        }),
      })

      if (!res.ok) {
        let errorMessage = "Failed to submit feedback"
        try {
          const errorData = await res.json()
          errorMessage = errorData.detail || errorMessage
        } catch {
          // Ignore JSON parse error
        }
        throw new Error(errorMessage)
      }

      setSuccess(true)
      setFormData({ prediction_id: "", correct: true, comment: "" })
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="glass border-white/20 p-8 max-w-2xl">
      <h2 className="text-2xl font-bold mb-2 gradient-text">Submit Feedback</h2>
      <p className="text-muted-foreground mb-6">
        Help us improve by sharing your feedback on predictions
      </p>

      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
          Feedback submitted successfully!
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Prediction ID
          </label>
          <input
            type="number"
            required
            className="w-full px-4 py-3 bg-background/50 border border-white/10 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
            placeholder="Enter prediction ID"
            value={formData.prediction_id}
            onChange={(e) =>
              setFormData({ ...formData, prediction_id: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Was the prediction correct?
          </label>
          <div className="flex gap-4">
            {[true, false].map((value) => (
              <label
                key={String(value)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="correct"
                  checked={formData.correct === value}
                  onChange={() => setFormData({ ...formData, correct: value })}
                  className="w-4 h-4"
                />
                <span className="text-foreground font-medium">
                  {value ? "Yes" : "No"}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Comment
          </label>
          <textarea
            className="w-full px-4 py-3 bg-background/50 border border-white/10 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
            placeholder="Share your thoughts..."
            rows={4}
            value={formData.comment}
            onChange={(e) =>
              setFormData({ ...formData, comment: e.target.value })
            }
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </Button>
      </form>
    </Card>
  )
}