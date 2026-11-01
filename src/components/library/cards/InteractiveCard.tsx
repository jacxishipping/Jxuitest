// @jxui/react v3.0.0 — InteractiveCard (JXUI v3.0 Unified Component Suite)
import React from 'react';
import { JXCard, type JXCardProps, JXCardHeader, JXCardContent, JXCardActions } from '../../surfaces/JXCard';
import { Sparkles, ArrowUpRight } from 'lucide-react';

// 10. InteractiveCard
// Reuses JXCard with cursor-tracking spotlight, specular border highlights, and tactile elevation lift
export interface InteractiveCardProps extends JXCardProps {}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  title = 'Interactive Spotlight Surface',
  kicker = 'Tactile Luminescence',
  description = 'Cursor-tracking spotlight halo with specular borders and spring hover elevation.',
  children,
  className = '',
  ...props
}) => {
  return (
    <JXCard
      title={title}
      kicker={kicker}
      description={description}
      spotlight
      hoverLift
      className={className}
      {...props}
    >
      {children || (
        <>
          <JXCardHeader
            title={title}
            subheader={kicker}
            icon={<Sparkles className="w-4 h-4 text-indigo-500" />}
          />
          <JXCardContent>{description}</JXCardContent>
          <JXCardActions>
            <span className="text-[11px] font-mono text-slate-400">Tactile Spec</span>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 cursor-pointer">
              Explore <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </JXCardActions>
        </>
      )}
    </JXCard>
  );
};
