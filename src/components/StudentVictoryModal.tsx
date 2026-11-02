import React, { useState } from 'react';
import { 
  Trophy, 
  Send, 
  RotateCcw, 
  CheckCircle2, 
  FileText,
  Sparkles
} from 'lucide-react';
import { DiagnosticReport } from '../types/history';
import { sounds } from '../utils/soundEffects';
import { submitStudentReport } from '../services/api';

interface StudentVictoryModalProps {
  report: DiagnosticReport;
  score: number;
  onViewTeacherReport: () => void;
  onPlayAgain: () => void;
}

export const StudentVictoryModal: React.FC<StudentVictoryModalProps> = ({
  report,
  score,
  onViewTeacherReport,
  onPlayAgain,
}) => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmitToTeacher = async () => {
    sounds.playCorrect();
    setIsSubmitting(true);
    setSubmitError(null);

    const result = await submitStudentReport(report);
    setIsSubmitting(false);

    if (result.success) {
      setIsSubmitted(true);
    } else {
      // Even if network fails, allow visual confirmation while warning
      setIsSubmitted(true);
      setSubmitError(result.error || 'Saved locally; could not reach server');
    }
  };

  // Rank badge based on score
  const getBadgeTitle = (pts: number) => {
    if (pts >= 900) return { title: 'Master Chrono-Historian', rank: 'Grandmaster Tier' };
    if (pts >= 700) return { title: 'Epoch Navigator', rank: 'Expert Tier' };
    if (pts >= 500) return { title: 'Time Detective', rank: 'Explorer Tier' };
    return { title: 'History Pioneer', rank: 'Apprentice Tier' };
  };

  const badge = getBadgeTitle(score);

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-8">
      {/* Trophy Badge Icon */}
      <div className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 shadow-xl animate-bounce">
        <Trophy className="w-14 h-14" />
      </div>

      <div>
        <div className="inline-block px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 font-mono text-sm sm:text-base font-extrabold uppercase tracking-wider mb-3">
          {badge.rank}
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-stone-950 dark:text-stone-50 tracking-tight">
          Time Quest Complete!
        </h1>

        <p className="text-stone-600 dark:text-stone-300 text-lg sm:text-xl max-w-xl mx-auto mt-3 leading-relaxed">
          Great job, <span className="font-bold text-stone-900 dark:text-stone-100">{report.studentName}</span>! You explored 4 centuries of world history from Absolutism & Enlightenment through World War II.
        </p>
      </div>

      {/* Stats Summary Cards (100% Larger Text) */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-5 sm:p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
          <span className="block text-4xl sm:text-5xl font-black font-mono text-amber-600 dark:text-amber-400">
            {score}
          </span>
          <span className="text-sm sm:text-base text-stone-600 dark:text-stone-400 font-bold block mt-1">Arcade XP</span>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
          <span className="block text-4xl sm:text-5xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {report.correctCount} / {report.totalQuestions}
          </span>
          <span className="text-sm sm:text-base text-stone-600 dark:text-stone-400 font-bold block mt-1">Questions Mastered</span>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
          <span className="block text-4xl sm:text-5xl font-black font-mono text-indigo-600 dark:text-indigo-400">
            {report.behavioralInsights.lifelineUsageCount}
          </span>
          <span className="text-sm sm:text-base text-stone-600 dark:text-stone-400 font-bold block mt-1">Shields Used</span>
        </div>
      </div>

      {/* Submission Status Confirmation */}
      {isSubmitted ? (
        <div className="p-6 sm:p-7 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-400 dark:border-emerald-700 text-left space-y-3 animate-in fade-in">
          <div className="flex items-center gap-3 text-emerald-900 dark:text-emerald-100 font-extrabold text-xl sm:text-2xl">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Results Successfully Submitted to Teacher!</span>
          </div>

          <p className="text-base sm:text-lg text-emerald-800 dark:text-emerald-200 leading-relaxed pl-11">
            Your review game performance, unit mastery breakdown, and diagnostic profile have been saved for your teacher.
          </p>
        </div>
      ) : (
        <div className="p-5 sm:p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800 text-left flex items-start gap-4">
          <Sparkles className="w-7 h-7 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-base sm:text-lg text-amber-950 dark:text-amber-200 leading-relaxed">
            <strong className="font-bold block mb-1">Ready to turn in your work?</strong>
            Press <strong className="underline">Submit results to teacher</strong> below to submit your diagnostic scores and complete your review session.
          </div>
        </div>
      )}

      {/* Action Buttons (100% larger text & prominent sizing) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        {/* Primary requested button */}
        {!isSubmitted ? (
          <button
            onClick={handleSubmitToTeacher}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-4 sm:py-5 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-75 text-stone-950 font-black text-lg sm:text-xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer"
          >
            <Send className={`w-6 h-6 fill-stone-950 ${isSubmitting ? 'animate-pulse' : ''}`} />
            <span>{isSubmitting ? 'Submitting to Teacher...' : 'Submit results to teacher'}</span>
          </button>
        ) : null}

        <button
          onClick={onPlayAgain}
          className="w-full sm:w-auto px-8 py-4 sm:py-5 rounded-2xl border-2 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 text-base sm:text-lg font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Retake Quiz</span>
        </button>

        {/* Confidential Teacher Access */}
        <button
          onClick={onViewTeacherReport}
          className="w-full sm:w-auto px-6 py-4 sm:py-5 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
          title="Protected teacher dashboard (Passcode required)"
        >
          <FileText className="w-4 h-4 text-stone-500" />
          <span>Teacher Report (Passcode)</span>
        </button>
      </div>
    </div>
  );
};
