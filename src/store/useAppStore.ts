import { create } from 'zustand';

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
  endAt: string; // ISO date string
  taskPriority: TaskPriority;
  categoryId: string;
};

// Mock categories matching our UI badges
export const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'Personal', colorType: 'personal' },
  { id: 'cat-2', name: 'Work', colorType: 'work' },
  { id: 'cat-3', name: 'Clients', colorType: 'flight' }, // using flight color for clients for now
];

type AppState = {
  tasks: CalendarTaskDto[];
  activeModal: 'createTask' | null;
  theme: 'light' | 'dark';
  
  
  // Actions
  addTask: (task: CalendarTaskDto) => void;
  openModal: (modal: 'createTask') => void;
  closeModal: () => void;
  toggleTheme: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  tasks: [
    // Let's add some initial mock tasks corresponding to the design
    {
      taskId: 't1',
      title: 'Show project to Jes Parker',
      description: '',
      startAt: '2020-09-21T07:00:00Z',
      endAt: '2020-09-21T09:00:00Z',
      taskPriority: TaskPriority.Medium,
      categoryId: 'cat-3'
    },
    {
      taskId: 't2',
      title: 'Meeting with a team',
      description: '',
      startAt: '2020-09-25T07:00:00Z',
      endAt: '2020-09-25T09:00:00Z',
      taskPriority: TaskPriority.High,
      categoryId: 'cat-2'
    },
    {
      taskId: 't3',
      title: 'Meet Jason at the International Airport',
      description: '',
      startAt: '2020-09-22T10:00:00Z',
      endAt: '2020-09-22T12:00:00Z',
      taskPriority: TaskPriority.High,
      categoryId: 'cat-3'
    },
    {
      taskId: 't4',
      title: 'Call with Clark Kent',
      description: '',
      startAt: '2020-09-27T10:00:00Z',
      endAt: '2020-09-27T12:00:00Z',
      taskPriority: TaskPriority.Medium,
      categoryId: 'cat-1'
    }
  ],
  activeModal: null,
  theme: 'light',

  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));
