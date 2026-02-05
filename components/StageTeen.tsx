import React, { useState } from 'react';
import { Lesson } from '../types';
import { simulateCodeExecution } from '../services/backendService';
import { EvolveLayout } from './EvolveLayout';

interface Props {
  code: string;
  setCode: (code: string) => void;
  lesson?: Lesson;
  onComplete?: () => void;
}

export const StageTeen: React.FC<Props> = ({ code, setCode, lesson, onComplete }) => {
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Running script...");
    const result = await simulateCodeExecution(code);
    setOutput(result);
    setIsRunning(false);
  };

  // --- STAGE CONTENT (Left/Top) ---
  const stageContent = (
    <div className="h-full bg-black p-4 flex flex-col font-mono text-xs md:text-sm">
        <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-2">
            <span className="text-gray-400 font-bold uppercase">Terminal</span>
            <div className="flex gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
               <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto text-green-400 whitespace-pre-wrap font-fira-code">
            {output || <span className="text-gray-600 italic">Ready to execute. Hit Run.</span>}
        </div>
        <button 
             onClick={handleRun}
             disabled={isRunning}
             className={`mt-4 w-full py-3 rounded text-white font-bold transition flex items-center justify-center gap-2 
             ${isRunning ? 'bg-gray-700 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
        >
             {isRunning ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-play"></i>}
             {isRunning ? 'Executing...' : 'Run Script'}
        </button>
    </div>
  );

  // --- WORK CONTENT (Right/Bottom) ---
  const workContent = (
    <div className="flex flex-col gap-4 h-full">
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-purple-400 flex items-center gap-2">
            <i className="fas fa-code"></i> main.py
            </h2>
            {lesson && (
                <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded border border-purple-500/30">
                    {lesson.title}
                </span>
            )}
        </div>

        <div className="flex-1 relative bg-[#1e1e1e] rounded-lg border border-gray-600 overflow-hidden shadow-xl min-h-[400px]">
            {/* Line numbers mock */}
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-[#252526] text-gray-500 flex flex-col items-center pt-4 text-xs select-none border-r border-gray-600 font-mono">
                {Array.from({length: 30}).map((_, i) => <div key={i} className="h-6 leading-6">{i+1}</div>)}
            </div>
            
            <textarea 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-transparent pl-12 pt-4 text-white font-medium resize-none focus:outline-none font-mono leading-6 p-2"
                spellCheck={false}
            />
        </div>

        {/* Context Helper */}
        {lesson && (
             <div className="bg-[#21252b] p-4 rounded-lg border border-gray-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
               <div>
                   <h3 className="text-gray-300 font-bold text-sm mb-1">Current Task</h3>
                   <p className="text-xs text-gray-400">{lesson.task}</p>
               </div>
               {onComplete && (
                 <button 
                   onClick={onComplete}
                   className="shrink-0 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-bold transition"
                 >
                   <i className="fas fa-check-circle mr-1"></i> Mark Complete
                 </button>
               )}
             </div>
        )}
    </div>
  );

  return <EvolveLayout className="bg-[#282c34]" stageContent={stageContent} workArea={workContent} />;
};