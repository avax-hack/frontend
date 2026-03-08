'use client'

import { CheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = [
  { label: 'Project Info' },
  { label: 'Milestones' },
  { label: 'Review' },
] as const

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Project creation progress" className="flex items-center gap-2">
      {STEPS.map((step, i) => {
        const stepNumber = ([1, 2, 3] as const)[i]
        const isDone = stepNumber < currentStep
        const isActive = stepNumber === currentStep
        const isPending = stepNumber > currentStep

        return (
          <div key={step.label} className="flex items-center gap-2">
            {/* Step circle */}
            <div className="flex items-center gap-2">
              <div
                aria-current={isActive ? 'step' : undefined}
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors',
                  isDone && 'bg-green-500 text-white',
                  isActive && 'bg-primary text-primary-foreground',
                  isPending && 'border-2 border-muted-foreground/30 text-muted-foreground'
                )}
              >
                {isDone ? (
                  <CheckIcon className="size-4" aria-hidden="true" />
                ) : (
                  stepNumber
                )}
                <span className="sr-only">
                  Step {stepNumber}: {step.label}
                  {isDone && ' (completed)'}
                  {isActive && ' (current)'}
                  {isPending && ' (upcoming)'}
                </span>
              </div>
              <span
                className={cn(
                  'hidden text-sm font-medium sm:inline',
                  isDone && 'text-green-500',
                  isActive && 'text-foreground',
                  isPending && 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div
                aria-hidden="true"
                className={cn(
                  'h-px w-8 sm:w-12',
                  stepNumber < currentStep ? 'bg-green-500' : 'bg-muted-foreground/30'
                )}
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}
