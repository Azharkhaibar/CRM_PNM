// src/features/Dashboard/pages/RiskProfile/pages/Kepatuhan/tabs/kepatuhan.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Download, Trash2, Edit3, Search, Plus, ChevronDown, Save, RefreshCw, Database, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Import components
import { YearInput, QuarterSelect } from '../../pasar/components/Inputs.jsx';
import { exportKPMRPasarToExcel as exportKPMRHukumToExcel } from '../../pasar/utils/excelexportpasar.jsx';

// Import services and hooks
import { useKepatuhanData, useKepatuhan } from '../hooks/kepatuhan/kepatuhan.hook.js';
import { useAuditLog } from '../../../../audit-log/hooks/audit-log.hooks';
import { useAuth } from '../../../../../../auth/hooks/useAuth.hook.js';

// ===================== Brand =====================
const PNM_BRAND = {
  primary: '#0068B3',
  primarySoft: '#E6F1FA',
  gradient: 'bg-gradient-to-r from-[#0076C6]/90 via-[#00A3DA]/90 to-[#33C2B5]/90',
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
  if (v == null || v === '') return 0;
  const n = Number(v);
  return isNaN(n) ? 0 : n;
};

// Empty indicator template
const emptyIndicator = {
  id: null,
  subNo: '',
  indikator: '',
  mode: 'RASIO',
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
  hasilText: 'tidak terdapat pelanggaran terhadap peraturan perundang-undangan yang berlaku',
  low: '',
  lowToModerate: '',
  moderate: '',
  moderateToHigh: '',
  high: '',
  keterangan: '',
};

// Transform functions untuk kepatuhan
const transformIndicatorToBackend = (indicatorData, year, quarter, sectionId) => {
  const prepareValue = (value) => {
    if (value === undefined || value === null || value === '') {
      return null;
    }
    return value;
  };

  const prepareNumber = (value) => {
    if (value === undefined || value === null || value === '') {
      return null;
    }
    const num = Number(value);
    return isNaN(num) ? null : num;
  };

  return {
    sectionId: Number(sectionId),
    year: Number(year),
    quarter: quarter,
    subNo: prepareValue(indicatorData.subNo) || '',
    indikator: prepareValue(indicatorData.indikator) || '',
    bobotIndikator: Number(indicatorData.bobotIndikator || 0),

    // Data perhitungan
    mode: indicatorData.mode || 'RASIO',
    pembilangLabel: prepareValue(indicatorData.pembilangLabel),
    pembilangValue: prepareNumber(indicatorData.pembilangValue),
    penyebutLabel: prepareValue(indicatorData.penyebutLabel),
    penyebutValue: prepareNumber(indicatorData.penyebutValue),
    formula: prepareValue(indicatorData.formula),
    isPercent: Boolean(indicatorData.isPercent || false),
    hasilText: prepareValue(indicatorData.hasilText),

    // Data risiko
    sumberRisiko: prepareValue(indicatorData.sumberRisiko),
    dampak: prepareValue(indicatorData.dampak),

    // Risk levels
    low: prepareValue(indicatorData.low),
    lowToModerate: prepareValue(indicatorData.lowToModerate),
    moderate: prepareValue(indicatorData.moderate),
    moderateToHigh: prepareValue(indicatorData.moderateToHigh),
    high: prepareValue(indicatorData.high),

    // Peringkat
    peringkat: Number(indicatorData.peringkat || 1),

    // Keterangan
    keterangan: prepareValue(indicatorData.keterangan),
  };
};

const transformIndicatorToFrontend = (indikator) => {
  return {
    id: indikator.id,
    subNo: indikator.subNo || indikator.sub_no || '',
    indikator: indikator.indikator || '',
    bobotIndikator: indikator.bobotIndikator || indikator.bobot_indikator || 0,
    sumberRisiko: indikator.sumberRisiko || indikator.sumber_risiko || '',
    dampak: indikator.dampak || '',
    pembilangLabel: indikator.pembilangLabel || indikator.pembilang_label || '',
    pembilangValue: indikator.pembilangValue || indikator.pembilang_value || '',
    penyebutLabel: indikator.penyebutLabel || indikator.penyebut_label || '',
    penyebutValue: indikator.penyebutValue || indikator.penyebut_value || '',
    peringkat: indikator.peringkat || 1,
    weighted: indikator.weighted || '',
    hasil: indikator.hasil || '',
    hasilText: indikator.hasilText || indikator.hasil_text || '',
    low: indikator.low || '',
    lowToModerate: indikator.lowToModerate || indikator.low_to_moderate || '',
    moderate: indikator.moderate || '',
    moderateToHigh: indikator.moderateToHigh || indikator.moderate_to_high || '',
    high: indikator.high || '',
    keterangan: indikator.keterangan || '',
    isPercent: indikator.isPercent || false,
    mode: indikator.mode || 'RASIO',
    formula: indikator.formula || '',
  };
};

// Transform functions untuk section
const transformSectionToBackend = (sectionData, year, quarter) => {
  return {
    no: sectionData.no,
    bobotSection: Number(sectionData.bobotSection || 0),
    parameter: sectionData.parameter,
    year,
    quarter,
  };
};

// ===================== Calculation Functions =====================
const computeHasil = (ind) => {
  const mode = ind?.mode || 'RASIO';
  if (mode === 'TEKS') return '';

  const pemb = parseNum(ind.pembilangValue);
  const peny = parseNum(ind.penyebutValue);

  if (ind.formula && ind.formula.trim() !== '') {
    try {
      const expr = ind.formula.replace(/\bpemb\b/g, 'pemb').replace(/\bpeny\b/g, 'peny');
      const fn = new Function('pemb', 'peny', `return (${expr});`);
      const res = fn(pemb, peny);
      if (!isFinite(res) || isNaN(res)) return '';
      return Number(res);
    } catch (e) {
      console.warn('Invalid formula (Kepatuhan):', ind.formula, e);
      return '';
    }
  }

  if (mode === 'NILAI_TUNGGAL') {
    if (peny === 0) return '';
    return Number(peny);
  }

  if (peny === 0) return '';
  const result = pemb / peny;
  if (!isFinite(result) || isNaN(result)) return '';
  return Number(result);
};

const computeWeightedAuto = (ind, sectionBobot) => {
  const sectionB = Number(sectionBobot || 0);
  const bobotInd = Number(ind.bobotIndikator || 0);
  const peringkat = Number(ind.peringkat || 0);
  const res = (sectionB * bobotInd * peringkat) / 10000;
  if (!isFinite(res) || isNaN(res)) return 0;
  return res;
};

// Total baris per indikator
const rowsPerIndicator = (ind) => {
  return 1 + (ind.mode === 'RASIO' ? 2 : 1);
};

export default function KepatuhanTab({ viewYear, setViewYear, viewQuarter, setViewQuarter, query, setQuery }) {
  // ====== Hooks ======
  const { user: authUser } = useAuth();
  const { logUpdate, logDelete, logExport, logCreate } = useAuditLog();
  const {
    getSections,
    createSection,
    updateSection,
    deleteSection,
    getKepatuhanByPeriod,
    updateKepatuhan,
    createKepatuhan,
    deleteKepatuhan,
    deleteByPeriod,
    saveKepatuhanData,
    loading: apiLoading,
    error: apiError,
    clearError,
  } = useKepatuhan();

  // ====== States ======
  const [sections, setSections] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [allSections, setAllSections] = useState([]);
  const [loadingAllSections, setLoadingAllSections] = useState(false);

  // State section form
  const [sectionForm, setSectionForm] = useState({
    id: null,
    no: '',
    bobotSection: 100,
    parameter: '',
    year: viewYear,
    quarter: viewQuarter,
  });

  const [indicatorForm, setIndicatorForm] = useState({
    ...emptyIndicator,
    sectionId: null,
  });

  const [isEditingSection, setIsEditingSection] = useState(false);
  const [isEditingIndicator, setIsEditingIndicator] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ====== Fungsi untuk load data ======
  const loadData = useCallback(async () => {
    console.log('🔄 [KEPATUHAN LOAD] Starting to load data...', viewYear, viewQuarter);

    setLoadingData(true);
    setLocalError(null);

    try {
      setSections([]);
      const kepatuhanData = await getKepatuhanByPeriod(viewYear, viewQuarter);
      console.log('📥 [KEPATUHAN LOAD] Raw data length:', kepatuhanData.length);

      // Group data by section
      const groupedData = kepatuhanData.reduce((acc, item) => {
        const sectionId = item.sectionId;
        const sectionIdStr = `s-${sectionId}`;

        if (!acc[sectionIdStr]) {
          acc[sectionIdStr] = {
            id: sectionIdStr,
            no: item.no || '',
            bobotSection: item.bobotSection || 0,
            parameter: item.sectionLabel || '',
            indicators: [],
          };
        }

        // Cek duplikasi sebelum menambahkan
        const existingIndicator = acc[sectionIdStr].indicators.find((ind) => ind.subNo === item.subNo);

        if (!existingIndicator) {
          acc[sectionIdStr].indicators.push({
            id: `i-${item.id}`,
            subNo: item.subNo || '',
            indikator: item.indikator || '',
            bobotIndikator: item.bobotIndikator || 0,
            sumberRisiko: item.sumberRisiko || '',
            dampak: item.dampak || '',
            mode: item.mode || 'RASIO',
            formula: item.formula || '',
            isPercent: item.isPercent || false,
            pembilangLabel: item.pembilangLabel || '',
            pembilangValue: item.pembilangValue || '',
            penyebutLabel: item.penyebutLabel || '',
            penyebutValue: item.penyebutValue || '',
            hasil: item.hasil || '',
            hasilText: item.hasilText || '',
            low: item.low || '',
            lowToModerate: item.lowToModerate || '',
            moderate: item.moderate || '',
            moderateToHigh: item.moderateToHigh || '',
            high: item.high || '',
            peringkat: item.peringkat || 1,
            weighted: item.weighted || 0,
            keterangan: item.keterangan || '',
          });
        }

        return acc;
      }, {});

      // Transform ke format sections
      const transformedSections = Object.values(groupedData).map((section) => ({
        id: section.id,
        no: section.no,
        parameter: section.parameter,
        bobotSection: Number(section.bobotSection || 0),
        indicators: section.indicators,
      }));

      console.log('✅ [KEPATUHAN LOAD] Setting new sections:', transformedSections.length);
      setSections([...transformedSections]);
    } catch (err) {
      console.error('❌ [KEPATUHAN LOAD] Error:', err);
      setLocalError(err.message || 'Gagal memuat data kepatuhan');
    } finally {
      setLoadingData(false);
      console.log('🏁 [KEPATUHAN LOAD] Finished');
    }
  }, [viewYear, viewQuarter, getKepatuhanByPeriod]);

  // Load semua section dari database
  const loadAllSections = useCallback(async () => {
    setLoadingAllSections(true);
    try {
      console.log('🔄 [KEPATUHAN] Loading all sections from database...');
      const allSectionsData = await getSections();

      // Transform data untuk konsistensi
      const transformedAllSections = allSectionsData.map((section) => ({
        id: `s-${section.id}`,
        no: section.no,
        parameter: section.parameter,
        bobotSection: Number(section.bobotSection || 0),
        year: section.year,
        quarter: section.quarter,
      }));

      console.log('✅ [KEPATUHAN] Total sections in database:', transformedAllSections.length);
      setAllSections(transformedAllSections);
    } catch (err) {
      console.error('❌ [KEPATUHAN] Error loading all sections:', err);
    } finally {
      setLoadingAllSections(false);
    }
  }, [getSections]);

  // ====== Effects ======
  useEffect(() => {
    loadData();
    loadAllSections();
  }, [loadData, loadAllSections]);

  useEffect(() => {
    if (apiError) {
      toast.error(apiError);
      clearError();
    }
  }, [apiError, clearError]);

  useEffect(() => {
    setSectionForm((prev) => ({
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
        hasil: hasil,
        weighted: weighted,
      }));
    }
  }, [indicatorForm.pembilangValue, indicatorForm.penyebutValue, indicatorForm.mode, indicatorForm.formula, indicatorForm.peringkat, indicatorForm.bobotIndikator, sectionForm.bobotSection]);

  // ====== Helper Functions untuk Sections ======
  const getUniqueSections = useMemo(() => {
    const combinedSections = [...sections];

    allSections.forEach((dbSection) => {
      const exists = combinedSections.some((s) => s.no === dbSection.no && s.parameter === dbSection.parameter);
      if (!exists) {
        combinedSections.push(dbSection);
      }
    });

    const uniqueMap = new Map();
    combinedSections.forEach((section) => {
      const key = `${section.no}-${section.parameter}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, {
          id: section.id,
          no: section.no,
          name: section.parameter,
          bobotSection: section.bobotSection,
          year: section.year,
          quarter: section.quarter,
        });
      }
    });

    return Array.from(uniqueMap.values()).sort((a, b) => {
      const numA = parseInt(a.no) || 0;
      const numB = parseInt(b.no) || 0;
      return numA - numB;
    });
  }, [sections, allSections]);

  const getUnusedSections = useMemo(() => {
    const usedSectionIds = sections.map((s) => s.id).filter(Boolean);
    return getUniqueSections.filter((section) => !usedSectionIds.includes(section.id) || (!section.id && !sections.some((s) => s.no === section.no && s.parameter === section.name)));
  }, [sections, getUniqueSections]);

  // ====== Audit Log Function ======
  const handleAuditLog = async (action, description, isSuccess = true, metadata = {}) => {
    try {
      const userId = authUser?.user_id || authUser?.id;

      switch (action) {
        case 'CREATE':
          await logCreate('KEPATUHAN', description, {
            isSuccess,
            userId: userId || null,
            metadata: {
              year: viewYear,
              quarter: viewQuarter,
              ...metadata,
            },
          });
          break;
        case 'UPDATE':
          await logUpdate('KEPATUHAN', description, {
            isSuccess,
            userId: userId || null,
            metadata: {
              year: viewYear,
              quarter: viewQuarter,
              ...metadata,
            },
          });
          break;
        case 'DELETE':
          await logDelete('KEPATUHAN', description, {
            isSuccess,
            userId: userId || null,
            metadata: {
              year: viewYear,
              quarter: viewQuarter,
              ...metadata,
            },
          });
          break;
        case 'EXPORT':
          await logExport('KEPATUHAN', description, {
            isSuccess,
            userId: userId || null,
            metadata: {
              year: viewYear,
              quarter: viewQuarter,
              ...metadata,
            },
          });
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('❌ [KEPATUHAN AUDIT] Audit failed:', error);
    }
  };

  // ====== Helper Functions ======
  const setIndicatorField = (field, value) => {
    setIndicatorForm((prev) => ({
      ...prev,
      [field]: value === null ? '' : value,
    }));
  };

  const selectSection = (id) => {
    const section = [...sections, ...allSections].find((s) => s.id === id);
    if (section) {
      setSectionForm({
        id: section.id,
        no: section.no,
        bobotSection: section.bobotSection,
        parameter: section.parameter || section.name,
        year: viewYear,
        quarter: viewQuarter,
      });
      setIsEditingSection(true);
      setIndicatorForm((prev) => ({
        ...prev,
        sectionId: section.id,
      }));
    }
  };

  const resetSectionForm = () => {
    setSectionForm({
      id: null,
      no: '',
      bobotSection: 100,
      parameter: '',
      year: viewYear,
      quarter: viewQuarter,
    });
    setIsEditingSection(false);
    setIndicatorForm((prev) => ({ ...prev, sectionId: null }));
  };

  const resetIndicatorForm = () => {
    setIndicatorForm({
      ...emptyIndicator,
      sectionId: sectionForm.id,
    });
    setIsEditingIndicator(false);
    setLocalError(null);
  };

  const handleEditIndicator = (indikator) => {
    console.log('📝 [KEPATUHAN EDIT] HandleEditIndicator:', indikator);

    const formData = {
      id: indikator.id,
      subNo: indikator.subNo || indikator.sub_no || '',
      indikator: indikator.indikator || '',
      bobotIndikator: indikator.bobotIndikator || indikator.bobot_indikator || 0,
      sumberRisiko: indikator.sumberRisiko || indikator.sumber_risiko || '',
      dampak: indikator.dampak || '',
      pembilangLabel: indikator.pembilangLabel || indikator.pembilang_label || '',
      pembilangValue: indikator.pembilangValue || indikator.pembilang_value || '',
      penyebutLabel: indikator.penyebutLabel || indikator.penyebut_label || '',
      penyebutValue: indikator.penyebutValue || indikator.penyebut_value || '',
      peringkat: indikator.peringkat || 1,
      weighted: indikator.weighted || '',
      hasil: indikator.hasil || '',
      hasilText: indikator.hasilText || indikator.hasil_text || 'tidak terdapat pelanggaran terhadap peraturan perundang-undangan yang berlaku',
      low: indikator.low || '',
      lowToModerate: indikator.lowToModerate || indikator.low_to_moderate || '',
      moderate: indikator.moderate || '',
      moderateToHigh: indikator.moderateToHigh || indikator.moderate_to_high || '',
      high: indikator.high || '',
      keterangan: indikator.keterangan || '',
      isPercent: Boolean(indikator.isPercent),
      mode: indikator.mode || 'RASIO',
      formula: indikator.formula || '',
      sectionId: sectionForm.id,
    };

    console.log('📝 [KEPATUHAN EDIT] Setting form data:', formData);
    setIndicatorForm(formData);
    setIsEditingIndicator(true);
  };

  // ====== Validation Functions ======
  const validateSectionForm = () => {
    if (!sectionForm.no || !sectionForm.parameter) {
      setLocalError('No Section dan Nama Section harus diisi');
      return false;
    }

    if (sectionForm.bobotSection <= 0) {
      setLocalError('Bobot Section harus lebih dari 0');
      return false;
    }

    return true;
  };

  const validateIndicatorForm = () => {
    if (!sectionForm.id) {
      setLocalError('Pilih section terlebih dahulu');
      return false;
    }

    if (!indicatorForm.indikator || !indicatorForm.bobotIndikator) {
      setLocalError('Nama Indikator dan Bobot Indikator harus diisi');
      return false;
    }

    if (Number(indicatorForm.bobotIndikator) <= 0) {
      setLocalError('Bobot Indikator harus lebih dari 0');
      return false;
    }

    if (indicatorForm.mode === 'RASIO' && !indicatorForm.penyebutValue) {
      setLocalError('Nilai penyebut harus diisi untuk mode RASIO');
      return false;
    }

    if (indicatorForm.mode === 'NILAI_TUNGGAL' && !indicatorForm.penyebutValue) {
      setLocalError('Nilai penyebut harus diisi untuk mode NILAI_TUNGGAL');
      return false;
    }

    return true;
  };

  // ====== CRUD Operations ======
  const handleCreateSection = async () => {
    setLocalError(null);

    if (!validateSectionForm()) return;

    const isDuplicate = sections.some((s) => s.year === viewYear && s.quarter === viewQuarter && s.no === sectionForm.no);

    if (isDuplicate) {
      setLocalError(`Section dengan nomor ${sectionForm.no} sudah ada untuk periode ${viewYear}-${viewQuarter}`);
      return;
    }

    setIsCreating(true);
    try {
      const sectionData = {
        no: sectionForm.no,
        bobotSection: Number(sectionForm.bobotSection || 0),
        parameter: sectionForm.parameter,
        description: '',
        category: 'Compliance Risk',
        sortOrder: allSections.length + 1,
      };

      const newSection = await createSection(sectionData);

      handleAuditLog('CREATE', `Menambahkan section kepatuhan - No: ${sectionForm.no}, Nama: "${sectionForm.parameter}", Bobot: ${sectionForm.bobotSection}%`, true, {
        section_no: sectionForm.no,
        section_name: sectionForm.parameter,
        bobotSection: sectionForm.bobotSection,
      });

      resetSectionForm();
      await loadAllSections();
    } catch (err) {
      handleAuditLog('CREATE', `Gagal menambah section kepatuhan - No: ${sectionForm.no}, Nama: "${sectionForm.parameter}"`, false, {
        section_no: sectionForm.no,
        section_name: sectionForm.parameter,
        error: err.message,
      });
      setLocalError(`Gagal membuat section: ${err.message}`);
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
      const backendId = parseInt(sectionForm.id.replace('s-', ''));
      if (isNaN(backendId)) {
        throw new Error('ID section tidak valid');
      }

      const updateData = {
        no: sectionForm.no,
        bobotSection: Number(sectionForm.bobotSection),
        parameter: sectionForm.parameter,
      };

      await updateSection(backendId, updateData);

      handleAuditLog('UPDATE', `Mengupdate section kepatuhan - No: ${sectionForm.no}, Nama: "${sectionForm.parameter}", Bobot: ${sectionForm.bobotSection}%`, true, {
        section_id: backendId,
        section_no: sectionForm.no,
        section_name: sectionForm.parameter,
        bobotSection: sectionForm.bobotSection,
      });

      resetSectionForm();
      await loadAllSections();
      await loadData();
    } catch (err) {
      handleAuditLog('UPDATE', `Gagal update section kepatuhan - No: ${sectionForm.no}, Nama: "${sectionForm.parameter}"`, false, {
        section_id: sectionForm.id,
        section_no: sectionForm.no,
        section_name: sectionForm.parameter,
        error: err.message,
      });
      setLocalError(`Gagal update section: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus section ini? Semua indikator dalam section ini juga akan dihapus.')) return;

    const sectionToDelete = [...sections, ...allSections].find((s) => s.id === sectionId);

    setIsDeleting(true);
    try {
      const backendId = parseInt(sectionId.replace('s-', ''));
      if (isNaN(backendId)) {
        throw new Error('ID section tidak valid');
      }

      await deleteSection(backendId);

      handleAuditLog('DELETE', `Menghapus section kepatuhan - No: ${sectionToDelete?.no}, Nama: "${sectionToDelete?.parameter}"`, true, {
        section_id: backendId,
        section_no: sectionToDelete?.no,
        section_name: sectionToDelete?.parameter,
      });

      resetSectionForm();
      await loadAllSections();
      await loadData();
    } catch (err) {
      handleAuditLog('DELETE', `Gagal menghapus section kepatuhan - No: ${sectionToDelete?.no}, Nama: "${sectionToDelete?.parameter}"`, false, {
        section_id: sectionId,
        section_no: sectionToDelete?.no,
        section_name: sectionToDelete?.parameter,
        error: err.message,
      });
      setLocalError(`Gagal menghapus section: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateIndicator = async () => {
    setLocalError(null);

    if (!validateIndicatorForm()) return;

    setIsCreating(true);
    try {
      const backendSectionId = parseInt(sectionForm.id.replace('s-', ''));
      if (isNaN(backendSectionId)) {
        throw new Error('ID section tidak valid');
      }

      const weighted = computeWeightedAuto(indicatorForm, sectionForm.bobotSection);
      const hasil = computeHasil(indicatorForm);

      const indicatorData = {
        year: viewYear,
        quarter: viewQuarter,
        sectionId: backendSectionId,
        no: sectionForm.no,
        sectionLabel: sectionForm.parameter,
        bobotSection: sectionForm.bobotSection,
        subNo: indicatorForm.subNo,
        indikator: indicatorForm.indikator,
        bobotIndikator: indicatorForm.bobotIndikator || 0,
        sumberRisiko: indicatorForm.sumberRisiko || '',
        dampak: indicatorForm.dampak || '',
        low: indicatorForm.low || '',
        lowToModerate: indicatorForm.lowToModerate || '',
        moderate: indicatorForm.moderate || '',
        moderateToHigh: indicatorForm.moderateToHigh || '',
        high: indicatorForm.high || '',
        mode: indicatorForm.mode || 'RASIO',
        pembilangLabel: indicatorForm.pembilangLabel || '',
        pembilangValue: indicatorForm.pembilangValue || '',
        penyebutLabel: indicatorForm.penyebutLabel || '',
        penyebutValue: indicatorForm.penyebutValue || '',
        formula: indicatorForm.formula || '',
        isPercent: indicatorForm.isPercent || false,
        hasil: hasil.toString(),
        hasilText: indicatorForm.hasilText || '',
        peringkat: indicatorForm.peringkat || 1,
        weighted: weighted,
        keterangan: indicatorForm.keterangan || '',
      };

      await createKepatuhan(indicatorData);

      handleAuditLog('CREATE', `Menambahkan indikator kepatuhan - "${indicatorForm.indikator}", Bobot: ${indicatorForm.bobotIndikator}%`, true, {
        section_id: backendSectionId,
        section_no: sectionForm.no,
        indicator_name: indicatorForm.indikator,
        bobotIndikator: indicatorForm.bobotIndikator,
        peringkat: indicatorForm.peringkat,
      });

      resetIndicatorForm();
      await loadData();
    } catch (err) {
      handleAuditLog('CREATE', `Gagal menambah indikator kepatuhan - "${indicatorForm.indikator}"`, false, {
        section_id: sectionForm.id,
        section_no: sectionForm.no,
        indicator_name: indicatorForm.indikator,
        error: err.message,
      });
      setLocalError(`Gagal membuat indikator: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateIndicator = async () => {
    console.log('🔄 [KEPATUHAN UPDATE] Starting update for indicator ID:', indicatorForm.id);

    if (!indicatorForm.id) {
      setLocalError('ID indikator tidak ditemukan');
      return;
    }

    if (!indicatorForm.indikator?.trim()) {
      setLocalError('Nama indikator tidak boleh kosong');
      return;
    }

    setIsUpdating(true);
    setLocalError(null);

    try {
      const backendIndicatorId = parseInt(indicatorForm.id.replace('i-', ''));
      if (isNaN(backendIndicatorId)) {
        throw new Error('ID indikator tidak valid');
      }

      const weighted = computeWeightedAuto(indicatorForm, sectionForm.bobotSection);
      const hasil = computeHasil(indicatorForm);

      const updateData = {
        year: viewYear,
        quarter: viewQuarter,
        sectionId: parseInt(sectionForm.id.replace('s-', '')),
        no: sectionForm.no,
        sectionLabel: sectionForm.parameter,
        bobotSection: sectionForm.bobotSection,
        subNo: indicatorForm.subNo,
        indikator: indicatorForm.indikator,
        bobotIndikator: indicatorForm.bobotIndikator || 0,
        sumberRisiko: indicatorForm.sumberRisiko || '',
        dampak: indicatorForm.dampak || '',
        low: indicatorForm.low || '',
        lowToModerate: indicatorForm.lowToModerate || '',
        moderate: indicatorForm.moderate || '',
        moderateToHigh: indicatorForm.moderateToHigh || '',
        high: indicatorForm.high || '',
        mode: indicatorForm.mode || 'RASIO',
        pembilangLabel: indicatorForm.pembilangLabel || '',
        pembilangValue: indicatorForm.pembilangValue || '',
        penyebutLabel: indicatorForm.penyebutLabel || '',
        penyebutValue: indicatorForm.penyebutValue || '',
        formula: indicatorForm.formula || '',
        isPercent: indicatorForm.isPercent || false,
        hasil: hasil.toString(),
        hasilText: indicatorForm.hasilText || '',
        peringkat: indicatorForm.peringkat || 1,
        weighted: weighted,
        keterangan: indicatorForm.keterangan || '',
      };

      console.log('📤 [KEPATUHAN UPDATE] Data untuk update:', updateData);

      await updateKepatuhan(backendIndicatorId, updateData);

      console.log('✅ [KEPATUHAN UPDATE] API call successful');

      resetIndicatorForm();

      setTimeout(async () => {
        console.log('🔄 [KEPATUHAN UPDATE] Reloading data...');
        await loadData();
        console.log('✅ [KEPATUHAN UPDATE] Data reloaded');
      }, 300);
    } catch (err) {
      console.error('❌ [KEPATUHAN UPDATE] Error updating:', err);

      let errorMessage = 'Gagal update data';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setLocalError(`Update gagal: ${errorMessage}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteIndicator = async (indikatorId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus indikator ini?')) return;

    const indicatorToDelete = sections.flatMap((s) => s.indicators || []).find((it) => it.id === indikatorId);

    if (!indicatorToDelete) {
      setLocalError('Indikator tidak ditemukan');
      return;
    }

    setIsDeleting(true);
    try {
      const backendIndicatorId = parseInt(indikatorId.replace('i-', ''));
      if (isNaN(backendIndicatorId)) {
        throw new Error('ID indikator tidak valid');
      }

      await deleteKepatuhan(backendIndicatorId);

      handleAuditLog('DELETE', `Menghapus indikator kepatuhan - "${indicatorToDelete.indikator}"`, true, {
        indicator_id: backendIndicatorId,
        section_id: sectionForm.id,
        section_no: sectionForm.no,
        indicator_name: indicatorToDelete.indikator,
      });

      await loadData();
    } catch (err) {
      console.error('❌ Error deleting indicator:', err);

      let errorMessage = 'Terjadi kesalahan';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      handleAuditLog('DELETE', `Gagal menghapus indikator kepatuhan - "${indicatorToDelete.indikator}"`, false, {
        indicator_id: indikatorId,
        section_id: sectionForm.id,
        section_no: sectionForm.no,
        indicator_name: indicatorToDelete.indikator,
        error: errorMessage,
      });

      setLocalError(`Gagal menghapus indikator: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // ====== Export Function ======
  const handleExportKepatuhan = () => {
    const selectedSection = sections.find((s) => s.id === sectionForm.id) || sections[0];

    if (!selectedSection) {
      alert('Belum ada section untuk diexport.');
      return;
    }

    const rows = selectedSection.indicators || [];
    if (!rows.length) {
      alert('Section ini belum punya indikator untuk diexport.');
      return;
    }

    try {
      const exportData = rows.map((indikator) => {
        const transformed = transformIndicatorToFrontend(indikator);
        return {
          subNo: transformed.subNo,
          indikator: transformed.indikator,
          bobotIndikator: transformed.bobotIndikator,
          sumberRisiko: transformed.sumberRisiko,
          dampak: transformed.dampak,
          pembilangLabel: transformed.pembilangLabel,
          pembilangValue: transformed.pembilangValue,
          penyebutLabel: transformed.penyebutLabel,
          penyebutValue: transformed.penyebutValue,
          peringkat: transformed.peringkat,
          weighted: transformed.weighted,
          hasil: transformed.hasil,
          hasilText: transformed.hasilText,
          low: transformed.low,
          lowToModerate: transformed.lowToModerate,
          moderate: transformed.moderate,
          moderateToHigh: transformed.moderateToHigh,
          high: transformed.high,
          keterangan: transformed.keterangan,
        };
      });

      handleAuditLog('EXPORT', `Export data Excel kepatuhan - Periode: ${viewYear}-${viewQuarter}, Section: ${selectedSection.no}, Jumlah Data: ${rows.length}`, true, {
        year: viewYear,
        quarter: viewQuarter,
        section_id: selectedSection.id,
        section_no: selectedSection.no,
        section_name: selectedSection.parameter,
        total_records: rows.length,
        file_type: 'excel',
      });

      exportKPMRHukumToExcel({
        year: viewYear,
        quarter: viewQuarter,
        sectionNo: selectedSection.no,
        sectionLabel: selectedSection.parameter,
        bobotSection: selectedSection.bobotSection,
        rows: exportData,
      });
    } catch (err) {
      handleAuditLog('EXPORT', `Gagal export data Excel kepatuhan - Periode: ${viewYear}-${viewQuarter}`, false, {
        year: viewYear,
        quarter: viewQuarter,
        section_id: selectedSection?.id,
        section_no: selectedSection?.no,
        error: err.message,
      });
      console.error('Gagal export Excel:', err);
      alert('Gagal melakukan export. Silakan coba lagi.');
    }
  };

  const handleSaveAll = async () => {
    if (sections.length === 0) {
      toast.error('Tidak ada data untuk disimpan');
      return;
    }

    setIsUpdating(true);
    try {
      await saveKepatuhanData(viewYear, viewQuarter, sections);

      handleAuditLog('UPDATE', `Menyimpan semua data kepatuhan - Periode: ${viewYear}-${viewQuarter}, Jumlah Section: ${sections.length}`, true, {
        year: viewYear,
        quarter: viewQuarter,
        total_sections: sections.length,
        total_indicators: sections.reduce((sum, s) => sum + (s.indicators?.length || 0), 0),
      });

      toast.success('Data berhasil disimpan ke server');
      await loadData();
    } catch (err) {
      handleAuditLog('UPDATE', `Gagal menyimpan semua data kepatuhan - Periode: ${viewYear}-${viewQuarter}`, false, {
        year: viewYear,
        quarter: viewQuarter,
        error: err.message,
      });
      console.error('Error saving to backend:', err);
      toast.error('Gagal menyimpan data');
    } finally {
      setIsUpdating(false);
    }
  };

  // ====== Delete Period Function ======
  const handleDeletePeriod = async () => {
    if (!confirm(`Apakah Anda yakin ingin menghapus semua data untuk periode ${viewYear} ${viewQuarter}?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteByPeriod(viewYear, viewQuarter);

      handleAuditLog('DELETE', `Menghapus data periode kepatuhan - Periode: ${viewYear}-${viewQuarter}`, true, {
        year: viewYear,
        quarter: viewQuarter,
      });

      toast.success(`Data periode ${viewYear} ${viewQuarter} berhasil dihapus`);
      await loadData();
    } catch (err) {
      handleAuditLog('DELETE', `Gagal menghapus data periode kepatuhan - Periode: ${viewYear}-${viewQuarter}`, false, {
        year: viewYear,
        quarter: viewQuarter,
        error: err.message,
      });
      console.error('Error deleting period data:', err);
      toast.error('Gagal menghapus data periode');
    } finally {
      setIsDeleting(false);
    }
  };

  // ====== Memoized Values ======
  const filteredSections = useMemo(() => {
    if (!query.trim()) return sections;
    const q = query.toLowerCase();

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

  const totalWeighted = useMemo(() => {
    return sections.reduce((sum, section) => {
      const inds = section.indicators || [];
      const sectionTotal = inds.reduce((sectionSum, indikator) => {
        const transformed = transformIndicatorToFrontend(indikator);
        const weighted = Number(transformed.weighted);
        return sectionSum + (isNaN(weighted) ? 0 : weighted);
      }, 0);
      return sum + sectionTotal;
    }, 0);
  }, [sections]);

  const hasilPreview = useMemo(() => {
    const raw = computeHasil(indicatorForm);
    if (raw === '' || raw == null) return '';

    if (indicatorForm.mode === 'TEKS') {
      return indicatorForm.hasilText || '';
    }

    if (indicatorForm.isPercent) {
      const pct = Number(raw) * 100;
      if (!isFinite(pct) || isNaN(pct)) return '';
      return `${pct.toFixed(2)}%`;
    }

    if (indicatorForm.mode === 'NILAI_TUNGGAL') {
      return fmtNumber(raw);
    }

    return Number(raw).toFixed(4);
  }, [indicatorForm]);

  const weightedPreview = useMemo(() => {
    if (!sectionForm.id) return 0;
    const weighted = computeWeightedAuto(indicatorForm, sectionForm.bobotSection);
    return weighted;
  }, [sectionForm.id, indicatorForm, sectionForm.bobotSection]);

  // ====== Render ======
  return (
    <>
      <header className="px-4 py-4 flex items-center justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-semibold">Form – Kepatuhan</h2>
        <div className="flex items-center gap-3">
          {/* tahun + triwulan */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="sr-only">Tahun</label>
              <YearInput value={viewYear} onChange={(v) => setViewYear(v)} />
            </div>

            <div className="flex items-center gap-2">
              <label className="sr-only">Triwulan</label>
              <QuarterSelect value={viewQuarter} onChange={(v) => setViewQuarter(v)} />
            </div>
          </div>

          {/* group search + export */}
          <div className="flex items-center gap-2 transform -translate-y-1">
            <div className="relative">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari no/sub/indikator…" className="pl-9 pr-3 py-2 rounded-xl border w-64" />
              <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Backend Actions */}
            <button
              onClick={() => {
                loadAllSections();
                loadData();
              }}
              disabled={loadingData || loadingAllSections}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw size={18} /> {loadingData || loadingAllSections ? 'Loading...' : 'Load Data'}
            </button>

            <button onClick={handleSaveAll} disabled={loadingData || sections.length === 0} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">
              <Save size={18} /> Save to Server
            </button>

            <button onClick={handleDeletePeriod} disabled={loadingData} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">
              <Trash2 size={18} /> Delete Period
            </button>

            <button onClick={handleExportKepatuhan} disabled={sections.length === 0} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-gray-900 text-white hover:bg-black disabled:opacity-50">
              <Download size={18} /> Export {viewYear}-{viewQuarter}
            </button>
          </div>
        </div>
      </header>

      {/* Error Display */}
      {(localError || apiError) && (
        <div className="mx-4 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {localError || apiError}
          <button
            onClick={() => {
              setLocalError(null);
              clearError();
            }}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {(loadingData || apiLoading || isCreating || isUpdating || isDeleting || loadingAllSections) && (
        <div className="mx-4 mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          {loadingAllSections ? 'Memuat semua section...' : 'Memuat data...'}
        </div>
      )}

      {/* top toolbar with section */}
      <div className="relative rounded-2xl overflow-hidden mb-6 shadow-sm bg-gradient-to-r from-[#0076C6]/90 via-[#00A3DA]/90 to-[#33C2B5]/90">
        <div className="rounded-2xl border-2 border-gray-300 p-4 shadow-sm mb-6">
          <h2 className="text-white font-semibold text-lg sm:text-xl mb-6">Form Section – Kepatuhan</h2>

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
                  } else if (selectedId) {
                    selectSection(selectedId);
                  } else {
                    resetSectionForm();
                  }
                }}
                disabled={loadingAllSections}
              >
                <option value="">-- Pilih Section yang sudah ada --</option>

                {/* Section yang sudah ada di periode ini */}
                {sections.length > 0 && (
                  <optgroup label={`Section di periode ${viewYear}-${viewQuarter}`}>
                    {sections.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.no} - {s.parameter} ({s.bobotSection}%)
                      </option>
                    ))}
                  </optgroup>
                )}

                {/* Section dari database yang belum digunakan */}
                {getUnusedSections.length > 0 && (
                  <optgroup label="Section dari database">
                    {getUnusedSections.map((section) => (
                      <option key={`db-${section.no}-${section.name}`} value={section.id || `new-${section.no}`}>
                        {section.no} - {section.name} ({section.bobotSection}%)
                        {!section.id && ' [Baru]'}
                      </option>
                    ))}
                  </optgroup>
                )}

                {/* Pilihan untuk membuat section baru */}
                <option value="new">+ Buat Section Baru</option>
              </select>
              <ChevronDown className="absolute right-4 top-9 pointer-events-none text-gray-400" size={20} />

              {loadingAllSections && (
                <div className="absolute right-12 top-9">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>

            <div className="text-xs text-white/80 mt-1 flex items-center gap-2">
              <Database size={14} />
              Total tersedia: {getUniqueSections.length} section ({sections.length} di periode ini)
              {sections.length > 0 && (
                <span className="flex items-center gap-1">
                  <AlertCircle size={12} />
                  {sections.filter((s) => s.indicators?.length > 0).length} section memiliki data
                </span>
              )}
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
                placeholder="1.1"
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
                placeholder="Uraian section risiko kepatuhan"
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
              {isEditingSection && (
                <button
                  className="w-10 h-10 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center disabled:bg-gray-400"
                  onClick={() => handleDeleteSection(sectionForm.id)}
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
                Bobot: {sectionForm.bobotSection}% | Periode: {viewYear}-{viewQuarter}
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
                <input className="w-full rounded-lg border-2 border-gray-300 px-3 py-3 text-sm bg-white" value={indicatorForm.subNo} onChange={(e) => setIndicatorField('subNo', e.target.value)} placeholder="5.1.1" />
              </div>
              <div className="col-span-7">
                <label className="text-sm font-medium mb-2 block text-white">Indikator</label>
                <input
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                  value={indicatorForm.indikator}
                  onChange={(e) => setIndicatorField('indikator', e.target.value)}
                  placeholder="Teks indikator risiko kepatuhan…"
                />
              </div>
              <div className="col-span-3">
                <label className="text-sm font-medium mb-2 block text-right text-white">Bobot Indikator (%)</label>
                <input
                  type="number"
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm text-right bg-white"
                  value={indicatorForm.bobotIndikator}
                  onChange={(e) => setIndicatorField('bobotIndikator', e.target.value)}
                  placeholder="100"
                />
              </div>
            </div>

            {/* Metode Penghitungan + Rumus / Hasil Teks */}
            <div className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-4">
                <label className="text-sm font-medium mb-2 block text-white">Metode Penghitungan</label>
                <select
                  className="w-full rounded-lg border-2 border-gray-300 px-3 py-3 text-sm bg-white"
                  value={indicatorForm.mode || 'RASIO'}
                  onChange={(e) => {
                    const v = e.target.value;
                    setIndicatorField('mode', v);
                    if (v === 'TEKS') {
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
                  <option value="RASIO">Rasio (Pembilang / Penyebut)</option>
                  <option value="NILAI_TUNGGAL">Nilai tunggal (hanya penyebut)</option>
                  <option value="TEKS">Kualitatif (hasil berupa teks)</option>
                </select>
              </div>

              <div className="col-span-8">
                {indicatorForm.mode === 'TEKS' ? (
                  <>
                    <label className="text-sm font-medium mb-2 block text-white">Hasil (Teks) – akan muncul di kolom "Hasil"</label>
                    <input
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                      value={indicatorForm.hasilText}
                      onChange={(e) => setIndicatorField('hasilText', e.target.value)}
                      placeholder="misal: tidak terdapat pelanggaran terhadap peraturan perundang-undangan yang berlaku"
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
                        placeholder={indicatorForm.mode === 'NILAI_TUNGGAL' ? 'Contoh: peny / 1000' : 'Contoh: peny / pemb'}
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
            {indicatorForm.mode === 'RASIO' && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-white">Faktor Pembilang</label>
                  <input
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                    value={indicatorForm.pembilangLabel}
                    onChange={(e) => setIndicatorField('pembilangLabel', e.target.value)}
                    placeholder="Biaya perkara, jumlah kerugian, dll."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-white">Nilai Pembilang</label>
                  <input className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white" value={indicatorForm.pembilangValue ?? ''} onChange={(e) => setIndicatorField('pembilangValue', e.target.value)} placeholder="100" />
                </div>
              </div>
            )}

            {/* Faktor Penyebut (non TEKS) */}
            {indicatorForm.mode !== 'TEKS' && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-white">Faktor Penyebut</label>
                  <input
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                    value={indicatorForm.penyebutLabel}
                    onChange={(e) => setIndicatorField('penyebutLabel', e.target.value)}
                    placeholder="Total Pendapatan (Jutaan), jumlah kasus, dll."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-white">Nilai Penyebut</label>
                  <input className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white" value={indicatorForm.penyebutValue ?? ''} onChange={(e) => setIndicatorField('penyebutValue', e.target.value)} placeholder="10000" />
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
                  placeholder="Contoh: proses due diligence tidak dilakukan, kesalahan penulisan klausul, dll."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-white">Dampak</label>
                <textarea
                  rows={4}
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm resize-none bg-white"
                  value={indicatorForm.dampak}
                  onChange={(e) => setIndicatorField('dampak', e.target.value)}
                  placeholder="Contoh: sanksi regulator, reputasi menurun, kerugian finansial, dll."
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
                        value={indicatorForm.peringkat ?? ''}
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
                  <RiskBox className="w-full" label="Low" value={indicatorForm.low} onChange={(v) => setIndicatorField('low', v)} color="#B7E1A1" textColor="#0B3D2E" placeholder="deskripsi level Low" />
                  <RiskBox className="w-full" label="Low to Moderate" value={indicatorForm.lowToModerate} onChange={(v) => setIndicatorField('lowToModerate', v)} color="#CFE0FF" textColor="#0B2545" placeholder="deskripsi level L-M" />
                  <RiskBox className="w-full" label="Moderate" value={indicatorForm.moderate} onChange={(v) => setIndicatorField('moderate', v)} color="#FFEEAD" textColor="#4B3A00" placeholder="deskripsi level Moderate" />
                  <RiskBox className="w-full" label="Moderate to High" value={indicatorForm.moderateToHigh} onChange={(v) => setIndicatorField('moderateToHigh', v)} color="#FAD2A7" textColor="#5A2E00" placeholder="deskripsi level M-H" />
                  <RiskBox className="w-full" label="High" value={indicatorForm.high} onChange={(v) => setIndicatorField('high', v)} color="#E57373" textColor="#FFFFFF" placeholder="deskripsi level High" />
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

      {/* table area */}
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
                  {loadingData ? (
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
                        const transformed = transformIndicatorToFrontend(it);
                        const rowCount = transformed.mode === 'TEKS' ? 1 : rowsPerIndicator(transformed);
                        return sum + rowCount;
                      }, 0);

                      return (
                        <React.Fragment key={s.id}>
                          {inds.map((it, idx) => {
                            const firstOfSection = idx === 0;
                            const transformed = transformIndicatorToFrontend(it);

                            let hasilDisplay = '';
                            if (transformed.mode === 'TEKS') {
                              hasilDisplay = transformed.hasilText || '';
                            } else if (transformed.hasil !== '' && transformed.hasil != null && !isNaN(Number(transformed.hasil))) {
                              if (transformed.isPercent) {
                                hasilDisplay = (Number(transformed.hasil) * 100).toFixed(2) + '%';
                              } else {
                                hasilDisplay = Number(transformed.hasil).toFixed(4);
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

                                  <td className="border px-3 py-3 text-center bg-green-700/10">{transformed.low}</td>
                                  <td className="border px-3 py-3 text-center bg-green-700/10">{transformed.lowToModerate}</td>
                                  <td className="border px-3 py-3 text-center bg-green-700/10">{transformed.moderate}</td>
                                  <td className="border px-3 py-3 text-center bg-green-700/10">{transformed.moderateToHigh}</td>
                                  <td className="border px-3 py-3 text-center bg-green-700/10">{transformed.high}</td>

                                  <td className="border px-3 py-3 text-right bg-gray-400/20 whitespace-pre-wrap">{hasilDisplay}</td>

                                  <td className="border px-3 py-3 text-center">
                                    <div style={{ minWidth: 36, minHeight: 24 }} className="inline-block rounded bg-yellow-300 px-2">
                                      {transformed.peringkat}
                                    </div>
                                  </td>

                                  <td className="border px-3 py-3 text-right bg-gray-400/20">{weightedDisplay}</td>

                                  <td className="border px-3 py-3 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                      <button onClick={() => handleEditIndicator(it)} className="px-2 py-1 rounded border">
                                        <Edit3 size={14} />
                                      </button>
                                      <button onClick={() => handleDeleteIndicator(transformed.id)} className="px-2 py-1 rounded border text-red-600">
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>

                                {/* ── baris penyebut ── */}
                                {transformed.mode !== 'TEKS' && (
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
                                    {transformed.mode === 'RASIO' && (
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
                    <td className="border border-gray-400 text-white font-semibold text-center bg-[#8fce00]">{Number(totalWeighted || 0).toFixed(2)}</td>

                    {/* Kolom Aksi (kosong) */}
                    <td className="border border-gray-400"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
