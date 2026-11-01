import React, { useState } from 'react';
import { COMPONENT_CATALOG } from '../data/catalog';
import { ShowcaseCard } from './ShowcaseCard';
import { useJXTheme } from '../context/JXThemeContext';
import {
  JXBottomNavigation,
  JXBreadcrumbs,
  JXDrawer,
  JXLink,
  JXMenu,
  JXPagination,
  JXSpeedDial,
  JXStepper,
  JXTabs,
  JXNavigationRail,
} from './navigation';
import {
  JXContainer,
  JXGrid,
  JXStack,
  JXMasonry,
  JXTimeline,
  JXTextareaAutosize,
} from './layout-utils';

interface Category5And6Props {
  activeCategoryFilter: 'all' | 'navigation' | 'layout-utils';
}

export const Category5And6NavLayout: React.FC<Category5And6Props> = ({
  activeCategoryFilter,
}) => {
  const { pushToast } = useJXTheme();
  const getSpec = (num: number) => COMPONENT_CATALOG.find((s) => s.number === num)!;

  // #43 Tabs mode state
  const [tabMode, setTabMode] = useState<'pill' | 'underline'>('pill');

  const showNav = activeCategoryFilter === 'all' || activeCategoryFilter === 'navigation';
  const showLayout = activeCategoryFilter === 'all' || activeCategoryFilter === 'layout-utils';

  return (
    <div className="space-y-8">
      {showNav && (
        <>
          {/* #35 JXBottomNavigation, #36 JXBreadcrumbs, #38 JXLink */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ShowcaseCard spec={getSpec(35)}>
              <JXBottomNavigation />
            </ShowcaseCard>

            <ShowcaseCard spec={getSpec(36)}>
              <JXBreadcrumbs />
            </ShowcaseCard>

            <ShowcaseCard spec={getSpec(38)}>
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-4">
                  <JXLink href="https://mui.com" external previewTitle="Material UI Core Docs">
                    MUI Spec Reference
                  </JXLink>
                  <JXLink href="#jx-data-grid" previewTitle="Jump to Category 7 Enterprise Grid">
                    Enterprise DataGrid
                  </JXLink>
                </div>
                <p className="text-xs text-slate-500">
                  Hover either link to trigger the left-to-right animated underline bar and floating preview card.
                </p>
              </div>
            </ShowcaseCard>
          </div>

          {/* #37 JXDrawer, #39 JXMenu, #44 JXNavigationRail */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ShowcaseCard spec={getSpec(37)}>
              <JXDrawer />
            </ShowcaseCard>

            <ShowcaseCard spec={getSpec(39)}>
              <JXMenu />
            </ShowcaseCard>

            <ShowcaseCard spec={getSpec(44)}>
              <JXNavigationRail />
            </ShowcaseCard>
          </div>

          {/* #40 JXPagination, #41 JXSpeedDial, #42 JXStepper, #43 JXTabs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ShowcaseCard spec={getSpec(40)}>
              <JXPagination showFirstLastButtons />
            </ShowcaseCard>

            <ShowcaseCard spec={getSpec(41)}>
              <JXSpeedDial
                onActionSelect={(action) =>
                  pushToast({ title: `Triggered ${action.label}`, variant: 'default' })
                }
              />
            </ShowcaseCard>

            <ShowcaseCard spec={getSpec(42)}>
              <JXStepper />
            </ShowcaseCard>

            <ShowcaseCard
              spec={getSpec(43)}
              headerControls={
                <button
                  type="button"
                  onClick={() =>
                    setTabMode((m) => (m === 'pill' ? 'underline' : 'pill'))
                  }
                  className="px-2 py-0.5 text-[11px] font-mono rounded border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  Mode: {tabMode}
                </button>
              }
            >
              <JXTabs indicatorVariant={tabMode} />
            </ShowcaseCard>
          </div>
        </>
      )}

      {showLayout && (
        <>
          {/* #45 JXBox/Container, #46 JXGrid (Bento), #47 JXStack */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ShowcaseCard spec={getSpec(45)}>
              <JXContainer interactiveDemo />
            </ShowcaseCard>

            <ShowcaseCard spec={getSpec(46)}>
              <JXGrid bentoPreset />
            </ShowcaseCard>

            <ShowcaseCard spec={getSpec(47)}>
              <JXStack
                interactiveControls
                items={['Token A', 'Token B', 'Token C']}
              />
            </ShowcaseCard>
          </div>

          {/* #48 JXMasonry, #49 JXTimeline, #50 JXTransitions & JXTextareaAutosize */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ShowcaseCard spec={getSpec(48)}>
              <JXMasonry />
            </ShowcaseCard>

            <ShowcaseCard spec={getSpec(49)}>
              <JXTimeline />
            </ShowcaseCard>

            <ShowcaseCard spec={getSpec(50)}>
              <JXTextareaAutosize aria-label="Release notes composer" />
            </ShowcaseCard>
          </div>
        </>
      )}
    </div>
  );
};
