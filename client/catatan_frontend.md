notif logout/login sudh sinkron namun hanya pada akun pribadi, belum sinkron dengan aktivitas akun lain

cek backend controller, service, gateway
karena masuk page login belum bisa

## ------------------------------------------------------------------

3. Audit Trail (OK)

Tambah menu:
Audit Log

Isi:

Siapa mengupdate risiko apa

Waktu perubahan

Field apa yang berubah

Aksi: Create / Update / Delete / Approve

➡️ Wajib untuk audit internal.

## --------------------------------------------------------------------------

A. Jadwal Mitigasi Risiko

Calendar menampilkan:

Deadline mitigasi

Task owner / PIC

Status (On Track / Overdue / Done)

Contoh event:

🔴 “Mitigasi Risiko Investasi #12 – Deadline Hari Ini”

🟡 “Update Progress Mitigasi – 70%”

🟢 “Mitigasi Risiko Pasar #7 Completed”

B. Review Triwulan & Audit Internal

Review risiko periode Q1, Q2, Q3, Q4

Waktu audit internal

Jadwal penyusunan laporan RAS

Jadwal scoring KPMR

Event:

“📘 Review Risiko Q1 – Mulai 5 Maret”

“📝 Audit Internal – 12 Juni”

C. Jadwal Penginputan Data

Kamu bisa set:

Kapan risiko per kategori harus diperbarui

Reminder untuk user

D. Reminder Otomatis Berbasis Calendar

Terhubung dengan Notification:

+2 hari sebelum deadline → notif masuk

Hari H → notif urgent

+1 hari overdue → notif merah

🧩 3. Fungsi Teknis yang Bisa Kamu Tambahkan

✔ Event Drag & Drop
User bisa geser tanggal event (optional).

✔ Filter Calendar per kategori:

Investasi

Pasar

Operasional

dll

✔ Mode tampilan:

Month view

Week view

Agenda list

✔ Integrasi dengan database mitigasi & risk register

✔ Create event manual untuk admin
Contoh:

Rapat Komite Risiko

Pengajuan Laporan

Jadwal review & audit

## -------------------------------------------------------------------------------------

menambahkan fungsi menghapus logout di notifikasi page (login) sudah tinggal logout (OK)

## -----------------------------------------------------------------------------------

fungsi atau button reset di audit log page untuk menghapus jejak aktivitas

Memberperbaiki semua fungsi notif menampilkan semua log dan sinkronisasi fix