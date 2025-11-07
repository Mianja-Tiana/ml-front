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

  // useEffect(() => {
  //   const token = localStorage.getItem("token")
  //   if (!token) {
  //     window.location.href = "/auth/login"
  //   } else {
  //     fetchProfile()
  //     setLoading(false)
  //   }
  // }, [])
  useEffect(() => {
  fetchProfile()
  setLoading(false)
}, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${apiUrl}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setProfile(await res.json())
      }
    } catch (err) {
      console.error(" Error fetching profile:", err)
    }
  }

  if (loading) return null

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
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
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "users" && <UsersList />}
          {activeTab === "feedback" && <FeedbackList />}
          {activeTab === "models" && <ModelsList />}
          {activeTab === "logs" && <LogsList />}
          {activeTab === "profile" && profile && <AdminProfileCard profile={profile} />}
        </div>
      </div>
    </div>
  )
}

function AdminProfileCard({ profile }: { profile: any }) {
  return (
    <Card className="glass p-6 border-white/20">
      <h2 className="text-2xl font-bold mb-4 gradient-text">Admin Profile</h2>
      <div className="space-y-4">
        <div>
          <p className="text-muted-foreground">Username</p>
          <p className="text-lg font-semibold text-foreground">{profile.username}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Email</p>
          <p className="text-lg font-semibold text-foreground">{profile.email}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Role</p>
          <p className="text-lg font-semibold text-primary capitalize">Admin</p>
        </div>
      </div>
    </Card>
  )
}
