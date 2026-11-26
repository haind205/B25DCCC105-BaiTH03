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
      <section className="card status-box success-box">
        <h1>Đặt hàng thành công!</h1>
        <p>
          Cảm ơn <strong>{user?.username}</strong> đã mua sắm tại ShopMini.
        </p>
        <Link to="/" className="btn btn-primary">
          Quay lại trang chủ
        </Link>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="card status-box">
        <h1>Giỏ hàng trống</h1>
        <p className="muted-text">Vui lòng thêm sản phẩm trước khi thanh toán.</p>
        <Link to="/" className="btn btn-primary">
          Mua sắm ngay
        </Link>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <h1 className="page-title">Thanh toán</h1>

      <div className="card checkout-card">
        <p>
          <strong>Khách hàng:</strong> {user?.username}
        </p>
        <p>
          <strong>Tổng số lượng:</strong> {totalQuantity} sản phẩm
        </p>

        <ul className="checkout-list">
          {items.map(({ product, quantity }) => (
            <li key={product.id} className="checkout-item">
              <span>
                {product.title} × {quantity}
              </span>
              <span>${(product.price * quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>

        <div className="summary-row checkout-total">
          <span>Tổng thanh toán:</span>
          <strong className="summary-total">${totalPrice.toFixed(2)}</strong>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-full"
          onClick={handlePlaceOrder}
        >
          Đặt hàng
        </button>
      </div>
    </section>
  );
}
