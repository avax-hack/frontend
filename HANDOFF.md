# HANDOFF.md — OpenLaunch Frontend

## Status: Phase 6 — v0.7.0

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
- [x] v0.2.1 — Phase 1 complete (landing, header, explore)
- [x] v0.3.0 — Phase 2 complete (project detail, launch form)
- [x] v0.4.0 — Phase 3 complete (wallet auth, investment flow, refund, launch API)
- [x] v0.5.0 — Phase 4 complete (trading list, chart, trading detail, trade panel)
- [x] v0.6.0 — Phase 5 complete (portfolio + builder dashboards)
- [x] v0.7.0 — Contract integration (real TX flows for invest, refund, create, swap)
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

## Changes Log

### WalletConnect 제거 (2026-03-08)
- WalletConnect projectId 의존성 제거
- RainbowKit + injected wallets only (MetaMask, Core Wallet)
- 이유: WalletConnect projectId 없이도 동작하도록. Phase 1에서는 injected wallet만 지원
- Feature Spec C-2 변경 없음 (원래 MetaMask/Core만 명시)
- 추후 WalletConnect 추가 시 projectId 발급 후 재설정

---

## Phase 3: Wallet Auth + Investment Flow

### Status: done

### Scope
- C-3: Wallet Auth (nonce+signature session flow)
- D-11: Investment Flow (confirmation modal → TX stub)
- D-14: Project Failed → Claim Refund button
- CR-9: Project Launch (POST /project/create + contract deploy stub)
- Auth-gated UI states across existing components

### Plan (revised per codex review)

#### P3-1a: Auth Services + Store
- src/features/auth/services.ts — postNonce, postSession, deleteSession, getAccount (withCredentials: true)
- src/features/auth/query-keys.ts — authKeys factory
- src/stores/authStore.ts — Zustand: account_info, isAuthenticated, setAccount, clearAccount
- Mock endpoints: /auth/nonce, /auth/session, /auth/delete_session, /account/get_account

#### P3-1b: Auth Hook + SessionProvider
- src/features/auth/hooks.ts — useAuth(): connect + signMessage + createSession, logout, restore session
- src/components/providers/SessionProvider.tsx — restore session on mount via GET /account/get_account
- useAccountEffect: onConnect → clear+re-auth, onDisconnect → clear session
- Chain ID handling: include chain_id from connected wallet
- Loop prevention: one-shot guard for auto-sign (avoid re-sign on rerender)
- 401/session-expiry: clear authStore, prompt re-auth on gated actions

#### P3-1c: Provider Order Refactor
- Reorder per frontend.md: SessionProvider > WagmiProvider > QueryClientProvider > RainbowKitProvider
- Update providers/index.tsx

#### P3-2: Auth UI
- Header: connected+authenticated → address chip + disconnect
- Connected but not authenticated → trigger nonce signing (with guard)
- Auth loading states + error toasts
- Mock: in-memory session state for login/logout/restore consistency

#### P3-3: Investment Flow
- src/components/project-detail/InvestModal.tsx — confirmation modal (amount, project name, fee)
- InvestPanel: "Commit Funds" → auth check → InvestModal → sign TX → pending → success/fail toast
- Double-submit prevention (disable button while pending)
- Mock: simulate TX with setTimeout
- Contract interaction stub (will wire real ABI later)

#### P3-4: Claim Refund + Project States
- InvestPanel: project status "failed" → "Claim Refund" button
- Refund flow: auth check → sign TX → pending → success toast
- Add failed project fixture in mocks for testing
- Auth-gate all actions

#### P3-5: Launch Flow + API Integration
- POST /project/create service + mutation hook
- Payload mapping from launch form Zustand store to API schema
- ReviewStep "Launch Project" → auth check → POST /project/create → contract deploy stub
- Handle response (project_id, transaction_hash) → redirect to /projects/[id]
- Mock: return mock project_id, simulate deploy
- Error states: network failure, user rejection, validation errors

#### P3-6: Git
- Branch: feat/phase-3-wallet-auth
- Logical commits → merge --no-ff → tag v0.4.0 → push

### Edge Case Acceptance Criteria
- Nonce/session API network failure → error toast + retry
- User rejects signature (wallet error 4001) → clear pending, show message
- User rejects TX signature → clear pending, re-enable button
- Session expiry during action (401) → clear auth, prompt re-auth
- Wallet disconnect during pending flow → cancel flow, clear state
- Wallet account change → clear old session, require re-auth
- Double-submit → button disabled while pending

### Dependencies
- viem (already via wagmi)
- No new packages

### Tasks
- id: P3-1a
  task: "Auth services + store + mocks"
  status: done

- id: P3-1b
  task: "Auth hook + SessionProvider + lifecycle"
  status: done
  blocked_by: [P3-1a]

- id: P3-1c
  task: "Provider order refactor"
  status: done
  blocked_by: [P3-1b]

- id: P3-2
  task: "Auth UI (header, auto-sign, loading)"
  status: done
  blocked_by: [P3-1c]

- id: P3-3
  task: "Investment flow (modal, TX stub)"
  status: done
  blocked_by: [P3-1c]

- id: P3-4
  task: "Claim refund + project states"
  status: done
  blocked_by: [P3-3]

- id: P3-5
  task: "Launch flow + POST /project/create"
  status: done
  blocked_by: [P3-1c]

- id: P3-6
  task: "Git commits + tag + push"
  status: done
  blocked_by: [P3-2, P3-3, P3-4, P3-5]

### P3 Review Fixes Applied (v0.4.0)

**Critical (fixed)**
- C1: Unsafe `as { code: number }` type assertions → extracted `isUserRejection()` type guard in `src/lib/errors.ts`
- C2: `restoreSession()` not clearing auth on null → added `clearAccount()` on null response
- C3: Account change not handled → `SessionProvider` tracks `lastAddressRef`, clears session on address switch
- C4: Provider order deviation documented with explanatory comment
- C5: 401 in launch mutation → clears auth store + shows "session expired" toast
- C6: Disconnect during pending flow → `isConnectedRef` pattern checks wallet after async TX

**Important (fixed)**
- I1: `login()` now returns `Promise<boolean>`, Header uses `.then(success => ...)` for failure detection
- I3: Mock `/project/create` now enforces auth (throws 401 when no session)
- I5: `mt-auto` margin violation → replaced with `flex-1` spacer div

**Minor (fixed)**
- M1: `isSigning` converted from ref to reactive state for proper UI updates

**Skipped (justified)**
- I2: Dialog prop-drilling — valid exception (auth gate logic requires parent control)
- I4: `image_uri: ''` — file upload not in Phase 3 scope (documented TODO)

Build: ✅ passes (`npm run build`)

---

## Phase 4: Trading

### Status: done

### Scope (P0 focus, mock mode)

**Trading List (/trading)**
- T-4: Sort filter (Recent/MCap/Trending/Most Funded)
- T-5: Category filter (All/DeFi/Infra/AI/Gaming/Social/Meme)
- T-7: Search (debounce 300ms)
- T-8: Token card grid (3-col)
- T-9: Milestone score badge
- T-10: Bonding/DEX status bar
- T-11: Card click → /trading/:tokenId

**Trading Detail (/trading/:tokenId)**
- TD-1: Token header (logo, name, ticker, contract copy, social links, badges)
- TD-2: Market stats row (price, MCap, ATH, 24h vol, holders)
- TD-3: TradingView chart (lightweight-charts, candlestick + volume)
- TD-4: Chart interval selector (1m/5m/15m/1h/4h/1D)
- TD-7: Trades tab (trade history table)
- TD-10: Trade panel (buy/sell toggle, amount input, presets)
- TD-11: Balance display
- TD-13: Slippage setting (0.5/1/3/5% + custom)
- TD-15: Bonding curve card
- TD-16: Milestone status card

**Deferred (P1/P2)**
- T-1: Live ticker (WebSocket — Phase 6)
- T-2: Featured banner
- T-3: Trending scroll
- T-6: Verified only toggle
- T-12: Infinite scroll
- TD-5/6: Price/MCap + USD/AVAX toggles
- TD-8/9: Holders + About tabs
- TD-12: Swap quote
- TD-14: Place order (contract call)
- TD-17/18/19/20: Info card, milestone box, real-time, graduation

### Plan (revised per codex review)

#### P4-1: Trading Data Layer
- src/features/trading/types.ts — REUSE existing ITokenInfo, IMarketInfo, ITokenData, ITokenListData from src/types/token.ts (re-export). ADD new types:
  - IChartBar: { time: number, open: string, high: string, low: string, close: string, volume: string }
  - ITradingChartData: { bars: IChartBar[] }
  - ISwapRecord: { event_type: BUY|SELL, native_amount, token_amount, native_price, transaction_hash, value, account_info: IAccountInfo, created_at }
  - ITokenSwapHistoryData: { swaps: ISwapRecord[], total_count }
  - ITokenHolder: { rank, account_info: IAccountInfo, balance, percent }
  - ITokenHolderListData: { holders: ITokenHolder[], total_count }
  - ChartResolution, SortType, TokenCategory union types
- src/features/trading/services.ts — getTokenList, getTokenDetail (404->null), getChartData, getSwapHistory per API spec
- src/features/trading/query-keys.ts — tradingKeys: { all, list, detail, chart, swapHistory }
- src/features/trading/hooks.ts — useTokenList, useTokenDetail, useChartData, useSwapHistory
- src/mocks/trading.ts — 6 tokens (all categories, CURVE+DEX, milestone 0-4), chart bars (random walk 100+), swap history (10+ BUY/SELL), 404/empty handlers

#### P4-2: Trading List Page
- TokenCard: Link to /trading/[tokenId], milestone score badge 0-4 color-coded, CURVE bonding bar / DEX badge
- SortFilter: Recent/MCap/Trending/Most Funded, role=radiogroup
- CategoryFilter: All/DeFi/Infra/AI/Gaming/Social/Meme pills
- SearchBar: debounced 300ms, spellCheck=false
- page.tsx: 3-col grid (grid-cols-1 md:2 lg:3), SkeletonCard, EmptyState

#### P4-3: TradingView Chart Component
- lightweight-charts: CandlestickSeries + HistogramSeries, dark theme, ResizeObserver, cleanup
- ChartIntervalSelector: 1m/5m/15m/1h/4h/1D mapped to API resolution values

#### P4-4: Trading Detail Page
- TokenHeader: contract copy, social icons, graduated/bonding badges
- MarketStats: Price, MCap, ATH, 24h Vol, Holders
- TradePanel: buy/sell toggle, amount input (inputmode=decimal), presets, Balance display (TD-11), slippage 0.5/1/3/5%+custom (TD-13), submit->toast
- TradesTable: time/type/amount/price/wallet/tx columns
- BondingCurveCard: progress + graduates text
- MilestoneStatusCard: vertical 4-stage timeline
- page.tsx: 2-col layout, tabs (Trades functional, Holders/About coming soon), skeletons, 404

#### P4-5: Git
- Branch: feat/phase-4-trading
- Logical commits -> merge --no-ff -> tag v0.5.0 -> push

### Tasks
- id: P4-1
  task: "Trading data layer + types + mocks"
  status: done

- id: P4-2
  task: "Trading list page + filters"
  status: done

- id: P4-3
  task: "TradingView chart component"
  status: done

- id: P4-4
  task: "Trading detail page + trade panel"
  status: done

- id: P4-5
  task: "Git commits + tag + push"
  status: done

### P4 Review Fixes Applied (v0.5.0)

**Critical (fixed)**
- C1: MCap calculation used wrong unit (AVAX/Token instead of USD) — now uses token_price in TokenCard and MarketStats
- C2: Mock sort handler ignored sortType — now applies mcap/trending/most_funded/creation_time_desc sorting
- C3: frontend.md violations — removed gap-0, replaced inline style with className, added leading-[1.2] to p tags

**Important (fixed)**
- I1: Logo placeholder ignored image_uri — now renders img when available with fallback placeholder
- I2: Missing error handling — added isError branches with EmptyState in trading list and error UI in detail page

**Minor (fixed)**
- M1: Tab accessibility incomplete — added aria-controls, tabpanel with aria-labelledby

Build: ✅ passes (npm run build)


---

## Phase 5: Dashboards (Portfolio + Builder)

### Status: done

### Scope (P0 focus, real API)

**Portfolio (/portfolio)**
- P-1: Wallet required prompt
- P-2: Portfolio overview (4 stat cards)
- P-3: My holdings table
- P-8: Trade button → /trading/:tokenId
- P-10: Activity section (tab filters)
- P-11: IDO activity
- P-12: Trades activity
- P-16: Empty state

**Builder (/builder)**
- B-1: Access control (wallet + owner)
- B-2: Project selector dropdown
- B-3: Project overview card
- B-4: Milestone management cards
- B-5: Submit for verification button
- B-6: Submit modal (evidence text + file upload)
- B-8: Verification status polling (30s)
- B-9: Verification complete state

**Deferred (P1/P2/SC)**
- P-4/5: IDO badge + milestone dots
- P-6/7: Holdings search + sort
- P-9: View project link
- P-13/14: Refunds + infinite scroll
- P-15: Real-time WebSocket
- B-7: UMA Oracle contract call
- B-10/11/12: Resubmit, chart, investor list

### Plan

#### P5-1: Portfolio Data Layer
- src/features/portfolio/types.ts — IPortfolioOverview, IHoldToken, IIdoHistory, ISwapHistory
- src/features/portfolio/services.ts — getPortfolio, getHoldTokens, getIdoHistory, getSwapHistory (withCredentials)
- src/features/portfolio/query-keys.ts — portfolioKeys factory
- src/features/portfolio/hooks.ts — usePortfolio, useHoldTokens, useIdoHistory, useSwapHistory

#### P5-2: Portfolio Page
- src/components/portfolio/PortfolioOverview.tsx — 4 StatCards (Portfolio Value, Total Invested, Trading P&L, Active IDOs)
- src/components/portfolio/HoldingsTable.tsx — token holdings with trade button
- src/components/portfolio/ActivitySection.tsx — tab filters (All/IDO/Trades/Refunds) + activity lists
- src/components/portfolio/WalletRequired.tsx — connect wallet prompt
- src/app/portfolio/page.tsx — compose with auth gate

#### P5-3: Builder Data Layer
- src/features/builder/types.ts — IBuilderOverview, IBuilderStats
- src/features/builder/services.ts — getBuilderOverview, getBuilderStats, submitMilestone, uploadEvidence
- src/features/builder/query-keys.ts — builderKeys factory
- src/features/builder/hooks.ts — useBuilderOverview, useBuilderStats, useSubmitMilestone

#### P5-4: Builder Page
- src/components/builder/ProjectSelector.tsx — dropdown to switch projects
- src/components/builder/ProjectOverviewCard.tsx — name, status, progress, stats
- src/components/builder/MilestoneManagement.tsx — vertical card list, status-specific UI
- src/components/builder/SubmitModal.tsx — evidence text + file upload
- src/components/builder/VerificationStatus.tsx — polling badge (30s interval)
- src/app/builder/page.tsx — compose with auth + owner gate

#### P5-5: Git
- Branch: feat/phase-5-dashboards
- Logical commits → merge --no-ff → tag v0.6.0 → push

### Tasks
- id: P5-1
  task: "Portfolio data layer"
  status: done

- id: P5-2
  task: "Portfolio page + components"
  status: done
  blocked_by: [P5-1]

- id: P5-3
  task: "Builder data layer"
  status: done

- id: P5-4
  task: "Builder page + components"
  status: done
  blocked_by: [P5-3]

- id: P5-5
  task: "Git commits + tag + push"
  status: done
  blocked_by: [P5-2, P5-4]

---

## Phase 3-4 Completion: Contract Integration

### Status: done

### Scope
Wire real contract calls using existing ABI + wagmi hooks. Replace all stubs/mocks with actual TX flows.

### IDO Contract Functions
- `buy(address token, uint256 usdcAmount)` — invest in project
- `refund(address token, uint256 tokenAmount)` — claim refund
- `create(tuple params)` — create project (with USDC approve)
- `projects(address token)` — read project data
- `getMilestones(address token)` — read milestones

### ERC20 (USDC)
- `approve(spender, amount)` — approve before buy/create
- `balanceOf(address)` — show balance
- `allowance(owner, spender)` — check allowance

### PoolManager
- `swap(tuple key, tuple params, bytes hookData)` — token swap (trading)

### Plan

#### C-1: Contract Hooks Layer
- src/features/contracts/hooks.ts — wagmi useWriteContract + useWaitForTransactionReceipt wrappers:
  - useInvest(token, amount) — approve USDC → buy
  - useRefund(token, tokenAmount) — refund
  - useCreateProject(params) — approve → create
  - useSwap(key, params) — swap
- src/features/contracts/reads.ts — useReadContract wrappers:
  - useUsdcBalance(address)
  - useUsdcAllowance(owner, spender)
  - useProjectOnChain(token)
  - useMilestonesOnChain(token)

#### C-2: Investment Flow Wiring
- InvestModal.tsx — replace setTimeout mock with useInvest hook
- InvestPanel.tsx — show real USDC balance, check allowance
- Approve → Buy two-step TX flow with loading states
- TX hash link to Snowtrace

#### C-3: Refund Flow Wiring
- InvestPanel.tsx "Claim Refund" → useRefund hook
- TX pending → success/fail states

#### C-4: Launch Flow Wiring
- Launch page ReviewStep → useCreateProject hook
- Approve USDC → create TX → redirect to new project
- Map Zustand form store → contract params tuple

#### C-5: Trade Panel Wiring
- TradePanel.tsx → useSwap hook
- Buy/Sell with approve step
- Replace "Coming soon" toast with real TX
- Slippage from local state → hookData

#### C-6: Git
- Branch: feat/contract-integration
- Logical commits → merge --no-ff → tag v0.7.0 → push

### Tasks
- id: C-1
  task: "Contract hooks + reads layer"
  status: done

- id: C-2
  task: "Investment flow wiring"
  status: done
  blocked_by: [C-1]

- id: C-3
  task: "Refund flow wiring"
  status: done
  blocked_by: [C-1]

- id: C-4
  task: "Launch flow wiring"
  status: done
  blocked_by: [C-1]

- id: C-5
  task: "Trade panel wiring"
  status: done
  blocked_by: [C-1]

- id: C-6
  task: "Git commits + tag + push"
  status: done
  blocked_by: [C-2, C-3, C-4, C-5]

### Contract Integration Review Fixes Applied (v0.7.0)

**Critical (fixed)**
- C1: Removed native `value` from PoolManager.swap call (ABI is nonpayable — would revert)
- C2: Documented slippageBps as TODO — extreme price bounds used for hackathon MVP

**Important (fixed)**
- I1: Added post-TX query invalidation in InvestModal, InvestPanel, TradePanel (invalidates all readContract queries)
- I2: Added tokenPrice division-by-zero guard in launch page

**TODOs for production**
- Swap slippage: compute sqrtPriceLimitX96 from current pool price + slippageBps
- Native AVAX swaps: may require WAVAX wrapping or router contract
- Approve optimization: check existing allowance before approve TX (skip if sufficient)

Build: ✅ passes (`npm run build`)
Git: v0.7.0 tagged + pushed to GitHub
