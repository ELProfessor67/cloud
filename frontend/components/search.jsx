"use client"

import { SearchIcon, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"


export function Search({ onSearch, isOpen, onClose }) {
  const [query, setQuery] = useState("")

  if (!isOpen) return null

  return (
    <div className="absolute inset-x-0 top-0 z-20 bg-gradient-to-r from-purple-500 to-purple-600 p-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            className="w-full pl-9 pr-4 bg-white"
            placeholder="Search files and folders..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              onSearch(e.target.value)
            }}
            autoFocus
          />
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white">
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

