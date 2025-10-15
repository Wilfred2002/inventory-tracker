import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateApiKey } from "@/lib/api-key"

export async function GET(req: Request) {
  try {
    // Get API key from header
    const apiKey = req.headers.get("x-api-key")

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 401 }
      )
    }

    // Validate API key
    const { valid, userId } = await validateApiKey(apiKey)

    if (!valid || !userId) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    // Get all inventory for the user
    const rooms = await prisma.room.findMany({
      where: { userId },
      include: {
        categories: {
          include: {
            items: {
              select: {
                id: true,
                name: true,
                description: true,
                quantity: true,
                lowStockThreshold: true,
                imageUrl: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      rooms,
      totalRooms: rooms.length,
      totalCategories: rooms.reduce((acc, room) => acc + room.categories.length, 0),
      totalItems: rooms.reduce(
        (acc, room) =>
          acc +
          room.categories.reduce((catAcc, cat) => catAcc + cat.items.length, 0),
        0
      ),
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
