# Cross-Device Teacher Results Storage & Submissions Roster

A persistent backend and teacher submissions roster allowing the teacher to view all student quiz results across any computer or Chromebook, with privacy protection preventing students from seeing other students' scores.

## User Review & Critical Decisions

> [!IMPORTANT]
> **Confirmed Requirements from User Turn:**
> 1. **Cross-Device Visibility:** Results must be viewable on the teacher's computer even when students take the quiz on separate Chromebooks/computers.
> 2. **Strict Student Privacy:** Students MUST NOT see any other students' results on their devices.
> 3. **Saved Submissions Log:** The Teacher Dashboard will feature a searchable, sortable submissions roster with dates, student names, scores, and readiness indices.

- **Storage Architecture:** Full-stack Express backend (`server.ts`) with disk persistence (`data/submissions.json`), providing instant cross-device sharing on your app URL without requiring third-party cloud account logins.
- **Teacher Privacy Gate:** A 4-digit Teacher Passcode (default: `1986` or customizable) protects the Teacher Report and Submissions Roster, ensuring students on shared classroom devices cannot view peer assessments.

---

## 1. Overview & Core Concept

- **What It Does**: When a student clicks "Submit results to teacher", their complete diagnostic assessment (readiness index, Lexile estimate, unit mastery, and IEP strategies) is transmitted to the app's persistent backend. The teacher can open the Teacher Dashboard from any device and review the full class submission log.
- **Target Audience / Persona**: High school World History teacher monitoring transfer students and general class readiness, reviewing longitudinal IEP/SST diagnostic data.
- **Key Value**: Immediate, effortless data collection across 1:1 student devices without paperwork, email attachments, or privacy leaks.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Student Completion Flow (Privacy Preserved)**:
   - Student completes the 10–14 question adaptive quiz.
   - The student sees only their own score and an encouraging completion message.
   - Student clicks **"Submit results to teacher"**.
   - Confirmation displays: *"Results Successfully Submitted to Teacher!"*
   - Student has no access to any list of other students or past records.

2. **Teacher Review Flow (Any Device)**:
   - Teacher opens the app and clicks **"Teacher Report"** in the top bar.
   - A clean passcode prompt requests the teacher PIN (prevents student snooping).
   - Once unlocked, the teacher sees the **Submissions Roster Table**:
     - Columns: Date & Time, Student Name, Questions Completed, Score, Readiness Index, Lexile Range, and Quick Actions.
     - Search & filter by student name or date.
     - Clicking **"View Report"** opens the comprehensive diagnostic view for that specific student.
     - Option to **"Export Roster to CSV"** or **"Print Roster"**.

### Visual Styling & Layout
- **Submissions Roster**: Clean, tabular data layout adhering to high-density typography with subtle alternating stone row backgrounds, clear status indicators (Mastered, Developing, Needs Intervention), and quick action buttons.
- **Text Scaling**: Maintained 100% enlarged typography across all views for accessibility.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Stack Express Backend vs. Client Storage**
  - *Chosen Approach*: Implement an Express backend (`server.ts`) mounting `vite.middlewares` with persistent JSON data storage in `data/submissions.json`.
  - *Why*: Solves the cross-device requirement instantly. Students submitting on Chromebook A will immediately have their results visible to the teacher on Computer B via the web app URL.
  - *Alternatives Considered*: Browser `localStorage` was rejected because it only saves data on the individual student's machine and cannot be seen from the teacher's computer.
- **Decision 2: Teacher Security Access Gate**
  - *Chosen Approach*: Lightweight Teacher Passcode (`1986` or teacher-set PIN) with a "Remember this teacher device" toggle.
  - *Why*: Guarantees student privacy in a shared computer lab or classroom setting where students might click the "Teacher Report" button.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│                   Student Device                       │
│  - Takes adaptive quiz                                 │
│  - Clicks "Submit results to teacher"                  │
│  - POST /api/submissions (Payload: DiagnosticReport)   │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│              Full-Stack Express Server                 │
│                 (server.ts on Port 3000)               │
│  - Handles POST /api/submissions                       │
│  - Handles GET  /api/submissions (Teacher list)        │
│  - Handles GET  /api/submissions/:id (Single report)   │
│  - Writes / reads from /data/submissions.json          │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                   Teacher Device                       │
│  - Opens app from any computer                         │
│  - Enters Teacher Passcode                             │
│  - GET /api/submissions fetches all class records      │
│  - Submissions Roster table with search, sorting, CSV  │
│  - Drills into individual full student IEP reports     │
└────────────────────────────────────────────────────────┘
```

### Proposed Changes:
1. **`server.ts`**: Create Express backend with Vite middleware in development mode and API routes (`/api/submissions`).
2. **`package.json`**: Update `"dev": "tsx server.ts"` to run full-stack backend.
3. **`src/services/api.ts`**: API client for posting student results and fetching the submissions roster.
4. **`src/components/TeacherDashboard.tsx`**: Add the **Submissions Roster** tab, teacher PIN modal, and individual record viewer.
5. **`src/components/StudentVictoryModal.tsx`**: Hook up "Submit results to teacher" to post live to `/api/submissions`.
