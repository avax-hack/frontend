'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { FeaturedProjectCard } from './FeaturedProjectCard'
import type { IProjectListItem } from '@/types/project'

interface FeaturedCarouselProps {
  projects: IProjectListItem[]
}

export function FeaturedCarousel({ projects }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slideDir, setSlideDir] = useState<'left' | 'right' | null>(null)
  const isHovered = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const dragStartX = useRef(0)
  const dragDeltaX = useRef(0)
  const isDragging = useRef(false)
  const hasDragged = useRef(false)

  const wrap = useCallback((i: number) => ((i % projects.length) + projects.length) % projects.length, [projects.length])

  const slideTo = useCallback((dir: 'left' | 'right') => {
    setSlideDir(dir)
    setTimeout(() => {
      setCurrentIndex((i) => wrap(dir === 'left' ? i + 1 : i - 1))
      setSlideDir(null)
    }, 700)
  }, [wrap])

  // Auto-play
  useEffect(() => {
    if (projects.length <= 1) return
    const id = setInterval(() => {
      if (!isHovered.current && !isDragging.current) {
        slideTo('left')
      }
    }, 5000)
    return () => clearInterval(id)
  }, [projects.length, slideTo])

  // Keyboard
  useEffect(() => {
    const el = containerRef.current
    if (!el || projects.length <= 1) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); slideTo('right') }
      else if (e.key === 'ArrowRight') { e.preventDefault(); slideTo('left') }
    }
    el.addEventListener('keydown', handleKeyDown)
    return () => el.removeEventListener('keydown', handleKeyDown)
  }, [projects.length, slideTo])

  // Mouse drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (projects.length <= 1 || slideDir) return
    e.preventDefault()
    isDragging.current = true
    hasDragged.current = false
    dragStartX.current = e.clientX
    dragDeltaX.current = 0
  }, [projects.length, slideDir])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return
    dragDeltaX.current = e.clientX - dragStartX.current
    if (Math.abs(dragDeltaX.current) > 5) hasDragged.current = true
  }, [])

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return
    isDragging.current = false
    if (Math.abs(dragDeltaX.current) > 50) {
      slideTo(dragDeltaX.current < 0 ? 'left' : 'right')
    }
    dragDeltaX.current = 0
  }, [slideTo])

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (hasDragged.current) {
      e.preventDefault()
      e.stopPropagation()
      hasDragged.current = false
    }
  }, [])

  // Touch drag
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (projects.length <= 1 || slideDir) return
    isDragging.current = true
    hasDragged.current = false
    dragStartX.current = e.touches[0].clientX
    dragDeltaX.current = 0
  }, [projects.length, slideDir])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return
    dragDeltaX.current = e.touches[0].clientX - dragStartX.current
    if (Math.abs(dragDeltaX.current) > 5) hasDragged.current = true
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return
    isDragging.current = false
    if (Math.abs(dragDeltaX.current) > 50) {
      slideTo(dragDeltaX.current < 0 ? 'left' : 'right')
    }
    dragDeltaX.current = 0
  }, [slideTo])

  if (projects.length === 0) return null

  const nextIndex = wrap(currentIndex + 1)
  const prevIndex = wrap(currentIndex - 1)

  // Animation classes
  const getAnimClass = () => {
    if (!slideDir) return 'translate-x-0'
    return slideDir === 'left' ? '-translate-x-full' : 'translate-x-full'
  }
  const getNextAnimClass = () => {
    if (!slideDir) return 'translate-x-full'
    return slideDir === 'left' ? 'translate-x-0' : 'translate-x-0'
  }
  const incomingIndex = slideDir === 'left' ? nextIndex : prevIndex

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="relative cursor-grab select-none overflow-hidden rounded-2xl active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-ring"
      onMouseEnter={() => { isHovered.current = true }}
      onMouseLeave={() => { isHovered.current = false; if (isDragging.current) { isDragging.current = false; dragDeltaX.current = 0 } }}
      onMouseDownCapture={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUpCapture={handleMouseUp}
      onClickCapture={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Featured projects"
    >
      {/* Current card */}
      <div className={`${slideDir ? 'transition-transform duration-700 ease-in-out' : ''} ${getAnimClass()}`}>
        <FeaturedProjectCard
          project={projects[currentIndex]}
          totalSlides={projects.length}
          currentSlide={currentIndex}
          onSlideChange={(i) => {
            if (i > currentIndex) slideTo('left')
            else if (i < currentIndex) slideTo('right')
            else setCurrentIndex(i)
          }}
        />
      </div>

      {/* Incoming card */}
      {slideDir && (
        <div className={`absolute inset-0 transition-transform duration-700 ease-in-out ${getNextAnimClass()}`}
          style={{ transform: slideDir === 'left' ? 'translateX(100%)' : 'translateX(-100%)' }}
          ref={(el) => {
            if (el && slideDir) {
              // Force reflow then animate to 0
              el.getBoundingClientRect()
              el.style.transform = 'translateX(0)'
            }
          }}
        >
          <FeaturedProjectCard
            project={projects[incomingIndex]}
            totalSlides={projects.length}
            currentSlide={incomingIndex}
            onSlideChange={() => {}}
          />
        </div>
      )}
    </div>
  )
}
