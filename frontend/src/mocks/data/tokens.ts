import type { ITokenInfo, IMarketInfo } from '@/types/token'

export const mockTokens: { token_info: ITokenInfo; market_info: IMarketInfo }[] = [
  {
    token_info: {
      token_id: '0xA9cc000000000000000000000000000000007777',
      name: 'Project Alpha',
      symbol: 'ALPHA',
      image_uri: '',
      description: 'Project Alpha is a DeFi protocol.',
      category: 'defi',
      is_graduated: false,
      created_at: 1714521600,
      project_id: '0x1234000000000000000000000000000000005678',
    },
    market_info: {
      market_type: 'CURVE',
      token_id: '0xA9cc000000000000000000000000000000007777',
      token_price: '0.0256',
      native_price: '32.50',
      price: '0.000787',
      ath_price: '0.12',
      total_supply: '100000000000000000000000000',
      volume: '8300000000000000000000',
      holder_count: 342,
      bonding_percent: 65,
      milestone_completed: 1,
      milestone_total: 4,
    },
  },
]
