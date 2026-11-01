// @jxui/react v3.0.0 — JXLink (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

export interface JXLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean;
  helperText?: string;
  previewTitle?: string;
}

export const JXLink: React.FC<JXLinkProps> = ({
  href = '#jx-data-grid',
  external = true,
  helperText,
  previewTitle,
  children = 'Explore RFC-042 Component Architecture',
  className = '',
  ...rest
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className={`relative inline-block ${className}`}>
      <a
        href={href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className="group inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400"
        {...rest}
      >
        <span className="bg-gradient-to-r from-indigo-600 to-indigo-600 bg-[length:0%_2px] bg-no-repeat bg-left-bottom group-hover:bg-[length:100%_2px] transition-all duration-200">
          {children}
        </span>
        {external && (
          <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        )}
      </a>
      {previewTitle && hovered && (
        <div
          role="tooltip"
          className="absolute bottom-full left-0 mb-1.5 z-20 whitespace-nowrap rounded-lg bg-slate-900 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-white shadow-md pointer-events-none"
        >
          {previewTitle}
        </div>
      )}
      {helperText && <p className="text-xs text-slate-500 mt-1">{helperText}</p>}
    </div>
  );
};
