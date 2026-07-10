import React from 'react';
import styles from './MiniCalendar.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay } from 'date-fns';

export const MiniCalendar: React.FC = () => {
  const selectedMonth = useAppStore(state => state.selectedMonth);
  const currentDate = useAppStore(state => state.currentDate);
  const nextMonthMini = useAppStore(state => state.nextMonthMini);
  const prevMonthMini = useAppStore(state => state.prevMonthMini);
  const setDate = useAppStore(state => state.setDate);
  const tasks = useAppStore(state => state.tasks);

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.header}>
        <h3 className={styles.monthTitle}>{format(selectedMonth, 'MMMM, yyyy')}</h3>
        <div className={styles.navButtons}>
          <Button variant="ghost" size="sm" onClick={prevMonthMini}><ChevronLeft size={16} /></Button>
          <Button variant="ghost" size="sm" onClick={nextMonthMini}><ChevronRight size={16} /></Button>
        </div>
      </div>
      
      <div className={styles.grid}>
        {daysOfWeek.map(d => (
          <div key={d} className={styles.dayOfWeek}>{d}</div>
        ))}
        {calendarDays.map(day => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());
          const isSelected = isSameDay(day, currentDate);
          
          const dayTasks = tasks.filter(t => isSameDay(new Date(t.startAt), day));
          const hasPersonal = dayTasks.some(t => t.categoryId === 'cat-1');
          const hasWork = dayTasks.some(t => t.categoryId === 'cat-2');
          
          // If it's selected in the main calendar, we can give it a special style, but today style has priority
          const cellClasses = [
            styles.dayCell,
            isToday ? styles.today : '',
            !isCurrentMonth ? styles.emptyDay : '',
            isSelected && !isToday ? styles.selected : ''
          ].filter(Boolean).join(' ');

          return (
            <div 
              key={day.toISOString()} 
              className={cellClasses}
              onClick={() => setDate(day)}
            >
              <span className={styles.dayNumber}>{format(day, 'd')}</span>
              {(hasPersonal || hasWork) && (
                <div className={styles.dots}>
                  {hasPersonal && <div className={`${styles.dot} ${styles.dotPersonal}`}></div>}
                  {hasWork && <div className={`${styles.dot} ${styles.dotWork}`}></div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
