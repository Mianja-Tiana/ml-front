"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Loader2, Clock, Globe, Terminal, User, Hash } from "lucide-react"

interface Log {
  id: number
  prediction_id: number
  user_id: string
  request_ip: string
  user_agent: string
  timestamp: string
}

export default function LogsList() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const apiUrl = "https://api.telcopredict.live"

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("You are not logged in")
          setLoading(false)
          return
        }

        const res = await fetch(`${apiUrl}/api/logs/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) {
          if (res.status === 401) throw new Error("Invalid or expired token")
          if (res.status === 403) throw new Error("Access denied")
          throw new Error("Failed to load logs")
        }

        const data = await res.json()
        setLogs(data)
      } catch (err: any) {
        setError(err.message)
        console.error("LogsList error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  // Format date nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
        <span className="ml-4 text-xl text-slate-300">Loading logs...</span>
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

  if (logs.length === 0) {
    return (
      <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-sm">
        <div className="p-12 text-center">
          <Terminal className="w-16 h-16 mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400 text-lg">No logs available</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Terminal className="w-8 h-8 text-blue-400" />
        <h2 className="text-3xl font-bold text-white">Activity Logs</h2>
        <span className="text-lg text-slate-400 bg-slate-800/60 px-4 py-2 rounded-full backdrop-blur-sm">
          {logs.length} entr{logs.length > 1 ? "ies" : "y"}
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
                    <Hash className="inline w-4 h-4 mr-2" />ID
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-blue-300 uppercase tracking-wider">
                    <User className="inline w-4 h-4 mr-2" />User ID
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-blue-300 uppercase tracking-wider">
                    Prediction ID
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-blue-300 uppercase tracking-wider">
                    <Globe className="inline w-4 h-4 mr-2" />IP
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-blue-300 uppercase tracking-wider">
                    <Clock className="inline w-4 h-4 mr-2" />Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-blue-900/20 transition-all duration-200 group"
                  >
                    <td className="px-6 py-5 font-medium text-white">{log.id}</td>
                    <td className="px-6 py-5 text-slate-300 font-mono text-sm">
                      {log.user_id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-5 text-cyan-300 font-semibold">
                      #{log.prediction_id}
                    </td>
                    <td className="px-6 py-5 text-slate-400 font-mono text-sm">
                      {log.request_ip}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-400">
                      {formatDate(log.timestamp)}
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
        {logs.map((log) => (
          <Card
            key={log.id}
            className="bg-slate-900/60 border border-slate-700/70 backdrop-blur-xl shadow-lg hover:shadow-xl hover:shadow-blue-900/20 transition-all duration-300"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <Hash className="w-5 h-5 text-blue-400" />
                  <span className="font-bold text-white">Log #{log.id}</span>
                </div>
                <span className="text-xs text-cyan-300 bg-cyan-900/30 px-2 py-1 rounded">
                  #{log.prediction_id}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-300 font-mono">
                    {log.user_id.slice(0, 12)}...
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400 font-mono">{log.request_ip}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">{formatDate(log.timestamp)}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}