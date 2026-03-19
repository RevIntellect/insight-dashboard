# Marketing Analytics Hub | Insight Dashboard

A unified marketing analytics dashboard integrating Google Ads, LinkedIn, SEO, Email Marketing, and Direct Mail performance metrics in one view.

## Tech Stack

- **Vite** - Build tool
- **TypeScript** - Type safety
- **React 18** - UI library
- **shadcn/ui** - Component library (Radix UI + Tailwind)
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Chart visualizations
- **Supabase** - Backend & database
- **TanStack React Query** - Server state management

## Getting Started

```sh
# Install dependencies
npm install

# Start the development server
npm run dev
```

The dev server runs on port 8080 by default.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run build:dev` | Development build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Project Structure

```
src/
├── assets/          # Images & static assets
├── components/
│   ├── dashboard/   # Dashboard views & shared components
│   └── ui/          # shadcn/ui components
├── hooks/           # Custom React hooks
├── integrations/    # Supabase client & types
├── lib/             # Utility functions
└── pages/           # Route pages
```

## Environment Variables

Required for Supabase integration:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

See `docs/API_REQUIREMENTS.md` for details on integrating external APIs (Google Ads, LinkedIn, Salesforce).
