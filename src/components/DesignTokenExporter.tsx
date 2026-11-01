import React, { useState, useMemo } from 'react';
import {
  Download,
  Copy,
  Check,
  FileJson,
  FileCode2,
  Palette,
  Sliders,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import {
  useJXTheme,
  ACCENT_PALETTES,
  AccentColor,
  RadiusScale,
} from '../context/JXThemeContext';
import {
  ACCENT_TONAL_SCALES,
  RADIUS_TOKEN_MAP,
  generateDesignTokensJSON,
  generateDesignTokensCSS,
  getDesignTokenFilename,
} from '../utils/jxuiLogic';

const RADIUS_SCALES: { id: RadiusScale; label: string }[] = [
  { id: 'sharp', label: 'Sharp (0px)' },
  { id: 'sm', label: 'Small (8px)' },
  { id: 'md', label: 'Medium (12px)' },
  { id: 'lg', label: 'Large (16px)' },
  { id: 'xl', label: 'Ultra (24px)' },
];

export const DesignTokenExporter: React.FC = () => {
  const {
    mode,
    toggleMode,
    accent,
    setAccent,
    palette,
    radiusScale,
    setRadiusScale,
    getRadiusClass,
    pushToast,
  } = useJXTheme();

  const [exportFormat, setExportFormat] = useState<'json' | 'css'>('json');
  const [copied, setCopied] = useState(false);
  const [lastDownloadedFile, setLastDownloadedFile] = useState<string | null>(null);

  const tokenConfig = useMemo(
    () => ({ mode, accent, radiusScale }),
    [mode, accent, radiusScale]
  );

  const generatedOutput = useMemo(() => {
    return exportFormat === 'json'
      ? generateDesignTokensJSON(tokenConfig)
      : generateDesignTokensCSS(tokenConfig);
  }, [exportFormat, tokenConfig]);

  const filename = useMemo(
    () => getDesignTokenFilename(tokenConfig, exportFormat),
    [tokenConfig, exportFormat]
  );

  const activeTonalScale = ACCENT_TONAL_SCALES[accent] || ACCENT_TONAL_SCALES.indigo;
  const activeRadiusSpec = RADIUS_TOKEN_MAP[radiusScale] || RADIUS_TOKEN_MAP.lg;
  const byteSize = useMemo(() => new Blob([generatedOutput]).size, [generatedOutput]);
  const codeLines = useMemo(() => generatedOutput.split('\n'), [generatedOutput]);

  const handleCopyTokens = () => {
    navigator.clipboard?.writeText(generatedOutput).catch(() => {});
    setCopied(true);
    pushToast({
      title: `Copied ${filename}`,
      description: `${exportFormat.toUpperCase()} design tokens copied to clipboard`,
      variant: 'success',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const mimeType =
      exportFormat === 'json'
        ? 'application/json;charset=utf-8'
        : 'text/css;charset=utf-8';
    const blob = new Blob([generatedOutput], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    setLastDownloadedFile(filename);
    pushToast({
      title: `Downloaded ${filename}`,
      description: `Exported ${activeTonalScale.name} (${mode}) + ${activeRadiusSpec.label} tokens`,
      variant: 'success',
    });
  };

  return (
    <section
      id="jx-design-token-exporter"
      aria-label="JXUI Design Token Exporter Module"
      className={`p-5 sm:p-7 bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 jx-elevation-2 space-y-6 scroll-mt-24 ${getRadiusClass('card')}`}
    >
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/70 dark:border-slate-800 pb-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-indigo-600 dark:text-indigo-400">
            <Palette className="w-3.5 h-3.5" />
            <span>DESIGN TOKEN EXPORTER MODULE</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500 dark:text-slate-400">
              W3C Design Tokens JSON &amp; CSS Custom Properties
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Live Theme &amp; Geometry Token Exporter
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            Generates a downloadable <code className="font-mono">.json</code> or{' '}
            <code className="font-mono">.css</code> variables bundle synchronized in real time with
            your active JXUI global theme settings—including the 11-stop{' '}
            <strong className="font-semibold text-slate-900 dark:text-white">
              {activeTonalScale.name}
            </strong>{' '}
            accent palette,{' '}
            <strong className="font-semibold text-slate-900 dark:text-white">{mode}</strong>{' '}
            surface luminance, and{' '}
            <strong className="font-semibold text-slate-900 dark:text-white">
              {activeRadiusSpec.label}
            </strong>{' '}
            geometry scale.
          </p>
        </div>

        {/* Format Switcher & Primary Download CTA */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div
            role="radiogroup"
            aria-label="Select token export format"
            className={`inline-flex p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 ${getRadiusClass('control')}`}
          >
            <button
              type="button"
              role="radio"
              aria-checked={exportFormat === 'json'}
              onClick={() => setExportFormat('json')}
              data-testid="token-format-json"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${getRadiusClass('control')} ${
                exportFormat === 'json'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white jx-elevation-1'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileJson className="w-3.5 h-3.5 text-indigo-500" />
              <span>JSON Tokens</span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={exportFormat === 'css'}
              onClick={() => setExportFormat('css')}
              data-testid="token-format-css"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${getRadiusClass('control')} ${
                exportFormat === 'css'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white jx-elevation-1'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>CSS Variables</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyTokens}
            data-testid="token-copy-btn"
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-all cursor-pointer ${getRadiusClass('control')}`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy {exportFormat.toUpperCase()}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadFile}
            data-testid="token-download-btn"
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white ${palette.bg} ${palette.bgHover} jx-elevation-1 transition-all active:scale-[0.98] cursor-pointer ${getRadiusClass('control')}`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {exportFormat === 'json' ? '.json' : '.css'} File</span>
          </button>
        </div>
      </div>

      {/* Live Token Inspector & Quick Theme Synchronizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Active Palette & Geometry Visualizer */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active 11-Stop Accent Tonal Swatch Strip */}
          <div className="p-4 rounded-xl bg-slate-50/90 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                1. Active Accent Palette ({activeTonalScale.name})
              </span>
              <span className="font-mono text-[11px] text-slate-500">
                {activeTonalScale.primaryHex}
              </span>
            </div>

            {/* Quick Accent Switcher Pills */}
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(ACCENT_PALETTES) as AccentColor[]).map((colorKey) => {
                const p = ACCENT_PALETTES[colorKey];
                const active = accent === colorKey;
                return (
                  <button
                    key={colorKey}
                    type="button"
                    onClick={() => setAccent(colorKey)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                      active
                        ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: p.hex }}
                    />
                    <span>{p.name}</span>
                  </button>
                );
              })}
            </div>

            {/* 50–950 Tonal Scale Swatches */}
            <div className="grid grid-cols-11 gap-1 pt-1">
              {Object.entries(activeTonalScale.stops).map(([stop, hex]) => (
                <div key={stop} className="space-y-1 text-center">
                  <div
                    className="h-7 w-full rounded-md border border-black/10 dark:border-white/10"
                    style={{ backgroundColor: hex }}
                    title={`${accent}-${stop}: ${hex}`}
                  />
                  <span className="block font-mono text-[9px] text-slate-500 dark:text-slate-400">
                    {stop}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Radius Scale & Surface Luminance Visualizer */}
          <div className="p-4 rounded-xl bg-slate-50/90 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                <span>2. Radius Scale &amp; Luminance</span>
              </span>
              <button
                type="button"
                onClick={toggleMode}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                {mode === 'light' ? (
                  <>
                    <Sun className="w-3 h-3 text-amber-500" />
                    <span>Light (#F8FAFC)</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3 h-3 text-indigo-400" />
                    <span>Dark (#0B0F19)</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {RADIUS_SCALES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRadiusScale(r.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                    radiusScale === r.id
                      ? `${palette.bg} text-white border-transparent`
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg">
                <div className="text-[10px] text-slate-500">Control Radius</div>
                <div className="font-mono text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                  {activeRadiusSpec.controlPx}
                </div>
              </div>
              <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg">
                <div className="text-[10px] text-slate-500">Card Radius</div>
                <div className="font-mono text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                  {activeRadiusSpec.cardPx}
                </div>
              </div>
              <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg">
                <div className="text-[10px] text-slate-500">Pill Radius</div>
                <div className="font-mono text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                  {activeRadiusSpec.pillPx}
                </div>
              </div>
            </div>
          </div>

          {lastDownloadedFile && (
            <div
              role="status"
              data-testid="token-download-confirmation"
              className="p-3 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 flex items-center justify-between gap-2 text-xs text-emerald-800 dark:text-emerald-300"
            >
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>
                  Generated &amp; downloaded <code className="font-mono font-bold">{lastDownloadedFile}</code>
                </span>
              </span>
              <span className="font-mono text-[11px]">{byteSize} B</span>
            </div>
          )}
        </div>

        {/* Right Column: Live Generated Code Artifact Preview */}
        <div className="lg:col-span-7 flex flex-col rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 font-mono text-slate-300">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
              <span data-testid="token-preview-filename">{filename}</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
              <span>{codeLines.length} lines</span>
              <span>·</span>
              <span>{byteSize} bytes</span>
              <span>·</span>
              <span className="text-indigo-400 uppercase">{exportFormat}</span>
            </div>
          </div>

          <div className="p-4 max-h-80 overflow-y-auto font-mono text-xs leading-relaxed select-all">
            <table className="w-full border-collapse">
              <tbody>
                {codeLines.map((line, i) => (
                  <tr key={i} className="hover:bg-slate-900/70">
                    <td className="pr-4 text-right text-slate-600 select-none w-8 align-top">
                      {i + 1}
                    </td>
                    <td className="text-slate-200 whitespace-pre overflow-x-auto">{line}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
