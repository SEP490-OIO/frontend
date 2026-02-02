# Bid System v1.0 - Frontend

Responsive web frontend for the Competitive Bidding E-Commerce System. Built with **React** and **TypeScript** using **Vite**.

## Features

- **Responsive design** – Works on desktop, tablet, and mobile
- **TypeScript** – Type-safe development
- **Vite** – Fast development server and builds
- **Mobile-first** – CSS breakpoints and structure support future mobile use

## Prerequisites

- Node.js 18 or higher
- npm (or yarn / pnpm)

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Opens the app at `http://localhost:3000` with hot module replacement (HMR).

## Build

```bash
npm run build
```

Production build is output to `dist/`. The build is optimised for deployment to any static hosting service.

## Preview

```bash
npm run preview
```

Serves the production build locally for testing.

## Lint

```bash
npm run lint
```

Runs ESLint on the codebase.

## Project Structure

```
frontend/
├── public/           # Static assets
├── src/
│   ├── components/   # Reusable UI components
│   ├── pages/        # Page-level components (screens)
│   ├── hooks/        # Custom React hooks
│   ├── types/        # TypeScript type definitions
│   ├── utils/        # Utility functions
│   ├── styles/       # Breakpoints and shared style utilities
│   ├── App.tsx       # Root component
│   ├── main.tsx      # Entry point
│   └── index.css     # Global styles (responsive foundation)
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Responsive Design

The app uses a mobile-first approach:

- **Base styles** – Optimised for mobile
- **Breakpoints** – `src/styles/breakpoints.ts` defines sm (640px), md (768px), lg (1024px), xl (1280px)
- **CSS variables** – `src/index.css` defines spacing, typography, and layout tokens

## Path Aliases

Use `@/` to import from `src/`:

```ts
import { breakpoints } from '@/styles/breakpoints'
```

## Future Considerations

The structure supports adding a dedicated mobile app later. Shared logic (e.g. API clients, types, utilities) can be extracted for reuse.
