import { createContext, useEffect, useState } from 'react';
import { getCurrentUser } from '../services/authApi';

/**
 * AuthContext menyimpan state global autentikasi.
 * Dapat diakses oleh komponen manapun via useAuth() hook.
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]                   = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading]         = useState(true); // Loading saat check session awal

  /**
   * Auto-login check saat aplikasi pertama kali dijalankan.
   * Mengambil token dari localStorage dan memvalidasinya ke backend.
   */
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('hc_token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await getCurrentUser();
        if (response.data.success) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          // Token tidak valid, hapus
          localStorage.removeItem('hc_token');
        }
      } catch {
        localStorage.removeItem('hc_token');
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  /**
   * Fungsi login: simpan token & set state user.
   * @param {string} token - JWT token dari response login
   * @param {object} userData - Data user dari response login
   */
  const login = (token, userData) => {
    localStorage.setItem('hc_token', token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  /**
   * Fungsi logout: hapus token & reset state.
   */
  const logout = () => {
    localStorage.removeItem('hc_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = { user, isAuthenticated, isLoading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
