import React from 'react';
import styles from './AvatarGroup.module.css';
import { Plus } from 'lucide-react';

interface AvatarGroupProps {
  users: Array<{ id: string; name: string; avatarUrl: string }>;
  max?: number;
  onAdd?: () => void;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ users, max = 3, onAdd }) => {
  const visibleUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  return (
    <div className={styles.groupContainer}>
      {visibleUsers.map((user, index) => (
        <img 
          key={user.id}
          src={user.avatarUrl}
          alt={user.name}
          title={user.name}
          className={styles.avatar}
          style={{ zIndex: 10 - index }}
        />
      ))}
      {remainingCount > 0 && (
        <div className={styles.remainingBadge} style={{ zIndex: 10 - max }}>
          +{remainingCount}
        </div>
      )}
      {onAdd && (
        <button className={styles.addButton} onClick={onAdd} title="Add user">
          <Plus size={16} />
        </button>
      )}
    </div>
  );
};
