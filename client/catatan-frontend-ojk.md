# Catatan Frontend - Risk Profile Pasar Produk

Dokumen ini menjelaskan **struktur dan flow** halaman Risk Profile Pasar Produk yang terdiri dari dua modul utama: **INHERENT** dan **Kualitas Penerapan Manajemen Risiko (KPMR)**.

---

## 1. Gambaran Umum Halaman

Risk Profile Pasar Produk adalah halaman untuk **mengelola dan menilai risiko produk investasi** (reksa dana, produk terstruktur, dll) dengan dua pendekatan berbeda:

### **INHERENT**
- **Fokus**: Risiko intrinsik produk berdasarkan karakteristik produk
- **Basis waktu**: **Quarterly** (Q1, Q2, Q3, Q4)
- **Struktur**: Parameter → Nilai → Risk Indicator
- **Output**: Total weighted risk score dengan peringkat 1-5
- **Use case**: Menilai risiko produk berdasarkan portofolio, kategori, dan bobot

### **Kualitas Penerapan Manajemen Risiko (KPMR)**
- **Fokus**: Kualitas proses manajemen risiko perusahaan
- **Basis waktu**: **Tahunan** dengan tracking per quarter
- **Struktur**: Aspek → Pertanyaan → Skor Quarter
- **Output**: Skor rata-rata per quarter (1-5) dengan description level
- **Use case**: Audit internal proses manajemen risiko

---

## 2. Struktur State Global (HeaderStore)

State global yang digunakan di **kedua halaman**:

```javascript
// Di PasarProduk.jsx (Parent Component)
const [inherentRows, setInherentRows] = useState([]);    // Data inherent per quarter
const [kpmrRows, setKpmrRows] = useState([]);           // Data KPMR per tahun
const [activeTab, setActiveTab] = useState("inherent"); // "inherent" atau "kpmr"

// Di HeaderStore (Global State)
{
  year: number,              // Tahun aktif (2024, 2025, dll)
  activeQuarter: string,     // "Q1", "Q2", "Q3", "Q4" (hanya untuk inherent)
  search: string,            // Pencarian global
  exportRequestId: string,   // Trigger export
  resetExport: function      // Reset export state
}
```

### **Perbedaan State antara INHERENT dan KPMR:**

| Modul    | Basis Waktu | State Structure                     | Storage Key                        |
|----------|-------------|-------------------------------------|------------------------------------|
| INHERENT | Quarterly   | `inherent:pasar-produk:{year}:{Q}` | Disimpan per quarter               |
| KPMR     | Tahunan     | `kpmr:pasar-produk:{year}`         | Semua quarter dalam satu object   |

---

## 3. Struktur Data di Frontend

### 3.1 **INHERENT Data Structure**

```javascript
// Parameter (Level 1)
{
  id: string,
  nomor: string,            // "1", "1.1", "2"
  judul: string,            // "Reksa Dana Pasar Uang"
  bobot: number,            // 0-100%
  kategori: {
    model: "tanpa_model" | "open_end" | "terstruktur",
    prinsip: "syariah" | "konvensional" | "",
    jenis: "pasar_uang" | "pendapatan_tetap" | ...,
    underlying: string[]    // ["indeks", "eba", "dinfra", "obligasi"]
  },
  nilaiList: []             // Array of Nilai objects
}

// Nilai (Level 2)
{
  id: string,
  nomor: string,            // "1.1", "1.2"
  judul: {
    text: string,
    type: "Tanpa Faktor" | "Satu Faktor" | "Dua Faktor",
    value: string | null,
    pembilang: string,
    valuePembilang: string | null,
    penyebut: string,
    valuePenyebut: string | null,
    formula: string,
    percent: boolean
  },
  bobot: number,            // 0-100%
  portofolio: string,       // "% Dalam Portofolio"
  keterangan: string,
  riskindikator: {
    low: string,
    lowToModerate: string,
    moderate: string,
    moderateToHigh: string,
    high: string
  }
}
```

### 3.2 **KPMR Data Structure**

```javascript
// Aspek (Level 1)
{
  id: string,
  nomor: string,            // "I", "II", "1"
  judul: string,            // "Kebijakan dan Strategi"
  bobot: number,            // 0-100%
  pertanyaanList: []        // Array of Pertanyaan objects
}

// Pertanyaan (Level 2)
{
  id: string,
  nomor: string,            // "1", "2", "a", "b"
  pertanyaan: string,
  skor: {                   // Skor per quarter
    Q1: number,             // 1-5
    Q2: number,
    Q3: number,
    Q4: number
  },
  indicator: {              // Description level
    strong: string,
    satisfactory: string,
    fair: string,
    marginal: string,
    unsatisfactory: string
  },
  evidence: string
}
```

---

## 4. Layout Halaman

### 4.1 **Header Component**
- Title: "Risk Profile – Pasar Produk"
- Tahun aktif dropdown
- Quarter aktif dropdown (hanya untuk INHERENT)
- Search input
- Export button

### 4.2 **Tab Navigation**
- **INHERENT** - Untuk risiko inherent produk
- **KUALITAS PENERAPAN MANAJEMEN RISIKO** - Untuk assessment proses

### 4.3 **INHERENT Page Layout**
```
┌─────────────────────────────────────────────────────┐
│  PARAMETER PANEL                                    │
│  • Model Produk (Tanpa Model/Open-End/Terstruktur) │
│  • No + Bobot + Judul Parameter                     │
│  • Dropdown pilih parameter                         │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│  NILAI PANEL (hanya muncul jika ada parameter aktif)│
│  • Type (Tanpa Faktor/Satu Faktor/Dua Faktor)       │
│  • No + Bobot + Judul Nilai                         │
│  • Formula setup                                    │
│  • % Dalam Portofolio                               │
│  • Risk Indicator (5 level)                         │
│  • Keterangan                                       │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│  TABLE INHERENT                                     │
│  • Zoom control (100-150%)                          │
│  • Pagination (7 rows per page)                     │
│  • Summary global                                   │
└─────────────────────────────────────────────────────┘
```

### 4.4 **KPMR Page Layout**
```
┌─────────────────────────────────────────────────────┐
│  ASPEK PANEL                                        │
│  • No + Bobot + Judul Aspek                         │
│  • Dropdown pilih aspek                             │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│  PERTANYAAN PANEL (hanya muncul jika ada aspek aktif)│
│  • No + Skor Quarter + Pertanyaan                   │
│  • Description Level (5 level)                       │
│  • Evidence                                         │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│  TABLE KPMR                                         │
│  • Quarter selector (Q1-Q4 toggle)                  │
│  • Zoom control (100-125%)                          │
│  • Pagination (7 rows per page)                     │
│  • Summary per quarter                              │
└─────────────────────────────────────────────────────┘
```

---

## 5. Flow Interaksi User

### 5.1 **Flow INHERENT**
```
1. Pilih/Add Parameter
   └─ Isi kategori produk
   └─ Isi nomor, bobot, judul
   └─ Save

2. Pilih/Add Nilai pada parameter aktif
   └─ Pilih type (Tanpa/Satu/Dua Faktor)
   └─ Isi formula jika perlu
   └─ Isi % portofolio
   └─ Isi risk indicator (5 level)
   └─ Isi keterangan
   └─ Save

3. Data otomatis terhitung di tabel
   └─ Hasil = perhitungan formula
   └─ Peringkat = mapping dari hasil
   └─ Weighted = bobot × hasil
```

### 5.2 **Flow KPMR**
```
1. Pilih/Add Aspek
   └─ Isi nomor, bobot, judul
   └─ Save

2. Pilih/Add Pertanyaan pada aspek aktif
   └─ Isi nomor, pertanyaan
   └─ Isi skor per quarter (1-5)
   └─ Isi description level
   └─ Isi evidence
   └─ Save

3. Data otomatis terhitung di tabel
   └─ Average score per quarter
   └─ Color coding berdasarkan skor
```

---

## 6. Aturan UX Penting

### **INHERENT Rules:**
- ✅ Data disimpan **per quarter** (Q1, Q2, Q3, Q4 terpisah)
- ✅ Risk Indicator **hanya untuk nilai utama** (main row)
- ✅ Formula bisa menggunakan placeholder: `pem`, `pen`, `val`
- ✅ Bobot parameter + bobot nilai harus valid (0-100%)

### **KPMR Rules:**
- ✅ Data disimpan **per tahun** (semua quarter dalam satu object)
- ✅ User bisa memilih quarter mana yang ditampilkan di tabel
- ✅ Skor 1-5 dengan description level guidance
- ✅ Average score dihitung otomatis per aspek per quarter

### **Shared Rules:**
- ❌ **Tidak ada auto-copy** antar tahun/quarter
- ✅ **Auto-save dengan debouncing** (2 detik)
- ✅ **Edit mode eksplisit** (Save/Cancel buttons)
- ✅ **Delete dengan confirmation dialog**
- ✅ **Copy function** (parameter/aspek/pertanyaan)

---

## 7. Perbedaan Kunci antara INHERENT dan KPMR

| Aspek | INHERENT | KPMR |
|-------|----------|------|
| **Waktu** | Quarterly | Tahunan (track per quarter) |
| **Fokus** | Produk & Portofolio | Proses & Kualitas |
| **Struktur** | Parameter → Nilai | Aspek → Pertanyaan |
| **Input** | Bobot, Formula, % Portofolio | Skor (1-5), Evidence |
| **Perhitungan** | Weighted risk score | Average score |
| **Output** | Peringkat 1-5 + Total Weighted | Skor per quarter + Description |
| **UI Kompleksitas** | Tinggi (multiple factor types) | Sedang (tabular skoring) |
| **Tabel Fitur** | Zoom 100-150%, Fixed columns | Quarter toggle, Zoom 100-125% |

---

## 8. Storage & State Management

### **Storage Keys:**
```javascript
// INHERENT (per quarter)
`inherent:pasar-produk:${year}:${quarter}`

// KPMR (per tahun)
`kpmr:pasar-produk:${year}`

// Derived values (hasil perhitungan)
`derived:pasar-produk:${year}:${quarter}`
```

### **Auto-save Mechanism:**
1. **Debounced Save**: 2 detik setelah perubahan terakhir
2. **Signature Check**: Hanya save jika data berubah
3. **Beforeunload Protection**: Save saat user keluar halaman
4. **Manual Trigger**: `window.saveInherentData()` / `window.saveKpmrData()`

### **State Flow:**
```
User Action → Local State Update → Signature Check → Debounce Timer → 
Save to localStorage → Calculate Derived Values → Save Derived → 
Notify Updates → Update UI
```

---

## 9. Validation Rules

### **INHERENT Validation:**
- Bobot parameter: 0-100%
- Bobot nilai: 0-100%
- Formula: Valid expression
- Risk indicator: Optional text fields

### **KPMR Validation:**
- Skor: 1-5 (integer)
- Bobot aspek: 0-100%
- Pertanyaan: Required field
- Quarter skor: Optional per quarter

### **Shared Validation:**
- Nomor: String (bisa "1", "1.1", "I", "a")
- Judul: Required field
- Unique IDs: Auto-generated with `crypto.randomUUID()`

---

## 10. Tips untuk Developer Baru

### **Hal yang Sering Bikin Bingung:**
1. **INHERENT vs KPMR**: Ingat, INHERENT = produk, KPMR = proses
2. **Quarter vs Tahun**: INHERENT pakai quarter, KPMR pakai tahun
3. **Auto-save**: Tidak langsung save, tunggu 2 detik atau trigger manual
4. **Edit Mode**: Harus explicit klik Edit → ubah → Save/Cancel
5. **Table Rendering**: Zoom pakai CSS transform, bukan resize font

### **Debugging Tips:**
```javascript
// Cek data tersimpan
console.log(localStorage.getItem('inherent:pasar-produk:2024:Q1'))

// Cek derived values
console.log(localStorage.getItem('derived:pasar-produk:2024:Q1'))

// Paksa save manual
window.saveInherentData?.()
```

### **Common Issues:**
1. **Data hilang**: Cek tahun/quarter aktif sesuai storage key
2. **Perhitungan salah**: Cek `computeDerived()` function
3. **UI tidak update**: Cek state dependencies di useMemo/useCallback
4. **Performance lambat**: Cek jumlah data di localStorage

---

## 11. Future Enhancement Ideas

### **Short-term:**
1. **Bulk editing** untuk parameter/nilai
2. **Import/Export template** Excel
3. **Validation warnings** sebelum save

### **Long-term:**
1. **Real-time collaboration** dengan WebSocket
2. **Version history** untuk tracking perubahan
3. **Advanced analytics** dashboard
4. **Integration** dengan sistem eksternal

---
