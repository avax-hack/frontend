# Phase 3 Plan Review — OpenLaunch Frontend

## Verdict: REVISE

The current Phase 3 plan is close, but it has several design gaps that will likely cause rework (provider order, session restore path, and incomplete CR-9 launch/API flow).

---

## 1) Coverage vs Feature Spec (C-3, D-11, D-14, CR-9)

### What is covered well
- **C-3 Wallet Auth**: nonce → sign → session intent is present.
- **D-11 Investment Flow**: modal + tx pending/success/fail flow is planned.
- **D-14 Claim Refund**: failed-state button + refund action is planned.

### Gaps to fix
- **CR-9 is only partially covered**. Spec says final launch is **API + smart contract deploy + wallet signature**. Plan currently emphasizes deploy stub/redirect but does not explicitly include:
  - `POST /project/create` integration (`withCredentials` / cookie auth)
  - Payload mapping from existing launch form store to API schema
  - Handling response (`project_id`, `transaction_hash`) and post-success routing

**Required change:** add explicit CR-9 implementation task for `POST /project/create` service + mutation + error states + success routing.

---

## 2) Dependencies / blocked_by

Current `blocked_by` is too coarse (everything blocked only by P3-1).

### Recommended dependency adjustments
- **P3-2 (Auth UI)** blocked_by: `P3-1` ✅
- **P3-3 (Investment Flow)** blocked_by: `P3-1` ✅
- **P3-4 (Refund)** blocked_by: `P3-1`, **`P3-3`** (shared tx state/pattern)
- **P3-5 (Launch Integration)** blocked_by: `P3-1`, and explicit launch API task (or split from P3-5)
- Add dedicated **mock integration task** and make feature tasks depend on it where needed for local validation

Rationale: this avoids hidden coupling and reduces merge conflicts/rework.

---

## 3) Auth flow design (nonce → sign → session)

The high-level flow is correct, but important implementation details are missing.

### Must-have additions
1. **Session restore path** should use authenticated endpoint (spec includes `GET /account/get_account` with cookie).
2. **Wallet/account lifecycle handling**:
   - on wallet disconnect → clear session state
   - on wallet account change → clear old session and require re-auth
3. **Chain ID handling**:
   - include `chain_id` from connected wallet
   - define behavior on wrong chain (switch prompt or explicit error)
4. **Loop prevention** for auto-sign:
   - avoid repeated signature prompts on rerender/navigation
   - gate with one-shot guard / explicit state machine
5. **401/session expired handling**:
   - clear auth store
   - prompt re-auth for gated actions

---

## 4) Mock mode strategy (backend-free operation)

Current plan is not sufficient for full backend-free QA.

### Missing mock pieces
- `/auth/nonce`
- `/auth/session`
- `/auth/delete_session`
- `/account/get_account` (for restore)
- `/project/create` (for CR-9)

Also add:
- In-memory mock session state so login/logout/restore behaves consistently.
- At least one **failed project fixture** to test D-14 Claim Refund path.

Without these, Phase 3 cannot be fully testable in mock mode.

---

## 5) Provider ordering vs frontend.md

Planned order in HANDOFF:
- `QueryProvider > WalletProvider > SessionProvider`

This conflicts with `frontend.md` provider rule:
- `SessionProvider > WagmiProvider > QueryClientProvider > RainbowKitProvider > SocketProvider`

**Required change:** refactor provider composition to follow frontend rule (or update rule explicitly if project-standard differs). Current proposed order should not be approved as-is.

---

## 6) Missing edge cases

Add explicit acceptance criteria for:
- Nonce/session API network failure
- User rejects message signature (wallet error 4001)
- User rejects tx signature for invest/refund/launch
- Session expiry during action (401 mid-flow)
- Wallet disconnect/account switch during pending flow
- Double-submit prevention (disable button while pending)
- Safe recovery UX (retry path, clear error toast/message)

---

## 7) Scope sizing

Overall scope is reasonable for Phase 3, but **P3-1 is oversized/underspecified** (services + hooks + store + provider + ordering).

**Suggested sizing fix:** split P3-1 into smaller deliverables:
- P3-1a Auth services/store/hook
- P3-1b SessionProvider + restore + account-change handling
- P3-1c Provider order refactor

This will improve reviewability and reduce integration risk.

---

## Summary of required revisions before approval

1. Add explicit CR-9 API integration (`POST /project/create`) + payload/response/error handling.
2. Correct provider order per `frontend.md`.
3. Define session restore via `GET /account/get_account`.
4. Add wallet lifecycle + 401/session-expiry behavior.
5. Expand mock-mode endpoint coverage (including auth restore and project create).
6. Tighten `blocked_by` graph to reflect real dependencies.
7. Add edge-case acceptance criteria for reject/error/expiry/double-submit paths.
