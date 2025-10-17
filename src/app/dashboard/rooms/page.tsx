"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, FolderOpen, Package, ChevronDown, ChevronUp } from "lucide-react"
import toast from "react-hot-toast"

interface Category {
  id: string
  name: string
  description: string | null
  items: { id: string }[]
}

interface Room {
  id: string
  name: string
  description: string | null
  createdAt: string
  categories: Category[]
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ name: "", description: "" })
  const [expandedRoomId, setExpandedRoomId] = useState<string | null>(null)
  const [isCategoryCreateOpen, setIsCategoryCreateOpen] = useState(false)
  const [isCategoryEditOpen, setIsCategoryEditOpen] = useState(false)
  const [isCategoryDeleteOpen, setIsCategoryDeleteOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [categoryFormData, setCategoryFormData] = useState({ name: "", description: "", roomId: "" })

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const response = await fetch("/api/rooms", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setRooms(data.rooms)
      }
    } catch (error) {
      toast.error("Failed to load rooms")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("Room created successfully")
        setIsCreateOpen(false)
        setFormData({ name: "", description: "" })
        fetchRooms()
      } else {
        toast.error("Failed to create room")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRoom) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/rooms/${selectedRoom.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("Room updated successfully")
        setIsEditOpen(false)
        setSelectedRoom(null)
        setFormData({ name: "", description: "" })
        fetchRooms()
      } else {
        toast.error("Failed to update room")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedRoom) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/rooms/${selectedRoom.id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        toast.success("Room deleted successfully")
        setIsDeleteOpen(false)
        setSelectedRoom(null)
        fetchRooms()
      } else {
        toast.error("Failed to delete room")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditDialog = (room: Room) => {
    setSelectedRoom(room)
    setFormData({ name: room.name, description: room.description || "" })
    setIsEditOpen(true)
  }

  const openDeleteDialog = (room: Room) => {
    setSelectedRoom(room)
    setIsDeleteOpen(true)
  }

  const getCategoryCount = (room: Room) => room.categories.length
  const getItemCount = (room: Room) =>
    room.categories.reduce((sum, cat) => sum + cat.items.length, 0)

  // Category handlers
  const openCategoryCreateDialog = (roomId: string) => {
    setCategoryFormData({ name: "", description: "", roomId })
    setIsCategoryCreateOpen(true)
  }

  const openCategoryEditDialog = (category: Category, roomId: string) => {
    setSelectedCategory(category)
    setCategoryFormData({ name: category.name, description: category.description || "", roomId })
    setIsCategoryEditOpen(true)
  }

  const openCategoryDeleteDialog = (category: Category) => {
    setSelectedCategory(category)
    setIsCategoryDeleteOpen(true)
  }

  const handleCategoryCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(categoryFormData),
      })

      if (response.ok) {
        toast.success("Category created successfully")
        setIsCategoryCreateOpen(false)
        setCategoryFormData({ name: "", description: "", roomId: "" })
        fetchRooms()
      } else {
        toast.error("Failed to create category")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCategoryEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/categories/${selectedCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: categoryFormData.name, description: categoryFormData.description }),
      })

      if (response.ok) {
        toast.success("Category updated successfully")
        setIsCategoryEditOpen(false)
        setSelectedCategory(null)
        setCategoryFormData({ name: "", description: "", roomId: "" })
        fetchRooms()
      } else {
        toast.error("Failed to update category")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCategoryDelete = async () => {
    if (!selectedCategory) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/categories/${selectedCategory.id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        toast.success("Category deleted successfully")
        setIsCategoryDeleteOpen(false)
        setSelectedCategory(null)
        fetchRooms()
      } else {
        toast.error("Failed to delete category")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Rooms</h1>
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
          <h1 className="text-3xl font-bold">Rooms</h1>
          <p className="text-muted-foreground mt-2">
            Manage your storage rooms and organize your inventory
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Room
        </Button>
      </div>

      {/* Empty State */}
      {rooms.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No rooms yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first storage room to start organizing your inventory
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Room
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Rooms Grid */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <Card key={room.id} className="hover:border-green/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{room.name}</span>
                  <FolderOpen className="h-5 w-5 text-green flex-shrink-0" />
                </CardTitle>
                {room.description && (
                  <CardDescription className="line-clamp-2">
                    {room.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="text-muted-foreground">
                        {getCategoryCount(room)} categories
                      </span>
                      <span className="text-muted-foreground">
                        {getItemCount(room)} items
                      </span>
                    </div>
                  </div>

                  {/* Categories Toggle */}
                  {room.categories.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between"
                      onClick={() => setExpandedRoomId(expandedRoomId === room.id ? null : room.id)}
                    >
                      <span className="text-sm">View Categories</span>
                      {expandedRoomId === room.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  )}

                  {/* Categories List */}
                  {expandedRoomId === room.id && (
                    <div className="space-y-2 border-t border-border pt-3">
                      {room.categories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{category.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {category.items.length} item{category.items.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <div className="flex gap-1 ml-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => openCategoryEditDialog(category, room.id)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => openCategoryDeleteDialog(category)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => openCategoryCreateDialog(room.id)}
                      >
                        <Plus className="h-3 w-3 mr-2" />
                        Add Category
                      </Button>
                    </div>
                  )}

                  {/* Room Actions */}
                  <div className="flex gap-2 pt-2 border-t border-border">
                    {room.categories.length === 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => openCategoryCreateDialog(room.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className={room.categories.length === 0 ? "flex-1" : "flex-1"}
                      onClick={() => openEditDialog(room)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Room
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                      onClick={() => openDeleteDialog(room)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Room</DialogTitle>
            <DialogDescription>
              Add a new storage room to organize your inventory
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Kitchen, Garage, Warehouse"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Optional description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
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
                  setFormData({ name: "", description: "" })
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Room"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>
              Update room details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                disabled={isSubmitting}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsEditOpen(false)
                  setSelectedRoom(null)
                  setFormData({ name: "", description: "" })
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Room</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this room?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm font-medium mb-2">Warning:</p>
              <p className="text-sm text-muted-foreground">
                This will permanently delete <strong>{selectedRoom?.name}</strong> and all{" "}
                <strong>{selectedRoom ? getCategoryCount(selectedRoom) : 0} categories</strong> and{" "}
                <strong>{selectedRoom ? getItemCount(selectedRoom) : 0} items</strong> inside it.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsDeleteOpen(false)
                  setSelectedRoom(null)
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
                {isSubmitting ? "Deleting..." : "Delete Room"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Category Dialog */}
      <Dialog open={isCategoryCreateOpen} onOpenChange={setIsCategoryCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
            <DialogDescription>
              Add a new category to organize items in this room
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCategoryCreate} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Name *</Label>
              <Input
                id="category-name"
                placeholder="e.g., Electronics, Tools, Supplies"
                value={categoryFormData.name}
                onChange={(e) =>
                  setCategoryFormData({ ...categoryFormData, name: e.target.value })
                }
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-description">Description</Label>
              <Input
                id="category-description"
                placeholder="Optional description"
                value={categoryFormData.description}
                onChange={(e) =>
                  setCategoryFormData({ ...categoryFormData, description: e.target.value })
                }
                disabled={isSubmitting}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsCategoryCreateOpen(false)
                  setCategoryFormData({ name: "", description: "", roomId: "" })
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Category"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isCategoryEditOpen} onOpenChange={setIsCategoryEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update category details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCategoryEdit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category-name">Name *</Label>
              <Input
                id="edit-category-name"
                value={categoryFormData.name}
                onChange={(e) =>
                  setCategoryFormData({ ...categoryFormData, name: e.target.value })
                }
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category-description">Description</Label>
              <Input
                id="edit-category-description"
                value={categoryFormData.description}
                onChange={(e) =>
                  setCategoryFormData({ ...categoryFormData, description: e.target.value })
                }
                disabled={isSubmitting}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsCategoryEditOpen(false)
                  setSelectedCategory(null)
                  setCategoryFormData({ name: "", description: "", roomId: "" })
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog open={isCategoryDeleteOpen} onOpenChange={setIsCategoryDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm font-medium mb-2">Warning:</p>
              <p className="text-sm text-muted-foreground">
                This will permanently delete <strong>{selectedCategory?.name}</strong> and all{" "}
                <strong>{selectedCategory?.items.length || 0} items</strong> inside it.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsCategoryDeleteOpen(false)
                  setSelectedCategory(null)
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="flex-1"
                onClick={handleCategoryDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Delete Category"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
