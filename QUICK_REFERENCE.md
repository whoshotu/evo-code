# 📚 EvolveCode: Quick Reference Guide

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔑 Environment Setup

```bash
# Create .env file
echo "GEMINI_API_KEY=your_api_key_here" > .env

# Get API key from:
# https://aistudio.google.com/apikey
```

## 📁 Project Structure

```
evo-code/
├── 📄 App.tsx              # Main app logic
├── 🧩 components/          # UI components
├── 🤖 services/            # AI integration
├── 📚 data/                # Curriculum & translations
├── 🎨 types.ts             # TypeScript types
└── 📖 docs/                # Documentation
```

## 🎯 Key Concepts

### Stages

- **KIDS**: Block-based (ages 6-10)
- **TWEEN**: Visual programming (ages 10-13)
- **TEEN**: Simplified Python (ages 13-16)
- **PRO**: Full IDE (16+)

### State Management

- **LocalStorage**: Automatic persistence
- **React Hooks**: useState, useEffect
- **No Redux**: Simple state structure

### AI Models

- **Flash-Lite**: Fast responses (missions, basic help)
- **Pro**: Deep reasoning (complex code evolution)
- **TTS**: Voice feedback (KIDS mode)

## 🛠️ Common Tasks

### Add a New Lesson

```typescript
// data/curriculum.ts
{
  id: 'k-l6',
  title: 'New Lesson',
  description: 'Learn something new',
  task: 'Complete this task',
  gridConfig: {
    gridSize: 5,
    startPos: [0, 0],
    goalPos: [4, 4],
    avatarEmoji: '🐝',
    goalEmoji: '🌻'
  }
}
```

### Add a Translation

```typescript
// data/translations.ts
export const TRANSLATIONS = {
  en: { newKey: "English text" },
  es: { newKey: "Texto en español" }
};
```

### Call AI Service

```typescript
import { getTutorHelp } from './services/geminiService';

const response = await getTutorHelp(
  "How do I use loops?",
  code,
  Stage.TEEN,
  mission,
  'en'
);
```

## 🐛 Debugging

### Clear Corrupted State

```javascript
// Browser console (F12)
localStorage.clear();
location.reload();
```

### Check API Key

```javascript
// Browser console
console.log(process.env.API_KEY);
```

### View Current State

```javascript
// Add to App.tsx temporarily
console.log({ stage, code, logicStack, completedLessons });
```

## 🎨 Styling

### Tailwind Classes

```tsx
// Kids mode colors
className="bg-kid-primary text-white"

// Pro mode colors
className="bg-pro-bg text-gray-300"

// Responsive
className="hidden md:block lg:flex"
```

### Custom Animations

```tsx
className="animate-pulse"      // Pulsing effect
className="animate-spin-slow"  // Slow rotation
```

## 🔒 Security

### API Key Protection

- ⚠️ **Current**: Exposed in client bundle
- ✅ **Future**: Move to backend proxy

### Safe Code Execution

- ✅ **Simulation only**: No eval() or Function()
- ✅ **AI-based**: Gemini simulates execution

## 📊 File Sizes (Approximate)

| File | Lines | Purpose |
|------|-------|---------|
| App.tsx | 365 | Main orchestrator |
| geminiService.ts | 361 | AI integration |
| StagePro.tsx | 183 | Professional IDE |
| StageKids.tsx | 65 | Block-based UI |
| curriculum.ts | 145 | Lesson data |

## 🌐 Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

## 📦 Dependencies

### Production

- `react@19.2.1`
- `react-dom@19.2.1`
- `@google/genai@1.31.0`

### Development

- `vite@6.2.0`
- `typescript@5.8.2`
- `@vitejs/plugin-react@5.0.0`

## 🚀 Deployment

### Vercel (Recommended)

```bash
vercel login
vercel link
vercel env add GEMINI_API_KEY
vercel --prod
```

### Netlify

```bash
netlify login
netlify init
netlify env:set GEMINI_API_KEY your_key
netlify deploy --prod
```

## 📈 Performance Tips

### Optimize AI Calls

```typescript
// Use Flash-Lite for speed
model: 'gemini-2.5-flash-lite'

// Use Pro only when needed
if (stage === Stage.PRO) {
  model: 'gemini-3-pro-preview'
}
```

### Reduce Bundle Size

```typescript
// Code splitting (future)
const StagePro = React.lazy(() => import('./components/StagePro'));
```

## 🧪 Testing Checklist

- [ ] All stages render without errors
- [ ] Evolution animation works
- [ ] LocalStorage persists correctly
- [ ] AI assistant responds
- [ ] Language switching works
- [ ] Mobile responsive
- [ ] No console errors

## 📞 Getting Help

### Documentation

- `README.md` - Project overview
- `STACK_DOCUMENTATION.md` - Technology details
- `WORKFLOW_GUIDE.md` - Development processes
- `ARCHITECTURE.md` - System design
- `DESIGN_JOURNAL.md` - Learning science

### External Resources

- [React Docs](https://react.dev)
- [Gemini API](https://ai.google.dev/gemini-api/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

## 🎓 Learning Path for New Contributors

1. **Day 1**: Read README.md, run the app locally
2. **Day 2**: Explore STACK_DOCUMENTATION.md, understand tech choices
3. **Day 3**: Follow WORKFLOW_GUIDE.md, make a small change
4. **Day 4**: Study ARCHITECTURE.md, understand data flow
5. **Day 5**: Read DESIGN_JOURNAL.md, grasp learning science
6. **Week 2**: Add a new lesson or feature

## 🔧 Troubleshooting Quick Fixes

| Issue | Quick Fix |
|-------|-----------|
| Blank screen | `localStorage.clear()` in console |
| API errors | Check `.env` file exists |
| Build fails | `rm -rf node_modules && npm install` |
| TypeScript errors | Restart TS server in IDE |
| Evolution stuck | Check browser console for errors |

## 💡 Pro Tips

1. **Use React DevTools**: Install browser extension for state inspection
2. **Enable Source Maps**: Already configured in Vite
3. **Hot Reload**: Vite auto-reloads on file changes
4. **Console Logging**: Use `console.log` liberally during development
5. **Git Commits**: Commit frequently with meaningful messages

## 📝 Code Snippets

### Add a New Block Type (KIDS)

```typescript
// StageKids.tsx
const blocks = [
  { label: '⬆️ Move Forward', action: 'Move Forward' },
  { label: '➡️ Turn Right', action: 'Turn Right' },
  { label: '⬅️ Turn Left', action: 'Turn Left' },
  { label: '🔁 Repeat 3x', action: 'Repeat 3 Times' },
  { label: '🌟 Jump', action: 'Jump' } // NEW
];
```

### Add Error Handling

```typescript
try {
  const response = await geminiAPI.generateContent(prompt);
  return response.text;
} catch (error) {
  console.error('API Error:', error);
  return 'Service temporarily unavailable.';
}
```

### Add Loading State

```typescript
const [isLoading, setIsLoading] = useState(false);

const handleAction = async () => {
  setIsLoading(true);
  try {
    await someAsyncOperation();
  } finally {
    setIsLoading(false);
  }
};
```

## 🎯 Next Steps

After mastering this guide:

1. Read full documentation files
2. Explore the codebase
3. Make your first contribution
4. Join the community discussions

---

**Quick Reference Version**: 1.0.0  
**Last Updated**: 2026-02-04  
**For detailed information, see the full documentation files.**
