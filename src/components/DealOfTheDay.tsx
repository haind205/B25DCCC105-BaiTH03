import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useAppDispatch } from '../app/hooks';
import { addToCart } from '../features/cart/cartSlice';

interface DealOfTheDayProps {
  product?: Product;
}

const INITIAL_SECONDS = 12 * 3600 + 45 * 60 + 30;

export function DealOfTheDay({ product }: DealOfTheDayProps) {
  const dispatch = useAppDispatch();
  const [secondsLeft, setSecondsLeft] = useState<number>(INITIAL_SECONDS);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : INITIAL_SECONDS));
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  if (!product) {
    return null;
  }

  const hours = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((secondsLeft % 3600) / 60)).padStart(
    2,
    '0'
  );
  const seconds = String(secondsLeft % 60).padStart(2, '0');
  const originalPrice = product.price * 1.25;

  return (
    <div className="card deal-card">
      <div className="deal-header">
        <h3 className="widget-title">Deal of the Day</h3>
        <div className="countdown" aria-label="Thời gian còn lại">
          <div className="time-box">
            <strong>{hours}</strong>
            <span>Hrs</span>
          </div>
          <div className="time-box">
            <strong>{minutes}</strong>
            <span>Min</span>
          </div>
          <div className="time-box">
            <strong>{seconds}</strong>
            <span>Sec</span>
          </div>
        </div>
      </div>

      <Link to={`/products/${product.id}`} className="deal-image-wrap">
        <img src={product.image} alt={product.title} className="deal-image" />
      </Link>

      <div className="deal-body">
        <span className="discount-badge">-20%</span>
        <Link to={`/products/${product.id}`} className="deal-title">
          {product.title}
        </Link>
        <div className="deal-prices">
          <span className="deal-price-new">${product.price.toFixed(2)}</span>
          <span className="deal-price-old">${originalPrice.toFixed(2)}</span>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-full"
          onClick={() => dispatch(addToCart(product))}
        >
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}
