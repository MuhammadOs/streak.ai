# Bugfix Requirements Document

## Introduction

The app's current UI/UX is visually identifiable as a clone of its original template. Key giveaways — the amber/gold brand color scheme, the `OrbitingHabits` animation, the generic glassmorphism-everywhere aesthetic, the split-screen auth layout, and the "core-tracker.ai" branding style — all broadcast the app's template origin to anyone familiar with it. The "bug" is an identity crisis: the app has no distinctive personality of its own, which undermines trust and professionalism.

The fix is a full visual redesign that replaces every template-origin signal with a cohesive, original design system. The goal is that after the redesign, no viewer would recognize the template — the app should look like a purpose-built, professionally designed SaaS product.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a user visits the landing page THEN the system displays an orbiting planets/habits animation (`OrbitingHabits`) that is a recognizable template signature element

1.2 WHEN a user loads any authenticated page THEN the system renders all cards using the glassmorphism `.glass` / `.card` style (blurred translucent panels with `backdrop-filter`) as the exclusive card treatment, making the UI feel like a template aesthetic rather than a purposeful design choice

1.3 WHEN a user loads any page THEN the system applies an amber/gold brand color (`--color-brand-500: #f59e0b` and related tokens) across all interactive elements, indicators, and accents, which is the exact palette associated with the template origin

1.4 WHEN a user visits the app THEN the system uses the branding name and logo style (`core-tracker.ai` + Sparkles icon in an amber gradient bubble) that appears generic and template-derived

1.5 WHEN a user navigates to `/login` or `/register` THEN the system displays a split-screen auth layout that is a common template pattern with no distinct visual identity

1.6 WHEN a user views the sidebar THEN the system renders a navigation structure with amber active-state indicators and gradient avatar bubbles that match the template's visual language

1.7 WHEN a user views the landing page hero section THEN the system uses a 12-column grid layout with an orbiting animation on the right column — a structural pattern that signals template origin

1.8 WHEN a user loads any page THEN the system renders a background aurora mesh (three radial gradients with amber as the primary color blob) that is characteristic of the template

1.9 WHEN a user views cards and widgets THEN the system applies the same glassmorphism treatment uniformly with no visual hierarchy between primary, secondary, and tertiary content areas

1.10 WHEN a user reads the typography THEN the system uses a generic type scale with no distinctive heading personality, rhythm, or brand typographic character

### Expected Behavior (Correct)

2.1 WHEN a user visits the landing page THEN the system SHALL display a replacement hero visual that is not an orbiting animation — specifically an interactive live-preview component (e.g. an animated habit checklist mockup or streak calendar card) that demonstrates the product's core value

2.2 WHEN a user loads any authenticated page THEN the system SHALL render cards using a grounded, solid-surface design system — clean cards with defined borders, intentional shadows, and clear elevation levels — rather than uniform glassmorphism across all surfaces

2.3 WHEN a user loads any page THEN the system SHALL apply a new brand color palette (deep violet/indigo `#6366f1` as primary with electric cyan `#22d3ee` as accent) replacing all amber/gold tokens across CSS custom properties, Tailwind theme tokens, utility classes, and component-level gradient references

2.4 WHEN a user visits the app THEN the system SHALL present a new product identity with a distinctive app name, updated logo mark (replacing the Sparkles-in-amber-bubble), and a visual personality that reads as purpose-built

2.5 WHEN a user navigates to `/login` or `/register` THEN the system SHALL display a redesigned auth layout — a centered card approach with a decorative sidebar panel or a full-bleed illustrated background — that is visually distinct from the split-screen template pattern

2.6 WHEN a user views the sidebar THEN the system SHALL render updated navigation with the new color palette for active states, a refreshed logo area, and navigation item styling that fits the new design language

2.7 WHEN a user views the landing page hero section THEN the system SHALL use a layout and hero composition that does not match the original template grid structure, with copy and CTAs repositioned to form a unique page personality

2.8 WHEN a user loads any page THEN the system SHALL render a background treatment using the new palette's colors (violet/indigo tones replacing amber as the dominant aurora color) or an alternative background pattern that suits the new identity

2.9 WHEN a user views cards and widgets THEN the system SHALL apply a visual hierarchy using differentiated card styles — primary content areas with stronger surfaces, secondary areas with lighter borders — so the layout communicates information architecture rather than treating every surface identically

2.10 WHEN a user reads the typography THEN the system SHALL render headings with a tighter, more confident tracking and weight that establishes a distinct brand voice separate from the template's generic Inter usage

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user interacts with any habit (toggle, create, edit, delete, archive) THEN the system SHALL CONTINUE TO perform all CRUD operations correctly with no functional regression from the redesign

3.2 WHEN a user views the dashboard THEN the system SHALL CONTINUE TO display all existing widgets: `SummaryCards`, `TodayHabitCard` list with progress ring, `WeeklyGrid`, `HeatmapChart`, `AIWeeklyReport`, `MorningMotivation`, and `StreakRecoveryCard`

3.3 WHEN a user uses the collapsible sidebar THEN the system SHALL CONTINUE TO collapse and expand correctly, persisting state in `localStorage`, and adjusting the main content `sidebar-offset` margin accordingly

3.4 WHEN a user uses the mobile bottom navigation (`MobileNav`) THEN the system SHALL CONTINUE TO display the tab bar and navigate between all pages correctly

3.5 WHEN a user toggles dark/light mode THEN the system SHALL CONTINUE TO switch themes correctly, updating all CSS custom property token values for both light and dark variants of the new palette

3.6 WHEN a user logs in, registers, or logs out THEN the system SHALL CONTINUE TO authenticate correctly with no changes to auth flow, token handling, or `ProtectedRoute` behavior

3.7 WHEN a user views statistics and insights pages THEN the system SHALL CONTINUE TO render all chart components (`HeatmapChart`, `WeeklyBarChart`, `MonthlyBarChart`, `CategoryPieChart`) with correct data

3.8 WHEN a user opens any modal (habit form, delete confirmation, settings, habit suggestion) THEN the system SHALL CONTINUE TO function correctly with proper open/close behavior and form submissions

3.9 WHEN a user views the app on a mobile viewport THEN the system SHALL CONTINUE TO be fully responsive with the mobile layout adapting correctly to the new design system

3.10 WHEN a user triggers toast notifications THEN the system SHALL CONTINUE TO display success, info, and error toasts correctly via `ToastContext`
