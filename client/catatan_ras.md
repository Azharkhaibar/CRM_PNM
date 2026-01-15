## Format JSON
```json
{
  "id": "generated-uuid-v4-example",
  "year": 2025,
  "groupId": "GID-12345",   // ID ini menghubungkan parameter antar tahun agar dapat terhitung untuk RAS Tahunan 
                            // (bagian statistik avg, standar dev, dll). Tidak diubah saat update data.
  "riskCategory": "Likuiditas",
  "no": 1,
  "parameter": "Current Ratio",
  "statement": "Menjaga likuiditas perusahaan agar mampu memenuhi kewajiban jangka pendek.",
  "formulasi": "Aset Lancar / Kewajiban Lancar",
  "riskStance": "Moderat",  // Pilihan: "Moderat", "Konservatif", "Strategis", "Tidak Toleran".
                            // Selain value di atas, tolak.

  "unitType": "PERCENTAGE", // Pilihan: PERCENTAGE, RUPIAH, X, REAL, HOUR
  "dataTypeExplanation": "Rasio likuiditas dalam persen", // (optional)
  "notes": "Data diambil dari laporan keuangan bulanan.", // (opsional)

  "rkapTarget": "120",
  "rasLimit": "100",

  "hasNumeratorDenominator": true,
  "numeratorLabel": "Aset Lancar",
  "denominatorLabel": "Kewajiban Lancar",

  // Data Realisasi Bulanan 
  // "n": {num, den, man}
  // n -> bulan dari 0-11 (Jan-Des)
  // num -> numerator (pembilang), 
  // den -> denominator (penyebut), 
  // man -> manual value (hasil kalkulasi/realisasi)
  "monthlyValues": {
    "0": {"num": 100, "den": 200, "man": 50},
    "1": {"num": 110, "den": 200, "man": 55}
  },

  // Klo Limit > Hasil Realisasi, muncul tindak lanjut
  "tindakLanjut": {
    "korektifOwner": "Melakukan efisiensi biaya operasional",
    "antisipasiOwner": "Monitoring cashflow harian secara ketat",
    "korektifSupport": "Review ulang alokasi budget",
    "antisipasiSupport": "Simulasi stress test likuiditas",

    "statusKorektifOwner": "On Progress", // Pilihan: On Progress, Done
    "targetKorektifOwner": "2025-02-01",  // String
    "statusAntisipasiOwner": "On Progress",
    "targetAntisipasiOwner": "2025-03-01",
    "statusKorektifSupport": "Done",
    "targetKorektifSupport": "2025-01-15",
    "statusAntisipasiSupport": "On Progress",
    "targetAntisipasiSupport": "2025-04-01"
  }
}
```

----------------------------------------------------------

## Ambil Semua Data (Get All)

Method: GET

URL: /ras

Query Param: year (Integer)

Deskripsi: Mengambil seluruh data RAS. Wajib bisa difilter berdasarkan tahun untuk memisahkan tampilan per tahun.

----------------------------------------------------------

## Ambil History per Group (Get History)

Method: GET

URL: /ras/history/{groupId}

Deskripsi: Mengambil semua data dari tahun-tahun sebelumnya yang memiliki groupId yang sama.

Kegunaan: 
- Untuk mengisi kolom "Statistik (Tahun X-1, X-2)" di Tabel RAS Tahunan.
- Menghitung AVG, Standar Deviasi, dll menggunakan data dari 3 tahun sebelumnya.

Requirement: Return array data, urutkan berdasarkan year ASC (Ascending).

----------------------------------------------------------

## Cek Link Parameter (Smart Lookup)

Method: GET

URL: /ras/lookup-group

Query Param: name (String)

Deskripsi: Fitur ini digunakan saat user mengetik nama parameter baru secara manual. Cek apakah nama tersebut pernah ada di tahun-tahun lalu (nama parameter harus unique).

Logic:
- Lakukan pencarian Case Insensitive di seluruh database (semua tahun).
- Ambil data dari tahun terbaru yang ditemukan.

Response:
- Jika Ketemu: { "found": true, "groupId": "GID-LAMA-123" }
- Jika Tidak: { "found": false, "groupId": null }

----------------------------------------------------------

## Simpan Data Baru (Create)

Method: POST

URL: /ras

Body: Objek JSON lengkap (tanpa ID).

Validasi Wajib (PENTING):

Sebelum simpan, cek di database: "Apakah nama parameter ini sudah ada di tahun tersebut?"

Jika SUDAH ADA: Return Error "Parameter sudah ada di tahun ini".

Jika BELUM ADA: Simpan data.

----------------------------------------------------------

## Update Data (Update)

Method: PUT

URL: /ras/{id}

Body: Objek JSON (bisa partial atau full).

Logic:
- Jika user mengubah nama parameter, field groupId TIDAK BOLEH BERUBAH. Field ini harus tetap sama dengan data lama agar koneksi history statistik antar tahun tidak terputus.
- Saat update data realisasi (monthlyValues), merge atau replace object dengan benar. Jangan sampai update bulan Maret menyebabkan data bulan Januari hilang jika Frontend mengirim partial data.

----------------------------------------------------------

## Hapus Data (Delete)

Method: DELETE

URL: /ras/{id}

Deskripsi: Menghapus satu item parameter dari database.