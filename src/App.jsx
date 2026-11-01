import React from 'react';
import Navbar from './components/Navbar';
import CorkBoard from './features/wall-todos/CorkBoard';
import Notebook from './features/notebook/Notebook';
import QuickNotes from './features/notes-drawer/QuickNotes';
import { useWorkspaceStore } from './store/useWorkspaceStore';

export default function App() {
  const { activeTab } = useWorkspaceStore();

  return (
    <div className="fixed inset-0 w-screen h-[100dvh] overflow-hidden bg-[#140c07] flex flex-col justify-between select-none">
      <Navbar />

      {/* Main Viewport: pt-14 se top bar bilkul clear rahega aur cut nahi hoga */}
      <main className="w-full flex-1 pt-14 pb-16 overflow-hidden flex flex-col items-center justify-start">
        {activeTab === 'wall' && <CorkBoard />}
        {activeTab === 'notebook' && <Notebook />}
        {activeTab === 'notes' && <QuickNotes />}
      </main>
    </div>
  );
}