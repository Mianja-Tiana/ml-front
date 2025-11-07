"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

interface UserData {
  id: number
  username: string
  email: string
  role: string
}

export default function UserProfile() {
  const [profile, setProfile] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No authentication token found. Please log in.")
        }

        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
        if (!BACKEND_URL) {
          throw new Error("Backend URL not configured. Check .env.local")
        }

        const res = await fetch(`${BACKEND_URL}/api/users/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.detail || "Failed to load profile")
        }

        const data: UserData = await res.json()
        setProfile(data)
      } catch (err) {
        console.error("Profile fetch error:", err)
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Loading profile...
      </div>
    )
  }

  if (error || !profile) {
    return (
      <Card className="glass border-destructive/30 p-6">
        <div className="text-destructive text-center">
          <p className="font-semibold">Failed to load profile</p>
          <p className="text-sm mt-1">{error || "Unknown error"}</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="glass border-white/20 p-6">
        <h2 className="text-2xl font-bold mb-6 gradient-text">Your Profile</h2>
        <div className="space-y-4">
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">Username</p>
            <p className="text-lg font-semibold text-foreground">{profile.username}</p>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">Email</p>
            <p className="text-lg font-semibold text-foreground">{profile.email}</p>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">Account Type</p>
            <p className="text-lg font-semibold text-primary capitalize">{profile.role}</p>
          </div>
        </div>
      </Card>

      <Card className="glass border-white/20 p-6">
        <h2 className="text-2xl font-bold mb-6 gradient-text">Account Info</h2>
        <div className="space-y-4 text-foreground">
          <div>
            <p className="text-muted-foreground mb-2">Member ID</p>
            <p className="font-mono text-sm bg-background/50 p-2 rounded border border-border">
              {profile.id}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-2">Status</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="font-semibold">Active</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}