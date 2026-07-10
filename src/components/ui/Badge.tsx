import React from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
  type?: 'personal' | 'work' | 'flight' | 'default';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ type = 'default', children, icon }) => {
  const typeClass = styles[`type-${type}`];

  return (
    <span className={`${styles.badge} ${typeClass}`}>
      {icon && <span className={styles.iconWrapper}>{icon}</span>}
      {children}
    </span>
  );
};
