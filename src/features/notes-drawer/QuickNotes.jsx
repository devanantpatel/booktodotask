import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Pin, Trash2, Edit3, 
  Copy, Check, FileText, X, 
  PenTool, Eraser, Wand2, Square, Circle, Minus, Star
} from 'lucide-react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';

export default function QuickNotes() {
  const { notes, addQuickNote, updateQuickNote, togglePinQuickNote, deleteQuickNote } = useWorkspaceStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Form states
  const [modalMode, setModalMode] = useState('text'); // 'text' | 'draw'
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTag, setNoteTag] = useState('General');
  const [copiedId, setCopiedId] = useState(null);

  // Canvas States & Tools
  const canvasRef = useRef(null);
  const colorInputRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen'); // 'pen' | 'eraser' | 'magic' | 'rect' | 'circle' | 'line' | 'star'
  const [drawColor, setDrawColor] = useState('#b91c1c');
  const [penSize, setPenSize] = useState(3);
  const [eraserSize, setEraserSize] = useState(14);
  const [drawingHasStrokes, setDrawingHasStrokes] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [snapshot, setSnapshot] = useState(null);

  const tags = ['All', 'General', 'Work', 'Ideas', 'Personal'];
  const presetColors = ['#1c1917', '#b91c1c', '#2563eb', '#15803d', '#d97706'];

  const filteredNotes = (notes || [])
    .filter((note) => {
      const titleMatch = (note.title || '').toLowerCase().includes(searchQuery.toLowerCase());
      const contentMatch = (note.content || note.text || '').toLowerCase().includes(searchQuery.toLowerCase());
      const tagMatch = selectedTag === 'All' || note.tag === selectedTag;
      return (titleMatch || contentMatch) && tagMatch;
    })
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  // Initialize Canvas
  useEffect(() => {
    if (modalMode === 'draw' && isModalOpen) {
      const timer = setTimeout(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (editingNote?.drawing) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = editingNote.drawing;
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            setDrawingHasStrokes(true);
          };
        } else {
          ctx.fillStyle = '#fefae0';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          setDrawingHasStrokes(false);
        }
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [modalMode, isModalOpen, editingNote]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  // SMART MAGIC ERASER (Contiguous Color Flood-Fill Erase)
  const applyMagicEraser = (startX, startY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const width = canvas.width;
    const height = canvas.height;
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    const startIndex = (Math.floor(startY) * width + Math.floor(startX)) * 4;
    const targetR = data[startIndex];
    const targetG = data[startIndex + 1];
    const targetB = data[startIndex + 2];
    const targetA = data[startIndex + 3];

    // Canvas background match: #fefae0 -> [254, 250, 224]
    const fillR = 254, fillG = 250, fillB = 224, fillA = 255;
    if (Math.abs(targetR - fillR) < 10 && Math.abs(targetG - fillG) < 10 && Math.abs(targetB - fillB) < 10) {
      return; // Background already
    }

    const colorMatch = (idx) => {
      const dr = Math.abs(data[idx] - targetR);
      const dg = Math.abs(data[idx + 1] - targetG);
      const db = Math.abs(data[idx + 2] - targetB);
      const da = Math.abs(data[idx + 3] - targetA);
      return (dr + dg + db + da) < 95; // Color tolerance threshold
    };

    const queue = [[Math.floor(startX), Math.floor(startY)]];
    const visited = new Uint8Array(width * height);

    while (queue.length > 0) {
      const [cx, cy] = queue.pop();
      const idx = (cy * width + cx) * 4;
      const vIdx = cy * width + cx;

      if (cx < 0 || cx >= width || cy < 0 || cy >= height || visited[vIdx]) continue;
      visited[vIdx] = 1;

      if (colorMatch(idx)) {
        data[idx] = fillR;
        data[idx + 1] = fillG;
        data[idx + 2] = fillB;
        data[idx + 3] = fillA;

        queue.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
      }
    }

    ctx.putImageData(imgData, 0, 0);
    setDrawingHasStrokes(true);
  };

  const drawStar = (ctx, cx, cy, spikes, outerRadius, innerRadius) => {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.stroke();
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const { x, y } = getCoordinates(e);

    if (tool === 'magic') {
      applyMagicEraser(x, y);
      return;
    }

    setIsDrawing(true);
    setDrawingHasStrokes(true);
    setStartPos({ x, y });

    // Save snapshot for real-time shapes dragging
    setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));

    if (tool === 'pen' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const { x, y } = getCoordinates(e);

    ctx.strokeStyle = tool === 'eraser' ? '#fefae0' : drawColor;
    ctx.lineWidth = tool === 'eraser' ? eraserSize : penSize;

    if (tool === 'pen' || tool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (snapshot) {
      // Shapes real-time preview
      ctx.putImageData(snapshot, 0, 0);
      ctx.beginPath();

      if (tool === 'rect') {
        ctx.strokeRect(startPos.x, startPos.y, x - startPos.x, y - startPos.y);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2));
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (tool === 'line') {
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (tool === 'star') {
        const radius = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2));
        drawStar(ctx, startPos.x, startPos.y, 5, radius, radius / 2);
      }
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setSnapshot(null);
  };

  const handleOpenAdd = () => {
    setEditingNote(null);
    setModalMode('text');
    setNoteTitle('');
    setNoteContent('');
    setDrawingHasStrokes(false);
    setTool('pen');
    setNoteTag('General');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (note) => {
    setEditingNote(note);
    setNoteTitle(note.title || '');
    setNoteContent(note.content || note.text || '');
    setModalMode(note.drawing ? 'draw' : 'text');
    setTool('pen');
    setDrawingHasStrokes(!!note.drawing);
    setNoteTag(note.tag || 'General');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let finalDrawing = '';
    if (modalMode === 'draw') {
      if (canvasRef.current && drawingHasStrokes) {
        finalDrawing = canvasRef.current.toDataURL('image/png');
      } else if (editingNote?.drawing) {
        finalDrawing = editingNote.drawing;
      }
    }

    if (!noteTitle.trim() && !noteContent.trim() && !finalDrawing) return;

    const payload = {
      title: noteTitle.trim() || (finalDrawing ? 'Sketch' : 'Untitled Memo'),
      content: noteContent.trim(),
      drawing: finalDrawing,
      tag: noteTag
    };

    if (editingNote) {
      updateQuickNote(editingNote.id, payload.title, payload.content, payload.tag, payload.drawing);
    } else {
      addQuickNote(payload.title, payload.content, payload.tag, payload.drawing);
    }
    setIsModalOpen(false);
  };

  const handleCopy = async (note) => {
    try {
      if (note.drawing) {
        const res = await fetch(note.drawing);
        const blob = await res.blob();
        if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopiedId(note.id);
          setTimeout(() => setCopiedId(null), 1800);
          return;
        }
      }
      const textToCopy = `${note.title || ''}\n\n${note.content || note.text || ''}`.trim();
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(note.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-start overflow-hidden bg-[#160d07] select-none px-2 sm:px-4 pb-2">
      
      {/* Top Control Bar */}
      <div className="z-30 w-full max-w-4xl bg-stone-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-950/70 flex items-center justify-between gap-2 shadow-xl mb-2 shrink-0">
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 px-2.5 py-1.5 rounded-lg text-xs font-bold transition shadow active:scale-95 whitespace-nowrap"
          >
            <Plus size={14} /> New Note
          </button>

          <div className="relative flex items-center">
            <Search size={13} className="absolute left-2.5 text-stone-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 pr-2.5 py-1 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 placeholder-stone-500 outline-none focus:border-amber-500 transition w-28 sm:w-44"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto max-w-[50%] sm:max-w-none py-0.5 no-scrollbar">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition whitespace-nowrap ${
                selectedTag === tag 
                  ? 'bg-amber-500 text-stone-950 shadow' 
                  : 'bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-700/60'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Desk Memo Pad Paper Container */}
      <div className="relative w-full max-w-4xl flex-1 flex flex-col min-h-0 bg-[#fffbe8] border-[8px] sm:border-[12px] border-[#2c1a0e] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(0,0,0,0.06)] overflow-hidden">
        
        <div className="h-7 bg-[#2f1b0f] border-b border-[#4d2f1d] px-4 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-black/40 border border-white/10" />
            <span className="w-2 h-2 rounded-full bg-black/40 border border-white/10" />
            <span className="w-2 h-2 rounded-full bg-black/40 border border-white/10" />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-amber-200/80 uppercase font-bold">DESK MEMO PAD</span>
          <span className="text-[10px] font-bold text-amber-400">{filteredNotes.length} Notes</span>
        </div>

        <div 
          className="relative flex-1 w-full p-3 sm:p-5 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-amber-950/20 [&::-webkit-scrollbar-thumb]:rounded-full"
          style={{
            backgroundImage: 'linear-gradient(rgba(215, 195, 140, 0.28) 1px, transparent 1px)',
            backgroundSize: '100% 28px',
            backgroundPosition: '0 8px'
          }}
        >
          <div className="pointer-events-none absolute top-0 bottom-0 left-8 sm:left-12 w-[1.5px] bg-red-400/35 z-0" />

          {filteredNotes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-500 z-10 relative">
              <FileText size={36} className="mb-2 opacity-40 text-stone-700" />
              <p className="text-xs font-bold uppercase tracking-wider text-stone-600">No notes found</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Click "+ New Note" to write or sketch.</p>
            </div>
          ) : (
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredNotes.map((note) => {
                const textBody = note.content || note.text || '';
                return (
                  <div
                    key={note.id}
                    className={`relative p-3 rounded-xl border flex flex-col justify-between transition-all hover:shadow-md bg-[#ffffff]/95 backdrop-blur-xs ${
                      note.pinned 
                        ? 'border-amber-500/90 shadow-[0_4px_14px_rgba(245,158,11,0.2)] ring-1 ring-amber-500/40' 
                        : 'border-stone-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-1 border-b border-stone-200">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                        {note.tag || 'General'}
                      </span>

                      <div className="flex items-center gap-1 text-stone-500">
                        <button
                          onClick={() => togglePinQuickNote(note.id)}
                          title={note.pinned ? 'Unpin' : 'Pin to top'}
                          className={`p-1 rounded hover:bg-stone-100 transition ${note.pinned ? 'text-amber-600 font-bold' : ''}`}
                        >
                          <Pin size={13} className={note.pinned ? 'fill-amber-500 text-amber-600' : ''} />
                        </button>
                        
                        <button
                          onClick={() => handleCopy(note)}
                          title={note.drawing ? "Copy sketch as Image" : "Copy text"}
                          className="p-1 rounded hover:bg-stone-100 transition"
                        >
                          {copiedId === note.id ? (
                            <Check size={13} className="text-emerald-600 font-bold" />
                          ) : (
                            <Copy size={13} />
                          )}
                        </button>

                        <button
                          onClick={() => handleOpenEdit(note)}
                          title="Edit note"
                          className="p-1 rounded hover:bg-stone-100 transition"
                        >
                          <Edit3 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="my-2 flex-1">
                      <h4 className="text-xs font-black text-stone-900 tracking-tight leading-snug break-words mb-1">
                        {note.title || 'Untitled'}
                      </h4>

                      {note.drawing ? (
                        <div className="w-full h-32 border border-stone-300 rounded-lg overflow-hidden bg-[#fefae0] flex items-center justify-center my-1.5 shadow-inner">
                          <img 
                            src={note.drawing} 
                            alt="sketch" 
                            className="w-full h-full object-contain pointer-events-none" 
                          />
                        </div>
                      ) : null}

                      {textBody ? (
                        <p className="text-[11px] leading-relaxed text-stone-700 font-medium whitespace-pre-wrap break-words max-h-24 overflow-y-auto pr-1">
                          {textBody}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-stone-200 mt-1">
                      <span className="text-[9px] font-semibold text-stone-400">
                        {note.updatedAt || 'Recently'}
                      </span>

                      <button
                        onClick={() => deleteQuickNote(note.id)}
                        title="Delete note"
                        className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* POPUP MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-stone-900 border border-amber-900/60 rounded-2xl p-4 shadow-2xl text-stone-200"
            >
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider">
                  {editingNote ? 'Edit Memo' : 'New Note'}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Mode Switcher */}
              <div className="flex bg-stone-950 p-1 rounded-xl mt-3 border border-stone-800">
                <button
                  type="button"
                  onClick={() => setModalMode('text')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition ${
                    modalMode === 'text' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <FileText size={14} /> Text Note
                </button>
                <button
                  type="button"
                  onClick={() => setModalMode('draw')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition ${
                    modalMode === 'draw' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <PenTool size={14} /> Draw & Objects
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-3 space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Short Title..."
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className="w-full mt-1 px-2.5 py-1.5 bg-stone-950 border border-stone-700 rounded-lg text-xs text-stone-100 outline-none focus:border-amber-400 transition"
                  />
                </div>

                {modalMode === 'text' ? (
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Content</label>
                    <textarea
                      rows={4}
                      placeholder="Write details, keys, or scratch notes..."
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      className="w-full mt-1 px-2.5 py-1.5 bg-stone-950 border border-stone-700 rounded-lg text-xs text-stone-100 outline-none focus:border-amber-400 transition resize-none"
                    />
                  </div>
                ) : (
                  /* ADVANCED CANVAS CONTROLS (PENCIL + MAGIC ERASER + OBJECTS) */
                  <div className="space-y-2">
                    
                    {/* Compact Multi-Tool Selector */}
                    <div className="flex flex-wrap items-center justify-between gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800">
                      
                      {/* Drawing & Erasers Group */}
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => setTool('pen')}
                          title="Pen"
                          className={`p-1.5 rounded-lg transition ${
                            tool === 'pen' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          <PenTool size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setTool('eraser')}
                          title="Standard Eraser"
                          className={`p-1.5 rounded-lg transition ${
                            tool === 'eraser' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          <Eraser size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setTool('magic')}
                          title="Magic Eraser (Tap shape to erase completely)"
                          className={`p-1.5 rounded-lg transition ${
                            tool === 'magic' ? 'bg-amber-500 text-stone-950 shadow ring-1 ring-amber-300' : 'text-amber-400 hover:text-amber-300'
                          }`}
                        >
                          <Wand2 size={13} />
                        </button>
                      </div>

                      {/* Objects / Shapes Group */}
                      <div className="flex items-center gap-0.5 border-l border-stone-800 pl-1">
                        <button
                          type="button"
                          onClick={() => setTool('rect')}
                          title="Rectangle"
                          className={`p-1.5 rounded-lg transition ${
                            tool === 'rect' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          <Square size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setTool('circle')}
                          title="Circle"
                          className={`p-1.5 rounded-lg transition ${
                            tool === 'circle' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          <Circle size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setTool('line')}
                          title="Line"
                          className={`p-1.5 rounded-lg transition ${
                            tool === 'line' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          <Minus size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setTool('star')}
                          title="Star Object"
                          className={`p-1.5 rounded-lg transition ${
                            tool === 'star' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          <Star size={13} />
                        </button>
                      </div>

                      {/* Colors Group */}
                      <div className="flex items-center gap-1 border-l border-stone-800 pl-1">
                        {presetColors.map((col) => (
                          <button
                            key={col}
                            type="button"
                            onClick={() => {
                              setDrawColor(col);
                              if (tool === 'eraser' || tool === 'magic') setTool('pen');
                            }}
                            style={{ backgroundColor: col }}
                            className={`w-3.5 h-3.5 rounded-full border border-white/20 transition-transform ${
                              drawColor === col && tool !== 'eraser' && tool !== 'magic' ? 'ring-2 ring-amber-400 scale-125' : 'opacity-80'
                            }`}
                          />
                        ))}

                        <div className="relative flex items-center">
                          <button
                            type="button"
                            onClick={() => colorInputRef.current?.click()}
                            title="Choose custom color"
                            style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }}
                            className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm active:scale-95"
                          />
                          <input
                            ref={colorInputRef}
                            type="color"
                            value={drawColor}
                            onChange={(e) => {
                              setDrawColor(e.target.value);
                              if (tool === 'eraser' || tool === 'magic') setTool('pen');
                            }}
                            className="absolute opacity-0 pointer-events-none w-0 h-0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Tool Mode Indicator & Size Slider */}
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[10px] text-stone-400 font-semibold w-24 truncate">
                        {tool === 'magic' ? 'Magic: Tap color' : tool === 'eraser' ? `Eraser: ${eraserSize}px` : `Size: ${penSize}px`}
                      </span>
                      {tool !== 'magic' && (
                        <input
                          type="range"
                          min={tool === 'eraser' ? '6' : '1'}
                          max={tool === 'eraser' ? '36' : '14'}
                          value={tool === 'eraser' ? eraserSize : penSize}
                          onChange={(e) => tool === 'eraser' ? setEraserSize(Number(e.target.value)) : setPenSize(Number(e.target.value))}
                          className="flex-1 accent-amber-500 h-1 bg-stone-800 rounded-lg cursor-pointer"
                        />
                      )}
                    </div>

                    {/* Canvas Area with Touch Prevention */}
                    <div className="w-full h-44 border border-stone-700 rounded-xl overflow-hidden bg-[#fefae0] cursor-crosshair touch-none shadow-inner">
                      <canvas
                        ref={canvasRef}
                        width={330}
                        height={176}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full h-full block"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Category Tag</label>
                  <div className="flex gap-1.5 mt-1">
                    {['General', 'Work', 'Ideas', 'Personal'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setNoteTag(t)}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold transition ${
                          noteTag === t ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-300'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-1.5 text-xs font-semibold bg-stone-800 hover:bg-stone-700 rounded-lg transition text-stone-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg transition shadow"
                  >
                    {editingNote ? 'Save Memo' : 'Add Memo'}
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