# Backend Contract – Risk Profile Pasar Produk

Dokumen ini menjelaskan **format JSON**, **endpoint**, dan **alur data** yang dibutuhkan backend agar kompatibel dengan implementasi frontend pada modul:

* Inherent Risk
* KPMR

Sumber acuan: `InherentPage.jsx`, `KpmrPage.jsx`, `PasarProduk.jsx`.

---

## 1. Konteks Umum

Kategori tetap:

```
categoryId: "pasar-produk"
```

Semua data dipartisi berdasarkan:

* `categoryId`
* `year`
* `quarter` (khusus Inherent)

---

## 2. Struktur Data – Inherent Risk

### 2.1 Root Payload

```json
{
  "categoryId": "pasar-produk",
  "year": 2025,
  "quarter": "Q1",
  "rows": [ /* Parameter[] */ ]
}
```

---

### 2.2 Parameter Object

```json
{
  "id": "uuid",
  "nomor": "1",
  "judul": "Reksa Dana",
  "bobot": 20,
  "kategori": {
    "model": "open_end | terstruktur | tanpa_model",
    "prinsip": "syariah | konvensional | " ,
    "jenis": "pasar_uang | pendapatan_tetap | campuran | saham | indeks | terproteksi | " ,
    "underlying": ["indeks", "eba", "dinfra", "obligasi"]
  },
  "nilaiList": [ /* Nilai[] */ ]
}
```

**Catatan aturan frontend:**

* Jika `model = tanpa_model` → field lain boleh kosong.
* Jika `model = open_end` → `jenis` wajib.
* Jika `model = terstruktur` → `underlying` minimal 1.
* `bobot` valid: `0–100`.

---

### 2.3 Nilai Object

```json
{
  "id": "uuid",
  "nomor": "1",
  "bobot": 50,
  "portofolio": "string",
  "keterangan": "string",
  "riskindikator": "string",
  "judul": { "text": "Tanpa Faktor" }
}
```

---

## 3. Struktur Data – Derived (Hasil Hitung)

Frontend memanggil `computeDerived(nilai, param)` lalu mengirim hasilnya.

### 3.1 Payload Save Derived

```json
{
  "categoryId": "pasar-produk",
  "year": 2025,
  "quarter": "Q1",
  "snapshot": {
    "summary": 123.45,
    "meta": { "formula": "SUM(all derived.weighted)" }
  },
  "values": [ /* DerivedValue[] */ ]
}
```

### 3.2 DerivedValue Object

```json
{
  "parameterId": "uuid",
  "nilaiId": "uuid",
  "raw": 3,
  "weighted": 0.75,
  "final": 2.25
}
```

(Field persis tergantung implementasi `computeDerived` di backend)

---

## 4. Struktur Data – KPMR

### 4.1 Root Payload

```json
{
  "categoryId": "pasar-produk",
  "year": 2025,
  "rows": [ /* Aspek[] */ ]
}
```

---

### 4.2 Aspek Object

```json
{
  "id": "uuid",
  "nomor": "1",
  "judul": "Governance",
  "bobot": 25,
  "pertanyaanList": [ /* Pertanyaan[] */ ]
}
```

---

### 4.3 Pertanyaan Object

```json
{
  "id": "uuid",
  "nomor": "1.1",
  "pertanyaan": "Apakah kebijakan risiko tersedia?",
  "skor": {
    "Q1": 3,
    "Q2": 4,
    "Q3": 2,
    "Q4": 5
  },
  "indicator": {
    "strong": "...",
    "satisfactory": "...",
    "fair": "...",
    "marginal": "...",
    "unsatisfactory": "..."
  },
  "evidence": "dokumen pendukung"
}
```

**Validasi frontend:**

* Skor valid: `1–5`.
* `pertanyaan` wajib diisi.

---

## 5. Endpoint yang Diharapkan

### 5.1 Load Inherent

```
GET /api/risk/inherent
```

Query:

```
?categoryId=pasar-produk&year=2025&quarter=Q1
```

Response:

```json
{ "rows": [ /* Parameter[] */ ] }
```

---

### 5.2 Save Inherent

```
POST /api/risk/inherent
```

Body:

```json
{
  "categoryId": "pasar-produk",
  "year": 2025,
  "quarter": "Q1",
  "rows": [ /* Parameter[] */ ]
}
```

Response:

```json
{ "success": true }
```

---

### 5.3 Save Derived

```
POST /api/risk/derived
```

Body:

```json
{
  "categoryId": "pasar-produk",
  "year": 2025,
  "quarter": "Q1",
  "snapshot": { "summary": 123.45 },
  "values": [ /* DerivedValue[] */ ]
}
```

---

### 5.4 Load KPMR

```
GET /api/risk/kpmr
```

Query:

```
?categoryId=pasar-produk&year=2025
```

Response:

```json
{ "rows": [ /* Aspek[] */ ] }
```

---

### 5.5 Save KPMR

```
POST /api/risk/kpmr
```

Body:

```json
{
  "categoryId": "pasar-produk",
  "year": 2025,
  "rows": [ /* Aspek[] */ ]
}
```

---

## 6. Behaviour yang Diandalkan Frontend

1. **Idempotent Save**
   Save payload yang sama tidak boleh menggandakan data.

2. **Toleran Field Kosong**
   Backend tidak boleh reject:

   * `kategori.jenis = ""`
   * `kategori.underlying = []`
     jika aturan model terpenuhi.

3. **Order Preserved**
   Urutan `rows`, `nilaiList`, `pertanyaanList` harus dipertahankan.

4. **UUID Stabil**
   Backend tidak boleh regenerate `id`.

---

## 7. Ringkas – Mapping Frontend → Backend

| Frontend Action | Endpoint                |
| --------------- | ----------------------- |
| Load Inherent   | GET /api/risk/inherent  |
| Save Inherent   | POST /api/risk/inherent |
| Save Derived    | POST /api/risk/derived  |
| Load KPMR       | GET /api/risk/kpmr      |
| Save KPMR       | POST /api/risk/kpmr     |

---

## 8. Catatan Kritis

* Backend **tidak boleh** auto-normalize:

  * bobot
  * skor
  * urutan array

* Semua validasi berat tetap di frontend. Backend cukup:

  * schema validation
  * persistence

---

