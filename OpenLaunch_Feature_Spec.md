# OpenLaunch Feature Specification

> **Easy to Launch. Hard to Rug.**
> Avalanche C-Chain | Milestone-based Decentralized Launchpad

---

# Part 1. Feature Matrix

## Legend

- **Priority**: P0 = MVP Must-have / P1 = Important / P2 = Nice-to-have
- **Owner**: F = Frontend / B = Backend / SC = Smart Contract / Both = Both sides

---

## 1. Common

| # | Feature | Description | Priority | Owner | Check |
|---|---------|-------------|----------|-------|-------|
| C-1 | Header | Logo, tab switcher (Launchpad/Trading), Explore, Launch, wallet connect | P0 | F | [ ] |
| C-2 | Wallet Connect | MetaMask / Core Wallet connection, address display, disconnect | P0 | F | [ ] |
| C-3 | Wallet Auth | Signature-based auth (wallet signature verification for backend API calls) | P0 | Both | [ ] |
| C-4 | Dark Mode Toggle | Light/dark theme switch (localStorage persist) | P2 | F | [ ] |
| C-5 | Responsive | Desktop / Tablet / Mobile support | P1 | F | [ ] |
| C-6 | Error Handling | Unified handling for API errors, network errors, contract errors | P0 | Both | [ ] |
| C-7 | Toast Notifications | Success/failure/info alerts (TX success, errors, etc.) | P1 | F | [ ] |

---

## 2. Landing Page (/)

| # | Feature | Description | Priority | Owner | Check |
|---|---------|-------------|----------|-------|-------|
| L-1 | Hero Section | "EASY TO LAUNCH. HARD TO RUG." + subtitle text | P0 | F | [ ] |
| L-2 | Featured Projects Grid | 4-column grid of featured projects (logo, name, stats) | P0 | Both | [ ] |
| L-3 | Featured Card Content | Logo, name, badges (Funding/Milestone), description, Target, Committed, Milestone Progress | P0 | B | [ ] |
| L-4 | Project Card | Logo, name (ticker), description, Launched/Target/Funded% | P0 | B | [ ] |
| L-5 | Funded% Color | 75%+ green, 40-74% default, <40% gray | P1 | F | [ ] |

---

## 3. Project Detail (/projects/:id)

| # | Feature | Description | Priority | Owner | Check |
|---|---------|-------------|----------|-------|-------|
| D-1 | Project Hero | Logo, name, ticker, status badge, chain badge | P0 | Both | [ ] |
| D-2 | Funding Stats | Target Raise, Total Committed, Investor count | P0 | B | [ ] |
| D-3 | Funding Progress Bar | Percentage display + amount label ("62% - $312,450 raised") | P0 | F | [ ] |
| D-4 | Milestone Roadmap | Horizontal timeline, 4-stage nodes, status-specific icons/colors | P0 | Both | [ ] |
| D-5 | Milestone Status Display | completed (green) / in_verification (amber) / pending (gray) | P0 | B | [ ] |
| D-6 | Fund Release Label | "Fund Release 25%" below each milestone | P1 | F | [ ] |
| D-7 | Fund Allocation Bar | Horizontal stacked bar — color-coded per milestone + labels | P1 | F | [ ] |
| D-8 | Project Overview | Markdown-rendered project description | P0 | B | [ ] |
| D-9 | Team Section | Team description + social links (Telegram, Twitter, Website, GitHub) | P1 | B | [ ] |
| D-10 | Invest CTA (sticky) | Amount input ($, min $10) + "Commit Funds" button | P0 | Both | [ ] |
| D-11 | Investment Flow | Confirmation modal → wallet signature → TX pending → success/failure | P0 | Both/SC | [ ] |
| D-12 | Wallet Not Connected | Replace with "Connect Wallet" button | P0 | F | [ ] |
| D-13 | Funding Complete | Disable input + show "Funding Complete" | P0 | F | [ ] |
| D-14 | Project Failed | Replace with "Claim Refund" button | P0 | Both/SC | [ ] |
| D-15 | UMA Verification Modal | Click "In Verification" → Oracle verification details | P2 | Both | [ ] |

---

## 4. Project Creation (/launch)

| # | Feature | Description | Priority | Owner | Check |
|---|---------|-------------|----------|-------|-------|
| CR-1 | Step Indicator | 3 steps (Project Info → Milestones → Review & Launch) | P0 | F | [ ] |
| CR-2 | Step 1: Project Info | name, ticker, description, logo, links, target, supply | P0 | F | [ ] |
| CR-3 | Rich Editor | Full Description markdown editing (B/I/U/link/list/image) | P1 | F | [ ] |
| CR-4 | Logo Upload | Drag & drop, PNG/JPG, max 5MB, preview | P0 | Both | [ ] |
| CR-5 | Ticker Validation | Real-time server validation on input (debounce 500ms) | P0 | Both | [ ] |
| CR-6 | Step 2: Milestone Setup | Card-based milestone input (title, description, allocation %) | P0 | F | [ ] |
| CR-7 | Milestone Add/Remove | Min 2, max 6, real-time sum validation = 100% | P0 | F | [ ] |
| CR-8 | Step 3: Review & Launch | Preview card + milestone summary + warning text | P0 | F | [ ] |
| CR-9 | Project Launch | Final submit → API + smart contract deploy → wallet signature | P0 | Both/SC | [ ] |
| CR-10 | Form Validation | Per-step required fields, format validation, error highlighting | P0 | F | [ ] |
| CR-11 | Form Data Persistence | Preserve data when navigating between steps | P0 | F | [ ] |

### Validation Rules

| Field | Rules |
|-------|-------|
| name | Required, 2-50 chars |
| ticker | Required, 2-10 chars, uppercase alphanumeric, server duplicate check |
| description | Required, 20+ chars, markdown |
| logo | Required, PNG/JPG, max 5MB |
| target_raise | Required, >= $1,000 |
| token_supply | Required, >= 1 |
| links | Optional, URL format validation when provided |
| milestones | Min 2, max 6 |
| milestone.title | Required |
| milestone.description | Required |
| milestone.allocation | Required, 1-100, total sum === 100 |

---

## 5. Portfolio / My Page (/portfolio)

| # | Feature | Description | Priority | Owner | Check |
|---|---------|-------------|----------|-------|-------|
| P-1 | Wallet Required | Show "Connect Wallet" prompt when not connected | P0 | F | [ ] |
| P-2 | Portfolio Overview | 4 stat cards: Portfolio Value, Total Invested (IDO), Trading P&L, Active IDOs | P0 | B | [ ] |
| P-3 | My Holdings Table | Token holdings list (logo, name, ticker, balance, value, P&L, current price) | P0 | Both | [ ] |
| P-4 | IDO Badge | Purple "IDO" badge + left border accent for IDO-acquired tokens | P1 | F | [ ] |
| P-5 | Milestone Dots | Milestone progress dots (e.g., ●●●○) for IDO tokens | P1 | B | [ ] |
| P-6 | Holdings Search | Client-side filtering by token name/ticker | P1 | F | [ ] |
| P-7 | Holdings Sort | Sort dropdown: Value / P&L / Balance | P1 | F | [ ] |
| P-8 | Trade Button | Navigate to /trading/:tokenId | P0 | F | [ ] |
| P-9 | View Project Link | IDO tokens only → /projects/:id | P1 | F | [ ] |
| P-10 | Activity Section | Tab filters: All / IDO Participation / Trades / Refunds | P0 | Both | [ ] |
| P-11 | IDO Activity | Project name, invested amount, current value, P&L, milestone progress, status badge | P0 | B | [ ] |
| P-12 | Trades Activity | Time, token, Buy/Sell, amount, price, total, TX hash link | P0 | B | [ ] |
| P-13 | Refunds Activity | Project name, original investment, refund amount, failed milestone, TX hash | P1 | B | [ ] |
| P-14 | Infinite Scroll | Activity list pagination | P1 | Both | [ ] |
| P-15 | Real-time Price Update | WebSocket auto-update for held token prices/values | P2 | Both | [ ] |
| P-16 | Empty State | "Explore Projects" + "Start Trading" CTAs when no tokens | P1 | F | [ ] |

---

## 6. Builder Dashboard (/builder)

| # | Feature | Description | Priority | Owner | Check |
|---|---------|-------------|----------|-------|-------|
| B-1 | Access Control | Wallet required + project owner only | P0 | Both | [ ] |
| B-2 | Project Selector | Dropdown to switch between my projects | P0 | Both | [ ] |
| B-3 | Project Overview Card | Dark card: name, status badge, progress bar, Total Raised, Investors, Current Milestone | P0 | B | [ ] |
| B-4 | Milestone Management Cards | Vertical card list, status-specific UI (completed/verification/current/pending) | P0 | Both | [ ] |
| B-5 | Submit for Verification | Green button on current active milestone | P0 | F | [ ] |
| B-6 | Submit Modal | Evidence text + file upload (PDF/ZIP, max 10MB) + "Submit to UMA Oracle" | P0 | Both | [ ] |
| B-7 | UMA Oracle Submit | Smart contract submitMilestone() call → wallet signature | P0 | SC | [ ] |
| B-8 | Verification Status Polling | Poll every 30s after submission (pending/verified/rejected/disputed) | P0 | Both | [ ] |
| B-9 | Verification Complete | verified → "Funds Released" badge transition + toast | P0 | Both | [ ] |
| B-10 | Verification Failed | rejected → red warning + "Resubmit" button | P1 | Both | [ ] |
| B-11 | Milestone Data Chart | Funding trend bar chart (monthly cumulative) | P2 | Both | [ ] |
| B-12 | Investor List | Wallet Address, Amount, Date table (latest 5 + See All) | P1 | B | [ ] |
| B-13 | No Projects State | "No projects yet" + "Launch a Project" CTA | P1 | F | [ ] |

---

## 7. Trading List (/trading)

| # | Feature | Description | Priority | Owner | Check |
|---|---------|-------------|----------|-------|-------|
| T-1 | Live Transaction Ticker | Top horizontal scroll — wallet + action + amount + token (WebSocket) | P1 | Both | [ ] |
| T-2 | Featured Banner | "Discover milestone-verified projects on Avalanche" + Explore button | P2 | F | [ ] |
| T-3 | Trending Horizontal Scroll | Top 5-8 token chips (logo + name + MCap) | P1 | B | [ ] |
| T-4 | Sort Filter | Recent / Market Cap / Trending / Most Funded | P0 | Both | [ ] |
| T-5 | Category Filter | All / DeFi / Infra / AI / Gaming / Social / Meme | P0 | Both | [ ] |
| T-6 | Verified Only Toggle | Filter for milestone 1+ completed projects only | P1 | Both | [ ] |
| T-7 | Search | Token name/ticker search (debounce 300ms) | P0 | Both | [ ] |
| T-8 | Token Card Grid | 3-column, image + milestone badge + category + name + price + MCap + Holders | P0 | Both | [ ] |
| T-9 | Milestone Score Badge | Top-left number on card (0-4, color-coded) | P0 | B | [ ] |
| T-10 | Bonding/DEX Status | Bottom progress bar (bonding) or DEX badge (graduated) | P0 | B | [ ] |
| T-11 | Card Click | Navigate to /trading/:tokenId | P0 | F | [ ] |
| T-12 | Infinite Scroll | Load 12 at a time, skeleton loading | P1 | Both | [ ] |

---

## 8. Trading Detail (/trading/:tokenId)

| # | Feature | Description | Priority | Owner | Check |
|---|---------|-------------|----------|-------|-------|
| TD-1 | Token Header | Logo, name, ticker, contract address (copy), social links, status badges | P0 | Both | [ ] |
| TD-2 | Market Stats Row | Price (+change%), MCap, ATH, 24h Volume, Holders | P0 | B | [ ] |
| TD-3 | TradingView Chart | Candlestick + volume, dark embed | P0 | Both | [ ] |
| TD-4 | Chart Interval Selector | 1m, 5m, 15m, 1h, 4h, 1D | P0 | Both | [ ] |
| TD-5 | Price/MCap Toggle | Chart Y-axis switch | P1 | F | [ ] |
| TD-6 | USD/AVAX Toggle | Price display currency switch | P1 | F | [ ] |
| TD-7 | Trades Tab | Real-time trade table: Time, Buy/Sell, Amount, Price, Wallet, TX | P0 | Both | [ ] |
| TD-8 | Holders Tab | Holder table: Rank, Wallet, Amount, % Supply | P1 | B | [ ] |
| TD-9 | About Tab | Project description + Links + Team Info | P1 | B | [ ] |
| TD-10 | Trade Panel | Buy/Sell toggle + amount input + preset buttons + expected output | P0 | F/SC | [ ] |
| TD-11 | Balance Display | "Balance: X AVAX" (from wallet) | P0 | F | [ ] |
| TD-12 | Swap Quote | Expected output + price impact on amount input | P0 | Both/SC | [ ] |
| TD-13 | Slippage Setting | Default 3%, presets 0.5/1/3/5% + custom input | P0 | F | [ ] |
| TD-14 | Place Order | Smart contract call (Bonding or Uniswap V4) → wallet signature | P0 | SC | [ ] |
| TD-15 | Bonding Curve Card | Progress bar + percentage + "Graduates at 100%" | P0 | B | [ ] |
| TD-16 | Milestone Status Card | Vertical timeline (4 stages, status-specific display) | P0 | B | [ ] |
| TD-17 | Token Info Card | Logo, social links, Price USD/AVAX, FDV, Supply | P1 | B | [ ] |
| TD-18 | Milestone Info Box | "Milestone-protected — funds locked until verified" notice | P1 | F | [ ] |
| TD-19 | Real-time Price/Trades | WebSocket price updates + trade feed push | P1 | Both | [ ] |
| TD-20 | Bonding→DEX Graduation | Notification on 100% bonding curve completion → Uniswap V4 transition | P1 | Both/SC | [ ] |

---

## Feature Count Summary

| Page | P0 | P1 | P2 | Total |
|------|----|----|-----|-------|
| Common | 4 | 1 | 2 | 7 |
| Landing | 5 | 1 | 2 | 8 |
| Project Detail | 10 | 3 | 2 | 15 |
| Project Creation | 9 | 2 | 0 | 11 |
| Portfolio | 8 | 6 | 2 | 16 |
| Builder Dashboard | 8 | 3 | 2 | 13 |
| Trading List | 6 | 4 | 2 | 12 |
| Trading Detail | 11 | 7 | 2 | 20 |
| **Total** | **61** | **27** | **14** | **102** |

---
---

# Part 2. API Spec (Backend Request Document)

> **Aligned with OpenLaunch code conventions**
> - Paths: `/resource/:id` (no `/api/` prefix)
> - Route groups: `/auth`, `/project`, `/milestone`, `/token`, `/order`, `/trend`, `/trade`, `/profile`, `/account`, `/builder`, `/metadata`
> - Auth: Session-based (Redis-backed, `withCredentials: true`, httpOnly cookie)
> - Nonce: Redis GETDEL for replay protection (single-use)
> - Rate limiting: 60s sliding window via Redis
> - Amounts: **string** (wei/precision preservation)
> - Timestamps: **unix number** (seconds)
> - Pagination: `{ page, limit }` request → `{ ..., total_count }` response
> - Type naming: `I{Feature}Data`, `I{Entity}Info`
> - Addresses: `Address` (viem)
> - Contracts: `IDO`, `LpManager`, `ProjectToken` (via alloy bindings)
> - WebSocket: Separate server (:8001), JSON-RPC 2.0, 5 channels
> - Swagger UI: `http://localhost:8000/swagger-ui`

---

## Authentication (Session-based)

```
Session-based auth flow:

1. Frontend: POST /auth/nonce { address }
2. Backend: Generate and store nonce → return
3. Frontend: Sign nonce with wallet
4. Frontend: POST /auth/session { nonce, signature, chain_id }
5. Backend: Verify signature → set httpOnly session cookie
6. Subsequent APIs: withCredentials: true (cookie auto-sent)
7. Logout: DELETE /auth/delete_session

Frontend call pattern:
  httpPost("/auth/nonce", { body: { address } })
  httpPost("/auth/session", { body: { nonce, signature, chain_id }, withCredentials: true })
  httpDelete("/auth/delete_session", { withCredentials: true })
```

---

## Type Definitions

```typescript
// types/common.ts
interface IPaginationParams {
  page: number
  limit: number
}

// types/project.ts
interface IProjectInfo {
  project_id: Address          // Contract address
  name: string
  symbol: string               // ticker
  image_uri: string            // logo
  description: string | null
  category: string             // "defi" | "infra" | "ai" | "gaming" | "social" | "meme"
  creator: IAccountInfo
  website: string | null
  twitter: string | null
  github: string | null
  telegram: string | null
  created_at: number           // unix timestamp
}

interface IProjectMarketInfo {
  project_id: Address
  status: "funding" | "active" | "completed" | "failed"
  target_raise: string         // wei string
  total_committed: string      // wei string
  funded_percent: number
  investor_count: number
}

interface IMilestoneInfo {
  milestone_id: string
  order: number
  title: string
  description: string
  fund_allocation_percent: number
  fund_release_amount: string  // wei string
  status: "completed" | "in_verification" | "submitted" | "pending" | "failed"
  funds_released: boolean
  evidence_uri: string | null
  submitted_at: number | null  // unix
  verified_at: number | null   // unix
}

// types/token.ts (for trading)
interface ITokenInfo {
  token_id: Address
  name: string
  symbol: string
  image_uri: string
  banner_uri: string | null
  description: string | null
  category: string
  is_graduated: boolean        // bonding → DEX graduation status
  creator: IAccountInfo
  website: string | null
  twitter: string | null
  telegram: string | null
  created_at: number
  project_id: Address | null   // linked IDO project
}

interface IMarketInfo {
  market_type: "CURVE" | "DEX"
  token_id: Address
  token_price: string          // USD
  native_price: string         // AVAX/USD
  price: string                // AVAX/Token
  ath_price: string
  total_supply: string
  volume: string
  holder_count: number
  bonding_percent: number      // 0-100
  milestone_completed: number  // 0-4
  milestone_total: number
}

interface ISwapInfo {
  event_type: "BUY" | "SELL"
  native_amount: string
  token_amount: string
  native_price: string
  transaction_hash: string
  value: string
  account_info: IAccountInfo
  created_at: number
}

// types/account.ts
interface IAccountInfo {
  account_id: Address
  nickname: string
  bio: string
  image_uri: string
}
```

---

## Auth

### `POST /auth/nonce`

Issue nonce for wallet authentication

```
Body: { "address": "0xA9cc...7777" }

Response 200:
{
  "nonce": "Sign this message to verify your identity: abc123xyz"
}
```

### `POST /auth/session`

Create session (issue cookie after signature verification)

```
Body:
{
  "nonce": "Sign this message to verify your identity: abc123xyz",
  "signature": "0x...",
  "chain_id": 43114
}

withCredentials: true

Response 200:
{
  "account_info": {
    "account_id": "0xA9cc...7777",
    "nickname": "",
    "bio": "",
    "image_uri": ""
  }
}
→ Set-Cookie: session=...; HttpOnly; Secure
```

### `DELETE /auth/delete_session`

Logout (delete session)

```
withCredentials: true

Response 200: {}
```

---

## Project (Launchpad)

### `GET /project/:projectId`

Project detail

```
Response 200:  // IProjectData
{
  "project_info": {
    "project_id": "0x1234...5678",
    "name": "NovaDex",
    "symbol": "NOVD",
    "image_uri": "https://storage.../novadex.png",
    "description": "## About NovaDex\n\nNovaDex is...",
    "category": "defi",
    "creator": {
      "account_id": "0xA9cc...7777",
      "nickname": "G0X",
      "bio": "The core developers",
      "image_uri": "https://..."
    },
    "website": "https://nova-dex.io",
    "twitter": "https://x.com/NovaDex",
    "github": "https://github.com/NovaDexLabs",
    "telegram": "https://t.me/novadex",
    "created_at": 1714521600
  },
  "market_info": {
    "project_id": "0x1234...5678",
    "status": "funding",
    "target_raise": "500000000000000000000000",
    "total_committed": "312450000000000000000000",
    "funded_percent": 62,
    "investor_count": 1247
  },
  "milestones": [
    {
      "milestone_id": "ms_001",
      "order": 1,
      "title": "MVP Launch",
      "description": "Ship minimum viable product to testnet",
      "fund_allocation_percent": 25,
      "fund_release_amount": "125000000000000000000000",
      "status": "completed",
      "funds_released": true,
      "evidence_uri": "https://storage.../evidence_ms1.pdf",
      "submitted_at": 1717232400,
      "verified_at": 1717248600
    },
    {
      "milestone_id": "ms_002",
      "order": 2,
      "title": "Beta Release",
      "description": "Public beta with onboarding flow",
      "fund_allocation_percent": 25,
      "fund_release_amount": "125000000000000000000000",
      "status": "in_verification",
      "funds_released": false,
      "evidence_uri": "https://storage.../evidence_ms2.pdf",
      "submitted_at": 1721030400,
      "verified_at": null
    },
    {
      "milestone_id": "ms_003",
      "order": 3,
      "title": "Mainnet Deploy",
      "description": "Deploy audited contracts to Avalanche C-Chain",
      "fund_allocation_percent": 25,
      "fund_release_amount": "125000000000000000000000",
      "status": "pending",
      "funds_released": false,
      "evidence_uri": null,
      "submitted_at": null,
      "verified_at": null
    },
    {
      "milestone_id": "ms_004",
      "order": 4,
      "title": "1000 Users",
      "description": "Achieve 1000 active users on platform",
      "fund_allocation_percent": 25,
      "fund_release_amount": "125000000000000000000000",
      "status": "pending",
      "funds_released": false,
      "evidence_uri": null,
      "submitted_at": null,
      "verified_at": null
    }
  ]
}
```

### `GET /project/featured`

Featured projects for landing hero carousel

```
Response 200:  // IProjectFeaturedData
{
  "projects": [
    {
      "project_info": { ... },   // IProjectInfo
      "market_info": { ... },    // IProjectMarketInfo
      "milestone_completed": 1,
      "milestone_total": 4
    }
  ]
}
```

### `GET /order/project/:sortType`

Project list (by sort criteria)

```
sortType: "recent" | "funded" | "target" | "investors"

Query: { page: 1, limit: 12, status: "funding" }

Response 200:  // IProjectListData
{
  "projects": [
    {
      "project_info": { ... },
      "market_info": { ... },
      "milestone_completed": 1,
      "milestone_total": 4
    }
  ],
  "total_count": 45
}
```

### `POST /project/create`

Create project

```
withCredentials: true

Body:
{
  "name": "TokenX Finance",
  "symbol": "TKX",
  "description": "**TokenX** aims to revolutionize...",
  "image_uri": "https://storage.../logo.png",
  "website": "https://tokenx.io",
  "twitter": "https://x.com/tokenx",
  "github": "https://github.com/tokenx",
  "target_raise": "1000000000000000000000000",
  "token_supply": "100000000000000000000000000",
  "milestones": [
    { "order": 1, "title": "MVP Launch", "description": "Ship MVP", "fund_allocation_percent": 25 },
    { "order": 2, "title": "Beta Release", "description": "Public beta", "fund_allocation_percent": 25 },
    { "order": 3, "title": "Mainnet Deploy", "description": "Deploy to C-Chain", "fund_allocation_percent": 25 },
    { "order": 4, "title": "1000 Users", "description": "Achieve 1000 users", "fund_allocation_percent": 25 }
  ]
}

Response 200:
{
  "project_id": "0xabcd...ef01",
  "transaction_hash": "0x7890..."
}
```

### `GET /project/validate-symbol`

Ticker duplicate check

```
Query: { symbol: "TKX" }

Response 200:
{ "available": true }
```

### `GET /project/investor/:projectId`

Investor list per project

```
Query: { page: 1, limit: 20 }

Response 200:  // IProjectInvestorData
{
  "investors": [
    {
      "account_info": { ... },
      "amount": "16500000000000000000000",
      "created_at": 1715299200
    }
  ],
  "total_count": 1247
}
```

---

## Milestone

### `POST /milestone/submit/:milestoneId`

Submit milestone for verification

```
withCredentials: true

Body:
{
  "evidence_text": "Mainnet contract deployed at 0x... Audit report attached.",
  "evidence_uri": "https://storage.../evidence.pdf"
}

Response 200:
{
  "transaction_hash": "0xabc...",
  "oracle_request_id": "uma_req_001",
  "status": "submitted"
}
```

### `GET /milestone/verification/:milestoneId`

UMA Oracle verification progress status

```
Response 200:  // IMilestoneVerificationData
{
  "milestone_id": "ms_002",
  "status": "pending",
  "submitted_at": 1721030400,
  "estimated_completion": 1721044800,
  "dispute_info": null
}
```

---

## Token (Trading)

### `GET /token/:tokenId`

Token detail

```
Response 200:  // ITokenData
{
  "token_info": {
    "token_id": "0xA9cc...7777",
    "name": "Project Alpha",
    "symbol": "ALPHA",
    "image_uri": "https://...",
    "banner_uri": "https://...",
    "description": "Project Alpha is a...",
    "category": "defi",
    "is_graduated": false,
    "creator": { ... },
    "website": "https://www.openlaunch.com",
    "twitter": "https://x.com/projAlpha",
    "telegram": "https://t.me/projAlpha",
    "created_at": 1714521600,
    "project_id": "0x1234...5678"
  },
  "market_info": {
    "market_type": "CURVE",
    "token_id": "0xA9cc...7777",
    "token_price": "0.0256",
    "native_price": "32.50",
    "price": "0.000787",
    "ath_price": "0.12",
    "total_supply": "100000000000000000000000000",
    "volume": "8300000000000000000000",
    "holder_count": 342,
    "bonding_percent": 98.57,
    "milestone_completed": 1,
    "milestone_total": 4
  }
}
```

### `GET /trend`

Trending tokens (for horizontal scroll)

```
Response 200:  // ITokenTrendData
{
  "tokens": [
    {
      "token_info": { ... },
      "market_info": { ... }
    }
  ]
}
```

### `GET /order/:sortType`

Token list (by sort criteria)

```
sortType: "mcap" | "creation_time_desc" | "trending" | "most_funded"

Query: {
  page: 1,
  limit: 12,
  category: "defi",            // optional
  verified_only: false,        // optional
  search: ""                   // optional
}

Response 200:  // ITokenListData
{
  "tokens": [
    {
      "token_info": { ... },
      "market_info": { ... }
    }
  ],
  "total_count": 120
}
```

### `GET /trade/chart/:tokenAddress`

TradingView OHLCV chart data

```
Query: {
  resolution: "15",            // "1" | "5" | "15" | "60" | "240" | "1D"
  from: 1717200000,
  to: 1717286400,
  countback: 300,
  chart_type: "price"          // "price" | "mcap"
}

Response 200:  // ITradingChartData
{
  "bars": [
    {
      "time": 1717200000,
      "open": "0.0254",
      "high": "0.0260",
      "low": "0.0250",
      "close": "0.0256",
      "volume": "15000"
    }
  ]
}
```

### `GET /trade/swap-history/:tokenId`

Token trade history

```
Query: {
  page: 1,
  limit: 50,
  direction: "DESC",
  trade_type: "ALL"            // "ALL" | "BUY" | "SELL"
}

Response 200:  // ITokenSwapHistoryData
{
  "swaps": [
    {
      "event_type": "BUY",
      "native_amount": "5000000000000000000",
      "token_amount": "500000000000000000000",
      "native_price": "32.50",
      "transaction_hash": "0xabc...",
      "value": "12800000",
      "account_info": { ... },
      "created_at": 1717253570
    }
  ],
  "total_count": 1500
}
```

### `GET /trade/holder/:tokenId`

Holder list

```
Query: { page: 1, limit: 20 }

Response 200:  // ITokenHolderListData
{
  "holders": [
    {
      "rank": 1,
      "account_info": { ... },
      "balance": "22862000000000000000000000",
      "percent": 22.86
    }
  ],
  "total_count": 342
}
```

### `GET /trade/market/:tokenId`

Token market data (for real-time queries)

```
Response 200:  // ITokenMarketData
{
  "market_type": "CURVE",
  "token_price": "0.0256",
  "native_price": "32.50",
  "ath_price": "0.12",
  "volume": "8300000000000000000000",
  "holder_count": 342,
  "bonding_percent": 98.57
}
```

### `GET /trade/metrics/:tokenId`

Token metrics (24h changes, etc.)

```
Query: timeframes=5m,1h,6h,24h

Response 200:  // ITokenMetricsData
{
  "metrics": {
    "5m":  { "price_change": "1.2",  "volume": "500",  "trades": 12 },
    "1h":  { "price_change": "3.5",  "volume": "2400", "trades": 85 },
    "6h":  { "price_change": "8.1",  "volume": "8000", "trades": 320 },
    "24h": { "price_change": "12.5", "volume": "25000", "trades": 1200 }
  }
}
```

### `GET /trade/quote/:tokenId`

Swap quote

```
Query: {
  type: "BUY",
  amount: "5000000000000000000",     // 5 AVAX in wei
  slippage: 3
}

Response 200:  // ITradeQuoteData
{
  "expected_output": "195310000000000000000",
  "price_impact_percent": "0.12",
  "minimum_received": "189450000000000000000",
  "fee": "15000000000000000"
}
```

---

## Profile / Portfolio

### `GET /profile/:address`

User profile (public)

```
Response 200:  // IAccountData
{
  "account_info": {
    "account_id": "0xA9cc...7777",
    "nickname": "degen_whale",
    "bio": "Building on Avalanche",
    "image_uri": "https://..."
  }
}
```

### `GET /account/get_account`

My account info (authenticated)

```
withCredentials: true

Response 200:  // IAccountData
{
  "account_info": { ... }
}
```

### `GET /profile/hold-token/:accountId`

Held token list

```
Query: { page: 1, limit: 20 }

Response 200:  // IAccountHoldTokenData
{
  "tokens": [
    {
      "token_info": { ... },
      "market_info": { ... },
      "balance_info": {
        "balance": "12500000000000000000000",
        "token_price": "0.256",
        "native_price": "32.50",
        "created_at": 1714608000
      },
      "origin": "ido",                    // "ido" | "market"
      "milestone_progress": {
        "completed": 3,
        "total": 4
      }
    }
  ],
  "total_count": 8
}
```

### `GET /profile/swap-history/:accountId`

Trading history

```
Query: { page: 1, limit: 20 }

Response 200:  // IAccountSwapHistoryData
{
  "swaps": [
    {
      "event_type": "BUY",
      "token_info": { ... },
      "native_amount": "5000000000000000000",
      "token_amount": "500000000000000000000",
      "native_price": "32.50",
      "transaction_hash": "0xabc...",
      "value": "12800000",
      "created_at": 1718466600
    }
  ],
  "total_count": 45
}
```

### `GET /profile/ido-history/:accountId`

IDO participation history

```
Query: { page: 1, limit: 20 }

Response 200:  // IAccountIDOHistoryData
{
  "participations": [
    {
      "project_info": { ... },
      "market_info": { ... },
      "invested_amount": "2000000000000000000000",
      "tokens_received": "12500000000000000000000",
      "status": "active",
      "milestone_progress": { "completed": 3, "total": 4 },
      "created_at": 1714608000
    }
  ],
  "total_count": 5
}
```

### `GET /profile/refund-history/:accountId`

Refund history

```
Query: { page: 1, limit: 20 }

Response 200:  // IAccountRefundHistoryData
{
  "refunds": [
    {
      "project_info": { ... },
      "original_investment": "500000000000000000000",
      "refund_amount": "375000000000000000000",
      "failed_milestone": "Beta Release",
      "transaction_hash": "0xdef...",
      "created_at": 1719792000
    }
  ],
  "total_count": 1
}
```

### `GET /profile/portfolio/:accountId`

Portfolio summary stats

```
Response 200:  // IPortfolioSummaryData
{
  "portfolio_value": "18720000000000000000000",
  "total_invested_ido": "12450000000000000000000",
  "trading_pnl": "4270000000000000000000",
  "trading_pnl_percent": 34.3,
  "active_idos": 5,
  "refunds_received": "1200000000000000000000"
}
```

---

## Builder

### `GET /profile/tokens/created/:accountId`

My created projects list

```
Query: { page: 1, limit: 10 }

Response 200:  // IAccountCreatedTokenData
{
  "projects": [
    {
      "project_info": { ... },
      "market_info": { ... }
    }
  ],
  "total_count": 2
}
```

### `GET /builder/overview/:projectId`

Builder dashboard overview

```
withCredentials: true

Response 200:  // IBuilderOverviewData
{
  "project_info": { ... },
  "market_info": { ... },
  "current_milestone": {
    "order": 2,
    "title": "Beta Release",
    "status": "in_verification"
  },
  "total_milestones": 4
}
```

### `GET /builder/stats/:projectId`

Funding trend chart data

```
withCredentials: true

Response 200:  // IBuilderStatsData
{
  "funding_over_time": [
    { "date": 1714521600, "cumulative": "50000000000000000000000" },
    { "date": 1715731200, "cumulative": "125000000000000000000000" },
    { "date": 1717200000, "cumulative": "200000000000000000000000" }
  ],
  "investors_over_time": [
    { "date": 1714521600, "count": 150 },
    { "date": 1717200000, "count": 800 },
    { "date": 1719792000, "count": 1472 }
  ]
}
```

---

## Upload

### `POST /metadata/image`

Image upload (logo, banner)

```
Content-Type: multipart/form-data

Body: FormData { file: <File> }  // PNG or JPEG

Response 200:
{ "image_uri": "https://storage.../logo_abc123.png" }
```

### `POST /metadata/evidence`

Milestone evidence file upload

```
Content-Type: multipart/form-data

Body: FormData { file: <File> }  // PDF or ZIP

Response 200:
{
  "evidence_uri": "https://storage.../evidence_001.pdf",
  "size": 2048000
}
```

---

## WebSocket (Separate Server — port 8001)

> **Important**: WebSocket runs on a separate server (`ws://localhost:8001`), NOT the same server as the REST API.
> Protocol: **JSON-RPC 2.0** over WebSocket.

### Subscription Channels

| Channel | Description | Use Case |
|---------|-------------|----------|
| `trade` | Swap/trade execution events | Live transaction ticker, trade tab |
| `price` | Token price updates | Real-time price display, portfolio |
| `project` | IDO project state changes | Project detail status updates |
| `milestone` | Milestone approval/rejection events | Builder dashboard, project detail |
| `new_content` | New project listings and content updates | Landing page, explore |

### `WS :8001` — Subscribe (JSON-RPC 2.0)

```
// Client → Server (subscribe to channel)
{
  "jsonrpc": "2.0",
  "method": "subscribe",
  "params": { "channel": "trade" },
  "id": 1
}

// Client → Server (subscribe to specific token price)
{
  "jsonrpc": "2.0",
  "method": "subscribe",
  "params": { "channel": "price", "token_id": "0x..." },
  "id": 2
}

// Client → Server (subscribe to milestone updates)
{
  "jsonrpc": "2.0",
  "method": "subscribe",
  "params": { "channel": "milestone", "milestone_id": "ms_002" },
  "id": 3
}

// Server → Client (subscription confirmed)
{
  "jsonrpc": "2.0",
  "result": { "subscribed": true, "channel": "trade" },
  "id": 1
}
```

### `WS :8001` — Event Payloads

```
// Trade event (channel: trade)
{
  "jsonrpc": "2.0",
  "method": "trade",
  "params": {
    "account_info": { "account_id": "0xA9c...F2a", ... },
    "event_type": "BUY",
    "token_amount": "500000000000000000000",
    "token_info": { "token_id": "0x...", "symbol": "PROJX", "image_uri": "..." }
  }
}

// Price update (channel: price)
{
  "jsonrpc": "2.0",
  "method": "price",
  "params": {
    "token_id": "0x...",
    "token_price": "0.0258",
    "native_price": "32.55",
    "volume": "8500000000000000000000",
    "holder_count": 345
  }
}

// Milestone update (channel: milestone)
{
  "jsonrpc": "2.0",
  "method": "milestone",
  "params": {
    "milestone_id": "ms_002",
    "status": "verified",
    "verified_at": 1721051400
  }
}

// Project update (channel: project)
{
  "jsonrpc": "2.0",
  "method": "project",
  "params": {
    "project_id": "0x1234...5678",
    "status": "active",
    "funded_percent": 100
  }
}

// New content (channel: new_content)
{
  "jsonrpc": "2.0",
  "method": "new_content",
  "params": {
    "project_info": { ... },
    "market_info": { ... }
  }
}
```

---

## API Endpoint Count Summary

| Group | Path Pattern | GET | POST | DELETE | Total |
|-------|-------------|-----|------|--------|-------|
| Auth | `/auth/*` | 0 | 2 | 1 | 3 |
| Project | `/project/*`, `/order/project/*` | 5 | 1 | 0 | 6 |
| Milestone | `/milestone/*` | 1 | 1 | 0 | 2 |
| Token | `/token/*`, `/order/*`, `/trend` | 3 | 0 | 0 | 3 |
| Trade | `/trade/*` | 6 | 0 | 0 | 6 |
| Profile | `/profile/*`, `/account/*` | 7 | 0 | 0 | 7 |
| Builder | `/builder/*` | 2 | 0 | 0 | 2 |
| Upload | `/metadata/*` | 0 | 2 | 0 | 2 |
| WebSocket | `ws://:8001` | 5 channels (JSON-RPC 2.0) | - | - | 5 |
| **Total** | | **24** | **6** | **1** | **36** |

---

## Backend Implementation Status

> From backend README — frontend should be aware of these placeholders.

### Implemented (MVP Ready)
- IDO project creation and lifecycle management
- Milestone-based funding with approval tracking
- On-chain event indexing (IDO, LP events)
- Real-time WebSocket streaming (trade, price, project, milestone, new_content)
- REST API with session auth, rate limiting (60s sliding window), CORS, Swagger UI
- Multi-provider RPC client with health checks and automatic fallback
- Automated graduation and fee collection (TxBot)
- OHLCV chart data and market statistics
- Token holder tracking and balance snapshots
- Primary/replica PostgreSQL connection pool split

### TODO / Placeholder (Not Yet Implemented)
| Item | Impact on Frontend |
|------|-------------------|
| Wallet signature verification | Auth flow will work but signature isn't verified yet — use mock/bypass |
| AMM math calculations | Swap quote endpoint may return placeholder values |
| S3 file upload | `POST /metadata/image` and `POST /metadata/evidence` may not persist files |
| `trading_pnl` computation | Portfolio P&L stats will be 0 or placeholder |
| Token event stream polling | WS `price` channel for individual tokens may not emit events yet |
| Swap event stream polling | WS `trade` channel may not emit real-time swap events yet |
| Price event stream polling | WS `price` channel may not emit price updates yet |

### Swagger UI
- Available at `http://localhost:8000/swagger-ui` for live API testing
- OpenAPI spec at `http://localhost:8000/api-docs/openapi.json`

---

## Common Error Response Format

```
JSON returned with HTTP status code:

{
  "error": "Human readable error message",
  "code": "ERROR_CODE"
}

Status codes:
  200 - Success
  400 - Bad request ("Ticker TKX already exists", "Milestone allocations must sum to 100")
  401 - Auth required / session expired
  403 - Forbidden ("Only project creator can submit milestones")
  404 - Resource not found
  429 - Rate limit exceeded
  500 - Server error
```

---

## Page-to-API Mapping Summary

| Page | APIs Used |
|------|-----------|
| Landing | `GET /project/featured`, `GET /order/project/recent` |
| Project Detail | `GET /project/:id` (includes milestones) |
| Project Creation | `GET /project/validate-symbol`, `POST /metadata/image`, `POST /project/create` |
| Portfolio | `GET /profile/portfolio/:id`, `GET /profile/hold-token/:id`, `GET /profile/ido-history/:id`, `GET /profile/swap-history/:id`, `GET /profile/refund-history/:id` |
| Builder Dashboard | `GET /profile/tokens/created/:id`, `GET /builder/overview/:id`, `GET /project/:id`, `POST /milestone/submit/:id`, `GET /milestone/verification/:id`, `GET /builder/stats/:id`, `GET /project/investor/:id` |
| Trading List | `GET /order/:sortType`, `GET /trend`, `WS trade`, `WS new_content` |
| Trading Detail | `GET /token/:id`, `GET /trade/chart/:id`, `GET /trade/swap-history/:id`, `GET /trade/holder/:id`, `GET /trade/market/:id`, `GET /trade/metrics/:id`, `GET /trade/quote/:id`, `WS trade`, `WS price` |

## Theme
- **T-1**: Default theme is **light mode**. No dark mode toggle in Phase 1.
- Dark mode support may be added in a future phase.
