import React from 'react';
import styles from './WeekCalendarGrid.module.css';
import { Button } from '../ui/Button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { startOfWeek, addDays, format, isSameDay, isSameWeek } from 'date-fns';

import { useTranslation } from 'react-i18next';
import { ptBR, enUS } from 'date-fns/locale';

export const WeekCalendarGrid: React.FC = () => {
  const { i18n } = useTranslation();
  const openModal = useAppStore(state => state.openModal);
  const currentDate = useAppStore(state => state.currentDate);
  const setDate = useAppStore(state => state.setDate);

  const locale = i18n.language === 'pt-BR' ? ptBR : enUS;

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday is 0

  const days = Array.from({ length: 7 }).map((_, i) => {
    const dayDate = addDays(weekStart, i);
    return {
      name: format(dayDate, 'eee', { locale }), // e.g. "Mon"
      date: format(dayDate, 'dd/MM'), // e.g. "21/09"
      active: isSameDay(dayDate, new Date()), // Highlight real today
      fullDate: dayDate
    };
  });

  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  const now = new Date();
  const currentHourStr = now.getHours().toString().padStart(2, '0') + ':00';
  const currentMinutes = now.getMinutes();
  const topOffset = `${(currentMinutes / 60) * 100}%`;

  return (
      <div className={styles.calendarWrapper}>
        <div className={styles.scrollArea}>
          <div className={styles.grid}>
            {/* Header Row */}
          <div className={styles.timeColumnHeader} style={{ gridColumn: 1, gridRow: 1 }}>
            <div className={styles.iconBox}><CalendarIcon size={18}/></div>
          </div>
          {days.map((d, index) => (
            <div 
              key={d.name} 
              className={`${styles.dayHeader} ${d.active ? styles.dayHeaderActive : ''}`}
              style={{ gridColumn: index + 2, gridRow: 1 }}
            >
              <span className={styles.dayName}>{d.name}</span>
              <span className={styles.dayDate}>{d.date}</span>
            </div>
          ))}

          {/* Grid Rows - explicitly positioned to prevent auto-placement bugs */}
          {hours.map((hour, hIndex) => (
            <React.Fragment key={hour}>
              <div className={styles.timeLabel} style={{ gridColumn: 1, gridRow: hIndex + 2, position: 'relative' }}>
                {hour}
                {hour === currentHourStr && (
                  <div className={styles.currentTimeBadge} style={{ top: topOffset, position: 'absolute', transform: 'translateY(-50%)' }}>
                    {now.getHours().toString().padStart(2, '0')}:{now.getMinutes().toString().padStart(2, '0')}
                  </div>
                )}
              </div>
              {days.map((d, dIndex) => (
                <div 
                  key={`${d.name}-${hour}`} 
                  className={styles.cell}
                  style={{ gridColumn: dIndex + 2, gridRow: hIndex + 2, cursor: 'pointer' }}
                  onClick={() => {
                    setDate(d.fullDate);
                    openModal('createTask');
                  }}
                >
                  {hour === currentHourStr && <div className={styles.currentTimeline} style={{ top: topOffset }}></div>}
                </div>
              ))}
            </React.Fragment>
          ))}

          {/* Events will be rendered here in the future. Tasks are not rendered in the week grid as they do not have duration. */}
          </div>
        </div>
      </div>
  );
};
