import React from 'react';
import styles from './MainCalendarGrid.module.css';
import { Button } from '../ui/Button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Folder } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { CalendarTaskDto } from '../../store/useAppStore';

export const MainCalendarGrid: React.FC = () => {
  const tasks = useAppStore(state => state.tasks);
  const openModal = useAppStore(state => state.openModal);

  const days = [
    { name: 'Monday', date: '21/09' },
    { name: 'Tuesday', date: '22/09', active: true },
    { name: 'Wednesday', date: '23/09' },
    { name: 'Thursday', date: '24/09' },
    { name: 'Friday', date: '25/09' },
    { name: 'Saturday', date: '26/09' },
    { name: 'Sunday', date: '27/09' }
  ];

  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  const now = new Date();
  const currentHourStr = now.getHours().toString().padStart(2, '0') + ':00';
  const currentMinutes = now.getMinutes();
  const topOffset = `${(currentMinutes / 60) * 100}%`;

  const getGridPosition = (task: CalendarTaskDto) => {
    const start = new Date(task.startAt);
    const end = new Date(task.endAt);
    
    // Day of week: 0 is Sunday, 1 is Monday
    let day = start.getDay();
    let col = day === 0 ? 8 : day + 1; // Mon=2, Tue=3, ..., Sun=8

    // Using UTC to match our mock data ISO strings perfectly regardless of local timezone
    const startHour = start.getUTCHours(); 
    
    let row = startHour + 2; 
    let span = end.getUTCHours() - startHour;
    if (span < 1) span = 1;

    return { gridColumn: col, gridRow: `${row} / span ${span}` };
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2>September, 2020</h2>
        </div>
        <div className={styles.viewToggle}>
          <div className={styles.toggleGroup}>
            <button className={`${styles.toggleBtn} ${styles.activeToggle}`}>Week</button>
            <button className={styles.toggleBtn}>Month</button>
            <button className={styles.toggleBtn}>Year</button>
          </div>
          <div className={styles.navGroup}>
            <Button variant="secondary" size="sm" className={styles.navArrow}><ChevronLeft size={16}/></Button>
            <Button variant="secondary" size="sm" className={styles.todayBtn}>Today</Button>
            <Button variant="secondary" size="sm" className={styles.navArrow}><ChevronRight size={16}/></Button>
          </div>
        </div>
      </div>

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
                  onClick={() => openModal('createTask')}
                >
                  {hour === currentHourStr && <div className={styles.currentTimeline} style={{ top: topOffset }}></div>}
                </div>
              ))}
            </React.Fragment>
          ))}

          {/* Dynamic Events from Zustand Store */}
          {tasks.map(task => {
            const pos = getGridPosition(task);
            
            // Map categoryId to color class (cat-1=Personal, cat-2=Work, cat-3=Flight)
            let colorClass = styles.eventWork;
            if (task.categoryId === 'cat-1') colorClass = styles.eventPersonal;
            if (task.categoryId === 'cat-3') colorClass = styles.eventFlight;

            // Format time
            const startHour = new Date(task.startAt).getUTCHours().toString().padStart(2, '0') + ':00';

            // Logic for "Upcoming" badge
            const taskStart = new Date(task.startAt);
            const timeDiff = taskStart.getTime() - now.getTime();
            const minutesToGo = Math.ceil(timeDiff / (1000 * 60));
            const isUpcoming = minutesToGo > 0 && minutesToGo <= 60;

            return (
              <div 
                key={task.taskId}
                className={`${styles.eventCard} ${colorClass}`} 
                style={{ ...pos, margin: '8px 4px' }}
                onClick={(e) => e.stopPropagation()} // Prevent opening modal when clicking on event
              >
                {isUpcoming && (
                  <div className={styles.badgeTop}><span className={styles.moon}>🌙</span> {minutesToGo} min to go</div>
                )}
                <span className={styles.eventTime}>{startHour}</span>
                <p className={styles.eventTitle}>{task.title}</p>
                <div className={styles.eventFooter}>
                  {task.categoryId === 'cat-3' ? <PlaneIcon /> : <Folder size={12}/>} 
                  {task.categoryId === 'cat-1' ? ' Personal' : task.categoryId === 'cat-2' ? ' Work' : ' Clients'}
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </div>
  );
};

const PlaneIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 5-4 4-3-1-1 1 4 4 1-1-1-3 4-4 5 6 1.2-.7c.4-.2.7-.6.6-1.1z"/></svg>;
