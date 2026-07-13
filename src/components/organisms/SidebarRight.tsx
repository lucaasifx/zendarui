import React from 'react';
import styles from './SidebarRight.module.css';
import { MiniCalendar } from './MiniCalendar';
import { DailyTaskList } from './DailyTaskList';
import { FlightCard } from './FlightCard';
import { Plus } from 'lucide-react';
import { useAppStore, MOCK_CATEGORIES } from '../../store/useAppStore';

import { useTranslation } from 'react-i18next';

export const SidebarRight: React.FC = () => {
  const { t } = useTranslation();
  const currentView = useAppStore(state => state.currentView);
  const selectedCategories = useAppStore(state => state.selectedCategories);
  const toggleCategoryFilter = useAppStore(state => state.toggleCategoryFilter);

  return (
    <aside className={styles.sidebar}>
      {currentView === 'week' ? <MiniCalendar /> : <DailyTaskList />}
      <FlightCard />
      
      <div className={styles.categoriesSection}>
        <div className={styles.catHeader}>
          <h4>{t('categories')}</h4>
          <button className={styles.addCategoryBtn}><Plus size={16} /></button>
        </div>
        
        <div className={styles.categoryList}>
          {MOCK_CATEGORIES.map((cat, index) => {
            const percentages = [60, 80, 40, 90, 50, 70];
            const width = percentages[index % percentages.length] + '%';
            const isChecked = selectedCategories.includes(cat.id);
            
            return (
              <div key={cat.id} className={styles.categoryItem}>
                <label className={styles.catLabel}>
                  <input 
                    type="checkbox" 
                    checked={isChecked}
                    onChange={() => toggleCategoryFilter(cat.id)}
                    className={styles.checkbox} 
                    style={{ accentColor: cat.color }}
                  />
                  {t(cat.name.toLowerCase(), cat.name)}
                </label>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width, backgroundColor: cat.color }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
