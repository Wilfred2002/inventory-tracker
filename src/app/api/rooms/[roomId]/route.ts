import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { z } from "zod"

const roomSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
})

export async function GET(
  req: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { roomId } = await params

    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        userId: user.id,
      },
      include: {
        categories: {
          include: {
            items: true,
          },
        },
      },
    })

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json({ room })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { roomId } = await params
    const body = await req.json()
    const { name, description } = roomSchema.parse(body)

    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        userId: user.id,
      },
    })

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: { name, description },
    })

    // Log activity (track what changed)
    try {
      const changes: Record<string, { from: any; to: any }> = {}

      if (name !== room.name) {
        changes.name = { from: room.name, to: name }
      }
      if (description !== undefined && description !== room.description) {
        changes.description = { from: room.description, to: description }
      }

      if (Object.keys(changes).length > 0) {
        await prisma.activityLog.create({
          data: {
            action: "updated",
            entityType: "room",
            entityId: room.id,
            entityName: updatedRoom.name,
            changes,
            userId: user.id,
          },
        })
      }
    } catch (error) {
      console.error("Failed to log activity:", error)
    }

    return NextResponse.json({ room: updatedRoom })
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
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { roomId } = await params

    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        userId: user.id,
      },
    })

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    // Log activity before deletion
    try {
      await prisma.activityLog.create({
        data: {
          action: "deleted",
          entityType: "room",
          entityId: room.id,
          entityName: room.name,
          changes: {
            deletedRoom: {
              name: room.name,
              description: room.description,
            },
          },
          userId: user.id,
        },
      })
    } catch (error) {
      console.error("Failed to log activity:", error)
    }

    await prisma.room.delete({
      where: { id: roomId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
