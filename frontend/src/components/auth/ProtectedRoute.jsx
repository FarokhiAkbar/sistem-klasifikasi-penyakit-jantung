import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

/**
 * Komponen pembungkus untuk melindungi route yang memerlukan autentikasi.
 * Jika user belum login, redirect ke halaman /login.
 * Menyimpan halaman asal agar setelah login bisa kembali ke sana.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Tampilkan loading spinner saat sedang memeriksa sesi
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Memuat sesi...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Simpan halaman asal ke state agar setelah login bisa redirect ke sana
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
