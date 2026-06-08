import { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTachometerAlt, FaHistory, FaSignOutAlt } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

/**
 * Dropdown profil yang muncul saat avatar diklik.
 * Berisi nama, email, link ke Dashboard, Riwayat, dan tombol Logout.
 */
const ProfileDropdown = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Tutup dropdown jika klik di luar area
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !e.target.closest('#avatar-btn')) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, scale: 0.95, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -8 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="absolute right-0 top-14 w-64 bg-white rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-100 overflow-hidden z-50"
        >
          {/* User Info Header */}
          <div className="px-5 py-4 bg-gradient-to-br from-primary-50 to-white border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                {user?.full_name?.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-slate-900 text-sm truncate">{user?.full_name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link to="/dashboard" onClick={onClose}
              className="flex items-center gap-3 px-5 py-3 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
            >
              <FaTachometerAlt className="text-primary-400" /> Dashboard
            </Link>
            <Link to="/history" onClick={onClose}
              className="flex items-center gap-3 px-5 py-3 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
            >
              <FaHistory className="text-primary-400" /> Riwayat Prediksi
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-slate-100 py-2">
            <button onClick={handleLogout}
              className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <FaSignOutAlt /> Keluar dari Akun
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileDropdown;
