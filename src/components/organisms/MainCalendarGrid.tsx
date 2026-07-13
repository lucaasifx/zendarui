import React from 'react';
import styles from './MainCalendarGrid.module.css';
import { Button } from '../ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { format } from 'date-fns';
import { WeekCalendarGrid } from './WeekCalendarGrid';
import { MonthCalendarGrid } from './MonthCalendarGrid';

import { useTranslation } from 'react-i18next';
import { ptBR, enUS } from 'date-fns/locale';

export const MainCalendarGrid: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentDate = useAppStore(state => state.currentDate);
  const currentView = useAppStore(state => state.currentView);
  const setView = useAppStore(state => state.setView);
  const nextPeriod = useAppStore(state => state.nextPeriod);
  const prevPeriod = useAppStore(state => state.prevPeriod);
  const setToday = useAppStore(state => state.setToday);

  const locale = i18n.language === 'pt-BR' ? ptBR : enUS;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2>{format(currentDate, 'MMMM, yyyy', { locale })}</h2>
        </div>
        <div className={styles.viewToggle}>
          <div className={styles.toggleGroup}>
            <button 
              className={`${styles.toggleBtn} ${currentView === 'week' ? styles.activeToggle : ''}`}
              onClick={() => setView('week')}
            >
              {t('week')}
            </button>
            <button 
              className={`${styles.toggleBtn} ${currentView === 'month' ? styles.activeToggle : ''}`}
              onClick={() => setView('month')}
            >
              {t('month')}
            </button>
            <button 
              className={`${styles.toggleBtn} ${currentView === 'year' ? styles.activeToggle : ''}`}
              onClick={() => setView('year')}
            >
              {t('year')}
            </button>
          </div>
          <div className={styles.navGroup}>
            <Button variant="secondary" size="sm" className={styles.navArrow} onClick={prevPeriod}><ChevronLeft size={16}/></Button>
            <Button variant="secondary" size="sm" className={styles.todayBtn} onClick={setToday}>{t('today')}</Button>
            <Button variant="secondary" size="sm" className={styles.navArrow} onClick={nextPeriod}><ChevronRight size={16}/></Button>
          </div>
        </div>
      </div>

      {currentView === 'week' && <WeekCalendarGrid />}
      {currentView === 'month' && <MonthCalendarGrid />}
      {currentView === 'year' && <div className={styles.calendarWrapper}><div style={{padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)'}}>Year view pending</div></div>}
    </div>
  );
};
