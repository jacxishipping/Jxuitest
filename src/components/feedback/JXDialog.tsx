// @jxui/react v3.0.0 — JXDialog (JXUI v3.0 Unified Component Suite)
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useJXTheme } from '../../context/JXThemeContext';

export interface JXDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructiveGuard?: boolean;
  onConfirm?: () => void;
  triggerLabel?: string;
  className?: string;
}

export const JXDialog: React.FC<JXDialogProps> = ({
  open,
  defaultOpen = false,
  onOpenChange,
  title = 'Rotate Production Signing Keys',
  description = 'Rotating keys will issue a new Ed25519 keypair and keep the previous key valid for a 24-hour grace window.',
  confirmLabel = 'Confirm Rotation',
  cancelLabel = 'Cancel',
  destructiveGuard = true,
  onConfirm,
  triggerLabel = 'Open Spring Modal Sheet',
  className = '',
}) => {
  const { palette, getRadiusClass, pushToast } = useJXTheme();
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? open! : internalOpen;

  const [shake, setShake] = useState(false);

  const setOpenState = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenState(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  return (
    <div className={`space-y-3 ${className}`}>
      <p className="text-xs text-slate-600 dark:text-slate-400">
        Features 24px rounded corners, frosted glass header/footer, and destructive shake guard when clicking outside.
      </p>
      <button
        type="button"
        onClick={() => setOpenState(true)}
        className={`px-4 py-2 text-xs font-semibold text-white ${palette.bg} ${getRadiusClass('control')}`}
      >
        {triggerLabel}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4"
          onClick={() => {
            if (destructiveGuard) {
              setShake(true);
              setTimeout(() => setShake(false), 420);
            } else {
              setOpenState(false);
            }
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl jx-elevation-3 overflow-hidden ${
              shake ? 'jx-animate-shake' : ''
            }`}
          >
            <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-950/60 border-b border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {title}
              </h4>
              <button
                type="button"
                onClick={() => setOpenState(false)}
                aria-label="Close modal"
                className="p-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <p>{description}</p>
              {destructiveGuard && (
                <p className="text-[11px] text-slate-400">
                  Tip: Click the backdrop outside this dialog to see the destructive confirmation shake guard in action.
                </p>
              )}
            </div>
            <div className="px-6 py-3.5 bg-slate-50/80 dark:bg-slate-950/60 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpenState(false)}
                className="px-3.5 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpenState(false);
                  if (onConfirm) {
                    onConfirm();
                  } else {
                    pushToast({
                      title: 'Signing keys rotated cleanly',
                      variant: 'success',
                    });
                  }
                }}
                className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-rose-600 text-white hover:bg-rose-500"
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
