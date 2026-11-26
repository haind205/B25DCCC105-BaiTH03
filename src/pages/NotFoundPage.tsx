import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="card status-box">
      <h1>404 - Không tìm thấy trang</h1>
      <p className="muted-text">Đường dẫn bạn truy cập không tồn tại.</p>
      <Link to="/" className="btn btn-primary">
        Về trang chủ
      </Link>
    </section>
  );
}
