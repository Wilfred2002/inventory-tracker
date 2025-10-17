import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { itemId } = await params
    const { adjustment } = await req.json()

    // Validate adjustment
    if (typeof adjustment !== "number") {
      return NextResponse.json(
        { error: "Invalid adjustment value" },
        { status: 400 }
      )
    }

    // Get the item
    const item = await prisma.item.findFirst({
      where: {
        id: itemId,
        category: {
          room: {
            userId: user.id,
          },
        },
      },
      include: {
        category: true,
      },
    })

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    // Calculate new quantity
    const newQuantity = Math.max(0, item.quantity + adjustment)

    // Update the item
    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: { quantity: newQuantity },
    })

    // Log the activity
    try {
      await prisma.activityLog.create({
        data: {
          action: "quantity_adjusted",
          entityType: "item",
          entityId: item.id,
          entityName: item.name,
          changes: {
            from: item.quantity,
            to: newQuantity,
            adjustment,
          },
          userId: user.id,
          itemId: item.id,
        },
      })
    } catch (error) {
      // Log activity failed but don't fail the request
      console.error("Failed to log activity:", error)
    }

    return NextResponse.json({ item: updatedItem })
  } catch (error) {
    console.error("Adjust quantity error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
