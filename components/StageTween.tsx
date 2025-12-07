import React from 'react';
import { EvolveLayout } from './EvolveLayout';

interface Props {
  logicStack: string[];
}

export const StageTween: React.FC<Props> = ({ logicStack }) => {
  
  // --- STAGE CONTENT (Left/Top) ---
  const stageContent = (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-blue-100 relative">
       <div className="absolute inset-4 border-2 border-dashed border-blue-200 rounded-xl pointer-events-none"></div>
       <div className="text-center">
           <div className="text-8xl mb-4 animate-bounce">
             <i className="fas fa-cat text-blue-600"></i>
           </div>
           <p className="text-blue-800 font-bold bg-white/50 px-4 py-2 rounded-lg">Preview Stage</p>
           <p className="text-xs text-blue-500 mt-2">Visual output appears here</p>
       </div>
    </div>
  );

  // --- WORK CONTENT (Right/Bottom) ---
  const workContent = (
    <div className="flex flex-col md:flex-row gap-6 h-full">
        {/* Block Palette */}
        <div className="w-full md:w-64 bg-white rounded-xl shadow-sm p-4 border border-gray-200 shrink-0">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Events</h3>
          <div className="bg-yellow-400 text-white p-2 rounded-lg rounded-tl-none mb-2 cursor-pointer shadow-sm text-xs font-bold border-l-4 border-yellow-600 truncate">
            When 🏁 clicked
          </div>
          <div className="bg-yellow-400 text-white p-2 rounded-lg rounded-tl-none mb-6 cursor-pointer shadow-sm text-xs font-bold border-l-4 border-yellow-600 truncate">
            When [Space] key pressed
          </div>

          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Motion</h3>
          <div className="bg-blue-500 text-white p-2 rounded-lg mb-2 cursor-pointer shadow-sm text-xs font-bold border-l-4 border-blue-700 truncate">
            Move (10) steps
          </div>
          <div className="bg-blue-500 text-white p-2 rounded-lg mb-2 cursor-pointer shadow-sm text-xs font-bold border-l-4 border-blue-700 truncate">
            Turn ↻ (15) degrees
          </div>

          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 mt-4">Control</h3>
          <div className="bg-orange-400 text-white p-2 rounded-lg mb-2 cursor-pointer shadow-sm text-xs font-bold border-l-4 border-orange-600 truncate">
            Repeat (10)
          </div>
        </div>

        {/* Script Assembly Area */}
        <div className="flex-1 bg-white rounded-xl shadow-inner p-4 md:p-8 border-2 border-dashed border-gray-300 min-h-[400px]">
           <h2 className="text-lg font-bold text-blue-600 mb-4 flex items-center gap-2">
             <i className="fas fa-puzzle-piece"></i> Script Builder
           </h2>
           
           <div className="flex flex-col items-start gap-0 scale-100 origin-top-left">
             <div className="bg-yellow-400 text-white px-4 py-3 rounded-lg rounded-b-none shadow-md text-sm font-bold border-b border-yellow-500 w-48">
                On Start 🏁
             </div>
             
             {logicStack.length > 0 ? logicStack.map((block, i) => (
               <div key={i} className={`
                 px-4 py-3 text-white text-sm font-bold shadow-md w-48 relative
                 ${block.includes('Loop') ? 'bg-orange-400 ml-0 border-l-4 border-orange-600' : 'bg-blue-500 ml-0 border-l-4 border-blue-700'}
                 ${i === logicStack.length - 1 ? 'rounded-b-lg' : ''}
               `}>
                 <div className="absolute -top-1 left-4 w-4 h-2 bg-white/20 rounded-b"></div>
                 {block.replace('Magic', 'Cast Spell').replace('Walk', 'Move 10 Steps')}
               </div>
             )) : (
               <div className="p-4 text-gray-400 italic text-sm border-2 border-dashed border-gray-100 rounded bg-gray-50 mt-2 w-48 text-center">
                   Your logic from Kids Mode will appear here as blocks!
               </div>
             )}
           </div>
        </div>
    </div>
  );

  return <EvolveLayout className="bg-blue-50" stageContent={stageContent} workArea={workContent} />;
};