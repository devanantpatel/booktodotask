import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Check, Trash2, Edit3, X, CheckSquare, Square, 
  LayoutGrid, Hand, Sparkles, ChevronDown, ListChecks, FileText 
} from 'lucide-react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';

export default function CorkBoard() {
  const { 
    todos, addCard, editCard, toggleTodo, toggleChecklistItem, 
    deleteTodo, toggleSelectTodo, selectAllTodos, deleteSelectedTodos, 
    updateTodoPosition, isAutoArranged, toggleAutoArrange 
  } = useWorkspaceStore();

  const boardRef = useRef(null);
  const selectMenuRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [isSelectMenuOpen, setIsSelectMenuOpen] = useState(false);

  // Form states
  const [cardType, setCardType] = useState('checklist');
  const [title, setTitle] = useState('');
  const [noteText, setNoteText] = useState('');
  const [checklistItems, setChecklistItems] = useState(['']);
  const [selectedColor, setSelectedColor] = useState('yellow');

  useEffect(() => {
    function handleClickOutside(event) {
      if (selectMenuRef.current && !selectMenuRef.current.contains(event.target)) {
        setIsSelectMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const colorStyles = {
    yellow: 'bg-[#fff582] text-amber-950 border-[#ecd36b] shadow-[0_4px_12px_rgba(40,20,5,0.35)]',
    white: 'bg-[#f8f9fa] text-stone-900 border-[#d2d6dc] shadow-[0_4px_12px_rgba(40,20,5,0.35)]',
    green: 'bg-[#315f4a] text-[#f0faf4] border-[#1d4030] shadow-[0_4px_14px_rgba(20,10,5,0.45)]',
    pink: 'bg-[#ff9cbd] text-rose-950 border-[#ea82a4] shadow-[0_4px_12px_rgba(40,20,5,0.35)]',
  };

  const handleOpenAdd = () => {
    setEditingCard(null);
    setCardType('checklist');
    setTitle('');
    setNoteText('');
    setChecklistItems(['']);
    setSelectedColor('yellow');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (card) => {
    setEditingCard(card);
    setCardType(card.type || (card.checklist?.length > 0 ? 'checklist' : 'note'));
    setTitle(card.title || '');
    setNoteText(card.text || '');
    setChecklistItems(card.checklist?.length > 0 ? card.checklist.map(i => i.text) : ['']);
    setSelectedColor(card.color || 'yellow');
    setIsModalOpen(true);
  };

  const handleAddChecklistInput = () => {
    setChecklistItems([...checklistItems, '']);
  };

  const handleChecklistChange = (index, value) => {
    const updated = [...checklistItems];
    updated[index] = value;
    setChecklistItems(updated);
  };

  const handleRemoveChecklistInput = (index) => {
    if (checklistItems.length <= 1) return;
    setChecklistItems(checklistItems.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedChecklist = checklistItems
      .filter(t => t.trim() !== '')
      .map((t, idx) => ({ id: `chk_${Date.now()}_${idx}`, text: t.trim(), done: false }));

    if (editingCard) {
      editCard(editingCard.id, {
        title,
        type: cardType,
        text: noteText,
        checklist: cardType === 'checklist' ? formattedChecklist : [],
        color: selectedColor
      });
    } else {
      addCard({
        title,
        type: cardType,
        text: noteText,
        checklist: cardType === 'checklist' ? formattedChecklist : [],
        color: selectedColor
      });
    }
    setIsModalOpen(false);
  };

  const allSelected = todos.length > 0 && todos.every((t) => t.selected);
  const selectedCount = todos.filter((t) => t.selected).length;

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#180f08] select-none p-1.5 sm:p-3">
      
      {/* Top Glass Control Bar */}
      <div className="z-30 w-full bg-stone-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-950/70 flex items-center justify-between gap-2 shadow-xl mb-1.5 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow active:scale-95 whitespace-nowrap"
          >
            <Plus size={14} /> Add Card
          </button>

          <button
            onClick={toggleAutoArrange}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition whitespace-nowrap ${
              isAutoArranged 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
            }`}
          >
            {isAutoArranged ? <LayoutGrid size={13} /> : <Hand size={13} />}
            <span>{isAutoArranged ? 'Grid View' : 'Pin Board'}</span>
          </button>
        </div>

        {/* Dropdown Select Controls */}
        <div className="flex items-center gap-2" ref={selectMenuRef}>
          <div className="relative">
            <button
              onClick={() => setIsSelectMenuOpen(!isSelectMenuOpen)}
              className="flex items-center gap-1 bg-stone-800 hover:bg-stone-700 text-stone-200 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-stone-700 transition"
            >
              <span>Select {selectedCount > 0 ? `(${selectedCount})` : ''}</span>
              <ChevronDown size={13} className={`transition-transform ${isSelectMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isSelectMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-48 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl p-2 z-50 text-stone-200 flex flex-col gap-1 max-h-60 overflow-y-auto">
                <button
                  onClick={() => selectAllTodos(!allSelected)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-stone-800 text-xs font-bold border-b border-stone-800 pb-2 text-amber-300 w-full text-left"
                >
                  {allSelected ? <CheckSquare size={14} /> : <Square size={14} />}
                  <span>Select All Cards</span>
                </button>

                {todos.length === 0 ? (
                  <p className="text-[11px] text-stone-500 px-2 py-1">No cards on board</p>
                ) : (
                  todos.map((todo) => (
                    <button
                      key={todo.id}
                      onClick={() => toggleSelectTodo(todo.id)}
                      className="flex items-center justify-between px-2 py-1 rounded hover:bg-stone-800 text-xs w-full text-left"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {todo.selected ? <CheckSquare size={13} className="text-amber-400" /> : <Square size={13} />}
                        <span className="font-bold text-stone-300">#{todo.number}</span>
                        <span className="truncate text-stone-400 text-[11px]">
                          {todo.title || (todo.checklist?.[0]?.text) || todo.text || 'Card'}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {selectedCount > 0 && (
            <button
              onClick={deleteSelectedTodos}
              className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition shadow active:scale-95"
            >
              <Trash2 size={13} />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Realistic Movie Corkboard Wall Frame */}
      <div 
        ref={boardRef}
        className="relative flex-1 w-full h-full rounded-2xl overflow-hidden border-[10px] sm:border-[14px] border-[#8c592f] shadow-[inset_0_4px_25px_rgba(0,0,0,0.85),0_10px_25px_rgba(0,0,0,0.9)]"
        style={{
          backgroundColor: '#9a6438',
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(20, 10, 5, 0.1) 0%, rgba(10, 5, 2, 0.6) 100%),
            radial-gradient(rgba(70, 35, 12, 0.45) 15%, transparent 16%),
            radial-gradient(rgba(130, 75, 30, 0.4) 15%, transparent 16%)
          `,
          backgroundSize: '100% 100%, 8px 8px, 12px 12px',
          backgroundPosition: '0 0, 0 0, 4px 4px'
        }}
      >
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_35px_rgba(0,0,0,0.7)] z-10" />

        {todos.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-amber-200/50 z-0">
            <Sparkles size={36} className="mb-2 opacity-50" />
            <p className="text-xs font-semibold uppercase tracking-wider">Empty Board. Tap "+ Add Card" to Pin.</p>
          </div>
        ) : isAutoArranged ? (
          /* AUTO GRID: Items start without vertical stretching */
          <div className="relative z-20 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-start gap-2.5 p-2.5 overflow-y-auto h-full pb-16">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className={`relative w-full h-auto p-2.5 rounded-lg border flex flex-col justify-between transition-transform ${colorStyles[todo.color || 'yellow']}`}
              >
                {/* 3D Pushpin Header */}
                <div className="flex items-center justify-between pb-1 border-b border-black/10">
                  <span className="text-[10px] font-black bg-black/10 px-1.5 py-0.5 rounded">
                    #{todo.number}
                  </span>

                  <div className="relative flex items-center justify-center -mt-2 transform -rotate-12">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-stone-500 via-stone-200 to-white shadow-[1px_2px_4px_rgba(0,0,0,0.5)] border border-stone-600 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenEdit(todo)}
                    className="p-1 rounded opacity-75 hover:opacity-100 hover:bg-black/10 transition"
                  >
                    <Edit3 size={12} />
                  </button>
                </div>

                {/* Card Title */}
                {todo.title && (
                  <div className="mt-1 pb-1 border-b border-black/5 text-center">
                    <h4 className={`text-xs font-black tracking-tight leading-snug break-words ${todo.completed ? 'line-through opacity-50' : ''}`}>
                      {todo.title}
                    </h4>
                  </div>
                )}

                {/* Body Content */}
                <div className="my-1.5 max-h-32 overflow-y-auto">
                  {todo.type === 'checklist' && todo.checklist?.length > 0 ? (
                    <div className="space-y-1">
                      {todo.checklist.map((item) => (
                        <div 
                          key={item.id}
                          onClick={() => toggleChecklistItem(todo.id, item.id)}
                          className="flex items-start gap-1.5 cursor-pointer text-[11px] leading-tight select-none py-0.5 hover:bg-black/5 px-1 rounded transition"
                        >
                          <input 
                            type="checkbox" 
                            checked={item.done} 
                            readOnly 
                            className="mt-0.5 h-3 w-3 accent-stone-900 rounded cursor-pointer"
                          />
                          <span className={`break-words flex-1 ${item.done ? 'line-through opacity-45' : 'font-medium'}`}>
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`text-[11px] leading-relaxed font-medium break-words px-1 whitespace-pre-wrap ${todo.completed ? 'line-through opacity-45' : ''}`}>
                      {todo.text}
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-1 border-t border-black/10 mt-1">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded transition ${
                      todo.completed ? 'bg-emerald-700 text-white' : 'bg-black/10 hover:bg-black/20'
                    }`}
                  >
                    <Check size={11} />
                    {todo.completed ? 'Done' : 'Mark'}
                  </button>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="p-1 opacity-70 hover:opacity-100 hover:text-red-700 transition"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* MANUAL PIN BOARD: Zero Magnetic Jump + Pixel Clamp */
          <div className="relative z-20 w-full h-full overflow-hidden">
            {todos.map((todo) => (
              <motion.div
                key={todo.id}
                drag
                dragConstraints={boardRef}
                dragElastic={0}
                dragMomentum={false}
                dragTransition={{ power: 0, timeConstant: 0 }}
                onDragEnd={(_, info) => {
                  if (!boardRef.current) return;
                  const bounds = boardRef.current.getBoundingClientRect();
                  const cardWidth = 175;
                  const cardHeight = 145;
                  
                  // Strict boundary clamping
                  const targetX = todo.x + info.offset.x;
                  const targetY = todo.y + info.offset.y;
                  const minX = 14;
                  const minY = 14;
                  const maxX = Math.max(minX, bounds.width - cardWidth - 14);
                  const maxY = Math.max(minY, bounds.height - cardHeight - 14);

                  const clampedX = Math.max(minX, Math.min(maxX, targetX));
                  const clampedY = Math.max(minY, Math.min(maxY, targetY));

                  updateTodoPosition(todo.id, clampedX, clampedY);
                }}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, rotate: todo.rotation }}
                className={`absolute w-44 p-2.5 rounded-lg border cursor-grab active:cursor-grabbing flex flex-col justify-between ${colorStyles[todo.color || 'yellow']}`}
                style={{ left: `${todo.x}px`, top: `${todo.y}px` }}
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-1 border-b border-black/10">
                  <span className="text-[10px] font-black bg-black/10 px-1 rounded">
                    #{todo.number}
                  </span>

                  <div className="relative flex items-center justify-center -mt-2 transform -rotate-12 pointer-events-none">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-stone-500 via-stone-200 to-white shadow-[1px_2px_4px_rgba(0,0,0,0.5)] border border-stone-600 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenEdit(todo)}
                    className="p-0.5 rounded opacity-75 hover:opacity-100 hover:bg-black/10 transition"
                  >
                    <Edit3 size={12} />
                  </button>
                </div>

                {/* Title */}
                {todo.title && (
                  <div className="mt-1 pb-1 border-b border-black/5 text-center">
                    <h4 className={`text-xs font-black tracking-tight leading-snug break-words ${todo.completed ? 'line-through opacity-50' : ''}`}>
                      {todo.title}
                    </h4>
                  </div>
                )}

                {/* Content */}
                <div className="my-1.5 max-h-28 overflow-y-auto">
                  {todo.type === 'checklist' && todo.checklist?.length > 0 ? (
                    <div className="space-y-1">
                      {todo.checklist.map((item) => (
                        <div 
                          key={item.id}
                          onClick={() => toggleChecklistItem(todo.id, item.id)}
                          className="flex items-start gap-1 cursor-pointer text-[10px] leading-tight select-none py-0.5 px-0.5 rounded hover:bg-black/5 transition"
                        >
                          <input 
                            type="checkbox" 
                            checked={item.done} 
                            readOnly 
                            className="mt-0.5 h-2.5 w-2.5 accent-stone-900 rounded cursor-pointer"
                          />
                          <span className={`break-words flex-1 ${item.done ? 'line-through opacity-45' : 'font-medium'}`}>
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`text-[10px] leading-relaxed font-medium break-words px-1 whitespace-pre-wrap ${todo.completed ? 'line-through opacity-45' : ''}`}>
                      {todo.text}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-1 border-t border-black/10 mt-1">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded transition ${
                      todo.completed ? 'bg-emerald-700 text-white' : 'bg-black/10 hover:bg-black/20'
                    }`}
                  >
                    <Check size={10} />
                    {todo.completed ? 'Done' : 'Mark'}
                  </button>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="p-1 opacity-70 hover:opacity-100 hover:text-red-700 transition"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* POPUP MODAL (Add & Edit) */}
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
                  {editingCard ? `Edit Card #${editingCard.number}` : 'Pin New Card'}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Mode Toggle */}
              <div className="flex bg-stone-950 p-1 rounded-xl mt-3 border border-stone-800">
                <button
                  type="button"
                  onClick={() => setCardType('checklist')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition ${
                    cardType === 'checklist' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <ListChecks size={14} /> Checklist
                </button>
                <button
                  type="button"
                  onClick={() => setCardType('note')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition ${
                    cardType === 'note' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <FileText size={14} /> Plain Note
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-3 space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Card Title <span className="text-stone-500 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Investigation Notes"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full mt-1 px-2.5 py-1.5 bg-stone-950 border border-stone-700 rounded-lg text-xs text-stone-100 outline-none focus:border-amber-400 transition"
                  />
                </div>

                {cardType === 'checklist' ? (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 flex justify-between">
                      <span>Tasks</span>
                      <button
                        type="button"
                        onClick={handleAddChecklistInput}
                        className="text-amber-400 text-[10px] hover:underline flex items-center gap-0.5"
                      >
                        <Plus size={11} /> Add Item
                      </button>
                    </label>
                    <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                      {checklistItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder={`Task #${idx + 1}`}
                            value={item}
                            onChange={(e) => handleChecklistChange(idx, e.target.value)}
                            className="flex-1 px-2 py-1 bg-stone-950 border border-stone-700 rounded-lg text-xs text-stone-100 outline-none focus:border-amber-400"
                          />
                          {checklistItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveChecklistInput(idx)}
                              className="text-stone-500 hover:text-rose-400 p-1"
                            >
                              <X size={13} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Note Details
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Write your note here..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className="w-full mt-1 px-2.5 py-1.5 bg-stone-950 border border-stone-700 rounded-lg text-xs text-stone-100 outline-none focus:border-amber-400 transition resize-none"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1 block">
                    Card Paper Color
                  </label>
                  <div className="flex gap-2">
                    {[
                      { key: 'yellow', bg: '#fff582' },
                      { key: 'white', bg: '#f8f9fa' },
                      { key: 'green', bg: '#315f4a' },
                      { key: 'pink', bg: '#ff9cbd' },
                    ].map((col) => (
                      <button
                        key={col.key}
                        type="button"
                        onClick={() => setSelectedColor(col.key)}
                        style={{ backgroundColor: col.bg }}
                        className={`w-6 h-6 rounded-full border border-black/30 transition-transform ${
                          selectedColor === col.key ? 'scale-110 ring-2 ring-amber-400 shadow' : 'opacity-70'
                        }`}
                      />
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
                    {editingCard ? 'Save Card' : 'Pin to Board'}
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