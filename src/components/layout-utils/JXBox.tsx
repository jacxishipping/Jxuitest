// @jxui/react v3.0.0 — JXBox (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';

export type JXSurfaceToken = 'default' | 'elevated' | 'glass' | 'subtle';
export type JXMaxWidthToken = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export interface JXBoxProps extends React.HTMLAttributes<HTMLElement> {
  component?: React.ElementType;
  surface?: JXSurfaceToken;
  radius?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
}

export const JXBox: React.FC<JXBoxProps> = ({
  component: Component = 'div',
  surface = 'default',
  radius = 'xl',
  padding = 'md',
  border = true,
  className = '',
  children,
  ...rest
}) => {
  const surfaceClasses: Record<JXSurfaceToken, string> = {
    default: 'bg-white dark:bg-slate-900',
    elevated:
      'bg-white dark:bg-slate-900 shadow-[0_10px_25px_-4px_rgba(15,23,42,0.06),0_4px_10px_-2px_rgba(15,23,42,0.03)]',
    glass: 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md',
    subtle: 'bg-slate-50/90 dark:bg-slate-800/50',
  };

  const radiusClasses = {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-2xl',
    '2xl': 'rounded-3xl',
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-2.5',
    md: 'p-3.5',
    lg: 'p-5',
  };

  const borderClass = border
    ? 'border border-slate-200/80 dark:border-slate-700/80'
    : '';

  return (
    <Component
      className={`transition-all ${surfaceClasses[surface]} ${radiusClasses[radius]} ${paddingClasses[padding]} ${borderClass} ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
};

export interface JXContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: JXMaxWidthToken;
  fluidPadding?: boolean;
  centered?: boolean;
  interactiveDemo?: boolean;
}

export const JXContainer: React.FC<JXContainerProps> = ({
  maxWidth = 'xl',
  fluidPadding = true,
  centered = true,
  interactiveDemo = false,
  className = '',
  children,
  ...rest
}) => {
  const [selectedSurface, setSelectedSurface] = useState<JXSurfaceToken>('elevated');

  const maxWidthClasses: Record<JXMaxWidthToken, string> = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  if (interactiveDemo) {
    return (
      <div className={`space-y-2.5 ${className}`} {...rest}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-500">Semantic Surface Token:</span>
          <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 text-[10px] font-semibold">
            {(['subtle', 'elevated', 'glass'] as JXSurfaceToken[]).map((token) => (
              <button
                key={token}
                type="button"
                onClick={() => setSelectedSurface(token)}
                className={`rounded-md px-2 py-0.5 capitalize transition-colors cursor-pointer ${
                  selectedSurface === token
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'text-slate-500'
                }`}
              >
                {token}
              </button>
            ))}
          </div>
        </div>
        <JXBox surface={selectedSurface} padding="md" radius="xl" className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>&lt;JXContainer maxWidth="xl" fluid /&gt;</span>
            <span className="text-indigo-600 dark:text-indigo-400">clamp(1rem, 4vw, 3rem)</span>
          </div>
          <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-3 text-xs text-slate-700 dark:text-slate-300">
            Semantic <code className="font-mono text-indigo-600 dark:text-indigo-400">JXBox</code> primitive with zero runtime Emotion overhead and direct token props (
            <code className="font-mono text-[11px]">surface="{selectedSurface}"</code>).
          </div>
        </JXBox>
      </div>
    );
  }

  return (
    <div
      className={`w-full ${maxWidthClasses[maxWidth]} ${centered ? 'mx-auto' : ''} ${
        fluidPadding ? 'px-4 sm:px-6 lg:px-8' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};
