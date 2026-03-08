# HANDOFF.md — OpenLaunch Frontend

## Status: Phase 2 — v0.3.0

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

---

## Phase 2: Project Core

### Feature Mapping

| ID | Feature | Component/File | Status |
|----|---------|----------------|--------|
| D-1 | Project Hero | ProjectHero.tsx | done |
| D-2 | Funding Stats | FundingStats.tsx | done |
| D-3 | Funding Progress Bar | FundingProgress.tsx | done |
| D-4 | Milestone Roadmap | MilestoneRoadmap.tsx | done |
| D-5 | Milestone Status Display | MilestoneRoadmap.tsx | done |
| D-6 | Fund Release Label | MilestoneRoadmap.tsx | done |
| D-7 | Fund Allocation Bar | FundAllocationBar.tsx | done |
| D-8 | Project Overview | ProjectOverview.tsx (markdown) | done |
| D-9 | Team Section | TeamSection.tsx | done |
| D-10 | Invest CTA (sticky) | InvestPanel.tsx (UI only, no contract) | done |
| D-12 | Wallet Not Connected | InvestPanel.tsx | done |
| D-13 | Funding Complete | InvestPanel.tsx | done |
| CR-1 | Step Indicator | StepIndicator.tsx | done |
| CR-2 | Step 1: Project Info | ProjectInfoStep.tsx | done |
| CR-4 | Logo Upload | LogoUpload.tsx | done |
| CR-5 | Ticker Validation | ProjectInfoStep.tsx (debounced) | done |
| CR-6 | Step 2: Milestones | MilestoneStep.tsx | done |
| CR-7 | Milestone Add/Remove | MilestoneStep.tsx | done |
| CR-8 | Step 3: Review | ReviewStep.tsx | done |
| CR-10 | Form Validation | Zod schemas | done |
| CR-11 | Form Data Persistence | Zustand store | done |

### Skipped (requires on-chain / Phase 3)
- D-11: Investment Flow (contract call)
- D-14: Claim Refund (contract call)
- D-15: UMA Verification Modal (P2 priority)
- CR-3: Rich Editor (P1 priority, use textarea for now)
- CR-9: Project Launch contract deploy

### Plan

#### P2-1: Project Detail Page Components (src/components/project-detail/)
- ProjectHero.tsx — Logo, name, ticker, tagline, StatusBadge, chain badge (Avalanche)
- FundingStats.tsx — 3x StatCard: Target Raise, Total Committed, Investor Count
- FundingProgress.tsx — ProgressBar + "62% - $312,450 raised" label
- MilestoneRoadmap.tsx — Horizontal timeline with nodes. Each node: title, status icon (✓ green / ◐ amber / ○ gray), fund release % label
- FundAllocationBar.tsx — Stacked horizontal bar, color per milestone
- ProjectOverview.tsx — Markdown rendering (react-markdown + rehype-sanitize)
- TeamSection.tsx — Team description + social links (icons for TG/X/Web/GH)
- InvestPanel.tsx — Sticky bottom panel. Amount input (min $10), "Commit Funds" button. States: not connected → "Connect Wallet", funded → "Funding Complete", failed → "Claim Refund" (disabled, Phase 3)

#### P2-2: Project Detail Data Layer (src/features/project/)
- Update services.ts + hooks.ts: useProjectDetail(id) already exists
- Add mock data for a single project detail in mocks/

#### P2-3: Project Detail Page (src/app/projects/[id]/page.tsx)
- Compose all detail components
- Loading skeleton
- 404 handling (project not found)

#### P2-4: Project Creation Components (src/components/launch/)
- StepIndicator.tsx — 3 steps, active/done/pending states
- ProjectInfoStep.tsx — Form fields: name, ticker (debounced validation), tagline, description (textarea), logo upload, links, target raise, token supply
- LogoUpload.tsx — Drag & drop zone, preview, file validation (PNG/JPG, max 5MB)
- MilestoneStep.tsx — Card-based milestone inputs, add/remove (min 2, max 6), allocation % with real-time sum
- ReviewStep.tsx — Preview card + milestone summary + warnings

#### P2-5: Form Infrastructure
- Zod schemas for all validation rules per Feature Spec
- Zustand store for multi-step form data persistence
- Form hook with per-step validation

#### P2-6: Launch Page (src/app/launch/page.tsx)
- Multi-step form with StepIndicator
- Step navigation (Next/Back)
- Final "Launch Project" button (UI only, shows "coming soon" toast)

#### P2-7: Git
- Branch: feat/phase-2-project-core
- Logical commits → merge --no-ff → tag v0.3.0 → push

### Dependencies
- react-markdown + rehype-sanitize (for D-8)
- zod (for form validation)
- Already have: zustand, shadcn components

### Tasks
- id: P2-1
  task: "Project detail components (8 files)"
  status: done

- id: P2-2
  task: "Detail data layer + mock"
  status: done

- id: P2-3
  task: "Detail page composition"
  status: done
  blocked_by: [P2-1, P2-2]

- id: P2-4
  task: "Creation form components (5 files)"
  status: done

- id: P2-5
  task: "Form infra (Zod + Zustand)"
  status: done

- id: P2-6
  task: "Launch page composition"
  status: done
  blocked_by: [P2-4, P2-5]
  note: All code done. Git worker committing + pushing.

- id: P2-7
  task: "Git commits + tag + push"
  status: done
  blocked_by: [P2-1, P2-2, P2-3, P2-4, P2-5, P2-6]

### P2 Review Fixes Applied (v0.3.0-rc1)

All code review issues from REVIEW.md have been addressed:

**Critical (fixed)**
- C1: Schema validation aligned with Feature Spec §4 — ticker min(2)/max(10), description min(20), targetRaise min(1000)
- C2: Removed `as 1 | 2 | 3` assertion in StepIndicator.tsx → uses `([1, 2, 3] as const)[i]` map. Store.ts and hooks.ts had no assertions in current code.
- C3: Logo required enforcement — goNext() validates logo on step 1, surfaces error via `logoError` state, LogoUpload shows red border + error message when missing

**Important (fixed)**
- I1: InvestPanel now handles `active` status (milestone phase) with "Funding Closed" button
- I2: LogoUpload uses semantic `<button type="button">` instead of `<div role="button">`, removed manual keyboard handler
- I3: Margin violations fixed — `[&_li]:my-1` → `[&_li]:py-0.5`, `mt-3` → `pt-3`
- I4: Typography `text-[10px]` → `text-xs` (12px floor)
- I5: ReviewStep milestone keys use `m.title || \`milestone-${i}\`` (stable, title-based)
- I6: beforeunload handler adds `e.returnValue = ''` for cross-browser support

**Minor (fixed)**
- M1: FundingProgress `<p>` tag has `leading-[1.2]` per convention
- M2: TeamSection had no `!` assertion in current code (already clean)

**Note:** ReviewStep `ml-3` (I3) not found in current code — already clean. Ticker availability hook `enabled` threshold updated to match new min(2).

Build: ✅ passes (`npm run build`)
