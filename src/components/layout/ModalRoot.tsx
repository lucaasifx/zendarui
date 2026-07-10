import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { CreateTaskModal } from '../organisms/CreateTaskModal';
import styles from './ModalRoot.module.css';

export const ModalRoot: React.FC = () => {
  const activeModal = useAppStore(state => state.activeModal);
  const closeModal = useAppStore(state => state.closeModal);

  if (!activeModal) return null;

  return (
    <div className={styles.overlay} onMouseDown={closeModal}>
      <div 
        className={styles.modalContainer} 
        onMouseDown={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
      >
        {activeModal === 'createTask' && <CreateTaskModal />}
      </div>
    </div>
  );
};
