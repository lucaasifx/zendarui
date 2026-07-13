import { create } from 'zustand';
import { addWeeks, subWeeks, addMonths, subMonths } from 'date-fns';

export const TaskPriority = {
  Low: 0,
  Medium: 1,
  High: 2
} as const;

export type TaskPriority = typeof TaskPriority[keyof typeof TaskPriority];

export type CalendarTaskDto = {
  taskId: string;
  title: string;
  description?: string;
  startAt: string; // ISO date string
  taskPriority: TaskPriority;
  categoryId: string;
  completed?: boolean;
};

export type CategoryDto = {
  id: string;
  name: string;
  color: string; // CSS color string (var or HEX)
  icon: string; // Lucide icon name
};

// Mock categories
export const MOCK_CATEGORIES: CategoryDto[] = [
  { id: 'cat-1', name: 'Personal', color: 'var(--color-personal)', icon: 'User' },
  { id: 'cat-2', name: 'Work', color: 'var(--color-work)', icon: 'Briefcase' },
  { id: 'cat-3', name: 'Home', color: '#9b59b6', icon: 'Home' },
  { id: 'cat-4', name: 'Health', color: '#FF5A5F', icon: 'Heart' },
  { id: 'cat-5', name: 'Study', color: '#2DCA8C', icon: 'Book' },
  { id: 'cat-6', name: 'Finance', color: '#F1C40F', icon: 'DollarSign' },
];

type AppState = {
  tasks: CalendarTaskDto[];
  activeModal: 'createTask' | null;
  theme: 'light' | 'dark';
  currentDate: Date; // Main calendar focus date
  selectedMonth: Date; // Mini calendar view month
  currentView: 'week' | 'month' | 'year';
  
  // Actions
  addTask: (task: CalendarTaskDto) => void;
  openModal: (modal: 'createTask') => void;
  closeModal: () => void;
  toggleTheme: () => void;
  setView: (view: 'week' | 'month' | 'year') => void;
  nextPeriod: () => void;
  prevPeriod: () => void;
  nextMonthMini: () => void;
  prevMonthMini: () => void;
  setToday: () => void;
  setDate: (date: Date) => void;
  toggleTaskCompletion: (taskId: string) => void;
  selectedCategories: string[];
  toggleCategoryFilter: (categoryId: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  tasks: [
    // Let's add some initial mock tasks corresponding to the design
    {
      taskId: 't1',
      title: 'Show project to Jes Parker',
      description: '',
      startAt: '2020-09-21T07:00:00Z',
      taskPriority: TaskPriority.Medium,
      categoryId: 'cat-3'
    },
    {
      taskId: 't2',
      title: 'Meeting with a team',
      description: '',
      startAt: '2020-09-25T07:00:00Z',
      taskPriority: TaskPriority.High,
      categoryId: 'cat-2'
    },
    {
      taskId: 't3',
      title: 'Meet Jason at the International Airport',
      description: '',
      startAt: '2020-09-22T10:00:00Z',
      taskPriority: TaskPriority.High,
      categoryId: 'cat-3'
    },
    {
      taskId: 't4',
      title: 'Call with Clark Kent',
      description: '',
      startAt: '2020-09-27T10:00:00Z',
      taskPriority: TaskPriority.Medium,
      categoryId: 'cat-1'
    }
  ],
  activeModal: null,
  theme: 'light',
  currentDate: new Date(),
  selectedMonth: new Date(),
  currentView: 'month',
  selectedCategories: MOCK_CATEGORIES.map(c => c.id),

  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  setView: (view) => set({ currentView: view }),
  nextPeriod: () => set((state) => {
    let newDate = state.currentDate;
    if (state.currentView === 'week') {
      newDate = addWeeks(state.currentDate, 1);
    } else if (state.currentView === 'month') {
      newDate = addMonths(state.currentDate, 1);
    }
    return { currentDate: newDate, selectedMonth: newDate };
  }),
  prevPeriod: () => set((state) => {
    let newDate = state.currentDate;
    if (state.currentView === 'week') {
      newDate = subWeeks(state.currentDate, 1);
    } else if (state.currentView === 'month') {
      newDate = subMonths(state.currentDate, 1);
    }
    return { currentDate: newDate, selectedMonth: newDate };
  }),
  nextMonthMini: () => set((state) => ({ selectedMonth: addMonths(state.selectedMonth, 1) })),
  prevMonthMini: () => set((state) => ({ selectedMonth: subMonths(state.selectedMonth, 1) })),
  setToday: () => set({ currentDate: new Date(), selectedMonth: new Date() }),
  setDate: (date) => set({ currentDate: date, selectedMonth: date }),
  toggleTaskCompletion: (taskId) => set((state) => ({
    tasks: state.tasks.map(t => 
      t.taskId === taskId ? { ...t, completed: !t.completed } : t
    )
  })),
  toggleCategoryFilter: (categoryId) => set((state) => ({
    selectedCategories: state.selectedCategories.includes(categoryId)
      ? state.selectedCategories.filter(id => id !== categoryId)
      : [...state.selectedCategories, categoryId]
  })),
}));
