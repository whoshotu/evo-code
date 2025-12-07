
import { useState, useEffect, useRef } from 'react';
import { LevelConfig, GridConfig, ChatEntry } from '../types';
import { getGoalText, getFeedbackForMistake } from '../utils/tutorLogic';

interface UseGameTutorProps {
  levelConfig: LevelConfig | undefined;
  gridConfig: GridConfig;
  logicStack: string[];
}

export const useGameTutor = ({ levelConfig, gridConfig, logicStack }: UseGameTutorProps) => {
  // Chat State
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
  
  // Simulation State
  const [playerPos, setPlayerPos] = useState<[number, number]>(gridConfig.startPos);
  const [playerRotation, setPlayerRotation] = useState(90);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState<string>("");

  // Refs for animation loop management
  const isMounted = useRef(true);

  // Initialize Chat with Goal
  useEffect(() => {
    if (levelConfig) {
      setChatHistory([{
        id: 'init-goal',
        role: 'tutor',
        type: 'text',
        content: `🎯 ${getGoalText(levelConfig)}`
      }]);
      setFeedback("");
      resetPosition();
    }
  }, [levelConfig]);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  // --- Auto-Run Logic ---
  // Whenever logicStack changes (and isn't empty), we validate and animate
  useEffect(() => {
    if (logicStack.length === 0) {
      resetPosition();
      return;
    }

    // 1. Add User Message to Chat
    const userMsgId = Date.now().toString();
    setChatHistory(prev => {
      // Keep only last 5 messages to avoid clutter, but always keep initial goal
      const history = prev.length > 10 ? [prev[0], ...prev.slice(-9)] : prev;
      return [...history, {
        id: userMsgId,
        role: 'user',
        type: 'blocks',
        content: JSON.stringify(logicStack),
        isLatest: true
      }];
    });

    // 2. Validate & Animate
    validateAndAnimate();

  }, [logicStack]);

  const resetPosition = () => {
    setPlayerPos(gridConfig.startPos);
    setPlayerRotation(90);
    setIsPlaying(false);
  };

  const validateAndAnimate = async () => {
    setIsPlaying(true);
    setFeedback("Thinking..."); // Temporary status
    
    // Reset start pos
    let r = gridConfig.startPos[0];
    let c = gridConfig.startPos[1];
    let rot = 90;
    
    // Immediate visual reset before animation starts
    setPlayerPos([r, c]);
    setPlayerRotation(rot);
    
    await new Promise(res => setTimeout(res, 400)); // Brief pause before start

    let mistakeId: string | null = null;
    let path: {r: number, c: number, rot: number}[] = [];

    // Pre-calculate path to identify mistakes early if needed, 
    // but we will animate step-by-step for the user.
    for (const block of logicStack) {
      if (!isMounted.current) return;

      // Apply Logic
      let nextR = r;
      let nextC = c;
      let nextRot = rot;

      if (block === "Move Forward") {
        if (rot === 0) nextR--;
        if (rot === 180) nextR++;
        if (rot === 270) nextC--;
        if (rot === 90) nextC++;
      } else if (block === "Repeat 3 Times") {
        if (rot === 0) nextR -= 3;
        if (rot === 180) nextR += 3;
        if (rot === 270) nextC -= 3;
        if (rot === 90) nextC += 3;
      } else if (block === "Turn Right") {
        nextRot = (rot + 90) % 360;
      } else if (block === "Turn Left") {
        nextRot = (rot - 90 + 360) % 360;
      }

      // Check Bounds
      if (nextR < 0 || nextR >= gridConfig.gridSize || nextC < 0 || nextC >= gridConfig.gridSize) {
        mistakeId = "OBSTACLE_HIT"; // Treat boundary as obstacle
        // Animate up to the edge? Let's just animate the turn or the failed move attempt visually by shaking?
        // For simplicity, we update state to the invalid pos then break, creating a visual "crash" (handled by VisualGrid potentially)
        // Or better: Clamp it and show error.
      } 
      // Check Obstacles
      else if (gridConfig.obstacles?.some(o => o[0] === nextR && o[1] === nextC)) {
        mistakeId = "OBSTACLE_HIT";
        r = nextR; c = nextC; // Move into the rock to show collision
        path.push({r, c, rot: nextRot}); // Push the crash step
        break; 
      }
      else {
        // Valid move
        r = nextR;
        c = nextC;
        rot = nextRot;
        path.push({r, c, rot});
      }
    }

    // ANIMATION LOOP
    for (const step of path) {
      if (!isMounted.current) return;
      setPlayerPos([step.r, step.c]);
      setPlayerRotation(step.rot);
      await new Promise(res => setTimeout(res, 600)); // Step duration
    }

    // Final Validation
    if (!mistakeId) {
      if (r === gridConfig.goalPos[0] && c === gridConfig.goalPos[1]) {
        setFeedback("🎉 Success!");
        addTutorMessage(`⭐ ${levelConfig?.successMessage || "Great job!"}`);
      } else {
         // Generic "Not there yet"
         setFeedback("🤔 ...");
         // Only add tutor message if user has done a few blocks, don't spam on first block
         if (logicStack.length > 2) {
            addTutorMessage(getFeedbackForMistake(levelConfig!, 'UNDERSHOOT'));
         }
      }
    } else {
      setFeedback("💥 Ouch!");
      addTutorMessage(getFeedbackForMistake(levelConfig!, mistakeId));
    }

    setIsPlaying(false);
  };

  const addTutorMessage = (text: string) => {
    setChatHistory(prev => [...prev, {
      id: Date.now().toString(),
      role: 'tutor',
      type: 'text',
      content: text
    }]);
  };

  return {
    chatHistory,
    playerPos,
    playerRotation,
    isPlaying,
    feedback
  };
};
