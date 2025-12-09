import React, { useState, useMemo, useEffect } from 'react';
import { Download, Trash2, Edit3, Search, Plus, ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import { RiskField, YearInput, QuarterSelect } from '../components/Inputs.jsx';
import { exportKPMRPasarToExcel } from '../utils/excelexportpasar.jsx';
import { useAuditLog } from '../../../../audit-log/hooks/audit-log.hooks.js';
import { useAuth } from '../../../../../../auth/hooks/useAuth.hook.js';
import { usePasarCRUD } from '../hooks/pasar/pasar.hook.ts';

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

const formatHasilNumber = (value, maxDecimals = 4) => {
  if (value === '' || value == null) return '';
  const n = Number(value);
  if (!isFinite(n) || isNaN(n)) return '';
  const fixed = n.toFixed(maxDecimals);
  return fixed.replace(/\.?0+$/, '');
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

// Empty indicator dengan semua field yang diperlukan
const emptyIndicator = {
  id: null,
  nama_indikator: '',
  bobot_indikator: 0,
  sumber_risiko: '',
  dampak: '',
  pembilang_label: '',
  pembilang_value: 0,
  penyebut_label: '',
  penyebut_value: 0,
  low: '',
  low_to_moderate: '',
  moderate: '',
  moderate_to_high: '',
  high: '',
  peringkat: 1,
  weighted: 0,
  hasil: 0,
  keterangan: '',
  mode: 'RASIO',
  formula: '',
  is_percent: false,
  sectionId: null,
};

// PERBAIKAN: Transform functions untuk konversi data - DIPERBAIKI LAGI
const transformIndicatorToBackend = (indicatorData) => {
  console.log('🔧 Transform indicator data (original):', indicatorData);

  // Konversi semua nilai numerik dengan hati-hati
  const bobotIndikator = Number(indicatorData.bobot_indikator);
  const pembilangValue = indicatorData.pembilang_value !== undefined && indicatorData.pembilang_value !== null && indicatorData.pembilang_value !== '' ? Number(indicatorData.pembilang_value) : undefined;
  const penyebutValue = indicatorData.penyebut_value !== undefined && indicatorData.penyebut_value !== null && indicatorData.penyebut_value !== '' ? Number(indicatorData.penyebut_value) : undefined;
  const peringkat = Number(indicatorData.peringkat || 1);
  const hasil = Number(indicatorData.hasil || 0);
  const weighted = Number(indicatorData.weighted || 0);

  // Hanya kirim field yang diperlukan oleh backend
  const cleanData = {
    sectionId: Number(indicatorData.sectionId),
    nama_indikator: indicatorData.nama_indikator?.trim() || '',
    bobot_indikator: bobotIndikator,
    sumber_risiko: indicatorData.sumber_risiko?.trim() || '',
    dampak: indicatorData.dampak?.trim() || '',
    low: indicatorData.low?.trim() || '',
    low_to_moderate: indicatorData.low_to_moderate?.trim() || '',
    moderate: indicatorData.moderate?.trim() || '',
    moderate_to_high: indicatorData.moderate_to_high?.trim() || '',
    high: indicatorData.high?.trim() || '',
    peringkat: peringkat,
    hasil: hasil,
    weighted: weighted,
    mode: indicatorData.mode || 'RASIO',
    is_percent: Boolean(indicatorData.is_percent || false),
  };

  // Optional fields - hanya kirim jika ada value (jangan kirim null atau empty string)
  if (indicatorData.pembilang_label?.trim()) {
    cleanData.pembilang_label = indicatorData.pembilang_label.trim();
  }

  if (pembilangValue !== undefined) {
    cleanData.pembilang_value = pembilangValue;
  }

  if (indicatorData.penyebut_label?.trim()) {
    cleanData.penyebut_label = indicatorData.penyebut_label.trim();
  }

  if (penyebutValue !== undefined) {
    cleanData.penyebut_value = penyebutValue;
  }

  if (indicatorData.keterangan?.trim()) {
    cleanData.keterangan = indicatorData.keterangan.trim();
  }

  if (indicatorData.formula?.trim()) {
    cleanData.formula = indicatorData.formula.trim();
  }

  console.log('🔧 Cleaned indicator data untuk backend:', cleanData);
  return cleanData;
};

export default function Pasar() {
  // Periode & search
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewQuarter, setViewQuarter] = useState('Q1');
  const [query, setQuery] = useState('');

  // State untuk notifikasi
  const [notification, setNotification] = useState({
    type: '', // 'success' atau 'error'
    message: '',
    show: false,
  });

  // ====== Audit Log Integration ======
  const { user: authUser } = useAuth();
  const { logUpdate, logDelete, logExport, logCreate } = useAuditLog();

  // GUNAKAN HANYA usePasarCRUD
  const { sections, summary, loading, error: crudError, refetch, createSection, createIndikator, updateSection, updateIndikator, deleteSection, deleteIndikator, clearError } = usePasarCRUD(viewYear, viewQuarter);

  // State untuk form
  const [sectionForm, setSectionForm] = useState({
    id: null,
    no_sec: '',
    nama_section: '',
    bobot_par: 0,
    tahun: viewYear,
    triwulan: viewQuarter,
  });

  const [indicatorForm, setIndicatorForm] = useState({
    ...emptyIndicator,
    sectionId: null,
  });

  const [isEditingSection, setIsEditingSection] = useState(false);
  const [isEditingIndicator, setIsEditingIndicator] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ====== Fungsi untuk menampilkan notifikasi ======
  const showNotification = (type, message) => {
    setNotification({ type, message, show: true });

    // Auto hide setelah 4 detik
    setTimeout(() => {
      setNotification({ type: '', message: '', show: false });
    }, 4000);
  };

  const hideNotification = () => {
    setNotification({ type: '', message: '', show: false });
  };

  // ====== Fungsi Audit Log ======
  const handleAuditLog = async (action, description, isSuccess = true, metadata = {}) => {
    try {
      const userId = authUser?.user_id || authUser?.id;
      const auditData = {
        action,
        module: 'PASAR',
        description,
        isSuccess,
        userId: userId || null,
        metadata: {
          year: viewYear,
          quarter: viewQuarter,
          authUserId: userId,
          authUserAvailable: !!authUser,
          ...metadata,
        },
      };

      console.log('📝 [PASAR AUDIT] Audit data:', auditData);

      switch (action) {
        case 'CREATE':
          await logCreate('PASAR', description, {
            isSuccess,
            userId: userId || null,
            metadata: auditData.metadata,
          });
          break;
        case 'UPDATE':
          await logUpdate('PASAR', description, {
            isSuccess,
            userId: userId || null,
            metadata: auditData.metadata,
          });
          break;
        case 'DELETE':
          await logDelete('PASAR', description, {
            isSuccess,
            userId: userId || null,
            metadata: auditData.metadata,
          });
          break;
        case 'EXPORT':
          await logExport('PASAR', description, {
            isSuccess,
            userId: userId || null,
            metadata: auditData.metadata,
          });
          break;
        default:
          break;
      }

      console.log('✅ [PASAR AUDIT] Audit logged successfully');
    } catch (error) {
      console.error('❌ [PASAR AUDIT] Audit failed:', error);
    }
  };

  // Filter sections berdasarkan query
  const filteredSections = useMemo(() => {
    if (!query.trim()) return sections;
    const q = query.toLowerCase();
    return sections
      .map((s) => {
        const matchedIndicators = s.indikators?.filter((it) => {
          return `${it.nama_indikator} ${it.pembilang_label} ${it.penyebut_label} ${it.sumber_risiko} ${it.dampak} ${it.keterangan}`.toLowerCase().includes(q);
        });
        if (s.nama_section.toLowerCase().includes(q) || matchedIndicators?.length > 0) {
          return { ...s, indikators: matchedIndicators?.length ? matchedIndicators : s.indikators };
        }
        return null;
      })
      .filter(Boolean);
  }, [sections, query]);

  // Total weighted dari summary
  const totalWeighted = useMemo(() => {
    return summary?.total_weighted || 0;
  }, [summary]);

  useEffect(() => {
    setSectionForm((prev) => ({
      ...prev,
      tahun: viewYear,
      triwulan: viewQuarter,
    }));
  }, [viewYear, viewQuarter]);

  useEffect(() => {
    if (error) setError(null);
  }, [sectionForm, indicatorForm]);

  function selectSection(id) {
    const section = sections.find((s) => s.id === id);
    if (section) {
      setSectionForm({
        id: section.id,
        no_sec: section.no_sec,
        nama_section: section.nama_section,
        bobot_par: section.bobot_par,
        tahun: section.tahun,
        triwulan: section.triwulan,
      });
      setIsEditingSection(true);
      setIndicatorForm((prev) => ({
        ...prev,
        sectionId: Number(section.id),
      }));
    }
  }

  function resetSectionForm() {
    setSectionForm({
      id: null,
      no_sec: '',
      nama_section: '',
      bobot_par: 0,
      tahun: viewYear,
      triwulan: viewQuarter,
    });
    setIsEditingSection(false);
    setIndicatorForm((prev) => ({ ...prev, sectionId: null }));
  }

  // PERBAIKAN: Fungsi handleCreateSection dengan debugging dan notifikasi
  async function handleCreateSection() {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    console.log('🔄 handleCreateSection called with:', sectionForm);

    // Validasi sesuai entity
    if (!sectionForm.no_sec || sectionForm.no_sec.trim() === '') {
      setError('No Section harus diisi');
      setIsSubmitting(false);
      return;
    }

    if (!sectionForm.nama_section || sectionForm.nama_section.trim() === '') {
      setError('Nama Section harus diisi');
      setIsSubmitting(false);
      return;
    }

    const bobotPar = parseFloat(sectionForm.bobot_par);
    if (isNaN(bobotPar) || bobotPar < 0.01 || bobotPar > 100) {
      setError('Bobot Section harus antara 0.01 dan 100');
      setIsSubmitting(false);
      return;
    }

    // Data HARUS PERSIS seperti di entity
    const sectionData = {
      no_sec: sectionForm.no_sec.trim(), // varchar(10)
      nama_section: sectionForm.nama_section.trim(), // text
      bobot_par: bobotPar, // decimal(5,2)
      tahun: viewYear, // integer
      triwulan: viewQuarter, // enum: 'Q1','Q2','Q3','Q4'
    };

    console.log('📤 Data section (SNAKE_CASE - sesuai entity):', sectionData);

    try {
      await createSection(sectionData, {
        onSuccess: () => {
          console.log('✅ Section created successfully');
          showNotification('success', `✅ Section "${sectionForm.no_sec}" berhasil ditambahkan`);
          handleAuditLog('CREATE', `Menambahkan section pasar - No: ${sectionForm.no_sec}`, true);
          resetSectionForm();
        },
        onError: (error) => {
          console.error('❌ Error in createSection:', error);
          console.error('❌ Error response data:', error.response?.data);

          // Debug lebih detail
          if (error.response?.data?.errors) {
            console.error('❌ Validation errors:', error.response.data.errors);
          }

          const errorMessage = error.response?.data?.message || error.message || 'Terjadi kesalahan';
          showNotification('error', `❌ Gagal membuat section: ${errorMessage}`);
          setError(`Gagal membuat section: ${errorMessage}`);
        },
      });
    } catch (err) {
      console.error('❌ Unexpected error:', err);
      showNotification('error', '❌ Terjadi kesalahan tak terduga');
      setError('Terjadi kesalahan tak terduga');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateSection() {
    if (isSubmitting || !sectionForm.id) return;

    setIsSubmitting(true);
    setError(null);

    // Validasi sesuai entity
    if (!sectionForm.no_sec || sectionForm.no_sec.trim() === '') {
      setError('No Section harus diisi');
      setIsSubmitting(false);
      return;
    }

    if (!sectionForm.nama_section || sectionForm.nama_section.trim() === '') {
      setError('Nama Section harus diisi');
      setIsSubmitting(false);
      return;
    }

    const bobotPar = parseFloat(sectionForm.bobot_par);
    if (isNaN(bobotPar) || bobotPar < 0.01 || bobotPar > 100) {
      setError('Bobot Section harus antara 0.01 dan 100');
      setIsSubmitting(false);
      return;
    }

    // Data update - SNAKE_CASE sesuai entity
    const updateData = {
      no_sec: sectionForm.no_sec.trim(),
      nama_section: sectionForm.nama_section.trim(),
      bobot_par: bobotPar,
    };

    console.log('📤 Data update section (SNAKE_CASE):', updateData);

    try {
      await updateSection(
        { id: sectionForm.id, data: updateData },
        {
          onSuccess: () => {
            showNotification('success', `✅ Section "${sectionForm.no_sec}" berhasil diperbarui`);
            handleAuditLog('UPDATE', `Mengupdate section pasar - No: ${sectionForm.no_sec}`, true);
            resetSectionForm();
          },
          onError: (error) => {
            console.error('❌ Update section error:', error.response?.data);
            const errorMessage = error.response?.data?.message || error.message || 'Terjadi kesalahan';
            showNotification('error', `❌ Gagal update section: ${errorMessage}`);
            setError(`Gagal update section: ${errorMessage}`);
          },
        }
      );
    } catch (err) {
      showNotification('error', '❌ Terjadi kesalahan tak terduga');
      setError('Terjadi kesalahan tak terduga');
    } finally {
      setIsSubmitting(false);
    }
  }

  // PERBAIKAN: Fungsi handleDeleteSection dengan notifikasi
  async function handleDeleteSection(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus section ini? Semua indikator dalam section ini juga akan dihapus.')) return;

    const sectionToDelete = sections.find((s) => s.id === id);

    try {
      await deleteSection(id, {
        onSuccess: () => {
          showNotification('success', `✅ Section "${sectionToDelete?.no_sec}" berhasil dihapus`);
          handleAuditLog('DELETE', `Menghapus section pasar - No: ${sectionToDelete?.no_sec}, Nama: "${sectionToDelete?.nama_section}"`, true, {
            section_id: id,
            section_no: sectionToDelete?.no_sec,
            section_name: sectionToDelete?.nama_section,
            total_indicators: sectionToDelete?.indikators?.length || 0,
          });

          resetSectionForm();
        },
        onError: (error) => {
          const errorMessage = error?.message || 'Terjadi kesalahan';
          showNotification('error', `❌ Gagal menghapus section: ${errorMessage}`);
          handleAuditLog('DELETE', `Gagal menghapus section pasar - No: ${sectionToDelete?.no_sec}, Nama: "${sectionToDelete?.nama_section}"`, false, {
            section_id: id,
            section_no: sectionToDelete?.no_sec,
            section_name: sectionToDelete?.nama_section,
            error: errorMessage,
          });
          setError(`Gagal menghapus section: ${errorMessage}`);
        },
      });
    } catch (err) {
      showNotification('error', '❌ Terjadi kesalahan tak terduga');
      setError('Terjadi kesalahan tak terduga');
    }
  }

  // Handler untuk indicator
  function setIndicatorField(field, value) {
    setIndicatorForm((prev) => ({ ...prev, [field]: value }));
  }

  function resetIndicatorForm() {
    setIndicatorForm({
      ...emptyIndicator,
      sectionId: sectionForm.id,
    });
    setIsEditingIndicator(false);
  }

  // ----- perhitungan hasil & weighted -----
  const computeHasil = (ind) => {
    const mode = ind.mode || 'RASIO';
    const pemb = parseNum(ind.pembilang_value);
    const peny = parseNum(ind.penyebut_value);

    if (ind.formula && ind.formula.trim() !== '') {
      try {
        const expr = ind.formula.replace(/\bpemb\b/g, 'pemb').replace(/\bpeny\b/g, 'peny');
        const fn = new Function('pemb', 'peny', `return (${expr});`);
        const res = fn(pemb, peny);
        if (!isFinite(res) || isNaN(res)) return 0;
        return Number(res);
      } catch (e) {
        console.warn('Invalid formula (Pasar):', ind.formula, e);
        return 0;
      }
    }

    if (mode === 'NILAI_TUNGGAL') {
      return peny;
    }

    if (peny === 0) return 0;
    const result = pemb / peny;
    if (!isFinite(result) || isNaN(result)) return 0;
    return Number(result);
  };

  function computeWeightedAuto(ind, sectionBobot) {
    const sectionB = Number(sectionBobot || 0);
    const bobotInd = Number(ind.bobot_indikator || 0);
    const peringkat = Number(ind.peringkat || 0);
    const res = (sectionB * bobotInd * peringkat) / 10000;
    if (!isFinite(res) || isNaN(res)) return 0;
    return res;
  }

  // PERBAIKAN BESAR: Fungsi handleCreateIndicator dengan validasi lebih ketat dan notifikasi
  async function handleCreateIndicator() {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    console.log('🔄 handleCreateIndicator called with sectionForm:', sectionForm);
    console.log('🔄 indicatorForm data:', indicatorForm);

    // **DEBUG: Cek apakah nama_indikator ada**
    console.log('🔍 DEBUG - nama_indikator:', {
      value: indicatorForm.nama_indikator,
      trimmed: indicatorForm.nama_indikator?.trim(),
      length: indicatorForm.nama_indikator?.length,
      isTruthy: !!indicatorForm.nama_indikator,
    });

    // **PERBAIKAN: Hapus validasi frontend atau minimalisir**
    // Biarkan backend yang handle validasi lengkap

    if (!sectionForm.id || isNaN(Number(sectionForm.id))) {
      setError('Pilih section terlebih dahulu');
      setIsSubmitting(false);
      return;
    }

    // **VALIDASI MINIMAL SAJA:**
    if (!indicatorForm.nama_indikator?.trim()) {
      setError('Nama Indikator harus diisi');
      setIsSubmitting(false);
      return;
    }

    // Hitung hasil dan weighted
    const hasil = computeHasil(indicatorForm);
    const weighted = computeWeightedAuto(indicatorForm, sectionForm.bobot_par);

    // **PERBAIKAN: Pastikan data sudah clean sebelum dikirim ke hook**
    const createData = transformIndicatorToBackend({
      ...indicatorForm,
      sectionId: sectionForm.id,
      hasil: hasil || 0,
      weighted: weighted || 0,
    });

    console.log('📤 Data untuk createIndikator:', JSON.stringify(createData, null, 2));

    // **Cek khusus nama_indikator**
    console.log('✅ Nama indikator dalam createData:', {
      exists: !!createData.nama_indikator,
      value: createData.nama_indikator,
      trimmed: createData.nama_indikator?.trim(),
      isEmpty: createData.nama_indikator?.trim() === '',
    });

    try {
      await createIndikator(createData, {
        onSuccess: () => {
          console.log('✅ Indicator created successfully');
          showNotification('success', `✅ Indikator "${indicatorForm.nama_indikator}" berhasil ditambahkan`);
          handleAuditLog('CREATE', `Menambahkan indikator pasar - "${indicatorForm.nama_indikator}"`, true);
          resetIndicatorForm();
        },
        onError: (error) => {
          console.error('❌ Error in createIndikator:', error);
          console.error('❌ Full error object:', JSON.stringify(error, null, 2));

          // **PERBAIKAN: Tangani error dengan lebih spesifik**
          let errorMessage = 'Terjadi kesalahan';

          // Jika error dari backend validation
          if (error.response?.data?.message) {
            // Handle array atau string
            if (Array.isArray(error.response.data.message)) {
              errorMessage = error.response.data.message.join(', ');
            } else {
              errorMessage = error.response.data.message;
            }
          } else if (error.message) {
            errorMessage = error.message;
          }

          // Jika error adalah "Nama Indikator harus diisi", cek datanya
          if (errorMessage.includes('Nama Indikator')) {
            console.error('🔍 Data yang dikirim ke backend:', createData);
            console.error('🔍 nama_indikator value:', createData.nama_indikator);
          }

          showNotification('error', `❌ Gagal membuat indikator: ${errorMessage}`);
          setError(`Gagal membuat indikator: ${errorMessage}`);
        },
      });
    } catch (err) {
      console.error('❌ Unexpected error:', err);
      showNotification('error', '❌ Terjadi kesalahan tak terduga');
      setError('Terjadi kesalahan tak terduga');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEditIndicator(indikator) {
    setIndicatorForm({
      id: indikator.id,
      nama_indikator: indikator.nama_indikator || '',
      bobot_indikator: indikator.bobot_indikator || 0,
      sumber_risiko: indikator.sumber_risiko || '',
      dampak: indikator.dampak || '',
      pembilang_label: indikator.pembilang_label || '',
      pembilang_value: indikator.pembilang_value || 0,
      penyebut_label: indikator.penyebut_label || '',
      penyebut_value: indikator.penyebut_value || 0,
      low: indikator.low || '',
      low_to_moderate: indikator.low_to_moderate || '',
      moderate: indikator.moderate || '',
      moderate_to_high: indikator.moderate_to_high || '',
      high: indikator.high || '',
      peringkat: indikator.peringkat || 1,
      weighted: indikator.weighted || 0,
      hasil: indikator.hasil || 0,
      keterangan: indikator.keterangan || '',
      mode: indikator.mode || 'RASIO',
      formula: indikator.formula || '',
      is_percent: indikator.is_percent || false,
      sectionId: sectionForm.id,
    });
    setIsEditingIndicator(true);
  }

  // PERBAIKAN BESAR: Fungsi handleUpdateIndicator dengan validasi lebih ketat dan notifikasi
  async function handleUpdateIndicator() {
    if (isSubmitting || !indicatorForm.id) return;

    setIsSubmitting(true);
    setError(null);

    console.log('🔍 DEBUG - indicatorForm.id:', {
      id: indicatorForm.id,
      type: typeof indicatorForm.id,
      isNumber: typeof indicatorForm.id === 'number',
      value: indicatorForm.id,
    });

    // Validasi minimal
    if (!indicatorForm.nama_indikator?.trim()) {
      setError('Nama Indikator harus diisi');
      setIsSubmitting(false);
      return;
    }

    const hasil = computeHasil(indicatorForm);
    const weighted = computeWeightedAuto(indicatorForm, sectionForm.bobot_par);

    // PERBAIKAN: Pastikan ID adalah number
    const updateData = transformIndicatorToBackend({
      ...indicatorForm,
      sectionId: sectionForm.id,
      hasil: hasil || 0,
      weighted: weighted || 0,
    });

    console.log('📤 Data update indikator:', updateData);
    console.log('🔢 ID yang akan dikirim:', {
      id: indicatorForm.id,
      converted: Number(indicatorForm.id),
    });

    try {
      // ===== PERBAIKAN UTAMA =====
      // Hook mengharapkan: updateIndikator(id, data, options)
      // BUKAN: updateIndikator({id, data}, options)

      const indicatorId = Number(indicatorForm.id);

      console.log('🚀 Calling updateIndikator with:', {
        id: indicatorId,
        data: updateData,
      });

      // PERBAIKAN: Panggil dengan parameter yang benar
      await updateIndikator(
        indicatorId, // Parameter 1: id (number)
        updateData, // Parameter 2: data
        {
          // Parameter 3: options (callback)
          onSuccess: () => {
            console.log('✅ Indicator updated successfully');
            showNotification('success', `✅ Indikator "${indicatorForm.nama_indikator}" berhasil diperbarui`);
            handleAuditLog('UPDATE', `Mengupdate indikator pasar - "${indicatorForm.nama_indikator}"`, true);
            resetIndicatorForm();
          },
          onError: (error) => {
            console.error('❌ Update indikator error (from callback):', error);
            console.error('❌ Error details:', error.response?.data || error.message);

            // PERBAIKAN: Ambil pesan error yang lebih spesifik
            let errorMessage = error.message || 'Terjadi kesalahan';
            if (error.response?.data?.message) {
              errorMessage = error.response.data.message;
            }

            showNotification('error', `❌ Gagal update indikator: ${errorMessage}`);
            setError(`Gagal update indikator: ${errorMessage}`);
          },
        }
      );
    } catch (err) {
      // PERBAIKAN: Error handling jika promise reject
      console.error('❌ Update indikator error (from catch):', err);

      let errorMessage = err.message || 'Terjadi kesalahan tak terduga';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      showNotification('error', `❌ Gagal update indikator: ${errorMessage}`);
      setError(`Gagal update indikator: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  // PERBAIKAN: Fungsi handleDeleteIndicator dengan notifikasi
  async function handleDeleteIndicator(indikatorId) {
    if (!confirm('Apakah Anda yakin ingin menghapus indikator ini?')) return;

    const indicatorToDelete = sections.flatMap((s) => s.indikators || []).find((it) => it.id === indikatorId);

    try {
      await deleteIndikator(indikatorId, {
        onSuccess: () => {
          showNotification('success', `✅ Indikator "${indicatorToDelete?.nama_indikator}" berhasil dihapus`);
          handleAuditLog('DELETE', `Menghapus indikator pasar - "${indicatorToDelete?.nama_indikator}"`, true, {
            indicator_id: indikatorId,
            section_id: sectionForm.id,
            section_no: sectionForm.no_sec,
            indicator_name: indicatorToDelete?.nama_indikator,
          });
        },
        onError: (error) => {
          const errorMessage = error?.message || 'Terjadi kesalahan';
          showNotification('error', `❌ Gagal menghapus indikator: ${errorMessage}`);
          handleAuditLog('DELETE', `Gagal menghapus indikator pasar - "${indicatorToDelete?.nama_indikator}"`, false, {
            indicator_id: indikatorId,
            section_id: sectionForm.id,
            section_no: sectionForm.no_sec,
            indicator_name: indicatorToDelete?.nama_indikator,
            error: errorMessage,
          });
          setError(`Gagal menghapus indikator: ${errorMessage}`);
        },
      });
    } catch (err) {
      showNotification('error', '❌ Terjadi kesalahan tak terduga');
      setError('Terjadi kesalahan tak terduga');
    }
  }

  // Export function dengan audit log dan notifikasi
  function handleExportPasar() {
    const selectedSection = sections.find((s) => s.id === sectionForm.id) || sections[0];

    if (!selectedSection) {
      showNotification('error', '❌ Belum ada section untuk diexport');
      return;
    }

    const rows = selectedSection.indikators || [];
    if (!rows.length) {
      showNotification('error', '❌ Section ini belum punya indikator untuk diexport');
      return;
    }

    try {
      const exportData = rows.map((indikator) => ({
        indikator: indikator.nama_indikator,
        bobotIndikator: indikator.bobot_indikator,
        sumberRisiko: indikator.sumber_risiko,
        dampak: indikator.dampak,
        pembilangLabel: indikator.pembilang_label,
        pembilangValue: indikator.pembilang_value,
        penyebutLabel: indikator.penyebut_label,
        penyebutValue: indikator.penyebut_value,
        low: indikator.low,
        lowToModerate: indikator.low_to_moderate,
        moderate: indikator.moderate,
        moderateToHigh: indikator.moderate_to_high,
        high: indikator.high,
        peringkat: indikator.peringkat,
        weighted: indikator.weighted,
        hasil: indikator.hasil,
        keterangan: indikator.keterangan,
      }));

      handleAuditLog('EXPORT', `Export data Excel pasar - Periode: ${viewYear}-${viewQuarter}, Section: ${selectedSection.no_sec}, Jumlah Data: ${rows.length}`, true, {
        year: viewYear,
        quarter: viewQuarter,
        section_id: selectedSection.id,
        section_no: selectedSection.no_sec,
        section_name: selectedSection.nama_section,
        total_records: rows.length,
        file_type: 'excel',
      });

      showNotification('success', `✅ Data berhasil diexport (${rows.length} indikator)`);

      exportKPMRPasarToExcel({
        year: viewYear,
        quarter: viewQuarter,
        sectionNo: selectedSection.no_sec,
        sectionLabel: selectedSection.nama_section,
        bobotSection: selectedSection.bobot_par,
        rows: exportData,
      });
    } catch (err) {
      showNotification('error', '❌ Gagal melakukan export. Silakan coba lagi.');
      handleAuditLog('EXPORT', `Gagal export data Excel pasar - Periode: ${viewYear}-${viewQuarter}`, false, {
        year: viewYear,
        quarter: viewQuarter,
        section_id: selectedSection?.id,
        section_no: selectedSection?.no_sec,
        error: err.message,
      });
      console.error('Gagal export Excel:', err);
    }
  }

  const rowsPerIndicator = 3;

  // Clear error handler
  useEffect(() => {
    if (error || crudError) {
      const timer = setTimeout(() => {
        setError(null);
        clearError?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, crudError, clearError]);

  // ==================== RENDER ====================
  return (
    <div className="  min-h-screen">
      {/* HERO */}

      <div className="bg-white rounded-2xl shadow-md p-6">
        {/* NOTIFICATION AREA - Posisi optimal setelah header */}
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

        <header className="px-4 py-4 flex items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-semibold">Form – Pasar</h2>
          <div className="flex items-end gap-4">
            {/* tahun + triwulan */}
            <div className="hidden md:flex items-end gap-4">
              <div className="flex flex-col gap-1">
                <YearInput value={viewYear} onChange={(v) => setViewYear(v)} />
              </div>
              <div className="flex flex-col gap-1">
                <QuarterSelect value={viewQuarter} onChange={(v) => setViewQuarter(v)} />
              </div>
            </div>

            {/* search + export */}
            <div className="flex items-end gap-2">
              <div className="relative">
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari no/sub/indikator…" className="pl-9 pr-3 py-2 rounded-xl border w-64" />
                <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              <button onClick={handleExportPasar} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-gray-900 text-white hover:bg-black" disabled={sections.length === 0}>
                <Download size={18} /> Export {viewYear}-{viewQuarter}
              </button>
            </div>
          </div>
        </header>

        {/* Error Display */}
        {(error || crudError) && (
          <div className="mx-4 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              <span>{error || crudError}</span>
            </div>
            <button
              onClick={() => {
                setError(null);
                clearError?.();
              }}
              className="text-red-700 hover:text-red-900"
            >
              ✕
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="mx-4 mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            Memuat data...
          </div>
        )}

        {/* top toolbar with section */}
        <div className="relative rounded-2xl overflow-hidden mb-6 shadow-sm bg-gradient-to-r from-[#0076C6]/90 via-[#00A3DA]/90 to-[#33C2B5]/90">
          <div className="rounded-2xl border-2 border-gray-300 p-4 shadow-sm mb-6">
            <h2 className="text-white font-semibold text-lg sm:text-xl mb-6">Form Pasar</h2>

            {/* Row with No Sec | Bobot Sec | Section | Buttons */}
            <div className="flex items-end gap-4 mb-4">
              {/* No Sec */}
              <div className="flex flex-col">
                <label className="text-xs text-white font-medium mb-1">No Sec</label>
                <input
                  className="w-20 h-10 px-3 rounded-lg border-2 border-gray-300 text-center font-medium bg-white"
                  value={sectionForm.no_sec}
                  onChange={(e) => setSectionForm((f) => ({ ...f, no_sec: e.target.value }))}
                  placeholder="2.1"
                />
              </div>

              {/* Bobot Sec */}
              <div className="flex flex-col">
                <label className="text-xs text-white font-medium mb-1">Bobot Par</label>
                <input
                  type="number"
                  className="w-28 h-10 px-3 rounded-lg border-2 border-gray-300 text-center font-medium bg-white"
                  value={sectionForm.bobot_par ?? ''}
                  onChange={(e) => setSectionForm((f) => ({ ...f, bobot_par: e.target.value }))}
                  min="0.01"
                  max="100"
                  step="0.01"
                />
              </div>

              {/* Section (flex-grow) */}
              <div className="flex-1 flex flex-col">
                <label className="text-xs text-white font-medium mb-1">Section</label>
                <input
                  className="w-full h-10 px-4 rounded-lg border-2 border-gray-300 font-medium bg-white"
                  value={sectionForm.nama_section}
                  onChange={(e) => setSectionForm((f) => ({ ...f, nama_section: e.target.value }))}
                  placeholder="Volume dan Komposisi Portfolio Asset dan liabilitas yang terekspos risiko pasar"
                />
              </div>

              {/* Buttons (align to bottom of inputs) */}
              <div className="flex gap-2 self-end">
                {!isEditingSection ? (
                  <button
                    className="w-10 h-10 rounded-lg bg-green-500 hover:bg-green-600 text-white flex items-center justify-center disabled:bg-gray-400 transition-colors"
                    onClick={handleCreateSection}
                    disabled={loading || isSubmitting}
                    title="Tambah Section"
                  >
                    {loading || isSubmitting ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Plus size={20} />}
                  </button>
                ) : (
                  <>
                    <button
                      className="w-10 h-10 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center disabled:bg-gray-400 transition-colors"
                      onClick={handleUpdateSection}
                      disabled={loading || isSubmitting}
                      title="Update Section"
                    >
                      {loading || isSubmitting ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Edit3 size={20} />}
                    </button>
                    <button className="w-10 h-10 rounded-lg bg-gray-500 hover:bg-gray-600 text-white flex items-center justify-center transition-colors" onClick={resetSectionForm} title="Batal">
                      ✕
                    </button>
                  </>
                )}
                {isEditingSection && (
                  <button
                    className="w-10 h-10 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center disabled:bg-gray-400 transition-colors"
                    onClick={() => handleDeleteSection(sectionForm.id)}
                    disabled={loading || isSubmitting}
                    title="Hapus Section"
                  >
                    {loading || isSubmitting ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Trash2 size={20} />}
                  </button>
                )}
              </div>
            </div>

            {/* Section Dropdown */}
            <div className="relative">
              <label className="text-xs text-white font-medium mb-1 block">Pilih Section</label>
              <select
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 font-medium appearance-none bg-white cursor-pointer pr-10 transition-colors hover:border-gray-400"
                value={sectionForm.id || ''}
                onChange={(e) => {
                  const selectedId = e.target.value ? Number(e.target.value) : null;
                  if (selectedId) {
                    selectSection(selectedId);
                  } else {
                    resetSectionForm();
                  }
                }}
              >
                <option value="">-- Pilih Section --</option>
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.no_sec} - {s.nama_section}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-9 pointer-events-none text-gray-400" size={20} />
            </div>
          </div>

          {/* main body: indicator form - Hanya tampil jika section dipilih */}
          {sectionForm.id && (
            <div className="rounded-xl border-2 border-gray-300 shadow-sm p-6 mb-6">
              <h3 className="text-white font-semibold text-lg mb-4">Tambah Indikator</h3>

              {/* Indikator & Bobot Par Row */}
              <div className="grid grid-cols-12 gap-4 mb-4">
                <div className="col-span-9">
                  <label className="text-sm font-medium mb-2 block text-white">Indikator</label>
                  <input
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none"
                    value={indicatorForm.nama_indikator}
                    onChange={(e) => setIndicatorField('nama_indikator', e.target.value)}
                    placeholder="Frekuensi pencairan dengan nilai pencairan > 100 Milyar/nasabah dalam waktu singkat..."
                    required
                  />
                </div>
                <div className="col-span-3">
                  <label className="text-sm font-medium mb-2 block text-right text-white">Bobot Indikator</label>
                  <input
                    type="number"
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm text-right bg-white transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none"
                    value={indicatorForm.bobot_indikator}
                    onChange={(e) => setIndicatorField('bobot_indikator', e.target.value)}
                    placeholder="50"
                    min="0.01"
                    max="100"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              {/* Metode Penghitungan + Rumus */}
              <div className="grid grid-cols-12 gap-4 mb-4">
                <div className="col-span-4">
                  <label className="text-sm font-medium mb-2 block text-white">Metode Penghitungan</label>
                  <select
                    className="w-full rounded-lg border-2 border-gray-300 px-3 py-3 text-sm bg-white transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none"
                    value={indicatorForm.mode || 'RASIO'}
                    onChange={(e) => {
                      const v = e.target.value;
                      setIndicatorField('mode', v);
                    }}
                  >
                    <option value="RASIO">Rasio (Pembilang / Penyebut)</option>
                    <option value="NILAI_TUNGGAL">Nilai tunggal (hanya penyebut)</option>
                  </select>
                </div>

                <div className="col-span-8">
                  <label className="text-sm font-medium mb-2 block text-white">
                    Rumus Parameter (opsional) &nbsp;
                    <span className="text-xs">
                      gunakan variabel <b>pemb</b> dan <b>peny</b>
                    </span>
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none"
                      placeholder={indicatorForm.mode === 'NILAI_TUNGGAL' ? 'Contoh: peny / 1000' : 'Contoh: peny / pemb'}
                      value={indicatorForm.formula || ''}
                      onChange={(e) => setIndicatorField('formula', e.target.value)}
                    />
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={indicatorForm.is_percent || false}
                        onChange={(e) => setIndicatorField('is_percent', e.target.checked)}
                        className="w-6 h-6 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
                      />
                      <div
                        className="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-gray-300 bg-gray-100 text-lg font-bold cursor-pointer transition-colors hover:bg-gray-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIndicatorField('is_percent', !indicatorForm.is_percent);
                        }}
                      >
                        %
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Faktor Pembilang & Value Row - hanya untuk mode RASIO */}
              {indicatorForm.mode === 'RASIO' && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-white">Faktor Pembilang</label>
                    <input
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none"
                      value={indicatorForm.pembilang_label}
                      onChange={(e) => setIndicatorField('pembilang_label', e.target.value)}
                      placeholder="Jumlah nasabah yang melakukan pencairan >100 Milyar/transaksi"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-white">Value Pembilang</label>
                    <input
                      type="number"
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none"
                      value={indicatorForm.pembilang_value}
                      onChange={(e) => setIndicatorField('pembilang_value', e.target.value)}
                      placeholder="4000"
                      step="0.01"
                    />
                  </div>
                </div>
              )}

              {/* Faktor Penyebut & Value Row */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-white">Faktor Penyebut</label>
                  <input
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none"
                    value={indicatorForm.penyebut_label}
                    onChange={(e) => setIndicatorField('penyebut_label', e.target.value)}
                    placeholder="Jumlah nasabah yang melakukan pencairan >100 Milyar/transaksi"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-white">Value Penyebut</label>
                  <input
                    type="number"
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none"
                    value={indicatorForm.penyebut_value}
                    onChange={(e) => setIndicatorField('penyebut_value', e.target.value)}
                    placeholder="4000"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Sumber Resiko & Dampak Row */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-white">Sumber Resiko</label>
                  <textarea
                    rows={4}
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm resize-none bg-white transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none"
                    value={indicatorForm.sumber_risiko}
                    onChange={(e) => setIndicatorField('sumber_risiko', e.target.value)}
                    placeholder="1. Kelolaan dalam pemilihan aset portofolio,atau
                      2. Penurunan rating emiten setelah menjadi aset portofolio..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-white">Dampak</label>
                  <textarea
                    rows={4}
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm resize-none bg-white transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none"
                    value={indicatorForm.dampak}
                    onChange={(e) => setIndicatorField('dampak', e.target.value)}
                    placeholder="Penurunan laba berjalan atau penurunan kepercayaan pemegang saham dan stakeholder lainnya"
                  />
                </div>
              </div>

              {/* Bottom Section: Hasil Preview, Peringkat, Weighted, Legend & Button */}
              <div className="grid grid-cols-12 gap-4">
                {/* Left side: Preview boxes */}
                <div className="col-span-6 flex gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block text-white">Hasil Preview</label>
                    <input
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-gray-50"
                      value={(() => {
                        const raw = computeHasil(indicatorForm);
                        if (raw === '' || raw == null || isNaN(Number(raw))) return '';

                        const pembHasPercent = String(indicatorForm.pembilang_value).includes('%');
                        const penyHasPercent = String(indicatorForm.penyebut_value).includes('%');

                        if (pembHasPercent && penyHasPercent) {
                          return formatHasilNumber(raw, 4);
                        }

                        const showAsPercent = indicatorForm.is_percent !== false;

                        if (showAsPercent) {
                          const pct = Number(raw) * 100;
                          if (!isFinite(pct) || isNaN(pct)) return '';
                          return pct.toFixed(2) + '%';
                        }

                        return formatHasilNumber(raw, 4);
                      })()}
                      readOnly
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block text-white">Peringkat (1 - 5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none"
                      value={indicatorForm.peringkat ?? ''}
                      onChange={(e) => setIndicatorField('peringkat', e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block text-white">Weighted(auto)</label>
                    <input className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-gray-50" value={sectionForm.id ? computeWeightedAuto(indicatorForm, Number(sectionForm.bobot_par || 0)).toFixed(2) : ''} readOnly />
                  </div>
                </div>

                {/* Right side: Legend */}
                <div className="col-span-6 grid grid-cols-5 gap-3 items-stretch">
                  <RiskField className="w-full" label="Low" value={indicatorForm.low} onChange={(v) => setIndicatorField('low', v)} color="#B7E1A1" textColor="#0B3D2E" placeholder="x ≤ 1%" />
                  <RiskField className="w-full" label="Low to Moderate" value={indicatorForm.low_to_moderate} onChange={(v) => setIndicatorField('low_to_moderate', v)} color="#CFE0FF" textColor="#0B2545" placeholder="1% < x ≤ 2%" />
                  <RiskField className="w-full" label="Moderate" value={indicatorForm.moderate} onChange={(v) => setIndicatorField('moderate', v)} color="#FFEEAD" textColor="#4B3A00" placeholder="2% < x ≤ 3%" />
                  <RiskField className="w-full" label="Moderate to High" value={indicatorForm.moderate_to_high} onChange={(v) => setIndicatorField('moderate_to_high', v)} color="#FAD2A7" textColor="#5A2E00" placeholder="3% < x ≤ 4%" />
                  <RiskField className="w-full" label="High" value={indicatorForm.high} onChange={(v) => setIndicatorField('high', v)} color="#E57373" textColor="#FFFFFF" placeholder="x > 4%" />
                </div>
              </div>

              {/* Keterangan */}
              <div className="mt-4">
                <label className="text-sm font-medium mb-2 block text-white">Keterangan</label>
                <input
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none"
                  value={indicatorForm.keterangan}
                  onChange={(e) => setIndicatorField('keterangan', e.target.value)}
                  placeholder="Loading"
                />
              </div>

              {/* Add/Save Button */}
              <div className="mt-6 flex justify-end">
                {!isEditingIndicator ? (
                  <button onClick={handleCreateIndicator} disabled={isSubmitting || loading} className="px-8 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold disabled:bg-gray-400 transition-colors">
                    {isSubmitting || loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Menyimpan...
                      </div>
                    ) : (
                      '+ Tambah Indikator'
                    )}
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button onClick={handleUpdateIndicator} disabled={isSubmitting || loading} className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:bg-gray-400 transition-colors">
                      {isSubmitting || loading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Menyimpan...
                        </div>
                      ) : (
                        'Simpan Perubahan'
                      )}
                    </button>
                    <button onClick={resetIndicatorForm} className="px-8 py-3 rounded-lg border-2 border-gray-300 hover:bg-gray-50 font-semibold transition-colors">
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
                <table className="min-w-[1400px] text-sm border border-gray-300 border-collapse">
                  <thead>
                    <tr className="bg-[#1f4e79] text-white">
                      <th className="border border-black px-3 py-2 text-left" style={{ width: 60 }}>
                        No
                      </th>
                      <th className="border border-black px-3 py-2 text-left" style={{ width: 80 }}>
                        Bobot
                      </th>
                      <th className="border border-black px-3 py-2 text-left" style={{ minWidth: 340 }}>
                        Parameter / Section
                      </th>
                      <th className="border border-black px-3 py-2 text-left" style={{ minWidth: 360 }}>
                        Indikator & Pembilang/Penyebut
                      </th>
                      <th className="border border-black px-3 py-2 text-center" style={{ width: 90 }}>
                        Bobot Indikator
                      </th>
                      <th className="border border-black px-3 py-2 text-left" style={{ minWidth: 220 }}>
                        Sumber Risiko
                      </th>
                      <th className="border border-black px-3 py-2 text-left" style={{ minWidth: 240 }}>
                        Dampak
                      </th>
                      <th className="border border-black px-3 py-2 bg-[#b7d7a8] text-left text-black">Low</th>
                      <th className="border border-black px-3 py-2 bg-[#c9daf8] text-left text-black">Low to Moderate</th>
                      <th className="border border-black px-3 py-2 bg-[#fff2cc] text-left text-black">Moderate</th>
                      <th className="border border-black px-3 py-2 bg-[#f9cb9c] text-left text-black">Moderate to High</th>
                      <th className="border border-black px-3 py-2 bg-[#e06666] ">High</th>
                      <th className="border border-black px-3 py-2 bg-[#2e75b6] border border-black" style={{ width: 100 }}>
                        Hasil
                      </th>
                      <th className="px-3 py-2 bg-[#2e75b6] text-left border border-black" style={{ width: 70 }}>
                        Peringkat
                      </th>
                      <th className="px-3 py-2 bg-[#2e75b6] text-left text-white border border-black" style={{ width: 90 }}>
                        Weighted
                      </th>
                      <th className="border border-black px-3 py-2 bg-[#1f4e79] text-left" style={{ width: 220 }}>
                        Keterangan
                      </th>
                      <th className="border border-black border px-3 py-2 text-center" style={{ width: 80 }}>
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td className="border px-3 py-8 text-center text-gray-500" colSpan={17}>
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            Memuat data...
                          </div>
                        </td>
                      </tr>
                    ) : filteredSections.length === 0 ? (
                      <tr>
                        <td className="border px-3 py-6 text-center text-gray-500" colSpan={17}>
                          {sections.length === 0 ? 'Belum ada data section' : 'Tidak ada data yang sesuai dengan pencarian'}
                        </td>
                      </tr>
                    ) : (
                      filteredSections.map((s) => {
                        const inds = s.indikators || [];
                        if (!inds.length) {
                          return (
                            <tr key={s.id} className="bg-[#e9f5e1]">
                              <td className="border px-3 py-3 text-center">{s.no_sec}</td>
                              <td className="border px-3 py-3 text-center">{s.bobot_par}%</td>
                              <td className="border px-3 py-3">{s.nama_section}</td>
                              <td className="border px-3 py-3 text-center" colSpan={14}>
                                Belum ada indikator
                              </td>
                            </tr>
                          );
                        }

                        return (
                          <React.Fragment key={s.id}>
                            {inds.map((it, idx) => {
                              const firstOfSection = idx === 0;

                              let hasilDisplay = '';
                              if (it.hasil !== '' && it.hasil != null && !isNaN(Number(it.hasil))) {
                                const pembHasPercent = String(it.pembilang_value).includes('%');
                                const penyHasPercent = String(it.penyebut_value).includes('%');

                                if (pembHasPercent && penyHasPercent) {
                                  hasilDisplay = formatHasilNumber(it.hasil, 4);
                                } else {
                                  const showAsPercent = it.is_percent !== false;

                                  if (showAsPercent) {
                                    const pct = Number(it.hasil) * 100;
                                    if (!isFinite(pct) || isNaN(pct)) {
                                      hasilDisplay = '';
                                    } else {
                                      hasilDisplay = pct.toFixed(2) + '%';
                                    }
                                  } else {
                                    hasilDisplay = formatHasilNumber(it.hasil, 4);
                                  }
                                }
                              }

                              const weightedDisplay = (typeof it.weighted === 'number' || (typeof it.weighted === 'string' && it.weighted !== '')) && it.weighted != null ? Number(it.weighted).toFixed(2) : '';

                              return (
                                <React.Fragment key={it.id}>
                                  <tr>
                                    {firstOfSection && (
                                      <>
                                        <td rowSpan={inds.length * rowsPerIndicator} className="border px-3 py-3 align-top bg-[#d9eefb] text-center font-semibold">
                                          {s.no_sec}
                                        </td>
                                        <td rowSpan={inds.length * rowsPerIndicator} className="border px-3 py-3 align-top bg-[#d9eefb] text-center">
                                          {s.bobot_par}%
                                        </td>
                                        <td rowSpan={inds.length * rowsPerIndicator} className="border px-3 py-3 align-top bg-[#d9eefb]">
                                          {s.nama_section}
                                        </td>
                                      </>
                                    )}

                                    <td className="border px-3 py-3 align-top bg-[#d9eefb]">
                                      <div className="font-medium">{it.nama_indikator}</div>
                                    </td>
                                    <td className="border px-3 py-3 text-center align-top bg-[#d9eefb]">{it.bobot_indikator}%</td>
                                    <td className="border px-3 py-3 align-top bg-[#d9eefb]">{it.sumber_risiko}</td>
                                    <td className="border px-3 py-3 align-top bg-[#d9eefb]">{it.dampak}</td>

                                    <td className="border px-3 py-3 text-center bg-green-700/10">{it.low}</td>
                                    <td className="border px-3 py-3 text-center bg-green-700/10">{it.low_to_moderate}</td>
                                    <td className="border px-3 py-3 text-center bg-green-700/10">{it.moderate}</td>
                                    <td className="border px-3 py-3 text-center bg-green-700/10">{it.moderate_to_high}</td>
                                    <td className="border px-3 py-3 text-center bg-green-700/10">{it.high}</td>

                                    <td className="border px-3 py-3 text-right bg-gray-400/20">{hasilDisplay}</td>

                                    <td className="border px-3 py-3 text-center">
                                      <div style={{ minWidth: 36, minHeight: 24 }} className="inline-block rounded bg-yellow-300 px-2">
                                        {it.peringkat}
                                      </div>
                                    </td>

                                    <td className="border px-3 py-3 text-right bg-gray-400/20">{weightedDisplay}</td>
                                    <td className="border px-3 py-3">{it.keterangan}</td>

                                    <td className="border px-3 py-3 text-center">
                                      <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => handleEditIndicator(it)} className="px-2 py-1 rounded border hover:bg-gray-100 transition-colors">
                                          <Edit3 size={14} />
                                        </button>
                                        <button onClick={() => handleDeleteIndicator(it.id)} className="px-2 py-1 rounded border text-red-600 hover:bg-red-50 transition-colors">
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>

                                  {/* Pembilang row – hanya untuk mode RASIO */}
                                  {it.mode === 'RASIO' && (
                                    <tr className="bg-white">
                                      <td className="border px-3 py-2">
                                        <div className="text-sm text-gray-700 mt-1">{it.pembilang_label || '-'}</div>
                                      </td>
                                      <td className="border px-3 py-2"></td>
                                      <td className="border px-3 py-2"></td>
                                      <td className="border px-3 py-2"></td>
                                      <td className="border px-3 py-2"></td>
                                      <td className="border px-3 py-2"></td>
                                      <td className="border px-3 py-2"></td>
                                      <td className="border px-3 py-2"></td>
                                      <td className="border px-3 py-2"></td>
                                      <td className="border px-3 py-2 bg-[#c6d9a7] text-right">{it.pembilang_value ? fmtNumber(it.pembilang_value) : ''}</td>
                                      <td className="border px-3 py-2"></td>
                                      <td className="border px-3 py-2"></td>
                                      <td className="border px-3 py-2"></td>
                                      <td className="border px-3 py-2"></td>
                                    </tr>
                                  )}
                                  {/* Penyebut row */}
                                  <tr className="bg-white">
                                    <td className="border px-3 py-2">
                                      <div className="text-sm text-gray-700 mt-1">{it.penyebut_label || '-'}</div>
                                    </td>
                                    <td className="border px-3 py-2"></td>
                                    <td className="border px-3 py-2"></td>
                                    <td className="border px-3 py-2"></td>
                                    <td className="border px-3 py-2"></td>
                                    <td className="border px-3 py-2"></td>
                                    <td className="border px-3 py-2"></td>
                                    <td className="border px-3 py-2"></td>
                                    <td className="border px-3 py-2"></td>
                                    <td className="border px-3 py-2 bg-[#c6d9a7] text-right">{it.penyebut_value ? fmtNumber(it.penyebut_value) : ''}</td>
                                    <td className="border px-3 py-2"></td>
                                    <td className="border px-3 py-2"></td>
                                    <td className="border px-3 py-2"></td>
                                    <td className="border px-3 py-2"></td>
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
                      <td className="border border-gray-400" colSpan={12}></td>
                      <td className="border border-gray-400 text-white font-semibold text-center bg-[#0b3861]" colSpan={2}>
                        Summary
                      </td>
                      <td className="border border-gray-400 text-white font-semibold text-center bg-[#8fce00]">{totalWeighted.toFixed(2)}</td>
                      <td className="border border-gray-400" colSpan={2}></td>
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
