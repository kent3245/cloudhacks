"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { motion } from "framer-motion"
import { Gamepad2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface GameSelectorProps {
  label: string
  value: string
  onChange: (value: string) => void
}

const games = [
  {
    id: "gta",
    name: "Grand Theft Auto",
    image: "/images/games/gta.png",
    color: "bg-green-100 dark:bg-green-900/30",
  },
  {
    id: "minecraft",
    name: "Minecraft",
    image: "/images/games/minecraft.png",
    color: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    id: "fortnite",
    name: "Fortnite",
    image: "/images/games/fortnite.png",
    color: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    id: "temple-run",
    name: "Temple Run",
    image: "/images/games/temple-run.png",
    color: "bg-amber-100 dark:bg-amber-900/30",
  },
]

export default function GameSelector({ label, value, onChange }: GameSelectorProps) {
  const groupId = `game-group-${label.toLowerCase().replace(/\s+/g, '-')}`
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [content, setContent] = useState("")

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setContent("") // Clear text area when file is uploaded
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Gamepad2 className="h-4 w-4 text-slate-500" />
        <Label className="text-sm font-medium">{label}</Label>
      </div>
      <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-2 gap-4" name={groupId}>
        {games.map((game) => (
          <div
            key={game.id}
            className={`relative rounded-lg transition-all duration-200 ${
              value === game.id
                ? "ring-2 ring-purple-500 dark:ring-purple-400 bg-white dark:bg-slate-800"
                : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }`}
          >
            <RadioGroupItem value={game.id} id={`${groupId}-${game.id}`} className="sr-only" />
            <Label htmlFor={`${groupId}-${game.id}`} className="flex flex-col items-center p-4 cursor-pointer w-full">
              <div className={`h-24 w-24 rounded-lg ${game.color} flex items-center justify-center mb-2 overflow-hidden`}>
                <Image
                  src={game.image}
                  alt={game.name}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
              <span className="font-medium text-center">{game.name}</span>
              {value === game.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 h-5 w-5 rounded-full bg-purple-500 dark:bg-purple-400 flex items-center justify-center"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10 3L4.5 8.5L2 6"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              )}
            </Label>
          </div>
        ))}
      </RadioGroup>
      <div className="mb-4">
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4" />
            </svg>
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
        {uploadedFile && (
          <div className="mt-2 flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 rounded px-3 py-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828l6.586-6.586a2 2 0 00-2.828-2.828z" />
            </svg>
            <span className="text-sm text-slate-700 dark:text-slate-200">{uploadedFile.name}</span>
          </div>
        )}
      </div>
      <textarea
        id="content"
        placeholder="Or paste your content here..."
        className="min-h-[200px] rounded-lg border-slate-200 dark:border-slate-800 resize-none"
        value={content}
        onChange={(e) => {
          setContent(e.target.value)
          if (e.target.value) {
            setUploadedFile(null) // Clear file when text is entered
          }
        }}
      />
    </div>
  )
}