import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  SplitSquareHorizontal,
  SlidersHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { COMPONENT_CATALOG, ComponentSpec } from '../data/catalog';
import { useJXTheme } from '../context/JXThemeContext';
import { formatCopyableJsxCode } from '../utils/jxuiLogic';
import {
  JXAlert,
  JXAlertSeverity,
  JXBackdrop,
  JXDialog,
  JXProgress,
  JXSkeleton,
  JXSkeletonPreset,
  JXSnackbar,
} from './feedback';
import {
  JXAccordion,
  JXAppBar,
  JXCard,
  JXCardHeader,
  JXCardContent,
  JXCardActions,
  JXPaper,
  type JXAccordionIconMorph,
  type JXAccordionVariant,
  type JXAccordionItemData,
  type JXAccordionProps,
} from './surfaces';

export {
  JXAccordion,
  type JXAccordionProps,
  type JXAccordionItemData,
  type JXAccordionIconMorph,
  type JXAccordionVariant,
} from './surfaces';

import {
  ComponentDocumentation,
  type ComponentDocumentationProps,
} from './ComponentDocumentation';

export {
  ComponentDocumentation,
  type ComponentDocumentationProps,
};


// ============================================================================
// Category 3 (Feedback) & Category 4 (Surfaces) Workbench View
// ============================================================================

interface Category3And4Props {
  activeCategoryFilter: 'all' | 'feedback' | 'surfaces';
}

export const Category3And4FeedbackSurfaces: React.FC<Category3And4Props> = ({
  activeCategoryFilter,
}) => {
  const getSpec = (num: number) => COMPONENT_CATALOG.find((s) => s.number === num)!;

  // #25 JXAlert state
  const [alertSeverity, setAlertSeverity] = useState<JXAlertSeverity>('warning');

  // #28 JXProgress state
  const [progressVal, setProgressVal] = useState(72);

  // #29 JXSkeleton preset state
  const [skeletonPreset, setSkeletonPreset] = useState<JXSkeletonPreset>('card');

  // #31 JXAccordion interactive workbench states
  const [accordionVariant, setAccordionVariant] = useState<JXAccordionVariant>('bento');
  const [accordionIconMorph, setAccordionIconMorph] =
    useState<JXAccordionIconMorph>('plus-cross');
  const [accordionMulti, setAccordionMulti] = useState<boolean>(false);

  const showFeedback = activeCategoryFilter === 'all' || activeCategoryFilter === 'feedback';
  const showSurfaces = activeCategoryFilter === 'all' || activeCategoryFilter === 'surfaces';

  const accordionLiveJsx = `<JXAccordion
  variant="${accordionVariant}"
  iconMode="${accordionIconMorph}"
  allowMultiple={${accordionMulti}}
  defaultOpenId="acc-1"
  items={[
    {
      id: 'acc-1',
      title: 'Zero-Layout-Shift Morphing Architecture',
      badge: 'Stable v3.0',
      meta: 'Core Spec',
      body: 'Spring height animation (stiffness: 380, damping: 32) with zero layout shift.'
    },
    {
      id: 'acc-2',
      title: 'Separated Bento Card Ergonomics',
      badge: 'Bento Surface',
      meta: 'Elevation v2',
      body: 'Each item renders as an isolated Bento card with specular highlights.'
    }
  ]}
/>`;

  return (
    <div className="space-y-8">
      {showFeedback && (
        <>
          {/* #25 JXAlert & #26 JXBackdrop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentDocumentation
              spec={getSpec(25)}
              customJsx={`<JXAlert
  severity="${alertSeverity}"
  title="Edge Rate Limit Approaching"
  actionLabel="Upgrade Quota"
  collapsiblePayload
/>`}
              headerControls={
                <div className="flex items-center gap-1">
                  {(['warning', 'success', 'info'] as const).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setAlertSeverity(sev)}
                      className={`px-2 py-0.5 text-[11px] capitalize rounded cursor-pointer ${
                        alertSeverity === sev
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                          : 'text-slate-500'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              }
            >
              <JXAlert severity={alertSeverity} />
            </ComponentDocumentation>

            <ComponentDocumentation spec={getSpec(26)}>
              <JXBackdrop />
            </ComponentDocumentation>
          </div>

          {/* #27 JXDialog, #28 JXProgress, #29 JXSkeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ComponentDocumentation spec={getSpec(27)}>
              <JXDialog destructiveGuard />
            </ComponentDocumentation>

            <ComponentDocumentation
              spec={getSpec(28)}
              customJsx={`<JXProgress
  value={${progressVal}}
  etaSeconds={14}
  morphOnComplete
/>`}
            >
              <JXProgress value={progressVal} onChange={setProgressVal} />
            </ComponentDocumentation>

            <ComponentDocumentation
              spec={getSpec(29)}
              customJsx={`<JXSkeleton
  preset="${skeletonPreset}"
  shimmer="diagonal-wave"
/>`}
            >
              <JXSkeleton
                preset={skeletonPreset}
                onPresetChange={setSkeletonPreset}
                showPresetSwitcher
              />
            </ComponentDocumentation>
          </div>

          {/* #30 JXSnackbar (Sonner-style 3D Stacked Toast System) */}
          <ComponentDocumentation spec={getSpec(30)}>
            <JXSnackbar />
          </ComponentDocumentation>
        </>
      )}

      {showSurfaces && (
        <>
          {/* #31 JXAccordion & #32 JXAppBar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentDocumentation
              spec={getSpec(31)}
              customJsx={accordionLiveJsx}
              stateControls={
                <>
                  {/* Variant Toggle: Separated Bento vs Contiguous */}
                  <div className="inline-flex rounded-lg bg-white dark:bg-slate-800 p-0.5 border border-slate-200/80 dark:border-slate-700 text-[11px] font-medium">
                    <button
                      type="button"
                      onClick={() => setAccordionVariant('bento')}
                      className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                        accordionVariant === 'bento'
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Bento Cards
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccordionVariant('contiguous')}
                      className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                        accordionVariant === 'contiguous'
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Contiguous
                    </button>
                  </div>

                  {/* Interactive Icon Morph Selector (Plus/Cross, Chevron, Compass) */}
                  <div
                    role="group"
                    aria-label="Expand and collapse icon style"
                    className="inline-flex rounded-lg bg-white dark:bg-slate-800 p-0.5 border border-slate-200/80 dark:border-slate-700 text-[11px] font-medium"
                  >
                    {(
                      [
                        { id: 'plus-cross', label: 'Plus / Cross (+ → ×)' },
                        { id: 'chevron-flip', label: 'Chevron' },
                        { id: 'arrow-compass', label: 'Compass ↗' },
                      ] as const
                    ).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setAccordionIconMorph(m.id)}
                        className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                          accordionIconMorph === m.id
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {/* Multi-Expand Toggle */}
                  <button
                    type="button"
                    onClick={() => setAccordionMulti((v) => !v)}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer ${
                      accordionMulti
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 font-semibold'
                        : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {accordionMulti ? 'Multi-Expand: ON' : 'Single-Expand'}
                  </button>
                </>
              }
            >
              <JXAccordion
                variant={accordionVariant}
                iconMode={accordionIconMorph}
                allowMultiple={accordionMulti}
              />
            </ComponentDocumentation>

            <ComponentDocumentation spec={getSpec(32)}>
              <JXAppBar />
            </ComponentDocumentation>
          </div>

          {/* #33 JXCard & #34 JXPaper */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentDocumentation spec={getSpec(33)}>
              <JXCard spotlight hoverLift>
                <JXCardHeader
                  title="Edge Computing Cluster"
                  subheader="Bento Interactive Card"
                />
                <JXCardContent>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-500">
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-2">
                      p99 Latency: <strong className="text-slate-900 dark:text-white">11.4ms</strong>
                    </div>
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-2">
                      Throughput: <strong className="text-emerald-600 dark:text-emerald-400">99.98%</strong>
                    </div>
                  </div>
                </JXCardContent>
                <JXCardActions>
                  <span className="text-[11px] font-mono text-slate-400">us-east-1a</span>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    Inspect Node →
                  </span>
                </JXCardActions>
              </JXCard>
            </ComponentDocumentation>

            <ComponentDocumentation spec={getSpec(34)}>
              <JXPaper showTierSwitcher />
            </ComponentDocumentation>
          </div>
        </>
      )}
    </div>
  );
};
