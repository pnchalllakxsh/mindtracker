MINDTRACK
Mental Wellness Tracker for Students
AI-Powered • Next.js 14 App Router • PromptWars Challenge Build
TECHNICAL SPECIFICATION & AGENT BUILD DOCUMENT
Version 1.0 • June 2026
BASELINE SCORE
62.01 / 100
Previous submission
TARGET SCORE
90+ / 100
This build goal
CRITICAL GAP
Testing: 0
Must fix first
0. AI Agent Instructions (Read First)
AGENT: This document is your complete build reference. Follow sections in order. Each phase must be completed and validated before starting the next. Do NOT skip Testing (Phase 4) — it was the #1 score killer in the baseline (0/100). All environment variables are listed. All file paths are specified. Build for Next.js 14 App Router only.
Key constraints for the AI evaluator (treat as hard requirements):
Every component must have accessible ARIA labels and semantic HTML
Every API route must have input validation + error handling
Every utility function must have a corresponding unit test
Security headers must be set in next.config.js
Lighthouse score must target 90+ on Performance, Accessibility, Best Practices
No inline styles — use Tailwind CSS classes exclusively
No console.log statements in production code
All async operations must have loading and error states
1. Project Overview
1.1 Challenge Statement
PromptWars Challenge — Mental Wellness Tracker
Build a solution that helps students monitor and improve their mental well-being during board exams, competitive entrance tests, and result seasons. Target users: students preparing for NEET, JEE, CUET, CAT, GATE, UPSC, and board examinations who face stress, anxiety, burnout, self-doubt, and uncertainty.
1.2 Product Vision
MindTrack is an AI-powered mental wellness companion for Indian competitive exam students. It provides daily mood tracking, stress pattern recognition, personalized AI-driven coping strategies, and a supportive community layer — all in a fast, accessible, mobile-first Next.js application.
1.3 Differentiators Over Baseline
Score Axis
Baseline Gap
Our Solution
Testing
0 / 100
Zero tests submitted — biggest single loss. We add Vitest unit tests, Playwright E2E tests, and React Testing Library component tests.
Security
58 / 100
Weak headers, no rate limiting. We add Content-Security-Policy, rate limiting middleware, input sanitization, and Helmet.js-equivalent config.
Problem Alignment
59 / 100
Generic wellness app. We add exam-specific features: NEET/JEE countdown, subject-mood correlation, exam-day rituals module.
Accessibility
75 / 100
Incomplete ARIA. We use Radix UI primitives, keyboard navigation, skip-links, and WCAG AA contrast throughout.
Efficiency
80 / 100
Improve with React Query caching, image optimization, lazy loading, and bundle splitting.
Code Quality
83 / 100
Raise to 95+ via ESLint strict config, Prettier, TypeScript strict mode, and Zod validation.
2. Technology Stack
2.1 Core Stack (Agent: install these exact versions)
Layer
Package / Version
Purpose
Framework
Next.js 14.2 (App Router)
Language
TypeScript 5.4 — strict: true
Styling
Tailwind CSS 3.4 + shadcn/ui
UI Primitives
Radix UI (accessibility baseline)
State
Zustand 4 + TanStack Query 5
Forms
React Hook Form 7 + Zod 3
Charts
Recharts 2.12
Auth
NextAuth.js v5 (Auth.js)
Database
Prisma 5 + PostgreSQL (or SQLite for dev)
AI Layer
Google Gemini 1.5 Flash via API
Testing Unit
Vitest 1.6 + React Testing Library 16
Testing E2E
Playwright 1.44
Linting
ESLint 9 + eslint-config-next strict
Formatting
Prettier 3 + prettier-plugin-tailwindcss
Deployment
Vercel (recommended)
2.2 Folder Structure (Agent: create exactly this)
mindtrack/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Protected layout
│   │   ├── page.tsx              # Dashboard home
│   │   ├── mood/page.tsx         # Mood check-in
│   │   ├── insights/page.tsx     # Analytics
│   │   ├── journal/page.tsx      # Reflective journal
│   │   ├── ai-coach/page.tsx     # AI wellness chat
│   │   ├── exam-prep/page.tsx    # Exam countdown + planner
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── mood/route.ts
│   │   ├── journal/route.ts
│   │   ├── ai-coach/route.ts
│   │   └── insights/route.ts
│   ├── globals.css
│   ├── layout.tsx                # Root layout w/ metadata
│   └── not-found.tsx
├── components/
│   ├── ui/                       # shadcn/ui generated
│   ├── mood/
│   │   ├── MoodSelector.tsx
│   │   ├── MoodCalendar.tsx
│   │   └── MoodTrendChart.tsx
│   ├── journal/
│   │   ├── JournalEditor.tsx
│   │   └── JournalList.tsx
│   ├── ai/
│   │   ├── ChatWindow.tsx
│   │   └── SuggestionCard.tsx
│   ├── exam/
│   │   ├── ExamCountdown.tsx
│   │   └── ExamSelector.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── MobileNav.tsx
│   │   └── SkipLink.tsx          # Accessibility
│   └── shared/
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       └── EmptyState.tsx
├── lib/
│   ├── db.ts                     # Prisma client singleton
│   ├── auth.ts                   # NextAuth config
│   ├── ai.ts                     # Gemini client
│   ├── validations.ts            # Zod schemas (shared)
│   ├── rate-limit.ts             # Edge rate limiter
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── __tests__/
│   ├── unit/
│   ├── components/
│   └── e2e/
├── next.config.ts             # Security headers HERE
├── middleware.ts              # Auth guard + rate limit
├── vitest.config.ts
├── playwright.config.ts
├── .env.local                 # See Section 2.3
└── tsconfig.json              # strict: true
2.3 Environment Variables (.env.local)
# Auth
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mindtrack"

# AI
GOOGLE_GEMINI_API_KEY=<your-key>

# Optional: OAuth
GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<your-google-oauth-client-secret>
3. Database Schema (Prisma)
Agent: Create this exact schema in prisma/schema.prisma. Run `npx prisma migrate dev --name init` after.
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String?   // hashed with bcrypt
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  moodEntries   MoodEntry[]
  journalEntries JournalEntry[]
  examGoals     ExamGoal[]
  accounts      Account[]
  sessions      Session[]
}

model MoodEntry {
  id          String   @id @default(cuid())
  userId      String
  mood        Int      // 1-5 scale
  energy      Int      // 1-5 scale
  anxiety     Int      // 1-5 scale
  triggers    String[] // array of trigger tags
  note        String?
  subject     String?  // e.g., "Physics", "Maths"
  examContext String?  // e.g., "JEE", "NEET"
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, createdAt])
}

model JournalEntry {
  id        String   @id @default(cuid())
  userId    String
  content   String
  prompt    String?  // AI-generated prompt used
  sentiment Float?   // -1 to 1, AI-analyzed
  tags      String[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, createdAt])
}

model ExamGoal {
  id        String   @id @default(cuid())
  userId    String
  examName  String   // "JEE Mains", "NEET", "CUET", etc.
  examDate  DateTime
  targetScore Int?
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// NextAuth required models
model Account { ... }  // standard NextAuth Account model
model Session { ... }  // standard NextAuth Session model
4. API Routes Specification
AGENT: Every API route MUST include: (1) auth session check, (2) Zod input validation, (3) try/catch with typed error response, (4) rate limiting via lib/rate-limit.ts. No exceptions.
4.1 Mood API — /api/mood
POST /api/mood — Create mood entry
// lib/validations.ts
export const moodSchema = z.object({
  mood: z.number().int().min(1).max(5),
  energy: z.number().int().min(1).max(5),
  anxiety: z.number().int().min(1).max(5),
  triggers: z.array(z.string().max(50)).max(10).default([]),
  note: z.string().max(500).optional(),
  subject: z.string().max(100).optional(),
  examContext: z.string().max(50).optional(),
});

// app/api/mood/route.ts
export async function POST(request: Request) {
  const session = await auth(); // NextAuth
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const rateLimitResult = await rateLimit(session.user.id, "mood", 10, "1h");
  if (!rateLimitResult.success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

  const body = await request.json();
  const parsed = moodSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const entry = await prisma.moodEntry.create({
      data: { userId: session.user.id, ...parsed.data }
    });
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("[mood POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  // Returns last 30 days of mood entries for authenticated user
  // Query params: ?from=ISO&to=ISO&limit=30
}
4.2 AI Coach API — /api/ai-coach
// app/api/ai-coach/route.ts
const AI_SYSTEM_PROMPT = `You are MindTrack AI, a compassionate mental wellness coach 
specialized in supporting Indian students preparing for competitive exams (JEE, NEET, CUET, CAT, GATE, UPSC).

RULES:
- Always validate feelings before offering solutions
- Suggest evidence-based coping techniques (box breathing, Pomodoro, CBT reframing)
- Never diagnose or replace professional mental health support
- Keep responses concise (max 3 paragraphs)
- If student expresses self-harm intent, always direct to iCall: 9152987821

Context: {userMoodSummary}`;

export async function POST(request: Request) {
  // Auth check, rate limit (20 messages/day), Zod validate message
  // Call Gemini 1.5 Flash with system prompt + conversation history
  // Stream response using ReadableStream for real-time UX
  // Store conversation summary in session for context
}
4.3 Insights API — /api/insights
Returns computed analytics for the dashboard. Calculations done server-side to reduce client bundle size.
GET /api/insights?period=7d|30d|90d — mood trends, average scores, trigger frequency
GET /api/insights/patterns — day-of-week patterns, exam correlation analysis
GET /api/insights/streaks — current and longest check-in streak
5. Security Implementation (Score Gap: 58 → 95+)
AGENT: Security was 58/100 in baseline. These configurations are MANDATORY — the AI evaluator checks for them.
5.1 next.config.ts — Security Headers
// next.config.ts
import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // unsafe-inline needed for Next.js
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self' https://generativelanguage.googleapis.com",
      "frame-ancestors 'none'",
    ].join("; ")
  }
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  images: { domains: [] }, // whitelist only needed domains
  experimental: { serverActions: { allowedOrigins: ["localhost:3000"] } }
};

export default nextConfig;
5.2 Middleware — Auth Guard + Rate Limiting
// middleware.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth(function middleware(req) {
  const { pathname } = req.nextUrl;
  const protectedPaths = ["/dashboard", "/mood", "/journal", "/ai-coach", "/insights"];
  
  if (protectedPaths.some(p => pathname.startsWith(p)) && !req.auth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"]
};
5.3 Input Sanitization
Use DOMPurify for any user content rendered as HTML
Prisma parameterized queries prevent SQL injection by default
All API inputs validated through Zod schemas before DB operations
Passwords hashed with bcrypt (saltRounds: 12) via NextAuth credentials provider
JWT secrets minimum 32 characters, rotated on deploy
6. Testing Strategy (Score Gap: 0 → 85+)
AGENT CRITICAL: Testing was 0/100 in baseline — this is the single biggest score improvement opportunity. Write tests as you build each module, not at the end. Target: 80%+ coverage.
6.1 Vitest Config
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: { lines: 80, branches: 75, functions: 80, statements: 80 }
    }
  },
  resolve: { alias: { "@": path.resolve(__dirname, "./") } }
});

// vitest.setup.ts
import "@testing-library/jest-dom";
6.2 Unit Tests — Required Coverage
Agent: Create these test files. Each must pass before Phase 4 sign-off.
Test File
What to Test
__tests__/unit/validations.test.ts
All Zod schemas — valid + invalid inputs, edge cases (empty strings, max lengths, negative numbers)
__tests__/unit/utils.test.ts
getMoodLabel(), calculateStreak(), formatDate(), getTriggerFrequency()
__tests__/unit/ai.test.ts
Prompt building functions, response parsing, sanitization helpers
__tests__/components/MoodSelector.test.tsx
Renders all 5 moods, keyboard nav, ARIA labels, onChange callback fires
__tests__/components/MoodTrendChart.test.tsx
Renders with empty data, renders with mock data, accessibility attributes
__tests__/components/ChatWindow.test.tsx
Sends message on Enter, disables input during loading, displays AI response
__tests__/components/ExamCountdown.test.tsx
Shows correct days remaining, handles past exam date, no exam selected state
__tests__/api/mood.test.ts
POST returns 401 without auth, 400 on invalid body, 201 on valid data
6.3 Example Unit Test (validations)
// __tests__/unit/validations.test.ts
import { describe, it, expect } from "vitest";
import { moodSchema } from "@/lib/validations";

describe("moodSchema", () => {
  it("accepts valid mood entry", () => {
    const result = moodSchema.safeParse({
      mood: 3, energy: 4, anxiety: 2, triggers: ["study", "sleep"]
    });
    expect(result.success).toBe(true);
  });

  it("rejects mood outside 1-5 range", () => {
    const result = moodSchema.safeParse({ mood: 6, energy: 3, anxiety: 3 });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain("mood");
  });

  it("rejects more than 10 triggers", () => {
    const result = moodSchema.safeParse({
      mood: 3, energy: 3, anxiety: 3,
      triggers: Array(11).fill("tag")
    });
    expect(result.success).toBe(false);
  });
});
6.4 Playwright E2E Tests
// __tests__/e2e/mood-checkin.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Mood Check-in Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Login via API route (not UI) for speed
    await page.goto("/login");
    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="password"]', "testpassword");
    await page.click('[type="submit"]');
    await page.waitForURL("/dashboard");
  });

  test("completes full mood check-in", async ({ page }) => {
    await page.goto("/mood");
    await page.click('[data-mood="3"]');               // Select neutral mood
    await page.click('[data-trigger="study-pressure"]'); // Select trigger
    await page.fill('[name="note"]', "Feeling okay today");
    await page.click('[data-testid="submit-mood"]');
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });

  test("mood page is accessible", async ({ page }) => {
    await page.goto("/mood");
    const results = await page.evaluate(async () => {
      const axe = await import("axe-core");
      return axe.run();
    });
    expect(results.violations).toHaveLength(0);
  });
});
7. Feature Specifications
7.1 Feature: Daily Mood Check-In
Route: /mood | Component: MoodSelector.tsx
5-emotion slider with emoji + label (Very Low / Low / Neutral / Good / Excellent)
Energy level selector (1-5)
Anxiety meter (1-5)
Trigger tags — presets: Study Pressure, Sleep Issues, Family Pressure, Peer Competition, Exam Fear, Physical Health, Motivation Loss — plus custom
Subject context (which subject was studied today)
Exam context selector (which exam they are targeting)
Optional free-text note (max 500 chars with live counter)
Animated submit confirmation with personalized micro-message from AI
Skip option — shows gentle reminder, not forced
AGENT: data-testid attributes required on: mood buttons (data-mood='1' through '5'), trigger tags (data-trigger='slug'), submit button (data-testid='submit-mood'), success message (data-testid='success-message')
7.2 Feature: Insights Dashboard
Route: /insights | Components: MoodTrendChart.tsx, MoodCalendar.tsx
Recharts LineChart — mood, energy, anxiety over selected period (7d / 30d / 90d)
Calendar heatmap — color-coded by mood score
Trigger frequency bar chart — which triggers appear most
Exam-mood correlation — shows mood scores around exam dates
Streak counter — current daily check-in streak + longest streak
AI-generated weekly insight paragraph — auto-generated every Monday
Export data as CSV — important for accessibility and data ownership
7.3 Feature: AI Wellness Coach
Route: /ai-coach | Component: ChatWindow.tsx
Streaming chat interface using ReadableStream (real-time token display)
Conversation history stored in sessionStorage (not DB — privacy by design)
Context-aware: AI knows user's recent mood trend and exam goal
Technique cards: box breathing, 5-4-3-2-1 grounding, Pomodoro, affirmations
Crisis detection: if keywords suggest self-harm, immediately show iCall helpline (9152987821) and NIMHANS resources
Daily message limit (20) with graceful message when reached
7.4 Feature: Reflective Journal
Route: /journal | Component: JournalEditor.tsx
Daily AI-generated prompt tailored to exam prep context
Rich text editor (use @uiw/react-md-editor or plain textarea)
Client-side auto-save every 30 seconds (debounced)
Tag system (self-generated or AI-suggested)
Sentiment analysis via Gemini on save — stored as float -1 to 1
Journal history list with sentiment color indicator
Entries are private by default; no sharing feature (data safety)
7.5 Feature: Exam Prep Module (Differentiator)
Route: /exam-prep | Component: ExamCountdown.tsx, ExamSelector.tsx
Exam selector: JEE Mains, JEE Advanced, NEET, CUET, CAT, GATE, UPSC Prelims/Mains
Live countdown (days, hours, minutes to exam date)
Mood-to-performance tracker — 'On days you felt Good, you studied X hours more'
Pre-exam ritual suggestions (exam-day routine builder)
Subject-specific burnout detection — flags if a particular subject consistently correlates with low mood
Result season support mode — activates after exam date, offers specific coping resources
8. Accessibility (Score Gap: 75 → 95+)
8.1 WCAG AA Compliance Checklist
Agent: verify each item before Phase 3 sign-off.
Skip navigation link as first DOM element (components/layout/SkipLink.tsx)
All interactive elements reachable and operable via keyboard (Tab, Enter, Space, Arrow keys)
Focus visible at all times — use ring-2 ring-blue-500 ring-offset-2 Tailwind classes
Color contrast ratio minimum 4.5:1 for normal text, 3:1 for large text
All images have alt text; decorative images use alt=''
Form inputs have associated <label> elements (not just placeholder)
Error messages use role='alert' or aria-live='polite'
Mood emoji buttons use aria-label='Mood: [label], score [1-5]'
Charts have accessible text alternatives (data tables or aria-label summaries)
Mobile touch targets minimum 44x44px
Use Radix UI components (Dialog, Select, Slider) — they handle ARIA by default
8.2 SkipLink Component
// components/layout/SkipLink.tsx
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white 
                 focus:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Skip to main content
    </a>
  );
}

// In app/layout.tsx:
// <SkipLink />
// <main id="main-content"> ... </main>
9. Performance & Code Quality
9.1 Performance Targets
Metric
Target
Implementation
LCP (Largest Contentful Paint)
< 2.5s
FID / INP
< 100ms
CLS
< 0.1
Bundle Size (initial)
< 150KB gzipped
Lighthouse Performance
90+
Lighthouse Accessibility
95+
9.2 ESLint Config (Strict)
// .eslintrc.json
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "no-console": ["error", { "allow": ["warn", "error"] }],
    "react/no-array-index-key": "warn",
    "jsx-a11y/anchor-is-valid": "error",
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/aria-labels": "error"
  }
}
9.3 TypeScript Strict Mode
// tsconfig.json (key settings)
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
10. Phase-by-Phase Build Plan
AGENT: Execute phases sequentially. Each phase ends with a validation checkpoint. Do NOT proceed to next phase if checkpoint fails.
Phase
Duration
Tasks
Checkpoint
Phase 1
Foundation
~30 min
Init Next.js 14 with TypeScript strict. Install all dependencies. Create folder structure. Set up Prisma schema + migrate. Configure NextAuth with credentials provider. Set up next.config.ts with security headers. Configure ESLint + Prettier. Set up Tailwind + shadcn/ui.
App runs on localhost. Auth login/register works. DB connected. Security headers present.
Phase 2
Core UI
~45 min
Build Layout (Sidebar + MobileNav + SkipLink). Build Dashboard home page with greeting. Build Mood Check-in page + MoodSelector component. Build Journal page + JournalEditor. Build AI Coach page + ChatWindow. Build Exam Prep page + ExamCountdown. All pages use proper ARIA labels.
All pages render without errors. Navigation works. No accessibility violations on Mood page.
Phase 3
API Layer
~30 min
Implement /api/mood (POST + GET) with Zod validation, auth check, rate limiting. Implement /api/journal (POST + GET). Implement /api/ai-coach (POST, Gemini streaming). Implement /api/insights (GET, computed analytics). Implement /api/insights/streaks.
Postman / curl tests: POST mood returns 201, POST without auth returns 401, invalid body returns 400 with Zod errors.
Phase 4
Testing
~45 min
Write all Vitest unit tests (validations, utils, AI helpers). Write all RTL component tests (MoodSelector, ChatWindow, ExamCountdown). Write Playwright E2E tests (mood check-in flow, journal save flow). Run coverage report — must hit 80%+ lines. Fix any failures.
npx vitest run --coverage passes. Coverage >= 80%. Playwright tests pass headlessly.
Phase 5
Polish
~20 min
Add loading states to all async operations. Add error boundaries. Optimize images with next/image. Add meta tags + OG image in app/layout.tsx. Run Lighthouse locally — target 90+. Fix any a11y issues from axe-core. Remove all console.log.
Lighthouse Performance 90+. Accessibility 95+. No console.log. Build passes: next build.
11. UI Design Tokens & Guidelines
11.1 Color Palette
Token
Hex
Usage
--brand-primary
#1A73E8
--brand-success
#34A853
--brand-warning
#F29900
--brand-danger
#EA4335
--brand-purple
#7C3AED
--bg-dark
#0F172A
--text-muted
#64748B
Mood 1 (Very Low)
#EF4444
Mood 2 (Low)
#F97316
Mood 3 (Neutral)
#EAB308
Mood 4 (Good)
#84CC16
Mood 5 (Excellent)
#22C55E
11.2 Component Patterns
Dark mode support via Tailwind dark: prefix + next-themes
Consistent spacing: p-4 / p-6 for cards, gap-4 for grids
Card style: bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200
All mood emoji buttons: 64x64px minimum, focus ring visible, aria-label required
Mobile-first: default styles for mobile, md: prefix for desktop
Smooth animations: transition-all duration-200 on interactive elements
12. AI Evaluation Readiness Checklist
Before submitting: run this checklist. Each item maps to a scoring axis.
Axis
Check
Command / Verification
Testing
Vitest coverage >= 80%
Testing
Playwright E2E passes
Security
Security headers present
Security
No hardcoded secrets
Security
Rate limiting on API
Code Quality
TypeScript no errors
Code Quality
ESLint no errors
Code Quality
No console.log
Accessibility
Axe violations = 0
Accessibility
Keyboard nav works
Performance
Build succeeds
Alignment
NEET/JEE features present
Alignment
AI coach crisis response
13. Appendix — Quick Reference
13.1 Init Commands (copy-paste)
# 1. Create project
npx create-next-app@14 mindtrack --typescript --tailwind --eslint --app --src-dir=false
cd mindtrack

# 2. Install dependencies
npm install @auth/prisma-adapter @prisma/client prisma next-auth@beta
npm install @tanstack/react-query zustand react-hook-form @hookform/resolvers zod
npm install recharts @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-slider
npm install bcryptjs dompurify
npm install -D @types/bcryptjs @types/dompurify vitest @vitejs/plugin-react
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D @playwright/test jsdom

# 3. Setup Prisma
npx prisma init
# (edit schema.prisma per Section 3)
npx prisma migrate dev --name init
npx prisma generate

# 4. Setup shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button card input label badge select slider textarea

# 5. Setup Playwright
npx playwright install chromium
13.2 Gemini API Integration
// lib/ai.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export function getGeminiModel() {
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { maxOutputTokens: 512, temperature: 0.7 }
  });
}

export async function streamGeminiResponse(
  systemPrompt: string,
  userMessage: string
): Promise<ReadableStream> {
  const model = getGeminiModel();
  const result = await model.generateContentStream([
    { role: "user", parts: [{ text: systemPrompt }] },
    { role: "model", parts: [{ text: "Understood. I am MindTrack AI, ready to help." }] },
    { role: "user", parts: [{ text: userMessage }] }
  ]);
  
  return new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        const text = chunk.text();
        controller.enqueue(new TextEncoder().encode(text));
      }
      controller.close();
    }
  });
}
Built for PromptWars • Google for Developers
MindTrack — Where Every Student's Mental Health Matters
Tech Spec v1.0 • June 2026 • Target Score: 90+