'use client';

import { useEffect, useState } from 'react';
import { ProductCard, Loader, ProductFilter } from '@/components';
import { useProductsStore, useAuthStore } from '@/store';
import { useHasMounted } from '@/hooks';
import styles from './page.module.scss';

export default function Home() {
  const { products, isLoading, error, fetchProducts, fetchProductsByCategory } = useProductsStore();
  const { initializeAuth } = useAuthStore();
  const hasMounted = useHasMounted();
  const [currentCategory, setCurrentCategory] = useState('all');

  useEffect(() => {
    if (hasMounted) {
      initializeAuth();
      fetchProducts(12);
    }
  }, [hasMounted, fetchProducts, initializeAuth]);

  const handleCategoryChange = async (category: string) => {
    setCurrentCategory(category);
    if (category === 'all') {
      await fetchProducts(12);
    } else {
      await fetchProductsByCategory(category, 12);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader size="large" />
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className="error-message">
          <h2>Error loading products</h2>
          <p>{error}</p>
          <button
            onClick={() => fetchProducts(12)}
            className={styles.retryButton}
            type="button"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className="container">
        <h1 className={styles.title}>
          {currentCategory === 'all' 
            ? 'All products' 
            : `Category: ${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1).replace(/-/g, ' ')}`
          }
        </h1>
        
        <ProductFilter 
          onCategoryChange={handleCategoryChange}
          currentCategory={currentCategory}
        />
        
        {products.length > 0 ? (
          <div className={styles.productsGrid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>Products not found</p>
          </div>
        )}
      </div>
    </div>
  );
}