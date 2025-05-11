import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Test backend connection first
    const flaskBackendUrl = "http://localhost:5000"
    console.log("Testing backend connection...")
    
    try {
      const testResponse = await fetch(`${flaskBackendUrl}/test`)
      const testData = await testResponse.json()
      console.log("Backend test response:", testData)
    } catch (error) {
      console.error("Backend connection test failed:", error)
      return NextResponse.json({ error: "Cannot connect to backend server" }, { status: 500 })
    }

    // Parse the request body
    const body = await request.json()

    // Extract the data from the request
    const { 
      content, 
      contentType, 
      backgroundVideo, 
      character1, 
      character2, 
      videoDuration 
    } = body

    // Print received data for debugging
    console.log("\n=== Data Received in API Route ===")
    console.log("Content:", content)
    console.log("Content Type:", contentType)
    console.log("Background Video:", backgroundVideo)
    console.log("Character 1:", character1)
    console.log("Character 2:", character2)
    console.log("Video Duration:", videoDuration)
    console.log("================================\n")

    // Validate the required fields
    if (!content || !backgroundVideo || !character1 || !character2) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Forward the request to the Flask backend
    const flaskResponse = await fetch(`${flaskBackendUrl}/generate-video`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        content_type: contentType,
        background_video: backgroundVideo,
        character_1: character1,
        character_2: character2,
        video_duration: parseInt(videoDuration),
      }),
    })

    console.log("Backend response status:", flaskResponse.status)

    const data = await flaskResponse.json()
    console.log("Backend response data:", data)

    if (!flaskResponse.ok) {
      return NextResponse.json({ error: data.error || "Error generating video" }, { status: flaskResponse.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to get character name from ID (for the mock response)
function getCharacterName(id: string) {
  const characters: Record<string, string> = {
    "jeff-bezos": "Jeff Bezos",
    "stewie-griffin": "Stewie Griffin",
    "uci-anteater": "UCI Anteater",
    "peter-griffin": "Peter Griffin",
    klefstad: "Professor Klefstad",
  }
  return characters[id] || id
}
