import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default function DocLayout({ title, subtitle, children }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-y-auto bg-[#120a06] text-stone-200 select-text z-50">
      <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center">
        
        {/* Navigation Top Header */}
        <div className="w-full flex items-center justify-between pb-4 border-b border-stone-800">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-bold text-stone-300 hover:text-amber-400 bg-stone-900/90 hover:bg-stone-850 px-3.5 py-2 rounded-xl border border-stone-800 transition active:scale-95 shadow-md"
          >
            <ArrowLeft size={15} />
            <span>Back to Workspace</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-black text-amber-400">
            <BookOpen size={16} />
            <span>booktodotask documentation</span>
          </div>
        </div>

        {/* Content Box */}
        <main className="w-full mt-6 bg-[#1a120c] border border-amber-950/80 rounded-2xl p-6 sm:p-10 shadow-2xl">
          <header className="border-b border-stone-800 pb-5 mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-stone-100 tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-amber-400 font-medium mt-1.5">
                {subtitle}
              </p>
            )}
          </header>

          <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-stone-300">
            {children}
          </div>
        </main>

        <footer className="mt-8 mb-6 text-center text-xs text-stone-500 font-mono">
          © 2026 booktodotask. Built with care for focused minds.
        </footer>
      </div>
    </div>
  );
}