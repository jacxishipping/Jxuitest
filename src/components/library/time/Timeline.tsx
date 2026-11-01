// @jxui/react v3.0.0 — Timeline (JXUI v3.0 Unified Component Suite)
import React from 'react';
import { JXTimeline, type JXTimelineProps, type JXTimelineEvent } from '../../layout-utils/JXTimeline';

// 3. Timeline
// Reuses JXTimeline with status indicators, expandable git diff payloads, and theme tokens
export interface TimelineProps extends JXTimelineProps {}

export const Timeline: React.FC<TimelineProps> = (props) => {
  return <JXTimeline {...props} />;
};

export type { JXTimelineEvent };
