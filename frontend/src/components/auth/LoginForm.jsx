import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';
import { loginUser } from '../../services/authApi';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';

/**
 * Form Login. Mendukung login via email atau username.
 * Setelah login berhasil, redirect ke halaman asal atau /heart-check.
 */
const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from?.pathname || '/';

  const [formData, setFormData]   = useState({ identifier: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.identifier || !formData.password) {
      toast.error('Semua field wajib diisi!');
      return;
    }
    setIsLoading(true);
    try {
      const res = await loginUser(formData);
      if (res.data.success) {
        login(res.data.token, res.data.user);
        toast.success(`Selamat datang, ${res.data.user.full_name}!`);
        navigate(from, { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login gagal. Coba lagi.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Email atau Username</label>
        <input
          type="text" name="identifier"
          value={formData.identifier} onChange={handleChange}
          placeholder="Masukkan email atau username Anda"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'} name="password"
            value={formData.password} onChange={handleChange}
            placeholder="Masukkan password Anda"
            className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>
      <button type="submit" disabled={isLoading}
        className={`w-full bg-primary-600 hover:bg-primary-700 text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.01] active:scale-[0.99]'}`}
      >
        {isLoading ? <><FaSpinner className="animate-spin" /> Sedang Masuk...</> : 'Masuk ke Akun'}
      </button>
      <p className="text-center text-sm text-slate-600">
        Belum punya akun?{' '}
        <Link to="/register" className="text-primary-600 font-semibold hover:underline">Daftar Sekarang</Link>
      </p>
    </form>
  );
};

export default LoginForm;
