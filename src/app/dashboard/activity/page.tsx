"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { History, Package, FolderOpen, Database, User, TrendingUp, TrendingDown, Plus, Edit, Trash2 } from "lucide-react"
import toast from "react-hot-toast"

interface ActivityLog {
  id: string
  action: string
  entityType: string
  entityId: string
  entityName: string
  changes: any
  createdAt: string
  user: {
    name: string | null
    email: string
  }
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterAction, setFilterAction] = useState<string>("all")
  const [filterEntity, setFilterEntity] = useState<string>("all")

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      const response = await fetch("/api/activity", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setActivities(data.activities)
      }
    } catch (error) {
      toast.error("Failed to load activity log")
    } finally {
      setIsLoading(false)
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "quantity_adjusted":
        return <TrendingUp className="h-4 w-4" />
      case "created":
        return <Plus className="h-4 w-4" />
      case "updated":
        return <Edit className="h-4 w-4" />
      case "deleted":
        return <Trash2 className="h-4 w-4" />
      default:
        return <History className="h-4 w-4" />
    }
  }

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case "item":
        return <Package className="h-4 w-4 text-blue-500" />
      case "room":
        return <FolderOpen className="h-4 w-4 text-green-500" />
      case "category":
        return <Database className="h-4 w-4 text-purple-500" />
      case "user":
        return <User className="h-4 w-4 text-orange-500" />
      default:
        return <History className="h-4 w-4" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "created":
        return "text-green-600"
      case "updated":
        return "text-blue-600"
      case "deleted":
        return "text-red-600"
      case "quantity_adjusted":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

  const formatAction = (action: string) => {
    return action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const formatChanges = (action: string, changes: any) => {
    if (!changes) return null

    if (action === "quantity_adjusted") {
      const { from, to, adjustment } = changes
      return (
        <span className="text-sm text-muted-foreground">
          {from} → {to}{" "}
          <span className={adjustment > 0 ? "text-green-600" : "text-red-600"}>
            ({adjustment > 0 ? "+" : ""}
            {adjustment})
          </span>
        </span>
      )
    }

    if (action === "updated") {
      const fields = Object.keys(changes)
      if (fields.length === 0) return null

      return (
        <div className="text-sm text-muted-foreground space-y-1">
          {fields.map((field) => (
            <div key={field}>
              <span className="font-medium capitalize">{field}:</span>{" "}
              <span className="line-through">{String(changes[field].from || "empty")}</span> →{" "}
              <span className="text-foreground">{String(changes[field].to || "empty")}</span>
            </div>
          ))}
        </div>
      )
    }

    if (action === "deleted") {
      const deletedData = changes.deletedItem || changes.deletedRoom || changes.deletedCategory
      if (!deletedData) return null

      return (
        <div className="text-sm text-muted-foreground">
          <span className="italic">Deleted: {deletedData.name}</span>
          {deletedData.quantity !== undefined && (
            <span> (Quantity: {deletedData.quantity})</span>
          )}
        </div>
      )
    }

    return null
  }

  const filteredActivities = activities.filter((activity) => {
    const matchesAction = filterAction === "all" || activity.action === filterAction
    const matchesEntity = filterEntity === "all" || activity.entityType === filterEntity
    return matchesAction && matchesEntity
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Activity Log</h1>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Activity Log</h1>
        <p className="text-muted-foreground mt-2">
          Track all changes and actions in your inventory
        </p>
      </div>

      {/* Filters */}
      {activities.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Filter by Action</Label>
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="All actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All actions</SelectItem>
                    <SelectItem value="created">Created</SelectItem>
                    <SelectItem value="updated">Updated</SelectItem>
                    <SelectItem value="deleted">Deleted</SelectItem>
                    <SelectItem value="quantity_adjusted">Quantity Adjusted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Filter by Type</Label>
                <Select value={filterEntity} onValueChange={setFilterEntity}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="item">Items</SelectItem>
                    <SelectItem value="room">Rooms</SelectItem>
                    <SelectItem value="category">Categories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity List */}
      {filteredActivities.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <History className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No activity yet</h3>
              <p className="text-muted-foreground">
                Activity will appear here as you make changes
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="mt-1">{getEntityIcon(activity.entityType)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${getActionColor(activity.action)}`}>
                        {formatAction(activity.action)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {activity.entityType}
                      </span>
                    </div>
                    <p className="text-sm">
                      <span className="font-medium">{activity.entityName}</span>
                    </p>
                    {formatChanges(activity.action, activity.changes)}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                      <span>{activity.user.name || activity.user.email}</span>
                      <span>•</span>
                      <span>
                        {new Date(activity.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
