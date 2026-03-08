# OpenLaunch Planning Document

> **Easy to launch. Hard to rug.**
> Avalanche Build Games — Idea Definition

---

## 1. Project Overview

**OpenLaunch** is a milestone-based decentralized launchpad built on the Avalanche ecosystem.
Anyone can permissionlessly launch a project, and investors can participate within a trust structure guaranteed by code.

---

## 2. Problem Definition

### Builder Side
- Existing launchpad review processes are too heavy
- Difficult for small/new teams to enter
- Lack of funding channels

### Investor Side
- Zero accountability post-raise
- Time-based vesting → funds unlock even if the project dies
- Retail investors become exit liquidity

### Core Paradox
In the AI era, the speed of turning ideas into products has accelerated, but funding infrastructure hasn't kept up.

---

## 3. Solution: The High-Agency Launchpad

**"Permissionless launching. Protocol-level accountability."**

| Principle | Description |
|-----------|-------------|
| **Anyone Can Launch** | No KYC, no review committee. Launch with just a wallet connection |
| **Anyone Can Invest** | Democratization of angel investing. Participate from as little as $10 |
| **Trust by Code** | Funds released only upon verified milestone achievement |

---

## 4. Architecture: Milestone-Based Flow

```
Investor deposits funds
    ↓
Smart contract lockup
    ↓
┌─── Milestone Verification (UMA Oracle) ───┐
│                                             │
├─ ✅ Achieved → Funds released to builder    │
│                                             │
└─ ❌ Failed → Refund to investor            │
```

**Core: Making rug pulls structurally impossible**

---

## 5. Avalanche Ecosystem Fit

- **UMA Oracle**: Live on C-Chain. Proven decentralized verification mechanism
- **Speed & UX**: Low gas fees + fast finality → high-frequency milestone interactions possible
- **Culture**: Aligned with Retro 9000 and builder-first mindset
- **Uniswap V4**: Seamless token trading for users via Custom Hooks

---

## 6. Core Values & Vision

### Core Values
1. **High-Agency** — Autonomous, proactive
2. **Permissionless** — No permission required
3. **Accountable** — Protocol-level responsibility

### Vision
> A world where anyone can create ideas and fund them — permissionlessly.

---

## 7. Tech Stack (Expected)

- **Chain**: Avalanche C-Chain
- **Oracle**: UMA Optimistic Oracle (milestone verification)
- **DEX**: Uniswap V4 (Custom Hooks)
- **Smart Contracts**: Solidity (fund lockup, milestone management, refund logic)
- **Frontend**: TBD

---

## 8. Key Features (Expected Scope)

1. **Project Registration**: Wallet connect → Project info input → Milestone setup → Launch
2. **Investment Participation**: Browse projects → Min $10 → Fund lockup in smart contract
3. **Milestone Verification**: Builder submits milestone completion → UMA Oracle verification → Fund release/refund
4. **Token Trading**: Project token trading based on Uniswap V4 Hooks

---

## 9. Differentiators

- Existing launchpads: KYC + review committee + time-based vesting
- **OpenLaunch**: Permissionless + milestone-based fund release + structural rug pull prevention

---

*Document based on: The Rug Proof Launchpad (Avalanche Build Games Submission)*
