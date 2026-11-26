import type { Product } from '../types';

interface HeroBannerProps {
  featuredProduct?: Product;
  onShopNow: () => void;
}

export function HeroBanner({ featuredProduct, onShopNow }: HeroBannerProps) {
  return (
    <section className="hero-banner">
      <div className="hero-content">
        <span className="hero-pill">New Arrival</span>
        <h1 className="hero-title">
          Style &amp; Tech That <span>Moves You</span>
        </h1>
        <p className="hero-subtitle">
          Khám phá bộ sưu tập sản phẩm chất lượng cao với mức giá ưu đãi mỗi
          ngày tại ShopMini.
        </p>
        <button type="button" className="btn hero-cta" onClick={onShopNow}>
          Shop Now →
        </button>
      </div>

      <div className="hero-visual">
        {featuredProduct ? (
          <div className="hero-product-showcase">
            <img
              src={featuredProduct.image}
              alt={featuredProduct.title}
              className="hero-product-img"
            />
          </div>
        ) : (
          <div className="hero-visual-placeholder" />
        )}
      </div>
    </section>
  );
}
