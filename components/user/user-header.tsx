"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function UserHeader() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/auth/login")
  }

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">User Dashboard</h1>
          <p className="text-muted-foreground">Manage your ML predictions & feedback</p>
        </div>
        <Button onClick={handleLogout} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
          Logout
        </Button>
      </div>
    </header>
  )
}
