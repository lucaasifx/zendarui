import React from 'react';
import styles from './FlightCard.module.css';
import { Plane } from 'lucide-react';
import { Button } from '../ui/Button';

import { useAppStore } from '../../store/useAppStore';

export const FlightCard: React.FC = () => {
  const tasks = useAppStore(state => state.tasks);
  
  // Find the first flight task
  const flightTask = tasks.find(t => t.categoryId === 'cat-3');
  
  if (!flightTask) return null; // Don't render if no flight

  const now = new Date();
  const taskStart = new Date(flightTask.startAt);
  const taskEnd = new Date(flightTask.endAt);
  
  const timeDiff = taskStart.getTime() - now.getTime();
  const minutesToGo = Math.ceil(timeDiff / (1000 * 60));
  const isUpcoming = minutesToGo > 0 && minutesToGo <= 60;

  const startHourStr = taskStart.getUTCHours().toString().padStart(2, '0') + ':' + taskStart.getUTCMinutes().toString().padStart(2, '0');
  const endHourStr = taskEnd.getUTCHours().toString().padStart(2, '0') + ':' + taskEnd.getUTCMinutes().toString().padStart(2, '0');

  return (
    <div className={styles.cardContainer}>
      <div className={styles.iconContainer}>
        <Plane size={24} className={styles.planeIcon} />
      </div>
      <div className={styles.content}>
        {isUpcoming && (
          <div className={styles.timeBadge}>
            <span className={styles.moonIcon}>🌙</span> {minutesToGo} min
          </div>
        )}
        <p className={styles.timeLabel}>{startHourStr} - {endHourStr}</p>
        <h4 className={styles.title}>{flightTask.title}</h4>
        
        <div className={styles.actions}>
          <Button variant="secondary" size="sm" className={styles.btnLater}>Later</Button>
          <Button variant="primary" size="sm" className={styles.btnDetails}>Details</Button>
        </div>
      </div>
    </div>
  );
};
