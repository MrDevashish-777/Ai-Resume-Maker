"use client";

import { useState } from 'react';
import ResumeBuilder from '@/components/ResumeBuilder';
import ResumeAnalyzer from '@/components/ResumeAnalyzer';
import ResumeTailor from '@/components/ResumeTailor';

type Tab = 'build' | 'analyze' | 'tailor';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('build');

  const tabs = [
    { id: 'build' as Tab, name: 'Create Resume', component: ResumeBuilder },
    { id: 'analyze' as Tab, name: 'Analyze Resume', component: ResumeAnalyzer },
    { id: 'tailor' as Tab, name: 'Tailor Resume', component: ResumeTailor },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || ResumeBuilder;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
      <ActiveComponent />
    </div>
  );
}
