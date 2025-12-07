
import { LevelConfig } from '../types';

export const KIDS_LEVELS: Record<string, LevelConfig> = {
  'k-l1': {
    id: 'k-l1',
    stage: 'kids',
    goalText: "Help the Bee fly straight to the flower!",
    stepHints: [
      "The flower is 3 steps away.",
      "You need to use the 'Move Forward' block multiple times.",
      "Try counting the squares between the Bee and the Flower."
    ],
    commonMistakes: [
      {
        id: 'OVERSHOOT',
        description: 'Moved too many times',
        feedbackText: "Whoops! You flew past the flower. Try counting the squares again!"
      },
      {
        id: 'UNDERSHOOT',
        description: 'Stopped short',
        feedbackText: "Almost there! You need just a few more steps to reach it."
      }
    ],
    successMessage: "Great job! You learned how to sequence commands!"
  },
  'k-l2': {
    id: 'k-l2',
    stage: 'kids',
    goalText: "The flower is hiding! Walk, Turn, then Walk again.",
    stepHints: [
      "The Bee is facing the wrong way to start.",
      "First walk to the corner, then use a 'Turn' block.",
      "Make sure you turn towards the flower, not away from it!"
    ],
    commonMistakes: [
      {
        id: 'WRONG_TURN',
        description: ' turned left instead of right',
        feedbackText: "Oh no! You turned the wrong way. Try turning the other direction."
      },
      {
        id: 'EARLY_TURN',
        description: 'Turned before reaching intersection',
        feedbackText: "You turned too early! Walk all the way to the corner first."
      }
    ],
    successMessage: "Fantastic! You mastered orientation and turning!"
  },
  'k-l3': {
    id: 'k-l3',
    stage: 'kids',
    goalText: "Navigate the asteroid field! Don't crash!",
    stepHints: [
      "Plan your path carefully around the rocks.",
      "You might need to turn more than once.",
      "Visualize the path with your finger before dragging blocks."
    ],
    commonMistakes: [
      {
        id: 'OBSTACLE_HIT',
        description: 'Crashed into rock',
        feedbackText: "Crash! That rock is solid. Try to go around it."
      },
      {
        id: 'LOOP_INFINITE',
        description: 'Stuck in circle',
        feedbackText: "You seem to be going in circles. Check your turn blocks!"
      }
    ],
    successMessage: "Mission Accomplished! You are a master navigator!"
  },
  'k-l4': {
    id: 'k-l4',
    stage: 'kids',
    goalText: "Use the Magic Loop to fly fast!",
    stepHints: [
      "The flower is far away.",
      "The Orange 'Repeat' block moves you 3 steps at once!",
      "You might need to add a normal 'Move' block to finish the journey."
    ],
    commonMistakes: [
      {
        id: 'UNDERSHOOT',
        description: 'Used only repeat',
        feedbackText: "You moved 3 steps, but you need 4! Add one more Move."
      }
    ],
    successMessage: "Speedy! You used a loop to move faster!"
  },
  'k-l5': {
    id: 'k-l5',
    stage: 'kids',
    goalText: "Zoom to the corner! Use loops for speed.",
    stepHints: [
      "First, zoom forward with the Repeat block.",
      "Then turn towards the flower.",
      "Zoom again with another Repeat block!"
    ],
    commonMistakes: [
      {
        id: 'WRONG_TURN',
        description: 'Wrong turn',
        feedbackText: "Check your turn direction!"
      },
      {
        id: 'OVERSHOOT',
        description: 'Too far',
        feedbackText: "Did you use too many loops?"
      }
    ],
    successMessage: "Double Loop! You are a coding wizard!"
  }
};