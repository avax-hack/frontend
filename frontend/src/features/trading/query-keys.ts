export const tradingKeys = {
  all: ['trading'] as const,
  list: (sortType: string, params?: Record<string, unknown>) =>
    [...tradingKeys.all, 'list', sortType, params] as const,
  detail: (tokenId: string) => [...tradingKeys.all, 'detail', tokenId] as const,
  chart: (tokenId: string, resolution: string) =>
    [...tradingKeys.all, 'chart', tokenId, resolution] as const,
  swapHistory: (tokenId: string, params?: Record<string, unknown>) =>
    [...tradingKeys.all, 'swapHistory', tokenId, params] as const,
  holders: (tokenId: string, params?: Record<string, unknown>) =>
    [...tradingKeys.all, 'holders', tokenId, params] as const,
  trend: () => [...tradingKeys.all, 'trend'] as const,
}
