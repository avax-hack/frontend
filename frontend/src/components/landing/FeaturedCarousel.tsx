'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FeaturedProjectCard } from './FeaturedProjectCard'
import type { IProjectListItem } from '@/types/project'

interface FeaturedCarouselProps {
  projects: IProjectListItem[]
}

export function FeaturedCarousel({ projects }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const isHovered = useRef(false)
  const containerRef = useRef<HTMLElement>(null)

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(((index % projects.length) + projects.length) % projects.length)
    },
    [projects.length],
  )

  const prev = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex])
  const next = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex])

  useEffect(() => {
    if (projects.length <= 1) return
    const id = setInterval(() => {
      if (!isHovered.current) {
        setCurrentIndex((i) => (i + 1) % projects.length)
      }
    }, 5000)
    return () => clearInterval(id)
  }, [projects.length])

  useEffect(() => {
    const el = containerRef.current
    if (!el || projects.length <= 1) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setCurrentIndex((i) => (i - 1 + projects.length) % projects.length)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        setCurrentIndex((i) => (i + 1) % projects.length)
      }
    }

    el.addEventListener('keydown', handleKeyDown)
    return () => el.removeEventListener('keydown', handleKeyDown)
  }, [projects.length])

  if (projects.length === 0) return null

  return (
    <section
      ref={containerRef}
      tabIndex={0}
      className="flex flex-col gap-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-lg"
      onMouseEnter={() => {
        isHovered.current = true
      }}
      onMouseLeave={() => {
        isHovered.current = false
      }}
      aria-roledescription="carousel"
      aria-label="Featured projects"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Featured Projects</h2>
        {projects.length > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={prev}
              aria-label="Previous project"
            >
              <ChevronLeftIcon aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={next}
              aria-label="Next project"
            >
              <ChevronRightIcon aria-hidden="true" />
            </Button>
          </div>
        )}
      </div>

      <FeaturedProjectCard project={projects[currentIndex]} />

      {projects.length > 1 && (
        <div className="flex justify-center gap-2">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`size-3 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
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
