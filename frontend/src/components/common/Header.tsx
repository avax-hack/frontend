'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { NAV_LINKS } from '@/lib/constants';

const ConnectButton = dynamic(
  () => import('@rainbow-me/rainbowkit').then((mod) => mod.ConnectButton),
  {
    ssr: false,
    loading: () => (
      <button className="rounded-lg bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-300">
        Connect Wallet
      </button>
    ),
  },
);

export function Header() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-xl font-bold">
          OpenLaunch
        </Link>
        <nav className="flex items-center gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors hover:text-foreground ${
                pathname === link.href
                  ? 'text-foreground font-medium'
                  : 'text-neutral-400'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <ConnectButton />
    </header>
  );
}
