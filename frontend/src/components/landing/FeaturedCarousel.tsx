'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { FeaturedProjectCard } from './FeaturedProjectCard'
import type { IProjectListItem } from '@/types/project'

interface FeaturedCarouselProps {
  projects: IProjectListItem[]
}

export function FeaturedCarousel({ projects }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const isHovered = useRef(false)

  const advance = useCallback(() => {
    if (!isHovered.current) {
      setCurrentIndex((i) => (i + 1) % projects.length)
    }
  }, [projects.length])

  useEffect(() => {
    if (projects.length <= 1) return
    const id = setInterval(advance, 5000)
    return () => clearInterval(id)
  }, [advance, projects.length])

  if (projects.length === 0) return null

  return (
    <section
      className="flex flex-col gap-4"
      onMouseEnter={() => { isHovered.current = true }}
      onMouseLeave={() => { isHovered.current = false }}
    >
      <h2 className="text-2xl font-bold">Featured Projects</h2>
      <FeaturedProjectCard project={projects[currentIndex]} />
      {projects.length > 1 && (
        <div className="flex justify-center gap-2">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`size-2.5 rounded-full transition-colors ${
                i === currentIndex ? 'bg-primary' : 'bg-muted'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
