import { LevelConfig } from '../types';

/**
 * Returns the primary goal text for the current level.
 */
export const getGoalText = (level: LevelConfig): string => {
  return level.goalText;
};

/**
 * Returns the next hint in the sequence. 
 * Cycles back to the start if the user exhausts all hints.
 */
export const getNextHint = (level: LevelConfig, currentHintIndex: number): { nextIndex: number; hint: string } => {
  const hints = level.stepHints || [];
  
  if (hints.length === 0) {
    return { nextIndex: 0, hint: "Keep trying! You can do it." };
  }
  
  const nextIndex = (currentHintIndex + 1) % hints.length;
  return {
    nextIndex,
    hint: hints[nextIndex]
  };
};

/**
 * Determines specific feedback based on the result of the simulation.
 * 
 * 1. If a specific `mistakeId` is detected (e.g., 'OBSTACLE_HIT'), return the custom feedback for that error.
 * 2. If the mistake is unknown or null (generic failure), return a gentle nudge that includes the first hint.
 */
export const getFeedbackForMistake = (level: LevelConfig, mistakeId: string | null): string => {
  if (mistakeId) {
    const specificError = level.commonMistakes.find(m => m.id === mistakeId);
    if (specificError) {
      return specificError.feedbackText;
    }
  }

  // Fallback: Return a generic encouragement plus the first hint to help them get started
  const firstHint = level.stepHints?.[0];
  return "Not quite! Check your logic and try again. " + (firstHint ? `Tip: ${firstHint}` : "");
};