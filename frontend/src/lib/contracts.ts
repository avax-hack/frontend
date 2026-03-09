import { OPENLAUNCH_CONTRACTS } from './constants';
import IDO_ABI_JSON from './abi/IDO.json';
import ERC20_ABI_JSON from './abi/ERC20.json';
import POOL_MANAGER_ABI_JSON from './abi/PoolManager.json';
import SWAP_ROUTER_ABI_JSON from './abi/SwapRouter.json';
import V4_QUOTER_ABI_JSON from './abi/V4Quoter.json';

export const IDO_ABI = IDO_ABI_JSON;
export const ERC20_ABI = ERC20_ABI_JSON;
export const POOL_MANAGER_ABI = POOL_MANAGER_ABI_JSON;
export const SWAP_ROUTER_ABI = SWAP_ROUTER_ABI_JSON;
export const V4_QUOTER_ABI = V4_QUOTER_ABI_JSON;

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
  v4Quoter: {
    address: OPENLAUNCH_CONTRACTS.V4_QUOTER,
    abi: V4_QUOTER_ABI,
  },
} as const;
