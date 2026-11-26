import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  dismissToast,
  selectCartToasts,
  type CartToastItem,
} from '../features/cart/cartSlice';

interface ToastCardProps {
  toast: CartToastItem;
  onDismiss: (id: number) => void;
}

function ToastCard({ toast, onDismiss }: ToastCardProps) {
  const [isLeaving, setIsLeaving] = useState<boolean>(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => {
      setIsLeaving(true);
    }, 2500);

    const removeTimer = window.setTimeout(() => {
      onDismiss(toast.id);
    }, 2800);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, [toast.id, onDismiss]);

  const handleClose = (): void => {
    setIsLeaving(true);
    window.setTimeout(() => {
      onDismiss(toast.id);
    }, 220);
  };

  return (
    <div
      className={isLeaving ? 'cart-toast leaving' : 'cart-toast'}
      role="status"
      aria-live="polite"
    >
      <span className="cart-toast-icon" aria-hidden="true">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </span>

      <div className="cart-toast-body">
        {toast.message ? (
          <p className="cart-toast-message">{toast.message}</p>
        ) : (
          <>
            <p className="cart-toast-message">
              Đã thêm <strong>{toast.productTitle}</strong> vào giỏ hàng!
            </p>
            <Link
              to="/cart"
              className="cart-toast-link"
              onClick={() => onDismiss(toast.id)}
            >
              Xem giỏ hàng →
            </Link>
          </>
        )}
      </div>

      <button
        type="button"
        className="cart-toast-close"
        onClick={handleClose}
        aria-label="Đóng thông báo"
      >
        ×
      </button>
    </div>
  );
}

export function CartToast() {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector(selectCartToasts);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="cart-toast-container" aria-label="Thông báo giỏ hàng">
      {toasts.map((toast) => (
        <ToastCard
          key={toast.id}
          toast={toast}
          onDismiss={(id) => dispatch(dismissToast(id))}
        />
      ))}
    </div>
  );
}
