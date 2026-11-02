import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const TEACHER_PASSCODE = process.env.TEACHER_PASSCODE || '1986';

app.use(express.json({ limit: '10mb' }));

const DATA_DIR = path.join(__dirname, 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(SUBMISSIONS_FILE)) {
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify([], null, 2), 'utf-8');
}

function readSubmissions(): any[] {
  try {
    const raw = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading submissions:', err);
    return [];
  }
}

function writeSubmissions(data: any[]): void {
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Verify Teacher Passcode API
app.post('/api/verify-passcode', (req, res) => {
  const { passcode } = req.body;
  if (passcode === TEACHER_PASSCODE) {
    return res.json({ success: true, authorized: true });
  }
  return res.status(401).json({ success: false, message: 'Invalid passcode' });
});

// Submit Student Report API (called from student device)
app.post('/api/submissions', (req, res) => {
  try {
    const report = req.body;
    if (!report || !report.studentName) {
      return res.status(400).json({ error: 'Missing student data' });
    }

    const submissions = readSubmissions();
    const id = report.id || `sub_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const newRecord = {
      ...report,
      id,
      submittedAt: new Date().toISOString(),
    };

    submissions.unshift(newRecord); // newest first
    writeSubmissions(submissions);

    return res.status(201).json({ success: true, id, message: 'Submission saved successfully' });
  } catch (err) {
    console.error('Failed to save submission:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// List Submissions Roster API (called from teacher dashboard)
app.get('/api/submissions', (_req, res) => {
  try {
    const submissions = readSubmissions();
    // Return summary items for quick roster table loading
    const summaries = submissions.map((sub: any) => ({
      id: sub.id,
      studentName: sub.studentName,
      completedAt: sub.completedAt || sub.submittedAt,
      submittedAt: sub.submittedAt,
      overallReadinessScore: sub.overallReadinessScore,
      readinessLevel: sub.readinessLevel,
      correctCount: sub.correctCount,
      totalQuestions: sub.totalQuestions,
      readingLexileEstimate: sub.readingProfile?.readingLexileEstimate || 'Unknown',
      avgReadingPacingSeconds: sub.readingProfile?.avgReadingPacingSeconds || 0,
      contentMastery: sub.contentMastery,
      lifelineUsageCount: sub.behavioralInsights?.lifelineUsageCount || 0,
      hintUsageCount: sub.behavioralInsights?.hintUsageCount || 0,
    }));
    return res.json(summaries);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to read submissions' });
  }
});

// Get Single Full Submission Detail
app.get('/api/submissions/:id', (req, res) => {
  try {
    const { id } = req.params;
    const submissions = readSubmissions();
    const found = submissions.find((s: any) => s.id === id);
    if (!found) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    return res.json(found);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch submission' });
  }
});

// Delete Submission
app.delete('/api/submissions/:id', (req, res) => {
  try {
    const { id } = req.params;
    let submissions = readSubmissions();
    submissions = submissions.filter((s: any) => s.id !== id);
    writeSubmissions(submissions);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete submission' });
  }
});

// Vite Middleware or Static Production Serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
