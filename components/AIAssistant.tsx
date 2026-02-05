import React, { useState, useEffect, useRef } from 'react';
import { getTutorHelp, generateSpeech, playRawAudio } from '../services/backendService';
import { Stage, ChatMessage, Language, Lesson } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface Props {
  stage: Stage;
  currentCode: string;
  mission: string;
  language: Language;
  lesson?: Lesson; // Added lesson prop
}

export const AIAssistant: React.FC<Props> = ({ stage, currentCode, mission, language, lesson }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isDarkMode = stage === Stage.PRO || stage === Stage.TEEN;
  const t = TRANSLATIONS[language];

  // Proactive greeting when mission loads
  useEffect(() => {
    if (mission && mission !== "Loading mission..." && mission !== "Generating curriculum...") {
      setMessages([
        { role: 'model', text: `👋 Welcome to ${stage} Mode! (${language})\n\n**${mission}**` }
      ]);
    }
  }, [stage, mission, language]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    const reply = await getTutorHelp(userMsg, currentCode, stage, mission, language, lesson);
    setMessages(prev => [...prev, { role: 'model', text: reply }]);
    setLoading(false);
  };

  const handleSpeak = async (text: string, index: number) => {
      setSpeakingId(index);
      const audioData = await generateSpeech(text);
      if (audioData) {
          await playRawAudio(audioData);
      }
      setSpeakingId(null);
  };

  return (
    <div className={`flex flex-col h-full border-l ${isDarkMode ? 'border-gray-800 bg-pro-sidebar' : 'border-gray-200 bg-white'}`} role="complementary" aria-label={t.aiTutor}>
      <div className={`p-4 font-bold border-b flex justify-between items-center ${isDarkMode ? 'text-gray-200 border-gray-800' : 'text-gray-700 border-gray-200'}`}>
        <span><i className="fas fa-robot mr-2 text-pro-accent"></i> {t.aiTutor}</span>
        <span className="text-[10px] uppercase tracking-widest opacity-50">
            {stage === Stage.PRO ? `AI Tutor Pro` : `AI Tutor`}
        </span>
      </div>

      {/* Mission Card */}
      <div className={`m-4 p-4 rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-100'}`}>
         <h4 className={`text-xs font-bold uppercase mb-1 ${isDarkMode ? 'text-gray-400' : 'text-blue-400'}`}>{t.mission}</h4>
         <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
           {mission}
         </p>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4" role="log" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-lg text-sm whitespace-pre-wrap ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : isDarkMode ? 'bg-gray-700 text-gray-200 rounded-bl-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'
            }`}>
              {m.text}
            </div>
            {m.role === 'model' && (
                <button 
                    onClick={() => handleSpeak(m.text, i)}
                    disabled={speakingId === i}
                    aria-label={t.readAloud}
                    className={`mt-1 text-xs flex items-center gap-1 ${isDarkMode ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-blue-500'}`}
                >
                    <i className={`fas ${speakingId === i ? 'fa-spinner fa-spin' : 'fa-volume-up'}`} aria-hidden="true"></i>
                    {speakingId === i ? t.loadingAudio : t.readAloud}
                </button>
            )}
          </div>
        ))}
        {loading && (
          <div className="text-xs text-gray-400 animate-pulse ml-2" aria-live="polite">...</div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className={`p-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex gap-2">
          <label htmlFor="chat-input" className="sr-only">Chat input</label>
          <input 
            id="chat-input"
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.askPlaceholder}
            className={`flex-1 p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode ? 'bg-[#1e1e1e] border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
          />
          <button 
            onClick={handleSend}
            aria-label="Send Message"
            className="p-2 bg-pro-accent text-white rounded hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <i className="fas fa-paper-plane" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  );
};