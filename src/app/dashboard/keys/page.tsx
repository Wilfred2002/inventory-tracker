"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Plus, Trash2, Key, Copy, Check, AlertTriangle } from "lucide-react"
import toast from "react-hot-toast"

interface ApiKey {
  id: string
  name: string
  isActive: boolean
  lastUsed: string | null
  createdAt: string
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [keyName, setKeyName] = useState("")
  const [newPlainKey, setNewPlainKey] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState(false)

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    try {
      const response = await fetch("/api/keys", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setApiKeys(data.apiKeys)
      }
    } catch (error) {
      toast.error("Failed to load API keys")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: keyName }),
      })

      if (response.ok) {
        const data = await response.json()
        setNewPlainKey(data.plainKey)
        setKeyName("")
        fetchApiKeys()
        toast.success("API key created successfully")
      } else {
        toast.error("Failed to create API key")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedKey) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/keys/${selectedKey.id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        toast.success("API key deleted successfully")
        setIsDeleteOpen(false)
        setSelectedKey(null)
        fetchApiKeys()
      } else {
        toast.error("Failed to delete API key")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const openDeleteDialog = (key: ApiKey) => {
    setSelectedKey(key)
    setIsDeleteOpen(true)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(true)
      toast.success("API key copied to clipboard")
      setTimeout(() => setCopiedKey(false), 2000)
    } catch (error) {
      toast.error("Failed to copy to clipboard")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">API Keys</h1>
            <p className="text-muted-foreground mt-2">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Keys</h1>
          <p className="text-muted-foreground mt-2">
            Manage API keys for programmatic access to your inventory
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create API Key
        </Button>
      </div>

      {/* Info Card */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">API Key Security</p>
              <p className="text-sm text-muted-foreground">
                API keys are only shown once upon creation. Store them securely and never share them publicly.
                Use the X-API-Key header to authenticate your requests.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {apiKeys.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <Key className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No API keys yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first API key to access your inventory programmatically
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First API Key
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* API Keys List */
        <div className="grid gap-4">
          {apiKeys.map((key) => (
            <Card key={key.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-green" />
                      {key.name}
                    </CardTitle>
                    <CardDescription>
                      Created {formatDate(key.createdAt)}
                      {key.lastUsed && ` • Last used ${formatDate(key.lastUsed)}`}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                    onClick={() => openDeleteDialog(key)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded px-3 py-2 font-mono text-sm text-muted-foreground">
                    inv_••••••••••••••••••••••••••••••••
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      key.isActive
                        ? "bg-green/10 text-green"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {key.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog
        open={isCreateOpen}
        onOpenChange={(open) => {
          setIsCreateOpen(open)
          if (!open) {
            setNewPlainKey(null)
            setKeyName("")
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
            <DialogDescription>
              {newPlainKey
                ? "Save your API key now. You won't be able to see it again!"
                : "Give your API key a descriptive name"}
            </DialogDescription>
          </DialogHeader>

          {newPlainKey ? (
            /* Show the new key */
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-green/10 border border-green/20 rounded-lg">
                <p className="text-sm font-medium mb-2 text-green">Your API Key</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-background rounded px-3 py-2 text-sm font-mono break-all">
                    {newPlainKey}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(newPlainKey)}
                  >
                    {copiedKey ? (
                      <Check className="h-4 w-4 text-green" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Make sure to copy your API key now. You won't be able to see it again!
              </p>
              <Button
                className="w-full"
                onClick={() => {
                  setIsCreateOpen(false)
                  setNewPlainKey(null)
                }}
              >
                Done
              </Button>
            </div>
          ) : (
            /* Create form */
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="key-name">Name *</Label>
                <Input
                  id="key-name"
                  placeholder="e.g., Production Server, Mobile App"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsCreateOpen(false)
                    setKeyName("")
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Key"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete API Key</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this API key?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm font-medium mb-2">Warning:</p>
              <p className="text-sm text-muted-foreground">
                This will permanently delete the API key <strong>{selectedKey?.name}</strong>.
                Any applications using this key will no longer be able to access your inventory.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsDeleteOpen(false)
                  setSelectedKey(null)
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="flex-1"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Delete Key"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
