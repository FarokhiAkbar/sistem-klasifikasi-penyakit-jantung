import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeartbeat, FaHistory, FaExclamationTriangle, FaCheckCircle, FaCalendarAlt, FaFlask, FaUser } from 'react-icons/fa';
import { getPredictionHistory } from '../services/authApi';

/**
 * Halaman Riwayat Prediksi — route: /history (Protected)
 * Responsif: card view di mobile, tabel di desktop.
 */
const History = () => {
  const [history, setHistory]   = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getPredictionHistory();
        if (res.data.success) setHistory(res.data.data);
      } catch (err) {
        console.error('Gagal mengambil riwayat:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8 flex items-start sm:items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2 sm:gap-3">
              <FaHistory className="text-primary-500 flex-shrink-0" />
              <span>Riwayat Prediksi</span>
            </h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">Semua hasil prediksi penyakit jantung Anda tersimpan di sini.</p>
          </div>
          <Link to="/heart-check" className="bg-primary-600 hover:bg-primary-700 text-white px-5 sm:px-6 py-2.5 rounded-full font-semibold text-sm transition-all shadow-md shadow-primary-500/25 whitespace-nowrap">
            + Prediksi Baru
          </Link>
        </motion.div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center">
              <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-500">Memuat riwayat...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 sm:p-12 text-center">
              <FaHeartbeat className="text-4xl sm:text-5xl text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 font-medium mb-1">Belum ada riwayat prediksi</p>
              <p className="text-slate-400 text-sm mb-6">Lakukan prediksi pertama Anda untuk melihatnya di sini.</p>
              <Link to="/heart-check" className="bg-primary-600 text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-primary-700 transition-colors">
                Mulai Prediksi
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">No.</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal &amp; Waktu</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Hasil Prediksi</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Probabilitas</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Usia</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kolesterol</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {history.map((item, idx) => {
                        const isHighRisk = item.prediction === 1;
                        return (
                          <motion.tr key={item.id}
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="px-6 py-4 text-slate-500 font-medium">{idx + 1}</td>
                            <td className="px-6 py-4 text-slate-700">
                              {new Date(item.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${isHighRisk ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                {isHighRisk ? <FaExclamationTriangle /> : <FaCheckCircle />}
                                {isHighRisk ? 'Terindikasi' : 'Tidak Terindikasi'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full ${isHighRisk ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${item.probability}%` }} />
                                </div>
                                <span className="font-semibold text-slate-800">{item.probability}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-700">{item.age} tahun</td>
                            <td className="px-6 py-4 text-slate-700">{item.chol} mg/dL</td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {history.map((item, idx) => {
                  const isHighRisk = item.prediction === 1;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                    >
                      {/* Card header */}
                      <div className={`px-4 py-3 flex items-center justify-between ${isHighRisk ? 'bg-red-50' : 'bg-emerald-50'}`}>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${isHighRisk ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {isHighRisk ? <FaExclamationTriangle /> : <FaCheckCircle />}
                          {isHighRisk ? 'Terindikasi' : 'Tidak Terindikasi'}
                        </span>
                        <span className={`text-lg font-extrabold ${isHighRisk ? 'text-red-600' : 'text-emerald-600'}`}>
                          {item.probability}%
                        </span>
                      </div>

                      {/* Card body */}
                      <div className="px-4 py-3 grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-slate-600">
                          <FaCalendarAlt className="text-slate-400 flex-shrink-0 text-xs" />
                          <span className="text-xs">
                            {new Date(item.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <FaUser className="text-slate-400 flex-shrink-0 text-xs" />
                          <span className="text-xs">{item.age} tahun</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <FaFlask className="text-slate-400 flex-shrink-0 text-xs" />
                          <span className="text-xs">Kolesterol: {item.chol} mg/dL</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${isHighRisk ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${item.probability}%` }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>

        <p className="text-center text-xs text-slate-400 mt-6">Total: {history.length} catatan prediksi tersimpan.</p>
      </div>
    </div>
  );
};

export default History;
