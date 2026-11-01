// @jxui/react v3.0.0 — JXSnackbar (JXUI v3.0 Unified Component Suite)
import React from 'react';
import { useJXTheme, ToastItem } from '../../context/JXThemeContext';

/**
 * Standalone Toast Queue State Manager for JXSnackbar (`@jxui/react`)
 * Supports deterministic LIFO spatial stacking, promise() morphing, and subscriber notifications.
 */
export type ToastListener = (queue: ToastItem[]) => void;

export class JXToastQueueManager {
  private queue: ToastItem[] = [];
  private listeners: Set<ToastListener> = new Set();
  private maxVisible: number;

  constructor(maxVisible = 5) {
    this.maxVisible = maxVisible;
  }

  public getQueue(): ToastItem[] {
    return [...this.queue];
  }

  public subscribe(listener: ToastListener): () => void {
    this.listeners.add(listener);
    listener(this.getQueue());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const snapshot = this.getQueue();
    this.listeners.forEach((l) => l(snapshot));
  }

  public push(toast: Omit<ToastItem, 'id' | 'createdAt'>): string {
    const id = `jx-toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const nextItem: ToastItem = {
      ...toast,
      id,
      createdAt: Date.now(),
    };
    this.queue = [nextItem, ...this.queue].slice(0, this.maxVisible);
    this.notify();
    return id;
  }

  public update(id: string, patch: Partial<Omit<ToastItem, 'id'>>): void {
    this.queue = this.queue.map((item) =>
      item.id === id ? { ...item, ...patch } : item
    );
    this.notify();
  }

  public dismiss(id: string): void {
    this.queue = this.queue.filter((item) => item.id !== id);
    this.notify();
  }

  public clear(): void {
    this.queue = [];
    this.notify();
  }

  public async promise<T>(
    task: Promise<T>,
    messages: {
      loadingTitle: string;
      loadingDescription?: string;
      successTitle: string;
      successDescription?: string;
      errorTitle?: string;
    }
  ): Promise<T> {
    const id = this.push({
      title: messages.loadingTitle,
      description: messages.loadingDescription || 'Processing async operation...',
      variant: 'loading',
    });

    try {
      const res = await task;
      this.update(id, {
        title: messages.successTitle,
        description: messages.successDescription || 'Completed with zero layout shift',
        variant: 'success',
      });
      return res;
    } catch (err) {
      this.update(id, {
        title: messages.errorTitle || 'Operation Failed',
        description: err instanceof Error ? err.message : 'Unexpected error',
        variant: 'error',
      });
      throw err;
    }
  }
}

export interface JXSnackbarProps {
  promiseActionLabel?: string;
  className?: string;
}

export const JXSnackbar: React.FC<JXSnackbarProps> = ({
  promiseActionLabel = 'Database Schema Migration',
  className = '',
}) => {
  const { palette, getRadiusClass, pushToast, triggerPromiseToast, clearToasts } =
    useJXTheme();

  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 ${className}`}>
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => triggerPromiseToast(promiseActionLabel)}
          className={`px-4 py-2 text-xs font-semibold text-white ${palette.bg} ${getRadiusClass('control')} jx-elevation-1`}
        >
          Trigger Promise Toast (Loading → Success)
        </button>
        <button
          type="button"
          onClick={() =>
            pushToast({
              title: 'Webhook Endpoint Deleted',
              description: 'prod-events.jxui.dev removed from routing table',
              variant: 'warning',
              undoAction: () =>
                pushToast({
                  title: 'Restored Webhook Endpoint',
                  variant: 'success',
                }),
            })
          }
          className={`px-3.5 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 ${getRadiusClass('control')}`}
        >
          Push Toast with Inline Undo
        </button>
        <button
          type="button"
          onClick={clearToasts}
          className="px-3 py-2 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          Clear Stack
        </button>
      </div>
      <span className="text-xs text-slate-500">
        Hover the bottom-right toast stack to fan out in 3D space.
      </span>
    </div>
  );
};
