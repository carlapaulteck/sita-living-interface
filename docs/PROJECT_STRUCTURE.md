# SITA Platform - Complete Project Structure

> **Last Updated:** January 2026  
> **Platform:** Neuro-Adaptive Life Operating System

---

## 📁 Root Directory

```
├── .env                    # Environment variables (auto-generated, DO NOT EDIT)
├── README.md               # Project overview and setup instructions
├── eslint.config.js        # ESLint configuration for code linting
├── index.html              # Main HTML entry point
├── tailwind.config.ts      # Tailwind CSS configuration with design tokens
├── vite.config.ts          # Vite build configuration
├── vitest.config.ts        # Vitest testing configuration
├── tsconfig.json           # TypeScript configuration (root)
├── tsconfig.app.json       # TypeScript config for app code
├── tsconfig.node.json      # TypeScript config for Node.js tooling
├── postcss.config.js       # PostCSS configuration
├── components.json         # shadcn/ui component configuration
├── package.json            # Dependencies and scripts (DO NOT EDIT DIRECTLY)
├── package-lock.json       # Dependency lock file
└── bun.lockb               # Bun package manager lock file
```

---

## 📁 `/docs` - Documentation

```
docs/
├── PROJECT_ARCHITECTURE.md  # High-level architecture overview
└── PROJECT_STRUCTURE.md     # This file - complete structure reference
```

---

## 📁 `/public` - Static Assets

```
public/
├── favicon.ico             # Browser tab icon
├── placeholder.svg         # Placeholder image for missing content
├── robots.txt              # Search engine crawler instructions
└── sw.js                   # Service Worker for PWA/push notifications
```

---

## 📁 `/src` - Source Code

### Core Files

```
src/
├── main.tsx                # Application entry point, React DOM render
├── App.tsx                 # Root component with routing configuration
├── App.css                 # Global CSS (minimal, most styles in index.css)
├── index.css               # Design system tokens, Tailwind base styles
└── vite-env.d.ts           # Vite environment type declarations
```

---

## 📁 `/src/assets` - Media Assets

```
src/assets/
├── avatar.jpg              # Default user avatar image
├── bg-particles.jpg        # Background particle effect image
└── logo.jpg                # SITA platform logo
```

---

## 📁 `/src/components` - React Components

### Core UI Components

| Component | Description |
|-----------|-------------|
| `ActivityLogger.tsx` | Logs and displays user activity events |
| `AdminDashboard.tsx` | Admin overview panel with system stats |
| `AdvancedAnalytics.tsx` | Deep analytics visualization dashboard |
| `AdvisorPanel.tsx` | AI advisor interface for recommendations |
| `AnnouncementBanner.tsx` | System-wide announcement display |
| `ArbitrageSignals.tsx` | Financial arbitrage opportunity alerts |
| `AutomationBuilder.tsx` | Visual automation rule creator |
| `AutomationHistoryLog.tsx` | History of automation executions |
| `AvatarBubble.tsx` | Animated avatar display component |
| `AvatarEmotions.tsx` | Avatar emotional state indicators |
| `AvatarHero.tsx` | Hero section with animated SITA avatar |
| `AvatarLipSync.tsx` | Lip sync animation for voice interactions |
| `BottomDock.tsx` | Mobile navigation dock with 6 modules |
| `BoundariesPanel.tsx` | User boundary/limit configuration |
| `CalendarSync.tsx` | External calendar integration UI |
| `ClientDashboard.tsx` | Client-facing dashboard view |
| `CognitiveBudgetVisualization.tsx` | Mental energy budget display |
| `CommandBar.tsx` | Global command palette (Cmd+K) |
| `ContextualTooltip.tsx` | Smart contextual help tooltips |
| `ConversationConsole.tsx` | Main chat interface with SITA |
| `ConversationHistoryPanel.tsx` | Past conversation browser |
| `DashboardTour.tsx` | Onboarding tour guide |
| `DemoModeIndicator.tsx` | Demo mode status badge |
| `DemoTutorial.tsx` | Interactive demo walkthrough |
| `DeviceIntegration.tsx` | IoT/wearable device connections |
| `DoNotDisturbPanel.tsx` | Focus mode configuration |
| `EnergyForecast.tsx` | Predicted energy levels chart |
| `EngineCard.tsx` | Cognitive engine status card |
| `ErrorBoundary.tsx` | React error boundary wrapper |
| `ExitReadiness.tsx` | Business exit planning dashboard |
| `ExperimentsDashboard.tsx` | A/B testing and experiments UI |
| `GlassCard.tsx` | Glassmorphism card component |
| `HabitTracker.tsx` | Daily habit tracking interface |
| `HaloRings.tsx` | Decorative animated halo rings |
| `Header.tsx` | Main application header |
| `HelpGuide.tsx` | Contextual help system |
| `HelpHint.tsx` | Inline help hint component |
| `InsightsFeed.tsx` | AI-generated insights stream |
| `IntegrationsHub.tsx` | Third-party integrations manager |
| `LiveEventFeed.tsx` | Real-time event stream |
| `LiveIndicator.tsx` | Live/online status indicator |
| `MarketingOS.tsx` | Marketing automation dashboard |
| `MemoryPanel.tsx` | SITA memory/context viewer |
| `MetricRing.tsx` | Circular metric visualization |
| `MetricSignalCard.tsx` | Key metric display card |
| `MicrobrandsPortfolio.tsx` | Business portfolio manager |
| `MobileBottomNav.tsx` | Mobile bottom navigation bar |
| `ModuleLayout.tsx` | Standard module page layout |
| `ModuleTile.tsx` | Dashboard module tile component |
| `MoneyFlow.tsx` | Cash flow visualization |
| `MoodAura.tsx` | Ambient mood indicator |
| `MorningBriefing.tsx` | Daily morning summary |
| `NavLink.tsx` | Navigation link component |
| `NeedsYouPanel.tsx` | Items requiring user attention |
| `NotificationBatchingPanel.tsx` | Notification grouping settings |
| `NotificationCenter.tsx` | Notification hub |
| `OnboardingFlow.tsx` | Complete onboarding wizard |
| `OperationsDashboard.tsx` | Business operations overview |
| `PersonalityModeSelector.tsx` | SITA personality configuration |
| `ProactiveAIContainer.tsx` | Proactive AI suggestions wrapper |
| `ProactiveAISuggestions.tsx` | AI-initiated recommendations |
| `ProactivePrompt.tsx` | Proactive prompt bubble |
| `ProfileCompletionPrompt.tsx` | Profile completion nudge |
| `ProtectedRoute.tsx` | Auth-protected route wrapper |
| `PushNotificationSettings.tsx` | Push notification preferences |
| `QuickActionsBar.tsx` | Quick action shortcuts |
| `QuickStatCard.tsx` | Compact stat display |
| `RealtimeMetrics.tsx` | Live updating metrics |
| `RecoveryMode.tsx` | Low-energy recovery interface |
| `RecoverySuggestions.tsx` | Recovery activity suggestions |
| `ScenarioSwitcher.tsx` | Demo scenario selector |
| `SignalCard.tsx` | Signal/alert card component |
| `SimulationPanel.tsx` | Business simulation tools |
| `SitaOrb3D.tsx` | 3D animated SITA orb (Three.js) |
| `SpeechWaveformVisualizer.tsx` | Voice input waveform display |
| `SupportTicketForm.tsx` | Support ticket submission |
| `TalkingAvatarMockup.tsx` | Avatar voice interaction mockup |
| `TrustControlsDashboard.tsx` | AI trust level configuration |
| `TrustSafeguards.tsx` | Safety guardrail settings |
| `UnifiedInbox.tsx` | Unified message inbox |
| `UserManagementTable.tsx` | Admin user management table |
| `VoiceWaveform.tsx` | Voice activity visualization |
| `WakeUpReceipt.tsx` | Daily wake-up summary |
| `WakeWordIndicator.tsx` | Wake word detection indicator |
| `WakeWordSettings.tsx` | Voice activation settings |
| `WarRoom.tsx` | Crisis management dashboard |
| `WeeklyInsights.tsx` | Weekly summary and insights |
| `WorkflowPacks.tsx` | Pre-built workflow templates |

---

### 📁 `/src/components/academy` - Academy Module

```
academy/
├── AcademyNotifications.tsx    # Academy-specific notifications
├── AcademySearch.tsx           # Content search across academy
├── CommentsThread.tsx          # Threaded comment system
├── CommunityFeed.tsx           # Social discussion feed
├── CourseCard.tsx              # Course preview card
├── CourseGrid.tsx              # Course catalog grid
├── CourseViewer.tsx            # Video/content player
├── CreatePostModal.tsx         # New post creation modal
├── EventsCalendar.tsx          # Community events calendar
├── Leaderboard.tsx             # Gamification leaderboard
├── MemberDirectory.tsx         # Community member list
├── PostCard.tsx                # Social post display
└── admin/
    ├── AdminPanel.tsx          # Admin control panel
    ├── AdminStats.tsx          # Admin analytics dashboard
    ├── BroadcastComposer.tsx   # Email/announcement composer
    ├── CourseBuilder.tsx       # Course creation tool
    ├── EventManager.tsx        # Event CRUD management
    └── GamificationSettings.tsx # Points/levels configuration
```

---

### 📁 `/src/components/admin` - Admin Components

```
admin/
├── AdminActivityFeed.tsx       # Admin action log
├── AdminLayout.tsx             # Admin page layout wrapper
├── OnboardingFunnelChart.tsx   # User funnel analytics
├── SystemHealthPanel.tsx       # System status monitor
└── UserAnalyticsWidget.tsx     # User behavior analytics
```

---

### 📁 `/src/components/agents` - AI Agent Components

```
agents/
├── AgentDashboard.tsx          # Agent overview and control
├── AgentSettings.tsx           # Agent configuration
├── AgentTimeline.tsx           # Agent activity timeline
└── OrchestrationView.tsx       # Multi-agent orchestration
```

---

### 📁 `/src/components/bioos` - BIO-OS Health Components

```
bioos/
├── BioCard.tsx                 # Health metric card
├── BioCommandCenter.tsx        # Central health dashboard
├── BioMetricRing.tsx           # Circular health metric
├── BioVault.tsx                # Health data storage
├── CoachTeam.tsx               # Virtual coaching team
├── MealPlanGenerator.tsx       # AI meal planning
├── NutritionStudio.tsx         # Nutrition tracking
├── RecoveryLab.tsx             # Recovery optimization
└── TrainingHub.tsx             # Workout management
```

---

### 📁 `/src/components/family` - Family Module

```
family/
├── FamilyCalendar.tsx          # Shared family calendar
├── FamilyHub.tsx               # Family dashboard
├── FamilyPreferences.tsx       # Family settings
├── PetCare.tsx                 # Pet management
└── ResponsibilityMatrix.tsx    # Chore/task assignment
```

---

### 📁 `/src/components/finance` - Finance Components

```
finance/
├── AutomatedSavings.tsx        # Auto-save rules
├── BillTracker.tsx             # Bill payment tracking
├── BudgetManager.tsx           # Budget creation/tracking
├── FinancialInsights.tsx       # AI financial analysis
├── InvestmentPortfolio.tsx     # Investment tracking
├── RetirementPlanning.tsx      # Retirement projections
├── SavingsGoals.tsx            # Savings goal tracker
├── SmartTransactionForm.tsx    # Smart transaction input
├── SpendingAlerts.tsx          # Spending limit alerts
├── SpendingForecast.tsx        # Predictive spending
├── TaxDashboard.tsx            # Tax overview
└── VoiceFinancialAdvisor.tsx   # Voice-based finance help
```

---

### 📁 `/src/components/healthcare` - Healthcare Components

```
healthcare/
├── HealthRecords.tsx           # Medical records manager
├── MedicationTracker.tsx       # Medication reminders
├── MentalWellness.tsx          # Mental health tracking
└── VaccineScheduler.tsx        # Vaccination tracking
```

---

### 📁 `/src/components/home` - Smart Home Components

```
home/
├── MaintenanceTracker.tsx      # Home maintenance log
├── PropertyDashboard.tsx       # Property management
├── SecurityOverview.tsx        # Home security status
└── SmartHomeControls.tsx       # IoT device controls
```

---

### 📁 `/src/components/intelligence` - Business Intelligence

```
intelligence/
├── MarketIntelligence.tsx      # Market research dashboard
├── RegulatoryMonitoring.tsx    # Compliance monitoring
├── SentimentDashboard.tsx      # Brand sentiment analysis
└── SupplyChainIntel.tsx        # Supply chain monitoring
```

---

### 📁 `/src/components/navigation` - Navigation Components

```
navigation/
├── QuickAccessPanel.tsx        # Quick module access grid
└── SmartHomeScreen.tsx         # Smart home navigation
```

---

### 📁 `/src/components/onboarding` - Onboarding System

```
onboarding/
├── ConfettiCelebration.tsx     # Completion celebration
├── KeyboardHints.tsx           # Keyboard shortcut hints
├── OnboardingContext.tsx       # Onboarding state context
├── OnboardingProgress.tsx      # Progress indicator
├── OnboardingRecoveryModal.tsx # Resume interrupted onboarding
├── SkipToEndModal.tsx          # Skip onboarding option
└── steps/
    ├── AdaptationPreviewStep.tsx    # AI adaptation preview
    ├── AssistantStyleStep.tsx       # SITA personality selection
    ├── AutomationsStep.tsx          # Automation preferences
    ├── AutonomyStep.tsx             # AI autonomy level
    ├── AvatarIdentityStep.tsx       # Avatar customization
    ├── ChangeToleranceStep.tsx      # Change tolerance setting
    ├── CinematicEntry.tsx           # Cinematic intro
    ├── DensityChoiceStep.tsx        # UI density preference
    ├── DevicesStep.tsx              # Device connections
    ├── EmotionalCalibrationStep.tsx # Emotional preferences
    ├── FocusPersonalizationStep.tsx # Focus preferences
    ├── GoalsStep.tsx                # Goal setting
    ├── HealthPersonalizationStep.tsx# Health preferences
    ├── ImprintStep.tsx              # User imprint creation
    ├── NameStep.tsx                 # User name input
    ├── ProgressStyleStep.tsx        # Progress display preference
    ├── RhythmStep.tsx               # Daily rhythm mapping
    ├── SafetyIntroStep.tsx          # Safety features intro
    ├── SelfRecognitionStep.tsx      # Cognitive self-assessment
    ├── SetupModeStep.tsx            # Setup mode selection
    ├── SovereigntyStep.tsx          # Data sovereignty intro
    ├── TaskStyleStep.tsx            # Task management style
    ├── TonePreferencesStep.tsx      # Communication tone
    ├── VoiceSettingsStep.tsx        # Voice interaction setup
    ├── WealthPersonalizationStep.tsx# Wealth preferences
    └── WinsStep.tsx                 # Recent wins capture
```

---

### 📁 `/src/components/ui` - shadcn/ui Components

Base UI components from shadcn/ui library:

```
ui/
├── accordion.tsx        ├── alert-dialog.tsx      ├── alert.tsx
├── aspect-ratio.tsx     ├── avatar.tsx            ├── badge.tsx
├── breadcrumb.tsx       ├── button.tsx            ├── calendar.tsx
├── card.tsx             ├── carousel.tsx          ├── chart.tsx
├── checkbox.tsx         ├── collapsible.tsx       ├── command.tsx
├── context-menu.tsx     ├── dialog.tsx            ├── drawer.tsx
├── dropdown-menu.tsx    ├── form.tsx              ├── hover-card.tsx
├── input-otp.tsx        ├── input.tsx             ├── label.tsx
├── menubar.tsx          ├── navigation-menu.tsx   ├── pagination.tsx
├── popover.tsx          ├── progress.tsx          ├── radio-group.tsx
├── resizable.tsx        ├── scroll-area.tsx       ├── select.tsx
├── separator.tsx        ├── sheet.tsx             ├── sidebar.tsx
├── skeleton.tsx         ├── slider.tsx            ├── sonner.tsx
├── switch.tsx           ├── table.tsx             ├── tabs.tsx
├── textarea.tsx         ├── toast.tsx             ├── toaster.tsx
├── toggle-group.tsx     ├── toggle.tsx            ├── tooltip.tsx
└── use-toast.ts
```

---

## 📁 `/src/contexts` - React Contexts

```
contexts/
├── AdaptationContext.tsx       # UI adaptation state
├── AvatarStateContext.tsx      # SITA avatar state
├── CognitiveContext.tsx        # Cognitive state management
├── PersonalityContext.tsx      # Personality mode context
└── WakeWordContext.tsx         # Voice activation context
```

---

## 📁 `/src/hooks` - Custom React Hooks

| Hook | Description |
|------|-------------|
| `use-mobile.tsx` | Mobile/responsive detection |
| `use-toast.ts` | Toast notification hook |
| `useAcademy.ts` | Academy data and actions |
| `useAgents.ts` | AI agent management |
| `useAudioAnalyzer.ts` | Audio processing for voice |
| `useAuditLogger.ts` | Action audit logging |
| `useAuth.ts` | Authentication state and actions |
| `useBioOS.ts` | Health/BIO-OS data |
| `useCalendarEvents.ts` | Calendar event management |
| `useCognitiveSignals.ts` | Cognitive signal tracking |
| `useCognitiveState.ts` | Cognitive state management |
| `useConversationHistory.ts` | Chat history management |
| `useConversationMemory.ts` | Conversation context memory |
| `useDoNotDisturb.ts` | DND mode management |
| `useFeatureFlag.ts` | Feature flag checking |
| `useFinance.ts` | Financial data management |
| `useHabitReminders.ts` | Habit reminder scheduling |
| `useHabits.ts` | Habit tracking |
| `useNotificationBatching.ts` | Notification grouping |
| `useNotifications.ts` | Notification management |
| `useOnboardingKeyboard.ts` | Onboarding keyboard shortcuts |
| `useOrchestratedChat.ts` | AI chat orchestration |
| `useProactiveConversation.ts` | Proactive AI suggestions |
| `usePushNotifications.ts` | Push notification handling |
| `useRealtimeSubscription.ts` | Supabase realtime subscriptions |
| `useScenarioSimulator.ts` | Demo scenario simulation |
| `useSwipeNavigation.ts` | Swipe gesture navigation |
| `useTextToSpeech.ts` | Text-to-speech synthesis |
| `useUserRole.ts` | User role/permission checking |
| `useVoiceRecognition.ts` | Speech recognition |
| `useWakeWord.ts` | Wake word detection |

---

## 📁 `/src/integrations` - External Integrations

```
integrations/
└── supabase/
    ├── client.ts           # Supabase client instance (DO NOT EDIT)
    └── types.ts            # Database types (DO NOT EDIT, auto-generated)
```

---

## 📁 `/src/lib` - Utility Libraries

| File | Description |
|------|-------------|
| `adaptiveTokens.ts` | Dynamic design token generation |
| `bioOSData.ts` | BIO-OS mock/demo data |
| `cognitiveBudgetLedger.ts` | Mental energy tracking logic |
| `cognitiveEngine.ts` | Cognitive state processing |
| `cognitiveOrchestrator.ts` | Multi-model AI orchestration |
| `cognitiveProfileBuilder.ts` | User cognitive profile builder |
| `demoData.ts` | Demo mode mock data |
| `eventStore.ts` | Event sourcing store |
| `evolutionEngine.ts` | User pattern evolution |
| `personalizationEngine.ts` | Personalization logic |
| `scenarioData.ts` | Demo scenario definitions |
| `stateReducer.ts` | Global state reducer |
| `userPreferences.ts` | User preference management |
| `utils.ts` | General utility functions (cn, etc.) |

---

## 📁 `/src/pages` - Route Pages

### Main Module Pages

| Page | Route | Description |
|------|-------|-------------|
| `Index.tsx` | `/` | Main dashboard home |
| `Auth.tsx` | `/auth` | Login/signup page |
| `BusinessGrowth.tsx` | `/business` | Business OS module |
| `PersonalAssistant.tsx` | `/assistant` | Personal Assistant (VA) module |
| `Finance.tsx` | `/finance` | Personal Finance module |
| `HealthFitness.tsx` | `/health` | Health & Fitness module |
| `Mindset.tsx` | `/mindset` | Mindset module |
| `Academy.tsx` | `/academy` | Community & Education module |

### Additional Pages

| Page | Route | Description |
|------|-------|-------------|
| `Agents.tsx` | `/agents` | AI agents management |
| `Automations.tsx` | `/automations` | Automation rules |
| `BioOS.tsx` | `/bioos` | BIO-OS health system |
| `Family.tsx` | `/family` | Family management |
| `Healthcare.tsx` | `/healthcare` | Healthcare records |
| `HomeIntelligence.tsx` | `/home-intelligence` | Smart home control |
| `Intelligence.tsx` | `/intelligence` | Business intelligence |
| `LifeHealth.tsx` | `/life-health` | Life/health overview |
| `MindGrowth.tsx` | `/mind-growth` | Personal growth |
| `Settings.tsx` | `/settings` | User settings |
| `Sovereignty.tsx` | `/sovereignty` | Data sovereignty |
| `NotFound.tsx` | `*` | 404 error page |

### Admin Pages

```
pages/admin/
├── index.ts                    # Admin exports barrel
├── AdminAnnouncementsPage.tsx  # System announcements
├── AdminAuditLogsPage.tsx      # Audit log viewer
├── AdminDashboardPage.tsx      # Admin home dashboard
├── AdminErrorLogsPage.tsx      # Error log viewer
├── AdminFeatureFlagsPage.tsx   # Feature flag management
├── AdminSettingsPage.tsx       # Admin settings
├── AdminSubscriptionsPage.tsx  # Subscription management
├── AdminTicketsPage.tsx        # Support ticket management
└── AdminUsersPage.tsx          # User management
```

---

## 📁 `/src/test` - Test Files

```
test/
├── example.test.ts             # Example test file
└── setup.ts                    # Test setup/configuration
```

---

## 📁 `/src/types` - TypeScript Types

```
types/
├── academy.ts                  # Academy-related types
├── automations.ts              # Automation types
└── onboarding.ts               # Onboarding step types
```

---

## 📁 `/supabase` - Backend Configuration

```
supabase/
├── config.toml                 # Supabase project config (DO NOT EDIT)
└── functions/                  # Edge Functions
    ├── chat/
    │   └── index.ts            # AI chat endpoint
    ├── create-test-users/
    │   └── index.ts            # Test user creation
    ├── generate-meal-plan/
    │   └── index.ts            # AI meal plan generation
    ├── morning-briefing/
    │   └── index.ts            # Daily briefing generation
    ├── notification-dispatcher/
    │   └── index.ts            # Push notification dispatch
    ├── semantic-memory-search/
    │   └── index.ts            # Vector memory search
    ├── send-push-notification/
    │   └── index.ts            # Push notification sender
    └── text-to-speech/
        └── index.ts            # TTS synthesis endpoint
```

---

## 🗄️ Database Schema Overview

The platform uses **50+ database tables** organized by domain:

### Core Tables
- `profiles` - User profiles
- `subscriptions` - Subscription management
- `notifications` - User notifications
- `push_subscriptions` - Push notification tokens

### Cognitive System
- `cognitive_profiles` - User cognitive preferences
- `cognitive_states` - Real-time cognitive state
- `cognitive_signals` - Behavioral signals
- `cognitive_budget_log` - Energy expenditure tracking

### Academy/Community
- `academy_courses` - Course definitions
- `course_lessons` - Lesson content
- `community_posts` - Social posts
- `post_comments` - Comment threads
- `member_points` - Gamification points
- `community_events` - Calendar events

### Finance
- `finance_transactions` - Transaction records
- `finance_budgets` - Budget definitions
- `finance_investments` - Investment tracking
- `savings_goals` - Savings goals
- `bills` - Bill tracking
- `spending_alerts` - Spending notifications

### Health/BIO-OS
- `bio_profiles` - Health profiles
- `meal_plans` - Meal planning
- `food_logs` - Nutrition logging
- `recovery_metrics` - Recovery tracking
- `habits` - Habit definitions
- `habit_completions` - Habit tracking

### Conversation/AI
- `conversations` - Chat sessions
- `conversation_messages` - Chat messages
- `conversation_contexts` - Context memory
- `personalization_profiles` - Deep personalization

### Admin
- `audit_logs` - Admin action logs
- `error_logs` - System errors
- `feature_flags` - Feature toggles
- `admin_announcements` - System announcements
- `support_tickets` - Support requests

---

## 🎨 Design System

### Color Tokens (HSL)
Defined in `src/index.css`:

- `--background` / `--foreground` - Base colors
- `--primary` / `--primary-foreground` - Brand colors
- `--secondary` - Secondary accent
- `--accent` - Highlight color
- `--muted` - Subdued elements
- `--destructive` - Error/danger states
- `--card` / `--popover` - Container colors
- `--border` / `--ring` - Border colors

### Custom Properties
- `--gradient-primary` - Brand gradient
- `--shadow-elegant` - Elevated shadow
- `--glass-blur` - Glassmorphism blur

---

## 📱 Module Routes Summary

| Module | Route | Icon |
|--------|-------|------|
| Business OS | `/business` | Briefcase |
| Personal Assistant | `/assistant` | Bot |
| Personal Finance | `/finance` | Wallet |
| Health & Fitness | `/health` | HeartPulse |
| Mindset | `/mindset` | Brain |
| Community & Education | `/academy` | GraduationCap |

---

## 🔐 Authentication Flow

1. User visits protected route
2. `ProtectedRoute` checks `useAuth()` state
3. Redirects to `/auth` if not authenticated
4. Demo mode available via `localStorage.sita_demo_mode`
5. Supabase handles session persistence

---

## 📦 Key Dependencies

- **React 18** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Framer Motion** - Animations
- **Three.js** - 3D graphics
- **Recharts** - Charts
- **TanStack Query** - Data fetching
- **Supabase** - Backend (via Lovable Cloud)
- **React Router** - Routing

---

*This document is maintained alongside the codebase and should be updated when significant structural changes are made.*
