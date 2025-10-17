import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { z } from "zod"

const itemSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  quantity: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(0).default(10),
  categoryId: z.string(),
  imageUrl: z.string().url().optional(),
})

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const items = await prisma.item.findMany({
      where: {
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
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ items })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, description, quantity, lowStockThreshold, categoryId, imageUrl } =
      itemSchema.parse(body)

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

    const item = await prisma.item.create({
      data: {
        name,
        description,
        quantity,
        lowStockThreshold,
        categoryId,
        imageUrl,
      },
    })

    // Log activity
    try {
      await prisma.activityLog.create({
        data: {
          action: "created",
          entityType: "item",
          entityId: item.id,
          entityName: item.name,
          userId: user.id,
          itemId: item.id,
        },
      })
    } catch (error) {
      console.error("Failed to log activity:", error)
    }

    return NextResponse.json({ item })
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
