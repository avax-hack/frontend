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

function isHexAddress(value: string): value is `0x${string}` {
  return /^0x[0-9a-fA-F]{40}$/.test(value);
}

function toHexAddress(value: string | undefined): `0x${string}` | undefined {
  if (!value) return undefined;
  if (isHexAddress(value)) return value;
  return undefined;
}

export const CONTRACT_ADDRESSES = {
  ido: toHexAddress(process.env.NEXT_PUBLIC_IDO_CONTRACT),
  lpManager: toHexAddress(process.env.NEXT_PUBLIC_LP_MANAGER_CONTRACT),
  usdc: toHexAddress(process.env.NEXT_PUBLIC_USDC_ADDRESS),
  uniswapV4Router: toHexAddress(process.env.NEXT_PUBLIC_UNISWAP_V4_ROUTER),
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
