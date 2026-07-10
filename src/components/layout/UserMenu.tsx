import React from 'react';
import styles from './UserMenu.module.css';
import { Bell, Moon, Sun } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const UserMenu: React.FC = () => {
  const theme = useAppStore(state => state.theme);
  const toggleTheme = useAppStore(state => state.toggleTheme);
  
  return (
    <div className={styles.userMenuContainer}>
      <button 
        className={`${styles.themeToggle} ${theme === 'dark' ? styles.themeToggleDark : ''}`}
        onClick={toggleTheme} 
        aria-label="Toggle Theme"
      >
        <span className={styles.themeToggleThumb}>
          {theme === 'light' ? <Sun size={14} /> : <Moon size={14} />}
        </span>
      </button>

      <button className={styles.notificationButton}>
        <Bell size={20} />
        <span className={styles.badge}>9</span>
      </button>

      <div className={styles.userInfo}>
        <div className={styles.userText}>
          <span className={styles.userName}>David Garrett</span>
          <span className={styles.userRole}>CEO at Newpic</span>
        </div>
        <img 
          src="https://i.pravatar.cc/150?u=david" 
          alt="User avatar" 
          className={styles.avatar} 
        />
      </div>
    </div>
  );
};
