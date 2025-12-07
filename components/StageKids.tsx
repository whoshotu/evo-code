
import React, { useState, useEffect } from 'react';
import { Language, Lesson, GridConfig } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { VisualGrid } from './VisualGrid';
import { EvolveLayout } from './EvolveLayout';
// Import Tutor Logic
import { getGoalText, getNextHint, getFeedbackForMistake } from '../utils/tutorLogic';
import { KIDS_LEVELS } from '../data/levels';

interface Props {
  onBlockClick: (action: string) => void;
  logicStack: string[];
  mission: string;
  language: Language;
  lesson?: Lesson;
  onLessonComplete?: () => void;
}

export const StageKids: React.FC<Props> = ({ onBlockClick, logicStack, mission, language, lesson, onLessonComplete }) => {
  const t = TRANSLATIONS[language];
  
  // Simulation State
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerPos, setPlayerPos] = useState<[number, number]>([0, 0]);
  const [playerRotation, setPlayerRotation] = useState(90); 
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [feedback, setFeedback] = useState<string>("");
  const [savedSolutions, setSavedSolutions] = useState<string[][]>([]);

  // Tutor State
  const [hintIndex, setHintIndex] = useState(-1); // -1 means no hint shown yet
  const [currentTutorMessage, setCurrentTutorMessage] = useState<string>("");

  // Default config if no lesson
  const defaultConfig: GridConfig = {
    gridSize: 4,
    startPos: [0, 0],
    goalPos: [0, 3],
    avatarEmoji: '🐝',
    goalEmoji: '🌻',
    backgroundTheme: 'grass',
    obstacles: []
  };

  const config = lesson?.gridConfig || defaultConfig;
  
  // Resolve the LevelConfig based on lesson ID, or fallback to a default
  const levelConfig = lesson ? KIDS_LEVELS[lesson.id] : KIDS_LEVELS['k-l1'];

  // Reset when lesson changes
  useEffect(() => {
    resetSimulation();
    setHintIndex(-1);
    // Set initial goal text
    if (levelConfig) {
        setCurrentTutorMessage(""); 
    }
  }, [lesson, config, levelConfig]);

  const resetSimulation = () => {
    setPlayerPos(config.startPos);
    setPlayerRotation(90);
    setCurrentStepIndex(-1);
    setIsPlaying(false);
    setFeedback("");
    // Clear feedback message on reset so goal shows again (optional UX choice)
    // setCurrentTutorMessage(""); 
  };

  const handleClear = () => {
    onBlockClick("CLEAR_ALL");
    resetSimulation();
  };

  const showNextHint = () => {
    if (!levelConfig) return;
    const { nextIndex, hint } = getNextHint(levelConfig, hintIndex);
    setHintIndex(nextIndex);
    setCurrentTutorMessage(`💡 Hint: ${hint}`);
  };

  const runSimulation = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    resetSimulation();
    
    await new Promise(r => setTimeout(r, 500));

    let r = config.startPos[0];
    let c = config.startPos[1];
    let rot = 90; 

    let mistakeId: string | null = null;

    for (let i = 0; i < logicStack.length; i++) {
        setCurrentStepIndex(i);
        const action = logicStack[i];

        if (action === "Move Forward") {
            if (rot === 0) r = Math.max(0, r - 1);
            if (rot === 180) r = Math.min(config.gridSize - 1, r + 1);
            if (rot === 270) c = Math.max(0, c - 1);
            if (rot === 90) c = Math.min(config.gridSize - 1, c + 1);
        } else if (action === "Turn Right") {
            rot = (rot + 90) % 360;
        } else if (action === "Turn Left") {
            rot = (rot - 90 + 360) % 360; 
        } else if (action === "Repeat 3 Times") {
             if (rot === 0) r = Math.max(0, r - 3);
             if (rot === 180) r = Math.min(config.gridSize - 1, r + 3);
             if (rot === 270) c = Math.max(0, c - 3);
             if (rot === 90) c = Math.min(config.gridSize - 1, c + 3);
        }

        // Check Obstacles (Mistake Detection)
        if (config.obstacles?.some(o => o[0] === r && o[1] === c)) {
            mistakeId = 'OBSTACLE_HIT';
            setIsPlaying(false);
            break; // Stop immediately on crash
        }

        setPlayerPos([r, c]);
        setPlayerRotation(rot);
        
        await new Promise(resolve => setTimeout(resolve, 800)); 
    }

    // Check Win or Fail
    if (!mistakeId) {
        if (r === config.goalPos[0] && c === config.goalPos[1]) {
            setFeedback("🎉 Success!");
            // Use level config success message if available
            setCurrentTutorMessage(`⭐ ${levelConfig?.successMessage || "You did it!"}`);
            if (onLessonComplete) onLessonComplete();
        } else {
            // Heuristic for simple overshoot/undershoot detection
            // In a real app, we'd analyze path vs target vector
            mistakeId = 'UNDERSHOOT'; // Generic miss
            setFeedback("🤔 Try again");
        }
    } else {
        setFeedback("💥 Ouch!");
    }

    // If we failed (had a mistake or didn't reach goal)
    if (r !== config.goalPos[0] || c !== config.goalPos[1]) {
        if (levelConfig) {
            const tutorFeedback = getFeedbackForMistake(levelConfig, mistakeId);
            setCurrentTutorMessage(tutorFeedback);
        }
    }

    setIsPlaying(false);
  };

  const saveSolution = () => {
      setSavedSolutions([...savedSolutions, logicStack]);
      setFeedback("💾 Saved!");
  };

  // --- STAGE CONTENT (Left/Top) ---
  const stageContent = (
    <div className="h-full flex flex-col items-center p-4 bg-yellow-50/50 relative">
        {/* GOAL / TUTOR AREA */}
        <div className="w-full max-w-[400px] mb-4 text-center">
            {currentTutorMessage ? (
                <div className="bg-white border-2 border-blue-200 p-3 rounded-xl shadow-sm animate-fade-in text-blue-800 font-bold text-sm md:text-base">
                    {currentTutorMessage}
                </div>
            ) : (
                <div className="bg-yellow-100 border-2 border-yellow-200 p-3 rounded-xl text-yellow-800 font-bold text-sm md:text-base">
                    🎯 {levelConfig ? getGoalText(levelConfig) : "Reach the goal!"}
                </div>
            )}
            
            {/* Hint Button */}
            {!feedback.includes("Success") && (
                <button 
                    onClick={showNextHint}
                    className="mt-2 text-xs text-blue-500 hover:text-blue-700 underline font-bold"
                >
                    Need a hint? 💡
                </button>
            )}
        </div>

        <VisualGrid 
            config={config} 
            playerPos={playerPos} 
            playerRotation={playerRotation} 
        />
        
        {feedback && (
            <div className={`mt-4 px-6 py-2 rounded-full font-bold text-lg animate-bounce text-center ${feedback.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {feedback}
            </div>
        )}

        <div className="flex gap-2 md:gap-4 mt-6 flex-wrap justify-center">
            <button 
                onClick={runSimulation}
                disabled={isPlaying || logicStack.length === 0}
                className={`px-6 md:px-8 py-2 md:py-3 rounded-2xl font-bold text-lg md:text-xl shadow-lg transform transition-all 
                ${isPlaying || logicStack.length === 0 ? 'bg-gray-300 text-gray-500 scale-95 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white hover:-translate-y-1'}`}
            >
                {isPlaying ? 'Running...' : '▶️ Run'}
            </button>
            <button 
                onClick={resetSimulation}
                className={`px-4 py-2 md:py-3 bg-white text-gray-600 rounded-2xl font-bold shadow hover:bg-gray-50 ${feedback ? 'animate-pulse ring-2 ring-yellow-400' : ''}`}
            >
                🔄 Reset
            </button>
            <button 
                onClick={handleClear}
                disabled={logicStack.length === 0}
                className="px-4 py-2 md:py-3 bg-transparent text-gray-400 rounded-2xl font-bold hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed border border-transparent hover:border-red-100"
            >
                🗑️ Clear
            </button>
        </div>
    </div>
  );

  // --- WORK CONTENT (Right/Bottom) ---
  const workContent = (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
      
        {/* Lesson Info (Reduced since Goal is on Stage now) */}
        {lesson && (
            <div className="bg-white border-l-4 border-yellow-400 p-3 shadow-sm rounded-r-lg">
                <div className="flex flex-col">
                    <h2 className="text-lg font-black text-yellow-600 flex items-center gap-2">
                        {config.avatarEmoji} {lesson.title}
                    </h2>
                </div>
            </div>
        )}

        {/* Blocks Palette */}
        <div>
            <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Toolbox</h3>
            <div className="grid grid-cols-2 gap-3" role="group" aria-label="Coding Blocks">
                <button onClick={() => onBlockClick("Move Forward")} className="bg-blue-500 text-white p-3 rounded-xl font-bold shadow-[0_4px_0_#1e40af] active:shadow-none active:translate-y-1 hover:bg-blue-600 transition text-sm md:text-base">
                    ⬆️ Move
                </button>
                <button onClick={() => onBlockClick("Turn Right")} className="bg-purple-500 text-white p-3 rounded-xl font-bold shadow-[0_4px_0_#581c87] active:shadow-none active:translate-y-1 hover:bg-purple-600 transition text-sm md:text-base">
                    ↻ Right
                </button>
                <button onClick={() => onBlockClick("Turn Left")} className="bg-purple-500 text-white p-3 rounded-xl font-bold shadow-[0_4px_0_#581c87] active:shadow-none active:translate-y-1 hover:bg-purple-600 transition text-sm md:text-base">
                    ↺ Left
                </button>
                <button onClick={() => onBlockClick("Repeat 3 Times")} className="bg-orange-500 text-white p-3 rounded-xl font-bold shadow-[0_4px_0_#c2410c] active:shadow-none active:translate-y-1 hover:bg-orange-600 transition text-sm md:text-base">
                    🔁 Repeat
                </button>
            </div>
        </div>

        {/* Script Area */}
        <div className="bg-white border-4 border-dashed border-gray-300 rounded-2xl p-4 min-h-[300px] flex flex-col relative">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-400 font-bold uppercase tracking-wider text-sm">{t.spellBook}</h3>
                <button 
                    onClick={saveSolution}
                    disabled={logicStack.length === 0}
                    className="text-xs font-bold text-blue-500 hover:text-blue-700 flex items-center gap-1"
                >
                    <i className="fas fa-save"></i> Save
                </button>
            </div>

            <div className="space-y-2 flex-1">
                {logicStack.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full opacity-30">
                        <span className="text-6xl mb-2">{config.avatarEmoji}</span>
                        <p className="font-bold text-center">Drag blocks here!</p>
                    </div>
                ) : (
                    logicStack.map((block, i) => (
                        <div key={i} className={`p-3 rounded-lg font-bold shadow-sm flex items-center gap-3 transition-all animate-slide-up
                            ${currentStepIndex === i ? 'bg-yellow-300 scale-105 ring-4 ring-yellow-200 text-black' : 'bg-gray-100 text-gray-700'}
                        `}>
                            <span className="bg-white/50 w-6 h-6 flex items-center justify-center rounded-full text-xs">{i+1}</span>
                            {block}
                            {currentStepIndex === i && <span className="ml-auto text-xs animate-pulse">Running...</span>}
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* Saved Solutions */}
        {savedSolutions.length > 0 && (
            <div className="border-t pt-4">
                 <h4 className="font-bold text-gray-500 text-sm mb-2">💾 Saved Solutions</h4>
                 <div className="flex gap-2 overflow-x-auto">
                    {savedSolutions.map((sol, idx) => (
                        <div key={idx} className="bg-white p-2 rounded border text-xs whitespace-nowrap">
                            Attempt #{idx+1} ({sol.length} blocks)
                        </div>
                    ))}
                 </div>
            </div>
        )}
    </div>
  );

  return <EvolveLayout className="bg-yellow-50" stageContent={stageContent} workArea={workContent} />;
};
