"use client";

import { useMemo, useState } from 'react';

type ResumeInput = {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: string;
  education: string;
  projects: string;
  skills: string;
};

const initial: ResumeInput = {
  name: '',
  email: '',
  phone: '',
  location: '',
  summary: '',
  experience: '',
  education: '',
  projects: '',
  skills: '',
};

export default function Home() {
  const [input, setInput] = useState<ResumeInput>(initial);
  const [resumeJson, setResumeJson] = useState<string>('');
  const [atsResult, setAtsResult] = useState<any>(null);
  const [tailorResult, setTailorResult] = useState<string>('');
  const [weaknessResult, setWeaknessResult] = useState<any>(null);
  const [hiringResult, setHiringResult] = useState<any>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const resumeText = useMemo(() => {
    return `Name: ${input.name}\nEmail: ${input.email}\nPhone: ${input.phone}\nLocation: ${input.location}\nSummary: ${input.summary}\nExperience: ${input.experience}\nEducation: ${input.education}\nProjects: ${input.projects}\nSkills: ${input.skills}`;
  }, [input]);

  const update = (field: keyof ResumeInput) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const callApi = async (path: string, payload: any) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/resume/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'API error');
      return json.data;
    } finally {
      setLoading(false);
    }
  };

  const onGenerate = async () => {
    const data = await callApi('generate', { profile: input });
    setResumeJson(JSON.stringify(data, null, 2));
  };

  const onAnalyze = async () => {
    const data = await callApi('analyze', { resumeText, jobDescription });
    setAtsResult(data);
  };

  const onTailor = async () => {
    const data = await callApi('tailor', { resumeText, jobDescription });
    setTailorResult(JSON.stringify(data, null, 2));
  };

  const onWeakness = async () => {
    const data = await callApi('weakness', { resumeText });
    setWeaknessResult(data);
  };

  const onHiring = async () => {
    const data = await callApi('hiring', { resumeText, jobDescription });
    setHiringResult(data);
  };

  return (
    <main className="min-h-screen p-6 lg:p-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold tracking-tight">AI Resume Intelligence System</h1>
        <p className="mt-2 text-slate-600">Create, analyze, tailor, and simulate hiring with OpenAI and Supabase.</p>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Resume Builder (AI-enhanced)</h2>
            <div className="mt-4 space-y-2">
              {(['name', 'email', 'phone', 'location'] as Array<keyof ResumeInput>).map((field) => (
                <input key={field} type="text" value={input[field]} onChange={update(field)} placeholder={field} className="w-full rounded border px-3 py-2 text-sm" />
              ))}
              {(['summary', 'experience', 'education', 'projects', 'skills'] as Array<keyof ResumeInput>).map((field) => (
                <textarea key={field} value={input[field]} onChange={update(field)} placeholder={field} rows={field === 'summary' ? 2 : 3} className="w-full rounded border px-3 py-2 text-sm" />
              ))}
            </div>
            <button disabled={loading} onClick={onGenerate} className="mt-4 w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Working...' : 'Generate Resume'}
            </button>
            {resumeJson && <pre className="mt-3 overflow-auto rounded bg-slate-950 p-3 text-xs text-white">{resumeJson}</pre>}
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Job Description (Target)</h2>
            <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={5} className="w-full rounded border p-3 text-sm" placeholder="Paste job description here" />

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button disabled={loading} onClick={onAnalyze} className="rounded bg-emerald-600 py-2 text-sm text-white hover:bg-emerald-700">Analyze ATS</button>
              <button disabled={loading} onClick={onTailor} className="rounded bg-indigo-600 py-2 text-sm text-white hover:bg-indigo-700">Tailor Resume</button>
              <button disabled={loading} onClick={onWeakness} className="rounded bg-orange-600 py-2 text-sm text-white hover:bg-orange-700">Weakness Scan</button>
              <button disabled={loading} onClick={onHiring} className="rounded bg-violet-600 py-2 text-sm text-white hover:bg-violet-700">Hiring Simulation</button>
            </div>

            {atsResult && (
              <div className="mt-4 rounded border p-3 bg-slate-50">
                <h3 className="font-semibold">ATS Result</h3>
                <p>Score: <strong>{atsResult.atsScore ?? 'N/A'}</strong></p>
                <p>Missing Keywords: {(atsResult.missingKeywords || []).join(', ')}</p>
                <ul className="list-disc pl-5">
                  {(atsResult.suggestions || []).map((s: string, i: number) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}

            {tailorResult && <pre className="mt-4 overflow-auto rounded bg-slate-900 p-3 text-xs text-white">{tailorResult}</pre>}
            {weaknessResult && <pre className="mt-4 overflow-auto rounded bg-slate-900 p-3 text-xs text-white">{JSON.stringify(weaknessResult, null, 2)}</pre>}
            {hiringResult && <pre className="mt-4 overflow-auto rounded bg-slate-900 p-3 text-xs text-white">{JSON.stringify(hiringResult, null, 2)}</pre>}
          </div>
        </section>

        <section className="mt-8 rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Live Resume Text</h2>
          <textarea value={resumeText} readOnly rows={8} className="mt-2 w-full rounded border p-3 text-sm" />
        </section>
      </div>
    </main>
  );
}
