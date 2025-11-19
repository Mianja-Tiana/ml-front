"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Loader2, MessageSquare, CheckCircle, XCircle, User, Calendar } from "lucide-react"

interface Feedback {
  id: number
  prediction_id: number
  user_id: string
  correct: boolean
  comment: string
  created_at: string
}

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const apiUrl = "https://api.telcopredict.live"

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("You are not logged in")
          setLoading(false)
          return
        }

        const res = await fetch(`${apiUrl}/api/feedback/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) {
          if (res.status === 401) throw new Error("Invalid or expired token")
          if (res.status === 403) throw new Error("Access denied")
          throw new Error("Failed to load feedback")
        }

        const data = await res.json()
        setFeedbacks(data)
      } catch (err: any) {
        setError(err.message)
        console.error("FeedbackList error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeedback()
  }, [])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
        <span className="ml-4 text-xl text-slate-300">Loading feedback...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-red-900/20 border-red-700/30 backdrop-blur-sm">
        <div className="p-8 text-center">
          <p className="text-red-300 font-semibold text-lg">{error}</p>
        </div>
      </Card>
    )
  }

  if (feedbacks.length === 0) {
    return (
      <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-sm">
        <div className="p-12 text-center">
          <MessageSquare className="w-16 h-16 mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400 text-lg">No feedback received yet</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <MessageSquare className="w-8 h-8 text-blue-400" />
        <h2 className="text-3xl font-bold text-white">User Feedback</h2>
        <span className="text-lg text-slate-400 bg-slate-800/60 px-4 py-2 rounded-full backdrop-blur-sm">
          {feedbacks.length} response{feedbacks.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* === DESKTOP: Table === */}
      <div className="hidden md:block">
        <Card className="bg-slate-900/50 border border-slate-700/60 backdrop-blur-xl shadow-2xl shadow-blue-900/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-800/50 to-blue-900/30 border-b border-slate-700/60">
                <tr>
                  <th className="px-6 py-5 text-left text-sm font-bold text-blue-300 uppercase tracking-wider">
                    Feedback ID
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-blue-300 uppercase tracking-wider">
                    <User className="inline w-4 h-4 mr-2" />
                    User
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-blue-300 uppercase tracking-wider">
                    Prediction
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-blue-300 uppercase tracking-wider">
                    Accuracy
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-blue-300 uppercase tracking-wider">
                    Comment
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-blue-300 uppercase tracking-wider">
                    <Calendar className="inline w-4 h-4 mr-2" />
                    Received
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {feedbacks.map((fb) => (
                  <tr
                    key={fb.id}
                    className="hover:bg-blue-900/20 transition-all duration-200 group"
                  >
                    <td className="px-6 py-5 font-medium text-white">#{fb.id}</td>
                    <td className="px-6 py-5 text-slate-300 font-mono text-sm">
                      {fb.user_id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-5 text-cyan-300 font-semibold">
                      #{fb.prediction_id}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
                          fb.correct
                            ? "bg-green-900/40 text-green-400 border border-green-700/50"
                            : "bg-red-900/40 text-red-400 border border-red-700/50"
                        }`}
                      >
                        {fb.correct ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Correct
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            Incorrect
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-slate-300 max-w-md truncate">
                      {fb.comment || <span className="text-slate-500 italic">No comment</span>}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-400">
                      {formatDate(fb.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* === MOBILE: Cards === */}
      <div className="md:hidden space-y-4">
        {feedbacks.map((fb) => (
          <Card
            key={fb.id}
            className="bg-slate-900/60 border border-slate-700/70 backdrop-blur-xl shadow-lg hover:shadow-xl hover:shadow-blue-900/20 transition-all duration-300"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  <span className="font-bold text-white">Feedback #{fb.id}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    fb.correct
                      ? "bg-green-900/50 text-green-400"
                      : "bg-red-900/50 text-red-400"
                  }`}
                >
                  {fb.correct ? "Correct" : "Incorrect"}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-300 font-mono">
                    {fb.user_id.slice(0, 12)}...
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-cyan-300 font-semibold">Prediction #{fb.prediction_id}</span>
                </div>

                {fb.comment ? (
                  <div className="bg-slate-800/50 border border-slate-700/60 rounded-lg p-3">
                    <p className="text-slate-300 text-sm leading-relaxed">"{fb.comment}"</p>
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No comment provided</p>
                )}

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(fb.created_at)}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}