"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

interface MLModel {
  id: number
  name: string
  version: string
  description: string
}

export default function ModelsList() {
  const [models, setModels] = useState<MLModel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const token = localStorage.getItem("token")
        // need a url backend
        const res = await fetch("BACKEND_URL/api/models/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          setModels(await res.json())
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchModels()
  }, [])

  if (loading) return <div className="text-muted-foreground">Loading models...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {models.map((model) => (
        <Card key={model.id} className="glass border-white/20 p-6">
          <h3 className="text-lg font-bold text-primary mb-2">{model.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">v{model.version}</p>
          <p className="text-foreground">{model.description}</p>
        </Card>
      ))}
    </div>
  )
}
