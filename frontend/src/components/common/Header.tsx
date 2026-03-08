'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import { MenuIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { LAUNCHPAD_LINKS, TRADING_LINKS } from '@/lib/constants'

const ConnectButton = dynamic(
  () => import('@rainbow-me/rainbowkit').then((mod) => mod.ConnectButton),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-muted-foreground">
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

export function Header() {
  const pathname = usePathname()
  const activeTab = getActiveTab(pathname)
  const [mobileOpen, setMobileOpen] = useState(false)

  const currentLinks = NAV_LINKS_BY_TAB[activeTab]

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Left: Logo + Tabs + Nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold text-foreground">
            OpenLaunch
          </Link>

          {/* Tab Switcher — desktop */}
          <div className="hidden items-center gap-1 rounded-lg bg-secondary p-1 md:flex" role="tablist" aria-label="Main sections">
            {TABS.map((tab) => (
              <Link
                key={tab.id}
                href={tab.id === 'trading' ? '/trading' : '/'}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={cn(
                  'rounded-md px-3 py-1 text-sm font-medium transition-colors',
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {/* Nav Links — desktop */}
          <nav className="hidden items-center gap-4 md:flex" aria-label="Page navigation">
            {currentLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
                className={cn(
                  'text-sm transition-colors hover:text-foreground',
                  pathname === link.href
                    ? 'font-medium text-foreground'
                    : 'text-muted-foreground',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Wallet + Mobile Menu */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <ConnectButton />
          </div>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open navigation menu"
              >
                <MenuIcon aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-72 flex-col gap-6 p-6">
              <SheetTitle className="text-lg font-bold">OpenLaunch</SheetTitle>

              {/* Tab switcher — mobile */}
              <div className="flex items-center gap-1 rounded-lg bg-secondary p-1" role="tablist" aria-label="Main sections">
                {TABS.map((tab) => (
                  <Link
                    key={tab.id}
                    href={tab.id === 'trading' ? '/trading' : '/'}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex-1 rounded-md px-3 py-1 text-center text-sm font-medium transition-colors',
                      activeTab === tab.id
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {tab.label}
                  </Link>
                ))}
              </div>

              {/* Nav links — mobile */}
              <nav className="flex flex-col gap-3" aria-label="Mobile navigation">
                {currentLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={pathname === link.href ? 'page' : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'rounded-md px-3 py-2 text-sm transition-colors',
                      pathname === link.href
                        ? 'bg-secondary font-medium text-foreground'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-col gap-3 mt-auto">
                <ConnectButton />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
