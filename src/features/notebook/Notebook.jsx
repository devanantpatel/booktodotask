import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Plus, Trash2, Lock, Unlock, 
  Palette, KeyRound, Bookmark 
} from 'lucide-react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';

export default function Notebook() {
  const { 
    notebook, 
    setNotebookCover, 
    setNotebookPin, 
    unlockNotebook, 
    lockNotebook, 
    nextPage, 
    prevPage, 
    addNewPage, 
    updateCurrentPage, 
    deleteCurrentPage 
  } = useWorkspaceStore();

  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);

  const totalPages = notebook.pages.length;
  const leftPageIndex = notebook.currentPage;
  const rightPageIndex = notebook.currentPage + 1;
  const leftPage = notebook.pages[leftPageIndex] || { title: '', content: '', date: '' };
  const rightPage = notebook.pages[rightPageIndex] || null;

  const coverThemes = {
    'vintage-leather': {
      bg: 'bg-[#3b1e0d]',
      border: 'border-[#241106]',
      name: 'Vintage Leather',
      stitch: 'border-amber-700/40'
    },
    'obsidian': {
      bg: 'bg-[#18181b]',
      border: 'border-[#09090b]',
      name: 'Obsidian Black',
      stitch: 'border-zinc-700/50'
    },
    'emerald-velvet': {
      bg: 'bg-[#123826]',
      border: 'border-[#081f14]',
      name: 'Emerald Velvet',
      stitch: 'border-emerald-700/40'
    },
    'royal-blue': {
      bg: 'bg-[#172554]',
      border: 'border-[#0f172a]',
      name: 'Royal Blue',
      stitch: 'border-sky-800/40'
    }
  };

  const theme = coverThemes[notebook.cover] || coverThemes['obsidian'];

  const handleNext = () => {
    if (notebook.currentPage < totalPages - 1) {
      nextPage();
    }
  };

  const handlePrev = () => {
    if (notebook.currentPage > 0) {
      prevPage();
    }
  };

  const handleUnlock = (e) => {
    e.preventDefault();
    if (unlockNotebook(enteredPin)) {
      setPinError(false);
      setEnteredPin('');
    } else {
      setPinError(true);
    }
  };

  const handleSavePin = (e) => {
    e.preventDefault();
    setNotebookPin(newPinInput.trim());
    setIsPinModalOpen(false);
    setNewPinInput('');
  };

  return (
    <div className="relative w-full h-full max-h-[calc(100vh-120px)] flex flex-col items-center justify-between overflow-hidden select-none px-2 sm:px-4">
      
      {/* Top Glass Control Bar - Visible and Padded */}
      <div className="z-30 w-full max-w-4xl bg-stone-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-950/70 flex items-center justify-between gap-2 shadow-xl shrink-0 mt-1 mb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCoverModalOpen(true)}
            className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 px-2.5 py-1 rounded-lg text-xs font-semibold border border-stone-700 transition"
          >
            <Palette size={13} className="text-amber-400" />
            <span className="hidden sm:inline">Cover:</span> {theme.name}
          </button>

          <button
            onClick={() => setIsPinModalOpen(true)}
            className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 px-2.5 py-1 rounded-lg text-xs font-semibold border border-stone-700 transition"
          >
            <KeyRound size={13} className="text-amber-400" />
            <span>{notebook.hasPin ? 'Change PIN' : 'Set PIN'}</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-stone-800 border border-stone-700 text-[11px] font-bold text-amber-300">
          <span>Total Pages: {totalPages}</span>
        </div>

        {notebook.hasPin && (
          <button
            onClick={notebook.isLocked ? undefined : lockNotebook}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition shadow ${
              notebook.isLocked 
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            {notebook.isLocked ? <Lock size={12} /> : <Unlock size={12} />}
            <span>{notebook.isLocked ? 'Locked' : 'Lock Book'}</span>
          </button>
        )}
      </div>

      {/* Book Container with Natural Aspect Ratio */}
      <div className="relative w-full max-w-4xl flex-1 flex items-center justify-center min-h-0 pb-1">
        
        {/* Outer Hardcover */}
        <div className={`relative w-full h-full max-h-[520px] rounded-2xl ${theme.bg} border-[8px] sm:border-[12px] ${theme.border} shadow-[0_20px_50px_rgba(0,0,0,0.9),0_10px_20px_rgba(0,0,0,0.8)] flex p-1.5 sm:p-2.5 overflow-hidden transition-colors duration-300 border-double`}>
          
          <div className={`pointer-events-none absolute inset-1 rounded-xl border border-dashed ${theme.stitch} z-10`} />

          {/* Golden Corner Guards */}
          <div className="absolute top-1 left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-400/70 z-20 pointer-events-none" />
          <div className="absolute top-1 right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-400/70 z-20 pointer-events-none" />
          <div className="absolute bottom-1 left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-400/70 z-20 pointer-events-none" />
          <div className="absolute bottom-1 right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-400/70 z-20 pointer-events-none" />

          {/* Book Spine Shadow */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/50 via-black/20 to-black/50 z-30 pointer-events-none shadow-2xl" />

          {/* PIN Lock Protection Overlay */}
          {notebook.isLocked && (
            <div className="absolute inset-0 bg-stone-950/85 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-2 shadow-lg">
                <Lock size={22} />
              </div>
              <h3 className="text-sm font-extrabold text-stone-100">Diary is Locked</h3>
              <p className="text-[11px] text-stone-400 mt-0.5 mb-3">Enter your 4-digit PIN to access pages</p>

              <form onSubmit={handleUnlock} className="flex flex-col items-center gap-2">
                <input
                  type="password"
                  maxLength={4}
                  placeholder="••••"
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  className="w-32 tracking-[0.4em] text-center text-base font-black py-1.5 px-3 bg-stone-900 border border-stone-600 rounded-xl outline-none focus:border-amber-500 text-stone-100 shadow-inner"
                />
                {pinError && <span className="text-[10px] text-rose-500 font-bold">Incorrect PIN!</span>}
                <button
                  type="submit"
                  className="mt-1 bg-amber-500 hover:bg-amber-400 text-stone-950 px-4 py-1.5 rounded-xl text-xs font-bold transition shadow active:scale-95"
                >
                  Unlock Book
                </button>
              </form>
            </div>
          )}

          {/* Pages */}
          <div className="relative flex-1 w-full h-full flex rounded-xl overflow-hidden shadow-2xl">
            
            {/* LEFT PAGE */}
            <div 
              className="relative flex-1 h-full flex flex-col justify-between p-3 sm:p-5 border-r border-stone-300/60 shadow-[inset_-10px_0_15px_rgba(0,0,0,0.06)] overflow-hidden"
              style={{
                backgroundColor: '#fbf8ee',
                backgroundImage: 'linear-gradient(rgba(180, 160, 140, 0.22) 1px, transparent 1px)',
                backgroundSize: '100% 28px',
                backgroundPosition: '0 4px'
              }}
            >
              <div className="flex items-center justify-between border-b border-amber-900/10 pb-1.5 shrink-0">
                <div className="flex items-center gap-1.5">
                  <Bookmark size={14} className="text-rose-600 fill-rose-600 -mt-0.5" />
                  <span className="text-[10px] font-bold text-stone-500 tracking-wide">
                    {leftPage.date || 'Today'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-stone-500 bg-amber-900/5 border border-amber-900/10 px-2 py-0.5 rounded">
                    Page {leftPageIndex + 1} of {totalPages}
                  </span>
                  {totalPages > 1 && (
                    <button
                      onClick={deleteCurrentPage}
                      title="Delete Page"
                      className="p-1 text-stone-400 hover:text-rose-600 transition"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 flex flex-col mt-1.5 overflow-hidden min-h-0">
                <input
                  type="text"
                  placeholder="Page Heading..."
                  value={leftPage.title || ''}
                  onChange={(e) => updateCurrentPage(e.target.value, leftPage.content)}
                  className="w-full text-sm sm:text-base font-black text-stone-900 bg-transparent outline-none placeholder-stone-400 mb-1 border-b border-stone-300/30 pb-0.5 shrink-0"
                />
                <textarea
                  placeholder="Write your personal diary entry here..."
                  value={leftPage.content || ''}
                  onChange={(e) => updateCurrentPage(leftPage.title, e.target.value)}
                  style={{ lineHeight: '28px' }}
                  className="w-full flex-1 bg-transparent text-xs sm:text-sm text-stone-800 font-medium outline-none resize-none placeholder-stone-400 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-amber-950/20 hover:[&::-webkit-scrollbar-thumb]:bg-amber-950/40 [&::-webkit-scrollbar-thumb]:rounded-full"
                />
              </div>

              {/* Mobile Footer */}
              <div className="flex md:hidden items-center justify-between pt-1.5 border-t border-amber-900/10 shrink-0">
                <button
                  onClick={handlePrev}
                  disabled={notebook.currentPage === 0}
                  className="flex items-center gap-1 text-[11px] font-bold text-stone-600 disabled:opacity-30"
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                <button
                  onClick={addNewPage}
                  className="bg-stone-900/10 px-2 py-0.5 rounded text-[11px] font-bold text-stone-900"
                >
                  + Page
                </button>
                <button
                  onClick={handleNext}
                  disabled={notebook.currentPage >= totalPages - 1}
                  className="flex items-center gap-1 text-[11px] font-bold text-stone-600 disabled:opacity-30"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* RIGHT PAGE */}
            <div 
              className="hidden md:flex relative flex-1 h-full flex-col justify-between p-3 sm:p-5 shadow-[inset_10px_0_15px_rgba(0,0,0,0.06)] overflow-hidden"
              style={{
                backgroundColor: '#fbf8ee',
                backgroundImage: 'linear-gradient(rgba(180, 160, 140, 0.22) 1px, transparent 1px)',
                backgroundSize: '100% 28px',
                backgroundPosition: '0 4px'
              }}
            >
              {rightPage ? (
                <div className="flex-1 flex flex-col justify-between h-full overflow-hidden min-h-0">
                  <div className="flex items-center justify-between border-b border-amber-900/10 pb-1.5 shrink-0">
                    <span className="text-[10px] font-bold text-stone-500 tracking-wide">
                      {rightPage.date || 'Today'}
                    </span>
                    <span className="text-[10px] font-bold text-stone-500 bg-amber-900/5 border border-amber-900/10 px-2 py-0.5 rounded">
                      Page {rightPageIndex + 1} of {totalPages}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col mt-1.5 overflow-hidden min-h-0">
                    <h4 className="text-sm sm:text-base font-black text-stone-900 mb-1 border-b border-stone-300/30 pb-0.5 shrink-0">
                      {rightPage.title || 'Untitled Entry'}
                    </h4>
                    <p 
                      style={{ lineHeight: '28px' }}
                      className="w-full flex-1 text-xs sm:text-sm text-stone-700 font-medium whitespace-pre-wrap overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-amber-950/20 hover:[&::-webkit-scrollbar-thumb]:bg-amber-950/40 [&::-webkit-scrollbar-thumb]:rounded-full"
                    >
                      {rightPage.content || 'Blank page. Flip forward to edit.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-end pt-1.5 border-t border-amber-900/10 shrink-0">
                    <span className="text-[10px] text-stone-400 font-semibold italic">Turn to next page to edit</span>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 text-stone-400">
                  <p className="text-xs font-bold text-stone-600 mb-1">Next Page is Empty</p>
                  <p className="text-[11px] mb-3">You have reached the end of your diary.</p>
                  <button
                    onClick={addNewPage}
                    className="flex items-center gap-1.5 bg-stone-900 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold shadow hover:bg-stone-800 transition active:scale-95"
                  >
                    <Plus size={13} /> Add New Page
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Desktop Outer Arrows: Frame ke borders par locked */}
          <button
            onClick={handlePrev}
            disabled={notebook.currentPage === 0}
            className="hidden md:flex absolute -left-1 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-stone-900/90 hover:bg-amber-600 text-white items-center justify-center shadow-lg transition disabled:opacity-20 active:scale-90 border border-stone-700"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={handleNext}
            disabled={notebook.currentPage >= totalPages - 1}
            className="hidden md:flex absolute -right-1 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-stone-900/90 hover:bg-amber-600 text-white items-center justify-center shadow-lg transition disabled:opacity-20 active:scale-90 border border-stone-700"
          >
            <ChevronRight size={16} />
          </button>

        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {isCoverModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xs bg-stone-900 border border-amber-900/60 rounded-2xl p-4 shadow-2xl text-stone-200"
            >
              <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-3">
                Choose Diary Cover
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {Object.entries(coverThemes).map(([key, item]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setNotebookCover(key);
                      setIsCoverModalOpen(false);
                    }}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${item.bg} ${
                      notebook.cover === key ? 'ring-2 ring-amber-400 scale-102' : 'border-stone-700 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <span className="text-[11px] font-bold text-stone-100">{item.name}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setIsCoverModalOpen(false)}
                className="w-full mt-3 py-1.5 text-xs font-semibold bg-stone-800 hover:bg-stone-700 rounded-lg text-stone-300 transition"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPinModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xs bg-stone-900 border border-amber-900/60 rounded-2xl p-4 shadow-2xl text-stone-200"
            >
              <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-2">
                {notebook.hasPin ? 'Update PIN Protection' : 'Set 4-Digit PIN'}
              </h3>
              <p className="text-[11px] text-stone-400 mb-3">
                Khali chhod kar Save karne se PIN protection remove ho jayegi.
              </p>

              <form onSubmit={handleSavePin} className="space-y-3">
                <input
                  type="password"
                  maxLength={4}
                  placeholder="Enter 4-digit PIN"
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-center text-sm tracking-[0.4em] font-bold outline-none focus:border-amber-400 text-stone-100"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPinModalOpen(false)}
                    className="flex-1 py-1.5 text-xs font-semibold bg-stone-800 hover:bg-stone-700 rounded-lg text-stone-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg transition shadow"
                  >
                    Save PIN
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}