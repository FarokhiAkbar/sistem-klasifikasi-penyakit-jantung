import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeartbeat, FaHistory, FaUser, FaCalendarAlt, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import { getDashboardSummary } from '../services/authApi';

/**
 * Halaman Dashboard — route: /dashboard (Protected)
 * Menampilkan informasi profil, statistik, dan prediksi terakhir user.
 */
const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary]   = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await getDashboardSummary();
        if (res.data.success) setSummary(res.data.data);
      } catch (err) {
        console.error('Gagal mengambil data dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const last = summary?.last_prediction;
  const isHighRisk = last?.prediction === 1;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Greeting */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">
            Selamat Datang, <span className="text-primary-600">{user?.full_name?.split(' ')[0]}</span>! 👋
          </h1>
          <p className="text-slate-500 mt-1">Ini adalah ringkasan aktivitas prediksi Anda.</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {[
            { icon: <FaUser className="text-primary-600 text-2xl" />, label: 'Nama Pengguna', value: user?.username || '-', bg: 'bg-primary-50' },
            { icon: <FaHeartbeat className="text-emerald-600 text-2xl" />, label: 'Total Prediksi', value: isLoading ? '...' : (summary?.total_predictions ?? 0), bg: 'bg-emerald-50' },
            { icon: <FaCalendarAlt className="text-blue-600 text-2xl" />, label: 'Bergabung Sejak', value: user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-', bg: 'bg-blue-50' },
          ].map((card, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4"
            >
              <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>{card.icon}</div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{card.label}</p>
                <p className="text-lg font-bold text-slate-900 mt-0.5">{card.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Last Prediction */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6"
        >
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FaHeartbeat className="text-primary-500" /> Prediksi Terakhir
          </h2>
          {isLoading ? (
            <div className="h-16 bg-slate-100 animate-pulse rounded-xl" />
          ) : last ? (
            <div className={`p-4 rounded-xl border flex items-center gap-4 ${isHighRisk ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
              {isHighRisk
                ? <FaExclamationTriangle className="text-red-500 text-2xl flex-shrink-0" />
                : <FaCheckCircle className="text-emerald-500 text-2xl flex-shrink-0" />
              }
              <div>
                <p className={`font-bold text-lg ${isHighRisk ? 'text-red-700' : 'text-emerald-700'}`}>
                  {isHighRisk ? 'Terindikasi Penyakit Jantung' : 'Tidak Terindikasi Penyakit Jantung'}
                </p>
                <p className="text-sm text-slate-600">Probabilitas: <strong>{last.probability}%</strong> &bull; {new Date(last.created_at).toLocaleString('id-ID')}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <FaHeartbeat className="text-4xl text-slate-300 mx-auto mb-3" />
              <p>Anda belum pernah melakukan prediksi.</p>
              <Link to="/heart-check" className="mt-3 inline-block bg-primary-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-primary-700 transition-colors">
                Mulai Prediksi Sekarang
              </Link>
            </div>
          )}
        </motion.div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/heart-check" className="bg-primary-600 hover:bg-primary-700 text-white p-5 rounded-2xl flex items-center gap-4 transition-all hover:shadow-lg hover:shadow-primary-500/20">
            <FaHeartbeat className="text-3xl" />
            <div><p className="font-bold">Buat Prediksi Baru</p><p className="text-primary-200 text-sm">Gunakan AI untuk analisis risiko jantung Anda</p></div>
          </Link>
          <Link to="/history" className="bg-white hover:bg-slate-50 text-slate-900 p-5 rounded-2xl flex items-center gap-4 transition-all border border-slate-200 hover:shadow-md">
            <FaHistory className="text-3xl text-slate-400" />
            <div><p className="font-bold">Lihat Riwayat</p><p className="text-slate-500 text-sm">Tinjau seluruh hasil prediksi sebelumnya</p></div>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
