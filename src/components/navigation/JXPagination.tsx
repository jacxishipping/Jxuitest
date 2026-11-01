// @jxui/react v3.0.0 — JXPagination (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface JXPaginationProps {
  totalItems?: number;
  page?: number;
  defaultPage?: number;
  rowsPerPage?: number;
  defaultRowsPerPage?: number;
  rowsPerPageOptions?: number[];
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  showFirstLastButtons?: boolean;
  className?: string;
}

export const JXPagination: React.FC<JXPaginationProps> = ({
  totalItems = 240,
  page: controlledPage,
  defaultPage = 2,
  rowsPerPage: controlledRowsPerPage,
  defaultRowsPerPage = 25,
  rowsPerPageOptions = [10, 25, 50, 100],
  onPageChange,
  onRowsPerPageChange,
  showFirstLastButtons = false,
  className = '',
}) => {
  const [internalPage, setInternalPage] = useState(defaultPage);
  const [internalRowsPerPage, setInternalRowsPerPage] = useState(defaultRowsPerPage);

  const page = controlledPage !== undefined ? controlledPage : internalPage;
  const rowsPerPage = controlledRowsPerPage !== undefined ? controlledRowsPerPage : internalRowsPerPage;

  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalItems);

  const handleSetPage = (nextPage: number) => {
    const clamped = Math.min(Math.max(1, nextPage), totalPages);
    if (controlledPage === undefined) setInternalPage(clamped);
    onPageChange?.(clamped);
  };

  const handleSetRows = (nextRows: number) => {
    if (controlledRowsPerPage === undefined) setInternalRowsPerPage(nextRows);
    onRowsPerPageChange?.(nextRows);
    handleSetPage(1);
  };

  // Compute visible page numbers
  const visiblePages: number[] = [];
  const maxVisible = 5;
  let startP = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endP = Math.min(totalPages, startP + maxVisible - 1);
  if (endP - startP + 1 < maxVisible) {
    startP = Math.max(1, endP - maxVisible + 1);
  }
  for (let p = startP; p <= endP; p++) {
    visiblePages.push(p);
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
        <span className="font-mono">
          Showing <strong className="text-slate-900 dark:text-white">{startItem}–{endItem}</strong> of{' '}
          <strong className="text-slate-900 dark:text-white">{totalItems}</strong>
        </span>
        <div className="flex items-center gap-1.5">
          <label htmlFor="jx-rows-per-page" className="text-[11px] font-medium text-slate-500">
            Rows:
          </label>
          <select
            id="jx-rows-per-page"
            value={rowsPerPage}
            onChange={(e) => handleSetRows(Number(e.target.value))}
            aria-label="Rows per page"
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
          >
            {rowsPerPageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt} / page
              </option>
            ))}
          </select>
        </div>
      </div>

      <nav aria-label="Pagination" className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1">
          {showFirstLastButtons && (
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => handleSetPage(1)}
              aria-label="First page"
              className="rounded-lg border border-slate-200 dark:border-slate-700 p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronsLeft className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => handleSetPage(currentPage - 1)}
            aria-label="Previous page"
            className="rounded-lg border border-slate-200 dark:border-slate-700 p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          {visiblePages.map((p) => {
            const isCurrent = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => handleSetPage(p)}
                aria-current={isCurrent ? 'page' : undefined}
                className={`h-8 w-8 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-sm scale-105'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => handleSetPage(currentPage + 1)}
            aria-label="Next page"
            className="rounded-lg border border-slate-200 dark:border-slate-700 p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          {showFirstLastButtons && (
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => handleSetPage(totalPages)}
              aria-label="Last page"
              className="rounded-lg border border-slate-200 dark:border-slate-700 p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronsRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};
