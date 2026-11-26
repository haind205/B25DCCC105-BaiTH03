import { useEffect, useState, type FormEvent } from 'react';
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectCartTotalQuantity } from '../features/cart/cartSlice';
import { useAuth } from '../contexts/AuthContext';
import { ThemeSwitch } from './ThemeSwitch';

export function Header() {
  const totalQuantity = useAppSelector(selectCartTotalQuantity);
  const { user, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const queryFromUrl = searchParams.get('q') ?? '';
  const [searchValue, setSearchValue] = useState<string>(queryFromUrl);

  useEffect(() => {
    setSearchValue(queryFromUrl);
  }, [queryFromUrl]);

  const handleSearchChange = (value: string): void => {
    setSearchValue(value);
    if (location.pathname === '/') {
      const next = new URLSearchParams(searchParams);
      if (value.trim()) {
        next.set('q', value);
      } else {
        next.delete('q');
      }
      setSearchParams(next, { replace: true });
    }
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const trimmed = searchValue.trim();
    if (trimmed) {
      navigate(`/?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <span className="logo-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 7h12l1 13H5L6 7z" />
              <path d="M9 7V5a3 3 0 0 1 6 0v2" />
            </svg>
          </span>
          <span className="logo-text">ShopMini</span>
        </Link>

        {location.pathname === '/' && (
          <form className="header-search" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              className="header-search-input"
              placeholder="Tìm kiếm sản phẩm theo tên..."
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              aria-label="Tìm kiếm sản phẩm"
            />
            <button
              type="submit"
              className="header-search-btn"
              aria-label="Tìm kiếm"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
          </form>
        )}

        <div className="header-actions">
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive ? 'icon-action-link active' : 'icon-action-link'
            }
            aria-label="Giỏ hàng"
          >
            <svg
              className="action-svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="17" cy="20" r="1.5" />
              <path d="M3 4h2l2.4 10.5a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 7H6" />
            </svg>
            <span className="cart-badge">{totalQuantity}</span>
          </NavLink>

          {user ? (
            <div className="user-actions">
              <span className="user-pill">
                <span className="user-avatar" aria-hidden="true">
                  {user.username.charAt(0).toUpperCase()}
                </span>
                <span className="username">{user.username}</span>
              </span>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={logout}
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="btn btn-primary btn-sm">
              Đăng nhập
            </NavLink>
          )}

          <ThemeSwitch />
        </div>
      </div>
    </header>
  );
}
