# 🛠️ EvolveCode: Technology Stack Documentation

## Table of Contents

1. [Overview](#overview)
2. [Core Technologies](#core-technologies)
3. [Architecture](#architecture)
4. [AI Integration](#ai-integration)
5. [Development Tools](#development-tools)
6. [Dependencies](#dependencies)

---

## Overview

**EvolveCode** is an adaptive AI-powered coding education platform that dynamically evolves its interface and complexity based on user skill level. The platform transitions through 4 distinct stages: **KIDS** → **TWEEN** → **TEEN** → **PRO**, each with progressively sophisticated UI/UX and coding paradigms.

### Project Type

- **Category**: Educational Web Application
- **Target Audience**: Ages 6+ to Professional Developers
- **Primary Goal**: Bridge the "Cliff Problem" in coding education (block-based → syntax-based transition)

---

## Core Technologies

### Frontend Framework

- **React 19.2.1** (Latest)
  - Functional components with Hooks
  - Error Boundaries for production stability
  - State management via `useState` and `useEffect`
  - LocalStorage persistence for user progress

### Language

- **TypeScript 5.8.2**
  - Strict type safety
  - Custom type definitions (`types.ts`)
  - Enum-based stage management
  - Interface-driven architecture

### Build Tool

- **Vite 6.2.0**
  - Fast HMR (Hot Module Replacement)
  - ES Module-based bundling
  - Environment variable injection
  - Path aliasing (`@/` → root directory)
  - Development server on port 3000

### Styling

- **Tailwind CSS** (CDN-based)
  - Utility-first CSS framework
  - Custom theme extensions:
    - Colors: `kid-primary`, `kid-secondary`, `pro-bg`, `pro-sidebar`, `pro-accent`
    - Animations: `spin-slow` (3s rotation)
  - Responsive design (mobile-first)
  - Dark mode support for TEEN/PRO stages

### Typography

- **Google Fonts**
  - **Inter**: Primary UI font (weights: 400, 600, 800)
  - **Fira Code**: Monospace font for code editor

### Icons

- **Font Awesome 6.0.0**
  - Used for UI icons (DNA, spinner, save, etc.)
  - Semantic icon usage with `aria-hidden="true"`

---

## Architecture

### Component Structure

```
EvolveCode/
├── App.tsx                 # Main application orchestrator
├── components/
│   ├── LandingPage.tsx     # Onboarding screen
│   ├── StageKids.tsx       # Block-based drag-and-drop UI
│   ├── StageTween.tsx      # Scratch-like visual programming
│   ├── StageTeen.tsx       # Simplified Python editor
│   ├── StagePro.tsx        # Full-featured IDE
│   ├── AIAssistant.tsx     # Context-aware AI tutor sidebar
│   ├── ChatTutor.tsx       # Conversational feedback system
│   ├── VisualGrid.tsx      # Game-like grid visualization
│   └── EvolveLayout.tsx    # Shared layout wrapper
├── services/
│   └── geminiService.ts    # Google Gemini API integration
├── data/
│   ├── curriculum.ts       # Structured lesson plans
│   ├── levels.ts           # Teaching configuration
│   ├── translations.ts     # i18n support (en, es, fr, zh)
│   └── user_progression.csv # ML training data
├── types.ts                # TypeScript type definitions
└── utils/                  # Helper functions
```

### State Management

**Local State (React Hooks)**

- `stage`: Current learning stage (KIDS/TWEEN/TEEN/PRO)
- `language`: UI language (en/es/fr/zh)
- `code`: Current code content
- `logicStack`: Array of block actions (KIDS mode)
- `completedLessons`: Array of lesson IDs
- `mission`: AI-generated mission text
- `isSidebarOpen`: AI assistant visibility
- `isEvolving`: Evolution animation state

**Persistence Layer**

- **LocalStorage Keys**:
  - `evolve_stage`: Current stage
  - `evolve_lang`: Selected language
  - `evolve_code`: Code content
  - `evolve_logicStack`: Block sequence
  - `evolve_completedLessons`: Progress tracking

### Routing Strategy

- **Single-Page Application (SPA)**
- Conditional rendering based on `stage` state
- No external routing library (React Router not used)
- Landing page toggle via `showLanding` state

---

## AI Integration

### Google Gemini API

**Primary Service**: `services/geminiService.ts`

#### Models Used

| Model | Purpose | Stage | Features |
|-------|---------|-------|----------|
| `gemini-2.5-flash-lite` | Fast text generation | All | Mission generation, basic tutoring |
| `gemini-2.5-flash-preview-tts` | Text-to-Speech | KIDS | Voice feedback (Kore voice) |
| `gemini-3-pro-preview` | Deep reasoning | PRO | Thinking Mode (32K budget) |
| `gemini-3-pro-image-preview` | Image generation | All | Asset creation (1K/2K/4K) |
| `veo-3.1-fast-generate-preview` | Video generation | All | Animated tutorials (16:9, 9:16) |

#### Key Functions

1. **`evolveCode()`**
   - Translates code between stages
   - KIDS → TWEEN: Blocks to Scratch-like descriptions
   - TWEEN → TEEN: Visual to simplified Python
   - TEEN → PRO: Beginner to professional Python (classes, type hints, docstrings)

2. **`getTutorHelp()`**
   - Context-aware AI assistance
   - Adapts tone based on stage (emojis for KIDS, technical for PRO)
   - Safety filters (hate speech, harassment, explicit content)
   - Lesson-aware responses

3. **`generateMission()`**
   - Creates stage-appropriate coding challenges
   - Multilingual support
   - Emoji-prefixed for KIDS

4. **`simulateCodeExecution()`**
   - Simulates Python code execution
   - Returns stdout or error messages
   - Secure (no actual code execution)

5. **`generateSpeech()`**
   - Converts text to PCM audio (24kHz)
   - Base64 decoding and playback
   - AudioContext-based rendering

#### Safety Protocols

- **Harm Categories Blocked**:
  - Hate Speech
  - Harassment
  - Sexually Explicit Content
  - Dangerous Content
- **Threshold**: `BLOCK_LOW_AND_ABOVE`
- **Topic Restrictions**: Strictly coding-focused, refuses off-topic queries

---

## Development Tools

### Package Manager

- **npm** (implied from `package.json` scripts)

### Scripts

```json
{
  "dev": "vite",              // Start dev server
  "build": "vite build",      // Production build
  "preview": "vite preview"   // Preview production build
}
```

### Environment Variables

- **`GEMINI_API_KEY`**: Google Gemini API key
- **Injection**: Via Vite's `loadEnv()` and `define` config
- **Access**: `process.env.API_KEY` or `process.env.GEMINI_API_KEY`

### TypeScript Configuration

- **Target**: ES2022
- **Module**: ESNext
- **JSX**: `react-jsx` (automatic runtime)
- **Module Resolution**: `bundler`
- **Experimental Decorators**: Enabled
- **Isolated Modules**: Enabled
- **No Emit**: True (Vite handles transpilation)

### Browser Compatibility

- **Minimum**: Modern browsers with ES2022 support
- **Audio**: Web Audio API (cross-browser AudioContext)
- **Storage**: LocalStorage API
- **Accessibility**: ARIA labels, semantic HTML

---

## Dependencies

### Production Dependencies

```json
{
  "react": "^19.2.1",
  "react-dom": "^19.2.1",
  "@google/genai": "^1.31.0"
}
```

### Development Dependencies

```json
{
  "@types/node": "^22.14.0",
  "@vitejs/plugin-react": "^5.0.0",
  "typescript": "~5.8.2",
  "vite": "^6.2.0"
}
```

### CDN Resources

- **Tailwind CSS**: `https://cdn.tailwindcss.com`
- **Font Awesome**: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css`
- **Google Fonts**: Inter, Fira Code
- **Import Maps**: React and Gemini from `aistudiocdn.com`

---

## Performance Optimizations

### Code Splitting

- Lazy loading potential for stage components
- Conditional rendering reduces initial bundle size

### Caching Strategy

- LocalStorage for state persistence
- Auto-save on state changes
- Last saved timestamp tracking

### Audio Optimization

- AudioContext resource management
- Automatic context closure after playback
- PCM to Float32 conversion for Web Audio API

### API Efficiency

- Model selection based on task complexity:
  - Flash-Lite for speed (missions, basic tutoring)
  - Pro with Thinking Mode for complex reasoning
- Timeout protection for video generation (150s max)

---

## Accessibility Features

### ARIA Support

- `role="navigation"`, `role="main"`, `role="status"`
- `aria-label` on interactive elements
- `aria-busy` for loading states
- `aria-expanded` for collapsible sections
- `aria-hidden` for decorative icons

### Keyboard Support

- **Ctrl+S / Cmd+S**: Manual save trigger
- **Esc / M**: Menu access (planned)
- Focus management with `focus:ring` styles

### Internationalization (i18n)

- **Supported Languages**: English, Spanish, French, Chinese
- **Dynamic HTML Lang**: Updates `<html lang="">` attribute
- **Translation System**: `data/translations.ts`

### Visual Accessibility

- High contrast modes (dark/light)
- Font smoothing for readability
- Responsive text sizing
- Color-blind friendly palette (not emoji-dependent)

---

## Security Considerations

### API Key Protection

- Environment variable storage (not committed to Git)
- Client-side injection via Vite
- **Warning**: API key exposed in client bundle (consider backend proxy for production)

### Content Safety

- AI-generated content filtered via Gemini safety settings
- No user-generated code execution (simulated only)
- Error boundary prevents crash-based exploits

### Data Privacy

- LocalStorage only (no server-side storage)
- No user authentication or PII collection
- No external analytics (privacy-first)

---

## Deployment Considerations

### Recommended Platforms

- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages** (with SPA routing config)

### Build Process

```bash
npm run build
# Output: dist/ folder
```

### Environment Setup

```bash
# .env file (not committed)
GEMINI_API_KEY=your_api_key_here
```

### Production Checklist

- [ ] Set `GEMINI_API_KEY` in deployment platform
- [ ] Configure SPA fallback routing
- [ ] Enable HTTPS
- [ ] Test cross-browser compatibility
- [ ] Verify mobile responsiveness
- [ ] Test accessibility with screen readers

---

## Future Stack Enhancements

### Planned Additions

- **Monaco Editor**: Full code editor for PRO stage
- **WebRTC**: Real-time collaboration
- **IndexedDB**: Offline support for lessons
- **Service Workers**: PWA capabilities
- **Backend API**: User accounts, progress sync
- **ML Model**: Client-side progression prediction (TensorFlow.js)

### Scalability Considerations

- **State Management**: Consider Redux/Zustand for complex state
- **Routing**: React Router for multi-page expansion
- **Testing**: Jest + React Testing Library
- **CI/CD**: GitHub Actions for automated testing/deployment

---

## License & Attribution

- **Framework**: React (MIT License)
- **AI**: Google Gemini API (Commercial use requires paid key)
- **Icons**: Font Awesome (Free License)
- **Fonts**: Google Fonts (Open Font License)

---

**Last Updated**: 2026-02-04  
**Maintained By**: EvolveCode Team  
**Contact**: See README.md for contribution guidelines
