'use client';

import { ReactNode } from 'react';
import { WagmiProvider, http } from 'wagmi';
import { avalanche } from 'wagmi/chains';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { cookieStorage, createStorage } from 'wagmi';
import '@rainbow-me/rainbowkit/styles.css';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const config = projectId
  ? getDefaultConfig({
      appName: 'OpenLaunch',
      projectId,
      chains: [avalanche],
      ssr: true,
      storage: createStorage({ storage: cookieStorage }),
      transports: {
        [avalanche.id]: http(),
      },
    })
  : null;

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  if (!config) {
    // During build or when projectId is missing, render children without wallet providers
    return <>{children}</>;
  }

  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider>
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
