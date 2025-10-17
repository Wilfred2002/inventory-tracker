import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/session"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET(
  req: Request,
  { params }: { params: Promise<{ publicId: string }> }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { publicId } = await params

    // Decode the public ID (it comes URL-encoded)
    const decodedPublicId = decodeURIComponent(publicId)

    // Generate a fresh signed URL
    const signedUrl = cloudinary.url(decodedPublicId, {
      type: "private",
      sign_url: true,
      secure: true,
    })

    return NextResponse.json({ url: signedUrl })
  } catch (error) {
    console.error("Image URL generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate image URL" },
      { status: 500 }
    )
  }
}
