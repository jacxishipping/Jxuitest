import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Check,
  Search,
  Bell,
  Copy,
  Sliders,
  Layers,
  Terminal,
  Calendar,
  Activity,
  Shield,
  ArrowUpRight,
  Folder,
  FolderOpen,
  FileCode,
  ChevronRight,
  ChevronDown,
  Clock,
  Edit3,
  Plus,
} from 'lucide-react';
import { UnifiedComponentSpec } from '../data/unifiedCatalog';
import { useJXTheme } from '../context/JXThemeContext';
import {
  PlaygroundPropValues,
  PlaygroundCssVariables,
  mapPlaygroundVariantToPrimitive,
  mapPlaygroundColorToPrimitiveTone,
  buildPlaygroundStageStyle,
} from '../utils/jxuiLogic';

const CATEGORY_MODULE_LOADERS: Record<number, () => Promise<Record<string, any>>> = {
  1: () => import('./library/category01Buttons'),
  2: () => import('./library/category02Glassmorphism'),
  3: () => import('./library/category03Navigation'),
  4: () => import('./library/category04Inputs'),
  5: () => import('./library/category05Toggles'),
  6: () => import('./library/category06Modals'),
  7: () => import('./library/category07Feedback'),
  8: () => import('./library/category08Loading'),
  9: () => import('./library/category09Cards'),
  10: () => import('./library/category10DataViz'),
  11: () => import('./library/category11DataGrids'),
  12: () => import('./library/category12DragDrop'),
  13: () => import('./library/category13Layout'),
  14: () => import('./library/category14Animation'),
  15: () => import('./library/category15AI'),
  16: () => import('./library/category16Editors'),
  17: () => import('./library/category17Time'),
  18: () => import('./library/category18Utilities'),
};

const categoryModuleCache: Record<number, Record<string, any>> = {};

const SHOWCASE_LOADERS = {
  inputs: () => import('./inputs'),
  dataDisplay: () => import('./data-display'),
  feedback: () => import('./feedback'),
  surfaces: () => import('./surfaces'),
  navigation: () => import('./navigation'),
  layoutUtils: () => import('./layout-utils'),
};

const showcaseCache: Partial<Record<keyof typeof SHOWCASE_LOADERS, Record<string, any>>> = {};

function getShowcaseBucket(showcaseNumber: number): keyof typeof SHOWCASE_LOADERS | 'enterprise' {
  if (showcaseNumber >= 1 && showcaseNumber <= 14) return 'inputs';
  if (showcaseNumber >= 15 && showcaseNumber <= 24) return 'dataDisplay';
  if (showcaseNumber >= 25 && showcaseNumber <= 30) return 'feedback';
  if (showcaseNumber >= 31 && showcaseNumber <= 34) return 'surfaces';
  if (showcaseNumber >= 35 && showcaseNumber <= 44) return 'navigation';
  if (showcaseNumber >= 45 && showcaseNumber <= 50) return 'layoutUtils';
  return 'enterprise';
}

type PrimitiveStyleVariant = 'solid' | 'soft' | 'outline' | 'glass';
type PrimitiveToneType = 'primary' | 'success' | 'warning' | 'danger';

const LazyPrimitivePreview: React.FC<{
  spec: UnifiedComponentSpec;
  playgroundProps?: PlaygroundPropValues;
}> = ({ spec, playgroundProps }) => {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(() => {
    const cached = categoryModuleCache[spec.categoryNumber];
    return cached ? cached[spec.name] || null : null;
  });
  const [failed, setFailed] = useState(false);
  const [styleVariant, setStyleVariant] = useState<PrimitiveStyleVariant>('solid');
  const [toneType, setToneType] = useState<PrimitiveToneType>('primary');

  useEffect(() => {
    if (!playgroundProps) return;
    setStyleVariant(mapPlaygroundVariantToPrimitive(playgroundProps.variant, playgroundProps.glass));
    setToneType(mapPlaygroundColorToPrimitiveTone(playgroundProps.color));
  }, [playgroundProps]);

  useEffect(() => {
    let active = true;
    const cached = categoryModuleCache[spec.categoryNumber];
    if (cached) {
      const comp = cached[spec.name];
      if (comp) {
        setComponent(() => comp);
      } else {
        setFailed(true);
      }
      return;
    }

    const loader = CATEGORY_MODULE_LOADERS[spec.categoryNumber];
    if (!loader) {
      setFailed(true);
      return;
    }

    loader()
      .then((mod) => {
        categoryModuleCache[spec.categoryNumber] = mod;
        if (!active) return;
        if (mod[spec.name]) {
          setComponent(() => mod[spec.name]);
        } else {
          setFailed(true);
        }
      })
      .catch(() => {
        if (active) setFailed(true);
      });

    return () => {
      active = false;
    };
  }, [spec.categoryNumber, spec.name]);

  if (failed) return null;

  if (!Component) {
    return (
      <div className="w-full py-4 flex items-center justify-center">
        <div className="h-8 w-36 rounded-lg bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
      </div>
    );
  }

  const showButtonStyleControls =
    spec.categoryNumber === 1 || spec.interactiveType === 'button';

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3 overflow-visible">
      <div className="w-full flex items-center justify-center py-1 overflow-visible">
        <Component
          variant={styleVariant}
          tone={toneType}
          size={playgroundProps?.size}
          disabled={playgroundProps?.disabled}
          loading={playgroundProps?.loading}
          label={playgroundProps?.customLabel || undefined}
        />
      </div>

      {showButtonStyleControls && (
        <div className="w-full pt-2 border-t border-slate-200/60 dark:border-slate-800/70 flex flex-wrap items-center justify-between gap-1.5 text-[10px]">
          <div className="inline-flex items-center gap-0.5 p-0.5 rounded-md bg-slate-200/70 dark:bg-slate-800/80">
            {(['solid', 'soft', 'outline', 'glass'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setStyleVariant(v);
                }}
                className={`px-1.5 py-0.5 rounded capitalize font-medium transition-colors cursor-pointer ${
                  styleVariant === v
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="inline-flex items-center gap-1">
            {(
              [
                { id: 'primary', dot: 'bg-indigo-500', label: 'Primary' },
                { id: 'success', dot: 'bg-emerald-500', label: 'Success' },
                { id: 'warning', dot: 'bg-amber-500', label: 'Warning' },
                { id: 'danger', dot: 'bg-rose-500', label: 'Danger' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                title={`Type: ${t.label}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setToneType(t.id);
                }}
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-medium transition-all cursor-pointer ${
                  toneType === t.id
                    ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white shadow-2xs'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`} />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Flagship Showcase Live Previews (#1 - #61)
// ============================================================================

const ShowcaseLivePreview: React.FC<{
  spec: UnifiedComponentSpec;
  playgroundProps?: PlaygroundPropValues;
}> = ({ spec, playgroundProps }) => {
  const { palette, pushToast } = useJXTheme();
  const num = spec.showcaseNumber || 2;
  const bucket = getShowcaseBucket(num);

  const [mod, setMod] = useState<Record<string, any> | null>(() =>
    bucket !== 'enterprise' ? showcaseCache[bucket] || null : {}
  );

  // Interactive states for showcase previews
  const [btnVariant, setBtnVariant] = useState<'contained' | 'soft' | 'outlined' | 'glass' | 'text'>('contained');
  const [btnColor, setBtnColor] = useState<'primary' | 'secondary' | 'success' | 'warning' | 'error'>('primary');
  const [btnMorph, setBtnMorph] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!playgroundProps) return;
    setBtnVariant(playgroundProps.glass ? 'glass' : playgroundProps.variant);
    setBtnColor(playgroundProps.color);
    if (playgroundProps.loading) {
      setBtnMorph('loading');
    } else if (playgroundProps.morphSuccess) {
      setBtnMorph('success');
    } else {
      setBtnMorph('idle');
    }
    if (playgroundProps.color === 'success' || playgroundProps.color === 'warning' || playgroundProps.color === 'error') {
      setAlertSev(playgroundProps.color);
    } else {
      setAlertSev('info');
    }
  }, [playgroundProps]);

  const [autoVal, setAutoVal] = useState<string[]>(['u1']);
  const [segView, setSegView] = useState('board');
  const [checkedCard, setCheckedCard] = useState(true);
  const [fabExtended, setFabExtended] = useState(true);
  const [fabBadge, setFabBadge] = useState(4);
  const [numVal, setNumVal] = useState(64);
  const [numUnit, setNumUnit] = useState('GB');
  const [radioVal, setRadioVal] = useState('pro');
  const [ratingVal, setRatingVal] = useState(4.5);
  const [ratingPreset, setRatingPreset] = useState<'star' | 'heart' | 'emoji'>('star');
  const [selectVal, setSelectVal] = useState('us-east-1');
  const [sliderVal, setSliderVal] = useState(140);
  const [switchVal, setSwitchVal] = useState(true);
  const [textVal, setTextVal] = useState('JxUi#2026!Key');
  const [toggleVal, setToggleVal] = useState('24h');
  const [leftList, setLeftList] = useState(['read:metrics', 'write:Edge']);
  const [rightList, setRightList] = useState(['admin:clusters']);
  const [avatarShape, setAvatarShape] = useState<'circle' | 'squircle' | 'hex'>('squircle');
  const [badgeCount, setBadgeCount] = useState(12);
  const [chips, setChips] = useState([
    { id: '1', label: 'Cluster: Ready', tone: 'emerald' as const },
    { id: '2', label: 'TLS 1.3', tone: 'indigo' as const },
    { id: '3', label: '99.99% SLA', tone: 'sky' as const },
  ]);
  const [dividerOpen, setDividerOpen] = useState(false);
  const [alertSev, setAlertSev] = useState<'warning' | 'success' | 'info' | 'error'>('warning');
  const [progressVal, setProgressVal] = useState(76);
  const [skeletonPreset, setSkeletonPreset] = useState<'card' | 'table' | 'profile'>('card');
  const [accordionVariant, setAccordionVariant] = useState<'bento' | 'contiguous'>('bento');
  const [tabMode, setTabMode] = useState<'pill' | 'underline'>('pill');

  // Enterprise (#51 - #61) local states
  const [gridSortAsc, setGridSortAsc] = useState(true);
  const [gridSelected, setGridSelected] = useState<string[]>(['srv-01']);
  const [datePreset, setDatePreset] = useState<'7d' | '14d' | '30d' | '90d'>('14d');
  const [timeHour, setTimeHour] = useState('09');
  const [timeMin, setTimeMin] = useState('30');
  const [timePeriod, setTimePeriod] = useState<'AM' | 'PM'>('AM');
  const [treeExpanded, setTreeExpanded] = useState<Record<string, boolean>>({ src: true, components: true });
  const [chartMetric, setChartMetric] = useState<'RPS' | 'Latency'>('RPS');
  const [gaugeVal, setGaugeVal] = useState(84);
  const [cmdQuery, setCmdQuery] = useState('');
  const [inlineEditing, setInlineEditing] = useState(false);
  const [inlineText, setInlineText] = useState('production-us-east-cluster');

  useEffect(() => {
    if (bucket === 'enterprise') return;
    if (showcaseCache[bucket]) {
      setMod(showcaseCache[bucket]!);
      return;
    }
    let active = true;
    SHOWCASE_LOADERS[bucket]().then((loaded) => {
      showcaseCache[bucket] = loaded;
      if (active) setMod(loaded);
    });
    return () => {
      active = false;
    };
  }, [bucket]);

  if (!mod) {
    return (
      <div className="w-full py-4 flex items-center justify-center">
        <div className="h-9 w-40 rounded-lg bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
      </div>
    );
  }

  const triggerButtonMorph = (simulateError = false) => {
    if (btnMorph !== 'idle') return;
    setBtnMorph('loading');
    setTimeout(() => {
      setBtnMorph(simulateError ? 'error' : 'success');
      setTimeout(() => setBtnMorph('idle'), 1600);
    }, 650);
  };

  switch (num) {
    case 1: {
      const { JXAutocomplete } = mod;
      return (
        <div className="w-full">
          <JXAutocomplete
            label="Assign Reviewers"
            multiple
            value={autoVal}
            onChange={(next: string | string[]) => setAutoVal(Array.isArray(next) ? next : [next])}
            options={[
              { id: 'u1', label: 'Elena Rostova', subtitle: 'Principal Architect', group: 'Core', shortcut: '⌘1' },
              { id: 'u2', label: 'Marcus Vance', subtitle: 'Staff Systems Eng', group: 'Core', shortcut: '⌘2' },
              { id: 'u3', label: 'Sora Takahashi', subtitle: 'Design Systems', group: 'UI', shortcut: '⌘3' },
            ]}
          />
        </div>
      );
    }
    case 2: {
      const { JXButton } = mod;
      return (
        <div className="w-full space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <JXButton
              variant={btnVariant}
              color={btnColor}
              size={playgroundProps?.size}
              disabled={playgroundProps?.disabled}
              morphState={btnMorph}
              loadingLabel="Deploying..."
              successLabel="Deployed (0ms Shift)"
              errorLabel="Failed Check"
              startIcon={<Sparkles className="w-3.5 h-3.5" />}
              onClick={() => triggerButtonMorph(btnColor === 'error')}
            >
              {playgroundProps?.customLabel?.trim() || 'Deploy Build'}
            </JXButton>
            <JXButton
              variant="soft"
              color="error"
              size="sm"
              lockWidth={false}
              onClick={() => triggerButtonMorph(true)}
            >
              Error Shake
            </JXButton>
          </div>

          {/* Interactive Button Styles & Types Bar */}
          <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800/70 flex flex-wrap items-center justify-between gap-1.5 text-[10px]">
            <div className="inline-flex items-center gap-0.5 p-0.5 rounded-md bg-slate-200/70 dark:bg-slate-800/80">
              {(['contained', 'soft', 'outlined', 'glass', 'text'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setBtnVariant(v)}
                  className={`px-1.5 py-0.5 rounded capitalize font-medium transition-colors cursor-pointer ${
                    btnVariant === v
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {(
                [
                  { id: 'primary', dot: 'bg-indigo-500' },
                  { id: 'secondary', dot: 'bg-slate-800 dark:bg-slate-200' },
                  { id: 'success', dot: 'bg-emerald-500' },
                  { id: 'warning', dot: 'bg-amber-500' },
                  { id: 'error', dot: 'bg-rose-500' },
                ] as const
              ).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  title={`Color: ${c.id}`}
                  onClick={() => setBtnColor(c.id)}
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border capitalize whitespace-nowrap cursor-pointer ${
                    btnColor === c.id
                      ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-semibold'
                      : 'border-transparent text-slate-500'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                  <span>{c.id}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }
    case 3: {
      const { JXButtonGroup } = mod;
      return (
        <div className="w-full flex justify-center">
          <JXButtonGroup
            items={[
              { id: 'board', label: 'Board' },
              { id: 'timeline', label: 'Timeline' },
              { id: 'metrics', label: 'Metrics' },
            ]}
            activeId={segView}
            onChange={setSegView}
            splitActionLabel={`Export ${segView}`}
            onSplitPrimaryClick={(active: string) =>
              pushToast({ title: `Exporting ${active} view`, variant: 'success' })
            }
          />
        </div>
      );
    }
    case 4: {
      const { JXCheckbox } = mod;
      return (
        <div className="w-full">
          <JXCheckbox
            variant="card"
            checked={checkedCard}
            onChange={setCheckedCard}
            title="Global Anycast Edge Network"
            description="Route traffic across 310 PoP locations"
            badge="0ms cold start"
          />
        </div>
      );
    }
    case 5: {
      const { JXFab } = mod;
      return (
        <div className="w-full flex flex-col items-center gap-2.5">
          <JXFab
            label="New Deployment"
            extended={fabExtended}
            badgeCount={fabBadge}
            onClick={() => setFabBadge((n) => n + 1)}
          />
          <div className="flex items-center gap-2 text-[10px]">
            <button
              type="button"
              onClick={() => setFabExtended((e) => !e)}
              className="px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
            >
              {fabExtended ? 'Collapse Pill' : 'Expand Pill'}
            </button>
            <button
              type="button"
              onClick={() => setFabBadge((b) => b + 1)}
              className="px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono cursor-pointer"
            >
              +1 Badge ({fabBadge})
            </button>
          </div>
        </div>
      );
    }
    case 6: {
      const { JXNumberField } = mod;
      return (
        <div className="w-full">
          <JXNumberField
            label="Memory Allocation"
            value={numVal}
            onChange={setNumVal}
            min={0}
            max={512}
            step={8}
            unit={numUnit}
            unitOptions={['GB', 'MB', '%']}
            onUnitChange={setNumUnit}
            scrubbableLabel
          />
        </div>
      );
    }
    case 7: {
      const { JXRadioGroup } = mod;
      return (
        <div className="w-full">
          <JXRadioGroup
            variant="bento-cards"
            ariaLabel="Compute Tier"
            value={radioVal}
            onChange={setRadioVal}
            options={[
              { value: 'starter', title: 'Developer Sandbox', specs: '4 vCPU · 8 GB', price: '$19/mo' },
              { value: 'pro', title: 'Production HA', specs: '16 vCPU · 64 GB', price: '$79/mo' },
            ]}
          />
        </div>
      );
    }
    case 8: {
      const { JXRating } = mod;
      return (
        <div className="w-full flex justify-center">
          <JXRating
            value={ratingVal}
            onChange={setRatingVal}
            preset={ratingPreset}
            onPresetChange={setRatingPreset}
            showPresetSwitcher
            showSentimentBadge
          />
        </div>
      );
    }
    case 9: {
      const { JXSelect } = mod;
      return (
        <div className="w-full">
          <JXSelect
            label="Cloud Region"
            value={selectVal}
            onChange={setSelectVal}
            searchable
            options={[
              { id: 'us-east-1', label: 'N. Virginia (us-east-1)', meta: '11 ms', status: 'Healthy' },
              { id: 'eu-central-1', label: 'Frankfurt (eu-central-1)', meta: '24 ms', status: 'Healthy' },
              { id: 'ap-northeast-1', label: 'Tokyo (ap-northeast-1)', meta: '42 ms', status: 'Healthy' },
            ]}
          />
        </div>
      );
    }
    case 10: {
      const { JXSlider } = mod;
      return (
        <div className="w-full">
          <JXSlider
            label="Latency Budget"
            value={sliderVal}
            onChange={setSliderVal}
            min={20}
            max={480}
            step={10}
            unit="ms"
            showHistogram
          />
        </div>
      );
    }
    case 11: {
      const { JXSwitch } = mod;
      return (
        <div className="w-full">
          <JXSwitch
            cardMode
            trackIcons
            checked={switchVal}
            onChange={setSwitchVal}
            label="Blue/Green Zero-Downtime"
            helperText="Automatic health probe verification"
          />
        </div>
      );
    }
    case 12: {
      const { JXTextField } = mod;
      return (
        <div className="w-full">
          <JXTextField
            label="Signing Secret"
            type="password"
            value={textVal}
            onChange={setTextVal}
            clearable
            copyable
            showEntropyMeter
          />
        </div>
      );
    }
    case 13: {
      const { JXToggleButtonGroup } = mod;
      return (
        <div className="w-full flex justify-center">
          <JXToggleButtonGroup
            value={toggleVal}
            onChange={setToggleVal}
            ariaLabel="Time Window"
          />
        </div>
      );
    }
    case 14: {
      const { JXTransferList } = mod;
      return (
        <div className="w-full">
          <JXTransferList
            leftItems={leftList}
            rightItems={rightList}
            onChange={(l: string[], r: string[]) => {
              setLeftList(l);
              setRightList(r);
            }}
            leftTitle="Available"
            rightTitle="Granted"
          />
        </div>
      );
    }
    case 15: {
      const { JXAvatarGroup } = mod;
      return (
        <div className="w-full flex justify-center">
          <JXAvatarGroup
            items={[
              { name: 'Elena Rostova', role: 'Architect', gradientClass: 'from-indigo-500 to-violet-500' },
              { name: 'Marcus Vance', role: 'Staff Eng', gradientClass: 'from-emerald-500 to-teal-500' },
              { name: 'Sora Takahashi', role: 'Design Lead', gradientClass: 'from-rose-500 to-orange-500' },
              { name: 'Liam O’Connor', role: 'A11y Lead', gradientClass: 'from-sky-500 to-blue-600' },
            ]}
            max={4}
            shape={avatarShape}
            onShapeChange={setAvatarShape}
            showShapeToggle
            interactiveFanOut
          />
        </div>
      );
    }
    case 16: {
      const { JXBadge } = mod;
      return (
        <div className="w-full flex justify-center">
          <JXBadge count={badgeCount} showInteractiveControls onCountChange={setBadgeCount} />
        </div>
      );
    }
    case 17: {
      const { JXChip } = mod;
      return (
        <div className="w-full flex flex-wrap items-center justify-center gap-2">
          {chips.map((c) => (
            <JXChip
              key={c.id}
              label={c.label}
              tone={c.tone}
              onDelete={() => setChips((prev) => prev.filter((item) => item.id !== c.id))}
            />
          ))}
          {chips.length < 3 && (
            <button
              type="button"
              onClick={() =>
                setChips([
                  { id: '1', label: 'Cluster: Ready', tone: 'emerald' },
                  { id: '2', label: 'TLS 1.3', tone: 'indigo' },
                  { id: '3', label: '99.99% SLA', tone: 'sky' },
                ])
              }
              className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 underline cursor-pointer"
            >
              Reset Chips
            </button>
          )}
        </div>
      );
    }
    case 18: {
      const { JXDivider } = mod;
      return (
        <div className="w-full space-y-2">
          <JXDivider
            variant="radial-fade"
            expanded={dividerOpen}
            actionLabel={dividerOpen ? 'Hide Older Logs' : 'Expand 8 Older Events'}
            onAction={() => setDividerOpen((o) => !o)}
          />
          {dividerOpen && (
            <div className="text-[11px] font-mono text-slate-500 text-center">
              14:02:11 · Rebalanced shard replica #04
            </div>
          )}
        </div>
      );
    }
    case 19: {
      const { JXIcon } = mod;
      return (
        <div className="w-full flex items-center justify-around">
          <JXIcon icon={<Sparkles className="w-4 h-4" />} label="Bounce" hoverAnimation="bounce" />
          <JXIcon icon={<Layers className="w-4 h-4" />} label="Scale" hoverAnimation="scale" />
          <JXIcon icon={<Shield className="w-4 h-4" />} label="Rotate" hoverAnimation="rotate" />
          <JXIcon icon={<Terminal className="w-4 h-4" />} label="Lift" hoverAnimation="lift" />
        </div>
      );
    }
    case 20: {
      const { JXImageList } = mod;
      return (
        <div className="w-full">
          <JXImageList
            cols={3}
            lightbox
            items={[
              { title: 'Glass Tokens', subtitle: 'Blur 16px', gradient: 'from-indigo-500/20 to-sky-500/20' },
              { title: 'Spring Physics', subtitle: 'Stiffness 380', gradient: 'from-emerald-500/20 to-cyan-500/20' },
              { title: 'Zero Shift', subtitle: 'Tabular Grid', gradient: 'from-rose-500/20 to-amber-500/20' },
            ]}
          />
        </div>
      );
    }
    case 21: {
      const { JXList } = mod;
      return (
        <div className="w-full">
          <JXList folderTitle="packages/jxui-core" />
        </div>
      );
    }
    case 22: {
      const { JXTable } = mod;
      return (
        <div className="w-full">
          <JXTable />
        </div>
      );
    }
    case 23: {
      const { JXTooltip } = mod;
      return (
        <div className="w-full flex justify-center">
          <JXTooltip
            title="Node us-east-1a"
            shortcut="⌘I"
            metrics={[
              { label: 'CPU', value: '34.2%', highlight: true },
              { label: 'MEM', value: '12.4 GB' },
            ]}
          />
        </div>
      );
    }
    case 24: {
      const { JXTypography } = mod;
      return (
        <div className="w-full">
          <JXTypography />
        </div>
      );
    }
    case 25: {
      const { JXAlert } = mod;
      return (
        <div className="w-full space-y-2">
          <JXAlert severity={alertSev} />
          <div className="flex items-center justify-end gap-1">
            {(['warning', 'success', 'info', 'error'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setAlertSev(s)}
                className={`px-2 py-0.5 text-[10px] rounded capitalize cursor-pointer ${
                  alertSev === s
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                    : 'text-slate-500'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      );
    }
    case 26: {
      const { JXBackdrop } = mod;
      return (
        <div className="w-full">
          <JXBackdrop />
        </div>
      );
    }
    case 27: {
      const { JXDialog } = mod;
      return (
        <div className="w-full">
          <JXDialog destructiveGuard />
        </div>
      );
    }
    case 28: {
      const { JXProgress } = mod;
      return (
        <div className="w-full">
          <JXProgress value={progressVal} onChange={setProgressVal} />
        </div>
      );
    }
    case 29: {
      const { JXSkeleton } = mod;
      return (
        <div className="w-full">
          <JXSkeleton preset={skeletonPreset} onPresetChange={setSkeletonPreset} showPresetSwitcher />
        </div>
      );
    }
    case 30: {
      const { JXSnackbar } = mod;
      return (
        <div className="w-full">
          <JXSnackbar />
        </div>
      );
    }
    case 31: {
      const { JXAccordion } = mod;
      return (
        <div className="w-full space-y-2">
          <JXAccordion variant={accordionVariant} iconMode="plus-cross" />
          <div className="flex justify-end gap-1">
            {(['bento', 'contiguous'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setAccordionVariant(v)}
                className={`px-2 py-0.5 text-[10px] rounded capitalize cursor-pointer ${
                  accordionVariant === v
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      );
    }
    case 32: {
      const { JXAppBar } = mod;
      return (
        <div className="w-full">
          <JXAppBar />
        </div>
      );
    }
    case 33: {
      const { JXCard, JXCardHeader, JXCardContent } = mod;
      return (
        <div className="w-full">
          <JXCard spotlight hoverLift>
            <JXCardHeader title="Edge Computing Cluster" subheader="Bento Interactive Surface" />
            <JXCardContent>
              <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-300">
                <span>p99: 11.4ms</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">99.98% SLA</span>
              </div>
            </JXCardContent>
          </JXCard>
        </div>
      );
    }
    case 34: {
      const { JXPaper } = mod;
      return (
        <div className="w-full">
          <JXPaper showTierSwitcher />
        </div>
      );
    }
    case 35: {
      const { JXBottomNavigation } = mod;
      return (
        <div className="w-full">
          <JXBottomNavigation />
        </div>
      );
    }
    case 36: {
      const { JXBreadcrumbs } = mod;
      return (
        <div className="w-full">
          <JXBreadcrumbs />
        </div>
      );
    }
    case 37: {
      const { JXDrawer } = mod;
      return (
        <div className="w-full">
          <JXDrawer />
        </div>
      );
    }
    case 38: {
      const { JXLink } = mod;
      return (
        <div className="w-full flex items-center justify-center gap-4 py-2">
          <JXLink href="https://mui.com" external previewTitle="Material UI Spec">
            MUI Reference
          </JXLink>
          <JXLink href="#jx-explorer-grid" previewTitle="361 Component Grid">
            Explore Grid
          </JXLink>
        </div>
      );
    }
    case 39: {
      const { JXMenu } = mod;
      return (
        <div className="w-full flex justify-center">
          <JXMenu />
        </div>
      );
    }
    case 40: {
      const { JXPagination } = mod;
      return (
        <div className="w-full flex justify-center">
          <JXPagination showFirstLastButtons />
        </div>
      );
    }
    case 41: {
      const { JXSpeedDial } = mod;
      return (
        <div className="w-full flex justify-center">
          <JXSpeedDial
            onActionSelect={(act: { label: string }) =>
              pushToast({ title: `Executed ${act.label}`, variant: 'default' })
            }
          />
        </div>
      );
    }
    case 42: {
      const { JXStepper } = mod;
      return (
        <div className="w-full">
          <JXStepper />
        </div>
      );
    }
    case 43: {
      const { JXTabs } = mod;
      return (
        <div className="w-full space-y-2">
          <JXTabs indicatorVariant={tabMode} />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setTabMode((m) => (m === 'pill' ? 'underline' : 'pill'))}
              className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              Indicator: {tabMode}
            </button>
          </div>
        </div>
      );
    }
    case 44: {
      const { JXNavigationRail } = mod;
      return (
        <div className="w-full">
          <JXNavigationRail />
        </div>
      );
    }
    case 45: {
      const { JXContainer } = mod;
      return (
        <div className="w-full">
          <JXContainer interactiveDemo />
        </div>
      );
    }
    case 46: {
      const { JXGrid } = mod;
      return (
        <div className="w-full">
          <JXGrid bentoPreset />
        </div>
      );
    }
    case 47: {
      const { JXStack } = mod;
      return (
        <div className="w-full">
          <JXStack interactiveControls items={['Node A', 'Node B', 'Node C']} />
        </div>
      );
    }
    case 48: {
      const { JXMasonry } = mod;
      return (
        <div className="w-full">
          <JXMasonry />
        </div>
      );
    }
    case 49: {
      const { JXTimeline } = mod;
      return (
        <div className="w-full">
          <JXTimeline />
        </div>
      );
    }
    case 50: {
      const { JXTextareaAutosize } = mod;
      return (
        <div className="w-full">
          <JXTextareaAutosize aria-label="Release notes composer" />
        </div>
      );
    }
    case 51: {
      // JXDataGrid
      const rows = [
        { id: 'srv-01', region: 'us-east-1', latency: 11, status: 'Healthy' },
        { id: 'srv-02', region: 'eu-central-1', latency: 24, status: 'Healthy' },
        { id: 'srv-03', region: 'ap-northeast-1', latency: 41, status: 'Syncing' },
      ].sort((a, b) => (gridSortAsc ? a.latency - b.latency : b.latency - a.latency));
      return (
        <div className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden text-xs">
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-200">
              JXDataGrid ({gridSelected.length} selected)
            </span>
            <button
              type="button"
              onClick={() => setGridSortAsc((s) => !s)}
              className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-mono cursor-pointer"
            >
              Sort Latency {gridSortAsc ? '↑' : '↓'}
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((r) => {
              const sel = gridSelected.includes(r.id);
              return (
                <div
                  key={r.id}
                  onClick={() =>
                    setGridSelected((prev) =>
                      sel ? prev.filter((x) => x !== r.id) : [...prev, r.id]
                    )
                  }
                  className={`px-3 py-2 flex items-center justify-between cursor-pointer transition-colors ${
                    sel ? 'bg-indigo-50/60 dark:bg-indigo-950/30' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={sel} readOnly className="rounded accent-indigo-600" />
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{r.id}</span>
                    <span className="text-slate-500">{r.region}</span>
                  </div>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">{r.latency} ms</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    case 52: {
      // JXDateRangePicker
      return (
        <div className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              Window: Last {datePreset}
            </span>
            <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5">
              {(['7d', '14d', '30d', '90d'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setDatePreset(p)}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded-md cursor-pointer ${
                    datePreset === p
                      ? `${palette.bg} text-white font-semibold`
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono">
            {[12, 13, 14, 15, 16, 17, 18].map((d, i) => (
              <div
                key={d}
                className={`py-1.5 rounded-md ${
                  i === 0 || i === 6
                    ? `${palette.bg} text-white font-bold`
                    : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                }`}
              >
                {d}
              </div>
            ))}
          </div>
        </div>
      );
    }
    case 53: {
      // JXTimePicker
      return (
        <div className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span className="font-mono text-sm">
              {timeHour}:{timeMin} {timePeriod}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs font-mono">
            <select
              aria-label="Hour"
              value={timeHour}
              onChange={(e) => setTimeHour(e.target.value)}
              className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            >
              {['08', '09', '10', '11', '12'].map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <span>:</span>
            <select
              aria-label="Minute"
              value={timeMin}
              onChange={(e) => setTimeMin(e.target.value)}
              className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            >
              {['00', '15', '30', '45'].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setTimePeriod((p) => (p === 'AM' ? 'PM' : 'AM'))}
              className={`px-2 py-1 rounded-lg font-bold text-white ${palette.bg} cursor-pointer`}
            >
              {timePeriod}
            </button>
          </div>
        </div>
      );
    }
    case 54: {
      // JXRichTreeView
      return (
        <div className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-xs font-mono space-y-1">
          <button
            type="button"
            onClick={() => setTreeExpanded((p) => ({ ...p, src: !p.src }))}
            className="w-full flex items-center gap-1.5 py-1 px-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-left cursor-pointer"
          >
            {treeExpanded.src ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            {treeExpanded.src ? (
              <FolderOpen className="w-3.5 h-3.5 text-indigo-500" />
            ) : (
              <Folder className="w-3.5 h-3.5 text-indigo-500" />
            )}
            <span className="font-semibold text-slate-800 dark:text-slate-200">src/components</span>
          </button>
          {treeExpanded.src && (
            <div className="pl-5 space-y-1 border-l border-slate-200 dark:border-slate-800 ml-2">
              <div className="flex items-center gap-1.5 py-0.5 text-slate-600 dark:text-slate-400">
                <FileCode className="w-3.5 h-3.5 text-emerald-500" />
                <span>JXButton.tsx</span>
              </div>
              <div className="flex items-center gap-1.5 py-0.5 text-slate-600 dark:text-slate-400">
                <FileCode className="w-3.5 h-3.5 text-sky-500" />
                <span>JXDataGrid.tsx</span>
              </div>
            </div>
          )}
        </div>
      );
    }
    case 55:
    case 56: {
      // JXCharts / JXSparkline
      const bars = chartMetric === 'RPS' ? [42, 68, 55, 84, 76, 95, 88] : [28, 24, 19, 22, 16, 14, 12];
      return (
        <div className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {chartMetric === 'RPS' ? '94.2k req/s' : '12.4 ms p99'}
            </span>
            <div className="inline-flex rounded-md bg-slate-100 dark:bg-slate-800 p-0.5 text-[10px]">
              {(['RPS', 'Latency'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setChartMetric(m)}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    chartMetric === m
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-2xs'
                      : 'text-slate-500'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="h-14 flex items-end gap-1.5 pt-2">
            {bars.map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}%` }}
                className={`flex-1 rounded-t-md transition-all duration-300 ${palette.bg} opacity-85 hover:opacity-100`}
              />
            ))}
          </div>
        </div>
      );
    }
    case 57: {
      // JXGauge
      return (
        <div className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Cluster Health Score</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{gaugeVal}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-200"
              style={{ width: `${gaugeVal}%` }}
            />
          </div>
          <input
            type="range"
            aria-label="Gauge value"
            min={10}
            max={100}
            value={gaugeVal}
            onChange={(e) => setGaugeVal(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer h-1.5"
          />
        </div>
      );
    }
    case 58: {
      // JXCommandPalette
      const cmds = ['Deploy Production Cluster', 'Toggle Dark Mode', 'Export Figma Tokens'].filter((c) =>
        c.toLowerCase().includes(cmdQuery.toLowerCase())
      );
      return (
        <div className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden text-xs">
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={cmdQuery}
              onChange={(e) => setCmdQuery(e.target.value)}
              placeholder="Type a command (⌘K)..."
              className="w-full bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none text-xs"
            />
          </div>
          <div className="p-1.5 space-y-0.5">
            {cmds.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => pushToast({ title: `Executed: ${c}`, variant: 'success' })}
                className="w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <span>{c}</span>
                <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                  ↵
                </kbd>
              </button>
            ))}
          </div>
        </div>
      );
    }
    case 59: {
      // JXBentoCard
      return (
        <div className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-xs hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white">Multi-Region Edge Mesh</span>
            <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Active
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            310 global PoPs with hardware-accelerated TLS 1.3 termination.
          </p>
        </div>
      );
    }
    case 60: {
      // JXInlineEdit
      return (
        <div className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 flex items-center justify-between gap-2">
          {inlineEditing ? (
            <input
              type="text"
              value={inlineText}
              onChange={(e) => setInlineText(e.target.value)}
              onBlur={() => setInlineEditing(false)}
              onKeyDown={(e) => e.key === 'Enter' && setInlineEditing(false)}
              autoFocus
              className="flex-1 px-2 py-1 text-xs font-mono rounded border border-indigo-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
          ) : (
            <button
              type="button"
              onClick={() => setInlineEditing(true)}
              className="flex-1 flex items-center justify-between px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-left cursor-pointer"
            >
              <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">
                {inlineText}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-indigo-600 dark:text-indigo-400">
                <Edit3 className="w-3 h-3" /> Edit
              </span>
            </button>
          )}
        </div>
      );
    }
    default: {
      // #61 JXEmptyState
      return (
        <div className="w-full rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 p-4 text-center space-y-2">
          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            No Deployment Pipelines Configured
          </div>
          <p className="text-[11px] text-slate-500">
            Start from a verified starter template or connect your repository.
          </p>
          <button
            type="button"
            onClick={() => pushToast({ title: 'Created starter pipeline', variant: 'success' })}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white ${palette.bg} cursor-pointer`}
          >
            <Plus className="w-3.5 h-3.5" /> Create Pipeline
          </button>
        </div>
      );
    }
  }
};

export interface InteractiveComponentPreviewProps {
  spec: UnifiedComponentSpec;
  onOpenDocs?: (spec: UnifiedComponentSpec) => void;
  onJumpToShowcase?: (specNumber: number) => void;
  playgroundProps?: PlaygroundPropValues;
  playgroundCssVars?: PlaygroundCssVariables;
}

export const InteractiveComponentPreview: React.FC<InteractiveComponentPreviewProps> = ({
  spec,
  playgroundProps,
  playgroundCssVars,
}) => {
  const hasPlaygroundOverrides = Boolean(playgroundProps || playgroundCssVars);
  const stageStyle = playgroundCssVars
    ? buildPlaygroundStageStyle(playgroundCssVars, playgroundProps)
    : undefined;

  const content =
    spec.tier === 'showcase' ? (
      <ShowcaseLivePreview spec={spec} playgroundProps={playgroundProps} />
    ) : (
      <LazyPrimitivePreview spec={spec} playgroundProps={playgroundProps} />
    );

  if (!hasPlaygroundOverrides) {
    return content;
  }

  return (
    <div
      data-testid={`playground-stage-${spec.id}`}
      style={stageStyle}
      className={`w-full flex flex-col items-center justify-center border border-slate-200/70 dark:border-slate-800/80 ${
        playgroundProps?.glass || playgroundProps?.variant === 'glass'
          ? 'bg-white/75 dark:bg-slate-900/75'
          : 'bg-white/95 dark:bg-slate-900/95'
      }`}
    >
      {playgroundProps?.loading && spec.showcaseNumber !== 2 && (
        <div className="mb-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300 text-[10px] font-mono">
          <Sparkles className="w-3 h-3 animate-spin" />
          <span>loading=true · Live Suspense Active</span>
        </div>
      )}
      {playgroundProps?.morphSuccess && spec.showcaseNumber !== 2 && (
        <div className="mb-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-300 text-[10px] font-mono">
          <Check className="w-3 h-3" />
          <span>morphSuccess=true · 0ms Layout Shift</span>
        </div>
      )}
      {content}
    </div>
  );
};
