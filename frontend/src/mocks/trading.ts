import type { ITokenData } from '@/types/token'
import type { ISwapRecord } from '@/features/trading/types'

// --- 6 tokens covering all categories ---
// 4 CURVE (not graduated), 2 DEX (graduated)
// Milestone scores: 0, 1, 2, 3, 4 distributed

export const mockTradingTokens: ITokenData[] = [
  {
    token_info: {
      token_id: '0xTRADE_DEFI_001',
      name: 'AvaLend Protocol',
      symbol: 'ALEND',
      image_uri: '',
      description: 'Decentralized lending and borrowing on Avalanche.',
      category: 'defi',
      is_graduated: false,
      created_at: 1714521600,
      project_id: '0xPROJ_DEFI_001',
      website: 'https://avalend.example.com',
      twitter: 'https://twitter.com/avalend',
      telegram: null,
    },
    market_info: {
      market_type: 'CURVE',
      token_id: '0xTRADE_DEFI_001',
      token_price: '0.0256',
      native_price: '32.50',
      price: '0.000787',
      ath_price: '0.0312',
      total_supply: '100000000000000000000000000',
      volume: '8300000000000000000000',
      holder_count: 342,
      bonding_percent: 65,
      milestone_completed: 2,
      milestone_total: 4,
    },
  },
  {
    token_info: {
      token_id: '0xTRADE_INFRA_002',
      name: 'SubnetBridge',
      symbol: 'SBRIDGE',
      image_uri: '',
      description: 'Cross-subnet bridging infrastructure for Avalanche L1s.',
      category: 'infra',
      is_graduated: false,
      created_at: 1714608000,
      project_id: '0xPROJ_INFRA_002',
      website: 'https://subnetbridge.example.com',
      twitter: null,
      telegram: 'https://t.me/subnetbridge',
    },
    market_info: {
      market_type: 'CURVE',
      token_id: '0xTRADE_INFRA_002',
      token_price: '0.0089',
      native_price: '32.50',
      price: '0.000274',
      ath_price: '0.0102',
      total_supply: '500000000000000000000000000',
      volume: '2100000000000000000000',
      holder_count: 128,
      bonding_percent: 32,
      milestone_completed: 1,
      milestone_total: 4,
    },
  },
  {
    token_info: {
      token_id: '0xTRADE_AI_003',
      name: 'NeuralAVAX',
      symbol: 'NAVAX',
      image_uri: '',
      description: 'AI-powered analytics and prediction models on Avalanche.',
      category: 'ai',
      is_graduated: true,
      created_at: 1713312000,
      project_id: '0xPROJ_AI_003',
      website: 'https://neuralavax.example.com',
      twitter: 'https://twitter.com/neuralavax',
      telegram: 'https://t.me/neuralavax',
    },
    market_info: {
      market_type: 'DEX',
      token_id: '0xTRADE_AI_003',
      token_price: '0.1850',
      native_price: '32.50',
      price: '0.005692',
      ath_price: '0.2200',
      total_supply: '1000000000000000000000000000',
      volume: '45000000000000000000000',
      holder_count: 1847,
      bonding_percent: 100,
      milestone_completed: 4,
      milestone_total: 4,
    },
  },
  {
    token_info: {
      token_id: '0xTRADE_GAMING_004',
      name: 'PixelQuest',
      symbol: 'PXQST',
      image_uri: '',
      description: 'On-chain RPG gaming with tradeable NFT items.',
      category: 'gaming',
      is_graduated: false,
      created_at: 1714780800,
      project_id: null,
      website: null,
      twitter: 'https://twitter.com/pixelquest',
      telegram: null,
    },
    market_info: {
      market_type: 'CURVE',
      token_id: '0xTRADE_GAMING_004',
      token_price: '0.0012',
      native_price: '32.50',
      price: '0.0000369',
      ath_price: '0.0015',
      total_supply: '10000000000000000000000000000',
      volume: '150000000000000000000',
      holder_count: 23,
      bonding_percent: 5,
      milestone_completed: 0,
      milestone_total: 4,
    },
  },
  {
    token_info: {
      token_id: '0xTRADE_SOCIAL_005',
      name: 'AvaConnect',
      symbol: 'ACONN',
      image_uri: '',
      description: 'Decentralized social graph and identity layer.',
      category: 'social',
      is_graduated: false,
      created_at: 1714000000,
      project_id: '0xPROJ_SOCIAL_005',
      website: 'https://avaconnect.example.com',
      twitter: 'https://twitter.com/avaconnect',
      telegram: 'https://t.me/avaconnect',
    },
    market_info: {
      market_type: 'CURVE',
      token_id: '0xTRADE_SOCIAL_005',
      token_price: '0.0534',
      native_price: '32.50',
      price: '0.001643',
      ath_price: '0.0610',
      total_supply: '200000000000000000000000000',
      volume: '12500000000000000000000',
      holder_count: 567,
      bonding_percent: 78,
      milestone_completed: 3,
      milestone_total: 4,
    },
  },
  {
    token_info: {
      token_id: '0xTRADE_MEME_006',
      name: 'AvaDoge',
      symbol: 'AVDOGE',
      image_uri: '',
      description: 'The premier meme token on Avalanche. Much snow, very fast.',
      category: 'meme',
      is_graduated: true,
      created_at: 1712500000,
      project_id: null,
      website: null,
      twitter: 'https://twitter.com/avadoge',
      telegram: 'https://t.me/avadoge',
    },
    market_info: {
      market_type: 'DEX',
      token_id: '0xTRADE_MEME_006',
      token_price: '0.0003',
      native_price: '32.50',
      price: '0.00000923',
      ath_price: '0.0025',
      total_supply: '69000000000000000000000000000',
      volume: '98000000000000000000000',
      holder_count: 4210,
      bonding_percent: 100,
      milestone_completed: 4,
      milestone_total: 4,
    },
  },
]

// --- Chart bar generator ---
// Creates 120 bars using random walk with slight upward bias

export function generateMockChartBars(startPrice = 0.025, barCount = 120): {
  bars: Array<{
    time: number
    open: string
    high: string
    low: string
    close: string
    volume: string
  }>
} {
  const bars: Array<{
    time: number
    open: string
    high: string
    low: string
    close: string
    volume: string
  }> = []

  const now = Math.floor(Date.now() / 1000)
  const interval = 900 // 15-minute bars
  let price = startPrice

  // Simple seeded pseudo-random for deterministic output
  let seed = 42
  function seededRandom(): number {
    seed = (seed * 16807 + 0) % 2147483647
    return seed / 2147483647
  }

  for (let i = 0; i < barCount; i++) {
    const time = now - (barCount - i) * interval
    const open = price

    // Random walk: -3% to +3.5% (slight upward bias)
    const change1 = (seededRandom() - 0.46) * 0.06
    const change2 = (seededRandom() - 0.46) * 0.06
    const midPrice = open * (1 + change1)
    const close = midPrice * (1 + change2)

    const high = Math.max(open, close) * (1 + seededRandom() * 0.015)
    const low = Math.min(open, close) * (1 - seededRandom() * 0.015)

    // Volume varies between 100 and 50000 in token units
    const volume = 100 + seededRandom() * 49900

    bars.push({
      time,
      open: open.toFixed(8),
      high: high.toFixed(8),
      low: low.toFixed(8),
      close: close.toFixed(8),
      volume: volume.toFixed(2),
    })

    price = close
  }

  return { bars }
}

// --- Swap history ---
// 14 trades mixing BUY and SELL with realistic data

const mockAccounts = [
  { account_id: '0xBUYER_A001', nickname: 'whale_alex', bio: '', image_uri: '' },
  { account_id: '0xSELLER_B002', nickname: 'trader_bob', bio: '', image_uri: '' },
  { account_id: '0xBUYER_C003', nickname: 'degen_carl', bio: '', image_uri: '' },
  { account_id: '0xSELLER_D004', nickname: 'sniper_dave', bio: '', image_uri: '' },
  { account_id: '0xBUYER_E005', nickname: 'ape_emma', bio: '', image_uri: '' },
  { account_id: '0xSELLER_F006', nickname: 'flip_frank', bio: '', image_uri: '' },
]

const baseTime = 1714800000

export const mockSwapHistory: { swaps: ISwapRecord[]; total_count: number } = {
  swaps: [
    {
      event_type: 'BUY',
      native_amount: '5000000000000000000',
      token_amount: '195312500000000000000000',
      native_price: '32.50',
      transaction_hash: '0xTX_SWAP_001_BUY',
      value: '162.50',
      account_info: mockAccounts[0],
      created_at: baseTime,
    },
    {
      event_type: 'SELL',
      native_amount: '2000000000000000000',
      token_amount: '78125000000000000000000',
      native_price: '32.50',
      transaction_hash: '0xTX_SWAP_002_SELL',
      value: '65.00',
      account_info: mockAccounts[1],
      created_at: baseTime - 120,
    },
    {
      event_type: 'BUY',
      native_amount: '10000000000000000000',
      token_amount: '390625000000000000000000',
      native_price: '32.50',
      transaction_hash: '0xTX_SWAP_003_BUY',
      value: '325.00',
      account_info: mockAccounts[2],
      created_at: baseTime - 300,
    },
    {
      event_type: 'BUY',
      native_amount: '500000000000000000',
      token_amount: '19531250000000000000000',
      native_price: '32.50',
      transaction_hash: '0xTX_SWAP_004_BUY',
      value: '16.25',
      account_info: mockAccounts[4],
      created_at: baseTime - 480,
    },
    {
      event_type: 'SELL',
      native_amount: '8000000000000000000',
      token_amount: '312500000000000000000000',
      native_price: '32.50',
      transaction_hash: '0xTX_SWAP_005_SELL',
      value: '260.00',
      account_info: mockAccounts[3],
      created_at: baseTime - 600,
    },
    {
      event_type: 'BUY',
      native_amount: '3000000000000000000',
      token_amount: '117187500000000000000000',
      native_price: '32.50',
      transaction_hash: '0xTX_SWAP_006_BUY',
      value: '97.50',
      account_info: mockAccounts[0],
      created_at: baseTime - 900,
    },
    {
      event_type: 'SELL',
      native_amount: '1500000000000000000',
      token_amount: '58593750000000000000000',
      native_price: '32.50',
      transaction_hash: '0xTX_SWAP_007_SELL',
      value: '48.75',
      account_info: mockAccounts[5],
      created_at: baseTime - 1200,
    },
    {
      event_type: 'BUY',
      native_amount: '20000000000000000000',
      token_amount: '781250000000000000000000',
      native_price: '32.50',
      transaction_hash: '0xTX_SWAP_008_BUY',
      value: '650.00',
      account_info: mockAccounts[2],
      created_at: baseTime - 1500,
    },
    {
      event_type: 'SELL',
      native_amount: '4000000000000000000',
      token_amount: '156250000000000000000000',
      native_price: '32.50',
      transaction_hash: '0xTX_SWAP_009_SELL',
      value: '130.00',
      account_info: mockAccounts[1],
      created_at: baseTime - 1800,
    },
    {
      event_type: 'BUY',
      native_amount: '1000000000000000000',
      token_amount: '39062500000000000000000',
      native_price: '32.50',
      transaction_hash: '0xTX_SWAP_010_BUY',
      value: '32.50',
      account_info: mockAccounts[4],
      created_at: baseTime - 2100,
    },
    {
      event_type: 'BUY',
      native_amount: '7500000000000000000',
      token_amount: '292968750000000000000000',
      native_price: '32.50',
      transaction_hash: '0xTX_SWAP_011_BUY',
      value: '243.75',
      account_info: mockAccounts[0],
      created_at: baseTime - 2400,
    },
    {
      event_type: 'SELL',
      native_amount: '6000000000000000000',
      token_amount: '234375000000000000000000',
      native_price: '32.50',
      transaction_hash: '0xTX_SWAP_012_SELL',
      value: '195.00',
      account_info: mockAccounts[3],
      created_at: baseTime - 2700,
    },
    {
      event_type: 'BUY',
      native_amount: '250000000000000000',
      token_amount: '9765625000000000000000',
      native_price: '32.50',
      transaction_hash: '0xTX_SWAP_013_BUY',
      value: '8.13',
      account_info: mockAccounts[5],
      created_at: baseTime - 3000,
    },
    {
      event_type: 'SELL',
      native_amount: '12000000000000000000',
      token_amount: '468750000000000000000000',
      native_price: '32.50',
      transaction_hash: '0xTX_SWAP_014_SELL',
      value: '390.00',
      account_info: mockAccounts[1],
      created_at: baseTime - 3300,
    },
  ],
  total_count: 14,
}
