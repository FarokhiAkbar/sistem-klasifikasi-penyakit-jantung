import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000/api';

/**
 * Membuat instance Axios dengan base URL.
 * Token JWT secara otomatis disisipkan ke header setiap request
 * melalui interceptor jika tersedia di localStorage.
 */
const apiClient = axios.create({ baseURL: BASE_URL });

// Request interceptor: sisipkan token JWT ke setiap request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('hc_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

/**
 * Mendaftarkan akun baru.
 * @param {object} data - { full_name, email, username, password, confirm_password }
 */
export const registerUser = (data) => apiClient.post('/auth/register', data);

/**
 * Login pengguna.
 * @param {object} data - { identifier, password }
 */
export const loginUser = (data) => apiClient.post('/auth/login', data);

/**
 * Mengambil data user yang sedang login (untuk session persistence).
 */
export const getCurrentUser = () => apiClient.get('/auth/me');

/**
 * Mengambil ringkasan dashboard (total prediksi, prediksi terakhir).
 */
export const getDashboardSummary = () => apiClient.get('/dashboard/summary');

/**
 * Mengambil seluruh riwayat prediksi milik user.
 */
export const getPredictionHistory = () => apiClient.get('/dashboard/history');

export default apiClient;
