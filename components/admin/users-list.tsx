"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Loader2, Users, Calendar, UserCheck, Crown, Shield } from "lucide-react"

interface User {
  id: string
  username: string
  full_name: string | null
  role: string
  created_at: string
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const apiUrl = "https://api.telcopredict.live"

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("You are not logged in")
          setLoading(false)
          return
        }

        const res = await fetch(`${apiUrl}/api/users/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) {
          if (res.status === 401) throw new Error("Invalid or expired token")
          if (res.status === 403) throw new Error("Access denied (admin required)")
          throw new Error("Failed to load users")
        }

        const data = await res.json()
        setUsers(data)
      } catch (err: any) {
        setError(err.message)
        console.error("UsersList error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) + " • " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
        <p className="text-blue-300 font-medium">Loading users...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        <div className="p-10 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <Shield className="w-7 h-7 text-red-400" />
          </div>
          <p className="text-red-300 font-medium text-lg">{error}</p>
        </div>
      </Card>
    )
  }

  if (users.length === 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        <div className="p-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
            <Users className="w-10 h-10 text-blue-300" />
          </div>
          <p className="text-white text-xl font-medium">No users found</p>
          <p className="text-blue-300 text-sm mt-2">Start inviting members.</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur border border-white/20">
            <UserCheck className="w-6 h-6 text-blue-300" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Users Directory</h2>
            <p className="text-blue-300 text-sm">All platform members</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20">
          <Users className="w-4 h-4 text-blue-300" />
          <span className="text-blue-200 text-sm font-medium">
            {users.length} user{users.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Table Card - Glassmorphism sur fond bleu nuit */}
      <Card className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className="group hover:bg-white/5 transition-all duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white group-hover:text-blue-200 transition-colors">
                          {user.username}
                        </p>
                        <p className="text-xs text-blue-400">ID: {user.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-blue-100">
                    {user.full_name || (
                      <span className="text-blue-400 italic text-sm">—</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      {user.role === "admin" ? (
                        <>
                          <Crown className="w-3.5 h-3.5 text-yellow-400" />
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-600/50">
                            ADMIN
                          </span>
                        </>
                      ) : (
                        <>
                          <Shield className="w-3.5 h-3.5 text-blue-400" />
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-600/50">
                            USER
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm text-blue-200 font-medium">
                      {formatDate(user.created_at)}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-white/5">
          <p className="text-xs text-blue-300 text-center">
            Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </Card>
    </div>
  )
}