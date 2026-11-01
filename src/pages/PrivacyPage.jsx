import React from 'react';
import DocLayout from './DocLayout';
import { ShieldCheck, Database, Key, Trash2 } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <DocLayout 
      title="Privacy Policy" 
      subtitle="Effective Date: November 1, 2026 | Zero-telemetry, client-side encryption policy"
    >
      <section className="space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
          <ShieldCheck size={18} />
          <h2>1. Introduction & Core Philosophy</h2>
        </div>
        <p>
          <strong>booktodotask</strong> user privacy aur complete digital autonomy ko dhyaan me rakhkar build kiya gaya hai. Hum believe karte hain ki aapke personal thoughts, wall tasks, aur diary entries sirf aapki hain.
        </p>
        <p>
          Ye application <strong>Zero Third-Party Database</strong> model par chalta hai. Hamara koi central database server nahi hai jahan aapka data collect ya read kiya jaye.
        </p>
      </section>

      <section className="space-y-2 pt-4 border-t border-stone-800">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
          <Database size={18} />
          <h2>2. How Your Data Is Stored</h2>
        </div>
        <div className="space-y-2 text-stone-300">
          <p>
            <strong>Local Offline Storage:</strong> Jab tak aap Google account link nahi karte, aapka sara data (todos, notebook pages, sketches) aapke browser ke <code>localStorage</code> me client-side store hota hai.
          </p>
          <p>
            <strong>Google Drive Cloud Sync:</strong> Jab aap "Link Drive" opt karte hain, tab direct client-to-cloud request ke through data aapke khud ke Google Drive ke isolated hidden folder (<code>appDataFolder</code>) me save hota hai.
          </p>
        </div>
      </section>

      <section className="space-y-2 pt-4 border-t border-stone-800">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
          <Key size={18} />
          <h2>3. Google API Permissions (Scopes)</h2>
        </div>
        <p>
          Hum Google se sirf ek non-sensitive permission request karte hain:
        </p>
        <div className="bg-stone-900/70 p-3 rounded-xl border border-stone-800 font-mono text-xs text-amber-300">
          https://www.googleapis.com/auth/drive.appdata
        </div>
        <p className="text-stone-400 text-xs leading-relaxed">
          Is permission ke chalte app aapke Drive ke kisi bhi personal file, photo, ya document ko dekh, padh ya modify nahi kar sakta. App sirf apne banaye huye workspace file (<code>booktodotask_workspace.json</code>) ko hi access kar pata hai.
        </p>
      </section>

      <section className="space-y-2 pt-4 border-t border-stone-800">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
          <Trash2 size={18} />
          <h2>4. Data Deletion & Contact</h2>
        </div>
        <p>
          Aap kisi bhi waqt header me <strong>Disconnect</strong> button daba kar Google sync rok sakte hain, ya browser data clear karke local session delete kar sakte hain. Kisi bhi query ke liye aap direct developer se sampark kar sakte hain: <span className="text-amber-400">devanantpatel@gmail.com</span>.
        </p>
      </section>
    </DocLayout>
  );
}