import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeartbeat, FaSpinner, FaInfoCircle, FaLock, FaTimesCircle } from 'react-icons/fa';
import { submitPrediction } from '../services/predictionApi';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';

/**
 * Modal yang muncul ketika guest user mencoba menekan tombol prediksi.
 */
const LoginRequiredModal = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <FaLock className="text-red-500 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Akses Dibatasi</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Untuk menggunakan fitur prediksi penyakit jantung, Anda harus masuk ke akun terlebih dahulu.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/login" className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-bold text-center transition-all">
                Masuk Sekarang
              </Link>
              <Link to="/register" className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-center transition-all">
                Daftar Akun
              </Link>
            </div>
            <button onClick={onClose} className="mt-4 text-sm text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 mx-auto">
              <FaTimesCircle /> Tutup
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

/**
 * Halaman form prediksi penyakit jantung.
 * - Jika Guest: form disabled + overlay peringatan + modal saat submit.
 * - Jika Auth: form aktif normal, hasil tersimpan ke database.
 */
const HeartCheck = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { register, handleSubmit } = useForm({ mode: 'onTouched' });

  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      setShowModal(true);
      toast.warning('Anda harus login terlebih dahulu untuk melakukan prediksi.');
      return;
    }
    setIsLoading(true);
    try {
      const result = await submitPrediction(data);
      navigate('/result', { state: { result: result.data } });
    } catch (error) {
      toast.error(error.message || 'Gagal memproses prediksi.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (disabled) => `w-full px-4 py-3 rounded-xl border transition-all outline-none ${
    disabled
      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
      : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
  }`;

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <LoginRequiredModal isOpen={showModal} onClose={() => setShowModal(false)} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-full mb-4">
            <FaHeartbeat className="text-primary-600 text-3xl" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Formulir Prediksi Jantung AI</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Masukkan data klinis Anda dengan akurat untuk mendapatkan prediksi risiko penyakit jantung.
          </p>
        </motion.div>

        {/* Guest Mode Banner */}
        {!isAuthenticated && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left"
          >
            <FaLock className="text-amber-500 text-3xl flex-shrink-0" />
            <div className="flex-grow">
              <p className="font-bold text-amber-800">Silakan login terlebih dahulu untuk menggunakan fitur prediksi penyakit jantung.</p>
              <p className="text-amber-600 text-sm mt-1">Anda dapat melihat form di bawah ini, namun tidak dapat menggunakannya sebelum login.</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Link to="/login" className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors whitespace-nowrap">Login Sekarang</Link>
              <Link to="/register" className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors whitespace-nowrap">Daftar Akun</Link>
            </div>
          </motion.div>
        )}

        {/* Form Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-10 border border-slate-100 relative"
        >
          {/* Overlay for guests */}
          {!isAuthenticated && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-2xl z-10 flex items-center justify-center">
              <div className="text-center">
                <FaLock className="text-slate-300 text-5xl mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Login untuk mengaktifkan form</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Usia (Tahun) <span className="text-primary-500">*</span></label>
                <input type="number" {...register("age", { required: true, min: 1, max: 120 })} disabled={!isAuthenticated}
                  className={inputClass(!isAuthenticated)} placeholder="Contoh: 45" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tekanan Darah Istirahat (mm Hg) <span className="text-primary-500">*</span></label>
                <input type="number" {...register("trestbps", { required: true, min: 50, max: 250 })} disabled={!isAuthenticated}
                  className={inputClass(!isAuthenticated)} placeholder="Contoh: 120" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Kolesterol Serum (mg/dl) <span className="text-primary-500">*</span></label>
                <input type="number" {...register("chol", { required: true, min: 100, max: 600 })} disabled={!isAuthenticated}
                  className={inputClass(!isAuthenticated)} placeholder="Contoh: 200" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Detak Jantung Maksimal <span className="text-primary-500">*</span></label>
                <input type="number" {...register("thalach", { required: true, min: 60, max: 220 })} disabled={!isAuthenticated}
                  className={inputClass(!isAuthenticated)} placeholder="Contoh: 150" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Depresi ST oleh Olahraga (oldpeak) <span className="text-primary-500">*</span></label>
                <input type="number" step="0.1" {...register("oldpeak", { required: true, min: 0, max: 10 })} disabled={!isAuthenticated}
                  className={inputClass(!isAuthenticated)} placeholder="Contoh: 1.5" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tipe Nyeri Dada (cp) <span className="text-primary-500">*</span></label>
                <select {...register("cp")} disabled={!isAuthenticated} className={inputClass(!isAuthenticated) + ' bg-white'}>
                  <option value="0">Tipe 0 (Typical Angina)</option>
                  <option value="1">Tipe 1 (Atypical Angina)</option>
                  <option value="2">Tipe 2 (Non-anginal Pain)</option>
                  <option value="3">Tipe 3 (Asymptomatic)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Jumlah Pembuluh Darah Utama (ca) <span className="text-primary-500">*</span></label>
                <select {...register("ca")} disabled={!isAuthenticated} className={inputClass(!isAuthenticated) + ' bg-white'}>
                  <option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Hasil Thalassemia (thal) <span className="text-primary-500">*</span></label>
                <select {...register("thal")} disabled={!isAuthenticated} className={inputClass(!isAuthenticated) + ' bg-white'}>
                  <option value="0">Tipe 0 (Normal)</option>
                  <option value="1">Tipe 1 (Fixed Defect)</option>
                  <option value="2">Tipe 2 (Reversable Defect)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Angina Terinduksi Olahraga (exang) <span className="text-primary-500">*</span></label>
                <select {...register("exang")} disabled={!isAuthenticated} className={inputClass(!isAuthenticated) + ' bg-white'}>
                  <option value="0">Tidak (0)</option><option value="1">Ya (1)</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl flex gap-3 items-start text-sm border border-blue-100">
              <FaInfoCircle className="mt-0.5 flex-shrink-0 text-blue-500" />
              <p>Data yang Anda masukkan hanya digunakan sementara untuk kalkulasi prediksi AI dan akan tersimpan di akun Anda sebagai riwayat.</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button type="submit" disabled={isLoading}
                onClick={() => { if (!isAuthenticated) { setShowModal(true); toast.warning('Anda harus login terlebih dahulu untuk melakukan prediksi.'); } }}
                className={`w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-8 sm:px-10 py-4 rounded-full font-bold transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
              >
                {isLoading ? <><FaSpinner className="animate-spin" /> Sedang Menganalisis...</> : <><FaHeartbeat /> Proses Prediksi</>}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default HeartCheck;
