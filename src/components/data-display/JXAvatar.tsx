// @jxui/react v3.0.0 — JXAvatar (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';

export type JXAvatarStatus = 'online' | 'busy' | 'away' | 'offline';
export type JXAvatarShape = 'squircle' | 'circle';

export interface JXAvatarProps {
  name: string;
  src?: string;
  role?: string;
  status?: JXAvatarStatus;
  shape?: JXAvatarShape;
  size?: 'sm' | 'md' | 'lg';
  gradientClass?: string;
  className?: string;
}

const DETERMINISTIC_GRADIENTS = [
  'from-indigo-500 to-violet-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-orange-500',
  'from-sky-500 to-blue-600',
  'from-amber-500 to-orange-600',
  'from-purple-500 to-pink-500',
];

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function getGradientForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return DETERMINISTIC_GRADIENTS[Math.abs(hash) % DETERMINISTIC_GRADIENTS.length];
}

export const JXAvatar: React.FC<JXAvatarProps> = ({
  name,
  src,
  role,
  status,
  shape = 'squircle',
  size = 'md',
  gradientClass,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const bg = gradientClass || getGradientForName(name);

  const dims =
    size === 'sm'
      ? 'w-8 h-8 text-[11px]'
      : size === 'lg'
      ? 'w-12 h-12 text-sm'
      : 'w-10 h-10 text-xs';

  const radius = shape === 'squircle' ? 'rounded-xl' : 'rounded-full';

  const statusRingColor =
    status === 'online'
      ? 'ring-emerald-500/80'
      : status === 'busy'
      ? 'ring-rose-500/80'
      : status === 'away'
      ? 'ring-amber-500/80'
      : 'ring-white dark:ring-slate-900';

  return (
    <div
      title={role ? `${name} — ${role}` : name}
      className={`relative inline-flex items-center justify-center font-bold text-white shrink-0 select-none ring-2 ${statusRingColor} bg-gradient-to-br ${bg} ${dims} ${radius} overflow-hidden transition-transform duration-200 hover:-translate-y-1 ${className}`}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={name}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};

export interface JXAvatarGroupItem {
  name: string;
  role?: string;
  src?: string;
  status?: JXAvatarStatus;
  gradientClass?: string;
}

export interface JXAvatarGroupProps {
  items: JXAvatarGroupItem[];
  max?: number;
  shape?: JXAvatarShape;
  onShapeChange?: (shape: JXAvatarShape) => void;
  showShapeToggle?: boolean;
  interactiveFanOut?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const JXAvatarGroup: React.FC<JXAvatarGroupProps> = ({
  items,
  max = 4,
  shape = 'squircle',
  onShapeChange,
  showShapeToggle = true,
  interactiveFanOut = true,
  size = 'md',
  className = '',
}) => {
  const [overflowOpen, setOverflowOpen] = useState(false);
  const visible = items.slice(0, max);
  const overflow = items.slice(max);

  const radius = shape === 'squircle' ? 'rounded-xl' : 'rounded-full';
  const dims =
    size === 'sm'
      ? 'w-8 h-8 text-[11px]'
      : size === 'lg'
      ? 'w-12 h-12 text-sm'
      : 'w-10 h-10 text-xs';

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <div
          className={`flex items-center -space-x-2 ${
            interactiveFanOut ? 'hover:space-x-1' : ''
          } transition-all duration-300`}
        >
          {visible.map((u) => (
            <JXAvatar
              key={u.name}
              name={u.name}
              role={u.role}
              src={u.src}
              status={u.status}
              shape={shape}
              size={size}
              gradientClass={u.gradientClass}
              className="cursor-pointer"
            />
          ))}
          {overflow.length > 0 && (
            <button
              type="button"
              onClick={() => setOverflowOpen((o) => !o)}
              aria-label={`View ${overflow.length} more members`}
              aria-expanded={overflowOpen}
              className={`${dims} ${radius} bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-mono font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors`}
            >
              +{overflow.length}
            </button>
          )}
        </div>

        {showShapeToggle && onShapeChange && (
          <button
            type="button"
            onClick={() =>
              onShapeChange(shape === 'squircle' ? 'circle' : 'squircle')
            }
            className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
          >
            Shape: {shape}
          </button>
        )}
      </div>

      {overflowOpen && overflow.length > 0 && (
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
          {overflow.map((u) => (
            <div key={u.name} className="flex items-center justify-between py-1">
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {u.name}
              </span>
              {u.role && (
                <span className="text-slate-400 font-mono text-[11px]">{u.role}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
