import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loadOrderHistory } from '../utils/storage';

interface AccountLocationState {
  from?: string;
  requireShippingInfo?: boolean;
}

export function AccountPage() {
  const { user, updateProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const state = location.state as AccountLocationState | null;
  const requireShippingInfo = Boolean(state?.requireShippingInfo);
  const activeTab = searchParams.get('tab') === 'orders' ? 'orders' : 'profile';

  const [fullName, setFullName] = useState<string>(
    user?.fullName ?? user?.username ?? ''
  );
  const [email, setEmail] = useState<string>(user?.email ?? '');
  const [phone, setPhone] = useState<string>(user?.phone ?? '');
  const [address, setAddress] = useState<string>(user?.address ?? '');
  const [avatar, setAvatar] = useState<string>(user?.avatar ?? '');
  const [formError, setFormError] = useState<string>('');
  const [highlightMissing, setHighlightMissing] =
    useState<boolean>(requireShippingInfo);

  useEffect(() => {
    setFullName(user?.fullName ?? user?.username ?? '');
    setEmail(user?.email ?? '');
    setPhone(user?.phone ?? '');
    setAddress(user?.address ?? '');
    setAvatar(user?.avatar ?? '');
  }, [user]);

  useEffect(() => {
    if (requireShippingInfo) {
      setHighlightMissing(true);
    }
  }, [requireShippingInfo]);

  if (!user) {
    return null;
  }

  const orders = loadOrderHistory(user.username);
  const isPhoneInvalid = highlightMissing && !phone.trim();
  const isAddressInvalid = highlightMissing && !address.trim();

  const handleAvatarFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setFormError('');

    const trimmedPhone = phone.trim();
    const trimmedAddress = address.trim();

    if (requireShippingInfo && (!trimmedPhone || !trimmedAddress)) {
      setHighlightMissing(true);
      setFormError(
        'Vui lòng nhập đầy đủ Số điện thoại và Địa chỉ nhận hàng để tiếp tục thanh toán.'
      );
      return;
    }

    updateProfile({
      fullName: fullName.trim() || user.username,
      email: email.trim(),
      phone: trimmedPhone,
      address: trimmedAddress,
      avatar: avatar.trim(),
    });

    if (state?.from === '/checkout' && trimmedPhone && trimmedAddress) {
      navigate('/checkout', { replace: true });
    }
  };

  const displayName = fullName.trim() || user.username;

  return (
    <section className="account-page">
      <div className="account-header">
        <div>
          <h1 className="page-title">Tài khoản của tôi</h1>
          <p className="muted-text">
            Quản lý thông tin hồ sơ và lịch sử đơn hàng của bạn
          </p>
        </div>

        <div className="account-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'profile'}
            className={
              activeTab === 'profile' ? 'account-tab active' : 'account-tab'
            }
            onClick={() => setSearchParams({}, { replace: true })}
          >
            Hồ sơ cá nhân
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'orders'}
            className={
              activeTab === 'orders' ? 'account-tab active' : 'account-tab'
            }
            onClick={() => setSearchParams({ tab: 'orders' }, { replace: true })}
          >
            Đơn mua ({orders.length})
          </button>
        </div>
      </div>

      {activeTab === 'profile' ? (
        <form className="card account-card" onSubmit={handleSubmit} noValidate>
          {requireShippingInfo && (
            <div className="account-warning-banner" role="alert">
              Vui lòng cập nhật đầy đủ <strong>Số điện thoại</strong> và{' '}
              <strong>Địa chỉ nhận hàng</strong> trước khi tiến hành thanh toán.
            </div>
          )}

          <div className="account-avatar-section">
            <div className="account-avatar-preview">
              {avatar.trim() ? (
                <img src={avatar.trim()} alt={displayName} />
              ) : (
                <span>{displayName.charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div className="account-avatar-controls">
              <div className="form-group">
                <label htmlFor="avatarUrl">URL ảnh đại diện</label>
                <input
                  id="avatarUrl"
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div className="account-upload-row">
                <label className="btn btn-outline btn-sm account-upload-label">
                  Tải ảnh từ máy
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    hidden
                  />
                </label>
                {avatar && (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setAvatar('')}
                  >
                    Xóa ảnh
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="account-fields-grid">
            <div className="form-group">
              <label htmlFor="accountUsername">Tên đăng nhập</label>
              <input
                id="accountUsername"
                type="text"
                value={user.username}
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="accountFullName">Tên hiển thị</label>
              <input
                id="accountFullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nhập tên hiển thị"
              />
            </div>

            <div className="form-group">
              <label htmlFor="accountEmail">Email</label>
              <input
                id="accountEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="accountPhone">
                Số điện thoại <span className="required-mark">*</span>
              </label>
              <input
                id="accountPhone"
                type="tel"
                className={isPhoneInvalid ? 'input-error' : ''}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại nhận hàng"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="accountAddress">
              Địa chỉ nhận hàng <span className="required-mark">*</span>
            </label>
            <input
              id="accountAddress"
              type="text"
              className={isAddressInvalid ? 'input-error' : ''}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
            />
          </div>

          {formError && (
            <p className="login-error-text" role="alert">
              {formError}
            </p>
          )}

          <div className="account-actions">
            <button type="submit" className="btn btn-primary">
              {state?.from === '/checkout'
                ? 'Lưu & Tiếp tục thanh toán'
                : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      ) : (
        <div className="account-orders-list">
          {orders.length === 0 ? (
            <div className="card status-box">
              <h2>Chưa có đơn hàng nào</h2>
              <p className="muted-text">
                Bạn chưa đặt đơn hàng nào tại ShopMini.
              </p>
              <Link to="/" className="btn btn-primary">
                Mua sắm ngay
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="card order-history-card">
                <div className="order-history-head">
                  <div>
                    <strong>Đơn #{order.id}</strong>
                    <span className="muted-text order-date">
                      {' '}
                      • {new Date(order.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <strong className="summary-total">
                    ${order.totalPrice.toFixed(2)}
                  </strong>
                </div>

                <p className="muted-text order-shipping-line">
                  Giao tới: {order.customerName} — {order.phone} —{' '}
                  {order.address}
                </p>

                <ul className="checkout-list">
                  {order.items.map(({ product, quantity }) => (
                    <li key={product.id} className="checkout-item">
                      <span>
                        {product.title} × {quantity}
                      </span>
                      <strong>${(product.price * quantity).toFixed(2)}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
