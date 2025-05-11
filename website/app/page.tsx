"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import VideoPreview from "@/components/video-preview"
import CharacterSelector from "@/components/character-selector"
import BackgroundSelector from "@/components/background-selector"
import GameSelector from "@/components/game-selector"
import { Sparkles, Clock, FileText, Upload } from "lucide-react"

export default function Home() {
  // State variables to store user selections
  const [content, setContent] = useState("")
  const [contentType, setContentType] = useState("documentation")
  const [backgroundVideo, setBackgroundVideo] = useState("temple-run")
  const [character1, setCharacter1] = useState("jeff-bezos")
  const [character2, setCharacter2] = useState("stewie-griffin")
  const [videoDuration, setVideoDuration] = useState(30)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideo, setGeneratedVideo] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [selectedGame, setSelectedGame] = useState("temple-run")

  // Function to handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      // Read file content
      const reader = new FileReader()
      reader.onload = (event) => {
        setContent(event.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    try {
      // Create the request payload
      const payload = {
        content,
        contentType,
        backgroundVideo,
        character1,
        character2,
        videoDuration,
        // If there's a file, include its content
        ...(uploadedFile && { fileContent: await uploadedFile.text() })
      }

      // Send data to Flask backend
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        setGeneratedVideo(data.videoUrl)
      } else {
        console.error("Error generating video:", data.error)
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <main className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text mb-3">
            Educational Short-Form Video Generator
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Transform educational content into engaging short-form videos with character dialogues and dynamic
            backgrounds
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="p-6 border-0 shadow-lg bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
            <div className="flex items-center space-x-2 mb-6">
              <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold">Create Your Video</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="contentType" className="text-sm font-medium">
                  Content Type
                </Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger className="w-full rounded-lg border-slate-200 dark:border-slate-800">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="documentation">AWS Documentation</SelectItem>
                    <SelectItem value="lecture">Lecture Slides</SelectItem>
                    <SelectItem value="book">Book Content</SelectItem>
                    <SelectItem value="custom">Custom Content</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium">
                  Educational Content
                </Label>
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 dark:border-slate-800 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-slate-500" />
                        <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Any text file (TXT, PDF, DOCX)
                        </p>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".txt,.pdf,.docx"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                  <Textarea
                    id="content"
                    placeholder="Or paste your content here..."
                    className="min-h-[200px] rounded-lg border-slate-200 dark:border-slate-800 resize-none"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <Label htmlFor="videoDuration" className="text-sm font-medium">
                    Video Duration (seconds)
                  </Label>
                </div>
                <div className="flex items-center">
                  <input
                    id="videoDuration"
                    type="number"
                    min={1}
                    value={videoDuration}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value)
                      if (value > 0) {
                        setVideoDuration(value)
                      }
                    }}
                    className="w-full rounded-lg border-slate-200 dark:border-slate-800 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 dark:focus:border-purple-400 h-10 px-3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CharacterSelector label="Character 1 (Learner)" value={character1} onChange={setCharacter1} />
                <CharacterSelector label="Character 2 (Expert)" value={character2} onChange={setCharacter2} />
              </div>

              <BackgroundSelector value={backgroundVideo} onChange={setBackgroundVideo} />

              <Button
                type="submit"
                className="w-full h-12 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-opacity-20 border-t-white rounded-full" />
                    <span>Generating Video...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Sparkles className="h-5 w-5" />
                    <span>Generate Video</span>
                  </div>
                )}
              </Button>
            </form>
          </Card>

          <VideoPreview
            generatedVideo={generatedVideo}
            isGenerating={isGenerating}
            character1={character1}
            character2={character2}
            backgroundVideo={backgroundVideo}
          />
        </div>
      </main>
    </div>
  )
}
