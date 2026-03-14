import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminPage from './pages/AdminPage';

// Secret admin path — เปลี่ยนได้ตามต้องการ
const ADMIN_PATH = 'admin';

export default function App() {
  return (
    <Routes>
      {/* Admin UI — ไม่มี Navbar/Footer */}
      <Route path={`/${ADMIN_PATH}`} element={<AdminPage />} />

      {/* Main Layout — มี Navbar/Footer */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-cream font-sans">
            <Navbar />
            <main className="min-h-[80vh]">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/product/:productId" element={<ProductDetailPage />} />
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        }
      />
    </Routes>
  );
}
