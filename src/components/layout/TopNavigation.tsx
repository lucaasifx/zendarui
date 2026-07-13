import React, { useState } from 'react';
import styles from './TopNavigation.module.css';
import { useTranslation } from 'react-i18next';
import { Search, Menu, LayoutDashboard, Calendar as CalendarIcon, PieChart, X, Bell } from 'lucide-react';
import { UserMenu } from './UserMenu';

export const TopNavigation: React.FC = () => {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <span className={styles.logoDot}></span>
        <h1 className={styles.logoText}>Zendar</h1>
      </div>

      <div className={styles.mobileActions}>
        <button className={styles.notificationButton} aria-label="Notifications">
          <Bell size={20} />
          <span className={styles.badge}>9</span>
        </button>
        <button className={styles.mobileMenuButton} onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <nav className={`${styles.navigation} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <LayoutDashboard size={20} className={styles.navIcon} />
            <span>{t('dashboard')}</span>
          </li>
          <li className={`${styles.navItem} ${styles.navItemActive}`}>
            <CalendarIcon size={20} className={styles.navIcon} />
            <span>{t('calendar')}</span>
          </li>
          <li className={styles.navItem}>
            <PieChart size={20} className={styles.navIcon} />
            <span>{t('analytics')}</span>
          </li>
        </ul>

        <div className={styles.rightSection}>
          <div className={styles.searchContainer}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')} 
              className={styles.searchInput}
            />
          </div>
          <UserMenu />
        </div>
      </nav>
    </header>
  );
};
