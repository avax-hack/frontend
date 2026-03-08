# OpenLaunch Frontend Phase 1 Re-review

**Verdict: FIX**

## Quick Check (11 items)
1. ❌ `ProjectCard.tsx` does **not** show Launched date (L-5)
2. ✅ `FeaturedProjectCard.tsx` has Funding + Milestone `StatusBadge`s
3. ❌ `page.tsx` has `isError` but no retry action; `explore/page.tsx` has retry
4. ✅ `FeaturedCarousel.tsx` uses `focus-visible` (no `outline-none`)
5. ❌ Spacing token rule still violated in `common/` / `landing/`: `StatusBadge.tsx` uses `py-0`
6. ❌ `constants.ts` still contains `as` type assertions (`value as \`0x${string}\``, `as const`)
7. ✅ `layout.tsx` has no inline `style` for `colorScheme`
8. ✅ `Header.tsx` uses `mt-auto` (not `pt-auto`)
9. ✅ No deprecated `NAV_LINKS` export in `constants.ts`
10. ✅ `FeaturedProjectCard` image `alt` text is meaningful (`project_info.name`)
11. ✅ `useProjectList` accepts optional params in `hooks.ts`

## New/Regression Issues Spotted
- Home page error state (`src/app/page.tsx`) is still non-recoverable (no retry CTA).
- Spacing token policy regression remains (`py-0` in `StatusBadge.tsx`).
- `constants.ts` still violates no-type-assertion rule.
