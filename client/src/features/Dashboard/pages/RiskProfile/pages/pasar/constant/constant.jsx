// constant/constant.jsx
// Import dari formtemplate.jsx - pastikan pathnya benar
// import { emptyIndicator, KPMR_EMPTY_FORM } from './formtemplate.jsx';
import { emptyIndicator, KPMR_EMPTY_FORM } from '../components/formtemplate';
// ===================== B_rand =====================
export const PNM_BRAND = {
  primary: '#0068B3',
  primarySoft: '#E6F1FA',
  gradient: 'bg-gradient-to-r from-[#0076C6]/90 via-[#00A3DA]/90 to-[#33C2B5]/90',
};

// formatters
export const fmtNumber = (v) => {
  if (v === '' || v == null) return '';
  const n = Number(v);
  if (isNaN(n)) return String(v);
  return new Intl.NumberFormat('en-US').format(n);
};

export const fmtPercentFromDecimal = (v) => {
  if (v === '' || v == null || isNaN(Number(v))) return '';
  return (Number(v) * 100).toFixed(2) + '%';
};

// Helper function untuk transform data antara frontend dan backend
export const transformIndicatorToBackend = (frontendData) => {
  // ✅ PERBAIKAN: Pastikan semua number field dikonversi ke number
  return {
    sectionId: Number(frontendData.sectionId) || 0, // ✅ Force convert to number
    nama_indikator: frontendData.nama_indikator || '',
    bobot_indikator: Number(frontendData.bobot_indikator) || 0,
    pembilang_label: frontendData.pembilang_label || '',
    pembilang_value: Number(frontendData.pembilang_value) || 0,
    penyebut_label: frontendData.penyebut_label || '',
    penyebut_value: Number(frontendData.penyebut_value) || 0,
    sumber_risiko: frontendData.sumber_risiko || '',
    dampak: frontendData.dampak || '',
    low: frontendData.low || '',
    low_to_moderate: frontendData.low_to_moderate || '',
    moderate: frontendData.moderate || '',
    moderate_to_high: frontendData.moderate_to_high || '',
    high: frontendData.high || '',
    peringkat: Number(frontendData.peringkat) || 1,
    keterangan: frontendData.keterangan || '',
  };
};

export const transformIndicatorToFrontend = (indicator) => ({
  id: indicator.id,
  nama_indikator: indicator.nama_indikator,
  bobot_indikator: indicator.bobot_indikator,
  pembilang_label: indicator.pembilang_label,
  pembilang_value: indicator.pembilang_value,
  penyebut_label: indicator.penyebut_label,
  penyebut_value: indicator.penyebut_value,
  sumber_risiko: indicator.sumber_risiko,
  dampak: indicator.dampak,
  low: indicator.low,
  low_to_moderate: indicator.low_to_moderate,
  moderate: indicator.moderate,
  moderate_to_high: indicator.moderate_to_high,
  high: indicator.high,
  peringkat: indicator.peringkat,
  weighted: indicator.weighted,
  hasil: indicator.hasil,
  keterangan: indicator.keterangan,
  // Legacy fields untuk kompatibilitas
  indikator: indicator.nama_indikator,
  bobotIndikator: indicator.bobot_indikator,
  sumberRisiko: indicator.sumber_risiko,
  pembilangLabel: indicator.pembilang_label,
  pembilangValue: indicator.pembilang_value,
  penyebutLabel: indicator.penyebut_label,
  penyebutValue: indicator.penyebut_value,
  lowToModerate: indicator.low_to_moderate,
  moderateToHigh: indicator.moderate_to_high,
});

// Export semua constants termasuk yang diimport
export { emptyIndicator, KPMR_EMPTY_FORM };
