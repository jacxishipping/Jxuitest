// @jxui/react v3.0.0 — StackedCard (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Layers, Sparkles } from 'lucide-react';

interface DeckItem {
  id: number;
  title: string;
  tag: string;
  color: string;
}

const DECK_ITEMS: DeckItem[] = [
  { id: 1, title: 'Tactile Luminescence', tag: 'Physics Engine', color: 'bg-indigo-600' },
  { id: 2, title: 'Spatial Glassmorphism', tag: 'Optics FX', color: 'bg-purple-600' },
  { id: 3, title: 'Bento Grid Kinetics', tag: 'Layout Matrix', color: 'bg-cyan-600' },
];

export const StackedCard: React.FC = () => {
  const { getRadiusClass } = useJXTheme();
  const [deck, setDeck] = useState(DECK_ITEMS);

  const cycleTopCard = () => {
    setDeck((prev) => {
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  };

  return (
    <div
      onClick={cycleTopCard}
      className="relative w-48 h-28 cursor-pointer select-none group my-1"
      title="Click to cycle card deck"
    >
      {deck.map((item, index) => {
        // index 0 is top, index 1 is middle, index 2 is back
        const offsetY = index * 8;
        const scale = 1 - index * 0.05;
        const opacity = 1 - index * 0.18;
        const zIndex = 30 - index * 10;

        return (
          <div
            key={item.id}
            style={{
              top: `${offsetY}px`,
              transform: `scale(${scale})`,
              opacity,
              zIndex,
            }}
            className={`absolute inset-x-0 h-20 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md ${getRadiusClass(
              'card'
            )} transition-all duration-300 group-hover:-translate-y-1 flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">Card #{item.id}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {item.tag}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {item.title}
              </span>
              <span className="text-[9px] text-indigo-500 font-semibold group-hover:underline">Next →</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
