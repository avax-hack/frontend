'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronDownIcon } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import type { ICreatedProjectItem } from '@/features/builder/types'

interface ProjectSelectorProps {
  projects: ICreatedProjectItem[] | undefined
  selectedProjectId: string | undefined
  onSelect: (projectId: string) => void
  isLoading: boolean
}

export function ProjectSelector({
  projects,
  selectedProjectId,
  onSelect,
  isLoading,
}: ProjectSelectorProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (isLoading) {
    return <Skeleton className="h-12 w-full max-w-sm rounded-xl" />
  }

  if (!projects || projects.length === 0) {
    return null // handled by parent with empty state
  }

  const selected = projects.find((p) => p.project_id === selectedProjectId)

  return (
    <div ref={ref} className="relative w-full max-w-sm">
      <Button
        variant="outline"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 h-auto px-4 py-3 text-left"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select project"
      >
        <div className="flex flex-col min-w-0">
          <span className="font-medium truncate text-white">
            {selected?.name ?? 'Select a project'}
          </span>
          {selected && (
            <span className="text-xs text-white/50">
              {selected.symbol}
            </span>
          )}
        </div>
        <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </Button>

      {open && (
        <div
          role="listbox"
          className="absolute top-full left-0 z-10 mt-1 w-full rounded-lg border border-white/10 bg-[#0a0f1a]/95 backdrop-blur-xl shadow-lg"
        >
          {projects.map((project) => (
            <Button
              key={project.project_id}
              variant="ghost"
              role="option"
              aria-selected={project.project_id === selectedProjectId}
              className={`flex w-full items-center gap-3 h-auto px-4 py-3 text-left justify-start rounded-none ${
                project.project_id === selectedProjectId ? 'bg-secondary/30' : ''
              }`}
              onClick={() => {
                onSelect(project.project_id)
                setOpen(false)
              }}
            >
              {project.image_uri ? (
                <img
                  src={project.image_uri}
                  alt=""
                  className="size-8 rounded-full"
                />
              ) : (
                <div className="size-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                  {project.symbol.charAt(0)}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="font-medium truncate text-white">{project.name}</span>
                <span className="text-xs text-white/50">{project.symbol}</span>
              </div>
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
