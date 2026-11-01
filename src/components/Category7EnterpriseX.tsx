import React, { useState } from 'react';
import {
  Download,
  Calendar,
  Sparkles,
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  Edit3,
  Check,
  UploadCloud,
  Heading1,
  List,
  Code2,
  X,
} from 'lucide-react';
import { COMPONENT_CATALOG } from '../data/catalog';
import { ShowcaseCard } from './ShowcaseCard';
import { useJXTheme } from '../context/JXThemeContext';
import {
  GridRow,
  exportRowsToCSV,
  parseNaturalLanguageDate,
} from '../utils/jxuiLogic';

const INITIAL_GRID_ROWS: GridRow[] = [
  {
    id: 'JX-01',
    component: 'JXAutocomplete',
    category: 'Inputs',
    bundleKb: 8.4,
    a11yScore: 100,
    status: 'Stable',
    owner: 'Elena Rostova',
  },
  {
    id: 'JX-02',
    component: 'JXButton',
    category: 'Inputs',
    bundleKb: 4.1,
    a11yScore: 100,
    status: 'Stable',
    owner: 'Sora Takahashi',
  },
  {
    id: 'JX-22',
    component: 'JXTable',
    category: 'Data Display',
    bundleKb: 11.2,
    a11yScore: 99,
    status: 'Stable',
    owner: 'Marcus Vance',
  },
  {
    id: 'JX-30',
    component: 'JXSnackbar',
    category: 'Feedback',
    bundleKb: 6.8,
    a11yScore: 100,
    status: 'Stable',
    owner: 'Liam O’Connor',
  },
  {
    id: 'JX-51',
    component: 'JXDataGrid',
    category: 'Enterprise X',
    bundleKb: 14.6,
    a11yScore: 100,
    status: 'Stable',
    owner: 'Nadia Al-Mansoor',
  },
  {
    id: 'JX-53',
    component: 'JXCharts',
    category: 'Enterprise X',
    bundleKb: 12.9,
    a11yScore: 98,
    status: 'RC',
    owner: 'Elena Rostova',
  },
];

const CHART_POINTS = [
  { month: 'May', jxuiMs: 4.2, muiMs: 14.8 },
  { month: 'Jun', jxuiMs: 3.9, muiMs: 15.1 },
  { month: 'Jul', jxuiMs: 3.6, muiMs: 14.5 },
  { month: 'Aug', jxuiMs: 3.1, muiMs: 15.8 },
  { month: 'Sep', jxuiMs: 2.8, muiMs: 16.2 },
  { month: 'Oct', jxuiMs: 2.4, muiMs: 16.0 },
];

export const Category7EnterpriseX: React.FC = () => {
  const { palette, getRadiusClass, pushToast } = useJXTheme();
  const specs = COMPONENT_CATALOG.filter((c) => c.category === 'enterprise-x');
  const getSpec = (num: number) => specs.find((s) => s.number === num)!;

  // #51 JXDataGrid state
  const [gridRows, setGridRows] = useState<GridRow[]>(INITIAL_GRID_ROWS);
  const [density, setDensity] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [editingCell, setEditingCell] = useState<{ id: string; value: string } | null>(null);
  const [exportedModalData, setExportedModalData] = useState<string | null>(null);

  // #52 JXDateRangePicker state
  const [nlQuery, setNlQuery] = useState('in 3 days');
  const [dateRange, setDateRange] = useState({
    label: 'In 3 days',
    startDate: '2026-10-29',
    endDate: '2026-11-01',
  });

  // #53 JXCharts state
  const [chartHoverIdx, setChartHoverIdx] = useState<number>(5);
  const [showJxuiSeries, setShowJxuiSeries] = useState(true);
  const [showMuiSeries, setShowMuiSeries] = useState(true);

  // #54 JXTreeView state
  const [treeSearch, setTreeSearch] = useState('');
  const [renamingFileId, setRenamingFileId] = useState<string | null>(null);
  const [renameBuffer, setRenameBuffer] = useState('');
  const [treeFiles, setTreeFiles] = useState([
    { id: 'f1', folder: 'src/components', name: 'JXButton.tsx', size: '4.1 KB' },
    { id: 'f2', folder: 'src/components', name: 'JXDataGrid.tsx', size: '14.6 KB' },
    { id: 'f3', folder: 'src/theme', name: 'tokens.ts', size: '3.2 KB' },
    { id: 'f4', folder: 'src/utils', name: 'springPhysics.ts', size: '2.8 KB' },
  ]);

  // #55 JXRichTextEditor & JXUploadDropzone state
  const [editorBlocks, setEditorBlocks] = useState<string[]>([
    '# JXUI v3.0 Architecture Release Notes',
    'All 55+ components support zero-layout-shift morphing and glassmorphic surfaces.',
  ]);
  const [slashInput, setSlashInput] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([
    { name: 'jxui-tokens-v3.json', size: '18.4 KB', progress: 100 },
    { name: 'benchmark-flamegraph.svg', size: '142.0 KB', progress: 100 },
  ]);

  const filteredGridRows =
    categoryFilter === 'All'
      ? gridRows
      : gridRows.filter((r) => r.category === categoryFilter);

  const handleNaturalLanguageInput = (val: string) => {
    setNlQuery(val);
    const parsed = parseNaturalLanguageDate(val);
    if (parsed) {
      setDateRange({
        label: parsed.label,
        startDate: parsed.startDate,
        endDate: parsed.endDate,
      });
    }
  };

  const rowPadding =
    density === 'compact' ? 'py-1.5 px-3' : density === 'spacious' ? 'py-3.5 px-4' : 'py-2.5 px-3.5';

  return (
    <div className="space-y-8">
      {/* #51 JXDataGrid */}
      <ShowcaseCard
        spec={getSpec(51)}
        headerControls={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const csv = exportRowsToCSV(filteredGridRows);
                setExportedModalData(csv);
                pushToast({
                  title: 'Exported DataGrid CSV',
                  description: `${filteredGridRows.length} rows formatted cleanly`,
                  variant: 'success',
                });
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          {/* Toolbar: Filter Pills & Density Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {['All', 'Inputs', 'Data Display', 'Feedback', 'Enterprise X'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  aria-label={`Filter grid by ${cat}`}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    categoryFilter === cat
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 mr-1">Density:</span>
              {(['compact', 'comfortable', 'spacious'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDensity(d)}
                  className={`px-2 py-1 rounded capitalize ${
                    density === d
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                      : 'text-slate-500'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* DataGrid Table */}
          <div className="overflow-x-auto border border-slate-200/80 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <th className={rowPadding}>ID</th>
                  <th className={rowPadding}>Component</th>
                  <th className={rowPadding}>Category</th>
                  <th className={`${rowPadding} text-right`}>Bundle (Gzip)</th>
                  <th className={`${rowPadding} text-right`}>A11y Score</th>
                  <th className={rowPadding}>Owner (Click to Edit)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                {filteredGridRows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className={`${rowPadding} font-mono text-slate-400`}>{row.id}</td>
                    <td className={`${rowPadding} font-mono font-bold text-slate-900 dark:text-white`}>
                      {row.component}
                    </td>
                    <td className={rowPadding}>{row.category}</td>
                    <td className={`${rowPadding} text-right font-mono tabular-nums`}>
                      {row.bundleKb.toFixed(1)} KB
                    </td>
                    <td className={`${rowPadding} text-right font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-semibold`}>
                      {row.a11yScore}%
                    </td>
                    <td className={rowPadding}>
                      {editingCell?.id === row.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editingCell.value}
                            onChange={(e) =>
                              setEditingCell({ id: row.id, value: e.target.value })
                            }
                            aria-label={`Edit owner for ${row.component}`}
                            className="px-2 py-0.5 text-xs bg-white dark:bg-slate-900 border border-indigo-500 rounded focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setGridRows((prev) =>
                                prev.map((r) =>
                                  r.id === row.id ? { ...r, owner: editingCell.value } : r
                                )
                              );
                              setEditingCell(null);
                            }}
                            aria-label="Save owner edit"
                            className="p-1 text-emerald-600"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setEditingCell({ id: row.id, value: row.owner })}
                          className="inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 group"
                        >
                          <span>{row.owner}</span>
                          <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 text-slate-400" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {exportedModalData && (
            <div className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] space-y-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span>Generated CSV Output</span>
                <button
                  type="button"
                  onClick={() => setExportedModalData(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <pre className="overflow-x-auto text-emerald-300">{exportedModalData}</pre>
            </div>
          )}
        </div>
      </ShowcaseCard>

      {/* #52 JXDateRangePicker & #53 JXCharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ShowcaseCard spec={getSpec(52)}>
          <div className="space-y-4">
            {/* Natural Language Input Header */}
            <div className="space-y-1.5">
              <label
                htmlFor="jx-nl-date-input"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between"
              >
                <span>Natural Language Date Parser</span>
                <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400">
                  Try: "today", "in 3 days", "next friday", "ytd"
                </span>
              </label>
              <div
                className={`flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 ${getRadiusClass('control')}`}
              >
                <Sparkles className={`w-4 h-4 shrink-0 ${palette.text}`} />
                <input
                  id="jx-nl-date-input"
                  type="text"
                  value={nlQuery}
                  onChange={(e) => handleNaturalLanguageInput(e.target.value)}
                  placeholder='Type "in 3 days", "next friday", or "ytd"...'
                  className="w-full text-xs bg-transparent focus:outline-none"
                />
              </div>
            </div>

            {/* Presets + Resolved Range Card */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5 flex flex-col gap-1 border-r border-slate-200/70 dark:border-slate-800 pr-2">
                {[
                  { label: 'Today', q: 'today' },
                  { label: 'In 3 Days', q: 'in 3 days' },
                  { label: 'Next Friday', q: 'next friday' },
                  { label: 'This Quarter', q: 'this quarter' },
                  { label: 'Year to Date (YTD)', q: 'ytd' },
                ].map((preset) => (
                  <button
                    key={preset.q}
                    type="button"
                    onClick={() => handleNaturalLanguageInput(preset.q)}
                    className={`text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                      nlQuery.toLowerCase() === preset.q
                        ? `${palette.softBg} ${palette.text} font-semibold`
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="sm:col-span-7 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white">
                  <Calendar className={`w-4 h-4 ${palette.text}`} />
                  <span>{dateRange.label}</span>
                </div>
                <div className="my-3 grid grid-cols-2 gap-2 font-mono text-xs">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400">START DATE</div>
                    <div className="font-bold mt-0.5 tabular-nums">{dateRange.startDate}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400">END DATE</div>
                    <div className="font-bold mt-0.5 tabular-nums">{dateRange.endDate}</div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500">
                  Zero multi-month click fatigue · Instant keyboard resolution
                </div>
              </div>
            </div>
          </div>
        </ShowcaseCard>

        <ShowcaseCard spec={getSpec(53)}>
          <div className="space-y-3">
            {/* Interactive Legend Toggle Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowJxuiSeries((v) => !v)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-opacity ${
                    showJxuiSeries
                      ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
                  }`}
                >
                  JXUI Render Time (ms)
                </button>
                <button
                  type="button"
                  onClick={() => setShowMuiSeries((v) => !v)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-opacity ${
                    showMuiSeries
                      ? 'border-slate-400/40 bg-slate-500/10 text-slate-700 dark:text-slate-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
                  }`}
                >
                  Legacy MUI Baseline (ms)
                </button>
              </div>

              <div className="font-mono text-xs text-slate-600 dark:text-slate-300 tabular-nums">
                {CHART_POINTS[chartHoverIdx].month}:{' '}
                <strong className="text-indigo-600 dark:text-indigo-400">
                  {CHART_POINTS[chartHoverIdx].jxuiMs}ms
                </strong>{' '}
                vs {CHART_POINTS[chartHoverIdx].muiMs}ms
              </div>
            </div>

            {/* Interactive SVG Area + Crosshair Scrubber */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
              <div className="grid grid-cols-6 gap-2 items-end h-36 pt-4 px-2">
                {CHART_POINTS.map((pt, idx) => {
                  const active = idx === chartHoverIdx;
                  return (
                    <button
                      key={pt.month}
                      type="button"
                      onMouseEnter={() => setChartHoverIdx(idx)}
                      onClick={() => setChartHoverIdx(idx)}
                      className={`group flex flex-col items-center justify-end h-full gap-1.5 rounded-lg p-1 transition-colors ${
                        active ? 'bg-indigo-500/10' : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="w-full flex items-end justify-center gap-1 h-24">
                        {showMuiSeries && (
                          <div
                            style={{ height: `${(pt.muiMs / 18) * 100}%` }}
                            className="w-3 rounded-t bg-slate-300 dark:bg-slate-700 transition-all"
                          />
                        )}
                        {showJxuiSeries && (
                          <div
                            style={{ height: `${(pt.jxuiMs / 18) * 100}%` }}
                            className={`w-3 rounded-t ${palette.bg} transition-all`}
                          />
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{pt.month}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </ShowcaseCard>
      </div>

      {/* #54 JXTreeView & #55 JXRichTextEditor + JXUploadDropzone */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ShowcaseCard spec={getSpec(54)}>
          <div className="space-y-3">
            <input
              type="text"
              value={treeSearch}
              onChange={(e) => setTreeSearch(e.target.value)}
              placeholder="Filter repository hierarchy (e.g. Button, tokens)..."
              aria-label="Filter repository hierarchy"
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none"
            />
            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                <FolderOpen className="w-4 h-4 text-indigo-500" />
                <span>@jxui/react-workspace</span>
              </div>
              <div className="ml-4 pl-3 border-l border-slate-300 dark:border-slate-700 space-y-1">
                {treeFiles
                  .filter(
                    (f) =>
                      f.name.toLowerCase().includes(treeSearch.toLowerCase()) ||
                      f.folder.toLowerCase().includes(treeSearch.toLowerCase())
                  )
                  .map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-900"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileCode className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-400 font-mono text-[11px]">{file.folder}/</span>
                        {renamingFileId === file.id ? (
                          <input
                            type="text"
                            value={renameBuffer}
                            onChange={(e) => setRenameBuffer(e.target.value)}
                            aria-label="Rename file"
                            className="px-1.5 py-0.5 text-xs font-mono bg-white dark:bg-slate-800 border border-indigo-500 rounded"
                          />
                        ) : (
                          <span className="font-mono font-semibold truncate">{file.name}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono text-[11px] text-slate-400">{file.size}</span>
                        {renamingFileId === file.id ? (
                          <button
                            type="button"
                            onClick={() => {
                              if (renameBuffer.trim()) {
                                setTreeFiles((prev) =>
                                  prev.map((x) =>
                                    x.id === file.id ? { ...x, name: renameBuffer.trim() } : x
                                  )
                                );
                              }
                              setRenamingFileId(null);
                            }}
                            aria-label="Confirm rename"
                            className="text-emerald-500"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setRenamingFileId(file.id);
                              setRenameBuffer(file.name);
                            }}
                            aria-label={`Rename ${file.name}`}
                            className="text-slate-400 hover:text-indigo-500"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </ShowcaseCard>

        <ShowcaseCard spec={getSpec(55)}>
          <div className="space-y-4">
            {/* Slash-Command Block Editor */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/50">
              <div className="px-3 py-1.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setEditorBlocks((b) => [...b, '## New Architectural Milestone'])
                    }
                    className="px-2 py-1 text-[11px] font-medium rounded hover:bg-slate-200 dark:hover:bg-slate-800 inline-flex items-center gap-1"
                  >
                    <Heading1 className="w-3 h-3" /> H2
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setEditorBlocks((b) => [...b, '• Verified WCAG AA contrast ratios'])
                    }
                    className="px-2 py-1 text-[11px] font-medium rounded hover:bg-slate-200 dark:hover:bg-slate-800 inline-flex items-center gap-1"
                  >
                    <List className="w-3 h-3" /> Bullet
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setEditorBlocks((b) => [...b, '`<JXThemeProvider radius="lg" />`'])
                    }
                    className="px-2 py-1 text-[11px] font-medium rounded hover:bg-slate-200 dark:hover:bg-slate-800 inline-flex items-center gap-1"
                  >
                    <Code2 className="w-3 h-3" /> Code
                  </button>
                </div>
                <span className="font-mono text-[10px] text-slate-400">Slash (/) Editor</span>
              </div>
              <div className="p-3 space-y-1.5 text-xs">
                {editorBlocks.map((block, i) => (
                  <div key={i} className="font-mono text-slate-700 dark:text-slate-300">
                    {block}
                  </div>
                ))}
                <input
                  type="text"
                  value={slashInput}
                  onChange={(e) => setSlashInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && slashInput.trim()) {
                      setEditorBlocks((b) => [...b, slashInput.trim()]);
                      setSlashInput('');
                    }
                  }}
                  placeholder="Type a block and press Enter..."
                  aria-label="Slash command block input"
                  className="w-full pt-1 text-xs bg-transparent focus:outline-none text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Interactive Upload Dropzone */}
            <div className="p-3.5 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50/40 dark:bg-slate-950/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <UploadCloud className={`w-4 h-4 ${palette.text}`} />
                  <span className="font-semibold">JXUploadDropzone</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newName = `bundle-report-${uploadedFiles.length + 1}.json`;
                    setUploadedFiles((prev) => [
                      ...prev,
                      { name: newName, size: '24.8 KB', progress: 100 },
                    ]);
                    pushToast({ title: `Uploaded ${newName}`, variant: 'success' });
                  }}
                  className={`px-2.5 py-1 text-xs font-semibold text-white ${palette.bg} rounded-lg`}
                >
                  Simulate File Drop
                </button>
              </div>
              <div className="space-y-1">
                {uploadedFiles.map((f) => (
                  <div
                    key={f.name}
                    className="flex items-center justify-between text-xs px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800"
                  >
                    <span className="inline-flex items-center gap-1.5 font-mono">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      {f.name}
                    </span>
                    <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                      {f.size} · {f.progress}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ShowcaseCard>
      </div>
    </div>
  );
};
