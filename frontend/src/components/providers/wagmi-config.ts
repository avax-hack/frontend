import { createConfig, http, cookieStorage, createStorage } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { avalancheMainnet, avalancheFuji } from '@/lib/constants'

const network = process.env.NEXT_PUBLIC_NETWORK

const chains = network === 'mainnet'
  ? [avalancheMainnet] as const
  : [avalancheFuji] as const

export const wagmiConfig = network === 'mainnet'
  ? createConfig({
      chains: [avalancheMainnet],
      connectors: [
        injected({ target: 'metaMask' }),
        injected(),
      ],
      ssr: true,
      storage: createStorage({ storage: cookieStorage }),
      transports: {
        [avalancheMainnet.id]: http(),
      },
    })
  : createConfig({
      chains: [avalancheFuji],
      connectors: [
        injected({ target: 'metaMask' }),
        injected(),
      ],
      ssr: true,
      storage: createStorage({ storage: cookieStorage }),
      transports: {
        [avalancheFuji.id]: http(),
      },
    })
