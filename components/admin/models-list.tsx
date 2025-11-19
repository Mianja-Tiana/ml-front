"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Loader2, Package, CalendarDays, Tag } from "lucide-react"

interface MLModel {
  id: number
  name: string
  version: string
  description: string
  created_at: string
}

export default function ModelsList() {
  const [models, setModels] = useState<MLModel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const apiUrl = "https://api.telcopredict.live"

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("You are not logged in")
          setLoading(false)
          return
        }

        const res = await fetch(`${apiUrl}/api/models/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) {
          if (res.status === 401) throw new Error("Invalid or expired token")
          if (res.status === 403) throw new Error("Access denied")
          throw new Error("Failed to load models")
        }

        const data = await res.json()
        setModels(data)
      } catch (err: any) {
        setError(err.message)
        console.error("ModelsList error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchModels()
  }, [])

  // Format date safely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
        <span className="ml-4 text-xl text-slate-300">Loading models...</span>
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

  if (models.length === 0) {
    return (
      <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-sm">
        <div className="p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400 text-lg">No models available</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Package className="w-8 h-8 text-blue-400" />
        <h2 className="text-3xl font-bold text-white">Available Models</h2>
        <span className="text-lg text-slate-400 bg-slate-800/60 px-4 py-2 rounded-full backdrop-blur-sm">
          {models.length} model{models.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <Card
            key={model.id}
            className="bg-slate-900/50 border border-slate-700/60 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-300 hover:border-blue-700/40 group"
          >
            <div className="p-7">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition">
                  {model.name}
                </h3>
                <Tag className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition" />
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium text-slate-400">Version</span>
                <span className="px-3 py-1 bg-blue-900/30 text-blue-300 text-xs font-bold rounded-full border border-blue-700/40">
                  v{model.version}
                </span>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-6 line-clamp-3">
                {model.description || "No description provided."}
              </p>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CalendarDays className="w-4 h-4" />
                <span>Added on {formatDate(model.created_at)}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}