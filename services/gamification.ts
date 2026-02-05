import { Achievement, LearnerProfile, Lesson } from '../types';

/**
 * Achievement definitions
 */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-lesson',
    title: '🎯 First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    criteria: { completed: true },
    reward: { xp: 50, badge: 'first-steps' }
  },
  {
    id: 'first-loop',
    title: '🔁 Loop Master',
    description: 'Complete your first loop lesson',
    icon: '🔁',
    criteria: { lessonId: 'k-l4', completed: true },
    reward: { xp: 100, badge: 'loop-badge', unlocks: ['advanced-loops'] }
  },
  {
    id: 'no-hints',
    title: '🧠 Independent Thinker',
    description: 'Complete a lesson without using hints',
    icon: '🧠',
    criteria: { completed: true, hintsUsed: 0 },
    reward: { xp: 200, badge: 'brain-badge' }
  },
  {
    id: 'week-streak',
    title: '🔥 Week Warrior',
    description: 'Practice coding 7 days in a row',
    icon: '🔥',
    criteria: { streakDays: 7 },
    reward: { xp: 500, badge: 'fire-badge', unlocks: ['bonus-challenges'] }
  },
  {
    id: 'speed-demon',
    title: '⚡ Speed Demon',
    description: 'Complete 5 lessons in under 5 minutes each',
    icon: '⚡',
    criteria: { completed: true },
    reward: { xp: 300, badge: 'speed-badge' }
  },
  {
    id: 'perfectionist',
    title: '💯 Perfectionist',
    description: 'Complete 10 lessons with perfect scores',
    icon: '💯',
    criteria: { score: 100 },
    reward: { xp: 750, badge: 'perfect-badge' }
  }
];

/**
 * Gamification System
 * Manages XP, levels, and achievements
 */
export class GamificationService {
  private userId: string;
  private xp: number = 0;
  private level: number = 1;
  private achievements: string[] = [];
  private unlockedFeatures: string[] = [];

  // Level thresholds (XP needed for each level)
  private static LEVEL_THRESHOLDS = [
    0,      // Level 1
    100,    // Level 2
    250,    // Level 3
    500,    // Level 4
    1000,   // Level 5
    2000,   // Level 6
    3500,   // Level 7
    5500,   // Level 8
    8000,   // Level 9
    11000   // Level 10
  ];

  constructor(userId: string) {
    this.userId = userId;
    this.loadProgress();
  }

  /**
   * Load gamification progress from localStorage
   */
  private loadProgress(): void {
    const saved = localStorage.getItem(`gamification_${this.userId}`);
    if (saved) {
      const data = JSON.parse(saved);
      this.xp = data.xp || 0;
      this.level = data.level || 1;
      this.achievements = data.achievements || [];
      this.unlockedFeatures = data.unlockedFeatures || [];
    }
  }

  /**
   * Save progress to localStorage
   */
  private saveProgress(): void {
    localStorage.setItem(`gamification_${this.userId}`, JSON.stringify({
      xp: this.xp,
      level: this.level,
      achievements: this.achievements,
      unlockedFeatures: this.unlockedFeatures
    }));
  }

  /**
   * Award XP for an action
   */
  awardXP(amount: number, reason: string): { 
    xpAwarded: number; 
    newTotal: number; 
    leveledUp: boolean;
    newLevel?: number;
  } {
    const oldLevel = this.level;
    this.xp += amount;
    
    // Check for level up
    let leveledUp = false;
    let newLevel = this.level;
    
    while (
      this.level < GamificationService.LEVEL_THRESHOLDS.length &&
      this.xp >= GamificationService.LEVEL_THRESHOLDS[this.level]
    ) {
      this.level++;
      leveledUp = true;
      newLevel = this.level;
    }

    this.saveProgress();

    return {
      xpAwarded: amount,
      newTotal: this.xp,
      leveledUp,
      newLevel: leveledUp ? newLevel : undefined
    };
  }

  /**
   * Check and award achievements based on learner profile
   */
  checkAchievements(learnerProfile: LearnerProfile): Achievement[] {
    const newAchievements: Achievement[] = [];

    for (const achievement of ACHIEVEMENTS) {
      if (this.achievements.includes(achievement.id)) {
        continue; // Already earned
      }

      if (this.meetsCriteria(achievement, learnerProfile)) {
        this.achievements.push(achievement.id);
        
        // Award XP
        this.awardXP(achievement.reward.xp, `Achievement: ${achievement.title}`);
        
        // Unlock features
        if (achievement.reward.unlocks) {
          this.unlockedFeatures.push(...achievement.reward.unlocks);
        }
        
        newAchievements.push(achievement);
      }
    }

    if (newAchievements.length > 0) {
      this.saveProgress();
    }

    return newAchievements;
  }

  /**
   * Check if learner meets achievement criteria
   */
  private meetsCriteria(achievement: Achievement, profile: LearnerProfile): boolean {
    const criteria = achievement.criteria;

    // Check lesson-specific criteria
    if (criteria.lessonId) {
      const completed = profile.lessonsCompleted.includes(criteria.lessonId);
      if (criteria.completed && !completed) return false;
    }

    // Check streak
    if (criteria.streakDays && profile.streakDays < criteria.streakDays) {
      return false;
    }

    // Check hints used (for no-hints achievement)
    if (criteria.hintsUsed !== undefined) {
      const totalHints = Object.values(profile.hintsUsed).reduce((a, b) => a + b, 0);
      if (totalHints > criteria.hintsUsed) return false;
    }

    return true;
  }

  /**
   * Get current progress
   */
  getProgress(): {
    xp: number;
    level: number;
    xpToNextLevel: number;
    progressToNextLevel: number;
    achievements: string[];
    unlockedFeatures: string[];
  } {
    const nextLevelThreshold = GamificationService.LEVEL_THRESHOLDS[this.level] || Infinity;
    const currentLevelThreshold = GamificationService.LEVEL_THRESHOLDS[this.level - 1] || 0;
    const xpInCurrentLevel = this.xp - currentLevelThreshold;
    const xpNeededForLevel = nextLevelThreshold - currentLevelThreshold;
    const progressToNextLevel = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForLevel) * 100));

    return {
      xp: this.xp,
      level: this.level,
      xpToNextLevel: nextLevelThreshold - this.xp,
      progressToNextLevel,
      achievements: this.achievements,
      unlockedFeatures: this.unlockedFeatures
    };
  }

  /**
   * Get all achievements with earned status
   */
  getAllAchievements(): (Achievement & { earned: boolean })[] {
    return ACHIEVEMENTS.map(achievement => ({
      ...achievement,
      earned: this.achievements.includes(achievement.id)
    }));
  }

  /**
   * Award XP for completing a lesson
   */
  awardLessonXP(lesson: Lesson, hintsUsed: number, timeSpent: number): number {
    let xp = 50; // Base XP

    // Bonus for no hints
    if (hintsUsed === 0) {
      xp += 25;
    }

    // Bonus for speed (under 2 minutes)
    if (timeSpent < 120) {
      xp += 25;
    }

    // Difficulty bonus
    if (lesson.id.startsWith('k-l')) {
      xp += 0; // Kids level
    } else if (lesson.id.startsWith('t-l')) {
      xp += 10; // Tween level
    } else if (lesson.id.startsWith('tn-l')) {
      xp += 20; // Teen level
    } else if (lesson.id.startsWith('p-l')) {
      xp += 30; // Pro level
    }

    return xp;
  }
}

// Singleton instance
let gamificationService: GamificationService | null = null;

export function getGamificationService(userId: string): GamificationService {
  if (!gamificationService || gamificationService['userId'] !== userId) {
    gamificationService = new GamificationService(userId);
  }
  return gamificationService;
}


