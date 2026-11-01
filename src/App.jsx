import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CorkBoard from './features/wall-todos/CorkBoard';
import Notebook from './features/notebook/Notebook';
import QuickNotes from './features/notes-drawer/QuickNotes';
import GuidePage from './pages/GuidePage';
import PrivacyPage from './pages/PrivacyPage';
import DeveloperPage from './pages/DeveloperPage';
import { useWorkspaceStore } from './store/useWorkspaceStore';

function Workspace() {
  const { activeTab } = useWorkspaceStore();

  return (
    <div className="fixed inset-0 w-screen h-[100dvh] overflow-hidden bg-[#140c07] flex flex-col justify-between select-none">
      <Navbar />

      <main className="w-full flex-1 pt-14 pb-16 overflow-hidden flex flex-col items-center justify-start">
        {activeTab === 'wall' && <CorkBoard />}
        {activeTab === 'notebook' && <Notebook />}
        {activeTab === 'notes' && <QuickNotes />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Workspace />} />
      <Route path="/guide" element={<GuidePage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/developer" element={<DeveloperPage />} />
    </Routes>
  );
}