import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  HelpCircle, 
  Sparkles, 
  BookOpen, 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Flame,
  ArrowRight
} from 'lucide-react';
import { Question } from '../types/history';
import { sounds } from '../utils/soundEffects';
import { HistoricalVisualStimulus } from './HistoricalVisualStimulus';
import { ChronoTimelineBar } from './ChronoTimelineBar';

interface ArcadeQuizCardProps {
  question: Question;
  questionNumber: number;
  totalQuestionsTarget: number;
  lifelinesAvailable: number;
  streak: number;
  score: number;
  fontSize: 'normal' | 'large';
  onAnswer: (
    selectedOptionId: string,
    timeSpentSeconds: number,
    usedLifeline: boolean,
    usedHint: boolean,
    eliminatedOptionIds: string[]
  ) => void;
}

export const ArcadeQuizCard: React.FC<ArcadeQuizCardProps> = ({
  question,
  questionNumber,
  totalQuestionsTarget,
  lifelinesAvailable,
  streak,
  score,
  fontSize,
  onAnswer,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [eliminatedIds, setEliminatedIds] = useState<string[]>([]);
  const [hasUsedLifeline, setHasUsedLifeline] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hasUsedHint, setHasUsedHint] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Randomize answer options position (A,B,C,D) for each question
  const displayOptions = useMemo(() => {
    const opts = [...question.options];
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return opts;
  }, [question.id]);
  
  // Reset state when new question loads
  useEffect(() => {
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setEliminatedIds([]);
    setHasUsedLifeline(false);
    setShowHint(false);
    setHasUsedHint(false);
    setStartTime(Date.now());
    setElapsedSeconds(0);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [question.id]);

  // Elapsed stopwatch timer (Untimed mode, purely reflective)
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, isSubmitted]);

  // Text-to-Speech Read Aloud helper for IEP accommodations
  const handleReadAloud = (textToRead: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // 50:50 Lifeline Handler: Eliminates 2 incorrect options
  const handleUse5050 = () => {
    if (lifelinesAvailable <= 0 || hasUsedLifeline || isSubmitted) return;
    sounds.playLifeline();

    const incorrectOptions = question.options.filter(opt => opt.id !== question.correctOptionId);
    const shuffled = [...incorrectOptions].sort(() => 0.5 - Math.random());
    const toEliminate = shuffled.slice(0, 2).map(opt => opt.id);

    setEliminatedIds(toEliminate);
    setHasUsedLifeline(true);
  };

  const handleToggleHint = () => {
    sounds.playClick();
    setShowHint(prev => !prev);
    setHasUsedHint(true);
  };

  const handleSelectOption = (optionId: string) => {
    if (isSubmitted || eliminatedIds.includes(optionId)) return;
    setSelectedOptionId(optionId);
    setIsSubmitted(true);

    const isCorrect = optionId === question.correctOptionId;
    if (isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playIncorrect();
    }
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    if (selectedOptionId) {
      const timeSpent = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
      onAnswer(selectedOptionId, timeSpent, hasUsedLifeline, hasUsedHint, eliminatedIds);
    }
  };

  const isCorrect = selectedOptionId === question.correctOptionId;
  const isLarge = fontSize === 'large';

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">
      {/* Segmented Historical Epoch Progress Bar with Time Traveler Character Sprite */}
      <ChronoTimelineBar
        currentUnit={question.unit}
        questionNumber={questionNumber}
      />

      {/* Top Status & Lifelines Deck (100% larger text) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 shadow-sm text-sm sm:text-base">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-mono font-medium">
            <Clock className="w-4 h-4 text-stone-500" />
            <span>Untimed · {elapsedSeconds}s</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 font-mono font-bold">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Score: {score} XP</span>
          </div>

          {streak > 1 && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-orange-100 dark:bg-orange-950/70 text-orange-800 dark:text-orange-200 font-mono font-extrabold animate-pulse">
              <Flame className="w-4 h-4 text-orange-600" />
              <span>{streak}x Combo</span>
            </div>
          )}
        </div>

        {/* Read Aloud & 50:50 Lifeline Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleReadAloud(`${question.questionText}. ${question.excerpt?.text || ''}`)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-bold transition-all text-sm sm:text-base ${
              isSpeaking
                ? 'bg-amber-500 border-amber-600 text-stone-950 ring-4 ring-amber-300 animate-pulse'
                : 'bg-stone-50 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 hover:bg-stone-100'
            }`}
            title="Read Question Aloud (Text-to-Speech)"
          >
            <Volume2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>{isSpeaking ? 'Reading Aloud...' : 'Read Aloud'}</span>
          </button>

          <button
            onClick={handleUse5050}
            disabled={lifelinesAvailable <= 0 || hasUsedLifeline || isSubmitted}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-black transition-all text-sm sm:text-base ${
              hasUsedLifeline
                ? 'bg-stone-100 dark:bg-stone-800/50 border-stone-300 dark:border-stone-700 text-stone-400 cursor-not-allowed'
                : lifelinesAvailable > 0 && !isSubmitted
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 border-amber-600 hover:brightness-105 shadow-md active:scale-95'
                : 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-400 cursor-not-allowed'
            }`}
            title="50:50 Lifeline: Eliminates 2 incorrect answer choices"
          >
            <Shield className="w-5 h-5" />
            <span>50:50 Shield</span>
            <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-stone-950/20 text-stone-900 dark:text-stone-100">
              {lifelinesAvailable}
            </span>
          </button>
        </div>
      </div>

      {/* Main Question Card Surface */}
      <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl shadow-sm p-7 sm:p-10 transition-all">
        {/* Unit & Concept Meta Tag */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm sm:text-base text-stone-500 dark:text-stone-400 mb-4 font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900 dark:text-stone-100">
              {question.unitName}
            </span>
            <span aria-hidden="true">·</span>
            <span>Focus: {question.foundationalConcept}</span>
          </div>
          <span className="px-3 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold text-xs sm:text-sm">
            {question.readingDemand === 'high' ? 'Source Analysis' : question.readingDemand === 'medium' ? 'Concept Application' : 'Core Recall'}
          </span>
        </div>

        {/* Question Prompt (100% larger text) */}
        <h2 className={`font-extrabold text-stone-950 dark:text-stone-50 leading-tight tracking-tight mb-6 ${
          isLarge ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
        }`}>
          {question.questionText}
        </h2>

        {/* Primary Source Excerpt (if applicable) */}
        {question.excerpt && (
          <div className="mb-7 p-6 rounded-2xl bg-amber-50/90 dark:bg-stone-800/90 border-2 border-amber-300/80 dark:border-stone-700 relative">
            <div className="flex items-center justify-between text-sm sm:text-base font-bold text-amber-950 dark:text-amber-300 mb-3">
              <span className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-600" />
                Historical Document Excerpt
              </span>
              {question.excerpt.date && (
                <span className="font-mono text-xs sm:text-sm text-amber-800 dark:text-amber-400">
                  {question.excerpt.date}
                </span>
              )}
            </div>
            <p className={`italic text-stone-900 dark:text-stone-100 leading-relaxed font-serif ${
              isLarge ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
            }`}>
              {question.excerpt.text}
            </p>
            {question.excerpt.author && (
              <p className="mt-3 text-right text-sm sm:text-base font-semibold text-stone-700 dark:text-stone-300">
                — {question.excerpt.author} {question.excerpt.sourceTitle ? `· ${question.excerpt.sourceTitle}` : ''}
              </p>
            )}
          </div>
        )}

        {/* ACTUAL VISUAL STIMULUS (Cartoons & Maps) */}
        {question.visualContext && question.visualContext.visualId ? (
          <HistoricalVisualStimulus
            visualId={question.visualContext.visualId}
            title={question.visualContext.title}
            caption={question.visualContext.caption}
            imageUrl={question.visualContext.imageUrl}
            imageAlt={question.visualContext.imageAlt}
          />
        ) : question.visualContext ? (
          <div className="mb-7 p-6 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border-2 border-stone-300 dark:border-stone-700">
            <span className="font-extrabold text-base sm:text-lg text-stone-900 dark:text-stone-100 block mb-2 uppercase tracking-wide">
              {question.visualContext.title}
            </span>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 italic mb-4">
              "{question.visualContext.caption}"
            </p>
            <div className="space-y-2 pl-4 border-l-4 border-amber-500">
              {question.visualContext.details.map((detail, idx) => (
                <p key={idx} className="text-sm sm:text-base text-stone-800 dark:text-stone-200">
                  • {detail}
                </p>
              ))}
            </div>
          </div>
        ) : null}

        {/* Answer Options Grid (100% larger text and generous touch padding) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
          {displayOptions.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx); // A, B, C, D
            const isEliminated = eliminatedIds.includes(option.id);
            const isSelected = selectedOptionId === option.id;
            const isThisCorrect = option.id === question.correctOptionId;

            let buttonStyle = 'bg-stone-50 dark:bg-stone-800/80 border-2 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 hover:border-amber-400 hover:bg-amber-50/40 dark:hover:bg-stone-800';

            if (isEliminated) {
              buttonStyle = 'opacity-30 bg-stone-100 dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 text-stone-400 line-through cursor-not-allowed';
            } else if (isSubmitted) {
              if (isThisCorrect) {
                buttonStyle = 'bg-emerald-50 dark:bg-emerald-950/70 border-2 border-emerald-500 text-emerald-950 dark:text-emerald-100 ring-4 ring-emerald-400 shadow-md';
              } else if (isSelected) {
                buttonStyle = 'bg-rose-50 dark:bg-rose-950/70 border-2 border-rose-500 text-rose-950 dark:text-rose-100 ring-4 ring-rose-300';
              } else {
                buttonStyle = 'opacity-40 bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 text-stone-400';
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                disabled={isSubmitted || isEliminated}
                className={`p-5 sm:p-6 rounded-2xl text-left flex items-start gap-4 transition-all duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 ${buttonStyle}`}
              >
                <span className={`w-9 h-9 rounded-xl font-mono font-black text-base flex items-center justify-center shrink-0 ${
                  isSubmitted && isThisCorrect
                    ? 'bg-emerald-600 text-white'
                    : isSubmitted && isSelected
                    ? 'bg-rose-600 text-white'
                    : 'bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200'
                }`}>
                  {letter}
                </span>

                <div className="flex-1">
                  <span className={`block font-bold leading-snug ${isLarge ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'}`}>
                    {option.text}
                  </span>
                </div>

                {isSubmitted && isThisCorrect && (
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                )}
                {isSubmitted && isSelected && !isThisCorrect && (
                  <XCircle className="w-7 h-7 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Hint Drawer & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t-2 border-stone-100 dark:border-stone-800">
          <button
            onClick={handleToggleHint}
            disabled={isSubmitted}
            className={`flex items-center gap-2 text-sm sm:text-base font-bold px-4 py-2.5 rounded-xl border-2 transition-colors ${
              showHint
                ? 'bg-amber-100 dark:bg-amber-950/70 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200'
                : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:text-stone-900'
            }`}
          >
            <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>{showHint ? 'Hide Clue' : 'Need a Clue? (Hint)'}</span>
          </button>

          {/* Hint callout */}
          {showHint && (
            <div className="w-full mt-3 p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-300 dark:border-amber-800 text-sm sm:text-base text-amber-950 dark:text-amber-100 leading-relaxed animate-in fade-in">
              <span className="font-extrabold mr-1">💡 Clue:</span>
              {question.hint}
            </div>
          )}
        </div>
      </div>

      {/* Immediate Post-Answer Feedback Sheet */}
      {isSubmitted && (
        <div className={`p-6 sm:p-8 rounded-3xl border-2 shadow-xl animate-in slide-in-from-bottom-3 duration-200 ${
          isCorrect
            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-700'
            : 'bg-amber-50 dark:bg-amber-950/50 border-amber-400 dark:border-amber-700'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2.5">
                {isCorrect ? (
                  <span className="font-black text-emerald-900 dark:text-emerald-100 text-xl sm:text-2xl flex items-center gap-2">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                    Correct! +100 XP
                  </span>
                ) : (
                  <span className="font-black text-amber-950 dark:text-amber-100 text-xl sm:text-2xl flex items-center gap-2">
                    <Sparkles className="w-7 h-7 text-amber-600" />
                    Good Effort! Reviewing the History:
                  </span>
                )}
              </div>

              <p className={`text-stone-900 dark:text-stone-100 leading-relaxed ${isLarge ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'}`}>
                {question.explanation}
              </p>

              <p className="text-sm text-stone-600 dark:text-stone-400 font-mono">
                Historical Anchor: <span className="font-bold text-stone-800 dark:text-stone-200">{question.foundationalConcept}</span>
              </p>
            </div>

            {/* Next Button (100% larger) */}
            <button
              onClick={handleNextQuestion}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-stone-950 hover:bg-stone-800 text-amber-400 hover:text-amber-300 font-black text-lg flex items-center justify-center gap-3 shadow-xl transition-transform active:scale-95 shrink-0"
            >
              <span>Next Time Jump</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
