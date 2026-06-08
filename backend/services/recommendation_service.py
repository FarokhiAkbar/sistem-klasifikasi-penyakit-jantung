import json
import google.genai as genai
from google.genai import types
from config.settings import Config

# Inisialisasi Gemini Client dengan API Key dari Config
_client = None
if hasattr(Config, 'GEMINI_API_KEY') and Config.GEMINI_API_KEY:
    try:
        _client = genai.Client(api_key=Config.GEMINI_API_KEY)
        print("[OK] Gemini AI Client berhasil diinisialisasi.")
    except Exception as e:
        print(f"[WARNING] Gagal menginisialisasi Gemini API Client: {e}")


class RecommendationService:
    @staticmethod
    def _get_static_recommendation(prediction):
        """Fallback statis jika LLM gagal atau client tidak tersedia."""
        if prediction == 1:
            return {
                "explanation": "Berdasarkan analisis AI pada data klinis Anda, terdapat indikasi risiko gangguan pada fungsi jantung. Model kami menemukan pola yang menyerupai profil risiko penyakit kardiovaskular pada dataset.",
                "recommendations": [
                    "Segera jadwalkan konsultasi dengan dokter spesialis jantung (Kardiolog).",
                    "Bawa hasil prediksi ini sebagai referensi awal untuk pemeriksaan lebih lanjut.",
                    "Lakukan pemeriksaan EKG atau tes darah lengkap sesuai anjuran dokter.",
                    "Hindari aktivitas fisik berat yang membebani jantung secara tiba-tiba.",
                    "Pertahankan pola makan sehat, hindari makanan tinggi garam dan lemak jenuh."
                ]
            }
        else:
            return {
                "explanation": "Berdasarkan analisis AI pada data klinis Anda, saat ini tidak ditemukan indikasi kuat adanya penyakit jantung. Profil kesehatan Anda secara umum berada dalam batas aman menurut model kami.",
                "recommendations": [
                    "Pertahankan gaya hidup aktif dengan olahraga rutin (seperti jalan cepat, bersepeda, atau berenang).",
                    "Jaga pola makan bergizi seimbang yang kaya akan serat.",
                    "Kelola tingkat stres dengan istirahat yang cukup.",
                    "Lakukan pemeriksaan kesehatan rutin (medical check-up) setidaknya setahun sekali.",
                    "Hasil ini adalah prediksi model AI dan tidak dapat menggantikan diagnosis medis profesional."
                ]
            }

    @staticmethod
    def get_recommendation(prediction, probability=0, input_data=None):
        """
        Mengembalikan penjelasan dan rekomendasi medis dinamis menggunakan Gemini AI.
        Jika Gemini gagal, otomatis fallback ke respons statis.

        Args:
            prediction (int): 0 atau 1
            probability (float): Persentase keyakinan model ML (0-100)
            input_data (dict): Data klinis yang diinputkan user

        Returns:
            dict: Berisi 'explanation' (string) dan 'recommendations' (list of strings)
        """
        if not _client or not input_data:
            return RecommendationService._get_static_recommendation(prediction)

        try:
            status_text = "Risiko Tinggi Penyakit Jantung" if prediction == 1 else "Risiko Rendah Penyakit Jantung (Sehat)"

            prompt = f"""
Anda adalah dokter spesialis jantung AI yang bertugas memberikan penjelasan medis dan rekomendasi kepada pasien.
Sebuah model Machine Learning (Random Forest) baru saja memproses data klinis pasien dan menghasilkan prediksi berikut:

[HASIL PREDIKSI MACHINE LEARNING]
- Prediksi: {status_text}
- Tingkat Keyakinan (Probabilitas Model): {probability}%

[DATA KLINIS PASIEN]
- Usia: {input_data.get('age', '-')} tahun
- Tekanan Darah Istirahat: {input_data.get('trestbps', '-')} mmHg
- Kolesterol Serum: {input_data.get('chol', '-')} mg/dl
- Detak Jantung Maksimal: {input_data.get('thalach', '-')} bpm

Tugas Anda:
1. Berikan `explanation` (2-3 kalimat) tentang kondisi pasien dengan nada profesional, berempati, dan mudah dimengerti. Sebutkan faktor risiko spesifik jika kolesterol atau tekanan darah di luar batas normal.
2. Berikan `recommendations` berupa list 3-5 poin aksi spesifik berdasarkan kondisi pasien. Poin harus actionable.

Output HARUS berupa JSON murni tanpa markdown dengan struktur:
{{
  "explanation": "Penjelasan medis di sini...",
  "recommendations": [
    "Rekomendasi 1",
    "Rekomendasi 2",
    "Rekomendasi 3"
  ]
}}
"""
            response = _client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.4,
                    response_mime_type="application/json",
                )
            )

            result_text = response.text.strip()

            # Bersihkan jika ada markdown block
            if result_text.startswith("```json"):
                result_text = result_text[7:].rstrip("` \n")
            elif result_text.startswith("```"):
                result_text = result_text[3:].rstrip("` \n")

            parsed = json.loads(result_text)

            if "explanation" in parsed and "recommendations" in parsed:
                print(f"[OK] Rekomendasi Gemini AI berhasil di-generate untuk prediksi {prediction}.")
                return parsed
            else:
                raise ValueError("Struktur JSON dari Gemini tidak sesuai.")

        except Exception as e:
            print(f"[WARNING] Gemini API error, fallback ke statis: {e}")
            return RecommendationService._get_static_recommendation(prediction)
