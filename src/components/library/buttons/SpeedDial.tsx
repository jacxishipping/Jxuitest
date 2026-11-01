// @jxui/react v3.0.0 — SpeedDial (JXUI v3.0 Unified Component Suite)
import React from 'react';
import { JXSpeedDial, type JXSpeedDialProps, type JXSpeedDialAction } from '../../navigation/JXSpeedDial';

// 15. SpeedDial
// Reuses JXSpeedDial with staggered spring entrance, frosted labels, and shortcut badges
export interface SpeedDialAction extends Omit<Partial<JXSpeedDialAction>, 'icon'> {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  onClick?: () => void;
}

export interface SpeedDialProps extends Omit<JXSpeedDialProps, 'actions'> {
  actions?: SpeedDialAction[];
}

export const SpeedDial: React.FC<SpeedDialProps> = ({ actions, ...props }) => {
  const convertedActions: JXSpeedDialAction[] | undefined = actions?.map((act) => ({
    id: act.id,
    label: act.label,
    shortcut: act.shortcut,
    onClick: act.onClick,
    icon: React.isValidElement(act.icon)
      ? act.icon
      : typeof act.icon === 'function'
      ? React.createElement(act.icon as React.ComponentType<{ className?: string }>, { className: 'w-4 h-4' })
      : undefined,
  }));

  return <JXSpeedDial actions={convertedActions} {...props} />;
};

export type { JXSpeedDialAction };
