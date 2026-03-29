"use client";

import { useState } from 'react';

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

export default function ResumeBuilder() {
  const [input, setInput] = useState<ResumeInput>(initial);
  const [generatedResume, setGeneratedResume] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const update = (field: keyof ResumeInput) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const generateResume = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/resume/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: input }),
      });
      const data = await res.json();
      if (data.data) {
        setGeneratedResume(data.data);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Failed to generate resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Create Your Resume</h2>
        <p className="mt-2 text-gray-600">Fill in your details and let AI enhance your resume.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={input.name}
              onChange={update('name')}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={input.email}
              onChange={update('email')}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              value={input.phone}
              onChange={update('phone')}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={input.location}
              onChange={update('location')}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Summary</label>
            <textarea
              value={input.summary}
              onChange={update('summary')}
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Brief professional summary..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Experience</label>
            <textarea
              value={input.experience}
              onChange={update('experience')}
              rows={4}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Your work experience..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Education</label>
            <textarea
              value={input.education}
              onChange={update('education')}
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Your education background..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Projects</label>
            <textarea
              value={input.projects}
              onChange={update('projects')}
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Your projects..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Skills</label>
            <textarea
              value={input.skills}
              onChange={update('skills')}
              rows={2}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Comma-separated skills..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={generateResume}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Resume'}
        </button>
      </div>

      {generatedResume && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Generated Resume</h3>
          <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(generatedResume, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}