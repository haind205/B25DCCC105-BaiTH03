import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface TrendingListProps {
  products: Product[];
}

export function TrendingList({ products }: TrendingListProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="card trending-card">
      <div className="trending-header">
        <h3 className="widget-title">Trending Now</h3>
      </div>

      <ul className="trending-list">
        {products.map((product) => (
          <li key={product.id}>
            <Link to={`/products/${product.id}`} className="trending-item">
              <div className="trending-thumb-wrap">
                <img
                  src={product.image}
                  alt={product.title}
                  className="trending-thumb"
                  loading="lazy"
                />
              </div>
              <div className="trending-info">
                <p className="trending-title">{product.title}</p>
                <span className="trending-price">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
