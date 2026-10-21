# Nityanand Portfolio (Next.js)

Netflix-style portfolio built with Next.js 14 (App Router), React 18 and TypeScript.

## Run locally
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint
```

## Edit content
All text, projects, skills, education and contact details live in `data/portfolio.ts`.
Update `owner.linkedin` and `owner.github` there with your real profile URLs.

## Deploy
Push to GitHub and import the repo in Vercel (no environment variables needed), or run `npm run build && npm start` on any Node 18+ host.
