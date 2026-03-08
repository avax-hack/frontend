'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (search: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(inputValue)
    }, 300)
    return () => clearTimeout(timer)
  }, [inputValue, onChange])

  useEffect(() => {
    setInputValue(value)
  }, [value])

  return (
    <div className="relative">
      <SearchIcon
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search tokens…"
        aria-label="Search tokens"
        spellCheck={false}
        autoComplete="off"
        className="pl-8"
      />
    </div>
  )
}
