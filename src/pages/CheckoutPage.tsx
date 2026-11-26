import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  clearCart,
  selectCartItems,
  selectCartTotalPrice,
  selectCartTotalQuantity,
} from '../features/cart/cartSlice';
import { useAuth } from '../contexts/AuthContext';
import { saveOrderRecord } from '../utils/storage';

export function CheckoutPage() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const items = useAppSelector(selectCartItems);
  const totalQuantity = useAppSelector(selectCartTotalQuantity);
  const totalPrice = useAppSelector(selectCartTotalPrice);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);

  const hasMissingShippingInfo =
    !user?.phone?.trim() || !user?.address?.trim();

  if (!orderSuccess && items.length > 0 && hasMissingShippingInfo) {
    return (
      <Navigate
        to="/account"
        state={{ from: '/checkout', requireShippingInfo: true }}
        replace
      />
    );
  }

  const displayName = user?.fullName?.trim() || user?.username || '';

  const handlePlaceOrder = (): void => {
    if (user) {
      saveOrderRecord(user.username, {
        id: String(Date.now()).slice(-6),
        createdAt: new Date().toISOString(),
        items,
        totalQuantity,
        totalPrice,
        customerName: displayName,
        phone: user.phone ?? '',
        address: user.address ?? '',
      });
    }
    dispatch(clearCart());
    setOrderSuccess(true);
  };

  if (orderSuccess) {
    return (
      <section className="checkout-page">
        <div className="card status-box success-box checkout-status-box">
          <h1>Đặt hàng thành công!</h1>
          <p>
            Cảm ơn <strong>{displayName}</strong> đã mua sắm tại ShopMini.
          </p>
          <div className="detail-actions">
            <Link to="/" className="btn btn-primary checkout-action-btn">
              Quay lại trang chủ
            </Link>
            <Link
              to="/account?tab=orders"
              className="btn btn-outline checkout-action-btn"
            >
              Xem đơn mua
            </Link>
          </div>
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
            <strong>{displayName}</strong>
          </div>
          <div className="checkout-meta-row">
            <span className="muted-text">Số điện thoại</span>
            <strong>{user?.phone}</strong>
          </div>
          <div className="checkout-meta-row">
            <span className="muted-text">Địa chỉ nhận hàng</span>
            <strong className="checkout-address-val">{user?.address}</strong>
          </div>
          <div className="checkout-meta-row">
            <span className="muted-text">Tổng số lượng</span>
            <strong>{totalQuantity} sản phẩm</strong>
          </div>
          <div className="checkout-meta-edit">
            <Link to="/account" className="link-reset">
              Thay đổi thông tin nhận hàng
            </Link>
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
