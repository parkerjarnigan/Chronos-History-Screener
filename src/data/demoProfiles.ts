import { DiagnosticReport, StudentAnswerRecord } from '../types/history';
import { QUESTION_BANK } from './questionBank';
import { AdaptiveEngine } from '../utils/adaptiveEngine';

export function getDemoReport(profileKey: string): DiagnosticReport {
  const engine = new AdaptiveEngine();

  if (profileKey === 'marcus') {
    // Marcus: 10th grade transfer student with reading comprehension deficit & IEP.
    // Answers low-reading recall questions correctly, but misses high-reading primary sources (Galileo, Hobbes, Berlin rules, Casana).
    // Uses 50:50 lifelines effectively.
    const marcusSequence = [
      { id: 'u1-t1-divine-right', pick: 'a', time: 14, lifeline: false, hint: false }, // correct
      { id: 'u1-t2-locke-rights', pick: 'a', time: 18, lifeline: true, hint: false }, // correct
      { id: 'u1-t3-galileo-excerpt', pick: 'b', time: 42, lifeline: false, hint: true }, // incorrect (reading drop-off)
      { id: 'u2-t1-resources-coal', pick: 'a', time: 11, lifeline: false, hint: false }, // correct
      { id: 'u2-t2-factory-act', pick: 'a', time: 21, lifeline: true, hint: false }, // correct
      { id: 'u2-t3-berlin-foundry-excerpt', pick: 'c', time: 48, lifeline: false, hint: true }, // incorrect (reading drop-off)
      { id: 'u3-t1-main-causes', pick: 'a', time: 15, lifeline: false, hint: false }, // correct
      { id: 'u3-t2-central-powers-geography', pick: 'a', time: 19, lifeline: true, hint: false }, // correct (strong map spatial)
      { id: 'u3-t3-german-general-quote', pick: 'c', time: 38, lifeline: false, hint: true }, // incorrect (reading drop-off)
      { id: 'u4-t1-hyperinflation', pick: 'a', time: 16, lifeline: false, hint: false }, // correct
      { id: 'u4-t2-appeasement-chamberlain', pick: 'a', time: 24, lifeline: true, hint: false }, // correct
      { id: 'u4-t3-ghetto-survivor-quote', pick: 'b', time: 51, lifeline: false, hint: true }, // incorrect (reading drop-off)
    ];

    marcusSequence.forEach(step => {
      const q = QUESTION_BANK.find(item => item.id === step.id);
      if (q) {
        engine.recordAnswer(q, step.pick, step.time, step.lifeline, step.hint, []);
      }
    });

    return engine.generateDiagnosticReport('Marcus (Transfer Student w/ Reading Support)');
  }

  if (profileKey === 'devon') {
    // Devon: Significant content gaps across all units, rapid guessing, low stamina
    const devonSequence = [
      { id: 'u1-t1-divine-right', pick: 'c', time: 6, lifeline: false, hint: false },
      { id: 'u1-t1-versailles', pick: 'b', time: 7, lifeline: false, hint: false },
      { id: 'u1-t1-bastille', pick: 'a', time: 10, lifeline: false, hint: false },
      { id: 'u2-t1-resources-coal', pick: 'b', time: 8, lifeline: false, hint: false },
      { id: 'u2-t1-tenements', pick: 'a', time: 9, lifeline: false, hint: false },
      { id: 'u2-t2-factors-production', pick: 'c', time: 5, lifeline: false, hint: false },
      { id: 'u3-t1-main-causes', pick: 'c', time: 8, lifeline: false, hint: false },
      { id: 'u3-t1-assassination-spark', pick: 'a', time: 12, lifeline: false, hint: false },
      { id: 'u3-t1-trench-conditions', pick: 'a', time: 7, lifeline: false, hint: false },
      { id: 'u4-t1-hyperinflation', pick: 'c', time: 6, lifeline: false, hint: false },
      { id: 'u4-t1-big-three', pick: 'b', time: 8, lifeline: false, hint: false },
      { id: 'u4-t1-blitzkrieg', pick: 'a', time: 9, lifeline: false, hint: false },
    ];

    devonSequence.forEach(step => {
      const q = QUESTION_BANK.find(item => item.id === step.id);
      if (q) {
        engine.recordAnswer(q, step.pick, step.time, step.lifeline, step.hint, []);
      }
    });

    return engine.generateDiagnosticReport('Devon (Significant Content Gaps)');
  }

  if (profileKey === 'elena') {
    // Elena: Good historical thinking and reading ability, but misses specific terminology (proletariat, hyperinflation, appeasement)
    const elenaSequence = [
      { id: 'u1-t1-divine-right', pick: 'a', time: 18, lifeline: false, hint: false },
      { id: 'u1-t2-locke-rights', pick: 'a', time: 22, lifeline: false, hint: false },
      { id: 'u1-t3-galileo-excerpt', pick: 'a', time: 35, lifeline: false, hint: false },
      { id: 'u2-t1-resources-coal', pick: 'a', time: 12, lifeline: false, hint: false },
      { id: 'u2-t2-marx-smith', pick: 'b', time: 26, lifeline: true, hint: true }, // vocabulary struggle
      { id: 'u2-t3-berlin-foundry-excerpt', pick: 'a', time: 32, lifeline: false, hint: false },
      { id: 'u3-t1-main-causes', pick: 'a', time: 15, lifeline: false, hint: false },
      { id: 'u3-t2-wilson-14-points', pick: 'b', time: 28, lifeline: false, hint: true }, // vocab struggle
      { id: 'u3-t3-chain-friendship-cartoon', pick: 'a', time: 30, lifeline: false, hint: false },
      { id: 'u4-t1-hyperinflation', pick: 'b', time: 20, lifeline: false, hint: false }, // vocab struggle
      { id: 'u4-t2-stalingrad-turning-point', pick: 'a', time: 24, lifeline: false, hint: false },
      { id: 'u4-t3-iron-curtain-quote', pick: 'a', time: 36, lifeline: false, hint: false },
    ];

    elenaSequence.forEach(step => {
      const q = QUESTION_BANK.find(item => item.id === step.id);
      if (q) {
        engine.recordAnswer(q, step.pick, step.time, step.lifeline, step.hint, []);
      }
    });

    return engine.generateDiagnosticReport('Elena (Vocabulary & Terminology Target)');
  }

  // Jordan: High readiness, excels across all tiers
  const jordanSequence = [
    { id: 'u1-t1-divine-right', pick: 'a', time: 12, lifeline: false, hint: false },
    { id: 'u1-t2-locke-rights', pick: 'a', time: 16, lifeline: false, hint: false },
    { id: 'u1-t3-galileo-excerpt', pick: 'a', time: 24, lifeline: false, hint: false },
    { id: 'u2-t2-factors-production', pick: 'a', time: 14, lifeline: false, hint: false },
    { id: 'u2-t3-berlin-foundry-excerpt', pick: 'a', time: 26, lifeline: false, hint: false },
    { id: 'u2-t3-social-darwinism', pick: 'a', time: 22, lifeline: false, hint: false },
    { id: 'u3-t2-russia-exit', pick: 'a', time: 18, lifeline: false, hint: false },
    { id: 'u3-t3-chain-friendship-cartoon', pick: 'a', time: 20, lifeline: false, hint: false },
    { id: 'u3-t3-versailles-guilt', pick: 'a', time: 25, lifeline: false, hint: false },
    { id: 'u4-t2-stalingrad-turning-point', pick: 'a', time: 19, lifeline: false, hint: false },
    { id: 'u4-t3-appeasement-cartoon', pick: 'a', time: 21, lifeline: false, hint: false },
    { id: 'u4-t3-iron-curtain-quote', pick: 'a', time: 28, lifeline: false, hint: false },
  ];

  jordanSequence.forEach(step => {
    const q = QUESTION_BANK.find(item => item.id === step.id);
    if (q) {
      engine.recordAnswer(q, step.pick, step.time, step.lifeline, step.hint, []);
    }
  });

  return engine.generateDiagnosticReport('Jordan (Course Ready / Proficient)');
}
