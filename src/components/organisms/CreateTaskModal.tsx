import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TaskPriority, MOCK_CATEGORIES, useAppStore } from '../../store/useAppStore';
import type { CalendarTaskDto } from '../../store/useAppStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Plus } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import styles from './CreateTaskModal.module.css';

import { useTranslation } from 'react-i18next';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  taskPriority: z.nativeEnum(TaskPriority),
  categoryId: z.string().min(1, 'Category is required')
});

type TaskFormValues = z.infer<typeof taskSchema>;

export const CreateTaskModal: React.FC = () => {
  const { t } = useTranslation();
  const addTask = useAppStore(state => state.addTask);
  const closeModal = useAppStore(state => state.closeModal);
  const currentDate = useAppStore(state => state.currentDate);

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      date: (() => {
        const d = currentDate || new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      })(),
      taskPriority: TaskPriority.Medium,
      categoryId: MOCK_CATEGORIES[0].id
    }
  });

  const selectedCategory = watch('categoryId');
  const selectedPriority = watch('taskPriority');

  const onSubmit = (data: TaskFormValues) => {
    // Parse as YYYY-MM-DD and set to local noon to avoid timezone boundary issues
    const [year, month, day] = data.date.split('-').map(Number);
    const startAt = new Date(year, month - 1, day, 12, 0, 0).toISOString();

    const newTask: CalendarTaskDto = {
      taskId: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      startAt,
      taskPriority: data.taskPriority,
      categoryId: data.categoryId
    };

    addTask(newTask);
    closeModal();
  };

  return (
    <div className={styles.modalCard}>
      <h2 className={styles.modalTitle}>{t('createTask')}</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
        
        <div className={styles.formGroup}>
          <Input 
            placeholder={t('taskTitle')}
            {...register('title')} 
            style={{ fontSize: '1.125rem', padding: '1rem' }}
          />
          {errors.title && <span className={styles.errorText}>{errors.title.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <Input 
            placeholder={t('descriptionOptional')}
            {...register('description')} 
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.sectionTitle}>{t('date')}</label>
          <Input 
            type="date"
            {...register('date')} 
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.sectionTitle}>{t('category')}</label>
          <div className={styles.categoryGrid}>
            {MOCK_CATEGORIES.map(cat => {
              const Icon = (LucideIcons as any)[cat.icon] || LucideIcons.Folder;
              const isActive = selectedCategory === cat.id;
              
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setValue('categoryId', cat.id)}
                  className={`${styles.categoryPill} ${isActive ? styles.categoryPillActive : ''}`}
                  style={{ '--pill-color': cat.color } as React.CSSProperties}
                >
                  <Icon size={14} />
                  <span>{t(cat.name.toLowerCase(), cat.name)}</span>
                </button>
              );
            })}
          </div>
          {errors.categoryId && <span className={styles.errorText}>{errors.categoryId.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.sectionTitle}>{t('priority')}</label>
          <div className={styles.prioritySegmented}>
            <button
              type="button"
              className={`${styles.priorityBtn} ${selectedPriority === TaskPriority.Low ? styles.priorityBtnActive : ''}`}
              onClick={() => setValue('taskPriority', TaskPriority.Low)}
              style={{ '--active-color': '#2DCA8C' } as React.CSSProperties}
            >
              {t('low')}
            </button>
            <button
              type="button"
              className={`${styles.priorityBtn} ${selectedPriority === TaskPriority.Medium ? styles.priorityBtnActive : ''}`}
              onClick={() => setValue('taskPriority', TaskPriority.Medium)}
              style={{ '--active-color': '#FFA048' } as React.CSSProperties}
            >
              {t('medium')}
            </button>
            <button
              type="button"
              className={`${styles.priorityBtn} ${selectedPriority === TaskPriority.High ? styles.priorityBtnActive : ''}`}
              onClick={() => setValue('taskPriority', TaskPriority.High)}
              style={{ '--active-color': '#FF5A5F' } as React.CSSProperties}
            >
              {t('high')}
            </button>
          </div>
        </div>

        <div className={styles.footer}>
          <Button variant="ghost" type="button" onClick={closeModal}>{t('cancel')}</Button>
          <Button type="submit" className={styles.submitButton}>
            <Plus size={18} />
            {t('createTask')}
          </Button>
        </div>
      </form>
    </div>
  );
};
