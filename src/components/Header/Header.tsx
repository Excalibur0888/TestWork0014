'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store';
import { useHasMounted } from '@/hooks';
import styles from './Header.module.scss';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const hasMounted = useHasMounted();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className={styles.header}>
      {/* Contact Info Bar */}
      <div className={styles.contactBar}>
        <div className={styles.container}>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>📞</span>
              <span>+021-95-51-84</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>✉</span>
              <span>shop@abelohost.com</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>📍</span>
              <span>1734 Stonecoal Road</span>
            </div>
          </div>
          <div className={styles.authSection}>
            {hasMounted ? (
              isAuthenticated && user ? (
                <div className={styles.userInfo}>
                  <span className={styles.userName}>
                    {user.firstName} {user.lastName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className={styles.logoutButton}
                    type="button"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/login" className={styles.loginLink}>
                  Login
                </Link>
              )
            ) : (
              <Link href="/login" className={styles.loginLink}>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className={styles.mainHeader}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            Abelohost Shop
          </Link>
        </div>
      </div>
    </header>
  );
};