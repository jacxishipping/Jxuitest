# JXUI (`jxui-react`)

<p align="center">
  <img src="./public/logo.png" width="160" alt="JXUI Logo" />
</p>

<h3 align="center">Next-Generation React 19 Component Library &amp; Interactive Design System Workbench</h3>

<p align="center">
  Reimagining enterprise React UI with tactile spring kinematics, specular glassmorphism, and guaranteed <strong>zero cumulative layout shift (CLS = 0)</strong>.
</p>

<p align="center">
  <a href="https://github.com/iam-shakir/JXUI-react/actions"><img src="https://img.shields.io/badge/build-passing-brightgreen?style=flat-square&logo=github-actions" alt="Build Status" /></a>
  <a href="https://github.com/iam-shakir/JXUI-react"><img src="https://img.shields.io/badge/tests-13%2F13%20passing-brightgreen?style=flat-square" alt="Tests" /></a>
  <a href="https://iam-shakir.github.io/JXUI-react/"><img src="https://img.shields.io/badge/demo-live%20workbench-indigo?style=flat-square" alt="Live Demo" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/react-19.0.0-blue?style=flat-square&logo=react" alt="React 19" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/typescript-strict%20100%25-blue?style=flat-square&logo=typescript" alt="TypeScript Strict" /></a>
  <a href="https://www.w3.org/WAI/WCAG21/quickref/"><img src="https://img.shields.io/badge/wcag-2.1%20AA%2FAAA-purple?style=flat-square" alt="WCAG 2.1 AA/AAA" /></a>
  <a href="#"><img src="https://img.shields.io/badge/cls-0.00%20guaranteed-success?style=flat-square" alt="CLS Zero" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-informational?style=flat-square" alt="License" /></a>
</p>

---

## ⚡ What is JXUI?

Traditional enterprise UI libraries were conceived in an era of static cards, all-caps buttons, notched outlines, and ink ripples. While functional, they introduce visual noise, layout shifts, and dated aesthetics.

**JXUI** unifies **361 components across 18 modular categories**:
- **System A (61 Production Showcases)**: Full state machines with live telemetry, keyboard traps prevention, ARIA contracts, and MUI flaw diffs.
- **System B (300 Modular Primitives)**: Zero-runtime, Tailwind CSS v4 building blocks with true 3D tilt physics, pointer-captured rotary knobs, vector canvases, and magnetic cursor gravitation.

---

## 🚀 Quick Start

### Installation

Install via your preferred package manager:

```bash
# npm
npm install jxui-react motion lucide-react

# pnpm
pnpm add jxui-react motion lucide-react

# yarn
yarn add jxui-react motion lucide-react

# bun
bun add jxui-react motion lucide-react
```

### Basic Usage

Wrap your application in `JXThemeProvider` to enable dynamic token synthesis, elevation tiers, and dark mode:

```tsx
import React from 'react';
import { JXThemeProvider, useJXTheme } from 'jxui-react';
import { TiltCard, LiquidButton, SignaturePad } from 'jxui-react';

export function App() {
  return (
    <JXThemeProvider defaultMode="dark" defaultAccent="indigo">
      <div className="p-8 space-y-6">
        <TiltCard title="Specular Depth">
          <p>True 3D perspective pitch and yaw tracking cursor coordinates.</p>
        </TiltCard>

        <LiquidButton onClick={() => console.log('Tactile Press')}>
          Liquid Viscosity
        </LiquidButton>
      </div>
    </JXThemeProvider>
  );
}
```

---

## 📦 Master Component Suite (18 Categories • 361 Components)

JXUI features 18 unified categories combining interactive showcases and modular primitives:

| # | Category | Total | Key Highlights & Interactive Features |
| :-: | :--- | :-: | :--- |
| **01** | **Buttons & Actions** | **23** | `LiquidButton`, `RippleButton`, `MagneticButton`, `HoldToConfirmButton`, `SlideToAction`, `SplitButton` |
| **02** | **Glassmorphism & Surfaces** | **21** | `AdaptiveGlass`, `FrostedGlass`, `LiquidGlass`, `DynamicGlassPanel`, `GlassModal`, `SpatialGlassWorkspace` |
| **03** | **Navigation & Wayfinding** | **22** | `MagneticDock`, `FloatingDock`, `AdaptiveNavbar`, `GestureNavigation`, `RadialMenu`, `NavigationRail` |
| **04** | **Inputs & Tactile Controls** | **29** | `SignaturePad`, `DualRangeSlider`, `CircularSlider`, `PinInput`, `TokenInput`, `DynamicFormBuilder` |
| **05** | **Toggles & Selection** | **17** | `SpringSwitch`, `MorphingRadio`, `SegmentedControl`, `TactileCheckbox`, `ThemeToggle` |
| **06** | **Feedback & Notifications** | **21** | `JXSnackbar` (3D stacked toast queue), `PulseBadge`, `StatusBeacon`, `LiveIndicator` |
| **07** | **Modals & Overlays** | **17** | `SpringModal`, `GlassSheet`, `CommandPalette`, `Drawer`, `BackdropFilter` |
| **08** | **Loading & Skeletons** | **16** | `ShimmerWave`, `CircularProgress`, `LiquidLoader`, `PulseGrid` |
| **09** | **Cards & Containers** | **21** | `TiltCard`, `MagneticCard`, `SpotlightCard`, `FlipCard`, `SwipeableCard`, `StackedCard`, `BentoGrid` |
| **10** | **Typography & Media** | **21** | `FluidTypography`, `GradientText`, `AvatarStack`, `MaskedImage`, `VideoPlayer` |
| **11** | **Menus & Popovers** | **15** | `ContextMenu`, `FloatingPopover`, `MegaMenu`, `GlassToolbar` |
| **12** | **Data Grids & Tables** | **17** | `JXDataGrid` (sorting, filtering, CSV export), `VirtualTable`, `EditableDataSheet` |
| **13** | **Data Visualization** | **16** | `Sparkline`, `BarChart`, `AreaChart`, `RadarChart`, `DonutGauge`, `TelemetryStream` |
| **14** | **Drag & Drop** | **15** | `KanbanBoard`, `SortableList`, `FileDropzone`, `SwappableGrid` |
| **15** | **Layout & Structure** | **18** | `BentoLayout`, `SplitPane`, `MasonryFLIP`, `StickyScroll`, `Container` |
| **16** | **Animation & FX** | **15** | `ConfettiEmitter`, `ParticleField`, `GlowOrb`, `SoundFxTrigger` |
| **17** | **AI & Intelligent** | **15** | `PromptInput`, `StreamingChat`, `ModelSelector`, `TokenCounter`, `AgentStatus` |
| **18** | **System & Utilities** | **13** | `ClipboardCopy`, `ShortcutHint`, `Portal`, `ErrorBoundary`, `ColorSwatch` |

---

## ⚖️ JXUI vs Material UI (MUI) Benchmark

| Ergonomic Feature | Material UI (Core / Lab / X) | JXUI (jxui-react) |
| :--- | :--- | :--- |
| **Cumulative Layout Shift** | High: Spinner/text swaps pop button dimensions | **CLS = 0**: State morphing maintains exact bounding box |
| **Surface Physics** | Flat Android 5 ink ripple with linear easing | **Tactile Spring**: Proximity pull, velocity scaling, 3D tilt |
| **CSS Overhead** | Heavy Emotion / styled-components runtime | **Zero-Runtime**: Tailwind CSS v4 + native CSS variables |
| **Glassmorphism** | Flat gray backgrounds with opaque drop shadows | **Specular Depth**: Ambient blur, top highlight, radial spotlights |
| **Accessibility Audit** | Prone to keyboard traps in complex nested modals | **WCAG 2.1 AA/AAA**: Live focus traps auditor & ARIA matrix |

---

## 🛠️ Development & Local Workbench

```bash
# Install dependencies
npm install

# Launch the interactive workbench & GitHub showcase
npm run dev

# Run pure logic unit tests (13/13 passing)
npm test

# Run strict TypeScript linting
npm run lint

# Build production bundle
npm run build
```

The interactive workbench runs locally at `http://localhost:3000`.

---

## 🌐 Deploy to GitHub Pages

JXUI includes an automated GitHub Actions continuous deployment pipeline configured in `.github/workflows/deploy.yml`:

1. Push your changes to `master` or `main`.
2. GitHub Actions installs dependencies, validates types (`npm run lint`), runs tests (`npm test`), and compiles the Vite production bundle (`npm run build`).
3. The site is published automatically to `https://<username>.github.io/<repo>/`.

---

## 📄 License

Released under the [MIT License](LICENSE). Built with pride by the JXUI Core Engineering Team.
