import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminPage from './pages/AdminPage';

/**
 * App Component
 * ศูนย์กลางการกำหนดเส้นทาง (Routing) ของแอปพลิเคชัน
 */

// เส้นทางลับสำหรับเข้าหน้า Admin — สามารถเปลี่ยนได้ตามต้องการเพื่อความปลอดภัย
const ADMIN_PATH = 'admin';

export default function App() {
  return (
    <Routes>
      {/* ส่วนของ Admin UI — แยกออกมาต่างหากโดยไม่มี Navbar และ Footer ของหน้าหลัก */}
      <Route path={`/${ADMIN_PATH}`} element={<AdminPage />} />

      {/* ส่วนของ Main Layout — สำหรับหน้าแสดงสินค้าทั่วไปที่มี Navbar และ Footer */}
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
                {/* กรณีไม่พบรหัสหน้า (Fallback) ให้กลับไปยังหน้าแรก */}
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
