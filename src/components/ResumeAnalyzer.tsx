"use client";

import { useState } from 'react';

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [weaknesses, setWeaknesses] = useState<any>(null);
  const [hiringSim, setHiringSim] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyzeATS = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription }),
      });
      const data = await res.json();
      if (data.data) {
        setAnalysis(data.data);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  const detectWeaknesses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/resume/weakness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });
      const data = await res.json();
      if (data.data) {
        setWeaknesses(data.data);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Failed to detect weaknesses');
    } finally {
      setLoading(false);
    }
  };

  const simulateHiring = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/resume/hiring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription }),
      });
      const data = await res.json();
      if (data.data) {
        setHiringSim(data.data);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Failed to simulate hiring');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analyze Your Resume</h2>
        <p className="mt-2 text-gray-600">Get ATS scores, detect weaknesses, and simulate recruiter review.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Resume Text</label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={10}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Paste your resume text here..."
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Description (Optional)</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={10}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Paste the job description for tailored analysis..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={analyzeATS}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze ATS Score'}
        </button>
        <button
          onClick={detectWeaknesses}
          disabled={loading}
          className="bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700 disabled:opacity-50"
        >
          {loading ? 'Detecting...' : 'Detect Weaknesses'}
        </button>
        <button
          onClick={simulateHiring}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Simulating...' : 'Simulate Hiring'}
        </button>
      </div>

      {analysis && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">ATS Analysis</h3>
          <div className="mb-4">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">ATS Score:</span>
              <div className="ml-2 bg-gray-200 rounded-full h-4 flex-1">
                <div
                  className="bg-indigo-600 h-4 rounded-full"
                  style={{ width: `${analysis.atsScore}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm font-medium">{analysis.atsScore}/100</span>
            </div>
          </div>
          <div className="mb-4">
            <h4 className="font-medium">Missing Keywords:</h4>
            <ul className="list-disc list-inside text-sm">
              {analysis.missingKeywords?.map((kw: string, i: number) => (
                <li key={i}>{kw}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium">Suggestions:</h4>
            <ul className="list-disc list-inside text-sm">
              {analysis.suggestions?.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {weaknesses && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Resume Weaknesses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Weak Verbs:</h4>
              <ul className="list-disc list-inside text-sm">
                {weaknesses.weakVerbs?.map((v: string, i: number) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Missing Metrics:</h4>
              <ul className="list-disc list-inside text-sm">
                {weaknesses.missingMetrics?.map((m: string, i: number) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Generic Statements:</h4>
              <ul className="list-disc list-inside text-sm">
                {weaknesses.genericStatements?.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Recommendations:</h4>
              <ul className="list-disc list-inside text-sm">
                {weaknesses.recommendations?.map((r: string, i: number) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {hiringSim && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Hiring Simulation</h3>
          <div className="mb-4">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Shortlist Probability:</span>
              <div className="ml-2 bg-gray-200 rounded-full h-4 flex-1">
                <div
                  className="bg-green-600 h-4 rounded-full"
                  style={{ width: `${hiringSim.shortlistProbability}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm font-medium">{hiringSim.shortlistProbability}%</span>
            </div>
          </div>
          <div className="mb-4">
            <h4 className="font-medium">Key Strengths:</h4>
            <ul className="list-disc list-inside text-sm">
              {hiringSim.keyStrengths?.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium">Rejection Reasons:</h4>
            <ul className="list-disc list-inside text-sm">
              {hiringSim.rejectionReasons?.map((r: string, i: number) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}