"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

interface Feedback {
  id: number
  prediction_id: number
  user_id: number
  correct: boolean
  comment: string
}

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = localStorage.getItem("token")
        // need a url backend
        const res = await fetch("BACKEND_URL/api/feedback/", { 
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          setFeedbacks(await res.json())
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchFeedback()
  }, [])

  if (loading) return <div className="text-muted-foreground">Loading feedback...</div>

  return (
    <div className="space-y-4">
      <Card className="glass border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-primary/5">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Prediction</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Correct</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Comment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {feedbacks.map((fb) => (
                <tr key={fb.id} className="hover:bg-primary/5 transition">
                  <td className="px-6 py-4 text-foreground">{fb.id}</td>
                  <td className="px-6 py-4 text-foreground">{fb.prediction_id}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        fb.correct ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {fb.correct ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground truncate max-w-xs">{fb.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
