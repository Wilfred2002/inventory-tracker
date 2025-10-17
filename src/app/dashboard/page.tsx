"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FolderOpen, Package, AlertTriangle, Database, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<any>({
    totalRooms: 0,
    totalCategories: 0,
    totalItems: 0,
    lowStockItems: 0,
    itemsByRoom: [],
    stockLevels: { outOfStock: 0, lowStock: 0, normalStock: 0 },
    quantityByCategory: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Failed to load stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's an overview of your inventory.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRooms}</div>
            <p className="text-xs text-muted-foreground">
              Storage locations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground">
              Item categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">
              In inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {stats.lowStockItems}
            </div>
            <p className="text-xs text-muted-foreground">
              Items need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      {!isLoading && stats.totalItems > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Items by Room Chart */}
          {stats.itemsByRoom.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Items by Room</CardTitle>
                <CardDescription>Distribution of items across rooms</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.itemsByRoom}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Stock Levels Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Status</CardTitle>
              <CardDescription>Current stock level distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Out of Stock", value: stats.stockLevels.outOfStock, color: "#ef4444" },
                      { name: "Low Stock", value: stats.stockLevels.lowStock, color: "#f97316" },
                      { name: "Normal Stock", value: stats.stockLevels.normalStock, color: "#22c55e" },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) =>
                      percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ""
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: "Out of Stock", value: stats.stockLevels.outOfStock, color: "#ef4444" },
                      { name: "Low Stock", value: stats.stockLevels.lowStock, color: "#f97316" },
                      { name: "Normal Stock", value: stats.stockLevels.normalStock, color: "#22c55e" },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Categories by Quantity */}
          {stats.quantityByCategory.length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Top Categories by Quantity</CardTitle>
                <CardDescription>Categories with the most items in stock</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.quantityByCategory} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="name" type="category" width={150} className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                    <Bar dataKey="quantity" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Loading...</p>
            </div>
          ) : stats.totalRooms === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="mb-4 text-muted-foreground">You haven't created any rooms yet.</p>
              <p className="text-sm text-muted-foreground mb-6">
                Get started by creating your first storage room to organize your inventory.
              </p>
              <Button onClick={() => router.push("/dashboard/rooms")}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Room
              </Button>
            </div>
          ) : stats.totalItems === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="mb-4 text-muted-foreground">You have rooms but no items yet.</p>
              <p className="text-sm text-muted-foreground mb-6">
                Start tracking your inventory by adding items to your rooms.
              </p>
              <Button onClick={() => router.push("/dashboard/items")}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Item
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col items-center gap-2"
                onClick={() => router.push("/dashboard/rooms")}
              >
                <FolderOpen className="h-6 w-6 text-green" />
                <span className="font-semibold">Manage Rooms</span>
                <span className="text-xs text-muted-foreground">
                  Organize storage locations
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col items-center gap-2"
                onClick={() => router.push("/dashboard/items")}
              >
                <Package className="h-6 w-6 text-green" />
                <span className="font-semibold">Manage Items</span>
                <span className="text-xs text-muted-foreground">
                  Track inventory levels
                </span>
              </Button>
              {stats.lowStockItems > 0 && (
                <Button
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center gap-2 border-orange-500/50 hover:border-orange-500"
                  onClick={() => router.push("/dashboard/items")}
                >
                  <AlertTriangle className="h-6 w-6 text-orange-500" />
                  <span className="font-semibold">Low Stock Alert</span>
                  <span className="text-xs text-muted-foreground">
                    {stats.lowStockItems} item{stats.lowStockItems > 1 ? "s" : ""} need attention
                  </span>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
