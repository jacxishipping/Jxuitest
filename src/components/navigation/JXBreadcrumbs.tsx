// @jxui/react v3.0.0 — JXBreadcrumbs (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { Folder, ChevronRight } from 'lucide-react';

export interface JXBreadcrumbsProps {
  rootLabel?: string;
  hiddenSegments?: string[];
  siblingOptions?: string[];
  defaultSibling?: string;
  onSiblingChange?: (val: string) => void;
  className?: string;
}

export const JXBreadcrumbs: React.FC<JXBreadcrumbsProps> = ({
  rootLabel = 'Workspace',
  hiddenSegments = ['us-east-1', 'edge-mesh'],
  siblingOptions = ['Production', 'Staging', 'Canary'],
  defaultSibling = 'Production',
  onSiblingChange,
  className = '',
}) => {
  const [expanded, setExpanded] = useState(false);
  const [activeSibling, setActiveSibling] = useState(defaultSibling);

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex flex-wrap items-center gap-1.5 text-xs ${className}`}
    >
      <span className="inline-flex items-center gap-1 text-slate-500">
        <Folder className="w-3.5 h-3.5" /> {rootLabel}
      </span>
      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label="Expand hidden breadcrumb path"
          className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          ...
        </button>
      ) : (
        hiddenSegments.map((seg, i) => (
          <React.Fragment key={seg}>
            <span className="text-slate-600 dark:text-slate-300">{seg}</span>
            {i < hiddenSegments.length - 1 && (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
          </React.Fragment>
        ))
      )}
      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
      <select
        aria-label="Switch sibling environment"
        value={activeSibling}
        onChange={(e) => {
          setActiveSibling(e.target.value);
          onSiblingChange?.(e.target.value);
        }}
        className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:outline-none"
      >
        {siblingOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </nav>
  );
};
