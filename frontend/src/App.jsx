import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Home       from './pages/Home';
import HeartCheck from './pages/HeartCheck';
import ResultPage from './pages/ResultPage';
import Login      from './pages/Login';
import Register   from './pages/Register';
import Dashboard  from './pages/Dashboard';
import History    from './pages/History';

const AppContent = () => {
  const location = useLocation();

  // Sembunyikan footer di halaman prediksi, result, login, register, dashboard, history
  const hideFooterPaths = ['/heart-check', '/result', '/login', '/register', '/dashboard', '/history'];
  const showFooter = !hideFooterPaths.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50 text-slate-800">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/"            element={<Home />} />
          <Route path="/heart-check" element={<HeartCheck />} />
          <Route path="/result"      element={<ResultPage />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/register"    element={<Register />} />

          {/* Protected Routes (harus login) */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/history"   element={<ProtectedRoute><History /></ProtectedRoute>} />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
          toastClassName="rounded-xl shadow-lg"
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
