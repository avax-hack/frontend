export const authKeys = {
  all: ['auth'] as const,
  account: () => [...authKeys.all, 'account'] as const,
  session: (address?: string) => [...authKeys.all, 'session', address] as const,
}
