// @jxui/react v3.0.0 — FloatingActionButton (JXUI v3.0 Unified Component Suite)
import React from 'react';
import { Plus } from 'lucide-react';
import { JXFab, type JXFabProps } from '../../inputs/JXFab';

// 14. FloatingActionButton (FAB)
// Reuses JXFab high-fidelity spring physics, telemetry tokens, and optional scroll-collapse
export interface FloatingActionButtonProps extends Omit<JXFabProps, 'icon'> {
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon: Icon = Plus,
  label,
  className = '',
  ...props
}) => {
  const renderedIcon = React.isValidElement(Icon)
    ? Icon
    : typeof Icon === 'function'
    ? React.createElement(Icon as React.ComponentType<{ className?: string }>, { className: 'w-5 h-5' })
    : <Plus className="w-5 h-5" />;

  return (
    <JXFab
      icon={renderedIcon}
      label={label}
      extended={Boolean(label)}
      className={className}
      {...props}
    />
  );
};
