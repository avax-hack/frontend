import { httpGet, ApiError } from '@/lib/api'
import type { IProjectFeaturedData, IProjectListData, IProjectData } from '@/types/project'

export async function getFeaturedProjects(): Promise<IProjectFeaturedData> {
  return httpGet<IProjectFeaturedData>('/project/featured')
}

export async function getProjectList(sortType: string = 'recent'): Promise<IProjectListData> {
  return httpGet<IProjectListData>(`/order/project/${sortType}`)
}

export async function getProject(id: string): Promise<IProjectData | null> {
  try {
    return await httpGet<IProjectData>(`/project/${id}`)
  } catch (e) {
    if (e instanceof ApiError && e.isNotFound) return null
    throw e
  }
}
