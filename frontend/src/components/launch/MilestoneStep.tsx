'use client'

import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { MilestonesFormValues } from '@/features/launch/schemas'

const MILESTONE_LABELS = [
  'Milestone 1',
  'Milestone 2',
  'Milestone 3',
  'Milestone 4',
]

export function MilestoneStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<MilestonesFormValues>()

  // Root-level milestones errors
  const rootError = errors.milestones?.root?.message ?? errors.milestones?.message

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Milestones</h2>
        <p className="text-sm text-white/40">
          4 milestones · 25% each
        </p>
      </div>

      {rootError && (
        <p className="text-sm text-destructive" role="alert">
          {typeof rootError === 'string' ? rootError : ''}
        </p>
      )}

      {MILESTONE_LABELS.map((label, index) => {
        const fieldErrors = errors.milestones?.[index]
        return (
          <Card key={label}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">{label}</CardTitle>
              <Badge variant="outline" className="shrink-0">
                25%
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* Title */}
              <div className="flex flex-col gap-2">
                <Label htmlFor={`milestones.${index}.title`}>
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`milestones.${index}.title`}
                  placeholder="MVP Launch…"
                  autoComplete="off"
                  aria-invalid={!!fieldErrors?.title}
                  {...register(`milestones.${index}.title`)}
                />
                {fieldErrors?.title && (
                  <p className="text-sm text-destructive" role="alert">
                    {fieldErrors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <Label htmlFor={`milestones.${index}.description`}>
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id={`milestones.${index}.description`}
                  placeholder="Describe what will be delivered…"
                  rows={3}
                  autoComplete="off"
                  aria-invalid={!!fieldErrors?.description}
                  {...register(`milestones.${index}.description`)}
                />
                {fieldErrors?.description && (
                  <p className="text-sm text-destructive" role="alert">
                    {fieldErrors.description.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
