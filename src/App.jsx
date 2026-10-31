import React from 'react';
import Navbar from './components/Navbar';
import CorkBoard from './features/wall-todos/CorkBoard';
import Notebook from './features/notebook/Notebook';
import { useWorkspaceStore } from './store/useWorkspaceStore';

export default function App() {
  const { activeTab } = useWorkspaceStore();

  return (
    <div className="w-full h-screen overflow-hidden bg-stone-950 flex flex-col">
      <Navbar />

      {/* Main Full-Screen Viewport */}
      <main className="w-full h-full pt-12 pb-16">
        {activeTab === 'wall' && <CorkBoard />}
        {activeTab === 'notebook' && <Notebook />}
        {activeTab === 'notes' && (
          <div className="h-full flex flex-col items-center justify-center text-stone-300 p-6">
            <h2 className="text-lg font-bold text-amber-300">Quick Notes Tab</h2>
            <p className="text-xs text-stone-400 mt-1">Drawer list view coming next</p>
          </div>
        )}
      </main>
    </div>
  );
}