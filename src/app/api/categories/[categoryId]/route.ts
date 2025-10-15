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
  { params }: { params: { categoryId: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, description } = categorySchema.parse(body)

    // Verify category belongs to user's room
    const category = await prisma.category.findFirst({
      where: {
        id: params.categoryId,
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
      where: { id: params.categoryId },
      data: { name, description },
      include: { items: true },
    })

    return NextResponse.json({ category: updatedCategory })
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
  { params }: { params: { categoryId: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify category belongs to user's room
    const category = await prisma.category.findFirst({
      where: {
        id: params.categoryId,
        room: { userId: user.id },
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    await prisma.category.delete({
      where: { id: params.categoryId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
