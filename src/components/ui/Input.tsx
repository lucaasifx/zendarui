import React from 'react';
import type { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ 
  icon, 
  rightIcon, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`${styles.inputContainer} ${className}`}>
      {icon && <div className={styles.leftIcon}>{icon}</div>}
      <input 
        className={`${styles.input} ${icon ? styles.withLeftIcon : ''} ${rightIcon ? styles.withRightIcon : ''} ${error ? styles.error : ''}`} 
        {...props} 
      />
      {rightIcon && <div className={styles.rightIcon}>{rightIcon}</div>}
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
