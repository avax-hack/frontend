import { CONTRACT_ADDRESSES } from './constants';

// Contract ABIs — placeholder until actual contracts are deployed
// Each ABI will be imported from the contracts package or defined here

export const IDO_ABI = [] as const;

export const LP_MANAGER_ABI = [] as const;

export const ERC20_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'allowance',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

export const contracts = {
  ido: {
    address: CONTRACT_ADDRESSES.ido,
    abi: IDO_ABI,
  },
  lpManager: {
    address: CONTRACT_ADDRESSES.lpManager,
    abi: LP_MANAGER_ABI,
  },
} as const;
