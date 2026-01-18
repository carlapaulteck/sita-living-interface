# SITA Platform - Complete Project Architecture

> **Last Updated:** January 2026  
> **Version:** 2.0  
> **Platform:** The Living Interface - Neuro-Adaptive Operating System

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Directory Structure](#directory-structure)
4. [Core Concepts](#core-concepts)
5. [Component Architecture](#component-architecture)
6. [State Management](#state-management)
7. [Styling & Design System](#styling--design-system)
8. [Backend Integration](#backend-integration)
9. [Feature Modules](#feature-modules)
10. [Demo Simulator Engine](#demo-simulator-engine)
11. [Edge Functions](#edge-functions)
12. [Authentication & Authorization](#authentication--authorization)
13. [Real-time Features](#real-time-features)
14. [File Reference Guide](#file-reference-guide)

---

## Project Overview

SITA is a **neuro-adaptive operating system** designed to co-author life with the user. It spans all life domains (Business, Wealth, Health, Mind, Sovereignty) using a unified cognitive infrastructure that:

- **Predicts breakdown** before it happens
- **Optimizes energy** through a "Cognitive Budget Ledger"
- **Adapts language** via an "Emotional Grammar" model
- **Preserves user dignity** through invisible support and autonomy

### Design Philosophy: "The Living Interface"

- **Luxury Minimalist Aesthetic** - Deep obsidian backgrounds, premium glassmorphism
- **"Three Taps Max" UX Rule** - Minimize cognitive load
- **Dark Themes** with Cyber Gold, Platinum, and Accent Cyan accents
- **Signals Over Dashboards** - Outcomes, not complexity

---

## Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool & Dev Server |
| **Tailwind CSS** | Utility-First Styling |
| **Framer Motion** | Animations |
| **React Router DOM** | Routing |
| **TanStack Query** | Server State Management |
| **Recharts** | Data Visualization |
| **Three.js / R3F** | 3D Graphics (Orb) |

### Backend (Lovable Cloud / Supabase)
| Technology | Purpose |
|------------|---------|
| **Supabase** | Database, Auth, Realtime |
| **Edge Functions** | Serverless API Endpoints |
| **PostgreSQL** | Primary Database |
| **Row Level Security** | Data Protection |

### UI Components
| Library | Purpose |
|---------|---------|
| **shadcn/ui** | Base Component Library |
| **Radix UI** | Accessible Primitives |
| **Lucide React** | Icon System |

---

## Directory Structure

```
src/
├── assets/                    # Static assets (images, fonts)
│   ├── avatar.jpg            # User avatar
│   ├── bg-particles.jpg      # Background texture
│   └── logo.jpg              # App logo
│
├── components/               # React Components
│   ├── ui/                   # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ... (40+ components)
│   │
│   ├── onboarding/           # Onboarding flow components
│   │   ├── OnboardingContext.tsx
│   │   └── steps/            # Individual onboarding steps
│   │       ├── CinematicEntry.tsx
│   │       ├── NameStep.tsx
│   │       ├── GoalsStep.tsx
│   │       └── ... (20+ steps)
│   │
│   ├── AdminDashboard.tsx    # Admin user management
│   ├── AdvancedAnalytics.tsx # Analytics dashboard
│   ├── AdvisorPanel.tsx      # AI Advisory Council
│   ├── ArbitrageSignals.tsx  # Wealth: Market opportunities
│   ├── AvatarBubble.tsx      # User avatar display
│   ├── AvatarHero.tsx        # Hero section with avatar
│   ├── BottomDock.tsx        # Mobile navigation dock
│   ├── BoundariesPanel.tsx   # Settings: Autonomy controls
│   ├── CalendarSync.tsx      # Calendar integration
│   ├── ClientDashboard.tsx   # Client-facing dashboard
│   ├── CommandBar.tsx        # ⌘K command palette
│   ├── ConversationConsole.tsx # Voice/chat interface
│   ├── DeviceIntegration.tsx # Device connections
│   ├── DoNotDisturbPanel.tsx # DND settings
│   ├── EngineCard.tsx        # Marketing engine cards
│   ├── ExitReadiness.tsx     # Wealth: Exit metrics
│   ├── ExperimentsDashboard.tsx # A/B testing dashboard
│   ├── GlassCard.tsx         # Premium glass UI card
│   ├── HabitTracker.tsx      # Habit tracking UI
│   ├── Header.tsx            # App header
│   ├── InsightsFeed.tsx      # AI insights feed
│   ├── IntegrationsHub.tsx   # External integrations
│   ├── LiveEventFeed.tsx     # Real-time event stream
│   ├── LiveIndicator.tsx     # Live status indicator
│   ├── MarketingOS.tsx       # Marketing dashboard
│   ├── MetricRing.tsx        # Circular progress ring
│   ├── MicrobrandsPortfolio.tsx # Wealth: Brand portfolio
│   ├── MobileBottomNav.tsx   # Mobile navigation
│   ├── ModuleLayout.tsx      # Page layout wrapper
│   ├── ModuleTile.tsx        # Dashboard module tile
│   ├── MoneyFlow.tsx         # Revenue visualization
│   ├── MorningBriefing.tsx   # Daily briefing
│   ├── NavLink.tsx           # Navigation link
│   ├── NeedsYouPanel.tsx     # Action required panel
│   ├── NotificationBatchingPanel.tsx # Notification settings
│   ├── NotificationCenter.tsx # Notification dropdown
│   ├── OnboardingFlow.tsx    # Main onboarding wrapper
│   ├── OperationsDashboard.tsx # Operations overview
│   ├── ProtectedRoute.tsx    # Auth route wrapper
│   ├── PushNotificationSettings.tsx # Push notification config
│   ├── QuickActionsBar.tsx   # Quick action buttons
│   ├── QuickStatCard.tsx     # Stat display card
│   ├── RealtimeMetrics.tsx   # Live metrics display
│   ├── RecoveryMode.tsx      # Recovery mode UI
│   ├── ScenarioSwitcher.tsx  # Demo scenario selector
│   ├── SignalCard.tsx        # Signal/alert card
│   ├── SimulationPanel.tsx   # Decision simulation
│   ├── SitaOrb3D.tsx         # 3D animated orb
│   ├── TrustControlsDashboard.tsx # Trust settings
│   ├── TrustSafeguards.tsx   # Safety controls
│   ├── UnifiedInbox.tsx      # Unified message inbox
│   ├── UserManagementTable.tsx # Admin user table
│   ├── VoiceWaveform.tsx     # Voice visualization
│   ├── WakeUpReceipt.tsx     # Morning earnings summary
│   ├── WarRoom.tsx           # 2.5D system map
│   ├── WeeklyInsights.tsx    # Weekly summary
│   └── WorkflowPacks.tsx     # Autopilot workflow packs
│
├── contexts/                 # React Context Providers
│   ├── AdaptationContext.tsx # UI adaptation state
│   └── CognitiveContext.tsx  # Cognitive state management
│
├── hooks/                    # Custom React Hooks
│   ├── use-mobile.tsx        # Mobile detection
│   ├── use-toast.ts          # Toast notifications
│   ├── useAuth.ts            # Authentication
│   ├── useCalendarEvents.ts  # Calendar data
│   ├── useCognitiveSignals.ts # Cognitive signal processing
│   ├── useCognitiveState.ts  # Cognitive state
│   ├── useDoNotDisturb.ts    # DND state
│   ├── useHabitReminders.ts  # Habit notifications
│   ├── useHabits.ts          # Habit data
│   ├── useNotificationBatching.ts # Notification grouping
│   ├── useNotifications.ts   # Notification management
│   ├── usePushNotifications.ts # Push notification API
│   ├── useRealtimeSubscription.ts # Supabase realtime
│   ├── useScenarioSimulator.ts # Demo scenario management
│   ├── useSwipeNavigation.ts # Swipe gesture handling
│   ├── useTextToSpeech.ts    # TTS functionality
│   ├── useUserRole.ts        # Role-based access
│   └── useVoiceRecognition.ts # Voice input
│
├── integrations/             # External Integrations
│   └── supabase/
│       ├── client.ts         # Supabase client (auto-generated)
│       └── types.ts          # Database types (auto-generated)
│
├── lib/                      # Utility Libraries
│   ├── adaptiveTokens.ts     # Dynamic UI tokens
│   ├── cognitiveBudgetLedger.ts # Energy tracking
│   ├── cognitiveEngine.ts    # Cognitive state engine
│   ├── cognitiveProfileBuilder.ts # Profile construction
│   ├── demoData.ts           # Demo/mock data
│   ├── eventStore.ts         # Demo event store
│   ├── evolutionEngine.ts    # Learning/adaptation
│   ├── personalizationEngine.ts # Personalization logic
│   ├── scenarioData.ts       # Demo scenario definitions
│   ├── stateReducer.ts       # Event → State reducer
│   ├── userPreferences.ts    # Preference management
│   └── utils.ts              # Utility functions (cn, etc.)
│
├── pages/                    # Route Pages
│   ├── Auth.tsx              # Login/Signup
│   ├── BusinessGrowth.tsx    # Business module
│   ├── Index.tsx             # Home/Dashboard
│   ├── LifeHealth.tsx        # Health module
│   ├── MindGrowth.tsx        # Mind/Learning module
│   ├── NotFound.tsx          # 404 page
│   ├── Settings.tsx          # Settings page
│   └── Sovereignty.tsx       # Sovereignty/Wealth module
│
├── test/                     # Test Files
│   ├── example.test.ts
│   └── setup.ts
│
├── types/                    # TypeScript Types
│   └── onboarding.ts         # Onboarding types
│
├── App.tsx                   # Root App Component
├── App.css                   # Global CSS
├── index.css                 # Tailwind + Design Tokens
├── main.tsx                  # Entry Point
└── vite-env.d.ts            # Vite Types

supabase/
├── config.toml              # Supabase configuration
└── functions/               # Edge Functions
    ├── chat/                # AI chat endpoint
    ├── create-test-users/   # Test user creation
    ├── morning-briefing/    # Morning summary
    ├── notification-dispatcher/ # Notification routing
    ├── send-push-notification/  # Push notifications
    └── text-to-speech/      # TTS endpoint

docs/
└── PROJECT_ARCHITECTURE.md  # This file

public/
├── favicon.ico
├── placeholder.svg
├── robots.txt
└── sw.js                    # Service Worker
```

---

## Core Concepts

### 1. Cognitive State Engine

The platform tracks user cognitive state to adapt UI and interactions:

```typescript
interface CognitiveState {
  state: "focused" | "scattered" | "overload" | "recovery";
  cognitiveLoad: number;      // 0-100
  focusLevel: number;         // 0-100
  stressIndex: number;        // 0-100
  predictedNextState: string;
  timeToOnset: number;        // minutes
}
```

**Files:**
- `src/lib/cognitiveEngine.ts` - State detection
- `src/contexts/CognitiveContext.tsx` - State provider
- `src/hooks/useCognitiveState.ts` - State hook

### 2. Autonomy Levels

Four levels of AI autonomy:

| Level | Name | Description |
|-------|------|-------------|
| 1 | Observe | AI watches, never acts |
| 2 | Suggest | AI recommends, user decides |
| 3 | Act | AI acts on low-risk, asks for high-risk |
| 4 | Autopilot | AI handles everything within guardrails |

**Files:**
- `src/components/BoundariesPanel.tsx` - Autonomy controls
- `src/components/WorkflowPacks.tsx` - Autopilot packs

### 3. Workflow Packs

Pre-configured automation bundles:

```typescript
interface WorkflowPack {
  id: string;
  name: string;
  description: string;
  channels: string[];      // SMS, Email, WhatsApp, etc.
  status: "ready" | "needs_connection" | "pending_template";
  outcomes: string[];
}
```

**Files:**
- `src/components/WorkflowPacks.tsx`
- `src/lib/scenarioData.ts`

---

## Component Architecture

### Component Categories

#### 1. Layout Components
- `ModuleLayout` - Page wrapper with tabs
- `GlassCard` - Premium glass card container
- `Header` - App header with navigation
- `BottomDock` - Mobile navigation

#### 2. Data Display Components
- `MetricRing` - Circular progress visualization
- `QuickStatCard` - Stat cards
- `LiveEventFeed` - Real-time event stream
- `SignalCard` - Alert/signal cards

#### 3. Interactive Components
- `CommandBar` - ⌘K command palette
- `UnifiedInbox` - Message management
- `SimulationPanel` - Decision simulation
- `BoundariesPanel` - Settings controls

#### 4. Visualization Components
- `SitaOrb3D` - 3D animated orb
- `WarRoom` - 2.5D system map
- `MoneyFlow` - Revenue visualization
- `VoiceWaveform` - Audio visualization

### Component Pattern

```typescript
// Standard component structure
import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { SomeIcon } from "lucide-react";

interface ComponentProps {
  data?: DataType;
  onAction?: (id: string) => void;
  className?: string;
}

export function Component({ data, onAction, className = "" }: ComponentProps) {
  return (
    <GlassCard className={`p-6 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Content */}
      </motion.div>
    </GlassCard>
  );
}
```

---

## State Management

### 1. Server State (TanStack Query)

Used for Supabase data:

```typescript
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Fetch data
const { data, isLoading } = useQuery({
  queryKey: ["habits", userId],
  queryFn: async () => {
    const { data } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", userId);
    return data;
  }
});
```

### 2. Local State (React Context)

Used for app-wide state:

```typescript
// CognitiveContext.tsx
const CognitiveContext = createContext<CognitiveContextType>(null);

export function CognitiveProvider({ children }) {
  const [state, setState] = useState<CognitiveState>(defaultState);
  
  return (
    <CognitiveContext.Provider value={{ state, setState }}>
      {children}
    </CognitiveContext.Provider>
  );
}
```

### 3. Component State (useState/useReducer)

For local UI state.

---

## Styling & Design System

### Design Tokens (index.css)

```css
:root {
  /* Base Colors */
  --background: 0 0% 2%;           /* #050505 - Deep Obsidian */
  --foreground: 0 0% 95%;          /* Near white */
  
  /* Brand Colors */
  --primary: 36 65% 70%;           /* Cyber Gold */
  --secondary: 174 60% 59%;        /* Accent Cyan */
  
  /* Semantic Colors */
  --muted: 0 0% 12%;
  --accent: 36 65% 70%;
  --destructive: 0 84% 60%;
  
  /* Effects */
  --glass-blur: 16px;
  --glass-opacity: 0.05;
}
```

### Component Styling

Always use semantic tokens:

```tsx
// ✅ Correct
<div className="bg-background text-foreground border-border">
<div className="bg-primary/20 text-primary">
<div className="bg-secondary/10 text-secondary">

// ❌ Incorrect - Don't use raw colors
<div className="bg-black text-white">
<div className="bg-yellow-500">
```

### Animation Standards

```typescript
// Standard transitions
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const slideUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.1 }
};

// Custom easing (cubic-bezier 0.16, 1, 0.3, 1)
const luxuryEase = [0.16, 1, 0.3, 1];
```

---

## Backend Integration

### Supabase Client

```typescript
import { supabase } from "@/integrations/supabase/client";

// Query
const { data, error } = await supabase
  .from("table_name")
  .select("*")
  .eq("user_id", userId);

// Insert
await supabase.from("table_name").insert({ ... });

// Update
await supabase
  .from("table_name")
  .update({ ... })
  .eq("id", id);

// Delete
await supabase
  .from("table_name")
  .delete()
  .eq("id", id);
```

### Database Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles |
| `user_preferences` | User settings & preferences |
| `user_roles` | Role assignments (admin, user) |
| `cognitive_profiles` | Cognitive preferences |
| `cognitive_states` | Current cognitive state |
| `cognitive_signals` | Signal history |
| `habits` | Habit definitions |
| `habit_completions` | Habit tracking |
| `calendar_events` | Calendar entries |
| `notifications` | User notifications |
| `notification_batches` | Batched notifications |
| `push_subscriptions` | Push notification subscriptions |
| `realtime_metrics` | Live metrics |
| `activity_feed` | Activity log |
| `evolution_patterns` | Learning patterns |
| `personalization_profiles` | Deep personalization |

---

## Feature Modules

### 1. Business Growth (`/business-growth`)

**Purpose:** Business operations, marketing, revenue management.

**Tabs:**
- Overview - Business Pulse, Live Events
- Growth - Marketing OS, Experiments
- Money - Revenue flow, Invoices
- Operations - Capacity, Team load
- Intelligence - Advisory Council, Simulation

**Key Components:**
- `MarketingOS.tsx`
- `OperationsDashboard.tsx`
- `LiveEventFeed.tsx`
- `AdvisorPanel.tsx`
- `SimulationPanel.tsx`

### 2. Sovereignty & Wealth (`/sovereignty`)

**Purpose:** Digital autonomy, data ownership, wealth management.

**Tabs:**
- Overview - Privacy score, sessions
- Wealth Engine - Arbitrage, Exit readiness
- Boundaries - Autonomy controls
- Data - Data inventory
- Privacy - Privacy settings
- Identity - Account security
- Automation - Automation rules
- Freedom - Platform independence

**Key Components:**
- `ArbitrageSignals.tsx`
- `ExitReadiness.tsx`
- `MicrobrandsPortfolio.tsx`
- `BoundariesPanel.tsx`

### 3. Life & Health (`/life-health`)

**Purpose:** Health tracking, habits, recovery.

**Key Components:**
- `HabitTracker.tsx`
- `RecoveryMode.tsx`
- `DeviceIntegration.tsx`

### 4. Mind & Growth (`/mind-growth`)

**Purpose:** Focus, learning, personal development.

**Key Components:**
- `WeeklyInsights.tsx`
- `InsightsFeed.tsx`

---

## Demo Simulator Engine

### Purpose

Simulates live business operations without real integrations for demos.

### Architecture

```
User Action → EventStore → StateReducer → UI Update
                   ↑
            ScenarioLoader
```

### Files

| File | Purpose |
|------|---------|
| `eventStore.ts` | Append-only event log |
| `stateReducer.ts` | Event → State derivation |
| `scenarioData.ts` | Pre-defined scenarios |
| `useScenarioSimulator.ts` | Hook for scenario management |

### Scenarios

1. **Service** - Roofing/home services
2. **E-commerce** - Skincare brand
3. **Store** - Local café
4. **Hybrid** - Fitness studio + products

### Event Types

```typescript
type EventType =
  | "lead.created"
  | "message.sent"
  | "message.received"
  | "deal.updated"
  | "payment.received"
  | "experiment.started"
  | "experiment.scaled"
  | "calendar.suggested"
  | "invoice.sent"
  | "order.placed"
  | "cart.abandoned";
```

---

## Edge Functions

### Available Functions

| Function | Purpose | Endpoint |
|----------|---------|----------|
| `chat` | AI chat responses | `/functions/v1/chat` |
| `morning-briefing` | Daily summary | `/functions/v1/morning-briefing` |
| `send-push-notification` | Push notifications | `/functions/v1/send-push-notification` |
| `notification-dispatcher` | Route notifications | `/functions/v1/notification-dispatcher` |
| `text-to-speech` | TTS conversion | `/functions/v1/text-to-speech` |
| `create-test-users` | Test user setup | `/functions/v1/create-test-users` |

### Calling Edge Functions

```typescript
const { data, error } = await supabase.functions.invoke("function-name", {
  body: { key: "value" }
});
```

---

## Authentication & Authorization

### Auth Flow

```typescript
// Sign Up
await supabase.auth.signUp({ email, password });

// Sign In
await supabase.auth.signInWithPassword({ email, password });

// Sign Out
await supabase.auth.signOut();

// Get Session
const { data: { session } } = await supabase.auth.getSession();
```

### Role System

```typescript
type AppRole = "admin" | "moderator" | "user";

// Check role
const { data: role } = await supabase.rpc("get_user_role", {
  _user_id: userId
});

// Has role
const { data: hasAdmin } = await supabase.rpc("has_role", {
  _role: "admin",
  _user_id: userId
});
```

### Protected Routes

```typescript
<Route
  path="/admin"
  element={
    <ProtectedRoute requireAdmin>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

---

## Real-time Features

### Subscribing to Changes

```typescript
const channel = supabase
  .channel("metrics")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "realtime_metrics"
    },
    (payload) => {
      // Handle update
    }
  )
  .subscribe();

// Cleanup
return () => {
  supabase.removeChannel(channel);
};
```

### Enabled Tables

- `realtime_metrics`
- `activity_feed`
- `notifications`

---

## File Reference Guide

### Adding New Features

1. **New Component:**
   - Create in `src/components/`
   - Use `GlassCard` wrapper
   - Add Framer Motion animations
   - Use semantic color tokens

2. **New Page:**
   - Create in `src/pages/`
   - Add route in `App.tsx`
   - Use `ModuleLayout` wrapper

3. **New Hook:**
   - Create in `src/hooks/`
   - Prefix with `use`
   - Handle loading/error states

4. **Database Changes:**
   - Use migration tool
   - Add RLS policies
   - Update types (auto-generated)

5. **Edge Function:**
   - Create in `supabase/functions/`
   - Deploy automatically on commit

### Common Imports

```typescript
// UI Components
import { GlassCard } from "@/components/GlassCard";
import { MetricRing } from "@/components/MetricRing";
import { Button } from "@/components/ui/button";

// Icons
import { IconName } from "lucide-react";

// Animation
import { motion, AnimatePresence } from "framer-motion";

// Database
import { supabase } from "@/integrations/supabase/client";

// Utilities
import { cn } from "@/lib/utils";
```

---

## Maintenance Notes

### Files to Never Edit Manually

- `src/integrations/supabase/client.ts` (auto-generated)
- `src/integrations/supabase/types.ts` (auto-generated)
- `supabase/config.toml` (auto-managed)
- `.env` (auto-managed)

### Code Style Guidelines

1. Use TypeScript strict mode
2. Prefer functional components
3. Use semantic HTML
4. Add proper accessibility attributes
5. Keep components focused (<300 lines)
6. Extract reusable logic to hooks

---

## Quick Reference

### Start Development
```bash
npm run dev
```

### Run Tests
```bash
npm run test
```

### Type Check
```bash
npm run type-check
```

### Lint
```bash
npm run lint
```

---

*This document is maintained as the source of truth for the SITA platform architecture. Update it whenever significant changes are made.*