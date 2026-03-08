'use client'

import { useQuery } from '@tanstack/react-query'
import { projectKeys } from './query-keys'
import { getFeaturedProjects, getProjectList, getProjectDetail } from './services'

export function useFeaturedProjects() {
  return useQuery({
    queryKey: projectKeys.featured(),
    queryFn: getFeaturedProjects,
  })
}

export function useProjectList(
  sortType?: string,
  params?: { page?: number; limit?: number },
) {
  return useQuery({
    queryKey: projectKeys.list(sortType ?? 'recent', params),
    queryFn: () => getProjectList(sortType, params),
  })
}

export function useProjectDetail(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => getProjectDetail(id),
    enabled: !!id,
  })
}
