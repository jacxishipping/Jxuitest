# JXUI (@jxui/react) — Design System Architecture & Specifications

> **Next-Generation Component Library & Interactive Workbench**  
> Reimagining Material UI (Core, Lab, and X) with tactile physics, glassmorphic surfaces, and zero-shift ergonomics.

---

## 1. Design System Philosophy

Traditional enterprise UI libraries (such as Material UI) were conceived in the era of flat paper cards, all-caps buttons, notched outlines, and ink ripples. While functional, they introduce visual noise, abrupt transitions, and persistent Cumulative Layout Shift (CLS) during state transitions.

**JXUI** establishes a modern design language founded on four core principles:

1. **Zero-Shift Ergonomics (CLS = 0)**:
   No button, input, or card may cause layout reflow when transitioning states (idle ➔ loading ➔ success ➔ error). Bounding geometries are locked or pre-allocated.
2. **Tactile Physics & Motion**:
   Interactions utilize spring dynamics (`cubic-bezier(0.22, 1, 0.36, 1)`), velocity-based kinematics, and active press compression (scale 0.98) rather than dated radial ink ripples.
3. **Specular Glassmorphism & Depth**:
   Surfaces employ subtle border sheens, top specular highlights (`inset 0 1px 0 0 rgba(255, 255, 255, 0.8)`), and interactive cursor-tracking spotlights.
4. **Accessible by Default**:
   Full WCAG 2.1 AA/AAA compliance, strict keyboard navigation contracts, native ARIA live-regions, and high-contrast dark mode support.

---

## 2. Design Tokens & Theme Foundation

### 2.1 Typography

| Role | Font Family | Numeric Variant | Usage |
| :--- | :--- | :--- | :--- |
| **Primary Sans** | `'Plus Jakarta Sans', sans-serif` | Normal | UI labels, headings, body text, buttons |
| **Monospace / Tabular** | `'JetBrains Mono', monospace` | `tabular-nums` | Numerical counters, badges, code snippets, timestamps |

### 2.2 Dynamic Accent Palettes

JXUI components adapt dynamically to 5 curated accent palettes via `useJXTheme()`:

| Palette | Primary Hex | Light BG | Dark BG | Ring Focus |
| :--- | :--- | :--- | :--- | :--- |
| **Indigo** | `#4f46e5` | `bg-indigo-600` | `dark:bg-indigo-500` | `focus-visible:ring-indigo-500/30` |
| **Violet** | `#7c3aed` | `bg-violet-600` | `dark:bg-violet-500` | `focus-visible:ring-violet-500/30` |
| **Emerald** | `#059669` | `bg-emerald-600` | `dark:bg-emerald-500` | `focus-visible:ring-emerald-500/30` |
| **Rose** | `#e11d48` | `bg-rose-600` | `dark:bg-rose-500` | `focus-visible:ring-rose-500/30` |
| **Ocean** | `#0284c7` | `bg-sky-600` | `dark:bg-sky-500` | `focus-visible:ring-sky-500/30` |

### 2.3 Elevation & Specular Borders

Rather than generic drop-shadows, JXUI combines diffuse ambient occlusion with an inset white specular reflection to give components physical presence:

```css
/* Tier 1: Controls & Secondary Surfaces */
.jx-elevation-1 {
  box-shadow: 0 2px 6px -1px rgba(15, 23, 42, 0.04),
              0 1px 2px -1px rgba(15, 23, 42, 0.02),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.8);
}

/* Tier 2: Floating Cards & Dropdowns */
.jx-elevation-2 {
  box-shadow: 0 10px 25px -4px rgba(15, 23, 42, 0.06),
              0 4px 10px -2px rgba(15, 23, 42, 0.03),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.85);
}

/* Tier 3: Modals, Command Finder & Overlays */
.jx-elevation-3 {
  box-shadow: 0 20px 40px -8px rgba(15, 23, 42, 0.10),
              0 8px 16px -4px rgba(15, 23, 42, 0.04),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.9);
}
```

### 2.4 Radius Scaling Tiers

Components consume `getRadiusClass(tier)` supporting 5 global scales:

- **Sharp (0px)**: Technical, industrial layouts.
- **Small (8px)**: Compact data-dense dashboards.
- **Medium (12px)**: Default balanced enterprise UI.
- **Large (16px)**: Friendly, contemporary SaaS surfaces.
- **Ultra (24px)**: Expressive mobile/tablet experiences.

---

## 3. Zero-Shift Ergonomics (CLS = 0)

Cumulative Layout Shift is considered a critical defect in JXUI. The following invariants are strictly enforced:

### The 3-State Morphing Button Pattern
When a button triggers an asynchronous action, its label transitions through `idle` ➔ `loading` ➔ `success` (or `error`).
1. Before state modification, `JXButton` measures its current width: `buttonRef.current.offsetWidth`.
2. This width is locked as `minWidth` on the element style.
3. The spinner and status labels animate with opacity and slide transforms inside the preserved footprint.
4. Layout shifts for neighboring elements = **0px**.

### Tabular Numerics & Skeletons
- Any fluctuating value (data grid cells, badge counts, rating decimals) must use `tabular-nums` / `font-mono`.
- Skeleton loaders match the destination component's border radius and exact bounding height, using `.jx-shimmer-wave`.

---

## 4. Component Catalog Hierarchy (8 Categories)

```
JXUI Library Architecture
├── 1. Inputs & Tactile Controls (14)
│   ├── JXAutocomplete (Cmd+K combobox, fuzzy scoring, chip pills)
│   ├── JXButton (3-state morphing, locked width, press spring)
│   ├── JXButtonGroup (segmented connected actions)
│   ├── JXCheckbox (spring tick animation, soft halo)
│   ├── JXFab (floating action button with elevation-3)
│   ├── JXNumberField (scrubbable stepper, arrow velocity)
│   ├── JXRadioGroup (card-mode option selection)
│   ├── JXRating (0.5 precision, sentiment tooltips)
│   ├── JXSelect (frosted dropdown, group separators)
│   ├── JXSlider (spring thumb drag, tooltip callout)
│   ├── JXSwitch (tactile slide toggle, haptic border)
│   ├── JXTextField (zero-notch, password entropy meter)
│   ├── JXToggleButton (multi-state icon toggles)
│   └── JXTransferList (dual-list bulk item mover)
│
├── 2. Data Display & Presence (10)
│   ├── JXAvatar (stacked avatars with overflow counter)
│   ├── JXBadge (rolling odometer badge, status dot)
│   ├── JXChip (deletable pill, leading icon, soft fill)
│   ├── JXDivider (gradient hairline, center label)
│   ├── JXIcon (dual-tone container, glow effect)
│   ├── JXImageList (responsive masonry bento grid)
│   ├── JXList (virtualized list items with chevron hints)
│   ├── JXTable (sortable, sticky header, hover lift)
│   ├── JXTooltip (glassmorphic arrow, spring entry)
│   └── JXTypography (fluid scaling, semantic tags)
│
├── 3. Feedback & Spatial Overlays (6)
│   ├── JXAlert (soft-colored banners, dismiss action)
│   ├── JXBackdrop (frosted blur backdrop-filter)
│   ├── JXDialog (spring scale-in modal, locked body)
│   ├── JXProgress (striped indeterminate, circular gauge)
│   ├── JXSkeleton (zero-shift wave shimmer)
│   └── JXSnackbar (3D stacked toast queue with promise morphing)
│
├── 4. Layered & Glass Surfaces (4)
│   ├── JXAccordion (spring disclosure, nested items)
│   ├── JXAppBar (floating island header, blur sheen)
│   ├── JXCard (cursor spotlight highlight, hover lift)
│   └── JXPaper (elevation foundation primitive)
│
├── 5. Navigation & Wayfinding (10)
│   ├── JXBottomNavigation (floating pill mobile bar)
│   ├── JXBreadcrumbs (collapsible overflow trail)
│   ├── JXDrawer (side slide-over, spring dismiss)
│   ├── JXLink (animated underline indicator)
│   ├── JXMenu (context dropdown with shortcuts)
│   ├── JXNavigationRail (vertical icon sidebar)
│   ├── JXPagination (compact page jumper, edge pills)
│   ├── JXSpeedDial (radial floating quick actions)
│   ├── JXStepper (numbered progress pipeline)
│   └── JXTabs (sliding active pill indicator)
│
├── 6. Layout, Utils & Lab (6)
│   ├── JXBox (polymorphic container)
│   ├── JXGrid (12-column responsive grid)
│   ├── JXMasonry (CSS column dynamic packing)
│   ├── JXStack (flex direction, spacing gap)
│   ├── JXTextareaAutosize (expanding height without scrollbar jump)
│   └── JXTimeline (vertical milestone tracker)
│
├── 7. Enterprise Suite X (5)
│   ├── JXDataGrid (filtering, sorting, CSV/JSON export, aggregations)
│   ├── JXDateRangePicker (natural language date parsing, e.g. "next friday")
│   ├── JXTreeView (nested file/folder system, active indicators)
│   ├── JXCharts (magnetic SVG tracking, interactive tooltip)
│   └── JXRichEditor (slash-command markdown block editor)
│
└── 8. Signature Composed Blocks (6)
    ├── JXDock (macOS magnetic spring magnification)
    ├── Canary Traffic Splitter (real-time routing probability)
    ├── Audio Waveform Scrubber (tactile seekhead with amplitude peaks)
    ├── Passkey Security Vault (biometric webauthn modal)
    ├── Tier Pricing Calculator (annual/monthly discount slider)
    └── Enterprise Audit Flow (multi-step signed verification)
```

---

## 5. Developer Experience & Workbench Shell

The interactive workbench in [`src/App.tsx`](file:///c:/Users/Administrator/Pictures/JXUI/src/App.tsx) provides tooling for testing and integrating components:

1. **Split-Mode Comparison (`compareMode: 'split'`)**:
   Enables side-by-side comparison between legacy MUI baselines and JXUI upgrades.
2. **Global Command Finder (`Cmd+K` / `Ctrl+K`)**:
   Fuzzy-searches across all 61 components, filtering by name, subtitle, or features with keyboard arrow navigation.
3. **Design Token Exporter**:
   Generates production-ready JSON and CSS design token definitions for Tailwind CSS or custom CSS workflows.
4. **Accessibility Matrix**:
   Automated verification of keyboard accessibility and screen-reader compliance with interactive testing overrides.
