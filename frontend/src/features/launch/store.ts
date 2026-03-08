import { create } from 'zustand'
import type { ProjectInfoValues, MilestoneValues } from './schemas'

export type FormStep = 1 | 2 | 3

const DEFAULT_PROJECT_INFO: ProjectInfoValues = {
  name: '',
  category: 'meme',
  ticker: '',
  description: '',
  websiteUrl: undefined,
  twitterUrl: undefined,
  telegramUrl: undefined,
  githubUrl: undefined,
  idoTokenAmount: 0,
  tokenPrice: 0,
  deadline: '',
}

const DEFAULT_MILESTONES: MilestoneValues[] = [
  { title: '', description: '' },
  { title: '', description: '' },
  { title: '', description: '' },
  { title: '', description: '' },
]

interface CreateProjectState {
  step: FormStep
  projectInfo: ProjectInfoValues
  milestones: MilestoneValues[]
  logoFile: File | null
  logoPreview: string | null

  setStep: (step: FormStep) => void
  updateProjectInfo: (info: Partial<ProjectInfoValues>) => void
  updateMilestones: (milestones: MilestoneValues[]) => void
  setLogo: (file: File | null) => void
  reset: () => void
}

export const useCreateProjectStore = create<CreateProjectState>((set) => ({
  step: 1,
  projectInfo: { ...DEFAULT_PROJECT_INFO },
  milestones: [...DEFAULT_MILESTONES],
  logoFile: null,
  logoPreview: null,

  setStep: (step) => set({ step }),

  updateProjectInfo: (info) =>
    set((state) => ({
      projectInfo: { ...state.projectInfo, ...info },
    })),

  updateMilestones: (milestones) => set({ milestones }),

  setLogo: (file) => {
    if (file) {
      const preview = URL.createObjectURL(file)
      set((state) => {
        if (state.logoPreview) URL.revokeObjectURL(state.logoPreview)
        return { logoFile: file, logoPreview: preview }
      })
    } else {
      set((state) => {
        if (state.logoPreview) URL.revokeObjectURL(state.logoPreview)
        return { logoFile: null, logoPreview: null }
      })
    }
  },

  reset: () =>
    set((state) => {
      if (state.logoPreview) URL.revokeObjectURL(state.logoPreview)
      return {
        step: 1,
        projectInfo: { ...DEFAULT_PROJECT_INFO },
        milestones: [...DEFAULT_MILESTONES],
        logoFile: null,
        logoPreview: null,
      }
    }),
}))
