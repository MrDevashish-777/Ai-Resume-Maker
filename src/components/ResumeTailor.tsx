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
      if (data.data) {
        setTailoredResume(data.data);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Failed to tailor resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tailor Your Resume</h2>
        <p className="mt-2 text-gray-600">Optimize your resume for a specific job description.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Your Resume Text</label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={15}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Paste your current resume text here..."
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={15}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Paste the job description here..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={tailorResume}
          disabled={loading || !resumeText || !jobDescription}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Tailoring...' : 'Tailor Resume'}
        </button>
      </div>

      {tailoredResume && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Tailored Resume</h3>
          <pre className="whitespace-pre-wrap text-sm">{tailoredResume.rewrittenResume}</pre>
        </div>
      )}
    </div>
  );
}