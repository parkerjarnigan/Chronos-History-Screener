import React from 'react';
import { UnitId } from '../types/history';
import { Check, Sparkles, Compass } from 'lucide-react';

interface ChronoTimelineBarProps {
  currentUnit: UnitId;
  questionNumber: number;
}

interface EraSegment {
  id: UnitId;
  index: number;
  label: string;
  epochNumber: string;
  years: string;
  iconSymbol: string;
}

const ERA_SEGMENTS: EraSegment[] = [
  {
    id: 'unit1',
    index: 0,
    label: 'Revolutions & Enlightenment',
    epochNumber: 'Epoch I',
    years: '1600 – 1815',
    iconSymbol: '📜',
  },
  {
    id: 'unit2',
    index: 1,
    label: 'Industrial Revolution',
    epochNumber: 'Epoch II',
    years: '1750 – 1900',
    iconSymbol: '⚙️',
  },
  {
    id: 'unit3',
    index: 2,
    label: 'WWI & Global Imperialism',
    epochNumber: 'Epoch III',
    years: '1880 – 1919',
    iconSymbol: '🪖',
  },
  {
    id: 'unit4',
    index: 3,
    label: 'Interwar Years & WWII',
    epochNumber: 'Epoch IV',
    years: '1919 – 1945',
    iconSymbol: '🛡️',
  },
];

const UNIT_INDEX: Record<UnitId, number> = {
  unit1: 0,
  unit2: 1,
  unit3: 2,
  unit4: 3,
};

export const ChronoTimelineBar: React.FC<ChronoTimelineBarProps> = ({ currentUnit }) => {
  const activeIndex = UNIT_INDEX[currentUnit] ?? 0;
  const activeEra = ERA_SEGMENTS[activeIndex];

  // Percentage positioning for the character sprite across the 4 segments:
  // Segment 0: 12.5%, Segment 1: 37.5%, Segment 2: 62.5%, Segment 3: 87.5%
  const spritePositions = ['12.5%', '37.5%', '62.5%', '87.5%'];
  const spriteLeft = spritePositions[activeIndex] || '12.5%';

  return (
    <div className="w-full bg-stone-900 border-2 border-stone-800 rounded-3xl p-5 sm:p-6 shadow-md text-stone-100 relative overflow-hidden select-none">
      {/* Background ambient grid texture */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #f59e0b 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Header bar above timeline */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '14s' }} />
          <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-amber-400 uppercase">
            CHRONO-WARP TIMELINE
          </span>
          <span className="text-stone-500 font-mono text-xs hidden sm:inline">|</span>
          <span className="text-xs sm:text-sm text-stone-300 font-medium hidden sm:inline">
            Navigating 4 Historical Epochs
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/60 text-amber-300 font-mono text-xs font-bold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Active: {activeEra.epochNumber} ({activeEra.years})</span>
        </div>
      </div>

      {/* Sprite Track Stage (Height reserved for animated traveler sprite) */}
      <div className="relative h-16 sm:h-20 w-full z-10 mb-2">
        <div 
          className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-700 ease-out"
          style={{ left: spriteLeft }}
        >
          {/* Sprite Speech / Time Badge */}
          <div className="px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-black text-[11px] sm:text-xs font-mono shadow-md tracking-tight whitespace-nowrap mb-1 flex items-center gap-1 animate-pulse">
            <span>⏱️ JUMPING ERA</span>
          </div>

          {/* Time Traveler Character Sprite (SVG) */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-[0_4px_10px_rgba(245,158,11,0.5)] transition-transform hover:scale-110">
            <svg viewBox="0 0 64 64" className="w-full h-full" role="img" aria-label="Time Traveler Sprite">
              {/* Pulsing time portal aura behind sprite */}
              <circle cx="32" cy="32" r="28" fill="#f59e0b" fillOpacity="0.25">
                <animate attributeName="r" values="24;28;24" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
              </circle>

              {/* Aviator / Steampunk Helmet */}
              <path d="M 18 24 Q 32 10 46 24 L 46 32 L 18 32 Z" fill="#78350f" stroke="#451a03" strokeWidth="2" />
              <path d="M 16 28 L 48 28" stroke="#f59e0b" strokeWidth="2" />

              {/* Brass Goggles with glowing lenses */}
              <ellipse cx="26" cy="25" rx="6" ry="5" fill="#0284c7" stroke="#ca8a04" strokeWidth="2.5" />
              <ellipse cx="38" cy="25" rx="6" ry="5" fill="#0284c7" stroke="#ca8a04" strokeWidth="2.5" />
              <circle cx="28" cy="23" r="1.5" fill="#e0f2fe" />
              <circle cx="40" cy="23" r="1.5" fill="#e0f2fe" />
              <rect x="31" y="23" width="2" height="3" fill="#ca8a04" />

              {/* Cheerful Explorer Face */}
              <circle cx="32" cy="33" r="11" fill="#fed7aa" />
              {/* Rosy cheeks */}
              <circle cx="25" cy="36" r="2" fill="#fca5a5" />
              <circle cx="39" cy="36" r="2" fill="#fca5a5" />
              {/* Friendly smile */}
              <path d="M 29 37 Q 32 40 35 37" stroke="#78350f" strokeWidth="1.5" fill="none" strokeLinecap="round" />

              {/* Time Traveler Scarf / Coat */}
              <path d="M 20 42 Q 32 46 44 42 L 48 54 L 16 54 Z" fill="#b45309" stroke="#451a03" strokeWidth="2" />
              <path d="M 22 42 L 26 50 L 30 42" fill="#dc2626" />
              <path d="M 38 42 L 42 50 L 46 42" fill="#dc2626" />

              {/* Handheld Chrono-Device (Pocket Watch / Time Compass) */}
              <circle cx="46" cy="46" r="5" fill="#facc15" stroke="#78350f" strokeWidth="1.5" />
              <line x1="46" y1="46" x2="48" y2="44" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* 4 Segmented Historical Epoch Bars */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 relative z-10">
        {ERA_SEGMENTS.map((segment) => {
          const isCompleted = segment.index < activeIndex;
          const isCurrent = segment.index === activeIndex;
          const isUpcoming = segment.index > activeIndex;

          return (
            <div
              key={segment.id}
              className={`rounded-2xl p-2.5 sm:p-3.5 border-2 transition-all duration-300 flex flex-col justify-between ${
                isCurrent
                  ? 'bg-gradient-to-b from-amber-950/80 to-stone-900 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.35)] ring-2 ring-amber-400/40'
                  : isCompleted
                  ? 'bg-stone-900/90 border-emerald-500/70 opacity-90'
                  : 'bg-stone-950/60 border-stone-800 opacity-50'
              }`}
            >
              {/* Segment Header */}
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className={`text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider ${
                  isCurrent ? 'text-amber-300' : isCompleted ? 'text-emerald-400' : 'text-stone-500'
                }`}>
                  {segment.epochNumber}
                </span>

                {isCompleted ? (
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                ) : isCurrent ? (
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-stone-950 font-black text-[10px] flex items-center justify-center shrink-0 animate-bounce">
                    ●
                  </span>
                ) : (
                  <span className="text-stone-600 text-xs">
                    🔒
                  </span>
                )}
              </div>

              {/* Segment Title & Years */}
              <div className="my-1">
                <span className="text-base sm:text-lg block mb-0.5">{segment.iconSymbol}</span>
                <span className={`block font-bold leading-tight text-xs sm:text-sm line-clamp-1 sm:line-clamp-none ${
                  isCurrent ? 'text-white' : isCompleted ? 'text-stone-200' : 'text-stone-400'
                }`}>
                  {segment.label}
                </span>
                <span className="text-[10px] sm:text-xs text-stone-400 font-mono block mt-0.5">
                  {segment.years}
                </span>
              </div>

              {/* Bottom Progress Fill Line */}
              <div className="w-full h-1.5 rounded-full bg-stone-800 overflow-hidden mt-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isCompleted
                      ? 'w-full bg-emerald-500'
                      : isCurrent
                      ? 'w-full bg-gradient-to-r from-amber-500 to-amber-300 animate-pulse'
                      : 'w-0'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
