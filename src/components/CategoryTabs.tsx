import type { Product } from '../types';
import { SHOP_CATEGORIES } from './Sidebar';

interface CategoryTabsProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryTabs({
  products,
  selectedCategory,
  onSelectCategory,
}: CategoryTabsProps) {
  const apiCategories = SHOP_CATEGORIES.filter((cat) => cat.id !== 'all');

  return (
    <section className="category-section">
      <div className="section-header">
        <h2 className="section-title">Shop by Category</h2>
        {selectedCategory !== 'all' && (
          <button
            type="button"
            className="link-reset"
            onClick={() => onSelectCategory('all')}
          >
            Xem tất cả →
          </button>
        )}
      </div>

      <div className="category-cards-grid">
        {apiCategories.map((cat) => {
          const sampleProduct = products.find((p) => p.category === cat.id);
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              className={isActive ? 'category-card active' : 'category-card'}
              onClick={() =>
                onSelectCategory(isActive ? 'all' : cat.id)
              }
            >
              <div className="category-thumb-wrap">
                {sampleProduct ? (
                  <img
                    src={sampleProduct.image}
                    alt={cat.label}
                    className="category-thumb"
                    loading="lazy"
                  />
                ) : (
                  <span className="category-emoji">{cat.icon}</span>
                )}
              </div>
              <span className="category-card-label">{cat.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
