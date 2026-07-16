# Simari App - Internal Audit & Risk Management System

Simari App adalah platform manajemen risiko dan audit internal terintegrasi yang dirancang untuk memantau, menganalisis, dan melaporkan profil risiko entitas keuangan serta kepatuhan terhadap regulasi OJK (Otoritas Jasa Keuangan) baik pada tingkat Holding maupun unit usaha terkait.

Sistem ini mendukung pengumpulan data profil risiko, penilaian KPMR (Kualitas Penerapan Manajemen Risiko), penilaian Risiko Inherent, agregasi data holding company, analisis bertenaga AI, serta pembuatan laporan secara real-time.

---

## 🚀 Fitur Utama & Modul

### 1. Modul Profil Risiko Inherent (OJK & Holding)
Penilaian komprehensif terhadap indikator risiko inherent untuk mendeteksi tingkat risiko bawaan sebelum mitigasi:
*   **Holding (8 Modul):** Investasi, Pasar, Likuiditas, Operasional, Hukum, Kepatuhan, Reputasi, Stratejik.
*   **OJK (13 Modul):** Pasar Produk, Likuiditas Produk, Kredit Produk, Konsentrasi Produk, Operasional, Hukum, Kepatuhan, Reputasi, Strategis, Investasi, Rentabilitas, Permodalan, Tata Kelola.

### 2. Evaluasi KPMR - Kualitas Penerapan Manajemen Risiko (OJK & Holding)
Sistem evaluasi mandiri (Self-Assessment) untuk mengukur efektivitas kualitas kontrol manajemen risiko pada aspek tata kelola, kebijakan, proses, dan sistem kontrol internal:
*   **Holding (8 Modul):** Investasi, Pasar, Likuiditas, Operasional, Hukum, Stratejik, Kepatuhan, Reputasi.
*   **OJK (13 Modul):** Pasar Produk, Likuiditas Produk, Kredit Produk, Konsentrasi Produk, Operasional, Hukum, Kepatuhan, Reputasi, Strategis, Investasi, Rentabilitas, Permodalan, Tata Kelola.

### 3. Agregasi Data & Rekap Holding
Fitur rekapitulasi data tingkat holding (`rekap-data-1` & `rekap-data-2`) untuk menggabungkan skor parameter risiko dari berbagai unit usaha ke dalam laporan konsolidasi.

### 4. Salin Periode (Clone Period) & Reset Data
*   **Salin Periode (Clone):** Menduplikasi data aspek, pertanyaan, definisi, parameter, dan nilai dari periode/tahun/triwulan sebelumnya ke periode tujuan dengan opsi overwrite. Tersedia untuk modul inherent maupun KPMR di OJK dan Holding.
*   **Reset Data:** Fitur untuk mengosongkan/membersihkan semua data aspek, parameter, skor, dan indikator nilai periode tertentu secara permanen per modul.

### 5. Konsolidasi Skema Database (folder `/schema-sql`)
Folder khusus di tingkat root proyek yang menyimpan berkas `schema.sql` akurat, mencakup:
*   Skema tabel utama (users, auth, division, notifications, audit_log).
*   Skema tabel Holding & OJK (Inherent & KPMR).
*   Database view konsolidasi `risk_profile_repository_ojk_view`.
*   Data seeding awal (master division, user default, ojk module default, reference values).

### 6. AI-Powered Insights (Google Gemini)
Integrasi langsung dengan **Google Gemini AI SDK** baik pada sisi frontend maupun backend untuk menganalisis data mentah secara otomatis dan menghasilkan ringkasan naratif, rekomendasi perbaikan, serta laporan audit.

### 7. Ekspor Data & Visualisasi
*   Ekspor laporan langsung ke berkas Excel berformat premium menggunakan `exceljs`, `xlsx`, dan `xlsx-js-style`.
*   Visualisasi data tren dan parameter risiko menggunakan grafik interaktif dari `recharts`.

### 8. Notifikasi & Audit Log Real-Time
*   Pemberitahuan instan menggunakan WebSockets (`socket.io` & `@nestjs/websockets`) untuk status audit, pengisian parameter, dan perubahan data profil risiko.
*   Audit Log terpusat yang mencatat seluruh aksi CRUD, Login/Logout, dan ekspor data dengan standardisasi argumen posisional dan pelacakan metadata yang aman.

---

## 🛠️ Tech Stack

### Sisi Frontend (`/client`)
*   **Framework**: React (v19) + Vite
*   **Styling**: Tailwind CSS (v4) + `framer-motion` (Animasi)
*   **UI Components**: `shadcn/ui` + Radix UI + Lucide React
*   **State Management**: Zustand
*   **Data Fetching**: TanStack React Query (v5) + Axios
*   **Charting**: Recharts

### Sisi Backend (`/server`)
*   **Framework**: NestJS (v11) (TypeScript)
*   **Database ORM**: TypeORM (MySQL)
*   **Autentikasi**: Passport JWT (`@nestjs/jwt`) + Bcrypt
*   **Dokumentasi API**: OpenAPI Swagger
*   **Notifikasi**: WebSockets (`socket.io`)
*   **Ekstra/Dokumen**: PDFKit (Ekspor PDF)

### Layanan Tambahan (`/flask`)
*   **Framework**: Flask (Python) untuk modul pemrosesan data / analitis khusus.

---

## ⚙️ Petunjuk Instalasi & Menjalankan Aplikasi

### Prasyarat
Pastikan Anda telah menginstal aplikasi berikut di komputer Anda:
*   [Node.js](https://nodejs.org/) (Rekomendasi v18 ke atas)
*   [Python 3](https://www.python.org/) (Untuk modul Flask)
*   [MySQL Database](https://www.mysql.com/)

---

### 📂 Langkah 1: Menjalankan Backend (`server`)

1. Buka direktori server:
   ```bash
   cd server
   ```
2. Instal dependencies:
   ```bash
   npm install
   ```
3. Buat file `.env` di dalam folder `server` (duplikasi dari `.env.example` jika ada) dan lengkapi konfigurasi database serta API Key Gemini:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=password_db_anda
   DB_DATABASE=rims_v1
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Jalankan migrasi database atau impor langsung berkas skema `/schema-sql/schema.sql`.
5. Jalankan backend server dalam mode development:
   ```bash
   npm run start:dev
   ```
   *Backend secara default berjalan di `http://localhost:3000` dan Swagger API docs dapat diakses di `http://localhost:3000/api`.*

---

### 💻 Langkah 2: Menjalankan Frontend (`client`)

1. Buka direktori client:
   ```bash
   cd ../client
   ```
2. Instal dependencies:
   ```bash
   npm install
   ```
3. Buat file `.env` di dalam folder `client`:
   ```env
   VITE_API_URL=http://localhost:3000
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```
4. Jalankan aplikasi frontend:
   ```bash
   npm run dev
   ```
   *Frontend akan berjalan dan dapat diakses di `http://localhost:5173`.*

---

### 🐍 Langkah 3: Menjalankan Flask Analytics Service (`flask`)

1. Buka direktori flask:
   ```bash
   cd ../flask
   ```
2. Aktifkan virtual environment (venv) dan instal Flask:
   ```bash
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate

   pip install flask
   ```
3. Jalankan aplikasi Flask:
   ```bash
   python app.py
   ```
   *Layanan Flask berjalan di `http://localhost:5000`.*

---

## 🔒 Lisensi & Keamanan
*   Proyek ini merupakan sistem internal. **Jangan pernah mengunggah kredensial atau file `.env` ke repository publik.**
*   Gunakan `.gitignore` yang sudah disediakan untuk menghindari kesalahan unggah.
