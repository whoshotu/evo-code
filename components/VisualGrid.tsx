import React from 'react';
import { GridConfig } from '../types';

interface Props {
  config: GridConfig;
  playerPos: [number, number]; // [row, col]
  playerRotation: number; // 0 = up, 90 = right, 180 = down, 270 = left
}

export const VisualGrid: React.FC<Props> = ({ config, playerPos, playerRotation }) => {
  const { gridSize, goalPos, obstacles, avatarEmoji, goalEmoji, backgroundTheme } = config;

  // Create grid cells
  const cells = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const isPlayer = r === playerPos[0] && c === playerPos[1];
      const isGoal = r === goalPos[0] && c === goalPos[1];
      const isObstacle = obstacles?.some(o => o[0] === r && o[1] === c);
      
      let bgClass = '';
      if (backgroundTheme === 'space') bgClass = 'bg-gray-900 border-gray-800';
      else if (backgroundTheme === 'castle') bgClass = 'bg-stone-200 border-stone-300';
      else bgClass = (r + c) % 2 === 0 ? 'bg-green-100' : 'bg-green-200'; // Grass default

      cells.push(
        <div 
          key={`${r}-${c}`} 
          className={`relative border ${bgClass} flex items-center justify-center text-2xl md:text-4xl transition-all duration-300`}
          style={{ width: '100%', aspectRatio: '1/1' }}
        >
          {/* Goal */}
          {isGoal && <div className="absolute inset-0 flex items-center justify-center animate-pulse scale-75 md:scale-100">{goalEmoji}</div>}
          
          {/* Obstacle */}
          {isObstacle && <div className="absolute inset-0 flex items-center justify-center opacity-80">🪨</div>}
          
          {/* Player (Absolute to animate smoothly if we added coordinates transition, for now cell-based) */}
          {isPlayer && (
            <div 
              className="absolute z-10 transition-transform duration-300"
              style={{ transform: `rotate(${playerRotation}deg)` }}
            >
              {avatarEmoji}
            </div>
          )}
        </div>
      );
    }
  }

  return (
    <div 
      className="grid gap-1 border-4 border-gray-300 rounded-lg p-1 bg-white shadow-lg mx-auto max-w-[400px]"
      style={{ 
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)` 
      }}
    >
      {cells}
    </div>
  );
};