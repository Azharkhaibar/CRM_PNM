Investasi (OK)
Pasar (OK)
Likuiditas (OK)
Operasional
Hukum
Stratejik
Kepatuhan
Reputasi

## features

cek auth dan register service (OK)

add backend user dan integrasikan dengan auth (OK)

Buat agar darkmode saat refresh tidak hilang (OK)

## Ringkasan (Summary)

Total Risiko: jumlah risiko yang terdaftar.

Level Risiko Tertinggi: highlight risiko yang melebihi RAS.

Maturasi rata-rata: status perkembangan mitigasi risiko.

Risk Profile Overview: tampilan kategori risiko (High, Medium, Low) secara cepat.

## Visualisasi & Chart
Heatmap Risiko: plot risiko berdasarkan Likelihood x Impact, cocok untuk melihat risk profile secara visual.

Trend Line / Progress Chart: menampilkan perubahan risk profile dari waktu ke waktu.

Pie Chart atau Donut: distribusi risiko berdasarkan kategori atau department.

Gauge/Speedometer: menunjukkan risiko aktual vs risk appetite (RAS).

## Filter & Drill-down

Filter berdasarkan level risiko, kategori, departemen, maturity level.

Drill-down untuk tiap risiko: klik level tinggi → lihat deskripsi, mitigasi, owner.

## Alerts & Notifications

Notifikasi jika risiko melewati RAS.

Reminder untuk risiko yang belum dimitigasi dalam batas waktu.

## Export & Reporting

Export ke Excel / PDF untuk laporan manajemen.

Dashboard interaktif untuk presentasi ke senior management.

Buat updatePassword()
✅ Buat uploadAvatar()
✅ Auto-refresh profile setelah update
✅ Integrasi dengan Zustand (jika mau global state)

git checkout -b fitur-test-dummy mainrepo/fitur-test-dummy

## NGROK COLLAB PAKE ENV

conth: 
VITE_API_BASE_URL=https://d01f29140ee4.ngrok-free.app/api/v1

await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/me`);
