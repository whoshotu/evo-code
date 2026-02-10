import { Stage, Module } from '../types';

export const CURRICULUM: Record<Stage, Module[]> = {
  [Stage.KIDS]: [
    {
      id: 'kids-m1',
      title: '📱 Your First App',
      lessons: [
        { 
          id: 'k-l1', 
          title: '🎮 Game Start', 
          description: 'Your favorite game character needs to reach the goal.', 
          task: 'Program the character to walk straight to the finish line.', 
          solutionExplanation: {
            simple: 'Just like pressing forward buttons in a game - tap "Move" 3 times.',
            detailed: 'Programs run instructions ONE AT A TIME, from top to bottom. Just like how you play a game - each action happens in order. If you mess up the order, the game breaks!',
            conceptual: 'SEQUENCING: This is how every app and game works. The order matters! Imagine if YouTube played videos backwards - chaos!'
          },
          gridConfig: {
            gridSize: 4,
            startPos: [0, 0],
            goalPos: [0, 3],
            avatarEmoji: '🎮',
            goalEmoji: '🏁',
            backgroundTheme: 'gaming'
          },
          scaffolds: {
            preLesson: {
              type: 'demo',
              content: 'Watch how the character moves forward one step at a time - just like in your favorite game!',
              duration: 10
            },
            duringLesson: {
              visualAids: ['grid-overlay', 'path-preview'],
              highlightAvailableBlocks: true
            },
            postLesson: {
              reflection: 'Ever notice games do the same thing over and over? That\'s sequencing!',
              celebration: '⭐ You programmed your first game move!'
            }
          },
          realWorldConnection: {
            example: 'Like TikTok auto-playing videos one after the next!',
            relatable: 'Your morning routine - you brush teeth THEN eat breakfast, not the other way around!',
            career: 'Game developers code every character move this way.'
          }
        },
        { 
          id: 'k-l2', 
          title: '🎯 Plot Twist', 
          description: 'The goal is around the corner! Navigate the turn.', 
          task: 'Move forward, turn, then move again to reach the goal.', 
          solutionExplanation: {
            simple: 'Walk forward, make a sharp turn, then keep going.',
            detailed: 'Games need to know DIRECTION - which way is the character facing? When you turn, "forward" suddenly means a different direction. This is core to any game!',
            conceptual: 'DIRECTION AWARENESS: From Fortnite to Among Us, every game tracks rotation and direction. You\'re using the same logic!'
          },
          gridConfig: {
            gridSize: 4,
            startPos: [0, 0],
            goalPos: [2, 2],
            avatarEmoji: '🎮',
            goalEmoji: '🏁',
            backgroundTheme: 'gaming'
          },
          scaffolds: {
            preLesson: {
              type: 'demo',
              content: 'See how mobile game characters turn corners when you swipe.',
              duration: 15
            },
            duringLesson: {
              visualAids: ['direction-arrow', 'turn-preview'],
              highlightAvailableBlocks: true
            },
            postLesson: {
              reflection: 'Notice in Minecraft how you face different directions? That\'s what we\'re doing!',
              celebration: '🎮 You turned like a pro gamer!'
            }
          },
          realWorldConnection: {
            example: 'Exactly how Roblox characters turn corners!',
            relatable: 'When you\'re texting and turn your phone, the screen rotates.',
            career: 'VR developers use this to let you move around virtual worlds.'
          }
        },
        { 
          id: 'k-l3', 
          title: '💥 Free-Fire Map', 
          description: 'Navigate obstacles like trees, bombs, and buildings.', 
          task: 'Avoid the obstacles and reach safety.', 
          solutionExplanation: {
            simple: 'Plan your route around the obstacles - just like in a battle royale game!',
            detailed: 'Smart pathfinding is what makes games work. The AI needs to avoid walls, enemies, and hazards. You\'re learning the same algorithm!',
            conceptual: 'PATHFINDING: Every game AI uses this. From Pokemon to Fortnite, finding safe routes is essential.'
          },
          gridConfig: {
            gridSize: 5,
            startPos: [4, 0],
            goalPos: [0, 4],
            obstacles: [[2,2], [3,1], [1,3]],
            avatarEmoji: '🎮',
            goalEmoji: '🏆',
            backgroundTheme: 'gaming'
          },
          scaffolds: {
            preLesson: {
              type: 'demo',
              content: 'Watch a battle royale player navigate the map strategically.',
              duration: 20
            },
            duringLesson: {
              visualAids: ['obstacle-highlight', 'safe-zones'],
              highlightAvailableBlocks: true
            },
            postLesson: {
              reflection: 'Think about how Fortnite AI avoids your shots - similar logic!',
              celebration: '🎯 Tactical success! You navigated like a pro!'
            }
          },
          realWorldConnection: {
            example: 'Exactly like avoiding zones in Fortnite or PUBG!',
            relatable: 'Walking through a crowded hallway at school - you dodge people!',
            career: 'Game AI programmers use pathfinding for every enemy NPC.'
          }
        }
      ]
    },
    {
      id: 'kids-m2',
      title: '⚡ Level Up with Loops',
      lessons: [
        { 
          id: 'k-l4', 
          title: '🔃 Speed Run', 
          description: 'Reach the checkpoint 10 times faster.', 
          task: 'Use the "Repeat" block instead of writing Move 10 times.', 
          solutionExplanation: {
            simple: 'Instead of 10 Move blocks, use 1 Repeat block!',
            detailed: 'Loops let you avoid copy-pasting code. Professional developers NEVER repeat themselves - they use loops. It\'s called DRY: Don\'t Repeat Yourself!',
            conceptual: 'AUTOMATION: This is why AI can do thousands of tasks instantly. Loops automate repetitive work. Apps use loops millions of times per second!'
          },
          gridConfig: {
            gridSize: 5,
            startPos: [2, 0],
            goalPos: [2, 4],
            avatarEmoji: '⚡',
            goalEmoji: '🏁',
            backgroundTheme: 'gaming'
          },
          scaffolds: {
            preLesson: {
              type: 'demo',
              content: 'See how adding repeat 10x is WAY faster than clicking 10 times!',
              duration: 15
            },
            duringLesson: {
              visualAids: ['loop-counter', 'efficiency-meter'],
              highlightAvailableBlocks: true
            },
            postLesson: {
              reflection: 'Every game, app, and website uses loops constantly!',
              celebration: '⚡ Speed runner! You automated like a pro programmer!'
            }
          },
          realWorldConnection: {
            example: 'YouTube\'s "Play Next" feature loops through videos!',
            relatable: 'Your Spotify playlist loops through songs!',
            career: 'Backend developers write loops that process millions of TikTok videos!'
          },
          extensions: [
            {
              title: '⏱️ Beat the Clock',
              description: 'Finish in fewer blocks than before!',
              difficulty: 'medium'
            }
          ]
        },
        {
          id: 'k-l5',
          title: '🌀 Spiral Parkour',
          description: 'Navigate a spiral course with loops and turns.',
          task: 'Use loops to spiral around obstacles and reach the goal.',
          solutionExplanation: {
            simple: 'Repeat: move forward, turn, repeat! Create a spiral shape.',
            detailed: 'Combining loops with turns creates complex patterns efficiently. This is how games generate terrain and obstacles!',
            conceptual: 'NESTED LOGIC: Programs within programs. This scales from simple games to massive apps like Discord or Instagram!'
          },
          gridConfig: {
            gridSize: 5,
            startPos: [0, 0],
            goalPos: [3, 3],
            avatarEmoji: '🏃',
            goalEmoji: '🎯',
            backgroundTheme: 'gaming'
          },
          scaffolds: {
            preLesson: {
              type: 'demo',
              content: 'Watch how a spiral is made with repeated turns and moves.',
              duration: 15
            },
            duringLesson: {
              visualAids: ['spiral-preview', 'loop-counter'],
              highlightAvailableBlocks: true
            },
            postLesson: {
              reflection: 'Minecraft terrain is made with nested loops like this!',
              celebration: '🌀 Parkour master! You created complex patterns!'
            }
          },
          realWorldConnection: {
            example: 'How Roblox generates obstacle courses!',
            relatable: 'Spiraling around a parking garage!',
            career: 'Game level designers build intricate maps this way.'
          }
        }
      ]
    },
    {
      id: 'kids-m3',
      title: '🧠 Smart Logic (If-Then)',
      lessons: [
        {
          id: 'k-l6',
          title: '📲 Unlock Phone',
          description: 'Your phone checks if the password is correct.',
          task: 'Use an If-Then to check if you reached the checkpoint.',
          solutionExplanation: {
            simple: 'If you\'re at the checkpoint, celebrate! If not, try again.',
            detailed: 'Every app on your phone uses if-then logic: If you tap a button, THEN open the app. If your password is wrong, THEN show an error. This is CONDITIONAL LOGIC.',
            conceptual: 'DECISION MAKING: Programs make decisions based on what happens. This is what separates apps from just static websites!'
          },
          gridConfig: {
            gridSize: 4,
            startPos: [0, 0],
            goalPos: [2, 2],
            avatarEmoji: '📱',
            goalEmoji: '✅',
            backgroundTheme: 'tech'
          },
          scaffolds: {
            preLesson: {
              type: 'demo',
              content: 'Watch your phone unlock when the right password is entered.',
              duration: 15
            },
            duringLesson: {
              visualAids: ['decision-tree', 'yes-no-paths'],
              highlightAvailableBlocks: true
            },
            postLesson: {
              reflection: 'Instagram checks: if you follow them, show their posts. Otherwise, don\'t!',
              celebration: '🔓 Logic master! You made smart decisions!'
            }
          },
          realWorldConnection: {
            example: 'Discord: if friend is online, show green dot!',
            relatable: 'TikTok: if you like a video, save it!',
            career: 'App developers write if-then logic thousands of times per app.'
          }
        },
        {
          id: 'k-l7',
          title: '⚙️ Settings Logic',
          description: 'Apps have different settings. Program different responses.',
          task: 'Check the difficulty level and act differently for each.',
          solutionExplanation: {
            simple: 'If Easy, go slow. If Medium, go faster. If Hard, go super fast!',
            detailed: 'Real apps have multiple conditions. Games check: what difficulty did the player choose? What device are they on? Conditional logic handles all these cases.',
            conceptual: 'BRANCHING LOGIC: Programs split into different paths based on conditions. This is how apps adapt to YOU!'
          },
          gridConfig: {
            gridSize: 4,
            startPos: [1, 1],
            goalPos: [2, 2],
            avatarEmoji: '⚙️',
            goalEmoji: '🎮',
            backgroundTheme: 'tech'
          },
          scaffolds: {
            preLesson: {
              type: 'demo',
              content: 'See how Fortnite changes the game based on your difficulty setting!',
              duration: 15
            },
            duringLesson: {
              visualAids: ['condition-tree', 'settings-menu'],
              highlightAvailableBlocks: true
            },
            postLesson: {
              reflection: 'Every game lets you pick difficulty using if-then logic!',
              celebration: '⚙️ Settings expert! You handled multiple conditions!'
            }
          },
          realWorldConnection: {
            example: 'Netflix recommends different shows based on your watch history!',
            relatable: 'Your phone acts different if you\'re in airplane mode!',
            career: 'Game designers use this to balance difficulty for all players.'
          }
        }
      ]
    },
    {
      id: 'kids-m4',
      title: '🎨 Create & Generate',
      lessons: [
        {
          id: 'k-l8',
          title: '🎬 Video Effects',
          description: 'Create a repeating visual pattern like TikTok effects.',
          task: 'Draw a pulsing color pattern: red, blue, red, blue, red, blue.',
          solutionExplanation: {
            simple: 'Use loops to create a repeating pattern - just like filters!',
            detailed: 'TikTok filters, Snapchat lenses, and Instagram effects use pattern loops. You\'re learning the same technology!',
            conceptual: 'GENERATIVE ART: Using code to create visual patterns. This is how AI art, game graphics, and filters work!'
          },
          gridConfig: {
            gridSize: 6,
            startPos: [0, 0],
            goalPos: [5, 0],
            avatarEmoji: '🎬',
            goalEmoji: '✨',
            backgroundTheme: 'social'
          },
          scaffolds: {
            preLesson: {
              type: 'demo',
              content: 'Watch a TikTok filter create repeating effects.',
              duration: 15
            },
            duringLesson: {
              visualAids: ['pattern-preview', 'effect-timeline'],
              highlightAvailableBlocks: true
            },
            postLesson: {
              reflection: 'TikTok creators use loops of code to make viral filters!',
              celebration: '✨ Filter creator! You made visual effects!'
            }
          },
          realWorldConnection: {
            example: 'TikTok and Snapchat filters use this exact logic!',
            relatable: 'The loading spinner on Instagram is a loop!',
            career: 'AR/VR developers create effects like this for metaverse apps.'
          }
        },
        {
          id: 'k-l9',
          title: '🤖 AI Character Generator',
          description: 'Generate a character avatar with code.',
          task: 'Build a character: body (repeat loop), head, arms, then display.',
          solutionExplanation: {
            simple: 'Use loops to build character parts in order - like a constructor!',
            detailed: 'Games like Roblox and Fortnite use code to generate millions of unique characters. This is procedural generation!',
            conceptual: 'PROCEDURAL GENERATION: Using code to create unique variations automatically. How AI generates images, characters, and worlds!'
          },
          gridConfig: {
            gridSize: 4,
            startPos: [0, 3],
            goalPos: [3, 3],
            avatarEmoji: '🤖',
            goalEmoji: '👾',
            backgroundTheme: 'gaming'
          },
          scaffolds: {
            preLesson: {
              type: 'demo',
              content: 'Watch how game characters are built from simple parts.',
              duration: 15
            },
            duringLesson: {
              visualAids: ['character-builder', 'parts-list'],
              highlightAvailableBlocks: true
            },
            postLesson: {
              reflection: 'Roblox avatars are generated this way - every one is unique!',
              celebration: '🤖 You\'re an AI character creator!'
            }
          },
          realWorldConnection: {
            example: 'Roblox generates millions of unique avatar combinations!',
            relatable: 'Fortnite lets you build thousands of skin combos!',
            career: 'AI developers use this for image generation (like DALL-E).'
          }
        }
      ]
    },
    {
      id: 'kids-m5',
      title: '🎵 Sound & Media',
      lessons: [
        {
          id: 'k-l10',
          title: '🎧 Playlist Builder',
          description: 'Build a song sequence like your Spotify playlist.',
          task: 'Play 4 different sounds/notes in sequence.',
          solutionExplanation: {
            simple: 'Play sounds one after another - like songs in a playlist!',
            detailed: 'Apps like Spotify, Apple Music, and SoundCloud manage audio sequences. Podcasts, audiobooks, and games all use sound sequencing!',
            conceptual: 'AUDIO PROGRAMMING: Sound is controlled by code just like visuals. Apps manage millions of audio streams simultaneously!'
          },
          gridConfig: {
            gridSize: 4,
            startPos: [0, 0],
            goalPos: [3, 0],
            avatarEmoji: '🎧',
            goalEmoji: '🎵',
            backgroundTheme: 'music'
          },
          scaffolds: {
            preLesson: {
              type: 'demo',
              content: 'Listen to a Spotify playlist load and play in sequence.',
              duration: 15
            },
            duringLesson: {
              visualAids: ['playlist-order', 'sound-visualizer'],
              highlightAvailableBlocks: true
            },
            postLesson: {
              reflection: 'Every song you hear on Spotify is queued with code like this!',
              celebration: '🎼 Playlist curator! You control audio with code!'
            }
          },
          realWorldConnection: {
            example: 'Spotify queues songs using sequence logic!',
            relatable: 'YouTube videos play audio in sync with visuals!',
            career: 'Audio engineers code music production tools like FL Studio or Ableton.'
          }
        }
      ]
    },
    {
      id: 'kids-m6',
      title: '🏆 Final Boss: Full Game',
      lessons: [
        {
          id: 'k-l11',
          title: '🎮 Complete Game Level',
          description: 'Build a complete game level combining ALL concepts!',
          task: 'Navigate obstacles (sequences/loops), avoid hazards (conditionals), collect items, and reach victory!',
          solutionExplanation: {
            simple: 'Use everything: sequences, loops, turns, conditionals - make a full playable level!',
            detailed: 'Real games use every concept you\'ve learned. From indie games to AAA titles, the core logic is sequencing, loops, and conditions scaling up!',
            conceptual: 'INTEGRATION: You\'re not just learning programming - you\'re building the FOUNDATION of modern gaming and apps!'
          },
          gridConfig: {
            gridSize: 6,
            startPos: [0, 0],
            goalPos: [5, 5],
            obstacles: [[2,1], [4,3], [1,4]],
            items: [[1,1], [3,2], [4,4]],
            avatarEmoji: '🎮',
            goalEmoji: '👑',
            backgroundTheme: 'gaming'
          },
          scaffolds: {
            preLesson: {
              type: 'demo',
              content: 'Watch a complete gameplay walkthrough of your new game!',
              duration: 20
            },
            duringLesson: {
              visualAids: ['full-game-ui', 'score-tracker'],
              highlightAvailableBlocks: false
            },
            postLesson: {
              reflection: 'Every game you play uses EXACTLY this logic scaled up 1000x.',
              celebration: '🎉 YOU DID IT! You\'re officially a Game Developer! Ready for the Teen Mode?'
            }
          },
          successCriteria: {
            minimum: {
              description: 'Complete the level',
              blocks: 20,
              hints: 5
            },
            proficient: {
              description: 'Efficient solution',
              blocks: 12,
              hints: 2
            },
            advanced: {
              description: 'Optimal - use every concept smartly',
              blocks: 12,
              hints: 0
            }
          },
          prerequisites: {
            concepts: ['sequencing', 'loops', 'direction', 'conditionals'],
            lessons: ['k-l1', 'k-l4', 'k-l6'],
            minimumScore: 0.6
          },
          realWorldConnection: {
            example: 'Fortnite, Roblox, Minecraft - all use this foundation!',
            relatable: 'Every game you\'ve ever played uses these 4 core concepts!',
            career: 'Game developers at EA, Ubisoft, Activision code with this daily. You\'re on the same path!'
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