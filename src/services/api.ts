import { DiagnosticReport } from '../types/history';

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
  try {
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.error || 'Failed to submit' };
    }
    const data = await res.json();
    return { success: true, id: data.id };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' };
  }
}

export async function fetchSubmissionsList(): Promise<SubmissionSummary[]> {
  try {
    const res = await fetch('/api/submissions');
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error('Error fetching submissions:', err);
    return [];
  }
}

export async function fetchSubmissionDetail(id: string): Promise<DiagnosticReport | null> {
  try {
    const res = await fetch(`/api/submissions/${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Error fetching submission detail:', err);
    return null;
  }
}

export async function deleteSubmission(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/submissions/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch (err) {
    console.error('Error deleting submission:', err);
    return false;
  }
}

export async function verifyTeacherPasscode(passcode: string): Promise<boolean> {
  // Direct client check fallback + server check
  if (passcode.trim() === '1986') {
    return true;
  }
  try {
    const res = await fetch('/api/verify-passcode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode }),
    });
    const data = await res.json();
    return data.authorized === true;
  } catch (err) {
    console.error('Error verifying passcode on server:', err);
    return passcode.trim() === '1986';
  }
}
