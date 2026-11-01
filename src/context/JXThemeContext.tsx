import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, Loader2, X, RotateCcw } from 'lucide-react';
import {
  JX_THEME_MODE_STORAGE_KEY,
  isValidThemeMode,
  resolveStoredThemeMode,
  persistThemeMode,
} from '../utils/jxuiLogic';

export type ThemeMode = 'light' | 'dark';
export type AccentColor = 'indigo' | 'violet' | 'emerald' | 'rose' | 'ocean';
export type RadiusScale = 'sharp' | 'sm' | 'md' | 'lg' | 'xl';
export type CompareMode = 'jxui' | 'split';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: 'default' | 'success' | 'warning' | 'error' | 'loading';
  undoAction?: () => void;
  createdAt: number;
}

export interface AccentPalette {
  name: string;
  hex: string;
  bg: string;
  bgHover: string;
  text: string;
  border: string;
  softBg: string;
  ring: string;
  gradient: string;
}

export const ACCENT_PALETTES: Record<AccentColor, AccentPalette> = {
  indigo: {
    name: 'Indigo',
    hex: '#4f46e5',
    bg: 'bg-indigo-600 dark:bg-indigo-500',
    bgHover: 'hover:bg-indigo-500 dark:hover:bg-indigo-400',
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-500/40 dark:border-indigo-400/40',
    softBg: 'bg-indigo-500/10 dark:bg-indigo-400/15',
    ring: 'focus-visible:ring-indigo-500/30',
    gradient: 'from-indigo-600 to-violet-600',
  },
  violet: {
    name: 'Violet',
    hex: '#7c3aed',
    bg: 'bg-violet-600 dark:bg-violet-500',
    bgHover: 'hover:bg-violet-500 dark:hover:bg-violet-400',
    text: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-500/40 dark:border-violet-400/40',
    softBg: 'bg-violet-500/10 dark:bg-violet-400/15',
    ring: 'focus-visible:ring-violet-500/30',
    gradient: 'from-violet-600 to-fuchsia-600',
  },
  emerald: {
    name: 'Emerald',
    hex: '#059669',
    bg: 'bg-emerald-600 dark:bg-emerald-500',
    bgHover: 'hover:bg-emerald-500 dark:hover:bg-emerald-400',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/40 dark:border-emerald-400/40',
    softBg: 'bg-emerald-500/10 dark:bg-emerald-400/15',
    ring: 'focus-visible:ring-emerald-500/30',
    gradient: 'from-emerald-600 to-teal-600',
  },
  rose: {
    name: 'Rose',
    hex: '#e11d48',
    bg: 'bg-rose-600 dark:bg-rose-500',
    bgHover: 'hover:bg-rose-500 dark:hover:bg-rose-400',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-500/40 dark:border-rose-400/40',
    softBg: 'bg-rose-500/10 dark:bg-rose-400/15',
    ring: 'focus-visible:ring-rose-500/30',
    gradient: 'from-rose-600 to-orange-500',
  },
  ocean: {
    name: 'Ocean',
    hex: '#0284c7',
    bg: 'bg-sky-600 dark:bg-sky-500',
    bgHover: 'hover:bg-sky-500 dark:hover:bg-sky-400',
    text: 'text-sky-600 dark:text-sky-400',
    border: 'border-sky-500/40 dark:border-sky-400/40',
    softBg: 'bg-sky-500/10 dark:bg-sky-400/15',
    ring: 'focus-visible:ring-sky-500/30',
    gradient: 'from-sky-600 to-cyan-500',
  },
};

export interface JXThemeProviderProps {
  children: React.ReactNode;
  /** Optional fallback theme mode when no saved preference exists in localStorage */
  defaultMode?: ThemeMode;
  /** Custom localStorage key for persisting the user's light/dark theme choice (default: 'jxui-theme-mode') */
  storageKey?: string;
}

interface JXThemeContextValue {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  toggleMode: () => void;
  accent: AccentColor;
  setAccent: (a: AccentColor) => void;
  palette: AccentPalette;
  radiusScale: RadiusScale;
  setRadiusScale: (r: RadiusScale) => void;
  getRadiusClass: (tier?: 'control' | 'card' | 'pill') => string;
  compareMode: CompareMode;
  setCompareMode: (c: CompareMode) => void;
  toasts: ToastItem[];
  pushToast: (toast: Omit<ToastItem, 'id' | 'createdAt'>) => string;
  triggerPromiseToast: (actionLabel: string) => void;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
}

function applyThemeModeToDocument(mode: ThemeMode): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  root.setAttribute('data-theme', mode);
  root.style.colorScheme = mode;
}

function getInitialThemeMode(storageKey: string, defaultMode?: ThemeMode): ThemeMode {
  return resolveStoredThemeMode({ storageKey, defaultMode });
}

function getInitialAccent(): AccentColor {
  if (typeof window === 'undefined') return 'indigo';
  try {
    const saved = localStorage.getItem('jxui-theme-accent') as AccentColor;
    if (saved && ACCENT_PALETTES[saved]) return saved;
  } catch {
    // ignore
  }
  return 'indigo';
}

function getInitialRadius(): RadiusScale {
  if (typeof window === 'undefined') return 'lg';
  try {
    const saved = localStorage.getItem('jxui-theme-radius') as RadiusScale;
    if (['sharp', 'sm', 'md', 'lg', 'xl'].includes(saved)) return saved;
  } catch {
    // ignore
  }
  return 'lg';
}

function getInitialCompareMode(): CompareMode {
  if (typeof window === 'undefined') return 'jxui';
  try {
    const saved = localStorage.getItem('jxui-theme-compare') as CompareMode;
    if (saved === 'jxui' || saved === 'split') return saved;
  } catch {
    // ignore
  }
  return 'jxui';
}

const JXThemeContext = createContext<JXThemeContextValue | null>(null);

export const JXThemeProvider: React.FC<JXThemeProviderProps> = ({
  children,
  defaultMode,
  storageKey = JX_THEME_MODE_STORAGE_KEY,
}) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const initial = getInitialThemeMode(storageKey, defaultMode);
    applyThemeModeToDocument(initial);
    return initial;
  });
  const [accent, setAccent] = useState<AccentColor>(getInitialAccent);
  const [radiusScale, setRadiusScale] = useState<RadiusScale>(getInitialRadius);
  const [compareMode, setCompareMode] = useState<CompareMode>(getInitialCompareMode);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [stackHovered, setStackHovered] = useState(false);

  const setMode = useCallback(
    (nextMode: ThemeMode) => {
      if (!isValidThemeMode(nextMode)) return;
      setModeState(nextMode);
      applyThemeModeToDocument(nextMode);
      persistThemeMode(nextMode, undefined, storageKey);
    },
    [storageKey]
  );

  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      const next: ThemeMode = prev === 'light' ? 'dark' : 'light';
      applyThemeModeToDocument(next);
      persistThemeMode(next, undefined, storageKey);
      return next;
    });
  }, [storageKey]);

  useEffect(() => {
    applyThemeModeToDocument(mode);
    persistThemeMode(mode, undefined, storageKey);
  }, [mode, storageKey]);

  // Synchronize light/dark mode across tabs or external localStorage updates
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleStorageChange = (event: StorageEvent) => {
      if (
        (event.key === storageKey || event.key === JX_THEME_MODE_STORAGE_KEY) &&
        isValidThemeMode(event.newValue)
      ) {
        setModeState(event.newValue);
        applyThemeModeToDocument(event.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem('jxui-theme-accent', accent);
    } catch {
      // ignore
    }
  }, [accent]);

  useEffect(() => {
    try {
      localStorage.setItem('jxui-theme-radius', radiusScale);
    } catch {
      // ignore
    }
  }, [radiusScale]);

  useEffect(() => {
    try {
      localStorage.setItem('jxui-theme-compare', compareMode);
    } catch {
      // ignore
    }
  }, [compareMode]);

  const getRadiusClass = useCallback(
    (tier: 'control' | 'card' | 'pill' = 'control') => {
      if (radiusScale === 'sharp') return 'rounded-none';
      if (tier === 'pill') {
        return radiusScale === 'sm' ? 'rounded-md' : 'rounded-full';
      }
      if (tier === 'card') {
        switch (radiusScale) {
          case 'sm':
            return 'rounded-lg';
          case 'md':
            return 'rounded-xl';
          case 'lg':
            return 'rounded-2xl';
          case 'xl':
            return 'rounded-3xl';
        }
      }
      switch (radiusScale) {
        case 'sm':
          return 'rounded-md';
        case 'md':
          return 'rounded-lg';
        case 'lg':
          return 'rounded-xl';
        case 'xl':
          return 'rounded-2xl';
      }
    },
    [radiusScale]
  );

  const pushToast = useCallback((toast: Omit<ToastItem, 'id' | 'createdAt'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [{ ...toast, id, createdAt: Date.now() }, ...prev.slice(0, 4)]);
    return id;
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const triggerPromiseToast = useCallback((actionLabel: string) => {
    const id = `promise-${Date.now()}`;
    setToasts((prev) => [
      {
        id,
        title: `Syncing ${actionLabel}...`,
        description: 'Negotiating edge replica state',
        variant: 'loading',
        createdAt: Date.now(),
      },
      ...prev.slice(0, 4),
    ]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                title: `${actionLabel} Completed`,
                description: 'Committed in 142ms with zero layout shift',
                variant: 'success',
              }
            : t
        )
      );
    }, 1100);
  }, []);

  const palette = ACCENT_PALETTES[accent];

  return (
    <JXThemeContext.Provider
      value={{
        mode,
        setMode,
        toggleMode,
        accent,
        setAccent,
        palette,
        radiusScale,
        setRadiusScale,
        getRadiusClass,
        compareMode,
        setCompareMode,
        toasts,
        pushToast,
        triggerPromiseToast,
        dismissToast,
        clearToasts,
      }}
    >
      {children}

      {/* Global Sonner-Style 3D Spatial Toast Stack (Component #30 JXSnackbar Live Engine) */}
      {toasts.length > 0 && (
        <div
          className="fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-none"
          onMouseEnter={() => setStackHovered(true)}
          onMouseLeave={() => setStackHovered(false)}
          role="region"
          aria-label="Notifications"
        >
          <div className="relative w-88 sm:w-96 pointer-events-auto">
            {toasts.slice(0, 4).map((t, index) => {
              const offset = stackHovered ? index * 76 : index * 10;
              const scale = stackHovered ? 1 : 1 - index * 0.045;
              const opacity = stackHovered ? 1 : index > 2 ? 0 : 1 - index * 0.2;

              return (
                <div
                  key={t.id}
                  style={{
                    transform: `translateY(-${offset}px) scale(${scale})`,
                    opacity,
                    zIndex: 50 - index,
                  }}
                  className={`absolute bottom-0 right-0 w-full transition-all duration-300 jx-spring bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 jx-elevation-3 p-3.5 ${getRadiusClass('control')}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {t.variant === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      {t.variant === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      {t.variant === 'error' && <XCircle className="w-4 h-4 text-rose-500" />}
                      {t.variant === 'loading' && <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />}
                      {t.variant === 'default' && <Info className="w-4 h-4 text-sky-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {t.title}
                      </p>
                      {t.description && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {t.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {t.undoAction && (
                        <button
                          type="button"
                          onClick={() => {
                            t.undoAction?.();
                            dismissToast(t.id);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Undo
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => dismissToast(t.id)}
                        aria-label={`Dismiss ${t.title}`}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </JXThemeContext.Provider>
  );
};

export function useJXTheme(): JXThemeContextValue {
  const ctx = useContext(JXThemeContext);
  if (!ctx) throw new Error('useJXTheme must be used inside JXThemeProvider');
  return ctx;
}
