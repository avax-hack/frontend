import { httpGet, httpPost } from '@/lib/api'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''

export function checkTickerAvailability(
  ticker: string
): Promise<{ available: boolean }> {
  return httpGet<{ available: boolean }>(
    `/project/validate-symbol?symbol=${encodeURIComponent(ticker)}`,
  )
}

export async function uploadImage(file: File): Promise<{ image_uri: string }> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_BASE}/metadata/image`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? 'Image upload failed')
  }

  return res.json()
}

// --- Project Creation ---

export interface CreateProjectPayload {
  name: string
  symbol: string
  tagline: string
  description: string
  image_uri: string
  website: string | null
  twitter: string | null
  github: string | null
  target_raise: string // wei string
  token_supply: string // wei string
  milestones: {
    order: number
    title: string
    description: string
    fund_allocation_percent: number
  }[]
}

export interface CreateProjectResponse {
  project_id: string
}

export function createProject(
  payload: CreateProjectPayload,
): Promise<CreateProjectResponse> {
  return httpPost<CreateProjectResponse>('/project/create', {
    body: payload,
    auth: 'cookie',
  })
}
