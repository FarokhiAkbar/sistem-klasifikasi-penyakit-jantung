import { FaHeartbeat, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

/**
 * Komponen Footer utama aplikasi.
 */
const Footer = () => {
  return (
    <footer className="bg-navy text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <FaHeartbeat className="text-white text-2xl" />
              <span className="font-bold text-xl text-white">HealthCare</span>
            </div>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Platform prediksi risiko serangan jantung berbasis AI terdepan, memberikan informasi penting untuk kesehatan jantung Anda.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><FaFacebookF /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><FaTwitter /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><FaInstagram /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><FaLinkedinIn /></a>
            </div>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wider text-sm uppercase">Navigasi</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-primary-500 transition-colors">Beranda</a></li>
              <li><a href="#about" className="hover:text-primary-500 transition-colors">Tentang</a></li>
              <li><a href="#cta" className="hover:text-primary-500 transition-colors">Prediksi</a></li>
              <li><a href="#faq" className="hover:text-primary-500 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Informasi */}
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wider text-sm uppercase">Informasi</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-primary-500 transition-colors">Kebijakan Privasi</a></li>
              <li><a href="#" className="hover:text-primary-500 transition-colors">Syarat dan Ketentuan</a></li>
              <li><a href="#" className="hover:text-primary-500 transition-colors">Bantuan</a></li>
              <li><a href="#" className="hover:text-primary-500 transition-colors">Kontak</a></li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wider text-sm uppercase">Kontak</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex gap-3">
                <FaMapMarkerAlt className="text-primary-500 mt-1 flex-shrink-0" />
                <span>Jalan Ringroad Utara, Jombor, Sendangadi, Mlati, Sendangadi, Mlati, Kabupaten Sleman, Daerah Istimewa Yogyakarta.</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-primary-500 flex-shrink-0" />
                <span>+62 896-6308-2311</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-primary-500 flex-shrink-0" />
                <span>@example@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; 2026 HealthCare.</p>
          <p className="mt-2 md:mt-0">Didukung oleh teknologi AI terkini untuk kesehatan jantung Anda.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
