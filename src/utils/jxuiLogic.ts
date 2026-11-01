/**
 * Pure domain logic for JXUI (@jxui/react) interactive components:
 * - Password entropy & strength calculation (JXTextField)
 * - Natural language date parsing (JXDatePicker / JXDateRangePicker)
 * - Fuzzy search scoring & match highlighting (JXAutocomplete / Cmd+K)
 * - Rating sentiment labels (JXRating)
 * - DataGrid CSV/JSON formatting & aggregation (JXDataGrid)
 */

export interface EntropyResult {
  score: number; // 0 to 100
  bits: number;
  label: 'Empty' | 'Weak' | 'Fair' | 'Good' | 'Strong';
  colorClass: string;
  suggestions: string[];
}

export function calculatePasswordEntropy(password: string): EntropyResult {
  if (!password) {
    return {
      score: 0,
      bits: 0,
      label: 'Empty',
      colorClass: 'bg-slate-300 dark:bg-slate-700',
      suggestions: ['Enter at least 10 characters with mixed case, numbers & symbols'],
    };
  }

  let poolSize = 0;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);

  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasDigit) poolSize += 10;
  if (hasSymbol) poolSize += 32;

  const bits = Math.round(password.length * Math.log2(Math.max(poolSize, 1)));
  const score = Math.min(100, Math.round((bits / 80) * 100));

  const suggestions: string[] = [];
  if (password.length < 10) suggestions.push('Add more characters (10+ recommended)');
  if (!hasUpper || !hasLower) suggestions.push('Mix uppercase & lowercase letters');
  if (!hasDigit) suggestions.push('Include at least one number');
  if (!hasSymbol) suggestions.push('Include a special character (!@#$%)');

  if (score < 35) {
    return { score, bits, label: 'Weak', colorClass: 'bg-rose-500', suggestions };
  }
  if (score < 60) {
    return { score, bits, label: 'Fair', colorClass: 'bg-amber-500', suggestions };
  }
  if (score < 82) {
    return { score, bits, label: 'Good', colorClass: 'bg-sky-500', suggestions };
  }
  return { score, bits, label: 'Strong', colorClass: 'bg-emerald-500', suggestions };
}

export function getRatingSentiment(value: number): string {
  if (value <= 0) return 'Unrated';
  if (value <= 1.5) return 'Needs Work';
  if (value <= 2.5) return 'Below Average';
  if (value <= 3.5) return 'Solid & Reliable';
  if (value <= 4.5) return 'Delightful';
  return 'Exceptional';
}

export interface ParsedDateResult {
  label: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  matchedRule: string;
}

function formatYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function addDays(base: Date, days: number): Date {
  const result = new Date(base.getTime());
  result.setDate(result.getDate() + days);
  return result;
}

export function parseNaturalLanguageDate(
  input: string,
  referenceDate: Date = new Date('2026-10-29T12:00:00Z')
): ParsedDateResult | null {
  const q = input.trim().toLowerCase();
  if (!q) return null;

  if (q === 'today' || q === 'now') {
    const d = formatYMD(referenceDate);
    return { label: 'Today', startDate: d, endDate: d, matchedRule: 'today' };
  }

  if (q === 'tomorrow') {
    const d = formatYMD(addDays(referenceDate, 1));
    return { label: 'Tomorrow', startDate: d, endDate: d, matchedRule: 'tomorrow' };
  }

  if (q === 'yesterday') {
    const d = formatYMD(addDays(referenceDate, -1));
    return { label: 'Yesterday', startDate: d, endDate: d, matchedRule: 'yesterday' };
  }

  const inDaysMatch = q.match(/^in\s+(\d+)\s+days?$/);
  if (inDaysMatch) {
    const count = parseInt(inDaysMatch[1], 10);
    const target = formatYMD(addDays(referenceDate, count));
    return {
      label: `In ${count} day${count === 1 ? '' : 's'}`,
      startDate: formatYMD(referenceDate),
      endDate: target,
      matchedRule: 'in_n_days',
    };
  }

  const inWeeksMatch = q.match(/^in\s+(\d+)\s+weeks?$/);
  if (inWeeksMatch) {
    const weeks = parseInt(inWeeksMatch[1], 10);
    const target = formatYMD(addDays(referenceDate, weeks * 7));
    return {
      label: `In ${weeks} week${weeks === 1 ? '' : 's'}`,
      startDate: formatYMD(referenceDate),
      endDate: target,
      matchedRule: 'in_n_weeks',
    };
  }

  const lastDaysMatch = q.match(/^last\s+(\d+)\s+days?$/);
  if (lastDaysMatch) {
    const count = parseInt(lastDaysMatch[1], 10);
    return {
      label: `Last ${count} Days`,
      startDate: formatYMD(addDays(referenceDate, -count + 1)),
      endDate: formatYMD(referenceDate),
      matchedRule: 'last_n_days',
    };
  }

  const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const nextWeekdayMatch = q.match(/^next\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)$/);
  if (nextWeekdayMatch) {
    const targetDayIndex = weekdays.indexOf(nextWeekdayMatch[1]);
    const currentDayIndex = referenceDate.getDay();
    let delta = (targetDayIndex - currentDayIndex + 7) % 7;
    if (delta === 0) delta = 7;
    const target = formatYMD(addDays(referenceDate, delta));
    const capitalized = nextWeekdayMatch[1].charAt(0).toUpperCase() + nextWeekdayMatch[1].slice(1);
    return {
      label: `Next ${capitalized}`,
      startDate: target,
      endDate: target,
      matchedRule: 'next_weekday',
    };
  }

  if (q === 'this quarter' || q === 'q4') {
    const year = referenceDate.getFullYear();
    const qStartMonth = Math.floor(referenceDate.getMonth() / 3) * 3;
    const start = new Date(year, qStartMonth, 1);
    const end = new Date(year, qStartMonth + 3, 0);
    return {
      label: 'This Quarter',
      startDate: formatYMD(start),
      endDate: formatYMD(end),
      matchedRule: 'this_quarter',
    };
  }

  if (q === 'ytd' || q === 'year to date') {
    const year = referenceDate.getFullYear();
    return {
      label: 'Year to Date (YTD)',
      startDate: `${year}-01-01`,
      endDate: formatYMD(referenceDate),
      matchedRule: 'ytd',
    };
  }

  return null;
}

export function fuzzyScore(text: string, query: string): number {
  if (!query.trim()) return 1;
  const t = text.toLowerCase();
  const q = query.trim().toLowerCase();
  if (t === q) return 100;
  if (t.startsWith(q)) return 85;
  if (t.includes(q)) return 65;

  // Subsequence check
  let qIdx = 0;
  let consecutive = 0;
  let score = 0;
  for (let i = 0; i < t.length && qIdx < q.length; i++) {
    if (t[i] === q[qIdx]) {
      qIdx++;
      consecutive++;
      score += 5 + consecutive * 2;
    } else {
      consecutive = 0;
    }
  }
  return qIdx === q.length ? score : 0;
}

export interface GridRow {
  id: string;
  component: string;
  category: string;
  bundleKb: number;
  a11yScore: number;
  status: 'Stable' | 'Beta' | 'RC';
  owner: string;
}

export function exportRowsToCSV(rows: GridRow[]): string {
  const headers = ['ID', 'Component', 'Category', 'Bundle (KB)', 'A11y Score', 'Status', 'Owner'];
  const lines = [headers.join(',')];
  for (const r of rows) {
    lines.push(
      [
        r.id,
        `"${r.component.replace(/"/g, '""')}"`,
        `"${r.category.replace(/"/g, '""')}"`,
        r.bundleKb.toFixed(1),
        String(r.a11yScore),
        r.status,
        `"${r.owner.replace(/"/g, '""')}"`,
      ].join(',')
    );
  }
  return lines.join('\n');
}

export function formatCopyableJsxCode(
  rawSnippet: string,
  componentName: string,
  includeImports: boolean = true
): string {
  const trimmed = rawSnippet.trim();
  if (!includeImports) {
    return trimmed;
  }

  // Extract all JX* component identifiers referenced in the JSX snippet
  const tagMatches = Array.from(trimmed.matchAll(/<([A-Z][A-Za-z0-9_]*)/g)).map(
    (m) => m[1]
  );
  const primaryClean = componentName.split(/[ &/]/)[0].trim();
  const uniqueTags = Array.from(
    new Set([primaryClean, ...tagMatches].filter((t) => t.startsWith('JX')))
  );

  // If no JX* tag was found (e.g., atomic primitive like MagneticButton), import primaryClean
  const resolvedTags =
    uniqueTags.length > 0
      ? uniqueTags
      : primaryClean
      ? [primaryClean]
      : [];

  const importStatement =
    resolvedTags.length > 0
      ? `import { ${resolvedTags.join(', ')} } from 'jxui-react';\n\n`
      : '';

  return `${importStatement}${trimmed}`;
}

export type CopyCodeMode = 'jsx' | 'raw';

export interface CopyableComponentInput {
  name: string;
  subtitle?: string;
  jsxSnippet: string;
  muiFlaw?: string;
  jxuiUpgrade?: string;
  props?: Array<{
    name: string;
    type: string;
    defaultValue?: string;
    description?: string;
    required?: boolean;
  }>;
}

export function generateRawImplementationCode(spec: CopyableComponentInput): string {
  const cleanName =
    spec.name
      .split(/[ &/]/)[0]
      .replace(/[^A-Za-z0-9_]/g, '')
      .trim() || 'JXComponent';

  const propLines =
    spec.props && spec.props.length > 0
      ? spec.props
          .map(
            (p) =>
              `  /** ${p.description || `${p.name} prop`} (default: ${p.defaultValue ?? 'undefined'}) */\n  ${p.name}${
                p.required ? '' : '?'
              }: ${p.type};`
          )
          .join('\n')
      : [
          `  /** Visual surface style */`,
          `  variant?: 'solid' | 'soft' | 'outline' | 'glass';`,
          `  /** Semantic color tone */`,
          `  tone?: 'primary' | 'success' | 'warning' | 'danger';`,
          `  /** Enable 200ms damped spring physics */`,
          `  spring?: boolean;`,
          `  /** Enable 3px accessible focus halo */`,
          `  halo?: boolean;`,
        ].join('\n');

  return `// @jxui/react v3.0.0 — ${cleanName} (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';

/**
 * ${cleanName} — ${spec.subtitle || 'JXUI Interactive Component'}
 * @version 3.0.0
 * Upgrade: ${spec.jxuiUpgrade || 'Zero-layout-shift spring physics with WCAG 2.1 AA compliance.'}
 */
export interface ${cleanName}Props extends React.HTMLAttributes<HTMLElement> {
${propLines}
  className?: string;
  children?: React.ReactNode;
}

export const ${cleanName}: React.FC<${cleanName}Props> = ({
  children = '${cleanName}',
  className = '',
  ...rest
}) => {
  const [active, setActive] = useState(false);

  return (
    <div
      role="region"
      aria-label="${cleanName}"
      data-jxui-version="3.0.0"
      onClick={() => setActive((prev) => !prev)}
      className={\`relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-indigo-500/25 cursor-pointer select-none \${
        active
          ? 'bg-emerald-600 text-white shadow-md'
          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
      } \${className}\`}
      {...rest}
    >
      {active ? <Check className="w-3.5 h-3.5 shrink-0" /> : <Sparkles className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
    </div>
  );
};
`;
}

export function getCopyableComponentCode(
  spec: CopyableComponentInput,
  mode: CopyCodeMode,
  includeImports: boolean = true,
  rawSourceOverride?: string
): string {
  if (mode === 'raw') {
    if (rawSourceOverride && rawSourceOverride.trim().length > 0) {
      return rawSourceOverride.trim();
    }
    return generateRawImplementationCode(spec);
  }
  return formatCopyableJsxCode(spec.jsxSnippet, spec.name, includeImports);
}

export interface DockIconKinematics {
  scale: number;
  y: number;
  rotateZ: number;
  pullX: number;
  pullY: number;
  iconX: number;
  iconY: number;
  isSnapped: boolean;
}

export function computeDockIconKinematics(
  distancePx: number,
  maxDistance: number = 136,
  baseMagnification: number = 1.48,
  velocityPxPerSec: number = 0,
  velocityBoostEnabled: boolean = true,
  distanceYPx: number = 0,
  magneticSnapEnabled: boolean = true,
  magneticStrength: number = 0.32
): DockIconKinematics {
  if (!Number.isFinite(distancePx) || Math.abs(distancePx) >= maxDistance) {
    return {
      scale: 1,
      y: 0,
      rotateZ: 0,
      pullX: 0,
      pullY: 0,
      iconX: 0,
      iconY: 0,
      isSnapped: false,
    };
  }

  const normalized = distancePx / maxDistance;
  const proximityWeight = Math.pow(Math.cos((normalized * Math.PI) / 2), 2);
  const absVel = Math.abs(velocityPxPerSec) || 0;

  const kineticScaleBoost = velocityBoostEnabled
    ? Math.min(0.16, (absVel / 2800) * proximityWeight)
    : 0;
  const scale = Number(
    (1 + (baseMagnification - 1) * proximityWeight + kineticScaleBoost).toFixed(4)
  );

  const kineticLift = velocityBoostEnabled
    ? Math.min(3.5, (absVel / 900) * proximityWeight)
    : 0;

  // Magnetic-snap gravitational pull toward the cursor position (X and Y)
  const magneticCaptureWeight = Math.pow(proximityWeight, 1.25);
  const isSnapped = magneticSnapEnabled && Math.abs(distancePx) <= maxDistance * 0.48;

  const rawPullX = magneticSnapEnabled
    ? Math.max(
        -12,
        Math.min(12, distancePx * magneticStrength * magneticCaptureWeight)
      )
    : 0;
  const pullX = Number(rawPullX.toFixed(3));

  const validDistY = Number.isFinite(distanceYPx) ? distanceYPx : 0;
  const rawPullY = magneticSnapEnabled
    ? Math.max(
        -7,
        Math.min(7, validDistY * (magneticStrength * 0.75) * magneticCaptureWeight)
      )
    : 0;
  const pullY = Number(rawPullY.toFixed(3));

  // Combine vertical dock lift with magnetic vertical pull toward cursor
  const y = Number((-(9 * proximityWeight + kineticLift) + pullY).toFixed(3));

  // Inner icon glyph experiences secondary parallax snap toward cursor
  const iconX = Number((pullX * 0.45).toFixed(3));
  const iconY = Number((pullY * 0.45).toFixed(3));

  const cosWeight = Math.cos((normalized * Math.PI) / 2);
  const rotateZ = velocityBoostEnabled
    ? Number(
        Math.max(-7, Math.min(7, ((velocityPxPerSec || 0) / 220) * cosWeight)).toFixed(3)
      )
    : 0;

  return { scale, y, rotateZ, pullX, pullY, iconX, iconY, isSnapped };
}

export interface TierPricingCalculation {
  effectivePerSeat: number;
  originalPerSeat: number;
  monthlyTotal: number;
  originalMonthlyTotal: number;
  annualSavings: number;
  volumeDiscountPercent: number;
  volumeTierLabel: string | null;
}

export function calculateTierPricing(
  baseMonthlyPerSeat: number,
  billingCycle: 'monthly' | 'annual',
  seats: number,
  annualDiscount: number = 0.2
): TierPricingCalculation {
  const validSeats = Math.max(1, Math.round(seats));
  const cycleMultiplier = billingCycle === 'annual' ? 1 - annualDiscount : 1;

  let volumeDiscountPercent = 0;
  let volumeTierLabel: string | null = null;
  if (validSeats >= 50) {
    volumeDiscountPercent = 15;
    volumeTierLabel = '15% Volume Tier';
  } else if (validSeats >= 25) {
    volumeDiscountPercent = 8;
    volumeTierLabel = '8% Volume Tier';
  }

  const volumeMultiplier = 1 - volumeDiscountPercent / 100;
  const effectivePerSeat = Number(
    (baseMonthlyPerSeat * cycleMultiplier * volumeMultiplier).toFixed(2)
  );
  const originalPerSeat = baseMonthlyPerSeat;
  const monthlyTotal = Math.round(validSeats * effectivePerSeat);
  const originalMonthlyTotal = Math.round(validSeats * originalPerSeat);
  const annualSavings = Math.max(0, (originalMonthlyTotal - monthlyTotal) * 12);

  return {
    effectivePerSeat,
    originalPerSeat,
    monthlyTotal,
    originalMonthlyTotal,
    annualSavings,
    volumeDiscountPercent,
    volumeTierLabel,
  };
}

export type CanaryRolloutPhase =
  | 'Baseline (0%)'
  | 'Early Canary (1–25%)'
  | 'Progressive Split (26–74%)'
  | 'Majority Canary (75–99%)'
  | 'Full Production (100%)';

export interface TrafficSplitState {
  stablePercent: number;
  canaryPercent: number;
  phase: CanaryRolloutPhase;
  canaryColorToken: 'slate' | 'sky' | 'indigo' | 'amber' | 'emerald';
  canaryBarGradient: string;
  stableBarClass: string;
  canaryBadgeClass: string;
  canaryRps: number;
  stableRps: number;
  p99LatencyMs: number;
}

export function computeTrafficSplitState(canaryWeight: number): TrafficSplitState {
  const clamped = Math.max(0, Math.min(100, Math.round(canaryWeight)));
  const stablePercent = 100 - clamped;
  const canaryPercent = clamped;

  const canaryRps = Number(((canaryPercent * 142) / 10).toFixed(1));
  const stableRps = Number(((stablePercent * 142) / 10).toFixed(1));
  const p99LatencyMs = Number((12.4 - canaryPercent * 0.015).toFixed(2));

  if (canaryPercent === 0) {
    return {
      stablePercent,
      canaryPercent,
      phase: 'Baseline (0%)',
      canaryColorToken: 'slate',
      canaryBarGradient: 'bg-slate-400 dark:bg-slate-600',
      stableBarClass: 'bg-slate-600 dark:bg-slate-500',
      canaryBadgeClass:
        'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700',
      canaryRps,
      stableRps,
      p99LatencyMs,
    };
  }

  if (canaryPercent <= 25) {
    return {
      stablePercent,
      canaryPercent,
      phase: 'Early Canary (1–25%)',
      canaryColorToken: 'sky',
      canaryBarGradient: 'bg-gradient-to-r from-sky-500 to-cyan-500',
      stableBarClass: 'bg-slate-500 dark:bg-slate-600',
      canaryBadgeClass:
        'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-700',
      canaryRps,
      stableRps,
      p99LatencyMs,
    };
  }

  if (canaryPercent < 75) {
    return {
      stablePercent,
      canaryPercent,
      phase: 'Progressive Split (26–74%)',
      canaryColorToken: 'indigo',
      canaryBarGradient: 'bg-gradient-to-r from-indigo-500 to-violet-600',
      stableBarClass: 'bg-slate-400 dark:bg-slate-600',
      canaryBadgeClass:
        'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700',
      canaryRps,
      stableRps,
      p99LatencyMs,
    };
  }

  if (canaryPercent < 100) {
    return {
      stablePercent,
      canaryPercent,
      phase: 'Majority Canary (75–99%)',
      canaryColorToken: 'amber',
      canaryBarGradient: 'bg-gradient-to-r from-amber-500 to-emerald-500',
      stableBarClass: 'bg-slate-400 dark:bg-slate-700',
      canaryBadgeClass:
        'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700',
      canaryRps,
      stableRps,
      p99LatencyMs,
    };
  }

  return {
    stablePercent,
    canaryPercent,
    phase: 'Full Production (100%)',
    canaryColorToken: 'emerald',
    canaryBarGradient: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    stableBarClass: 'bg-slate-300 dark:bg-slate-800',
    canaryBadgeClass:
      'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
    canaryRps,
    stableRps,
    p99LatencyMs,
  };
}

// ============================================================================
// DESIGN TOKEN EXPORTER (JSON & CSS VARIABLES GENERATOR)
// ============================================================================

export type TokenThemeMode = 'light' | 'dark';
export type TokenAccentColor = 'indigo' | 'violet' | 'emerald' | 'rose' | 'ocean';
export type TokenRadiusScale = 'sharp' | 'sm' | 'md' | 'lg' | 'xl';

export interface DesignTokenExportConfig {
  mode: TokenThemeMode;
  accent: TokenAccentColor;
  radiusScale: TokenRadiusScale;
}

export interface AccentTonalScale {
  name: string;
  primaryHex: string;
  haloRgba: string;
  stops: {
    '50': string;
    '100': string;
    '200': string;
    '300': string;
    '400': string;
    '500': string;
    '600': string;
    '700': string;
    '800': string;
    '900': string;
    '950': string;
  };
}

export const ACCENT_TONAL_SCALES: Record<TokenAccentColor, AccentTonalScale> = {
  indigo: {
    name: 'Indigo',
    primaryHex: '#4f46e5',
    haloRgba: 'rgba(99, 102, 241, 0.18)',
    stops: {
      '50': '#eef2ff',
      '100': '#e0e7ff',
      '200': '#c7d2fe',
      '300': '#a5b4fc',
      '400': '#818cf8',
      '500': '#6366f1',
      '600': '#4f46e5',
      '700': '#4338ca',
      '800': '#3730a3',
      '900': '#312e81',
      '950': '#1e1b4b',
    },
  },
  violet: {
    name: 'Violet',
    primaryHex: '#7c3aed',
    haloRgba: 'rgba(139, 92, 246, 0.18)',
    stops: {
      '50': '#f5f3ff',
      '100': '#ede9fe',
      '200': '#ddd6fe',
      '300': '#c4b5fd',
      '400': '#a78bfa',
      '500': '#8b5cf6',
      '600': '#7c3aed',
      '700': '#6d28d9',
      '800': '#5b21b6',
      '900': '#4c1d95',
      '950': '#2e1065',
    },
  },
  emerald: {
    name: 'Emerald',
    primaryHex: '#059669',
    haloRgba: 'rgba(16, 185, 129, 0.18)',
    stops: {
      '50': '#ecfdf5',
      '100': '#d1fae5',
      '200': '#a7f3d0',
      '300': '#6ee7b7',
      '400': '#34d399',
      '500': '#10b981',
      '600': '#059669',
      '700': '#047857',
      '800': '#065f46',
      '900': '#064e3b',
      '950': '#022c22',
    },
  },
  rose: {
    name: 'Rose',
    primaryHex: '#e11d48',
    haloRgba: 'rgba(244, 63, 94, 0.18)',
    stops: {
      '50': '#fff1f2',
      '100': '#ffe4e6',
      '200': '#fecdd3',
      '300': '#fda4af',
      '400': '#fb7185',
      '500': '#f43f5e',
      '600': '#e11d48',
      '700': '#be123c',
      '800': '#9f1239',
      '900': '#881337',
      '950': '#4c0519',
    },
  },
  ocean: {
    name: 'Ocean Sky',
    primaryHex: '#0284c7',
    haloRgba: 'rgba(14, 165, 233, 0.18)',
    stops: {
      '50': '#f0f9ff',
      '100': '#e0f2fe',
      '200': '#bae6fd',
      '300': '#7dd3fc',
      '400': '#38bdf8',
      '500': '#0ea5e9',
      '600': '#0284c7',
      '700': '#0369a1',
      '800': '#075985',
      '900': '#0c4a6e',
      '950': '#082f49',
    },
  },
};

export interface RadiusTokenValues {
  scaleId: TokenRadiusScale;
  label: string;
  controlPx: string;
  cardPx: string;
  pillPx: string;
}

export const RADIUS_TOKEN_MAP: Record<TokenRadiusScale, RadiusTokenValues> = {
  sharp: {
    scaleId: 'sharp',
    label: 'Sharp (0px)',
    controlPx: '0px',
    cardPx: '0px',
    pillPx: '0px',
  },
  sm: {
    scaleId: 'sm',
    label: 'Small (8px)',
    controlPx: '6px',
    cardPx: '8px',
    pillPx: '6px',
  },
  md: {
    scaleId: 'md',
    label: 'Medium (12px)',
    controlPx: '8px',
    cardPx: '12px',
    pillPx: '9999px',
  },
  lg: {
    scaleId: 'lg',
    label: 'Large (16px)',
    controlPx: '12px',
    cardPx: '16px',
    pillPx: '9999px',
  },
  xl: {
    scaleId: 'xl',
    label: 'Ultra (24px)',
    controlPx: '16px',
    cardPx: '24px',
    pillPx: '9999px',
  },
};

export function getDesignTokenFilename(
  config: DesignTokenExportConfig,
  format: 'json' | 'css'
): string {
  return `jxui-tokens-${config.accent}-${config.mode}-${config.radiusScale}.${format}`;
}

export function generateDesignTokensJSON(config: DesignTokenExportConfig): string {
  const accentScale = ACCENT_TONAL_SCALES[config.accent] || ACCENT_TONAL_SCALES.indigo;
  const radiusSpec = RADIUS_TOKEN_MAP[config.radiusScale] || RADIUS_TOKEN_MAP.lg;
  const isDark = config.mode === 'dark';

  const payload = {
    $schema: 'https://tr.designtokens.org/format/',
    $metadata: {
      system: 'JXUI (@jxui/react)',
      version: '3.0.0',
      activeThemeMode: config.mode,
      activeAccentPalette: config.accent,
      activeRadiusScale: config.radiusScale,
      wcagCompliance: 'WCAG 2.1 AA',
    },
    color: {
      accent: {
        $description: `Active primary accent palette (${accentScale.name})`,
        name: { $value: accentScale.name, $type: 'string' },
        primary: {
          $value: isDark ? accentScale.stops['500'] : accentScale.stops['600'],
          $type: 'color',
        },
        hover: {
          $value: isDark ? accentScale.stops['400'] : accentScale.stops['500'],
          $type: 'color',
        },
        focusHalo: { $value: accentScale.haloRgba, $type: 'color' },
        scale: Object.fromEntries(
          Object.entries(accentScale.stops).map(([stop, hex]) => [
            stop,
            { $value: hex, $type: 'color' },
          ])
        ),
      },
      surface: {
        canvas: { $value: isDark ? '#0B0F19' : '#F8FAFC', $type: 'color' },
        elevatedCard: { $value: isDark ? '#0F172A' : '#FFFFFF', $type: 'color' },
        translucentGlass: {
          $value: isDark ? 'rgba(15, 23, 42, 0.82)' : 'rgba(255, 255, 255, 0.82)',
          $type: 'color',
        },
        hairlineBorder: {
          $value: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.07)',
          $type: 'color',
        },
        specularHighlight: {
          $value: isDark
            ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.06)'
            : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.80)',
          $type: 'shadow',
        },
      },
      text: {
        primary: { $value: isDark ? '#F8FAFC' : '#0F172A', $type: 'color' },
        secondary: { $value: isDark ? '#94A3B8' : '#475569', $type: 'color' },
        muted: { $value: isDark ? '#64748B' : '#64748B', $type: 'color' },
      },
    },
    geometry: {
      radius: {
        activeScale: { $value: radiusSpec.scaleId, $type: 'string' },
        control: { $value: radiusSpec.controlPx, $type: 'dimension' },
        card: { $value: radiusSpec.cardPx, $type: 'dimension' },
        pill: { $value: radiusSpec.pillPx, $type: 'dimension' },
        presets: {
          none: { $value: '0px', $type: 'dimension' },
          sm: { $value: '8px', $type: 'dimension' },
          md: { $value: '12px', $type: 'dimension' },
          lg: { $value: '16px', $type: 'dimension' },
          xl: { $value: '24px', $type: 'dimension' },
          full: { $value: '9999px', $type: 'dimension' },
        },
      },
    },
    elevation: {
      elevation1: {
        $value: '0 2px 6px -1px rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)',
        $type: 'shadow',
      },
      elevation2: {
        $value: '0 10px 25px -4px rgba(15, 23, 42, 0.06), 0 4px 10px -2px rgba(15, 23, 42, 0.03)',
        $type: 'shadow',
      },
      elevation3: {
        $value: '0 20px 40px -8px rgba(15, 23, 42, 0.10), 0 8px 16px -4px rgba(15, 23, 42, 0.04)',
        $type: 'shadow',
      },
    },
    motion: {
      springBezier: { $value: 'cubic-bezier(0.22, 1, 0.36, 1)', $type: 'cubicBezier' },
      pressScale: { $value: '0.98', $type: 'number' },
      backdropBlur: { $value: '16px', $type: 'dimension' },
    },
    typography: {
      fontSans: {
        $value: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
        $type: 'fontFamily',
      },
      fontMono: {
        $value: "'JetBrains Mono', monospace",
        $type: 'fontFamily',
      },
      trackingTight: { $value: '-0.015em', $type: 'dimension' },
    },
  };

  return JSON.stringify(payload, null, 2);
}

export function generateDesignTokensCSS(config: DesignTokenExportConfig): string {
  const accentScale = ACCENT_TONAL_SCALES[config.accent] || ACCENT_TONAL_SCALES.indigo;
  const radiusSpec = RADIUS_TOKEN_MAP[config.radiusScale] || RADIUS_TOKEN_MAP.lg;
  const isDark = config.mode === 'dark';

  const stopLines = Object.entries(accentScale.stops)
    .map(([stop, hex]) => `  --jx-accent-${stop}: ${hex};`)
    .join('\n');

  return `/**
 * JXUI (@jxui/react) v3.0 — Generated Design Tokens CSS Variables
 * Active Profile: mode=${config.mode} | accent=${config.accent} (${accentScale.name}) | radius=${config.radiusScale} (${radiusSpec.label})
 */

:root {
  /* 1. Active Accent Palette (${accentScale.name}) */
${stopLines}
  --jx-accent-primary: ${isDark ? accentScale.stops['500'] : accentScale.stops['600']};
  --jx-accent-hover: ${isDark ? accentScale.stops['400'] : accentScale.stops['500']};
  --jx-focus-halo: 0 0 0 3px ${accentScale.haloRgba};

  /* 2. Active Surface & Luminance Tokens (${config.mode} mode) */
  --jx-surface-canvas: ${isDark ? '#0B0F19' : '#F8FAFC'};
  --jx-surface-card: ${isDark ? '#0F172A' : '#FFFFFF'};
  --jx-surface-glass: ${isDark ? 'rgba(15, 23, 42, 0.82)' : 'rgba(255, 255, 255, 0.82)'};
  --jx-border-hairline: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.07)'};
  --jx-specular-top: ${isDark ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.06)' : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.80)'};
  --jx-text-primary: ${isDark ? '#F8FAFC' : '#0F172A'};
  --jx-text-secondary: ${isDark ? '#94A3B8' : '#475569'};

  /* 3. Active Geometry & Radius Scale (${radiusSpec.label}) */
  --jx-radius-control: ${radiusSpec.controlPx};
  --jx-radius-card: ${radiusSpec.cardPx};
  --jx-radius-pill: ${radiusSpec.pillPx};
  --jx-radius-sm: 8px;
  --jx-radius-md: 12px;
  --jx-radius-lg: 16px;
  --jx-radius-xl: 24px;
  --jx-radius-full: 9999px;

  /* 4. Diffused Multi-Layered Elevation Shadows */
  --jx-elevation-1: 0 2px 6px -1px rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02);
  --jx-elevation-2: 0 10px 25px -4px rgba(15, 23, 42, 0.06), 0 4px 10px -2px rgba(15, 23, 42, 0.03);
  --jx-elevation-3: 0 20px 40px -8px rgba(15, 23, 42, 0.10), 0 8px 16px -4px rgba(15, 23, 42, 0.04);

  /* 5. Tactile Spring Physics & Typography */
  --jx-spring-easing: cubic-bezier(0.22, 1, 0.36, 1);
  --jx-press-scale: 0.98;
  --jx-backdrop-blur: blur(16px);
  --jx-font-sans: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif;
  --jx-font-mono: 'JetBrains Mono', monospace;
}
`;
}

// ============================================================================
// WCAG 2.1 AA ACCESSIBILITY & ARIA STANDARDS EVALUATOR
// ============================================================================

export interface ComponentAccessibilitySpec {
  id: string;
  number: number;
  name: string;
  category: string;
  ariaRole: string;
  ariaAttributes: string[];
  wcagCriteria: string[];
  contrastRatio: string;
  keyboardContract: string;
  screenReaderContract: string;
}

export interface AccessibilityCheckOverride {
  keyboardPass: boolean;
  screenReaderPass: boolean;
}

export interface AccessibilityAuditSummary {
  totalComponents: number;
  keyboardPassCount: number;
  screenReaderPassCount: number;
  fullyCompliantCount: number;
  compliancePercentage: number;
  failedComponentIds: string[];
  overallStatus: 'WCAG 2.1 AA Certified' | 'Remediation Required';
}

const SPECIFIC_A11Y_MAP: Record<
  string,
  {
    ariaRole: string;
    ariaAttributes: string[];
    keyboardContract: string;
    screenReaderContract: string;
    contrastRatio?: string;
  }
> = {
  'jx-autocomplete': {
    ariaRole: 'combobox + listbox',
    ariaAttributes: ['aria-expanded', 'aria-autocomplete="list"', 'aria-activedescendant', 'aria-multiselectable'],
    keyboardContract: '⌘K / Ctrl+K opens palette; ArrowUp/Down cycles options; Enter selects; Backspace deletes last token; Escape closes.',
    screenReaderContract: 'Announces match count via polite live region, active group header, and multi-select token removal.',
  },
  'jx-button': {
    ariaRole: 'button',
    ariaAttributes: ['aria-busy', 'aria-disabled', 'aria-live="polite"'],
    keyboardContract: 'Tab focuses with 3px indigo halo; Space / Enter triggers tactile press & morphing state.',
    screenReaderContract: 'Announces loading spinner transition ("Syncing...") and morphSuccess completion state automatically.',
  },
  'jx-button-group': {
    ariaRole: 'group / radiogroup',
    ariaAttributes: ['aria-label', 'aria-pressed', 'role="group"'],
    keyboardContract: 'Roving tabIndex with ArrowLeft/Right navigation between segmented actions and split menu trigger.',
    screenReaderContract: 'Reads group label context and announces active segment selection state.',
  },
  'jx-checkbox': {
    ariaRole: 'checkbox',
    ariaAttributes: ['aria-checked="true|false|mixed"', 'aria-describedby'],
    keyboardContract: 'Tab moves between checkbox cards; Space toggles checked/indeterminate state with spring bounce.',
    screenReaderContract: 'Announces label, rich card description, and tri-state mixed status for parent batch controls.',
  },
  'jx-fab': {
    ariaRole: 'button',
    ariaAttributes: ['aria-label', 'aria-expanded'],
    keyboardContract: 'Tab focuses floating pill action; Enter/Space triggers primary quick-create action.',
    screenReaderContract: 'Exposes accessible action label even when collapsed into compact icon-only scroll mode.',
  },
  'jx-radio-group': {
    ariaRole: 'radiogroup + radio',
    ariaAttributes: ['aria-checked', 'aria-labelledby', 'aria-describedby'],
    keyboardContract: 'Roving tabIndex: ArrowUp/Down/Left/Right moves focus and selects plan card; Home/End jumps to first/last.',
    screenReaderContract: 'Announces radio card title, pricing tier metadata, and position (e.g. "2 of 3").',
  },
  'jx-rating': {
    ariaRole: 'slider / radiogroup',
    ariaAttributes: ['aria-valuenow', 'aria-valuemin="0"', 'aria-valuemax="5"', 'aria-valuetext'],
    keyboardContract: 'ArrowLeft/Right adjusts rating in 0.5 increments; Home resets to 0; End sets to 5.',
    screenReaderContract: 'Reads numeric star value alongside expressive sentiment label (e.g., "4.5 stars — Delightful").',
  },
  'jx-select': {
    ariaRole: 'combobox + listbox',
    ariaAttributes: ['aria-haspopup="listbox"', 'aria-expanded', 'aria-selected'],
    keyboardContract: 'Enter/Space/ArrowDown opens popover; Arrow keys navigate options; typeahead filters list; Escape closes.',
    screenReaderContract: 'Announces selected option badge, status dot semantics, and total available choices.',
  },
  'jx-slider': {
    ariaRole: 'slider',
    ariaAttributes: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax', 'aria-valuetext', 'aria-orientation'],
    keyboardContract: 'ArrowLeft/Right/Up/Down steps by 1%; PageUp/PageDown steps by 10%; Home/End jumps to min/max bounds.',
    screenReaderContract: 'Announces live formatted unit value and histogram density percentile on thumb movement.',
  },
  'jx-switch': {
    ariaRole: 'switch',
    ariaAttributes: ['aria-checked', 'aria-readonly', 'aria-label'],
    keyboardContract: 'Space or Enter toggles liquid spring thumb; respects prefers-reduced-motion instantaneously.',
    screenReaderContract: 'Announces "Switch, On" or "Switch, Off" with associated setting title and description.',
  },
  'jx-text-field': {
    ariaRole: 'textbox',
    ariaAttributes: ['aria-invalid', 'aria-errormessage', 'aria-describedby'],
    keyboardContract: 'Standard text navigation; Escape clears search input; Tab reaches inline visibility/copy actions.',
    screenReaderContract: 'Links top label and live password entropy meter via aria-describedby without layout-shifting notches.',
  },
  'jx-transfer-list': {
    ariaRole: 'group + listbox',
    ariaAttributes: ['aria-multiselectable="true"', 'aria-label'],
    keyboardContract: 'ArrowUp/Down navigates items; Space toggles selection; Enter moves selected items across buckets.',
    screenReaderContract: 'Polite live region announces item transfers (e.g., "Moved 2 permissions to Assigned").',
  },
  'jx-toggle-button': {
    ariaRole: 'radiogroup / toolbar',
    ariaAttributes: ['aria-pressed', 'aria-checked'],
    keyboardContract: 'Roving tabIndex with ArrowLeft/Right/Home/End across sliding pill segments.',
    screenReaderContract: 'Announces active view mode or formatting toggle state.',
  },
  'jx-number-input': {
    ariaRole: 'spinbutton',
    ariaAttributes: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
    keyboardContract: 'ArrowUp/Down steps value; Shift+Arrow steps by 10; Home/End snaps to min/max limits.',
    screenReaderContract: 'Announces updated numeric quantity and unit suffix on each increment.',
  },
  'jx-data-grid': {
    ariaRole: 'grid + row + gridcell',
    ariaAttributes: ['aria-rowcount', 'aria-colcount', 'aria-sort', 'aria-selected'],
    keyboardContract: '2D Arrow key cell navigation; Space selects row; Enter activates inline cell edit; Escape cancels edit.',
    screenReaderContract: 'Announces column sort direction, active cell coordinates, and bulk selection count.',
  },
  'jx-date-range-picker': {
    ariaRole: 'dialog + grid',
    ariaAttributes: ['aria-label="Choose date range"', 'aria-selected', 'aria-current="date"'],
    keyboardContract: 'Natural language input accepts typed phrases ("next friday"); Arrow keys navigate calendar grid days.',
    screenReaderContract: 'Announces parsed natural-language date range and start/end selection boundaries.',
  },
  'jx-spotlight-dock': {
    ariaRole: 'toolbar',
    ariaAttributes: ['aria-label="JXUI Tactile Application Dock"', 'aria-pressed'],
    keyboardContract: 'Tab & ArrowLeft/Right cycle dock launchers with 3px focus halo; Enter/Space triggers haptic launch.',
    screenReaderContract: 'Announces launcher app name, notification badge count, and running indicator status.',
  },
  'jx-pricing-bento-matrix': {
    ariaRole: 'region + radiogroup',
    ariaAttributes: ['aria-label="Subscription Pricing Tiers"', 'aria-pressed'],
    keyboardContract: 'Tab navigates billing cycle toggle, seat volume slider, and tier selection CTAs.',
    screenReaderContract: 'Announces dynamic per-seat price updates, annual discount savings, and recommended tier badge.',
  },
  'jx-command-deploy-pipeline': {
    ariaRole: 'region + slider',
    ariaAttributes: ['aria-label="Canary Traffic Allocation Percentage"', 'aria-valuenow', 'aria-valuetext'],
    keyboardContract: 'Slider supports Arrow keys (1% step), PageUp/Down (10%), plus instant preset buttons (0%, 10%, 25%, 50%, 100%).',
    screenReaderContract: 'Announces live stable vs. canary traffic split percentages, rollout phase, and RPS telemetry.',
  },
};

export function getComponentAccessibilitySpec(spec: {
  id: string;
  number: number;
  name: string;
  category: string;
}): ComponentAccessibilitySpec {
  const specific = SPECIFIC_A11Y_MAP[spec.id];
  if (specific) {
    return {
      id: spec.id,
      number: spec.number,
      name: spec.name,
      category: spec.category,
      ariaRole: specific.ariaRole,
      ariaAttributes: specific.ariaAttributes,
      wcagCriteria: [
        '1.4.3 Contrast (Minimum) AA',
        '2.1.1 Keyboard Accessible',
        '2.4.7 Focus Visible (3px Halo)',
        '4.1.2 Name, Role, Value',
      ],
      contrastRatio: specific.contrastRatio || '7.2:1 (AA/AAA)',
      keyboardContract: specific.keyboardContract,
      screenReaderContract: specific.screenReaderContract,
    };
  }

  // Category-aware deterministic defaults for the remaining components in the 61-component catalog
  switch (spec.category) {
    case 'data-display':
      return {
        id: spec.id,
        number: spec.number,
        name: spec.name,
        category: spec.category,
        ariaRole: 'region / list / table',
        ariaAttributes: ['aria-label', 'aria-live="polite"', 'aria-expanded'],
        wcagCriteria: [
          '1.3.1 Info and Relationships',
          '1.4.3 Contrast (Minimum) AA',
          '2.1.1 Keyboard Accessible',
          '4.1.3 Status Messages',
        ],
        contrastRatio: '7.5:1 (AA/AAA)',
        keyboardContract:
          'Tab & Arrow keys navigate interactive tokens, avatar popovers, and sortable table headers; Escape dismisses hover cards.',
        screenReaderContract:
          'Provides semantic structure, tabular-nums odometer announcements, and accessible labels for status badges and icons.',
      };
    case 'feedback':
      return {
        id: spec.id,
        number: spec.number,
        name: spec.name,
        category: spec.category,
        ariaRole: 'alert / dialog / status',
        ariaAttributes: ['aria-modal="true"', 'aria-live="assertive|polite"', 'aria-busy', 'aria-labelledby'],
        wcagCriteria: [
          '2.1.2 No Keyboard Trap',
          '2.4.3 Focus Order',
          '4.1.2 Name, Role, Value',
          '4.1.3 Status Messages',
        ],
        contrastRatio: '6.8:1 (AA)',
        keyboardContract:
          'Cycles focus strictly inside modal overlays; Escape dismisses non-blocking dialogs and toasts; returns focus to trigger on close.',
        screenReaderContract:
          'Announces toast status transitions, progress percentage updates, and alert severity without interrupting active input focus.',
      };
    case 'surfaces':
      return {
        id: spec.id,
        number: spec.number,
        name: spec.name,
        category: spec.category,
        ariaRole: 'region / button (accordion header)',
        ariaAttributes: ['aria-expanded', 'aria-controls', 'aria-labelledby'],
        wcagCriteria: [
          '1.3.1 Info and Relationships',
          '1.4.11 Non-text Contrast',
          '2.1.1 Keyboard Accessible',
          '2.4.7 Focus Visible',
        ],
        contrastRatio: '7.8:1 (AA/AAA)',
        keyboardContract:
          'Enter/Space toggles accordion disclosure panels; Home/End/ArrowUp/Down moves between surface headers.',
        screenReaderContract:
          'Associates disclosure headers with collapsible content regions via aria-controls and announces expanded/collapsed state.',
      };
    case 'navigation':
      return {
        id: spec.id,
        number: spec.number,
        name: spec.name,
        category: spec.category,
        ariaRole: 'navigation / tablist / menu',
        ariaAttributes: ['aria-current="page|step"', 'aria-selected', 'aria-haspopup="menu"', 'aria-orientation'],
        wcagCriteria: [
          '2.1.1 Keyboard Accessible',
          '2.4.3 Focus Order',
          '2.4.7 Focus Visible',
          '2.4.8 Location',
        ],
        contrastRatio: '7.1:1 (AA/AAA)',
        keyboardContract:
          'Roving tabIndex with Arrow keys across tabs, menus, breadcrumbs, and stepper nodes; Escape closes popovers and drawers.',
        screenReaderContract:
          'Identifies current page/step via aria-current, announces collapsed breadcrumb ellipsis count, and reads keyboard shortcut hints.',
      };
    case 'layout-utils':
      return {
        id: spec.id,
        number: spec.number,
        name: spec.name,
        category: spec.category,
        ariaRole: 'region / list (timeline)',
        ariaAttributes: ['aria-label', 'aria-expanded', 'data-reduced-motion'],
        wcagCriteria: [
          '1.3.2 Meaningful Sequence',
          '1.4.10 Reflow (320px–1440px)',
          '2.1.1 Keyboard Accessible',
          '2.3.3 Animation from Interactions',
        ],
        contrastRatio: '7.4:1 (AA/AAA)',
        keyboardContract:
          'Preserves logical DOM tab order across responsive Bento & Masonry reflows; respects prefers-reduced-motion media query.',
        screenReaderContract:
          'Maintains chronological reading order for audit timelines and announces expandable JSON diff payloads.',
      };
    case 'enterprise-x':
      return {
        id: spec.id,
        number: spec.number,
        name: spec.name,
        category: spec.category,
        ariaRole: 'tree / application / figure',
        ariaAttributes: ['aria-expanded', 'aria-level', 'aria-setsize', 'aria-posinset', 'aria-roledescription'],
        wcagCriteria: [
          '1.4.3 Contrast (Minimum) AA',
          '2.1.1 Keyboard Accessible',
          '2.4.7 Focus Visible',
          '4.1.2 Name, Role, Value',
        ],
        contrastRatio: '6.9:1 (AA)',
        keyboardContract:
          'ArrowRight expands tree nodes; ArrowLeft collapses; Slash (/) opens rich command block menu; Arrow keys scrub chart points.',
        screenReaderContract:
          'Reads hierarchical tree depth/position, SVG chart series data summaries, and rich text block formatting states.',
      };
    default:
      return {
        id: spec.id,
        number: spec.number,
        name: spec.name,
        category: spec.category,
        ariaRole: 'region + group',
        ariaAttributes: ['aria-label', 'aria-live="polite"', 'aria-describedby'],
        wcagCriteria: [
          '1.4.3 Contrast (Minimum) AA',
          '2.1.1 Keyboard Accessible',
          '2.4.7 Focus Visible (3px Halo)',
          '4.1.2 Name, Role, Value',
        ],
        contrastRatio: '7.0:1 (AA/AAA)',
        keyboardContract:
          'Full Tab and Arrow key navigation across composed controls with zero keyboard traps and visible 3px focus halos.',
        screenReaderContract:
          'Exposes semantic region landmarks, live interactive telemetry updates, and accessible action descriptions.',
      };
  }
}

export function evaluateAccessibilityAudit(
  specs: ComponentAccessibilitySpec[],
  overrides: Record<string, AccessibilityCheckOverride> = {}
): AccessibilityAuditSummary {
  const totalComponents = specs.length;
  if (totalComponents === 0) {
    return {
      totalComponents: 0,
      keyboardPassCount: 0,
      screenReaderPassCount: 0,
      fullyCompliantCount: 0,
      compliancePercentage: 100,
      failedComponentIds: [],
      overallStatus: 'WCAG 2.1 AA Certified',
    };
  }

  let keyboardPassCount = 0;
  let screenReaderPassCount = 0;
  let fullyCompliantCount = 0;
  const failedComponentIds: string[] = [];

  for (const item of specs) {
    const state = overrides[item.id] ?? { keyboardPass: true, screenReaderPass: true };
    if (state.keyboardPass) keyboardPassCount++;
    if (state.screenReaderPass) screenReaderPassCount++;
    if (state.keyboardPass && state.screenReaderPass) {
      fullyCompliantCount++;
    } else {
      failedComponentIds.push(item.id);
    }
  }

  const totalChecks = totalComponents * 2;
  const passedChecks = keyboardPassCount + screenReaderPassCount;
  const compliancePercentage = Number(((passedChecks / totalChecks) * 100).toFixed(1));

  return {
    totalComponents,
    keyboardPassCount,
    screenReaderPassCount,
    fullyCompliantCount,
    compliancePercentage,
    failedComponentIds,
    overallStatus:
      failedComponentIds.length === 0 ? 'WCAG 2.1 AA Certified' : 'Remediation Required',
  };
}

// ============================================================================
// THEME MODE LOCALSTORAGE PERSISTENCE ENGINE
// ============================================================================

export const JX_THEME_MODE_STORAGE_KEY = 'jxui-theme-mode';
export const JX_THEME_MODE_FALLBACK_KEYS = [
  'jxui-theme-mode',
  'jxui-theme',
  'theme',
] as const;

export function isValidThemeMode(value: unknown): value is TokenThemeMode {
  return value === 'light' || value === 'dark';
}

export interface ResolveThemeModeOptions {
  storage?: Pick<Storage, 'getItem'> | null;
  storageKey?: string;
  defaultMode?: TokenThemeMode;
  prefersDark?: boolean;
}

/**
 * Resolves the user's preferred light/dark theme mode from localStorage,
 * falling back to an explicit defaultMode or OS prefers-color-scheme.
 */
export function resolveStoredThemeMode(
  options: ResolveThemeModeOptions = {}
): TokenThemeMode {
  const {
    storage = typeof window !== 'undefined' ? window.localStorage : null,
    storageKey = JX_THEME_MODE_STORAGE_KEY,
    defaultMode,
    prefersDark,
  } = options;

  if (storage) {
    try {
      const candidateKeys = Array.from(
        new Set([storageKey, ...JX_THEME_MODE_FALLBACK_KEYS])
      );
      for (const key of candidateKeys) {
        const raw = storage.getItem(key);
        if (isValidThemeMode(raw)) {
          return raw;
        }
      }
    } catch {
      // Ignore storage access errors (e.g. private browsing / restricted iframe)
    }
  }

  if (isValidThemeMode(defaultMode)) {
    return defaultMode;
  }

  if (typeof prefersDark === 'boolean') {
    return prefersDark ? 'dark' : 'light';
  }

  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    try {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // Ignore matchMedia errors
    }
  }

  return 'light';
}

/**
 * Persists the user's chosen light/dark theme mode to localStorage so it survives page reloads.
 */
export function persistThemeMode(
  mode: TokenThemeMode,
  storage: Pick<Storage, 'setItem'> | null = typeof window !== 'undefined'
    ? window.localStorage
    : null,
  storageKey: string = JX_THEME_MODE_STORAGE_KEY
): boolean {
  if (!isValidThemeMode(mode) || !storage) {
    return false;
  }
  try {
    storage.setItem(storageKey, mode);
    if (storageKey !== JX_THEME_MODE_STORAGE_KEY) {
      storage.setItem(JX_THEME_MODE_STORAGE_KEY, mode);
    }
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// INTERACTIVE LIVE PLAYGROUND ENGINE (PROPS & CSS VARIABLES)
// ============================================================================

export type PlaygroundVariant = 'contained' | 'soft' | 'outlined' | 'glass' | 'text';
export type PlaygroundColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error';
export type PlaygroundSize = 'sm' | 'md' | 'lg';
export type PlaygroundElevation = 0 | 1 | 2 | 3;

export interface PlaygroundPropValues {
  variant: PlaygroundVariant;
  color: PlaygroundColor;
  size: PlaygroundSize;
  elevation: PlaygroundElevation;
  disabled: boolean;
  loading: boolean;
  glass: boolean;
  spring: boolean;
  halo: boolean;
  morphSuccess: boolean;
  copyable: boolean;
  customLabel: string;
}

export interface PlaygroundCssVariables {
  '--jx-pg-radius': string;
  '--jx-pg-accent': string;
  '--jx-pg-blur': string;
  '--jx-pg-scale': string;
  '--jx-pg-shadow-alpha': string;
  '--jx-pg-padding': string;
  '--jx-pg-border-alpha': string;
}

export const DEFAULT_PLAYGROUND_PROPS: PlaygroundPropValues = {
  variant: 'contained',
  color: 'primary',
  size: 'md',
  elevation: 1,
  disabled: false,
  loading: false,
  glass: false,
  spring: true,
  halo: true,
  morphSuccess: false,
  copyable: false,
  customLabel: '',
};

export const DEFAULT_PLAYGROUND_CSS_VARS: PlaygroundCssVariables = {
  '--jx-pg-radius': '14px',
  '--jx-pg-accent': '#4f46e5',
  '--jx-pg-blur': '16px',
  '--jx-pg-scale': '1',
  '--jx-pg-shadow-alpha': '0.08',
  '--jx-pg-padding': '16px',
  '--jx-pg-border-alpha': '0.14',
};

export interface PlaygroundCssVarControlSpec {
  key: keyof PlaygroundCssVariables;
  label: string;
  unit: 'px' | 'color' | 'number';
  min?: number;
  max?: number;
  step?: number;
  description: string;
}

export const PLAYGROUND_CSS_VAR_CONTROLS: PlaygroundCssVarControlSpec[] = [
  {
    key: '--jx-pg-radius',
    label: 'Surface Radius',
    unit: 'px',
    min: 0,
    max: 32,
    step: 2,
    description: 'Controls component & stage corner rounding (--jx-pg-radius)',
  },
  {
    key: '--jx-pg-accent',
    label: 'Accent Token',
    unit: 'color',
    description: 'Primary interactive accent color (--jx-pg-accent)',
  },
  {
    key: '--jx-pg-blur',
    label: 'Glass Backdrop Blur',
    unit: 'px',
    min: 0,
    max: 32,
    step: 2,
    description: 'Translucent surface blur intensity (--jx-pg-blur)',
  },
  {
    key: '--jx-pg-scale',
    label: 'Component Scale',
    unit: 'number',
    min: 0.85,
    max: 1.2,
    step: 0.05,
    description: 'Real-time spatial zoom factor (--jx-pg-scale)',
  },
  {
    key: '--jx-pg-padding',
    label: 'Stage Padding',
    unit: 'px',
    min: 8,
    max: 40,
    step: 4,
    description: 'Internal breathing room around component (--jx-pg-padding)',
  },
  {
    key: '--jx-pg-shadow-alpha',
    label: 'Ambient Shadow Alpha',
    unit: 'number',
    min: 0,
    max: 0.35,
    step: 0.02,
    description: 'Key & ambient elevation shadow opacity (--jx-pg-shadow-alpha)',
  },
  {
    key: '--jx-pg-border-alpha',
    label: 'Hairline Border Alpha',
    unit: 'number',
    min: 0,
    max: 0.5,
    step: 0.02,
    description: 'Specular hairline border intensity (--jx-pg-border-alpha)',
  },
];

/**
 * Converts a PlaygroundVariant to the primitive 'solid' | 'soft' | 'outline' | 'glass' variant
 */
export function mapPlaygroundVariantToPrimitive(
  variant: PlaygroundVariant,
  glass?: boolean
): 'solid' | 'soft' | 'outline' | 'glass' {
  if (glass || variant === 'glass') return 'glass';
  if (variant === 'soft') return 'soft';
  if (variant === 'outlined' || variant === 'text') return 'outline';
  return 'solid';
}

/**
 * Converts a PlaygroundColor to the primitive 'primary' | 'success' | 'warning' | 'danger' tone
 */
export function mapPlaygroundColorToPrimitiveTone(
  color: PlaygroundColor
): 'primary' | 'success' | 'warning' | 'danger' {
  if (color === 'success') return 'success';
  if (color === 'warning') return 'warning';
  if (color === 'error') return 'danger';
  return 'primary';
}

/**
 * Serializes current live playground prop values into a ready-to-copy JSX code snippet.
 */
export function serializePlaygroundJsx(
  componentName: string,
  props: PlaygroundPropValues,
  includeImports: boolean = true
): string {
  const cleanName =
    componentName
      .split(/[ &/]/)[0]
      .replace(/[^A-Za-z0-9_]/g, '')
      .trim() || 'JXComponent';

  const attrLines: string[] = [];

  attrLines.push(`  variant="${props.variant}"`);
  attrLines.push(`  color="${props.color}"`);
  attrLines.push(`  size="${props.size}"`);

  if (props.elevation !== 1) {
    attrLines.push(`  elevation={${props.elevation}}`);
  }
  if (props.disabled) {
    attrLines.push(`  disabled`);
  }
  if (props.loading) {
    attrLines.push(`  loading`);
  }
  if (props.glass) {
    attrLines.push(`  glass`);
  }
  if (!props.spring) {
    attrLines.push(`  spring={false}`);
  } else {
    attrLines.push(`  spring`);
  }
  if (!props.halo) {
    attrLines.push(`  halo={false}`);
  } else {
    attrLines.push(`  halo`);
  }
  if (props.morphSuccess) {
    attrLines.push(`  morphSuccess`);
  }
  if (props.copyable) {
    attrLines.push(`  copyable`);
  }

  const labelContent = props.customLabel.trim();
  const jsxBody = labelContent
    ? `<${cleanName}\n${attrLines.join('\n')}\n>\n  ${labelContent}\n</${cleanName}>`
    : `<${cleanName}\n${attrLines.join('\n')}\n/>`;

  if (!includeImports) {
    return jsxBody;
  }

  return `import { ${cleanName} } from 'jxui-react';\n\n${jsxBody}`;
}

/**
 * Serializes current playground CSS variables into a clean CSS block.
 */
export function serializePlaygroundCssVariables(
  cssVars: PlaygroundCssVariables,
  selector: string = ':root, .jx-playground-scope'
): string {
  const entries = Object.entries(cssVars)
    .map(([key, val]) => `  ${key}: ${val};`)
    .join('\n');

  return `${selector} {\n${entries}\n  --jx-radius-card: ${cssVars['--jx-pg-radius']};\n  --jx-accent-primary: ${cssVars['--jx-pg-accent']};\n  --jx-backdrop-blur: blur(${cssVars['--jx-pg-blur']});\n}`;
}

/**
 * Builds the live inline style object for the playground component wrapper so
 * both CSS variables and real-time visual properties respond immediately.
 */
export function buildPlaygroundStageStyle(
  cssVars: PlaygroundCssVariables,
  props: Partial<PlaygroundPropValues> = {}
): Record<string, string | number> {
  const shadowAlpha = Number.parseFloat(cssVars['--jx-pg-shadow-alpha']) || 0.08;
  const borderAlpha = Number.parseFloat(cssVars['--jx-pg-border-alpha']) || 0.14;
  const scaleNum = Number.parseFloat(cssVars['--jx-pg-scale']) || 1;
  const sizeMultiplier =
    props.size === 'sm' ? 0.92 : props.size === 'lg' ? 1.08 : 1;
  const effectiveScale = Number((scaleNum * sizeMultiplier).toFixed(3));
  const elevationMultiplier =
    props.elevation === 0
      ? 0
      : props.elevation === 2
      ? 1.5
      : props.elevation === 3
      ? 2.2
      : 1;
  const finalShadowAlpha = Number((shadowAlpha * elevationMultiplier).toFixed(3));

  const accentHex = cssVars['--jx-pg-accent'] || '#4f46e5';

  return {
    '--jx-pg-radius': cssVars['--jx-pg-radius'],
    '--jx-pg-accent': accentHex,
    '--jx-pg-blur': cssVars['--jx-pg-blur'],
    '--jx-pg-scale': cssVars['--jx-pg-scale'],
    '--jx-pg-shadow-alpha': cssVars['--jx-pg-shadow-alpha'],
    '--jx-pg-padding': cssVars['--jx-pg-padding'],
    '--jx-pg-border-alpha': cssVars['--jx-pg-border-alpha'],
    '--jx-radius-card': cssVars['--jx-pg-radius'],
    '--jx-radius-control': cssVars['--jx-pg-radius'],
    '--jx-accent-primary': accentHex,
    borderRadius: cssVars['--jx-pg-radius'],
    padding: cssVars['--jx-pg-padding'],
    backdropFilter:
      props.glass || props.variant === 'glass'
        ? `blur(${cssVars['--jx-pg-blur']})`
        : undefined,
    transform: `scale(${effectiveScale})`,
    boxShadow:
      finalShadowAlpha > 0
        ? `0 16px 36px -6px rgba(15, 23, 42, ${finalShadowAlpha}), 0 0 0 ${
            props.halo ? '3px' : '0px'
          } ${accentHex}26`
        : props.halo
        ? `0 0 0 3px ${accentHex}26`
        : 'none',
    borderColor: `rgba(99, 102, 241, ${borderAlpha})`,
    opacity: props.disabled ? 0.52 : 1,
    pointerEvents: props.disabled ? 'none' : 'auto',
    transition: props.spring
      ? 'all 200ms cubic-bezier(0.22, 1, 0.36, 1)'
      : 'none',
  } as Record<string, string | number>;
}

// ============================================================================
// V3 MIGRATION CHANGELOG ENGINE (COMPONENT-SPECIFIC)
// ============================================================================

export type V3ChangelogCategory =
  | 'Breaking / API'
  | 'Physics & UX'
  | 'Theme & CSS Vars'
  | 'A11y & React 19';

export interface V3ChangelogEntry {
  id: string;
  category: V3ChangelogCategory;
  title: string;
  description: string;
  beforeV2: string;
  afterV3: string;
  impact: 'major' | 'enhancement' | 'performance';
}

export interface ComponentV3Changelog {
  componentName: string;
  version: '3.0.0';
  releaseDate: string;
  summary: string;
  entries: V3ChangelogEntry[];
}

export interface V3ChangelogInput {
  name: string;
  subtitle?: string;
  categoryTitle?: string;
  muiFlaw?: string;
  jxuiUpgrade?: string;
  jsxSnippet?: string;
}

/**
 * Generates deterministic, component-specific v3.0 migration changelog entries
 * detailing key architectural, prop, physics, CSS variable, and React 19 changes
 * made in the v3 migration for that specific component.
 */
export function getComponentV3Changelog(input: V3ChangelogInput): ComponentV3Changelog {
  const cleanName =
    input.name
      .split(/[ &/]/)[0]
      .replace(/[^A-Za-z0-9_]/g, '')
      .trim() || 'JXComponent';

  const legacyName = cleanName.startsWith('JX')
    ? `MUI ${cleanName.slice(2)}`
    : `v2 ${cleanName}`;

  const categoryLabel = (input.categoryTitle || 'JXUI Core').replace(/^Category \d+:\s*/, '');

  // Extract custom props used in the component's JSX snippet if present
  const snippetProps = Array.from(
    (input.jsxSnippet || '').matchAll(/\s([a-zA-Z][a-zA-Z0-9]*)=/g)
  )
    .map((m) => m[1])
    .filter((p) => !['className', 'style', 'key', 'id'].includes(p));
  const highlightedProps =
    snippetProps.length > 0
      ? snippetProps.slice(0, 3).join(', ')
      : 'variant, spring, glass, halo';

  const specificUpgrade =
    input.jxuiUpgrade ||
    `Upgraded <${cleanName} /> with tactile spring physics, translucent glass surface tokens, and zero-CLS layout transitions.`;
  const specificFlaw =
    input.muiFlaw ||
    `Legacy ${legacyName} relied on static Material elevation shadows, runtime CSS injection, and ink-ripple DOM nodes.`;

  const entries: V3ChangelogEntry[] = [
    {
      id: `${cleanName}-v3-api`,
      category: 'Breaking / API',
      title: `v3.0 Ergonomic API & Prop Unification for <${cleanName} />`,
      description: `${specificUpgrade} Eliminates legacy flaw: ${specificFlaw}`,
      beforeV2: `<${cleanName} disableRipple sx={{ boxShadow: 2 }} />`,
      afterV3: `<${cleanName} variant="soft" spring halo (${highlightedProps}) />`,
      impact: 'major',
    },
    {
      id: `${cleanName}-v3-physics`,
      category: 'Physics & UX',
      title: `Tactile Spring Kinematics & Zero-Ripple Press Response`,
      description: `Replaced v2 Material ink ripples on <${cleanName} /> (${categoryLabel}) with 200ms spring physics (cubic-bezier(0.22, 1, 0.36, 1)), active:scale-[0.98] micro-press feedback, and zero layout shift (CLS = 0).`,
      beforeV2: `TouchRipple DOM mount + 300ms linear easing`,
      afterV3: `spring={true} + cubic-bezier(0.22, 1, 0.36, 1)`,
      impact: 'enhancement',
    },
    {
      id: `${cleanName}-v3-css-vars`,
      category: 'Theme & CSS Vars',
      title: `Zero-Runtime Scoped CSS Variables & Glassmorphism`,
      description: `Migrated <${cleanName} /> styling from runtime JS style sheets to scoped CSS custom properties (--jx-pg-radius, --jx-pg-accent, --jx-pg-blur, --jx-pg-scale) with instant localStorage dark/light theme parity.`,
      beforeV2: `Runtime Emotion CSS-in-JS recalculation`,
      afterV3: `Scoped --jx-pg-* CSS tokens + backdrop-filter: blur(16px)`,
      impact: 'performance',
    },
    {
      id: `${cleanName}-v3-a11y-react19`,
      category: 'A11y & React 19',
      title: `React 19 Ref-as-Prop & WCAG 2.1 AA Focus Halo`,
      description: `Upgraded <${cleanName} /> to native React 19 ref prop forwarding, added data-jxui-version="3.0.0" verification telemetry, 3px high-contrast focus halo (rgba(99, 102, 241, 0.18)), and full roving keyboard navigation.`,
      beforeV2: `React.forwardRef wrapper + 1px browser outline`,
      afterV3: `React 19 native ref + 3px halo + WCAG AA verified`,
      impact: 'enhancement',
    },
  ];

  return {
    componentName: cleanName,
    version: '3.0.0',
    releaseDate: 'v3.0.0 Stable Release',
    summary: `Migrated <${cleanName} /> (${input.subtitle || categoryLabel}) to the JXUI v3.0 architecture with zero-runtime CSS variables, tactile spring physics, and React 19 ergonomics.`,
    entries,
  };
}

/**
 * Formats a component's v3 changelog into clean Markdown for clipboard copying.
 */
export function formatV3ChangelogMarkdown(changelog: ComponentV3Changelog): string {
  const header = `# <${changelog.componentName} /> — JXUI v${changelog.version} Migration Changelog\n\n${changelog.summary}\n`;
  const body = changelog.entries
    .map(
      (entry) =>
        `## [${entry.category}] ${entry.title}\n- **Change**: ${entry.description}\n- **v2 Legacy**: \`${entry.beforeV2}\`\n- **v3 Upgrade**: \`${entry.afterV3}\``
    )
    .join('\n\n');
  return `${header}\n${body}\n`;
}

// ============================================================================
// COMMAND FINDER RECENTLY VIEWED COMPONENTS ENGINE (LOCALSTORAGE)
// ============================================================================

export const JX_RECENTLY_VIEWED_STORAGE_KEY = 'jxui-recently-viewed';
export const MAX_RECENTLY_VIEWED_ITEMS = 8;

/**
 * Pure helper to prepend a newly viewed component ID, deduplicate existing entries,
 * and cap the list at `maxItems` (most recent first).
 */
export function recordRecentlyViewedId(
  currentIds: string[],
  componentId: string,
  maxItems: number = MAX_RECENTLY_VIEWED_ITEMS
): string[] {
  const cleanTarget = typeof componentId === 'string' ? componentId.trim() : '';
  const sanitizedCurrent = Array.isArray(currentIds)
    ? currentIds
        .filter((id): id is string => typeof id === 'string' && id.trim().length > 0)
        .map((id) => id.trim())
    : [];

  if (!cleanTarget) {
    return Array.from(new Set(sanitizedCurrent)).slice(0, Math.max(1, maxItems));
  }

  const deduped = [
    cleanTarget,
    ...sanitizedCurrent.filter((id) => id !== cleanTarget),
  ];
  return deduped.slice(0, Math.max(1, maxItems));
}

/**
 * Loads the list of recently viewed component IDs from localStorage.
 */
export function loadRecentlyViewedIds(
  storage: Pick<Storage, 'getItem'> | null = typeof window !== 'undefined'
    ? window.localStorage
    : null,
  storageKey: string = JX_RECENTLY_VIEWED_STORAGE_KEY,
  maxItems: number = MAX_RECENTLY_VIEWED_ITEMS
): string[] {
  if (!storage) return [];
  try {
    const raw = storage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const validIds = parsed
      .filter((id): id is string => typeof id === 'string' && id.trim().length > 0)
      .map((id) => id.trim());
    return Array.from(new Set(validIds)).slice(0, Math.max(1, maxItems));
  } catch {
    return [];
  }
}

/**
 * Saves the list of recently viewed component IDs to localStorage.
 */
export function saveRecentlyViewedIds(
  ids: string[],
  storage: Pick<Storage, 'setItem'> | null = typeof window !== 'undefined'
    ? window.localStorage
    : null,
  storageKey: string = JX_RECENTLY_VIEWED_STORAGE_KEY,
  maxItems: number = MAX_RECENTLY_VIEWED_ITEMS
): string[] {
  const normalized = Array.from(
    new Set(
      (Array.isArray(ids) ? ids : [])
        .filter((id): id is string => typeof id === 'string' && id.trim().length > 0)
        .map((id) => id.trim())
    )
  ).slice(0, Math.max(1, maxItems));

  if (storage) {
    try {
      storage.setItem(storageKey, JSON.stringify(normalized));
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new CustomEvent('jxui-recently-viewed-updated'));
      }
    } catch {
      // Ignore quota / security errors in restricted storage environments
    }
  }

  return normalized;
}

/**
 * Records a single component ID as recently viewed and persists the updated list to localStorage.
 */
export function persistRecentlyViewedComponent(
  componentId: string,
  storage: Pick<Storage, 'getItem' | 'setItem'> | null = typeof window !== 'undefined'
    ? window.localStorage
    : null,
  storageKey: string = JX_RECENTLY_VIEWED_STORAGE_KEY,
  maxItems: number = MAX_RECENTLY_VIEWED_ITEMS
): string[] {
  const existing = loadRecentlyViewedIds(storage, storageKey, maxItems);
  const next = recordRecentlyViewedId(existing, componentId, maxItems);
  return saveRecentlyViewedIds(next, storage, storageKey, maxItems);
}

/**
 * Clears all recently viewed component IDs from localStorage.
 */
export function clearRecentlyViewedIds(
  storage: Pick<Storage, 'removeItem' | 'setItem'> | null = typeof window !== 'undefined'
    ? window.localStorage
    : null,
  storageKey: string = JX_RECENTLY_VIEWED_STORAGE_KEY
): string[] {
  if (storage) {
    try {
      if (typeof storage.removeItem === 'function') {
        storage.removeItem(storageKey);
      } else if (typeof storage.setItem === 'function') {
        storage.setItem(storageKey, JSON.stringify([]));
      }
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new CustomEvent('jxui-recently-viewed-updated'));
      }
    } catch {
      // Ignore storage errors
    }
  }
  return [];
}



