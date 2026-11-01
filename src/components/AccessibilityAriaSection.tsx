import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Keyboard,
  Volume2,
  CheckCircle2,
  XCircle,
  Search,
  RotateCcw,
  FlaskConical,
  ArrowUpRight,
  Eye,
} from 'lucide-react';
import { useJXTheme } from '../context/JXThemeContext';
import {
  COMPONENT_CATALOG,
  CATEGORIES,
  CategoryId,
  ComponentSpec,
} from '../data/catalog';
import {
  getComponentAccessibilitySpec,
  evaluateAccessibilityAudit,
  AccessibilityCheckOverride,
} from '../utils/jxuiLogic';

export interface AccessibilityAriaSectionProps {
  onJumpToComponent?: (spec: ComponentSpec) => void;
}

export const AccessibilityAriaSection: React.FC<AccessibilityAriaSectionProps> = ({
  onJumpToComponent,
}) => {
  const { palette, getRadiusClass, pushToast } = useJXTheme();

  const [categoryFilter, setCategoryFilter] = useState<CategoryId | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pass' | 'fail'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [overrides, setOverrides] = useState<Record<string, AccessibilityCheckOverride>>({});

  const allSpecs = useMemo(
    () => COMPONENT_CATALOG.map((item) => getComponentAccessibilitySpec(item)),
    []
  );

  const auditSummary = useMemo(
    () => evaluateAccessibilityAudit(allSpecs, overrides),
    [allSpecs, overrides]
  );

  const filteredSpecs = useMemo(() => {
    return allSpecs.filter((spec) => {
      if (categoryFilter !== 'all' && spec.category !== categoryFilter) {
        return false;
      }
      const state = overrides[spec.id] ?? { keyboardPass: true, screenReaderPass: true };
      const isItemCompliant = state.keyboardPass && state.screenReaderPass;
      if (statusFilter === 'pass' && !isItemCompliant) return false;
      if (statusFilter === 'fail' && isItemCompliant) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        spec.name.toLowerCase().includes(q) ||
        spec.ariaRole.toLowerCase().includes(q) ||
        spec.keyboardContract.toLowerCase().includes(q) ||
        spec.screenReaderContract.toLowerCase().includes(q) ||
        spec.ariaAttributes.some((a) => a.toLowerCase().includes(q))
      );
    });
  }, [allSpecs, categoryFilter, statusFilter, searchQuery, overrides]);

  const toggleKeyboardCheck = (id: string, componentName: string) => {
    setOverrides((prev) => {
      const current = prev[id] ?? { keyboardPass: true, screenReaderPass: true };
      const nextVal = !current.keyboardPass;
      pushToast({
        title: `${componentName}: Keyboard Navigation ${nextVal ? 'PASS' : 'FAIL'}`,
        description: nextVal
          ? 'WCAG 2.1.1 Keyboard criteria verified'
          : 'Flagged for WCAG 2.1.1 Keyboard remediation',
        variant: nextVal ? 'success' : 'warning',
      });
      return {
        ...prev,
        [id]: { ...current, keyboardPass: nextVal },
      };
    });
  };

  const toggleScreenReaderCheck = (id: string, componentName: string) => {
    setOverrides((prev) => {
      const current = prev[id] ?? { keyboardPass: true, screenReaderPass: true };
      const nextVal = !current.screenReaderPass;
      pushToast({
        title: `${componentName}: Screen Reader ${nextVal ? 'PASS' : 'FAIL'}`,
        description: nextVal
          ? 'WCAG 4.1.2 Name, Role, Value criteria verified'
          : 'Flagged for WAI-ARIA Screen Reader remediation',
        variant: nextVal ? 'success' : 'warning',
      });
      return {
        ...prev,
        [id]: { ...current, screenReaderPass: nextVal },
      };
    });
  };

  const handleSimulateAuditFailure = () => {
    setOverrides({
      'jx-autocomplete': { keyboardPass: false, screenReaderPass: true },
      'jx-spotlight-dock': { keyboardPass: true, screenReaderPass: false },
    });
    pushToast({
      title: 'Simulated 2 Audit Regression Checks',
      description: 'JXAutocomplete (Keyboard) & JXSpotlightDock (Screen Reader) set to Fail',
      variant: 'warning',
    });
  };

  const handleResetAllPass = () => {
    setOverrides({});
    setStatusFilter('all');
    pushToast({
      title: 'All 61 Components Certified PASS',
      description: 'Restored 100% WCAG 2.1 AA compliance across Keyboard & Screen Reader checks',
      variant: 'success',
    });
  };

  return (
    <section
      id="jx-accessibility-aria-standards"
      aria-label="Accessibility and ARIA Standards Documentation"
      className={`p-5 sm:p-7 bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 jx-elevation-2 space-y-6 scroll-mt-24 ${getRadiusClass('card')}`}
    >
      {/* Top Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-slate-200/70 dark:border-slate-800 pb-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>WCAG 2.1 AA &amp; WAI-ARIA 1.2 SPECIFICATION</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500 dark:text-slate-400">
              Interactive 61-Component Compliance Audit
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Accessibility &amp; ARIA Standards Interactive Checklist
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            Every component in <code className="font-mono">@jxui/react</code> is engineered to meet{' '}
            <strong className="font-semibold text-slate-900 dark:text-white">WCAG 2.1 Level AA</strong>{' '}
            out of the box—featuring roving <code className="font-mono">tabIndex</code>, 3px high-visibility
            focus halos, deterministic focus trapping, and polite <code className="font-mono">aria-live</code>{' '}
            announcements. Use the interactive checklist below to inspect or toggle{' '}
            <strong className="font-semibold text-slate-900 dark:text-white">Keyboard Navigation</strong> and{' '}
            <strong className="font-semibold text-slate-900 dark:text-white">Screen Reader Support</strong>{' '}
            pass/fail status across all 61 components.
          </p>
        </div>

        {/* Audit Simulation & Reset Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSimulateAuditFailure}
            data-testid="a11y-simulate-fail-btn"
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800 hover:bg-amber-100/80 transition-all cursor-pointer ${getRadiusClass('control')}`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Simulate Failure State</span>
          </button>
          <button
            type="button"
            onClick={handleResetAllPass}
            data-testid="a11y-reset-pass-btn"
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-200/70 transition-all cursor-pointer ${getRadiusClass('control')}`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Pass (61/61)</span>
          </button>
        </div>
      </div>

      {/* Live WCAG 2.1 AA Telemetry & Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-slate-50/90 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>WCAG 2.1 AA Audit Score</span>
            {auditSummary.overallStatus === 'WCAG 2.1 AA Certified' ? (
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            )}
          </div>
          <div className="flex items-center justify-between gap-2">
            <span
              data-testid="a11y-compliance-percentage"
              className="text-2xl font-bold font-mono tabular-nums whitespace-nowrap text-slate-900 dark:text-white"
            >
              {auditSummary.compliancePercentage}%
            </span>
            <span
              data-testid="a11y-overall-status"
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap ${
                auditSummary.overallStatus === 'WCAG 2.1 AA Certified'
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                  : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
              }`}
            >
              {auditSummary.overallStatus}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50/90 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Keyboard Navigation (2.1.1)</span>
            <Keyboard className="w-4 h-4 text-indigo-500 shrink-0" />
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span
              data-testid="a11y-keyboard-pass-count"
              className="text-2xl font-bold font-mono tabular-nums whitespace-nowrap text-slate-900 dark:text-white"
            >
              {auditSummary.keyboardPassCount}/{auditSummary.totalComponents}
            </span>
            <span className="text-[11px] text-slate-500 whitespace-nowrap">
              Roving tabIndex &amp; Keys
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50/90 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Screen Reader Support (4.1.2)</span>
            <Volume2 className="w-4 h-4 text-violet-500 shrink-0" />
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span
              data-testid="a11y-sr-pass-count"
              className="text-2xl font-bold font-mono tabular-nums whitespace-nowrap text-slate-900 dark:text-white"
            >
              {auditSummary.screenReaderPassCount}/{auditSummary.totalComponents}
            </span>
            <span className="text-[11px] text-slate-500 whitespace-nowrap">
              VoiceOver · NVDA · JAWS
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50/90 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Contrast &amp; Focus Halo (1.4.3)</span>
            <Eye className="w-4 h-4 text-sky-500 shrink-0" />
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums whitespace-nowrap text-slate-900 dark:text-white">
              &ge; 4.5:1
            </span>
            <span className="text-[11px] text-slate-500 whitespace-nowrap">
              3px Specular Halo Ring
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-3 pt-1">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={`px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${getRadiusClass('control')} ${
              categoryFilter === 'all'
                ? `${palette.bg} text-white`
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70'
            }`}
          >
            All ({allSpecs.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${getRadiusClass('control')} ${
                categoryFilter === cat.id
                  ? `${palette.bg} text-white font-semibold`
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70'
              }`}
            >
              {cat.shortTitle}
            </button>
          ))}
        </div>

        {/* Status Filter + Search Input */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div
            role="group"
            aria-label="Filter checklist by pass or fail status"
            className="inline-flex self-start p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-[11px] font-semibold"
          >
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              All ({allSpecs.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('pass')}
              className={`px-3 py-1 rounded-md cursor-pointer ${
                statusFilter === 'pass'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Pass ({auditSummary.fullyCompliantCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('fail')}
              data-testid="a11y-filter-fail"
              className={`px-3 py-1 rounded-md cursor-pointer ${
                statusFilter === 'fail'
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Fail ({auditSummary.failedComponentIds.length})
            </button>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search component, ARIA role, or keyboard key..."
              aria-label="Search component accessibility specifications"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Interactive Checklist Table / Cards */}
      <div
        role="region"
        aria-label="WCAG 2.1 AA Component Checklist"
        className="max-h-[540px] overflow-y-auto border border-slate-200/80 dark:border-slate-800 rounded-xl divide-y divide-slate-200/70 dark:divide-slate-800"
      >
        {filteredSpecs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
            No components match the current accessibility filter criteria.
          </div>
        ) : (
          filteredSpecs.map((item) => {
            const checkState = overrides[item.id] ?? {
              keyboardPass: true,
              screenReaderPass: true,
            };
            const isFullyCompliant =
              checkState.keyboardPass && checkState.screenReaderPass;
            const catalogSpec = COMPONENT_CATALOG.find((c) => c.id === item.id);

            return (
              <div
                key={item.id}
                data-testid={`a11y-row-${item.id}`}
                className={`p-4 transition-colors ${
                  isFullyCompliant
                    ? 'bg-white dark:bg-slate-900/60 hover:bg-slate-50/80 dark:hover:bg-slate-900'
                    : 'bg-rose-50/40 dark:bg-rose-950/20'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Component Identity & ARIA Semantics */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        #{String(item.number).padStart(2, '0')}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md font-mono text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                        role=&quot;{item.ariaRole}&quot;
                      </span>
                      <span className="px-2 py-0.5 rounded-md font-mono text-[11px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                        Contrast {item.contrastRatio}
                      </span>
                      {catalogSpec && onJumpToComponent && (
                        <button
                          type="button"
                          onClick={() => onJumpToComponent(catalogSpec)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                        >
                          <span>Inspect</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* ARIA Attributes & WCAG Criteria */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.ariaAttributes.map((attr) => (
                        <code
                          key={attr}
                          className="px-1.5 py-0.5 rounded bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-mono text-[10px]"
                        >
                          {attr}
                        </code>
                      ))}
                      {item.wcagCriteria.map((crit) => (
                        <span
                          key={crit}
                          className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-400 text-[10px] font-medium"
                        >
                          WCAG {crit}
                        </span>
                      ))}
                    </div>

                    {/* Detailed Keyboard & Screen Reader Contracts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/80">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-0.5">
                          <Keyboard className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span>Keyboard Navigation Contract</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                          {item.keyboardContract}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/80">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-0.5">
                          <Volume2 className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                          <span>Screen Reader Announcement</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                          {item.screenReaderContract}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Pass/Fail Checklist Controls */}
                  <div className="flex sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-end gap-2 shrink-0">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={checkState.keyboardPass}
                      aria-label={`${item.name} Keyboard Navigation Pass Status`}
                      data-testid={`a11y-kb-toggle-${item.id}`}
                      onClick={() => toggleKeyboardCheck(item.id, item.name)}
                      className={`inline-flex items-center justify-between gap-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        checkState.keyboardPass
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300/80 dark:border-emerald-800'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Keyboard className="w-3.5 h-3.5" />
                        <span>Keyboard Nav</span>
                      </span>
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] uppercase">
                        {checkState.keyboardPass ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>PASS</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                            <span>FAIL</span>
                          </>
                        )}
                      </span>
                    </button>

                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={checkState.screenReaderPass}
                      aria-label={`${item.name} Screen Reader Support Pass Status`}
                      data-testid={`a11y-sr-toggle-${item.id}`}
                      onClick={() => toggleScreenReaderCheck(item.id, item.name)}
                      className={`inline-flex items-center justify-between gap-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        checkState.screenReaderPass
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300/80 dark:border-emerald-800'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Screen Reader</span>
                      </span>
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] uppercase">
                        {checkState.screenReaderPass ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>PASS</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                            <span>FAIL</span>
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Remediation Alert Banner when either check is toggled to FAIL */}
                {!isFullyCompliant && (
                  <div
                    role="alert"
                    data-testid={`a11y-remediation-${item.id}`}
                    className="mt-3 p-3 rounded-lg bg-rose-100/80 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-rose-900 dark:text-rose-200"
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">WCAG 2.1 AA Audit Flagged: </span>
                        {!checkState.keyboardPass && (
                          <span>
                            Verify roving <code className="font-mono">tabIndex</code> and 3px focus halo on{' '}
                            <strong>{item.name}</strong>.{' '}
                          </span>
                        )}
                        {!checkState.screenReaderPass && (
                          <span>
                            Verify <code className="font-mono">role=&quot;{item.ariaRole}&quot;</code> and{' '}
                            <code className="font-mono">{item.ariaAttributes[0]}</code> screen reader announcement.
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setOverrides((prev) => ({
                          ...prev,
                          [item.id]: { keyboardPass: true, screenReaderPass: true },
                        }))
                      }
                      className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-300 font-semibold border border-rose-300 dark:border-rose-700 shrink-0 cursor-pointer"
                    >
                      Mark Remediated (Pass)
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
