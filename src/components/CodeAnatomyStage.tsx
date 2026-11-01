import React, { useState } from 'react';
import {
  ShieldCheck,
  Keyboard,
  Volume2,
  Layers,
  ChevronDown,
  ChevronUp,
  Info,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Box,
  Compass,
} from 'lucide-react';
import { UnifiedComponentSpec } from '../data/unifiedCatalog';
import { ComponentSpec } from '../data/catalog';
import { getComponentAnatomySpec, ComponentAnatomySpec } from '../utils/jxuiLogic';

export interface CodeAnatomyStageProps {
  spec: UnifiedComponentSpec | ComponentSpec;
  children: React.ReactNode;
  compact?: boolean;
  onOpenDocs?: (spec: UnifiedComponentSpec) => void;
  className?: string;
}

export const CodeAnatomyStage: React.FC<CodeAnatomyStageProps> = ({
  spec,
  children,
  compact = false,
  onOpenDocs,
  className = '',
}) => {
  const [showInspector, setShowInspector] = useState(false);
  const [activeSlotHighlight, setActiveSlotHighlight] = useState<string | null>(null);

  const anatomy: ComponentAnatomySpec = React.useMemo(() => {
    return getComponentAnatomySpec({
      id: spec.id,
      name: spec.name,
      number: 'number' in spec ? spec.number : ('showcaseNumber' in spec ? spec.showcaseNumber : undefined),
      category: 'category' in spec ? spec.category : undefined,
      categoryId: 'categoryId' in spec ? spec.categoryId : undefined,
      categoryTitle: 'categoryTitle' in spec ? spec.categoryTitle : undefined,
      quality: 'quality' in spec ? spec.quality : undefined,
      doc: 'doc' in spec ? spec.doc : undefined,
    });
  }, [spec]);

  return (
    <div
      data-testid={`code-anatomy-stage-${spec.id}`}
      className={`w-full relative flex flex-col rounded-xl overflow-hidden border border-indigo-300/80 dark:border-indigo-800/80 bg-slate-950 text-slate-100 shadow-sm ${className}`}
    >
      {/* 1. TOP ANATOMY BANNER: ACCESSIBILITY & STRUCTURE STRIP */}
      <div className="px-3 py-2 bg-slate-900/95 border-b border-indigo-900/60 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
        {/* Left: Semantic Element + ARIA Role */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/80 font-bold">
            <Box className="w-3 h-3 text-indigo-400" />
            <span>{anatomy.semanticTag}</span>
          </span>

          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-700/80 font-bold"
            title="ARIA Semantic Role"
          >
            <span>role="{anatomy.ariaRole}"</span>
          </span>

          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/80 font-bold"
            title="WCAG Contrast Score"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>{anatomy.wcagContrast}</span>
          </span>
        </div>

        {/* Right: Keyboard Contract + Inspector Toggle */}
        <div className="flex items-center gap-1.5">
          <span
            className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
            title={`Keyboard Navigation: ${anatomy.keyboardContract}`}
          >
            <Keyboard className="w-3 h-3 text-amber-400" />
            <span>{anatomy.keyboardKeys.slice(0, 3).join(' · ')}</span>
          </span>

          <button
            type="button"
            onClick={() => setShowInspector((prev) => !prev)}
            aria-expanded={showInspector}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-sans text-[11px] font-semibold transition-colors cursor-pointer ${
              showInspector
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <Info className="w-3 h-3" />
            <span>{showInspector ? 'Hide Specs' : 'Inspect Anatomy'}</span>
            {showInspector ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* 2. BLUEPRINT WORKBENCH STAGE WITH STRUCTURAL WIREFRAME GUIDES */}
      <div className="relative p-6 sm:p-8 flex flex-col items-center justify-center min-h-[140px] overflow-hidden bg-[#0B101E] select-none">
        {/* Engineering Blueprint Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(99, 102, 241, 0.25) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(99, 102, 241, 0.25) 1px, transparent 1px)
            `,
            backgroundSize: '16px 16px',
          }}
        />

        {/* Precision Crosshairs in Corners */}
        <span className="absolute top-2 left-2 text-indigo-400/50 font-mono text-[10px] select-none pointer-events-none">
          + (0,0)
        </span>
        <span className="absolute top-2 right-2 text-indigo-400/50 font-mono text-[10px] select-none pointer-events-none">
          + (100%,0)
        </span>
        <span className="absolute bottom-2 left-2 text-indigo-400/50 font-mono text-[10px] select-none pointer-events-none">
          + (0,100%)
        </span>
        <span className="absolute bottom-2 right-2 text-indigo-400/50 font-mono text-[10px] select-none pointer-events-none">
          + (100%,100%)
        </span>

        {/* Structural Wireframe Boundary Wrapper */}
        <div className="relative group/anatomy max-w-full flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border border-dashed border-cyan-400/50 dark:border-cyan-400/40 bg-slate-900/50 transition-all hover:border-cyan-300">
          {/* Top Structure Slot Pin */}
          <div className="absolute -top-3 left-3 px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/80 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-xs select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Slot: Root Container</span>
          </div>

          {/* Interactive Live Component Preview (Functional & Interactive) */}
          <div className="relative z-10 w-full flex items-center justify-center py-1">
            {children}
          </div>

          {/* Bottom Structure Slot Pin */}
          <div className="absolute -bottom-3 right-3 px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/80 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-xs select-none">
            <span>200ms Damped Spring Physics</span>
          </div>
        </div>
      </div>

      {/* 3. ARIA ATTRIBUTES & LIVE SCREEN READER CONTRACT STRIP */}
      <div className="px-3 py-2 bg-slate-900/90 border-t border-slate-800/80 flex flex-col gap-1.5 text-[10px]">
        {/* ARIA Attributes List */}
        <div className="flex flex-wrap items-center gap-1 font-mono">
          <span className="text-slate-400 uppercase tracking-wider text-[9px] font-bold mr-1">
            ARIA Attributes:
          </span>
          {anatomy.ariaAttributes.map((attr, idx) => (
            <span
              key={idx}
              className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700 font-mono"
            >
              {attr}
            </span>
          ))}
        </div>

        {/* Screen Reader Announcement Contract */}
        <div className="flex items-start gap-1.5 text-slate-300 font-sans text-[11px] leading-relaxed pt-1 border-t border-slate-800/60">
          <Volume2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
          <p className="line-clamp-2">
            <span className="text-indigo-300 font-mono text-[10px] mr-1 uppercase font-bold">
              Screen Reader Contract:
            </span>
            {anatomy.screenReaderContract}
          </p>
        </div>
      </div>

      {/* 4. EXPANDABLE DEEP SPECIFICATION & ANATOMY MATRIX DRAWER */}
      {showInspector && (
        <div className="border-t border-indigo-900/60 bg-slate-950 p-4 space-y-4 text-xs font-sans animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <h4 className="font-bold text-white text-sm">
                Code Anatomy &amp; Accessibility Specification
              </h4>
            </div>
            {'doc' in spec && onOpenDocs && (
              <button
                type="button"
                onClick={() => onOpenDocs(spec as UnifiedComponentSpec)}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
              >
                <span>Full Documentation</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Slot Breakdown Grid */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              DOM Component Slots &amp; Hierarchy
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {anatomy.slots.map((slot, index) => (
                <div
                  key={index}
                  onMouseEnter={() => setActiveSlotHighlight(slot.name)}
                  onMouseLeave={() => setActiveSlotHighlight(null)}
                  className={`p-2.5 rounded-lg border transition-all ${
                    activeSlotHighlight === slot.name
                      ? 'bg-indigo-950/60 border-indigo-500'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <span className="font-mono text-[11px] font-bold text-indigo-300">
                      {slot.tag}
                    </span>
                    <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400">
                      role="{slot.role}"
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-normal">{slot.purpose}</p>
                  <div className="mt-1.5 pt-1 border-t border-slate-800 text-[10px] font-mono text-slate-400">
                    <span className="text-slate-500 mr-1">CSS:</span>
                    <span>{slot.styling}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accessibility & Ergonomic Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                Keyboard Navigation
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {anatomy.keyboardContract}
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                WCAG AA Certification
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {anatomy.wcagLevel} · Contrast ratio {anatomy.wcagContrast}. Zero-runtime CSS prevents layout shifts (CLS = 0).
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                Design Tokens Applied
              </span>
              <div className="text-[10px] font-mono text-indigo-300 space-y-0.5">
                <div>Radius: {anatomy.tokens.radiusToken}</div>
                <div>Kinematics: {anatomy.tokens.transitionToken}</div>
                <div>Focus: {anatomy.tokens.focusHaloToken}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
