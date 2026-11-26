import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { CartToast } from '../components/CartToast';

export function MainLayout() {
  return (
    <div className="app-wrapper">
      <Header />
      <CartToast />
      <main className="container main-content">
        <Outlet />
      </main>
    </div>
  );
}
