# Implementation Plan: Firebase Firestore Integration for GitHub Pages

Connect Firebase Firestore so the app can be hosted completely statically on **GitHub Pages** while preserving **cross-device student submissions** and teacher dashboard results viewing across different computers.

---

## 1. Objectives & Architectural Shift
- **Static Hosting Compatibility**: GitHub Pages only serves static files (HTML/CSS/JS). By switching storage from local server disk (`server.ts` + `/data/submissions.json`) to **Firebase Firestore**, any device running the GitHub Pages link can write submissions and read teacher reports directly through the client SDK.
- **Student Privacy & Cross-Device Access**: 
  - Students on individual Chromebooks or laptops submit their diagnostic completion data directly to Firestore.
  - Students cannot read or inspect other students' submissions.
  - Teachers on their own computer unlock the full submissions log with passcode **`1986`**.
- **GitHub Pages Asset Path Compatibility**: Configure Vite base path to relative (`./`) so assets, cartoons, and sounds resolve cleanly whether hosted on a custom domain or a GitHub repository subpath (e.g., `https://<username>.github.io/chronos-arcade/`).

---

## 2. Proposed Changes & Steps

### Step 1: Firebase Provisioning & UI Confirmation
- Trigger the interactive Firebase setup UI (`show_aistudio_ui` with `firebase_setup`) to provision Firestore in your Google Cloud / Firebase project.
- Once accepted, verify TOS and execute `ProvisionFirebase` RPC for the `web` platform.

### Step 2: Firestore Database Architecture & Security Rules
- **Collection**: `submissions`
  - Document ID: Auto-generated submission ID.
  - Document Fields: `studentName`, `timestamp`, `score`, `questionsAnswered`, `questionsMastered`, `readinessIndex`, `lexileEstimate`, `report` (full diagnostic payload), `unitMastery`.
- **Security Rules (`firestore.rules`)**:
  - Allow `create` for student submissions (write-only for students).
  - Gated / protected `read` access for dashboard queries.
  - Deploy rules via `DeployRules` RPC.

### Step 3: Frontend Firebase Client Integration
- Install `firebase` client SDK.
- Create `/src/services/firebase.ts` to initialize Firebase App and Firestore using `firebase-applet-config.json` (with graceful fallback if offline or local).
- Update `/src/services/api.ts` to:
  - Prefer Firestore for saving submissions (`submitStudentReport`) and fetching roster (`fetchSubmissionsList`, `fetchSubmissionDetail`, `deleteSubmission`).
  - Seamlessly fall back to local Express API if running in local development mode without Firebase.

### Step 4: GitHub Pages Build Configuration & Export
- In `vite.config.ts`, set `base: './'` so static bundle assets, images, and audio load seamlessly on GitHub Pages repository paths.
- Add GitHub Pages deployment instructions and a sample GitHub Actions workflow (`.github/workflows/deploy.yml`) to automatically build and deploy to GitHub Pages on every push.

---

## 3. Verification Plan
1. **Compilation & Linting**: Run `lint_applet` and `compile_applet` to ensure zero TypeScript errors with the Firebase SDK.
2. **Submission Flow Test**: Simulate a student gameplay completion and verify submission persists in Firestore.
3. **Teacher Dashboard Verification**: Verify that the Teacher Dashboard with passcode `1986` displays the submission roster across devices with full diagnostic reports and CSV export.
4. **Static Build Check**: Verify `npm run build` generates a standalone `dist/` folder compatible with GitHub Pages.
