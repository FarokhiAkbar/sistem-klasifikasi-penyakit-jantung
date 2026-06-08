import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeartbeat, FaLock, FaUser, FaShieldAlt, FaChartLine, FaBell } from 'react-icons/fa';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setError('');
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/admin/login', formData);
      if (res.data.success) {
        localStorage.setItem('adminToken', res.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Username atau password tidak valid. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: FaChartLine, title: 'Monitoring Real-time', desc: 'Pantau prediksi & aktivitas pengguna secara langsung' },
    { icon: FaShieldAlt, title: 'Keamanan Tinggi', desc: 'Akses terlindungi dengan autentikasi JWT' },
    { icon: FaBell,      title: 'Notifikasi Live',   desc: 'Terima update instan via WebSocket' },
  ];

  return (
    <div className="min-h-screen flex font-['Inter',ui-sans-serif,system-ui,sans-serif]">

      {/* ── LEFT PANEL ─────────────────────────────────────────────── */}
      <div className="hidden lg:flex w-[55%] relative flex-col justify-between overflow-hidden"
           style={{ background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 30%, #dc2626 70%, #ef4444 100%)' }}>

        {/* Noise / mesh overlay */}
        <div className="absolute inset-0 opacity-10"
             style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Blurred circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full"
             style={{ background: 'rgba(255,255,255,0.08)', filter: 'blur(60px)' }} />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full"
             style={{ background: 'rgba(0,0,0,0.15)', filter: 'blur(60px)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
             style={{ background: 'rgba(255,255,255,0.03)', filter: 'blur(80px)' }} />

        {/* Content */}
        <div className="relative z-10 p-14 flex-1 flex flex-col justify-center">
          {/* Logo */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                      className="flex items-center gap-3 mb-14">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                 style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.25)' }}>
              <FaHeartbeat className="text-white text-2xl" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-white font-bold text-xl tracking-tight">HealthCare</span>
              <span className="text-red-200 text-[11px] font-medium tracking-wide">Website for health</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-semibold tracking-wide"
                 style={{ background: 'rgba(255,255,255,0.15)', color: '#fecaca' }}>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              ADMIN PORTAL
            </div>
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
              Pusat Kendali<br />
              <span style={{ color: '#fca5a5' }}>Sistem Prediksi</span><br />
              Jantung
            </h1>
            <p className="text-red-100 text-base leading-relaxed max-w-sm">
              Pantau aktivitas pengguna, statistik prediksi, dan performa sistem klasifikasi risiko penyakit jantung secara real-time.
            </p>
          </motion.div>

          {/* Feature list */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
                      className="mt-12 space-y-4">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                          className="flex items-center gap-4 p-4 rounded-2xl"
                          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                     style={{ background: 'rgba(255,255,255,0.15)' }}>
                  <f.icon className="text-white text-base" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{f.title}</p>
                  <p className="text-red-200 text-xs mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom badge */}
        <div className="relative z-10 px-14 pb-8">
          <p className="text-red-300 text-xs">© {new Date().getFullYear()} HealthCare · CardioGuard System · All rights reserved</p>
        </div>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                    className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 justify-center mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)' }}>
              <FaHeartbeat className="text-white text-lg" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-slate-900 font-bold text-lg">HealthCare</span>
              <span className="text-slate-400 text-[10px] font-medium tracking-wide">Website for health</span>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 md:p-10">
            {/* Header */}
            <div className="mb-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                   style={{ background: 'linear-gradient(135deg, #fef2f2, #fee2e2)' }}>
                <FaLock style={{ color: '#dc2626' }} className="text-xl" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Selamat Datang</h2>
              <p className="text-slate-500 text-sm mt-1.5">Masuk ke panel administrator untuk mengelola sistem</p>
            </div>

            {/* Error message */}
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                          className="mb-5 p-4 rounded-xl flex items-start gap-3 text-sm"
                          style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b' }}>
                <span className="text-base shrink-0 mt-0.5">⚠️</span>
                <span>{error}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Masukkan username admin"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-slate-800 outline-none transition-all"
                    style={{
                      background: '#f8fafc',
                      border: '1.5px solid #e2e8f0',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#dc2626'; e.target.style.boxShadow = '0 0 0 3px rgba(220,38,38,0.1)'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f8fafc'; }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••••"
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm text-slate-800 outline-none transition-all"
                    style={{
                      background: '#f8fafc',
                      border: '1.5px solid #e2e8f0',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#dc2626'; e.target.style.boxShadow = '0 0 0 3px rgba(220,38,38,0.1)'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f8fafc'; }}
                  />
                  <button type="button" onClick={() => setShowPassword(p => !p)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium transition-colors select-none">
                    {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.01 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                className="w-full py-4 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background: isLoading
                    ? '#ef4444'
                    : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                  boxShadow: '0 8px 24px rgba(220,38,38,0.35)',
                }}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    <FaShieldAlt />
                    Masuk ke Dashboard
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider info */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <p className="text-xs text-slate-400 font-medium">Sistem aktif · Akses khusus administrator</p>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            HealthCare System &copy; {new Date().getFullYear()} · CardioGuard Admin Panel
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
