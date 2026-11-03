import React from 'react';
import { Volume2, VolumeX, GraduationCap, Type } from 'lucide-react';
import { UnitId, DifficultyTier } from '../types/history';

interface ArcadeHeaderProps {
  currentQuestionIndex: number;
  totalQuestionsTarget: number;
  currentUnit: UnitId;
  currentTier: DifficultyTier;
  streak: number;
  lifelinesRemaining: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenTeacherPortal: () => void;
  onResetGame: () => void;
  fontSize: 'normal' | 'large';
  onToggleFontSize: () => void;
  isTeacherView: boolean;
}

const UNIT_LABELS: Record<UnitId, { name: string; era: string }> = {
  unit1: { name: 'Unit 1: Revolutions', era: '1600–1815' },
  unit2: { name: 'Unit 2: Industry', era: '1750–1900' },
  unit3: { name: 'Unit 3: WWI & Empires', era: '1880–1919' },
  unit4: { name: 'Unit 4: WWII & Era', era: '1919–1945' },
};

export const ArcadeHeader: React.FC<ArcadeHeaderProps> = ({
  currentQuestionIndex,
  totalQuestionsTarget,
  currentUnit,
  currentTier,
  streak,
  isMuted,
  onToggleMute,
  onOpenTeacherPortal,
  onResetGame,
  fontSize,
  onToggleFontSize,
  isTeacherView,
}) => {
  const unitInfo = UNIT_LABELS[currentUnit];
  const progressPercent = Math.min(100, Math.round((currentQuestionIndex / totalQuestionsTarget) * 100));

  return (
    <header className="sticky top-0 z-30 bg-stone-900 border-b-2 border-stone-800 text-stone-100 shadow-lg">
      {/* Strict Top Bar Contract: 3 zones separated by gap-8 (100% larger text scale) */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (single element) */}
        <div className="flex items-center gap-3.5 shrink-0">
          <button 
            onClick={onResetGame} 
            className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-xl p-1"
            title="Chronos Arcade Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              Ω
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-stone-50 text-xl sm:text-2xl block leading-none">
                CHRONOS ARCADE
              </span>
              <span className="text-xs text-amber-400/90 font-mono tracking-wider uppercase block mt-1">
                World History Adaptive Screener
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation & Status Links */}
        <div className="flex items-center gap-3 sm:gap-6 text-sm sm:text-base text-stone-300">
          {/* Progress Indicator */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-xl bg-stone-800/80 border border-stone-700/80 shadow-inner">
            <span className="text-stone-400 font-mono text-xs sm:text-sm">Question</span>
            <span className="font-black text-amber-400 font-mono text-base sm:text-lg">
              {Math.min(currentQuestionIndex + 1, totalQuestionsTarget)}
            </span>
            <span className="text-stone-400 font-mono text-xs sm:text-sm">/ {totalQuestionsTarget}</span>
          </div>

          <span className="hidden md:inline text-stone-700" aria-hidden="true">|</span>

          {/* Current Epoch */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-stone-400">Epoch:</span>
            <span className="font-bold text-stone-100">{unitInfo.name}</span>
            <span className="text-stone-500 text-xs font-mono">({unitInfo.era})</span>
          </div>

          <span className="text-stone-700" aria-hidden="true">|</span>

          {/* Difficulty Tier */}
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Adaptive Tier:</span>
            <span className={`font-mono font-bold px-2.5 py-1 rounded-md text-xs sm:text-sm ${
              currentTier === 1 
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' 
                : currentTier === 2 
                ? 'bg-amber-950/80 text-amber-300 border border-amber-800' 
                : 'bg-indigo-950/80 text-indigo-300 border border-indigo-800'
            }`}>
              Tier {currentTier} {currentTier === 1 ? '• Foundational' : currentTier === 2 ? '• Applied' : '• Analytical'}
            </span>
          </div>

          {streak > 1 && (
            <>
              <span className="text-stone-700" aria-hidden="true">|</span>
              <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold text-sm animate-pulse">
                <span>🔥 {streak}x Streak</span>
              </div>
            </>
          )}
        </div>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Accessibility Font Size Toggle */}
          <button
            onClick={onToggleFontSize}
            className={`p-2.5 rounded-xl transition-colors border text-sm flex items-center gap-1.5 font-bold ${
              fontSize === 'large'
                ? 'bg-stone-800 border-amber-500 text-amber-300 ring-2 ring-amber-400/50'
                : 'bg-stone-800/80 border-stone-700 text-stone-300 hover:text-stone-100'
            }`}
            title="Toggle Extra Large Font Mode"
          >
            <Type className="w-4 h-4" />
            <span className="hidden sm:inline font-mono">{fontSize === 'large' ? 'Large A+' : 'Normal'}</span>
          </button>

          {/* Mute Sound Toggle */}
          <button
            onClick={onToggleMute}
            className="p-2.5 rounded-xl bg-stone-800/80 border border-stone-700 text-stone-300 hover:text-stone-100 transition-colors"
            title={isMuted ? 'Unmute Arcade Sounds' : 'Mute Arcade Sounds'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-stone-500" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
          </button>

          {/* Teacher Diagnostic Portal Button */}
          <button
            onClick={onOpenTeacherPortal}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-md ${
              isTeacherView
                ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 ring-4 ring-amber-300'
                : 'bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-100'
            }`}
          >
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <span className="whitespace-nowrap">{isTeacherView ? 'Return to Quiz' : 'Teacher Report'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar under header */}
      <div className="w-full h-1.5 bg-stone-800 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </header>
  );
};
