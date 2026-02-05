import React, { useState, useEffect } from 'react';
import { simulateCodeExecution } from '../services/backendService';
import { Lesson } from '../types';
import { EvolveLayout } from './EvolveLayout';

interface Props {
  code: string;
  setCode: (code: string) => void;
  lesson?: Lesson;
  onComplete?: () => void;
}

export const StagePro: React.FC<Props> = ({ code, setCode, lesson, onComplete }) => {
  const [activeTab, setActiveTab] = useState('main.py');
  
  // Asset Gen State
  const [genPrompt, setGenPrompt] = useState('');
  const [genType, setGenType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [imgSize, setImgSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [vidRatio, setVidRatio] = useState<'16:9' | '9:16'>('16:9');
  const [startImage, setStartImage] = useState<string | null>(null); // For video gen

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [genError, setGenError] = useState<string | null>(null);

  // Terminal State
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Memory Cleanup for Blob URLs
  useEffect(() => {
    return () => {
        if (generatedUrl && generatedUrl.startsWith('blob:')) {
            URL.revokeObjectURL(generatedUrl);
        }
    };
  }, [generatedUrl]);

  const handleRunCode = async () => {
      setIsRunning(true);
      setTerminalOutput(prev => [...prev, `➜  ~/project python main.py`]);
      const result = await simulateCodeExecution(code);
      setTerminalOutput(prev => [...prev, result, `➜  ~/project`]);
      setIsRunning(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStartImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
      if (!genPrompt) return;
      setIsGenerating(true);
      setGenError(null);
      
      // Revoke previous URL if it was a blob to free memory before generating new one
      if (generatedUrl && generatedUrl.startsWith('blob:')) {
          URL.revokeObjectURL(generatedUrl);
      }
      setGeneratedUrl(null);

      const cmd = genType === 'IMAGE' ? 'genai --image' : 'genai --video';
      setTerminalOutput(prev => [...prev, `➜  ~/project ${cmd} "${genPrompt.substring(0, 20)}..."`]);
      
      try {
           // Asset generation temporarily disabled
           // This feature used Google Gemini API which has been removed
           // To re-enable: Implement asset generation through backendService
           const errorMessage = 'Asset generation temporarily unavailable';
           setGenError(errorMessage);
           setTerminalOutput(prev => [...prev, `✗ Error: ${errorMessage}`]);
       } catch (e) {
           const errorMessage = e instanceof Error ? e.message : 'Unknown generation error';
           setGenError(errorMessage);
           setTerminalOutput(prev => [...prev, `✗ Error: ${errorMessage}`]);
       } finally {
           setIsGenerating(false);
       }
  };

  // --- STAGE CONTENT (Left/Top) ---
  // In Pro, "Stage" handles Project Explorer, Terminal, and Asset Preview
  const stageContent = (
    <div className="h-full bg-pro-sidebar flex flex-col text-gray-300 font-mono text-xs">
        {/* Project Explorer Header */}
        <div className="p-3 border-b border-black font-bold text-gray-400 uppercase tracking-widest flex justify-between">
            <span>Explorer</span>
            <i className="fas fa-ellipsis-h hover:text-white cursor-pointer"></i>
        </div>

        {/* File Tree */}
        <div className="flex-1 overflow-y-auto">
             <div 
                onClick={() => setActiveTab('main.py')}
                className={`flex items-center gap-2 px-4 py-2 cursor-pointer ${activeTab === 'main.py' ? 'bg-gray-700 text-white border-l-2 border-pro-accent' : 'hover:bg-gray-700/30'}`}
             >
               <i className="fab fa-python text-blue-400 w-4"></i> main.py
             </div>
             <div 
                onClick={() => setActiveTab('assets.gen')}
                className={`flex items-center gap-2 px-4 py-2 cursor-pointer ${activeTab === 'assets.gen' ? 'bg-gray-700 text-white border-l-2 border-purple-500' : 'hover:bg-gray-700/30'}`}
             >
               <i className="fas fa-magic text-purple-400 w-4"></i> assets.gen
             </div>
             <div className="flex items-center gap-2 px-4 py-2 opacity-50 cursor-not-allowed">
               <i className="fas fa-database text-yellow-400 w-4"></i> data.csv
             </div>
             <div className="flex items-center gap-2 px-4 py-2 opacity-50 cursor-not-allowed">
               <i className="fas fa-cog text-gray-400 w-4"></i> config.json
             </div>
        </div>

        {/* Terminal / Preview Panel at bottom of Left Column */}
        <div className="h-1/2 border-t border-black flex flex-col bg-black">
             <div className="flex items-center justify-between px-3 py-1 bg-[#1e1e1e] border-b border-black">
                 <span className="font-bold">TERMINAL</span>
                 <i className="fas fa-terminal"></i>
             </div>
             <div className="flex-1 p-2 overflow-y-auto text-green-400 font-fira-code">
                {terminalOutput.length === 0 && <span className="text-gray-600 italic">Server ready.</span>}
                {terminalOutput.map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap mb-1">{line}</div>
                ))}
             </div>
        </div>
    </div>
  );

  // --- WORK CONTENT (Right/Bottom) ---
  const workContent = (
    <div className="h-full bg-pro-bg flex flex-col text-gray-300 font-mono text-sm relative">
        {/* Editor Tabs */}
        <div className="flex bg-pro-bg border-b border-black overflow-x-auto shrink-0 sticky top-0 z-10">
             <div 
               className={`px-4 py-2 border-r border-black cursor-pointer whitespace-nowrap flex items-center gap-2 ${activeTab === 'main.py' ? 'bg-[#1e1e1e] text-white border-t-2 border-t-pro-accent' : 'bg-pro-sidebar text-gray-500'}`}
               onClick={() => setActiveTab('main.py')}
             >
               <i className="fab fa-python text-blue-400"></i> main.py
             </div>
             <div 
               className={`px-4 py-2 border-r border-black cursor-pointer whitespace-nowrap flex items-center gap-2 ${activeTab === 'assets.gen' ? 'bg-[#1e1e1e] text-white border-t-2 border-t-purple-500' : 'bg-pro-sidebar text-gray-500'}`}
               onClick={() => setActiveTab('assets.gen')}
             >
               <i className="fas fa-magic text-purple-400"></i> assets.gen
             </div>
             <div className="flex-1 bg-pro-sidebar"></div>
             {/* Toolbar */}
             <div className="bg-pro-sidebar flex items-center px-2 gap-2">
                 <button 
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-2 transition ${isRunning ? 'text-gray-500' : 'text-green-400 hover:bg-gray-700'}`}
                 >
                     <i className={`fas ${isRunning ? 'fa-spinner fa-spin' : 'fa-play'}`}></i>
                     {isRunning ? 'Running...' : 'Run'}
                 </button>
                 {lesson && onComplete && (
                     <button 
                         onClick={onComplete}
                         className="px-3 py-1 rounded text-xs font-bold text-white bg-green-700 hover:bg-green-600 flex items-center gap-2 transition"
                     >
                         <i className="fas fa-check"></i> Submit
                     </button>
                 )}
             </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 relative">
            {activeTab === 'main.py' ? (
                <textarea 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-[#1e1e1e] text-gray-100 p-4 font-mono resize-none focus:outline-none"
                spellCheck={false}
                />
            ) : (
                <div className="p-4 md:p-8 h-full bg-[#1e1e1e]">
                     <h2 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                        <i className="fas fa-wand-magic-sparkles"></i> Asset Generator
                    </h2>
                    
                    <div className="bg-[#252526] p-4 rounded-lg border border-gray-700 max-w-2xl mx-auto">
                        <div className="flex gap-4 mb-4">
                            <button 
                                onClick={() => setGenType('IMAGE')}
                                className={`px-4 py-2 rounded font-bold flex-1 ${genType === 'IMAGE' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'}`}
                            >
                                <i className="fas fa-image mr-2"></i> Image
                            </button>
                            <button 
                                onClick={() => setGenType('VIDEO')}
                                className={`px-4 py-2 rounded font-bold flex-1 ${genType === 'VIDEO' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'}`}
                            >
                                <i className="fas fa-video mr-2"></i> Video
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Prompt</label>
                                <textarea 
                                    value={genPrompt}
                                    onChange={(e) => setGenPrompt(e.target.value)}
                                    className="w-full bg-[#1e1e1e] border border-gray-600 rounded p-2 text-white focus:border-purple-500 focus:outline-none"
                                    rows={3}
                                    placeholder={genType === 'IMAGE' ? "A futuristic robot..." : "Cinematic space flight..."}
                                />
                            </div>

                            <div className="flex gap-4">
                                {genType === 'IMAGE' ? (
                                    <div className="flex-1">
                                        <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Size</label>
                                        <select 
                                            value={imgSize}
                                            onChange={(e) => setImgSize(e.target.value as any)}
                                            className="w-full bg-[#1e1e1e] border border-gray-600 rounded p-2 text-white"
                                        >
                                            <option value="1K">1K</option>
                                            <option value="2K">2K</option>
                                            <option value="4K">4K</option>
                                        </select>
                                    </div>
                                ) : (
                                    <div className="flex-1">
                                        <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Ratio</label>
                                        <select 
                                            value={vidRatio}
                                            onChange={(e) => setVidRatio(e.target.value as any)}
                                            className="w-full bg-[#1e1e1e] border border-gray-600 rounded p-2 text-white"
                                        >
                                            <option value="16:9">16:9</option>
                                            <option value="9:16">9:16</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            {/* Veo Image Input */}
                            {genType === 'VIDEO' && (
                                <div className="p-3 border border-dashed border-gray-600 rounded bg-[#1e1e1e]">
                                    <label className="block text-xs uppercase text-gray-500 font-bold mb-2">
                                        <i className="fas fa-upload mr-1"></i> Start Image (Optional)
                                    </label>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="w-full text-xs text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer"
                                    />
                                    {startImage && (
                                        <div className="mt-2 relative inline-block">
                                            <img src={startImage} alt="Preview" className="h-16 w-16 object-cover rounded border border-gray-500" />
                                            <button 
                                                onClick={() => setStartImage(null)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button 
                                onClick={handleGenerate}
                                disabled={isGenerating || !genPrompt}
                                className={`w-full py-3 rounded font-bold transition flex items-center justify-center gap-2 ${isGenerating || !genPrompt ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.02]'}`}
                            >
                                {isGenerating ? (
                                    <>
                                        <i className="fas fa-circle-notch fa-spin"></i>
                                        <span>PROCESSING...</span>
                                    </>
                                ) : (
                                    'GENERATE'
                                )}
                            </button>
                            
                            {/* Detailed Progress Indicator */}
                            {isGenerating && (
                                <div className="mt-4 space-y-2">
                                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                                        <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full animate-pulse w-full"></div>
                                    </div>
                                    <p className="text-xs text-center text-purple-300 animate-pulse">
                                        <i className="fas fa-satellite-dish mr-2"></i>
                                        {genType === 'VIDEO' ? 'Rendering video (this may take a minute)...' : 'Synthesizing pixels...'}
                                    </p>
                                </div>
                            )}

                            {/* Detailed Error Feedback */}
                            {genError && (
                                <div className="p-3 bg-red-900/40 border border-red-500/50 text-red-200 text-xs rounded flex flex-col gap-1 animate-pulse">
                                    <div className="flex items-center gap-2 font-bold">
                                        <i className="fas fa-exclamation-triangle text-red-400"></i>
                                        Generation Failed
                                    </div>
                                    <div className="pl-6 opacity-80">{genError}</div>
                                </div>
                            )}
                        </div>

                        {generatedUrl && (
                            <div className="mt-6 p-4 bg-[#1e1e1e] rounded border border-green-500/30 animate-fade-in">
                                <h3 className="text-green-400 text-xs font-bold uppercase mb-2">Result Generated</h3>
                                {genType === 'IMAGE' ? (
                                    <img src={generatedUrl} alt="Generated" className="w-full rounded shadow-lg" />
                                ) : (
                                    <video src={generatedUrl} controls autoPlay loop className="w-full rounded shadow-lg" />
                                )}
                                <a href={generatedUrl} download={`asset.${genType === 'IMAGE' ? 'png' : 'mp4'}`} className="block text-center text-xs text-gray-400 mt-2 hover:text-white underline">
                                    Download Asset
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    </div>
  );

  return <EvolveLayout className="bg-pro-bg" stageContent={stageContent} workArea={workContent} stageClass="border-r border-black" workClass="bg-[#1e1e1e]" />;
};