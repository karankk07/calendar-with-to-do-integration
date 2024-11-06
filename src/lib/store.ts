import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Category, Todo, Priority } from './types';

interface TodoStore {
  categories: Category[];
  todos: Todo[];
  selectedCategoryId: string | null;
  addCategory: (name: string, color: string) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addTodo: (todo: Omit<Todo, 'id'>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  setSelectedCategory: (id: string | null) => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
  categories: [
    { id: '1', name: 'Work', color: '#4f46e5' },
    { id: '2', name: 'Personal', color: '#16a34a' },
  ],
  todos: [],
  selectedCategoryId: null,

  addCategory: (name, color) =>
    set((state) => ({
      categories: [...state.categories, { id: uuidv4(), name, color }],
    })),

  updateCategory: (id, updates) =>
    set((state) => ({
      categories: state.categories.map((cat) =>
        cat.id === id ? { ...cat, ...updates } : cat
      ),
    })),

  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((cat) => cat.id !== id),
      todos: state.todos.filter((todo) => todo.categoryId !== id),
    })),

  addTodo: (todo) =>
    set((state) => ({
      todos: [...state.todos, { ...todo, id: uuidv4() }],
    })),

  updateTodo: (id, updates) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, ...updates } : todo
      ),
    })),

  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),

  setSelectedCategory: (id) =>
    set({ selectedCategoryId: id }),
}));