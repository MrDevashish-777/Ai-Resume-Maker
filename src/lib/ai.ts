import Groq from 'groq-sdk';

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not set');
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const cleanJSON = (text: string) => {
  return text.replace(/```json\n?|```/g, '').trim();
};

// Utility function to retry API calls with exponential backoff
const retryWithBackoff = async (
  fn: () => Promise<any>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<any> => {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * Math.pow(2, i)));
      }
    }
  }
  throw lastError;
};

export const generateResume = async (profile: any) => {
  const prompt = `You are an elite professional resume writer with 20+ years of experience crafting resumes that land interviews at Fortune 500 companies and top tech startups. 

Generate a PROFESSIONAL, IMPACT-DRIVEN resume in JSON format for the following candidate:

CANDIDATE PROFILE:
- Name: ${profile.name}
- Email: ${profile.email}
- Phone: ${profile.phone}
- Location: ${profile.location}
- Professional Summary: ${profile.summary}
- Experience: ${profile.experience}
- Education: ${profile.education}
- Projects: ${profile.projects}
- Skills: ${profile.skills}

CRITICAL REQUIREMENTS FOR PROFESSIONAL RESUME:
1. **Action Verbs**: Use powerful, industry-specific action verbs (Architected, Engineered, Spearheaded, Optimized, Transformed, etc.) - NEVER use weak verbs like "Helped" or "Worked"
2. **Quantifiable Results**: EVERY bullet point must include metrics and percentages (e.g., "Reduced API latency by 45%", "Increased conversion rate by 23%", "Managed $5M+ budget")
3. **Impact Language**: Focus on business impact, revenue generation, cost savings, and efficiency improvements
4. **ATS Optimization**: Include relevant keywords for the candidate's industry and role
5. **Professional Tone**: Maintain formal, business language - no casual phrasing
6. **Conciseness**: 3-4 bullets per position, each 1-2 lines max
7. **Technical Depth**: Mention specific technologies, frameworks, and methodologies used

OUTPUT FORMAT - Return ONLY valid JSON (no markdown, no extra text):
{
  "summary": "2-3 sentence professional summary highlighting key expertise, years of experience, and unique value proposition",
  "experience": [
    {
      "company": "Company Name",
      "role": "Official Job Title",
      "duration": "Month Year - Month Year",
      "bullets": [
        "Action verb + specific achievement with metric/result",
        "Action verb + process improvement or innovation with business impact",
        "Action verb + technical accomplishment with quantifiable outcome"
      ]
    }
  ],
  "skills": ["Technical Skill 1", "Framework/Tool 2", "Methodology 3", "Language 4"],
  "education": "Degree, Institution, Graduation Year (and any honors/distinctions)",
  "projects": "Brief description of key projects highlighting measurable impact"
}

Remember: Tailor content to be industry-appropriate, highlight differentiators, and ensure every detail serves to strengthen the candidate's candidacy.`;

  try {
    const message = await retryWithBackoff(() =>
      groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 4096,
      })
    );
    
    const text = message.choices[0]?.message?.content || '';
    const parsedData = JSON.parse(cleanJSON(text) ?? '{}');
    if (!parsedData.summary) {
      throw new Error('Invalid resume structure returned');
    }
    return parsedData;
  } catch (error) {
    console.error('Error generating resume:', error);
    throw new Error(`Failed to generate resume: ${(error as Error).message}`);
  }
};

export const analyzeATS = async (resumeText: string, jobDescription?: string) => {
  const jdText = jobDescription ? `Job Description:\n${jobDescription}` : 'generic software engineering role';
  const prompt = `You are an expert ATS (Applicant Tracking System) consultant. Analyze the resume for ATS compatibility and alignment with the job requirements.
  
  RESUME:
  ${resumeText}
  
  ${jobDescription ? `JOB DESCRIPTION:\n${jobDescription}` : 'Generic Software Engineering Role'}
  
  Provide a comprehensive ATS analysis covering:
  1. ATS Score (0-100): How well the resume will pass through ATS systems
  2. Missing Keywords: Critical keywords from job description not found in resume
  3. Suggestions: Specific, actionable improvements to increase ATS compatibility
  4. Format Issues: Any structural problems that might confuse ATS parsers
  
  Return ONLY valid JSON (no markdown, no extra text):
  {
    "atsScore": <number 0-100>,
    "atsCompatibility": "<EXCELLENT|GOOD|FAIR|POOR>",
    "missingKeywords": ["keyword1", "keyword2", "keyword3"],
    "suggestions": ["Improvement 1", "Improvement 2", "Improvement 3"],
    "formatIssues": ["Issue 1 if any", "Issue 2 if any"]
  }`;

  try {
    const message = await retryWithBackoff(() =>
      groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 2048,
      })
    );
    
    const text = message.choices[0]?.message?.content || '';
    const parsedData = JSON.parse(cleanJSON(text) ?? '{}');
    if (typeof parsedData.atsScore !== 'number') {
      throw new Error('Invalid ATS analysis structure');
    }
    return parsedData;
  } catch (error) {
    console.error('Error analyzing ATS:', error);
    throw new Error(`Failed to analyze ATS: ${(error as Error).message}`);
  }
};

export const tailorResume = async (resumeText: string, jobDescription: string) => {
  const prompt = `You are a master resume strategist. Your task is to tailor the provided resume to perfectly align with the specific job description while maintaining authenticity and professionalism.

CANDIDATE RESUME:
${resumeText}

TARGET JOB DESCRIPTION:
${jobDescription}

TAILORING STRATEGY:
1. Identify 5-7 core requirements/keywords from the job description
2. Reorganize resume bullets to emphasize relevant experience
3. Add missing keywords naturally without changing truthfulness
4. Adjust impact metrics to align with job scope
5. Highlight transferable skills that match job requirements
6. Ensure technical skills section matches job requirements
7. Rewrite summary to address job-specific pain points

Return ONLY valid JSON (no markdown, no extra text):
{
  "tailoredResume": "Complete tailored resume text",
  "keywordMatches": ["Keyword 1 matched", "Keyword 2 matched"],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}`;

  try {
    const message = await retryWithBackoff(() =>
      groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 4096,
      })
    );
    
    const text = message.choices[0]?.message?.content || '';
    const parsedData = JSON.parse(cleanJSON(text) ?? '{}');
    if (!parsedData.tailoredResume) {
      throw new Error('Invalid tailored resume structure');
    }
    return parsedData;
  } catch (error) {
    console.error('Error tailoring resume:', error);
    throw new Error(`Failed to tailor resume: ${(error as Error).message}`);
  }
};

export const detectWeaknesses = async (resumeText: string) => {
  const prompt = `You are a professional resume coach with expertise in identifying and fixing resume weaknesses. Analyze this resume for areas of improvement that would impact hiring managers' perception.

CANDIDATE RESUME:
${resumeText}

Identify:
1. Weak/Generic Verbs: Words that don't convey impact (Helped, Worked, Involved, Responsible for, etc.)
2. Missing Metrics: Achievements without quantifiable results
3. Generic Statements: Overused phrases that don't differentiate the candidate
4. Formatting Issues: Problems that hurt readability or ATS compatibility
5. Gaps in Communication: Missing context or unclear achievements

Return ONLY valid JSON (no markdown, no extra text):
{
  "weakVerbs": ["Weak verb 1 with context", "Weak verb 2 with context"],
  "missingMetrics": ["Bullet without metric and suggested improvement"],
  "genericStatements": ["Generic phrase used and suggested replacement"],
  "formatIssues": ["Format issue 1 if any"],
  "recommendations": ["Specific improvement 1", "Specific improvement 2", "Specific improvement 3"],
  "overallHealth": "<EXCELLENT|GOOD|FAIR|POOR>"
}`;

  try {
    const message = await retryWithBackoff(() =>
      groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 2048,
      })
    );
    
    const text = message.choices[0]?.message?.content || '';
    const parsedData = JSON.parse(cleanJSON(text) ?? '{}');
    return parsedData;
  } catch (error) {
    console.error('Error detecting weaknesses:', error);
    throw new Error(`Failed to detect weaknesses: ${(error as Error).message}`);
  }
};

export const simulateHiring = async (resumeText: string, jobDescription?: string) => {
  const jdText = jobDescription ? `Job Description:\n${jobDescription}` : 'generic software engineering role';
  const prompt = `You are an experienced senior recruiter evaluating resumes for a shortlist. Provide a realistic assessment of whether this candidate would advance past initial screening.

CANDIDATE RESUME:
${resumeText}

${jobDescription ? `TARGET JOB DESCRIPTION:\n${jobDescription}` : 'Generic Software Engineering Role'}

Evaluate based on:
1. Experience relevance and depth
2. Technical skills match
3. Quantifiable achievements and impact
4. Fit for the role
5. Potential red flags or concerns

Return ONLY valid JSON (no markdown, no extra text):
{
  "shortlistProbability": <number 0-100>,
  "decision": "<STRONG YES|YES|MAYBE|NO>",
  "keyStrengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "interviewFitness": "<EXCELLENT|GOOD|MODERATE|POOR>",
  "negotiations": {
    "likelyNegotiablePoints": ["Point 1", "Point 2"],
    "dealbreakers": ["Dealbreaker 1 if any"]
  },
  "feedback": "Brief overall assessment"
}`;

  try {
    const message = await retryWithBackoff(() =>
      groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 2048,
      })
    );
    
    const text = message.choices[0]?.message?.content || '';
    const parsedData = JSON.parse(cleanJSON(text) ?? '{}');
    if (typeof parsedData.shortlistProbability !== 'number') {
      throw new Error('Invalid hiring simulation structure');
    }
    return parsedData;
  } catch (error) {
    console.error('Error simulating hiring:', error);
    throw new Error(`Failed to simulate hiring process: ${(error as Error).message}`);
  }
};
