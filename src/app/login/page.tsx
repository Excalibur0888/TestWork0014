'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { useHasMounted } from '@/hooks';
import { Loader } from '@/components';
import styles from './page.module.scss';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const { login, isLoading, error, isAuthenticated, clearError } =
    useAuthStore();
  const router = useRouter();
  const hasMounted = useHasMounted();

  useEffect(() => {
    if (hasMounted && isAuthenticated && !isLoading) {
      router.push('/');
    }
  }, [hasMounted, isAuthenticated, isLoading, router]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const validateForm = () => {
    const errors: { username?: string; password?: string } = {};

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.trim().length < 3) {
      errors.password = 'Password must be at least 3 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    const success = await login(
      formData.username.trim(),
      formData.password.trim()
    );

    if (success) {
      router.push('/');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  if (hasMounted && isAuthenticated && !isLoading) {
    return null;
  }

  if (!hasMounted) {
    return (
      <div className={styles.container}>
        <div className={styles.loginCard}>
          <Loader size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Login</h1>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.fieldGroup}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              className={`${styles.input} ${
                validationErrors.username ? styles.inputError : ''
              }`}
              placeholder="Enter username"
              disabled={isLoading}
            />
            {validationErrors.username && (
              <span className={styles.errorText}>
                {validationErrors.username}
              </span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`${styles.input} ${
                validationErrors.password ? styles.inputError : ''
              }`}
              placeholder="Enter password"
              disabled={isLoading}
            />
            {validationErrors.password && (
              <span className={styles.errorText}>
                {validationErrors.password}
              </span>
            )}
          </div>

          {error && (
            <div className={styles.serverError}>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? <Loader size="small" /> : 'Login'}
          </button>
        </form>

        <div className={styles.demoCredentials}>
          <h3>Demo credentials for login:</h3>
          <div className={styles.credentialsList}>
            <div className={styles.credential}>
              <p><strong>Username:</strong> emilys</p>
              <p><strong>Password:</strong> emilyspass</p>
            </div>
            <div className={styles.credential}>
              <p><strong>Username:</strong> michaelw</p>
              <p><strong>Password:</strong> michaelwpass</p>
            </div>
            <div className={styles.credential}>
              <p><strong>Username:</strong> sophiab</p>
              <p><strong>Password:</strong> sophiabpass</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}