import { useState, useEffect } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminPage from './pages/AdminPage';

// Secret admin path — เปลี่ยนได้ตามต้องการ
const ADMIN_PATH = 'admin-panel';

type Page = 'home' | 'products' | 'product-detail' | 'admin';

function getInitialPage(): { page: Page; productId: string } {
  const hash = window.location.hash;
  if (hash === `#/${ADMIN_PATH}`) return { page: 'admin', productId: '' };
  if (hash.startsWith('#/product/')) return { page: 'product-detail', productId: hash.replace('#/product/', '') };
  if (hash === '#/products') return { page: 'products', productId: '' };
  return { page: 'home', productId: '' };
}

export default function App() {
  const init = getInitialPage();
  const [currentPage, setCurrentPage] = useState<Page>(init.page);
  const [selectedProductId, setSelectedProductId] = useState(init.productId);

  const handleNavigate = (page: string, productId?: string) => {
    setCurrentPage(page as Page);
    if (productId) setSelectedProductId(productId);
  };

  useEffect(() => {
    if (currentPage === 'admin') {
      window.history.pushState(null, '', `#/${ADMIN_PATH}`);
    } else if (currentPage === 'product-detail' && selectedProductId) {
      window.history.pushState(null, '', `#/product/${selectedProductId}`);
    } else if (currentPage === 'products') {
      window.history.pushState(null, '', '#/products');
    } else {
      window.history.pushState(null, '', '#/');
    }
  }, [currentPage, selectedProductId]);

  // Admin page — ไม่มี Navbar/Footer
  if (currentPage === 'admin') return <AdminPage />;

  const renderPage = () => {
    switch (currentPage) {
      case 'products':
        return <ProductListPage onNavigate={handleNavigate} />;
      case 'product-detail':
        return <ProductDetailPage productId={selectedProductId} onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-cream font-sans">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="min-h-[80vh]">{renderPage()}</main>
      <Footer />
    </div>
  );
}
