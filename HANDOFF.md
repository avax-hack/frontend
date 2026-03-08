# HANDOFF.md — OpenLaunch Frontend

## Status: Phase 1 — v0.2.1

## Completed
- [x] v0.1.0 — Project setup (Next.js 15, providers, API client, types, pages)
- [x] Mock system (mocks/ folder, centralized data, IS_MOCK flag)
- [x] Types aligned with Feature Spec
- [x] Plan review (REVISE → incorporated feedback below)
- [x] P1-1: shadcn/ui + dark theme (components.json, globals.css 4-step, layout.tsx dark, ui components)
- [x] P1-2: Shared components (StatusBadge, ProgressBar, MilestoneDots, StatCard, EmptyState, SkeletonCard, ProjectCard)
- [x] P1-3: Feature data layer (query-keys.ts, services.ts, hooks.ts)
- [x] P1-4: Landing page + explore page (HeroSection, FeaturedCarousel, FeaturedProjectCard, ActiveProjectsGrid, page.tsx, explore/page.tsx)
- [x] P1-5: Header enhancement (tab switcher, nav links, ConnectButton, mobile Sheet, a11y)

## Phase 1 Feature Mapping

| ID | Feature | Component/File | Status |
|----|---------|----------------|--------|
| C-1 | Header (logo, tabs, nav, wallet) | Header.tsx | done |
| C-2 | Wallet Connect (MetaMask/Core, address display, disconnect) | Header.tsx + RainbowKit ConnectButton | done |
| L-1 | Hero Section | HeroSection.tsx | done |
| L-2 | Featured Carousel (5s auto, pause hover) | FeaturedCarousel.tsx | done |
| L-3 | Carousel Card (logo, name, badges, description, target, committed, milestone) | FeaturedProjectCard.tsx | done |
| L-4 | Active Projects Grid (3-col, latest 6) | ActiveProjectsGrid.tsx | done |
| L-5 | Project Card (logo, name, ticker, tagline, Launched/Target/Funded%) | ProjectCard.tsx | done |
| L-6 | Funded% color (75%+ green, 40-74% default, <40% gray) | ProjectCard.tsx | done |
| L-7 | View All Projects → /explore | ActiveProjectsGrid.tsx | done |
| L-8 | Carousel Pause on Hover | FeaturedCarousel.tsx | done |

## Phase 1 Plan

### P1-1: shadcn/ui + dark theme
- status: done
- Files: components.json, globals.css (4-step CSS vars), layout.tsx (dark class), components/ui/*.tsx
- shadcn components: button, card, badge, skeleton, separator, scroll-area, sheet

### P1-2: Shared Components (src/components/common/)
- status: done
- StatusBadge.tsx — Badge with variant colors. Props: { label, variant: green|amber|red|gray|purple|blue, size?: sm|md }
- ProgressBar.tsx — Div-based bar. Props: { percent, color?: green|purple|blue, showLabel?, size? }
- MilestoneDots.tsx — ●●●○ pattern. Props: { completed, total, size? }
- StatCard.tsx — Card with label/value/change. Props: { label, value, change?, prefix?, size? }
- EmptyState.tsx — Icon + message + CTA. Props: { icon, message, actionLabel?, onAction? }
- SkeletonCard.tsx — Skeleton loading placeholder
- ProjectCard.tsx — IProjectListItem card. Shows: logo placeholder, name (symbol), tagline, Target amount (formatWeiToUSD), Funded% color-coded (L-6: >=75 green-500, 40-74 foreground, <40 muted-foreground), MilestoneDots. Click → /projects/[id]. aria-label on Link.

### P1-3: Feature Data Layer (src/features/project/)
- status: done
- query-keys.ts — projectKeys factory { all, featured, list(sort, params), detail(id) }
- services.ts — getFeaturedProjects(), getProjectList(sortType, params), getProjectDetail(id) via httpGet with 404→null
- hooks.ts — useQuery wrappers: useFeaturedProjects(), useProjectList(sortType, params), useProjectDetail(id). 'use client'

### P1-4: Landing Page (src/components/landing/)
- status: done
- HeroSection.tsx — Server component. Gradient text "HARD TO RUG." (bg-gradient-to-r from-primary to-purple-500 + bg-clip-text + text-transparent). Subtitle: "Milestone-based launchpad on Avalanche. Protocol-level accountability." CTAs: Explore Projects → /explore, Launch Project → /launch
- FeaturedCarousel.tsx — Client component. useState for index, useEffect for 5s timer. Pause on hover (useRef). Prev/Next buttons (aria-label="Previous project" / "Next project"). Keyboard navigation (ArrowLeft/ArrowRight). Dot indicators. aria-roledescription="carousel"
- FeaturedProjectCard.tsx — Category badge (StatusBadge), name, symbol, tagline, description snippet (line-clamp-3), Target/Committed amounts, ProgressBar, "X of Y milestones completed" text + MilestoneDots. Link to /projects/[id]
- ActiveProjectsGrid.tsx — 3-col grid (grid-cols-1 md:2 lg:3), "View All Projects →" Link to /explore, EmptyState fallback
- app/page.tsx — Client component using useFeaturedProjects() + useProjectList('recent'). SkeletonCard loading. Composes HeroSection → FeaturedCarousel → ActiveProjectsGrid
- app/explore/page.tsx — Client component. Title "Explore Projects". useProjectList('recent'). 3-col grid. SkeletonCard loading. EmptyState fallback

### P1-5: Header Enhancement
- status: done
- Logo "OpenLaunch" left, Link to /
- Tab switcher: Launchpad | Trading — role="tablist" + aria-selected
  - Launchpad active: default (all non-trading routes)
  - Trading active: pathname.startsWith('/trading')
- Nav links per tab: Launchpad → Explore, Launch, Portfolio, Builder | Trading → Trading
- aria-current="page" on active nav link
- ConnectButton from @rainbow-me/rainbowkit (dynamic import, ssr: false, skeleton loading)
- Responsive: Sheet (hamburger) on mobile < md. aria-label="Open navigation menu". Close on link click
- Sticky: sticky top-0 z-50 bg-background/80 backdrop-blur-sm
- Constants extracted to lib/constants.ts (LAUNCHPAD_LINKS, TRADING_LINKS)

### P1-6: Git
- Branch: feat/phase-1-landing-header
- 5 commits → merge --no-ff → tag v0.2.1
- Commits:
  1. [refactor] improve project data layer with pagination params and naming consistency
  2. [feat] enhance shared components with funded% color coding and a11y improvements
  3. [feat] implement landing page with hero gradient, carousel controls, and featured cards
  4. [feat] update explore page with responsive grid columns
  5. [feat] enhance header with tab navigation, a11y roles, and constants extraction

## Provider Architecture
- Current order: QueryProvider > WalletProvider (wagmi+RainbowKit)
- frontend.md target: SessionProvider > WagmiProvider > QueryClientProvider > RainbowKitProvider > SocketProvider
- Deviation: No SessionProvider (no SIWE auth in Phase 1), no SocketProvider (Phase 4)
- Follow-up: Align provider order when auth (Phase 3) and WebSocket (Phase 4) are added

## Dependencies & Risks
- NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: Required for WalletConnect. If missing, only injected wallets (MetaMask, Core) work. Acceptable for Phase 1.
- NEXT_PUBLIC_API_URL: Not needed in mock mode. Mock mode is default.
- NEXT_PUBLIC_MOCK_MODE=true: Must be set in .env.local

## A11y Acceptance Criteria (Phase 1)
- Carousel: aria-label on prev/next controls, keyboard arrow navigation, aria-roledescription="carousel"
- Mobile menu: aria-label on hamburger trigger, focus trap in sheet
- All buttons: aria-label if icon-only
- Semantic HTML: button for actions, Link/a for navigation, heading hierarchy h1→h2→h3
- Tab switcher: role="tablist", role="tab", aria-selected
- Nav links: aria-current="page" on active link

## Tasks
- id: P1-1
  task: "shadcn/ui + dark theme"
  status: done

- id: P1-2
  task: "Shared components (7 files)"
  status: done

- id: P1-3
  task: "Feature data layer"
  status: done

- id: P1-4
  task: "Landing + explore pages"
  status: done

- id: P1-5
  task: "Header enhancement"
  status: done

- id: P1-6
  task: "Git commits + tag + push"
  status: done (v0.2.1, not pushed — no remote configured with push access)

## Git
- Repo: github.com/avax-hack/frontend
- Author: 0xAryweb3
- Push URL: https://github.com/avax-hack/frontend.git
