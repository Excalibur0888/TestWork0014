import styles from './Loader.module.scss';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'medium',
  className = '',
}) => {
  return (
    <div className={`${styles.loader} ${styles[size]} ${className}`}>
      <div className={styles.spinner}></div>
    </div>
  );
};