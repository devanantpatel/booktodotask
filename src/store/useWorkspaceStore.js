import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWorkspaceStore = create(
  persist(
    (set, get) => ({
      activeTab: 'notes',
      setActiveTab: (tab) => set({ activeTab: tab }),

      // --- WALL TODOS ---
      isAutoArranged: false,
      toggleAutoArrange: () => set((state) => ({ isAutoArranged: !state.isAutoArranged })),

      todos: [
        { 
          id: '1', 
          number: 1, 
          title: 'Detective Clues', 
          type: 'checklist',
          checklist: [
            { id: 'c1', text: 'Check the lab alibi', done: false },
            { id: 'c2', text: 'Cross-examine timestamps', done: true },
          ],
          text: '',
          completed: false, 
          selected: false,
          x: 20, 
          y: 20, 
          color: 'yellow', 
          rotation: -1.5 
        }
      ],

      addCard: ({ title = '', type = 'note', text = '', checklist = [], color = 'yellow' }) => set((state) => {
        const nextNum = state.todos.length > 0 ? Math.max(...state.todos.map(t => t.number || 0)) + 1 : 1;
        const newCard = {
          id: Date.now().toString(),
          number: nextNum,
          title: title.trim(),
          type,
          text: text.trim(),
          checklist: checklist.filter(item => item.text.trim() !== ''),
          completed: false,
          selected: false,
          x: 20 + (state.todos.length % 3) * 25,
          y: 20 + (state.todos.length % 4) * 25,
          color,
          rotation: (Math.random() - 0.5) * 5
        };
        return { todos: [...state.todos, newCard] };
      }),

      editCard: (id, { title, type, text, checklist, color }) => set((state) => ({
        todos: state.todos.map((t) => 
          t.id === id ? { 
            ...t, 
            title: title.trim(), 
            type, 
            text: text.trim(), 
            checklist: checklist.filter(item => item.text.trim() !== ''),
            color: color || t.color 
          } : t
        )
      })),

      toggleChecklistItem: (cardId, itemId) => set((state) => ({
        todos: state.todos.map((card) => {
          if (card.id !== cardId) return card;
          const updatedChecklist = card.checklist.map((item) => 
            item.id === itemId ? { ...item, done: !item.done } : item
          );
          const allDone = updatedChecklist.length > 0 && updatedChecklist.every(i => i.done);
          return { ...card, checklist: updatedChecklist, completed: allDone };
        })
      })),

      toggleTodo: (id) => set((state) => ({
        todos: state.todos.map((t) => {
          if (t.id !== id) return t;
          const newStatus = !t.completed;
          return {
            ...t,
            completed: newStatus,
            checklist: t.checklist.map(i => ({ ...i, done: newStatus }))
          };
        })
      })),

      deleteTodo: (id) => set((state) => ({
        todos: state.todos.filter((t) => t.id !== id)
      })),

      toggleSelectTodo: (id) => set((state) => ({
        todos: state.todos.map((t) => t.id === id ? { ...t, selected: !t.selected } : t)
      })),

      selectAllTodos: (shouldSelect) => set((state) => ({
        todos: state.todos.map((t) => ({ ...t, selected: shouldSelect }))
      })),

      deleteSelectedTodos: () => set((state) => ({
        todos: state.todos.filter((t) => !t.selected)
      })),

      updateTodoPosition: (id, x, y) => set((state) => ({
        todos: state.todos.map((t) => t.id === id ? { ...t, x, y } : t)
      })),

      // --- NOTEBOOK ---
      notebook: {
        cover: 'obsidian',
        hasPin: false,
        pin: '',
        isLocked: false,
        currentPage: 0,
        pages: [
          { title: 'Project Overview', content: 'Building a 3D personal workspace desk.', date: 'Nov 1, 2026' }
        ]
      },
      setNotebookCover: (cover) => set((state) => ({ notebook: { ...state.notebook, cover } })),
      setNotebookPin: (pin) => set((state) => ({
        notebook: { ...state.notebook, pin, hasPin: !!pin, isLocked: !!pin }
      })),
      unlockNotebook: (enteredPin) => {
        const { notebook } = get();
        if (notebook.pin === enteredPin) {
          set({ notebook: { ...notebook, isLocked: false } });
          return true;
        }
        return false;
      },
      lockNotebook: () => set((state) => ({ notebook: { ...state.notebook, isLocked: true } })),
      nextPage: () => set((state) => ({
        notebook: { ...state.notebook, currentPage: Math.min(state.notebook.currentPage + (window.innerWidth >= 768 ? 2 : 1), state.notebook.pages.length - 1) }
      })),
      prevPage: () => set((state) => ({
        notebook: { ...state.notebook, currentPage: Math.max(state.notebook.currentPage - (window.innerWidth >= 768 ? 2 : 1), 0) }
      })),
      addNewPage: () => set((state) => {
        const newPage = { title: `Entry #${state.notebook.pages.length + 1}`, content: '', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) };
        return {
          notebook: {
            ...state.notebook,
            pages: [...state.notebook.pages, newPage],
            currentPage: state.notebook.pages.length
          }
        };
      }),
      updateCurrentPage: (title, content) => set((state) => {
        const pages = [...state.notebook.pages];
        if (pages[state.notebook.currentPage]) {
          pages[state.notebook.currentPage] = {
            ...pages[state.notebook.currentPage],
            title,
            content
          };
        }
        return { notebook: { ...state.notebook, pages } };
      }),
      deleteCurrentPage: () => set((state) => {
        if (state.notebook.pages.length <= 1) return state;
        const pages = state.notebook.pages.filter((_, idx) => idx !== state.notebook.currentPage);
        return {
          notebook: {
            ...state.notebook,
            pages,
            currentPage: Math.max(0, state.notebook.currentPage - 1)
          }
        };
      }),

      // --- QUICK NOTES WITH DRAWING (DATA SAVED DIRECTLY) ---
      notes: [
        {
          id: 'note_1',
          title: 'Quick Scratchpad',
          content: 'Keep snippets, passwords, and instant thoughts here.',
          drawing: '',
          tag: 'Work',
          pinned: true,
          updatedAt: 'Nov 1, 2026'
        }
      ],
      addQuickNote: (title, content, tag = 'General', drawing = '') => set((state) => ({
        notes: [
          {
            id: `note_${Date.now()}`,
            title: title.trim() || (drawing ? 'Handwritten Sketch' : 'Untitled Memo'),
            content: content.trim(),
            drawing: drawing || '',
            tag,
            pinned: false,
            updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          },
          ...state.notes
        ]
      })),
      updateQuickNote: (id, title, content, tag, drawing = '') => set((state) => ({
        notes: state.notes.map((n) => 
          n.id === id 
            ? { 
                ...n, 
                title: title.trim() || (drawing ? 'Handwritten Sketch' : 'Untitled Memo'), 
                content: content.trim(), 
                drawing: drawing !== undefined ? drawing : n.drawing,
                tag, 
                updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
              } 
            : n
        )
      })),
      togglePinQuickNote: (id) => set((state) => ({
        notes: state.notes.map((n) => n.id === id ? { ...n, pinned: !n.pinned } : n)
      })),
      deleteQuickNote: (id) => set((state) => ({
        notes: state.notes.filter((n) => n.id !== id)
      })),

      // --- CLOUD SYNC STATE ---
      isGoogleConnected: false,
      userProfile: null,
      isSyncing: false,
      lastSyncedAt: null,
      setGoogleConnected: (status, profile = null) => set({ isGoogleConnected: status, userProfile: profile }),
      setSyncing: (status) => set({ isSyncing: status }),
      setLastSyncedAt: (timestamp) => set({ lastSyncedAt: timestamp })
    }),
    {
      name: 'booktodotask_storage',
    }
  )
);