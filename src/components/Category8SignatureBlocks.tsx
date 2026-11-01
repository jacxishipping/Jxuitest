import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Activity,
  Rocket,
  ShieldCheck,
  Database,
  Sparkles,
  Play,
  Pause,
  Fingerprint,
  Check,
  Copy,
  GitBranch,
  Zap,
  Volume2,
  RotateCcw,
  Layers,
  Server,
  Cpu,
} from 'lucide-react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useVelocity,
  useSpring,
  useTransform,
  MotionValue,
} from 'motion/react';
import { COMPONENT_CATALOG } from '../data/catalog';
import { ComponentDocumentation } from './ComponentDocumentation';
import { useJXTheme } from '../context/JXThemeContext';
import {
  computeDockIconKinematics,
  calculateTierPricing,
  computeTrafficSplitState,
} from '../utils/jxuiLogic';
import {
  JXButton,
  JXButtonMorphState,
  JXSlider,
  JXSwitch,
  JXToggleButtonGroup,
} from './inputs';
import { JXBadge, JXChip } from './data-display';
import { JXAccordion } from './surfaces';

// ============================================================================
// JXDock Component
// Spring-physics & velocity-based icon magnification + radial haptic ripples
// ============================================================================

export interface JXDockItem {
  id: string;
  label: string;
  shortcut?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  running?: boolean;
}

export type JXDockSpringPreset = 'snappy' | 'fluid' | 'bouncy';

export interface JXDockProps {
  items?: JXDockItem[];
  activeId?: string;
  defaultActiveId?: string;
  onSelect?: (item: JXDockItem) => void;
  magnification?: number;
  distance?: number;
  velocityBoost?: boolean;
  magneticSnap?: boolean;
  magneticStrength?: number;
  hapticRipples?: boolean;
  springPreset?: JXDockSpringPreset;
  glass?: boolean;
  glassOpacity?: number;
  autoHide?: boolean;
  autoHideDelayMs?: number;
  onAutoHideChange?: (isHidden: boolean) => void;
  className?: string;
}

export const DEFAULT_DOCK_ITEMS: JXDockItem[] = [
  { id: 'terminal', label: 'Edge Console', shortcut: '⌘T', icon: Terminal, running: true },
  { id: 'metrics', label: 'Live Telemetry', shortcut: '⌘M', icon: Activity, badge: 3, running: true },
  { id: 'deploy', label: 'Canary Rollout', shortcut: '⌘D', icon: Rocket, running: true },
  { id: 'database', label: 'Schema Studio', shortcut: '⌘B', icon: Database, running: false },
  { id: 'security', label: 'Zero-Trust Vault', shortcut: '⌘S', icon: ShieldCheck, running: false },
  { id: 'tokens', label: 'Token Engine', shortcut: '⌘K', icon: Sparkles, running: true },
];

interface HapticRippleInstance {
  id: number;
  x: number;
  y: number;
}

const SPRING_CONFIGS: Record<
  JXDockSpringPreset,
  { stiffness: number; damping: number; mass: number }
> = {
  snappy: { stiffness: 460, damping: 26, mass: 0.55 },
  fluid: { stiffness: 320, damping: 28, mass: 0.75 },
  bouncy: { stiffness: 520, damping: 17, mass: 0.6 },
};

interface JXDockIconButtonProps {
  item: JXDockItem;
  isSelected: boolean;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  mouseVelocity: MotionValue<number>;
  magnification: number;
  distance: number;
  velocityBoost: boolean;
  magneticSnap: boolean;
  magneticStrength: number;
  hapticRipples: boolean;
  springPreset: JXDockSpringPreset;
  onSelect: (item: JXDockItem) => void;
}

const JXDockIconButton: React.FC<JXDockIconButtonProps> = ({
  item,
  isSelected,
  mouseX,
  mouseY,
  mouseVelocity,
  magnification,
  distance,
  velocityBoost,
  magneticSnap,
  magneticStrength,
  hapticRipples,
  springPreset,
  onSelect,
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [ripples, setRipples] = useState<HapticRippleInstance[]>([]);

  const springCfg = SPRING_CONFIGS[springPreset];

  // Continuous horizontal & vertical distance from pointer (X, Y) to button center
  const distanceFromMouseX = useTransform(mouseX, (val) => {
    const bounds = buttonRef.current?.getBoundingClientRect();
    if (!bounds || val === Infinity) return Infinity;
    return val - (bounds.x + bounds.width / 2);
  });

  const distanceFromMouseY = useTransform(mouseY, (val) => {
    const bounds = buttonRef.current?.getBoundingClientRect();
    if (!bounds || val === Infinity) return 0;
    return val - (bounds.y + bounds.height / 2);
  });

  // Cosine-bell proximity curve + velocity-modulated magnification boost
  const targetScale = useTransform(
    [distanceFromMouseX, distanceFromMouseY, mouseVelocity],
    ([distX, distY, velVal]) =>
      computeDockIconKinematics(
        Number(distX),
        distance,
        magnification,
        Number(velVal) || 0,
        velocityBoost,
        Number(distY) || 0,
        magneticSnap,
        magneticStrength
      ).scale
  );

  // Magnetic-snap horizontal gravitational pull toward cursor X
  const targetPullX = useTransform(
    [distanceFromMouseX, distanceFromMouseY, mouseVelocity],
    ([distX, distY, velVal]) =>
      computeDockIconKinematics(
        Number(distX),
        distance,
        magnification,
        Number(velVal) || 0,
        velocityBoost,
        Number(distY) || 0,
        magneticSnap,
        magneticStrength
      ).pullX
  );

  // Vertical lift coupled to proximity, velocity, and magnetic-snap vertical pull
  const targetY = useTransform(
    [distanceFromMouseX, distanceFromMouseY, mouseVelocity],
    ([distX, distY, velVal]) =>
      computeDockIconKinematics(
        Number(distX),
        distance,
        magnification,
        Number(velVal) || 0,
        velocityBoost,
        Number(distY) || 0,
        magneticSnap,
        magneticStrength
      ).y
  );

  // Secondary parallax magnetic-snap offset for inner icon glyph
  const targetIconX = useTransform(
    [distanceFromMouseX, distanceFromMouseY, mouseVelocity],
    ([distX, distY, velVal]) =>
      computeDockIconKinematics(
        Number(distX),
        distance,
        magnification,
        Number(velVal) || 0,
        velocityBoost,
        Number(distY) || 0,
        magneticSnap,
        magneticStrength
      ).iconX
  );

  const targetIconY = useTransform(
    [distanceFromMouseX, distanceFromMouseY, mouseVelocity],
    ([distX, distY, velVal]) =>
      computeDockIconKinematics(
        Number(distX),
        distance,
        magnification,
        Number(velVal) || 0,
        velocityBoost,
        Number(distY) || 0,
        magneticSnap,
        magneticStrength
      ).iconY
  );

  // Subtle kinetic tilt (rotateZ) responding to sweep velocity across the icon
  const targetRotateZ = useTransform(
    [distanceFromMouseX, distanceFromMouseY, mouseVelocity],
    ([distX, distY, velVal]) =>
      computeDockIconKinematics(
        Number(distX),
        distance,
        magnification,
        Number(velVal) || 0,
        velocityBoost,
        Number(distY) || 0,
        magneticSnap,
        magneticStrength
      ).rotateZ
  );

  const scale = useSpring(targetScale, springCfg);
  const x = useSpring(targetPullX, springCfg);
  const y = useSpring(targetY, springCfg);
  const iconX = useSpring(targetIconX, springCfg);
  const iconY = useSpring(targetIconY, springCfg);
  const rotateZ = useSpring(targetRotateZ, {
    stiffness: 380,
    damping: 22,
    mass: 0.5,
  });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (hapticRipples && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const clickX = e.clientX ? e.clientX - rect.left : rect.width / 2;
      const clickY = e.clientY ? e.clientY - rect.top : rect.height / 2;
      const newRipple: HapticRippleInstance = {
        id: Date.now() + Math.random(),
        x: clickX,
        y: clickY,
      };
      setRipples((prev) => [...prev.slice(-3), newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 620);
    }
    onSelect(item);
  };

  const Icon = item.icon;

  return (
    <div className="relative flex flex-col items-center">
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 460, damping: 26 }}
            role="tooltip"
            className="absolute -top-11 z-20 whitespace-nowrap rounded-lg bg-slate-900 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-semibold text-white shadow-md flex items-center gap-1.5 pointer-events-none"
          >
            <span>{item.label}</span>
            {item.shortcut && (
              <kbd className="text-[9px] font-mono text-indigo-300">{item.shortcut}</kbd>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Outer Haptic Shockwave Halo Ring on Click */}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={`halo-${r.id}`}
            aria-hidden="true"
            initial={{ scale: 0.85, opacity: 0.75 }}
            animate={{ scale: 1.75, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background:
                'radial-gradient(circle, rgba(99,102,241,0.42) 0%, rgba(129,140,248,0.18) 55%, rgba(99,102,241,0) 75%)',
            }}
            className="pointer-events-none absolute inset-0 rounded-xl z-0"
          />
        ))}
      </AnimatePresence>

      <motion.button
        ref={buttonRef}
        type="button"
        aria-label={item.label}
        aria-pressed={isSelected}
        data-magnetic-snap={magneticSnap ? 'true' : 'false'}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        onClick={handleClick}
        style={{ x, y, scale, rotateZ }}
        whileTap={{ scale: 0.92 }}
        className={`relative z-10 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border transition-colors cursor-pointer origin-bottom overflow-visible ${
          isSelected
            ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
            : hovered && magneticSnap
            ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 border-indigo-400/80 ring-3 ring-indigo-500/15 shadow-sm'
            : 'bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700 hover:border-indigo-400'
        }`}
      >
        {/* Inner Clipped Surface for Radial Gradient Haptic Ripple Expansion */}
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
          <AnimatePresence>
            {ripples.map((ripple) => (
              <motion.span
                key={ripple.id}
                data-testid="jx-dock-haptic-ripple"
                initial={{ scale: 0.12, opacity: 0.95 }}
                animate={{ scale: 2.9, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  left: ripple.x - 22,
                  top: ripple.y - 22,
                  width: 44,
                  height: 44,
                  background: isSelected
                    ? 'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(199,210,254,0.45) 45%, rgba(255,255,255,0) 75%)'
                    : 'radial-gradient(circle, rgba(99,102,241,0.65) 0%, rgba(129,140,248,0.35) 45%, rgba(99,102,241,0) 75%)',
                }}
                className="pointer-events-none absolute rounded-full"
              />
            ))}
          </AnimatePresence>
        </span>

        {/* Secondary Parallax Magnetic-Snap Icon Glyph */}
        <motion.span
          style={{ x: iconX, y: iconY }}
          className="relative z-10 flex items-center justify-center pointer-events-none"
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </motion.span>

        {item.badge !== undefined && (
          <span className="absolute -top-1.5 -right-1.5 z-20 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white shadow-xs">
            {item.badge}
          </span>
        )}
      </motion.button>

      {/* Running / Active Process Indicator Pill */}
      <span
        className={`mt-1.5 h-1 rounded-full transition-all duration-200 ${
          isSelected
            ? 'w-3.5 bg-indigo-600 dark:bg-indigo-400'
            : item.running
            ? 'w-1 bg-slate-400 dark:bg-slate-500'
            : 'w-1 bg-transparent'
        }`}
      />
    </div>
  );
};

export const JXDock: React.FC<JXDockProps> = ({
  items = DEFAULT_DOCK_ITEMS,
  activeId: controlledActiveId,
  defaultActiveId = 'terminal',
  onSelect,
  magnification = 1.48,
  distance = 136,
  velocityBoost = true,
  magneticSnap = true,
  magneticStrength = 0.34,
  hapticRipples = true,
  springPreset = 'snappy',
  glass = true,
  glassOpacity = 0.85,
  autoHide = true,
  autoHideDelayMs = 2000,
  onAutoHideChange,
  className = '',
}) => {
  const { mode: theme, getRadiusClass } = useJXTheme();
  const [internalActiveId, setInternalActiveId] = useState<string>(defaultActiveId);
  const [isAutoHidden, setIsAutoHidden] = useState<boolean>(false);
  const autoHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mouseX = useMotionValue(Infinity);
  const mouseY = useMotionValue(Infinity);
  const mouseVelocity = useVelocity(mouseX);

  const currentActiveId =
    controlledActiveId !== undefined ? controlledActiveId : internalActiveId;

  const clearAutoHideTimer = () => {
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (!autoHide && isAutoHidden) {
      setIsAutoHidden(false);
      onAutoHideChange?.(false);
    }
    if (!autoHide) {
      clearAutoHideTimer();
    }
    return () => clearAutoHideTimer();
  }, [autoHide, isAutoHidden, onAutoHideChange]);

  const handleSelect = (item: JXDockItem) => {
    if (controlledActiveId === undefined) {
      setInternalActiveId(item.id);
    }
    onSelect?.(item);
  };

  const handleDockMouseEnter = () => {
    clearAutoHideTimer();
    if (isAutoHidden) {
      setIsAutoHidden(false);
      onAutoHideChange?.(false);
    }
  };

  const handleDockMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    clearAutoHideTimer();
    if (isAutoHidden) {
      setIsAutoHidden(false);
      onAutoHideChange?.(false);
    }
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const handleDockMouseLeave = () => {
    mouseX.set(Infinity);
    mouseY.set(Infinity);
    clearAutoHideTimer();
    if (autoHide) {
      autoHideTimerRef.current = setTimeout(() => {
        setIsAutoHidden(true);
        onAutoHideChange?.(true);
      }, autoHideDelayMs);
    }
  };

  const clampedOpacity = Math.max(0.25, Math.min(1, glassOpacity));
  const dockSurfaceStyle: React.CSSProperties | undefined = glass
    ? {
        backgroundColor:
          theme === 'dark'
            ? `rgba(15, 23, 42, ${clampedOpacity})`
            : `rgba(255, 255, 255, ${clampedOpacity})`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }
    : undefined;

  return (
    <div
      data-testid="jx-dock-sensor-zone"
      onMouseEnter={handleDockMouseEnter}
      onMouseMove={handleDockMouseMove}
      onMouseLeave={handleDockMouseLeave}
      className="relative inline-flex flex-col items-center max-w-full overflow-hidden pt-4 pb-2 px-1 sm:px-3"
    >
      <motion.div
        role="toolbar"
        aria-label="JXDock Floating Launcher"
        data-auto-hidden={isAutoHidden ? 'true' : 'false'}
        data-glass-opacity={clampedOpacity.toFixed(2)}
        animate={{
          y: isAutoHidden ? 46 : 0,
          opacity: isAutoHidden ? 0.14 : 1,
          scale: isAutoHidden ? 0.92 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 320,
          damping: 28,
          mass: 0.68,
        }}
        style={dockSurfaceStyle}
        className={`inline-flex items-end gap-1.5 sm:gap-3 px-2.5 sm:px-4 py-2 sm:py-2.5 max-w-full border jx-elevation-3 ${getRadiusClass(
          'card'
        )} ${
          glass
            ? 'border-slate-200/90 dark:border-slate-700/80'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
        } ${className}`}
      >
        {items.map((item) => (
          <JXDockIconButton
            key={item.id}
            item={item}
            isSelected={currentActiveId === item.id}
            mouseX={mouseX}
            mouseY={mouseY}
            mouseVelocity={mouseVelocity}
            magnification={magnification}
            distance={distance}
            velocityBoost={velocityBoost}
            magneticSnap={magneticSnap}
            magneticStrength={magneticStrength}
            hapticRipples={hapticRipples}
            springPreset={springPreset}
            onSelect={handleSelect}
          />
        ))}
      </motion.div>

      {/* Auto-Hide Wake Sensor Bar when Dock has slid out after 2s idle */}
      <AnimatePresence>
        {isAutoHidden && (
          <motion.button
            type="button"
            data-testid="jx-dock-wake-pill"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.22 }}
            onClick={() => {
              clearAutoHideTimer();
              setIsAutoHidden(false);
              onAutoHideChange?.(false);
            }}
            className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-indigo-600/90 text-white px-3 py-0.5 text-[10px] font-mono font-semibold shadow-sm cursor-pointer"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-ping" />
            <span>Dock Auto-Hidden (2s idle) · Hover to wake</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export const JXSpotlightDock = JXDock;

// ============================================================================
// JXPricingMatrix Component (#57)
// Tiered cards with glassmorphic hover states, active-state scale-in animations
// for recommended plans, and smooth price-toggling transitions.
// ============================================================================

export interface JXPricingTier {
  id: string;
  name: string;
  badge?: string;
  description: string;
  baseMonthlyPerSeat: number;
  recommended?: boolean;
  ctaLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
}

export const DEFAULT_PRICING_TIERS: JXPricingTier[] = [
  {
    id: 'starter',
    name: 'Starter Edge',
    badge: 'Core Primitives',
    description: 'Essential tactile inputs, surfaces, and WCAG AA tokens for agile product teams.',
    baseMonthlyPerSeat: 12,
    recommended: false,
    ctaLabel: 'Provision Starter',
    icon: Layers,
    features: [
      '40+ Core @jxui/react primitives',
      'Zero-notch inputs & focus halos',
      'Light & Dark CSS token variables',
      'Community GitHub discussions',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Scale',
    badge: 'Recommended · Most Popular',
    description: 'Full 61-component suite with spring physics, 3D toast queues, and Figma token sync.',
    baseMonthlyPerSeat: 20,
    recommended: true,
    ctaLabel: 'Provision Pro Scale',
    icon: Sparkles,
    features: [
      'All 61 Core, Lab & Enterprise X blocks',
      'Framer Motion spring physics engine',
      'Sonner-style 3D toast queue manager',
      'Automated Figma Variables sync',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise Metal',
    badge: 'Dedicated SLA',
    description: 'Custom design system governance, private npm registry mirror, and zero-trust audit logs.',
    baseMonthlyPerSeat: 38,
    recommended: false,
    ctaLabel: 'Provision Enterprise',
    icon: Server,
    features: [
      'Unlimited org repos & private registry',
      'Custom brand theme compiler CLI',
      'WebAuthn hardware key guard rails',
      'Dedicated Slack architecture channel',
    ],
  },
];

export interface JXPricingMatrixProps {
  tiers?: JXPricingTier[];
  billingCycle?: 'monthly' | 'annual';
  onBillingCycleChange?: (cycle: 'monthly' | 'annual') => void;
  annualDiscount?: number;
  seats?: number;
  onSeatsChange?: (seats: number) => void;
  selectedTierId?: string;
  onSelectTier?: (tierId: string) => void;
  glassHover?: boolean;
  onCheckout?: (
    tier: JXPricingTier,
    monthlyTotal: number,
    billingCycle: 'monthly' | 'annual',
    seats: number
  ) => void;
}

export const JXPricingMatrix: React.FC<JXPricingMatrixProps> = ({
  tiers = DEFAULT_PRICING_TIERS,
  billingCycle = 'annual',
  onBillingCycleChange,
  annualDiscount = 0.2,
  seats = 25,
  onSeatsChange,
  selectedTierId: controlledSelectedId,
  onSelectTier,
  glassHover = true,
  onCheckout,
}) => {
  const [internalSelectedId, setInternalSelectedId] = useState<string>('pro');
  const [hoveredTierId, setHoveredTierId] = useState<string | null>(null);
  const [morphStates, setMorphStates] = useState<Record<string, JXButtonMorphState>>({});

  const activeTierId =
    controlledSelectedId !== undefined ? controlledSelectedId : internalSelectedId;

  const handleSelectTier = (tierId: string) => {
    if (controlledSelectedId === undefined) {
      setInternalSelectedId(tierId);
    }
    onSelectTier?.(tierId);
  };

  const handleProvisionTier = (tier: JXPricingTier, monthlyTotal: number) => {
    handleSelectTier(tier.id);
    setMorphStates((prev) => ({ ...prev, [tier.id]: 'loading' }));
    setTimeout(() => {
      setMorphStates((prev) => ({ ...prev, [tier.id]: 'success' }));
      onCheckout?.(tier, monthlyTotal, billingCycle, seats);
      setTimeout(() => {
        setMorphStates((prev) => ({ ...prev, [tier.id]: 'idle' }));
      }, 1800);
    }, 550);
  };

  const sampleProCalc = calculateTierPricing(20, billingCycle, seats, annualDiscount);

  return (
    <div data-testid="jx-pricing-matrix" className="space-y-6">
      {/* Top Interactive Sizer & Billing Switcher Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center rounded-2xl bg-slate-50/90 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 p-4">
        <div className="lg:col-span-7 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Interactive Team Seat Scrubber
            </span>
            <div className="flex items-center gap-1.5">
              {sampleProCalc.volumeTierLabel && (
                <JXChip
                  label={sampleProCalc.volumeTierLabel}
                  tone="emerald"
                />
              )}
              <span className="text-[11px] font-mono text-slate-500">
                {(seats * 2500).toLocaleString()} CI/CD edge mins included
              </span>
            </div>
          </div>
          <JXSlider
            label="Active Engineering Seats"
            value={seats}
            onChange={(val) => onSeatsChange?.(val)}
            min={5}
            max={150}
            step={5}
            unit=" seats"
          />
        </div>

        <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-2.5 lg:border-l border-slate-200/70 dark:border-slate-700/70 lg:pl-5">
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Billing Cadence & Instant Discount
          </div>
          <JXToggleButtonGroup
            value={billingCycle}
            onChange={(val) => onBillingCycleChange?.(val as 'monthly' | 'annual')}
            options={[
              { value: 'monthly', label: 'Monthly Billing' },
              { value: 'annual', label: `Annual (-${Math.round(annualDiscount * 100)}% Off)` },
            ]}
          />
          <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
            {billingCycle === 'annual'
              ? `Annual lock-in active · Save $${sampleProCalc.annualSavings.toLocaleString()}/yr on Pro Scale`
              : 'Switch to Annual billing for 20% instant discount'}
          </div>
        </div>
      </div>

      {/* 3-Tier Pricing Cards with Glassmorphic Hover & Active Recommended Scale-In */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch pt-1">
        {tiers.map((tier) => {
          const calc = calculateTierPricing(
            tier.baseMonthlyPerSeat,
            billingCycle,
            seats,
            annualDiscount
          );
          const isRecommended = Boolean(tier.recommended);
          const isSelected = activeTierId === tier.id;
          const isHovered = hoveredTierId === tier.id;
          const TierIcon = tier.icon;

          // Active-state scale-in target for recommended or selected plan
          const activeScale = isRecommended
            ? isHovered
              ? 1.045
              : 1.028
            : isSelected
            ? 1.018
            : isHovered
            ? 1.012
            : 1;

          return (
            <motion.div
              key={tier.id}
              data-testid={`pricing-tier-card-${tier.id}`}
              data-recommended={isRecommended ? 'true' : 'false'}
              data-selected={isSelected ? 'true' : 'false'}
              data-glass-hover={glassHover && isHovered ? 'true' : 'false'}
              initial={{ opacity: 0, scale: isRecommended ? 0.94 : 0.97, y: 12 }}
              animate={{
                opacity: 1,
                scale: activeScale,
                y: isHovered ? -4 : isRecommended ? -2 : 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 380,
                damping: 26,
                mass: 0.65,
              }}
              onMouseEnter={() => setHoveredTierId(tier.id)}
              onMouseLeave={() => setHoveredTierId(null)}
              onClick={() => handleSelectTier(tier.id)}
              className={`relative flex flex-col justify-between rounded-2xl p-5 transition-colors cursor-pointer overflow-hidden border ${
                isRecommended
                  ? 'border-indigo-500/90 dark:border-indigo-400/90 ring-3 ring-indigo-500/15 jx-elevation-3'
                  : isSelected
                  ? 'border-indigo-400/80 dark:border-indigo-500/70 ring-2 ring-indigo-500/10 jx-elevation-2'
                  : 'border-slate-200/85 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 jx-elevation-1'
              } ${
                glassHover && (isHovered || isRecommended)
                  ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl'
                  : 'bg-white dark:bg-slate-900/95'
              }`}
            >
              {/* Glassmorphic Radial Sheen on Hover or Recommended Active State */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
                  glassHover && (isHovered || isRecommended) ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  background: isRecommended
                    ? 'radial-gradient(circle at 85% 12%, rgba(99, 102, 241, 0.16), rgba(168, 85, 247, 0.06) 45%, transparent 75%)'
                    : 'radial-gradient(circle at 80% 15%, rgba(99, 102, 241, 0.11), transparent 68%)',
                }}
              />

              <div className="relative z-10 space-y-4">
                {/* Top Header & Scale-In Recommended Pill */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                        isRecommended
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-slate-200/80 dark:border-slate-700'
                      }`}
                    >
                      <TierIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{tier.name}</span>
                      </h4>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        {seats} active seats
                      </span>
                    </div>
                  </div>

                  {isRecommended ? (
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: isSelected || isHovered ? 1.06 : 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 440, damping: 22 }}
                      data-testid="recommended-plan-badge"
                      className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-xs"
                    >
                      <Sparkles className="h-2.5 w-2.5" />
                      <span>Recommended</span>
                    </motion.span>
                  ) : (
                    tier.badge && (
                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-600 dark:text-slate-300">
                        {tier.badge}
                      </span>
                    )
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {tier.description}
                </p>

                {/* Smooth Animated Price-Toggling Display */}
                <div className="rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 p-3.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-1.5">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={`${tier.id}-${billingCycle}-${seats}-${calc.monthlyTotal}`}
                          data-testid={`tier-price-total-${tier.id}`}
                          initial={{ opacity: 0, y: 10, scale: 0.94 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.94 }}
                          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                          className="inline-block text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums"
                        >
                          ${calc.monthlyTotal.toLocaleString()}
                        </motion.span>
                      </AnimatePresence>
                      <span className="text-xs text-slate-400 font-mono">/mo</span>
                    </div>

                    {calc.monthlyTotal < calc.originalMonthlyTotal && (
                      <span className="text-[11px] font-mono line-through text-slate-400">
                        ${calc.originalMonthlyTotal.toLocaleString()}/mo
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-500 dark:text-slate-400">
                      ${calc.effectivePerSeat}/seat · billed {billingCycle}
                    </span>
                    {calc.annualSavings > 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        Save ${calc.annualSavings.toLocaleString()}/yr
                      </span>
                    ) : (
                      <span className="text-slate-400">Standard rate</span>
                    )}
                  </div>
                </div>

                {/* Feature Checklist */}
                <ul className="space-y-2 pt-1 text-xs text-slate-600 dark:text-slate-300">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                          isRecommended
                            ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400'
                            : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        <Check className="h-2.5 w-2.5" />
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Footer */}
              <div
                className="relative z-10 mt-5 pt-3.5 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-[10px] font-mono text-slate-400">
                  {isSelected ? 'Selected Plan' : 'Instant key'}
                </span>
                <JXButton
                  size="sm"
                  variant={isRecommended || isSelected ? 'contained' : 'soft'}
                  color="primary"
                  morphState={morphStates[tier.id] || 'idle'}
                  onClick={() => handleProvisionTier(tier, calc.monthlyTotal)}
                >
                  {tier.ctaLabel}
                </JXButton>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export const JXPricingBentoMatrix = JXPricingMatrix;

// ============================================================================
// JXTrafficSplitter Component (#58)
// Visual UI for canary deployments using a slider-driven bar that dynamically
// color-codes segments to represent traffic percentages.
// ============================================================================

export interface JXTrafficSplitterProps {
  stableVersion?: string;
  canaryVersion?: string;
  canaryWeight?: number;
  defaultCanaryWeight?: number;
  onWeightChange?: (weight: number) => void;
  autoRollbackOnError?: boolean;
  onAutoRollbackChange?: (enabled: boolean) => void;
  onPromote?: () => void;
  onRollback?: () => void;
}

export const JXTrafficSplitter: React.FC<JXTrafficSplitterProps> = ({
  stableVersion = 'v2.4.0',
  canaryVersion = 'v3.0.0',
  canaryWeight: controlledWeight,
  defaultCanaryWeight = 30,
  onWeightChange,
  autoRollbackOnError = true,
  onAutoRollbackChange,
  onPromote,
  onRollback,
}) => {
  const [internalWeight, setInternalWeight] = useState<number>(defaultCanaryWeight);
  const [promoteMorph, setPromoteMorph] = useState<JXButtonMorphState>('idle');

  const weight = controlledWeight !== undefined ? controlledWeight : internalWeight;
  const splitState = computeTrafficSplitState(weight);

  const updateWeight = (next: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(next)));
    if (controlledWeight === undefined) {
      setInternalWeight(clamped);
    }
    onWeightChange?.(clamped);
  };

  const handlePromoteClick = () => {
    setPromoteMorph('loading');
    setTimeout(() => {
      updateWeight(100);
      setPromoteMorph('success');
      onPromote?.();
      setTimeout(() => setPromoteMorph('idle'), 2000);
    }, 550);
  };

  const handleRollbackClick = () => {
    updateWeight(0);
    onRollback?.();
  };

  return (
    <div data-testid="jx-traffic-splitter" className="space-y-4">
      {/* Header Row with Dynamic Phase Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            Canary Traffic Splitter
          </span>
          <span
            data-testid="canary-phase-badge"
            className={`rounded-full border px-2 py-0.5 text-[10px] font-mono font-semibold transition-colors ${splitState.canaryBadgeClass}`}
          >
            {splitState.phase}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <JXChip
            label={`Stable ${stableVersion}: ${splitState.stablePercent}%`}
            tone="neutral"
          />
          <JXChip
            label={`Canary ${canaryVersion}: ${splitState.canaryPercent}%`}
            tone={
              splitState.canaryColorToken === 'emerald'
                ? 'emerald'
                : splitState.canaryColorToken === 'amber'
                ? 'amber'
                : 'indigo'
            }
          />
        </div>
      </div>

      {/* Dynamic Color-Coded Multi-Segment Split Bar */}
      <div className="space-y-2">
        <div
          data-testid="jx-traffic-splitter-bar"
          data-canary-weight={splitState.canaryPercent}
          data-canary-color={splitState.canaryColorToken}
          data-rollout-phase={splitState.phase}
          className="relative h-8 w-full rounded-xl bg-slate-100 dark:bg-slate-800/90 overflow-hidden flex p-1 gap-1 border border-slate-200/80 dark:border-slate-700 shadow-inner"
        >
          {/* Stable Segment */}
          {splitState.stablePercent > 0 && (
            <motion.div
              layout
              data-testid="traffic-segment-stable"
              initial={false}
              animate={{ width: `${splitState.stablePercent}%` }}
              transition={{ type: 'spring', stiffness: 360, damping: 30 }}
              className={`h-full rounded-lg flex items-center justify-between px-2.5 text-[10px] font-mono font-bold text-white overflow-hidden whitespace-nowrap ${splitState.stableBarClass}`}
            >
              {splitState.stablePercent >= 18 && (
                <span>Stable · {splitState.stablePercent}%</span>
              )}
              {splitState.stablePercent >= 35 && (
                <span className="opacity-75">{stableVersion}</span>
              )}
            </motion.div>
          )}

          {/* Canary Dynamically Color-Coded Segment */}
          {splitState.canaryPercent > 0 && (
            <motion.div
              layout
              data-testid="traffic-segment-canary"
              data-segment-color={splitState.canaryColorToken}
              initial={false}
              animate={{ width: `${splitState.canaryPercent}%` }}
              transition={{ type: 'spring', stiffness: 360, damping: 30 }}
              className={`h-full rounded-lg flex items-center justify-between px-2.5 text-[10px] font-mono font-bold text-white overflow-hidden whitespace-nowrap shadow-xs ${splitState.canaryBarGradient}`}
            >
              {splitState.canaryPercent >= 15 && (
                <span>Canary · {splitState.canaryPercent}%</span>
              )}
              {splitState.canaryPercent >= 35 && (
                <span className="opacity-90">{canaryVersion}</span>
              )}
            </motion.div>
          )}
        </div>

        {/* Quick Rollout Percentage Presets */}
        <div className="flex flex-wrap items-center justify-between gap-1.5">
          <span className="text-[10px] font-mono text-slate-400">
            Color-Coded Stage Presets:
          </span>
          <div className="flex items-center gap-1">
            {[
              { label: '0% Base', val: 0 },
              { label: '15% Probe', val: 15 },
              { label: '30% Canary', val: 30 },
              { label: '50% Split', val: 50 },
              { label: '85% Ramp', val: 85 },
              { label: '100% Prod', val: 100 },
            ].map((preset) => (
              <button
                key={preset.val}
                type="button"
                data-testid={`canary-preset-${preset.val}`}
                onClick={() => updateWeight(preset.val)}
                className={`rounded-md px-2 py-0.5 text-[10px] font-mono cursor-pointer border transition-colors ${
                  splitState.canaryPercent === preset.val
                    ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:border-indigo-400'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Slider Control */}
        <JXSlider
          label="Canary Traffic Allocation"
          value={splitState.canaryPercent}
          onChange={updateWeight}
          min={0}
          max={100}
          step={5}
          unit="%"
        />
      </div>

      {/* Live Telemetry Metrics */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 p-2.5">
          <div className="text-[10px] text-slate-500 flex items-center gap-1">
            <Cpu className="h-3 w-3 text-slate-400" />
            <span>Stable RPS</span>
          </div>
          <div className="font-mono font-bold text-slate-700 dark:text-slate-200 mt-0.5">
            {splitState.stableRps.toFixed(1)}k/s
          </div>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 p-2.5">
          <div className="text-[10px] text-slate-500 flex items-center gap-1">
            <Activity className="h-3 w-3 text-indigo-500" />
            <span>Canary RPS</span>
          </div>
          <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
            {splitState.canaryRps.toFixed(1)}k/s
          </div>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 p-2.5">
          <div className="text-[10px] text-slate-500">p99 Edge Latency</div>
          <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {splitState.p99LatencyMs.toFixed(2)} ms
          </div>
        </div>
      </div>

      {/* Rollback Guard & Promote Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <JXSwitch
          checked={autoRollbackOnError}
          onChange={(enabled) => onAutoRollbackChange?.(enabled)}
          label="Auto-Rollback on 5xx Spike"
        />
        <div className="flex items-center gap-2">
          <JXButton
            size="sm"
            variant="outlined"
            color="neutral"
            onClick={handleRollbackClick}
            startIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Rollback 0%
          </JXButton>
          <JXButton
            size="sm"
            morphState={promoteMorph}
            onClick={handlePromoteClick}
            startIcon={<Zap className="w-3.5 h-3.5" />}
          >
            Promote 100%
          </JXButton>
        </div>
      </div>
    </div>
  );
};

export const JXCommandDeployPipeline = JXTrafficSplitter;

// ============================================================================
// Waveform & Color Studio Constants
// ============================================================================

const WAVEFORM_BARS = [
  24, 38, 52, 68, 45, 82, 94, 62, 48, 75, 88, 54, 36, 64, 92, 78,
  50, 42, 70, 86, 96, 72, 58, 44, 66, 84, 90, 60, 40, 55, 76, 88,
  64, 48, 72, 95, 80, 56, 38, 62, 85, 74, 52, 46, 68, 54, 36, 28,
];

const TONAL_STOPS = [
  { stop: 50, l: 96 },
  { stop: 100, l: 91 },
  { stop: 200, l: 82 },
  { stop: 300, l: 71 },
  { stop: 400, l: 60 },
  { stop: 500, l: 50 },
  { stop: 600, l: 42 },
  { stop: 700, l: 33 },
  { stop: 900, l: 19 },
];

// ============================================================================
// Category 8 Workbench View
// ============================================================================

export const Category8SignatureBlocks: React.FC = () => {
  const { pushToast } = useJXTheme();
  const getSpec = (num: number) => COMPONENT_CATALOG.find((s) => s.number === num)!;

  // #56 JXDock interactive workbench & JSX Code Config state
  const [activeDockApp, setActiveDockApp] = useState<string>('terminal');
  const [dockMagScale, setDockMagScale] = useState<number>(1.48);
  const [dockSpringPreset, setDockSpringPreset] = useState<JXDockSpringPreset>('snappy');
  const [dockVelocityBoost] = useState<boolean>(true);
  const [dockMagneticSnap, setDockMagneticSnap] = useState<boolean>(true);
  const [dockMagneticStrength, setDockMagneticStrength] = useState<number>(0.34);
  const [dockGlassOpacity, setDockGlassOpacity] = useState<number>(0.85);
  const [dockAutoHide, setDockAutoHide] = useState<boolean>(true);
  const [dockIsAutoHidden, setDockIsAutoHidden] = useState<boolean>(false);
  const [lastHapticPulse, setLastHapticPulse] = useState<string>('Edge Console (⌘T)');

  // #57 JXPricingMatrix state
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [seats, setSeats] = useState<number>(25);
  const [selectedTierId, setSelectedTierId] = useState<string>('pro');
  const [glassHoverEnabled, setGlassHoverEnabled] = useState<boolean>(true);

  // #58 JXTrafficSplitter state
  const [canaryWeight, setCanaryWeight] = useState<number>(30);
  const [autoRollback, setAutoRollback] = useState<boolean>(true);

  // #59 JXAudioWaveformScrubber state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playheadIndex, setPlayheadIndex] = useState<number>(18);
  const [hoverBarIndex, setHoverBarIndex] = useState<number | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPlayheadIndex((prev) => (prev + 1) % WAVEFORM_BARS.length);
    }, Math.round(260 / playbackSpeed));
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  // #60 JXInteractiveColorStudio state
  const [studioHue, setStudioHue] = useState<number>(242);
  const [studioSat, setStudioSat] = useState<number>(84);
  const [copiedStop, setCopiedStop] = useState<number | null>(null);

  // #61 JXSecurityVaultCard state
  const [strictWebAuthn, setStrictWebAuthn] = useState<boolean>(true);
  const [passkeyStatus, setPasskeyStatus] = useState<'idle' | 'scanning' | 'verified'>('idle');

  const handleTriggerPasskey = () => {
    if (passkeyStatus === 'scanning') return;
    setPasskeyStatus('scanning');
    setTimeout(() => {
      setPasskeyStatus('verified');
      pushToast({
        title: 'Hardware Passkey Verified',
        description: 'FIDO2 cryptographic attestation signed by YubiKey 5C Nano',
        variant: 'success',
      });
    }, 850);
  };

  const formatAudioTime = (barIdx: number) => {
    const totalSec = Math.round((barIdx / (WAVEFORM_BARS.length - 1)) * 184);
    const mins = Math.floor(totalSec / 60);
    const secs = String(totalSec % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="space-y-8">
      {/* #56 JXDock & #58 JXTrafficSplitter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComponentDocumentation
          spec={getSpec(56)}
          customJsx={`<JXDock
  magnification={${dockMagScale.toFixed(2)}}
  distance={136}
  springPreset="${dockSpringPreset}"
  magneticSnap={${dockMagneticSnap}}
  magneticStrength={${dockMagneticStrength.toFixed(2)}}
  glassOpacity={${dockGlassOpacity.toFixed(2)}}
  autoHide={${dockAutoHide}}
  autoHideDelayMs={2000}
  velocityBoost={${dockVelocityBoost}}
  hapticRipples
  glass
  activeId="${activeDockApp}"
  items={dockItems}
  onSelect={(item) => setActiveDockApp(item.id)}
/>`}
          codeConfigPanel={
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Control 1: Magnetic-Snap Strength */}
              <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-200">Magnetic-Snap Strength</span>
                  <button
                    type="button"
                    data-testid="config-magnetic-snap-toggle"
                    onClick={() => setDockMagneticSnap((v) => !v)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                      dockMagneticSnap
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {dockMagneticSnap ? `${dockMagneticStrength.toFixed(2)}g` : 'OFF'}
                  </button>
                </div>
                <input
                  type="range"
                  aria-label="Magnetic-Snap Strength"
                  data-testid="config-magnetic-strength-slider"
                  min={0}
                  max={0.6}
                  step={0.02}
                  value={dockMagneticStrength}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setDockMagneticStrength(val);
                    setDockMagneticSnap(val > 0);
                  }}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="flex items-center justify-between gap-1 pt-0.5">
                  {[
                    { label: 'Subtle', val: 0.18 },
                    { label: 'Balanced', val: 0.34 },
                    { label: 'Strong', val: 0.52 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setDockMagneticSnap(true);
                        setDockMagneticStrength(preset.val);
                      }}
                      className={`flex-1 rounded py-0.5 text-[10px] font-mono cursor-pointer border ${
                        dockMagneticSnap && Math.abs(dockMagneticStrength - preset.val) < 0.02
                          ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Control 2: Icon Scale Ratio */}
              <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-200">Icon Scale Ratio</span>
                  <span className="rounded bg-indigo-500/20 border border-indigo-500/40 px-1.5 py-0.5 text-[10px] font-mono font-bold text-indigo-300">
                    {dockMagScale.toFixed(2)}x
                  </span>
                </div>
                <input
                  type="range"
                  aria-label="Icon Scale Ratio"
                  data-testid="config-icon-scale-slider"
                  min={1.15}
                  max={1.75}
                  step={0.03}
                  value={dockMagScale}
                  onChange={(e) => setDockMagScale(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="flex items-center justify-between gap-1 pt-0.5">
                  {[
                    { label: '1.24x', val: 1.24 },
                    { label: '1.48x', val: 1.48 },
                    { label: '1.68x', val: 1.68 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setDockMagScale(preset.val)}
                      className={`flex-1 rounded py-0.5 text-[10px] font-mono cursor-pointer border ${
                        Math.abs(dockMagScale - preset.val) < 0.02
                          ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Control 3: Glass Opacity & 2s Auto-Hide */}
              <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-200">Glass Opacity</span>
                  <span className="rounded bg-emerald-500/20 border border-emerald-500/40 px-1.5 py-0.5 text-[10px] font-mono font-bold text-emerald-300">
                    {Math.round(dockGlassOpacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  aria-label="Glass Opacity"
                  data-testid="config-glass-opacity-slider"
                  min={0.35}
                  max={0.98}
                  step={0.03}
                  value={dockGlassOpacity}
                  onChange={(e) => setDockGlassOpacity(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex items-center justify-between gap-1.5 pt-0.5">
                  <button
                    type="button"
                    data-testid="config-autohide-toggle"
                    onClick={() => setDockAutoHide((v) => !v)}
                    className={`flex-1 rounded py-0.5 px-2 text-[10px] font-mono cursor-pointer border ${
                      dockAutoHide
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    2s Auto-Hide: {dockAutoHide ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>
          }
          stateControls={
            <>
              <div className="inline-flex rounded-lg bg-white dark:bg-slate-800 p-0.5 border border-slate-200/80 dark:border-slate-700 text-[11px] font-medium">
                {(['snappy', 'fluid', 'bouncy'] as const).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDockSpringPreset(preset)}
                    className={`px-2 py-0.5 rounded-md capitalize cursor-pointer ${
                      dockSpringPreset === preset
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setDockMagneticSnap((v) => !v)}
                className={`px-2 py-0.5 rounded-lg border text-[11px] font-medium cursor-pointer ${
                  dockMagneticSnap
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 font-semibold'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                }`}
              >
                Magnetic Snap: {dockMagneticSnap ? `${dockMagneticStrength.toFixed(2)}g` : 'OFF'}
              </button>

              <button
                type="button"
                onClick={() => setDockAutoHide((v) => !v)}
                className={`px-2 py-0.5 rounded-lg border text-[11px] font-medium cursor-pointer ${
                  dockAutoHide
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 font-semibold'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                }`}
              >
                Auto-Hide (2s): {dockAutoHide ? 'ON' : 'OFF'}
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-900 text-slate-200 p-3.5 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    dockIsAutoHidden ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
                  }`}
                />
                <span className="font-mono text-slate-400">Haptic Target:</span>
                <strong className="text-white font-semibold">{lastHapticPulse}</strong>
              </div>
              <span className="text-[10px] font-mono text-indigo-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                Scale {dockMagScale.toFixed(2)}x · Glass {Math.round(dockGlassOpacity * 100)}% ·{' '}
                {dockIsAutoHidden ? 'Slid Out (Idle >2s)' : 'Active Dock'}
              </span>
            </div>

            {/* Proximity, Velocity, Magnetic-Snap & 2s Auto-Hide Floating Glass JXDock */}
            <div className="flex justify-center pt-3 pb-1">
              <JXDock
                items={DEFAULT_DOCK_ITEMS}
                activeId={activeDockApp}
                magnification={dockMagScale}
                distance={136}
                springPreset={dockSpringPreset}
                magneticSnap={dockMagneticSnap}
                magneticStrength={dockMagneticStrength}
                glassOpacity={dockGlassOpacity}
                autoHide={dockAutoHide}
                autoHideDelayMs={2000}
                onAutoHideChange={setDockIsAutoHidden}
                velocityBoost={dockVelocityBoost}
                hapticRipples
                glass
                onSelect={(item) => {
                  setActiveDockApp(item.id);
                  setLastHapticPulse(`${item.label} (${item.shortcut})`);
                  pushToast({
                    title: `Haptic Pulse · ${item.label}`,
                    description: `Magnetic snap + radial ripple (${item.shortcut})`,
                    variant: 'default',
                  });
                }}
              />
            </div>
          </div>
        </ComponentDocumentation>

        {/* #58 JXTrafficSplitter */}
        <ComponentDocumentation
          spec={getSpec(58)}
          customJsx={`<JXTrafficSplitter
  stableVersion="v2.4.0"
  canaryVersion="v3.0.0"
  canaryWeight={${canaryWeight}}
  autoRollbackOnError={${autoRollback}}
  onWeightChange={setCanaryWeight}
  onPromote={() => setCanaryWeight(100)}
/>`}
        >
          <JXTrafficSplitter
            stableVersion="v2.4.0"
            canaryVersion="v3.0.0"
            canaryWeight={canaryWeight}
            onWeightChange={setCanaryWeight}
            autoRollbackOnError={autoRollback}
            onAutoRollbackChange={setAutoRollback}
            onPromote={() =>
              pushToast({
                title: 'Promoted v3.0.0 to 100% Production',
                description: 'Zero dropped connections across 18 global edge PoPs',
                variant: 'success',
              })
            }
            onRollback={() =>
              pushToast({
                title: 'Canary Rolled Back to 0%',
                description: '100% traffic routed to stable v2.4.0',
                variant: 'warning',
              })
            }
          />
        </ComponentDocumentation>
      </div>

      {/* #57 JXPricingMatrix (Full-Width 3-Tier Glassmorphic Pricing Matrix) */}
      <ComponentDocumentation
        spec={getSpec(57)}
        customJsx={`<JXPricingMatrix
  billingCycle="${billingCycle}"
  annualDiscount={0.20}
  seats={${seats}}
  selectedTierId="${selectedTierId}"
  glassHover={${glassHoverEnabled}}
  onBillingCycleChange={setBillingCycle}
  onSeatsChange={setSeats}
  onSelectTier={setSelectedTierId}
/>`}
        stateControls={
          <div className="flex flex-wrap items-center gap-2">
            <JXToggleButtonGroup
              value={billingCycle}
              onChange={(val) => setBillingCycle(val as 'monthly' | 'annual')}
              options={[
                { value: 'monthly', label: 'Monthly Billing' },
                { value: 'annual', label: 'Annual (-20% Off)' },
              ]}
            />
            <button
              type="button"
              onClick={() => setGlassHoverEnabled((v) => !v)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium cursor-pointer ${
                glassHoverEnabled
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
              }`}
            >
              Glassmorphic Hover: {glassHoverEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        }
      >
        <JXPricingMatrix
          billingCycle={billingCycle}
          onBillingCycleChange={setBillingCycle}
          annualDiscount={0.2}
          seats={seats}
          onSeatsChange={setSeats}
          selectedTierId={selectedTierId}
          onSelectTier={setSelectedTierId}
          glassHover={glassHoverEnabled}
          onCheckout={(tier, monthlyTotal, cycle, seatCount) =>
            pushToast({
              title: `Provisioned ${seatCount} ${tier.name} Seats`,
              description: `Billed ${cycle} ($${monthlyTotal.toLocaleString()}/mo effective)`,
              variant: 'success',
            })
          }
        />
      </ComponentDocumentation>

      {/* #59 JXAudioWaveformScrubber, #60 JXInteractiveColorStudio, #61 JXSecurityVaultCard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* #59 JXAudioWaveformScrubber */}
        <ComponentDocumentation spec={getSpec(59)}>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 active:scale-95 transition-all cursor-pointer"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                </button>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    RFC-042 Architecture Note
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                    <Volume2 className="w-3 h-3 text-indigo-500" />
                    <span>{formatAudioTime(hoverBarIndex ?? playheadIndex)} / 3:04</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const rates = [1.0, 1.25, 1.5, 2.0];
                  const next = rates[(rates.indexOf(playbackSpeed) + 1) % rates.length];
                  setPlaybackSpeed(next);
                }}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer"
              >
                {playbackSpeed}x
              </button>
            </div>

            {/* 48-Bar Interactive Frequency Scrubber */}
            <div
              onMouseLeave={() => setHoverBarIndex(null)}
              className="relative flex h-16 items-center justify-between gap-[2px] rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 px-3 py-2"
            >
              {WAVEFORM_BARS.map((heightPct, idx) => {
                const isPlayed = idx <= playheadIndex;
                const isHovered = hoverBarIndex !== null && idx <= hoverBarIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Jump to ${formatAudioTime(idx)}`}
                    onMouseEnter={() => setHoverBarIndex(idx)}
                    onClick={() => setPlayheadIndex(idx)}
                    style={{ height: `${heightPct}%` }}
                    className={`flex-1 rounded-full transition-all duration-150 cursor-pointer ${
                      isPlayed
                        ? 'bg-indigo-600 dark:bg-indigo-400'
                        : isHovered
                        ? 'bg-indigo-300 dark:bg-indigo-700'
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  />
                );
              })}
            </div>

            {/* Chapter Jump Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { label: '0:00 Intro', idx: 0 },
                { label: '0:42 Spring Physics', idx: 11 },
                { label: '1:58 Zero-Notch', idx: 30 },
              ].map((ch) => (
                <button
                  key={ch.label}
                  type="button"
                  onClick={() => setPlayheadIndex(ch.idx)}
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-semibold transition-colors cursor-pointer ${
                    playheadIndex >= ch.idx
                      ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/60'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {ch.label}
                </button>
              ))}
            </div>
          </div>
        </ComponentDocumentation>

        {/* #60 JXInteractiveColorStudio */}
        <ComponentDocumentation
          spec={getSpec(60)}
          customJsx={`<JXInteractiveColorStudio
  baseHue={${studioHue}}
  saturation={${studioSat}}
  exportFormat="css-variables"
/>`}
        >
          <div className="space-y-3.5">
            <JXSlider
              label="Primary Token Hue"
              value={studioHue}
              onChange={setStudioHue}
              min={0}
              max={360}
              step={1}
              unit="°"
            />
            <JXSlider
              label="Chroma Saturation"
              value={studioSat}
              onChange={setStudioSat}
              min={25}
              max={100}
              step={1}
              unit="%"
            />

            {/* 9-Stop Live Tonal Swatch Strip */}
            <div className="grid grid-cols-9 gap-1 pt-1">
              {TONAL_STOPS.map(({ stop, l }) => {
                const hslColor = `hsl(${studioHue} ${studioSat}% ${l}%)`;
                const isCopied = copiedStop === stop;
                return (
                  <button
                    key={stop}
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(`--jx-brand-${stop}: ${hslColor};`).catch(() => {});
                      setCopiedStop(stop);
                      pushToast({
                        title: `Copied --jx-brand-${stop}`,
                        description: hslColor,
                        variant: 'success',
                      });
                      setTimeout(() => setCopiedStop(null), 1500);
                    }}
                    title={`Click to copy --jx-brand-${stop}: ${hslColor}`}
                    className="group flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <span
                      style={{ backgroundColor: hslColor }}
                      className="h-9 w-full rounded-lg border border-black/10 dark:border-white/10 flex items-center justify-center transition-transform group-hover:scale-105"
                    >
                      {isCopied && (
                        <Check
                          className={`h-3 w-3 ${l > 55 ? 'text-slate-900' : 'text-white'}`}
                        />
                      )}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">{stop}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 px-3 py-2 text-[11px]">
              <span className="font-mono text-slate-500">
                WCAG 600 vs #FFFFFF: <strong className="text-emerald-600 dark:text-emerald-400">7.4:1 AAA</strong>
              </span>
              <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold">
                <Copy className="w-3 h-3" /> Click swatch
              </span>
            </div>
          </div>
        </ComponentDocumentation>

        {/* #61 JXSecurityVaultCard */}
        <ComponentDocumentation spec={getSpec(61)}>
          <div className="space-y-3.5">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 p-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                    passkeyStatus === 'verified'
                      ? 'bg-emerald-500 text-white'
                      : passkeyStatus === 'scanning'
                      ? 'bg-indigo-600 text-white animate-pulse'
                      : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                  }`}
                >
                  <Fingerprint className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>YubiKey 5C Nano</span>
                    <JXBadge statusText="FIDO2" color="primary" />
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    {passkeyStatus === 'verified'
                      ? 'Attested · SHA256:9f8a...e41c'
                      : passkeyStatus === 'scanning'
                      ? 'Touch hardware key gold disk...'
                      : 'Last used 4m ago · us-east-1'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleTriggerPasskey}
                className="rounded-lg bg-slate-900 dark:bg-white px-2.5 py-1.5 text-[11px] font-semibold text-white dark:text-slate-900 hover:opacity-90 transition-opacity cursor-pointer shrink-0"
              >
                {passkeyStatus === 'verified' ? 'Re-Verify' : 'Verify Key'}
              </button>
            </div>

            <JXSwitch
              checked={strictWebAuthn}
              onChange={setStrictWebAuthn}
              label="Enforce Hardware Passkey for Prod Deploys"
            />

            <JXAccordion
              variant="bento"
              defaultOpenId={null}
              items={[
                {
                  id: 'vault-audit-1',
                  title: 'Recent WebAuthn Attestation Log',
                  badge: 'Zero-Trust',
                  body: 'All 14 production cluster mutations in the last 24h were cryptographically signed via FIDO2 hardware resident keys.',
                },
              ]}
            />
          </div>
        </ComponentDocumentation>
      </div>
    </div>
  );
};
