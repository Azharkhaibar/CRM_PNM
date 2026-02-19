// components/HukumTabs.jsx - VERSI TERINTEGRASI (Dengan UI Notification seperti Pasar)
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Download, Trash2, Edit3, Search, Plus, ChevronDown, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

// Import components
import { YearInput, QuarterSelect } from '../../pasar/components/Inputs.jsx';
import { exportKPMRPasarToExcel as exportKPMRHukumToExcel } from '../../pasar/utils/excelexportpasar.jsx';
import { useHukum } from '../hook/hukum/hukum.hook.js';
import { exportHukumToExcel } from '../components/exporthukumtoexcel.jsx';
// ===================== Brand =====================
const PNM_BRAND = {
  primary: '#0068B3',
  primarySoft: '#E6F1FA',
  gradient: 'bg-gradient-to-r from-[#0076C6]/90 via-[#00A3DA]/90 to-[#33C2B5]/90',
};

// ===================== Calculation Mode =====================
const CalculationMode = {
  RASIO: 'RASIO',
  NILAI_TUNGGAL: 'NILAI_TUNGGAL',
  TEKS: 'TEKS',
};

// ===================== RiskBox Component =====================
const RiskBox = ({ label, value, onChange, color, textColor = '#111827', placeholder, className = '' }) => {
  const handleChange = (e) => {
    onChange && onChange(e.target.value);
  };

  const handleInput = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className={className}>
      <div
        style={{
          border: '2px solid #0f1a0f',
          borderRadius: 14,
          overflow: 'hidden',
          background: '#E9F7E6',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 44 + 4 + 44,
        }}
      >
        {/* Header */}
        <div
          style={{
            background: color || '#93D24D',
            color: textColor === '#111827' ? '#111' : textColor,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 16,
            padding: '0 12px',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={label}
        >
          {label}
        </div>

        {/* Garis pemisah */}
        <div style={{ height: 4, background: '#0f1a0f', flex: '0 0 auto' }} />

        {/* Area isi */}
        <div style={{ padding: 8, flex: '1 0 auto' }}>
          <textarea
            value={value}
            onChange={handleChange}
            onInput={handleInput}
            placeholder={placeholder}
            rows={2}
            style={{
              width: '100%',
              minHeight: 44,
              textAlign: 'center',
              fontWeight: 700,
              fontSize: 16,
              color: '#0f1a0f',
              background: '#E9F7E6',
              border: 'none',
              outline: 'none',
              borderRadius: 10,
              resize: 'none',
              overflow: 'hidden',
              whiteSpace: 'pre-wrap',
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ===================== Helper Functions =====================
const fmtNumber = (v) => {
  if (v === '' || v == null) return '';
  const n = Number(v);
  if (isNaN(n)) return String(v);
  return new Intl.NumberFormat('en-US').format(n);
};

const parseNum = (v) => {
  if (v == null || v === '' || v === undefined) return 0;

  // Jika string, hilangkan koma, spasi, dll
  if (typeof v === 'string') {
    const cleaned = v.replace(/[^\d.-]/g, '');
    const n = Number(cleaned);
    return isNaN(n) ? 0 : n;
  }

  const n = Number(v);
  return isNaN(n) ? 0 : n;
};

// Empty indicator template
const emptyIndicator = {
  id: null,
  subNo: '',
  indikator: '',
  mode: CalculationMode.RASIO,
  formula: '',
  isPercent: false,
  bobotIndikator: 0,
  sumberRisiko: '',
  dampak: '',
  pembilangLabel: '',
  pembilangValue: '',
  penyebutLabel: '',
  penyebutValue: '',
  peringkat: 1,
  weighted: '',
  hasil: '',
  hasilText: '',
  low: '',
  lowToModerate: '',
  moderate: '',
  moderateToHigh: '',
  high: '',
  keterangan: '',
  sectionId: null,
  year: new Date().getFullYear(),
  quarter: 'Q1',
};

// Transform functions untuk hukum - SESUAI dengan service
const transformIndicatorToBackend = (indicatorData, year, quarter, sectionId, sectionData) => {
  // Hitung hasil dan weighted
  const hasil = computeHasil(indicatorData);
  const weighted = computeWeightedAuto(indicatorData, sectionData?.bobotSection || 100);

  return {
    // ========== PERIODE ==========
    year: Number(year),
    quarter: quarter,

    // ========== RELASI SECTION ==========
    sectionId: Number(sectionId),

    // ========== DATA SECTION ==========
    no: sectionData?.no || '',
    sectionLabel: sectionData?.parameter || '',
    bobotSection: Number(sectionData?.bobotSection || 0),

    // ========== DATA INDIKATOR ==========
    subNo: indicatorData.subNo?.toString().trim() || '',
    indikator: indicatorData.indikator?.toString().trim() || '',
    bobotIndikator: Number(indicatorData.bobotIndikator) || 0,

    // ========== ANALISIS RISIKO ==========
    sumberRisiko: indicatorData.sumberRisiko?.trim() || undefined,
    dampak: indicatorData.dampak?.trim() || undefined,

    // ========== LEVEL RISIKO ==========
    low: indicatorData.low?.trim() || undefined,
    lowToModerate: indicatorData.lowToModerate?.trim() || undefined,
    moderate: indicatorData.moderate?.trim() || undefined,
    moderateToHigh: indicatorData.moderateToHigh?.trim() || undefined,
    high: indicatorData.high?.trim() || undefined,

    // ========== METODE PERHITUNGAN ==========
    mode: indicatorData.mode || CalculationMode.RASIO,
    formula: indicatorData.formula?.trim() || undefined,
    isPercent: Boolean(indicatorData.isPercent || false),

    // ========== FAKTOR PERHITUNGAN ==========
    pembilangLabel: indicatorData.pembilangLabel?.trim() || undefined,
    pembilangValue: indicatorData.pembilangValue !== undefined && indicatorData.pembilangValue !== '' ? Number(indicatorData.pembilangValue) : undefined,
    penyebutLabel: indicatorData.penyebutLabel?.trim() || undefined,
    penyebutValue: indicatorData.penyebutValue !== undefined && indicatorData.penyebutValue !== '' ? Number(indicatorData.penyebutValue) : undefined,

    // ========== HASIL ==========
    hasil: hasil !== null && hasil !== '' ? Number(hasil) : undefined,
    hasilText: indicatorData.mode === CalculationMode.TEKS ? indicatorData.hasilText?.trim() || undefined : undefined,

    // ========== SKOR DAN BOBOT ==========
    peringkat: Number(indicatorData.peringkat || 1),
    weighted: weighted,

    // ========== KETERANGAN ==========
    keterangan: indicatorData.keterangan?.trim() || undefined,

    // ========== AUDIT TRAIL ==========
    createdBy: 'admin',
  };
};

const transformIndicatorToFrontend = (indikator) => {
  return {
    id: indikator.id,
    subNo: indikator.subNo || '',
    indikator: indikator.indikator || '',
    bobotIndikator: indikator.bobotIndikator || 0,
    sumberRisiko: indikator.sumberRisiko || '',
    dampak: indikator.dampak || '',
    pembilangLabel: indikator.pembilangLabel || '',
    pembilangValue: indikator.pembilangValue !== null ? indikator.pembilangValue.toString() : '',
    penyebutLabel: indikator.penyebutLabel || '',
    penyebutValue: indikator.penyebutValue !== null ? indikator.penyebutValue.toString() : '',
    peringkat: indikator.peringkat || 1,
    weighted: indikator.weighted || '',
    hasil: indikator.hasil !== null ? indikator.hasil.toString() : '',
    hasilText: indikator.hasilText || '',
    keterangan: indikator.keterangan || '',
    isPercent: Boolean(indikator.isPercent),
    mode: indikator.mode || CalculationMode.RASIO,
    formula: indikator.formula || '',
    low: indikator.low || '',
    lowToModerate: indikator.lowToModerate || '',
    moderate: indikator.moderate || '',
    moderateToHigh: indikator.moderateToHigh || '',
    high: indikator.high || '',
    sectionId: indikator.sectionId,
    year: indikator.year,
    quarter: indikator.quarter,
  };
};

// Transform functions untuk section
const transformSectionToBackendHukum = (sectionData, year, quarter) => {
  return {
    no: sectionData.no,
    parameter: sectionData.parameter,
    bobotSection: Number(sectionData.bobotSection || 0),
    description: sectionData.description || '',
    sortOrder: sectionData.sortOrder || 0,
    isActive: sectionData.isActive !== undefined ? sectionData.isActive : true,
    // TAMBAHKAN YEAR DAN QUARTER
    year: Number(year),
    quarter: quarter,
  };
};

// ===================== Calculation Functions =====================
const computeHasil = (ind) => {
  const mode = ind?.mode || CalculationMode.RASIO;
  if (mode === CalculationMode.TEKS) return null;

  const pemb = parseNum(ind.pembilangValue);
  const peny = parseNum(ind.penyebutValue);

  const formula = ind.formula || '';
  if (formula.trim() !== '') {
    try {
      const expr = formula.replace(/\bpemb\b/g, 'pemb').replace(/\bpeny\b/g, 'peny');
      const fn = new Function('pemb', 'peny', `return (${expr});`);
      const res = fn(pemb, peny);
      if (!isFinite(res) || isNaN(res)) return null;

      // FORMAT ORIGIN: max 4 decimal, hapus trailing zeros
      const fixed = parseFloat(res).toFixed(4);
      return fixed.replace(/\.?0+$/, ''); // "1.2500" -> "1.25"
    } catch (e) {
      console.warn('Invalid formula (Hukum):', formula, e);
      return null;
    }
  }

  if (mode === CalculationMode.NILAI_TUNGGAL) {
    if (ind.penyebutValue === '' || ind.penyebutValue == null) return null;
    // Format as number (tidak perlu decimal khusus)
    return Number(peny);
  }

  if (peny === 0) return null;
  const result = pemb / peny;
  if (!isFinite(result) || isNaN(result)) return null;

  // ✅ PERBAIKAN PENTING: Jika isPercent true, bagi dengan 100
  let finalResult = result;

  // Cek apakah input mengandung '%'
  const pembHasPercent = String(ind.pembilangValue || '').includes('%');
  const penyHasPercent = String(ind.penyebutValue || '').includes('%');

  // Jika KEDUA input mengandung %, hasil sudah dalam bentuk decimal (0.xx)
  if (pembHasPercent && penyHasPercent) {
    // Sudah benar, tidak perlu adjustment
  }
  // Jika hanya isPercent true (tanpa % di input), bagi dengan 100
  else if (ind.isPercent && !pembHasPercent && !penyHasPercent) {
    finalResult = result / 100;
  }
  // Jika salah satu input mengandung % dan isPercent true, tidak perlu adjustment
  // karena sudah dalam bentuk yang benar

  // FORMAT ORIGIN: max 4 decimal, hapus trailing zeros
  const fixed = parseFloat(finalResult).toFixed(4);
  return fixed.replace(/\.?0+$/, ''); // "1.2500" -> "1.25"
};

const computeWeightedAuto = (ind, sectionBobot) => {
  const sectionB = Number(sectionBobot || 0);
  const bobotInd = Number(ind.bobotIndikator || 0);
  const peringkat = Number(ind.peringkat || 0);
  const res = (sectionB * bobotInd * peringkat) / 10000;
  if (!isFinite(res) || isNaN(res)) return 0;

  // FORMAT ORIGIN: 2 decimal
  return Number(res.toFixed(2));
};

// Total baris per indikator
const rowsPerIndicator = (ind) => {
  return 1 + (ind.mode === CalculationMode.RASIO ? 2 : 1);
};

// ===================== MAIN COMPONENT =====================
export default function HukumTab() {
  // ====== STATES UTAMA ======
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewQuarter, setViewQuarter] = useState('Q1');
  const [query, setQuery] = useState('');

  // ====== HOOK HUKUM ======
  const {
    // State dari hook
    sectionsWithIndicators, // <-- INI YANG HARUSNYA DIGUNAKAN
    loading,
    error,
    totalWeighted,
    viewYear: hookViewYear, // AMBIL DARI HOOK
    viewQuarter: hookViewQuarter, // AMBIL DARI HOOK
    query: hookQuery, // AMBIL DARI HOOK

    // Actions dari hook
    setViewYear: setHookViewYear, // FUNGSI SETTER DARI HOOK
    setViewQuarter: setHookViewQuarter, // FUNGSI SETTER DARI HOOK
    setQuery: setHookQuery, // FUNGSI SETTER DARI HOOK
    clearError,

    // CRUD operations
    getSectionsWithIndicatorsByPeriod,
    createSection,
    updateSection,
    deleteSection,
    createIndikator,
    updateIndikator,
    deleteIndikator,
    getAllSections,
  } = useHukum({
    initialYear: new Date().getFullYear(),
    initialQuarter: 'Q1',
    autoLoad: true,
  });

  // ====== States Lain ======
  const [sections, setSections] = useState(sectionsWithIndicators || []); // GUNAKAN DATA DARI HOOK
  const [localError, setLocalError] = useState(null);
  const [allSections, setAllSections] = useState([]);
  const [notification, setNotification] = useState({
    type: '',
    message: '',
    show: false,
  });
  const [loadingAllSections, setLoadingAllSections] = useState(false);

  // State section form
  const [sectionForm, setSectionForm] = useState({
    id: null,
    no: '',
    bobotSection: 100,
    parameter: '',
    description: '',
    year: viewYear,
    quarter: viewQuarter,
    isActive: true,
    sortOrder: 0,
  });

  const [indicatorForm, setIndicatorForm] = useState({
    ...emptyIndicator,
    sectionId: null,
    year: viewYear,
    quarter: viewQuarter,
  });

  const [isEditingSection, setIsEditingSection] = useState(false);
  const [isEditingIndicator, setIsEditingIndicator] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ====== Fungsi untuk menampilkan notifikasi ======
  const showNotification = useCallback((type, message) => {
    setNotification({ type, message, show: true });

    // Auto hide setelah 4 detik
    setTimeout(() => {
      hideNotification();
    }, 4000);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification({ type: '', message: '', show: false });
  }, []);

  // Fungsi untuk handle perubahan tahun
  const handleYearChange = (year) => {
    const newYear = Number(year);
    setViewYear(newYear);
    setHookViewYear(newYear); // UPDATE DI HOOK JUGA

    // Reset section form jika ada
    if (sectionForm.id) {
      resetSectionForm();
    }

    // Reset indicator form dengan tahun baru
    setIndicatorForm((prev) => ({
      ...emptyIndicator,
      year: newYear,
      quarter: viewQuarter,
      sectionId: sectionForm.id,
    }));
  };

  // Fungsi untuk handle perubahan quarter
  const handleQuarterChange = (quarter) => {
    setViewQuarter(quarter);
    setHookViewQuarter(quarter); // UPDATE DI HOOK JUGA

    // Reset section form jika ada
    if (sectionForm.id) {
      resetSectionForm();
    }

    // Reset indicator form dengan quarter baru
    setIndicatorForm((prev) => ({
      ...emptyIndicator,
      year: viewYear,
      quarter: quarter,
      sectionId: sectionForm.id,
    }));
  };

  // Fungsi untuk handle perubahan query
  const handleQueryChange = (newQuery) => {
    setQuery(newQuery);
    setHookQuery(newQuery); // UPDATE DI HOOK JUGA
  };

  // ====== Fungsi untuk load data ======
  const loadData = useCallback(async () => {
    console.log('🔄 Loading data for:', viewYear, viewQuarter);

    setLocalError(null);

    try {
      if (!viewYear || !viewQuarter) {
        throw new Error('Tahun dan quarter harus diisi');
      }

      const quarterUpper = String(viewQuarter).toUpperCase();
      if (!['Q1', 'Q2', 'Q3', 'Q4'].includes(quarterUpper)) {
        throw new Error(`Quarter tidak valid: ${viewQuarter}`);
      }

      // Panggil API melalui hook
      const data = await getSectionsWithIndicatorsByPeriod(viewYear, quarterUpper);

      console.log('📥 Data loaded:', data);

      // Pastikan data ada dan formatnya benar
      if (!data || !Array.isArray(data)) {
        console.warn('Data tidak valid:', data);
        setSections([]);
      } else {
        setSections(data);
      }
    } catch (err) {
      console.error('❌ Error loading data:', err);
      setLocalError(err.message || 'Gagal memuat data hukum');
      showNotification('error', err.message || 'Gagal memuat data hukum');
      setSections([]);
    }
  }, [viewYear, viewQuarter, getSectionsWithIndicatorsByPeriod, showNotification]);

  // Load semua section dari database
  const loadAllSections = useCallback(async () => {
    setLoadingAllSections(true);
    try {
      console.log('🔄 [HUKUM] Loading all sections...');

      const allSectionsData = await getAllSections(true); // Hanya ambil yang aktif

      // Transform data
      const transformedSections = allSectionsData.map((s) => ({
        id: s.id,
        no: s.no,
        parameter: s.parameter,
        bobotSection: s.bobotSection,
        description: s.description || '',
        year: s.year || viewYear,
        quarter: s.quarter || viewQuarter,
        isActive: s.isActive,
        sortOrder: s.sortOrder,
      }));

      setAllSections(transformedSections);
      console.log('✅ [HUKUM] All sections loaded:', transformedSections.length);
    } catch (err) {
      console.error('❌ [HUKUM] Error loading all sections:', err);
      showNotification('error', 'Gagal memuat daftar section');
    } finally {
      setLoadingAllSections(false);
    }
  }, [getAllSections, viewYear, viewQuarter, showNotification]);

  // ====== Effects ======
  useEffect(() => {
    // Update sections saat data dari hook berubah
    if (sectionsWithIndicators && sectionsWithIndicators !== sections) {
      setSections(sectionsWithIndicators);
    }
  }, [sectionsWithIndicators, sections]);

  useEffect(() => {
    // Load data saat tahun/quarter berubah
    if (viewYear && viewQuarter) {
      loadData();
    }
  }, [viewYear, viewQuarter]); // Trigger saat tahun/quarter berubah

  useEffect(() => {
    if (error) {
      showNotification('error', error);
      clearError();
    }
  }, [error, clearError, showNotification]);

  useEffect(() => {
    setIndicatorForm((prev) => ({
      ...prev,
      year: viewYear,
      quarter: viewQuarter,
    }));
  }, [viewYear, viewQuarter]);

  // Effect untuk auto-calculate
  useEffect(() => {
    if (sectionForm.id) {
      const hasil = computeHasil(indicatorForm);
      const weighted = computeWeightedAuto(indicatorForm, sectionForm.bobotSection);

      setIndicatorForm((prev) => ({
        ...prev,
        hasil: hasil !== null ? hasil.toString() : '',
        weighted: weighted,
      }));
    }
  }, [indicatorForm.pembilangValue, indicatorForm.penyebutValue, indicatorForm.mode, indicatorForm.formula, indicatorForm.peringkat, indicatorForm.bobotIndikator, sectionForm.bobotSection]);

  // ====== Helper Functions untuk Sections ======
  const getUniqueSections = useMemo(() => {
    // Filter hanya sections untuk periode saat ini
    const sectionsForCurrentPeriod = sections.filter((section) => {
      return section.year === viewYear && section.quarter === viewQuarter;
    });

    console.log('📊 Sections for current period:', sectionsForCurrentPeriod.length);

    const uniqueMap = new Map();

    sectionsForCurrentPeriod.forEach((section) => {
      const key = `${section.no}-${section.parameter}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, {
          id: section.id,
          no: section.no,
          name: section.parameter,
          bobotSection: section.bobotSection,
          description: section.description,
          year: section.year,
          quarter: section.quarter,
        });
      }
    });

    const result = Array.from(uniqueMap.values()).sort((a, b) => {
      const numA = parseInt(a.no) || 0;
      const numB = parseInt(b.no) || 0;
      return numA - numB;
    });

    return result;
  }, [sections, viewYear, viewQuarter]);

  // ====== Helper Functions ======
  const setIndicatorField = (field, value) => {
    setIndicatorForm((prev) => ({
      ...prev,
      [field]: value === null ? '' : value,
    }));
  };

  const selectSection = (sectionId) => {
    console.log('📝 [SELECT SECTION] Selecting section ID:', sectionId);

    // Jika memilih "new" untuk buat section baru
    if (sectionId === 'new') {
      resetSectionForm();
      return;
    }

    // Cari section berdasarkan ID
    const section = sections.find((s) => s.id === sectionId);
    if (!section) {
      console.log('❌ [SELECT SECTION] Section not found in current period, checking all sections...');

      // Coba cari di allSections
      const sectionFromAll = allSections.find((s) => s.id === sectionId);
      if (sectionFromAll) {
        console.log('✅ [SELECT SECTION] Found in allSections:', sectionFromAll);
        setSectionForm({
          id: sectionFromAll.id,
          no: sectionFromAll.no,
          bobotSection: sectionFromAll.bobotSection,
          parameter: sectionFromAll.parameter,
          description: sectionFromAll.description || '',
          year: sectionFromAll.year || viewYear,
          quarter: sectionFromAll.quarter || viewQuarter,
          isActive: sectionFromAll.isActive,
          sortOrder: sectionFromAll.sortOrder,
        });
        setIsEditingSection(true);
        setIndicatorForm((prev) => ({
          ...prev,
          sectionId: sectionFromAll.id,
        }));
      } else {
        console.log('❌ [SELECT SECTION] Section not found anywhere');
        showNotification('error', 'Section tidak ditemukan');
      }
      return;
    }

    console.log('✅ [SELECT SECTION] Section found:', section);

    // Set section form
    setSectionForm({
      id: section.id,
      no: section.no,
      bobotSection: section.bobotSection,
      parameter: section.parameter,
      description: section.description || '',
      year: section.year || viewYear,
      quarter: section.quarter || viewQuarter,
      isActive: section.isActive !== undefined ? section.isActive : true,
      sortOrder: section.sortOrder || 0,
    });

    setIsEditingSection(true);
    setIndicatorForm((prev) => ({
      ...prev,
      sectionId: section.id,
    }));

    console.log('✅ [SELECT SECTION] Section form set:', section.parameter);
  };

  const formatHasilNumber = (value, maxDecimals = 4) => {
    if (value === '' || value == null) return '';
    const n = Number(value);
    if (!isFinite(n) || isNaN(n)) return '';

    // batasi maxDecimals, lalu buang .0000 di belakang
    const fixed = n.toFixed(maxDecimals);
    return fixed.replace(/\.?0+$/, ''); // "1.2300" -> "1.23", "0.0000" -> "0"
  };

  const resetSectionForm = () => {
    setSectionForm({
      id: null,
      no: '',
      bobotSection: 100,
      parameter: '',
      description: '',
      year: viewYear,
      quarter: viewQuarter,
      isActive: true,
      sortOrder: 0,
    });
    setIsEditingSection(false);
    setIndicatorForm((prev) => ({ ...prev, sectionId: null }));
  };

  const resetIndicatorForm = () => {
    setIndicatorForm({
      ...emptyIndicator,
      sectionId: sectionForm.id,
      year: viewYear,
      quarter: viewQuarter,
    });
    setIsEditingIndicator(false);
    setLocalError(null);
  };

  const handleEditIndicator = (indikator) => {
    console.log('📝 Editing indicator:', indikator);

    const formData = {
      id: indikator.id,
      subNo: indikator.subNo || '',
      indikator: indikator.indikator || '',
      bobotIndikator: indikator.bobotIndikator || 0,
      sumberRisiko: indikator.sumberRisiko || '',
      dampak: indikator.dampak || '',
      pembilangLabel: indikator.pembilangLabel || '',
      pembilangValue: indikator.pembilangValue || '',
      penyebutLabel: indikator.penyebutLabel || '',
      penyebutValue: indikator.penyebutValue || '',
      peringkat: indikator.peringkat || 1,
      weighted: indikator.weighted || '',
      hasil: indikator.hasil || '',
      hasilText: indikator.hasilText || '',
      low: indikator.low || '',
      lowToModerate: indikator.lowToModerate || '',
      moderate: indikator.moderate || '',
      moderateToHigh: indikator.moderateToHigh || '',
      high: indikator.high || '',
      keterangan: indikator.keterangan || '',
      isPercent: Boolean(indikator.isPercent),
      mode: indikator.mode || CalculationMode.RASIO,
      formula: indikator.formula || '',
      sectionId: sectionForm.id,
    };

    setIndicatorForm(formData);
    setIsEditingIndicator(true);
    console.log('✅ Form set for editing:', formData.indikator);
  };

  // ====== Validation Functions ======
  const validateSectionForm = () => {
    if (!sectionForm.no?.trim()) {
      setLocalError('No Section harus diisi');
      showNotification('error', 'No Section harus diisi');
      return false;
    }

    if (!sectionForm.parameter?.trim()) {
      setLocalError('Nama Section harus diisi');
      showNotification('error', 'Nama Section harus diisi');
      return false;
    }

    const bobot = Number(sectionForm.bobotSection);
    if (isNaN(bobot) || bobot <= 0 || bobot > 100) {
      setLocalError('Bobot Section harus antara 1-100');
      showNotification('error', 'Bobot Section harus antara 1-100');
      return false;
    }

    return true;
  };

  const validateIndicatorForm = () => {
    if (!sectionForm.id) {
      setLocalError('Pilih section terlebih dahulu');
      showNotification('error', 'Pilih section terlebih dahulu');
      return false;
    }

    if (!indicatorForm.subNo?.trim()) {
      setLocalError('Sub No harus diisi');
      showNotification('error', 'Sub No harus diisi');
      return false;
    }

    if (!indicatorForm.indikator?.trim()) {
      setLocalError('Nama Indikator harus diisi');
      showNotification('error', 'Nama Indikator harus diisi');
      return false;
    }

    const bobotIndikator = Number(indicatorForm.bobotIndikator);
    if (isNaN(bobotIndikator) || bobotIndikator <= 0 || bobotIndikator > 100) {
      setLocalError('Bobot Indikator harus antara 1-100');
      showNotification('error', 'Bobot Indikator harus antara 1-100');
      return false;
    }

    // Validasi khusus untuk mode RASIO
    if (indicatorForm.mode === CalculationMode.RASIO) {
      if (indicatorForm.penyebutValue === '' || indicatorForm.penyebutValue == null) {
        setLocalError('Nilai penyebut harus diisi untuk mode RASIO');
        showNotification('error', 'Nilai penyebut harus diisi untuk mode RASIO');
        return false;
      }
    }

    // Validasi untuk mode NILAI_TUNGGAL
    if (indicatorForm.mode === CalculationMode.NILAI_TUNGGAL) {
      if (indicatorForm.penyebutValue === '' || indicatorForm.penyebutValue == null) {
        setLocalError('Nilai penyebut harus diisi untuk mode NILAI_TUNGGAL');
        showNotification('error', 'Nilai penyebut harus diisi untuk mode NILAI_TUNGGAL');
        return false;
      }
    }

    // Validasi untuk mode TEKS
    if (indicatorForm.mode === CalculationMode.TEKS) {
      if (!indicatorForm.hasilText?.trim()) {
        setLocalError('Hasil teks harus diisi untuk mode TEKS');
        showNotification('error', 'Hasil teks harus diisi untuk mode TEKS');
        return false;
      }
    }

    return true;
  };

  // ====== CRUD Operations dengan Notification ======
  const handleCreateSection = async () => {
    setLocalError(null);

    if (!validateSectionForm()) return;

    // HAPUS VALIDASI DUPLIKASI DI FRONTEND
    // Biarkan backend yang menangani dengan sistem reactivation

    setIsCreating(true);
    try {
      const sectionData = transformSectionToBackendHukum(sectionForm, viewYear, viewQuarter);

      console.log('📤 Creating section with data:', sectionData);

      await createSection(sectionData);
      showNotification('success', `✅ Section "${sectionForm.parameter}" berhasil dibuat/diaktifkan kembali`);

      resetSectionForm();
      await loadData();
      await loadAllSections();
    } catch (err) {
      console.error('❌ Error creating section:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Terjadi kesalahan';

      // Tampilkan pesan error yang lebih jelas
      if (err.response?.status === 409) {
        // Conflict - data sudah ada (tidak dihapus)
        setLocalError(`Section "${sectionForm.no} - ${sectionForm.parameter}" sudah ada di periode ini.`);
        showNotification('error', `Section sudah aktif di periode ${viewYear}-${viewQuarter}`);
      } else {
        setLocalError(`Gagal membuat section: ${errorMessage}`);
        showNotification('error', `❌ Gagal: ${errorMessage}`);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateSection = async () => {
    setLocalError(null);
    if (!sectionForm.id) return;

    if (!validateSectionForm()) return;

    setIsUpdating(true);
    try {
      const updateData = transformSectionToBackendHukum(sectionForm, viewYear, viewQuarter);

      console.log('📤 Updating section with data:', updateData);

      await updateSection(sectionForm.id, updateData);
      showNotification('success', `✅ Section "${sectionForm.parameter}" berhasil diperbarui`);

      resetSectionForm();
      await loadData();
      await loadAllSections(); // Refresh daftar section
    } catch (err) {
      console.error('❌ Error updating section:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Terjadi kesalahan';
      setLocalError(`Gagal update section: ${errorMessage}`);
      showNotification('error', `❌ Gagal update section: ${errorMessage}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus section ini? Semua indikator dalam section ini juga akan dihapus.')) return;

    setIsDeleting(true);
    try {
      await deleteSection(sectionId);
      showNotification('success', '✅ Section berhasil dihapus');

      if (sectionForm.id === sectionId) {
        resetSectionForm();
      }

      await loadData();
      await loadAllSections(); // Refresh daftar section
    } catch (err) {
      console.error('❌ Error deleting section:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Terjadi kesalahan';
      setLocalError(`Gagal menghapus section: ${errorMessage}`);
      showNotification('error', `❌ Gagal menghapus section: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateIndicator = async () => {
    setLocalError(null);

    if (!validateIndicatorForm()) return;

    setIsCreating(true);
    try {
      const indicatorData = transformIndicatorToBackend(indicatorForm, viewYear, viewQuarter, sectionForm.id, sectionForm);

      console.log('📤 Creating indicator with data:', indicatorData);

      await createIndikator(indicatorData);
      showNotification('success', `✅ Indikator "${indicatorForm.indikator}" berhasil dibuat/diaktifkan kembali`);

      resetIndicatorForm();
      await loadData();
    } catch (err) {
      console.error('❌ Error creating indicator:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Terjadi kesalahan';

      // Tampilkan pesan error yang lebih jelas
      if (err.response?.status === 409) {
        // Conflict - data sudah ada (tidak dihapus)
        setLocalError(`Indikator dengan nomor "${indicatorForm.subNo}" sudah ada di section ini.`);
        showNotification('error', `Indikator sudah aktif di section ini`);
      } else {
        setLocalError(`Gagal membuat indikator: ${errorMessage}`);
        showNotification('error', `❌ Gagal: ${errorMessage}`);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateIndicator = async () => {
    if (!indicatorForm.id) {
      setLocalError('ID indikator tidak ditemukan');
      showNotification('error', 'ID indikator tidak ditemukan');
      return;
    }

    setIsUpdating(true);
    try {
      const updateData = {
        subNo: indicatorForm.subNo,
        indikator: indicatorForm.indikator,
        bobotIndikator: Number(indicatorForm.bobotIndikator),
        sumberRisiko: indicatorForm.sumberRisiko || undefined,
        dampak: indicatorForm.dampak || undefined,
        low: indicatorForm.low || undefined,
        lowToModerate: indicatorForm.lowToModerate || undefined,
        moderate: indicatorForm.moderate || undefined,
        moderateToHigh: indicatorForm.moderateToHigh || undefined,
        high: indicatorForm.high || undefined,
        mode: indicatorForm.mode,
        formula: indicatorForm.formula || undefined,
        isPercent: indicatorForm.isPercent || false,
        pembilangLabel: indicatorForm.pembilangLabel || undefined,
        pembilangValue: indicatorForm.pembilangValue ? Number(indicatorForm.pembilangValue) : undefined,
        penyebutLabel: indicatorForm.penyebutLabel || undefined,
        penyebutValue: indicatorForm.penyebutValue ? Number(indicatorForm.penyebutValue) : undefined,
        hasil: indicatorForm.hasil ? Number(indicatorForm.hasil) : undefined,
        hasilText: indicatorForm.hasilText || undefined,
        peringkat: Number(indicatorForm.peringkat),
        weighted: computeWeightedAuto(indicatorForm, sectionForm.bobotSection),
        keterangan: indicatorForm.keterangan || undefined,
      };

      console.log('📤 Updating indicator with data:', updateData);

      await updateIndikator(indicatorForm.id, updateData);
      showNotification('success', `✅ Indikator "${indicatorForm.indikator}" berhasil diperbarui`);

      resetIndicatorForm();
      await loadData();
    } catch (err) {
      console.error('❌ Error updating indicator:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Terjadi kesalahan';
      setLocalError(`Gagal update indikator: ${errorMessage}`);
      showNotification('error', `❌ Gagal update indikator: ${errorMessage}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteIndicator = async (indikatorId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus indikator ini?')) return;

    setIsDeleting(true);
    try {
      await deleteIndikator(indikatorId);
      showNotification('success', `✅ Indikator berhasil dihapus`);

      await loadData();
    } catch (err) {
      console.error('❌ Error deleting indicator:', err);

      let errorMessage = 'Terjadi kesalahan';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setLocalError(`Gagal menghapus indikator: ${errorMessage}`);
      showNotification('error', `❌ Gagal menghapus indikator: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // ====== Export Function ======
  const handleExportHukum = () => {
    exportHukumToExcel({
      year: viewYear,
      quarter: viewQuarter,
      sections: sections,
      filename: `Hukum_${viewYear}_${viewQuarter}`,
    });
  };

  // ====== Memoized Values ======
  const filteredSections = useMemo(() => {
    const searchQuery = query || '';
    if (!searchQuery.trim()) return sections;

    const q = searchQuery.toLowerCase();

    return sections
      .map((s) => {
        const inds = s.indicators || [];
        const matchedIndicators = inds.filter((it) => {
          const indikatorText = it.indikator || '';
          const subNo = it.subNo || '';
          const pembilangLabel = it.pembilangLabel || '';
          const penyebutLabel = it.penyebutLabel || '';
          const sumberRisiko = it.sumberRisiko || '';
          const dampak = it.dampak || '';
          const keterangan = it.keterangan || '';
          const hasilText = it.hasilText || '';

          return `${subNo} ${indikatorText} ${pembilangLabel} ${penyebutLabel} ${sumberRisiko} ${dampak} ${keterangan} ${hasilText}`.toLowerCase().includes(q);
        });

        const sectionName = s.parameter || '';
        if (sectionName.toLowerCase().includes(q) || matchedIndicators.length > 0) {
          return { ...s, indicators: matchedIndicators.length ? matchedIndicators : inds };
        }
        return null;
      })
      .filter(Boolean);
  }, [sections, query]);

  const totalWeightedCalc = useMemo(() => {
    return sections.reduce((sum, section) => {
      const inds = section.indicators || [];
      const sectionTotal = inds.reduce((sectionSum, indikator) => {
        const weighted = Number(indikator.weighted);
        return sectionSum + (isNaN(weighted) ? 0 : weighted);
      }, 0);
      return sum + sectionTotal;
    }, 0);
  }, [sections]);

  // PERBAIKI hasilPreview
  const hasilPreview = useMemo(() => {
    if (indicatorForm.mode === CalculationMode.TEKS) {
      return indicatorForm.hasilText || '';
    }

    const raw = computeHasil(indicatorForm);
    if (raw === null || raw === '' || isNaN(Number(raw))) return '';

    const hasilNum = Number(raw);

    // LOGIKA ORIGIN YANG BENAR:
    // 1. Cek apakah input mengandung '%'
    const pembHasPercent = String(indicatorForm.pembilangValue || '').includes('%');
    const penyHasPercent = String(indicatorForm.penyebutValue || '').includes('%');

    // 2. Jika KEDUA input mengandung %, jangan kalikan dengan 100
    if (pembHasPercent && penyHasPercent) {
      // Contoh: 0.0346 -> 3.46%
      return formatHasilNumber(hasilNum * 100, 2) + '%';
    }

    // 3. Jika isPercent true, kalikan dengan 100
    if (indicatorForm.isPercent) {
      return formatHasilNumber(hasilNum * 100, 2) + '%';
    }

    // 4. Untuk NILAI_TUNGGAL, format biasa
    if (indicatorForm.mode === CalculationMode.NILAI_TUNGGAL) {
      return fmtNumber(hasilNum);
    }

    // 5. Default: format 4 decimal
    return formatHasilNumber(hasilNum, 4);
  }, [indicatorForm]);

  const weightedPreview = useMemo(() => {
    if (!sectionForm.id) return 0;
    const weighted = computeWeightedAuto(indicatorForm, sectionForm.bobotSection);
    return weighted;
  }, [sectionForm.id, indicatorForm, sectionForm.bobotSection]);

  // ====== Render ======
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl">
        {/* NOTIFICATION AREA */}
        {notification.show && (
          <div className={`mb-4 rounded-lg shadow-md border animate-slideIn ${notification.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                  {notification.type === 'success' ? <CheckCircle className="w-5 h-5 text-white" /> : <XCircle className="w-5 h-5 text-white" />}
                </div>
                <span className={`font-medium ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>{notification.message}</span>
              </div>
              <button onClick={hideNotification} className="text-gray-400 hover:text-gray-600 transition-colors">
                ✕
              </button>
            </div>
            {/* Progress bar */}
            <div className={`h-1 w-full ${notification.type === 'success' ? 'bg-green-200' : 'bg-red-200'}`}>
              <div
                className={`h-full ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
                style={{
                  width: '100%',
                  animation: 'shrink 4s linear forwards',
                }}
              />
            </div>
          </div>
        )}

        <header className="flex items-center justify-between gap-3 px-4 py-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Form – Hukum</h2>
          <div className="flex items-end gap-4">
            {/* tahun + triwulan */}
            <div className="flex items-end gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600 font-medium mb-1">Tahun</label>
                <YearInput value={viewYear} onChange={handleYearChange} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600 font-medium mb-1">Triwulan</label>
                <QuarterSelect value={viewQuarter} onChange={handleQuarterChange} />
              </div>
            </div>

            {/* search + export */}
            <div className="flex items-end gap-2">
              <div className="relative">
                <input value={query} onChange={(e) => handleQueryChange(e.target.value)} placeholder="Cari no/sub/indikator/keterangan…" className="pl-9 pr-3 py-2 rounded-xl border w-64" />
                <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              {/* Backend Actions */}
              <button
                onClick={() => {
                  loadData();
                  loadAllSections();
                }}
                disabled={loading || loadingAllSections}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw size={18} /> {loading ? 'Loading...' : 'Refresh Data'}
              </button>

              <button onClick={handleExportHukum} disabled={loading || sections.length === 0} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-gray-900 text-white hover:bg-black disabled:opacity-50">
                <Download size={18} />
                {loading ? 'Loading...' : `Export ${viewYear}-${viewQuarter}`}
              </button>
            </div>
          </div>
        </header>

        {/* Error Display */}
        {(localError || error) && (
          <div className="mx-4 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              <span>{localError || error}</span>
            </div>
            <button
              onClick={() => {
                setLocalError(null);
                clearError();
              }}
              className="text-red-700 hover:text-red-900"
            >
              ✕
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {(loading || isCreating || isUpdating || isDeleting || loadingAllSections) && (
          <div className="mx-4 mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            {loadingAllSections ? 'Memuat daftar section...' : 'Memuat data...'}
          </div>
        )}

        {/* ===== FORM SECTION + INDIKATOR ===== */}
        <div className="relative rounded-2xl overflow-hidden mb-6 shadow-sm bg-gradient-to-r from-[#0076C6]/90 via-[#00A3DA]/90 to-[#33C2B5]/90">
          {/* SECTION HEADER */}
          <div className="rounded-2xl border-2 border-gray-300 p-4 shadow-sm mb-6">
            <h2 className="text-white font-semibold text-lg sm:text-xl mb-6">Form Section – Hukum</h2>

            {/* Row untuk memilih section yang sudah ada */}
            <div className="mb-4">
              <label className="text-xs text-white font-medium mb-1 block">Pilih Section yang Sudah Ada</label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 font-medium appearance-none bg-white cursor-pointer pr-10"
                  value={sectionForm.id || ''}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    if (selectedId === 'new') {
                      resetSectionForm();
                    } else if (selectedId === '') {
                      resetSectionForm();
                    } else {
                      selectSection(Number(selectedId));
                    }
                  }}
                  disabled={loadingAllSections}
                >
                  <option value="">-- Pilih Section yang sudah ada --</option>

                  {/* Sections dari periode saat ini */}
                  {sections.length > 0 ? (
                    sections.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.no} - {s.parameter} ({s.bobotSection}%)
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Tidak ada section untuk periode {viewYear}-{viewQuarter}
                    </option>
                  )}

                  {/* Sections dari database yang belum ada di periode ini */}
                  {allSections.length > 0 && sections.length > 0 && (
                    <optgroup label="Section dari database">
                      {allSections
                        .filter((section) => !sections.some((s) => s.id === section.id))
                        .map((section) => (
                          <option key={section.id} value={section.id}>
                            {section.no} - {section.parameter} ({section.bobotSection}%)
                          </option>
                        ))}
                    </optgroup>
                  )}

                  <option value="new">+ Buat Section Baru</option>
                </select>
                <ChevronDown className="absolute right-4 top-9 pointer-events-none text-gray-400" size={20} />
              </div>
            </div>

            {/* Form input untuk edit section */}
            <div className="flex items-end gap-4 mb-4">
              {/* No Sec */}
              <div className="flex flex-col">
                <label className="text-xs text-white font-medium mb-1">No Sec</label>
                <input
                  className="w-20 h-10 px-3 rounded-lg border-2 border-gray-300 text-center font-medium bg-white"
                  value={sectionForm.no}
                  onChange={(e) => setSectionForm((f) => ({ ...f, no: e.target.value }))}
                  placeholder="6.1"
                  list="section-no-suggestions"
                />
                <datalist id="section-no-suggestions">
                  {getUniqueSections.map((section) => (
                    <option key={`no-${section.no}`} value={section.no} />
                  ))}
                </datalist>
              </div>

              {/* Bobot Sec */}
              <div className="flex flex-col">
                <label className="text-xs text-white font-medium mb-1">Bobot Sec (%)</label>
                <input
                  type="number"
                  className="w-28 h-10 px-3 rounded-lg border-2 border-gray-300 text-center font-medium bg-white"
                  value={sectionForm.bobotSection}
                  onChange={(e) => setSectionForm((f) => ({ ...f, bobotSection: e.target.value }))}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>

              {/* Section */}
              <div className="flex-1 flex flex-col">
                <label className="text-xs text-white font-medium mb-1">Nama Section</label>
                <input
                  className="w-full h-10 px-4 rounded-lg border-2 border-gray-300 font-medium bg-white"
                  value={sectionForm.parameter}
                  onChange={(e) => setSectionForm((f) => ({ ...f, parameter: e.target.value }))}
                  placeholder="Uraian section risiko hukum"
                  list="section-name-suggestions"
                />
                <datalist id="section-name-suggestions">
                  {getUniqueSections.map((section) => (
                    <option key={`name-${section.no}`} value={section.name} />
                  ))}
                </datalist>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 self-end">
                {!isEditingSection ? (
                  <button
                    className="w-10 h-10 rounded-lg bg-green-500 hover:bg-green-600 text-white flex items-center justify-center disabled:bg-gray-400"
                    onClick={handleCreateSection}
                    disabled={isCreating || !sectionForm.no || !sectionForm.parameter}
                    title="Tambah Section"
                  >
                    {isCreating ? '...' : <Plus size={20} />}
                  </button>
                ) : (
                  <>
                    <button className="w-10 h-10 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white flex items-center justify-center disabled:bg-gray-400" onClick={handleUpdateSection} disabled={isUpdating} title="Update Section">
                      {isUpdating ? '...' : <Edit3 size={20} />}
                    </button>
                    <button className="w-10 h-10 rounded-lg bg-gray-500 hover:bg-gray-600 text-white flex items-center justify-center" onClick={resetSectionForm} title="Batal">
                      ✕
                    </button>
                  </>
                )}
                {isEditingSection && sectionForm.id && (
                  <button
                    className="w-10 h-10 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center disabled:bg-gray-400"
                    onClick={() => {
                      handleDeleteSection(sectionForm.id);
                    }}
                    disabled={isDeleting}
                    title="Hapus Section"
                  >
                    {isDeleting ? '...' : <Trash2 size={20} />}
                  </button>
                )}
              </div>
            </div>

            {/* Info Section yang dipilih */}
            {sectionForm.id && (
              <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                <div className="text-sm text-blue-800">
                  <span className="font-medium">Section dipilih:</span> {sectionForm.no} - {sectionForm.parameter}
                </div>
                <div className="text-xs text-blue-600">
                  Bobot: {sectionForm.bobotSection}% | Periode: {viewYear}-{viewQuarter} | Data akan disimpan untuk periode ini
                </div>
              </div>
            )}

            {/* Tombol refresh sections */}
            <div className="mt-4 flex justify-end">
              <button onClick={loadAllSections} className="flex items-center gap-2 text-sm text-white hover:text-white/80" disabled={loadingAllSections}>
                <RefreshCw size={14} />
                Refresh Daftar Section
              </button>
            </div>
          </div>

          {/* main body: indicator form */}
          {sectionForm.id && (
            <div className="rounded-xl border-2 border-gray-300 shadow-sm p-6 mb-6">
              <h3 className="text-white font-semibold text-lg mb-4">{isEditingIndicator ? 'Edit Indikator' : 'Tambah Indikator'}</h3>

              {/* Sub No & Indikator & Bobot Par Row */}
              <div className="grid grid-cols-12 gap-4 mb-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-2 block text-white">No Indikator</label>
                  <input className="w-full rounded-lg border-2 border-gray-300 px-3 py-3 text-sm bg-white" value={indicatorForm.subNo} onChange={(e) => setIndicatorField('subNo', e.target.value)} placeholder="6.1.1" />
                </div>
                <div className="col-span-7">
                  <label className="text-sm font-medium mb-2 block text-white">Indikator</label>
                  <input
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                    value={indicatorForm.indikator}
                    onChange={(e) => setIndicatorField('indikator', e.target.value)}
                    placeholder="Teks indikator risiko hukum…"
                  />
                </div>
                <div className="col-span-3">
                  <label className="text-sm font-medium mb-2 block text-right text-white">Bobot Indikator (%)</label>
                  <input
                    type="number"
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm text-right bg-white"
                    value={indicatorForm.bobotIndikator || ''}
                    onChange={(e) => setIndicatorField('bobotIndikator', e.target.value)}
                    placeholder="100"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Metode Penghitungan + Rumus / Hasil Teks */}
              <div className="grid grid-cols-12 gap-4 mb-4">
                <div className="col-span-4">
                  <label className="text-sm font-medium mb-2 block text-white">Metode Penghitungan</label>
                  <select
                    className="w-full rounded-lg border-2 border-gray-300 px-3 py-3 text-sm bg-white"
                    value={indicatorForm.mode || CalculationMode.RASIO}
                    onChange={(e) => {
                      const v = e.target.value;
                      setIndicatorField('mode', v);
                      if (v === CalculationMode.TEKS) {
                        setIndicatorForm((prev) => ({
                          ...prev,
                          formula: '',
                          isPercent: false,
                          pembilangLabel: '',
                          pembilangValue: '',
                          penyebutLabel: '',
                          penyebutValue: '',
                          hasil: '',
                        }));
                      }
                    }}
                  >
                    <option value={CalculationMode.RASIO}>Rasio (Pembilang / Penyebut)</option>
                    <option value={CalculationMode.NILAI_TUNGGAL}>Nilai tunggal (hanya penyebut)</option>
                    <option value={CalculationMode.TEKS}>Kualitatif (hasil berupa teks)</option>
                  </select>
                </div>

                <div className="col-span-8">
                  {indicatorForm.mode === CalculationMode.TEKS ? (
                    <>
                      <label className="text-sm font-medium mb-2 block text-white">Hasil (Teks) – akan muncul di kolom "Hasil"</label>
                      <input
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                        value={indicatorForm.hasilText}
                        onChange={(e) => setIndicatorField('hasilText', e.target.value)}
                        placeholder="misal: pencapaian KPI sesuai target"
                      />
                    </>
                  ) : (
                    <>
                      <label className="text-sm font-medium mb-2 block text-white">
                        Rumus Parameter (opsional) &nbsp;
                        <span className="text-xs">
                          gunakan variabel <b>pemb</b> dan <b>peny</b>
                        </span>
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="text"
                          className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                          placeholder={indicatorForm.mode === CalculationMode.NILAI_TUNGGAL ? 'Contoh: peny / 1000' : 'Contoh: pemb / peny'}
                          value={indicatorForm.formula || ''}
                          onChange={(e) => setIndicatorField('formula', e.target.value)}
                        />
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={indicatorForm.isPercent || false}
                            onChange={(e) => setIndicatorField('isPercent', e.target.checked)}
                            className="w-6 h-6 rounded-full border-2 border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div
                            className="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-gray-300 bg-gray-100 text-lg font-bold cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIndicatorField('isPercent', !indicatorForm.isPercent);
                            }}
                          >
                            %
                          </div>
                        </label>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Faktor Pembilang (hanya untuk RASIO) */}
              {indicatorForm.mode === CalculationMode.RASIO && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-white">Faktor Pembilang</label>
                    <input
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                      value={indicatorForm.pembilangLabel}
                      onChange={(e) => setIndicatorField('pembilangLabel', e.target.value)}
                      placeholder="Actual KPI, pencapaian real, dll."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-white">Nilai Pembilang</label>
                    <input
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                      value={indicatorForm.pembilangValue ?? ''}
                      onChange={(e) => setIndicatorField('pembilangValue', e.target.value)}
                      placeholder="96.55"
                    />
                  </div>
                </div>
              )}

              {/* Faktor Penyebut (non TEKS) */}
              {indicatorForm.mode !== CalculationMode.TEKS && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-white">Faktor Penyebut</label>
                    <input
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                      value={indicatorForm.penyebutLabel}
                      onChange={(e) => setIndicatorField('penyebutLabel', e.target.value)}
                      placeholder="Target KPI, target yang ditetapkan, dll."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-white">Nilai Penyebut</label>
                    <input className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white" value={indicatorForm.penyebutValue ?? ''} onChange={(e) => setIndicatorField('penyebutValue', e.target.value)} placeholder="100" />
                  </div>
                </div>
              )}

              {/* Sumber risiko & dampak */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-white">Sumber Risiko</label>
                  <textarea
                    rows={4}
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm resize-none bg-white"
                    value={indicatorForm.sumberRisiko}
                    onChange={(e) => setIndicatorField('sumberRisiko', e.target.value)}
                    placeholder="Contoh: target KPI yang terlalu ambisius atau tidak realistis, dll."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-white">Dampak</label>
                  <textarea
                    rows={4}
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm resize-none bg-white"
                    value={indicatorForm.dampak}
                    onChange={(e) => setIndicatorField('dampak', e.target.value)}
                    placeholder="Contoh: tujuan tahunan organisasi bisa meleset, kinerja perusahaan menurun, dll."
                  />
                </div>
              </div>

              {/* Risk Levels Grid */}
              <div className="mt-6 rounded-2xl border-2 border-white/70 bg-white/5 p-4">
                <div className="grid grid-cols-12 gap-4">
                  {/* KIRI: Preview + peringkat + weighted */}
                  <div className="col-span-6 space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block text-white">Peringkat (1 – 5)</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                          value={indicatorForm.peringkat || ''}
                          onChange={(e) => setIndicatorField('peringkat', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block text-white">Weighted (auto)</label>
                        <input className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-gray-50" value={weightedPreview.toFixed(2)} readOnly />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block text-white">Preview value</label>
                        <input className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-gray-50" value={hasilPreview} readOnly />
                      </div>
                    </div>
                  </div>

                  {/* KANAN: Risk level (Low s/d High) vertikal */}
                  <div className="col-span-6 grid grid-cols-1 gap-3 items-stretch">
                    <RiskBox className="w-full" label="Low" value={indicatorForm.low} onChange={(v) => setIndicatorField('low', v)} color="#B7E1A1" textColor="#0B3D2E" placeholder="x > 90%" />
                    <RiskBox className="w-full" label="Low to Moderate" value={indicatorForm.lowToModerate} onChange={(v) => setIndicatorField('lowToModerate', v)} color="#CFE0FF" textColor="#0B2545" placeholder="90% ≥ x > 70%" />
                    <RiskBox className="w-full" label="Moderate" value={indicatorForm.moderate} onChange={(v) => setIndicatorField('moderate', v)} color="#FFEEAD" textColor="#4B3A00" placeholder="70% ≥ x > 50%" />
                    <RiskBox className="w-full" label="Moderate to High" value={indicatorForm.moderateToHigh} onChange={(v) => setIndicatorField('moderateToHigh', v)} color="#FAD2A7" textColor="#5A2E00" placeholder="50% ≥ x > 30%" />
                    <RiskBox className="w-full" label="High" value={indicatorForm.high} onChange={(v) => setIndicatorField('high', v)} color="#E57373" textColor="#FFFFFF" placeholder="x < 30%" />
                  </div>
                </div>
              </div>

              {/* Keterangan */}
              <div className="mt-4">
                <label className="text-sm font-medium mb-2 block text-white">Keterangan</label>
                <textarea
                  rows={2}
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                  value={indicatorForm.keterangan}
                  onChange={(e) => setIndicatorField('keterangan', e.target.value)}
                  placeholder="Keterangan tambahan..."
                />
              </div>

              {/* Add/Save Button */}
              <div className="mt-6 flex justify-end">
                {!isEditingIndicator ? (
                  <button onClick={handleCreateIndicator} disabled={isCreating} className="px-8 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold disabled:bg-gray-400">
                    {isCreating ? 'Menyimpan...' : '+ Tambah Indikator'}
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button onClick={handleUpdateIndicator} disabled={isUpdating} className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:bg-gray-400">
                      {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                    <button onClick={resetIndicatorForm} className="px-8 py-3 rounded-lg border-2 border-gray-300 hover:bg-gray-50 font-semibold">
                      Batal
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ===== TABEL HUKUM ===== */}
        <section className="mt-4">
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="relative h-[350px]">
              <div className="absolute inset-0 overflow-x-auto overflow-y-auto">
                <table className="min-w-[1450px] text-sm border border-gray-300 border-collapse">
                  <thead>
                    <tr className="bg-[#1f4e79] text-white">
                      <th className="border border-black px-3 py-2 text-left" rowSpan={2} style={{ width: 60 }}>
                        No
                      </th>
                      <th className="border border-black px-3 py-2 text-left" rowSpan={2} style={{ width: 80 }}>
                        Bobot
                      </th>
                      <th className="border border-black px-3 py-2 text-left" colSpan={3}>
                        Parameter atau Indikator
                      </th>
                      <th className="border border-black px-3 py-2 text-center" rowSpan={2} style={{ width: 90 }}>
                        Bobot Indikator
                      </th>
                      <th className="border border-black px-3 py-2 text-left" rowSpan={2} style={{ minWidth: 220 }}>
                        Sumber Risiko
                      </th>
                      <th className="border border-black px-3 py-2 text-left" rowSpan={2} style={{ minWidth: 240 }}>
                        Dampak
                      </th>
                      <th className="border border-black px-3 py-2 bg-[#b7d7a8] text-center text-black" rowSpan={2}>
                        Low
                      </th>
                      <th className="border border-black px-3 py-2 bg-[#c9daf8] text-left text-black" rowSpan={2}>
                        Low to Moderate
                      </th>
                      <th className="border border-black px-3 py-2 bg-[#fff2cc] text-left text-black" rowSpan={2}>
                        Moderate
                      </th>
                      <th className="border border-black px-3 py-2 bg-[#f9cb9c] text-left text-black" rowSpan={2}>
                        Moderate to High
                      </th>
                      <th className="border border-black px-3 py-2 bg-[#e06666] text-center" rowSpan={2}>
                        High
                      </th>
                      <th className="border border-black px-3 py-2 bg-[#2e75b6]" rowSpan={2} style={{ width: 100 }}>
                        Hasil
                      </th>
                      <th className="border border-black px-3 py-2 bg-[#2e75b6]" rowSpan={2} style={{ width: 70 }}>
                        Peringkat
                      </th>
                      <th className="border border-black px-3 py-2 bg-[#2e75b6] text-white" rowSpan={2} style={{ width: 90 }}>
                        Weighted
                      </th>
                      <th className="border border-black px-3 py-2 text-center" rowSpan={2} style={{ width: 80 }}>
                        Aksi
                      </th>
                    </tr>
                    <tr className="bg-[#1f4e79] text-white">
                      <th className="border border-black px-3 py-2 text-left" style={{ minWidth: 260 }}>
                        Section
                      </th>
                      <th className="border border-black px-3 py-2 text-left" style={{ width: 70 }}>
                        Sub No
                      </th>
                      <th className="border border-black px-3 py-2 text-left" style={{ minWidth: 360 }}>
                        Indikator
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td className="border px-3 py-6 text-center text-gray-500" colSpan={17}>
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            Memuat data...
                          </div>
                        </td>
                      </tr>
                    ) : filteredSections.length === 0 ? (
                      <tr>
                        <td className="border px-3 py-6 text-center text-gray-500" colSpan={17}>
                          Belum ada data
                        </td>
                      </tr>
                    ) : (
                      filteredSections.map((s) => {
                        const inds = s.indicators || [];

                        if (!inds.length) {
                          return (
                            <tr key={s.id} className="bg-[#e9f5e1]">
                              <td className="border px-3 py-3 text-center">{s.no}</td>
                              <td className="border px-3 py-3 text-center">{s.bobotSection}%</td>
                              <td className="border px-3 py-3" colSpan={15}>
                                {s.parameter} – Belum ada indikator
                              </td>
                            </tr>
                          );
                        }

                        // Hitung rowSpan per section
                        const sectionRowSpan = inds.reduce((sum, it) => {
                          const rowCount = it.mode === CalculationMode.TEKS ? 1 : rowsPerIndicator(it);
                          return sum + rowCount;
                        }, 0);

                        return (
                          <React.Fragment key={s.id}>
                            {inds.map((it, idx) => {
                              const firstOfSection = idx === 0;
                              const transformed = transformIndicatorToFrontend(it);

                              let hasilDisplay = '';
                              if (transformed.mode === CalculationMode.TEKS) {
                                hasilDisplay = transformed.hasilText || '';
                              } else if (transformed.hasil !== '' && transformed.hasil != null && !isNaN(Number(transformed.hasil))) {
                                const hasilNum = Number(transformed.hasil);

                                // LOGIKA SAMA DENGAN hasilPreview
                                const pembHasPercent = String(transformed.pembilangValue || '').includes('%');
                                const penyHasPercent = String(transformed.penyebutValue || '').includes('%');

                                // 1. Jika KEDUA input mengandung %
                                if (pembHasPercent && penyHasPercent) {
                                  // Contoh: 0.0346 -> 3.46%
                                  hasilDisplay = formatHasilNumber(hasilNum * 100, 2) + '%';
                                }
                                // 2. Jika isPercent true
                                else if (transformed.isPercent) {
                                  hasilDisplay = formatHasilNumber(hasilNum * 100, 2) + '%';
                                }
                                // 3. Untuk NILAI_TUNGGAL
                                else if (transformed.mode === CalculationMode.NILAI_TUNGGAL) {
                                  hasilDisplay = fmtNumber(hasilNum);
                                }
                                // 4. Default
                                else {
                                  hasilDisplay = formatHasilNumber(hasilNum, 4);
                                }
                              }

                              const weightedDisplay = transformed.weighted !== '' && transformed.weighted != null && !isNaN(Number(transformed.weighted)) ? Number(transformed.weighted).toFixed(2) : '';

                              return (
                                <React.Fragment key={transformed.id}>
                                  {/* ── baris utama indikator ── */}
                                  <tr>
                                    {firstOfSection && (
                                      <>
                                        <td rowSpan={sectionRowSpan} className="border px-3 py-3 align-top bg-[#d9eefb] text-center font-semibold">
                                          {s.no}
                                        </td>
                                        <td rowSpan={sectionRowSpan} className="border px-3 py-3 align-top bg-[#d9eefb] text-center">
                                          {s.bobotSection}%
                                        </td>
                                        <td rowSpan={sectionRowSpan} className="border px-3 py-3 align-top bg-[#d9eefb]">
                                          {s.parameter}
                                        </td>
                                      </>
                                    )}

                                    <td className="border px-3 py-3 text-center align-top bg-[#d9eefb]">{transformed.subNo}</td>
                                    <td className="border px-3 py-3 align-top bg-[#d9eefb]">
                                      <div className="font-medium whitespace-pre-wrap">{transformed.indikator}</div>
                                    </td>

                                    <td className="border px-3 py-3 text-center align-top bg-[#d9eefb]">{transformed.bobotIndikator}%</td>
                                    <td className="border px-3 py-3 align-top bg-[#d9eefb] whitespace-pre-wrap">{transformed.sumberRisiko}</td>
                                    <td className="border px-3 py-3 align-top bg-[#d9eefb] whitespace-pre-wrap">{transformed.dampak}</td>

                                    <td className="border px-3 py-3 text-center bg-green-700/10 whitespace-pre-wrap">{transformed.low}</td>
                                    <td className="border px-3 py-3 text-center bg-green-700/10 whitespace-pre-wrap">{transformed.lowToModerate}</td>
                                    <td className="border px-3 py-3 text-center bg-green-700/10 whitespace-pre-wrap">{transformed.moderate}</td>
                                    <td className="border px-3 py-3 text-center bg-green-700/10 whitespace-pre-wrap">{transformed.moderateToHigh}</td>
                                    <td className="border px-3 py-3 text-center bg-green-700/10 whitespace-pre-wrap">{transformed.high}</td>

                                    <td className="border px-3 py-3 text-right bg-gray-400/20 whitespace-pre-wrap">{hasilDisplay}</td>

                                    <td className="border px-3 py-3 text-center">
                                      <div style={{ minWidth: 36, minHeight: 24 }} className="inline-block rounded bg-yellow-300 px-2">
                                        {transformed.peringkat}
                                      </div>
                                    </td>

                                    <td className="border px-3 py-3 text-right bg-gray-400/20">{weightedDisplay}</td>

                                    <td className="border px-3 py-3 text-center">
                                      <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => handleEditIndicator(transformed)} className="px-2 py-1 rounded border hover:bg-gray-100" disabled={loading || isUpdating || isDeleting}>
                                          <Edit3 size={14} />
                                        </button>
                                        <button onClick={() => handleDeleteIndicator(transformed.id)} className="px-2 py-1 rounded border text-red-600 hover:bg-red-50" disabled={loading || isDeleting}>
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>

                                  {/* ── baris penyebut ── */}
                                  {transformed.mode !== CalculationMode.TEKS && (
                                    <>
                                      {/* baris penyebut */}
                                      <tr className="bg-white">
                                        <td className="border px-3 py-2 text-center"></td>
                                        <td className="border px-3 py-2">
                                          <div className="text-sm text-gray-700 mt-1">{transformed.penyebutLabel || '-'}</div>
                                        </td>
                                        <td className="border px-3 py-2"></td>
                                        <td className="border px-3 py-2"></td>
                                        <td className="border px-3 py-2"></td>
                                        <td className="border px-3 py-2"></td>
                                        <td className="border px-3 py-2"></td>
                                        <td className="border px-3 py-2"></td>
                                        <td className="border px-3 py-2"></td>
                                        <td className="border px-3 py-2"></td>
                                        <td className="border px-3 py-2 bg-[#c6d9a7] text-right">{transformed.penyebutValue ? fmtNumber(transformed.penyebutValue) : ''}</td>
                                        <td className="border px-3 py-2"></td>
                                        <td className="border px-3 py-2"></td>
                                        <td className="border px-3 py-2"></td>
                                      </tr>

                                      {/* baris pembilang (hanya untuk RASIO) */}
                                      {transformed.mode === CalculationMode.RASIO && (
                                        <tr className="bg-white">
                                          <td className="border px-3 py-2 text-center"></td>
                                          <td className="border px-3 py-2">
                                            <div className="text-sm text-gray-700 mt-1">{transformed.pembilangLabel || '-'}</div>
                                          </td>
                                          <td className="border px-3 py-2"></td>
                                          <td className="border px-3 py-2"></td>
                                          <td className="border px-3 py-2"></td>
                                          <td className="border px-3 py-2"></td>
                                          <td className="border px-3 py-2"></td>
                                          <td className="border px-3 py-2"></td>
                                          <td className="border px-3 py-2"></td>
                                          <td className="border px-3 py-2"></td>
                                          <td className="border px-3 py-2 bg-[#c6d9a7] text-right">{transformed.pembilangValue ? fmtNumber(transformed.pembilangValue) : ''}</td>
                                          <td className="border px-3 py-2"></td>
                                          <td className="border px-3 py-2"></td>
                                          <td className="border px-3 py-2"></td>
                                        </tr>
                                      )}
                                    </>
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </React.Fragment>
                        );
                      })
                    )}
                  </tbody>

                  <tfoot>
                    <tr>
                      {/* sampai kolom High */}
                      <td className="border border-gray-400" colSpan={13}></td>

                      {/* Summary memanjang sampai kolom Peringkat (Hasil + Peringkat) */}
                      <td className="border border-gray-400 text-white font-semibold text-center bg-[#0b3861]" colSpan={2}>
                        Summary
                      </td>

                      {/* Nilai total di bawah kolom Weighted */}
                      <td className="border border-gray-400 text-white font-semibold text-center bg-[#8fce00]">{Number(totalWeighted || totalWeightedCalc || 0).toFixed(2)}</td>

                      {/* Kolom Aksi (kosong) */}
                      <td className="border border-gray-400"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
