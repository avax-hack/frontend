'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useAccount } from 'wagmi'
import { MenuIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { LAUNCHPAD_LINKS, TRADING_LINKS, defaultChain } from '@/lib/constants'
import { FaucetButton } from '@/components/common/FaucetButton'
import { useProfile } from '@/features/auth/hooks'
import { useAuth } from '@/features/auth/hooks'

const ConnectButton = dynamic(
  () => import('@rainbow-me/rainbowkit').then((mod) => mod.ConnectButton),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-full bg-gradient-to-r from-red-600 to-rose-500 px-5 py-2 text-sm font-semibold text-white">
        Connect Wallet
      </div>
    ),
  },
)

type TabId = 'launchpad' | 'trading'

const TABS: { id: TabId; label: string }[] = [
  { id: 'launchpad', label: 'Launchpad' },
  { id: 'trading', label: 'Trading' },
]

const NAV_LINKS_BY_TAB: Record<TabId, readonly { readonly href: string; readonly label: string }[]> = {
  launchpad: LAUNCHPAD_LINKS,
  trading: TRADING_LINKS,
}

const TRADING_ROUTES = ['/trading']

function getActiveTab(pathname: string): TabId {
  if (TRADING_ROUTES.some((route) => pathname.startsWith(route))) {
    return 'trading'
  }
  return 'launchpad'
}

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export function Header() {
  const pathname = usePathname()
  const activeTab = getActiveTab(pathname)
  const [mobileOpen, setMobileOpen] = useState(false)

  const { address, isConnected } = useAccount()
  const { isAuthenticated, isSessionRestored, isLoading } = useProfile()
  const { login, logout, isSigning } = useAuth()

  const currentLinks = NAV_LINKS_BY_TAB[activeTab]

  const walletSection = (
    <>
      {isConnected && isAuthenticated && address ? (
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {truncateAddress(address)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="rounded-full text-white/50 hover:bg-white/5 hover:text-white"
          >
            Sign Out
          </Button>
        </div>
      ) : isConnected && isSessionRestored && !isAuthenticated ? (
        <Button
          size="sm"
          onClick={() => login()}
          disabled={isSigning}
          className="rounded-full bg-gradient-to-r from-red-600 to-rose-500 text-white hover:from-red-500 hover:to-rose-400"
        >
          {isSigning ? 'Signing...' : 'Sign In'}
        </Button>
      ) : isConnected && isLoading ? (
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/50">
          Loading...
        </div>
      ) : (
        <ConnectButton />
      )}
    </>
  )

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Left: Logo + Tabs + Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-rose-600 text-sm font-black text-white shadow-lg shadow-red-500/20">
              O
            </span>
            OpenLaunch
          </Link>

          {/* Tab Switcher — desktop */}
          <div className="hidden items-center rounded-full border border-white/[0.06] bg-white/[0.04] p-0.5 md:flex" role="tablist" aria-label="Main sections">
            {TABS.map((tab) => (
              <Link
                key={tab.id}
                href={tab.id === 'trading' ? '/trading' : '/'}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-white/40 hover:text-white/70',
                )}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {/* Nav Links — desktop */}
          <nav className="hidden items-center gap-6 md:flex" aria-label="Page navigation">
            {currentLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
                className={cn(
                  'relative text-sm transition-colors hover:text-white',
                  pathname === link.href
                    ? 'font-medium text-white after:absolute after:-bottom-[21px] after:left-0 after:h-px after:w-full after:bg-gradient-to-r after:from-red-500 after:to-rose-500'
                    : 'text-white/40',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Faucet + Wallet + Mobile Menu */}
        <div className="flex items-center gap-3">
          {defaultChain.testnet && (
            <div className="hidden md:block">
              <FaucetButton />
            </div>
          )}
          <div className="hidden md:block">
            {walletSection}
          </div>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border border-white/10 text-white/60 hover:bg-white/5 hover:text-white md:hidden"
                aria-label="Open navigation menu"
              >
                <MenuIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-72 flex-col gap-6 border-white/10 bg-[#0a0e1a] p-6">
              <SheetTitle className="text-lg font-bold text-white">OpenLaunch</SheetTitle>

              {/* Tab switcher — mobile */}
              <div className="flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.04] p-0.5" role="tablist" aria-label="Main sections">
                {TABS.map((tab) => (
                  <Link
                    key={tab.id}
                    href={tab.id === 'trading' ? '/trading' : '/'}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex-1 rounded-full px-3 py-1.5 text-center text-sm font-medium transition-all',
                      activeTab === tab.id
                        ? 'bg-white/10 text-white'
                        : 'text-white/40 hover:text-white/70',
                    )}
                  >
                    {tab.label}
                  </Link>
                ))}
              </div>

              {/* Nav links — mobile */}
              <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
                {currentLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={pathname === link.href ? 'page' : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'rounded-lg px-3 py-2.5 text-sm transition-colors',
                      pathname === link.href
                        ? 'bg-white/10 font-medium text-white'
                        : 'text-white/40 hover:bg-white/5 hover:text-white',
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="flex-1" />
              <div className="flex flex-col gap-3">
                {defaultChain.testnet && <FaucetButton />}
                {walletSection}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
