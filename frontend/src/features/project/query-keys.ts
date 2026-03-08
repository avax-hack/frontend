export const projectKeys = {
  all: ['project'] as const,
  featured: () => [...projectKeys.all, 'featured'] as const,
  list: (sortType: string) => [...projectKeys.all, 'list', sortType] as const,
  detail: (id: string) => [...projectKeys.all, 'detail', id] as const,
}
