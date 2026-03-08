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
  idoTokenAmount: z
    .number({ message: 'IDO token amount is required' })
    .min(1, 'IDO token amount must be at least 1'),
  tokenPrice: z
    .number({ message: 'Token price is required' })
    .min(0.000001, 'Token price must be at least 0.000001'),
  deadline: z
    .string({ message: 'Deadline is required' })
    .min(1, 'Deadline is required'),
})

export type ProjectInfoValues = z.infer<typeof projectInfoSchema>

// --- Single Milestone Schema ---
export const milestoneSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().min(1, 'Description is required'),
})

export type MilestoneValues = z.infer<typeof milestoneSchema>

// --- Milestones Form Schema (exactly 4 milestones) ---
export const milestonesFormSchema = z.object({
  milestones: z
    .array(milestoneSchema)
    .length(4, 'Exactly 4 milestones are required'),
})

export type MilestonesFormValues = z.infer<typeof milestonesFormSchema>

// --- Combined Form Schema ---
export const createProjectSchema = z.object({
  projectInfo: projectInfoSchema,
  milestones: z
    .array(milestoneSchema)
    .length(4, 'Exactly 4 milestones are required'),
})

export type CreateProjectValues = z.infer<typeof createProjectSchema>
