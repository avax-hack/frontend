import { OPENLAUNCH_CONTRACTS } from './constants';
import IDO_ABI_JSON from './abi/IDO.json';
import ERC20_ABI_JSON from './abi/ERC20.json';
import POOL_MANAGER_ABI_JSON from './abi/PoolManager.json';
import SWAP_ROUTER_ABI_JSON from './abi/SwapRouter.json';

export const IDO_ABI = IDO_ABI_JSON;
export const ERC20_ABI = ERC20_ABI_JSON;
export const POOL_MANAGER_ABI = POOL_MANAGER_ABI_JSON;
export const SWAP_ROUTER_ABI = SWAP_ROUTER_ABI_JSON;

export const contracts = {
  ido: {
    address: OPENLAUNCH_CONTRACTS.IDO,
    abi: IDO_ABI,
  },
  usdc: {
    address: OPENLAUNCH_CONTRACTS.USDC,
    abi: ERC20_ABI,
  },
  poolManager: {
    address: OPENLAUNCH_CONTRACTS.POOL_MANAGER,
    abi: POOL_MANAGER_ABI,
  },
  swapRouter: {
    address: OPENLAUNCH_CONTRACTS.SWAP_ROUTER,
    abi: SWAP_ROUTER_ABI,
  },
} as const;
