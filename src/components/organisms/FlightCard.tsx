import React from 'react';
import styles from './FlightCard.module.css';
import { Plane } from 'lucide-react';
import { Button } from '../ui/Button';

import { useAppStore } from '../../store/useAppStore';

import { format } from 'date-fns';

export const FlightCard: React.FC = () => {
  const tasks = useAppStore(state => state.tasks);
  
  // Find flight task by title keyword to avoid relying on a hardcoded category ID
  const flightTask = tasks.find(t => 
    t.title.toLowerCase().includes('airport') || 
    t.title.toLowerCase().includes('flight') || 
    t.title.toLowerCase().includes('voo')
  );
  
  if (!flightTask) return null; // Don't render if no flight

  const now = new Date();
  const taskStart = new Date(flightTask.startAt);
  
  const timeDiff = taskStart.getTime() - now.getTime();
  const minutesToGo = Math.ceil(timeDiff / (1000 * 60));
  const isUpcoming = minutesToGo > 0 && minutesToGo <= 60;

  const startHourStr = format(taskStart, 'HH:mm');
  // Mock a flight duration of 2 hours since tasks no longer have endAt
  const taskEnd = new Date(taskStart.getTime() + 2 * 60 * 60 * 1000);
  const endHourStr = format(taskEnd, 'HH:mm');

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
