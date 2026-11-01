import React, { useState, useEffect } from 'react';
import { UnifiedComponentSpec } from '../data/unifiedCatalog';
import { useJXTheme } from '../context/JXThemeContext';
import { InteractiveComponentPreview } from './InteractiveComponentPreview';
import { InlineLivePlayground } from './LivePlayground';
import { JXCollectionsState, toggleFavorite, isFavorite, addComponentToCollection } from '../utils/jxuiCollections';
import {
  CopyCodeMode,
  formatCopyableJsxCode,
  PlaygroundPropValues,
  PlaygroundCssVariables,
  DEFAULT_PLAYGROUND_PROPS,
  DEFAULT_PLAYGROUND_CSS_VARS,
  serializePlaygroundJsx,
} from '../utils/jxuiLogic';
import { resolveRawComponentSource, getCachedRawSource, copyTextToClipboard } from '../utils/rawSourceLoader';
import {
  X,
  Copy,
  Check,
  Star,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Tablet,
  Monitor,
  Terminal,
  BookOpen,
  Keyboard,
  Layers,
  ArrowRight,
  ExternalLink,
  Plus,
  Share2,
  Code2,
  Sliders,
} from 'lucide-react';

interface ComponentDocumentationModalProps {
  spec: UnifiedComponentSpec | null;
  onClose: () => void;
  collectionsState: JXCollectionsState;
  onUpdateCollectionsState: (next: JXCollectionsState) => void;
  onJumpToShowcase?: (showcaseNumber: number) => void;
}

export const ComponentDocumentationModal: React.FC<ComponentDocumentationModalProps> = ({
  spec,
  onClose,
  collectionsState,
  onUpdateCollectionsState,
  onJumpToShowcase,
}) => {
  const { palette, getRadiusClass, pushToast } = useJXTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'props' | 'a11y' | 'responsive' | 'mui-delta'>('overview');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedInstall, setCopiedInstall] = useState<boolean>(false);
  const [showCollectionDropdown, setShowCollectionDropdown] = useState<boolean>(false);
  const [codeMode, setCodeMode] = useState<CopyCodeMode>('jsx');
  const [includeImports, setIncludeImports] = useState<boolean>(true);
  const [rawSource, setRawSource] = useState<string>('');
  const [showLivePlayground, setShowLivePlayground] = useState<boolean>(true);
  const [modalPgProps, setModalPgProps] = useState<PlaygroundPropValues>(DEFAULT_PLAYGROUND_PROPS);
  const [modalPgCssVars, setModalPgCssVars] = useState<PlaygroundCssVariables>(DEFAULT_PLAYGROUND_CSS_VARS);

  useEffect(() => {
    if (!spec) return;
    setRawSource(
      getCachedRawSource({
        name: spec.name,
        subtitle: spec.subtitle,
        jsxSnippet: spec.jsxSnippet,
        muiFlaw: spec.muiFlaw,
        jxuiUpgrade: spec.jxuiUpgrade,
        props: spec.doc.props,
      })
    );
    let active = true;
    resolveRawComponentSource({
      name: spec.name,
      subtitle: spec.subtitle,
      jsxSnippet: spec.jsxSnippet,
      muiFlaw: spec.muiFlaw,
      jxuiUpgrade: spec.jxuiUpgrade,
      props: spec.doc.props,
    }).then((src) => {
      if (active) setRawSource(src);
    });
    return () => {
      active = false;
    };
  }, [spec]);

  if (!spec) return null;

  const isFav = isFavorite(spec.id, collectionsState);

  const displayedCode =
    codeMode === 'raw'
      ? rawSource
      : showLivePlayground
      ? serializePlaygroundJsx(spec.name, modalPgProps, includeImports)
      : includeImports
      ? spec.doc.usageCode || formatCopyableJsxCode(spec.jsxSnippet, spec.name, true)
      : spec.jsxSnippet;

  const handleCopySnippet = async (overrideMode?: CopyCodeMode) => {
    const targetMode = overrideMode || codeMode;
    let textToCopy = displayedCode;
    if (targetMode === 'raw') {
      textToCopy = await resolveRawComponentSource({
        name: spec.name,
        subtitle: spec.subtitle,
        jsxSnippet: spec.jsxSnippet,
        muiFlaw: spec.muiFlaw,
        jxuiUpgrade: spec.jxuiUpgrade,
        props: spec.doc.props,
      });
      setRawSource(textToCopy);
    } else {
      textToCopy = includeImports
        ? spec.doc.usageCode || formatCopyableJsxCode(spec.jsxSnippet, spec.name, true)
        : spec.jsxSnippet;
    }

    await copyTextToClipboard(textToCopy);
    setCopiedCode(true);
    pushToast({
      title: `Copied <${spec.name} /> ${targetMode === 'raw' ? 'Raw Source' : 'JSX'}`,
      description:
        targetMode === 'raw'
          ? 'Full TypeScript implementation copied to clipboard'
          : 'JSX usage snippet copied to clipboard',
      variant: 'success',
    });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyInstall = async () => {
    await copyTextToClipboard(spec.doc.installation);
    setCopiedInstall(true);
    pushToast({
      title: 'Installation Copied',
      description: 'npm install command copied',
      variant: 'success',
    });
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const handleToggleFav = () => {
    const next = toggleFavorite(spec.id, collectionsState);
    onUpdateCollectionsState(next);
    pushToast({
      title: isFav ? 'Removed from Bookmarks' : 'Added to Bookmarks',
      description: `<${spec.name} /> ${isFav ? 'removed from' : 'saved to'} your starred list`,
      variant: isFav ? 'default' : 'success',
    });
  };

  const handleAddToCollection = (colId: string, colName: string) => {
    const next = addComponentToCollection(colId, spec.id, collectionsState);
    onUpdateCollectionsState(next);
    setShowCollectionDropdown(false);
    pushToast({
      title: 'Added to Collection',
      description: `<${spec.name} /> added to "${colName}"`,
      variant: 'success',
    });
  };

  const handleCopyShareLink = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('doc', spec.id);
      navigator.clipboard.writeText(url.toString());
      pushToast({
        title: 'Deep Link Copied',
        description: `Direct shareable link for <${spec.name} /> copied to clipboard`,
        variant: 'success',
      });
    } catch {
      // fallback
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="doc-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in"
    >
      <div
        className={`relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden ${getRadiusClass(
          'card'
        )}`}
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm ${palette.bg}`}>
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="doc-modal-title" className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>&lt;{spec.name} /&gt;</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    v{spec.version || '3.0.0'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    spec.tier === 'showcase'
                      ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {spec.tier === 'showcase' ? `Showcase #${spec.showcaseNumber}` : 'Atomic Primitive'}
                  </span>
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {spec.subtitle}
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Bookmark Favorite */}
            <button
              type="button"
              onClick={handleToggleFav}
              title={isFav ? 'Remove from favorites' : 'Bookmark to favorites'}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isFav
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-500'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white'
              }`}
            >
              <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
            </button>

            {/* Add to Collection */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCollectionDropdown(!showCollectionDropdown)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add to Collection</span>
              </button>

              {showCollectionDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-30 p-2 space-y-1">
                  <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Collection
                  </div>
                  {collectionsState.collections.map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => handleAddToCollection(col.id, col.name)}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      <span className="truncate">{col.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {col.componentIds.includes(spec.id) ? '✓ Included' : `+ Add (${col.componentIds.length})`}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Shareable Deep Link */}
            <button
              type="button"
              onClick={handleCopyShareLink}
              title="Copy deep link to this component"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close documentation modal"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quality Indicators Ribbon */}
        <div className="px-6 py-2.5 bg-slate-100/70 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            {/* WCAG AA / AAA badge */}
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>{spec.quality.wcagScore}</span>
            </span>

            {/* Maturity Badge */}
            <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 font-semibold">
              {spec.quality.maturity}
            </span>

            {/* Difficulty Badge */}
            <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold uppercase text-[10px]">
              {spec.difficulty}
            </span>

            {/* Zero CLS Guarantee */}
            <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 font-semibold">
              CLS = 0.00
            </span>

            {/* JXUI v3.0 Engine */}
            <span className="px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800 font-semibold">
              JXUI v{spec.quality.version || '3.0.0'}
            </span>
          </div>

          {/* Responsive Support Indicators */}
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
            <span className="text-[11px] font-medium">Responsive:</span>
            <span title="Mobile Optimized (375px+)" className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <Smartphone className="w-3.5 h-3.5" /> Mobile
            </span>
            <span>•</span>
            <span title="Tablet Fluid Layout (768px+)" className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <Tablet className="w-3.5 h-3.5" /> Tablet
            </span>
            <span>•</span>
            <span title="Desktop Keyboard Enabled (1024px+)" className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <Monitor className="w-3.5 h-3.5" /> Desktop
            </span>
          </div>
        </div>

        {/* Documentation Tab Navigation */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1 overflow-x-auto text-xs font-semibold bg-white dark:bg-slate-900 shrink-0">
          {[
            { id: 'overview', label: 'Overview & Sandbox' },
            { id: 'props', label: 'Props Specification' },
            { id: 'a11y', label: 'Accessibility & ARIA' },
            { id: 'responsive', label: 'Responsive & Frameworks' },
            { id: 'mui-delta', label: 'MUI vs JXUI Delta' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-3 border-b-2 transition-colors cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {/* TAB 1: OVERVIEW & SANDBOX */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Live Interactive Sandbox Box with Inline Copy Code Controls */}
              <div className="p-6 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center min-h-[160px]">
                <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200/70 dark:border-slate-800/70">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Interactive Live Sandbox Preview</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="inline-flex rounded-lg bg-slate-200/80 dark:bg-slate-800 p-0.5 text-[11px] font-mono">
                      <button
                        type="button"
                        onClick={() => setCodeMode('jsx')}
                        className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                          codeMode === 'jsx'
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-2xs'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        JSX
                      </button>
                      <button
                        type="button"
                        onClick={() => setCodeMode('raw')}
                        className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                          codeMode === 'raw'
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-2xs'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Raw (.tsx)
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowLivePlayground((v) => !v)}
                      aria-expanded={showLivePlayground}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                        showLivePlayground
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>{showLivePlayground ? 'Hide Playground' : 'Live Playground'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopySnippet()}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? `Copied ${codeMode === 'raw' ? 'Raw' : 'JSX'}!` : `Copy ${codeMode === 'raw' ? 'Raw' : 'JSX'} Code`}</span>
                    </button>
                  </div>
                </div>
                <div className="w-full py-2 flex items-center justify-center">
                  <InteractiveComponentPreview
                    spec={spec}
                    playgroundProps={showLivePlayground ? modalPgProps : undefined}
                    playgroundCssVars={showLivePlayground ? modalPgCssVars : undefined}
                    onJumpToShowcase={onJumpToShowcase ? () => onJumpToShowcase(spec.showcaseNumber || 1) : undefined}
                  />
                </div>
                {showLivePlayground && (
                  <div className="w-full mt-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                    <InlineLivePlayground
                      componentName={spec.name}
                      propsState={modalPgProps}
                      onChangeProps={setModalPgProps}
                      cssVars={modalPgCssVars}
                      onChangeCssVars={setModalPgCssVars}
                      onReset={() => {
                        setModalPgProps(DEFAULT_PLAYGROUND_PROPS);
                        setModalPgCssVars(DEFAULT_PLAYGROUND_CSS_VARS);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Install Terminal */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Installation &amp; Dependencies</span>
                </h3>
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs border border-slate-800">
                  <span className="text-indigo-400 select-all">$ {spec.doc.installation}</span>
                  <button
                    type="button"
                    onClick={handleCopyInstall}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedInstall ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Copyable JSX Usage vs Raw Implementation Code */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Component Code
                    </h3>
                    <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 text-[11px] font-mono">
                      <button
                        type="button"
                        onClick={() => setCodeMode('jsx')}
                        className={`px-2.5 py-0.5 rounded-md transition-colors cursor-pointer ${
                          codeMode === 'jsx'
                            ? 'bg-indigo-600 text-white font-semibold'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        JSX Usage
                      </button>
                      <button
                        type="button"
                        onClick={() => setCodeMode('raw')}
                        className={`px-2.5 py-0.5 rounded-md transition-colors cursor-pointer ${
                          codeMode === 'raw'
                            ? 'bg-indigo-600 text-white font-semibold'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Raw Implementation (.tsx)
                      </button>
                    </div>
                    {codeMode === 'jsx' && (
                      <button
                        type="button"
                        onClick={() => setIncludeImports((v) => !v)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono border cursor-pointer ${
                          includeImports
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {includeImports ? 'Imports: On' : 'Imports: Off'}
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopySnippet()}
                    className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied to Clipboard!' : `Copy ${codeMode === 'raw' ? 'Raw Source' : 'JSX Code'}`}</span>
                  </button>
                </div>
                <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto max-h-[320px] overflow-y-auto border border-slate-800 leading-relaxed">
                  <code>{displayedCode}</code>
                </pre>
              </div>

              {/* Summary Notes */}
              <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 rounded-xl text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
                {spec.doc.summary}
              </div>
            </div>
          )}

          {/* TAB 2: PROPS SPECIFICATION */}
          {activeTab === 'props' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  TypeScript Interface &amp; Component Props
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  {spec.doc.props.length} configurable properties
                </span>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-2.5">Prop</th>
                      <th className="px-4 py-2.5">Type</th>
                      <th className="px-4 py-2.5">Default</th>
                      <th className="px-4 py-2.5">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900 font-mono">
                    {spec.doc.props.map((p) => (
                      <tr key={p.name} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-2.5 font-bold text-indigo-600 dark:text-indigo-400">
                          {p.name}
                          {p.required && <span className="text-rose-500 ml-1">*</span>}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300 text-[11px]">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            {p.type}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-slate-400 text-[11px]">
                          {p.default || 'undefined'}
                        </td>
                        <td className="px-4 py-2.5 font-sans text-slate-600 dark:text-slate-400 text-xs">
                          {p.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ACCESSIBILITY & ARIA */}
          {activeTab === 'a11y' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-emerald-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                    {spec.quality.wcagScore} Certified
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                    Guaranteed high-contrast compliance exceeding 7:1 ratio with programmatic focus traps and zero keyboard traps.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  ARIA Contract &amp; Roles
                </h4>
                <div className="flex flex-wrap gap-2 font-mono text-xs">
                  {spec.quality.ariaRoles.map((role) => (
                    <span key={role} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      role=&quot;{role}&quot;
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Keyboard className="w-4 h-4 text-indigo-500" />
                  <span>Keyboard Navigation Shortcuts</span>
                </h4>
                <div className="space-y-2 text-xs">
                  {spec.doc.keyboardShortcuts.map((kb) => (
                    <div key={kb} className="p-2.5 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                      <span className="font-mono text-slate-800 dark:text-slate-200">{kb}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RESPONSIVE & FRAMEWORKS */}
          {activeTab === 'responsive' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                  Multi-Framework Compatibility
                </h4>
                <div className="flex flex-wrap gap-2">
                  {spec.frameworks.map((fw) => (
                    <span key={fw} className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      ✓ {fw}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                  Responsive Breakpoint Behavior
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1 mb-1">
                      <Smartphone className="w-3.5 h-3.5 text-indigo-500" /> Mobile (&lt; 640px)
                    </span>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      44px touch targets, full-width fluid layouts, touch-swipe gestures enabled.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1 mb-1">
                      <Tablet className="w-3.5 h-3.5 text-indigo-500" /> Tablet (640 - 1024px)
                    </span>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Split multi-column grids, optimized thumb zones, auto-dismiss popovers.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1 mb-1">
                      <Monitor className="w-3.5 h-3.5 text-indigo-500" /> Desktop (&gt; 1024px)
                    </span>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Full keyboard contracts, tooltips, hover kinematic springs, high-density data.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  Best Practice Recommendations
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 list-disc pl-5">
                  {spec.doc.bestPractices.map((bp) => (
                    <li key={bp}>{bp}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: MUI VS JXUI DELTA */}
          {activeTab === 'mui-delta' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60">
                  <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200">
                    Material UI Suboptimality
                  </span>
                  <h4 className="font-bold text-rose-950 dark:text-rose-200 text-sm mt-2 mb-1">
                    Known MUI Flaw
                  </h4>
                  <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
                    {spec.muiFlaw}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60">
                  <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                    JXUI Innovation
                  </span>
                  <h4 className="font-bold text-emerald-950 dark:text-emerald-200 text-sm mt-2 mb-1">
                    Tactile Spring &amp; Zero CLS
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                    {spec.jxuiUpgrade}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
            <span>Category {spec.categoryNumber}:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{spec.categoryTitle}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCopySnippet()}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy JSX</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
