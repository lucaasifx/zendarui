import React from 'react';
import styles from './MonthCalendarGrid.module.css';
import { useAppStore, MOCK_CATEGORIES } from '../../store/useAppStore';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isSameMonth, isSameDay } from 'date-fns';
import { Folder } from 'lucide-react';

import { useTranslation } from 'react-i18next';
import { ptBR, enUS } from 'date-fns/locale';

export const MonthCalendarGrid: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentDate = useAppStore(state => state.currentDate);
  const tasks = useAppStore(state => state.tasks);
  const openModal = useAppStore(state => state.openModal);
  const setDate = useAppStore(state => state.setDate);
  const selectedCategories = useAppStore(state => state.selectedCategories);

  const locale = i18n.language === 'pt-BR' ? ptBR : enUS;

  // Generate days for the month grid
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  
  // Start from the Sunday of the first week
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  
  // End on the Saturday of the last week
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const dateFormat = 'd';
  const rows = [];

  let days = [];
  let day = startDate;
  let formattedDate = '';

  // Generate grid rows and cells
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      
      // Filter tasks for this day and active category filters
      const dayTasks = tasks.filter(t => 
        isSameDay(new Date(t.startAt), cloneDay) && 
        selectedCategories.includes(t.categoryId)
      );

      days.push(
        <div
          className={`${styles.cell} ${
            !isSameMonth(day, monthStart)
              ? styles.disabled
              : isSameDay(day, currentDate) ? styles.selected : ''
          }`}
          key={day.toISOString()}
          onClick={() => {
            setDate(cloneDay);
            openModal('createTask');
          }}
        >
          <span className={styles.number}>{formattedDate}</span>
          <div className={styles.tasksContainer}>
            {dayTasks.slice(0, 2).map(task => {
              const category = MOCK_CATEGORIES.find(c => c.id === task.categoryId) || MOCK_CATEGORIES[0];

              return (
                <div key={task.taskId} className={styles.taskPill} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.dot} style={{ backgroundColor: category.color }}></div>
                  <span className={styles.taskTitle}>{task.title}</span>
                </div>
              );
            })}
            {dayTasks.length > 2 && (
              <div className={styles.moreTasksLabel}>
                {t('moreTasks', { count: dayTasks.length - 2 })}
              </div>
            )}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className={styles.row} key={day.toISOString()}>
        {days}
      </div>
    );
    days = [];
  }

  // Generate headers based on date-fns locale
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = addDays(startOfWeek(new Date(), { weekStartsOn: 0 }), i);
    const dayName = format(d, 'eee', { locale });
    const cleanedName = dayName.replace('.', '');
    return {
      desktop: cleanedName.substring(0, 3),
      mobile: cleanedName.charAt(0).toUpperCase()
    };
  });

  return (
    <div className={styles.calendarWrapper}>
      <div className={styles.daysRow}>
        {weekDays.map((day, idx) => (
          <div className={styles.dayHeader} key={idx}>
            <span className={styles.desktopDayName}>{day.desktop}</span>
            <span className={styles.mobileDayName}>{day.mobile}</span>
          </div>
        ))}
      </div>
      <div className={styles.grid}>
        {rows}
      </div>
    </div>
  );
};
