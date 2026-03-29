# AI Resume Intelligence System

A production-ready Next.js + Supabase solution for advanced resume creation, ATS analysis, tailoring and hiring simulation.

## Features

- Resume builder with AI-enhanced bullet points
- ATS compatibility analysis (score, missing keywords, suggestions)
- Resume tailoring by job description
- Weakness detection (weak verbs, lack of metrics, generic statements)
- Hiring simulation with shortlist probability & reasons
- Supabase auth (email/password, Google)
- OpenAI API for all AI operations

## Tech stack

- Frontend: Next.js App Router, Tailwind CSS, TypeScript
- Backend: Next.js API routes, Supabase
- AI: OpenAI (gpt-4.1-mini)
- PDF: React PDF (for future export)

## Environment variables

Copy `.env.example` to `.env.local` and fill in values.

## Local setup

1. `npm install`
2. `npm run dev`
3. Visit `http://localhost:3000`

## Supabase schema

Use Supabase SQL to create tables:

```sql
create table users (
  id uuid primary key default uuid_generate_v4(),
  name text,
  email text unique not null
);

create table resumes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  content jsonb not null,
  created_at timestamptz default now()
);

create table analyses (
  id uuid primary key default uuid_generate_v4(),
  resume_id uuid references resumes(id),
  ats_score int,
  suggestions jsonb,
  job_description text,
  created_at timestamptz default now()
);
```

## API routes

- `/api/resume/generate`
- `/api/resume/analyze`
- `/api/resume/tailor`
- `/api/resume/weakness`
- `/api/resume/hiring`

## Notes

- AI calls are server-side only (OpenAI key is secure)
- Keep prompt engineering structured as described in design doc
- Add guard middleware to protect routes once auth is wired

