import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const generateResume = async (profile: any) => {
  const prompt = `Act as a senior technical recruiter and resume writer. Generate a structured resume in JSON for the candidate:\n` +
    `Name: ${profile.name}\nEmail: ${profile.email}\nPhone: ${profile.phone}\nLocation: ${profile.location}\nSummary concept: ${profile.summary}\nExperience: ${profile.experience}\nEducation: ${profile.education}\nProjects: ${profile.projects}\nSkills: ${profile.skills}\n\n` +
    `Use strong action verbs, quantifiable results, concise human tone, and ATS-friendly keywords. Output strictly valid JSON with fields: summary, education, experience, projects, skills.\n`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  try {
    return JSON.parse(text ?? '{}');
  } catch (error) {
    return { raw: text };
  }
};

export const analyzeATS = async (resumeText: string, jobDescription?: string) => {
  const jdText = jobDescription ? `Job Description:\n${jobDescription}` : '';
  const prompt = `You are an ATS optimization engine. Analyze the resume text against ${jobDescription ? 'the job description' : 'generic software engineering role'} and provide JSON with keys: atsScore (0-100), missingKeywords (array), suggestions (array). Resume:\n${resumeText}\n${jdText}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  try {
    return JSON.parse(text ?? '{}');
  } catch (error) {
    return { raw: text };
  }
};

export const tailorResume = async (resumeText: string, jobDescription: string) => {
  const prompt = `Act as senior recruiter and resume writer. Rewrite this resume to align with this job description with improved keywords and phrasing. Provide JSON with field rewrittenResume.\nResume:\n${resumeText}\nJob Description:\n${jobDescription}`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  try {
    return JSON.parse(text ?? '{}');
  } catch (error) {
    return { raw: text };
  }
};

export const detectWeaknesses = async (resumeText: string) => {
  const prompt = `Analyze the resume text and produce JSON: weakVerbs (array), missingMetrics (array), genericStatements (array), recommendations (array). Resume:\n${resumeText}`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  try {
    return JSON.parse(text ?? '{}');
  } catch (error) {
    return { raw: text };
  }
};

export const simulateHiring = async (resumeText: string, jobDescription?: string) => {
  const prompt = `Simulate recruiter shortlisting for this resume ${jobDescription ? 'for this job description' : ''}. Output JSON with: shortlistProbability (number), keyStrengths (array), rejectionReasons (array). Resume:\n${resumeText}${jobDescription ? '\nJob Description:\n' + jobDescription : ''}`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  try {
    return JSON.parse(text ?? '{}');
  } catch (error) {
    return { raw: text };
  }
};
