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
  { params }: { params: { itemId: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const item = await prisma.item.findFirst({
      where: {
        id: params.itemId,
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
  { params }: { params: { itemId: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const data = itemSchema.parse(body)

    // Verify item belongs to user's category/room
    const item = await prisma.item.findFirst({
      where: {
        id: params.itemId,
        category: {
          room: { userId: user.id },
        },
      },
    })

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    const updatedItem = await prisma.item.update({
      where: { id: params.itemId },
      data,
    })

    return NextResponse.json({ item: updatedItem })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify item belongs to user's category/room
    const item = await prisma.item.findFirst({
      where: {
        id: params.itemId,
        category: {
          room: { userId: user.id },
        },
      },
    })

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    await prisma.item.delete({
      where: { id: params.itemId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
