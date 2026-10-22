import React from 'react';
import { TabType } from '../types';
import { Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand Wordmark (Single Line) */}
        <button
          onClick={() => setActiveTab('concept')}
          className="text-base sm:text-lg font-black tracking-tight text-slate-900 hover:text-sky-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
            말
          </span>
          <span>중3 국어 · 청중 고려 말하기</span>
        </button>

        {/* Zone 2: Navigation Links (Single Line, 1-2 words each) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('concept')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'concept' ? 'text-sky-600 font-bold' : 'hover:text-slate-900'
            }`}
          >
            핵심 개념
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'checklist' ? 'text-sky-600 font-bold' : 'hover:text-slate-900'
            }`}
          >
            점검 체크리스트
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'quiz' ? 'text-sky-600 font-bold' : 'hover:text-slate-900'
            }`}
          >
            형성평가
          </button>
          <button
            onClick={() => setActiveTab('picker')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'picker' ? 'text-sky-600 font-bold' : 'hover:text-slate-900'
            }`}
          >
            발표자 뽑기
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'activity' ? 'text-sky-600 font-bold' : 'hover:text-slate-900'
            }`}
          >
            실천 활동
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('picker')}
            className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-xl transition-all shadow-sm shadow-sky-500/20 whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>발표자 뽑기</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 border-t border-slate-100 gap-2 bg-slate-50/70 scrollbar-none text-xs">
        {[
          { id: 'concept', label: '핵심 개념' },
          { id: 'checklist', label: '체크리스트' },
          { id: 'quiz', label: '형성평가' },
          { id: 'picker', label: '발표자 뽑기' },
          { id: 'activity', label: '실천 활동' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as TabType)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 font-bold transition-colors ${
              activeTab === item.id ? 'bg-sky-600 text-white' : 'text-slate-600 bg-white border border-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
