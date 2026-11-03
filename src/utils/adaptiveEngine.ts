import { 
  Question, 
  UnitId, 
  DifficultyTier, 
  StudentAnswerRecord, 
  DiagnosticReport, 
  ReadinessLevel, 
  IEPRecommendation,
  CognitiveSkill
} from '../types/history';
import { QUESTION_BANK } from '../data/questionBank';

export class AdaptiveEngine {
  private history: StudentAnswerRecord[] = [];
  private currentTier: DifficultyTier = 1;
  private readonly selectedUnits: UnitId[];
  private readonly targetQuestionCount: number;
  private askedQuestionIds: Set<string> = new Set();

  constructor(selectedUnits: UnitId[] = ['unit1', 'unit2', 'unit3', 'unit4']) {
    this.selectedUnits = selectedUnits && selectedUnits.length > 0 
      ? selectedUnits 
      : ['unit1', 'unit2', 'unit3', 'unit4'];
    this.currentTier = 1;

    // Proportional session length:
    // 1 unit: 6 questions
    // 2 units: 8 questions
    // 3 units: 10 questions
    // 4 units: 12 questions (up to 14 with calibration)
    if (this.selectedUnits.length === 1) {
      this.targetQuestionCount = 6;
    } else if (this.selectedUnits.length === 2) {
      this.targetQuestionCount = 8;
    } else if (this.selectedUnits.length === 3) {
      this.targetQuestionCount = 10;
    } else {
      this.targetQuestionCount = 12;
    }
  }

  public getHistory(): StudentAnswerRecord[] {
    return [...this.history];
  }

  public getAskedCount(): number {
    return this.history.length;
  }

  public getCurrentTier(): DifficultyTier {
    return this.currentTier;
  }

  public getTargetQuestionCount(): number {
    return this.targetQuestionCount;
  }

  public getSelectedUnits(): UnitId[] {
    return [...this.selectedUnits];
  }

  public getTargetUnit(): UnitId {
    // Count how many questions have been asked for each selected unit so far
    const unitCounts: Record<UnitId, number> = {
      unit1: 0,
      unit2: 0,
      unit3: 0,
      unit4: 0,
    };
    this.history.forEach(rec => {
      unitCounts[rec.unit] = (unitCounts[rec.unit] || 0) + 1;
    });

    // Baseline quota per selected unit
    const basePerUnit = Math.floor(this.targetQuestionCount / this.selectedUnits.length);
    
    // Find the first selected unit that has not met its baseline quota
    for (const unit of this.selectedUnits) {
      if (unitCounts[unit] < basePerUnit) {
        return unit;
      }
    }

    // Once all have reached base quota, target the selected unit with lowest accuracy (calibration)
    return this.getCalibrationUnit();
  }

  private getCalibrationUnit(): UnitId {
    const unitScores: Record<UnitId, { correct: number; total: number }> = {
      unit1: { correct: 0, total: 0 },
      unit2: { correct: 0, total: 0 },
      unit3: { correct: 0, total: 0 },
      unit4: { correct: 0, total: 0 },
    };

    this.history.forEach(rec => {
      unitScores[rec.unit].total += 1;
      if (rec.isCorrect) unitScores[rec.unit].correct += 1;
    });

    let lowestUnit: UnitId = this.selectedUnits[0];
    let lowestRatio = 1.1;

    for (const unit of this.selectedUnits) {
      const stats = unitScores[unit];
      const ratio = stats.total > 0 ? stats.correct / stats.total : 0;
      if (ratio < lowestRatio) {
        lowestRatio = ratio;
        lowestUnit = unit;
      }
    }

    return lowestUnit;
  }

  public getNextQuestion(): Question | null {
    const qCount = this.history.length;
    // Hard ceiling
    if (qCount >= Math.min(14, this.targetQuestionCount + 2)) return null;

    if (this.shouldFinish()) return null;

    const targetUnit = this.getTargetUnit();
    const available = QUESTION_BANK.filter(
      q => q.unit === targetUnit && !this.askedQuestionIds.has(q.id)
    );

    if (available.length === 0) {
      // Fallback to any unasked question within the SELECTED units
      const anyAvailableInUnits = QUESTION_BANK.filter(
        q => this.selectedUnits.includes(q.unit) && !this.askedQuestionIds.has(q.id)
      );
      if (anyAvailableInUnits.length === 0) return null;
      return anyAvailableInUnits[0];
    }

    // Try to find a question at the current target tier
    let candidate = available.find(q => q.tier === this.currentTier);

    // If no question at exact tier, try adjacent tier
    if (!candidate) {
      candidate = available.find(q => Math.abs(q.tier - this.currentTier) === 1) || available[0];
    }

    return candidate;
  }

  public recordAnswer(
    question: Question,
    selectedOptionId: string,
    timeSpentSeconds: number,
    usedLifeline: boolean,
    usedHint: boolean,
    eliminatedOptionIds: string[]
  ): StudentAnswerRecord {
    const isCorrect = selectedOptionId === question.correctOptionId;
    this.askedQuestionIds.add(question.id);

    const record: StudentAnswerRecord = {
      questionId: question.id,
      question,
      selectedOptionId,
      isCorrect,
      tierAtTime: this.currentTier,
      unit: question.unit,
      timeSpentSeconds,
      usedLifeline,
      usedHint,
      eliminatedOptionIds,
    };

    this.history.push(record);

    // Adaptive adjustment for next question:
    if (isCorrect) {
      if (this.currentTier === 1) {
        this.currentTier = 2;
      } else if (this.currentTier === 2) {
        this.currentTier = 3;
      }
    } else {
      if (this.currentTier === 3) {
        this.currentTier = 2;
      } else if (this.currentTier === 2) {
        this.currentTier = 1;
      }
    }

    return record;
  }

  public shouldFinish(): boolean {
    const count = this.history.length;
    // If we've reached max cap beyond target
    if (count >= this.targetQuestionCount + 2) return true;
    
    // If target question count is reached
    if (count >= this.targetQuestionCount) {
      // Ensure all selected units have received at least 1 question
      const unitCounts: Record<string, number> = {};
      this.history.forEach(h => {
        unitCounts[h.unit] = (unitCounts[h.unit] || 0) + 1;
      });
      const allSelectedTouched = this.selectedUnits.every(u => (unitCounts[u] || 0) >= 1);
      if (allSelectedTouched) {
        return true;
      }
    }
    return false;
  }

  public generateDiagnosticReport(studentName: string = 'Alex'): DiagnosticReport {
    const totalQuestions = this.history.length;
    const correctCount = this.history.filter(h => h.isCorrect).length;

    // 1. Content Mastery by Unit
    const unitNames: Record<UnitId, string> = {
      unit1: 'Unit 1: Absolutism, Enlightenment & Revolutions',
      unit2: 'Unit 2: Industrial Revolution & Social Impact',
      unit3: 'Unit 3: WWI, East Asia & Global Imperialism',
      unit4: 'Unit 4: Interwar Years & World War II',
    };

    const contentMastery: DiagnosticReport['contentMastery'] = {
      unit1: { unitName: unitNames.unit1, attempted: 0, correct: 0, percentage: 0, status: 'Needs Review', strengths: [], gaps: [] },
      unit2: { unitName: unitNames.unit2, attempted: 0, correct: 0, percentage: 0, status: 'Needs Review', strengths: [], gaps: [] },
      unit3: { unitName: unitNames.unit3, attempted: 0, correct: 0, percentage: 0, status: 'Needs Review', strengths: [], gaps: [] },
      unit4: { unitName: unitNames.unit4, attempted: 0, correct: 0, percentage: 0, status: 'Needs Review', strengths: [], gaps: [] },
    };

    this.history.forEach(record => {
      const u = record.unit;
      contentMastery[u].attempted += 1;
      if (record.isCorrect) {
        contentMastery[u].correct += 1;
        contentMastery[u].strengths.push(record.question.foundationalConcept);
      } else {
        contentMastery[u].gaps.push(record.question.foundationalConcept);
      }
    });

    for (const key of ['unit1', 'unit2', 'unit3', 'unit4'] as UnitId[]) {
      const u = contentMastery[key];
      if (!this.selectedUnits.includes(key)) {
        u.status = 'Not Assessed';
        u.percentage = 0;
      } else {
        u.percentage = u.attempted > 0 ? Math.round((u.correct / u.attempted) * 100) : 0;
        if (u.percentage >= 70) u.status = 'Mastered';
        else if (u.percentage >= 40) u.status = 'Developing';
        else u.status = 'Needs Review';
      }
    }

    // 2. Reading Profile & Lexile Resilience
    let lowCount = 0; let lowCorrect = 0;
    let medCount = 0; let medCorrect = 0;
    let highCount = 0; let highCorrect = 0;
    let totalTime = 0;

    this.history.forEach(rec => {
      totalTime += rec.timeSpentSeconds;
      if (rec.question.readingDemand === 'low') {
        lowCount++;
        if (rec.isCorrect) lowCorrect++;
      } else if (rec.question.readingDemand === 'medium') {
        medCount++;
        if (rec.isCorrect) medCorrect++;
      } else if (rec.question.readingDemand === 'high') {
        highCount++;
        if (rec.isCorrect) highCorrect++;
      }
    });

    const lowPct = lowCount > 0 ? Math.round((lowCorrect / lowCount) * 100) : 100;
    const medPct = medCount > 0 ? Math.round((medCorrect / medCount) * 100) : 0;
    const highPct = highCount > 0 ? Math.round((highCorrect / highCount) * 100) : 0;
    const avgPacing = totalQuestions > 0 ? Math.round(totalTime / totalQuestions) : 0;

    // Detect drop-off: high accuracy on low-reading items, but severe drop on medium/high
    const comprehensionDropOffIdentified = lowPct - highPct >= 35 || (lowPct >= 70 && highPct <= 30);

    let readingLexileEstimate: DiagnosticReport['readingProfile']['readingLexileEstimate'] = 'At Grade Level (10th+ Grade)';
    const readingObservations: string[] = [];

    if (comprehensionDropOffIdentified) {
      readingLexileEstimate = 'Below Grade Level (6th-8th Grade)';
      readingObservations.push('Significant drop in accuracy observed when questions included dense primary source excerpts or multi-clause sentence structures.');
      readingObservations.push('Student demonstrated solid grasp on straightforward factual recall, indicating that content confusion may actually stem from text decoding fatigue.');
    } else if (highPct < 60 && medPct >= 65) {
      readingLexileEstimate = 'Approaching Grade Level (9th Grade)';
      readingObservations.push('Capable of processing standard 10th-grade prompts, but struggled with archaic vocabulary in 17th/18th-century primary documents (e.g., Galileo/Hobbes).');
    } else {
      readingLexileEstimate = 'At Grade Level (10th+ Grade)';
      readingObservations.push('Demonstrates fluent comprehension across varied textual complexities, including primary sources and multi-step analytical prompts.');
    }

    if (avgPacing < 10) {
      readingObservations.push('Pacing was rapid (<10s per item), which may indicate impulsive guessing or anxiety under text-heavy prompts.');
    } else if (avgPacing > 45) {
      readingObservations.push('Deliberate and thoughtful pacing (>45s per item), showing effortful reading processing.');
    }

    // 3. Cognitive Skill Breakdown
    const skillNames: Record<CognitiveSkill, string> = {
      recall: 'Factual Recall & Basic Knowledge',
      cause_effect: 'Cause & Effect Reasoning',
      source_analysis: 'Primary Source & Document Analysis',
      vocabulary: 'Historical Terminology & Vocabulary',
      map_spatial: 'Spatial & Map Interpretation',
      chronology: 'Chronology & Historical Sequence',
    };

    const skillBreakdown: DiagnosticReport['skillBreakdown'] = {
      recall: { name: skillNames.recall, attempted: 0, correct: 0, percentage: 0 },
      cause_effect: { name: skillNames.cause_effect, attempted: 0, correct: 0, percentage: 0 },
      source_analysis: { name: skillNames.source_analysis, attempted: 0, correct: 0, percentage: 0 },
      vocabulary: { name: skillNames.vocabulary, attempted: 0, correct: 0, percentage: 0 },
      map_spatial: { name: skillNames.map_spatial, attempted: 0, correct: 0, percentage: 0 },
      chronology: { name: skillNames.chronology, attempted: 0, correct: 0, percentage: 0 },
    };

    this.history.forEach(rec => {
      const s = rec.question.skill;
      if (skillBreakdown[s]) {
        skillBreakdown[s].attempted += 1;
        if (rec.isCorrect) skillBreakdown[s].correct += 1;
      }
    });

    (Object.keys(skillBreakdown) as CognitiveSkill[]).forEach(s => {
      const item = skillBreakdown[s];
      item.percentage = item.attempted > 0 ? Math.round((item.correct / item.attempted) * 100) : 0;
    });

    // 4. Behavioral Insights
    const lifelineCount = this.history.filter(h => h.usedLifeline).length;
    const hintCount = this.history.filter(h => h.usedHint).length;

    // Check stamina (first half vs second half)
    const midPoint = Math.floor(totalQuestions / 2);
    const firstHalf = this.history.slice(0, midPoint);
    const secondHalf = this.history.slice(midPoint);
    const firstHalfAcc = firstHalf.length > 0 ? firstHalf.filter(h => h.isCorrect).length / firstHalf.length : 0;
    const secondHalfAcc = secondHalf.length > 0 ? secondHalf.filter(h => h.isCorrect).length / secondHalf.length : 0;

    let staminaTrend: DiagnosticReport['behavioralInsights']['staminaTrend'] = 'Maintained Focus';
    if (firstHalfAcc - secondHalfAcc >= 0.35) {
      staminaTrend = 'Late Fatigue';
    } else if (avgPacing < 10) {
      staminaTrend = 'Rapid Guessing / Rushing';
    }

    let selfAdvocacyScore: DiagnosticReport['behavioralInsights']['selfAdvocacyScore'] = 'Moderate';
    if (lifelineCount + hintCount >= 4) {
      selfAdvocacyScore = 'High';
    } else if (lifelineCount + hintCount === 0 && correctCount < totalQuestions * 0.5) {
      selfAdvocacyScore = 'Reluctant';
    }

    // 5. Overall Readiness Score & Level
    // Weighted formula: Content Accuracy (45%) + Tier Weight (25%) + Reading Resilience (20%) + Self Advocacy (10%)
    const rawAcc = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const avgTier = this.history.reduce((acc, h) => acc + h.tierAtTime, 0) / (totalQuestions || 1);
    const tierBonus = (avgTier / 3) * 100;
    const readingScore = (lowPct * 0.3 + medPct * 0.4 + highPct * 0.3);
    const advocacyBonus = selfAdvocacyScore === 'High' ? 85 : selfAdvocacyScore === 'Moderate' ? 70 : 50;

    const overallReadinessScore = Math.min(100, Math.max(10, Math.round(
      rawAcc * 0.40 + tierBonus * 0.25 + readingScore * 0.25 + advocacyBonus * 0.10
    )));

    let readinessLevel: ReadinessLevel;
    if (overallReadinessScore >= 80) {
      readinessLevel = 'Course Ready / Proficient';
    } else if (overallReadinessScore >= 64) {
      readinessLevel = 'Approaching Grade Level / Moderate Scaffolding';
    } else if (overallReadinessScore >= 45) {
      readinessLevel = 'Foundational Gaps / Tier 2 Intervention';
    } else {
      readinessLevel = 'Substantial Gaps & High Support Needed';
    }

    // 6. Actionable IEP Recommendations
    const iepRecommendations: IEPRecommendation[] = [];

    // Universal recommendation
    iepRecommendations.push({
      id: 'iep-untimed',
      category: 'Testing & Assessment',
      strategy: 'Extended Time & Untimed Formative Environments',
      rationale: 'Student demonstrated improved engagement when free from countdown timers; continue this accommodation on standard class checks.',
      priority: 'Universal'
    });

    if (comprehensionDropOffIdentified || readingLexileEstimate !== 'At Grade Level (10th+ Grade)') {
      iepRecommendations.push({
        id: 'iep-reading-chunk',
        category: 'Reading & Literacy',
        strategy: 'Text Chunking with Visual Guided Reading Stops',
        rationale: 'Performance drops sharply on passages exceeding 3 sentences. Break 10th-grade primary sources into short paragraphs paired with marginal glossaries.',
        priority: 'High'
      });
      iepRecommendations.push({
        id: 'iep-audio-support',
        category: 'Reading & Literacy',
        strategy: 'Digital Text-to-Speech (TTS) & Read-Aloud Support',
        rationale: 'Audio scaffolding bypasses decoding fatigue, allowing the student to demonstrate conceptual comprehension without getting stalled by academic prose.',
        priority: 'High'
      });
    }

    if (lifelineCount > 0 || readinessLevel.includes('Gaps')) {
      iepRecommendations.push({
        id: 'iep-distractors',
        category: 'Testing & Assessment',
        strategy: 'Reduced Distractor Options (3 Choices Instead of 4)',
        rationale: 'Student utilized the 50:50 distractor lifeline effectively to narrow options and isolate logical historical connections.',
        priority: 'High'
      });
    }

    if (skillBreakdown.source_analysis.percentage < 55) {
      iepRecommendations.push({
        id: 'iep-graphic-organizers',
        category: 'Instructional Scaffolding',
        strategy: 'Structured Primary Source Analyzing Tool (SOAPSTone / HIPP)',
        rationale: 'Needs guided scaffolding when analyzing historical point-of-view, intended audience, and context rather than unprompted excerpt reading.',
        priority: 'Medium'
      });
    }

    if (skillBreakdown.vocabulary.percentage < 60) {
      iepRecommendations.push({
        id: 'iep-vocab-cards',
        category: 'Content Processing',
        strategy: 'Illustrated Vocabulary Cards (Frayer Model)',
        rationale: 'Key conceptual terms (e.g. Absolutism, Proletariat, Hyperinflation, Appeasement) require concrete visual anchors and non-examples.',
        priority: 'Medium'
      });
    }

    if (skillBreakdown.map_spatial.percentage >= 70) {
      iepRecommendations.push({
        id: 'iep-visual-strength',
        category: 'Content Processing',
        strategy: 'Leverage Strong Visual & Spatial Reasoning as Entry Points',
        rationale: 'Student showed above-average aptitude on map and visual diagram items; use maps and infographics as foundational hooks for new units.',
        priority: 'Medium'
      });
    }

    return {
      studentName,
      completedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      totalQuestions,
      correctCount,
      overallReadinessScore,
      readinessLevel,
      contentMastery,
      assessedUnits: [...this.selectedUnits],
      readingProfile: {
        lowDemandPct: lowPct,
        medDemandPct: medPct,
        highDemandPct: highPct,
        avgReadingPacingSeconds: avgPacing,
        readingLexileEstimate,
        comprehensionDropOffIdentified,
        observations: readingObservations,
      },
      skillBreakdown,
      behavioralInsights: {
        lifelineUsageCount: lifelineCount,
        hintUsageCount: hintCount,
        staminaTrend,
        averageTimePerQuestion: avgPacing,
        selfAdvocacyScore,
      },
      iepRecommendations,
      questionLog: [...this.history],
    };
  }
}
