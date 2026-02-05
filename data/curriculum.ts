import { Stage, Module } from '../types';

export const CURRICULUM: Record<Stage, Module[]> = {
  [Stage.KIDS]: [
    {
      id: 'kids-m1',
      title: '🎒 Adventure Basics',
      lessons: [
        { 
          id: 'k-l1', 
          title: '🐝 Hungry Bee', 
          description: 'The bee is hungry but the flower is far away.', 
          task: 'Program the bee to fly to the flower.', 
          solutionExplanation: {
            simple: 'The bee needs to move forward 3 times to reach the flower.',
            detailed: 'Computers read instructions one at a time, from top to bottom. Each "Move Forward" block makes the bee take one step. Since the flower is 3 squares away, we need 3 "Move Forward" blocks.',
            conceptual: 'This introduces SEQUENCING - the order of instructions matters! If we change the order, we get different results.'
          },
          gridConfig: {
            gridSize: 4,
            startPos: [0, 0],
            goalPos: [0, 3],
            avatarEmoji: '🐝',
            goalEmoji: '🌻',
            backgroundTheme: 'grass'
          },
          // ENHANCED: Learning scaffolds
          scaffolds: {
            preLesson: {
              type: 'demo',
              content: 'Watch the bee demonstrate how to move forward one square at a time',
              duration: 10
            },
            duringLesson: {
              visualAids: ['grid-overlay', 'path-preview'],
              highlightAvailableBlocks: true
            },
            postLesson: {
              reflection: 'What did you learn about giving instructions to computers?',
              celebration: '🌟 Great job! You\'re a coding explorer!'
            }
          },
          // ENHANCED: Differentiated success criteria
          successCriteria: {
            minimum: {
              description: 'Reach the flower',
              blocks: 5,
              hints: 3
            },
            proficient: {
              description: 'Reach the flower efficiently',
              blocks: 3,
              hints: 1
            },
            advanced: {
              description: 'Reach the flower optimally',
              blocks: 3,
              hints: 0
            }
          },
          // ENHANCED: Formative assessment
          checkpoints: [
            {
              afterAttempts: 2,
              question: 'How many steps does the bee need to take?',
              options: ['2 steps', '3 steps', '4 steps'],
              correctAnswer: '3 steps',
              feedback: {
                correct: '🎉 Great counting! Now try it in code.',
                incorrect: '🤔 Try counting the squares again.'
              }
            }
          ],
          // ENHANCED: Real-world connection
          realWorldConnection: {
            example: 'Just like following a recipe step by step!',
            relatable: 'Like brushing your teeth - first toothpaste, then brush, then rinse!',
            career: 'Robot engineers use sequences to program factory machines.'
          },
          // ENHANCED: Extension activities
          extensions: [
            {
              title: '🎯 Challenge: Different Paths',
              description: 'Can you find another way to reach the flower?',
              difficulty: 'medium'
            },
            {
              title: '🎨 Create Your Own',
              description: 'Design a new puzzle for a friend!',
              difficulty: 'hard'
            }
          ]
        },
        { 
          id: 'k-l2', 
          title: '🔄 Corner Turn', 
          description: 'The flower is hidden around the corner.', 
          task: 'Walk forward, turn right, and walk again.',
          solutionExplanation: {
            simple: 'Move forward, turn right, then move forward again.',
            detailed: 'The bee can only move in the direction it\'s facing. When we turn right, the bee rotates 90 degrees. Now "forward" takes us in a different direction!',
            conceptual: 'This introduces DIRECTION and ORIENTATION. In programming, we track not just WHERE something is, but which WAY it\'s facing.'
          },
          gridConfig: {
            gridSize: 4,
            startPos: [0, 0],
            goalPos: [2, 2],
            avatarEmoji: '🐝',
            goalEmoji: '🌻',
            backgroundTheme: 'grass'
          },
          scaffolds: {
            preLesson: {
              type: 'demo',
              content: 'Watch how turning changes which way the bee faces',
              duration: 15
            },
            duringLesson: {
              visualAids: ['direction-arrow', 'turn-preview'],
              highlightAvailableBlocks: true
            },
            postLesson: {
              reflection: 'Why did we need to turn? What would happen if we didn\'t?',
              celebration: '🎉 You mastered turning!'
            }
          },
          successCriteria: {
            minimum: {
              description: 'Reach the flower',
              blocks: 6,
              hints: 3
            },
            proficient: {
              description: 'Use exactly one turn',
              blocks: 4,
              hints: 1
            },
            advanced: {
              description: 'Most efficient path',
              blocks: 4,
              hints: 0
            }
          },
          checkpoints: [
            {
              afterAttempts: 2,
              question: 'Which way should the bee face after turning?',
              options: ['Up', 'Down', 'Right'],
              correctAnswer: 'Right',
              feedback: {
                correct: 'Exactly! Now the bee can move toward the flower.',
                incorrect: 'Try the turn block and see which way the bee faces!'
              }
            }
          ],
          realWorldConnection: {
            example: 'Like a toy car that can only drive forward but can turn its wheels!',
            relatable: 'When you walk to school, you sometimes need to turn at corners.',
            career: 'Drone pilots control direction and orientation when flying.'
          },
          extensions: [
            {
              title: '🔄 Turn Practice',
              description: 'Try reaching the flower using only left turns!',
              difficulty: 'hard'
            }
          ]
        },
        { 
          id: 'k-l3', 
          title: '🚀 Space Mission', 
          description: 'Navigate the asteroid field to reach the base.', 
          task: 'Avoid the rocks and reach the moon base.', 
          solutionExplanation: {
            simple: 'Plan a path around the rocks to reach the moon.',
            detailed: 'Obstacles block your path. You must think ahead and plan a route around them. This is called PATHFINDING.',
            conceptual: 'PATHFINDING and PROBLEM-SOLVING: Breaking big problems into smaller steps. First plan, then execute!'
          },
          gridConfig: {
            gridSize: 5,
            startPos: [4, 0],
            goalPos: [0, 4],
            obstacles: [[2,2], [3,1], [1,3]],
            avatarEmoji: '🚀',
            goalEmoji: '🌑',
            backgroundTheme: 'space'
          },
          scaffolds: {
            preLesson: {
              type: 'demo',
              content: 'Watch the path preview show one possible route',
              duration: 20
            },
            duringLesson: {
              visualAids: ['obstacle-highlight', 'path-preview'],
              highlightAvailableBlocks: true
            },
            postLesson: {
              reflection: 'How many different paths could work?',
              celebration: '🌌 Space mission complete!'
            }
          },
          successCriteria: {
            minimum: {
              description: 'Reach the moon base',
              blocks: 12,
              hints: 3
            },
            proficient: {
              description: 'Find an efficient path',
              blocks: 8,
              hints: 2
            },
            advanced: {
              description: 'Optimal path without hitting rocks',
              blocks: 8,
              hints: 0
            }
          },
          realWorldConnection: {
            example: 'Like a GPS finding the best route around traffic!',
            relatable: 'Planning your path through a crowded hallway at school.',
            career: 'Self-driving cars use pathfinding to navigate streets.'
          }
        }
      ]
    },
    {
      id: 'kids-m2',
      title: '🔁 Loop Magic',
      lessons: [
        { 
          id: 'k-l4', 
          title: '✨ Flower Power', 
          description: 'The flower is very far away.', 
          task: 'Use the "Repeat" block to fly 3 times efficiently.', 
          solutionExplanation: {
            simple: 'Instead of using 3 "Move Forward" blocks, use 1 "Repeat 3 Times" block.',
            detailed: 'Loops let us repeat code without writing it over and over. This is the DRY (Don\'t Repeat Yourself) principle. It saves time and makes code easier to read!',
            conceptual: 'AUTOMATION and EFFICIENCY: Loops are the foundation of automation. They let computers do repetitive work for us!'
          },
          gridConfig: {
            gridSize: 5,
            startPos: [2, 0],
            goalPos: [2, 4],
            avatarEmoji: '🐝',
            goalEmoji: '🌻',
            backgroundTheme: 'grass'
          },
          scaffolds: {
            preLesson: {
              type: 'demo',
              content: 'Watch the magic repeat block work!',
              duration: 15
            },
            duringLesson: {
              visualAids: ['loop-counter', 'repeat-highlight'],
              highlightAvailableBlocks: true
            },
            postLesson: {
              reflection: 'Why are loops better than writing the same block many times?',
              celebration: '🎊 You discovered loops! You\'re a coding wizard!'
            }
          },
          successCriteria: {
            minimum: {
              description: 'Reach the flower',
              blocks: 5,
              hints: 3
            },
            proficient: {
              description: 'Use exactly one loop',
              blocks: 2,
              hints: 1
            },
            advanced: {
              description: 'Most efficient with loops',
              blocks: 2,
              hints: 0
            }
          },
          prerequisites: {
            concepts: ['sequencing', 'counting'],
            lessons: ['k-l1', 'k-l2', 'k-l3'],
            minimumScore: 0.7
          },
          realWorldConnection: {
            example: 'Like a robot arm repeating the same motion in a factory!',
            relatable: 'Brushing each tooth - you repeat the same motion for all teeth!',
            career: 'Game developers use loops to make characters walk and jump.'
          },
          extensions: [
            {
              title: '🔁 Loop Challenge',
              description: 'Can you use loops to make a square?',
              difficulty: 'medium'
            }
          ]
        },
        {
          id: 'k-l5',
          title: '⚡ Corner Zoom',
          description: 'The flower is diagonal across the field.',
          task: 'Use Repeat blocks to move 3 steps, turn, and move 3 steps again.',
          solutionExplanation: {
            simple: 'Use two loops: one for moving 3 steps, then turn, then another loop for 3 steps.',
            detailed: 'Combining loops with turns allows efficient movement in 2D space. We can break the journey into segments and loop each segment.',
            conceptual: 'DECOMPOSITION: Breaking complex problems into smaller, repeatable chunks. A key skill in programming!'
          },
          gridConfig: {
            gridSize: 5,
            startPos: [0, 0],
            goalPos: [3, 3],
            avatarEmoji: '🐝',
            goalEmoji: '🌻',
            backgroundTheme: 'grass'
          },
          scaffolds: {
            preLesson: {
              type: 'demo',
              content: 'Watch how we can use multiple loops for different parts of the journey',
              duration: 20
            },
            duringLesson: {
              visualAids: ['segment-highlight', 'loop-preview'],
              highlightAvailableBlocks: true
            },
            postLesson: {
              reflection: 'How many loops did you use? Could you use more or fewer?',
              celebration: '🚀 Amazing! You combined loops with turns!'
            }
          },
          successCriteria: {
            minimum: {
              description: 'Reach the flower',
              blocks: 8,
              hints: 3
            },
            proficient: {
              description: 'Use loops efficiently',
              blocks: 4,
              hints: 1
            },
            advanced: {
              description: 'Optimal loop usage',
              blocks: 4,
              hints: 0
            }
          },
          realWorldConnection: {
            example: 'Like a delivery route with multiple repeated segments!',
            relatable: 'Your morning routine - you repeat certain steps every day!',
            career: 'Animators use loops for repeated movements in cartoons.'
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