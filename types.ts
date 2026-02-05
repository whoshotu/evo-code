
export enum Stage {
  KIDS = 'KIDS',       // Stage 1: Drag & Drop
  TWEEN = 'TWEEN',     // Stage 2: Scratch-like + Preview
  TEEN = 'TEEN',       // Stage 3: Simplified Code + AI Helpers
  PRO = 'PRO'          // Stage 4: Full IDE
}

export type Language = 'en' | 'es' | 'fr' | 'zh';

export interface UserState {
  age: number;
  xp: number;
  stage: Stage;
  streak: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type BlockAction = "Move Forward" | "Turn Right" | "Turn Left" | "Repeat 3 Times";

export interface ChatEntry {
  id: string;
  role: 'tutor' | 'user';
  content: string; // For tutor: text. For user: JSON string of blocks or text representation
  type: 'text' | 'blocks';
  isLatest?: boolean; // To allow interaction with the most recent block sequence
}

export interface CodeContext {
  code: string;
  language: string;
  task: string;
}

export interface GridConfig {
  gridSize: number; // e.g. 5 for a 5x5 grid
  startPos: [number, number]; // [row, col]
  goalPos: [number, number];
  obstacles?: [number, number][];
  avatarEmoji?: string;
  goalEmoji?: string;
  backgroundTheme?: 'grass' | 'space' | 'castle';
}

export interface Lesson {
  id: string;
  title: string;
  description: string; // The "Problem"
  task: string; // The specific instruction
  solutionExplanation?: string | {
    simple: string;
    detailed: string;
    conceptual: string;
  }; // Educational context - can be string or object for enhanced explanations
  gridConfig?: GridConfig; // For visual stages
  
  // ENHANCED EDUCATIONAL FEATURES
  // Learning scaffolds
  scaffolds?: {
    preLesson?: {
      type: 'animation' | 'video' | 'demo';
      content: string;
      duration?: number; // seconds
    };
    duringLesson?: {
      visualAids?: string[];
      audioNarration?: boolean;
      highlightAvailableBlocks?: boolean;
    };
    postLesson?: {
      reflection?: string;
      celebration?: string;
    };
  };
  
  // Differentiated success criteria
  successCriteria?: {
    minimum: {
      description: string;
      blocks?: number;
      hints: number;
    };
    proficient?: {
      description: string;
      blocks?: number;
      hints: number;
    };
    advanced?: {
      description: string;
      blocks?: number;
      hints: number;
    };
  };
  
  // Formative assessment checkpoints
  checkpoints?: {
    afterAttempts: number;
    question: string;
    options: string[];
    correctAnswer: string;
    feedback: {
      correct: string;
      incorrect: string;
    };
  }[];
  
  // Real-world connections
  realWorldConnection?: {
    example: string;
    relatable: string;
    career?: string;
  };
  
  // Prerequisites
  prerequisites?: {
    concepts: string[];
    lessons: string[];
    minimumScore?: number;
  };
  
  // Extension activities
  extensions?: {
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

// --- NEW TEACHING CONFIG TYPES ---

export type LevelConfig = {
  id: string;
  stage: "kids" | "teen" | "pro" | "lateStarter";
  goalText: string;          // 1 clear sentence, age-appropriate
  stepHints: string[];       // 2–4 ordered hints
  commonMistakes: {
    id: string;
    description: string;     // what the learner did wrong
    feedbackText: string;    // specific, encouraging feedback
  }[];
  successMessage: string;    // specific praise naming the concept
};

// --- ADAPTIVE LEARNING TYPES ---

export interface LearnerProfile {
  userId: string;
  currentStage: Stage;
  
  // Performance metrics
  lessonsCompleted: string[];
  hintsUsed: Record<string, number>;
  attemptsPerLesson: Record<string, number>;
  timeSpentPerLesson: Record<string, number>;
  errorPatterns: Record<string, number>;
  
  // Adaptive parameters
  difficultyLevel: 'easy' | 'medium' | 'hard';
  learningPace: 'slow' | 'moderate' | 'fast';
  preferredLearningStyle: 'visual' | 'textual' | 'auditory' | 'kinesthetic';
  
  // Engagement metrics
  streakDays: number;
  totalSessionTime: number;
  lastActiveDate: Date;
}

// --- ACHIEVEMENT SYSTEM TYPES ---

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  criteria: AchievementCriteria;
  reward: {
    xp: number;
    badge: string;
    unlocks?: string[];
  };
}

export interface AchievementCriteria {
  lessonId?: string;
  completed?: boolean;
  hintsUsed?: number;
  streakDays?: number;
  score?: number;
  custom?: (profile: LearnerProfile) => boolean;
}
