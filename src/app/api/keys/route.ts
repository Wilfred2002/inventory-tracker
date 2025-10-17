import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { z } from "zod"
import crypto from "crypto"
import { hash } from "bcryptjs"

const keySchema = z.object({
  name: z.string().min(1).max(100),
})

function generateApiKey(): string {
  return `inv_${crypto.randomBytes(32).toString("hex")}`
}

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
        isActive: true,
        lastUsed: true,
        createdAt: true,
        // Never return the actual key
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ apiKeys })
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
    const { name } = keySchema.parse(body)

    // Generate a new API key
    const plainKey = generateApiKey()
    const hashedKey = await hash(plainKey, 12)

    const apiKey = await prisma.apiKey.create({
      data: {
        name,
        key: hashedKey,
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
        isActive: true,
        createdAt: true,
      },
    })

    // Return the plain key only once
    return NextResponse.json({
      apiKey,
      plainKey, // This will only be shown once
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
