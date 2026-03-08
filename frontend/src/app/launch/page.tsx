'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormProvider } from 'react-hook-form'
import { toast } from 'sonner'
import { ArrowLeftIcon, ArrowRightIcon, LoaderIcon, RocketIcon, XIcon } from 'lucide-react'
import { parseUnits, getAddress } from 'viem'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  StepIndicator,
  ProjectInfoStep,
  MilestoneStep,
  ReviewStep,
} from '@/components/launch'
import { useCreateProjectForm, useCreateProject } from '@/features/launch/hooks'
import { uploadImage } from '@/features/launch/services'
import { useCreateProjectContract } from '@/features/contracts'
import { useProfile, useAuth } from '@/features/auth/hooks'
import { IS_MOCK } from '@/lib/mock'

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
  const { isAuthenticated } = useProfile()
  const { login } = useAuth()
  const createProjectMutation = useCreateProject()
  const createContract = useCreateProjectContract()

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

    // Upload logo if provided
    let imageUri = ''
    if (logoFile) {
      try {
        const { image_uri } = await uploadImage(logoFile)
        imageUri = image_uri
      } catch {
        toast.error('Failed to upload image')
        return
      }
    }

    // 1. Register metadata on backend
    const payload = {
      name: projectInfo.name,
      symbol: projectInfo.ticker,
      category: projectInfo.category,
      description: projectInfo.description,
      image_uri: imageUri,
      website: projectInfo.websiteUrl || null,
      twitter: projectInfo.twitterUrl || null,
      github: projectInfo.githubUrl || null,
      target_raise: parseUnits(String(projectInfo.idoTokenAmount * projectInfo.tokenPrice), 6).toString(),
      token_supply: parseUnits(String(projectInfo.idoTokenAmount), 18).toString(),
      deadline: Math.floor(new Date(projectInfo.deadline).getTime() / 1000),
      milestones: milestones.map((m, i) => ({
        order: i + 1,
        title: m.title,
        description: m.description,
        fund_allocation_percent: 25,
      })),
    }

    let backendResult
    try {
      backendResult = await createProjectMutation.mutateAsync(payload)
    } catch {
      // Error already handled by mutation's onError
      return
    }

    if (IS_MOCK) {
      toast.success('Project launched successfully!', {
        description: 'Your project has been created.',
      })
      reset()
      router.push(`/projects/${getAddress(backendResult.project_id)}`)
    } else {
      // 2. Backend succeeded → execute contract
      const salt = `0x${Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('')}` as `0x${string}`

      const params = {
        name: projectInfo.name,
        symbol: projectInfo.ticker,
        tokenURI: imageUri,
        idoTokenAmount: parseUnits(String(projectInfo.idoTokenAmount), 18),
        tokenPrice: parseUnits(String(projectInfo.tokenPrice), 6),
        deadline: BigInt(Math.floor(new Date(projectInfo.deadline).getTime() / 1000)),
        milestonePercentages: [BigInt(2500), BigInt(2500), BigInt(2500), BigInt(2500)],
        salt,
      }

      const result = await createContract.execute(params)
      if (result) {
        reset()
        router.push(`/projects/${getAddress(result.tokenAddress)}`)
      }
    }
  }, [isAuthenticated, login, projectInfoForm, milestonesForm, logoFile, createProjectMutation, createContract, reset, router])

  const handleCancel = useCallback(() => {
    reset()
  }, [reset])

  // Launch button state
  const isLaunching = IS_MOCK
    ? createProjectMutation.isPending
    : createContract.step !== 'idle' && createContract.step !== 'success' && createContract.step !== 'error'

  const launchButtonText = IS_MOCK
    ? (createProjectMutation.isPending ? 'Launching…' : 'Launch Project')
    : createContract.step === 'executing'
      ? 'Creating…'
      : createContract.step === 'waiting-execution'
        ? 'Confirming…'
        : 'Launch Project'

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
            disabled={isLaunching}
          >
            {isLaunching ? (
              <LoaderIcon className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <RocketIcon className="size-4" aria-hidden="true" />
            )}
            {launchButtonText}
          </Button>
        )}
      </nav>
    </div>
  )
}
