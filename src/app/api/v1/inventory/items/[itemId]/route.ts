import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateApiKey } from "@/lib/api-key"
import { z } from "zod"

const updateItemSchema = z.object({
  quantity: z.number().int().min(0).optional(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  lowStockThreshold: z.number().int().min(0).optional(),
})

export async function GET(
  req: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const apiKey = req.headers.get("x-api-key")

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 401 }
      )
    }

    const { valid, userId } = await validateApiKey(apiKey)

    if (!valid || !userId) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    const { itemId } = await params

    const item = await prisma.item.findFirst({
      where: {
        id: itemId,
        category: {
          room: { userId },
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

export async function POST(
  req: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const apiKey = req.headers.get("x-api-key")

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 401 }
      )
    }

    const { valid, userId } = await validateApiKey(apiKey)

    if (!valid || !userId) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    const { itemId } = await params
    const body = await req.json()
    const data = updateItemSchema.parse(body)

    // Verify item belongs to the user
    const item = await prisma.item.findFirst({
      where: {
        id: itemId,
        category: {
          room: { userId },
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

    return NextResponse.json({
      item: updatedItem,
      message: "Item updated successfully",
    })
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
