"use client";

import { useState } from 'react';

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="relative h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${score}%`, background: color }}
      />
    </div>
  );
}

function ResultSection({ title, icon, items, tagClass = 'tag' }: { title: string; icon: string; items: string[]; tagClass?: string }) {
  if (!items?.length) return null;
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: 'rgba(165, 180, 252, 0.8)' }}>
        <span>{icon}</span>{title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => <span key={i} className={tagClass}>{item}</span>)}
      </div>
    </div>
  );
}

function ListSection({ title, icon, items }: { title: string; icon: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: 'rgba(165, 180, 252, 0.8)' }}>
        <span>{icon}</span>{title}
      </h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-slate-300 flex gap-2 leading-relaxed">
            <span style={{ color: '#667eea', flexShrink: 0 }}>▸</span>{item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [weaknesses, setWeaknesses] = useState<any>(null);
  const [hiringSim, setHiringSim] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const call = async (endpoint: string, body: object, setter: (d: any) => void) => {
    setLoading(endpoint);
    try {
      const res = await fetch(`/api/resume/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.data) setter(data.data);
      else alert('Error: ' + data.error);
    } catch {
      alert('Request failed');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-strong p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}>◎</div>
          <div>
            <h2 className="text-2xl font-bold text-white">Analyze Your Resume</h2>
            <p className="text-slate-400 mt-1">Get ATS scores, detect weaknesses, and simulate recruiter decisions.</p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="glass p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'rgba(165, 180, 252, 0.8)' }}>Resume Text</label>
            <textarea
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              rows={12}
              className="input-field resize-none"
              placeholder="Paste your resume text here..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'rgba(165, 180, 252, 0.8)' }}>
              Job Description <span className="normal-case font-normal text-slate-500">(optional)</span>
            </label>
            <textarea
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              rows={12}
              className="input-field resize-none"
              placeholder="Paste the job description for tailored analysis..."
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={() => call('analyze', { resumeText, jobDescription }, setAnalysis)} disabled={!!loading || !resumeText} className="btn-primary flex items-center gap-2">
          {loading === 'analyze' ? <><span className="spinner"></span>Analyzing...</> : <><span>◎</span>ATS Score</>}
        </button>
        <button onClick={() => call('weakness', { resumeText }, setWeaknesses)} disabled={!!loading || !resumeText} className="btn-secondary flex items-center gap-2">
          {loading === 'weakness' ? <><span className="spinner" style={{ borderTopColor: 'white' }}></span>Detecting...</> : <><span>⚡</span>Find Weaknesses</>}
        </button>
        <button onClick={() => call('hiring', { resumeText, jobDescription }, setHiringSim)} disabled={!!loading || !resumeText} className="btn-success flex items-center gap-2">
          {loading === 'hiring' ? <><span className="spinner" style={{ borderColor: 'rgba(0,0,0,0.2)', borderTopColor: '#0a0a1a' }}></span>Simulating...</> : <><span>🎯</span>Simulate Hiring</>}
        </button>
      </div>

      {/* ATS Analysis Result */}
      {analysis && (
        <div className="glass-strong p-6 fade-in-up result-card space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>◎</div>
            <h3 className="text-lg font-bold text-white">ATS Analysis</h3>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-300">ATS Compatibility Score</span>
              <span className="text-2xl font-bold gradient-text">{analysis.atsScore}<span className="text-sm text-slate-500">/100</span></span>
            </div>
            <ScoreBar score={analysis.atsScore} color="linear-gradient(90deg, #667eea, #764ba2)" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <ResultSection title="Missing Keywords" icon="🔍" items={analysis.missingKeywords} tagClass="tag tag-red" />
            <ListSection title="Suggestions" icon="💡" items={analysis.suggestions} />
          </div>
        </div>
      )}

      {/* Weaknesses Result */}
      {weaknesses && (
        <div className="glass-strong p-6 fade-in-up result-card space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}>⚡</div>
            <h3 className="text-lg font-bold text-white">Resume Weaknesses</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ResultSection title="Weak Verbs" icon="📝" items={weaknesses.weakVerbs} tagClass="tag tag-red" />
            <ListSection title="Missing Metrics" icon="📊" items={weaknesses.missingMetrics} />
            <ListSection title="Generic Statements" icon="⚠️" items={weaknesses.genericStatements} />
            <ListSection title="Recommendations" icon="✅" items={weaknesses.recommendations} />
          </div>
        </div>
      )}

      {/* Hiring Simulation Result */}
      {hiringSim && (
        <div className="glass-strong p-6 fade-in-up result-card space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)' }}>🎯</div>
            <h3 className="text-lg font-bold text-white">Hiring Simulation</h3>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-300">Shortlist Probability</span>
              <span className="text-2xl font-bold gradient-text-blue">{hiringSim.shortlistProbability}<span className="text-sm text-slate-500">%</span></span>
            </div>
            <ScoreBar score={hiringSim.shortlistProbability} color="linear-gradient(90deg, #4facfe, #00f2fe)" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <ListSection title="Key Strengths" icon="💪" items={hiringSim.keyStrengths} />
            <ListSection title="Rejection Risks" icon="⚠️" items={hiringSim.rejectionReasons} />
          </div>
        </div>
      )}
    </div>
  );
}
