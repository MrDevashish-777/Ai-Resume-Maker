"use client";

import { useState } from 'react';
import ResumeBuilder from '@/components/ResumeBuilder';
import ResumeAnalyzer from '@/components/ResumeAnalyzer';
import ResumeTailor from '@/components/ResumeTailor';

type Tab = 'build' | 'analyze' | 'tailor';

const tabs = [
  {
    id: 'build' as Tab,
    name: 'Create Resume',
    icon: '✦',
    desc: 'AI-powered builder',
    component: ResumeBuilder,
  },
  {
    id: 'analyze' as Tab,
    name: 'Analyze Resume',
    icon: '◎',
    desc: 'ATS & hiring sim',
    component: ResumeAnalyzer,
  },
  {
    id: 'tailor' as Tab,
    name: 'Tailor Resume',
    icon: '⟡',
    desc: 'Job-specific tuning',
    component: ResumeTailor,
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('build');
  const ActiveComponent = tabs.find(t => t.id === activeTab)!.component;

  return (
    <div className="min-h-screen" style={{ paddingBottom: '60px' }}>
      {/* Hero */}
      <div className="text-center py-16 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6"
          style={{ background: 'rgba(102, 126, 234, 0.15)', border: '1px solid rgba(102, 126, 234, 0.3)', color: '#a5b4fc' }}>
          <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" style={{ animation: 'pulseGlow 2s infinite' }}></span>
          Powered by Gemini AI
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
          <span className="gradient-text">Intelligent</span>
          <span className="text-white"> Resume</span>
          <br />
          <span className="text-white">for the </span>
          <span className="gradient-text-blue">Modern Job Market</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Build, analyze, and tailor your resume with AI — get hired faster.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass p-2 flex gap-2 mb-8 max-w-lg mx-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span className="hidden sm:block">{tab.name}</span>
              <span className="sm:hidden text-xs">{tab.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Active Component */}
        <div className="fade-in-up" key={activeTab}>
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}
