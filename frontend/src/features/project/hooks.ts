'use client'

import { useQuery } from '@tanstack/react-query'
import { projectKeys } from './query-keys'
import { getFeaturedProjects, getProjectList, getProject } from './services'

export function useFeaturedProjects() {
  return useQuery({
    queryKey: projectKeys.featured(),
    queryFn: getFeaturedProjects,
  })
}

export function useProjectList(sortType: string = 'recent') {
  return useQuery({
    queryKey: projectKeys.list(sortType),
    queryFn: () => getProjectList(sortType),
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => getProject(id),
    enabled: !!id,
  })
}
