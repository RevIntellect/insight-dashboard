# CLAUDE.md

## Project Overview

Marketing Analytics Hub - a React SPA dashboard for unified marketing analytics across Google Ads, LinkedIn, SEO, Email Marketing, and Direct Mail.

## Tech Stack

- React 18 + TypeScript + Vite (port 8080)
- Tailwind CSS 3 + shadcn/ui (Radix UI components)
- Recharts for data visualization
- Supabase for backend (client in `src/integrations/supabase/`)
- TanStack React Query for data fetching

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build (use this to verify changes compile)
- `npm run lint` — run ESLint
- `npm run preview` — preview production build

## Architecture

- Single-page app with React Router; main page at `src/pages/Index.tsx`
- Dashboard selection via `activeSection` state (not URL-based routing)
- 11 dashboard views in `src/components/dashboard/`
- Reusable components: `KPICard`, `ChartCard`, `InsightsCard`, `DateRangePicker`
- 46 shadcn/ui components in `src/components/ui/`
- Path alias: `@/` maps to `src/`

## Code Style

- TypeScript with relaxed strictness (noImplicitAny: false, strictNullChecks: false)
- shadcn/ui conventions for UI components (CVA + cn utility)
- Tailwind for all styling, dark mode via class strategy
- DM Sans font family
