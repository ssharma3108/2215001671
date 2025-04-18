import { type NextRequest, NextResponse } from "next/server"

// This is a proxy API route to avoid CORS issues when testing locally
export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/")

  // Use environment variable for the backend URL if available, otherwise use localhost
  const baseUrl = process.env.BACKEND_URL || "http://localhost:9876"
  const url = `${baseUrl}/${path}`

  console.log(`Attempting to proxy request to: ${url}`)

  try {
    // Use a timeout to avoid hanging requests
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`)
      return NextResponse.json({ error: `API responded with status: ${response.status}` }, { status: response.status })
    }

    const data = await response.json()
    console.log("API response received successfully")

    return NextResponse.json(data)
  } catch (error) {
    console.error("API proxy error:", error)

    // Return a more helpful error message
    return NextResponse.json(
      {
        error: "Cannot connect to the backend server. Using the mock API is recommended.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    )
  }
}
