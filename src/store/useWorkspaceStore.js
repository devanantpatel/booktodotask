import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWorkspaceStore = create(
  persist(
    (set, get) => ({
      activeTab: 'wall',
      setActiveTab: (tab) => set({ activeTab: tab }),

      isAutoArranged: false,
      toggleAutoArrange: () => set((state) => ({ isAutoArranged: !state.isAutoArranged })),

      todos: [
        { 
          id: '1', 
          number: 1,
          title: 'Detective Clues', 
          type: 'checklist', // 'checklist' | 'note'
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
        { 
          id: '2', 
          number: 2,
          title: 'Quick Memo', 
          type: 'note',
          checklist: [],
          text: 'Document exchange sharp at 10 PM near the old warehouse.', 
          completed: false, 
          selected: false,
          x: 240, 
          y: 30, 
          color: 'white', 
          rotation: 2 
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

      // Single checklist item tick toggle
      toggleChecklistItem: (cardId, itemId) => set((state) => ({
        todos: state.todos.map((card) => {
          if (card.id !== cardId) return card;
          const updatedChecklist = card.checklist.map((item) => 
            item.id === itemId ? { ...item, done: !item.done } : item
          );
          // Check if all items are done
          const allDone = updatedChecklist.length > 0 && updatedChecklist.every(i => i.done);
          return { ...card, checklist: updatedChecklist, completed: allDone };
        })
      })),

      // Pure card mark done/undone
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

      isGoogleConnected: false,
      setGoogleConnected: (status) => set({ isGoogleConnected: status }),
    }),
    {
      name: 'booktodotask_storage',
    }
  )
);