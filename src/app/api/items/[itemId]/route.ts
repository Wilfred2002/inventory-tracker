import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { z } from "zod"

const itemSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  quantity: z.number().int().min(0).optional(),
  lowStockThreshold: z.number().int().min(0).optional(),
  imageUrl: z.string().url().optional().nullable(),
})

export async function GET(
  req: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { itemId } = await params

    const item = await prisma.item.findFirst({
      where: {
        id: itemId,
        category: {
          room: { userId: user.id },
        },
      },
      include: {
        category: {
          include: {
            room: true,
          },
        },
      },
    })

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json({ item })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { itemId } = await params
    const body = await req.json()
    const data = itemSchema.parse(body)

    // Verify item belongs to user's category/room
    const item = await prisma.item.findFirst({
      where: {
        id: itemId,
        category: {
          room: { userId: user.id },
        },
      },
    })

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data,
    })

    // Log activity (track what changed)
    try {
      const changes: Record<string, { from: any; to: any }> = {}

      if (data.name && data.name !== item.name) {
        changes.name = { from: item.name, to: data.name }
      }
      if (data.description !== undefined && data.description !== item.description) {
        changes.description = { from: item.description, to: data.description }
      }
      if (data.quantity !== undefined && data.quantity !== item.quantity) {
        changes.quantity = { from: item.quantity, to: data.quantity }
      }
      if (data.lowStockThreshold !== undefined && data.lowStockThreshold !== item.lowStockThreshold) {
        changes.lowStockThreshold = { from: item.lowStockThreshold, to: data.lowStockThreshold }
      }
      if (data.imageUrl !== undefined && data.imageUrl !== item.imageUrl) {
        changes.imageUrl = { from: item.imageUrl, to: data.imageUrl }
      }

      if (Object.keys(changes).length > 0) {
        await prisma.activityLog.create({
          data: {
            action: "updated",
            entityType: "item",
            entityId: item.id,
            entityName: updatedItem.name,
            changes,
            userId: user.id,
            itemId: item.id,
          },
        })
      }
    } catch (error) {
      console.error("Failed to log activity:", error)
    }

    return NextResponse.json({ item: updatedItem })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { itemId } = await params

    // Verify item belongs to user's category/room
    const item = await prisma.item.findFirst({
      where: {
        id: itemId,
        category: {
          room: { userId: user.id },
        },
      },
    })

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    // Log activity before deletion
    try {
      await prisma.activityLog.create({
        data: {
          action: "deleted",
          entityType: "item",
          entityId: item.id,
          entityName: item.name,
          changes: {
            deletedItem: {
              name: item.name,
              quantity: item.quantity,
              description: item.description,
            },
          },
          userId: user.id,
        },
      })
    } catch (error) {
      console.error("Failed to log activity:", error)
    }

    await prisma.item.delete({
      where: { id: itemId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
