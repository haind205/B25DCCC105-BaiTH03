import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LocationState {
  from?: {
    pathname: string;
  };
}

type AuthMode = 'login' | 'register';

export function LoginPage() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<AuthMode>('login');
  const [fullName, setFullName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const state = location.state as LocationState | null;
  const from = state?.from?.pathname ?? '/';

  if (user) {
    return <Navigate to={from} replace />;
  }

  const switchMode = (nextMode: AuthMode): void => {
    setMode(nextMode);
    setErrorMessage('');
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'login') {
      const isSuccess = login(username, password);
      if (!isSuccess) {
        setErrorMessage(
          'Tên đăng nhập hoặc mật khẩu không đúng (mật khẩu demo: "123456").'
        );
        return;
      }
      navigate(from, { replace: true });
      return;
    }

    if (!fullName.trim() || !username.trim() || !password || !confirmPassword) {
      setErrorMessage('Vui lòng điền đầy đủ tất cả các trường bắt buộc.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Mật khẩu phải có tối thiểu 6 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Xác nhận mật khẩu không khớp với mật khẩu.');
      return;
    }

    const result = register(fullName, username, password);
    if (!result.ok) {
      setErrorMessage(result.error ?? 'Không thể đăng ký tài khoản.');
      return;
    }

    navigate(from, { replace: true });
  };

  const renderEyeIcon = (isVisible: boolean) =>
    isVisible ? (
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
    );

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
              {mode === 'login'
                ? 'Đăng nhập để quản lý giỏ hàng, theo dõi đơn hàng và trải nghiệm thanh toán nhanh chóng, tiện lợi mỗi ngày.'
                : 'Tạo tài khoản ShopMini miễn phí để lưu giỏ hàng riêng và mua sắm tiện lợi hơn trên mọi thiết bị.'}
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

        {/* Cột phải: thẻ đăng nhập / đăng ký */}
        <div className="login-form-col">
          <div className="login-card-wrapper">
            <div className="login-card-accent" aria-hidden="true" />

            <form className="login-glass-card" onSubmit={handleSubmit} noValidate>
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
                <h2 className="login-card-title">
                  {mode === 'login'
                    ? 'Đăng nhập ShopMini'
                    : 'Đăng ký tài khoản'}
                </h2>
                <p className="login-card-subtitle">
                  {mode === 'login' ? (
                    <>
                      Mật khẩu tài khoản demo: <code>123456</code>
                    </>
                  ) : (
                    'Điền thông tin bên dưới để tạo tài khoản mới'
                  )}
                </p>
              </div>

              <div className="login-tabs" role="tablist" aria-label="Chế độ xác thực">
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'login'}
                  className={
                    mode === 'login' ? 'login-tab active' : 'login-tab'
                  }
                  onClick={() => switchMode('login')}
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'register'}
                  className={
                    mode === 'register' ? 'login-tab active' : 'login-tab'
                  }
                  onClick={() => switchMode('register')}
                >
                  Đăng ký
                </button>
              </div>

              {mode === 'register' && (
                <div className="login-field">
                  <label htmlFor="fullName">Họ tên</label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nhập họ tên của bạn"
                    required
                  />
                </div>
              )}

              <div className="login-field">
                <label htmlFor="username">
                  {mode === 'login' ? 'Tên đăng nhập' : 'Tên đăng nhập / Email'}
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={
                    mode === 'login'
                      ? 'Nhập tên của bạn'
                      : 'Nhập tên đăng nhập hoặc email'
                  }
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
                    placeholder={
                      mode === 'login'
                        ? 'Nhập 123456 hoặc mật khẩu đã đăng ký'
                        : 'Tối thiểu 6 ký tự'
                    }
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
                    {renderEyeIcon(showPassword)}
                  </button>
                </div>
              </div>

              {mode === 'register' && (
                <div className="login-field">
                  <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                  <div className="login-password-wrap">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu"
                      required
                    />
                    <button
                      type="button"
                      className="login-eye-btn"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={
                        showConfirmPassword
                          ? 'Ẩn xác nhận mật khẩu'
                          : 'Hiện xác nhận mật khẩu'
                      }
                    >
                      {renderEyeIcon(showConfirmPassword)}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'login' && (
                <div className="login-extras-row">
                  <label className="login-remember">
                    <input type="checkbox" defaultChecked />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>
                  <span className="login-forgot">Quên mật khẩu?</span>
                </div>
              )}

              <button type="submit" className="login-submit-btn">
                <span>{mode === 'login' ? 'Đăng nhập' : 'Đăng ký ngay'}</span>
                <span aria-hidden="true">→</span>
              </button>

              {errorMessage && (
                <p className="login-error-text" role="alert">
                  {errorMessage}
                </p>
              )}

              <p className="login-switch-text">
                {mode === 'login' ? (
                  <>
                    Chưa có tài khoản?{' '}
                    <button
                      type="button"
                      className="login-switch-btn"
                      onClick={() => switchMode('register')}
                    >
                      Đăng ký ngay
                    </button>
                  </>
                ) : (
                  <>
                    Đã có tài khoản?{' '}
                    <button
                      type="button"
                      className="login-switch-btn"
                      onClick={() => switchMode('login')}
                    >
                      Đăng nhập
                    </button>
                  </>
                )}
              </p>

              <div className="login-trust-badges">
                <span className="trust-badge">🔒 Đăng nhập an toàn</span>
                <span className="trust-badge">🛡️ Bảo mật SSL</span>
                <span className="trust-badge">🔑 Mã hoá dữ liệu</span>
              </div>

              <p className="login-terms">
                Bằng việc tiếp tục, bạn đồng ý với{' '}
                <span>Điều khoản và Chính sách bảo mật</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
