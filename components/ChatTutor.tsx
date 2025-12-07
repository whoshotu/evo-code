
import React, { useEffect, useRef } from 'react';
import { ChatEntry } from '../types';

interface Props {
  history: ChatEntry[];
  onRemoveBlock?: (index: number) => void;
}

export const ChatTutor: React.FC<Props> = ({ history, onRemoveBlock }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const getBlockIcon = (blockName: string) => {
    switch(blockName) {
      case "Move Forward": return "⬆️";
      case "Turn Right": return "↻";
      case "Turn Left": return "↺";
      case "Repeat 3 Times": return "🔁";
      default: return "🟦";
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 rounded-xl border-2 border-gray-100 min-h-[200px] max-h-[400px]">
      {history.length === 0 && (
        <div className="text-center text-gray-400 mt-10 italic">Start coding to chat with the Tutor!</div>
      )}
      
      {history.map((msg) => (
        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          {msg.role === 'tutor' ? (
            // Tutor Bubble
            <div className="flex items-start gap-2 max-w-[85%]">
               <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-lg shadow-sm border border-blue-200">
                 🤖
               </div>
               <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-200 text-sm text-gray-700 shadow-sm animate-fade-in">
                 {msg.content}
               </div>
            </div>
          ) : (
            // User Block Bubble
            <div className="bg-blue-600 p-2 rounded-2xl rounded-tr-none text-white shadow-md max-w-[90%] animate-slide-up">
               <div className="flex flex-wrap gap-1 justify-end">
                  {JSON.parse(msg.content).map((block: string, idx: number) => (
                    <div key={idx} className="relative group">
                        <span className="bg-white/20 px-2 py-1 rounded text-lg cursor-default hover:bg-white/30 transition">
                            {getBlockIcon(block)}
                        </span>
                        {/* Only allow removing if it's the latest message (simulating active editor) */}
                        {msg.isLatest && onRemoveBlock && (
                            <button 
                                onClick={() => onRemoveBlock(idx)}
                                className="absolute -top-2 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remove block"
                            >
                                ×
                            </button>
                        )}
                    </div>
                  ))}
               </div>
               <div className="text-[10px] text-blue-200 text-right mt-1 font-mono">Running Code...</div>
            </div>
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
