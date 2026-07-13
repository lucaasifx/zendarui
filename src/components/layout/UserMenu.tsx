import React, { useState, useRef, useEffect } from 'react';
import styles from './UserMenu.module.css';
import { Bell, Moon, Sun, Globe, LogOut, User, ChevronDown } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from 'react-i18next';

export const UserMenu: React.FC = () => {
  const { i18n, t } = useTranslation();
  const theme = useAppStore(state => state.theme);
  const toggleTheme = useAppStore(state => state.toggleTheme);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'pt-BR' ? 'en-US' : 'pt-BR');
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.userMenuContainer}>
      <button className={styles.notificationButton} aria-label="Notifications">
        <Bell size={20} />
        <span className={styles.badge}>9</span>
      </button>

      <div className={styles.userInfoWrapper} ref={dropdownRef}>
        <div 
          className={styles.userInfo} 
          onClick={() => setIsOpen(!isOpen)} 
          style={{ cursor: 'pointer' }}
          role="button"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className={styles.userText}>
            <span className={styles.userName}>David Garrett</span>
            <span className={styles.userRole}>CEO at Newpic</span>
          </div>
          <div className={styles.avatarContainer}>
            <img 
              src="https://i.pravatar.cc/150?u=david" 
              alt="User avatar" 
              className={styles.avatar} 
            />
            <ChevronDown size={14} className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} />
          </div>
        </div>

        {isOpen && (
          <div className={styles.dropdown}>
            <button className={styles.dropdownItem} onClick={() => setIsOpen(false)}>
              <User size={16} />
              <span>{t('viewProfile', 'Ver Perfil')}</span>
            </button>
            
            <button className={styles.dropdownToggleItem} onClick={toggleTheme}>
              <div className={styles.itemLeft}>
                <Moon size={16} />
                <span>{t('switchToDark', 'Modo Escuro')}</span>
              </div>
              <div className={`${styles.switch} ${theme === 'dark' ? styles.switchActive : ''}`}>
                <span className={styles.switchThumb}></span>
              </div>
            </button>

            <button className={styles.dropdownToggleItem} onClick={toggleLanguage}>
              <div className={styles.itemLeft}>
                <Globe size={16} />
                <span>{t('languageLabel')}</span>
              </div>
              <div className={`${styles.switch} ${i18n.language === 'en-US' ? styles.switchActive : ''}`}>
                <span className={styles.switchThumb}></span>
              </div>
            </button>

            <div className={styles.divider}></div>

            <button className={`${styles.dropdownItem} ${styles.logout}`} onClick={() => setIsOpen(false)}>
              <LogOut size={16} />
              <span>{t('logout', 'Sair')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
