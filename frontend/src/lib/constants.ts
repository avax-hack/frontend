import { defineChain } from 'viem';

export const AVALANCHE_CHAIN_ID = 43114;

export const avalanche = defineChain({
  id: AVALANCHE_CHAIN_ID,
  name: 'Avalanche',
  nativeCurrency: {
    decimals: 18,
    name: 'Avalanche',
    symbol: 'AVAX',
  },
  rpcUrls: {
    default: {
      http: ['https://api.avax.network/ext/bc/C/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'SnowTrace',
      url: 'https://snowtrace.io',
    },
  },
});

export const CONTRACT_ADDRESSES = {
  ido: process.env.NEXT_PUBLIC_IDO_CONTRACT as `0x${string}` | undefined,
  lpManager: process.env.NEXT_PUBLIC_LP_MANAGER_CONTRACT as `0x${string}` | undefined,
  usdc: process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}` | undefined,
  uniswapV4Router: process.env.NEXT_PUBLIC_UNISWAP_V4_ROUTER as `0x${string}` | undefined,
} as const;

export const SNOWTRACE_URL = process.env.NEXT_PUBLIC_SNOWTRACE_URL ?? 'https://snowtrace.io';

export const LAUNCHPAD_LINKS = [
  { href: '/explore', label: 'Explore' },
  { href: '/launch', label: 'Launch' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/builder', label: 'Builder' },
] as const;

export const TRADING_LINKS = [
  { href: '/trading', label: 'Trading' },
] as const;

/** @deprecated Use LAUNCHPAD_LINKS and TRADING_LINKS instead */
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  ...LAUNCHPAD_LINKS,
  ...TRADING_LINKS,
] as const;
