import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Play, 
  Shield, 
  Clock, 
  Volume2, 
  VolumeX, 
  GraduationCap, 
  Award, 
  BookOpen, 
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Type
} from 'lucide-react';
import { Question, DiagnosticReport, UnitId } from './types/history';
import { AdaptiveEngine } from './utils/adaptiveEngine';
import { sounds } from './utils/soundEffects';
import { ArcadeHeader } from './components/ArcadeHeader';
import { ArcadeQuizCard } from './components/ArcadeQuizCard';
import { EpochSelectionScreen } from './components/EpochSelectionScreen';
import { StudentVictoryModal } from './components/StudentVictoryModal';
import { TeacherDashboard } from './components/TeacherDashboard';
import { getDemoReport } from './data/demoProfiles';

export default function App() {
  const [screen, setScreen] = useState<'welcome' | 'epoch-selection' | 'quiz' | 'victory' | 'teacher'>('welcome');
  const [studentName, setStudentName] = useState<string>('Alex');
  const [selectedUnits, setSelectedUnits] = useState<UnitId[]>(['unit1', 'unit2', 'unit3', 'unit4']);
  const [engine, setEngine] = useState<AdaptiveEngine>(() => new AdaptiveEngine());
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [lifelinesRemaining, setLifelinesRemaining] = useState<number>(3);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [activeReport, setActiveReport] = useState<DiagnosticReport | null>(null);

  const handleGoToEpochSelection = () => {
    sounds.playClick();
    setScreen('epoch-selection');
  };

  const handleToggleUnit = (unitId: UnitId) => {
    setSelectedUnits(prev => {
      if (prev.includes(unitId)) {
        return prev.filter(u => u !== unitId);
      } else {
        return [...prev, unitId];
      }
    });
  };

  const handleSelectAllUnits = () => {
    setSelectedUnits(['unit1', 'unit2', 'unit3', 'unit4']);
  };

  const handleClearAllUnits = () => {
    setSelectedUnits([]);
  };

  // Initialize first question on quiz start
  const handleStartGame = () => {
    sounds.playClick();
    const newEngine = new AdaptiveEngine(selectedUnits);
    setEngine(newEngine);
    const q1 = newEngine.getNextQuestion();
    setCurrentQuestion(q1);
    setScore(0);
    setStreak(0);
    setLifelinesRemaining(3);
    setScreen('quiz');
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sounds.setMuted(nextMuted);
  };

  const handleToggleFontSize = () => {
    setFontSize(prev => (prev === 'normal' ? 'large' : 'normal'));
  };

  const handleAnswerQuestion = (
    selectedOptionId: string,
    timeSpentSeconds: number,
    usedLifeline: boolean,
    usedHint: boolean,
    eliminatedOptionIds: string[]
  ) => {
    if (!currentQuestion) return;

    // Record answer in engine
    const record = engine.recordAnswer(
      currentQuestion,
      selectedOptionId,
      timeSpentSeconds,
      usedLifeline,
      usedHint,
      eliminatedOptionIds
    );

    // Update game points and streak
    if (record.isCorrect) {
      const basePoints = 100;
      const tierBonus = (record.tierAtTime - 1) * 25;
      const streakBonus = streak * 15;
      const pointsEarned = basePoints + tierBonus + streakBonus;

      setScore(prev => prev + pointsEarned);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    if (usedLifeline) {
      setLifelinesRemaining(prev => Math.max(0, prev - 1));
    }

    // Check if session has met completion threshold (10-14 questions)
    if (engine.shouldFinish()) {
      const finalReport = engine.generateDiagnosticReport(studentName);
      setActiveReport(finalReport);
      setScreen('victory');
      return;
    }

    // Fetch next adaptive question
    const nextQ = engine.getNextQuestion();
    if (!nextQ) {
      // Reached termination cap
      const finalReport = engine.generateDiagnosticReport(studentName);
      setActiveReport(finalReport);
      setScreen('victory');
    } else {
      setCurrentQuestion(nextQ);
    }
  };

  const handleOpenTeacherPortal = () => {
    sounds.playClick();
    if (screen === 'teacher') {
      // Return to quiz or previous screen
      setScreen(currentQuestion ? 'quiz' : 'welcome');
    } else {
      // Generate current report if in quiz, or fallback to demo profile if on welcome
      if (engine.getAskedCount() > 0) {
        setActiveReport(engine.generateDiagnosticReport(studentName));
      } else {
        setActiveReport(getDemoReport('marcus'));
      }
      setScreen('teacher');
    }
  };

  const handleLoadDemoProfile = (profileKey: string) => {
    const demo = getDemoReport(profileKey);
    setActiveReport(demo);
  };

  const handleResetGame = () => {
    sounds.playClick();
    setScreen('welcome');
    setCurrentQuestion(null);
    setScore(0);
    setStreak(0);
    setLifelinesRemaining(3);
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans">
      {/* Universal Top Bar */}
      <ArcadeHeader
        currentQuestionIndex={engine.getAskedCount()}
        totalQuestionsTarget={engine.getTargetQuestionCount()}
        currentUnit={currentQuestion ? currentQuestion.unit : 'unit1'}
        currentTier={engine.getCurrentTier()}
        streak={streak}
        lifelinesRemaining={lifelinesRemaining}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenTeacherPortal={handleOpenTeacherPortal}
        onResetGame={handleResetGame}
        fontSize={fontSize}
        onToggleFontSize={handleToggleFontSize}
        isTeacherView={screen === 'teacher'}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        {/* ==================================================== */}
        {/* SCREEN 1: WELCOME & STUDENT LAUNCHPAD                */}
        {/* ==================================================== */}
        {screen === 'welcome' && (
          <div className="w-full max-w-4xl mx-auto my-auto space-y-8 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-8 sm:p-12 shadow-sm text-center space-y-8">
              {/* Header Icon & Title */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-stone-950 font-black text-3xl shadow-lg">
                Ω
              </div>

              <div>
                <span className="text-sm sm:text-base font-mono font-bold tracking-wider text-amber-800 dark:text-amber-300 uppercase bg-amber-100 dark:bg-amber-950/70 px-4 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800">
                  10th Grade World History Adaptive Challenge
                </span>
                <h1 className="text-4xl sm:text-5xl font-black text-stone-950 dark:text-stone-50 tracking-tight mt-4">
                  Chronos Arcade: Time Rift Review
                </h1>
                <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-300 max-w-2xl mx-auto mt-3 leading-relaxed">
                  Travel through 400 years of global history in a fast, low-stakes adaptive challenge. The quiz adjusts to your answers as you travel across four historical epochs.
                </p>
              </div>

              {/* Student Name Input */}
              <div className="max-w-md mx-auto text-left">
                <label className="block text-sm sm:text-base font-bold text-stone-800 dark:text-stone-200 mb-2 font-mono">
                  Player Name:
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter student name..."
                  className="w-full px-5 py-3.5 rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-950 dark:text-stone-50 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              {/* Built-in IEP Accommodations Notice */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-2xl mx-auto">
                <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700">
                  <div className="flex items-center gap-2 font-bold text-base text-stone-900 dark:text-stone-100 mb-1.5">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span>Untimed Mode</span>
                  </div>
                  <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    No ticking timers or speed penalties. Read at your own comfortable pace.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700">
                  <div className="flex items-center gap-2 font-bold text-base text-stone-900 dark:text-stone-100 mb-1.5">
                    <Shield className="w-5 h-5 text-amber-600" />
                    <span>50:50 Lifelines</span>
                  </div>
                  <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    3 shield lifelines available to eliminate 2 incorrect answers anytime.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700">
                  <div className="flex items-center gap-2 font-bold text-base text-stone-900 dark:text-stone-100 mb-1.5">
                    <Volume2 className="w-5 h-5 text-amber-600" />
                    <span>Audio & Clues</span>
                  </div>
                  <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    Built-in text-to-speech audio reader and step-by-step thinking clues.
                  </p>
                </div>
              </div>

              {/* Proceed to Epoch Selection Button */}
              <div className="pt-3">
                <button
                  onClick={handleGoToEpochSelection}
                  className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-stone-950 hover:bg-stone-800 text-amber-400 hover:text-amber-300 font-black text-xl flex items-center justify-center gap-3 mx-auto shadow-xl transition-transform active:scale-95 cursor-pointer"
                >
                  <span>Next: Choose Epochs & Missions</span>
                  <ArrowRight className="w-6 h-6 stroke-[3]" />
                </button>
              </div>

              {/* Direct Teacher Entry link */}
              <div className="pt-6 border-t-2 border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-center gap-3 text-sm sm:text-base text-stone-600 dark:text-stone-400">
                <GraduationCap className="w-5 h-5 text-amber-600" />
                <span>Teacher evaluating the transfer student?</span>
                <button
                  onClick={handleOpenTeacherPortal}
                  className="font-bold text-stone-900 dark:text-stone-100 underline hover:text-amber-600 cursor-pointer"
                >
                  Open Teacher Evaluation Dashboard Directly
                </button>
              </div>
            </div>

            {/* Curriculum Scope Ribbon */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm sm:text-base text-stone-500 font-mono font-semibold">
              <span>Unit 1: Revolutions</span>
              <span>→</span>
              <span>Unit 2: Industrialism</span>
              <span>→</span>
              <span>Unit 3: WWI & Imperialism</span>
              <span>→</span>
              <span>Unit 4: WWII & Consequences</span>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* SCREEN 2: DEDICATED EPOCH SELECTION SCREEN           */}
        {/* ==================================================== */}
        {screen === 'epoch-selection' && (
          <EpochSelectionScreen
            studentName={studentName}
            selectedUnits={selectedUnits}
            onToggleUnit={handleToggleUnit}
            onSelectAll={handleSelectAllUnits}
            onClearAll={handleClearAllUnits}
            onBackToWelcome={() => setScreen('welcome')}
            onStartQuiz={handleStartGame}
          />
        )}

        {/* ==================================================== */}
        {/* SCREEN 3: ACTIVE ADAPTIVE QUIZ                       */}
        {/* ==================================================== */}
        {screen === 'quiz' && currentQuestion && (
          <div className="w-full my-auto animate-in fade-in duration-200">
            <ArcadeQuizCard
              question={currentQuestion}
              questionNumber={engine.getAskedCount() + 1}
              totalQuestionsTarget={engine.getTargetQuestionCount()}
              lifelinesAvailable={lifelinesRemaining}
              streak={streak}
              score={score}
              fontSize={fontSize}
              onAnswer={handleAnswerQuestion}
            />
          </div>
        )}

        {/* ==================================================== */}
        {/* SCREEN 3: STUDENT VICTORY CELEBRATION                */}
        {/* ==================================================== */}
        {screen === 'victory' && activeReport && (
          <div className="w-full my-auto animate-in zoom-in-95 duration-200">
            <StudentVictoryModal
              report={activeReport}
              score={score}
              onViewTeacherReport={() => setScreen('teacher')}
              onPlayAgain={handleStartGame}
            />
          </div>
        )}

        {/* ==================================================== */}
        {/* SCREEN 4: TEACHER DIAGNOSTIC & IEP REPORT            */}
        {/* ==================================================== */}
        {screen === 'teacher' && activeReport && (
          <div className="w-full animate-in fade-in duration-200">
            <TeacherDashboard
              report={activeReport}
              onBackToQuiz={() => setScreen(currentQuestion ? 'quiz' : 'welcome')}
              onLoadDemoProfile={handleLoadDemoProfile}
              onSelectReport={(rep) => setActiveReport(rep)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="no-print mt-auto py-4 border-t border-stone-200 text-center text-xs text-stone-500 font-mono">
        10th Grade World History Diagnostic Screener · Aligned to Units 1–4 Standards · Adaptive Assessment Engine
      </footer>
    </div>
  );
}
