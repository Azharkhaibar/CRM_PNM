# Catatan API – Risk Profile OJK

## 1. Konsep Umum Risk Profile OJK

Risk Profile OJK berisi **parameter risiko per kategori OJK** (misal: Pasar, Likuiditas, Kredit, Operasional, dll) yang:

* Dinilai **per tahun** (bukan bulanan)
* Memiliki **indikator kuantitatif / kualitatif**
* Menghasilkan **nilai risiko** dan **level risiko**
* Digunakan untuk pelaporan regulator (OJK)

---

## 2. Format JSON – Risk Profile OJK

```json
{
  "id": "generated-uuid-v4",
  "year": 2025,
  "categoryId": "pasar-produk",

  "groupId": "RP-PASAR-001",
  
  "riskCategory": "Risiko Pasar",
  "no": 1,
  "parameter": "Fluktuasi Nilai Aset",
  "statement": "Risiko akibat perubahan nilai pasar instrumen investasi.",

  "measurementType": "QUALITATIVE",
  
  "unitType": "LEVEL",

  "indicator": {
    "low": "Fluktuasi sangat kecil",
    "lowToModerate": "Fluktuasi kecil",
    "moderate": "Fluktuasi sedang",
    "moderateToHigh": "Fluktuasi tinggi",
    "high": "Fluktuasi sangat tinggi"
  },

  "assessment": {
    "value": 3,
    "level": "Moderate"
  },

  "mitigation": {
    "existingControl": "Diversifikasi portofolio",
    "plannedAction": "Peningkatan monitoring pasar",
    "owner": "Manajer Investasi",
    "targetDate": "2025-06-30",
    "status": "On Progress"
  },

  "notes": "Penilaian berdasarkan kondisi pasar Q4",

  "lastUpdated": "2025-01-15T10:00:00Z"
}
```

---

## 3. Penjelasan Field Penting

### Identitas & Relasi

* **id**: Primary key
* **year**: Tahun penilaian
* **categoryId**: Kategori risiko (mapping ke halaman Risk Profile)
* **groupId**: ID stabil antar tahun (opsional, untuk tracking historis manual)

### Measurement

* **measurementType**:

  * `QUALITATIVE`
  * `QUANTITATIVE` (jika pakai angka)

* **unitType**:

  * `LEVEL`
  * `PERCENTAGE`
  * `RUPIAH`

### Indicator

Dipakai untuk:

* Menampilkan deskripsi tiap level
* Acuan penilaian user

### Assessment

* **value**: Angka 1–5
* **level**: Mapping dari value

| Value | Level            |
| ----- | ---------------- |
| 1     | Low              |
| 2     | Low to Moderate  |
| 3     | Moderate         |
| 4     | Moderate to High |
| 5     | High             |

### Mitigation

Wajib ada untuk risiko **Moderate ke atas**.

---

## 4. Endpoint API

### 4.1 Ambil Semua Data

**Method**: GET
**URL**: `/risk-profile-ojk`

**Query Param**:

* `year` (Integer, wajib)
* `categoryId` (String, opsional)

**Deskripsi**:
Mengambil seluruh parameter Risk Profile OJK per tahun.

---

### 4.2 Ambil Detail per ID

**Method**: GET
**URL**: `/risk-profile-ojk/{id}`

**Deskripsi**:
Digunakan untuk edit / review detail parameter.

---

### 4.3 Create Data

**Method**: POST
**URL**: `/risk-profile-ojk`

**Body**: JSON lengkap (tanpa id)

**Validasi Wajib**:

* `parameter` unik dalam **categoryId + year**
* `assessment.value` harus 1–5

Jika duplikat:

```
Parameter risiko sudah ada di tahun ini
```

---

### 4.4 Update Data

**Method**: PUT
**URL**: `/risk-profile-ojk/{id}`

**Logic Penting**:

* `groupId` **tidak boleh berubah**
* Partial update diperbolehkan

---

### 4.5 Delete Data

**Method**: DELETE
**URL**: `/risk-profile-ojk/{id}`

**Deskripsi**:
Menghapus satu parameter Risk Profile OJK.

---

## 5. Catatan Implementasi Frontend

* Assessment value disimpan **per tahun**
* Tidak ada quarter
* Indicator ditampilkan sebagai **guidance**, bukan input nilai
* Jika value ≥ 3 → form mitigasi wajib muncul
---
