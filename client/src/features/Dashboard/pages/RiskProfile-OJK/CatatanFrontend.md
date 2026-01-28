# Catatan Frontend – Risk Profile OJK

Dokumen ini ditulis agar:

* FE baru bisa langsung ngerti alurnya
* Tidak salah kaprah antara **Inherent / KPMR / RAS / Risk Profile OJK**
* Konsisten dengan kebutuhan regulator (OJK)

---

## 1. Gambaran Umum Halaman

Risk Profile OJK adalah halaman untuk **menilai tingkat risiko aktual** per kategori OJK **dalam satu tahun**.

Karakteristik utama:

* ⏱️ Time-based: **Tahunan** (tidak ada quarter)
* 📊 Penilaian: **1–5 (Low → High)**
* 🧭 Indicator hanya sebagai **guidance**, bukan data statistik
* 🛠️ Mitigasi muncul **berdasarkan level risiko**

---

## 2. Struktur State Global (Header)

Gunakan state global yang **sudah ada** (contoh `useHeaderStore`):

```ts
{
  year: number,        // tahun aktif
  search: string,      // pencarian parameter
  activeCategory: string // contoh: "pasar-produk"
}
```

⚠️ **Tidak ada quarter di Risk Profile OJK**.

---

## 3. Struktur Data di Frontend

### 3.1 Parameter Risk Profile (State)

```ts
{
  id: string,
  year: number,
  categoryId: string,

  groupId: string,

  no: number,
  parameter: string,
  statement: string,

  indicator: {
    low: string,
    lowToModerate: string,
    moderate: string,
    moderateToHigh: string,
    high: string
  },

  assessment: {
    value: number | null, // 1–5
    level: string | null
  },

  mitigation: {
    existingControl: string,
    plannedAction: string,
    owner: string,
    targetDate: string,
    status: "On Progress" | "Done"
  }
}
```

---

## 4. Layout Halaman

### 4.1 Header

* Tahun aktif
* Dropdown kategori risiko
* Search parameter

---

### 4.2 Panel Parameter (Kiri / Atas)

Fungsi:

* Tambah parameter
* Edit parameter
* Hapus parameter
* Copy parameter (tanpa assessment)

Aturan UI:

* **Satu parameter aktif** dalam satu waktu
* Edit mode eksplisit (tidak auto-save)

---

### 4.3 Panel Assessment (Tengah)

Komponen utama:

* Radio / Select nilai 1–5
* Label level otomatis

```text
1 → Low
2 → Low to Moderate
3 → Moderate
4 → Moderate to High
5 → High
```

⚠️ Saat value berubah:

* `assessment.level` **auto update**
* Trigger validasi mitigasi

---

### 4.4 Panel Indicator (Read Only)

* Tampilkan 5 card indikator
* Warna tetap (hijau → merah)
* Tidak editable saat view mode

Fungsi: **guidance user**, bukan scoring

---

### 4.5 Panel Mitigasi (Conditional)

Muncul jika:

```ts
assessment.value >= 3
```

Field wajib:

* Existing Control
* Planned Action
* Owner
* Target Date
* Status

Jika `value < 3`:

* Panel disembunyikan
* Data mitigasi **boleh tetap disimpan** (tidak dihapus)

---

## 5. Flow Interaksi User

### 5.1 Tambah Parameter

1. Klik ➕ Tambah
2. Isi nama + statement
3. Isi indicator
4. Simpan

🚫 Assessment masih kosong

---

### 5.2 Input Assessment

1. Pilih nilai 1–5
2. Level muncul otomatis
3. Jika ≥ 3 → panel mitigasi muncul

---

### 5.3 Edit Data

* Semua perubahan di **draft state**
* Tombol `Save` eksplisit
* Tombol `Cancel` rollback ke data lama

---

### 5.4 Validasi Frontend

| Field            | Rule                 |
| ---------------- | -------------------- |
| assessment.value | wajib 1–5            |
| mitigation       | wajib jika value ≥ 3 |
| targetDate       | format date valid    |

---

## 6. Aturan UX Penting

* ❌ Tidak ada auto-copy antar tahun
* ❌ Tidak ada statistik / grafik
* ✅ Fokus ke **clarity & compliance**
* ⚠️ Warning jika pindah kategori dengan perubahan belum disimpan

---

## 7. Perbedaan UI (Inherent / KPMR / Risk Profile OJK)

| Modul            | Time    | Kompleksitas | Catatan               |
| ---------------- | ------- | ------------ | --------------------- |
| Inherent         | Quarter | Tinggi       | Banyak nilai & bobot  |
| KPMR             | Tahunan | Tinggi       | Pertanyaan & skor     |
| Risk Profile OJK | Tahunan | Menengah     | Assessment + mitigasi |

---


