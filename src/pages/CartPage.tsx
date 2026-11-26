import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  clearCart,
  removeFromCart,
  selectCartItems,
  selectCartTotalPrice,
  selectCartTotalQuantity,
  updateQuantity,
} from '../features/cart/cartSlice';

export function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const totalQuantity = useAppSelector(selectCartTotalQuantity);
  const totalPrice = useAppSelector(selectCartTotalPrice);

  if (items.length === 0) {
    return (
      <section className="cart-empty-box">
        <div className="cart-empty-icon" aria-hidden="true">
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="20" r="1.5" />
            <circle cx="17" cy="20" r="1.5" />
            <path d="M3 4h2l2.4 10.5a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 7H6" />
          </svg>
        </div>
        <h1 className="cart-empty-title">Giỏ hàng trống</h1>
        <p className="muted-text">
          Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá thêm các sản
          phẩm tại ShopMini.
        </p>
        <Link to="/" className="cart-sharp-btn">
          Tiếp tục mua sắm
        </Link>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="cart-header">
        <div>
          <h1 className="cart-heading">Giỏ hàng</h1>
          <p className="cart-subheading">{totalQuantity} sản phẩm</p>
        </div>

        <button
          type="button"
          className="cart-clear-btn"
          onClick={() => dispatch(clearCart())}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
          <span>Xóa tất cả</span>
        </button>
      </div>

      <div className="cart-grid">
        {/* Cột trái: danh sách dạng bảng */}
        <div className="cart-table-wrap">
          <div className="cart-table-head" aria-hidden="true">
            <span>Sản phẩm</span>
            <span>Đơn giá</span>
            <span>Số lượng</span>
            <span className="cart-col-right">Thành tiền</span>
          </div>

          <div className="cart-table-body">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="cart-row">
                <div className="cart-cell-product">
                  <Link
                    to={`/products/${product.id}`}
                    className="cart-item-image-wrap"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="cart-item-image"
                    />
                  </Link>
                  <div className="cart-item-info">
                    <Link
                      to={`/products/${product.id}`}
                      className="cart-item-title"
                    >
                      {product.title}
                    </Link>
                    <button
                      type="button"
                      className="cart-remove-link"
                      onClick={() => dispatch(removeFromCart(product.id))}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>

                <div className="cart-cell-price">
                  <span className="cart-mobile-label">Đơn giá:</span>
                  <span>${product.price.toFixed(2)}</span>
                </div>

                <div className="cart-cell-qty">
                  <div className="cart-qty-box">
                    <button
                      type="button"
                      className="cart-qty-btn"
                      aria-label={`Giảm số lượng ${product.title}`}
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: product.id,
                            quantity: quantity - 1,
                          })
                        )
                      }
                    >
                      −
                    </button>
                    <span className="cart-qty-val">{quantity}</span>
                    <button
                      type="button"
                      className="cart-qty-btn"
                      aria-label={`Tăng số lượng ${product.title}`}
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: product.id,
                            quantity: quantity + 1,
                          })
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-cell-subtotal">
                  <span className="cart-mobile-label">Thành tiền:</span>
                  <strong>${(product.price * quantity).toFixed(2)}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cột phải: Tóm tắt đơn hàng */}
        <aside className="cart-summary">
          <h2 className="cart-summary-title">Tóm tắt</h2>

          <div className="cart-summary-rows">
            <div className="summary-row">
              <span>Tổng số lượng</span>
              <strong>{totalQuantity}</strong>
            </div>
            <div className="summary-row">
              <span>Tạm tính</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Phí vận chuyển</span>
              <span>Miễn phí</span>
            </div>
          </div>

          <div className="cart-summary-divider" />

          <div className="summary-row cart-summary-total-row">
            <span>Tổng tiền</span>
            <strong className="summary-total">${totalPrice.toFixed(2)}</strong>
          </div>

          <Link to="/checkout" className="cart-checkout-btn">
            Tiến hành thanh toán
          </Link>
        </aside>
      </div>

      {/* Hàng 3 ô thông tin dưới cùng */}
      <div className="cart-trust-grid">
        <div className="cart-trust-box">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span>Thanh toán an toàn</span>
        </div>

        <div className="cart-trust-box">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10 17h4V5H2v12h3" />
            <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5" />
            <circle cx="7.5" cy="17.5" r="2.5" />
            <circle cx="17.5" cy="17.5" r="2.5" />
          </svg>
          <span>Miễn phí giao hàng và đổi trả</span>
        </div>

        <div className="cart-trust-box">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
          </svg>
          <span>Hỗ trợ đầy đủ</span>
        </div>
      </div>
    </section>
  );
}
