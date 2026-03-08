'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormProvider } from 'react-hook-form'
import { toast } from 'sonner'
import { ArrowLeftIcon, ArrowRightIcon, LoaderIcon, RocketIcon, XIcon } from 'lucide-react'
import { parseEther, parseUnits } from 'viem'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  StepIndicator,
  ProjectInfoStep,
  MilestoneStep,
  ReviewStep,
} from '@/components/launch'
import { useCreateProjectForm, useCreateProject } from '@/features/launch/hooks'
import { useCreateProjectContract } from '@/features/contracts'
import { useAuth } from '@/features/auth/hooks'
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
  const { isAuthenticated, login } = useAuth()
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

    if (IS_MOCK) {
      // Mock mode: use API mutation
      const payload = {
        name: projectInfo.name,
        symbol: projectInfo.ticker,
        tagline: projectInfo.tagline,
        description: projectInfo.description,
        image_uri: '',
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
    } else {
      // Real mode: use contract call
      const salt = `0x${Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('')}` as `0x${string}`

      const params = {
        name: projectInfo.name,
        symbol: projectInfo.ticker,
        tokenURI: '',
        idoTokenAmount: parseUnits(String(projectInfo.tokenSupply), 18),
        tokenPrice: (() => {
          const tokenSupplyBig = BigInt(projectInfo.tokenSupply)
          return tokenSupplyBig > BigInt(0)
            ? parseUnits(String(projectInfo.targetRaise), 6) / tokenSupplyBig
            : BigInt(0)
        })(),
        deadline: BigInt(Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60),
        milestonePercentages: milestones.map(m => BigInt(m.allocation)),
        salt,
      }

      const result = await createContract.execute(params)
      if (result) {
        reset()
        router.push(`/projects/${result.tokenAddress}`)
      }
    }
  }, [isAuthenticated, login, projectInfoForm, milestonesForm, createProjectMutation, createContract, reset, router])

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
