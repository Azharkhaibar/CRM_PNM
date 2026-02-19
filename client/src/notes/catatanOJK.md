# Risk Profile OJK – Backend API Notes

## Overview

API untuk sistem Risk Profile OJK dengan dua modul utama:

* *Inherent Risk*
* *Kualitas Penerapan Manajemen Risiko (KPMR)*

Data tersimpan berdasarkan *tahun* dan *quarter*.

Base URL:


/api/v1/risk-profile


---

## 1. Inherent Risk Endpoints

### GET /inherent/parameters

Ambil seluruh parameter inherent.

Query Params:

* year (required)
* quarter (required: q1|q2|q3|q4)
* category (optional)
* page (default: 1)
* limit (default: 10)

---

### GET /inherent/history/{groupId}

Ambil histori parameter berdasarkan group_id.

Query Params:

* years_back (default: 3)

---

### GET /inherent/lookup-group

Lookup group_id berdasarkan nama parameter.

Query Params:

* name (required)

---

### POST /inherent/parameters

Buat parameter baru.

Rules:

* title + year + quarter + category harus unik
* Jika group_id null → generate otomatis
* Jika duplicate → 409 Conflict

---

### PUT /inherent/parameters/{id}

Update parameter.

Rules:

* group_id tidak boleh diubah

---

### DELETE /inherent/parameters/{id}

Hapus parameter.

---

### POST /inherent/parameters/{paramId}/values

Tambah value ke parameter.

---

### PUT /inherent/values/{valueId}

Update value.

---

### DELETE /inherent/values/{valueId}

Hapus value.

---

### POST /inherent/compute

Hitung derived values.

Output:

* result
* ranking
* weighted
* matched_index

---

## 2. KPMR Endpoints

### GET /kpmr/aspects

Ambil seluruh aspek KPMR.

Query Params:

* year
* category

---

### GET /kpmr/history/{groupId}

Ambil histori aspek KPMR.

---

### POST /kpmr/aspects

Buat aspek KPMR.

---

### POST /kpmr/aspects/{aspectId}/questions

Tambah pertanyaan ke aspek.

---

### PUT /kpmr/questions/{questionId}/score

Update skor per quarter.

---

## 3. Export Endpoints

### POST /export/inherent

Export inherent ke Excel.

---

### POST /export/kpmr

Export KPMR ke Excel.

---

## 4. Summary & Dashboard

### GET /summary/overview

Ringkasan keseluruhan.

---

### GET /summary/quarterly

Trend per quarter.

---

## 5. References

### GET /references/categories

Ambil referensi kategori.

---

## 6. Audit Trail

### GET /audit/changes

Ambil histori perubahan.

Query Params:

* entity_type
* entity_id
* start_date
* end_date

---

## 7. Bulk Operations

### POST /bulk/import

Import Excel.

Form Data:

* file
* import_type (inherent|kpmr)
* year
* quarter
* overwrite

---

### POST /bulk/update

Bulk update values.

---

## Error Response Format

json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {},
    "trace_id": "trace_xxx"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}


---

## Enums

### Risk Levels

* LOW
* LOW_TO_MODERATE
* MODERATE
* MODERATE_TO_HIGH
* HIGH

---

### Judul Types

* TANPA_FAKTOR
* SATU_FAKTOR
* DUA_FAKTOR

---

### KPMR Indicators

* strong
* satisfactory
* fair
* marginal
* unsatisfactory

---

## Validation Rules (Ringkas)

### Parameter

* order: wajib
* weight: 0–100
* title: unik (year + quarter + category)
* category.model: wajib

### Value

* judul.type: wajib
* risk_indicator: 5 level
* weight: 0–100

### KPMR

* scores: 1–5
* indicators: 5 level

---

## Environment Variables

env
API_PORT=3000
API_BASE_URL=/api/v1/risk-profile
JWT_SECRET=your_jwt_secret
DB_HOST=localhost
DB_PORT=5432
DB_NAME=risk_profile
DB_USER=postgres
DB_PASSWORD=password
REDIS_URL=redis://localhost:6379
UPLOAD_MAX_SIZE=5242880
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100


---

## Relationships

Year → Quarter → Category →

* Parameters → Values → Judul & Risk Indicator
* Aspects → Questions → Scores & Indicators

---

## Metadata

* Version: 1.0.0
* Last Updated: 15 Jan 2024
* Internal Use Only