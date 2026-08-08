import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './Layout.css';

export default function Layout() {
  const { pathname } = useLocation();
  const isChatPage = pathname === '/chat';
  const shouldHideFooter = ['/', '/assessment', '/chat'].includes(pathname);

  return (
    <div className={`layout${isChatPage ? ' layout-chat' : ''}`}>
      <Navbar />
      <main className={`main-content${isChatPage ? ' main-content-chat' : ''}`}>
        <Outlet />
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
}