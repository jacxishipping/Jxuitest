// @jxui/react v3.0.0 — AnimatedTabs (JXUI v3.0 Unified Component Suite)
import React from 'react';
import { JXTabs, type JXTabsProps, type JXTabItem } from '../../navigation/JXTabs';

// 11. AnimatedTabs
// Reuses JXTabs zero-shift layout pill projection, count badges, and tab panels
export interface AnimatedTabsProps extends Omit<JXTabsProps, 'tabs'> {
  tabs?: (string | JXTabItem)[];
}

export const AnimatedTabs: React.FC<AnimatedTabsProps> = ({
  tabs = ['Design', 'Code', 'API', 'Audit'],
  indicatorVariant = 'pill',
  ...props
}) => {
  const convertedTabs: JXTabItem[] = tabs.map((t) => {
    if (typeof t === 'string') {
      return { id: t.toLowerCase().replace(/\s+/g, '-'), label: t };
    }
    return t;
  });

  return (
    <JXTabs
      tabs={convertedTabs}
      defaultValue={convertedTabs[0]?.id}
      indicatorVariant={indicatorVariant}
      {...props}
    />
  );
};

export type { JXTabItem };
