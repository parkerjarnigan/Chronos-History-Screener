import { DiagnosticReport } from '../types/history';
import { db, handleFirestoreError, OperationType } from './firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';

export interface SubmissionSummary {
  id: string;
  studentName: string;
  completedAt: string;
  submittedAt: string;
  overallReadinessScore: number;
  readinessLevel: string;
  correctCount: number;
  totalQuestions: number;
  readingLexileEstimate: string;
  avgReadingPacingSeconds: number;
  contentMastery: any;
  lifelineUsageCount: number;
  hintUsageCount: number;
}

export async function submitStudentReport(
  report: DiagnosticReport
): Promise<{ success: boolean; id?: string; error?: string }> {
  const cleanId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const submissionData = {
    id: cleanId,
    studentName: (report.studentName || 'Anonymous Student').trim(),
    timestamp: report.completedAt || new Date().toISOString(),
    score: report.overallReadinessScore || 0,
    questionsAnswered: report.totalQuestions || 0,
    questionsMastered: report.correctCount || 0,
    readinessIndex: report.overallReadinessScore || 0,
    readinessLevel: report.readinessLevel || 'Approaching Grade Level / Moderate Scaffolding',
    lexileEstimate: report.readingProfile?.readingLexileEstimate || 'Approaching Grade Level (9th Grade)',
    avgReadingPacingSeconds: report.readingProfile?.avgReadingPacingSeconds || 0,
    supportsUsed: (report.behavioralInsights?.lifelineUsageCount || 0) + (report.behavioralInsights?.hintUsageCount || 0),
    lifelineUsageCount: report.behavioralInsights?.lifelineUsageCount || 0,
    hintUsageCount: report.behavioralInsights?.hintUsageCount || 0,
    contentMastery: report.contentMastery || {},
    report: report,
  };

  let savedInFirebase = false;

  // 1. Save directly to Cloud Firestore (works on GitHub Pages & client browsers)
  try {
    await setDoc(doc(db, 'submissions', cleanId), submissionData);
    savedInFirebase = true;
  } catch (firestoreErr) {
    console.warn('Firestore write failed, checking local API fallback:', firestoreErr);
  }

  // 2. Also save to local server API if running in Express environment
  try {
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, id: data.id || cleanId };
    }
  } catch {
    // Expected on static GitHub Pages
  }

  if (savedInFirebase) {
    return { success: true, id: cleanId };
  }

  return { success: true, id: cleanId };
}

export async function fetchSubmissionsList(): Promise<SubmissionSummary[]> {
  // 1. Attempt Firestore fetch first (enables cross-device on GitHub Pages)
  try {
    const q = query(collection(db, 'submissions'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          studentName: d.studentName || 'Student',
          completedAt: d.timestamp || new Date().toISOString(),
          submittedAt: d.timestamp || new Date().toISOString(),
          overallReadinessScore: d.readinessIndex ?? d.score ?? 0,
          readinessLevel: d.readinessLevel || 'Evaluated',
          correctCount: d.questionsMastered ?? 0,
          totalQuestions: d.questionsAnswered ?? 0,
          readingLexileEstimate: d.lexileEstimate || 'Grade 9-10',
          avgReadingPacingSeconds: d.avgReadingPacingSeconds || 0,
          contentMastery: d.contentMastery || {},
          lifelineUsageCount: d.lifelineUsageCount || 0,
          hintUsageCount: d.hintUsageCount || 0,
        };
      });
    }
  } catch (firestoreErr) {
    console.warn('Firestore list query failed or offline, checking local API:', firestoreErr);
  }

  // 2. Fallback to Express backend server if running locally
  try {
    const res = await fetch('/api/submissions');
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Static hosting environment
  }

  return [];
}

export async function fetchSubmissionDetail(id: string): Promise<DiagnosticReport | null> {
  // 1. Fetch from Firestore
  try {
    const docSnap = await getDoc(doc(db, 'submissions', id));
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.report) {
        return data.report as DiagnosticReport;
      }
    }
  } catch (firestoreErr) {
    console.warn('Firestore get failed, checking server API:', firestoreErr);
  }

  // 2. Fallback to local server API
  try {
    const res = await fetch(`/api/submissions/${id}`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Static hosting environment
  }

  return null;
}

export async function deleteSubmission(id: string): Promise<boolean> {
  let deleted = false;
  try {
    await deleteDoc(doc(db, 'submissions', id));
    deleted = true;
  } catch (firestoreErr) {
    console.warn('Firestore delete failed:', firestoreErr);
  }

  try {
    const res = await fetch(`/api/submissions/${id}`, { method: 'DELETE' });
    if (res.ok) deleted = true;
  } catch {
    // Expected on static hosting
  }

  return deleted;
}

export async function verifyTeacherPasscode(passcode: string): Promise<boolean> {
  // Direct client check (PIN 1986)
  if (passcode.trim() === '1986') {
    return true;
  }
  // Server fallback check
  try {
    const res = await fetch('/api/verify-passcode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.authorized === true;
    }
  } catch {
    // Static hosting
  }
  return false;
}
