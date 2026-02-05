import { Stage, Lesson, Language } from '../types';

/**
 * Backend Service
 * Communicates with the PHP backend proxy instead of calling AI directly
 * This keeps API keys secure on the server
 */

// Backend API URL - YOUR ALTERVISTA DOMAIN (subdirectory)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://hereisreal.altervista.org/evolve-code/backend/api/ai-proxy.php';

/**
 * Call the backend AI proxy
 */
async function callBackend(action: string, payload: any, provider: string = 'openrouter') {
  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        payload,
        provider
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'API request failed');
    }

    return data.data;
  } catch (error) {
    console.error('Backend API error:', error);
    throw error;
  }
}

/**
 * Generate a mission for the current stage
 */
export async function generateMission(
  stage: Stage, 
  language: Language, 
  lesson?: Lesson
): Promise<string> {
  try {
    const result = await callBackend('generateMission', {
      stage,
      lesson: lesson ? lesson.title : null,
      language
    });
    
    return result.mission || "Start coding and have fun!";
  } catch (error) {
    console.error('Failed to generate mission:', error);
    // Fallback missions if backend fails
    const fallbacks: Record<Stage, string> = {
      [Stage.KIDS]: "🌟 Help the bee find the flower!",
      [Stage.TWEEN]: "🎮 Make the sprite dance when you press space!",
      [Stage.TEEN]: "🐍 Write code to count from 1 to 10!",
      [Stage.PRO]: "💻 Refactor this code to be more efficient!"
    };
    return fallbacks[stage] || "Start coding!";
  }
}

/**
 * Evolve code from one stage to another
 */
export async function evolveCode(
  currentCode: string,
  fromStage: Stage,
  toStage: Stage,
  language: Language
): Promise<string> {
  try {
    // Prepare input based on stage
    let inputLogic = currentCode;
    
    // For KIDS stage, we might have logic stack to convert
    if (fromStage === Stage.KIDS && Array.isArray(currentCode)) {
      inputLogic = currentCode.join(", ");
    }

    const result = await callBackend('evolveCode', {
      currentCode: inputLogic,
      fromStage,
      toStage,
      language
    });

    return result.code || "// Evolution failed, please try again";
  } catch (error) {
    console.error('Failed to evolve code:', error);
    return `// Evolution failed: ${error}\n// Please check your internet connection and try again`;
  }
}

/**
 * Get help from the AI tutor
 */
export async function getTutorHelp(
  query: string,
  code: string,
  stage: Stage,
  mission: string,
  language: Language,
  lesson?: Lesson
): Promise<string> {
  try {
    const result = await callBackend('getTutorHelp', {
      query,
      code,
      stage,
      mission,
      language
    });

    return result.response || "I'm here to help! What would you like to know?";
  } catch (error) {
    console.error('Failed to get tutor help:', error);
    return "I'm having trouble connecting. Try refreshing the page or check your internet connection. 🔧";
  }
}

/**
 * Simulate code execution
 */
export async function simulateCodeExecution(code: string): Promise<string> {
  try {
    const result = await callBackend('simulateCode', {
      code
    });

    return result.simulation || "Code simulation complete!";
  } catch (error) {
    console.error('Failed to simulate code:', error);
    return "Unable to simulate code at this time. Please try again.";
  }
}

/**
 * Test backend connection
 */
export async function testBackendConnection(): Promise<boolean> {
  try {
    // Try a simple request
    const response = await fetch(BACKEND_URL, {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.ok;
  } catch (error) {
    console.error('Backend connection test failed:', error);
    return false;
  }
}

/**
 * Generate text with AI
 */
export async function generateText(prompt: string, maxTokens: number = 500): Promise<string> {
  try {
    const result = await callBackend('generateText', {
      prompt,
      maxTokens
    });

    return result.text || "";
  } catch (error) {
    console.error('Failed to generate text:', error);
    return "";
  }
}

// ============================================
// AUDIO FUNCTIONS (Text-to-Speech)
// ============================================

/**
 * Play raw audio from base64 string
 * Supports various audio formats decoded from base64
 */
export const playRawAudio = async (base64String: string): Promise<void> => {
  try {
    // Cross-browser AudioContext creation
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContextClass();
    
    // Decode base64 to binary
    const binaryString = atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    // Convert to Float32 for AudioContext (16-bit PCM to Float)
    const dataInt16 = new Int16Array(bytes.buffer);
    
    // Create buffer with the source sample rate (24000)
    const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
    }

    // Play
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    
    // Resource Management: Close context after playback
    source.onended = () => {
        audioContext.close().catch(e => console.error("Error closing AudioContext", e));
    };
    
    source.start();
  } catch (e) {
    console.error("Audio playback error", e);
  }
};

/**
 * Generate speech from text using backend TTS service
 * Note: Returns null as TTS requires special handling through backend
 */
export const generateSpeech = async (_text: string): Promise<string | null> => {
  // TTS functionality moved to backend
  // This is a placeholder - implement backend TTS endpoint if needed
  console.log("TTS: Feature available through backend API");
  return null;
};
