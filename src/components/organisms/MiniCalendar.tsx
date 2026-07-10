import React from 'react';
import styles from './MiniCalendar.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

export const MiniCalendar: React.FC = () => {
  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  // Hardcoded for visual mock
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.header}>
        <h3 className={styles.monthTitle}>September, 2020</h3>
        <div className={styles.navButtons}>
          <Button variant="ghost" size="sm"><ChevronLeft size={16} /></Button>
          <Button variant="ghost" size="sm"><ChevronRight size={16} /></Button>
        </div>
      </div>
      
      <div className={styles.grid}>
        {daysOfWeek.map(d => (
          <div key={d} className={styles.dayOfWeek}>{d}</div>
        ))}
        {/* Empty slots for spacing before day 1 */}
        <div className={styles.emptyDay}>31</div>
        {days.map(d => {
          const isToday = d === 15;
          const hasDots = d === 1 || d === 3 || d === 15 || d === 25;
          return (
            <div key={d} className={`${styles.dayCell} ${isToday ? styles.today : ''}`}>
              <span className={styles.dayNumber}>{d}</span>
              {hasDots && (
                <div className={styles.dots}>
                  <div className={`${styles.dot} ${styles.dotPersonal}`}></div>
                  <div className={`${styles.dot} ${styles.dotWork}`}></div>
                </div>
              )}
            </div>
          );
        })}
        {/* Next month days */}
        <div className={styles.emptyDay}>1</div>
        <div className={styles.emptyDay}>2</div>
        <div className={styles.emptyDay}>3</div>
      </div>
    </div>
  );
};
