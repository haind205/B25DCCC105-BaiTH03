import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LocationState {
  from?: {
    pathname: string;
  };
}

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const state = location.state as LocationState | null;
  const from = state?.from?.pathname ?? '/';

  if (user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const isSuccess = login(username, password);
    if (!isSuccess) {
      setErrorMessage(
        'Tên đăng nhập không được để trống và mật khẩu phải là "123456".'
      );
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <section className="login-portal">
      <div className="login-bg-circle login-bg-circle-1" aria-hidden="true" />
      <div className="login-bg-circle login-bg-circle-2" aria-hidden="true" />

      <div className="login-portal-grid">
        {/* Cột trái: chỉ hiện trên desktop */}
        <div className="login-info-col">
          <div className="login-brand-mini">
            <span className="login-brand-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 7h12l1 13H5L6 7z" />
                <path d="M9 7V5a3 3 0 0 1 6 0v2" />
              </svg>
            </span>
            <div>
              <span className="login-brand-name">ShopMini</span>
              <span className="login-brand-sub">Cửa hàng trực tuyến</span>
            </div>
          </div>

          <div className="login-hero-block">
            <span className="login-welcome-badge">Chào mừng trở lại</span>
            <h1 className="login-hero-heading">
              Mua sắm dễ dàng cùng
              <span>ShopMini.</span>
            </h1>
            <p className="login-hero-desc">
              Đăng nhập để quản lý giỏ hàng, theo dõi đơn hàng và trải nghiệm
              thanh toán nhanh chóng, tiện lợi mỗi ngày.
            </p>

            <div className="login-feature-pills">
              <div className="login-feature-pill">
                <span aria-hidden="true">🚚</span>
                <span>Giao hàng nhanh</span>
              </div>
              <div className="login-feature-pill">
                <span aria-hidden="true">🛡️</span>
                <span>Thanh toán an toàn</span>
              </div>
              <div className="login-feature-pill">
                <span aria-hidden="true">🔄</span>
                <span>Đổi trả dễ dàng</span>
              </div>
            </div>
          </div>

          <p className="login-copyright">
            © 2026 ShopMini. All rights reserved.
          </p>
        </div>

        {/* Cột phải: thẻ đăng nhập */}
        <div className="login-form-col">
          <div className="login-card-wrapper">
            <div className="login-card-accent" aria-hidden="true" />

            <form className="login-glass-card" onSubmit={handleSubmit}>
              <div className="login-card-header">
                <div className="login-card-logo" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 7h12l1 13H5L6 7z" />
                    <path d="M9 7V5a3 3 0 0 1 6 0v2" />
                  </svg>
                </div>
                <h2 className="login-card-title">Đăng nhập ShopMini</h2>
                <p className="login-card-subtitle">
                  Mật khẩu mặc định: <code>123456</code>
                </p>
              </div>

              <div className="login-field">
                <label htmlFor="username">Tên đăng nhập</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên của bạn"
                  required
                />
              </div>

              <div className="login-field">
                <label htmlFor="password">Mật khẩu</label>
                <div className="login-password-wrap">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập 123456"
                    required
                  />
                  <button
                    type="button"
                    className="login-eye-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'
                    }
                  >
                    {showPassword ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.77 21.77 0 0 1 5.06-6.94" />
                        <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.8 21.8 0 0 1-3.17 4.49" />
                        <path d="M1 1l22 22" />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="login-extras-row">
                <label className="login-remember">
                  <input type="checkbox" defaultChecked />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <span className="login-forgot">Quên mật khẩu?</span>
              </div>

              <button type="submit" className="login-submit-btn">
                <span>Đăng nhập</span>
                <span aria-hidden="true">→</span>
              </button>

              {errorMessage && (
                <p className="login-error-text" role="alert">
                  {errorMessage}
                </p>
              )}

              <div className="login-trust-badges">
                <span className="trust-badge">🔒 Đăng nhập an toàn</span>
                <span className="trust-badge">🛡️ Bảo mật SSL</span>
                <span className="trust-badge">🔑 Mã hoá dữ liệu</span>
              </div>

              <p className="login-terms">
                Bằng việc đăng nhập, bạn đồng ý với{' '}
                <span>Điều khoản và Chính sách bảo mật</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
