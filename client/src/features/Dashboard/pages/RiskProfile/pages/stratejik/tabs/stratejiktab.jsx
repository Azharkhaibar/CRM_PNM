// src/features/Dashboard/pages/RiskProfile/pages/Strategik/tabs/stratejiktab.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Download, Trash2, Edit3, Search, Plus, ChevronDown } from 'lucide-react';
import { YearInput, QuarterSelect } from '../../pasar/components/Inputs.jsx';
import { exportKPMRPasarToExcel } from '../../pasar/utils/excelexportpasar.jsx';
import { useStrategik } from '../hook/stratejik/stratejik.hook.js';

// ===================== Brand =====================
const PNM_BRAND = {
  primary: '#0068B3',
  primarySoft: '#E6F1FA',
  gradient: 'bg-gradient-to-r from-[#0076C6]/90 via-[#00A3DA]/90 to-[#33C2B5]/90',
};

// Formatters
const fmtNumber = (v) => {
  if (v === '' || v == null) return '';
  const n = Number(v);
  if (isNaN(n)) return String(v);
  return new Intl.NumberFormat('en-US').format(n);
};

const parseNum = (v) => {
  if (v == null || v === '') return 0;
  if (typeof v === 'number') return v;

  const cleaned = String(v).replace(/,/g, '').replace(/\s/g, '');

  if (cleaned.includes('%')) {
    const numValue = Number(cleaned.replace('%', ''));
    if (isNaN(numValue)) return 0;
    return numValue / 100;
  }

  const n = Number(cleaned);
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
  keterangan: '',
};

// Transform functions untuk strategik
const transformIndicatorToBackend = (indicatorData, year, quarter, sectionId, sectionData) => {
  console.log('🔄 [TRANSFORM] Transforming indicator to backend:', {
    indicatorData,
    year,
    quarter,
    sectionId,
    sectionData,
  });

  // Simple validation
  const validYear = Number(year) || new Date().getFullYear();
  const validQuarter = quarter || 'Q1';

  if (isNaN(validYear)) {
    throw new Error(`Tahun tidak valid: ${year}`);
  }

  // Gunakan sectionData yang dikirim dari parameter
  const sectionNo = sectionData?.no || '';
  const sectionParameter = sectionData?.parameter || '';
  const sectionBobot = Number(sectionData?.bobotSection) || 0;

  // Format sederhana sesuai dengan backend DTO
  const data = {
    // Identitas dasar - HARUS ADA
    year: validYear,
    quarter: validQuarter,
    sectionId: Number(sectionId),

    // Data dari section
    no: sectionNo,
    sectionLabel: sectionParameter,
    bobotSection: sectionBobot,

    // Data indikator utama
    subNo: indicatorData.subNo?.toString().trim() || '',
    indikator: indicatorData.indikator?.toString().trim() || '',
    bobotIndikator: Number(indicatorData.bobotIndikator) || 0,

    // Mode perhitungan
    mode: indicatorData.mode || 'RASIO',

    // Data RASIO/NILAI_TUNGGAL
    pembilangLabel: indicatorData.pembilangLabel?.trim() || null,
    pembilangValue: indicatorData.pembilangValue !== undefined ? Number(indicatorData.pembilangValue) : null,
    penyebutLabel: indicatorData.penyebutLabel?.trim() || null,
    penyebutValue: indicatorData.penyebutValue !== undefined ? Number(indicatorData.penyebutValue) : null,
    formula: indicatorData.formula?.trim() || null,
    isPercent: Boolean(indicatorData.isPercent || false),

    // Data risiko
    sumberRisiko: indicatorData.sumberRisiko?.trim() || null,
    dampak: indicatorData.dampak?.trim() || null,

    // Data level risiko
    low: indicatorData.low?.trim() || null,
    lowToModerate: indicatorData.lowToModerate?.trim() || null,
    moderate: indicatorData.moderate?.trim() || null,
    moderateToHigh: indicatorData.moderateToHigh?.trim() || null,
    high: indicatorData.high?.trim() || null,

    // Peringkat dan hasil
    peringkat: Number(indicatorData.peringkat) || 1,

    // Hasil dan weighted akan dihitung di backend
    hasil: indicatorData.hasil?.trim() || null,
    hasilText: null, // Untuk mode TEKS
    weighted: Number(indicatorData.weighted) || 0,

    // Keterangan
    keterangan: indicatorData.keterangan?.trim() || null,
  };

  console.log('✅ [TRANSFORM] Final data for backend:', data);
  return data;
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
    keterangan: indikator.keterangan || '',
    isPercent: Boolean(indikator.isPercent || false),
    mode: indikator.mode || 'RASIO',
    formula: indikator.formula || '',
    // Data level risiko
    low: indikator.low || null,
    lowToModerate: indikator.lowToModerate || null,
    moderate: indikator.moderate || null,
    moderateToHigh: indikator.moderateToHigh || null,
    high: indikator.high || null,
  };
};

// Transform functions untuk section
const transformSectionToBackend = (sectionData, year, quarter) => {
  console.log('🔄 [TRANSFORM SECTION] Transforming section:', { sectionData, year, quarter });

  return {
    no: String(sectionData.no),
    bobotSection: Number(sectionData.bobotSection || 0),
    parameter: sectionData.parameter,
    year: Number(year),
    quarter: quarter,
  };
};

// ===================== FUNGSI KALKULASI =====================
const computeHasil = (ind) => {
  const mode = ind.mode || 'RASIO';
  const pemb = parseNum(ind.pembilangValue);
  const peny = parseNum(ind.penyebutValue);

  // custom formula
  const formula = ind.formula || '';
  if (formula.trim() !== '') {
    try {
      // Ganti variabel dengan nilai
      const expr = formula
        .replace(/\bpembilang\b/gi, pemb.toString())
        .replace(/\bpenyebut\b/gi, peny.toString())
        .replace(/\bpemb\b/g, pemb.toString())
        .replace(/\bpeny\b/g, peny.toString());

      const fn = new Function('pemb', 'peny', `return (${expr});`);
      const res = fn(pemb, peny);
      if (!isFinite(res) || isNaN(res)) return '';
      return Number(res);
    } catch (err) {
      console.warn('Invalid formula:', formula, err);
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

// total baris per indikator (untuk rowSpan section)
const rowsPerIndicator = (ind) => {
  return 1 + (ind.mode === 'RASIO' ? 2 : 1);
};

export default function StrategikTab({ viewYear, setViewYear, viewQuarter, setViewQuarter, query, setQuery }) {
  // ====== Hooks ======
  const { loading, error, getSectionsByPeriod, getAllSections, createSection, updateSection, deleteSection, createIndikator, updateIndikator, deleteIndikator, clearError } = useStrategik();

  // ====== States ======
  const [sections, setSections] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [allSections, setAllSections] = useState([]);
  const [loadingAllSections, setLoadingAllSections] = useState(false);

  // Tambahkan internal state jika prop tidak ada
  const [internalViewYear, internalSetViewYear] = useState(viewYear !== undefined ? viewYear : new Date().getFullYear());
  const [internalViewQuarter, internalSetViewQuarter] = useState(viewQuarter !== undefined ? viewQuarter : 'Q1');
  const [internalQuery, internalSetQuery] = useState(query !== undefined ? query : '');

  // Pilih state yang akan digunakan
  const actualViewYear = viewYear !== undefined ? viewYear : internalViewYear;
  const actualSetViewYear = setViewYear || internalSetViewYear;
  const actualViewQuarter = viewQuarter !== undefined ? viewQuarter : internalViewQuarter;
  const actualSetViewQuarter = setViewQuarter || internalSetViewQuarter;
  const actualQuery = query !== undefined ? query : internalQuery;
  const actualSetQuery = setQuery || internalSetQuery;

  // State section form
  const [sectionForm, setSectionForm] = useState({
    id: null,
    no: '',
    bobotSection: 100,
    parameter: '',
    year: actualViewYear,
    quarter: actualViewQuarter,
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
    if (!actualViewYear || isNaN(Number(actualViewYear)) || !actualViewQuarter) {
      console.log('⚠️ [STRATEGIK LOAD] Invalid period, skipping load:', actualViewYear, actualViewQuarter);
      setLocalError('Tahun dan quarter harus diisi dengan benar');
      return;
    }

    console.log('🔄 [STRATEGIK LOAD] Starting to load data...', actualViewYear, actualViewQuarter);

    setLoadingData(true);
    setLocalError(null);

    try {
      const sectionsData = await getSectionsByPeriod(Number(actualViewYear), actualViewQuarter);
      console.log('📥 [STRATEGIK LOAD] Raw data length:', sectionsData.length);

      // Pastikan data ada dan valid
      if (!Array.isArray(sectionsData)) {
        throw new Error('Data yang diterima tidak valid');
      }

      const transformedSections = sectionsData.map((section) => {
        const inds = section.indicators || section.indikators || [];
        return {
          id: section.id,
          no: section.no || '',
          parameter: section.parameter || '',
          bobotSection: Number(section.bobotSection) || 0,
          year: section.year || actualViewYear,
          quarter: section.quarter || actualViewQuarter,
          indikators: inds.map((ind) => transformIndicatorToFrontend(ind)),
        };
      });

      console.log('✅ [STRATEGIK LOAD] Setting new sections:', transformedSections.length);
      setSections([...transformedSections]);
    } catch (err) {
      console.error('❌ [STRATEGIK LOAD] Error:', err);

      let errorMessage = 'Gagal memuat data strategik';
      if (err.message.includes('Network error')) {
        errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Data tidak ditemukan untuk periode ini';
      } else {
        errorMessage = err.message || errorMessage;
      }

      setLocalError(errorMessage);
      setSections([]); // Reset sections jika error
    } finally {
      setLoadingData(false);
    }
  }, [actualViewYear, actualViewQuarter, getSectionsByPeriod]);

  // load semua data dari database
  const loadAllSections = useCallback(async () => {
    setLoadingAllSections(true);
    try {
      console.log('🔄 [STRATEGIK] Loading all sections from database...');
      const allSectionsData = await getAllSections();

      // Transform data untuk konsistensi
      const transformedAllSections = allSectionsData.map((section) => ({
        id: section.id,
        no: section.no || section.no_sec,
        parameter: section.parameter || section.nama_section,
        bobotSection: Number(section.bobotSection || section.bobot_par || 0),
        year: section.year,
        quarter: section.quarter,
      }));

      console.log('✅ [STRATEGIK] Total sections in database:', transformedAllSections.length);
      setAllSections(transformedAllSections);
    } catch (err) {
      console.error('❌ [STRATEGIK] Error loading all sections:', err);
    } finally {
      setLoadingAllSections(false);
    }
  }, [getAllSections]);

  // ====== Effects ======
  useEffect(() => {
    loadData();
    loadAllSections();
  }, [loadData, loadAllSections]);

  useEffect(() => {
    setSectionForm((prev) => ({
      ...prev,
      year: actualViewYear,
      quarter: actualViewQuarter,
    }));
  }, [actualViewYear, actualViewQuarter]);

  // Effect untuk auto-calculate
  useEffect(() => {
    if (sectionForm.id) {
      const hasil = computeHasil(indicatorForm);
      const weighted = computeWeightedAuto(indicatorForm, sectionForm.bobotSection);

      setIndicatorForm((prev) => ({
        ...prev,
        hasil: hasil !== '' ? hasil.toString() : '',
        weighted: weighted,
      }));
    }
  }, [indicatorForm.pembilangValue, indicatorForm.penyebutValue, indicatorForm.mode, indicatorForm.formula, indicatorForm.peringkat, indicatorForm.bobotIndikator, sectionForm.bobotSection]);

  // ====== Helper Functions untuk Sections ======
  // Helper untuk mendapatkan section yang unik
  const getUniqueSections = useMemo(() => {
    // Gabungkan sections yang sudah ada dengan semua sections
    const combinedSections = [...sections];

    // Tambahkan sections dari database yang belum ada di combined
    allSections.forEach((dbSection) => {
      const exists = combinedSections.some((s) => s.no === dbSection.no && s.parameter === dbSection.parameter);

      if (!exists) {
        combinedSections.push(dbSection);
      }
    });

    // Filter untuk mendapatkan section unik berdasarkan no dan nama
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

    // Urutkan berdasarkan nomor section
    return Array.from(uniqueMap.values()).sort((a, b) => {
      const numA = parseInt(a.no) || 0;
      const numB = parseInt(b.no) || 0;
      return numA - numB;
    });
  }, [sections, allSections]);

  // Helper untuk mendapatkan section yang belum digunakan di periode ini
  const getUnusedSections = useMemo(() => {
    // Section yang sudah dipakai di periode saat ini
    const usedSectionIds = sections.map((s) => s.id).filter(Boolean);

    // Filter semua section yang belum dipakai
    return getUniqueSections.filter((section) => !usedSectionIds.includes(section.id) || (!section.id && !sections.some((s) => s.no === section.no && s.parameter === section.name)));
  }, [sections, getUniqueSections]);

  // ====== Helper Functions ======
  const setIndicatorField = (field, value) => {
    setIndicatorForm((prev) => ({
      ...prev,
      [field]: value === null ? '' : value,
    }));
  };

  const selectSection = (id) => {
    const section = sections.find((s) => s.id === id);
    if (section) {
      setSectionForm({
        id: section.id,
        no: section.no || section.no_sec,
        bobotSection: section.bobotSection || section.bobot_par,
        parameter: section.parameter || section.nama_section,
        year: section.year || actualViewYear,
        quarter: section.quarter || actualViewQuarter,
      });
      setIsEditingSection(true);
      setIndicatorForm((prev) => ({
        ...prev,
        sectionId: Number(section.id),
      }));
    }
  };

  const resetSectionForm = () => {
    setSectionForm({
      id: null,
      no: '',
      bobotSection: 100,
      parameter: '',
      year: actualViewYear,
      quarter: actualViewQuarter,
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
    console.log('📝 [STRATEGIK EDIT] HandleEditIndicator:', indikator);

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
      keterangan: indikator.keterangan || '',
      isPercent: Boolean(indikator.isPercent),
      mode: indikator.mode || 'RASIO',
      formula: indikator.formula || '',
      // Data level risiko
      low: indikator.low || null,
      lowToModerate: indikator.lowToModerate || null,
      moderate: indikator.moderate || null,
      moderateToHigh: indikator.moderateToHigh || null,
      high: indikator.high || null,
      sectionId: sectionForm.id,
    };

    console.log('📝 [STRATEGIK EDIT] Setting form data:', formData);
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

    // Validasi untuk mode RASIO
    if (indicatorForm.mode === 'RASIO') {
      if (!indicatorForm.penyebutValue) {
        setLocalError('Nilai penyebut harus diisi untuk mode RASIO');
        return false;
      }
    }

    // Validasi untuk mode NILAI_TUNGGAL
    if (indicatorForm.mode === 'NILAI_TUNGGAL') {
      if (!indicatorForm.penyebutValue) {
        setLocalError('Nilai penyebut harus diisi untuk mode NILAI_TUNGGAL');
        return false;
      }
    }

    return true;
  };

  // ====== CRUD Operations ======
  const handleCreateSection = async () => {
    setLocalError(null);

    if (!validateSectionForm()) return;

    // Cek duplikasi
    const isDuplicate = sections.some((s) => s.year === actualViewYear && s.quarter === actualViewQuarter && s.no === sectionForm.no);

    if (isDuplicate) {
      setLocalError(`Section dengan nomor ${sectionForm.no} sudah ada untuk periode ${actualViewYear}-${actualViewQuarter}`);
      return;
    }

    setIsCreating(true);
    try {
      console.log('📤 [STRATEGIK] Creating section:', sectionForm);

      const sectionData = {
        ...transformSectionToBackend(sectionForm, actualViewYear, actualViewQuarter),
        year: Number(actualViewYear),
        quarter: actualViewQuarter,
      };

      console.log('📤 [STRATEGIK] Data untuk create section:', sectionData);

      await createSection(sectionData);

      resetSectionForm();
      await loadData();

      alert('✅ Section berhasil dibuat!');
    } catch (err) {
      console.error('❌ [STRATEGIK] Error creating section:', err);
      setLocalError(`Gagal membuat section: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateSection = async () => {
    setLocalError(null);
    if (!sectionForm.id) {
      setLocalError('Section ID tidak ditemukan');
      return;
    }

    if (!validateSectionForm()) return;

    setIsUpdating(true);
    try {
      const updateData = {
        no: sectionForm.no,
        parameter: sectionForm.parameter,
        bobotSection: Number(sectionForm.bobotSection),
      };

      await updateSection(sectionForm.id, updateData);

      resetSectionForm();
      await loadData();
      await loadAllSections();

      alert('✅ Section berhasil diupdate!');
    } catch (err) {
      setLocalError(`Gagal update section: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus section ini? Semua indikator dalam section ini juga akan dihapus.')) return;

    setIsDeleting(true);
    try {
      await deleteSection(sectionId);

      resetSectionForm();
      await loadData();
      await loadAllSections();

      alert('✅ Section berhasil dihapus!');
    } catch (err) {
      setLocalError(`Gagal menghapus section: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateIndicator = async () => {
    console.log('📤 [STRATEGIK] Creating indicator...');
    setLocalError(null);

    if (!validateIndicatorForm()) return;

    setIsCreating(true);
    try {
      console.log('🔧 [STRATEGIK] Transforming indicator data...');

      const selectedSection = sections.find((s) => s.id === sectionForm.id);
      if (!selectedSection) {
        throw new Error('Section tidak ditemukan. Silakan pilih atau buat section terlebih dahulu.');
      }

      const indicatorData = transformIndicatorToBackend(indicatorForm, actualViewYear, actualViewQuarter, sectionForm.id, selectedSection);

      console.log('📤 [STRATEGIK] Data untuk create:', indicatorData);

      // Validasi final sebelum kirim
      if (!indicatorData.indikator.trim()) {
        throw new Error('Nama indikator tidak boleh kosong');
      }

      if (!indicatorData.bobotIndikator || indicatorData.bobotIndikator <= 0) {
        throw new Error('Bobot indikator harus lebih dari 0');
      }

      await createIndikator(indicatorData);

      resetIndicatorForm();
      await loadData();

      console.log('✅ [STRATEGIK] Indicator created successfully');
      alert('✅ Indikator berhasil dibuat!');
    } catch (err) {
      console.error('❌ [STRATEGIK] Error creating indicator:', err);

      let errorMessage = 'Gagal membuat indikator';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setLocalError(`Gagal membuat indikator: ${errorMessage}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateIndicator = async () => {
    console.log('🔄 [STRATEGIK UPDATE] Starting update for indicator ID:', indicatorForm.id);

    if (!indicatorForm.id) {
      setLocalError('ID indikator tidak ditemukan');
      return;
    }

    // Validasi sederhana
    if (!indicatorForm.indikator?.trim()) {
      setLocalError('Nama indikator tidak boleh kosong');
      return;
    }

    setIsUpdating(true);
    setLocalError(null);

    try {
      const updateData = {
        indikator: indicatorForm.indikator.trim(),
        bobotIndikator: Number(indicatorForm.bobotIndikator) || 0,
        peringkat: Number(indicatorForm.peringkat) || 1,

        // Optional fields - handle null
        subNo: indicatorForm.subNo?.trim() || null,
        sumberRisiko: indicatorForm.sumberRisiko?.trim() || null,
        dampak: indicatorForm.dampak?.trim() || null,
        keterangan: indicatorForm.keterangan?.trim() || null,

        pembilangLabel: indicatorForm.pembilangLabel?.trim() || null,
        pembilangValue: indicatorForm.pembilangValue !== '' ? Number(indicatorForm.pembilangValue) : null,
        penyebutLabel: indicatorForm.penyebutLabel?.trim() || null,
        penyebutValue: indicatorForm.penyebutValue !== '' ? Number(indicatorForm.penyebutValue) : null,

        // Data level risiko
        low: indicatorForm.low?.trim() || null,
        lowToModerate: indicatorForm.lowToModerate?.trim() || null,
        moderate: indicatorForm.moderate?.trim() || null,
        moderateToHigh: indicatorForm.moderateToHigh?.trim() || null,
        high: indicatorForm.high?.trim() || null,

        isPercent: Boolean(indicatorForm.isPercent),
        mode: indicatorForm.mode || 'RASIO',
        formula: indicatorForm.formula?.trim() || null,
      };

      console.log('📤 [STRATEGIK UPDATE] Data untuk update:', updateData);

      await updateIndikator(indicatorForm.id, updateData);

      console.log('✅ [STRATEGIK UPDATE] API call successful');

      resetIndicatorForm();

      // Reload data
      setTimeout(async () => {
        console.log('🔄 [STRATEGIK UPDATE] Reloading data...');
        await loadData();
        console.log('✅ [STRATEGIK UPDATE] Data reloaded');

        alert('✅ Data berhasil diupdate!');
      }, 300);
    } catch (err) {
      console.error('❌ [STRATEGIK UPDATE] Error updating:', err);

      let errorMessage = 'Gagal update data';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setLocalError(`Update gagal: ${errorMessage}`);
      alert(`❌ ${errorMessage}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteIndicator = async (indikatorId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus indikator ini?')) return;

    setIsDeleting(true);
    try {
      await deleteIndikator(indikatorId);

      await loadData();
      alert('✅ Indikator berhasil dihapus!');
    } catch (err) {
      console.error('❌ Error deleting indicator:', err);

      let errorMessage = 'Terjadi kesalahan';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setLocalError(`Gagal menghapus indikator: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // ====== Export Function ======
  const handleExportStrategik = () => {
    const selectedSection = sections.find((s) => s.id === sectionForm.id) || sections[0];

    if (!selectedSection) {
      alert('Belum ada section untuk diexport.');
      return;
    }

    const rows = selectedSection.indikators || [];
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
          keterangan: transformed.keterangan,
        };
      });

      exportKPMRPasarToExcel({
        year: actualViewYear,
        quarter: actualViewQuarter,
        sectionNo: selectedSection.no || selectedSection.no_sec,
        sectionLabel: selectedSection.parameter || selectedSection.nama_section,
        bobotSection: selectedSection.bobotSection || selectedSection.bobot_par,
        rows: exportData,
      });

      alert('✅ Data berhasil diexport ke Excel!');
    } catch (err) {
      console.error('Gagal export Excel:', err);
      alert('Gagal melakukan export. Silakan coba lagi.');
    }
  };

  // ====== Memoized Values ======
  const filteredSections = useMemo(() => {
    const searchQuery = actualQuery || '';
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();

    return sections
      .map((s) => {
        const inds = s.indikators || [];
        const matchedIndicators = inds.filter((it) => {
          const indikatorText = it.indikator || '';
          const subNo = it.subNo || it.sub_no || '';
          const pembilangLabel = it.pembilangLabel || it.pembilang_label || '';
          const penyebutLabel = it.penyebutLabel || it.penyebut_label || '';
          const sumberRisiko = it.sumberRisiko || it.sumber_risiko || '';
          const dampak = it.dampak || '';
          const keterangan = it.keterangan || '';

          return `${subNo} ${indikatorText} ${pembilangLabel} ${penyebutLabel} ${sumberRisiko} ${dampak} ${keterangan}`.toLowerCase().includes(q);
        });

        const sectionName = s.parameter || s.nama_section || '';
        if (sectionName.toLowerCase().includes(q) || matchedIndicators.length > 0) {
          return { ...s, indikators: matchedIndicators.length ? matchedIndicators : inds };
        }
        return null;
      })
      .filter(Boolean);
  }, [sections, actualQuery]);

  const totalWeighted = useMemo(() => {
    return sections.reduce((sum, section) => {
      const inds = section.indikators || [];
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

    // jika checkbox persen aktif: tampilkan percent (raw * 100)
    if (indicatorForm.isPercent) {
      const pct = Number(raw) * 100;
      if (!isFinite(pct) || isNaN(pct)) return '';
      return `${pct.toFixed(2)}%`;
    }

    // formatting default:
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
        <h2 className="text-xl sm:text-2xl font-semibold">Form – Risiko Strategik</h2>
        <div className="flex items-center gap-3">
          {/* tahun + triwulan */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="sr-only">Tahun</label>
              <YearInput value={actualViewYear} onChange={actualSetViewYear} />
            </div>

            <div className="flex items-center gap-2">
              <label className="sr-only">Triwulan</label>
              <QuarterSelect value={actualViewQuarter} onChange={actualSetViewQuarter} />
            </div>
          </div>

          {/* group search + export */}
          <div className="flex items-center gap-2 transform -translate-y-1">
            <div className="relative">
              <input value={actualQuery} onChange={(e) => actualSetQuery(e.target.value)} placeholder="Cari no/sub/indikator…" className="pl-9 pr-3 py-2 rounded-xl border w-64" />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
            <button onClick={handleExportStrategik} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2" title="Export ke Excel">
              <Download size={16} />
              <span className="hidden sm:inline">Export Excel</span>
            </button>
          </div>
        </div>
      </header>

      {/* Error Display */}
      {(localError || error) && (
        <div className="mx-4 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {localError || error}
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
      {(loadingData || loading || isCreating || isUpdating || isDeleting || loadingAllSections) && (
        <div className="mx-4 mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          {loadingAllSections ? 'Memuat semua section...' : 'Memuat data...'}
        </div>
      )}

      {/* top toolbar with section */}
      <div className="relative rounded-2xl overflow-hidden mb-6 shadow-sm bg-gradient-to-r from-[#0076C6]/90 via-[#00A3DA]/90 to-[#33C2B5]/90">
        <div className="rounded-2xl border-2 border-gray-300 p-4 shadow-sm mb-6">
          <h2 className="text-white font-semibold text-lg sm:text-xl mb-6">Form Section – Strategik</h2>

          {/* Row untuk memilih section yang sudah ada */}
          <div className="mb-4">
            <label className="text-xs text-white font-medium mb-1 block">Pilih Section yang Sudah Ada</label>
            <div className="relative">
              <select
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 font-medium appearance-none bg-white cursor-pointer pr-10"
                value={sectionForm.id || ''}
                onChange={(e) => {
                  const selectedId = e.target.value ? Number(e.target.value) : null;
                  if (selectedId) {
                    // Cari section di semua data
                    const selectedSection = [...sections, ...allSections].find((s) => s.id === selectedId);
                    if (selectedSection) {
                      setSectionForm({
                        id: selectedSection.id,
                        no: selectedSection.no,
                        bobotSection: selectedSection.bobotSection,
                        parameter: selectedSection.parameter || selectedSection.name,
                        year: selectedSection.year || actualViewYear,
                        quarter: selectedSection.quarter || actualViewQuarter,
                      });
                      setIsEditingSection(true);
                      setIndicatorForm((prev) => ({
                        ...prev,
                        sectionId: Number(selectedSection.id),
                      }));
                    }
                  } else {
                    resetSectionForm();
                  }
                }}
                disabled={loadingAllSections}
              >
                <option value="">-- Pilih Section yang sudah ada --</option>

                {/* Section yang sudah ada di periode ini */}
                {sections.length > 0 && (
                  <optgroup label={`Section di periode ${actualViewYear}-${actualViewQuarter}`}>
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

            <div className="text-xs text-white/80 mt-1">
              Total tersedia: {getUniqueSections.length} section ({sections.length} di periode ini)
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
                placeholder="Uraian section risiko strategik"
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
                Bobot: {sectionForm.bobotSection}% | Periode: {actualViewYear}-{actualViewQuarter}
              </div>
            </div>
          )}

          {/* Warning jika section sudah ada */}
          {sections.some((s) => s.no === sectionForm.no && s.year === actualViewYear && s.quarter === actualViewQuarter) && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
              <div className="flex items-center gap-2 text-yellow-700">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">
                  Section ini sudah ada di periode {actualViewYear}-{actualViewQuarter}. Anda bisa memilihnya dari dropdown di atas.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* main body: indicator form */}
        {sectionForm.id && (
          <div className="rounded-xl border-2 border-gray-300 shadow-sm p-6 mb-6">
            <h3 className="text-white font-semibold text-lg mb-4">{isEditingIndicator ? 'Edit Indikator' : 'Tambah Indikator'}</h3>

            {/* Sub No & Indikator & Bobot Par Row */}
            <div className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-3">
                <label className="text-sm font-medium mb-2 block text-white">Sub No</label>
                <input className="w-full rounded-lg border-2 border-gray-300 px-3 py-3 text-sm bg-white" value={indicatorForm.subNo} onChange={(e) => setIndicatorField('subNo', e.target.value)} placeholder="6.1.1" />
              </div>
              <div className="col-span-6">
                <label className="text-sm font-medium mb-2 block text-white">Indikator</label>
                <input
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                  value={indicatorForm.indikator}
                  onChange={(e) => setIndicatorField('indikator', e.target.value)}
                  placeholder="Nama indikator strategik…"
                />
              </div>
              <div className="col-span-3">
                <label className="text-sm font-medium mb-2 block text-right text-white">Bobot Indikator (%)</label>
                <input
                  type="number"
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm text-right bg-white"
                  value={indicatorForm.bobotIndikator}
                  onChange={(e) => setIndicatorField('bobotIndikator', e.target.value)}
                  placeholder="50"
                />
              </div>
            </div>

            {/* Mode Perhitungan + Formula */}
            <div className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-4">
                <label className="text-sm font-medium mb-2 block text-white">Metode Perhitungan</label>
                <select className="w-full rounded-lg border-2 border-gray-300 px-3 py-3 text-sm bg-white" value={indicatorForm.mode} onChange={(e) => setIndicatorField('mode', e.target.value)}>
                  <option value="RASIO">Rasio (Pembilang / Penyebut)</option>
                  <option value="NILAI_TUNGGAL">Nilai tunggal (hanya penyebut)</option>
                </select>
              </div>

              <div className="col-span-8">
                <label className="text-sm font-medium mb-2 block text-white">Rumus perhitungan (opsional — kosong = pakai default)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                    placeholder={indicatorForm.mode === 'RASIO' ? 'Contoh default: pemb / peny  — atau rumus custom (pemb, peny)' : 'Contoh default: peny  — atau rumus custom (peny / 1000)'}
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
                <div className="text-xs text-white/80 mt-2">Aktifkan checkbox untuk mengubah hasil menjadi persentase (hasil × 100). Weighted tetap angka (bukan persen).</div>
              </div>
            </div>

            {/* Pembilang (hanya untuk RASIO) */}
            {indicatorForm.mode === 'RASIO' && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-white">Faktor Pembilang</label>
                  <input
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                    value={indicatorForm.pembilangLabel}
                    onChange={(e) => setIndicatorField('pembilangLabel', e.target.value)}
                    placeholder="Market share, revenue growth, dll."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-white">Nilai Pembilang</label>
                  <input className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white" value={indicatorForm.pembilangValue} onChange={(e) => setIndicatorField('pembilangValue', e.target.value)} placeholder="250" />
                </div>
              </div>
            )}

            {/* Penyebut (selalu ada) */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-white">Faktor Penyebut</label>
                <input
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                  value={indicatorForm.penyebutLabel}
                  onChange={(e) => setIndicatorField('penyebutLabel', e.target.value)}
                  placeholder={indicatorForm.mode === 'RASIO' ? 'Total market, total revenue, dll.' : 'Target, benchmark, dll.'}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-white">Nilai Penyebut</label>
                <input
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                  value={indicatorForm.penyebutValue}
                  onChange={(e) => setIndicatorField('penyebutValue', e.target.value)}
                  placeholder={indicatorForm.mode === 'RASIO' ? '10000' : '100'}
                />
              </div>
            </div>

            {/* Sumber risiko & dampak */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-white">Sumber Risiko</label>
                <textarea
                  rows={4}
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm resize-none bg-white"
                  value={indicatorForm.sumberRisiko}
                  onChange={(e) => setIndicatorField('sumberRisiko', e.target.value)}
                  placeholder="Contoh: perubahan pasar, kompetisi, teknologi, regulasi, dsb."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-white">Dampak</label>
                <textarea
                  rows={4}
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm resize-none bg-white"
                  value={indicatorForm.dampak}
                  onChange={(e) => setIndicatorField('dampak', e.target.value)}
                  placeholder="Contoh: penurunan market share, kehilangan keunggulan kompetitif, dsb."
                />
              </div>
            </div>

            {/* Level risiko (optional) */}
            <div className="grid grid-cols-5 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-white">Low</label>
                <input className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 text-sm bg-white" value={indicatorForm.low || ''} onChange={(e) => setIndicatorField('low', e.target.value)} placeholder="Low risk level" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-white">Low to Moderate</label>
                <input
                  className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 text-sm bg-white"
                  value={indicatorForm.lowToModerate || ''}
                  onChange={(e) => setIndicatorField('lowToModerate', e.target.value)}
                  placeholder="Low to moderate"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-white">Moderate</label>
                <input className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 text-sm bg-white" value={indicatorForm.moderate || ''} onChange={(e) => setIndicatorField('moderate', e.target.value)} placeholder="Moderate" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-white">Moderate to High</label>
                <input
                  className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 text-sm bg-white"
                  value={indicatorForm.moderateToHigh || ''}
                  onChange={(e) => setIndicatorField('moderateToHigh', e.target.value)}
                  placeholder="Moderate to high"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-white">High</label>
                <input className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 text-sm bg-white" value={indicatorForm.high || ''} onChange={(e) => setIndicatorField('high', e.target.value)} placeholder="High risk" />
              </div>
            </div>

            {/* Preview + peringkat + weighted */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6 flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium block text-white h-10 flex items-end">
                    Hasil Preview
                    {indicatorForm.mode === 'RASIO' ? ' (Pembilang / Penyebut)' : ' (Nilai Penyebut)'}
                  </label>
                  <input className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-gray-50" value={hasilPreview} readOnly />
                </div>

                <div className="flex-1">
                  <label className="text-sm font-medium block text-white h-10 flex items-end">Peringkat (1 - 5)</label>
                  <input type="number" min="1" max="5" className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white" value={indicatorForm.peringkat} onChange={(e) => setIndicatorField('peringkat', e.target.value)} />
                </div>

                <div className="flex-1">
                  <label className="text-sm font-medium block text-white h-10 flex items-end">Weighted (auto)</label>
                  <input className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-gray-50" value={weightedPreview.toFixed(2)} readOnly />
                </div>
              </div>
            </div>

            {/* Keterangan */}
            <div className="mt-4">
              <label className="text-sm font-medium mb-2 block text-white">Keterangan</label>
              <input className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white" value={indicatorForm.keterangan} onChange={(e) => setIndicatorField('keterangan', e.target.value)} placeholder="Keterangan tambahan" />
            </div>

            {/* Add/Save Button */}
            <div className="mt-6 flex justify-end">
              {!isEditingIndicator ? (
                <button onClick={handleCreateIndicator} disabled={isCreating} className="px-8 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold disabled:bg-gray-400">
                  {isCreating ? 'Menyimpan...' : '+ Tambah'}
                </button>
              ) : (
                <div className="flex gap-3">
                  <button onClick={handleUpdateIndicator} disabled={isUpdating} className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:bg-gray-400">
                    {isUpdating ? 'Menyimpan...' : 'Simpan'}
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
              <table className="min-w-[1300px] text-sm border border-gray-300 border-collapse">
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
                    <th className="border border-black px-3 py-2 bg-[#2e75b6] text-white" rowSpan={2} style={{ width: 100 }}>
                      Hasil
                    </th>
                    <th className="border border-black px-3 py-2 bg-[#2e75b6] text-white" rowSpan={2} style={{ width: 80 }}>
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
                    <th className="border border-black px-3 py-2 text-left" style={{ minWidth: 260 }}>
                      Indikator
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loadingData ? (
                    <tr>
                      <td className="border px-3 py-6 text-center text-gray-500" colSpan={12}>
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          Memuat data...
                        </div>
                      </td>
                    </tr>
                  ) : filteredSections.length === 0 ? (
                    <tr>
                      <td className="border px-3 py-6 text-center text-gray-500" colSpan={12}>
                        Belum ada data
                      </td>
                    </tr>
                  ) : (
                    filteredSections.map((s) => {
                      const inds = s.indikators || [];
                      if (!inds.length) {
                        return (
                          <tr key={s.id} className="bg-[#e9f5e1]">
                            <td className="border px-3 py-3 text-center">{s.no || s.no_sec}</td>
                            <td className="border px-3 py-3 text-center">{s.bobotSection || s.bobot_par}%</td>
                            <td className="border px-3 py-3" colSpan={10}>
                              {s.parameter || s.nama_section} – Belum ada indikator
                            </td>
                          </tr>
                        );
                      }

                      // Hitung sectionRowSpan
                      const sectionRowSpan = inds.reduce((acc, it) => {
                        const transformed = transformIndicatorToFrontend(it);
                        return acc + rowsPerIndicator(transformed);
                      }, 0);

                      return (
                        <React.Fragment key={s.id}>
                          {inds.map((it, idx) => {
                            const firstOfSection = idx === 0;
                            const transformed = transformIndicatorToFrontend(it);

                            const hasilDisplay = (() => {
                              const raw = transformed.hasil === '' || transformed.hasil == null ? computeHasil(transformed) : transformed.hasil;
                              if (raw === '' || raw == null) return '';
                              const num = Number(raw);
                              if (!isFinite(num) || isNaN(num)) return String(raw);

                              if (transformed.isPercent) {
                                const pct = num * 100;
                                return `${pct.toFixed(2)}%`;
                              }

                              if (transformed.mode === 'RASIO') {
                                return num.toFixed(4);
                              } else {
                                return '';
                              }
                            })();

                            const weightedDisplay =
                              typeof transformed.weighted === 'number' || (typeof transformed.weighted === 'string' && transformed.weighted !== '' && !isNaN(Number(transformed.weighted))) ? Number(transformed.weighted).toFixed(2) : '';

                            return (
                              <React.Fragment key={transformed.id}>
                                {/* BARIS UTAMA INDIKATOR */}
                                <tr>
                                  {firstOfSection && (
                                    <>
                                      <td rowSpan={sectionRowSpan} className="border px-3 py-3 align-top bg-[#d9eefb] text-center font-semibold">
                                        {s.no || s.no_sec}
                                      </td>
                                      <td rowSpan={sectionRowSpan} className="border px-3 py-3 align-top bg-[#d9eefb] text-center">
                                        {s.bobotSection || s.bobot_par}%
                                      </td>
                                      <td rowSpan={sectionRowSpan} className="border px-3 py-3 align-top bg-[#d9eefb]">
                                        {s.parameter || s.nama_section}
                                      </td>
                                    </>
                                  )}

                                  <td className="border px-3 py-3 text-center align-top bg-[#d9eefb]">{transformed.subNo}</td>
                                  <td className="border px-3 py-3 align-top bg-[#d9eefb]">
                                    <div className="font-medium">{transformed.indikator}</div>
                                  </td>

                                  <td className="border px-3 py-3 text-center align-top bg-[#d9eefb]">{transformed.bobotIndikator}%</td>

                                  <td className="border px-3 py-3 align-top bg-[#d9eefb]">{transformed.sumberRisiko}</td>
                                  <td className="border px-3 py-3 align-top bg-[#d9eefb]">{transformed.dampak}</td>

                                  <td className="border px-3 py-3 text-right">{hasilDisplay}</td>

                                  <td className="border px-3 py-3 text-center">
                                    <div style={{ minWidth: 36, minHeight: 24 }} className="inline-block rounded bg-yellow-300 px-2">
                                      {transformed.peringkat}
                                    </div>
                                  </td>

                                  <td className="border px-3 py-3 text-right">{weightedDisplay}</td>

                                  <td className="border px-3 py-3 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                      <button onClick={() => handleEditIndicator(it)} className="px-2 py-1 rounded border hover:bg-blue-50" title="Edit Indikator">
                                        <Edit3 size={14} />
                                      </button>
                                      <button onClick={() => handleDeleteIndicator(transformed.id)} className="px-2 py-1 rounded border text-red-600 hover:bg-red-50" title="Hapus Indikator">
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>

                                {/* BARIS PEMBILANG – hanya kalau mode RASIO */}
                                {transformed.mode === 'RASIO' && (
                                  <tr className="bg-white">
                                    <td className="border px-3 py-2 text-center"></td>
                                    <td className="border px-3 py-2">
                                      <div className="text-sm text-gray-700 mt-1">{transformed.pembilangLabel || '-'}</div>
                                    </td>
                                    <td className="border px-3 py-2 text-center"></td>
                                    <td className="border px-3 py-2" colSpan={2}></td>
                                    <td className="border px-3 py-2 bg-[#c6d9a7] text-right">{transformed.pembilangValue ? fmtNumber(transformed.pembilangValue) : ''}</td>
                                    <td className="border px-3 py-2" colSpan={3}></td>
                                  </tr>
                                )}

                                {/* BARIS PENYEBUT – selalu ada */}
                                <tr className="bg-white">
                                  <td className="border px-3 py-2 text-center"></td>
                                  <td className="border px-3 py-2">
                                    <div className="text-sm text-gray-700 mt-1">{transformed.penyebutLabel || '-'}</div>
                                  </td>
                                  <td className="border px-3 py-2 text-center"></td>
                                  <td className="border px-3 py-2" colSpan={2}></td>
                                  <td className="border px-3 py-2 bg-[#c6d9a7] text-right">{transformed.penyebutValue ? fmtNumber(transformed.penyebutValue) : ''}</td>
                                  <td className="border px-3 py-2" colSpan={3}></td>
                                </tr>
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
                    <td className="border border-gray-400" colSpan={8}></td>
                    <td className="border border-gray-400 text-white font-semibold text-center bg-[#0b3861]" colSpan={2}>
                      Summary
                    </td>
                    <td className="border border-gray-400 text-white font-semibold text-center bg-[#8fce00]">{Number(totalWeighted || 0).toFixed(2)}</td>
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
