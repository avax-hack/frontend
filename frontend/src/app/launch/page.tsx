'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { FormProvider } from 'react-hook-form'
import { toast } from 'sonner'
import { ArrowLeftIcon, ArrowRightIcon, LoaderIcon, RocketIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  StepIndicator,
  ProjectInfoStep,
  MilestoneStep,
  ReviewStep,
} from '@/components/launch'
import { useCreateProjectForm } from '@/features/launch/hooks'

export default function LaunchPage() {
  const {
    projectInfoForm,
    milestonesForm,
    step,
    goNext,
    goBack,
    logoFile,
    logoPreview,
    logoError,
    setLogo,
    reset,
  } = useCreateProjectForm()

  const [isValidating, setIsValidating] = useState(false)

  // Warn on page leave if form is dirty
  const projectDirty = projectInfoForm.formState.isDirty
  const milestonesDirty = milestonesForm.formState.isDirty
  const isDirty = projectDirty || milestonesDirty

  useEffect(() => {
    if (!isDirty) return

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  const handleNext = useCallback(async () => {
    setIsValidating(true)
    try {
      const success = await goNext()
      if (!success) {
        const firstError = document.querySelector('[aria-invalid="true"]')
        if (firstError instanceof HTMLElement) firstError.focus()
      }
    } finally {
      setIsValidating(false)
    }
  }, [goNext])

  const handleLaunch = useCallback(() => {
    toast.info(
      'Coming soon! Contract deployment will be available in Phase 3.',
      { duration: 5000 }
    )
  }, [])

  const handleCancel = useCallback(() => {
    reset()
  }, [reset])

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-8">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Launch Your Project</h1>
        <Button
          variant="ghost"
          size="sm"
          asChild
        >
          <Link href="/explore" onClick={handleCancel}>
            <XIcon className="size-4" aria-hidden="true" />
            Cancel
          </Link>
        </Button>
      </div>

      {/* Step indicator */}
      <StepIndicator currentStep={step} />

      {/* Form content in card */}
      <Card>
        <CardContent className="p-6">
          {step === 1 && (
            <FormProvider {...projectInfoForm}>
              <ProjectInfoStep
                logoFile={logoFile}
                logoPreview={logoPreview}
                logoError={logoError}
                onLogoChange={setLogo}
              />
            </FormProvider>
          )}

          {step === 2 && (
            <FormProvider {...milestonesForm}>
              <MilestoneStep />
            </FormProvider>
          )}

          {step === 3 && (
            <ReviewStep
              projectInfo={projectInfoForm.getValues()}
              milestones={milestonesForm.getValues().milestones}
              logoFile={logoFile}
              logoPreview={logoPreview}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <nav aria-label="Form navigation" className="flex items-center justify-between">
        {step > 1 ? (
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            disabled={isValidating}
          >
            <ArrowLeftIcon className="size-4" aria-hidden="true" />
            Back
          </Button>
        ) : (
          <Button variant="outline" asChild>
            <Link href="/explore">
              <ArrowLeftIcon className="size-4" aria-hidden="true" />
              Explore
            </Link>
          </Button>
        )}

        {step < 3 ? (
          <Button
            type="button"
            onClick={handleNext}
            disabled={isValidating}
          >
            {isValidating ? (
              <LoaderIcon className="size-4 animate-spin" aria-hidden="true" />
            ) : null}
            Next
            {!isValidating && (
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            )}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleLaunch}
          >
            <RocketIcon className="size-4" aria-hidden="true" />
            Launch Project
          </Button>
        )}
      </nav>
    </div>
  )
}
