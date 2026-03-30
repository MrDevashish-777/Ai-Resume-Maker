# AI Resume Intelligence System

[![Vercel](https://vercel.com/button)](https://ai-resume-maker-sigma.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A production-ready Next.js application powered by Supabase and Google Gemini AI for intelligent resume creation, ATS analysis, job tailoring, and hiring simulation.

## ✨ Features

- **AI-Powered Resume Builder**: Generate professional resumes with AI-enhanced bullet points and content optimization
- **ATS Compatibility Analysis**: Get detailed scores, missing keywords, and actionable suggestions for better ATS performance
- **Smart Resume Tailoring**: Automatically customize your resume based on specific job descriptions
- **Weakness Detection**: Identify weak verbs, lack of metrics, and generic statements in your resume
- **Hiring Simulation**: Simulate hiring decisions with probability scores and detailed reasoning
- **Secure Authentication**: Email/password authentication with Supabase
- **Responsive Design**: Modern UI built with Tailwind CSS and TypeScript

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase (PostgreSQL)
- **AI**: Google Gemini AI (gemini-2.0-flash) - Latest model with optimized performance
- **Authentication**: Supabase Auth
- **Deployment**: Netlify
- **Database**: Supabase (PostgreSQL with Row Level Security)

## 📋 Prerequisites

- Node.js 18+ and npm
- Google Gemini API key
- Supabase account and project

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ai-resume-maker.git
   cd ai-resume-maker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
   ```

## 🗄️ Database Setup

1. Create a new project on [Supabase](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the following SQL to set up the database schema:

   ```sql
   -- Enable UUID extension
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

   -- Resumes table
   CREATE TABLE resumes (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     content JSONB NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Analyses table
   CREATE TABLE analyses (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
     ats_score INTEGER,
     missing_keywords TEXT[],
     suggestions TEXT[],
     job_description TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
   ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

   -- RLS Policies for resumes
   CREATE POLICY "Users can view their own resumes" ON resumes
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert their own resumes" ON resumes
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update their own resumes" ON resumes
     FOR UPDATE USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete their own resumes" ON resumes
     FOR DELETE USING (auth.uid() = user_id);

   -- RLS Policies for analyses
   CREATE POLICY "Users can view analyses for their resumes" ON analyses
     FOR SELECT USING (
       EXISTS (
         SELECT 1 FROM resumes
         WHERE resumes.id = analyses.resume_id
         AND resumes.user_id = auth.uid()
       )
     );

   CREATE POLICY "Users can insert analyses for their resumes" ON analyses
     FOR INSERT WITH CHECK (
       EXISTS (
         SELECT 1 FROM resumes
         WHERE resumes.id = analyses.resume_id
         AND resumes.user_id = auth.uid()
       )
     );
   ```

## 🏃‍♂️ Running Locally

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Sign up for an account and start building your resume!

## 🌐 Deployment to Vercel

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/ai-resume-maker)

### Option 2: Manual Deployment

1. **Connect your repository to Vercel**
   - Go to [Vercel](https://vercel.com) and sign in
   - Click "New Project"
   - Import your Git repository

2. **Configure project settings**
   - Framework Preset: Next.js (automatically detected)
   - Root Directory: `./` (leave default)
   - Build Command: `npm run build` (automatically configured)
   - Output Directory: `.next` (automatically configured)

3. **Set environment variables**
   In your Vercel dashboard, go to Project Settings > Environment Variables and add:
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

### Important Notes for Vercel Deployment

- API routes are automatically converted to Vercel Serverless Functions
- Static assets are optimized and served via Vercel's CDN
- Environment variables are securely managed in Vercel's dashboard
- Automatic HTTPS and global CDN distribution
- Preview deployments for every git push
- Serverless functions have extended timeout (30s) for AI processing
- Deployed in US East region for optimal performance

**Live Demo**: [https://ai-resume-maker-sigma.vercel.app/](https://ai-resume-maker-sigma.vercel.app/)

## 📡 API Documentation

The application provides the following API endpoints:

- `POST /api/resume/generate` - Generate a resume from user profile data
- `POST /api/resume/analyze` - Analyze resume for ATS compatibility
- `POST /api/resume/tailor` - Tailor resume content for a specific job description
- `POST /api/resume/weakness` - Detect weaknesses in resume content
- `POST /api/resume/hiring` - Simulate hiring decision process

All endpoints require authentication and return JSON responses.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow the existing code style and patterns
- Write meaningful commit messages
- Test your changes locally before submitting
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the backend-as-a-service platform
- [Google Gemini AI](https://ai.google.dev/) for the AI capabilities
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

- AI calls are server-side only (OpenAI key is secure)
- Keep prompt engineering structured as described in design doc
- Add guard middleware to protect routes once auth is wired

