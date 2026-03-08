'use client'

import { useFormContext, useFieldArray } from 'react-hook-form'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { MilestonesFormValues } from '@/features/launch/schemas'

const MAX_MILESTONES = 6
const MIN_MILESTONES = 2

export function MilestoneStep() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<MilestonesFormValues>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'milestones',
  })

  const milestones = watch('milestones')
  const totalAllocation = milestones?.reduce(
    (sum, m) => sum + (Number(m?.allocation) || 0),
    0
  ) ?? 0

  const canAdd = fields.length < MAX_MILESTONES
  const canRemove = fields.length > MIN_MILESTONES

  // Root-level milestones errors (e.g., "allocations must sum to 100%")
  const rootError = errors.milestones?.root?.message ?? errors.milestones?.message

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Milestones</h2>
        <div
          className={cn(
            'text-sm font-medium',
            totalAllocation === 100 ? 'text-green-500' : 'text-destructive'
          )}
          aria-live="polite"
        >
          Total: {totalAllocation}%{' '}
          {totalAllocation !== 100 && '(must equal 100%)'}
        </div>
      </div>

      {rootError && (
        <p className="text-sm text-destructive" role="alert">
          {typeof rootError === 'string' ? rootError : ''}
        </p>
      )}

      {fields.map((field, index) => {
        const fieldErrors = errors.milestones?.[index]
        return (
          <Card key={field.id}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">
                Milestone {index + 1}
              </CardTitle>
              {canRemove && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => remove(index)}
                  aria-label={`Remove milestone ${index + 1}`}
                >
                  <TrashIcon className="size-4 text-destructive" />
                </Button>
              )}
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

              {/* Allocation */}
              <div className="flex flex-col gap-2">
                <Label htmlFor={`milestones.${index}.allocation`}>
                  Fund Allocation (%) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`milestones.${index}.allocation`}
                  type="number"
                  inputMode="decimal"
                  placeholder="25…"
                  min={1}
                  max={100}
                  autoComplete="off"
                  aria-invalid={!!fieldErrors?.allocation}
                  {...register(`milestones.${index}.allocation`, {
                    valueAsNumber: true,
                  })}
                />
                {fieldErrors?.allocation && (
                  <p className="text-sm text-destructive" role="alert">
                    {fieldErrors.allocation.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {canAdd && (
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({ title: '', description: '', allocation: 0 })
          }
          className="gap-2"
        >
          <PlusIcon className="size-4" aria-hidden="true" />
          Add Milestone
        </Button>
      )}
    </div>
  )
}
