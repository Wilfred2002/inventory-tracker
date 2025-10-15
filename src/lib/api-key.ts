import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function validateApiKey(
  apiKey: string
): Promise<{ valid: boolean; userId?: string }> {
  if (!apiKey || !apiKey.startsWith("inv_")) {
    return { valid: false }
  }

  try {
    // Get all active API keys
    const apiKeys = await prisma.apiKey.findMany({
      where: { isActive: true },
      select: {
        id: true,
        key: true,
        userId: true,
      },
    })

    // Check each hashed key
    for (const key of apiKeys) {
      const isValid = await compare(apiKey, key.key)
      if (isValid) {
        // Update last used timestamp
        await prisma.apiKey.update({
          where: { id: key.id },
          data: { lastUsed: new Date() },
        })

        return { valid: true, userId: key.userId }
      }
    }

    return { valid: false }
  } catch (error) {
    console.error("API key validation error:", error)
    return { valid: false }
  }
}
