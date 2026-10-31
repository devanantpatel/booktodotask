import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWorkspaceStore = create(
  persist(
    (set, get) => ({
      activeTab: 'wall', // 'wall' | 'notebook' | 'notes'
      setActiveTab: (tab) => set({ activeTab: tab }),

      // ==========================================
      // 1. WALL TODOS / CARDS MODULE
      // ==========================================
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
        },
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

      // ==========================================
      // 2. NOTEBOOK MODULE
      // ==========================================
      notebook: {
        cover: 'vintage-leather', // 'vintage-leather' | 'obsidian' | 'emerald-velvet' | 'royal-blue'
        hasPin: false,
        pin: '',
        isLocked: false,
        currentPage: 0,
        pages: [
          {
            id: 'page-1',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            title: 'My Secret Journal',
            content: 'Aaj se meri nayi journey shuru hui hai. Yahan mai apne ideas aur personal thoughts note karunga...'
          }
        ]
      },

      setNotebookCover: (cover) => set((state) => ({
        notebook: { ...state.notebook, cover }
      })),

      setNotebookPin: (pin) => set((state) => ({
        notebook: { ...state.notebook, pin, hasPin: Boolean(pin), isLocked: Boolean(pin) }
      })),

      unlockNotebook: (enteredPin) => {
        const { notebook } = get();
        if (!notebook.hasPin || notebook.pin === enteredPin) {
          set({ notebook: { ...notebook, isLocked: false } });
          return true;
        }
        return false;
      },

      lockNotebook: () => set((state) => ({
        notebook: { ...state.notebook, isLocked: state.notebook.hasPin }
      })),

      nextPage: () => set((state) => {
        const next = state.notebook.currentPage + 1;
        if (next < state.notebook.pages.length) {
          return { notebook: { ...state.notebook, currentPage: next } };
        }
        return state;
      }),

      prevPage: () => set((state) => {
        const prev = state.notebook.currentPage - 1;
        if (prev >= 0) {
          return { notebook: { ...state.notebook, currentPage: prev } };
        }
        return state;
      }),

      addNewPage: () => set((state) => {
        const newPage = {
          id: `page-${Date.now()}`,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          title: `Entry #${state.notebook.pages.length + 1}`,
          content: ''
        };
        return {
          notebook: {
            ...state.notebook,
            pages: [...state.notebook.pages, newPage],
            currentPage: state.notebook.pages.length
          }
        };
      }),

      updateCurrentPage: (title, content) => set((state) => {
        const currentIdx = state.notebook.currentPage;
        const updatedPages = [...state.notebook.pages];
        if (updatedPages[currentIdx]) {
          updatedPages[currentIdx] = {
            ...updatedPages[currentIdx],
            title,
            content
          };
        }
        return {
          notebook: { ...state.notebook, pages: updatedPages }
        };
      }),

      deleteCurrentPage: () => set((state) => {
        if (state.notebook.pages.length <= 1) return state; // Minimum 1 page rakhenge
        const currentIdx = state.notebook.currentPage;
        const updatedPages = state.notebook.pages.filter((_, idx) => idx !== currentIdx);
        const newIdx = Math.max(0, currentIdx - 1);
        return {
          notebook: {
            ...state.notebook,
            pages: updatedPages,
            currentPage: newIdx
          }
        };
      }),

      // ==========================================
      // 3. CLOUD SYNC STATE
      // ==========================================
      isGoogleConnected: false,
      setGoogleConnected: (status) => set({ isGoogleConnected: status }),
    }),
    {
      name: 'booktodotask_storage',
    }
  )
);