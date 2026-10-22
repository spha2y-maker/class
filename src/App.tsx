/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ConceptViewer } from './components/ConceptViewer';
import { Checklist } from './components/Checklist';
import { Quiz } from './components/Quiz';
import { PresenterPicker } from './components/PresenterPicker';
import { TextbookActivities } from './components/TextbookActivities';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('concept');

  return (
    <div className="min-h-screen bg-[#fafbfe] text-slate-900 flex flex-col selection:bg-sky-100 selection:text-sky-900">
      {/* 3-zone standard top bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 md:py-10">
        {activeTab === 'concept' && (
          <ConceptViewer
            onNavigateToPicker={() => setActiveTab('picker')}
            onNavigateToChecklist={() => setActiveTab('checklist')}
          />
        )}
        {activeTab === 'checklist' && <Checklist />}
        {activeTab === 'quiz' && <Quiz />}
        {activeTab === 'picker' && <PresenterPicker />}
        {activeTab === 'activity' && <TextbookActivities />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
