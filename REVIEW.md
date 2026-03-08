# Phase 2 Re-Review

## Verdict: FIX

## Original Issues — Resolution Status
- C1: ✅ `src/features/launch/schemas.ts` now matches spec-critical constraints: `ticker` is `min(2)/max(10)`, `description` is `min(20)`, and `targetRaise` is `min(1000)`.
- C2: ✅ Targeted assertion cleanup is done in `src/features/launch/store.ts` and `src/features/launch/hooks.ts` (no unsafe `as SomeType` assertions remain there). In `StepIndicator.tsx`, the prior `as 1 | 2 | 3` is removed; only `as const` remains, which is allowed by `frontend.md`.
- C3: ✅ Logo-required gating is now enforced in `goNext` (`src/features/launch/hooks.ts`) and surfaced inline via `externalError` in `src/components/launch/LogoUpload.tsx`.
- I1: ✅ `src/components/project-detail/InvestPanel.tsx` now handles all `ProjectStatus` union states (`funding`, `active`, `completed`, `failed`) plus disconnected wallet state.
- I2: ✅ `src/components/launch/LogoUpload.tsx` now uses a semantic `<button type="button">` for the upload trigger.
- I3: ✅ Checked files (`ProjectOverview.tsx`, `MilestoneRoadmap.tsx`, `ReviewStep.tsx`) no longer use prohibited margin utilities from the prior findings; spacing is using gap/padding patterns.
- I4: ✅ `src/components/project-detail/MilestoneRoadmap.tsx` uses `text-xs` for the fund-release label (no `text-[10px]`).
- I5: ❌ `src/components/launch/ReviewStep.tsx` still has index-based fallback keying: `key={m.title || `milestone-${i}`}`. This is not fully stable and can still cause reconciliation issues if title is empty/duplicate or order changes.
- I6: ✅ `src/app/launch/page.tsx` `beforeunload` handler now sets `e.returnValue = ''` in addition to `preventDefault()`.
- M1: ✅ `src/components/project-detail/FundingProgress.tsx` `<p>` uses `leading-[1.2]`.

## New Issues Found (if any)
- [src/components/launch/ProjectInfoStep.tsx] UI constraints are now inconsistent with updated schema/spec: ticker input still has `maxLength={6}` while schema allows up to 10.
- [src/components/launch/ProjectInfoStep.tsx] Ticker availability hint logic still checks `debouncedTicker.length >= 3`; schema now allows 2-char tickers, so UX/validation messaging is misaligned.
- [src/components/launch/ProjectInfoStep.tsx] Description placeholder still says `min 100 characters`, but schema now requires 20+.
- [src/components/launch/ProjectInfoStep.tsx] Target raise input still uses `min={10_000}` while schema enforces `>= 1_000`; form UI blocks valid schema values.

## Build: PASS
- `npm run build` completed successfully (Next.js production build passes).
- Non-blocking warnings observed (pre-existing): unused var in `ProjectCard.tsx`, and several `@next/next/no-img-element` warnings.

## Summary
Most Phase 2 fixes were applied correctly, including all three critical items and almost all important/minor items. However, one original important issue remains unresolved (`I5` stable keys in `ReviewStep`), and there are newly visible UI/schema mismatches in `ProjectInfoStep` that can block valid user inputs or present outdated guidance. Not ready to ship yet; recommend one more fix pass and quick re-check.
