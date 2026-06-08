import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSpinner, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { registerUser } from '../../services/authApi';
import { toast } from 'react-toastify';

const CheckItem = ({ ok, label }) => (
  <li className={`flex items-center gap-1.5 text-xs ${ok ? 'text-emerald-600' : 'text-slate-400'}`}>
    {ok ? <FaCheckCircle /> : <FaTimesCircle />} {label}
  </li>
);

/**
 * Form Registrasi akun baru dengan validasi real-time.
 */
const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '', email: '', username: '', password: '', confirm_password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const pwd = formData.password;
  const pwdChecks = {
    length:  pwd.length >= 8,
    upper:   /[A-Z]/.test(pwd),
    lower:   /[a-z]/.test(pwd),
    number:  /[0-9]/.test(pwd),
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      toast.error('Konfirmasi password tidak cocok!');
      return;
    }
    setIsLoading(true);
    try {
      const res = await registerUser(formData);
      if (res.data.success) {
        toast.success('Akun berhasil dibuat! Silakan login.');
        navigate('/login');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registrasi gagal. Coba lagi.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap</label>
          <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="John Doe"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="johndoe"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
        <div className="relative">
          <input type={showPass ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Min. 8 karakter"
            className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
            {showPass ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {formData.password && (
          <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 pl-1">
            <CheckItem ok={pwdChecks.length} label="Min. 8 karakter" />
            <CheckItem ok={pwdChecks.upper}  label="Huruf Besar (A-Z)" />
            <CheckItem ok={pwdChecks.lower}  label="Huruf Kecil (a-z)" />
            <CheckItem ok={pwdChecks.number} label="Angka (0-9)" />
          </ul>
        )}
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Konfirmasi Password</label>
        <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} placeholder="Ulangi password Anda"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
        {formData.confirm_password && formData.password !== formData.confirm_password && (
          <p className="text-red-500 text-xs mt-1">Password tidak cocok</p>
        )}
      </div>
      <button type="submit" disabled={isLoading}
        className={`w-full bg-primary-600 hover:bg-primary-700 text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mt-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isLoading ? <><FaSpinner className="animate-spin" /> Mendaftar...</> : 'Buat Akun Baru'}
      </button>
      <p className="text-center text-sm text-slate-600">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-primary-600 font-semibold hover:underline">Masuk di sini</Link>
      </p>
    </form>
  );
};

export default RegisterForm;
