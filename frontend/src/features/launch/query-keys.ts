export const launchKeys = {
  all: ['launch'] as const,
  tickerCheck: (ticker: string) =>
    [...launchKeys.all, 'ticker-check', ticker] as const,
}
