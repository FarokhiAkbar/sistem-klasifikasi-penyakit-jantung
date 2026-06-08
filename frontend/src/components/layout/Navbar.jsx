import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaHeartbeat, FaBars, FaTimes } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import Avatar from '../navbar/Avatar';
import ProfileDropdown from '../navbar/ProfileDropdown';

/**
 * Komponen Navbar utama aplikasi — responsif untuk semua ukuran layar.
 */
const Navbar = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const navLinks = [
    { name: 'Beranda',  path: '/#home' },
    { name: 'Tentang',  path: '/#about' },
    { name: 'Prediksi', path: '/#cta' },
    { name: 'FAQ',      path: '/#faq' },
  ];

  // Tutup mobile menu saat resize ke desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Tutup menu mobile saat klik link
  const handleMobileLinkClick = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <FaHeartbeat className="text-primary-600 text-2xl sm:text-3xl" />
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-xl text-navy leading-none">HealthCare</span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium tracking-wide">Website for health</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.path}
                className="text-sm font-medium transition-colors hover:text-primary-600 py-1 text-slate-600"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Auth Section - Desktop */}
            {!isLoading && (
              <div className="hidden md:flex items-center gap-3">
                {isAuthenticated ? (
                  <div className="relative">
                    <Avatar onClick={() => setIsDropdownOpen((prev) => !prev)} />
                    <ProfileDropdown
                      isOpen={isDropdownOpen}
                      onClose={() => setIsDropdownOpen(false)}
                    />
                  </div>
                ) : (
                  <Link to="/login"
                    className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors"
                  >
                    Masuk
                  </Link>
                )}
              </div>
            )}

            {/* Mobile Auth Avatar (if logged in) */}
            {!isLoading && isAuthenticated && (
              <div className="flex md:hidden relative">
                <Avatar onClick={() => setIsDropdownOpen((prev) => !prev)} />
                <ProfileDropdown
                  isOpen={isDropdownOpen}
                  onClose={() => setIsDropdownOpen(false)}
                />
              </div>
            )}

            {/* Hamburger Button - Mobile only */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden border-t border-slate-100 bg-white shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={handleMobileLinkClick}
                className="block px-4 py-3 text-sm font-medium text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
              >
                {link.name}
              </a>
            ))}

            {/* Mobile Auth Buttons */}
            {!isLoading && !isAuthenticated && (
              <div className="pt-3 pb-2 border-t border-slate-100 mt-2">
                <Link
                  to="/login"
                  onClick={handleMobileLinkClick}
                  className="block w-full text-center px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-sm transition-colors"
                >
                  Masuk
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
