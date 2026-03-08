'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormProvider } from 'react-hook-form'
import { toast } from 'sonner'
import { ArrowLeftIcon, ArrowRightIcon, LoaderIcon, RocketIcon, XIcon } from 'lucide-react'
import { parseEther } from 'viem'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  StepIndicator,
  ProjectInfoStep,
  MilestoneStep,
  ReviewStep,
} from '@/components/launch'
import { useCreateProjectForm, useCreateProject } from '@/features/launch/hooks'
import { useAuth } from '@/features/auth/hooks'

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
  const router = useRouter()
  const { isAuthenticated, login } = useAuth()
  const createProjectMutation = useCreateProject()

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

  const handleLaunch = useCallback(async () => {
    // Auth gate
    if (!isAuthenticated) {
      await login()
      return // User needs to click again after auth
    }

    const projectInfo = projectInfoForm.getValues()
    const milestones = milestonesForm.getValues().milestones

    // Map form data to API payload
    const payload = {
      name: projectInfo.name,
      symbol: projectInfo.ticker,
      tagline: projectInfo.tagline,
      description: projectInfo.description,
      image_uri: '', // TODO: Upload logo file and get URI. For now, empty string.
      website: projectInfo.websiteUrl || null,
      twitter: projectInfo.twitterUrl || null,
      github: projectInfo.githubUrl || null,
      target_raise: parseEther(String(projectInfo.targetRaise)).toString(),
      token_supply: parseEther(String(projectInfo.tokenSupply)).toString(),
      milestones: milestones.map((m, i) => ({
        order: i + 1,
        title: m.title,
        description: m.description,
        fund_allocation_percent: m.allocation,
      })),
    }

    try {
      const result = await createProjectMutation.mutateAsync(payload)
      toast.success('Project launched successfully!', {
        description: 'Your project has been created.',
      })
      reset()
      router.push(`/projects/${result.project_id}`)
    } catch {
      // Error already handled by mutation's onError
    }
  }, [isAuthenticated, login, projectInfoForm, milestonesForm, createProjectMutation, reset, router])

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
            disabled={createProjectMutation.isPending}
          >
            {createProjectMutation.isPending ? (
              <LoaderIcon className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <RocketIcon className="size-4" aria-hidden="true" />
            )}
            {createProjectMutation.isPending ? 'Launching…' : 'Launch Project'}
          </Button>
        )}
      </nav>
    </div>
  )
}
