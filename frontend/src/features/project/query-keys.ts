export const projectKeys = {
  all: ['project'] as const,
  featured: () => [...projectKeys.all, 'featured'] as const,
  list: (sortType: string, params?: Record<string, unknown>) =>
    [...projectKeys.all, 'list', sortType, params] as const,
  detail: (id: string) => [...projectKeys.all, 'detail', id] as const,
}
