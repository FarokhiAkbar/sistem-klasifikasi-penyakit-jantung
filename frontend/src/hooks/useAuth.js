import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

/**
 * Custom hook untuk mengakses AuthContext dengan mudah.
 * 
 * @returns {{ user, isAuthenticated, isLoading, login, logout }}
 * 
 * @example
 * const { user, isAuthenticated, logout } = useAuth();
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};

export default useAuth;
