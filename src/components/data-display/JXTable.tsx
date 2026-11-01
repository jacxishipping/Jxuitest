// @jxui/react v3.0.0 — JXTable (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { useJXTheme } from '../../context/JXThemeContext';

export interface JXTableRowData {
  id: string;
  service: string;
  env: string;
  latency: string;
  commit: string;
  detail: string;
}

export interface JXTableProps {
  rows?: JXTableRowData[];
  defaultSelectedIds?: string[];
  bulkActionLabel?: string;
  onBulkAction?: (selectedIds: string[]) => void;
  className?: string;
}

const DEFAULT_TABLE_ROWS: JXTableRowData[] = [
  {
    id: 'dep-941',
    service: 'edge-router-v4',
    env: 'Production',
    latency: '11.4 ms',
    commit: '8f3a19c',
    detail: 'Zero-downtime rollout across 310 Anycast locations · 0 failed health checks.',
  },
  {
    id: 'dep-940',
    service: 'auth-token-signer',
    env: 'Production',
    latency: '8.2 ms',
    commit: '4b92e01',
    detail: 'HSM key rotation schedule verified · Ed25519 signature throughput +18%.',
  },
  {
    id: 'dep-939',
    service: 'telemetry-ingestor',
    env: 'Staging',
    latency: '24.9 ms',
    commit: '1c77d4a',
    detail: 'ClickHouse batch buffer tuned to 50,000 events/flush.',
  },
  {
    id: 'dep-938',
    service: 'billing-usage-aggregator',
    env: 'Production',
    latency: '19.1 ms',
    commit: '9e04b2f',
    detail: 'Idempotent Stripe metering webhook worker active.',
  },
];

export const JXTable: React.FC<JXTableProps> = ({
  rows = DEFAULT_TABLE_ROWS,
  defaultSelectedIds = ['dep-941'],
  bulkActionLabel = 'Promote to Canary',
  onBulkAction,
  className = '',
}) => {
  const { getRadiusClass, pushToast } = useJXTheme();
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultSelectedIds);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const sortedRows = [...rows].sort((a, b) =>
    sortAsc ? a.service.localeCompare(b.service) : b.service.localeCompare(a.service)
  );

  return (
    <div className={`relative space-y-3 ${className}`}>
      <div className="overflow-x-auto border border-slate-200/80 dark:border-slate-800 rounded-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/90 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 text-slate-500">
              <th className="py-2.5 px-3 w-10">
                <input
                  type="checkbox"
                  aria-label="Select all deployments"
                  checked={selectedIds.length === sortedRows.length && sortedRows.length > 0}
                  onChange={(e) =>
                    setSelectedIds(e.target.checked ? sortedRows.map((r) => r.id) : [])
                  }
                />
              </th>
              <th className="py-2.5 px-3">
                <button
                  type="button"
                  onClick={() => setSortAsc((s) => !s)}
                  className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300"
                >
                  <span>Service Name</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-2.5 px-3">Environment</th>
              <th className="py-2.5 px-3">Commit</th>
              <th className="py-2.5 px-3 text-right">p99 Latency</th>
              <th className="py-2.5 px-3 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
            {sortedRows.map((row) => {
              const isChecked = selectedIds.includes(row.id);
              const isExpanded = expandedId === row.id;
              return (
                <React.Fragment key={row.id}>
                  <tr
                    className={`transition-colors ${
                      isChecked
                        ? 'bg-indigo-50/50 dark:bg-indigo-950/30'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <input
                        type="checkbox"
                        aria-label={`Select ${row.service}`}
                        checked={isChecked}
                        onChange={() =>
                          setSelectedIds((prev) =>
                            prev.includes(row.id)
                              ? prev.filter((i) => i !== row.id)
                              : [...prev, row.id]
                          )
                        }
                      />
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-900 dark:text-slate-100">
                      {row.service}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                      {row.env}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{row.commit}</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                      {row.latency}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : row.id)}
                        className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                      >
                        {isExpanded ? 'Hide' : 'Inspect'}
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="bg-slate-50/70 dark:bg-slate-950/50">
                      <td
                        colSpan={6}
                        className="px-6 py-2.5 text-xs text-slate-600 dark:text-slate-400 font-mono"
                      >
                        ↳ {row.detail}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedIds.length > 0 && (
        <div
          className={`flex flex-wrap items-center justify-between gap-4 px-4 py-2.5 bg-slate-900/95 dark:bg-slate-800/95 text-white backdrop-blur-md jx-elevation-3 ${getRadiusClass('control')}`}
        >
          <div className="text-xs font-medium">
            <span className="font-mono font-bold">{selectedIds.length}</span> service
            {selectedIds.length > 1 ? 's' : ''} selected
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (onBulkAction) {
                  onBulkAction(selectedIds);
                } else {
                  pushToast({
                    title: `Promoted ${selectedIds.length} service(s) to Canary`,
                    variant: 'success',
                  });
                }
              }}
              className="px-3 py-1 text-xs font-semibold rounded-md bg-indigo-500 hover:bg-indigo-400 text-white transition-colors"
            >
              {bulkActionLabel}
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1 text-xs text-slate-300 hover:text-white"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
