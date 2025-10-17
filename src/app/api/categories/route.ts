import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { z } from "zod"

const categorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  roomId: z.string(),
})

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, description, roomId } = categorySchema.parse(body)

    // Verify room belongs to user
    const room = await prisma.room.findFirst({
      where: { id: roomId, userId: user.id },
    })

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        roomId,
      },
      include: {
        items: true,
      },
    })

    // Log activity
    try {
      await prisma.activityLog.create({
        data: {
          action: "created",
          entityType: "category",
          entityId: category.id,
          entityName: category.name,
          userId: user.id,
        },
      })
    } catch (error) {
      console.error("Failed to log activity:", error)
    }

    return NextResponse.json({ category })
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
