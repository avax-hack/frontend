export const builderKeys = {
  all: ['builder'] as const,
  createdProjects: (accountId: string) =>
    [...builderKeys.all, 'createdProjects', accountId] as const,
  overview: (projectId: string) =>
    [...builderKeys.all, 'overview', projectId] as const,
  stats: (projectId: string) =>
    [...builderKeys.all, 'stats', projectId] as const,
  verification: (milestoneId: string) =>
    [...builderKeys.all, 'verification', milestoneId] as const,
}
