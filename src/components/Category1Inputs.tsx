import React, { useState } from 'react';
import { Sparkles, Server, ShieldCheck, Cpu } from 'lucide-react';
import { COMPONENT_CATALOG } from '../data/catalog';
import { ShowcaseCard } from './ShowcaseCard';
import { useJXTheme } from '../context/JXThemeContext';
import {
  JXAutocomplete,
  JXAutocompleteOption,
  JXButton,
  JXButtonMorphState,
  JXButtonGroup,
  JXCheckbox,
  JXFab,
  JXNumberField,
  JXRadioGroup,
  JXRating,
  JXRatingPreset,
  JXSelect,
  JXSelectOption,
  JXSlider,
  JXSwitch,
  JXTextField,
  JXToggleButtonGroup,
  JXTransferList,
} from './inputs';

const TEAM_OPTIONS: JXAutocompleteOption[] = [
  {
    id: 'u1',
    label: 'Elena Rostova',
    subtitle: 'Principal Architect',
    group: 'Platform Core',
    meta: 'Platform Core',
    shortcut: '⌘1',
  },
  {
    id: 'u2',
    label: 'Marcus Vance',
    subtitle: 'Staff Systems Eng',
    group: 'Platform Core',
    meta: 'Platform Core',
    shortcut: '⌘2',
  },
  {
    id: 'u3',
    label: 'Sora Takahashi',
    subtitle: 'Design Systems Lead',
    group: 'Design Engineering',
    meta: 'Design Engineering',
    shortcut: '⌘3',
  },
  {
    id: 'u4',
    label: 'Liam O’Connor',
    subtitle: 'Accessibility Specialist',
    group: 'Design Engineering',
    meta: 'Design Engineering',
    shortcut: '⌘4',
  },
  {
    id: 'u5',
    label: 'Nadia Al-Mansoor',
    subtitle: 'Security Infrastructure',
    group: 'Edge Runtime',
    meta: 'Edge Runtime',
    shortcut: '⌘5',
  },
];

const REGION_OPTIONS: JXSelectOption[] = [
  { id: 'us-east-1', label: 'N. Virginia (us-east-1)', meta: '11 ms', status: 'Healthy' },
  { id: 'eu-central-1', label: 'Frankfurt (eu-central-1)', meta: '24 ms', status: 'Healthy' },
  { id: 'ap-northeast-1', label: 'Tokyo (ap-northeast-1)', meta: '42 ms', status: 'Healthy' },
  { id: 'us-west-2', label: 'Oregon (us-west-2)', meta: '31 ms', status: 'Healthy' },
  { id: 'sa-east-1', label: 'São Paulo (sa-east-1)', meta: '68 ms', status: 'Degraded' },
  { id: 'ap-southeast-1', label: 'Singapore (ap-southeast-1)', meta: '53 ms', status: 'Healthy' },
  { id: 'eu-west-1', label: 'Dublin (eu-west-1)', meta: '28 ms', status: 'Healthy' },
];

export const Category1Inputs: React.FC = () => {
  const { pushToast } = useJXTheme();
  const specs = COMPONENT_CATALOG.filter((c) => c.category === 'inputs');
  const getSpec = (num: number) => specs.find((s) => s.number === num)!;

  // 1. JXAutocomplete state
  const [selectedUsers, setSelectedUsers] = useState<string[]>(['u1', 'u3']);
  const [autoLoading, setAutoLoading] = useState(false);

  // 2. JXButton 3-state morphing state
  const [btnState, setBtnState] = useState<JXButtonMorphState>('idle');
  const [btnVariant, setBtnVariant] = useState<'contained' | 'soft' | 'outlined'>('contained');

  // 3. JXButtonGroup state
  const [segView, setSegView] = useState<string>('board');

  // 4. JXCheckbox state
  const [checkedCards, setCheckedCards] = useState<Record<string, boolean>>({
    edge: true,
    waf: true,
    ddos: false,
  });

  // 5. JXFab state
  const [fabCollapsed, setFabCollapsed] = useState(false);
  const [fabCount, setFabCount] = useState(3);

  // 6. JXNumberField state
  const [numVal, setNumVal] = useState(32);
  const [numUnit, setNumUnit] = useState<string>('GB');

  // 7. JXRadioGroup state
  const [radioPlan, setRadioPlan] = useState<string>('pro');

  // 8. JXRating state
  const [ratingVal, setRatingVal] = useState(4.5);
  const [ratingPreset, setRatingPreset] = useState<JXRatingPreset>('star');

  // 9. JXSelect state
  const [selectedRegion, setSelectedRegion] = useState('us-east-1');

  // 10. JXSlider state
  const [sliderVal, setSliderVal] = useState(140);

  // 11. JXSwitch state
  const [switches, setSwitches] = useState({
    blueGreen: true,
    strictTls: true,
  });

  // 12. JXTextField state
  const [secretInput, setSecretInput] = useState('JxUi#2026!Design');

  // 13. JXToggleButtonGroup state
  const [toggleInterval, setToggleInterval] = useState<string>('24h');

  // 14. JXTransferList state
  const [leftItems, setLeftItems] = useState([
    'read:metrics',
    'write:webhooks',
    'admin:billing',
  ]);
  const [rightItems, setRightItems] = useState([
    'read:clusters',
    'write:deployments',
    'read:audit_log',
  ]);

  const handleMorphClick = (simulateError = false) => {
    if (btnState !== 'idle') return;
    setBtnState('loading');
    setTimeout(() => {
      if (simulateError) {
        setBtnState('error');
        pushToast({
          title: 'Deployment Pre-check Failed',
          description: 'JXButton triggered error shake feedback without layout shift',
          variant: 'error',
        });
      } else {
        setBtnState('success');
        pushToast({
          title: 'Production Release Deployed',
          description: 'JXButton morphed Idle -> Loading -> Success cleanly',
          variant: 'success',
        });
      }
      setTimeout(() => setBtnState('idle'), 2000);
    }, 850);
  };

  return (
    <div className="space-y-8">
      {/* #1 JXAutocomplete */}
      <ShowcaseCard
        spec={getSpec(1)}
        headerControls={
          <button
            type="button"
            onClick={() => {
              setAutoLoading(true);
              setTimeout(() => setAutoLoading(false), 900);
            }}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
          >
            Simulate Async Skeleton
          </button>
        }
      >
        <div className="max-w-xl">
          <JXAutocomplete
            label="Assign Reviewers & Channels (Backspace removes last tag)"
            multiple
            options={TEAM_OPTIONS}
            value={selectedUsers}
            onChange={(next) => setSelectedUsers(Array.isArray(next) ? next : [next])}
            loading={autoLoading}
            placeholder="Filter reviewers by name or department..."
            fuzzyHighlight
          />
        </div>
      </ShowcaseCard>

      {/* #2 JXButton */}
      <ShowcaseCard
        spec={getSpec(2)}
        muiBaselinePreview={
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white uppercase tracking-wider text-xs font-medium rounded-sm shadow-md"
          >
            DEPLOY PRODUCTION BUILD
          </button>
        }
      >
        <div className="flex flex-wrap items-center gap-4">
          <JXButton
            variant={btnVariant}
            morphState={btnState}
            loadingLabel="Verifying Checksums..."
            successLabel="Deployed (0ms Shift)"
            errorLabel="Verification Failed"
            startIcon={<Sparkles className="w-3.5 h-3.5" />}
            onClick={() => handleMorphClick(false)}
          >
            Deploy Production Build
          </JXButton>

          <JXButton
            variant="soft"
            color="error"
            lockWidth={false}
            onClick={() => handleMorphClick(true)}
          >
            Test Error Shake Morph
          </JXButton>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg">
            {(['contained', 'soft', 'outlined'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setBtnVariant(v)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors capitalize ${
                  btnVariant === v
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </ShowcaseCard>

      {/* #3 JXButtonGroup & #13 JXToggleButtonGroup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ShowcaseCard spec={getSpec(3)}>
          <JXButtonGroup
            items={[
              { id: 'board', label: 'board' },
              { id: 'timeline', label: 'timeline' },
              { id: 'metrics', label: 'metrics' },
            ]}
            activeId={segView}
            onChange={setSegView}
            splitActionLabel={`Export ${segView}`}
            onSplitPrimaryClick={(active) =>
              pushToast({ title: `Triggered ${active} export`, variant: 'default' })
            }
            splitMenuItems={[
              {
                id: 'parquet',
                label: 'Export as Parquet',
                onClick: () =>
                  pushToast({ title: 'Exported as Parquet', variant: 'success' }),
              },
              {
                id: 'sync',
                label: 'Schedule Hourly Sync',
                onClick: () =>
                  pushToast({ title: 'Hourly sync scheduled', variant: 'default' }),
              },
            ]}
          />
        </ShowcaseCard>

        <ShowcaseCard spec={getSpec(13)}>
          <JXToggleButtonGroup
            value={toggleInterval}
            onChange={setToggleInterval}
            ariaLabel="Time Window"
            helperText={`Active window: ${toggleInterval} · Recessed track (#F1F5F9) with floating white pill`}
          />
        </ShowcaseCard>
      </div>

      {/* #4 JXCheckbox (Card Mode) & #7 JXRadioGroup (Bento Selection Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ShowcaseCard spec={getSpec(4)}>
          <div className="space-y-2.5">
            <JXCheckbox
              variant="card"
              checked={checkedCards.edge}
              onChange={(val) => setCheckedCards((p) => ({ ...p, edge: val }))}
              title="Global Anycast Edge Network"
              description="Route requests to nearest PoP across 310 cities"
              badge="0ms cold start"
            />
            <JXCheckbox
              variant="card"
              checked={checkedCards.waf}
              onChange={(val) => setCheckedCards((p) => ({ ...p, waf: val }))}
              title="Managed OWASP Core Ruleset"
              description="Zero-config SQLi and XSS payload inspection"
              badge="Recommended"
            />
            <JXCheckbox
              variant="card"
              checked={checkedCards.ddos}
              onChange={(val) => setCheckedCards((p) => ({ ...p, ddos: val }))}
              title="Autonomous L7 DDoS Mitigation"
              description="Real-time fingerprinting and rate-limiting challenge"
              badge="Enterprise"
            />
          </div>
        </ShowcaseCard>

        <ShowcaseCard spec={getSpec(7)}>
          <JXRadioGroup
            variant="bento-cards"
            ariaLabel="Compute Tier"
            value={radioPlan}
            onChange={setRadioPlan}
            options={[
              {
                value: 'starter',
                title: 'Developer Sandbox',
                specs: '4 vCPU · 8 GB NVMe',
                price: '$19/mo',
                icon: <Server className="w-4 h-4" />,
              },
              {
                value: 'pro',
                title: 'Production High-Availability',
                specs: '16 vCPU · 64 GB NVMe · Multi-AZ',
                price: '$79/mo',
                icon: <ShieldCheck className="w-4 h-4" />,
              },
              {
                value: 'metal',
                title: 'Dedicated Bare Metal Node',
                specs: '64 vCPU · 256 GB ECC · 10 Gbps',
                price: '$249/mo',
                icon: <Cpu className="w-4 h-4" />,
              },
            ]}
          />
        </ShowcaseCard>
      </div>

      {/* #5 JXFab, #6 JXNumberField, #8 JXRating */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ShowcaseCard spec={getSpec(5)}>
          <div className="flex flex-col justify-between h-full space-y-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFabCollapsed((c) => !c)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap"
              >
                {fabCollapsed
                  ? 'Simulate Scroll Up (Expand)'
                  : 'Simulate Scroll Down (Collapse)'}
              </button>
              <button
                type="button"
                onClick={() => setFabCount((n) => n + 1)}
                className="px-2.5 py-1.5 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 whitespace-nowrap"
              >
                +1 Alert
              </button>
            </div>
            <div className="py-4 flex items-center justify-center bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              <JXFab
                label="New Deployment"
                extended={!fabCollapsed}
                badgeCount={fabCount}
                onClick={() =>
                  pushToast({
                    title: 'Quick Action Triggered',
                    description: 'Floating Action Island clicked',
                    variant: 'default',
                  })
                }
              />
            </div>
          </div>
        </ShowcaseCard>

        <ShowcaseCard spec={getSpec(6)}>
          <JXNumberField
            label="Allocation Stepper"
            value={numVal}
            onChange={setNumVal}
            min={0}
            max={512}
            step={4}
            unit={numUnit}
            unitOptions={['GB', '$', '%']}
            onUnitChange={setNumUnit}
            scrubbableLabel
            holdAcceleration
          />
        </ShowcaseCard>

        <ShowcaseCard spec={getSpec(8)}>
          <JXRating
            value={ratingVal}
            onChange={setRatingVal}
            preset={ratingPreset}
            onPresetChange={setRatingPreset}
            showPresetSwitcher
            showSentimentBadge
          />
        </ShowcaseCard>
      </div>

      {/* #9 JXSelect, #10 JXSlider, #11 JXSwitch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ShowcaseCard spec={getSpec(9)}>
          <JXSelect
            label="Primary Cloud Region (Searchable > 6 items)"
            options={REGION_OPTIONS}
            value={selectedRegion}
            onChange={setSelectedRegion}
            searchable
          />
        </ShowcaseCard>

        <ShowcaseCard spec={getSpec(10)}>
          <JXSlider
            label="Latency Budget Scrubber"
            value={sliderVal}
            onChange={setSliderVal}
            min={20}
            max={480}
            step={10}
            unit="ms"
            showHistogram
          />
        </ShowcaseCard>

        <ShowcaseCard spec={getSpec(11)}>
          <div className="space-y-2.5">
            <JXSwitch
              cardMode
              trackIcons
              checked={switches.blueGreen}
              onChange={(val) => setSwitches((s) => ({ ...s, blueGreen: val }))}
              label="Blue/Green Zero-Downtime"
              helperText="Verify health probes"
            />
            <JXSwitch
              cardMode
              trackIcons
              checked={switches.strictTls}
              onChange={(val) => setSwitches((s) => ({ ...s, strictTls: val }))}
              label="Strict TLS 1.3 Enforcement"
              helperText="HSTS preload enabled"
            />
          </div>
        </ShowcaseCard>
      </div>

      {/* #12 JXTextField & #14 JXTransferList */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ShowcaseCard spec={getSpec(12)}>
          <JXTextField
            id="jx-smart-secret-input"
            label="Production Signing Secret (Zero-Notch + Live Entropy)"
            type="password"
            value={secretInput}
            onChange={setSecretInput}
            maxLength={64}
            clearable
            copyable
            showEntropyMeter
            showCharacterCounter
            placeholder="Enter signing secret..."
          />
        </ShowcaseCard>

        <ShowcaseCard spec={getSpec(14)}>
          <JXTransferList
            leftItems={leftItems}
            rightItems={rightItems}
            onChange={(l, r) => {
              setLeftItems(l);
              setRightItems(r);
            }}
            leftTitle="Available"
            rightTitle="Granted"
            searchable
          />
        </ShowcaseCard>
      </div>
    </div>
  );
};
