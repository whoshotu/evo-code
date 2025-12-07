import React from 'react';

interface Props {
  stageContent: React.ReactNode;
  workArea: React.ReactNode;
  className?: string;
  stageClass?: string;
  workClass?: string;
}

export const EvolveLayout: React.FC<Props> = ({ 
  stageContent, 
  workArea, 
  className = "",
  stageClass = "",
  workClass = ""
}) => {
  return (
    <div className={`h-full w-full flex flex-col md:grid md:grid-cols-[400px_1fr] overflow-hidden ${className}`}>
      {/* STAGE AREA */}
      {/* Mobile: Top, Fixed Aspect Ratio 4/3. Desktop: Left Column, Full Height */}
      <div className={`w-full md:h-full relative shrink-0 md:border-r border-black/10 dark:border-white/10 ${stageClass}`}>
          {/* Wrapper to enforce aspect ratio only on mobile */}
          <div className="w-full h-full md:static aspect-[4/3] md:aspect-auto relative overflow-hidden flex flex-col">
             {/* Content Container - absolute on mobile to fill aspect box, static on desktop */}
             <div className="absolute inset-0 md:static md:h-full w-full overflow-y-auto overflow-x-hidden flex flex-col">
                 {stageContent}
             </div>
          </div>
      </div>

      {/* WORK AREA */}
      {/* Mobile: Bottom, Flex Grow. Desktop: Right Column, Full Height */}
      <div className={`relative flex-1 md:h-full overflow-hidden ${workClass}`}>
         <div className="absolute inset-0 overflow-y-auto scroll-smooth p-4 md:p-6">
             {workArea}
         </div>
      </div>
    </div>
  );
};