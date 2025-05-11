"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Video } from "lucide-react"
import { motion } from "framer-motion"

interface BackgroundSelectorProps {
  value: string
  onChange: (value: string) => void
}

const backgrounds = [
  { 
    id: "temple-run", 
    name: "Temple Run", 
    image: "/images/games/temple-run.png" 
  },
  { 
    id: "gta-driving", 
    name: "GTA Driving", 
    image: "/images/games/gta.png" 
  },
  { 
    id: "minecraft", 
    name: "Minecraft", 
    image: "/images/games/minecraft.png" 
  },
  { 
    id: "fortnite", 
    name: "Fortnite", 
    image: "/images/games/fortnite.png" 
  },
  { 
    id: "Subway Surfer", 
    name: "Subway Surfers", 
    image: "/images/games/subway-surfer.png" 
  },
  { 
    id: "custom", 
    name: "Upload Custom", 
    image: "/placeholder.svg" 
  },
]

export default function BackgroundSelector({ value, onChange }: BackgroundSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Video className="h-4 w-4 text-slate-500" />
        <Label className="text-sm font-medium">Background Video</Label>
      </div>
      <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {backgrounds.map((background) => (
          <div key={background.id} className="relative">
            <RadioGroupItem value={background.id} id={background.id} className="sr-only" />
            <Label htmlFor={background.id} className="cursor-pointer block">
              <Card 
                className={`h-full overflow-hidden border-2 border-transparent transition-all duration-200 hover:shadow-md ${
                  value === background.id 
                    ? 'ring-2 ring-purple-500 dark:ring-purple-400 shadow-md border-primary' 
                    : 'hover:border-gray-300 dark:hover:border-gray-600 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="relative aspect-video">
                  <Image
                    src={background.image}
                    alt={`${background.name} background`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                  {value === background.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-purple-500/20 flex items-center justify-center"
                    >
                      <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M13.3334 4L6.00008 11.3333L2.66675 8"
                            stroke="#7C3AED"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </div>
                <div className="p-2 text-center">
                  <span className="text-sm font-medium">{background.name}</span>
                </div>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
