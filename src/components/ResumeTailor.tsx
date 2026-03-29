"use client";

import { useState } from 'react';

export default function ResumeTailor() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [tailoredResume, setTailoredResume] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const tailorResume = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/resume/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription }),
      });
      const data = await res.json();
      if (data.data) setTailoredResume(data.data);
      else alert('Error: ' + data.error);
    } catch {
      alert('Failed to tailor resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-strong p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)' }}>⟡</div>
          <div>
            <h2 className="text-2xl font-bold text-white">Tailor Your Resume</h2>
            <p className="text-slate-400 mt-1">Optimize your resume for a specific job description using AI.</p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="glass p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'rgba(165, 180, 252, 0.8)' }}>Your Current Resume</label>
            <textarea
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              rows={16}
              className="input-field resize-none"
              placeholder="Paste your current resume text here..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'rgba(165, 180, 252, 0.8)' }}>Target Job Description</label>
            <textarea
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              rows={16}
              className="input-field resize-none"
              placeholder="Paste the job description you're applying for..."
            />
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="glass p-4 flex flex-wrap gap-4">
        {['Match keywords from the job posting', 'Highlight relevant experience', 'Quantify achievements'].map((tip, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
            <span style={{ color: '#4facfe' }}>✓</span>{tip}
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="flex justify-center">
        <button
          onClick={tailorResume}
          disabled={loading || !resumeText || !jobDescription}
          className="btn-success flex items-center gap-3 px-10 py-4 text-base"
          style={{ color: '#0a0a1a' }}
        >
          {loading ? (
            <><span className="spinner" style={{ borderColor: 'rgba(0,0,0,0.2)', borderTopColor: '#0a0a1a' }}></span>Tailoring with AI...</>
          ) : (
            <><span>⟡</span>Tailor Resume</>
          )}
        </button>
      </div>

      {/* Result */}
      {tailoredResume && (
        <div className="glass-strong p-6 fade-in-up result-card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)' }}>⟡</div>
              <h3 className="text-lg font-bold text-white">Tailored Resume</h3>
            </div>
            <div className="flex gap-2">
              <span className="tag tag-green">Job-Optimized</span>
              <button
                onClick={() => navigator.clipboard.writeText(tailoredResume.rewrittenResume || JSON.stringify(tailoredResume, null, 2))}
                className="tag cursor-pointer hover:opacity-80 transition-opacity"
                title="Copy to clipboard"
              >
                📋 Copy
              </button>
            </div>
          </div>
          <div className="p-4 rounded-xl text-sm text-slate-300 leading-relaxed whitespace-pre-wrap" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontFamily: 'monospace' }}>
            {tailoredResume.rewrittenResume || JSON.stringify(tailoredResume, null, 2)}
          </div>
        </div>
      )}
    </div>
  );
}
