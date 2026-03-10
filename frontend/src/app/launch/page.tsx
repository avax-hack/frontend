'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormProvider } from 'react-hook-form'
import { toast } from 'sonner'
import { ArrowLeftIcon, ArrowRightIcon, LoaderIcon, RocketIcon, XIcon } from 'lucide-react'
import { parseUnits, getAddress } from 'viem'
import { Button } from '@/components/ui/button'
// Card removed — using glass div for dark theme
import {
  StepIndicator,
  ProjectInfoStep,
  MilestoneStep,
  ReviewStep,
} from '@/components/launch'
import { useCreateProjectForm, useCreateProject } from '@/features/launch/hooks'
import { uploadImage, createMetadata } from '@/features/launch/services'
import { useCreateProjectContract } from '@/features/contracts'
import { getProjectDetail } from '@/features/project/services'
import { useProfile, useAuth } from '@/features/auth/hooks'
import { IS_MOCK } from '@/lib/mock'

/** Poll until the project appears in the DB, then redirect */
async function waitForProjectAndRedirect(
  projectId: string,
  router: ReturnType<typeof useRouter>,
  reset: () => void,
) {
  const addr = getAddress(projectId)
  const maxAttempts = 120 // ~2 min at 1s intervals
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const project = await getProjectDetail(addr)
      if (project) {
        // Project exists in DB
        reset()
        router.push(`/projects/${addr}`)
        return
      }
    } catch {
      // Network error — retry
    }
    // Not yet — wait and retry
    await new Promise((r) => setTimeout(r, 1000))
  }
  // Fallback: redirect anyway after timeout
  reset()
  router.push(`/projects/${addr}`)
}

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

    const milestonePayload = milestones.map((m, i) => ({
      order: i + 1,
      title: m.title,
      description: m.description,
      fund_allocation_percent: 25,
    }))

    // Step 1: Upload image
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

    // Step 2: Create metadata JSON on R2
    let metadataUri = ''
    try {
      const { metadata_uri } = await createMetadata({
        name: projectInfo.name,
        symbol: projectInfo.ticker,
        image_uri: imageUri,
        category: projectInfo.category,
        homepage: projectInfo.websiteUrl || undefined,
        twitter: projectInfo.twitterUrl || undefined,
        telegram: projectInfo.telegramUrl || undefined,
        milestones: milestonePayload,
      })
      metadataUri = metadata_uri
    } catch {
      toast.error('Failed to create metadata')
      return
    }

    // Step 3: Register project on backend
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
      milestones: milestonePayload,
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
        description: 'Waiting for project to appear on-chain…',
      })
      await waitForProjectAndRedirect(backendResult.project_id, router, reset)
    } else {
      // Step 4: Execute on-chain contract with metadata_uri as tokenURI
      const salt = `0x${Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('')}` as `0x${string}`

      const params = {
        name: projectInfo.name,
        symbol: projectInfo.ticker,
        tokenURI: metadataUri,
        idoTokenAmount: parseUnits(String(projectInfo.idoTokenAmount), 18),
        tokenPrice: parseUnits(String(projectInfo.tokenPrice), 6),
        deadline: BigInt(Math.floor(new Date(projectInfo.deadline).getTime() / 1000)),
        milestonePercentages: [BigInt(2500), BigInt(2500), BigInt(2500), BigInt(2500)],
        salt,
      }

      const result = await createContract.execute(params)
      if (result) {
        toast.success('Project created on-chain!', {
          description: 'Waiting for indexer to pick it up…',
        })
        await waitForProjectAndRedirect(result.tokenAddress, router, reset)
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
    <div className="relative -mt-[var(--header-h)] flex min-h-screen flex-col pt-[var(--header-h)] [--header-h:65px]">
      {/* Full-page background */}
      <div className="absolute inset-0 -z-10">
        <img src="/hero-bg.webp" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[#070b14]/80 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#070b14]/90" />
      </div>

      <div className="dark-form mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 pt-12 pb-16">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Launch Your Project</h1>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <Link href="/explore" onClick={handleCancel}>
              <XIcon className="size-4" aria-hidden="true" />
              Cancel
            </Link>
          </Button>
        </div>

        {/* Step indicator */}
        <StepIndicator currentStep={step} />

        {/* Form content in glass card */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm">
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
        </div>

        {/* Navigation buttons */}
        <nav aria-label="Form navigation" className="flex items-center justify-between">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={isValidating}
              className="border-white/10 text-white hover:bg-white/5"
            >
              <ArrowLeftIcon className="size-4" aria-hidden="true" />
              Back
            </Button>
          ) : (
            <Button variant="outline" asChild className="border-white/10 text-white hover:bg-white/5">
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
              variant="gradient"
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
              variant="gradient"
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
    </div>
  )
}
