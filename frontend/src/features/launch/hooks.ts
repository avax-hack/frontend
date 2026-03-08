'use client'

import { useCallback, useEffect, useState } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  projectInfoSchema,
  milestonesFormSchema,
  type ProjectInfoValues,
  type MilestoneValues,
  type MilestonesFormValues,
} from './schemas'
import { useCreateProjectStore, type FormStep } from './store'
import { checkTickerAvailability, createProject } from './services'
import { launchKeys } from './query-keys'
import { projectKeys } from '@/features/project/query-keys'
import { ApiError } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'

interface CreateProjectForm {
  projectInfoForm: UseFormReturn<ProjectInfoValues>
  milestonesForm: UseFormReturn<MilestonesFormValues>
  step: FormStep
  setStep: (step: FormStep) => void
  goNext: () => Promise<boolean>
  goBack: () => void
  logoFile: File | null
  logoPreview: string | null
  logoError: string | null
  setLogo: (file: File | null) => void
  reset: () => void
}

export function useCreateProjectForm(): CreateProjectForm {
  const store = useCreateProjectStore()
  const [logoError, setLogoError] = useState<string | null>(null)

  const projectInfoForm = useForm<ProjectInfoValues>({
    resolver: zodResolver(projectInfoSchema),
    defaultValues: store.projectInfo,
    mode: 'onBlur',
  })

  const milestonesForm = useForm<MilestonesFormValues>({
    resolver: zodResolver(milestonesFormSchema),
    defaultValues: { milestones: store.milestones },
    mode: 'onBlur',
  })

  // Sync project info changes to store
  useEffect(() => {
    const subscription = projectInfoForm.watch((values) => {
      store.updateProjectInfo(values)
    })
    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectInfoForm.watch])

  // Sync milestones changes to store
  useEffect(() => {
    const subscription = milestonesForm.watch((values) => {
      const validMilestones = values.milestones?.filter(
        (m): m is MilestoneValues =>
          m !== undefined && m.title !== undefined
      )
      if (validMilestones) {
        store.updateMilestones(validMilestones)
      }
    })
    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [milestonesForm.watch])

  const goNext = useCallback(async (): Promise<boolean> => {
    if (store.step === 1) {
      const valid = await projectInfoForm.trigger()
      if (!store.logoFile) {
        setLogoError('Logo is required')
      }
      if (!valid || !store.logoFile) return false
      setLogoError(null)
      store.setStep(2)
      return true
    }
    if (store.step === 2) {
      const valid = await milestonesForm.trigger()
      if (!valid) return false
      store.setStep(3)
      return true
    }
    return false
  }, [store, projectInfoForm, milestonesForm])

  const goBack = useCallback(() => {
    if (store.step === 2) store.setStep(1)
    else if (store.step === 3) store.setStep(2)
  }, [store])

  const reset = useCallback(() => {
    store.reset()
    setLogoError(null)
    projectInfoForm.reset()
    milestonesForm.reset({
      milestones: [
        { title: '', description: '' },
        { title: '', description: '' },
        { title: '', description: '' },
        { title: '', description: '' },
      ],
    })
  }, [store, projectInfoForm, milestonesForm])

  return {
    projectInfoForm,
    milestonesForm,
    step: store.step,
    setStep: store.setStep,
    goNext,
    goBack,
    logoFile: store.logoFile,
    logoPreview: store.logoPreview,
    logoError,
    setLogo: store.setLogo,
    reset,
  }
}

/** Debounced ticker availability check */
export function useTickerAvailability(ticker: string) {
  const trimmed = ticker.trim().toUpperCase()
  return useQuery({
    queryKey: launchKeys.tickerCheck(trimmed),
    queryFn: () => checkTickerAvailability(trimmed),
    enabled: trimmed.length >= 2,
    staleTime: 30_000,
  })
}

/** Mutation hook for creating a project */
export function useCreateProject() {
  const queryClient = useQueryClient()
  const clearAccount = useAuthStore((s) => s.clearAccount)

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        if (error.isUnauthorized) {
          clearAccount()
          toast.error('Session expired', {
            description: 'Please sign in again and retry.',
          })
        } else {
          toast.error('Failed to create project', {
            description: error.serverMessage ?? 'Network error. Please try again.',
          })
        }
      } else {
        toast.error('Failed to create project')
      }
    },
  })
}
