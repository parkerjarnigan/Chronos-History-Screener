# Chronos Arcade: 10th Grade World History Adaptive Screener

An adaptive review game and diagnostic screener designed for 10th-grade World History educators. **Chronos Arcade** provides an engaging, arcade-style review quest for students while delivering deep pedagogical diagnostics for teachers to evaluate content knowledge, reading comprehension drop-offs, and IEP/SST readiness.

---

## 🎯 Purpose & Pedagogical Need

When high school students—especially transfer students, English Language Learners (ELL), or students with IEPs—struggle in 10th-grade World History, teachers often ask:
> *Does this student lack foundational historical knowledge, or are they struggling with the high reading demand and archaic syntax of primary sources?*

**Chronos Arcade** solves this problem by pairing an adaptive testing engine with a diagnostic framework that:
1. **Differentiates Content Knowledge from Reading Demand:** Tests students across varying text complexities to determine if comprehension plummets on multi-clause primary sources even when core historical concepts are understood.
2. **Engages Students Without Testing Anxiety:** Presents historical evaluation as a time-travel review quest with retro arcade sound effects, score streaks, 50:50 tactical shields, and primary source hints.
3. **Protects Student Privacy:** Students on classroom Chromebooks see only their own score and an encouraging completion screen. The full class diagnostic roster is securely gated for teacher access only.
4. **Enables Cross-Device Data Collection:** Works seamlessly in 1:1 classroom device environments. Student submissions from individual Chromebooks or laptops are saved to a central roster accessible from the teacher's computer.

---

## 🏛️ Curriculum Coverage (Units 1–4)

The diagnostic question bank is aligned to California and national high school World History standards:

- **Unit 1: Absolutism & Enlightenment (1600–1789)**
  - Divine Right, Louis XIV, Thomas Hobbes (*Leviathan*), John Locke (*Two Treatises*), Baron de Montesquieu (*Separation of Powers*).
- **Unit 2: Industrial Revolution & Ideologies (1750–1900)**
  - Agrarian transitions, steam engines, urbanization, Adam Smith's *Wealth of Nations* (laissez-faire), Karl Marx & Friedrich Engels (*The Communist Manifesto*).
- **Unit 3: Imperialism & World War I (1870–1919)**
  - Scramble for Africa, social Darwinism rationales, the M-A-I-N alliance system, Archduke Franz Ferdinand's assassination, trench warfare, and the Treaty of Versailles (War Guilt Clause).
- **Unit 4: Interwar Period & World War II (1919–1945)**
  - Rise of European fascism, Weimar hyperinflation, the 1938 Munich Agreement (Appeasement), and the Nuremberg Trials (establishing individual legal accountability for crimes against humanity).

---

## 🎨 Authentic Historical Primary Source Visuals

Questions incorporate high-resolution authentic historical political cartoons and maps:
- **1789 French Revolution Three Estates Cartoon** (*A faut espérer q'eu jeu la finira ben tot*)
- **1914 European Encirclement Map** (Central Powers vs. Allied Entente)
- **1914 Nelson Harding Political Cartoon** (*The Chain of Friendship*)
- **1938 David Low Political Cartoon** (*Stepping Stones to Glory / Spineless Leaders of Democracy*)

---

## 📊 Teacher Diagnostic Dashboard

Protected by a teacher passcode (**default: `1986`**), the dashboard provides:

1. **Class Submissions Roster:**
   - Real-time table of all student attempts across classroom computers.
   - Student Name, Timestamp, Questions Mastered, Readiness Index %, Lexile Estimate, and Supports Used.
   - Search & filtering by student name or date.
   - **One-Click CSV Export** for importing into Google Sheets, Canvas, or school gradebooks.
2. **Executive Summary & Course Readiness Index:**
   - Overall Readiness percentage score with benchmark levels (*Course Ready*, *Approaching Grade Level*, *Foundational Gaps*, *Substantial Gaps*).
3. **Reading & Cognitive Profile:**
   - Lexile reading range estimate (6th–8th grade, 9th grade, or 10th+ grade).
   - Text complexity drop-off detection (identifies students who succeed on direct syntax but drop on primary sources).
   - Processing pacing and stamina analysis (identifies fatigue vs. rapid guessing).
4. **Unit-by-Unit Mastery Breakdown:**
   - Granular percentage scores, demonstrated concepts, and priority learning targets per unit.
5. **IEP & SST Classroom Accommodations Generator:**
   - Actionable, high-priority instructional strategies categorized by Reading & Literacy, Content Processing, and Testing Accommodations.
   - One-click **Copy Summary** formatted for direct pasting into IEP documentation, SST meetings, or 504 plans.
   - Printable PDF diagnostic report.
6. **Adaptive Item Audit Trail:**
   - Question-by-question log with student selections, correct answers, time spent per item, lifeline usage, and pedagogical rationales.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Web Audio API sound synthesis.
- **Cloud Persistence:** Firebase Firestore configured for direct client submissions, allowing full cross-device capability on static hosting like GitHub Pages without needing a custom server.
- **Local Fallback:** Express server (`server.ts`) mounting Vite middleware for local development and offline classrooms.
- **Accessibility:** 100% enlarged typography mode, WCAG AA high-contrast styling, keyboard navigation, and audio toggles.

---

## 🌐 Deploying to GitHub Pages

This project is fully configured for one-click static hosting on **GitHub Pages**:

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy Chronos Arcade with Firebase"
   git push origin main
   ```
2. **Enable GitHub Pages via Actions**:
   - Go to your repository on GitHub.
   - Click **Settings** > **Pages** (in the left sidebar).
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. **Automated Deployment**:
   - The included `.github/workflows/deploy.yml` workflow will automatically run `npm run build` and publish your site.
   - Once deployed, your site URL will appear at `https://<your-username>.github.io/<repo-name>/`.
4. **Cross-Device Student Reporting**:
   - Because Firebase Firestore is integrated, students can take the quiz on any Chromebook, phone, or home computer via the GitHub Pages URL.
   - All student submissions immediately sync to your Teacher Dashboard (passcode: **`1986`**).

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Start full-stack development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Teacher Portal Access
- Click **"Teacher Report"** in the top navigation bar or access it from the footer.
- Enter the Teacher Passcode: **`1986`**

---

## 📄 License

This educational assessment tool is provided as open-source for classroom teachers, history departments, and educational specialists.
