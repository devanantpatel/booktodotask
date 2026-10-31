import React from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { BookOpen, CheckSquare, StickyNote, Cloud, CloudOff } from 'lucide-react';

export default function Navbar() {
  const { activeTab, setActiveTab, isGoogleConnected } = useWorkspaceStore();

  const tabs = [
    { id: 'wall', label: 'Wall Tasks', icon: CheckSquare },
    { id: 'notebook', label: 'Notebook', icon: BookOpen },
    { id: 'notes', label: 'Quick Notes', icon: StickyNote },
  ];

  return (
    <>
      {/* Top Header - Compact Brand Bar */}
      <header className="fixed top-0 left-0 right-0 h-12 bg-stone-950/80 backdrop-blur-md border-b border-stone-800/80 px-4 z-40 flex items-center justify-between text-white">
        <span className="text-base font-bold tracking-tight text-amber-200">booktodotask</span>

        <div className="flex items-center gap-1.5 text-[11px] text-stone-400 bg-stone-900/90 px-2.5 py-1 rounded-full border border-stone-800">
          {isGoogleConnected ? (
            <>
              <Cloud size={13} className="text-emerald-400" />
              <span>Drive</span>
            </>
          ) : (
            <>
              <CloudOff size={13} className="text-amber-500" />
              <span>Local</span>
            </>
          )}
        </div>
      </header>

      {/* Bottom Floating Navigation Bar */}
      <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md bg-stone-950/90 backdrop-blur-xl border border-stone-800 p-1.5 rounded-2xl shadow-2xl flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px] font-semibold transition-all ${
                isActive
                  ? 'bg-amber-500 text-stone-950 shadow-md font-bold scale-100'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Icon size={18} className="mb-0.5" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </>
  );
}