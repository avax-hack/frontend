export const portfolioKeys = {
  all: ['portfolio'] as const,
  summary: (accountId: string) =>
    [...portfolioKeys.all, 'summary', accountId] as const,
  holdTokens: (accountId: string, params?: Record<string, unknown>) =>
    [...portfolioKeys.all, 'holdTokens', accountId, params] as const,
  idoHistory: (accountId: string, params?: Record<string, unknown>) =>
    [...portfolioKeys.all, 'idoHistory', accountId, params] as const,
  swapHistory: (accountId: string, params?: Record<string, unknown>) =>
    [...portfolioKeys.all, 'swapHistory', accountId, params] as const,
  refundHistory: (accountId: string, params?: Record<string, unknown>) =>
    [...portfolioKeys.all, 'refundHistory', accountId, params] as const,
}
