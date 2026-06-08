import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHeartbeat, FaStethoscope, FaChartLine, FaCheckCircle, FaRegHeart, FaArrowRight, FaChevronDown } from 'react-icons/fa';
import doctorImg from '../assets/doctor.png';
import heart3d from '../assets/heart3d.png';

const FAQItem = ({ faq, idx }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 * idx }}
      className={`bg-white rounded-2xl border transition-all duration-300 ${isOpen ? 'border-primary-200 shadow-md shadow-primary-500/5' : 'border-slate-200 shadow-sm hover:border-primary-300'}`}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 sm:px-8 sm:py-6 flex items-center justify-between text-left focus:outline-none"
      >
        <h3 className={`text-base sm:text-lg font-bold pr-8 transition-colors ${isOpen ? 'text-primary-600' : 'text-slate-900'}`}>{faq.q}</h3>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${isOpen ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-400'}`}>
          <FaChevronDown className="text-sm" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 sm:px-8 sm:pb-8 text-slate-600 leading-relaxed border-t border-slate-100 mt-2 pt-4 sm:pt-6">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-primary-50 to-white overflow-hidden py-12 sm:py-16 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={staggerContainer}
              className="z-10"
            >
              <motion.h1 variants={fadeIn} className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary-600 leading-tight mb-4 sm:mb-6">
                Deteksi Risiko Serangan Jantung Lebih Awal
              </motion.h1>
              <motion.p variants={fadeIn} className="text-base sm:text-lg text-slate-600 mb-8 sm:mb-10 max-w-lg leading-relaxed">
                HealthCare menggunakan teknologi AI mutakhir untuk membantu Anda memahami risiko serangan jantung berdasarkan faktor kesehatan dan gaya hidup Anda secara real-time.
              </motion.p>
              
              <motion.div variants={fadeIn} className="flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-12">
                <Link to="/heart-check" className="bg-primary-600 hover:bg-primary-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold transition-all shadow-lg shadow-primary-500/40 flex items-center gap-3 text-sm sm:text-base">
                  Cek Risiko Anda <FaArrowRight />
                </Link>
              </motion.div>

              <motion.div variants={fadeIn} className="flex flex-wrap gap-3 sm:gap-6">
                <div className="flex items-center gap-2 bg-white px-3 sm:px-4 py-2 rounded-lg shadow-sm border border-slate-100">
                  <FaCheckCircle className="text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-slate-600">Teknologi AI Terkini</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 sm:px-4 py-2 rounded-lg shadow-sm border border-slate-100">
                  <FaCheckCircle className="text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-slate-600">Hasil Instan</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Animated 3D Anatomical Heart */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.85, y: 30 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
              className="relative flex items-center justify-center mt-4 lg:mt-0"
            >
              {/* Soft radial background glow */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div 
                  className="w-[420px] h-[420px] rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(252,165,165,0.55) 0%, rgba(254,226,226,0.3) 50%, transparent 75%)',
                    filter: 'blur(20px)',
                  }}
                />
              </div>

              {/* Pulsing ring 1 */}
              <motion.div
                className="absolute rounded-full border-2 border-primary-300/40 pointer-events-none"
                style={{ width: 380, height: 380 }}
                animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.15, 0.5] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
              />
              {/* Pulsing ring 2 */}
              <motion.div
                className="absolute rounded-full border border-primary-200/30 pointer-events-none"
                style={{ width: 450, height: 450 }}
                animate={{ scale: [1, 1.06, 1], opacity: [0.3, 0.08, 0.3] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut', delay: 0.4 }}
              />

              {/* 95% Accuracy floating badge - top right */}
              <motion.div 
                animate={{ y: [0, -12, 0] }} 
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                className="absolute top-6 right-4 bg-white px-4 py-3 rounded-2xl shadow-xl z-20 flex flex-col items-center gap-0.5"
                style={{ border: '1px solid rgba(254,202,202,0.6)' }}
              >
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-primary-500 text-lg" />
                  <span className="font-bold text-2xl text-slate-800">95%</span>
                </div>
                <span className="text-xs font-medium text-slate-500">Tingkat Akurasi</span>
              </motion.div>

              {/* Heart icon floating badge - bottom left */}
              <motion.div 
                animate={{ y: [0, 14, 0] }} 
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.8 }}
                className="absolute bottom-8 left-4 bg-white p-4 rounded-2xl shadow-xl z-20"
                style={{ border: '1px solid rgba(254,202,202,0.6)' }}
              >
                <FaRegHeart className="text-primary-500 text-2xl" />
              </motion.div>

              {/* The anatomical heart image with float + subtle rotation */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                className="relative z-10"
                style={{ filter: 'drop-shadow(0 30px 50px rgba(185,28,28,0.35)) drop-shadow(0 8px 20px rgba(185,28,28,0.2))' }}
                whileHover={{ scale: 1.04, rotate: 3 }}
              >
                <img
                  src={heart3d}
                  alt="Jantung Anatomis 3D"
                  className="w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] md:w-[320px] md:h-[320px] lg:w-[360px] lg:h-[360px] object-contain select-none"
                  draggable={false}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Feature / About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.h4 variants={fadeIn} className="text-primary-600 font-semibold tracking-wider uppercase text-sm mb-2">Tentang HealthCare</motion.h4>
              <motion.h2 variants={fadeIn} className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                Prediksi Medis Berbasis AI
              </motion.h2>
              <motion.p variants={fadeIn} className="text-slate-600 mb-10 leading-relaxed">
                HealthCare adalah platform prediksi serangan jantung yang menggunakan machine learning canggih untuk menganalisis berbagai faktor risiko kesehatan Anda.
              </motion.p>

              <div className="space-y-8">
                <motion.div variants={fadeIn} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                    <FaChartLine className="text-primary-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Analisis Faktor Risiko Komprehensif</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Kami menganalisis lebih dari 9 faktor risiko klinis yang telah terbukti secara ilmiah berhubungan dengan serangan jantung.</p>
                  </div>
                </motion.div>
                
                <motion.div variants={fadeIn} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                    <FaHeartbeat className="text-primary-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Algoritma AI yang Teruji</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Model prediksi kami dilatih dengan dataset dari ratusan kasus klinis dengan tingkat akurasi mencapai lebih dari 80%.</p>
                  </div>
                </motion.div>

                <motion.div variants={fadeIn} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                    <FaStethoscope className="text-primary-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Peringatan Dini Akurat</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Sistem mendeteksi pola tersembunyi untuk memberikan peringatan dini sehingga tindakan pencegahan dapat dilakukan.</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Content - Doctors Image Placeholder */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/3] bg-slate-200 rounded-3xl overflow-hidden shadow-xl relative">
                 <img src={doctorImg} alt="Ilustrasi Dokter Profesional" className="w-full h-full object-cover" />
              </div>
              
              {/* Quote Card */}
              <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-2xl max-w-sm border border-slate-50">
                <FaRegHeart className="text-primary-500 text-2xl mb-4" />
                <p className="text-slate-600 italic text-sm mb-4">"HealthCare telah membantu mengidentifikasi pasien berisiko tinggi yang sebelumnya tidak terdeteksi secara kasat mata."</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4"
          >
            Bagaimana Cara Kerjanya
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 mb-16 max-w-2xl mx-auto"
          >
            Proses sederhana 3 langkah untuk mendapatkan prediksi risiko serangan jantung Anda secara instan dan akurat.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-slate-200 z-0"></div>

            {[
              { step: 1, title: 'Masukkan Data Anda', desc: 'Berikan informasi medis dasar seperti usia, tekanan darah, kolesterol, dan lainnya.' },
              { step: 2, title: 'Analisis AI', desc: 'Model AI kami menganalisis data menggunakan algoritma Random Forest untuk menghitung risiko.' },
              { step: 3, title: 'Dapatkan Hasil', desc: 'Terima laporan komprehensif tentang risiko serangan jantung Anda dan rekomendasi awal.' }
            ].map((item, index) => (
              <motion.div 
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * index }}
                className="relative z-10 flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg shadow-primary-500/30 mb-6 border-4 border-slate-50">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed max-w-xs">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Pertanyaan yang Sering Diajukan</h2>
            <p className="text-slate-600 text-lg">Temukan jawaban atas pertanyaan umum tentang sistem prediksi HealthCare.</p>
          </motion.div>

          <div className="space-y-4">
            {[
              { q: 'Apakah hasil prediksi ini akurat?', a: 'Sistem ini menggunakan model AI yang dilatih dengan data klinis nyata dan memiliki tingkat akurasi yang baik. Namun, ini hanyalah alat bantu prediksi (screening awal) dan TIDAK menggantikan diagnosis medis profesional dari dokter.' },
              { q: 'Data apa saja yang dibutuhkan untuk prediksi?', a: 'Anda perlu menyiapkan 9 parameter kesehatan dasar termasuk usia, tekanan darah, tingkat kolesterol, detak jantung maksimal, dan beberapa indikator lainnya yang bisa Anda dapatkan dari hasil medical check-up rutin.' },
              { q: 'Apakah data saya disimpan di server?', a: 'Tidak. Kami sangat menghargai privasi Anda. Data yang Anda masukkan ke dalam form hanya digunakan sementara untuk kalkulasi secara real-time dan tidak akan disimpan di database kami.' },
              { q: 'Bagaimana cara membaca persentase hasil?', a: 'Persentase menunjukkan probabilitas atau seberapa kuat algoritma yakin dengan keputusannya. Persentase yang tinggi pada hasil "Terindikasi" berarti pola data klinis Anda sangat mirip dengan pasien yang memiliki riwayat penyakit jantung.' }
            ].map((faq, idx) => (
              <FAQItem key={idx} faq={faq} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Bottom CTA Section */}
      <section id="cta" className="bg-primary-600 py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
           <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <defs>
                  <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M0 40L40 0H20L0 20M40 40V20L20 40" fill="currentColor" />
                  </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pattern)" />
           </svg>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-5xl font-bold text-white mb-6"
          >
            Lindungi Jantung Anda Hari Ini
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-primary-100 text-lg mb-10"
          >
            Deteksi dini adalah kunci pencegahan serangan jantung. Dapatkan prediksi risiko Anda sekarang, gratis dan cepat.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/heart-check" className="inline-flex items-center gap-2 bg-white text-primary-600 hover:bg-slate-50 px-8 py-4 rounded-full font-bold transition-all shadow-xl hover:scale-105 active:scale-95">
              Mulai Prediksi Gratis <FaHeartbeat className="text-primary-500" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
