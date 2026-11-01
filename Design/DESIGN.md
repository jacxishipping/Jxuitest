---
name: Tactile Luminescence
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464555'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#712ae2'
  on-secondary: '#ffffff'
  secondary-container: '#8a4cfc'
  on-secondary-container: '#fffbff'
  tertiary: '#004d70'
  on-tertiary: '#ffffff'
  tertiary-container: '#006693'
  on-tertiary-container: '#b8e0ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#eaddff'
  secondary-fixed-dim: '#d2bbff'
  on-secondary-fixed: '#25005a'
  on-secondary-fixed-variant: '#5a00c6'
  tertiary-fixed: '#c9e6ff'
  tertiary-fixed-dim: '#89ceff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
  canvas-light: '#F8FAFC'
  canvas-dark: '#0B0F19'
  surface-subtle-light: '#F1F5F9'
  surface-subtle-dark: '#1E293B'
  surface-elevated-dark: '#111827'
  status-success: '#10B981'
  status-warning: '#F59E0B'
  status-danger: '#EF4444'
  status-info: '#0EA5E9'
  accent-emerald: '#059669'
  accent-rose: '#E11D48'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 52px
    fontWeight: '800'
    lineHeight: 58px
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 42px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.025em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 31px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 27px
    letterSpacing: -0.015em
  subheading:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-interactive:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: -0.015em
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 17px
    letterSpacing: 0.01em
  code-inline:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system expresses a high-precision, tactile developer-engineering aesthetic. It synthesizes modern glassmorphism with skeuomorphic micro-tactility—grounding dynamic luminescence in rigorous engineering precision. Targeted at engineers, designers, and high-performance product teams, the interface evokes the feel of premium physical hardware interfaces, responsive telemetry displays, and polished desktop-grade productivity environments.

The visual direction centers on:
- **Tactile Physics:** Micro-interactions favor physical compression (`scale(0.98)`) and high-tension spring damping over standard linear tweens, creating an immediate tactile response under cursor travel or touch.
- **Specular Hairlines & Luminescent Glass:** Surfaces use subtle, light-reactive edge highlights (`inset 0 1px 0 0`) coupled with saturated backdrop blurs (`blur(16px) saturate(180%)`), evoking the frosted 3D isometric layer geometry seen in the emblem.
- **Parametric Cohesion:** Geometry, border tension, and tonal scales operate parametrically across light alabaster canvases and obsidian slate planes.

## Colors

The palette establishes an alabaster light foundation (`#F8FAFC`) with an obsidian slate dark environment (`#0B0F19`). Indigo (`#4F46E5`) serves as the primary chromatic anchor, supported by violet (`#7C3AED`) and ocean sky (`#0EA5E9`) for hierarchy, state, and depth layering.

### Implementation Rules
- **Color Roles:** Primary indigo commands interactive intent, primary focus halos, and core system accents. Secondary violet provides isometric illumination and secondary active states.
- **Hairlines & Borders:** Avoid opaque heavy borders. Structural delineation relies on subtle translucent hairlines: `rgba(15, 23, 42, 0.07)` in light mode and `rgba(255, 255, 255, 0.08)` in dark mode. Interactive elements shift to `0.14` and `0.16` opacity on hover respectively.
- **Specular Highlights:** Elevated cards and glass components must pair outer borders with an inner specular shelf (`inset 0 1px 0 0 rgba(255, 255, 255, 0.8)` in light mode; `rgba(255, 255, 255, 0.06)` in dark mode).
- **Surface Layering:** Elevated surfaces use pure `#FFFFFF` against `#F8FAFC` in light mode, and `#111827` over `#0B0F19` in dark mode. Wells, code trays, and segmented track controls utilize `#F1F5F9` and `#1E293B`.

## Typography

The typographic hierarchy is led by **Plus Jakarta Sans** for clear, geometric legibility across UI text, and **JetBrains Mono** for developer codeblocks, key bindings, tokens, and data telemetry.

### Typographic Guidelines
- **Case Formatting:** Button labels, action toggles, and modal triggers must strictly use Sentence case or Title case. ALL-CAPS styling is prohibited for interactive triggers to maintain a balanced, editorial tone.
- **Reading Measure:** Continuous body copy (`body-lg`) must be constrained between 60ch and 72ch to maintain optimal reading rhythm.
- **Numeric Tabular Alignment:** All telemetry readouts, data tables, benchmark gauges, countdowns, and KPI figures must enable `font-variant-numeric: tabular-nums` to eliminate jitter during active updates.

## Layout & Spacing

The layout model is driven by a flexible 12-column grid and bento-box modularity. Elements snap to an explicit vertical grid based on 4px increments, scaling up to standard structural bounds (`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1440px`).

### Adaptation & Reflow
- **Desktop (≥1024px):** 12-column layout with 24px (`1.5rem`) gutters and margins. Bento cards span multi-column and multi-row configurations. Floating docks and fixed command bars dock cleanly at screen edges with standard margins.
- **Tablet (768px–1023px):** 8-column layout with 20px gutters. Multi-column grids compress into 2-column stacked units.
- **Mobile (<768px):** Single-column stacked flow with 16px (`1rem`) outer canvas margins. Bento modules expand to full width. Persistent bottom toolbars replace floating docks.

## Elevation & Depth

Visual hierarchy relies on low-opacity dual-layer ambient shadows paired with frosted glassmorphism, avoiding dense, muddy drop shadows.

### Depth Architecture
1. **Level 1 (Resting Surfaces & Inputs):**  
   `box-shadow: 0 2px 6px -1px rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`  
   Combined with the structural hairline border and top-edge specular highlight.
2. **Level 2 (Hover States, Popovers & Dropdowns):**  
   `box-shadow: 0 10px 25px -4px rgba(15, 23, 42, 0.06), 0 4px 10px -2px rgba(15, 23, 42, 0.03)`  
   Triggers a physical `translateY(-2px)` lift on interactive cards.
3. **Level 3 (Modals, Command Bars & Floating Docks):**  
   `box-shadow: 0 20px 40px -8px rgba(15, 23, 42, 0.10), 0 8px 16px -4px rgba(15, 23, 42, 0.04)`  
   Pairs with backdrop blur (`backdrop-filter: blur(16px) saturate(180%)`) over a dimmed canvas backdrop.

### Ambient Focus Halos
Every interactive element focused via keyboard or pointer navigation reveals a 3px ambient focus halo:  
`box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18)`  
This aura provides visible focus tracking while harmonizing with the surrounding luminescent light edges.

## Shapes

The design system adopts a balanced roundedness (`roundedness: 2` base scale), applying smooth, geometric curves across all components.

### Radius Distribution
- **Small (`0.5rem` / 8px):** Checkboxes, inline code badges, keyboard shortcut chips (`kbd`), and contextual tooltips.
- **Medium (`0.75rem` / 12px):** Standard buttons, text inputs, selects, tab segment triggers, and menu popover items.
- **Large (`1rem` / 16px):** Bento cards, panel containers, callout boxes, alerts, and code trays.
- **Extra Large (`1.5rem` / 24px):** Dialog modals, hero display frames, and command search dialogs.
- **Full Pill (`9999px`):** Status indicators, dynamic filter pills, switches, track knobs, and floating dock bars.

## Components

### Buttons & Interactive Controls
- **Primary Button:** Solid indigo fill (`#4F46E5`), white label, with a top specular highlight (`inset 0 1px 0 0 rgba(255, 255, 255, 0.2)`).  
- **Tactile Feedback:** Pressing triggers an immediate mechanical compression: `transform: scale(0.98)` driven by `cubic-bezier(0.22, 1, 0.36, 1)` over 150ms.
- **Morphing Success State:** Action-confirming triggers morph to a success state (`#10B981` fill with an animated checkmark) for 1800ms before returning to resting state.
- **Secondary & Ghost Buttons:** Translucent background with hairline border; hovers reveal subtle surface fills without harsh color jumps.

### Cards & Bento Modules
- **Container Structure:** Rendered on white (`#FFFFFF`) in light mode and elevated obsidian (`#111827`) in dark mode, enclosed in hairline borders.
- **Interactive Cards:** Hover states combine a `-2px` Y-axis lift, transition to Elevation Level 2, and border illumination from `0.07` to `0.14` opacity.

### Form Inputs & Selectors
- **Text Inputs:** Height 40px, rounded-md (`12px`), baseline Elevation 1.
- **States:** Resting borders use default hairlines; focus removes the outer border boundary in favor of the 3px indigo focus halo (`0 0 0 3px rgba(99, 102, 241, 0.18)`).
- **Error States:** Border shifts to danger tint (`rgba(239, 68, 68, 0.24)`) and emits a localized crimson focus halo.

### Checkboxes, Radios & Switches
- **Checkboxes & Radios:** Rendered at 18px × 18px. Checked states fill with the primary indigo accent and reveal an SVG checkmark rendered with stroke animation.
- **Switches:** Pill-shaped track (`9999px`) in subtle surface tone (`#F1F5F9` / `#1E293B`). Active toggle slides an elevated circular thumb with an active indigo background, replicating the physical geometry of the system emblem.

### Chips & Status Indicators
- **Status Pills:** Pill radius with duotone styling: a 10% alpha background fill, 24% alpha border, and matching status text.
- **Radar Pulse:** Active system badges feature an animated expanding radial beacon ring to convey live state.

### Code Trays & Telemetry Blocks
- **Presentation:** Rendered with JetBrains Mono over a subtle surface well (`#F1F5F9` / `#1E293B`). 
- **Controls:** Features an inline language badge, top-specular divider line, and a tactile one-click copy button with transient checkmark confirmation.