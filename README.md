# 🎯 IELTS Master Sprint & Study Planner

> **A modern, full-stack IELTS preparation platform and study tracker built with Next.js 15, TypeScript, Supabase, and Firebase Auth.**
> Designed for ambitious IELTS candidates targeting **Band 7.0 to 9.0** with full freedom over custom study durations and score objectives.

---

## ✨ Key Features

### 1. 🗓️ IELTS Target Goal & Custom Plan Builder
- **Personalized Band Goals**: Set target bands from **Band 5.0 to 9.0** (with C1/C2 descriptors) and practice baseline from **3.5 to 8.5**.
- **Flexible Plan Durations**: Not restricted to 30 days — choose between **7 Days (Crash Sprint)**, **14 Days (Booster)**, **30 Days (Standard)**, **45 Days**, **60 Days (Band 8+ Immersion)**, or enter any **Custom Day Count** (e.g., 10, 21, 90 days).
- **Dynamic 5-Phase Curriculum**: Automatically recalculates and distributes training phases:
  - **Phase 1**: Diagnostic Baseline & Foundations
  - **Phase 2**: Skill Building & Question Type Mastery
  - **Phase 3**: Intensive Timed Drills & Error Elimination
  - **Phase 4**: Full Mock Exam Simulations (2h 45m stamina)
  - **Phase 5**: Final Review, Vocabulary Consolidation & Test Readiness
- **Curriculum Focus Strategies**: Balanced, Writing & Speaking Heavy, Reading & Listening Intensive, or Comprehensive Foundations.
- **Day-by-Day Custom Tasks**: Add and delete custom tasks and notes for any individual day.

---

### 2. 🎧 Four Exam Practice Simulators
- **Listening Simulator**: Audio player controls, official raw-score-to-band conversion, distractor trap analysis, and audio transcripts.
- **Reading Simulator**: Split-screen reading passage view, font size scaling, 60-minute countdown, instant answer verification.
- **Writing Simulator**: Real-time word counter with target thresholds (Task 1: 150 words, Task 2: 250 words), Band 8 model essays, and 4-criteria self-assessment.
- **Speaking Simulator**: Part 2 candidate cue card, 1-minute outline notepad, 2-minute delivery timer, voice recording playback, and fluency assessment.

---

### 3. 📕 Mistake Book & Error Prevention
- Categorized error logger for common IELTS traps (distractors, spelling, singular/plural, overview missing, grammatical agreement).
- Automatic detection of **Repeated Mistake Traps** to eliminate errors before test day.
- Filter by skill, review status, or mistake category.

---

### 4. 📚 Academic Vocabulary & Flashcards
- Spaced repetition flashcards with definitions, IELTS academic examples, synonyms, and collocations.
- 5-Star Confidence Rating system to focus review on words not yet mastered.
- Filter by topic: Environment, Technology, Education, Society, Science, and Task 1 Trends.

---

### 5. ✍️ Grammar Repair & Checklist
- Common grammar pain points (Articles, Subject-Verb Agreement, Complex Sentences, Punctuation).
- Resolved vs. Unresolved error tracker.

---

### 6. 🏆 Mock Test Center & Live Band Averaging
- Raw score input for Listening (out of 40) and Reading (out of 40).
- Automatic calculation of overall band using official IELTS rounding rules (e.g. 6.25 rounds to 6.5, 6.75 rounds to 7.0).
- Historical score trend analytics.

---

### 7. ☁️ Dual Cloud Integration & Database Sync
- **Supabase Database**: Automatic background synchronization of study progress, test logs, vocabulary, and mistake entries.
- **Firebase Authentication**:
  - 📧 Email & Password login / signup
  - 🌐 Google One-Click Popup Sign-in
  - 📱 Phone Number with SMS OTP (reCAPTCHA)
  - 👤 Anonymous Guest Mode
  - 🔑 Forgot Password Reset Recovery
- Offline-first resilience: local storage auto-sync ensures zero data loss even without an active internet connection.

---

### 8. 🌓 Seamless Light & Dark Modes
- Built with CSS semantic tokens (`var(--hero-bg)`, `var(--bg-card)`, `var(--text-primary)`).
- Instant switching between **Dark Mode**, **Light Mode**, and **System Auto Mode**.
- Zero flash on page load and fully adapted UI across all dashboards, simulators, and modals.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, Turbopack) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | Custom Vanilla CSS with CSS Variables & Tokens |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) |
| **Authentication** | [Firebase Auth](https://firebase.google.com/products/auth) |
| **Audio & Timers** | HTML5 Web Audio API & Web Speech / MediaRecorder |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.18+ or later
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/sajjadjim/Peojects-30-Days-IELTS.git
cd Peojects-30-Days-IELTS
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Database Setup (Supabase)
Execute the SQL script in `supabase_schema.sql` within your Supabase SQL Editor to set up:
- `ielts_study_data` (Stores complete study tracker progress per user)
- `ielts_users` (Stores user profile, baseline, and target band)

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Production Build
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout with theme script & providers
│   │   ├── page.tsx              # Mission Control Dashboard
│   │   ├── plan/                 # Custom Plan & Day-by-Day Roadmap
│   │   ├── practice/             # IELTS Cambridge Split-Screen Simulator
│   │   ├── daily/                # Today's Focus Mode
│   │   ├── timer/                # Digital Study Countdown Timer
│   │   ├── listening/            # Listening Drill Center
│   │   ├── reading/              # Reading Drill Center
│   │   ├── writing/              # Writing Exam Simulator & Templates
│   │   ├── speaking/             # Speaking Cue Cards & Voice Recorder
│   │   ├── vocabulary/           # Spaced Repetition Flashcards
│   │   ├── grammar/              # Grammar Traps & Rule Repair
│   │   ├── mistakes/             # Mistake Book & Error Analytics
│   │   ├── mock-tests/           # Mock Test Averaging & Band Calculator
│   │   ├── analytics/            # Progress Trajectory & Diagnostic Insights
│   │   └── settings/             # Theme & Target Band Preferences
│   ├── components/
│   │   ├── auth/                 # Firebase Auth Modals & User Menu
│   │   ├── dashboard/            # Hero Band Card, Routine & Quick Launchers
│   │   ├── layout/               # Header, Sidebar, MobileNav & ThemeToggle
│   │   ├── plan/                 # CustomPlanBuilderModal (dynamic planner)
│   │   └── practice/             # Exam Simulators (Speaking, Writing, Reading, Listening)
│   ├── context/
│   │   ├── AuthContext.tsx       # Firebase authentication & state
│   │   └── IELTSContext.tsx      # Global study state & Supabase sync
│   ├── lib/
│   │   ├── planGenerator.ts      # Dynamic IELTS curriculum engine
│   │   ├── firebase.ts           # Firebase client initialization
│   │   ├── supabase.ts           # Supabase client & sync routines
│   │   ├── storage.ts            # LocalStorage persistence & stats
│   │   └── seedData.ts           # Realistic baseline curriculum data
│   ├── styles/
│   │   └── globals.css           # Premium Dark & Light design tokens
│   └── types/
│       └── ielts.ts              # Core TypeScript data schemas
├── supabase_schema.sql           # Complete Supabase PostgreSQL schema
└── package.json
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
