import { useEffect, useState } from 'react';

/**
 * Hook to check if component has mounted on client side.
 * Helps to avoid hydration mismatch errors when using
 * client-side only data like localStorage.
 */
export const useHasMounted = (): boolean => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
};