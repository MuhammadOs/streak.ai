# Implementation Plan

## Overview

This task list follows the exploratory bugfix workflow for the `ui-redesign` spec. Tasks are ordered: explore (Property 1 — surface the bug), preserve (Property 2 — capture baseline behavior), implement (apply the fix), then validate. All changes are purely CSS/component-level with zero backend modifications.

## Tasks

- [ ] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Amber Template-Origin Signals Present
  - **CRITICAL**: This test MUST FAIL on unfixed code — failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior — it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate all template-origin signals exist in the current codebase
  - **Scoped PBT Approach**: For each bug condition, scope to the concrete failing token/component/layout to ensure reproducibility
  - Test 1 — `--color-brand-500` token: assert computed value equals `rgb(245, 158, 11)` (#f59e0b amber), not violet. Run on unfixed code → PASS (confirms amber token is present)
  - Test 2 — `--bg-aurora-1` token: assert value contains `rgba(251, 191, 36` amber string. Run on unfixed code → PASS (confirms amber aurora)
  - Test 3 — OrbitingHabits render: mount `Landing` and assert `OrbitingHabits` component is present in the render tree (e.g. a `.orbit` animation element or the component reference). Run on unfixed code → PASS (confirms template hero)
  - Test 4 — Split-screen auth layout: mount `Login` and assert the `hidden lg:flex lg:w-[52%]` left panel div is present in the DOM. Run on unfixed code → PASS (confirms split-screen)
  - Test 5 — Inline amber gradient strings: scan `OrbitingHabits.jsx`, `Landing.jsx`, `Login.jsx`, `Register.jsx` source for `rgba(251,191,36` literal. Assert matches found. Run on unfixed code → PASS (confirms raw inline amber)
  - The above property-based tests are scoped to verify amber-positive values for all isBugCondition(element) = true elements
  - Run all tests on UNFIXED code
  - **EXPECTED OUTCOME**: All tests PASS (this is correct — it proves the bug signals exist)
  - Document counterexamples found:
    - `--color-brand-500` resolves to `#f59e0b`, not `#6366f1`
    - `--bg-aurora-1` is `rgba(251, 191, 36, 0.28)` amber
    - `OrbitingHabits` is mounted in the landing hero DOM
    - `hidden lg:flex lg:w-[52%]` panel is present in Login DOM
    - Inline `rgba(251,191,36` strings exist in Login.jsx, Register.jsx, OrbitingHabits.jsx
  - Mark task complete when all tests are written, run, and failures are documented
  - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.7, 1.8_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Functional Behavior Unchanged Across All Non-Visual Interactions
  - **IMPORTANT**: Follow observation-first methodology — observe behavior on UNFIXED code first, then encode as properties
  - Observe: sidebar collapse/expand correctly updates `localStorage["sidebar-collapsed"]` and the `sidebar-offset` margin (68px collapsed, 256px expanded) on unfixed code
  - Observe: dark/light mode toggle correctly switches `.dark` class on `<html>` and updates all CSS custom property token values on unfixed code
  - Observe: `MobileNav` `activeIndex` correctly reflects the active route for each of the 5 nav items on unfixed code
  - Observe: auth form submissions — valid credentials navigate to `/dashboard`, invalid credentials display error string — on unfixed code
  - Observe: habit toggle produces correct optimistic UI update on unfixed code
  - Write property-based test: for all boolean values of `collapsed` state, toggling sidebar always updates localStorage and the margin correctly — independent of CSS token values
  - Write property-based test: for all theme values (`"light"` / `"dark"`), toggling always swaps the `.dark` class on `<html>` — independent of which palette the tokens resolve to
  - Write property-based test: for all 5 nav routes, `activeIndex` always resolves to the correct index (0–4) — independent of any CSS or icon changes
  - Write property-based test: for random valid/invalid credential inputs, auth form submission behavior (navigate vs. error display) is unchanged
  - Verify all preservation tests PASS on UNFIXED code before implementing the fix
  - _Requirements: 3.1, 3.3, 3.4, 3.5, 3.6_

- [ ] 3. Fix — UI Redesign: Replace all template-origin signals with new design system
  - [ ] 3.1 Replace `@theme` brand token scale in `index.css` (amber → violet/indigo)
    - Replace the entire `--color-brand-*` family (brand-50 through brand-900) from amber to violet/indigo scale as specified in design
    - Set `--color-brand-500: #6366f1` (was `#f59e0b`), `--color-brand-600: #4f46e5`, `--color-brand-700: #4338ca`, etc. — full scale per design doc
    - Add `--color-accent-400: #22d3ee` (electric cyan) to `@theme` for gradient highlights
    - This single token change propagates automatically to every component using `text-brand-*`, `bg-brand-*`, `shadow-brand-*`, `ring-brand-*` Tailwind utilities
    - _Bug_Condition: isBugCondition(element) where element IS amber_brand_token (`--color-brand-500: #f59e0b`)_
    - _Expected_Behavior: `--color-brand-500` computes to `rgb(99, 102, 241)` (#6366f1 violet)_
    - _Preservation: Token change is purely cosmetic — all components continue to reference `brand-*` tokens, no class names change_
    - _Requirements: 1.3, 2.3, 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 3.2 Replace CSS custom property tokens in `index.css` (aurora, input focus, heatmap, btn-primary, card elevation variants, heading typography)
    - Replace `:root` aurora tokens: `--bg-base: #f5f3ff`, `--bg-aurora-1: rgba(99, 102, 241, 0.20)`, `--bg-aurora-2: rgba(139, 92, 246, 0.14)`, `--bg-aurora-3: rgba(34, 211, 238, 0.12)`
    - Replace `:root` input focus tokens: `--input-border-focus: #818cf8`, `--input-ring-focus: rgba(99, 102, 241, 0.22)`
    - Replace `html.dark` aurora tokens: `--bg-base: #09090f`, `--bg-aurora-1: rgba(99, 102, 241, 0.28)`, `--bg-aurora-2: rgba(139, 92, 246, 0.18)`, `--bg-aurora-3: rgba(34, 211, 238, 0.14)`
    - Replace `html.dark` input focus tokens: `--input-border-focus: #a5b4fc`, `--input-ring-focus: rgba(99, 102, 241, 0.22)`
    - Replace heatmap tokens (`:root`): `--heat-1: rgba(99, 102, 241, 0.35)`, `--heat-2: rgba(99, 102, 241, 0.60)`, `--heat-3: rgba(99, 102, 241, 0.82)`, `--heat-4: #4f46e5`
    - Replace heatmap tokens (`html.dark`): `--heat-1` through `--heat-4` to violet-light variants per design (e.g. `--heat-4: #a5b4fc`)
    - Replace `.btn-primary` gradient: `background: linear-gradient(135deg, #818cf8, #4f46e5)`, `box-shadow: 0 6px 18px rgba(79, 70, 229, 0.35)`
    - Add `.card-elevated` class with violet-tinted shadow: `background: var(--surface-strong)`, `box-shadow: 0 4px 24px rgba(99, 102, 241, 0.1), var(--shadow)`
    - Add `.card-subtle` class: `background: var(--surface)`, `border: 1px solid var(--divider)`
    - Add `.heading-brand` utility class: `letter-spacing: -0.03em`, `font-weight: 700`
    - Add base `h1, h2` rule: `letter-spacing: -0.025em`
    - _Bug_Condition: isBugCondition(element) where element IS amber_aurora_background OR uniform_glassmorphism_card OR generic_heading_typography_
    - _Expected_Behavior: `--bg-aurora-1` contains violet RGBA; `.btn-primary` background is violet/indigo gradient; `h1`/`h2` have tracking tighter than -0.02em; `.card-elevated` and `.card-subtle` provide elevation hierarchy_
    - _Preservation: All `:root` and `html.dark` functional tokens (surface, shadow, divider, chart, scrollbar) remain structurally unchanged — only color values updated_
    - _Requirements: 1.2, 1.8, 1.9, 1.10, 2.2, 2.3, 2.8, 2.9, 2.10, 3.5_

  - [ ] 3.3 Create `HabitChecklistMockup` component (`frontend/src/components/HabitChecklistMockup.jsx`)
    - Create a new self-contained animated component that renders a stylized product preview card
    - Include 3–4 habit rows with: habit emoji, habit name, streak counter (with Flame icon), and a checkbox
    - Animate rows in sequentially on mount using staggered CSS `animation-delay` (fade + slide-up from bottom)
    - Animate unchecked → checked transition with a checkmark pop and a violet ring (`ring-brand-500/30`) on completion
    - Add a progress bar at the top of the card that fills as habits animate to checked state
    - Use `.card-elevated` for the outer container to apply the new elevation style
    - Style checked state checkboxes with `bg-linear-to-br from-brand-500 to-brand-700` (auto-picks up violet from token fix)
    - Do NOT import or depend on `OrbitingHabits.jsx` — this is a full replacement
    - Ensure the component is purely presentational (no props required, no API calls, no context dependencies)
    - _Bug_Condition: isBugCondition(element) where element IS OrbitingHabits_component_
    - _Expected_Behavior: `HabitChecklistMockup` renders in landing hero; `OrbitingHabits` solar-system animation is NOT present in the DOM_
    - _Preservation: Component is purely cosmetic/presentational — zero functional impact on any other component or context_
    - _Requirements: 1.1, 1.7, 2.1, 2.7_

  - [ ] 3.4 Update `Landing.jsx`
    - Replace `import OrbitingHabits` with `import HabitChecklistMockup from "../components/HabitChecklistMockup.jsx"`
    - Replace `<OrbitingHabits />` with `<HabitChecklistMockup />` in the hero grid column
    - Update hero grid from `lg:grid-cols-12` with `lg:col-span-8` / `lg:col-span-4` to balanced `lg:grid-cols-2` layout; remove `lg:-mr-36` negative margin offset
    - Replace all inline `rgba(251,191,36,...)` strings with violet equivalents `rgba(99,102,241,...)`
    - Update the CTA section: replace inline `rgba(236,72,153,0.3)` accent with `rgba(139,92,246,0.3)` (violet accent)
    - Replace `<Sparkles>` icon in logo bubble with `<Zap>` (or `<FlameKindling>`) from lucide-react for brand differentiation — update both the header logo and the CTA icons section
    - Apply `heading-brand` class (or equivalent inline styles) to the landing `h1` for tighter tracking
    - Feature card icon containers (`bg-brand-500/15 text-brand-600`) will auto-update via token fix — verify visually
    - _Bug_Condition: isBugCondition(element) where element IS OrbitingHabits_component OR amber_gradient_logo_bubble OR generic_heading_typography_
    - _Expected_Behavior: Landing hero shows `HabitChecklistMockup`; no `OrbitingHabits` in DOM; logo uses new icon; `h1` has tighter tracking; no inline amber RGBA strings_
    - _Preservation: All `Link` routes (/login, /register), auth redirect logic, feature card content, footer text — all unchanged_
    - _Requirements: 1.1, 1.4, 1.7, 1.10, 2.1, 2.3, 2.4, 2.7, 2.10_

  - [ ] 3.5 Redesign `Login.jsx` — remove split-screen, centered full-bleed card layout
    - Remove the entire `hidden lg:flex lg:w-[52%]` left panel div (including its aurora overlay, logo, hero copy, feature list, and bottom quote)
    - Change outer wrapper from `min-h-screen flex` to `min-h-screen flex items-center justify-center` with a relative wrapper for the background treatment
    - Add a full-bleed decorative violet background element (small radial violet aurora or mesh pattern, using `rgba(99,102,241,...)` tones) as a `div` with `absolute inset-0 pointer-events-none` positioning
    - Expand the form panel to a standalone centered card: `w-full max-w-md` with `.card-elevated` class, no longer a flex sibling to a left panel
    - Remove the `flex-1` from the form wrapper — it becomes the sole centered element
    - Replace `<Sparkles>` in the mobile logo (now shown always, not just mobile) with the new chosen icon (`<Zap>` or `<FlameKindling>`) to match Landing and Sidebar updates
    - Remove all inline `rgba(251,191,36,...)` aurora style strings (they were in the now-removed left panel)
    - The theme toggle button, form fields (email, password, show/hide), error display, submit button, and "Create one" link all remain functionally identical
    - _Bug_Condition: isBugCondition(element) where element IS split_screen_auth_layout OR amber_gradient_logo_bubble_
    - _Expected_Behavior: No `lg:w-[52%]` left panel in DOM; centered card with `.card-elevated`; no inline amber RGBA; new logo icon_
    - _Preservation: `submit()` handler, `useAuth().login()` call, `navigate()` redirect, error state display, password show/hide toggle, `Link` to /register — all unchanged_
    - _Requirements: 1.4, 1.5, 2.4, 2.5, 3.6_

  - [ ] 3.6 Redesign `Register.jsx` — same layout changes as Login
    - Apply identical structural changes as task 3.5: remove `hidden lg:flex lg:w-[52%]` left panel div
    - Change outer wrapper to `min-h-screen flex items-center justify-center`
    - Add violet background treatment (matching Login)
    - Expand form panel to standalone centered `.card-elevated` with `w-full max-w-md`
    - Replace `<Sparkles>` in logo with new chosen icon (matching Login and Landing)
    - Remove all inline `rgba(251,191,36,...)` aurora style strings from the removed left panel
    - The `PasswordStrength` sub-component, all form fields (name, email, password), error display, loading state, and "Log in" link remain functionally identical
    - _Bug_Condition: isBugCondition(element) where element IS split_screen_auth_layout OR amber_gradient_logo_bubble_
    - _Expected_Behavior: No `lg:w-[52%]` left panel in DOM; centered card with `.card-elevated`; new logo icon_
    - _Preservation: `submit()` handler, `useAuth().register()` call, `navigate()` redirect, `PasswordStrength` component logic, error state, password show/hide — all unchanged_
    - _Requirements: 1.4, 1.5, 2.4, 2.5, 3.6_

  - [ ] 3.7 Update `Sidebar.jsx` — replace Sparkles icon, verify violet active states
    - Replace `Sparkles` import and all `<Sparkles>` usages in the sidebar logo bubbles (collapsed and expanded) with the new icon chosen in tasks 3.4–3.6 (e.g. `<Zap>` or `<FlameKindling>`) — must match the icon used in Landing, Login, and Register for brand consistency
    - The `from-brand-500 to-brand-700` gradient on logo bubble and user avatar automatically picks up violet from the `@theme` token fix (task 3.1) — verify visually that the gradient renders violet, not amber
    - Active nav indicator `bg-linear-to-r from-brand-500/15 to-brand-500/5` and the `bg-brand-500` left-bar accent — auto-updated by token fix; verify visually
    - `accent-brand-600` on the morning motivation checkbox — auto-updated; verify
    - No changes to collapse/expand logic, `localStorage` persistence, settings modal, or `useCollapsed()` hook
    - _Bug_Condition: isBugCondition(element) where element IS amber_gradient_logo_bubble_
    - _Expected_Behavior: Sidebar logo bubble uses new icon and violet gradient; active nav indicators are violet, not amber_
    - _Preservation: Collapse/expand behavior, localStorage write, sidebar-offset CSS injection, settings modal (name + morningMotivation), `useAuth().logout()`, `useTheme().toggle()` — all unchanged_
    - _Requirements: 1.4, 1.6, 2.4, 2.6, 3.3_

  - [ ] 3.8 Update `MobileNav.jsx` — replace Sparkles icon, verify violet token references
    - Replace `Sparkles` import and `<Sparkles>` usage in the top bar logo with the same new icon chosen in tasks 3.4–3.7
    - The `from-brand-500 to-brand-700` gradient on the top bar logo bubble and user avatar bubble — auto-updated by `@theme` token fix; verify visually
    - The sliding pill indicator `bg-brand-500/10` — auto-updated; verify
    - Active nav link `text-brand-700 dark:text-brand-300` — auto-updated; verify
    - `shadow-brand-500/30` on logo — auto-updated; verify
    - No changes to `activeIndex` calculation, route-matching logic, logout, or theme toggle
    - _Bug_Condition: isBugCondition(element) where element IS amber_gradient_logo_bubble_
    - _Expected_Behavior: MobileNav logo uses new icon and violet gradient; sliding pill and active tab text are violet_
    - _Preservation: `activeIndex` computation, `NavLink` routing, `useAuth().logout()`, `useTheme().toggle()`, responsive visibility (md:hidden) — all unchanged_
    - _Requirements: 1.4, 1.6, 2.4, 2.6, 3.4_

  - [ ] 3.9 Audit and replace all remaining inline amber `rgba()` strings across frontend components
    - Search the entire `frontend/src` directory for the literal string `rgba(251,191,36` and `rgba(251, 191, 36` (both with and without spaces)
    - Also search for `rgba(253,224,71` (amber heat-1 variant) and `rgba(217,119,6` (amber heat-3 variant) used in inline styles
    - Also search for `rgba(236,72,153` (pink/magenta accent used in inline gradients in Landing and auth pages) — replace with `rgba(139,92,246` (violet accent)
    - For each match found: replace with the appropriate violet equivalent per the design spec tokens
    - Verify `OrbitingHabits.jsx` amber inline styles — this component is being replaced by HabitChecklistMockup (task 3.3) so no update needed here; confirm it is no longer rendered
    - Cross-check `Landing.jsx` CTA section inline gradient for any remaining pink/amber accents
    - Cross-check `HeatmapChart.jsx` for any inline amber color references that bypass the CSS token system (heat token fix in task 3.2 should cover this, but verify)
    - Document any components found with remaining amber inline strings and confirm all are resolved
    - _Bug_Condition: isBugCondition(element) where element IS amber_aurora_background (inline style variant)_
    - _Expected_Behavior: Zero occurrences of `rgba(251,191,36` in any rendered component's inline style; all inline gradient overlays use violet/indigo tones_
    - _Preservation: The overlay divs themselves (absolute positioned, pointer-events-none) remain in place — only their color values change_
    - _Requirements: 1.3, 1.8, 2.3, 2.8_

  - [ ] 3.10 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Amber Template-Origin Signals Replaced
    - **IMPORTANT**: Re-run the SAME test suite from task 1 — do NOT write new tests
    - The tests from task 1 encode the expected behavior (violet values should now make the amber-detection assertions fail, confirming the fix)
    - Re-run test 1: assert `--color-brand-500` equals `rgb(99, 102, 241)` (violet) — now expects the fixed value
    - Re-run test 2: assert `--bg-aurora-1` contains `rgba(99, 102, 241` violet — not amber
    - Re-run test 3: assert `OrbitingHabits` is NOT in the landing DOM; assert `HabitChecklistMockup` IS present
    - Re-run test 4: assert the `lg:w-[52%]` left panel is NOT in the Login DOM; assert a centered card IS present
    - Re-run test 5: assert zero occurrences of `rgba(251,191,36` in any component source
    - **EXPECTED OUTCOME**: All tests PASS (confirms all template-origin signals are replaced)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10_

  - [ ] 3.11 Verify preservation tests still pass
    - **Property 2: Preservation** - Functional Behavior Unchanged
    - **IMPORTANT**: Re-run the SAME preservation test suite from task 2 — do NOT write new tests
    - Run sidebar collapse property tests — confirm localStorage and sidebar-offset margin behavior is unchanged
    - Run dark/light mode property tests — confirm `.dark` class toggling on `<html>` is unchanged; confirm both light and dark variant tokens are internally consistent (all violet now)
    - Run MobileNav `activeIndex` property tests — confirm all 5 routes resolve to correct index
    - Run auth form submission tests — confirm navigate-on-success and error-display-on-failure behavior unchanged
    - Run habit toggle tests — confirm optimistic UI and API call behavior unchanged
    - **EXPECTED OUTCOME**: All preservation tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix

- [ ] 4. Checkpoint — Ensure all tests pass
  - Run the full test suite (exploration + preservation) and confirm all tests pass
  - Do a visual walkthrough: landing page (HabitChecklistMockup visible, violet palette, tighter headings), login/register (centered card, no split-screen), sidebar (violet active states, new icon), mobile nav (violet pill, new icon), dark mode (violet aurora), light mode (violet aurora)
  - Confirm zero console errors from component changes
  - Confirm no TypeScript/ESLint errors introduced by the new HabitChecklistMockup component
  - Ask the user if any questions or visual adjustments arise before closing the spec

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1", "2"] },
    { "wave": 2, "tasks": ["3.1", "3.2"] },
    { "wave": 3, "tasks": ["3.3", "3.4", "3.5", "3.6", "3.7", "3.8", "3.9"] },
    { "wave": 4, "tasks": ["3.10", "3.11"] },
    { "wave": 5, "tasks": ["4"] }
  ]
}
```

Tasks 1 and 2 are standalone and must be completed BEFORE task 3 begins.
Tasks 3.1 and 3.2 (token changes) should be done before 3.3–3.9 so component work picks up the new palette automatically.
Tasks 3.10 and 3.11 require all implementation tasks (3.1–3.9) to be complete.

## Notes

- All changes are frontend-only. Zero backend files should be touched.
- The `OrbitingHabits.jsx` component is NOT deleted — it is simply no longer imported or rendered. Keep it in place in case of rollback.
- The new icon (replacing `<Sparkles>`) must be used consistently across all four locations: `Landing.jsx`, `Login.jsx`, `Register.jsx`, `Sidebar.jsx`, and `MobileNav.jsx`. Choose one icon before starting 3.4 and use it throughout.
- Tasks 3.1 and 3.2 together cover the full `index.css` rewrite. Do them together in a single editing session to avoid intermediate broken states.
- After task 3.1, the entire app will visually shift to violet — this is expected. Tasks 3.3–3.9 then resolve the remaining structural/component issues.
- The `PasswordStrength` component in `Register.jsx` uses `bg-amber-500` in its color array — this is an intentional UI affordance (password strength indicator) and is NOT part of the bug condition. Leave it as-is.
