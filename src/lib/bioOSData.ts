// Demo data for BIO-OS Health Module

export type BioMode = 'BUILD' | 'RECOVER' | 'CUT' | 'FOCUS';

export const bioModeConfig: Record<BioMode, { gradient: string; description: string; color: string }> = {
  BUILD: { 
    gradient: 'from-amber-500 to-orange-600', 
    description: 'Muscle building & strength focus',
    color: 'amber'
  },
  RECOVER: { 
    gradient: 'from-cyan-500 to-blue-600', 
    description: 'Rest, repair & regeneration',
    color: 'cyan'
  },
  CUT: { 
    gradient: 'from-purple-500 to-pink-600', 
    description: 'Fat loss & definition phase',
    color: 'purple'
  },
  FOCUS: { 
    gradient: 'from-emerald-500 to-green-600', 
    description: 'Mental clarity & productivity',
    color: 'emerald'
  }
};

export interface LabResult {
  id: string;
  analyte: string;
  value: number;
  unit: string;
  refLow: number;
  refHigh: number;
  previousValue?: number;
  date: string;
  category: string;
}

export interface HealthDocument {
  id: string;
  type: 'lab_report' | 'imaging' | 'visit' | 'other';
  title: string;
  date: string;
  provider?: string;
  summary?: string;
  status: 'processed' | 'processing' | 'needs_review';
}

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  ingredients: string[];
  imageUrl?: string;
}

export interface Workout {
  id: string;
  name: string;
  type: 'strength' | 'cardio' | 'mobility' | 'hiit' | 'recovery';
  duration: number;
  exercises: Exercise[];
  scheduledFor: string;
  completed: boolean;
  intensity: 'low' | 'moderate' | 'high' | 'max';
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  weight?: string;
  rest: string;
  notes?: string;
}

export interface CoachMessage {
  id: string;
  role: 'strength' | 'nutrition' | 'recovery' | 'safety';
  content: string;
  timestamp: string;
  citations?: string[];
}

// Demo Lab Results
export const demoLabResults: LabResult[] = [
  { id: '1', analyte: 'Total Cholesterol', value: 185, unit: 'mg/dL', refLow: 0, refHigh: 200, previousValue: 210, date: '2024-01-15', category: 'Lipid Panel' },
  { id: '2', analyte: 'LDL Cholesterol', value: 108, unit: 'mg/dL', refLow: 0, refHigh: 100, previousValue: 128, date: '2024-01-15', category: 'Lipid Panel' },
  { id: '3', analyte: 'HDL Cholesterol', value: 62, unit: 'mg/dL', refLow: 40, refHigh: 100, previousValue: 55, date: '2024-01-15', category: 'Lipid Panel' },
  { id: '4', analyte: 'Triglycerides', value: 95, unit: 'mg/dL', refLow: 0, refHigh: 150, previousValue: 120, date: '2024-01-15', category: 'Lipid Panel' },
  { id: '5', analyte: 'Fasting Glucose', value: 92, unit: 'mg/dL', refLow: 70, refHigh: 100, previousValue: 88, date: '2024-01-15', category: 'Metabolic' },
  { id: '6', analyte: 'HbA1c', value: 5.4, unit: '%', refLow: 0, refHigh: 5.7, previousValue: 5.6, date: '2024-01-15', category: 'Metabolic' },
  { id: '7', analyte: 'Vitamin D', value: 45, unit: 'ng/mL', refLow: 30, refHigh: 100, previousValue: 28, date: '2024-01-15', category: 'Vitamins' },
  { id: '8', analyte: 'Testosterone', value: 650, unit: 'ng/dL', refLow: 300, refHigh: 1000, previousValue: 580, date: '2024-01-15', category: 'Hormones' },
  { id: '9', analyte: 'TSH', value: 2.1, unit: 'mIU/L', refLow: 0.4, refHigh: 4.0, previousValue: 2.3, date: '2024-01-15', category: 'Thyroid' },
  { id: '10', analyte: 'Ferritin', value: 85, unit: 'ng/mL', refLow: 30, refHigh: 300, previousValue: 72, date: '2024-01-15', category: 'Iron' }
];

// Demo Health Documents
export const demoDocuments: HealthDocument[] = [
  { id: '1', type: 'lab_report', title: 'Comprehensive Metabolic Panel', date: '2024-01-15', provider: 'Quest Diagnostics', status: 'processed', summary: 'All markers within normal range. LDL improved by 16%.' },
  { id: '2', type: 'lab_report', title: 'Lipid Panel', date: '2024-01-15', provider: 'Quest Diagnostics', status: 'processed', summary: 'Cholesterol levels improved since last test.' },
  { id: '3', type: 'imaging', title: 'DEXA Body Composition Scan', date: '2024-01-10', provider: 'BodySpec', status: 'processed', summary: 'Body fat: 18.2%, Lean mass: 156 lbs' },
  { id: '4', type: 'visit', title: 'Annual Physical', date: '2024-01-05', provider: 'Dr. Smith', status: 'processed', summary: 'Overall health excellent. Continue current protocol.' },
  { id: '5', type: 'lab_report', title: 'Hormone Panel', date: '2023-12-01', provider: 'LabCorp', status: 'processed', summary: 'Testosterone and thyroid markers optimal.' }
];

// Demo Meal Plan
export const demoMeals: Record<string, Meal[]> = {
  'Monday': [
    { id: 'm1', name: 'Greek Yogurt Parfait', type: 'breakfast', calories: 420, protein: 32, carbs: 45, fat: 12, time: '7:30 AM', ingredients: ['Greek yogurt', 'Mixed berries', 'Granola', 'Honey'] },
    { id: 'm2', name: 'Grilled Chicken Salad', type: 'lunch', calories: 550, protein: 45, carbs: 25, fat: 28, time: '12:30 PM', ingredients: ['Chicken breast', 'Mixed greens', 'Avocado', 'Olive oil dressing'] },
    { id: 'm3', name: 'Salmon with Quinoa', type: 'dinner', calories: 680, protein: 48, carbs: 42, fat: 32, time: '7:00 PM', ingredients: ['Wild salmon', 'Quinoa', 'Roasted vegetables', 'Lemon butter'] }
  ],
  'Tuesday': [
    { id: 'm4', name: 'Protein Oatmeal', type: 'breakfast', calories: 450, protein: 28, carbs: 55, fat: 14, time: '7:30 AM', ingredients: ['Oats', 'Whey protein', 'Banana', 'Almond butter'] },
    { id: 'm5', name: 'Turkey Wrap', type: 'lunch', calories: 520, protein: 38, carbs: 42, fat: 22, time: '12:30 PM', ingredients: ['Whole wheat wrap', 'Turkey', 'Hummus', 'Spinach'] },
    { id: 'm6', name: 'Lean Beef Stir-Fry', type: 'dinner', calories: 620, protein: 42, carbs: 48, fat: 24, time: '7:00 PM', ingredients: ['Lean beef', 'Brown rice', 'Mixed vegetables', 'Teriyaki sauce'] }
  ]
};

// Demo Workouts
export const demoWorkouts: Workout[] = [
  {
    id: 'w1',
    name: 'Push Day - Chest & Shoulders',
    type: 'strength',
    duration: 60,
    scheduledFor: 'Monday',
    completed: false,
    intensity: 'high',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: '8-10', weight: '185 lbs', rest: '90s' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', weight: '65 lbs', rest: '75s' },
      { name: 'Overhead Press', sets: 4, reps: '8-10', weight: '95 lbs', rest: '90s' },
      { name: 'Lateral Raises', sets: 3, reps: '12-15', weight: '20 lbs', rest: '60s' },
      { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', weight: '50 lbs', rest: '60s' }
    ]
  },
  {
    id: 'w2',
    name: 'Pull Day - Back & Biceps',
    type: 'strength',
    duration: 55,
    scheduledFor: 'Tuesday',
    completed: false,
    intensity: 'high',
    exercises: [
      { name: 'Deadlift', sets: 4, reps: '5-6', weight: '275 lbs', rest: '120s' },
      { name: 'Pull-Ups', sets: 4, reps: '8-10', weight: 'BW', rest: '90s' },
      { name: 'Barbell Rows', sets: 3, reps: '8-10', weight: '155 lbs', rest: '90s' },
      { name: 'Face Pulls', sets: 3, reps: '15-20', weight: '40 lbs', rest: '60s' },
      { name: 'Barbell Curls', sets: 3, reps: '10-12', weight: '65 lbs', rest: '60s' }
    ]
  },
  {
    id: 'w3',
    name: 'Leg Day',
    type: 'strength',
    duration: 65,
    scheduledFor: 'Wednesday',
    completed: false,
    intensity: 'max',
    exercises: [
      { name: 'Squats', sets: 4, reps: '6-8', weight: '225 lbs', rest: '120s' },
      { name: 'Romanian Deadlifts', sets: 3, reps: '10-12', weight: '185 lbs', rest: '90s' },
      { name: 'Leg Press', sets: 3, reps: '12-15', weight: '360 lbs', rest: '90s' },
      { name: 'Walking Lunges', sets: 3, reps: '12 each', weight: '50 lbs', rest: '75s' },
      { name: 'Calf Raises', sets: 4, reps: '15-20', weight: '180 lbs', rest: '60s' }
    ]
  },
  {
    id: 'w4',
    name: 'Active Recovery',
    type: 'recovery',
    duration: 30,
    scheduledFor: 'Thursday',
    completed: false,
    intensity: 'low',
    exercises: [
      { name: 'Foam Rolling', sets: 1, reps: '10 min', rest: '-' },
      { name: 'Dynamic Stretching', sets: 1, reps: '10 min', rest: '-' },
      { name: 'Light Walking', sets: 1, reps: '10 min', rest: '-' }
    ]
  },
  {
    id: 'w5',
    name: 'HIIT Cardio',
    type: 'hiit',
    duration: 25,
    scheduledFor: 'Friday',
    completed: false,
    intensity: 'high',
    exercises: [
      { name: 'Warm-Up', sets: 1, reps: '5 min', rest: '-' },
      { name: 'Sprint Intervals', sets: 8, reps: '30s on / 30s off', rest: '-' },
      { name: 'Cool-Down', sets: 1, reps: '5 min', rest: '-' }
    ]
  }
];

// Demo Coach Messages
export const demoCoachMessages: CoachMessage[] = [
  {
    id: 'c1',
    role: 'strength',
    content: "Based on your recovery score of 85%, you're cleared for today's push workout. Your volume load has been progressing well - consider adding 5 lbs to your bench press.",
    timestamp: '8:00 AM',
    citations: ['Recovery Score: 85%', 'Last session: 180 lbs x 10']
  },
  {
    id: 'c2',
    role: 'nutrition',
    content: "Your protein intake has been optimal at 175g daily. For your BUILD phase, I recommend increasing carbs slightly on training days to support performance.",
    timestamp: '8:15 AM',
    citations: ['7-day avg protein: 175g', 'Goal: 1g/lb bodyweight']
  },
  {
    id: 'c3',
    role: 'recovery',
    content: "Sleep quality has improved 12% this week. Your HRV trend suggests good adaptation. Consider 10 minutes of mobility work before today's session.",
    timestamp: '8:30 AM',
    citations: ['HRV: 62ms (+8%)', 'Sleep: 7.5h avg']
  },
  {
    id: 'c4',
    role: 'safety',
    content: "All protocols verified. No contraindications detected. Your recent bloodwork shows optimal recovery markers. Proceed with planned intensity.",
    timestamp: '8:45 AM',
    citations: ['Cortisol: normal', 'CRP: <1 mg/L']
  }
];

// Daily Stats
export interface DailyStats {
  recoveryScore: number;
  fuelStatus: number;
  trainingLoad: number;
  stressLevel: number;
  sleepScore: number;
  hydration: number;
}

export const demoDailyStats: DailyStats = {
  recoveryScore: 85,
  fuelStatus: 72,
  trainingLoad: 68,
  stressLevel: 28,
  sleepScore: 88,
  hydration: 75
};

// Macro Targets
export interface MacroTargets {
  calories: { target: number; current: number };
  protein: { target: number; current: number };
  carbs: { target: number; current: number };
  fat: { target: number; current: number };
}

export const demoMacroTargets: MacroTargets = {
  calories: { target: 2800, current: 1890 },
  protein: { target: 180, current: 125 },
  carbs: { target: 320, current: 210 },
  fat: { target: 85, current: 58 }
};
