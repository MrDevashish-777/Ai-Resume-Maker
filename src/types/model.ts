export type ResumeSection = {
  id: string;
  title: string;
  items: any[];
};

export type Resume = {
  id?: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  education: Array<{ school: string; degree: string; period: string; details: string }>;
  experience: Array<{ company: string; role: string; period: string; bullets: string[] }>;
  projects: Array<{ title: string; description: string; tech: string[] }>;
  skills: string[];
  createdAt?: string;
};

export type Analysis = {
  id?: string;
  resumeId: string;
  atsScore: number;
  missingKeywords: string[];
  suggestions: string[];
  jobDescription?: string;
  createdAt?: string;
};
