# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a **Game Hub** project containing interactive browser games including memory, trivia, and sliding puzzle games. The project has a **mixed architecture** with both static HTML/JS implementation and a React/TypeScript SPA that needs to be properly organized.

### Current Architecture Issues

The project currently has **structural problems** that need fixing:

1. **Dual Implementation**: Both static HTML (`index.html` + `script.js`) and React/TypeScript (`App.tsx`, `main.tsx`, etc.) exist
2. **Missing UI Components**: React components import from `@/components/ui/*` but these don't exist
3. **Path Resolution**: Vite config expects `src/` directory structure but files are in root
4. **Missing TypeScript Config**: No `tsconfig.json` file
5. **ESLint Issues**: Using outdated ESLint config format

### Technology Stack

- **Frontend**: React 19.1.1 + TypeScript 5.5.3
- **Build Tool**: Vite 5.4.1
- **Styling**: Tailwind CSS 3.4.11 with shadcn/ui components
- **State Management**: Zustand + TanStack React Query
- **UI Components**: Radix UI primitives + shadcn/ui
- **Animations**: Framer Motion
- **Package Manager**: pnpm (specified) but npm works

### Game Components

- **Memory Game** (`MemoryGame.tsx`): Card matching with scoring
- **Trivia Game** (`TriviaGame.tsx`): Quiz with timer and categories  
- **Puzzle Game** (`PuzzleGame.tsx`): 8-tile sliding puzzle
- **Leaderboard** (`Leaderboard.tsx`): High scores display
- **Game Utils** (`gameUtils.ts`): Core game logic, scoring, and audio

## Common Commands

### Development
```bash
# Install dependencies (first time setup)
npm install

# Start development server
npm run dev

# Build for production  
npm run build

# Preview production build
npm run preview
```

### Linting (Currently Broken)
```bash
# Will fail - needs eslint.config.js migration
npm run lint
```

### Project Structure Fix (Needed)
```bash
# These commands would fix the structure:
mkdir src src/components src/components/ui src/lib src/pages
mv *.tsx src/pages/
mv gameUtils.ts src/lib/
mv utils.ts src/lib/
```

## Critical Issues to Fix

### 1. Missing shadcn/ui Components
All React components import UI components that don't exist:
- `@/components/ui/card`
- `@/components/ui/button` 
- `@/components/ui/badge`
- And many more Radix UI wrappers

**Fix**: Run shadcn/ui init and add missing components.

### 2. Path Alias Resolution
The `@` alias in `vite.config.ts` points to `./src` but files are in root.

**Fix**: Either move files to `src/` or update alias to `./`

### 3. Entry Point Confusion  
Vite builds the HTML file instead of React app because `index.html` includes `<script src="script.js">`.

**Fix**: Update `index.html` to load the React entry point or rename HTML file.

### 4. TypeScript Configuration
Missing `tsconfig.json` - TypeScript likely using defaults.

### 5. ESLint Configuration  
Using legacy `.eslintrc.*` format but ESLint 9+ requires `eslint.config.js`.

### 6. Security Vulnerabilities
```bash
npm audit
# Shows 3 moderate severity issues in esbuild/vite dependencies
```

## File Organization

### Current Structure (Problematic)
```
game/
├── *.tsx           # React components (should be in src/)
├── *.ts            # Utils and config files 
├── index.html      # Static HTML version
├── script.js       # Static JS version  
├── styles.css      # Static styles
└── package.json    # Project config
```

### Recommended Structure
```
game/
├── src/
│   ├── components/
│   │   ├── ui/         # shadcn/ui components
│   │   └── games/      # Game components  
│   ├── lib/           # Utilities (gameUtils.ts, utils.ts)
│   ├── pages/         # Route components
│   └── App.tsx        # Root component
├── main.tsx          # Entry point
├── index.html        # React app HTML
└── static-version/   # Move HTML/JS version here
```

## Development Workflow

### Starting Development
1. **Fix dependencies**: Ensure all packages install correctly
2. **Structure**: Move files to proper src/ structure  
3. **Add UI components**: Install missing shadcn/ui components
4. **Configure TypeScript**: Add proper tsconfig.json
5. **Fix linting**: Migrate to eslint.config.js

### Adding New Games
1. Create component in `src/components/games/`
2. Add to routing in `App.tsx` 
3. Add game logic to `gameUtils.ts`
4. Update leaderboard integration
5. Add to main menu in `Index.tsx`

### Game State Management
- Local storage for high scores (`gameScores` key)
- Zustand for React state management
- TanStack Query for any future API integration

## Key Implementation Details

### Scoring System
Games use a unified scoring system in `gameUtils.ts`:
- Memory: Based on moves (fewer = higher score)  
- Trivia: Points + time bonus per correct answer
- Puzzle: Move efficiency scoring

### Audio System  
Web Audio API implementation for game sounds:
```typescript
playSound(frequency: number, duration: number, type: "sine" | "square" | "triangle")
```

### Responsive Design
Tailwind CSS with mobile-first approach. Games adapt to screen sizes with card-based layouts.

### Performance Notes
- React 19 with concurrent features
- Vite for fast HMR during development  
- Framer Motion for smooth animations
- Radix UI for accessible components

## Troubleshooting

### Build Issues
- If Vite builds HTML instead of React: Check `index.html` script tags
- Import errors: Verify `@` alias configuration and file paths
- TypeScript errors: Add proper `tsconfig.json`

### Runtime Issues  
- Components not rendering: Missing shadcn/ui components
- Audio not working: Browser audio policy restrictions
- Scores not saving: localStorage availability/permissions

### Development Issues
- ESLint failing: Migrate config to v9 format
- Path resolution: Ensure proper src/ structure
- HMR not working: Check Vite config and file structure
