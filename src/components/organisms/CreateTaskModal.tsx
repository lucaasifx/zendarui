import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TaskPriority, MOCK_CATEGORIES, useAppStore } from '../../store/useAppStore';
import type { CalendarTaskDto } from '../../store/useAppStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Plus } from 'lucide-react';
import styles from './CreateTaskModal.module.css';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  taskPriority: z.nativeEnum(TaskPriority),
  categoryId: z.string().min(1, 'Category is required')
});

type TaskFormValues = z.infer<typeof taskSchema>;

export const CreateTaskModal: React.FC = () => {
  const addTask = useAppStore(state => state.addTask);
  const closeModal = useAppStore(state => state.closeModal);

  const { register, handleSubmit, formState: { errors } } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      taskPriority: TaskPriority.Medium,
      categoryId: MOCK_CATEGORIES[0].id
    }
  });

  const onSubmit = (data: TaskFormValues) => {
    // Convert date + time to ISO strings
    const startAt = new Date(`${data.date}T${data.startTime}:00Z`).toISOString();
    const endAt = new Date(`${data.date}T${data.endTime}:00Z`).toISOString();

    const newTask: CalendarTaskDto = {
      taskId: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      startAt,
      endAt,
      taskPriority: data.taskPriority,
      categoryId: data.categoryId
    };

    addTask(newTask);
    closeModal();
  };

  return (
    <div className={styles.modalCard}>
      <h2 className={styles.modalTitle}>Create New Task</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
        
        <div className={styles.formGroup}>
          <Input 
            placeholder="Task Title"
            {...register('title')} 
          />
          {errors.title && <span className={styles.errorText}>{errors.title.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <Input 
            type="date"
            {...register('date')} 
          />
        </div>

        <div className={styles.row}>
          <div className={styles.timeInput}>
            <label>Start</label>
            <Input 
              type="time"
              {...register('startTime')} 
            />
          </div>
          <div className={styles.timeInput}>
            <label>End</label>
            <Input 
              type="time"
              {...register('endTime')} 
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <Input 
            placeholder="Description (Optional)"
            {...register('description')} 
          />
        </div>

        <div className={styles.row}>
          <div className={styles.selectGroup}>
            <label>Category</label>
            <select className={styles.select} {...register('categoryId')}>
              {MOCK_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.selectGroup}>
            <label>Priority</label>
            <select className={styles.select} {...register('taskPriority', { valueAsNumber: true })}>
              <option value={TaskPriority.Low}>Low</option>
              <option value={TaskPriority.Medium}>Medium</option>
              <option value={TaskPriority.High}>High</option>
            </select>
          </div>
        </div>

        <div className={styles.footer}>
          <Button variant="ghost" type="button" onClick={closeModal}>Cancel</Button>
          <Button type="submit" className={styles.submitButton}>
            <Plus size={18} />
            Create Activity
          </Button>
        </div>
      </form>
    </div>
  );
};
