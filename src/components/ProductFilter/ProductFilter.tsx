'use client';

import { useState, useEffect } from 'react';
import styles from './ProductFilter.module.scss';

interface Category {
  slug: string;
  name: string;
  url: string;
}

interface ProductFilterProps {
  onCategoryChange: (category: string) => void;
  currentCategory: string;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  onCategoryChange,
  currentCategory,
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://dummyjson.com/products/categories');
        const categoriesData: Category[] = await response.json();
        
        const categoryNames = categoriesData.map(cat => cat.slug);
        setCategories(categoryNames);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([
          'beauty', 'fragrances', 'furniture', 'groceries',
          'home-decoration', 'kitchen-accessories', 'laptops',
          'mens-shirts', 'mens-shoes', 'mens-watches',
          'mobile-accessories', 'motorcycle', 'skin-care',
          'smartphones', 'sports-accessories', 'sunglasses',
          'tablets', 'tops', 'vehicle', 'womens-bags',
          'womens-dresses', 'womens-jewellery', 'womens-shoes',
          'womens-watches'
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className={styles.filter}>
      <h3 className={styles.title}>Filter by category</h3>
      <div className={styles.categories}>
        <button
          onClick={() => onCategoryChange('all')}
          className={`${styles.categoryButton} ${
            currentCategory === 'all' ? styles.active : ''
          }`}
          type="button"
        >
          All
        </button>
        {isLoading ? (
          <div className={styles.loading}>Loading categories...</div>
        ) : (
          categories.map((category, index) => (
            <button
              key={`category-${index}-${category}`}
              onClick={() => onCategoryChange(category)}
              className={`${styles.categoryButton} ${
                currentCategory === category ? styles.active : ''
              }`}
              type="button"
            >
              {category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')}
            </button>
          ))
        )}
      </div>
    </div>
  );
};