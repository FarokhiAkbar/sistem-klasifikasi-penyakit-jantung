import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeartbeat, FaCheckCircle, FaExclamationTriangle, FaArrowLeft, FaHistory } from 'react-icons/fa';
import { useState } from 'react';

/**
 * Halaman Hasil Prediksi.
 * Menampilkan hasil dari model AI dan riwayat sesi sementara.
 */
const ResultPage = () => {
  const location = useLocation();
  const resultData = location.state?.result;
  const [history] = useState(() => JSON.parse(sessionStorage.getItem('predictionHistory') || '[]'));

  // Redirect ke form jika tidak ada data hasil
  if (!resultData) {
    return <Navigate to="/heart-check" replace />;
  }

  const actualData = resultData.data || resultData;
  const { prediction, probability, explanation, recommendations } = actualData;
  const isHighRisk = prediction === 1;

  // Warna dinamis berdasarkan risiko
  const ringColor = isHighRisk ? 'text-primary-500' : 'text-emerald-500';
  const bgColor = isHighRisk ? 'bg-primary-50' : 'bg-emerald-50';
  const badgeColor = isHighRisk ? 'bg-primary-100 text-primary-700' : 'bg-emerald-100 text-emerald-700';
  const Icon = isHighRisk ? FaExclamationTriangle : FaCheckCircle;

  // Calculate SVG stroke dasharray
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (probability / 100) * circumference;

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/heart-check" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 font-medium mb-8 transition-colors">
          <FaArrowLeft /> Kembali ke Form
        </Link>

        {/* Main Result Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden mb-12 border border-slate-100"
        >
          <div className={`${bgColor} p-10 text-center relative overflow-hidden`}>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm mb-6 ${badgeColor}`}>
              <Icon /> {isHighRisk ? 'Risiko Tinggi' : 'Risiko Rendah'}
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
              {isHighRisk ? 'Terindikasi Penyakit Jantung' : 'Tidak Terindikasi Penyakit Jantung'}
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
              Berdasarkan data klinis yang Anda masukkan, algoritma Random Forest kami telah melakukan kalkulasi dengan hasil sebagai berikut:
            </p>

            {/* Progress Ring */}
            <div className="relative w-36 h-36 sm:w-48 sm:h-48 mx-auto mt-8 sm:mt-10">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 192 192">
                {/* Background Circle */}
                <circle 
                  cx="96" cy="96" r={radius} 
                  className="stroke-slate-200" 
                  strokeWidth="12" fill="transparent" 
                />
                {/* Progress Circle */}
                <circle 
                  cx="96" cy="96" r={radius} 
                  className={`progress-ring__circle ${ringColor} transition-all duration-1000 ease-out`} 
                  strokeWidth="12" fill="transparent" 
                  strokeDasharray={circumference} 
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round" 
                  stroke="currentColor"
                />
              </svg>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">{probability}%</span>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Akurasi</span>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8 lg:p-12">
            <div className="mb-10">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FaHeartbeat className={ringColor} /> Penjelasan Medis
              </h3>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-100">
                {explanation}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FaCheckCircle className={ringColor} /> Tindakan yang Disarankan
              </h3>
              <ul className="space-y-4">
                {recommendations.map((rec, index) => (
                  <motion.li 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    key={index} 
                    className="flex gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${isHighRisk ? 'bg-primary-100 text-primary-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      <span className="text-xs font-bold">{index + 1}</span>
                    </div>
                    <span className="text-slate-700">{rec}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Riwayat Sesi (Session Based) */}
        {history.length > 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 border border-slate-100"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FaHistory className="text-slate-400" /> Riwayat Prediksi Sesi Ini
            </h3>
            <div className="space-y-3">
              {history.map((item, index) => {
                if (index === 0) return null; // Skip current (latest) which is shown above
                const d = new Date(item.date);
                const isHistHighRisk = item.prediction === 1;
                return (
                  <div key={index} className="flex justify-between items-center p-4 rounded-xl border border-slate-100 bg-slate-50">
                    <div>
                      <div className={`text-sm font-bold ${isHistHighRisk ? 'text-primary-600' : 'text-emerald-600'}`}>
                        {isHistHighRisk ? 'Terindikasi Jantung' : 'Normal / Sehat'}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {d.toLocaleTimeString()} - {d.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-700">{item.probability}%</div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400">Probabilitas</div>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-slate-400 mt-6 text-center">
              Riwayat ini hanya disimpan sementara dan akan hilang ketika Anda menutup browser.
            </p>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default ResultPage;
