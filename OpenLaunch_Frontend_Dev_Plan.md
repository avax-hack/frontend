# OpenLaunch Frontend Development Plan

---

## 1. Tech Stack

| Category | Technology | Reason |
|----------|-----------|--------|
| **Framework** | Next.js 14+ (App Router) | SSR/SSG, routing, SEO |
| **Styling** | Tailwind CSS 4 | Fast development, responsive, easy customization |
| **State Management** | Zustand | Lightweight, intuitive, minimal global state |
| **Server State** | TanStack Query (React Query) | Caching, refetching, loading/error states |
| **Wallet** | wagmi + viem | Avalanche C-Chain support, type-safe |
| **Wallet UI** | RainbowKit or Web3Modal | Wallet connect modal |
| **Charts** | TradingView Lightweight Charts | Free, lightweight, customizable |
| **Forms** | React Hook Form + Zod | Validation, multi-step forms |
| **Markdown** | react-markdown + rehype | Project description rendering |
| **Rich Editor** | Tiptap or MDXEditor | Project creation Full Description |
| **Animation** | Framer Motion (if needed) | Carousel, modal transitions |
| **Icons** | Lucide React | Lightweight, consistent icon set |
| **Toast** | Sonner | Clean toast notifications |
| **WebSocket** | Native WebSocket (JSON-RPC 2.0) | Real-time feeds (separate server :8001) |

---

## 2. Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (Header, Providers)
│   ├── page.tsx                  # Landing page (/)
│   ├── explore/
│   │   └── page.tsx              # Project explorer
│   ├── projects/
│   │   └── [id]/
│   │       └── page.tsx          # Project detail
│   ├── launch/
│   │   └── page.tsx              # Project creation (multi-step)
│   ├── trading/
│   │   ├── page.tsx              # Trading list
│   │   └── [tokenId]/
│   │       └── page.tsx          # Trading detail
│   ├── portfolio/
│   │   └── page.tsx              # Portfolio / My page
│   ├── builder/
│   │   └── page.tsx              # Builder dashboard
│   └── globals.css
│
├── components/
│   ├── common/                   # Shared components
│   │   ├── Header.tsx
│   │   ├── TabSwitcher.tsx
│   │   ├── ConnectWalletButton.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── MilestoneDots.tsx
│   │   ├── TokenLogo.tsx
│   │   ├── StatCard.tsx
│   │   ├── EmptyState.tsx
│   │   ├── SkeletonCard.tsx
│   │   ├── Modal.tsx
│   │   └── Toast.tsx
│   │
│   ├── landing/                  # Landing page
│   │   ├── HeroSection.tsx
│   │   ├── FeaturedCarousel.tsx
│   │   ├── FeaturedProjectCard.tsx
│   │   ├── ActiveProjectsGrid.tsx
│   │   └── ProjectCard.tsx
│   │
│   ├── project-detail/           # Project detail
│   │   ├── ProjectHero.tsx
│   │   ├── FundingProgressBar.tsx
│   │   ├── MilestoneRoadmap.tsx
│   │   ├── MilestoneNode.tsx
│   │   ├── FundAllocationBar.tsx
│   │   ├── ProjectOverview.tsx
│   │   ├── TeamSection.tsx
│   │   └── InvestCTA.tsx
│   │
│   ├── launch/                   # Project creation
│   │   ├── StepIndicator.tsx
│   │   ├── Step1ProjectInfo.tsx
│   │   ├── Step2Milestones.tsx
│   │   ├── Step3Review.tsx
│   │   ├── MilestoneCard.tsx
│   │   ├── LogoUpload.tsx
│   │   └── RichEditor.tsx
│   │
│   ├── portfolio/                # Portfolio
│   │   ├── PortfolioOverview.tsx
│   │   ├── HoldingsTable.tsx
│   │   ├── HoldingRow.tsx
│   │   ├── ActivitySection.tsx
│   │   ├── IDOActivityRow.tsx
│   │   ├── TradeActivityRow.tsx
│   │   └── RefundActivityRow.tsx
│   │
│   ├── builder/                  # Builder dashboard
│   │   ├── ProjectSelector.tsx
│   │   ├── ProjectOverviewCard.tsx
│   │   ├── MilestoneManagement.tsx
│   │   ├── MilestoneCard.tsx
│   │   ├── SubmitMilestoneModal.tsx
│   │   ├── MilestoneDataChart.tsx
│   │   └── InvestorList.tsx
│   │
│   ├── trading/                  # Trading
│   │   ├── LiveTransactionTicker.tsx
│   │   ├── FeaturedBanner.tsx
│   │   ├── TrendingRow.tsx
│   │   ├── TrendingChip.tsx
│   │   ├── FilterBar.tsx
│   │   ├── CategoryPills.tsx
│   │   ├── TokenCardGrid.tsx
│   │   └── TokenCard.tsx
│   │
│   └── trading-detail/           # Trading detail
│       ├── TokenHeader.tsx
│       ├── MarketStatsRow.tsx
│       ├── TradingViewChart.tsx
│       ├── TradesTab.tsx
│       ├── HoldersTab.tsx
│       ├── AboutTab.tsx
│       ├── TradePanel.tsx
│       ├── BondingCurveCard.tsx
│       ├── MilestoneStatusCard.tsx
│       ├── TokenInfoCard.tsx
│       └── SlippageModal.tsx
│
├── hooks/                        # Custom hooks
│   ├── useWallet.ts              # Wallet connection state
│   ├── useAuth.ts                # Auth (nonce + signature)
│   ├── useContract.ts            # Smart contract call wrapper
│   ├── useWebSocket.ts           # WS connection management
│   ├── useInfiniteScroll.ts      # Infinite scroll
│   └── useDebounce.ts            # Debounce
│
├── lib/
│   ├── api.ts                    # API client (fetch wrapper, auth headers)
│   ├── contracts.ts              # Contract ABI + addresses
│   ├── constants.ts              # Constants (chain ID, addresses, etc.)
│   ├── utils.ts                  # Utilities (format, truncate, etc.)
│   └── validations.ts            # Zod schemas
│
├── stores/                       # Zustand stores
│   ├── authStore.ts              # Auth state
│   └── themeStore.ts             # Dark mode
│
├── types/                        # TypeScript types
│   ├── project.ts
│   ├── milestone.ts
│   ├── token.ts
│   ├── portfolio.ts
│   └── api.ts
│
└── providers/
    ├── WalletProvider.tsx         # wagmi + RainbowKit
    ├── QueryProvider.tsx          # TanStack Query
    └── ThemeProvider.tsx          # Dark mode
```

---

## 3. Shared Component Details

### Header

```
Shared across all pages. Placed in layout.tsx.

Props: None (internally detects route/wallet state)

Conditional rendering:
- Launchpad tab: /, /explore, /projects/:id, /launch, /portfolio, /builder
- Trading tab: /trading, /trading/:tokenId
- Wallet not connected: "Connect Wallet" button
- Wallet connected: blockie avatar + 0xA9c...F2a chip
```

### StatusBadge

```
Reused for: project status, milestone status, Bonding/DEX, category, etc.

Props: {
  label: string,
  variant: "green" | "amber" | "red" | "gray" | "purple" | "blue",
  size?: "sm" | "md"
}
```

### ProgressBar

```
Reused for: funding progress, bonding curve, milestone progress

Props: {
  percent: number,
  color?: "green" | "purple" | "blue",
  showLabel?: boolean,
  size?: "sm" | "md" | "lg"
}
```

### MilestoneDots

```
Reused for: Portfolio Holdings, Trading cards, Project cards

Props: {
  completed: number,
  total: number,
  size?: "sm" | "md"
}

Renders: ●●●○ (completed=3, total=4)
```

### StatCard

```
Reused for: Portfolio Overview, Project detail stats

Props: {
  label: string,
  value: string | number,
  change?: number,          // +/- percentage
  prefix?: string,          // "$" etc.
  size?: "sm" | "md" | "lg"
}
```

---

## 4. Routing & Page Mapping

| Path | Page | Auth Required | Tab |
|------|------|--------------|-----|
| `/` | Landing | No | Launchpad |
| `/explore` | Project Explorer | No | Launchpad |
| `/projects/:id` | Project Detail | No (required for investing) | Launchpad |
| `/launch` | Project Creation | Yes (Step 3) | Launchpad |
| `/trading` | Trading List | No | Trading |
| `/trading/:tokenId` | Trading Detail | No (required for trading) | Trading |
| `/portfolio` | Portfolio | Yes | Launchpad |
| `/builder` | Builder Dashboard | Yes | Launchpad |

---

## 5. State Management Strategy

```
┌─────────────────────────┐
│   Zustand (global)       │  → authStore: wallet address, session, connection state
│                          │  → themeStore: dark/light
└─────────┬───────────────┘
          │
┌─────────▼───────────────┐
│   TanStack Query (server)│  → API data caching, refetching
│                          │  → staleTime: 30s (trade data)
│                          │  → staleTime: 5min (project info)
└─────────┬───────────────┘
          │
┌─────────▼───────────────┐
│   Local State (component)│  → form inputs, modal open, tab selection, etc.
└─────────────────────────┘

Principles:
- Server data = TanStack Query (never put in Zustand)
- Global UI state = Zustand (auth, theme — minimal only)
- Component state = useState / React Hook Form
```

---

## 6. API Client Pattern

```typescript
// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: 'include',    // session cookie
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'API Error');
  }

  return res.json();
}

// Usage example (TanStack Query)
export function useProject(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchAPI<IProjectData>(`/project/${id}`),
    staleTime: 5 * 60 * 1000, // 5 min
  });
}

export function useTokens(sortType: string, filters: TokenFilters) {
  return useInfiniteQuery({
    queryKey: ['tokens', sortType, filters],
    queryFn: ({ pageParam = 1 }) =>
      fetchAPI<ITokenListData>(`/order/${sortType}?${qs({ ...filters, page: pageParam })}`),
    getNextPageParam: (last, pages) =>
      pages.length * 12 < last.total_count ? pages.length + 1 : undefined,
  });
}
```

---

## 7. Smart Contract Integration Pattern

```typescript
// lib/contracts.ts
import { getContract } from 'viem';
import { useWalletClient, usePublicClient } from 'wagmi';

// ABIs from backend repo: backend/abi/*.json
// Backend uses alloy bindings for: IDO, LpManager, ProjectToken
import { IDOABI } from './abi/IDO';
import { LpManagerABI } from './abi/LpManager';
import { ProjectTokenABI } from './abi/ProjectToken';

export const CONTRACTS = {
  ido: process.env.NEXT_PUBLIC_IDO_CONTRACT as `0x${string}`,
  lpManager: process.env.NEXT_PUBLIC_LP_MANAGER_CONTRACT as `0x${string}`,
  usdc: process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`,
} as const;

// hooks/useContract.ts
export function useInvest(projectId: string) {
  const { writeContractAsync } = useWriteContract();

  return useMutation({
    mutationFn: async (amountInWei: bigint) => {
      const hash = await writeContractAsync({
        address: CONTRACTS.ido,
        abi: IDOABI,
        functionName: 'invest',
        args: [projectId],
        value: amountInWei,
      });
      return hash;
    },
  });
}

export function useSwap(tokenId: string) {
  const { writeContractAsync } = useWriteContract();

  return useMutation({
    mutationFn: async ({ type, amount, token }: SwapParams) => {
      // bonding vs graduated branching
      if (token.market_type === 'CURVE') {
        // LpManager handles bonding curve swaps
        return writeContractAsync({
          address: CONTRACTS.lpManager,
          abi: LpManagerABI,
          functionName: type === 'buy' ? 'buy' : 'sell',
          args: type === 'buy' ? [tokenId] : [tokenId, amount],
          value: type === 'buy' ? amount : 0n,
        });
      } else {
        // DEX (graduated) — Uniswap V4 Router
        return writeContractAsync({
          address: UNISWAP_V4_ROUTER,
          abi: UniswapV4RouterABI,
          functionName: 'exactInputSingle',
          args: [/* swap params */],
          value: type === 'buy' ? amount : 0n,
        });
      }
    },
  });
}
```

---

## 8. Development Order (Recommended)

### Phase 1: Skeleton + Landing (1 week)

```
[ ] Project setup (Next.js + Tailwind 4 + TypeScript)
[ ] Shared components (Header, StatusBadge, ProgressBar, Modal, Toast)
[ ] Providers setup (Wallet, Query, Theme)
[ ] API client (lib/api.ts)
[ ] Type definitions (types/)
[ ] Landing page (Hero + Featured Carousel + Active Projects Grid)
```

### Phase 2: Project Core (1 week)

```
[ ] Project detail page (hero + funding bar + milestone roadmap)
[ ] Project creation multi-step form (3 steps)
[ ] Logo upload + rich editor
[ ] Form validation (Zod)
```

### Phase 3: Wallet + On-chain (1 week)

```
[ ] Wallet connect (wagmi + RainbowKit)
[ ] Auth flow (nonce → signature → session)
[ ] Investment flow (Invest CTA → contract call → TX pending)
[ ] Project launch (contract deployment)
```

### Phase 4: Trading (1-2 weeks)

```
[ ] Trading list (card grid + filters + infinite scroll)
[ ] Trading detail (TradingView chart + Trade Panel)
[ ] Swap logic (Bonding / Uniswap V4 branching)
[ ] Real-time trade ticker (WebSocket)
[ ] Trending section
```

### Phase 5: Dashboards (1 week)

```
[ ] Portfolio page (Overview + Holdings + Activity)
[ ] Builder dashboard (milestone management + submit modal)
[ ] Verification status polling/WebSocket
```

### Phase 6: Polish (1 week)

```
[ ] Responsive (Mobile / Tablet)
[ ] Skeleton loading + empty states
[ ] Unified error handling
[ ] Dark mode (P2)
[ ] SEO meta tags
[ ] Performance optimization (images, bundle)
```

---

## 9. Responsive Breakpoints

```
Using Tailwind 4 defaults:

sm:  640px   (large mobile)
md:  768px   (tablet)
lg:  1024px  (small desktop)
xl:  1280px  (desktop)
2xl: 1536px  (large desktop)

Key responsive patterns:
- Card grid: 1 col (sm) → 2 col (md) → 3 col (xl)
- 2-column layout: stacked (sm) → side-by-side (lg)
- Table: table (lg) → card list (sm)
- Modal: center modal (lg) → fullscreen (sm)
- Trade Panel: sidebar (lg) → sticky bottom sheet (sm)
```

---

## 10. Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000     # REST API server
NEXT_PUBLIC_WS_URL=ws://localhost:8001        # WebSocket server (separate port!)
NEXT_PUBLIC_CHAIN_ID=43114                    # Avalanche C-Chain
NEXT_PUBLIC_IDO_CONTRACT=0x...               # IDO contract address
NEXT_PUBLIC_LP_MANAGER_CONTRACT=0x...        # LP Manager contract address
NEXT_PUBLIC_USDC_ADDRESS=0x...               # USDC token address
NEXT_PUBLIC_UNISWAP_V4_ROUTER=0x...
NEXT_PUBLIC_SNOWTRACE_URL=https://snowtrace.io
```

---

## 11. Naming Conventions

```
File names:
  - Components: PascalCase.tsx (Header.tsx, TokenCard.tsx)
  - Hooks: camelCase.ts (useWallet.ts, useContract.ts)
  - Utils: camelCase.ts (utils.ts, validations.ts)
  - Types: camelCase.ts (project.ts, token.ts)

Components:
  - PascalCase (ProjectCard, TradePanel)
  - Props type: {ComponentName}Props

CSS:
  - Tailwind classes directly
  - Padding-first (CLAUDE.md convention)
  - Parent: padding + gap / Children: minimize margin

Git:
  - [type] message (CLAUDE.md convention)
  - feat, fix, refactor, chore, docs, style, test
```
