# Campus Problem Hub

Campus Problem Hub is a modern web app for collecting anonymous student problems and turning those pain points into actionable opportunities.

## Stack
- Frontend: React + Vite + TailwindCSS
- Backend: Node.js + Express
- Database/Auth: Supabase

## Features
- Anonymous problem submission with title, description, category, optional screenshot URL, and optional email.
- Admin-only dashboard to review all submissions, tag opportunities, and add startup notes/solutions.
- Public feed with upvoting.
- Insights dashboard for categories, top-voted issues, and trending problems.

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env files:
   ```bash
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env
   ```
3. Fill in your Supabase credentials.
4. Run SQL from `supabase-schema.sql` in Supabase SQL editor.
5. Start both services:
   ```bash
   npm run dev
   ```

## Routes
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
