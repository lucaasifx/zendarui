import React from 'react';
import styles from './SidebarRight.module.css';
import { MiniCalendar } from './MiniCalendar';
import { FlightCard } from './FlightCard';
import { Plus } from 'lucide-react';

export const SidebarRight: React.FC = () => {
  return (
    <aside className={styles.sidebar}>
      <MiniCalendar />
      <FlightCard />
      
      <div className={styles.categoriesSection}>
        <div className={styles.catHeader}>
          <h4>Categories</h4>
          <button className={styles.addCategoryBtn}><Plus size={16} /></button>
        </div>
        
        <div className={styles.categoryList}>
          {/* Category 1 */}
          <div className={styles.categoryItem}>
            <label className={styles.catLabel}>
              <input type="checkbox" defaultChecked className={styles.checkbox} style={{ accentColor: 'var(--color-primary)' }}/>
              Clients
            </label>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '60%', backgroundColor: 'var(--color-primary)' }}></div>
            </div>
          </div>
          
          {/* Category 2 */}
          <div className={styles.categoryItem}>
            <label className={styles.catLabel}>
              <input type="checkbox" defaultChecked className={styles.checkbox} style={{ accentColor: 'var(--color-personal)' }}/>
              Personal
            </label>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '80%', backgroundColor: 'var(--color-personal)' }}></div>
            </div>
          </div>

          {/* Category 3 */}
          <div className={styles.categoryItem}>
            <label className={styles.catLabel}>
              <input type="checkbox" defaultChecked className={styles.checkbox} style={{ accentColor: 'var(--color-work)' }}/>
              Work
            </label>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '40%', backgroundColor: 'var(--color-work)' }}></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
