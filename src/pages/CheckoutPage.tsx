import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  clearCart,
  selectCartItems,
  selectCartTotalPrice,
  selectCartTotalQuantity,
} from '../features/cart/cartSlice';
import { useAuth } from '../contexts/AuthContext';

export function CheckoutPage() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const items = useAppSelector(selectCartItems);
  const totalQuantity = useAppSelector(selectCartTotalQuantity);
  const totalPrice = useAppSelector(selectCartTotalPrice);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);

  const handlePlaceOrder = (): void => {
    dispatch(clearCart());
    setOrderSuccess(true);
  };

  if (orderSuccess) {
    return (
      <section className="checkout-page">
        <div className="card status-box success-box checkout-status-box">
          <h1>Đặt hàng thành công!</h1>
          <p>
            Cảm ơn <strong>{user?.username}</strong> đã mua sắm tại ShopMini.
          </p>
          <Link to="/" className="btn btn-primary checkout-action-btn">
            Quay lại trang chủ
          </Link>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="checkout-page">
        <div className="card status-box checkout-status-box">
          <h1>Giỏ hàng trống</h1>
          <p className="muted-text">
            Vui lòng thêm sản phẩm trước khi thanh toán.
          </p>
          <Link to="/" className="btn btn-primary checkout-action-btn">
            Mua sắm ngay
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <div className="card checkout-card">
        <header className="checkout-header">
          <h1 className="checkout-title">Thanh toán</h1>
          <p className="checkout-subtitle">
            Kiểm tra thông tin đơn hàng trước khi xác nhận
          </p>
        </header>

        <div className="checkout-meta">
          <div className="checkout-meta-row">
            <span className="muted-text">Khách hàng</span>
            <strong>{user?.username}</strong>
          </div>
          <div className="checkout-meta-row">
            <span className="muted-text">Tổng số lượng</span>
            <strong>{totalQuantity} sản phẩm</strong>
          </div>
        </div>

        <div className="checkout-items-section">
          <h2 className="checkout-section-label">Sản phẩm</h2>
          <ul className="checkout-list">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="checkout-item">
                <span className="checkout-item-name">
                  {product.title}{' '}
                  <span className="checkout-item-qty">× {quantity}</span>
                </span>
                <strong className="checkout-item-price">
                  ${(product.price * quantity).toFixed(2)}
                </strong>
              </li>
            ))}
          </ul>
        </div>

        <div className="summary-row checkout-total">
          <span>Tổng thanh toán</span>
          <strong className="summary-total">${totalPrice.toFixed(2)}</strong>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-full checkout-submit-btn"
          onClick={handlePlaceOrder}
        >
          Đặt hàng
        </button>
      </div>
    </section>
  );
}
