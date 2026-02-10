
import { LevelConfig } from '../types';

export const KIDS_LEVELS: Record<string, LevelConfig> = {
  'k-l1': {
    id: 'k-l1',
    stage: 'kids',
    goalText: "Program the game character to reach the finish line!",
    stepHints: [
      "The goal is 3 steps ahead.",
      "Use 'Move' blocks to walk forward.",
      "Think of it like pressing the forward button in a game!"
    ],
    commonMistakes: [
      {
        id: 'OVERSHOOT',
        description: 'Moved too far',
        feedbackText: "Whoops! You walked past the finish line. Count the steps!"
      },
      {
        id: 'UNDERSHOOT',
        description: 'Stopped too early',
        feedbackText: "Almost! The goal is just a few more steps ahead."
      }
    ],
    successMessage: "Level 1 Complete! You learned sequencing - just like real games!"
  },
  'k-l2': {
    id: 'k-l2',
    stage: 'kids',
    goalText: "Turn the corner to reach the goal!",
    stepHints: [
      "Walk straight first.",
      "Then use a Turn block to face the goal.",
      "Finally, walk towards it!"
    ],
    commonMistakes: [
      {
        id: 'WRONG_TURN',
        description: 'Turned the wrong direction',
        feedbackText: "Oops! You turned away from the goal. Try the other direction."
      }
    ],
    successMessage: "You navigated like a pro! Direction matters in games!"
  },
  'k-l3': {
    id: 'k-l3',
    stage: 'kids',
    goalText: "Navigate the map and avoid obstacles!",
    stepHints: [
      "Plan your route BEFORE you start coding.",
      "Obstacles block your path - go around them!",
      "This is like navigating in Fortnite or Roblox!"
    ],
    commonMistakes: [
      {
        id: 'OBSTACLE_HIT',
        description: 'Hit an obstacle',
        feedbackText: "Crash! Plan a route around that obstacle!"
      }
    ],
    successMessage: "Map cleared! You learned pathfinding - used in every game!"
  },
  'k-l4': {
    id: 'k-l4',
    stage: 'kids',
    goalText: "Use the Speed Repeat block - it's WAY faster!",
    stepHints: [
      "The goal is far away.",
      "Instead of using Move 10 times, use ONE Repeat block!",
      "This is how apps automate repetitive work."
    ],
    commonMistakes: [
      {
        id: 'OVERSHOOT',
        description: 'Used too many loops',
        feedbackText: "You moved too far. Adjust your Repeat number or add fewer blocks!"
      }
    ],
    successMessage: "Speed runner! Loops are how TikTok plays videos automatically!"
  },
  'k-l5': {
    id: 'k-l5',
    stage: 'kids',
    goalText: "Spiral around obstacles using multiple loops!",
    stepHints: [
      "Repeat: move forward, turn, repeat!",
      "Create a spiral path with nested loops.",
      "Minecraft terrain builders use this exact logic!"
    ],
    commonMistakes: [
      {
        id: 'WRONG_DIRECTION',
        description: 'Spiral in wrong direction',
        feedbackText: "Check your turn directions!"
      }
    ],
    successMessage: "Spiral master! You combined loops - like real game development!"
  },
  'k-l6': {
    id: 'k-l6',
    stage: 'kids',
    goalText: "Use smart logic - if you reached the goal, celebrate!",
    stepHints: [
      "The Diamond block asks a question: 'Am I at the goal?'",
      "If YES → celebrate! If NO → keep moving.",
      "Every phone app uses if-then logic!"
    ],
    commonMistakes: [
      {
        id: 'WRONG_PATH',
        description: 'Wrong path in condition',
        feedbackText: "Make sure your YES path celebrates and your NO path continues!"
      }
    ],
    successMessage: "Smart logic! Discord, Instagram, TikTok all use if-then blocks!"
  },
  'k-l7': {
    id: 'k-l7',
    stage: 'kids',
    goalText: "Handle multiple conditions like a real app!",
    stepHints: [
      "If the setting is Easy → go slow.",
      "If it's Medium → go normal speed.",
      "If it's Hard → go FAST!",
      "This is how games customize difficulty!"
    ],
    commonMistakes: [
      {
        id: 'WRONG_ACTION',
        description: 'Wrong action for condition',
        feedbackText: "Check which action matches which condition!"
      }
    ],
    successMessage: "Settings master! Apps adapt to user preferences with multi-condition logic!"
  },
  'k-l8': {
    id: 'k-l8',
    stage: 'kids',
    goalText: "Paint a repeating color pattern!",
    stepHints: [
      "Colors: Red, Blue, Red, Blue, Red, Blue...",
      "Use a Repeat block to paint the pattern multiple times.",
      "TikTok filters use this same pattern logic!"
    ],
    commonMistakes: [
      {
        id: 'WRONG_COLOR',
        description: 'Wrong color sequence',
        feedbackText: "Check the pattern - red, blue, red, blue..."
      }
    ],
    successMessage: "Filter creator! Snapchat and TikTok effects generate patterns like this!"
  },
  'k-l9': {
    id: 'k-l9',
    stage: 'kids',
    goalText: "Generate a character with procedural code!",
    stepHints: [
      "Use loops to build parts: body, head, arms.",
      "Build them in order - like constructing in Roblox!",
      "Roblox generates millions of unique avatars this way."
    ],
    commonMistakes: [
      {
        id: 'WRONG_ORDER',
        description: 'Parts built in wrong order',
        feedbackText: "Make sure the parts are built in the correct sequence!"
      }
    ],
    successMessage: "Avatar creator! Roblox and Fortnite use procedural generation like this!"
  },
  'k-l10': {
    id: 'k-l10',
    stage: 'kids',
    goalText: "Build a song playlist by sequencing sounds!",
    stepHints: [
      "Play 4 different notes/sounds in sequence.",
      "Arrange them like a Spotify playlist!",
      "Every music app manages audio sequences like this."
    ],
    commonMistakes: [
      {
        id: 'NO_SOUND',
        description: 'Forgot to add sound blocks',
        feedbackText: "Drag sound blocks into your sequence!"
      }
    ],
    successMessage: "Composer! Spotify, Apple Music, and YouTube Music queue songs with code!"
  },
  'k-l11': {
    id: 'k-l11',
    stage: 'kids',
    goalText: "Build a COMPLETE GAME LEVEL using everything!",
    stepHints: [
      "Navigate the map (sequences + loops)",
      "Avoid obstacles (pathfinding)",
      "Collect items and reach victory (conditionals)",
      "You\'re coding a real game level!"
    ],
    commonMistakes: [
      {
        id: 'INEFFICIENT',
        description: 'Solution uses too many blocks',
        feedbackText: "Use loops to shorten your code - like professional developers!"
      },
      {
        id: 'OBSTACLE_HIT',
        description: 'Crashed into obstacle',
        feedbackText: "Plan your route more carefully!"
      }
    ],
    successMessage: "🎉 GAME LEVEL COMPLETE! You\'re officially a Junior Game Developer! Fortnite, Roblox, and Minecraft use these exact concepts at massive scale!"
  }
};