export type CategoryId =
  | 'inputs'
  | 'data-display'
  | 'feedback'
  | 'surfaces'
  | 'navigation'
  | 'layout-utils'
  | 'enterprise-x'
  | 'signature-blocks';


export interface ComponentSpec {
  number: number;
  id: string;
  name: string;
  subtitle: string;
  category: CategoryId;
  muiFlaw: string;
  jxuiUpgrade: string;
  jsxSnippet: string;
}

export interface CategoryInfo {
  id: CategoryId;
  number: number;
  title: string;
  shortTitle: string;
  count: number;
  description: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'inputs',
    number: 1,
    title: 'Category 1: Inputs & Tactile Controls',
    shortTitle: '1. Inputs (14)',
    count: 14,
    description: 'Zero-notch smart fields, 3-state morphing buttons, scrubbable steppers, and card-mode selection primitives.',
  },
  {
    id: 'data-display',
    number: 2,
    title: 'Category 2: Data Display & Presence',
    shortTitle: '2. Data Display (10)',
    count: 10,
    description: 'Interactive avatar stacks, rolling odometer badges, bulk-action data tables, and fluid semantic typography.',
  },
  {
    id: 'feedback',
    number: 3,
    title: 'Category 3: Feedback & Spatial Overlays',
    shortTitle: '3. Feedback (6)',
    count: 6,
    description: '3D spatial toast stacks with promise morphing, frosted glass dialogs, and composite shimmer skeletons.',
  },
  {
    id: 'surfaces',
    number: 4,
    title: 'Category 4: Layered & Glass Surfaces',
    shortTitle: '4. Surfaces (4)',
    count: 4,
    description: 'Spring disclosure accordions, floating island app bars, spotlight bento cards, and semantic elevation surfaces.',
  },
  {
    id: 'navigation',
    number: 5,
    title: 'Category 5: Navigation & Wayfinding',
    shortTitle: '5. Navigation (10)',
    count: 10,
    description: 'Floating pill docks, collapsible breadcrumbs, inset drawers, command context menus, and desktop navigation rails.',
  },
  {
    id: 'layout-utils',
    number: 6,
    title: 'Category 6: Layout, Utils & Lab',
    shortTitle: '6. Layout & Lab (6)',
    count: 6,
    description: 'Asymmetric Bento grids, FLIP masonry layouts, interactive audit timelines, and spring transition primitives.',
  },
  {
    id: 'enterprise-x',
    number: 7,
    title: 'Category 7: JXUI X — Enterprise Suite',
    shortTitle: '7. JXUI X (5)',
    count: 5,
    description: 'Hybrid Notion/Linear data grids, natural-language date range pickers, magnetic SVG charts, and slash editors.',
  },
  {
    id: 'signature-blocks',
    number: 8,
    title: 'Category 8: Signature Composed Blocks & Next-Gen Elements',
    shortTitle: '8. Signature Blocks (6)',
    count: 6,
    description: 'Multi-component compositions built from @jxui/react primitives: magnetic macOS docks, canary traffic splitters, audio waveform scrubbers, and passkey security vaults.',
  },
];

export const COMPONENT_CATALOG: ComponentSpec[] = [
  // CATEGORY 1: INPUTS (1-14)
  {
    number: 1,
    id: 'jx-autocomplete',
    name: 'JXAutocomplete',
    subtitle: 'Enhanced Autocomplete & Command Combobox',
    category: 'inputs',
    muiFlaw: 'Clunky dropdown list, plain text options, jarring notched outline.',
    jxuiUpgrade: 'Spotlight Command Palette UX (Cmd+K), fuzzy match highlighting, sticky frosted group headers, multi-select pills with Backspace delete.',
    jsxSnippet: `<JXAutocomplete
  label="Assign Reviewers & Channels"
  shortcut="⌘K"
  multiple
  fuzzyHighlight
  groupBy={(opt) => opt.department}
  options={teamMembers}
  renderOption={(opt) => <JXRichOption avatar={opt.avatar} meta={opt.role} />}
/>`,
  },
  {
    number: 2,
    id: 'jx-button',
    name: 'JXButton',
    subtitle: 'Morphing Tactile Button',
    category: 'inputs',
    muiFlaw: 'ALL-CAPS text, dated ink ripple, layout shift when showing a loading spinner.',
    jxuiUpgrade: 'Title Case typography, top specular highlight, press compression (scale 0.98), and 3-state inline morphing (idle -> loading -> success/error) with locked width.',
    jsxSnippet: `<JXButton
  variant="contained"
  color="primary"
  spring
  morphSuccess
  lockWidth
  onClick={async () => await deployRelease()}
>
  Deploy Production Build
</JXButton>`,
  },
  {
    number: 3,
    id: 'jx-button-group',
    name: 'JXButtonGroup',
    subtitle: 'Segmented Pill & Split Action Bar',
    category: 'inputs',
    muiFlaw: 'Harsh 1px divider lines that overlap awkwardly on focus.',
    jxuiUpgrade: 'Smooth floating sliding background pill indicator for active state, unified focus halo, and split-button dropdown support.',
    jsxSnippet: `<JXButtonGroup variant="segmented" activeId={view} onChange={setView}>
  <JXButton id="board">Kanban Board</JXButton>
  <JXButton id="timeline">Gantt Timeline</JXButton>
  <JXButton id="metrics">Velocity Metrics</JXButton>
</JXButtonGroup>`,
  },
  {
    number: 4,
    id: 'jx-checkbox',
    name: 'JXCheckbox',
    subtitle: 'Animated SVG Spring Checkbox & Card Mode',
    category: 'inputs',
    muiFlaw: 'Small hit target, rigid SVG tick, plain label alignment.',
    jxuiUpgrade: 'Custom SVG stroke-dashoffset draw animation with spring bounce, indeterminate morph, and variant="card" selection cards.',
    jsxSnippet: `<JXCheckbox
  variant="card"
  checked={enabled}
  onChange={setEnabled}
  title="Edge Caching & Smart Routing"
  description="Replicate static assets across 310 global PoPs"
  badge="Included"
/>`,
  },
  {
    number: 5,
    id: 'jx-fab',
    name: 'JXFab',
    subtitle: 'Floating Action Island',
    category: 'inputs',
    muiFlaw: 'Static circular button that covers mobile content.',
    jxuiUpgrade: 'Dynamic scroll-aware morphing (collapses from extended pill with label into compact icon circle on scroll down), glassmorphic backdrop, and notification badge.',
    jsxSnippet: `<JXFab
  extended={!isScrolledDown}
  glass
  badgeCount={3}
  icon={<PlusIcon />}
  label="Create Issue"
/>`,
  },
  {
    number: 6,
    id: 'jx-number-field',
    name: 'JXNumberField',
    subtitle: 'Tactile Stepper & Scrubbable Input',
    category: 'inputs',
    muiFlaw: 'Relies on tiny browser spin buttons or basic Base UI composition.',
    jxuiUpgrade: 'Integrated -/+ tactile buttons with hold acceleration, tabular numerals, unit prefix/suffix ($/%/kg), and horizontal drag-to-scrub on label.',
    jsxSnippet: `<JXNumberField
  label="Max Memory Allocation"
  value={memoryGb}
  onChange={setMemoryGb}
  min={1}
  max={128}
  unit="GB"
  scrubbableLabel
/>`,
  },
  {
    number: 7,
    id: 'jx-radio-group',
    name: 'JXRadioGroup',
    subtitle: 'Bento Selection Cards & Sliding Pills',
    category: 'inputs',
    muiFlaw: 'Dated circular radio dots stacked vertically.',
    jxuiUpgrade: 'Supports spring radio dots, Linear-style sliding segmented pills, and rich Bento Radio Cards with icons, pricing right-alignment, and active ring highlights.',
    jsxSnippet: `<JXRadioGroup variant="bento-cards" value={plan} onChange={setPlan}>
  <JXRadioCard value="pro" title="Pro Cluster" price="$49/mo" meta="16 vCPU · 64 GB RAM" />
  <JXRadioCard value="enterprise" title="Dedicated Metal" price="$199/mo" meta="64 vCPU · 256 GB RAM" />
</JXRadioGroup>`,
  },
  {
    number: 8,
    id: 'jx-rating',
    name: 'JXRating',
    subtitle: 'Expressive Micro-Animated Rating',
    category: 'inputs',
    muiFlaw: 'Static stars with abrupt hover fills.',
    jxuiUpgrade: 'Sequential wave-scale animation on hover, half-star precision, dynamic sentiment tooltip badge ("Needs Work" to "Exceptional"), and icon presets.',
    jsxSnippet: `<JXRating
  value={4.5}
  precision={0.5}
  showSentimentBadge
  preset="star"
  onChange={setRating}
/>`,
  },
  {
    number: 9,
    id: 'jx-select',
    name: 'JXSelect',
    subtitle: 'Rich Popover Select',
    category: 'inputs',
    muiFlaw: 'Native-looking menu overlay that covers the trigger and lacks search.',
    jxuiUpgrade: 'Anchored floating popover with spring entry, inline search filter, status dots/avatars inside options, and animated checkmark indicator.',
    jsxSnippet: `<JXSelect
  label="Deployment Region"
  searchable
  value={region}
  onChange={setRegion}
  options={regionsWithLatency}
/>`,
  },
  {
    number: 10,
    id: 'jx-slider',
    name: 'JXSlider',
    subtitle: 'Precision Interactive Scrubber',
    category: 'inputs',
    muiFlaw: 'Tiny thumb, basic tooltip, hard-to-read step marks.',
    jxuiUpgrade: 'Thick rounded track with gradient fill, magnetic tick marks, live floating glass value pill with formatted units, and range histogram preview.',
    jsxSnippet: `<JXSlider
  label="Target Latency Threshold"
  value={latencyMs}
  onChange={setLatencyMs}
  min={10}
  max={500}
  unit="ms"
  showHistogram
  magneticMarks={[50, 100, 250, 400]}
/>`,
  },
  {
    number: 11,
    id: 'jx-switch',
    name: 'JXSwitch',
    subtitle: 'Tactile Spring Toggle & Setting Row',
    category: 'inputs',
    muiFlaw: 'Ugly thumb overhang track design from older Material specs.',
    jxuiUpgrade: 'Enclosed pill track with fluid thumb stretch on press, embedded on/off micro-icons inside track, and card mode settings row.',
    jsxSnippet: `<JXSwitch
  cardMode
  trackIcons
  checked={zeroDowntime}
  onChange={setZeroDowntime}
  label="Zero-Downtime Blue/Green Swaps"
  helperText="Automatically verify health probes before shifting traffic"
/>`,
  },
  {
    number: 12,
    id: 'jx-text-field',
    name: 'JXTextField',
    subtitle: 'Contextual Smart Input',
    category: 'inputs',
    muiFlaw: 'Floating label cuts a physical notch through the top border; abrupt red error jump.',
    jxuiUpgrade: 'Clean stacked or inner floating label (zero border notch), 3px focus halo, clear button, password visibility + real-time entropy bar, character ring, and copy action.',
    jsxSnippet: `<JXTextField
  label="Production Signing Secret"
  type="password"
  showEntropyMeter
  clearable
  copyable
  maxLength={64}
/>`,
  },
  {
    number: 13,
    id: 'jx-toggle-button-group',
    name: 'JXToggleButtonGroup',
    subtitle: 'Animated Segmented Control',
    category: 'inputs',
    muiFlaw: 'Flat boxy buttons with harsh borders.',
    jxuiUpgrade: 'Inset recessed track (#F1F5F9) with an elevated white floating pill (elevation-1) that glides smoothly between active options.',
    jsxSnippet: `<JXToggleButtonGroup value={interval} exclusive onChange={setInterval}>
  <JXToggleButton value="24h">24 Hours</JXToggleButton>
  <JXToggleButton value="7d">7 Days</JXToggleButton>
  <JXToggleButton value="30d">30 Days</JXToggleButton>
</JXToggleButtonGroup>`,
  },
  {
    number: 14,
    id: 'jx-transfer-list',
    name: 'JXTransferList',
    subtitle: 'Dual-Pane Drag & Filter Shuttle',
    category: 'inputs',
    muiFlaw: 'Clunky dual-checkbox boxes requiring multiple clicks to move items.',
    jxuiUpgrade: 'Instant search filtering in both panes, one-click transfer on double-click, Move All action bar, and selected count badges.',
    jsxSnippet: `<JXTransferList
  leftTitle="Available Scopes"
  rightTitle="Granted Token Scopes"
  searchable
  doubleClickTransfer
  items={oauthScopes}
/>`,
  },

  // CATEGORY 2: DATA DISPLAY (15-24)
  {
    number: 15,
    id: 'jx-avatar-group',
    name: 'JXAvatar & JXAvatarGroup',
    subtitle: 'Presence & Interactive Stack',
    category: 'data-display',
    muiFlaw: 'Basic circle image and static +N overflow circle.',
    jxuiUpgrade: 'Squircle or circle shapes, deterministic pastel gradient fallbacks, live status rings, and hover fan-out with +N overflow popover list.',
    jsxSnippet: `<JXAvatarGroup max={4} shape="squircle" interactiveFanOut>
  <JXAvatar name="Elena Rostova" status="online" />
  <JXAvatar name="Marcus Vance" status="busy" />
  <JXAvatar name="Sora Takahashi" status="away" />
</JXAvatarGroup>`,
  },
  {
    number: 16,
    id: 'jx-badge',
    name: 'JXBadge',
    subtitle: 'Contextual Pulse & Odometer Count Pill',
    category: 'data-display',
    muiFlaw: 'Static circle that clips awkwardly on rounded corners.',
    jxuiUpgrade: 'Automatic optical corner offset, live radar pulse for notifications, smooth rolling odometer transition when numbers change, and status text.',
    jsxSnippet: `<JXBadge count={unreadCount} odometer pulse color="primary">
  <JXIconButton icon={<BellIcon />} />
</JXBadge>`,
  },
  {
    number: 17,
    id: 'jx-chip',
    name: 'JXChip',
    subtitle: 'Interactive Status & Filter Pill',
    category: 'data-display',
    muiFlaw: 'Dull gray rounded rectangle with a cramped delete icon.',
    jxuiUpgrade: 'Soft tinted surface with subtle border and status indicator (Active, Pending, Failed), interactive filter dropdown chevron, and collapse on delete.',
    jsxSnippet: `<JXChip
  label="Status: Healthy"
  status="active"
  filterDropdown
  onDelete={() => removeFilter('status')}
/>`,
  },
  {
    number: 18,
    id: 'jx-divider',
    name: 'JXDivider',
    subtitle: 'Gradient & Action Divider',
    category: 'data-display',
    muiFlaw: 'Plain 1px gray line.',
    jxuiUpgrade: 'Supports soft radial fade-out edges, embedded pill labels, or interactive "Expand / Show More" action buttons centered on the line.',
    jsxSnippet: `<JXDivider
  variant="radial-fade"
  actionLabel={expanded ? "Collapse Advanced Logs" : "Show 12 More Events"}
  onAction={() => setExpanded(!expanded)}
/>`,
  },
  {
    number: 19,
    id: 'jx-icon',
    name: 'JXIcon & JXSvgIcon',
    subtitle: 'Duotone & Micro-Animated Icon Wrapper',
    category: 'data-display',
    muiFlaw: 'Flat single-color SVG wrapper.',
    jxuiUpgrade: 'Built-in soft rounded icon container badges (variant="soft-box"), duotone opacity layers, and hover micro-animations (spin, bounce, wiggle).',
    jsxSnippet: `<JXIcon
  variant="soft-box"
  color="indigo"
  hoverAnimation="bounce"
  icon={<SparklesIcon />}
/>`,
  },
  {
    number: 20,
    id: 'jx-image-list',
    name: 'JXImageList',
    subtitle: 'Bento & Lightbox Media Grid',
    category: 'data-display',
    muiFlaw: 'Static grid with harsh dark overlay bars for titles.',
    jxuiUpgrade: 'Smooth blur-up placeholder, subtle zoom-on-hover (scale-105), frosted glass caption pills on hover, and built-in click-to-expand Lightbox modal.',
    jsxSnippet: `<JXImageList
  variant="bento"
  cols={3}
  lightbox
  items={architecturalGallery}
/>`,
  },
  {
    number: 21,
    id: 'jx-list',
    name: 'JXList',
    subtitle: 'Inset Interactive List & Collapsible Tree',
    category: 'data-display',
    muiFlaw: 'Tall, unstyled rows with full-width gray hover bars.',
    jxuiUpgrade: 'Inset rounded hover highlights (rounded-xl mx-2), keyboard arrow navigation, reveal-on-hover quick actions (Pin, Archive, Delete), and nested guide lines.',
    jsxSnippet: `<JXList insetHover quickActions={['pin', 'archive', 'delete']}>
  <JXListItem title="Core Design Tokens" subtitle="Updated 14m ago" nestedItems={tokenFiles} />
</JXList>`,
  },
  {
    number: 22,
    id: 'jx-table',
    name: 'JXTable',
    subtitle: 'Modern Interactive Data Surface with Bulk Action Bar',
    category: 'data-display',
    muiFlaw: 'Plain HTML-like table with harsh horizontal rules and clunky pagination.',
    jxuiUpgrade: 'Sticky frosted header, subtle row hover, column sort indicators, expandable detail rows, and a floating glassmorphic Bulk Action Bar when rows are selected.',
    jsxSnippet: `<JXTable
  stickyHeader
  selectable
  expandableRows
  floatingBulkBar
  columns={deploymentColumns}
  rows={deployments}
/>`,
  },
  {
    number: 23,
    id: 'jx-tooltip',
    name: 'JXTooltip & JXHtmlTooltip',
    subtitle: 'Rich Interactive Preview Card',
    category: 'data-display',
    muiFlaw: 'Tiny dark gray box with delayed, abrupt fade.',
    jxuiUpgrade: 'Directional spring entrance, hotkey badge (⌘K), warm handoff between adjacent tooltips, and a rich variant supporting profile previews and metrics.',
    jsxSnippet: `<JXTooltip
  variant="rich"
  shortcut="⌘I"
  title="Cluster Node us-east-1a"
  metrics={{ cpu: '38%', mem: '12.4 GB', uptime: '99.998%' }}
>
  <JXButton>Inspect Node Telemetry</JXButton>
</JXTooltip>`,
  },
  {
    number: 24,
    id: 'jx-typography',
    name: 'JXTypography',
    subtitle: 'Fluid Semantic Type System',
    category: 'data-display',
    muiFlaw: 'Hardcoded px/rem jumps and verbose variant names.',
    jxuiUpgrade: 'Fluid clamp() sizing, automatic text-wrap: balance for headings, gradient text support, inline copyable code snippets, and maxLines truncation.',
    jsxSnippet: `<JXTypography variant="display-sm" balance gradient="indigo-violet">
  Precision Ergonomics at Scale
</JXTypography>`,
  },

  // CATEGORY 3: FEEDBACK (25-30)
  {
    number: 25,
    id: 'jx-alert',
    name: 'JXAlert',
    subtitle: 'Actionable Callout Banner',
    category: 'feedback',
    muiFlaw: 'Flat colored box with basic icon.',
    jxuiUpgrade: 'Soft tinted surface with subtle border glow, custom duotone status icon badge, collapsible "View technical details" drawer, and inline actions.',
    jsxSnippet: `<JXAlert
  severity="warning"
  title="API Rate Limit Approaching (88%)"
  technicalDetails="X-RateLimit-Remaining: 120 / 1000 · Reset in 42s"
  primaryAction={{ label: 'Upgrade Quota', onClick: upgrade }}
/>`,
  },
  {
    number: 26,
    id: 'jx-backdrop',
    name: 'JXBackdrop',
    subtitle: 'Frosted Glass Scrim',
    category: 'feedback',
    muiFlaw: 'Flat rgba(0,0,0,0.5) dark overlay.',
    jxuiUpgrade: 'Progressive backdrop-filter: blur(8px) with subtle surface tint and smooth spring opacity transition.',
    jsxSnippet: `<JXBackdrop open={isSyncing} blur="md" glassTint="slate">
  <JXCircularProgress label="Synchronizing state..." />
</JXBackdrop>`,
  },
  {
    number: 27,
    id: 'jx-dialog',
    name: 'JXDialog',
    subtitle: 'Spring Modal & Command Sheet',
    category: 'feedback',
    muiFlaw: 'Boxy white rectangle with harsh drop shadow and cramped action footer.',
    jxuiUpgrade: '24px rounded corners, frosted glass header/footer, bottom-sheet morph on mobile, and destructive confirmation shake protection.',
    jsxSnippet: `<JXDialog
  open={open}
  onClose={handleClose}
  title="Rotate Production API Keys"
  destructiveGuard
  glassFooter
/>`,
  },
  {
    number: 28,
    id: 'jx-progress',
    name: 'JXProgress (Linear & Circular)',
    subtitle: 'Shimmer Track & Completion Morph',
    category: 'feedback',
    muiFlaw: 'Dated indeterminate bar animation and zero built-in labels.',
    jxuiUpgrade: 'Smooth gradient shimmer track, built-in percentage readout and ETA label, stepped progress segments, and morph into a completion badge at 100%.',
    jsxSnippet: `<JXLinearProgress
  value={progress}
  showValueLabel
  eta="12s remaining"
  morphOnComplete
/>`,
  },
  {
    number: 29,
    id: 'jx-skeleton',
    name: 'JXSkeleton',
    subtitle: 'Layout-Aware Shimmer Placeholder',
    category: 'feedback',
    muiFlaw: 'Basic gray blocks that require manual stacking.',
    jxuiUpgrade: 'Diagonal silky light shimmer wave plus ready-made composite presets (preset="card" | "table-row" | "profile" | "chart").',
    jsxSnippet: `<JXSkeleton preset="card" shimmer="wave" count={1} />`,
  },
  {
    number: 30,
    id: 'jx-snackbar',
    name: 'JXSnackbar',
    subtitle: 'Sonner-Style 3D Stacked Toast System',
    category: 'feedback',
    muiFlaw: 'Single flat black bar at the bottom corner; no stacking or promise states.',
    jxuiUpgrade: 'Multi-toast 3D spatial stack (expands into list on hover), built-in promise() state morphing (Loading -> Success), pause-on-hover, and inline Undo.',
    jsxSnippet: `const { pushToast, triggerPromiseToast } = useJXSnackbar();
triggerPromiseToast('Database Migration #402');`,
  },

  // CATEGORY 4: SURFACES (31-34)
  {
    number: 31,
    id: 'jx-accordion',
    name: 'JXAccordion',
    subtitle: 'Smooth Spring Disclosure',
    category: 'surfaces',
    muiFlaw: 'Sharp borders, jumping margins when expanded, clunky chevron rotation.',
    jxuiUpgrade: 'Separated rounded bento cards or unified soft container, physics height animation, custom + / × morph icon, and subtitle metadata in header.',
    jsxSnippet: `<JXAccordion variant="bento" iconMode="plus-cross" items={faqItems} />`,
  },
  {
    number: 32,
    id: 'jx-app-bar',
    name: 'JXAppBar',
    subtitle: 'Floating Glass Navigation Header',
    category: 'surfaces',
    muiFlaw: 'Solid colored block glued to the top of the screen.',
    jxuiUpgrade: 'Supports sticky frosted glass (backdrop-blur-md bg-white/75) or floating pill island mode (top-4 mx-auto rounded-2xl) with integrated ⌘K trigger.',
    jsxSnippet: `<JXAppBar mode="floating-island" glass commandShortcut="⌘K" />`,
  },
  {
    number: 33,
    id: 'jx-card',
    name: 'JXCard',
    subtitle: 'Bento Surface with Cursor Spotlight Glow',
    category: 'surfaces',
    muiFlaw: 'Basic white box with dated shadow.',
    jxuiUpgrade: 'Bento-ready surface with subtle specular border, cursor-tracking radial spotlight glow on hover, interactive lift, and clean header/footer dividers.',
    jsxSnippet: `<JXCard spotlight hoverLift elevation={2}>
  <JXCardHeader title="Edge Inference Engine" subheader="Sub-15ms global p99" />
  <JXCardContent>...</JXCardContent>
</JXCard>`,
  },
  {
    number: 34,
    id: 'jx-paper',
    name: 'JXPaper',
    subtitle: 'Semantic Layered Surface Primitive',
    category: 'surfaces',
    muiFlaw: 'Relies on 24 legacy Material shadow levels.',
    jxuiUpgrade: 'Semantic surface hierarchy (surface="base" | "raised" | "overlay" | "glass" | "sunken"), specular inner highlights, and dark-mode luminance parity.',
    jsxSnippet: `<JXPaper surface="glass" specularBorder padding="lg">
  Translucent Frosted Surface
</JXPaper>`,
  },

  // CATEGORY 5: NAVIGATION (35-44)
  {
    number: 35,
    id: 'jx-bottom-navigation',
    name: 'JXBottomNavigation',
    subtitle: 'Floating Mobile Pill Dock',
    category: 'navigation',
    muiFlaw: 'Full-width flat bottom bar with jumping label text.',
    jxuiUpgrade: 'Floating frosted pill dock with sliding active background indicator, spring icon bounce, and tactile visual feedback.',
    jsxSnippet: `<JXBottomNavigation floatingDock value={tab} onChange={setTab} items={dockItems} />`,
  },
  {
    number: 36,
    id: 'jx-breadcrumbs',
    name: 'JXBreadcrumbs',
    subtitle: 'Collapsible Path Bar & Sibling Switcher',
    category: 'navigation',
    muiFlaw: 'Static text links that wrap awkwardly on narrow screens.',
    jxuiUpgrade: 'Interactive middle-item ellipsis dropdown menu (click ... to view hidden parent folders), folder icons, and sibling switcher on current crumb.',
    jsxSnippet: `<JXBreadcrumbs
  maxItems={3}
  items={pathHierarchy}
  siblingOptions={['Production', 'Staging', 'Preview']}
/>`,
  },
  {
    number: 37,
    id: 'jx-drawer',
    name: 'JXDrawer',
    subtitle: 'Floating Inset Sheet & Mini-Rail Sidebar',
    category: 'navigation',
    muiFlaw: 'Sharp-edged panel that slams into the viewport edge.',
    jxuiUpgrade: 'Supports Floating Inset Sheet mode (12px margin from viewport edges with rounded-2xl corners) and Mini-Rail Collapsible Sidebar with tooltip fallback.',
    jsxSnippet: `<JXDrawer variant="floating-inset" collapsibleRail open={open} onClose={close} />`,
  },
  {
    number: 38,
    id: 'jx-link',
    name: 'JXLink',
    subtitle: 'Animated Underline & Hover Preview Link',
    category: 'navigation',
    muiFlaw: 'Basic anchor tag with browser underline.',
    jxuiUpgrade: 'Smooth left-to-right animated underline bar, automatic external-link arrow icon (↗), and optional hover preview card.',
    jsxSnippet: `<JXLink href="https://mui.com" external previewCard={{ title: 'Architecture Spec', readTime: '3m' }}>
  Read RFC-042 Specification
</JXLink>`,
  },
  {
    number: 39,
    id: 'jx-menu',
    name: 'JXMenu & JXMenuItem',
    subtitle: 'Nested Command & Context Menu',
    category: 'navigation',
    muiFlaw: 'Large padding, slow transitions, no keyboard shortcut styling.',
    jxuiUpgrade: 'Compact high-density rounded menu items, right-aligned <kbd> shortcut badges, destructive red item hover styling, and nested sub-menus.',
    jsxSnippet: `<JXMenu density="compact">
  <JXMenuItem icon={<CopyIcon />} shortcut="⌘C">Duplicate Component</JXMenuItem>
  <JXMenuItem destructive icon={<TrashIcon />} shortcut="⌘⌫">Delete Instance</JXMenuItem>
</JXMenu>`,
  },
  {
    number: 40,
    id: 'jx-pagination',
    name: 'JXPagination',
    subtitle: 'Smart Page Jumper & Summary Bar',
    category: 'navigation',
    muiFlaw: 'Just a row of numbered circles/squares.',
    jxuiUpgrade: 'Sliding active page indicator, integrated "Rows per page" selector, "Go to page #" quick input, and "Showing X–Y of Z" summary counter.',
    jsxSnippet: `<JXPagination
  count={12}
  page={page}
  rowsPerPage={25}
  totalItems={294}
  showQuickJumper
/>`,
  },
  {
    number: 41,
    id: 'jx-speed-dial',
    name: 'JXSpeedDial',
    subtitle: 'Staggered Quick Action Menu with Always-Visible Labels',
    category: 'navigation',
    muiFlaw: 'Unlabeled mini-circles that require hovering each one to see what it does.',
    jxuiUpgrade: 'Always-visible frosted glass labels next to each staggered action button, backdrop blur overlay when open, and smooth spring stagger.',
    jsxSnippet: `<JXSpeedDial alwaysShowLabels glassLabels actions={quickActions} />`,
  },
  {
    number: 42,
    id: 'jx-stepper',
    name: 'JXStepper',
    subtitle: 'Interactive Progress & Wizard Flow',
    category: 'navigation',
    muiFlaw: 'Rigid circles and thin lines that break on mobile.',
    jxuiUpgrade: 'Animated fill connector bars, clickable completed steps, error/warning badges, and a compact circular progress header mode for mobile screens.',
    jsxSnippet: `<JXStepper activeStep={step} clickableSteps mobileCompactRing steps={wizardSteps} />`,
  },
  {
    number: 43,
    id: 'jx-tabs',
    name: 'JXTabs & JXTab',
    subtitle: 'Sliding Pill & Underline Tabs',
    category: 'navigation',
    muiFlaw: 'Rigid bottom bar and ALL-CAPS tab labels.',
    jxuiUpgrade: 'Supports both a smooth sliding bottom indicator bar AND a soft pill background indicator, counter badges inside tabs, and natural Title Case.',
    jsxSnippet: `<JXTabs indicatorMode="pill" value={activeTab} onChange={setActiveTab}>
  <JXTab label="Overview" count={4} />
  <JXTab label="Deployments" count={18} />
  <JXTab label="Security Audit" />
</JXTabs>`,
  },
  {
    number: 44,
    id: 'jx-navigation-rail',
    name: 'JXNavigationRail',
    subtitle: 'Compact Vertical App Rail (Missing in MUI Core)',
    category: 'navigation',
    muiFlaw: 'Listed as "❌ No support" in standard Material UI.',
    jxuiUpgrade: 'First-class vertical icon rail for desktop/tablet apps with active pill indicator, avatar footer, and expandable secondary panel.',
    jsxSnippet: `<JXNavigationRail
  activeId={section}
  onChange={setSection}
  expandableSecondaryPanel
  items={railItems}
/>`,
  },

  // CATEGORY 6: LAYOUT, UTILS & LAB (45-50)
  {
    number: 45,
    id: 'jx-box-container',
    name: 'JXBox & JXContainer',
    subtitle: 'Token-Aware Layout Primitives',
    category: 'layout-utils',
    muiFlaw: 'Manual sx prop boilerplate for responsive fluid padding and surface tokens.',
    jxuiUpgrade: 'Fluid clamp() padding tokens, semantic surface tokens, and container-query responsive breakpoints out of the box.',
    jsxSnippet: `<JXContainer maxWidth="xl" fluidPadding surface="raised">
  <JXBox tokenGap="md">...</JXBox>
</JXContainer>`,
  },
  {
    number: 46,
    id: 'jx-grid',
    name: 'JXGrid',
    subtitle: 'Asymmetric Bento & CSS Grid v2 System',
    category: 'layout-utils',
    muiFlaw: 'Legacy negative-margin flexbox grid quirks and verbose responsive props.',
    jxuiUpgrade: 'True 12-column CSS Grid + pre-configured asymmetric Bento Grid spans (colSpan, rowSpan) with consistent gap tokens.',
    jsxSnippet: `<JXGrid columns={12} gap="md" bento>
  <JXGridItem colSpan={8} rowSpan={2}>Primary Bento Feature</JXGridItem>
  <JXGridItem colSpan={4}>Telemetry Tile</JXGridItem>
</JXGrid>`,
  },
  {
    number: 47,
    id: 'jx-stack',
    name: 'JXStack',
    subtitle: 'Flex Stack with Smart Hairline Dividers',
    category: 'layout-utils',
    muiFlaw: 'Manual divider cloning and rigid spacing.',
    jxuiUpgrade: '1-dimensional layout with interactive direction switching, alignment controls, and automatic radial-fade hairline divider insertion.',
    jsxSnippet: `<JXStack direction="row" spacing="md" smartDividers align="center">
  <MetricItem label="Throughput" value="14.2k req/s" />
  <MetricItem label="Error Rate" value="0.002%" />
</JXStack>`,
  },
  {
    number: 48,
    id: 'jx-masonry',
    name: 'JXMasonry',
    subtitle: 'Dynamic Reflow Masonry Layout',
    category: 'layout-utils',
    muiFlaw: 'Jarring layout jumps when items are filtered or resized.',
    jxuiUpgrade: 'Smooth animated reflow when cards are filtered by category or dynamically added/removed.',
    jsxSnippet: `<JXMasonry columns={3} gap={16} animatedReflow items={filteredCards} />`,
  },
  {
    number: 49,
    id: 'jx-timeline',
    name: 'JXTimeline',
    subtitle: 'Interactive Activity & Audit Feed',
    category: 'layout-utils',
    muiFlaw: 'Rigid center-split timeline from MUI Lab with zero interactive payloads.',
    jxuiUpgrade: 'Rich timeline nodes with avatars, status icons, timestamps, collapsible code diff/comment payloads, and active step connector lines.',
    jsxSnippet: `<JXTimeline interactiveDiffs items={auditLogEvents} />`,
  },
  {
    number: 50,
    id: 'jx-transitions-utils',
    name: 'JXTransitions, JXModal, JXPopper & JXTextareaAutosize',
    subtitle: 'Spring Physics Primitives & Auto-Growing Composer',
    category: 'layout-utils',
    muiFlaw: 'Linear cubic-bezier transitions and bare unstyled textarea primitive.',
    jxuiUpgrade: 'Unified utility primitives with spring presets (Fade, Scale, SlideUp, BlurIn) and auto-growing textarea with integrated formatting toolbar.',
    jsxSnippet: `<JXTransitions preset="blur-in" open={visible}>
  <JXTextareaAutosize minRows={3} toolbarSlot={<MarkdownToolbar />} />
</JXTransitions>`,
  },

  // CATEGORY 7: JXUI X — ADVANCED ENTERPRISE (51-55)
  {
    number: 51,
    id: 'jx-data-grid',
    name: 'JXDataGrid',
    subtitle: 'Next-Gen Enterprise Data Grid (Notion / Linear Hybrid)',
    category: 'enterprise-x',
    muiFlaw: 'Heavyweight spreadsheet look, complex configuration, jarring cell focus outlines.',
    jxuiUpgrade: 'Inline double-click cell editing, column pinning, multi-column filter pills, density toggle (Compact/Comfortable/Spacious), group-by aggregation, and instant CSV/JSON export.',
    jsxSnippet: `<JXDataGrid
  rows={enterpriseRows}
  columns={columns}
  inlineEditable
  density="comfortable"
  pinnableColumns
  groupBy="category"
  exportFormats={['csv', 'json']}
/>`,
  },
  {
    number: 52,
    id: 'jx-date-range-picker',
    name: 'JXDatePicker, JXTimePicker & JXDateRangePicker',
    subtitle: 'Natural Language Parser + Quick Presets Calendar',
    category: 'enterprise-x',
    muiFlaw: 'Requires multiple clicks across months; no natural language or preset sidebar.',
    jxuiUpgrade: 'Dual-month range calendar with hover range bridging, left-hand Quick Presets Sidebar ("Today", "Last 7 Days", "YTD"), and natural language header ("next friday", "in 3 days").',
    jsxSnippet: `<JXDateRangePicker
  naturalLanguageInput
  presets={['today', 'last7Days', 'thisQuarter', 'ytd']}
  value={dateRange}
  onChange={setDateRange}
/>`,
  },
  {
    number: 53,
    id: 'jx-charts',
    name: 'JXCharts (Line, Bar, Pie & Sparkline)',
    subtitle: 'Interactive SVG Telemetry with Magnetic Crosshair',
    category: 'enterprise-x',
    muiFlaw: 'Basic SVG paths with static tooltips and non-interactive legends.',
    jxuiUpgrade: 'SVG charts with smooth gradient area fills, magnetic crosshair scrubbing, floating glassmorphic multi-series tooltips, and interactive legend pills that toggle series visibility.',
    jsxSnippet: `<JXCharts
  type="area"
  series={[
    { id: 'jxui', label: 'JXUI Render (ms)', color: '#4f46e5' },
    { id: 'mui', label: 'Legacy MUI (ms)', color: '#94a3b8' }
  ]}
  magneticCrosshair
  interactiveLegend
/>`,
  },
  {
    number: 54,
    id: 'jx-tree-view',
    name: 'JXTreeView',
    subtitle: 'VS Code / Notion File & Hierarchy Explorer',
    category: 'enterprise-x',
    muiFlaw: 'Plain nested chevrons without indent guides, search, or inline rename.',
    jxuiUpgrade: 'Vertical indent guide lines, file-type icons, inline rename, drag reordering preview, and instant search filtering that auto-expands matching branches.',
    jsxSnippet: `<JXTreeView
  data={repoFileTree}
  indentGuides
  searchable
  inlineRename
  defaultExpanded={['src', 'components']}
/>`,
  },
  {
    number: 55,
    id: 'jx-rich-text-dropzone',
    name: 'JXRichTextEditor & JXUploadDropzone',
    subtitle: 'Slash-Command (/) Block Editor & Multi-File Dropzone',
    category: 'enterprise-x',
    muiFlaw: 'Listed on MUI X future roadmap or requires external 3rd-party integration.',
    jxuiUpgrade: 'Built-in slash-command (/) block editor toolbar + interactive drag-and-drop file uploader with live file-type icons, image thumbnails, and upload progress bars.',
    jsxSnippet: `<JXRichTextEditor slashCommands placeholder="Type '/' for commands..." />
<JXUploadDropzone accept={['.svg', '.png', '.json']} maxFiles={5} />`,
  },

  // CATEGORY 8: SIGNATURE COMPOSED BLOCKS & NEXT-GEN ELEMENTS (56-61)
  {
    number: 56,
    id: 'jx-spotlight-dock',
    name: 'JXSpotlightDock',
    subtitle: 'Proximity-Magnified Floating Glass App Dock',
    category: 'signature-blocks',
    muiFlaw: 'Standard toolbars have static 40px icons with zero spatial feedback or proximity physics.',
    jxuiUpgrade: 'Composes JXTooltip, JXBadge, and spring physics into a proximity-reactive macOS-style floating glass dock with live running-process dots and instant launcher actions.',
    jsxSnippet: `<JXSpotlightDock
  magnification={1.45}
  distance={140}
  glass
  items={[
    { id: 'terminal', label: 'Edge Console', shortcut: '⌘T', active: true },
    { id: 'metrics', label: 'Live Telemetry', badge: 3, active: true },
    { id: 'deploy', label: 'Canary Rollout', shortcut: '⌘D' }
  ]}
/>`,
  },
  {
    number: 57,
    id: 'jx-pricing-bento-matrix',
    name: 'JXPricingMatrix',
    subtitle: 'Tiered Glassmorphic Pricing Cards & Smooth Price-Toggling Matrix',
    category: 'signature-blocks',
    muiFlaw: 'Static pricing cards require custom wiring of sliders, toggles, badges, and checkout spinners.',
    jxuiUpgrade: 'Composes tiered glassmorphic hover cards, active-state scale-in spring animations for recommended plans, smooth price-toggling transitions, seat scrubber, and 3-state morphing checkout buttons.',
    jsxSnippet: `<JXPricingMatrix
  billingCycle="annual"
  annualDiscount={0.20}
  seats={25}
  selectedTierId="pro"
  glassHover
  onCheckout={(tier, total) => morphButtonToSuccess(tier, total)}
/>`,
  },
  {
    number: 58,
    id: 'jx-command-deploy-pipeline',
    name: 'JXTrafficSplitter',
    subtitle: 'Dynamic Color-Coded Canary Deployment Bar & Rollout Orchestrator',
    category: 'signature-blocks',
    muiFlaw: 'No composed DevOps pipeline primitive combining steppers, traffic sliders, and rollback guards.',
    jxuiUpgrade: 'Slider-driven canary deployment UI with a multi-segment split bar that dynamically color-codes segments (Slate, Sky, Indigo, Amber, Emerald) to represent live traffic percentages, p99 latency, and RPS.',
    jsxSnippet: `<JXTrafficSplitter
  stableVersion="v2.4.0"
  canaryVersion="v3.0.0"
  canaryWeight={30}
  autoRollbackOnError
  onPromote={() => promoteCanaryToProduction()}
/>`,
  },
  {
    number: 59,
    id: 'jx-audio-waveform-scrubber',
    name: 'JXAudioWaveformScrubber',
    subtitle: '48-Bar Frequency Waveform Player & Speed Pill',
    category: 'signature-blocks',
    muiFlaw: 'MUI Slider only renders a flat 4px line with no acoustic bar visualization or chapter markers.',
    jxuiUpgrade: 'Interactive 48-bar acoustic frequency scrubber with hover timestamp preview, playback speed pill cycler (1.0x–2.0x), and animated equalizer bars.',
    jsxSnippet: `<JXAudioWaveformScrubber
  title="RFC-042 Design Architecture Review.wav"
  durationSeconds={184}
  playbackRates={[1, 1.25, 1.5, 2]}
  chapters={[{ at: 42, label: 'Spring Physics' }, { at: 118, label: 'Zero-Notch Inputs' }]}
/>`,
  },
  {
    number: 60,
    id: 'jx-interactive-color-studio',
    name: 'JXInteractiveColorStudio',
    subtitle: 'Live HSL/OKLCH Tonal Scale & WCAG Contrast Generator',
    category: 'signature-blocks',
    muiFlaw: 'MUI createTheme palette generation is opaque and provides no real-time WCAG AA/AAA contrast audit.',
    jxuiUpgrade: 'Composes JXSlider, JXCard, and JXChip to generate a 9-stop tonal scale (50–900) in real time with live WCAG contrast ratio badges and one-click CSS variable export.',
    jsxSnippet: `<JXInteractiveColorStudio
  baseHue={242}
  saturation={84}
  auditTargets={['#F8FAFC', '#0B0F19']}
  exportFormat="css-variables"
/>`,
  },
  {
    number: 61,
    id: 'jx-security-vault-card',
    name: 'JXSecurityVaultCard',
    subtitle: 'Passkey Biometric Challenge & Hardware Key Manager',
    category: 'signature-blocks',
    muiFlaw: 'Standard security settings forms lack interactive WebAuthn challenge feedback and audit accordions.',
    jxuiUpgrade: 'Composes JXCard, JXAccordion (Bento mode), JXSwitch, and an interactive Passkey Touch simulator with animated cryptographic fingerprint verification.',
    jsxSnippet: `<JXSecurityVaultCard
  strictWebAuthn
  registeredKeys={['YubiKey 5C Nano', 'Touch ID Enclave']}
  onVerifyPasskey={() => triggerHardwareChallenge()}
/>`,
  },
];
