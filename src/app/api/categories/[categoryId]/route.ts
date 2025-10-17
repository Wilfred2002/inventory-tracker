import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { z } from "zod"

const categorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
})

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { categoryId } = await params
    const body = await req.json()
    const { name, description } = categorySchema.parse(body)

    // Verify category belongs to user's room
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        room: { userId: user.id },
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: { name, description },
      include: { items: true },
    })

    // Log activity (track what changed)
    try {
      const changes: Record<string, { from: any; to: any }> = {}

      if (name !== category.name) {
        changes.name = { from: category.name, to: name }
      }
      if (description !== undefined && description !== category.description) {
        changes.description = { from: category.description, to: description }
      }

      if (Object.keys(changes).length > 0) {
        await prisma.activityLog.create({
          data: {
            action: "updated",
            entityType: "category",
            entityId: category.id,
            entityName: updatedCategory.name,
            changes,
            userId: user.id,
          },
        })
      }
    } catch (error) {
      console.error("Failed to log activity:", error)
    }

    return NextResponse.json({ category: updatedCategory })
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
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { categoryId } = await params

    // Verify category belongs to user's room
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        room: { userId: user.id },
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    // Log activity before deletion
    try {
      await prisma.activityLog.create({
        data: {
          action: "deleted",
          entityType: "category",
          entityId: category.id,
          entityName: category.name,
          changes: {
            deletedCategory: {
              name: category.name,
              description: category.description,
            },
          },
          userId: user.id,
        },
      })
    } catch (error) {
      console.error("Failed to log activity:", error)
    }

    await prisma.category.delete({
      where: { id: categoryId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
