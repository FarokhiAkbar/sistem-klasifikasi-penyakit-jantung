import useAuth from '../../hooks/useAuth';

/**
 * Komponen Avatar berbentuk lingkaran yang menampilkan inisial nama user.
 * Contoh: "Farokhi Akbar" -> "F"
 */
const Avatar = ({ onClick }) => {
  const { user } = useAuth();
  const initials = user?.full_name
    ? user.full_name.trim().charAt(0).toUpperCase()
    : '?';

  return (
    <button
      onClick={onClick}
      id="avatar-btn"
      aria-label="Buka menu profil"
      className="w-10 h-10 rounded-full bg-primary-600 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-primary-500/30 hover:bg-primary-700 transition-all hover:scale-105 active:scale-95 select-none"
    >
      {initials}
    </button>
  );
};

export default Avatar;
