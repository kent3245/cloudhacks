"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { User } from "lucide-react"

interface CharacterSelectorProps {
  label: string
  value: string
  onChange: (value: string) => void
}

const characters = [
  {
    id: "jeff-bezos",
    name: "Jeff Bezos",
    image: "/images/characters/jeff-bezos.png",
    color: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    id: "stewie-griffin",
    name: "Stewie Griffin",
    image: "/images/characters/stewie-griffin.png",
    color: "bg-green-100 dark:bg-green-900/30",
  },
  {
    id: "uci-anteater",
    name: "UCI Anteater",
    image: "/images/characters/uci-anteater.png",
    color: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    id: "peter-griffin",
    name: "Peter Griffin",
    image: "/images/characters/peter-griffin.png",
    color: "bg-red-100 dark:bg-red-900/30",
  },
  {
    id: "klefstad",
    name: "Professor Klefstad",
    image: "/images/characters/klefstad.png",
    color: "bg-purple-100 dark:bg-purple-900/30",
  },
]

export default function CharacterSelector({ label, value, onChange }: CharacterSelectorProps) {
  // Create a unique ID for this instance of the component
  const groupId = `character-group-${label.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <User className="h-4 w-4 text-slate-500" />
        <Label className="text-sm font-medium">{label}</Label>
      </div>
      <RadioGroup value={value} onValueChange={onChange} className="space-y-2" name={groupId}>
        {characters.map((character) => (
          <div
            key={character.id}
            className={`relative rounded-lg transition-all duration-200 ${
              value === character.id
                ? "ring-2 ring-purple-500 dark:ring-purple-400 bg-white dark:bg-slate-800"
                : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }`}
          >
            <RadioGroupItem value={character.id} id={`${groupId}-${character.id}`} className="sr-only" />
            <Label htmlFor={`${groupId}-${character.id}`} className="flex items-center p-3 cursor-pointer w-full">
              <div
                className={`h-10 w-10 rounded-full ${character.color} flex items-center justify-center mr-3 overflow-hidden`}
              >
                <Avatar className="h-8 w-8 border-2 border-white dark:border-slate-700">
                  <AvatarImage src={character.image || "/placeholder.svg"} alt={character.name} />
                  <AvatarFallback>{character.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <span className="font-medium">{character.name}</span>
              {value === character.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto h-5 w-5 rounded-full bg-purple-500 dark:bg-purple-400 flex items-center justify-center"
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
    </div>
  )
}
