const TAKEN_TICKERS = new Set(['AVAX', 'ETH'])

/** Mock ticker availability check. Rejects "AVAX" and "ETH". */
export async function checkTickerAvailability(
  ticker: string
): Promise<{ available: boolean }> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 300))
  return { available: !TAKEN_TICKERS.has(ticker.toUpperCase()) }
}
