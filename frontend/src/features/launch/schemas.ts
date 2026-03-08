import { z } from 'zod'

// --- URL validation helper: accept empty string or valid URL ---
const optionalUrl = z
  .union([z.literal(''), z.string().url('Invalid URL format')])
  .optional()

// --- Step 1: Project Info Schema ---
export const projectInfoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be 50 characters or less'),
  ticker: z
    .string()
    .trim()
    .min(2, 'Ticker must be at least 2 characters')
    .max(10, 'Ticker must be 10 characters or less')
    .regex(/^[A-Z0-9]+$/, 'Ticker must be uppercase alphanumeric'),
  tagline: z
    .string()
    .trim()
    .min(5, 'Tagline must be at least 5 characters')
    .max(120, 'Tagline must be 120 characters or less'),
  description: z
    .string()
    .trim()
    .min(20, 'Description must be at least 20 characters'),
  websiteUrl: optionalUrl,
  twitterUrl: optionalUrl,
  telegramUrl: optionalUrl,
  githubUrl: optionalUrl,
  targetRaise: z
    .number({ message: 'Target raise is required' })
    .min(1_000, 'Minimum target raise is $1,000')
    .max(10_000_000, 'Maximum target raise is $10,000,000'),
  tokenSupply: z
    .number({ message: 'Token supply is required' })
    .min(1, 'Token supply must be at least 1'),
})

export type ProjectInfoValues = z.infer<typeof projectInfoSchema>

// --- Single Milestone Schema ---
export const milestoneSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().min(1, 'Description is required'),
  allocation: z
    .number({ message: 'Allocation is required' })
    .min(1, 'Allocation must be at least 1%')
    .max(100, 'Allocation cannot exceed 100%'),
})

export type MilestoneValues = z.infer<typeof milestoneSchema>

// --- Milestones Form Schema (object wrapping the array for react-hook-form) ---
export const milestonesFormSchema = z.object({
  milestones: z
    .array(milestoneSchema)
    .min(2, 'At least 2 milestones are required')
    .max(6, 'Maximum 6 milestones allowed')
    .refine(
      (milestones) => {
        const sum = milestones.reduce((acc, m) => acc + (m.allocation || 0), 0)
        return sum === 100
      },
      { message: 'Milestone allocations must sum to 100%' }
    ),
})

export type MilestonesFormValues = z.infer<typeof milestonesFormSchema>

// --- Combined Form Schema ---
export const createProjectSchema = z.object({
  projectInfo: projectInfoSchema,
  milestones: z
    .array(milestoneSchema)
    .min(2, 'At least 2 milestones are required')
    .max(6, 'Maximum 6 milestones allowed')
    .refine(
      (milestones) => {
        const sum = milestones.reduce((acc, m) => acc + (m.allocation || 0), 0)
        return sum === 100
      },
      { message: 'Milestone allocations must sum to 100%' }
    ),
})

export type CreateProjectValues = z.infer<typeof createProjectSchema>
