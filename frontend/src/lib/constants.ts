import { defineChain } from 'viem';
import type { Address } from 'viem';

// ===== Chain Definitions =====

export const avalancheMainnet = defineChain({
  id: 43114,
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
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 11907934,
    },
  },
  testnet: false,
});

export const avalancheFuji = defineChain({
  id: 43113,
  name: 'Avalanche Fuji',
  nativeCurrency: {
    decimals: 18,
    name: 'Avalanche',
    symbol: 'AVAX',
  },
  rpcUrls: {
    default: {
      http: ['https://api.avax-test.network/ext/bc/C/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'SnowTrace Testnet',
      url: 'https://testnet.snowtrace.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 7096959,
    },
  },
  testnet: true,
});

const network = process.env.NEXT_PUBLIC_NETWORK;

export const defaultChain = network === 'mainnet' ? avalancheMainnet : avalancheFuji;

// ===== Contract Addresses =====

type OpenLaunchContracts = {
  IDO: Address;
  LP_MANAGER: Address;
  POOL_MANAGER: Address;
  USDC: Address;
  FEE_MANAGER: Address;
  SWAP_FEE_HOOK: Address;
  TREASURY: Address;
};

const CONTRACTS: Record<string, OpenLaunchContracts> = {
  testnet: {
    IDO: '0xe7f634dBa5F6a5d674a563371b8766d52b4E1334',
    LP_MANAGER: '0xfC7B5BC0a67B8ae44942663E8AF9a865C3D75B58',
    POOL_MANAGER: '0xCbe233D9d63dE61b73858724b62D2D97a1Ca20B6',
    USDC: '0x568779EEe2bca1AcF4b0C8AD91A23136a6EA991d',
    FEE_MANAGER: '0x25FaFBbF336AD8794ABBb7Da2439704ED8bb8aba',
    SWAP_FEE_HOOK: '0xA1F2d4E79a572E8fC144E67f0885c68ff176C044',
    TREASURY: '0xA82a05d61527ADeD7FD8d74A99d686dc35f63D36',
  },
  mainnet: {
    IDO: '0x0000000000000000000000000000000000000000',
    LP_MANAGER: '0x0000000000000000000000000000000000000000',
    POOL_MANAGER: '0x0000000000000000000000000000000000000000',
    USDC: '0x0000000000000000000000000000000000000000',
    FEE_MANAGER: '0x0000000000000000000000000000000000000000',
    SWAP_FEE_HOOK: '0x0000000000000000000000000000000000000000',
    TREASURY: '0x0000000000000000000000000000000000000000',
  },
} as const;

export const OPENLAUNCH_CONTRACTS = CONTRACTS[network === 'mainnet' ? 'mainnet' : 'testnet'];

// ===== Explorer =====

export const SNOWTRACE_URL = defaultChain.testnet
  ? 'https://testnet.snowtrace.io'
  : 'https://snowtrace.io';

// ===== Navigation =====

export const LAUNCHPAD_LINKS = [
  { href: '/explore', label: 'Explore' },
  { href: '/launch', label: 'Launch' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/builder', label: 'Builder' },
] as const;

export const TRADING_LINKS = [
  { href: '/trading', label: 'Trading' },
] as const;
