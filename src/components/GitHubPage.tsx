import React, { useState, useMemo } from 'react';
import { useJXTheme } from '../context/JXThemeContext';
import { UNIFIED_CATEGORIES_18, UNIFIED_STATS } from '../data/unifiedCatalog';
import { TiltCard } from './library/cards/TiltCard';
import { MagneticCard } from './library/cards/MagneticCard';
import { SignaturePad } from './library/inputs/SignaturePad';
import { DualRangeSlider } from './library/inputs/DualRangeSlider';
import { CircularSlider } from './library/inputs/CircularSlider';
import { TokenInput } from './library/inputs/TokenInput';
import { LiquidButton } from './library/buttons/LiquidButton';
import { RippleButton } from './library/buttons/RippleButton';
import { MagneticButton } from './library/buttons/MagneticButton';
import {
  Github,
  Star,
  GitFork,
  Eye,
  Heart,
  Code2,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowUpRight,
  Layers,
  Box,
  Sliders,
  CheckCircle2,
  ArrowRight,
  Download,
  Activity,
  Flame,
  Globe,
  Tag,
  BookOpen,
  GitPullRequest,
  AlertCircle,
  Play
} from 'lucide-react';

export interface GitHubPageProps {
  onBackToWorkbench?: () => void;
  onNavigateToCategory?: (catId: string) => void;
}

export const GitHubPage: React.FC<GitHubPageProps> = ({
  onBackToWorkbench,
  onNavigateToCategory,
}) => {
  const { palette, mode, getRadiusClass, pushToast } = useJXTheme();
  const [starsCount, setStarsCount] = useState(14248);
  const [isStarred, setIsStarred] = useState(false);
  const [forkCount, setForkCount] = useState(1839);
  const [isForked, setIsForked] = useState(false);
  const [packageManager, setPackageManager] = useState<'npm' | 'pnpm' | 'yarn' | 'bun'>('npm');
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [selectedDemoTab, setSelectedDemoTab] = useState<'tilt' | 'slider' | 'signature' | 'token'>('tilt');
  const [viewCode, setViewCode] = useState(false);
  const [activeRepoTab, setActiveRepoTab] = useState<'code' | 'issues' | 'pulls' | 'actions' | 'releases'>('code');

  const installCommands = {
    npm: 'npm install jxui-react motion lucide-react',
    pnpm: 'pnpm add jxui-react motion lucide-react',
    yarn: 'yarn add jxui-react motion lucide-react',
    bun: 'bun add jxui-react motion lucide-react',
  };

  const handleCopyInstall = () => {
    navigator.clipboard?.writeText(installCommands[packageManager]);
    setCopiedInstall(true);
    pushToast({
      title: 'Installation Command Copied',
      description: installCommands[packageManager],
      variant: 'success',
    });
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const handleToggleStar = () => {
    if (isStarred) {
      setStarsCount((c) => c - 1);
      setIsStarred(false);
      pushToast({
        title: 'Unstarred JXUI',
        description: 'Thank you for your feedback.',
        variant: 'default',
      });
    } else {
      setStarsCount((c) => c + 1);
      setIsStarred(true);
      pushToast({
        title: '⭐ Starred jxui-react!',
        description: 'Added to your GitHub starred repositories.',
        variant: 'success',
      });
    }
  };

  const handleFork = () => {
    if (!isForked) {
      setForkCount((c) => c + 1);
      setIsForked(true);
      pushToast({
        title: '🍴 Repository Forked',
        description: 'Fork created in your GitHub organization.',
        variant: 'success',
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans selection:bg-[#1f6feb]/40 selection:text-[#58a6ff]">
      {/* 1. Official GitHub Top Repository Bar */}
      <div className="border-b border-[#30363d] bg-[#161b22] px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Breadcrumbs & Public Badge */}
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <img
              src="./favicon.png"
              alt="JXUI Logo"
              className="w-5 h-5 rounded-md object-contain shrink-0 ring-1 ring-white/10"
            />
            <Github className="w-5 h-5 text-white shrink-0" />
            <a
              href="https://github.com/iam-shakir"
              target="_blank"
              rel="noreferrer"
              className="text-[#58a6ff] hover:underline font-normal"
            >
              iam-shakir
            </a>
            <span className="text-[#8b949e]">/</span>
            <a
              href="https://github.com/iam-shakir/JXUI-react"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:underline font-semibold flex items-center gap-2"
            >
              JXUI-react
              <span className="px-2 py-0.5 text-[11px] font-medium rounded-full border border-[#30363d] text-[#8b949e] bg-[#21262d]">
                Public
              </span>
            </a>
          </div>

          {/* GitHub Action Pill Controls */}
          <div className="flex items-center gap-2">
            {/* Sponsor */}
            <a
              href="#sponsors"
              className="px-3 py-1 text-xs font-semibold rounded-md border border-[#30363d] bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 text-[#f778ba] fill-[#f778ba]" />
              <span>Sponsor</span>
            </a>

            {/* Watch */}
            <button
              type="button"
              className="px-3 py-1 text-xs font-semibold rounded-md border border-[#30363d] bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#8b949e]" />
              <span>Watch</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#30363d] text-[10px] font-mono">342</span>
            </button>

            {/* Fork */}
            <button
              type="button"
              onClick={handleFork}
              className="px-3 py-1 text-xs font-semibold rounded-md border border-[#30363d] bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <GitFork className="w-3.5 h-3.5 text-[#8b949e]" />
              <span>Fork</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#30363d] text-[10px] font-mono">
                {forkCount.toLocaleString()}
              </span>
            </button>

            {/* Star */}
            <button
              type="button"
              onClick={handleToggleStar}
              className={`px-3 py-1 text-xs font-semibold rounded-md border transition-all flex items-center gap-1.5 cursor-pointer ${
                isStarred
                  ? 'border-[#e3b341] bg-[#e3b341]/20 text-[#e3b341]'
                  : 'border-[#30363d] bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d]'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-[#e3b341] text-[#e3b341]' : 'text-[#8b949e]'}`} />
              <span>{isStarred ? 'Starred' : 'Star'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#30363d] text-[10px] font-mono">
                {starsCount.toLocaleString()}
              </span>
            </button>
          </div>
        </div>

        {/* GitHub Navigation Tabs */}
        <div className="max-w-7xl mx-auto mt-4 flex items-center gap-1 overflow-x-auto text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveRepoTab('code')}
            className={`px-3 py-2 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeRepoTab === 'code'
                ? 'border-[#f78166] text-white font-semibold'
                : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Code</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveRepoTab('issues')}
            className={`px-3 py-2 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeRepoTab === 'issues'
                ? 'border-[#f78166] text-white font-semibold'
                : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>Issues</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#30363d] text-[10px] font-mono text-[#8b949e]">0</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveRepoTab('pulls')}
            className={`px-3 py-2 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeRepoTab === 'pulls'
                ? 'border-[#f78166] text-white font-semibold'
                : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            <GitPullRequest className="w-4 h-4" />
            <span>Pull requests</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#30363d] text-[10px] font-mono text-[#8b949e]">0</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveRepoTab('actions')}
            className={`px-3 py-2 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeRepoTab === 'actions'
                ? 'border-[#f78166] text-white font-semibold'
                : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            <Activity className="w-4 h-4 text-[#3fb950]" />
            <span>Actions</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#238636]/20 border border-[#238636]/40 text-[10px] font-mono text-[#3fb950]">passing</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveRepoTab('releases')}
            className={`px-3 py-2 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeRepoTab === 'releases'
                ? 'border-[#f78166] text-white font-semibold'
                : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Releases</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#1f6feb]/20 border border-[#1f6feb]/40 text-[10px] font-mono text-[#58a6ff]">v3.0.0</span>
          </button>

          {/* Jump to Interactive Workbench */}
          {onBackToWorkbench && (
            <button
              type="button"
              onClick={onBackToWorkbench}
              className="ml-auto px-3 py-1.5 rounded-lg bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Launch Interactive Workbench</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Hero Presentation Banner */}
      <div className="relative overflow-hidden border-b border-[#30363d] bg-gradient-to-b from-[#161b22] via-[#0d1117] to-[#0d1117] py-16 px-4 sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.18),rgba(255,255,255,0))]" />
        
        <div className="relative max-w-5xl mx-auto text-center flex flex-col items-center">
          {/* Release Badge Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#1f6feb]/10 text-[#58a6ff] border border-[#1f6feb]/30 mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>JXUI v3.0.0 — Unified 361-Component Architecture is Live</span>
          </div>

          {/* Official 3D Glassmorphic Logo Emblem */}
          <div className="mb-6 relative flex items-center justify-center">
            <div className="absolute -inset-4 bg-indigo-500/25 rounded-full blur-2xl pointer-events-none" />
            <img
              src="./logo.png"
              alt="JXUI Brand Logo"
              className="relative w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-[0_20px_35px_rgba(79,70,229,0.35)] hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
            The Next-Generation Component Library &amp; Design System
          </h1>

          <p className="mt-5 text-base sm:text-xl text-[#8b949e] max-w-2xl leading-relaxed">
            Reimagining enterprise React UI with tactile spring kinematics, specular glassmorphism, and guaranteed <strong>zero cumulative layout shift (CLS = 0)</strong>.
          </p>

          {/* Terminal Quick Install Bar */}
          <div className="mt-8 w-full max-w-xl">
            <div className="flex items-center justify-between px-3 py-2 bg-[#161b22] border border-[#30363d] rounded-t-xl text-xs font-mono text-[#8b949e]">
              <div className="flex items-center gap-1.5">
                {(['npm', 'pnpm', 'yarn', 'bun'] as const).map((pm) => (
                  <button
                    key={pm}
                    type="button"
                    onClick={() => setPackageManager(pm)}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      packageManager === pm
                        ? 'bg-[#21262d] text-white font-bold border border-[#30363d]'
                        : 'text-[#8b949e] hover:text-[#c9d1d9]'
                    }`}
                  >
                    {pm}
                  </button>
                ))}
              </div>
              <span className="text-[10px]">v3.0.0 • React 19+</span>
            </div>

            <div className="flex items-center justify-between px-4 py-3 bg-[#0d1117] border-x border-b border-[#30363d] rounded-b-xl font-mono text-sm">
              <div className="flex items-center gap-2 text-white overflow-x-auto select-all">
                <span className="text-[#8b949e]">$</span>
                <span className="text-[#58a6ff]">{installCommands[packageManager]}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyInstall}
                aria-label="Copy install command"
                className="ml-3 p-1.5 rounded-md hover:bg-[#21262d] text-[#8b949e] hover:text-white transition-colors cursor-pointer shrink-0"
              >
                {copiedInstall ? <Check className="w-4 h-4 text-[#3fb950]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {onBackToWorkbench && (
              <button
                type="button"
                onClick={onBackToWorkbench}
                className="px-6 py-3 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white font-semibold text-sm flex items-center gap-2 shadow-lg hover:shadow-emerald-900/30 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Open Full 361-Component Workbench</span>
              </button>
            )}
            <a
              href="#interactive-demo"
              className="px-6 py-3 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-white font-semibold text-sm border border-[#30363d] flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-[#58a6ff]" />
              <span>Interactive Live Showcase</span>
            </a>
          </div>

          {/* Repository Badges Bar */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5 text-[11px] font-mono">
            <span className="px-2.5 py-1 rounded-md bg-[#21262d] border border-[#30363d] text-[#c9d1d9] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#58a6ff]" />
              <span>version: <strong>3.0.0</strong></span>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#21262d] border border-[#30363d] text-[#c9d1d9] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#e3b341]" />
              <span>react: <strong>^19.0.0</strong></span>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#21262d] border border-[#30363d] text-[#c9d1d9] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3fb950]" />
              <span>tests: <strong>20/20 passing</strong></span>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#21262d] border border-[#30363d] text-[#c9d1d9] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#a371f7]" />
              <span>wcag: <strong>2.1 AA/AAA</strong></span>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#21262d] border border-[#30363d] text-[#c9d1d9] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#f778ba]" />
              <span>cls: <strong>0.00</strong></span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Live Interactive Showcase on GitHub Page */}
      <div id="interactive-demo" className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="border border-[#30363d] rounded-2xl bg-[#161b22] overflow-hidden shadow-2xl">
          {/* Header of Sandbox */}
          <div className="px-5 py-4 border-b border-[#30363d] bg-[#21262d] flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#58a6ff]" />
                <span>Live Interactive Component Sandbox</span>
              </h3>
              <p className="text-xs text-[#8b949e] mt-0.5">
                Interact with true 3D tilt physics, rotary angle knobs, vector canvas, and dual range sliders directly on the page.
              </p>
            </div>

            {/* Component Picker Tabs */}
            <div className="flex items-center gap-1 bg-[#161b22] p-1 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSelectedDemoTab('tilt')}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  selectedDemoTab === 'tilt' ? 'bg-[#30363d] text-white' : 'text-[#8b949e] hover:text-[#c9d1d9]'
                }`}
              >
                3D Tilt Card
              </button>
              <button
                type="button"
                onClick={() => setSelectedDemoTab('slider')}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  selectedDemoTab === 'slider' ? 'bg-[#30363d] text-white' : 'text-[#8b949e] hover:text-[#c9d1d9]'
                }`}
              >
                Rotary &amp; Dual Sliders
              </button>
              <button
                type="button"
                onClick={() => setSelectedDemoTab('signature')}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  selectedDemoTab === 'signature' ? 'bg-[#30363d] text-white' : 'text-[#8b949e] hover:text-[#c9d1d9]'
                }`}
              >
                Vector Signature Pad
              </button>
              <button
                type="button"
                onClick={() => setSelectedDemoTab('token')}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  selectedDemoTab === 'token' ? 'bg-[#30363d] text-white' : 'text-[#8b949e] hover:text-[#c9d1d9]'
                }`}
              >
                Token &amp; Liquid FX
              </button>
            </div>
          </div>

          {/* Sandbox Body */}
          <div className="p-8 sm:p-12 bg-[#0d1117] flex items-center justify-center min-h-[300px]">
            {selectedDemoTab === 'tilt' && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full max-w-3xl">
                <TiltCard />
                <MagneticCard />
              </div>
            )}

            {selectedDemoTab === 'slider' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-xl items-center">
                <div className="p-5 rounded-xl border border-[#30363d] bg-[#161b22]">
                  <span className="text-xs font-bold text-white block mb-3">Rotary Angle Knob</span>
                  <CircularSlider defaultValue={220} />
                </div>
                <div className="p-5 rounded-xl border border-[#30363d] bg-[#161b22]">
                  <span className="text-xs font-bold text-white block mb-3">Dual Range Physics</span>
                  <DualRangeSlider defaultMin={25} defaultMax={75} />
                </div>
              </div>
            )}

            {selectedDemoTab === 'signature' && (
              <div className="w-full max-w-md p-5 rounded-xl border border-[#30363d] bg-[#161b22]">
                <SignaturePad />
              </div>
            )}

            {selectedDemoTab === 'token' && (
              <div className="w-full max-w-lg flex flex-col gap-5">
                <TokenInput initialToken="jx_live_sec_8a39d04b6f12" />
                <div className="flex items-center gap-3 justify-center">
                  <LiquidButton>Liquid Viscosity</LiquidButton>
                  <RippleButton>Spring Ripple</RippleButton>
                  <MagneticButton>Magnetic Cursor</MagneticButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Architecture & 18 Categories Matrix */}
      <div className="border-t border-[#30363d] py-16 px-4 sm:px-8 bg-[#161b22]/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-mono font-bold text-[#58a6ff] uppercase tracking-wider">
                Modular Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                18 Unified Categories • 361 Total Components
              </h2>
              <p className="text-sm text-[#8b949e] mt-1">
                Combining 61 Telemetry Showcases (System A) with 300 Modular Primitives (System B).
              </p>
            </div>
            {onBackToWorkbench && (
              <button
                type="button"
                onClick={onBackToWorkbench}
                className="text-xs font-semibold text-[#58a6ff] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
              >
                <span>Browse all in Interactive Workbench</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {UNIFIED_CATEGORIES_18.map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  if (onNavigateToCategory) {
                    onNavigateToCategory(cat.id);
                  } else if (onBackToWorkbench) {
                    onBackToWorkbench();
                  }
                }}
                className="p-4 rounded-xl border border-[#30363d] bg-[#161b22] hover:bg-[#21262d] hover:border-[#58a6ff]/50 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[11px] font-bold text-[#8b949e] group-hover:text-[#58a6ff]">
                      Cat #{cat.number}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#30363d] text-white">
                      {cat.totalCount} Components
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#58a6ff] transition-colors">
                    {cat.title}
                  </h4>
                  <p className="text-xs text-[#8b949e] mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#30363d]/60 flex items-center justify-between text-[11px] text-[#8b949e]">
                  <span>Explore category</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. JXUI vs Material UI (MUI) Comparison */}
      <div className="border-t border-[#30363d] py-16 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-mono font-bold text-[#f78166] uppercase tracking-wider">
              Ergonomics Benchmark
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Why Engineers Switch from Traditional Material UI
            </h2>
          </div>

          <div className="border border-[#30363d] rounded-2xl overflow-hidden bg-[#161b22]">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#21262d] border-b border-[#30363d] text-[#8b949e] uppercase font-mono text-[11px]">
                <tr>
                  <th className="p-4 sm:px-6">Design Principle</th>
                  <th className="p-4 sm:px-6 text-[#f85149]">Material UI (MUI) Baseline</th>
                  <th className="p-4 sm:px-6 text-[#3fb950]">JXUI (jxui-react) Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d]">
                <tr>
                  <td className="p-4 sm:px-6 font-semibold text-white">Cumulative Layout Shift</td>
                  <td className="p-4 sm:px-6 text-[#f85149]">High: Text/spinner swaps cause button width popping</td>
                  <td className="p-4 sm:px-6 text-[#3fb950] font-semibold">CLS = 0: Locked bounding box with morphing states</td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-6 font-semibold text-white">Surface Physics</td>
                  <td className="p-4 sm:px-6 text-[#f85149]">Dated linear ripple animations from Android 5 era</td>
                  <td className="p-4 sm:px-6 text-[#3fb950] font-semibold">Natural spring kinematics, magnetic pull, and 3D tilt</td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-6 font-semibold text-white">Styling Engine</td>
                  <td className="p-4 sm:px-6 text-[#f85149]">Heavy Emotion CSS-in-JS runtime overhead</td>
                  <td className="p-4 sm:px-6 text-[#3fb950] font-semibold">Zero-runtime Tailwind CSS v4 + native CSS variables</td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-6 font-semibold text-white">Dark Mode &amp; Glass</td>
                  <td className="p-4 sm:px-6 text-[#f85149]">Flat gray background replacement with heavy contrast</td>
                  <td className="p-4 sm:px-6 text-[#3fb950] font-semibold">Specular glassmorphism, dynamic blur, ambient glow</td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-6 font-semibold text-white">Accessibility (WCAG)</td>
                  <td className="p-4 sm:px-6 text-[#f85149]">Keyboard trap risks in nested dialogs/speed dials</td>
                  <td className="p-4 sm:px-6 text-[#3fb950] font-semibold">Full WCAG 2.1 AA/AAA compliance with live telemetry</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 6. GitHub Pages Deployment Guide */}
      <div className="border-t border-[#30363d] py-16 px-4 sm:px-8 bg-[#161b22]/40">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-[#58a6ff]" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              GitHub Pages Deployment Guide
            </h2>
          </div>

          <p className="text-sm text-[#8b949e] mb-6 leading-relaxed">
            JXUI is pre-configured for automated continuous deployment to <strong>GitHub Pages</strong> via GitHub Actions. Every push to the default branch triggers a production build and deploys to <code className="text-[#58a6ff]">https://&lt;username&gt;.github.io/&lt;repo&gt;</code>.
          </p>

          <div className="bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden font-mono text-xs">
            <div className="px-4 py-2.5 bg-[#161b22] border-b border-[#30363d] text-[#8b949e] flex items-center justify-between">
              <span>.github/workflows/deploy.yml</span>
              <span className="text-[10px] text-[#3fb950]">Active Workflow</span>
            </div>
            <pre className="p-4 text-[#c9d1d9] overflow-x-auto leading-relaxed">
{`name: Deploy to GitHub Pages

on:
  push:
    branches: [ master, main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - id: deployment
        uses: actions/deploy-pages@v4`}
            </pre>
          </div>
        </div>
      </div>

      {/* 7. Footer */}
      <footer className="border-t border-[#30363d] py-12 px-4 sm:px-8 bg-[#0d1117] text-xs text-[#8b949e]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Github className="w-5 h-5 text-white" />
            <span>&copy; 2026 JXUI Design System. Released under the MIT License.</span>
          </div>

          <div className="flex items-center gap-6">
            {onBackToWorkbench && (
              <button
                type="button"
                onClick={onBackToWorkbench}
                className="text-[#58a6ff] hover:underline cursor-pointer"
              >
                Interactive Workbench
              </button>
            )}
            <a href="https://github.com/iam-shakir/JXUI-react" target="_blank" rel="noreferrer" className="hover:text-white">
              GitHub Repository
            </a>
            <a href="https://www.npmjs.com/package/jxui-react" target="_blank" rel="noreferrer" className="hover:text-white">
              npm package
            </a>
            <a href="#interactive-demo" className="hover:text-white">
              Component Demos
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
