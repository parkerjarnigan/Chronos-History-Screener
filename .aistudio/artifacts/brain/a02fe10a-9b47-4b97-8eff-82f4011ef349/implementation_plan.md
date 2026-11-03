# Dedicated Epoch Selection & Midstream Transfer Assessment Plan

Add a dedicated **Epoch Selection Screen** allowing teachers and midstream transfer students to choose which specific units to assess, with multi-select checkboxes, an "All Units" quick-toggle, and dynamically scaled adaptive session length (6 to 12 questions).

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following design decisions have been confirmed and will guide the implementation:

- **Confirmed Decision 1 (Placement)**: A dedicated **Epoch Selection screen** (`screen === 'epoch-selection'`) immediately following the Welcome screen where the student enters their name.
- **Confirmed Decision 2 (Selection Mechanism)**: Multi-select interactive unit cards with checkboxes, coupled with a master **"Select All Epochs" / "Clear Selection"** toggle.
- **Confirmed Decision 3 (Proportional Adaptive Scaling)**: Session length automatically calibrates to the number of selected epochs so single-unit assessments remain swift and diagnostic:
  - **1 Epoch Selected**: ~6 questions (balanced across Tiers 1, 2, and 3)
  - **2 Epochs Selected**: ~8 questions (4 questions per epoch)
  - **3 Epochs Selected**: ~10 questions
  - **4 Epochs Selected (Full Screener)**: 12–14 questions (including calibration)
- **Confirmed Decision 4 (Fair Diagnostic Reporting)**: Unselected units are recorded as *"Not Assessed"* in both the Student Victory screen and Teacher Dashboard rather than scored as 0%, ensuring transfer students are not unfairly evaluated on material they were never taught.

---

### 1. Overview & Core Concept

- **What It Does**: Provides a streamlined two-step entry flow for the arcade screener:
  1. *Welcome*: Enter student/cadet name and review accessibility features.
  2. *Epoch Selection*: Select one, multiple, or all historical epochs according to the student's entry point in the school year.
- **Target Audience**: High school teachers onboarding transfer students who moved mid-semester, and students needing targeted diagnostic review on specific missed units.
- **Key Value**: Saves valuable classroom time by diagnosing only the relevant historical periods without forcing a student through a 14-question comprehensive exam when they only missed Unit 1 or Unit 3.

---

### 2. User Experience & Visual Design

#### Step 1: Welcome Screen Update
- Student enters name.
- Primary CTA button changes from *"Start Time Jump"* to **"Next: Choose Epochs & Missions →"**.
- Direct link to Teacher Dashboard remains prominently accessible.

#### Step 2: Dedicated "Epoch Selection" Screen (`screen === 'epoch-selection'`)
- **Header**:
  - Cadet greeting: *"Welcome, [Student Name] — Configure Your Mission Coordinates"*
  - Subtitle: *"Select the historical epochs to assess. Perfect for midstream transfer students catching up on specific coursework."*
- **Quick Controls Bar**:
  - **"Select All Epochs"** button (turns all 4 on).
  - Selected count tracker: *"2 of 4 Epochs Selected"*.
- **Interactive Epoch Cards Grid (2x2 on desktop, single column on mobile)**:
  - **Epoch 1**: *Absolutism & Revolutions (1600–1815)* — Monarchy, Enlightenment, French Revolution, Napoleon.
  - **Epoch 2**: *Industrial Revolution & Social Impact (1750–1900)* — Steam power, factory discipline, urbanization, capitalism vs. socialism.
  - **Epoch 3**: *WWI & Global Imperialism (1880–1919)* — M-A-I-N causes, trench warfare, Russian Revolution, Treaty of Versailles.
  - **Epoch 4**: *Interwar Years & WWII (1919–1945)* — Weimar hyperinflation, rise of totalitarianism, appeasement, WWII turning points.
  - Visual states: Amber border glow and checkmark icon when selected; clean muted stone state when unselected.
- **Dynamic Mission Summary & Launch Bar**:
  - Live metric pill: *"Mission Length: 8 Questions (~6-8 minutes)"*.
  - *"Back to Name Entry"* button.
  - **"Launch Time Jump →"** button (disabled if 0 epochs selected with a friendly prompt).

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dedicated Screen vs. Modal vs. Welcome Inset**
  - *Chosen Approach*: A dedicated full screen between Welcome and Quiz.
  - *Why*: Gives ample breathing room on Chromebooks and mobile devices to read each unit's curriculum summary and check/uncheck units without cluttering the initial landing page.
- **Decision 2: Adaptive Engine Pacing Calculation**
  - *Chosen Approach*: Pass `selectedUnits: UnitId[]` into `new AdaptiveEngine(selectedUnits)`.
  - *Why*: The engine can authoritatively constrain `unitSequence`, question picking, tier progression, and `shouldFinish()` threshold in one centralized controller.
- **Decision 3: Teacher Dashboard Aggregation for Partial Sessions**
  - *Chosen Approach*: Display unassessed units as a neutral gray badge or dash (`—`) in student rows and exclude them from class-wide averages.
  - *Why*: Prevents partial transfer screeners from artificially deflating overall class performance scores.

---

### 4. Technical Architecture & Component Flow

```
┌─────────────────────────────────────────────────────────────┐
│                       App.tsx State                         │
│                                                             │
│   screen: 'welcome' ──► 'epoch-selection' ──► 'quiz'       │
│                                                             │
│   studentName: string                                       │
│   selectedUnits: UnitId[] = ['unit1', 'unit2', ...]         │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
┌──────────────────────────────┐ ┌──────────────────────────────┐
│     EpochSelectionScreen     │ │        AdaptiveEngine        │
│                              │ │                              │
│  • Multi-select 4 Epoch cards│ │  • targetCount =             │
│  • "Select All" toggle       │ │    selectedUnits.length * 2  │
│  • Proportional length badge │ │    + 2 (min 6, max 14)       │
│  • Validation (>= 1 epoch)   │ │  • Filters QUESTION_BANK to  │
│  • "Launch Time Jump" button │ │    selectedUnits only        │
└──────────────────────────────┘ └──────────────────────────────┘
```

#### Adaptive Engine Scaling Logic:
```typescript
export class AdaptiveEngine {
  private selectedUnits: UnitId[];
  private targetQuestionCount: number;

  constructor(selectedUnits: UnitId[] = ['unit1', 'unit2', 'unit3', 'unit4']) {
    this.selectedUnits = selectedUnits.length > 0 ? selectedUnits : ['unit1', 'unit2', 'unit3', 'unit4'];
    
    // Proportional scaling:
    // 1 unit = 6 questions
    // 2 units = 8 questions
    // 3 units = 10 questions
    // 4 units = 12-14 questions
    this.targetQuestionCount = Math.max(6, Math.min(14, this.selectedUnits.length * 2 + 4));
  }
}
```

---

### 5. Verification Plan

1. **Automated Verification**:
   - Run `lint_applet` (`tsc --noEmit`) to verify 0 type errors across new props and states.
   - Run `compile_applet` (`vite build`) to verify clean bundle generation.
2. **Interactive UI Verification**:
   - Welcome screen transitions cleanly to Epoch Selection on name submission.
   - Selecting 1 unit updates the question count display to ~6 questions.
   - Selecting 2 units updates the display to ~8 questions.
   - "Select All" toggles all 4 on; clearing untoggles all and disables Launch button until at least 1 is checked.
   - Game only delivers questions from the checked units.
   - Victory screen and Teacher Dashboard reflect assessed units accurately without penalizing omitted units.
