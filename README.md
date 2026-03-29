# AI Resume Intelligence System

A production-ready Next.js + Supabase + Gemini AI solution for advanced resume creation, ATS analysis, tailoring and hiring simulation.

## Features

- Resume builder with AI-enhanced bullet points
- ATS compatibility analysis (score, missing keywords, suggestions)
- Resume tailoring by job description
- Weakness detection (weak verbs, lack of metrics, generic statements)
- Hiring simulation with shortlist probability & reasons
- Supabase auth (email/password)
- Gemini AI for all AI operations

## Tech Stack

- Frontend: Next.js App Router, Tailwind CSS, TypeScript
- Backend: Next.js API routes, Supabase
- AI: Google Gemini AI (gemini-1.5-flash)
- Database: Supabase (PostgreSQL)

## Environment Variables

Create `.env.local` with:

```env
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
```

## Local Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env.local`
4. Set up Supabase database (see below)
5. Run development server: `npm run dev`
6. Visit `http://localhost:3000`

## Supabase Database Setup

Create a new Supabase project and run the following SQL in the SQL editor:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (Supabase auth handles this automatically)
-- But you can add custom fields if needed

-- Resumes table
create table resumes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  content jsonb not null,
  created_at timestamptz default now()
);

-- Analyses table
create table analyses (
  id uuid primary key default uuid_generate_v4(),
  resume_id uuid references resumes(id) on delete cascade,
  ats_score integer,
  missing_keywords text[],
  suggestions text[],
  job_description text,
  created_at timestamptz default now()
);

-- Enable RLS (Row Level Security)
alter table resumes enable row level security;
alter table analyses enable row level security;

-- Policies for resumes
create policy "Users can view their own resumes" on resumes
  for select using (auth.uid() = user_id);

create policy "Users can insert their own resumes" on resumes
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own resumes" on resumes
  for update using (auth.uid() = user_id);

create policy "Users can delete their own resumes" on resumes
  for delete using (auth.uid() = user_id);

-- Policies for analyses
create policy "Users can view analyses for their resumes" on analyses
  for select using (
    exists (
      select 1 from resumes
      where resumes.id = analyses.resume_id
      and resumes.user_id = auth.uid()
    )
  );

create policy "Users can insert analyses for their resumes" on analyses
  for insert with check (
    exists (
      select 1 from resumes
      where resumes.id = analyses.resume_id
      and resumes.user_id = auth.uid()
    )
  );
```

## API Routes

- `POST /api/resume/generate` - Generate resume from profile
- `POST /api/resume/analyze` - Analyze ATS compatibility
- `POST /api/resume/tailor` - Tailor resume for job
- `POST /api/resume/weakness` - Detect resume weaknesses
- `POST /api/resume/hiring` - Simulate hiring decision

## Deployment

1. Deploy to Vercel
2. Set environment variables in Vercel dashboard
3. Ensure Supabase URL allows Vercel's IP ranges

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Test thoroughly
5. Submit a pull request

## License

MIT
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

