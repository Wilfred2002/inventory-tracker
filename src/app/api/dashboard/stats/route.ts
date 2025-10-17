import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get total rooms
    const totalRooms = await prisma.room.count({
      where: { userId: user.id },
    })

    // Get total categories
    const totalCategories = await prisma.category.count({
      where: { room: { userId: user.id } },
    })

    // Get all items with category and room data
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
    })

    // Calculate low stock items
    const lowStockItems = items.filter(
      (item) => item.quantity <= item.lowStockThreshold
    ).length

    // Calculate items by room for chart
    const itemsByRoom = items.reduce((acc: Record<string, number>, item) => {
      const roomName = item.category.room.name
      acc[roomName] = (acc[roomName] || 0) + 1
      return acc
    }, {})

    // Calculate stock levels distribution
    const stockLevels = {
      outOfStock: items.filter((item) => item.quantity === 0).length,
      lowStock: items.filter(
        (item) => item.quantity > 0 && item.quantity <= item.lowStockThreshold
      ).length,
      normalStock: items.filter((item) => item.quantity > item.lowStockThreshold)
        .length,
    }

    // Calculate total quantity by category
    const quantityByCategory = items.reduce(
      (acc: Record<string, number>, item) => {
        const categoryName = item.category.name
        acc[categoryName] = (acc[categoryName] || 0) + item.quantity
        return acc
      },
      {}
    )

    return NextResponse.json({
      stats: {
        totalRooms,
        totalCategories,
        totalItems: items.length,
        lowStockItems,
        itemsByRoom: Object.entries(itemsByRoom).map(([name, count]) => ({
          name,
          count,
        })),
        stockLevels,
        quantityByCategory: Object.entries(quantityByCategory)
          .map(([name, quantity]) => ({ name, quantity }))
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5), // Top 5 categories
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
