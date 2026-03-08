'use client';

import { ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';
import { WalletProvider } from './WalletProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <WalletProvider>
        {children}
      </WalletProvider>
    </QueryProvider>
  );
}
