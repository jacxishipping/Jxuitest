import React, { useState, useMemo } from 'react';
import {
  Sliders,
  Palette,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Code2,
  Eye,
  Layers,
  Zap,
  BookOpen,
  History,
} from 'lucide-react';
import { UNIFIED_COMPONENTS_351, UnifiedComponentSpec } from '../data/unifiedCatalog';
import { InteractiveComponentPreview } from './InteractiveComponentPreview';
import { useJXTheme } from '../context/JXThemeContext';
import { copyTextToClipboard } from '../utils/rawSourceLoader';
import {
  PlaygroundPropValues,
  PlaygroundCssVariables,
  PlaygroundVariant,
  PlaygroundColor,
  PlaygroundSize,
  PlaygroundElevation,
  DEFAULT_PLAYGROUND_PROPS,
  DEFAULT_PLAYGROUND_CSS_VARS,
  PLAYGROUND_CSS_VAR_CONTROLS,
  serializePlaygroundJsx,
  serializePlaygroundCssVariables,
  buildPlaygroundStageStyle,
  getComponentV3Changelog,
  formatV3ChangelogMarkdown,
} from '../utils/jxuiLogic';

const ACCENT_PRESETS: { name: string; hex: string }[] = [
  { name: 'Indigo', hex: '#4f46e5' },
  { name: 'Violet', hex: '#7c3aed' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Rose', hex: '#e11d48' },
  { name: 'Ocean', hex: '#0284c7' },
  { name: 'Amber', hex: '#d97706' },
];

const FEATURED_PLAYGROUND_IDS = [
  'jx-button',
  'jx-autocomplete',
  'jx-switch',
  'jx-slider',
  'jx-card',
  'jx-alert',
  'jx-badge',
  'jx-tabs',
  'jx-data-grid',
  'MagneticButton',
  'GlowButton',
  'SpotlightCard',
];

export interface InlineLivePlaygroundProps {
  componentName: string;
  propsState: PlaygroundPropValues;
  onChangeProps: (next: PlaygroundPropValues) => void;
  cssVars: PlaygroundCssVariables;
  onChangeCssVars: (next: PlaygroundCssVariables) => void;
  onReset: () => void;
  initialTab?: 'props' | 'css' | 'changelog';
}

/**
 * Compact inline Live Playground panel embedded directly inside individual component showcase cards.
 */
export const InlineLivePlayground: React.FC<InlineLivePlaygroundProps> = ({
  componentName,
  propsState,
  onChangeProps,
  cssVars,
  onChangeCssVars,
  onReset,
  initialTab = 'props',
}) => {
  const { pushToast } = useJXTheme();
  const [activeTab, setActiveTab] = useState<'props' | 'css' | 'changelog'>(initialTab);
  const [copiedType, setCopiedType] = useState<'jsx' | 'css' | 'changelog' | null>(null);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const matchedSpec = useMemo(() => {
    const clean = componentName.split(/[ &/]/)[0].trim();
    return UNIFIED_COMPONENTS_351.find(
      (c) => c.name === componentName || c.name.startsWith(clean) || c.id === componentName
    );
  }, [componentName]);

  const v3Changelog = useMemo(
    () =>
      getComponentV3Changelog({
        name: componentName,
        subtitle: matchedSpec?.subtitle,
        categoryTitle: matchedSpec?.categoryTitle,
        muiFlaw: matchedSpec?.muiFlaw,
        jxuiUpgrade: matchedSpec?.jxuiUpgrade,
        jsxSnippet: matchedSpec?.jsxSnippet,
      }),
    [componentName, matchedSpec]
  );

  const handleCopy = async (type: 'jsx' | 'css' | 'changelog') => {
    const text =
      type === 'jsx'
        ? serializePlaygroundJsx(componentName, propsState, true)
        : type === 'css'
        ? serializePlaygroundCssVariables(cssVars, `.jx-${componentName.toLowerCase()}-scope`)
        : formatV3ChangelogMarkdown(v3Changelog);
    await copyTextToClipboard(text);
    setCopiedType(type);
    pushToast({
      title:
        type === 'jsx'
          ? `Copied Live <${componentName} /> JSX`
          : type === 'css'
          ? 'Copied Scoped CSS Variables'
          : `Copied <${componentName} /> v3 Changelog`,
      description:
        type === 'jsx'
          ? 'Real-time prop configuration copied to clipboard'
          : type === 'css'
          ? 'Custom CSS variable overrides copied to clipboard'
          : 'v3.0 migration changelog notes copied to clipboard',
      variant: 'success',
    });
    setTimeout(() => setCopiedType(null), 1800);
  };

  const radiusNum = Number.parseInt(cssVars['--jx-pg-radius'], 10) || 14;
  const blurNum = Number.parseInt(cssVars['--jx-pg-blur'], 10) || 16;
  const scaleNum = Number.parseFloat(cssVars['--jx-pg-scale']) || 1;
  const paddingNum = Number.parseInt(cssVars['--jx-pg-padding'], 10) || 16;

  return (
    <div
      data-testid={`inline-playground-${componentName}`}
      className="border-t border-slate-200/80 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/90 p-3 space-y-3 text-xs rounded-b-xl"
    >
      {/* Top Bar: Mode Switcher + Reset + Copy Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div
          role="tablist"
          aria-label={`Live Playground tabs for ${componentName}`}
          className="inline-flex items-center rounded-lg bg-slate-200/80 dark:bg-slate-800 p-0.5 text-[11px] font-semibold"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'props'}
            onClick={() => setActiveTab('props')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'props'
                ? 'bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>Toggle Props</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'css'}
            onClick={() => setActiveTab('css')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'css'
                ? 'bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Palette className="w-3 h-3" />
            <span>CSS Variables</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'changelog'}
            onClick={() => setActiveTab('changelog')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'changelog'
                ? 'bg-white dark:bg-slate-950 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <History className="w-3 h-3" />
            <span>Changelog</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() =>
              handleCopy(
                activeTab === 'props'
                  ? 'jsx'
                  : activeTab === 'css'
                  ? 'css'
                  : 'changelog'
              )
            }
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            {copiedType ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>
              {copiedType
                ? 'Copied!'
                : activeTab === 'props'
                ? 'Copy Live JSX'
                : activeTab === 'css'
                ? 'Copy CSS Vars'
                : 'Copy Changelog'}
            </span>
          </button>
          <button
            type="button"
            onClick={onReset}
            title="Reset playground controls"
            aria-label={`Reset playground controls for ${componentName}`}
            className="p-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {activeTab === 'props' ? (
        <div className="space-y-2.5">
          {/* Variant & Color Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <span className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                variant
              </span>
              <div className="inline-flex flex-wrap gap-1">
                {(['contained', 'soft', 'outlined', 'glass', 'text'] as PlaygroundVariant[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => onChangeProps({ ...propsState, variant: v, glass: v === 'glass' ? true : propsState.glass })}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize transition-colors cursor-pointer ${
                      propsState.variant === v
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                color / size
              </span>
              <div className="flex flex-wrap items-center gap-1">
                {(['primary', 'success', 'warning', 'error'] as PlaygroundColor[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onChangeProps({ ...propsState, color: c })}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium capitalize transition-colors cursor-pointer ${
                      propsState.color === c
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {c}
                  </button>
                ))}
                <span className="text-slate-300 dark:text-slate-700">|</span>
                {(['sm', 'md', 'lg'] as PlaygroundSize[]).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => onChangeProps({ ...propsState, size: sz })}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase transition-colors cursor-pointer ${
                      propsState.size === sz
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Boolean Prop Toggles */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {(
              [
                { key: 'spring', label: 'spring' },
                { key: 'halo', label: 'halo' },
                { key: 'glass', label: 'glass' },
                { key: 'loading', label: 'loading' },
                { key: 'morphSuccess', label: 'morphSuccess' },
                { key: 'disabled', label: 'disabled' },
              ] as const
            ).map((toggle) => {
              const active = propsState[toggle.key];
              return (
                <button
                  key={toggle.key}
                  type="button"
                  role="switch"
                  aria-checked={active}
                  onClick={() =>
                    onChangeProps({
                      ...propsState,
                      [toggle.key]: !active,
                    })
                  }
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] border transition-colors cursor-pointer ${
                    active
                      ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-400 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                  }`}
                >
                  <span>{toggle.label}</span>
                  <span className="text-[9px] opacity-80">{active ? 'ON' : 'OFF'}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : activeTab === 'css' ? (
        <div className="space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Radius Slider */}
            <label className="block space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-600 dark:text-slate-300">--jx-pg-radius</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold tabular-nums">
                  {cssVars['--jx-pg-radius']}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={32}
                step={2}
                value={radiusNum}
                onChange={(e) =>
                  onChangeCssVars({
                    ...cssVars,
                    '--jx-pg-radius': `${e.target.value}px`,
                  })
                }
                className="w-full accent-indigo-600 cursor-pointer h-1.5"
              />
            </label>

            {/* Glass Blur Slider */}
            <label className="block space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-600 dark:text-slate-300">--jx-pg-blur</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold tabular-nums">
                  {cssVars['--jx-pg-blur']}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={32}
                step={2}
                value={blurNum}
                onChange={(e) =>
                  onChangeCssVars({
                    ...cssVars,
                    '--jx-pg-blur': `${e.target.value}px`,
                  })
                }
                className="w-full accent-indigo-600 cursor-pointer h-1.5"
              />
            </label>

            {/* Scale Slider */}
            <label className="block space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-600 dark:text-slate-300">--jx-pg-scale</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold tabular-nums">
                  {scaleNum.toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min={0.85}
                max={1.15}
                step={0.05}
                value={scaleNum}
                onChange={(e) =>
                  onChangeCssVars({
                    ...cssVars,
                    '--jx-pg-scale': e.target.value,
                  })
                }
                className="w-full accent-indigo-600 cursor-pointer h-1.5"
              />
            </label>

            {/* Padding Slider */}
            <label className="block space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-600 dark:text-slate-300">--jx-pg-padding</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold tabular-nums">
                  {cssVars['--jx-pg-padding']}
                </span>
              </div>
              <input
                type="range"
                min={8}
                max={32}
                step={4}
                value={paddingNum}
                onChange={(e) =>
                  onChangeCssVars({
                    ...cssVars,
                    '--jx-pg-padding': `${e.target.value}px`,
                  })
                }
                className="w-full accent-indigo-600 cursor-pointer h-1.5"
              />
            </label>
          </div>

          {/* Accent Color Swatches */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300">
              --jx-pg-accent: <strong className="text-indigo-600 dark:text-indigo-400">{cssVars['--jx-pg-accent']}</strong>
            </span>
            <div className="flex items-center gap-1.5">
              {ACCENT_PRESETS.map((preset) => (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() =>
                    onChangeCssVars({
                      ...cssVars,
                      '--jx-pg-accent': preset.hex,
                    })
                  }
                  aria-label={`Set CSS variable accent to ${preset.name}`}
                  style={{ backgroundColor: preset.hex }}
                  className={`w-4 h-4 rounded-full cursor-pointer transition-transform ${
                    cssVars['--jx-pg-accent'] === preset.hex
                      ? 'ring-2 ring-slate-900 dark:ring-white scale-110'
                      : 'opacity-75 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div
          data-testid={`inline-changelog-${componentName}`}
          className="space-y-2.5"
        >
          <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/70">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>&lt;{v3Changelog.componentName} /&gt; v3.0 Migration Changelog</span>
            </div>
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-600 text-white">
              v3.0.0
            </span>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed px-0.5">
            {v3Changelog.summary}
          </p>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {v3Changelog.entries.map((entry) => (
              <div
                key={entry.id}
                className="p-2.5 rounded-lg bg-white dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 space-y-1.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="font-semibold text-[11px] text-slate-900 dark:text-white">
                    {entry.title}
                  </span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
                    {entry.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {entry.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[10px] font-mono">
                  <div className="px-2 py-1 rounded bg-rose-50/70 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200/50 dark:border-rose-900/50 truncate">
                    <span className="font-bold mr-1">v2:</span>
                    {entry.beforeV2}
                  </div>
                  <div className="px-2 py-1 rounded bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-900/50 truncate">
                    <span className="font-bold mr-1">v3:</span>
                    {entry.afterV3}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export interface LivePlaygroundProps {
  selectedComponentId?: string;
  onSelectComponentId?: (id: string) => void;
  onOpenDocs?: (spec: UnifiedComponentSpec) => void;
}

/**
 * Full-featured Interactive Live Playground Studio for the JXUI Component Showcase.
 * Allows users to select any component, toggle props in real-time, modify CSS variables,
 * inspect the live stage, and copy the dynamically generated JSX or CSS Variables block.
 */
export const LivePlayground: React.FC<LivePlaygroundProps> = ({
  selectedComponentId,
  onSelectComponentId,
  onOpenDocs,
}) => {
  const { pushToast } = useJXTheme();
  const [internalId, setInternalId] = useState<string>('jx-button');
  const activeId = selectedComponentId || internalId;

  const setActiveId = (nextId: string) => {
    setInternalId(nextId);
    if (onSelectComponentId) {
      onSelectComponentId(nextId);
    }
  };

  const activeSpec = useMemo(() => {
    return (
      UNIFIED_COMPONENTS_351.find((c) => c.id === activeId || c.name === activeId) ||
      UNIFIED_COMPONENTS_351[1] ||
      UNIFIED_COMPONENTS_351[0]
    );
  }, [activeId]);

  const featuredSpecs = useMemo(() => {
    return FEATURED_PLAYGROUND_IDS.map((id) =>
      UNIFIED_COMPONENTS_351.find((c) => c.id === id || c.name === id)
    ).filter((c): c is UnifiedComponentSpec => Boolean(c));
  }, []);

  const [propsState, setPropsState] = useState<PlaygroundPropValues>(DEFAULT_PLAYGROUND_PROPS);
  const [cssVars, setCssVars] = useState<PlaygroundCssVariables>(DEFAULT_PLAYGROUND_CSS_VARS);
  const [controlMode, setControlMode] = useState<'split' | 'props' | 'css' | 'changelog'>('split');
  const [codeTab, setCodeTab] = useState<'jsx' | 'css' | 'changelog'>('jsx');
  const [stageBackdrop, setStageBackdrop] = useState<'grid' | 'dots' | 'glass' | 'contrast'>('grid');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const liveJsxCode = useMemo(
    () => serializePlaygroundJsx(activeSpec.name, propsState, true),
    [activeSpec.name, propsState]
  );

  const liveCssCode = useMemo(
    () => serializePlaygroundCssVariables(cssVars, `:root, .jx-playground-${activeSpec.id}`),
    [cssVars, activeSpec.id]
  );

  const activeV3Changelog = useMemo(
    () =>
      getComponentV3Changelog({
        name: activeSpec.name,
        subtitle: activeSpec.subtitle,
        categoryTitle: activeSpec.categoryTitle,
        muiFlaw: activeSpec.muiFlaw,
        jxuiUpgrade: activeSpec.jxuiUpgrade,
        jsxSnippet: activeSpec.jsxSnippet,
      }),
    [activeSpec]
  );

  const liveChangelogMarkdown = useMemo(
    () => formatV3ChangelogMarkdown(activeV3Changelog),
    [activeV3Changelog]
  );

  const stageStyle = useMemo(
    () => buildPlaygroundStageStyle(cssVars, propsState),
    [cssVars, propsState]
  );

  const handleResetAll = () => {
    setPropsState(DEFAULT_PLAYGROUND_PROPS);
    setCssVars(DEFAULT_PLAYGROUND_CSS_VARS);
    pushToast({
      title: 'Playground Reset',
      description: `Restored default props and CSS variables for <${activeSpec.name} />`,
      variant: 'default',
    });
  };

  const handleCopyActiveCode = async () => {
    const text =
      codeTab === 'jsx'
        ? liveJsxCode
        : codeTab === 'css'
        ? liveCssCode
        : liveChangelogMarkdown;
    await copyTextToClipboard(text);
    setCopiedCode(true);
    pushToast({
      title:
        codeTab === 'jsx'
          ? `Copied Live <${activeSpec.name} /> JSX`
          : codeTab === 'css'
          ? `Copied <${activeSpec.name} /> CSS Variables`
          : `Copied <${activeSpec.name} /> v3 Changelog`,
      description:
        codeTab === 'jsx'
          ? 'Real-time JSX with active prop toggles copied to clipboard'
          : codeTab === 'css'
          ? 'Scoped CSS custom properties copied to clipboard'
          : 'v3 migration changelog notes copied to clipboard',
      variant: 'success',
    });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const updateCssVar = (key: keyof PlaygroundCssVariables, value: string) => {
    setCssVars((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const backdropClass =
    stageBackdrop === 'grid'
      ? 'bg-slate-50 dark:bg-slate-950 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]'
      : stageBackdrop === 'dots'
      ? 'bg-slate-100/70 dark:bg-slate-900/80'
      : stageBackdrop === 'glass'
      ? 'bg-gradient-to-br from-indigo-500/10 via-sky-500/5 to-emerald-500/10 dark:from-indigo-950/50 dark:via-slate-950 dark:to-emerald-950/40'
      : 'bg-slate-900 text-white dark:bg-slate-950';

  return (
    <section
      id="jx-live-playground"
      aria-label="Interactive Live Playground"
      className="scroll-mt-24 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden"
    >
      {/* Top Studio Header Bar */}
      <div className="px-5 sm:px-6 py-4 border-b border-slate-200/80 dark:border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/60 dark:bg-slate-950/40">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Component Sandbox</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
              Real-Time Props &amp; CSS Variables
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Live Component Playground
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Toggle component props or fine-tune scoped CSS custom variables in real-time and copy the generated code.
          </p>
        </div>

        {/* Component Selector Dropdown + Reset */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <label
              htmlFor="playground-component-select"
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap"
            >
              Component:
            </label>
            <select
              id="playground-component-select"
              aria-label="Select component for Live Playground"
              value={activeSpec.id}
              onChange={(e) => setActiveId(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              <optgroup label="61 Flagship Showcases">
                {UNIFIED_COMPONENTS_351.filter((c) => c.tier === 'showcase').map((c) => (
                  <option key={c.id} value={c.id}>
                    #{String(c.showcaseNumber).padStart(2, '0')} {c.name} — {c.subtitle}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Atomic Primitives">
                {UNIFIED_COMPONENTS_351.filter((c) => c.tier === 'primitive')
                  .slice(0, 60)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.categoryTitle.replace(/^Category \d+:\s*/, '')})
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          <div className="inline-flex items-center rounded-xl bg-slate-200/70 dark:bg-slate-800 p-0.5 text-xs font-semibold">
            {(
              [
                { id: 'split', label: 'Props + CSS' },
                { id: 'props', label: 'Props Only' },
                { id: 'css', label: 'CSS Vars Only' },
                { id: 'changelog', label: 'Changelog' },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setControlMode(m.id)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  controlMode === m.id
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleResetAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Playground</span>
          </button>
        </div>
      </div>

      {/* Quick Featured Component Switcher Bar */}
      <div className="px-5 sm:px-6 py-2.5 border-b border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-mono text-slate-400 shrink-0">Quick Load:</span>
        {featuredSpecs.map((item) => {
          const isSelected = item.id === activeSpec.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors shrink-0 cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              &lt;{item.name} /&gt;
            </button>
          );
        })}
      </div>

      {/* Main Split Workbench: Left = Live Stage + Live Code | Right = Real-Time Props & CSS Variables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80 dark:divide-slate-800 items-stretch">
        {/* LEFT COLUMN (7 cols): Live Interactive Stage + Live Generated Code */}
        <div className="lg:col-span-7 flex flex-col divide-y divide-slate-200/80 dark:divide-slate-800">
          {/* Stage Area */}
          <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Live Stage: &lt;{activeSpec.name} /&gt;
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  · {activeSpec.subtitle}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="inline-flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 text-[10px] font-mono">
                  {(
                    [
                      { id: 'grid', label: 'Grid' },
                      { id: 'dots', label: 'Slate' },
                      { id: 'glass', label: 'Aurora' },
                      { id: 'contrast', label: 'Dark' },
                    ] as const
                  ).map((bg) => (
                    <button
                      key={bg.id}
                      type="button"
                      aria-label={`Stage backdrop ${bg.label}`}
                      onClick={() => setStageBackdrop(bg.id)}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        stageBackdrop === bg.id
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-2xs'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {bg.label}
                    </button>
                  ))}
                </div>

                {onOpenDocs && (
                  <button
                    type="button"
                    onClick={() => onOpenDocs(activeSpec)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap"
                  >
                    <BookOpen className="w-3 h-3 text-indigo-500" />
                    <span>Full Spec</span>
                  </button>
                )}
              </div>
            </div>

            {/* Interactive Canvas with Real-Time Scoped CSS Variables */}
            <div
              className={`flex-1 min-h-[240px] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col items-center justify-center relative overflow-hidden transition-colors ${backdropClass}`}
            >
              <div
                data-testid="live-playground-stage"
                style={stageStyle}
                className="w-full max-w-lg border border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/90 flex flex-col items-center justify-center"
              >
                <InteractiveComponentPreview
                  spec={activeSpec}
                  playgroundProps={propsState}
                />
              </div>

              {/* Active State Summary Strip */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                <span>variant=&quot;{propsState.variant}&quot;</span>
                <span>·</span>
                <span>color=&quot;{propsState.color}&quot;</span>
                <span>·</span>
                <span>size=&quot;{propsState.size}&quot;</span>
                <span>·</span>
                <span>radius={cssVars['--jx-pg-radius']}</span>
                <span>·</span>
                <span>accent={cssVars['--jx-pg-accent']}</span>
                <span>·</span>
                <span>scale={cssVars['--jx-pg-scale']}x</span>
              </div>
            </div>
          </div>

          {/* Live Synchronized JSX / CSS Variables / v3 Changelog Output */}
          <div className="p-5 sm:p-6 bg-slate-950 text-slate-100 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setCodeTab('jsx')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    codeTab === 'jsx'
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Live JSX Output</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCodeTab('css')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    codeTab === 'css'
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Scoped CSS Variables</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCodeTab('changelog')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    codeTab === 'changelog'
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Changelog</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyActiveCode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>
                      Copied {codeTab === 'jsx' ? 'JSX' : codeTab === 'css' ? 'CSS' : 'Changelog'}!
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>
                      Copy{' '}
                      {codeTab === 'jsx'
                        ? 'Live JSX'
                        : codeTab === 'css'
                        ? 'CSS Variables'
                        : 'v3 Changelog'}
                    </span>
                  </>
                )}
              </button>
            </div>

            {codeTab === 'changelog' ? (
              <div
                data-testid="live-playground-changelog"
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5 max-h-56 overflow-y-auto"
              >
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>&lt;{activeV3Changelog.componentName} /&gt; v3.0 Migration Highlights</span>
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    v3.0.0
                  </span>
                </div>
                {activeV3Changelog.entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-2.5 rounded-lg bg-slate-950/90 border border-slate-800/80 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-white">{entry.title}</span>
                      <span className="font-mono text-[10px] text-indigo-300 bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-800/60">
                        {entry.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{entry.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <pre
                data-testid="live-playground-code"
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-indigo-200 overflow-x-auto max-h-48 overflow-y-auto leading-relaxed"
              >
                <code>{codeTab === 'jsx' ? liveJsxCode : liveCssCode}</code>
              </pre>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN (5 cols): Interactive Props Toggles & CSS Variable Controls */}
        <div className="lg:col-span-5 p-5 sm:p-6 space-y-6 bg-slate-50/40 dark:bg-slate-950/30">
          {/* 1. PROPS CONTROL PANEL */}
          {(controlMode === 'split' || controlMode === 'props') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Component Props Controls</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Real-Time State</span>
              </div>

              {/* Variant Selector */}
              <div className="space-y-1.5">
                <span className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Surface Variant (<code className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400">variant</code>)
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['contained', 'soft', 'outlined', 'glass', 'text'] as PlaygroundVariant[]).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() =>
                        setPropsState((prev) => ({
                          ...prev,
                          variant: v,
                          glass: v === 'glass' ? true : prev.glass,
                        }))
                      }
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer text-center ${
                        propsState.variant === v
                          ? 'bg-indigo-600 text-white font-semibold shadow-2xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Semantic Color Selector */}
              <div className="space-y-1.5">
                <span className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Semantic Tone (<code className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400">color</code>)
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['primary', 'secondary', 'success', 'warning', 'error'] as PlaygroundColor[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setPropsState((prev) => ({ ...prev, color: c }))}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer text-center ${
                        propsState.color === c
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold shadow-2xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size & Elevation Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <span className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Size (<code className="font-mono text-[11px]">size</code>)
                  </span>
                  <div className="grid grid-cols-3 gap-1">
                    {(['sm', 'md', 'lg'] as PlaygroundSize[]).map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setPropsState((prev) => ({ ...prev, size: sz }))}
                        className={`py-1 rounded-lg text-xs font-mono uppercase cursor-pointer ${
                          propsState.size === sz
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Elevation (<code className="font-mono text-[11px]">elevation</code>)
                  </span>
                  <div className="grid grid-cols-4 gap-1">
                    {([0, 1, 2, 3] as PlaygroundElevation[]).map((el) => (
                      <button
                        key={el}
                        type="button"
                        onClick={() => setPropsState((prev) => ({ ...prev, elevation: el }))}
                        className={`py-1 rounded-lg text-xs font-mono tabular-nums cursor-pointer ${
                          propsState.elevation === el
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {el}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Custom Label Input */}
              <div>
                <label
                  htmlFor="playground-custom-label"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Custom Label / Children (<code className="font-mono text-[11px]">children</code>)
                </label>
                <input
                  id="playground-custom-label"
                  type="text"
                  value={propsState.customLabel}
                  onChange={(e) =>
                    setPropsState((prev) => ({ ...prev, customLabel: e.target.value }))
                  }
                  placeholder={`Custom text for <${activeSpec.name} />...`}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              {/* Boolean Prop Switches Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(
                  [
                    { key: 'spring', label: 'spring', desc: '200ms physics' },
                    { key: 'halo', label: 'halo', desc: '3px focus ring' },
                    { key: 'glass', label: 'glass', desc: 'Backdrop blur' },
                    { key: 'loading', label: 'loading', desc: 'Suspense state' },
                    { key: 'morphSuccess', label: 'morphSuccess', desc: '0ms check morph' },
                    { key: 'disabled', label: 'disabled', desc: ' Inert state' },
                    { key: 'copyable', label: 'copyable', desc: 'Clipboard slot' },
                  ] as const
                ).map((item) => {
                  const isOn = propsState[item.key];
                  return (
                    <button
                      key={item.key}
                      type="button"
                      role="switch"
                      aria-checked={isOn}
                      onClick={() =>
                        setPropsState((prev) => ({
                          ...prev,
                          [item.key]: !isOn,
                        }))
                      }
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isOn
                          ? 'bg-indigo-50/90 dark:bg-indigo-950/70 border-indigo-400 dark:border-indigo-600 text-indigo-900 dark:text-indigo-200'
                          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full gap-1">
                        <span className="font-mono text-[11px] font-bold">{item.label}</span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                            isOn
                              ? 'bg-indigo-600 text-white font-bold'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {isOn ? 'true' : 'false'}
                        </span>
                      </div>
                      <span className="text-[10px] opacity-75 mt-0.5">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. CSS VARIABLES REAL-TIME EDITOR */}
          {(controlMode === 'split' || controlMode === 'css') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  <span>CSS Custom Variables Editor</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Scoped :root Tokens</span>
              </div>

              {/* Accent Color Variable Picker */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    --jx-pg-accent
                  </span>
                  <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {cssVars['--jx-pg-accent']}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-1.5">
                    {ACCENT_PRESETS.map((preset) => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => updateCssVar('--jx-pg-accent', preset.hex)}
                        aria-label={`Set playground accent color to ${preset.name}`}
                        style={{ backgroundColor: preset.hex }}
                        className={`w-5 h-5 rounded-full cursor-pointer transition-transform ${
                          cssVars['--jx-pg-accent'] === preset.hex
                            ? 'ring-2 ring-indigo-500 ring-offset-2 scale-110'
                            : 'opacity-75 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    aria-label="Custom hex color for --jx-pg-accent"
                    value={cssVars['--jx-pg-accent']}
                    onChange={(e) => updateCssVar('--jx-pg-accent', e.target.value)}
                    className="w-7 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                </div>
              </div>

              {/* Numeric / Dimension CSS Variable Sliders */}
              <div className="space-y-3">
                {PLAYGROUND_CSS_VAR_CONTROLS.filter((c) => c.unit !== 'color').map((ctrl) => {
                  const rawVal = cssVars[ctrl.key];
                  const numericVal = Number.parseFloat(rawVal) || 0;
                  return (
                    <label key={ctrl.key} className="block space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-[11px] font-medium text-slate-700 dark:text-slate-300">
                          {ctrl.key}{' '}
                          <span className="font-sans text-[10px] text-slate-400">
                            ({ctrl.label})
                          </span>
                        </span>
                        <span className="font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                          {rawVal}
                        </span>
                      </div>
                      <input
                        type="range"
                        aria-label={ctrl.label}
                        min={ctrl.min}
                        max={ctrl.max}
                        step={ctrl.step}
                        value={numericVal}
                        onChange={(e) => {
                          const nextVal =
                            ctrl.unit === 'px' ? `${e.target.value}px` : e.target.value;
                          updateCssVar(ctrl.key, nextVal);
                        }}
                        className="w-full accent-indigo-600 cursor-pointer h-1.5"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. COMPONENT V3 MIGRATION CHANGELOG PANEL */}
          {controlMode === 'changelog' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-emerald-500" />
                  <span>&lt;{activeV3Changelog.componentName} /&gt; v3 Migration Changelog</span>
                </h3>
                <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  v3.0.0
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeV3Changelog.summary}
              </p>

              <div className="space-y-3">
                {activeV3Changelog.entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {entry.title}
                      </span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800 shrink-0">
                        {entry.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {entry.description}
                    </p>
                    <div className="grid grid-cols-1 gap-1.5 text-[11px] font-mono pt-1">
                      <div className="px-2.5 py-1 rounded-lg bg-rose-50/70 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/50 truncate">
                        <span className="font-bold mr-1.5">v2 Legacy:</span>
                        {entry.beforeV2}
                      </div>
                      <div className="px-2.5 py-1 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/50 truncate">
                        <span className="font-bold mr-1.5">v3 Upgrade:</span>
                        {entry.afterV3}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
