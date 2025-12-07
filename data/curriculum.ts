import { Stage, Module } from '../types';

export const CURRICULUM: Record<Stage, Module[]> = {
  [Stage.KIDS]: [
    {
      id: 'kids-m1',
      title: 'Adventure Basics',
      lessons: [
        { 
          id: 'k-l1', 
          title: 'Hungry Bee', 
          description: 'The bee is hungry but the flower is far away.', 
          task: 'Program the bee to fly to the flower.', 
          solutionExplanation: 'Computers read commands in order. We need to move the bee forward step by step.',
          gridConfig: {
            gridSize: 4,
            startPos: [0, 0],
            goalPos: [0, 3],
            avatarEmoji: '🐝',
            goalEmoji: '🌻',
            backgroundTheme: 'grass'
          }
        },
        { 
          id: 'k-l2', 
          title: 'Corner Turn', 
          description: 'The flower is hidden around the corner.', 
          task: 'Walk forward, turn right, and walk again.',
          solutionExplanation: 'Orientation matters! The bee faces a specific direction. Turning changes where "Forward" takes you.',
          gridConfig: {
            gridSize: 4,
            startPos: [0, 0],
            goalPos: [2, 2],
            avatarEmoji: '🐝',
            goalEmoji: '🌻',
            backgroundTheme: 'grass'
          }
        },
        { 
          id: 'k-l3', 
          title: 'Space Mission', 
          description: 'Navigate the asteroid field to reach the base.', 
          task: 'Avoid the rocks and reach the moon base.', 
          solutionExplanation: 'Obstacles block your path. You must plan a route around them using turns.',
          gridConfig: {
            gridSize: 5,
            startPos: [4, 0],
            goalPos: [0, 4],
            obstacles: [[2,2], [3,1], [1,3]],
            avatarEmoji: '🚀',
            goalEmoji: '🌑',
            backgroundTheme: 'space'
          }
        }
      ]
    },
    {
      id: 'kids-m2',
      title: 'Loop Magic',
      lessons: [
        { 
          id: 'k-l4', 
          title: 'Flower Power', 
          description: 'The flower is very far away.', 
          task: 'Use the "Repeat" block to fly 3 times efficiently.', 
          solutionExplanation: 'Loops let us repeat code without writing it over and over. This is the DRY (Don\'t Repeat Yourself) principle.',
          gridConfig: {
            gridSize: 5,
            startPos: [2, 0],
            goalPos: [2, 4],
            avatarEmoji: '🐝',
            goalEmoji: '🌻',
            backgroundTheme: 'grass'
          }
        },
        {
          id: 'k-l5',
          title: 'Corner Zoom',
          description: 'The flower is diagonal across the field.',
          task: 'Use Repeat blocks to move 3 steps, turn, and move 3 steps again.',
          solutionExplanation: 'Combining loops with turns allows efficient movement in 2D space.',
          gridConfig: {
            gridSize: 5,
            startPos: [0, 0],
            goalPos: [3, 3],
            avatarEmoji: '🐝',
            goalEmoji: '🌻',
            backgroundTheme: 'grass'
          }
        }
      ]
    }
  ],
  [Stage.TWEEN]: [
    {
      id: 'tween-m1',
      title: 'Event Handling',
      lessons: [
        { id: 't-l1', title: 'Start Your Engines', description: 'Run code when the flag is clicked.', task: 'Connect "When Flag Clicked" to "Move".' },
        { id: 't-l2', title: 'Keyboard Control', description: 'Move when keys are pressed.', task: 'Use "When Space Key Pressed".' }
      ]
    },
    {
      id: 'tween-m2',
      title: 'Conditionals',
      lessons: [
        { id: 't-l3', title: 'If This Then That', description: 'Make decisions in your code.', task: 'Use an If-Then block to check for obstacles.' }
      ]
    }
  ],
  [Stage.TEEN]: [
     {
      id: 'teen-m1',
      title: 'Python Syntax',
      lessons: [
        { id: 'tn-l1', title: 'Variables', description: 'Store data in variables.', task: 'Create a variable `score = 0`.' },
        { id: 'tn-l2', title: 'Loops', description: 'Iterate with for loops.', task: 'Write a `for` loop to print numbers 1-10.' }
      ]
    },
    {
      id: 'teen-m2',
      title: 'Functions',
      lessons: [
        { id: 'tn-l3', title: 'Def', description: 'Define reusable code blocks.', task: 'Define a function `jump()`.' }
      ]
    }
  ],
  [Stage.PRO]: [
     {
      id: 'pro-m1',
      title: 'Algorithms',
      lessons: [
        { id: 'p-l1', title: 'Sorting', description: 'Implement Bubble Sort.', task: 'Write a function to sort a list.' },
        { id: 'p-l2', title: 'Efficiency', description: 'Optimize for Big O.', task: 'Refactor to O(n log n).' }
      ]
    },
    {
      id: 'pro-m2',
      title: 'AI Integration',
      lessons: [
        { id: 'p-l3', title: 'API Calls', description: 'Fetch data from an external API.', task: 'Use `fetch` to get JSON data.' }
      ]
    }
  ]
};