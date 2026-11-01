import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { useGoogleSync } from '../features/auth-sync/useGoogleSync';
import { 
  BookOpen, CheckSquare, StickyNote, Cloud, 
  CloudOff, RefreshCw, LogIn, LogOut, Menu, X, 
  ShieldCheck, User, Coffee, Copy, Check, Heart, Info, Sparkles, IndianRupee 
} from 'lucide-react';

const GithubIcon = ({ size = 15, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Navbar() {
  const navigate = useNavigate();
  const { activeTab, setActiveTab, isGoogleConnected, isSyncing, lastSyncedAt } = useWorkspaceStore();
  const { loginWithGoogle, disconnectGoogle } = useGoogleSync();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  // Donation State with Custom Amount Support
  const [amount, setAmount] = useState('21');
  const [copiedUpi, setCopiedUpi] = useState(false);
  
  // Apna exact active UPI handle yahan verify karein
  const upiId = "7607765685@upi";
  const payeeName = "Anant Patel";

  const validAmount = amount && Number(amount) > 0 ? amount : '1';
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${validAmount}&cu=INR&tn=${encodeURIComponent("Support Developer")}&mc=0000&mode=02`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(upiUrl)}`;

  const tabs = [
    { id: 'wall', label: 'Wall Tasks', icon: CheckSquare },
    { id: 'notebook', label: 'Notebook', icon: BookOpen },
    { id: 'notes', label: 'Quick Notes', icon: StickyNote },
  ];

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleAmountChange = (val) => {
    // Only numbers allow karein
    const numeric = val.replace(/\D/g, '');
    setAmount(numeric);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-12 bg-stone-950/95 backdrop-blur-md border-b border-stone-850 px-3 z-40 flex items-center justify-between text-white select-none">
        <div className="flex items-center w-28">
          <button
            onClick={() => setIsDrawerOpen(true)}
            title="Open Menu"
            className="p-1.5 rounded-lg bg-stone-900/80 hover:bg-stone-850 text-stone-300 hover:text-amber-400 border border-stone-800 transition active:scale-95 flex items-center justify-center"
          >
            <Menu size={18} />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center pointer-events-none">
          <span className="text-base sm:text-lg font-black tracking-tight text-amber-400 drop-shadow-sm font-sans">
            booktodotask
          </span>
        </div>

        <div className="flex items-center justify-end gap-1.5 sm:gap-2 w-auto sm:w-64">
          <div className="flex items-center gap-1.5 text-[11px] text-stone-300 bg-stone-900/90 px-2 sm:px-2.5 py-1 rounded-lg border border-stone-800">
            {isSyncing ? (
              <>
                <RefreshCw size={12} className="text-amber-400 animate-spin" />
                <span className="hidden sm:inline">Syncing...</span>
              </>
            ) : isGoogleConnected ? (
              <>
                <Cloud size={13} className="text-emerald-400" />
                <span className="text-emerald-300 font-medium hidden sm:inline">Drive Synced</span>
                {lastSyncedAt && <span className="text-[9px] text-stone-500">({lastSyncedAt})</span>}
              </>
            ) : (
              <>
                <CloudOff size={13} className="text-stone-400" />
                <span className="text-stone-400 font-medium hidden sm:inline">Local Storage</span>
              </>
            )}
          </div>

          {isGoogleConnected ? (
            <button
              onClick={disconnectGoogle}
              title="Disconnect Drive"
              className="flex items-center gap-1 text-[11px] bg-stone-900 hover:bg-rose-950/40 text-stone-300 hover:text-rose-400 border border-stone-800 px-2 py-1 rounded-lg transition"
            >
              <LogOut size={12} />
              <span className="hidden sm:inline">Disconnect</span>
            </button>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="flex items-center gap-1.5 text-[11px] font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 px-2.5 py-1 rounded-lg transition shadow active:scale-95 whitespace-nowrap"
            >
              <LogIn size={13} />
              <span>Link Drive</span>
            </button>
          )}
        </div>
      </header>

      {/* Floating Bottom Nav */}
      <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md bg-stone-950/95 backdrop-blur-xl border border-stone-800 p-1.5 rounded-2xl shadow-2xl flex items-center justify-around select-none">
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
              <Icon size={17} className="mb-0.5" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Left Drawer Menu */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative w-72 max-w-[80vw] h-full bg-[#18110b] border-r border-stone-800 text-stone-200 shadow-2xl flex flex-col justify-between z-10"
            >
              <div>
                <div className="flex items-center justify-between p-4 border-b border-stone-850">
                  <div className="flex flex-col">
                    <span className="text-base font-black text-amber-400 tracking-tight">booktodotask</span>
                    <span className="text-[10px] text-stone-400 font-medium">Workspace Menu</span>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1 text-stone-400 hover:text-stone-100 rounded-lg hover:bg-stone-850 transition"
                  >
                    <X size={17} />
                  </button>
                </div>

                {/* Ordered Navigation Links */}
                <div className="p-3 space-y-1.5">
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      navigate('/guide');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-stone-300 hover:text-amber-300 hover:bg-stone-850 transition text-left"
                  >
                    <Info size={16} className="text-amber-400" />
                    <span>App Features & Guide</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      navigate('/privacy');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-stone-300 hover:text-amber-300 hover:bg-stone-850 transition text-left"
                  >
                    <ShieldCheck size={16} className="text-amber-400" />
                    <span>Privacy Policy</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      navigate('/developer');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-stone-300 hover:text-amber-300 hover:bg-stone-850 transition text-left"
                  >
                    <User size={16} className="text-amber-400" />
                    <span>About Developer</span>
                  </button>
                </div>
              </div>

              {/* Bottom Support Developer Section */}
              <div className="p-3 border-t border-stone-850 bg-stone-950/40 space-y-3">
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setIsDonateOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition shadow-sm text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <Coffee size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>Support Developer</span>
                  </div>
                  <span className="text-[10px] bg-amber-400 text-stone-950 px-1.5 py-0.5 rounded-md font-extrabold uppercase">UPI</span>
                </button>

                <div className="text-center pt-1">
                  <p className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 font-medium">
                    <span>Made with</span>
                    <Heart size={12} className="text-rose-500 fill-rose-500" />
                    <span>for focused minds</span>
                  </p>
                  <p className="text-[10px] text-stone-500 mt-0.5 font-mono">
                    © 2026 booktodotask. All rights reserved.
                  </p>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Support Developer Modal (Preset + Custom Amount) */}
      <AnimatePresence>
        {isDonateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md select-none">
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="w-full max-w-sm bg-[#1a120c] border border-amber-950/80 rounded-2xl p-5 shadow-2xl text-stone-200 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <Coffee size={18} className="text-amber-400" />
                  <h3 className="text-sm font-black text-amber-300 tracking-wide uppercase">Support Developer</h3>
                </div>
                <button
                  onClick={() => setIsDonateOpen(false)}
                  className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-stone-850"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="my-3 flex flex-col items-center text-center">
                <p className="text-xs text-stone-300 mb-2 leading-relaxed">
                  Agar aapko <strong>booktodotask</strong> helpful laga, toh direct UPI se developer ko support karein!
                </p>

                {/* Preset Amount Buttons */}
                <div className="grid grid-cols-3 gap-2 w-full my-1.5">
                  {['21', '51', '101'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt)}
                      className={`py-1.5 rounded-xl text-xs font-black transition ${
                        amount === amt
                          ? 'bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-300'
                          : 'bg-stone-900 border border-stone-700 text-stone-300 hover:bg-stone-850'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>

                {/* Custom Amount Input Box */}
                <div className="w-full flex items-center gap-2 px-3 py-1.5 my-1 bg-stone-950 border border-stone-800 focus-within:border-amber-400 rounded-xl transition">
                  <span className="text-xs font-bold text-stone-400">Custom ₹</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter other amount"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-amber-300 outline-none placeholder-stone-600"
                  />
                  {amount && (
                    <button
                      type="button"
                      onClick={() => setAmount('')}
                      className="text-stone-500 hover:text-stone-300 text-xs p-0.5"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Real-time Dynamic UPI QR Code */}
                <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-amber-500/30 my-2 flex items-center justify-center">
                  <img src={qrCodeUrl} alt="Scan UPI QR" className="w-40 h-40 object-contain" />
                </div>
                <p className="text-[10px] text-stone-400 font-medium">Scan using GPay, PhonePe, Paytm or BHIM</p>

                {/* Direct UPI Intent Link (Mobile Click) */}
                <a
                  href={upiUrl}
                  className="w-full mt-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 active:scale-95 transition"
                >
                  <Sparkles size={14} /> Pay ₹{validAmount} via UPI App
                </a>

                {/* UPI ID Copy Field */}
                <div className="w-full mt-2.5 flex items-center justify-between p-2 rounded-xl bg-stone-950 border border-stone-800 text-xs">
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-stone-500 uppercase tracking-wider font-bold">UPI ID</span>
                    <span className="font-mono text-stone-300 font-semibold">{upiId}</span>
                  </div>
                  <button
                    onClick={handleCopyUpi}
                    className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-stone-900 px-2 py-1 rounded-lg border border-stone-800 hover:bg-stone-800 transition"
                  >
                    {copiedUpi ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <button
                onClick={() => setIsDonateOpen(false)}
                className="w-full mt-1 py-1.5 text-xs font-semibold bg-stone-850 hover:bg-stone-800 text-stone-400 rounded-xl transition"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}