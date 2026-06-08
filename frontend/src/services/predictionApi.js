import apiClient from './authApi';

/**
 * Mengirim data klinis ke backend untuk prediksi penyakit jantung.
 * JWT token secara otomatis disisipkan oleh interceptor di authApi.js.
 *
 * @param {Object} data - Data parameter klinis user (age, chol, dll).
 * @returns {Promise<Object>} Response berisi hasil prediksi.
 */
export const submitPrediction = async (data) => {
  try {
    const response = await apiClient.post('/predict', data);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Terjadi kesalahan pada server.', { cause: error });
    }
    throw new Error('Tidak dapat terhubung ke server.', { cause: error });
  }
};
