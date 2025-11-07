"use client"

import { useState, useEffect } from "react"
import UserHeader from "@/components/user/user-header"
import UserProfile from "@/components/user/user-profile"
import CreateFeedback from "@/components/user/create-feedback"
import CreateModel from "@/components/user/create-model"

type TabType = "profile" | "feedback" | "model"

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("profile")
  const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   const token = localStorage.getItem("token")
  //   if (!token) {
  //     window.location.href = "/auth/login"
  //   } else {
  //     setLoading(false)
  //   }
  // }, [])
  useEffect(() => {
  setLoading(false)
}, [])
  if (loading) return null

  return (
    <div className="min-h-screen bg-background">
      <UserHeader />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border">
          {[
            { id: "profile", label: "My Profile" },
            { id: "feedback", label: "Submit Feedback" },
            { id: "model", label: "Create Model" },
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
          {activeTab === "profile" && <UserProfile />}
          {activeTab === "feedback" && <CreateFeedback />}
          {activeTab === "model" && <CreateModel />}
        </div>
      </div>
    </div>
  )
}
