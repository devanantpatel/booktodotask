import React from 'react';
import DocLayout from './DocLayout';
import { CheckSquare, BookOpen, StickyNote, Cloud, Lock, Wand2, MousePointer } from 'lucide-react';

export default function GuidePage() {
  return (
    <DocLayout 
      title="User Guide & Feature Manual" 
      subtitle="Complete walkthrough on how to use every tool in booktodotask"
    >
      {/* SECTION 1 */}
      <section className="space-y-3 pb-6 border-b border-stone-800">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
          <CheckSquare size={18} />
          <h2>1. Wall Tasks (Visual Corkboard)</h2>
        </div>
        
        <p className="text-stone-300">
          Ye module tasks ko ek realistic investigation board ki tarah manage karta hai.
        </p>

        <div className="bg-stone-900/60 p-4 rounded-xl border border-stone-800 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">Kaise Use Karein (Step-by-Step Guide):</h3>
          <ol className="list-decimal pl-5 space-y-1.5 text-stone-300">
            <li><strong>Card Add Karna:</strong> Upar diye gaye <span className="text-amber-400 font-semibold">+ Add Card</span> button par click karein. Checklists ya Plain Note me se ek select karein, title aur paper color choose karein.</li>
            <li><strong>Position Move Karna:</strong> <span className="text-amber-400 font-semibold">Pin Board</span> mode me card ko ungli ya mouse se drag karke board par kisi bhi jagah arrange karein. Cards board frame ke bahar nahi jaate.</li>
            <li><strong>Grid View Switch:</strong> Agar screen clean aur auto-aligned chahiye, toh top bar se <span className="text-amber-400 font-semibold">Grid View</span> toggle karein.</li>
            <li><strong>Task Complete Karna:</strong> Card ke andar checkbox par tap karein ya niche diye <span className="text-emerald-400 font-semibold">Mark/Done</span> button ko click karein.</li>
            <li><strong>Multi-Select Delete:</strong> Top right ke <span className="text-amber-400 font-semibold">Select</span> drop-down se multiple cards choose karke ek sath Delete karein.</li>
          </ol>
        </div>
      </section>

      {/* SECTION 2 */}
      <section className="space-y-3 pb-6 border-b border-stone-800">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
          <BookOpen size={18} />
          <h2>2. 3D Notebook (Protected Diary)</h2>
        </div>

        <p className="text-stone-300">
          Ye ek dual-page open book hai jo journal entries, code snippets aur thoughts likhne ke liye designed hai.
        </p>

        <div className="bg-stone-900/60 p-4 rounded-xl border border-stone-800 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">Kaise Use Karein (Step-by-Step Guide):</h3>
          <ol className="list-decimal pl-5 space-y-1.5 text-stone-300">
            <li><strong>Writing on Left Page:</strong> Title aur textarea me likhna shuru karein. Har word real-time auto-save hota hai.</li>
            <li><strong>PIN Setup (Security):</strong> Top bar me <span className="text-amber-400 font-semibold">Set PIN</span> par click karein aur 4-digit code save karein. Uske baad <span className="text-emerald-400 font-semibold">Lock Book</span> dabate hi book bina PIN ke open nahi hogi.</li>
            <li><strong>Cover Badalna:</strong> <span className="text-amber-400 font-semibold">Cover</span> button par tap karke Obsidian Black, Vintage Leather, Emerald Velvet ya Royal Blue skin lagayein.</li>
            <li><strong>Page Flip Karna:</strong> Left aur Right outer border arrows se pages turn karein. Mobile me bottom Prev/Next buttons ka use karein.</li>
            <li><strong>Naya Page Banana:</strong> Jab akhiri page par pahunchein, tab <span className="text-amber-400 font-semibold">+ Add New Page</span> dabayein.</li>
          </ol>
        </div>
      </section>

      {/* SECTION 3 */}
      <section className="space-y-3 pb-6 border-b border-stone-800">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
          <StickyNote size={18} />
          <h2>3. Quick Notes & Doodle Canvas</h2>
        </div>

        <p className="text-stone-300">
          Desk memo pad jahan text notes ke sath hand-drawn sketches aur diagrams draw kiye ja sakte hain.
        </p>

        <div className="bg-stone-900/60 p-4 rounded-xl border border-stone-800 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">Kaise Use Karein (Step-by-Step Guide):</h3>
          <ol className="list-decimal pl-5 space-y-1.5 text-stone-300">
            <li><strong>Text Note:</strong> <span className="text-amber-400 font-semibold">+ New Note</span> dabayein, category tag (Work, Ideas, etc.) chunein aur save karein.</li>
            <li><strong>Draw / Sketch Mode:</strong> Modal ke top switcher se <span className="text-amber-400 font-semibold">Draw & Objects</span> select karein.</li>
            <li><strong>Smart Magic Eraser:</strong> Magic wand icon par tap karein aur canvas par jis stroke/shape par tap karenge, wo shape Photoshop ki tarah ek touch me disappear ho jayega.</li>
            <li><strong>Geometric Shapes:</strong> Rectangle, Circle, Line aur Star tool choose karke canvas par drag karein.</li>
            <li><strong>Direct Image Copy:</strong> Card ke copy button par tap karte hi drawing direct real PNG image ke roop me clipboard me copy ho jati hai (WhatsApp/Photoshop me sidhe paste ho sakti hai).</li>
          </ol>
        </div>
      </section>

      {/* SECTION 4 */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
          <Cloud size={18} />
          <h2>4. Google Drive Cloud Sync</h2>
        </div>

        <p className="text-stone-300">
          Guest users ka sara data device ke localStorage me rehta hai. Apne data ko har device par lane ke liye top header me <span className="text-amber-400 font-bold">Link Drive</span> par tap karein.
        </p>
        <p className="text-stone-400 text-xs">
          Sync ho jane ke baad aapka data aapke khud ke Google Drive ke secure <code>appDataFolder</code> me save hota hai.
        </p>
      </section>
    </DocLayout>
  );
}