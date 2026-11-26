import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchProducts } from '../features/products/productsSlice';
import { ProductCard } from '../components/ProductCard';
import { Sidebar } from '../components/Sidebar';
import { HeroBanner } from '../components/HeroBanner';
import { CategoryTabs } from '../components/CategoryTabs';
import { DealOfTheDay } from '../components/DealOfTheDay';
import { TrendingList } from '../components/TrendingList';
import { ProductSkeleton } from '../components/ProductSkeleton';

interface InfoItem {
  icon: ReactNode;
  title: string;
  desc: string;
}

const INFO_ITEMS: InfoItem[] = [
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 17h4V5H2v12h3" />
        <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5" />
        <circle cx="7.5" cy="17.5" r="2.5" />
        <circle cx="17.5" cy="17.5" r="2.5" />
      </svg>
    ),
    title: 'Free Shipping',
    desc: 'On orders over $50',
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    ),
    title: 'Easy Returns',
    desc: '30 days return policy',
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: 'Secure Payment',
    desc: '100% secure checkout',
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
    title: '24/7 Support',
    desc: 'Dedicated support',
  },
];

export function HomePage() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.products);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm = searchParams.get('q') ?? '';

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const filteredProducts = items.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredProduct =
    items.find((p) => p.category === 'electronics') ?? items[0];
  const dealProduct = items[1] ?? items[0];
  const trendingProducts = items.slice(0, 5);

  const productsSectionRef = useRef<HTMLElement>(null);

  const handleShopNow = (): void => {
    productsSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleClearFilters = (): void => {
    setSelectedCategory('all');
    if (searchTerm) {
      setSearchParams({}, { replace: true });
    }
  };

  return (
    <div className="shop-layout">
      <Sidebar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="shop-main">
        <HeroBanner
          featuredProduct={featuredProduct}
          onShopNow={handleShopNow}
        />

        <section className="card info-strip" aria-label="Lợi ích mua sắm">
          {INFO_ITEMS.map((item) => (
            <div key={item.title} className="info-item">
              <span className="info-icon" aria-hidden="true">
                {item.icon}
              </span>
              <div>
                <p className="info-title">{item.title}</p>
                <p className="info-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </section>

        <CategoryTabs
          products={items}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <section
          id="products-section"
          ref={productsSectionRef}
          className="products-section"
        >
          <div className="section-header">
            <h2 className="section-title">
              {selectedCategory === 'all'
                ? 'Recommended for You'
                : selectedCategory}
            </h2>
            {(selectedCategory !== 'all' || searchTerm.trim() !== '') && (
              <button
                type="button"
                className="link-reset"
                onClick={handleClearFilters}
              >
                Xóa bộ lọc
              </button>
            )}
          </div>

          {status === 'loading' && <ProductSkeleton count={8} />}

          {status === 'failed' && (
            <div className="card status-box error-box">
              <p>Không thể tải sản phẩm: {error}</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => void dispatch(fetchProducts())}
              >
                Thử lại
              </button>
            </div>
          )}

          {status === 'succeeded' && filteredProducts.length === 0 && (
            <div className="card status-box">
              <p>
                Không tìm thấy sản phẩm nào phù hợp
                {searchTerm ? ` với "${searchTerm}"` : ''}.
              </p>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleClearFilters}
              >
                Hiển thị tất cả sản phẩm
              </button>
            </div>
          )}

          {status === 'succeeded' && filteredProducts.length > 0 && (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>

      <aside className="right-col" aria-label="Ưu đãi và xu hướng">
        <DealOfTheDay product={dealProduct} />
        <TrendingList products={trendingProducts} />
      </aside>
    </div>
  );
}
