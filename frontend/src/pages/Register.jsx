import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import { FaHeartbeat } from 'react-icons/fa';
import RegisterForm from '../components/auth/RegisterForm';
import useAuth from '../hooks/useAuth';

/**
 * Halaman Register — route: /register
 */
const Register = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-slate-100 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl"
    >
      {/* Card */}
      <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 p-8 sm:p-10 border border-slate-100">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 justify-center mb-4">
            <FaHeartbeat className="text-primary-600 text-3xl" />
            <span className="font-bold text-2xl text-slate-900">HealthCare</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Buat Akun Baru</h1>
          <p className="text-slate-500 text-sm mt-1">Daftar untuk menggunakan fitur prediksi penyakit jantung AI</p>
        </div>

        <RegisterForm />
      </div>

      <p className="text-center text-xs text-slate-400 mt-6">
        &copy; {new Date().getFullYear()} HealthCare. All rights reserved.
      </p>
    </motion.div>
  </div>
  );
};

export default Register;
