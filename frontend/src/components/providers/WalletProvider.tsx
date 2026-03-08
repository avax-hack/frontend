'use client';

import { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { avalanche } from 'wagmi/chains';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { cookieStorage, createStorage } from 'wagmi';
import { injected } from 'wagmi/connectors';
import '@rainbow-me/rainbowkit/styles.css';

const config = createConfig({
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
});

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider>
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
