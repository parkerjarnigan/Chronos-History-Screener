import React from 'react';
import { 
  Check, 
  Crown, 
  Factory, 
  Compass, 
  ShieldAlert, 
  Play, 
  ArrowLeft, 
  Clock, 
  Sparkles, 
  Layers,
  CheckSquare,
  Square
} from 'lucide-react';
import { UnitId } from '../types/history';
import { sounds } from '../utils/soundEffects';

interface EpochInfo {
  id: UnitId;
  epochNumber: number;
  title: string;
  era: string;
  description: string;
  keyConcepts: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const EPOCHS: EpochInfo[] = [
  {
    id: 'unit1',
    epochNumber: 1,
    title: 'Absolutism & Revolutions',
    era: '1600 – 1815',
    description: 'Divine right monarchies, Enlightenment political philosophy, the American & French Revolutions, and Napoleonic Europe.',
    keyConcepts: ['Louis XIV & Versailles', 'Locke & Montesquieu', 'Three Estates & Bastille', 'Napoleonic Code'],
    icon: Crown
  },
  {
    id: 'unit2',
    epochNumber: 2,
    title: 'Industrial Revolution & Society',
    era: '1750 – 1900',
    description: 'The shift from agrarian labor to steam-powered manufacturing, urban tenement living, capitalism vs. socialism, and the Scramble for Africa.',
    keyConcepts: ['Steam Power & Coal', 'Factory Acts & Labor', 'Marx vs. Adam Smith', 'Berlin Conference'],
    icon: Factory
  },
  {
    id: 'unit3',
    epochNumber: 3,
    title: 'WWI & Global Imperialism',
    era: '1880 – 1919',
    description: 'Structural causes of World War I, the Sarajevo spark, industrialized trench warfare, the Russian Revolution, and the Treaty of Versailles.',
    keyConcepts: ['M-A-I-N Causes', 'Trench Realities & Total War', 'Bolshevik Revolution', 'Versailles War Guilt'],
    icon: Compass
  },
  {
    id: 'unit4',
    epochNumber: 4,
    title: 'Interwar Years & World War II',
    era: '1919 – 1945',
    description: 'Weimar hyperinflation, totalitarian ideologies (fascism vs. communism), appeasement, major WWII turning points, and the Holocaust.',
    keyConcepts: ['Weimar Hyperinflation', 'Appeasement at Munich', 'Stalingrad & D-Day', 'Nuremberg Laws & UDHR'],
    icon: ShieldAlert
  }
];

interface EpochSelectionScreenProps {
  studentName: string;
  selectedUnits: UnitId[];
  onToggleUnit: (unitId: UnitId) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onBackToWelcome: () => void;
  onStartQuiz: () => void;
}

export function EpochSelectionScreen({
  studentName,
  selectedUnits,
  onToggleUnit,
  onSelectAll,
  onClearAll,
  onBackToWelcome,
  onStartQuiz
}: EpochSelectionScreenProps) {
  const isAllSelected = selectedUnits.length === EPOCHS.length;
  const count = selectedUnits.length;

  // Calculate estimated target question count
  const estimatedQuestions = count === 1 ? 6 : count === 2 ? 8 : count === 3 ? 10 : count === 4 ? 12 : 0;
  const estimatedMinutes = count === 1 ? '5' : count === 2 ? '7' : count === 3 ? '9' : '10-12';

  const handleCardClick = (unitId: UnitId) => {
    sounds.playClick();
    onToggleUnit(unitId);
  };

  const handleAllToggle = () => {
    sounds.playClick();
    if (isAllSelected) {
      onClearAll();
    } else {
      onSelectAll();
    }
  };

  const handleLaunch = () => {
    if (count === 0) return;
    sounds.playClick();
    onStartQuiz();
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 space-y-7 animate-in fade-in duration-200">
      {/* Top Banner Card */}
      <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-500" />
        
        <div className="flex flex-wrap items-center justify-between gap-3 text-left">
          <button
            onClick={onBackToWelcome}
            className="flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 font-bold text-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Change Name ({studentName})</span>
          </button>

          <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-amber-800 dark:text-amber-300 uppercase bg-amber-100 dark:bg-amber-950/70 px-3 py-1 rounded-lg border border-amber-300 dark:border-amber-800">
            Midstream Diagnostic Setup
          </span>
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-950 dark:text-stone-50 tracking-tight">
            Configure Historical Epochs
          </h1>
          <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-2xl mx-auto mt-2 leading-relaxed">
            Select the specific units <span className="font-bold text-stone-900 dark:text-stone-100">{studentName}</span> needs to complete. Only selected epochs will be tested during this adaptive session.
          </p>
        </div>

        {/* Master Selector Toolbar */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 dark:border-stone-800">
          <button
            onClick={handleAllToggle}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-sm transition-all cursor-pointer"
          >
            {isAllSelected ? (
              <>
                <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>All Epochs Selected (Click to Clear)</span>
              </>
            ) : (
              <>
                <Square className="w-4 h-4 text-stone-400" />
                <span>Select All 4 Epochs</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2 text-sm font-mono font-bold text-stone-600 dark:text-stone-400">
            <Layers className="w-4 h-4 text-amber-500" />
            <span>{count} of 4 Epochs Active</span>
          </div>
        </div>
      </div>

      {/* Epoch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EPOCHS.map((epoch) => {
          const isSelected = selectedUnits.includes(epoch.id);
          const IconComponent = epoch.icon;

          return (
            <div
              key={epoch.id}
              onClick={() => handleCardClick(epoch.id)}
              className={`p-6 rounded-3xl border-2 transition-all cursor-pointer text-left relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 opacity-80 hover:opacity-100'
              }`}
            >
              <div>
                {/* Header row with icon, epoch badge and checkbox */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 border-amber-400 font-black'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider block">
                        Epoch {epoch.epochNumber} · {epoch.era}
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-stone-950 dark:text-stone-50 leading-tight">
                        {epoch.title}
                      </h3>
                    </div>
                  </div>

                  {/* Interactive Checkbox Indicator */}
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all ${
                    isSelected
                      ? 'bg-amber-500 border-amber-600 text-stone-950'
                      : 'border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800'
                  }`}>
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>

                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
                  {epoch.description}
                </p>
              </div>

              {/* Curriculum tags */}
              <div className="pt-3 border-t border-stone-200/60 dark:border-stone-800/60">
                <span className="text-xs font-mono font-bold text-stone-500 block mb-1.5 uppercase">
                  Curriculum Focus:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {epoch.keyConcepts.map((concept, idx) => (
                    <span 
                      key={idx}
                      className="text-xs font-medium px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Session Plan & Launch Footer */}
      <div className="bg-stone-950 text-stone-50 border-2 border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
              Diagnostic Mission Parameters
            </span>
            <div className="flex items-center gap-3 text-lg font-bold text-stone-200">
              <Clock className="w-5 h-5 text-amber-400" />
              {count > 0 ? (
                <span>
                  Estimated Session: <strong className="text-amber-300 font-mono font-black">{estimatedQuestions} Questions</strong> (~{estimatedMinutes} mins)
                </span>
              ) : (
                <span className="text-rose-400">
                  Please select at least 1 epoch to proceed.
                </span>
              )}
            </div>
          </div>

          {/* Launch Action Button */}
          <button
            onClick={handleLaunch}
            disabled={count === 0}
            className={`w-full sm:w-auto px-10 py-4 sm:py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl transition-transform cursor-pointer ${
              count > 0
                ? 'bg-amber-400 hover:bg-amber-300 text-stone-950 active:scale-95'
                : 'bg-stone-800 text-stone-500 cursor-not-allowed opacity-60'
            }`}
          >
            <Play className={`w-6 h-6 ${count > 0 ? 'fill-stone-950' : 'fill-stone-500'}`} />
            <span>Launch Time Jump ({estimatedQuestions} Qs)</span>
          </button>
        </div>

        {count === 0 && (
          <p className="text-xs sm:text-sm text-amber-400 text-center sm:text-left">
            Select one or more epochs above to configure which units are included in this assessment.
          </p>
        )}
      </div>
    </div>
  );
}
