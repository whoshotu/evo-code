import { Stage, Lesson, LearnerProfile, Achievement } from '../types';

/**
 * Adaptive Learning Engine
 * Personalizes the learning experience based on student performance
 */
export class AdaptiveLearningEngine {
  private learnerProfile: LearnerProfile;

  constructor(userId: string) {
    this.learnerProfile = this.loadProfile(userId);
  }

  /**
   * Load learner profile from localStorage or create new
   */
  private loadProfile(userId: string): LearnerProfile {
    const saved = localStorage.getItem(`learner_profile_${userId}`);
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Create default profile
    return {
      userId,
      currentStage: Stage.KIDS,
      lessonsCompleted: [],
      hintsUsed: {},
      attemptsPerLesson: {},
      timeSpentPerLesson: {},
      errorPatterns: {},
      difficultyLevel: 'medium',
      learningPace: 'moderate',
      preferredLearningStyle: 'visual',
      streakDays: 0,
      totalSessionTime: 0,
      lastActiveDate: new Date()
    };
  }

  /**
   * Save profile to localStorage
   */
  private saveProfile(): void {
    localStorage.setItem(
      `learner_profile_${this.learnerProfile.userId}`,
      JSON.stringify(this.learnerProfile)
    );
  }

  /**
   * Track lesson performance
   */
  trackPerformance(
    lessonId: string,
    metrics: {
      completed: boolean;
      hintsUsed: number;
      attempts: number;
      timeSpent: number; // seconds
      errors?: string[];
    }
  ): void {
    // Update hints used
    this.learnerProfile.hintsUsed[lessonId] = 
      (this.learnerProfile.hintsUsed[lessonId] || 0) + metrics.hintsUsed;
    
    // Update attempts
    this.learnerProfile.attemptsPerLesson[lessonId] = 
      (this.learnerProfile.attemptsPerLesson[lessonId] || 0) + metrics.attempts;
    
    // Update time spent
    this.learnerProfile.timeSpentPerLesson[lessonId] = 
      (this.learnerProfile.timeSpentPerLesson[lessonId] || 0) + metrics.timeSpent;
    
    // Track errors
    if (metrics.errors) {
      metrics.errors.forEach(error => {
        this.learnerProfile.errorPatterns[error] = 
          (this.learnerProfile.errorPatterns[error] || 0) + 1;
      });
    }

    // Mark as completed
    if (metrics.completed && !this.learnerProfile.lessonsCompleted.includes(lessonId)) {
      this.learnerProfile.lessonsCompleted.push(lessonId);
    }

    // Update streak
    this.updateStreak();
    
    // Adjust difficulty based on performance
    this.adjustDifficulty(lessonId);
    
    // Save profile
    this.saveProfile();
  }

  /**
   * Update daily streak
   */
  private updateStreak(): void {
    const today = new Date();
    const lastActive = new Date(this.learnerProfile.lastActiveDate);
    
    const diffTime = today.getTime() - lastActive.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      // Continued streak
      this.learnerProfile.streakDays++;
    } else if (diffDays > 1) {
      // Streak broken
      this.learnerProfile.streakDays = 1;
    }
    
    this.learnerProfile.lastActiveDate = today;
  }

  /**
   * Adjust difficulty level based on performance
   */
  private adjustDifficulty(lessonId: string): void {
    const attempts = this.learnerProfile.attemptsPerLesson[lessonId] || 0;
    const hints = this.learnerProfile.hintsUsed[lessonId] || 0;
    
    // If struggling (many attempts and hints)
    if (attempts >= 5 && hints >= 3) {
      this.learnerProfile.difficultyLevel = 'easy';
    }
    // If excelling (few attempts, no hints)
    else if (attempts <= 2 && hints === 0) {
      this.learnerProfile.difficultyLevel = 'hard';
    }
    // Otherwise stay at current level
  }

  /**
   * Get adaptive hint based on learner profile and attempt number
   */
  getAdaptiveHint(lesson: Lesson, attemptNumber: number): string {
    const hintsUsed = this.learnerProfile.hintsUsed[lesson.id] || 0;
    const difficultyLevel = this.learnerProfile.difficultyLevel;
    
    // Progressive hint disclosure
    if (attemptNumber === 1 && difficultyLevel === 'hard') {
      return "Think about the problem step by step. 💭";
    } else if (attemptNumber >= 3 || difficultyLevel === 'easy') {
      // Handle both string and object solutionExplanation
      const explanation = lesson.solutionExplanation;
      if (typeof explanation === 'object' && explanation !== null) {
        return explanation.simple || "Consider what blocks you have available. 🧩";
      }
      return explanation?.toString() || "Consider what blocks you have available. 🧩";
    } else {
      return "Consider the goal and what blocks you have available. 🎯";
    }
  }

  /**
   * Get personalized next lesson recommendation
   */
  getNextLesson(currentLesson: Lesson, allLessons: Lesson[]): Lesson | null {
    const performance = this.calculatePerformance(currentLesson);
    
    // Find current lesson index
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
    
    if (performance.score < 0.6) {
      // Struggling: Repeat current concept or get remedial
      return currentLesson;
    } else if (performance.score > 0.9 && performance.hintsUsed === 0) {
      // Excelling: Skip ahead if available
      const nextIndex = currentIndex + 1;
      if (nextIndex < allLessons.length) {
        return allLessons[nextIndex];
      }
    }
    
    // Standard progression
    const nextIndex = currentIndex + 1;
    return nextIndex < allLessons.length ? allLessons[nextIndex] : null;
  }

  /**
   * Calculate performance score for a lesson
   */
  private calculatePerformance(lesson: Lesson): {
    score: number;
    hintsUsed: number;
    timeSpent: number;
  } {
    const hints = this.learnerProfile.hintsUsed[lesson.id] || 0;
    const attempts = this.learnerProfile.attemptsPerLesson[lesson.id] || 0;
    const time = this.learnerProfile.timeSpentPerLesson[lesson.id] || 0;
    
    // Score based on hints and attempts (lower is better)
    let score = 1.0;
    score -= (hints * 0.1); // -10% per hint
    score -= (attempts * 0.05); // -5% per attempt
    score = Math.max(0, score); // Don't go below 0
    
    return { score, hintsUsed: hints, timeSpent: time };
  }

  /**
   * Get learning analytics
   */
  getAnalytics(): {
    totalLessonsCompleted: number;
    averageHintsPerLesson: number;
    averageAttemptsPerLesson: number;
    totalTimeSpent: number;
    streakDays: number;
    difficultyLevel: string;
    learningPace: string;
  } {
    const completed = this.learnerProfile.lessonsCompleted.length;
    const totalHints = Object.values(this.learnerProfile.hintsUsed).reduce((a, b) => a + b, 0);
    const totalAttempts = Object.values(this.learnerProfile.attemptsPerLesson).reduce((a, b) => a + b, 0);
    const totalTime = Object.values(this.learnerProfile.timeSpentPerLesson).reduce((a, b) => a + b, 0);
    
    return {
      totalLessonsCompleted: completed,
      averageHintsPerLesson: completed > 0 ? totalHints / completed : 0,
      averageAttemptsPerLesson: completed > 0 ? totalAttempts / completed : 0,
      totalTimeSpent: totalTime,
      streakDays: this.learnerProfile.streakDays,
      difficultyLevel: this.learnerProfile.difficultyLevel,
      learningPace: this.learnerProfile.learningPace
    };
  }
}

// Singleton instance
let adaptiveEngine: AdaptiveLearningEngine | null = null;

export function getAdaptiveEngine(userId: string): AdaptiveLearningEngine {
  if (!adaptiveEngine || adaptiveEngine['learnerProfile'].userId !== userId) {
    adaptiveEngine = new AdaptiveLearningEngine(userId);
  }
  return adaptiveEngine;
}
