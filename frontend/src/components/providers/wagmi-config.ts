import { createConfig, http, cookieStorage, createStorage } from 'wagmi'
import { avalanche } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const wagmiConfig = createConfig({
  chains: [avalanche],
  connectors: [
    injected({ target: 'metaMask' }),
    injected(), // Core Wallet and other injected wallets
  ],
  ssr: true,
  storage: createStorage({ storage: cookieStorage }),
  transports: {
    [avalanche.id]: http(),
  },
})
