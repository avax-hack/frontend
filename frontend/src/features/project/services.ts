import { httpGet } from '@/lib/api'
import { ApiError } from '@/lib/api'
import type { IProjectFeaturedData, IProjectListData, IProjectData } from '@/types/project'

export function getFeaturedProjects(): Promise<IProjectFeaturedData> {
  return httpGet<IProjectFeaturedData>('/project/featured')
}

export function getProjectList(
  sortType: string = 'recent',
  params?: { page?: number; limit?: number },
): Promise<IProjectListData> {
  const searchParams = new URLSearchParams()
  if (params?.page !== undefined) searchParams.set('page', String(params.page))
  if (params?.limit !== undefined) searchParams.set('limit', String(params.limit))
  const query = searchParams.toString()
  const path = `/order/project/${sortType}${query ? `?${query}` : ''}`
  return httpGet<IProjectListData>(path)
}

export async function getProjectDetail(id: string): Promise<IProjectData | null> {
  try {
    return await httpGet<IProjectData>(`/project/${id}`)
  } catch (e) {
    if (e instanceof ApiError && e.isNotFound) return null
    throw e
  }
}
