import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { Stage, Lesson, Language } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// --- Helper for PCM Audio Decoding ---
export const playRawAudio = async (base64String: string) => {
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
    
    // Create buffer with the source sample rate (24000 for Gemini)
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

export const generateSpeech = async (text: string): Promise<string | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: { parts: [{ text }] },
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    // Return raw base64 data
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (e) {
    console.error("TTS Error", e);
    return null;
  }
};

export const generateAssetImage = async (prompt: string, size: '1K' | '2K' | '4K'): Promise<string> => {
    const ai = getAiClient();
    if (!ai) throw new Error("API Key not found or invalid.");

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: { parts: [{ text: prompt }] },
            config: {
                imageConfig: {
                    aspectRatio: "1:1",
                    imageSize: size
                }
            }
        });

        // Loop to find image part
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No image data found in response.");
    } catch (e: any) {
        console.error("Image Gen Error", e);
        throw new Error(e.message || "Image generation failed.");
    }
};

export const generateAssetVideo = async (prompt: string, aspectRatio: '16:9' | '9:16', imageBase64WithPrefix?: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) throw new Error("API Key not found.");

  // Check for paid key selection for Veo
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey && window.aistudio.openSelectKey) {
          await window.aistudio.openSelectKey();
      }
  }

  try {
    const req: any = {
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
            numberOfVideos: 1,
            resolution: '1080p',
            aspectRatio: aspectRatio
        }
    };

    if (imageBase64WithPrefix) {
        const mimeMatch = imageBase64WithPrefix.match(/^data:(.*);base64,(.*)$/);
        if (mimeMatch) {
            req.image = {
                mimeType: mimeMatch[1],
                imageBytes: mimeMatch[2]
            };
        }
    }

    let operation = await ai.models.generateVideos(req);

    // Safety: Prevent infinite loops if generation hangs
    let attempts = 0;
    const MAX_POLL_ATTEMPTS = 30; // 30 * 5s = 150 seconds max

    while (!operation.done) {
      if (attempts >= MAX_POLL_ATTEMPTS) {
        throw new Error("Video generation timed out.");
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({operation: operation});
      attempts++;
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (videoUri) {
        // Fetch the actual bytes using the API key
        const videoRes = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
        if (!videoRes.ok) throw new Error("Failed to download generated video.");
        const blob = await videoRes.blob();
        return URL.createObjectURL(blob);
    }
    throw new Error("No video URI in response.");
  } catch (e: any) {
    console.error("Video Gen Error", e);
    throw new Error(e.message || "Video generation failed.");
  }
};

export const generateMission = async (stage: Stage, language: Language, lesson?: Lesson): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Mission: Learn to code! (Set API Key)";

  // If we have a structured lesson, stick to it but make it fun
  const context = lesson ? `Lesson Title: ${lesson.title}. Problem: ${lesson.description}. Task: ${lesson.task}` : "General Coding";

  const prompt = `
    Generate a short, fun, 1-sentence coding mission for a student in ${stage} stage.
    Context: ${context}
    Language: ${language}
    
    CRITICAL OUTPUT RULES:
    1. Translate the mission title into the requested language (${language}).
    2. For KIDS stage: Must start with a relevant Emoji. Must be solvable with 'Move', 'Turn', and 'Repeat'. 
    3. For TWEEN stage: Logic puzzle format.
    4. For TEEN/PRO: Professional task description.
    
    Output ONLY the sentence in ${language}.
  `;

  try {
    // Use Flash-Lite for low-latency text generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });
    return response.text?.trim() || "Start coding!";
  } catch (error) {
    return "Explore the editor!";
  }
};

export const evolveCode = async (currentCode: string, fromStage: Stage, toStage: Stage, language: Language): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "// Error: API Key missing. Please set process.env.API_KEY";

  let specificInstruction = "";
  let modelName = 'gemini-2.5-flash-lite'; // Default to fast model
  let config: any = {};
  
  if (toStage === Stage.TWEEN) {
    specificInstruction = "Convert the list of user actions into Scratch-like block descriptions. Format: One block per line. Use emojis for visuals.";
  } else if (toStage === Stage.TEEN) {
    specificInstruction = "Convert the logic into simplified Python. No classes, just functions or direct script. Keep it readable for beginners.";
  } else if (toStage === Stage.PRO) {
    // Use Thinking Mode for complex code evolution (Pro level)
    modelName = 'gemini-3-pro-preview';
    config = { thinkingConfig: { thinkingBudget: 32768 } };
    specificInstruction = "Convert the logic into professional, idiomatic Python. Use classes, type hints, main guards, and proper docstrings. Optimize for 'Big O' efficiency.";
  }

  const prompt = `
    Act as an expert coding tutor engine. 
    Task: Evolve the code from ${fromStage} complexity to ${toStage} complexity.
    Language: ${language}
    
    Current Input: "${currentCode}"
    
    Instruction: ${specificInstruction}
    
    Output Rules:
    - ONLY return the code content. 
    - Do NOT wrap in markdown code blocks.
    - Do not add conversational text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: config
    });
    return response.text ? response.text.replace(/```python|```/g, '').trim() : "";
  } catch (error) {
    console.error("Evolution failed:", error);
    return `# Evolution failed. \n# Error: ${error}\n# Try checking your API Key.`;
  }
};

export const getTutorHelp = async (query: string, code: string, stage: Stage, mission: string, language: Language, lesson?: Lesson): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "I need an API key to help you! (Set process.env.API_KEY)";

  // Configuration based on stage
  let modelName = 'gemini-2.5-flash-lite'; // Default to Flash-Lite for speed
  let config: any = {};

  if (stage === Stage.PRO) {
    // USE THINKING MODE FOR PRO
    modelName = 'gemini-3-pro-preview';
    config = {
      thinkingConfig: { thinkingBudget: 32768 } // Max thinking budget for deep reasoning
    };
  }

  // Safety settings to prevent harm
  const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
  ];

  let lessonContext = "";
  if (lesson) {
      lessonContext = `
      CURRENT LESSON:
      - Title: ${lesson.title}
      - Problem: ${lesson.description}
      - Task: ${lesson.task}
      - Solution Context: ${lesson.solutionExplanation}
      `;
      
      if (lesson.gridConfig) {
          lessonContext += `
          GAME STATE (Visual Grid):
          - Grid Size: ${lesson.gridConfig.gridSize}x${lesson.gridConfig.gridSize}
          - Start Position: ${lesson.gridConfig.startPos}
          - Goal Position: ${lesson.gridConfig.goalPos}
          - Player Avatar: ${lesson.gridConfig.avatarEmoji}
          `;
      }
  }

  const systemInstruction = `You are EvolveCode's AI Tutor. The user is in ${stage} mode.
  
  Language: Respond to the user in ${language}.
  Current Mission: "${mission}"
  ${lessonContext}
  
  SAFETY & TOPIC PROTOCOLS (STRICT):
  1. You are strictly a CODING TUTOR. Do NOT discuss politics, religion, personal advice, or general trivia.
  2. If the user asks about off-topic subjects, politely refuse.
  3. Never generate malicious code.
  4. If generating loops, always ensure there is an exit condition.
  
  Tone Guidelines:
  - KIDS: Use emojis 🌟, simple metaphors (loops are magic circles), keep it very short and exciting!
  - TWEEN: Be encouraging but introduce terms like "Event" and "Variable".
  - TEEN: Casual but technical. Like a mentor.
  - PRO: Professional, terse, expert.
  
  Context: User is working on this code: \n${code}`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: query,
      config: {
        systemInstruction: systemInstruction,
        safetySettings: safetySettings,
        ...config
      }
    });
    return response.text || "I'm thinking...";
  } catch (error) {
    console.error("Tutor failed:", error);
    return "My safety protocols prevented a response, or the system is busy. Let's focus on the code!";
  }
};

export const simulateCodeExecution = async (code: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return "Error: API Key missing.";

    const prompt = `
        Act as a secure Python interpreter.
        Execute the following Python code mentally and provide the standard output (stdout).
        If there are errors, provide the Python error message.
        
        CODE:
        ${code}
        
        OUTPUT RULES:
        - Return ONLY the output text.
        - No conversational text or markdown.
        - If the code has no output, return "[Process finished with exit code 0]".
    `;

    try {
        // Use Flash-Lite for immediate execution feedback
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
        });
        return response.text?.trim() || "";
    } catch (error) {
        return `Execution Error: ${error}`;
    }
};