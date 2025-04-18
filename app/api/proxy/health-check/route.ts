import { NextResponse } from "next/server"

// This endpoint checks if the backend is available
export async function GET() {
  const baseUrl = process.env.BACKEND_URL || "http://localhost:9876"

  try {
    // Use a short timeout for the health check
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000)

    const response = await fetch(`${baseUrl}/health`, {
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      return NextResponse.json({ status: "ok" })
    } else {
      return NextResponse.json({ status: "error", message: "Backend responded with an error" }, { status: 503 })
    }
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json({ status: "error", message: "Backend server is not available" }, { status: 503 })
  }
}
