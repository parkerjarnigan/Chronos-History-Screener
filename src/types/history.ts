export type UnitId = 'unit1' | 'unit2' | 'unit3' | 'unit4';

export type DifficultyTier = 1 | 2 | 3; // 1: Foundational Recall, 2: Conceptual / Cause-Effect, 3: Analytical / Source

export type CognitiveSkill = 
  | 'recall' 
  | 'cause_effect' 
  | 'source_analysis' 
  | 'vocabulary' 
  | 'map_spatial' 
  | 'chronology';

export type ReadingDemand = 'low' | 'medium' | 'high';

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  unit: UnitId;
  unitName: string;
  tier: DifficultyTier;
  skill: CognitiveSkill;
  readingDemand: ReadingDemand;
  questionText: string;
  excerpt?: {
    author?: string;
    date?: string;
    sourceTitle?: string;
    text: string;
  };
  visualContext?: {
    type: 'cartoon' | 'map' | 'diagram' | 'data';
    imageUrl?: string;
    imageAlt?: string;
    visualId?: string;
    title: string;
    caption: string;
    details: string[];
  };
  options: QuestionOption[];
  correctOptionId: string;
  hint: string;
  explanation: string;
  foundationalConcept: string;
}

export interface StudentAnswerRecord {
  questionId: string;
  question: Question;
  selectedOptionId: string;
  isCorrect: boolean;
  tierAtTime: DifficultyTier;
  unit: UnitId;
  timeSpentSeconds: number;
  usedLifeline: boolean;
  usedHint: boolean;
  eliminatedOptionIds: string[];
}

export type ReadinessLevel = 
  | 'Substantial Gaps & High Support Needed'
  | 'Foundational Gaps / Tier 2 Intervention'
  | 'Approaching Grade Level / Moderate Scaffolding'
  | 'Course Ready / Proficient';

export interface IEPRecommendation {
  id: string;
  category: 'Reading & Literacy' | 'Content Processing' | 'Testing & Assessment' | 'Instructional Scaffolding';
  strategy: string;
  rationale: string;
  priority: 'High' | 'Medium' | 'Universal';
}

export interface DiagnosticReport {
  studentName: string;
  completedAt: string;
  totalQuestions: number;
  correctCount: number;
  overallReadinessScore: number; // 0 to 100
  readinessLevel: ReadinessLevel;
  contentMastery: Record<UnitId, {
    unitName: string;
    attempted: number;
    correct: number;
    percentage: number;
    status: 'Mastered' | 'Developing' | 'Needs Review' | 'Not Assessed';
    strengths: string[];
    gaps: string[];
  }>;
  assessedUnits?: UnitId[];
  readingProfile: {
    lowDemandPct: number;
    medDemandPct: number;
    highDemandPct: number;
    avgReadingPacingSeconds: number;
    readingLexileEstimate: 'Below Grade Level (6th-8th Grade)' | 'Approaching Grade Level (9th Grade)' | 'At Grade Level (10th+ Grade)';
    comprehensionDropOffIdentified: boolean;
    observations: string[];
  };
  skillBreakdown: Record<CognitiveSkill, {
    name: string;
    attempted: number;
    correct: number;
    percentage: number;
  }>;
  behavioralInsights: {
    lifelineUsageCount: number;
    hintUsageCount: number;
    staminaTrend: 'Maintained Focus' | 'Late Fatigue' | 'Rapid Guessing / Rushing';
    averageTimePerQuestion: number;
    selfAdvocacyScore: 'High' | 'Moderate' | 'Reluctant';
  };
  iepRecommendations: IEPRecommendation[];
  questionLog: StudentAnswerRecord[];
}
