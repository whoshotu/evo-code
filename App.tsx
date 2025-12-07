import React, { useState, useEffect, Component, ErrorInfo } from 'react';
import { Stage, Language } from './types';
import { evolveCode, generateMission } from './services/geminiService';
import { StageKids } from './components/StageKids';
import { StageTween } from './components/StageTween';
import { StageTeen } from './components/StageTeen';
import { StagePro } from './components/StagePro';
import { AIAssistant } from './components/AIAssistant';
import { LandingPage } from './components/LandingPage';
import { TRANSLATIONS } from './data/translations';
import { CURRICULUM } from './data/curriculum';

// Production Error Boundary
class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center bg-gray-900 text-white flex-col p-6 text-center">
            <h1 className="text-3xl font-bold mb-4">Something went wrong.</h1>
            <p className="mb-6 text-gray-400">Our code elves are fixing it. Please refresh.</p>
            <button onClick={() => window.location.reload()} className="bg-blue-600 px-6 py-2 rounded-full font-bold">Reload App</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  // --- App State ---
  const [showLanding, setShowLanding] = useState<boolean>(true);

  // Initialize state from localStorage with fallbacks
  const [stage, setStage] = useState<Stage>(() => {
    return (localStorage.getItem('evolve_stage') as Stage) || Stage.KIDS;
  });
  
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('evolve_lang') as Language) || 'en';
  });

  const [code, setCode] = useState<string>(() => {
    return localStorage.getItem('evolve_code') || "";
  });
  
  const [logicStack, setLogicStack] = useState<string[]>(() => {
    const saved = localStorage.getItem('evolve_logicStack');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('evolve_completedLessons');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [mission, setMission] = useState<string>("Loading mission...");
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile, open on desktop via useEffect
  const [isEvolving, setIsEvolving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  
  const t = TRANSLATIONS[language];

  // --- Effects ---

  // Default sidebar open on desktop
  useEffect(() => {
    if (window.innerWidth >= 768) {
      setSidebarOpen(true);
    }
  }, []);

  // Update HTML Lang attribute for accessibility
  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem('evolve_lang', language);
  }, [language]);

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem('evolve_stage', stage);
    localStorage.setItem('evolve_code', code);
    localStorage.setItem('evolve_logicStack', JSON.stringify(logicStack));
    localStorage.setItem('evolve_completedLessons', JSON.stringify(completedLessons));
    setLastSaved(new Date());
  }, [stage, code, logicStack, completedLessons]);

  // Determine current lesson
  const getCurrentLesson = () => {
    const stageModules = CURRICULUM[stage];
    if (!stageModules) return undefined;
    
    for (const module of stageModules) {
      for (const lesson of module.lessons) {
        if (!completedLessons.includes(lesson.id)) {
          return lesson;
        }
      }
    }
    // Return last completed lesson if all done, just so we don't crash
    return undefined;
  };

  const currentLesson = getCurrentLesson();

  // Load mission when stage or lesson changes
  useEffect(() => {
    const loadMission = async () => {
      setMission(t.loadingMission);
      // Pass the current lesson to generateMission for context-aware missions
      const newMission = await generateMission(stage, language, currentLesson);
      setMission(newMission);
    };
    if (!showLanding) {
        loadMission();
    }
  }, [stage, language, showLanding, currentLesson?.id]);

  // --- Handlers ---

  const handleLessonComplete = () => {
    if (currentLesson && !completedLessons.includes(currentLesson.id)) {
      setCompletedLessons(prev => [...prev, currentLesson.id]);
      // Optional: Sound effect or confetti here
      setLogicStack([]); // Clear stack for next lesson
    }
  };

  const handleBlockClick = (action: string) => {
    if (action === "CLEAR_ALL") {
      setLogicStack([]);
      setCode("");
      return;
    }
    const newStack = [...logicStack, action];
    setLogicStack(newStack);
    // Basic representation for KIDS mode
    setCode(newStack.join("\n"));
  };

  const handleEvolve = async () => {
    setIsEvolving(true);
    let nextStage = Stage.KIDS;
    let nextCode = code;
    let inputLogic = logicStack.length > 0 ? logicStack.join(", ") : code;

    try {
      if (stage === Stage.KIDS) {
        nextStage = Stage.TWEEN;
        nextCode = await evolveCode(inputLogic, Stage.KIDS, Stage.TWEEN, language);
      } else if (stage === Stage.TWEEN) {
        nextStage = Stage.TEEN;
        nextCode = await evolveCode(inputLogic, Stage.TWEEN, Stage.TEEN, language);
      } else if (stage === Stage.TEEN) {
        nextStage = Stage.PRO;
        nextCode = await evolveCode(code, Stage.TEEN, Stage.PRO, language);
      } else {
        // Reset logic - Clear EVERYTHING for a fresh start
        nextStage = Stage.KIDS;
        nextCode = ""; 
        setLogicStack([]);
        setCompletedLessons([]);
      }
      
      setStage(nextStage);
      setCode(nextCode);
    } catch (e) {
      console.error("Evolution error", e);
    } finally {
      setIsEvolving(false);
    }
  };

  const renderStage = () => {
    switch (stage) {
      case Stage.KIDS:
        return <StageKids onBlockClick={handleBlockClick} logicStack={logicStack} mission={mission} language={language} lesson={currentLesson} onLessonComplete={handleLessonComplete} />;
      case Stage.TWEEN:
        return <StageTween logicStack={logicStack} />;
      case Stage.TEEN:
        return <StageTeen code={code} setCode={setCode} lesson={currentLesson} onComplete={handleLessonComplete} />;
      case Stage.PRO:
        return <StagePro code={code} setCode={setCode} lesson={currentLesson} onComplete={handleLessonComplete} />;
      default:
        return <StageKids onBlockClick={handleBlockClick} logicStack={logicStack} mission={mission} language={language} lesson={currentLesson} onLessonComplete={handleLessonComplete} />;
    }
  };

  const getNavbarColor = () => {
    switch(stage) {
      case Stage.KIDS: return 'bg-white border-b border-gray-100';
      case Stage.TWEEN: return 'bg-blue-600 text-white';
      case Stage.TEEN: return 'bg-gray-900 text-white border-b border-gray-700';
      case Stage.PRO: return 'bg-pro-sidebar border-b border-black text-gray-300';
    }
  };

  if (showLanding) {
    return <LandingPage onStart={() => setShowLanding(false)} />;
  }

  return (
    <ErrorBoundary>
        <div className={`h-screen flex flex-col ${stage === Stage.PRO || stage === Stage.TEEN ? 'bg-black' : 'bg-white'} font-sans overflow-hidden`}>
        
        {/* Evolution Overlay */}
        {isEvolving && (
            <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center text-white">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse rounded-full"></div>
                    <i className="fas fa-dna text-6xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-spin-slow mb-8"></i>
                </div>
                <h2 className="text-3xl font-bold mb-2">Evolving Logic...</h2>
                <p className="text-gray-400">Rewriting syntax for {stage === Stage.TEEN ? 'Pro' : 'Next'} Level</p>
            </div>
        )}

        {/* Navbar */}
        <nav 
            className={`h-16 flex items-center justify-between px-4 md:px-6 shadow-md z-30 transition-colors duration-500 shrink-0 ${getNavbarColor()}`}
            role="navigation"
            aria-label="Main Navigation"
        >
            <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => setShowLanding(true)}>
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg" aria-hidden="true">E</div>
            <h1 className={`text-lg md:text-xl font-bold ${stage === Stage.KIDS ? 'text-gray-800' : 'text-white'} hidden sm:block`}>{t.appTitle}</h1>
            <span className={`text-[10px] md:text-xs px-2 py-1 rounded-full font-mono ${stage === Stage.KIDS ? 'bg-gray-200 text-gray-600' : 'bg-white/20 text-white'}`}>
                {stage}
            </span>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
            {/* Language Selector */}
            <div className="relative">
                <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                aria-label="Select Language"
                className={`text-xs font-bold rounded py-1 px-1 md:px-2 border-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${stage === Stage.KIDS ? 'bg-gray-100 text-gray-800' : 'bg-gray-700 text-white'}`}
                >
                <option value="en">🇺🇸 EN</option>
                <option value="es">🇪🇸 ES</option>
                <option value="fr">🇫🇷 FR</option>
                <option value="zh">🇨🇳 ZH</option>
                </select>
            </div>

            {/* Mission Text - Hidden on small mobile */}
            <div 
                className={`hidden lg:flex px-4 py-1 rounded-full text-xs font-bold items-center gap-2 max-w-[200px] truncate ${stage === Stage.KIDS ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-800 text-green-400'}`}
                role="status" 
                aria-label="Current Mission"
            >
                <i className="fas fa-bullseye" aria-hidden="true"></i> 
                <span className="truncate">{mission}</span>
            </div>

            <button 
                onClick={handleEvolve}
                disabled={isEvolving}
                aria-busy={isEvolving}
                aria-label={stage === Stage.PRO ? t.reset : t.evolve}
                className={`flex items-center gap-2 px-3 md:px-6 py-2 rounded-full font-bold shadow-lg text-xs md:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${isEvolving ? 'opacity-50 cursor-wait' : 'animate-pulse hover:scale-105'}
                ${stage === Stage.PRO ? 'bg-red-600 text-white' : 'bg-gradient-to-r from-green-400 to-blue-500 text-white'}
                `}
            >
                <i className={`fas ${isEvolving ? 'fa-spinner fa-spin' : 'fa-dna'}`} aria-hidden="true"></i>
                <span className="hidden sm:inline">{isEvolving ? t.evolving : stage === Stage.PRO ? t.reset : t.evolve}</span>
                <span className="sm:hidden">{stage === Stage.PRO ? 'Reset' : 'Evolve'}</span>
            </button>
            
            <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                aria-label="Toggle AI Tutor Sidebar"
                aria-expanded={isSidebarOpen}
                className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${stage === Stage.KIDS ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-300 hover:bg-gray-800'}`}
            >
                <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-columns'}`} aria-hidden="true"></i>
            </button>
            </div>
        </nav>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden relative">
            <main className="flex-1 relative transition-all duration-500 w-full overflow-hidden" role="main">
            {renderStage()}
            
            {/* Auto-save Indicator */}
            <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 pointer-events-none opacity-50 z-10">
                <span className={`text-[10px] px-2 py-1 rounded-full ${stage === Stage.KIDS ? 'bg-gray-200 text-gray-500' : 'bg-black/50 text-gray-400'}`}>
                <i className="fas fa-save mr-1"></i> Saved {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
            </div>
            </main>

            {/* AI Sidebar - Responsive Overlay for Mobile, Side Panel for Desktop */}
            <aside 
            className={`
                fixed md:relative top-[64px] md:top-0 right-0 bottom-0 
                w-full md:w-96 
                shadow-2xl z-20 transition-transform duration-300 transform 
                ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:w-0 md:overflow-hidden'}
            `}
            >
            <AIAssistant 
                stage={stage} 
                currentCode={code || logicStack.join(" ")} 
                mission={mission} 
                language={language} 
                lesson={currentLesson} 
            />
            </aside>
        </div>
        </div>
    </ErrorBoundary>
  );
}