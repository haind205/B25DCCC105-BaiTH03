import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchProducts } from '../features/products/productsSlice';
import { addToCart } from '../features/cart/cartSlice';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const productId = Number(id);
  const product = items.find((item) => item.id === productId);

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="card status-box">Đang tải chi tiết sản phẩm...</div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="card status-box error-box">
        <p>Lỗi: {error}</p>
        <Link to="/" className="btn btn-outline">
          Về trang chủ
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="card status-box">
        <p>Không tìm thấy sản phẩm.</p>
        <Link to="/" className="btn btn-primary">
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  return (
    <section className="detail-page">
      <Link to="/" className="back-link">
        ← Quay lại danh sách
      </Link>

      <div className="card detail-card">
        <div className="detail-image-wrap">
          <img
            src={product.image}
            alt={product.title}
            className="detail-image"
          />
        </div>

        <div className="detail-info">
          <span className="product-category">{product.category}</span>
          <h1 className="detail-title">{product.title}</h1>
          <p className="detail-price">${product.price.toFixed(2)}</p>
          <p className="detail-description">{product.description}</p>
          <div className="detail-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => dispatch(addToCart(product))}
            >
              Thêm vào giỏ hàng
            </button>
            <Link to="/cart" className="btn btn-outline">
              Xem giỏ hàng
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
