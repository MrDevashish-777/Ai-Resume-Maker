"use client";

import { useState } from 'react';

type ResumeInput = {
  name: string; email: string; phone: string; location: string;
  summary: string; experience: string; education: string; projects: string; skills: string;
};

const initial: ResumeInput = {
  name: '', email: '', phone: '', location: '',
  summary: '', experience: '', education: '', projects: '', skills: '',
};

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'rgba(165, 180, 252, 0.8)' }}>{children}</label>;
}

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-lg">{icon}</span>
      <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'rgba(165, 180, 252, 0.7)' }}>{title}</h3>
      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }}></div>
    </div>
  );
}

export default function ResumeBuilder() {
  const [input, setInput] = useState<ResumeInput>(initial);
  const [generatedResume, setGeneratedResume] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const update = (field: keyof ResumeInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setInput(prev => ({ ...prev, [field]: e.target.value }));

  const generateResume = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/resume/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: input }),
      });
      const data = await res.json();
      if (data.data) setGeneratedResume(data.data);
      else alert('Error: ' + data.error);
    } catch {
      alert('Failed to generate resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-strong p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>✦</div>
          <div>
            <h2 className="text-2xl font-bold text-white">Create Your Resume</h2>
            <p className="text-slate-400 mt-1">Fill in your details and let Gemini AI craft a professional resume.</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="glass p-6 space-y-6">
        <SectionTitle icon="👤" title="Personal Info" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(['name', 'email', 'phone', 'location'] as const).map(field => (
            <div key={field}>
              <Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                value={input[field]}
                onChange={update(field)}
                className="input-field"
                placeholder={field === 'name' ? 'John Doe' : field === 'email' ? 'john@example.com' : field === 'phone' ? '+1 (555) 000-0000' : 'City, Country'}
              />
            </div>
          ))}
        </div>

        <SectionTitle icon="📝" title="Professional Details" />
        <div className="space-y-4">
          <div>
            <Label>Professional Summary</Label>
            <textarea value={input.summary} onChange={update('summary')} rows={3} className="input-field resize-none" placeholder="Brief professional summary highlighting your key strengths..." />
          </div>
          <div>
            <Label>Work Experience</Label>
            <textarea value={input.experience} onChange={update('experience')} rows={5} className="input-field resize-none" placeholder="Company, Role, Duration — describe your responsibilities and achievements..." />
          </div>
        </div>

        <SectionTitle icon="🎓" title="Education & Projects" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Education</Label>
            <textarea value={input.education} onChange={update('education')} rows={4} className="input-field resize-none" placeholder="Degree, Institution, Year..." />
          </div>
          <div>
            <Label>Projects</Label>
            <textarea value={input.projects} onChange={update('projects')} rows={4} className="input-field resize-none" placeholder="Project name, tech stack, impact..." />
          </div>
        </div>

        <div>
          <Label>Skills</Label>
          <textarea value={input.skills} onChange={update('skills')} rows={2} className="input-field resize-none" placeholder="React, TypeScript, Node.js, Python, AWS..." />
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <button onClick={generateResume} disabled={loading} className="btn-primary flex items-center gap-3 px-10 py-4 text-base">
          {loading ? (
            <><span className="spinner"></span> Generating with AI...</>
          ) : (
            <><span>✦</span> Generate Resume</>
          )}
        </button>
      </div>

      {/* Result */}
      {generatedResume && (
        <div className="glass-strong p-6 fade-in-up result-card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>✦</div>
              <h3 className="text-lg font-bold text-white">Generated Resume</h3>
            </div>
            <span className="tag">AI Enhanced</span>
          </div>

          {generatedResume.summary && (
            <div className="mb-5">
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#a5b4fc' }}>Summary</h4>
              <p className="text-slate-300 text-sm leading-relaxed">{generatedResume.summary}</p>
            </div>
          )}

          {generatedResume.experience && (
            <div className="mb-5">
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#a5b4fc' }}>Experience</h4>
              {Array.isArray(generatedResume.experience) ? (
                <div className="space-y-3">
                  {generatedResume.experience.map((exp: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div className="font-semibold text-white text-sm">{exp.role} — {exp.company}</div>
                      <div className="text-xs text-slate-500 mb-2">{exp.duration}</div>
                      {Array.isArray(exp.bullets) && (
                        <ul className="space-y-1">
                          {exp.bullets.map((b: string, j: number) => (
                            <li key={j} className="text-sm text-slate-300 flex gap-2"><span style={{ color: '#667eea' }}>▸</span>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-300 text-sm leading-relaxed">{generatedResume.experience}</p>
              )}
            </div>
          )}

          {generatedResume.skills && (
            <div className="mb-5">
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#a5b4fc' }}>Skills</h4>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(generatedResume.skills) ? generatedResume.skills : generatedResume.skills.split(','))
                  .map((skill: string, i: number) => (
                    <span key={i} className="tag">{skill.trim()}</span>
                  ))}
              </div>
            </div>
          )}

          {!generatedResume.summary && !generatedResume.experience && (
            <pre className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{JSON.stringify(generatedResume, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}
