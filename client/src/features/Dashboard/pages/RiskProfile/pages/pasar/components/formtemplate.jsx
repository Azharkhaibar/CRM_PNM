// formtemplate.jsx
// formtemplate.jsx - PERBAIKI
export const emptyIndicator = {
  id: null,
  nama_indikator: '',
  bobot_indikator: '',
  sumber_risiko: '',
  dampak: '',
  pembilang_label: '',
  pembilang_value: '',
  penyebut_label: '',
  penyebut_value: '',
  low: '',
  low_to_moderate: '',
  moderate: '',
  moderate_to_high: '',
  high: '',
  peringkat: 1,
  weighted: '',
  hasil: '',
  keterangan: '',
  // ✅ PERBAIKAN: sectionId harus number, bukan null
  sectionId: 0, // Default ke 0 atau ID section yang valid
};

// Alias untuk kompatibilitas dengan kode lama (jika perlu)
export const emptyIndicatorLegacy = {
  id: null,
  indikator: '',
  bobotIndikator: '',
  sumberRisiko: '',
  dampak: '',
  pembilangLabel: '',
  pembilangValue: '',
  penyebutLabel: '',
  penyebutValue: '',
  low: '',
  lowToModerate: '',
  moderate: '',
  moderateToHigh: '',
  high: '',
  peringkat: 1,
  weighted: '',
  hasil: '',
  keterangan: '',
};

// KPMR template
export const KPMR_EMPTY_FORM = {
  year: new Date().getFullYear(),
  quarter: 'Q1',
  aspekNo: 'Aspek 1',
  aspekTitle: 'Tata Kelola Risiko',
  aspekBobot: 30,
  sectionNo: '1',
  sectionTitle: 'Bagaimana perumusan tingkat risiko yang akan diambil (risk appetite) dan toleransi risiko (risk tolerance) terkait risiko pasar?',
  sectionSkor: '',
  level1: '',
  level2: '',
  level3: '',
  level4: '',
  level5: '',
  evidence: '',
};
