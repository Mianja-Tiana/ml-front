"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

interface Log {
  id: number
  user_id: number
  model_id: number
  input_data: string
  output: string
  timestamp: string
}

export default function LogsList() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // need a url backend
        const token = localStorage.getItem("token")
        const res = await fetch("BACKEND_URL/api/logs/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          setLogs(await res.json())
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  if (loading) return <div className="text-muted-foreground">Loading logs...</div>

  return (
    <div className="space-y-4">
      <Card className="glass border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-primary/5">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">User</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Model</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Output</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-primary/5 transition">
                  <td className="px-6 py-4 text-foreground">{log.id}</td>
                  <td className="px-6 py-4 text-foreground">{log.user_id}</td>
                  <td className="px-6 py-4 text-foreground">{log.model_id}</td>
                  <td className="px-6 py-4 text-muted-foreground">{log.output}</td>
                  <td className="px-6 py-4 text-muted-foreground text-sm">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
