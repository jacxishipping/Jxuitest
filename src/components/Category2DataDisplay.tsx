import React, { useState } from 'react';
import { Sparkles, Layers, Shield, Terminal } from 'lucide-react';
import { COMPONENT_CATALOG } from '../data/catalog';
import { ShowcaseCard } from './ShowcaseCard';
import { useJXTheme } from '../context/JXThemeContext';
import {
  JXAvatarGroup,
  JXAvatarShape,
  JXBadge,
  JXChip,
  JXDivider,
  JXIcon,
  JXImageList,
  JXList,
  JXTable,
  JXTooltip,
  JXTypography,
} from './data-display';

const AVATAR_USERS = [
  { name: 'Elena Rostova', role: 'Principal Architect', gradientClass: 'from-indigo-500 to-violet-500' },
  { name: 'Marcus Vance', role: 'Staff Engineer', gradientClass: 'from-emerald-500 to-teal-500' },
  { name: 'Sora Takahashi', role: 'Design Lead', gradientClass: 'from-rose-500 to-orange-500' },
  { name: 'Liam O’Connor', role: 'A11y Lead', gradientClass: 'from-sky-500 to-blue-600' },
  { name: 'Nadia Al-Mansoor', role: 'Security Lead', gradientClass: 'from-amber-500 to-orange-600' },
  { name: 'Devon Brooks', role: 'Runtime Eng', gradientClass: 'from-purple-500 to-pink-500' },
];

export const Category2DataDisplay: React.FC = () => {
  const { pushToast } = useJXTheme();
  const specs = COMPONENT_CATALOG.filter((c) => c.category === 'data-display');
  const getSpec = (num: number) => specs.find((s) => s.number === num)!;

  // #15 AvatarGroup state
  const [avatarShape, setAvatarShape] = useState<JXAvatarShape>('squircle');

  // #16 Badge state
  const [badgeCount, setBadgeCount] = useState(14);

  // #17 Chip state
  const [chips, setChips] = useState([
    { id: 'c1', label: 'Cluster: Healthy', tone: 'emerald' as const },
    { id: 'c2', label: 'TLS: 1.3 Strict', tone: 'indigo' as const },
    { id: 'c3', label: 'Cache: 98.4% Hit', tone: 'sky' as const },
  ]);

  // #18 Divider state
  const [dividerExpanded, setDividerExpanded] = useState(false);

  return (
    <div className="space-y-8">
      {/* #15 JXAvatar & #16 JXBadge & #17 JXChip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ShowcaseCard spec={getSpec(15)}>
          <JXAvatarGroup
            items={AVATAR_USERS}
            max={4}
            shape={avatarShape}
            onShapeChange={setAvatarShape}
            showShapeToggle
            interactiveFanOut
          />
        </ShowcaseCard>

        <ShowcaseCard spec={getSpec(16)}>
          <JXBadge
            count={badgeCount}
            showInteractiveControls
            onCountChange={setBadgeCount}
          />
        </ShowcaseCard>

        <ShowcaseCard spec={getSpec(17)}>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {chips.map((c) => (
                <JXChip
                  key={c.id}
                  label={c.label}
                  tone={c.tone}
                  onDelete={() =>
                    setChips((prev) => prev.filter((item) => item.id !== c.id))
                  }
                />
              ))}
            </div>
            {chips.length < 3 && (
              <button
                type="button"
                onClick={() =>
                  setChips([
                    { id: 'c1', label: 'Cluster: Healthy', tone: 'emerald' },
                    { id: 'c2', label: 'TLS: 1.3 Strict', tone: 'indigo' },
                    { id: 'c3', label: 'Cache: 98.4% Hit', tone: 'sky' },
                  ])
                }
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Restore Filter Chips
              </button>
            )}
          </div>
        </ShowcaseCard>
      </div>

      {/* #18 JXDivider & #19 JXIcon & #23 JXTooltip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ShowcaseCard spec={getSpec(18)}>
          <div className="space-y-3">
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Primary Deployment Log Stream (4 recent entries)
            </div>
            <JXDivider
              variant="radial-fade"
              expanded={dividerExpanded}
              actionLabel={
                dividerExpanded ? 'Hide Historical Logs' : 'Expand 8 Older Events'
              }
              onAction={() => setDividerExpanded((e) => !e)}
            />
            {dividerExpanded && (
              <div className="pt-2 text-[11px] font-mono text-slate-500 space-y-1">
                <div>14:02:11 · Rebalanced shard replica #04</div>
                <div>13:58:04 · TLS certificate renewed automatically</div>
              </div>
            )}
          </div>
        </ShowcaseCard>

        <ShowcaseCard spec={getSpec(19)}>
          <div className="flex items-center justify-around py-2">
            <JXIcon icon={<Sparkles className="w-5 h-5" />} label="Bounce" hoverAnimation="bounce" />
            <JXIcon icon={<Layers className="w-5 h-5" />} label="Scale" hoverAnimation="scale" />
            <JXIcon icon={<Shield className="w-5 h-5" />} label="Rotate" hoverAnimation="rotate" />
            <JXIcon icon={<Terminal className="w-5 h-5" />} label="Lift" hoverAnimation="lift" />
          </div>
        </ShowcaseCard>

        <ShowcaseCard spec={getSpec(23)}>
          <JXTooltip
            title="Node us-east-1a"
            shortcut="⌘I"
            metrics={[
              { label: 'CPU', value: '34.2%', highlight: true },
              { label: 'MEM', value: '12.4 GB' },
              { label: 'SLA', value: '99.99%' },
            ]}
          />
        </ShowcaseCard>
      </div>

      {/* #20 JXImageList & #21 JXList */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ShowcaseCard spec={getSpec(20)}>
          <JXImageList
            cols={3}
            lightbox
            items={[
              {
                title: 'Glass Surface Tokens',
                subtitle: 'Backdrop blur 16px',
                gradient: 'from-indigo-500/20 via-violet-500/20 to-sky-500/20',
              },
              {
                title: 'Spring Curve Physics',
                subtitle: 'cubic-bezier(0.22, 1, 0.36, 1)',
                gradient: 'from-emerald-500/20 via-teal-500/20 to-cyan-500/20',
              },
              {
                title: 'Tabular Grid Engine',
                subtitle: 'Zero-shift numerals',
                gradient: 'from-rose-500/20 via-amber-500/20 to-orange-500/20',
              },
            ]}
          />
        </ShowcaseCard>

        <ShowcaseCard spec={getSpec(21)}>
          <JXList
            folderTitle="packages/jxui-theme"
            onArchive={(id) =>
              pushToast({ title: `Archived ${id}`, variant: 'default' })
            }
          />
        </ShowcaseCard>
      </div>

      {/* #22 JXTable (with Floating Glassmorphic Bulk Action Bar) */}
      <ShowcaseCard spec={getSpec(22)}>
        <JXTable />
      </ShowcaseCard>

      {/* #24 JXTypography */}
      <ShowcaseCard spec={getSpec(24)}>
        <JXTypography />
      </ShowcaseCard>
    </div>
  );
};
