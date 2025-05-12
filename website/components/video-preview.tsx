import { Card } from "@/components/ui/card"
import { Loader2, Download, Share2, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface VideoPreviewProps {
  generatedVideo: string
  isGenerating: boolean
  character1: string
  character2: string
  backgroundVideo: string
}

export default function VideoPreview({
  generatedVideo,
  isGenerating,
  character1,
  character2,
  backgroundVideo,
}: VideoPreviewProps) {
  const [uploadedFile, setUploadedFile] = useState(null)

  // Helper function to get character name from ID
  const getCharacterName = (id: string) => {
    const characters: Record<string, string> = {
      "jeff-bezos": "Jeff Bezos",
      "stewie-griffin": "Stewie Griffin",
      "uci-anteater": "UCI Anteater",
      "peter-griffin": "Peter Griffin",
      klefstad: "Professor Klefstad",
    }
    return characters[id] || id
  }

  // Helper function to get background name from ID
  const getBackgroundName = (id: string) => {
    const backgrounds: Record<string, string> = {
      "temple-run": "Temple Run",
      "gta-driving": "GTA Driving",
      minecraft: "Minecraft",
      fortnite: "Fortnite",
      custom: "Custom Background",
    }
    return backgrounds[id] || id
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  // This will log every time the component renders

  return (
    <Card className="p-6 border-0 shadow-lg bg-white dark:bg-slate-900 rounded-xl overflow-hidden h-full">
      <div className="flex items-center space-x-2 mb-6">
        <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
          <Play className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-xl font-semibold">Video Preview</h2>
      </div>

      <div className="flex-1 flex flex-col">
        {isGenerating ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-12">
            <div className="relative">
              <div className="h-20 w-20 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-purple-500 dark:border-t-purple-400 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-purple-500 dark:text-purple-400" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">Generating your educational video...</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                We're creating a dialogue between {getCharacterName(character1)} and {getCharacterName(character2)} with{" "}
                {getBackgroundName(backgroundVideo)} in the background
              </p>
            </div>
          </div>
        ) : generatedVideo ? (
          <div className="flex-1">
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6 shadow-xl">
              <video
                src="/video/brainrot_final.mp4"
                // src={generatedVideo}
                controls
                className="w-full h-full"
                poster="/placeholder.svg?height=360&width=640"
              />
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                >
                  {getCharacterName(character1)}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                >
                  {getCharacterName(character2)}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                >
                  {getBackgroundName(backgroundVideo)}
                </Badge>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                  asChild
                >
                  <a href={generatedVideo} download>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col space-y-6">
            <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
              <div className="text-center space-y-2 max-w-xs mx-auto p-6">
                <div className="h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto flex items-center justify-center">
                  <Play className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Your video preview will appear here</p>
              </div>
            </div>

            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-lg">
              <h3 className="font-medium text-lg">How it works:</h3>
              <ol className="space-y-3 text-slate-700 dark:text-slate-300">
                <li className="flex">
                  <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mr-3">
                    1
                  </span>
                  <span>Enter your educational content (AWS docs, lecture slides, etc.)</span>
                </li>
                <li className="flex">
                  <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mr-3">
                    2
                  </span>
                  <span>Select two characters who will have a dialogue</span>
                </li>
                <li className="flex">
                  <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mr-3">
                    3
                  </span>
                  <span>Choose an engaging background video</span>
                </li>
                <li className="flex">
                  <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mr-3">
                    4
                  </span>
                  <span>Set the video duration</span>
                </li>
                <li className="flex">
                  <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mr-3">
                    5
                  </span>
                  <span>Click "Generate Video" to create your educational content</span>
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
