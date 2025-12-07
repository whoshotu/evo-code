import React from 'react';

interface Props {
  onStart: () => void;
}

export const LandingPage: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white flex flex-col font-sans overflow-y-auto">
      {/* Navbar / Header */}
      <header className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">E</div>
          <h1 className="text-2xl font-extrabold tracking-tight">EvolveCode</h1>
        </div>
        <a 
          href="https://www.stjude.org/donate" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm transition-transform hover:scale-105 shadow-md flex items-center gap-2"
        >
          <i className="fas fa-heart"></i> Donate to St. Jude
        </a>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto py-12 md:py-0">
        <div className="mb-8 relative">
           <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full"></div>
           <i className="fas fa-brain text-8xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500 relative z-10 animate-pulse"></i>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          The Coding Tutor That <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-kid-secondary to-kid-primary">Grows With You</span>
        </h2>
        
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
          EvolveCode uses advanced AI to adapt the interface and curriculum to your age and skill level. 
          Start with emoji blocks, evolve into logic puzzles, and master professional Python—all in one app.
        </p>

        <button 
          onClick={onStart}
          className="group relative px-8 py-4 bg-white text-indigo-900 font-bold text-xl rounded-full shadow-2xl hover:shadow-white/20 hover:-translate-y-1 transition-all duration-300"
        >
          <span className="flex items-center gap-3">
            Start Coding Now
            <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </span>
          <div className="absolute inset-0 rounded-full ring-4 ring-white/30 animate-ping opacity-0 group-hover:opacity-100"></div>
        </button>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 text-left w-full">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/15 transition">
            <div className="text-4xl mb-4">🧸</div>
            <h3 className="text-xl font-bold mb-2 text-kid-primary">Kids Mode</h3>
            <p className="text-sm text-gray-300">Gamified learning with emojis and simple commands. No typing required.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/15 transition">
            <div className="text-4xl mb-4">🧩</div>
            <h3 className="text-xl font-bold mb-2 text-blue-400">Tween Mode</h3>
            <p className="text-sm text-gray-300">Drag-and-drop logic blocks similar to Scratch. Learn loops and conditionals.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/15 transition">
            <div className="text-4xl mb-4">💻</div>
            <h3 className="text-xl font-bold mb-2 text-green-400">Pro IDE</h3>
            <p className="text-sm text-gray-300">Full Python environment with AI code completion, linting, and asset generation.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-gray-500 text-sm">
        <p>© 2025 EvolveCode. Empowering the next generation.</p>
        <p className="mt-2 text-xs">This is a non-profit project. Please support children's health.</p>
      </footer>
    </div>
  );
};
