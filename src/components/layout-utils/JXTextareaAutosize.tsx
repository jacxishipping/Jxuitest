// @jxui/react v3.0.0 — JXTextareaAutosize (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bold, Italic, Code } from 'lucide-react';

export interface JXTextareaAutosizeProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  minRows?: number;
  maxRows?: number;
  maxLength?: number;
  showToolbar?: boolean;
  className?: string;
}

export const JXTextareaAutosize: React.FC<JXTextareaAutosizeProps> = ({
  value: controlledValue,
  defaultValue = 'Release notes: Upgraded all 60+ MUI components to tactile spring physics and zero-notch inputs.',
  onChange,
  minRows = 3,
  maxRows = 8,
  maxLength = 280,
  showToolbar = true,
  className = '',
  ...rest
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const text = controlledValue !== undefined ? controlledValue : internalValue;

  const updateValue = (next: string) => {
    if (controlledValue === undefined) setInternalValue(next);
    onChange?.(next);
  };

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const lineHeight = 20;
    const minHeight = minRows * lineHeight + 20;
    const maxHeight = maxRows * lineHeight + 20;
    const nextHeight = Math.min(Math.max(el.scrollHeight, minHeight), maxHeight);
    el.style.height = `${nextHeight}px`;
  }, [text, minRows, maxRows]);

  const insertFormatting = (snippet: string) => {
    updateValue(text + snippet);
    textareaRef.current?.focus();
  };

  return (
    <div
      className={`rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden focus-within:border-indigo-500 focus-within:ring-3 focus-within:ring-indigo-500/15 transition-all ${className}`}
    >
      {showToolbar && (
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 px-3 py-1.5">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => insertFormatting(' **bold**')}
              aria-label="Bold"
              className="rounded p-1 text-slate-500 hover:bg-slate-200/60 dark:hover:bg-slate-700 cursor-pointer"
            >
              <Bold className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting(' _italic_')}
              aria-label="Italic"
              className="rounded p-1 text-slate-500 hover:bg-slate-200/60 dark:hover:bg-slate-700 cursor-pointer"
            >
              <Italic className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting(' `code`')}
              aria-label="Code"
              className="rounded p-1 text-slate-500 hover:bg-slate-200/60 dark:hover:bg-slate-700 cursor-pointer"
            >
              <Code className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {text.length} / {maxLength} chars
          </span>
        </div>
      )}
      <textarea
        ref={textareaRef}
        value={text}
        maxLength={maxLength}
        onChange={(e) => updateValue(e.target.value)}
        rows={minRows}
        className="w-full resize-none bg-transparent p-3 text-xs text-slate-800 dark:text-slate-200 outline-none leading-relaxed"
        {...rest}
      />
    </div>
  );
};

// Companion Utility Primitives (JXTransitions, JXModal, JXPopper, JXPortal, JXClickAwayListener)
export interface JXTransitionsProps {
  in?: boolean;
  type?: 'fade' | 'scale' | 'slide-up';
  children: React.ReactNode;
}

export const JXTransitions: React.FC<JXTransitionsProps> = ({
  in: isVisible = true,
  type = 'scale',
  children,
}) => {
  if (!isVisible) return null;
  const animClass =
    type === 'fade'
      ? 'animate-in fade-in duration-200'
      : type === 'slide-up'
      ? 'animate-in fade-in slide-in-from-bottom-2 duration-200'
      : 'animate-in fade-in zoom-in-95 duration-200';
  return <div className={animClass}>{children}</div>;
};

export interface JXPortalProps {
  children: React.ReactNode;
  container?: Element | null;
  disablePortal?: boolean;
}

export const JXPortal: React.FC<JXPortalProps> = ({
  children,
  container,
  disablePortal = false,
}) => {
  if (disablePortal || typeof document === 'undefined') {
    return <>{children}</>;
  }
  return createPortal(children, container || document.body);
};

export interface JXClickAwayListenerProps {
  onClickAway: () => void;
  children: React.ReactNode;
}

export const JXClickAwayListener: React.FC<JXClickAwayListenerProps> = ({
  onClickAway,
  children,
}) => {
  const nodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      if (nodeRef.current && !nodeRef.current.contains(e.target as Node)) {
        onClickAway();
      }
    };
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, [onClickAway]);

  return <div ref={nodeRef}>{children}</div>;
};
