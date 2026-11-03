import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  Copy, 
  Check, 
  AlertTriangle, 
  BookOpen, 
  Brain, 
  FileText, 
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Lock,
  Unlock,
  Users,
  RefreshCw,
  Download,
  Trash2,
  Search,
  KeyRound,
  Calendar,
  Sparkles,
  Award
} from 'lucide-react';
import { DiagnosticReport, UnitId, CognitiveSkill } from '../types/history';
import { 
  fetchSubmissionsList, 
  fetchSubmissionDetail, 
  deleteSubmission, 
  verifyTeacherPasscode,
  SubmissionSummary 
} from '../services/api';

interface TeacherDashboardProps {
  report: DiagnosticReport;
  onBackToQuiz: () => void;
  onLoadDemoProfile?: (profileKey: string) => void;
  onSelectReport?: (report: DiagnosticReport) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  report,
  onBackToQuiz,
  onLoadDemoProfile,
  onSelectReport,
}) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'overview' | 'units' | 'reading' | 'iep' | 'log'>('roster');
  const [copiedIEP, setCopiedIEP] = useState<boolean>(false);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Security Gate
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return typeof window !== 'undefined' && sessionStorage.getItem('chronos_teacher_unlocked') === 'true';
  });
  const [passcodeInput, setPasscodeInput] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Submissions Roster State
  const [submissions, setSubmissions] = useState<SubmissionSummary[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadSubmissions = async () => {
    setIsLoadingSubmissions(true);
    const list = await fetchSubmissionsList();
    setSubmissions(list);
    setIsLoadingSubmissions(false);
  };

  useEffect(() => {
    if (isUnlocked) {
      loadSubmissions();
    }
  }, [isUnlocked]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcodeInput.trim()) return;

    setIsVerifying(true);
    setPasscodeError('');
    const ok = await verifyTeacherPasscode(passcodeInput.trim());
    setIsVerifying(false);

    if (ok) {
      setIsUnlocked(true);
      sessionStorage.setItem('chronos_teacher_unlocked', 'true');
      loadSubmissions();
    } else {
      setPasscodeError('Incorrect teacher passcode. (Default: 1986)');
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem('chronos_teacher_unlocked');
    setPasscodeInput('');
    setActiveTab('roster');
  };

  const handleSelectSubmission = async (subId: string) => {
    setSelectedSubId(subId);
    const full = await fetchSubmissionDetail(subId);
    if (full && onSelectReport) {
      onSelectReport(full);
      setActiveTab('overview');
    }
  };

  const handleDeleteSubmission = async (e: React.MouseEvent, subId: string, studentName: string) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete the submission for "${studentName}"?`)) {
      return;
    }
    setDeletingId(subId);
    const success = await deleteSubmission(subId);
    setDeletingId(null);
    if (success) {
      setSubmissions(prev => prev.filter(s => s.id !== subId));
    }
  };

  const handleExportCSV = () => {
    if (submissions.length === 0) return;
    const headers = [
      'Student Name',
      'Date / Time',
      'Questions Mastered',
      'Total Questions',
      'Overall Readiness %',
      'Readiness Level',
      'Lexile Reading Estimate',
      'Avg Processing Pacing (sec)',
      'Unit 1 % (Absolutism)',
      'Unit 2 % (Industrialism)',
      'Unit 3 % (WWI)',
      'Unit 4 % (WWII)',
      'Shields Used',
      'Hints Used'
    ];

    const rows = submissions.map(s => [
      `"${(s.studentName || '').replace(/"/g, '""')}"`,
      `"${s.completedAt || s.submittedAt || ''}"`,
      s.correctCount,
      s.totalQuestions,
      `${s.overallReadinessScore}%`,
      `"${s.readinessLevel || ''}"`,
      `"${s.readingLexileEstimate || ''}"`,
      s.avgReadingPacingSeconds,
      `${s.contentMastery?.unit1?.percentage ?? 'N/A'}%`,
      `${s.contentMastery?.unit2?.percentage ?? 'N/A'}%`,
      `${s.contentMastery?.unit3?.percentage ?? 'N/A'}%`,
      `${s.contentMastery?.unit4?.percentage ?? 'N/A'}%`,
      s.lifelineUsageCount,
      s.hintUsageCount
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `world_history_submissions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyIEPSummary = () => {
    const text = `
=== 10TH GRADE WORLD HISTORY DIAGNOSTIC READINESS PROFILE ===
Student: ${report.studentName}
Date: ${report.completedAt}
Overall Readiness Index: ${report.overallReadinessScore}% (${report.readinessLevel})
Score: ${report.correctCount}/${report.totalQuestions} Questions Mastered

READING & COGNITIVE PROFILE:
- Estimated Reading Level: ${report.readingProfile.readingLexileEstimate}
- Text Complexity Drop-Off Identified: ${report.readingProfile.comprehensionDropOffIdentified ? 'YES (Significant deficit on multi-clause/primary sources)' : 'NO'}
- Low Reading Demand Accuracy: ${report.readingProfile.lowDemandPct}%
- High Reading Demand (Sources) Accuracy: ${report.readingProfile.highDemandPct}%
- Average Question Processing Time: ${report.readingProfile.avgReadingPacingSeconds}s

UNIT MASTERY BREAKDOWN:
- Unit 1 (Absolutism & Enlightenment): ${report.contentMastery.unit1.percentage}% (${report.contentMastery.unit1.status})
- Unit 2 (Industrial Revolution): ${report.contentMastery.unit2.percentage}% (${report.contentMastery.unit2.status})
- Unit 3 (WWI & Imperialism): ${report.contentMastery.unit3.percentage}% (${report.contentMastery.unit3.status})
- Unit 4 (Interwar & WWII): ${report.contentMastery.unit4.percentage}% (${report.contentMastery.unit4.status})

RECOMMENDED CLASSROOM & LEARNING ACCOMMODATIONS:
${report.iepRecommendations.map(rec => `• [${rec.category} - ${rec.priority}] ${rec.strategy}: ${rec.rationale}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      setCopiedIEP(true);
      setTimeout(() => setCopiedIEP(false), 2500);
    });
  };

  const getStatusColor = (status: 'Mastered' | 'Developing' | 'Needs Review' | 'Not Assessed') => {
    if (status === 'Mastered') return 'text-emerald-800 bg-emerald-100 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700';
    if (status === 'Developing') return 'text-amber-800 bg-amber-100 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700';
    if (status === 'Needs Review') return 'text-rose-800 bg-rose-100 border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-700';
    return 'text-stone-600 bg-stone-100 border-stone-300 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700';
  };

  // Filter submissions by student name or date
  const filteredSubmissions = submissions.filter(sub => {
    const q = searchFilter.toLowerCase().trim();
    if (!q) return true;
    return (
      (sub.studentName || '').toLowerCase().includes(q) ||
      (sub.completedAt || '').toLowerCase().includes(q) ||
      (sub.readinessLevel || '').toLowerCase().includes(q)
    );
  });

  // ==========================================================
  // PASSCODE GATE: Student Privacy Protection
  // ==========================================================
  if (!isUnlocked) {
    return (
      <div className="w-full max-w-xl mx-auto my-12 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-7 animate-in fade-in">
        <div className="w-20 h-20 rounded-3xl bg-amber-100 dark:bg-amber-950/70 border-2 border-amber-300 dark:border-amber-800 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400 shadow-md">
          <KeyRound className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-md">
            Teacher Privacy Gate
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-950 dark:text-stone-50 tracking-tight mt-3">
            Teacher Access Only
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-base sm:text-lg mt-2 leading-relaxed">
            Enter the 4-digit teacher passcode to view student submissions and diagnostic evaluations.
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4 max-w-sm mx-auto">
          <div>
            <input
              type="password"
              maxLength={6}
              value={passcodeInput}
              onChange={(e) => {
                setPasscodeInput(e.target.value);
                setPasscodeError('');
              }}
              placeholder="••••"
              autoFocus
              className="w-full text-center text-4xl font-mono tracking-widest px-4 py-3.5 rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-950 dark:text-stone-50 font-black focus:outline-none focus:ring-4 focus:ring-amber-500"
            />
          </div>

          {passcodeError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm font-bold animate-in fade-in">
              {passcodeError}
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-4 rounded-2xl bg-stone-950 hover:bg-stone-800 text-amber-400 font-black text-lg shadow-lg transition-transform active:scale-95 disabled:opacity-75 cursor-pointer"
          >
            {isVerifying ? 'Verifying...' : 'Unlock Teacher Dashboard'}
          </button>
        </form>

        <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
          <button
            onClick={onBackToQuiz}
            className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 text-sm font-bold underline cursor-pointer"
          >
            ← Return to Game
          </button>
        </div>
      </div>
    );
  }

  // ==========================================================
  // UNLOCKED TEACHER DASHBOARD
  // ==========================================================
  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      {/* Top Header Card (100% larger text) */}
      <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToQuiz}
            className="p-3 rounded-xl border-2 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 transition-colors cursor-pointer"
            title="Return to Student Quiz"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-950 dark:text-stone-50 tracking-tight flex items-center gap-2">
              Teacher Diagnostic & Evaluation Portal
            </h1>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 font-mono mt-1">
              Active Student: <strong className="text-stone-900 dark:text-stone-100 font-bold">{report.studentName}</strong> · Evaluated: {report.completedAt}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Demo Profile Loader */}
          {onLoadDemoProfile && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-stone-500 font-mono hidden md:inline font-bold">Demo Cases:</span>
              <select
                onChange={(e) => {
                  onLoadDemoProfile(e.target.value);
                  setActiveTab('overview');
                }}
                defaultValue="marcus"
                className="px-3.5 py-2.5 rounded-xl border-2 border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold text-sm focus:ring-4 focus:ring-amber-400 cursor-pointer"
              >
                <option value="marcus">Marcus (Transfer Student Case)</option>
                <option value="devon">Devon (High Content Gaps)</option>
                <option value="elena">Elena (Vocabulary Deficit)</option>
                <option value="jordan">Jordan (High Readiness)</option>
              </select>
            </div>
          )}

          <button
            onClick={handleCopyIEPSummary}
            className="px-4 py-2.5 rounded-xl border-2 border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 text-stone-800 dark:text-stone-100 text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            {copiedIEP ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedIEP ? 'Copied!' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-stone-950 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-950 text-sm font-black flex items-center gap-2 shadow-md transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleLock}
            className="px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Lock Dashboard when leaving computer"
          >
            <Lock className="w-4 h-4" />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="no-print flex items-center gap-2 p-1.5 rounded-2xl bg-stone-200/80 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 text-sm sm:text-base font-bold overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab('roster');
            loadSubmissions();
          }}
          className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'roster'
              ? 'bg-amber-500 text-stone-950 shadow-md font-black'
              : 'text-stone-700 dark:text-stone-300 hover:text-stone-950'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Submissions Roster ({submissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-stone-50 shadow-md'
              : 'text-stone-700 dark:text-stone-300 hover:text-stone-950'
          }`}
        >
          Executive Summary
        </button>
        <button
          onClick={() => setActiveTab('units')}
          className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'units'
              ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-stone-50 shadow-md'
              : 'text-stone-700 dark:text-stone-300 hover:text-stone-950'
          }`}
        >
          Unit-by-Unit Mastery
        </button>
        <button
          onClick={() => setActiveTab('reading')}
          className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'reading'
              ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-stone-50 shadow-md'
              : 'text-stone-700 dark:text-stone-300 hover:text-stone-950'
          }`}
        >
          Reading & Cognitive Skills
        </button>
        <button
          onClick={() => setActiveTab('iep')}
          className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'iep'
              ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-stone-50 shadow-md'
              : 'text-stone-700 dark:text-stone-300 hover:text-stone-950'
          }`}
        >
          Targeted Learning Supports ({report.iepRecommendations.length})
        </button>
        <button
          onClick={() => setActiveTab('log')}
          className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'log'
              ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-stone-50 shadow-md'
              : 'text-stone-700 dark:text-stone-300 hover:text-stone-950'
          }`}
        >
          Item Audit Log ({report.questionLog.length})
        </button>
      </div>

      {/* ======================================================== */}
      {/* SECTION 0: SAVED SUBMISSIONS ROSTER                      */}
      {/* ======================================================== */}
      {activeTab === 'roster' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search by student name or date..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button
                onClick={loadSubmissions}
                disabled={isLoadingSubmissions}
                className="px-4 py-3 rounded-2xl border-2 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
                title="Reload latest submissions from students"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingSubmissions ? 'animate-spin text-amber-500' : ''}`} />
                <span>{isLoadingSubmissions ? 'Refreshing...' : 'Refresh List'}</span>
              </button>

              <button
                onClick={handleExportCSV}
                disabled={submissions.length === 0}
                className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-black text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
                title="Download CSV spreadsheet of all student results"
              >
                <Download className="w-4 h-4" />
                <span>Export to CSV</span>
              </button>
            </div>
          </div>

          {/* Submissions Table / Cards */}
          {submissions.length === 0 ? (
            <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-12 text-center space-y-4">
              <Users className="w-16 h-16 text-stone-300 dark:text-stone-600 mx-auto" />
              <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100">
                No Student Submissions Yet
              </h3>
              <p className="text-stone-600 dark:text-stone-400 max-w-lg mx-auto text-base leading-relaxed">
                When students finish the adaptive quiz on their Chromebooks and press <strong className="text-stone-900 dark:text-stone-100">"Submit results to teacher"</strong>, their full assessment and reading level diagnostics will immediately appear in this table.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    onLoadDemoProfile?.('marcus');
                    setActiveTab('overview');
                  }}
                  className="px-6 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-sm transition-colors cursor-pointer"
                >
                  Explore Sample Diagnostic Profile (Marcus) →
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm sm:text-base border-collapse">
                  <thead>
                    <tr className="bg-stone-100 dark:bg-stone-800/80 border-b-2 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-mono text-xs uppercase tracking-wider">
                      <th className="py-4 px-6 font-bold">Student Name</th>
                      <th className="py-4 px-6 font-bold">Date & Time</th>
                      <th className="py-4 px-6 font-bold text-center">Score</th>
                      <th className="py-4 px-6 font-bold text-center">Readiness Index</th>
                      <th className="py-4 px-6 font-bold">Estimated Lexile</th>
                      <th className="py-4 px-6 font-bold text-center">Supports Used</th>
                      <th className="py-4 px-6 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                    {filteredSubmissions.map((sub) => {
                      const isSelected = selectedSubId === sub.id;
                      return (
                        <tr
                          key={sub.id}
                          onClick={() => handleSelectSubmission(sub.id)}
                          className={`hover:bg-amber-50/60 dark:hover:bg-stone-800/50 transition-colors cursor-pointer ${
                            isSelected ? 'bg-amber-50 dark:bg-amber-950/20' : ''
                          }`}
                        >
                          <td className="py-4 px-6 font-black text-stone-950 dark:text-stone-50 flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 font-bold text-xs flex items-center justify-center shrink-0">
                              {sub.studentName ? sub.studentName[0].toUpperCase() : 'S'}
                            </div>
                            <span className="text-base sm:text-lg">{sub.studentName}</span>
                          </td>
                          <td className="py-4 px-6 font-mono text-stone-600 dark:text-stone-400 text-xs sm:text-sm">
                            {sub.completedAt || sub.submittedAt}
                          </td>
                          <td className="py-4 px-6 text-center font-mono font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                            {sub.correctCount} / {sub.totalQuestions}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className={`inline-block px-3 py-1 rounded-xl text-xs sm:text-sm font-bold border ${
                              sub.overallReadinessScore >= 75
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                                : sub.overallReadinessScore >= 55
                                ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                            }`}>
                              {sub.overallReadinessScore}% · {sub.readinessLevel}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-mono text-stone-700 dark:text-stone-300 text-xs sm:text-sm font-bold">
                            {sub.readingLexileEstimate}
                          </td>
                          <td className="py-4 px-6 text-center font-mono text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                            🛡️ {sub.lifelineUsageCount} · 💡 {sub.hintUsageCount}
                          </td>
                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleSelectSubmission(sub.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-amber-400 font-bold text-xs sm:text-sm transition-all cursor-pointer"
                              >
                                View Report →
                              </button>
                              <button
                                onClick={(e) => handleDeleteSubmission(e, sub.id, sub.studentName)}
                                disabled={deletingId === sub.id}
                                className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                title="Delete submission"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 1: EXECUTIVE SUMMARY                             */}
      {/* ======================================================== */}
      {(activeTab === 'overview' || typeof window === 'undefined') && (
        <div className="space-y-7">
          {/* Active Student Switcher Banner */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-center justify-between">
            <span className="text-sm sm:text-base text-amber-950 dark:text-amber-200">
              Currently Viewing Diagnostic File for: <strong className="font-bold underline">{report.studentName}</strong>
            </span>
            <button
              onClick={() => setActiveTab('roster')}
              className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 underline hover:text-amber-600 cursor-pointer"
            >
              ← Back to All Submissions Roster
            </button>
          </div>

          {/* Key Scorecards Strip (100% larger text) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* Overall Readiness Dial */}
            <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
              <span className="text-sm font-mono font-bold text-stone-500 uppercase tracking-wider">
                Overall Course Readiness
              </span>
              <div className="my-3 flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-amber-600 dark:text-amber-400">
                  {report.overallReadinessScore}%
                </span>
                <span className="text-sm sm:text-base text-stone-500 font-mono font-bold">
                  ({report.correctCount}/{report.totalQuestions})
                </span>
              </div>
              <span className={`text-xs sm:text-sm font-bold px-3 py-1 rounded-lg border-2 inline-block ${
                report.overallReadinessScore >= 75
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : report.overallReadinessScore >= 55
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-rose-100 text-rose-900 border-rose-300'
              }`}>
                {report.readinessLevel}
              </span>
            </div>

            {/* Reading Lexile Gauge */}
            <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
              <span className="text-sm font-mono font-bold text-stone-500 uppercase tracking-wider">
                Estimated Reading Demand
              </span>
              <div className="my-3">
                <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-stone-900 dark:text-stone-100">
                  {report.readingProfile.readingLexileEstimate}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                10th Grade Standard: <strong className="font-mono">1050L–1200L</strong>
              </p>
            </div>

            {/* Cognitive Drop-Off Indicator */}
            <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
              <span className="text-sm font-mono font-bold text-stone-500 uppercase tracking-wider">
                Text Complexity Deficit
              </span>
              <div className="my-3 flex items-center gap-2">
                {report.readingProfile.comprehensionDropOffIdentified ? (
                  <AlertTriangle className="w-8 h-8 text-rose-500 shrink-0" />
                ) : (
                  <Check className="w-8 h-8 text-emerald-500 shrink-0" />
                )}
                <span className={`text-2xl sm:text-3xl font-black ${
                  report.readingProfile.comprehensionDropOffIdentified ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                }`}>
                  {report.readingProfile.comprehensionDropOffIdentified ? 'Deficit Detected' : 'Stable'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                {report.readingProfile.comprehensionDropOffIdentified
                  ? 'Fails primarily on dense primary sources, not concepts'
                  : 'Consistent accuracy across sentence lengths'}
              </p>
            </div>

            {/* Testing Behavior Pacing */}
            <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
              <span className="text-sm font-mono font-bold text-stone-500 uppercase tracking-wider">
                Processing Pacing
              </span>
              <div className="my-3">
                <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-stone-900 dark:text-stone-100">
                  {report.readingProfile.avgReadingPacingSeconds}s
                </span>
                <span className="text-xs sm:text-sm text-stone-500 font-mono ml-1">avg / question</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                Focus: <strong className="capitalize">{report.behavioralInsights.staminaTrend}</strong> · {report.behavioralInsights.lifelineUsageCount} lifelines used
              </p>
            </div>
          </div>

          {/* Teacher Summary Narrative Card */}
          <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-8 sm:p-10 shadow-sm space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-stone-950 dark:text-stone-50 tracking-tight flex items-center gap-2">
              <Brain className="w-6 h-6 text-amber-500" />
              <span>Teacher Diagnostic Synthesis</span>
            </h2>
            <div className="space-y-2 text-base sm:text-lg text-stone-800 dark:text-stone-200 leading-relaxed">
              {report.readingProfile.observations.map((obs, idx) => (
                <p key={idx}>{obs}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: UNIT MASTERY BREAKDOWN                        */}
      {/* ======================================================== */}
      {activeTab === 'units' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(Object.keys(report.contentMastery) as UnitId[]).map((unitKey) => {
              const u = report.contentMastery[unitKey];
              return (
                <div 
                  key={unitKey}
                  className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500">
                        {unitKey.toUpperCase()}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-stone-950 dark:text-stone-50 tracking-tight">
                        {u.unitName}
                      </h3>
                    </div>
                    <span className={`text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl border-2 ${getStatusColor(u.status)}`}>
                      {u.status}
                    </span>
                  </div>

                  {u.status === 'Not Assessed' || u.attempted === 0 ? (
                    <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-dashed border-stone-300 dark:border-stone-700 text-stone-500 dark:text-stone-400 text-sm italic">
                      This epoch was not included in this student's targeted diagnostic session (e.g. transfer student catch-up on selected units).
                    </div>
                  ) : (
                    <>
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm sm:text-base font-bold font-mono">
                          <span>Mastery Score</span>
                          <span>{u.correct} of {u.attempted} ({u.percentage}%)</span>
                        </div>
                        <div className="w-full h-3.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden border border-stone-200 dark:border-stone-700">
                          <div 
                            className={`h-full transition-all duration-500 ${
                              u.percentage >= 75 ? 'bg-emerald-500' : u.percentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${u.percentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Strengths & Gaps */}
                      <div className="space-y-3 pt-2 text-sm sm:text-base border-t border-stone-100 dark:border-stone-800">
                        <div>
                          <strong className="text-emerald-700 dark:text-emerald-400 font-bold block mb-1">
                            Demonstrated Concepts:
                          </strong>
                          {u.strengths.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1 text-stone-700 dark:text-stone-300">
                              {u.strengths.map((str, idx) => (
                                <li key={idx}>{str}</li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-stone-400 italic">No mastered items in this diagnostic window</span>
                          )}
                        </div>

                        <div>
                          <strong className="text-rose-700 dark:text-rose-400 font-bold block mb-1">
                            Priority Learning Targets:
                          </strong>
                          {u.gaps.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1 text-stone-700 dark:text-stone-300">
                              {u.gaps.map((gap, idx) => (
                                <li key={idx}>{gap}</li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-emerald-600 italic">No persistent deficits detected</span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 3: READING & COGNITIVE SKILLS                    */}
      {/* ======================================================== */}
      {activeTab === 'reading' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
            <h3 className="text-xl sm:text-2xl font-black text-stone-950 dark:text-stone-50 tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-amber-500" />
              <span>Reading Load vs. Content Knowledge Discrepancy</span>
            </h3>

            <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 leading-relaxed">
              This diagnostic isolates whether student failure is driven by <strong>historical conceptual gaps</strong> or <strong>decoding and reading stamina deficits</strong>. When a student answers foundational Tier 1 and Tier 2 items accurately but drops significantly on Tier 3 primary sources with archaic syntax, the primary intervention needed is reading scaffolding, not content remediation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-3">
              <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                <span className="text-xs font-mono font-bold text-stone-500 uppercase block">Low Reading Demand Accuracy</span>
                <span className="text-4xl font-mono font-black text-emerald-600 dark:text-emerald-400 mt-2 block">
                  {report.readingProfile.lowDemandPct}%
                </span>
                <span className="text-xs text-stone-500 mt-1 block">Short, direct syntax questions</span>
              </div>

              <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                <span className="text-xs font-mono font-bold text-stone-500 uppercase block">High Reading Demand (Sources)</span>
                <span className="text-4xl font-mono font-black text-amber-600 dark:text-amber-400 mt-2 block">
                  {report.readingProfile.highDemandPct}%
                </span>
                <span className="text-xs text-stone-500 mt-1 block">Excerpts from Hobbes, Galileo, Locke</span>
              </div>

              <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                <span className="text-xs font-mono font-bold text-stone-500 uppercase block">Reading Stamina Pacing</span>
                <span className="text-4xl font-mono font-black text-indigo-600 dark:text-indigo-400 mt-2 block">
                  {report.readingProfile.avgReadingPacingSeconds}s
                </span>
                <span className="text-xs text-stone-500 mt-1 block">Average read + response time</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 4: TARGETED LEARNING SUPPORTS                    */}
      {/* ======================================================== */}
      {activeTab === 'iep' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
            <h3 className="text-xl sm:text-2xl font-black text-stone-950 dark:text-stone-50 tracking-tight flex items-center gap-2">
              <Brain className="w-6 h-6 text-amber-500" />
              <span>Recommended Classroom Accommodations & Strategies</span>
            </h3>

            <div className="space-y-4">
              {report.iepRecommendations.map((rec, idx) => (
                <div 
                  key={idx}
                  className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border-2 border-stone-200 dark:border-stone-700 space-y-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      {rec.category}
                    </span>
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      rec.priority === 'High' ? 'text-rose-600' : 'text-stone-500'
                    }`}>
                      {rec.priority} Priority
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-stone-950 dark:text-stone-50">
                    {rec.strategy}
                  </h4>
                  <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
                    {rec.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 5: QUESTION-BY-QUESTION LOG                     */}
      {/* ======================================================== */}
      {activeTab === 'log' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-stone-950 dark:text-stone-50 tracking-tight">
              Adaptive Response Audit Trail ({report.questionLog.length} Items)
            </h3>

            <div className="space-y-3">
              {report.questionLog.map((item, idx) => {
                const isExpanded = expandedLogId === item.questionId;
                const selectedOpt = item.question.options.find(o => o.id === item.selectedOptionId);
                const correctOpt = item.question.options.find(o => o.id === item.question.correctOptionId);

                return (
                  <div 
                    key={idx}
                    className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border-2 border-stone-200 dark:border-stone-700 transition-all"
                  >
                    <div 
                      onClick={() => setExpandedLogId(isExpanded ? null : item.questionId)}
                      className="flex items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                          item.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {item.isCorrect ? '✓' : '✗'}
                        </span>
                        <div>
                          <span className="font-bold text-stone-900 dark:text-stone-100 block text-base sm:text-lg">
                            Q{idx + 1}: {item.question.foundationalConcept}
                          </span>
                          <span className="text-xs sm:text-sm text-stone-500 font-mono">
                            {item.question.unitName} · Tier {item.tierAtTime} · {item.timeSpentSeconds}s read time
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {item.usedLifeline && (
                          <span className="text-xs font-mono font-bold px-2 py-1 bg-amber-100 text-amber-800 rounded-md">
                            50:50 Used
                          </span>
                        )}
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-stone-400" /> : <ChevronDown className="w-5 h-5 text-stone-400" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t-2 border-stone-200 dark:border-stone-700 text-sm sm:text-base space-y-3">
                        <p className="font-bold text-stone-900 dark:text-stone-100">
                          {item.question.questionText}
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className={`p-3 rounded-xl border-2 ${item.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'}`}>
                            <strong>Student Answer: </strong> {selectedOpt?.text || 'None'}
                          </div>
                          {!item.isCorrect && (
                            <div className="p-3 rounded-xl border-2 bg-emerald-50 border-emerald-300 text-emerald-950">
                              <strong>Correct Answer: </strong> {correctOpt?.text}
                            </div>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 italic">
                          <strong>Pedagogical Rationale: </strong> {item.question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
