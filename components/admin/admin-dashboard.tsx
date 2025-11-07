// components/admin/admin-dashboard.tsx
"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import AdminHeader from "@/components/admin/admin-header"
import UsersList from "@/components/admin/users-list"
import FeedbackList from "@/components/admin/feedback-list"
import ModelsList from "@/components/admin/models-list"
import LogsList from "@/components/admin/logs-list"

type TabType = "users" | "feedback" | "models" | "logs" | "profile"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("users")
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      window.location.href = "/auth/login"
      return
    }
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${apiUrl}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) setProfile(await res.json())
    } catch (err) {
      console.error("Error fetching profile:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-10 text-muted-foreground">Loading...</div>

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border">
          {[
            { id: "users", label: "Users" },
            { id: "feedback", label: "Feedback" },
            { id: "models", label: "ML Models" },
            { id: "logs", label: "Prediction Logs" },
            { id: "profile", label: "Profile" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === tab.id ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div>
          {activeTab === "users" && <UsersList />}
          {activeTab === "feedback" && <FeedbackList />}
          {activeTab === "models" && <ModelsList />}
          {activeTab === "logs" && <LogsList />}
          {activeTab === "profile" && profile && (
            <Card className="p-6 border border-border/40 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-4">Admin Profile</h2>
              <p><strong>Username:</strong> {profile.username}</p>
              <p><strong>Email:</strong> {profile.email}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
