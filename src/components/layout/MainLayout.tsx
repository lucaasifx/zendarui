import React from 'react';
import styles from './MainLayout.module.css';
import { TopNavigation } from './TopNavigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className={styles.layoutContainer}>
      <TopNavigation />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};
