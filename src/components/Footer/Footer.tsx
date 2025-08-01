'use client';

import { useAuthStore } from '@/store';
import { useHasMounted } from '@/hooks';
import styles from './Footer.module.scss';

export const Footer: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const hasMounted = useHasMounted();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.text}>
          {currentYear}
          {hasMounted && isAuthenticated && user && (
            <span className={styles.userEmail}>
              {' '}
              - Logged as {user.email}
            </span>
          )}
        </p>
      </div>
    </footer>
  );
};