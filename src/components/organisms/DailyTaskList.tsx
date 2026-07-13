import React from 'react';
import styles from './DailyTaskList.module.css';
import { useAppStore, TaskPriority, MOCK_CATEGORIES, type CalendarTaskDto } from '../../store/useAppStore';
import { isSameDay } from 'date-fns';
import { Plus, Check } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

import { useTranslation } from 'react-i18next';

export const DailyTaskList: React.FC = () => {
  const { t } = useTranslation();
  const tasks = useAppStore(state => state.tasks);
  const currentDate = useAppStore(state => state.currentDate);
  const selectedCategories = useAppStore(state => state.selectedCategories);
  const toggleTaskCompletion = useAppStore(state => state.toggleTaskCompletion);
  const openModal = useAppStore(state => state.openModal);

  // Filter tasks for the selected date and active category filters
  const dailyTasks = tasks.filter(t => 
    isSameDay(new Date(t.startAt), currentDate) && 
    selectedCategories.includes(t.categoryId)
  );

  const totalTasks = dailyTasks.length;
  const completedTasks = dailyTasks.filter(t => t.completed).length;
  const remainingTasks = totalTasks - completedTasks;
  const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

  const highPriorityTasks = dailyTasks.filter(t => t.taskPriority === TaskPriority.High);
  const mediumPriorityTasks = dailyTasks.filter(t => t.taskPriority === TaskPriority.Medium);
  const lowPriorityTasks = dailyTasks.filter(t => t.taskPriority === TaskPriority.Low);

  const renderTaskGroup = (title: string, groupTasks: CalendarTaskDto[], colorClass: string, priorityColor: string) => {
    if (groupTasks.length === 0) return null;

    return (
      <section className={styles.taskSection}>
        <div className={styles.groupHeader}>
          <div className={styles.groupTitle}>
            <span 
              className={`${styles.priorityDot} ${colorClass}`}
              style={{
                backgroundColor: priorityColor,
                boxShadow: `0 0 8px ${priorityColor}73`,
              }}
            />
            <span 
              className={styles.groupTitleText}
              style={{ color: priorityColor }}
            >
              {title}
            </span>
          </div>
          <span className={styles.groupCount}>{groupTasks.length}</span>
        </div>
        
        <ul className={styles.groupList}>
          {groupTasks.map(task => {
            const category = MOCK_CATEGORIES.find(c => c.id === task.categoryId) || MOCK_CATEGORIES[0];
            const Icon = (LucideIcons as any)[category.icon] || LucideIcons.Folder;

            return (
              <li key={task.taskId}>
                <div 
                  className={`${styles.taskItem} ${task.completed ? styles.taskCompleted : ''}`}
                  style={{ '--priority-color': priorityColor } as React.CSSProperties}
                >
                  <button
                    onClick={() => toggleTaskCompletion(task.taskId)}
                    aria-label="Toggle task"
                    className={styles.checkboxButton}
                    style={
                      task.completed
                        ? {
                            backgroundColor: priorityColor,
                            borderColor: priorityColor,
                          }
                        : {
                            '--priority-hover': priorityColor
                          } as React.CSSProperties
                    }
                  >
                    {task.completed && <Check size={12} className={styles.checkIcon} strokeWidth={3.5} />}
                  </button>
                  
                  <button
                    onClick={() => toggleTaskCompletion(task.taskId)}
                    className={styles.taskTitleButton}
                  >
                    <span className={styles.taskTitle}>
                      {task.title}
                    </span>
                  </button>

                  <span 
                    className={styles.taskBadge} 
                    style={{ 
                      color: category.color, 
                      borderColor: `${category.color}33`, 
                      backgroundColor: `${category.color}15` 
                    }}
                  >
                    <Icon size={10} style={{ marginRight: 4 }} />
                    {t(category.name.toLowerCase(), category.name)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{t('tasks')}</h2>
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className={styles.remainingText}>
              {t('remainingTasks', { remaining: remainingTasks, total: totalTasks })}
            </span>
          </div>
        </div>
        <button 
          onClick={() => openModal('createTask')}
          className={styles.addButton}
          aria-label="Add task"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </div>

      <div className={styles.scrollArea}>
        {totalTasks === 0 ? (
          <div className={styles.emptyState}>{t('noTasks')}</div>
        ) : (
          <>
            {renderTaskGroup(t('highPriority'), highPriorityTasks, styles.dotHigh, '#FF5A5F')}
            {renderTaskGroup(t('mediumPriority'), mediumPriorityTasks, styles.dotMedium, '#FFA048')}
            {renderTaskGroup(t('lowPriority'), lowPriorityTasks, styles.dotLow, '#2DCA8C')}
          </>
        )}
      </div>
    </div>
  );
};
