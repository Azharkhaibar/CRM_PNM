// investasi-page.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { Download, Trash2, Edit3, Search, Plus, ChevronDown } from 'lucide-react';

// ==== Komponen & Utils Investasi ====
import DataTable from './components/investasi/new-datatable';
import { RiskField, YearInput, QuarterSelect } from '../pasar/components/Inputs';
import { getCurrentQuarter, getCurrentYear } from './utils/investasi/time';
import { exportInvestasiToExcel } from '../pasar/utils/excelexportinvestasi';

// ==== Backend Services & Hooks ====
// import { useInvestasiByPeriod, useCreateInvestasi, useUpdateInvestasi, useDeleteInvestasi, useSections, useCreateSection, useUpdateSection, useDeleteSection } from './hooks/investasi/new-investasi.hook';
// import { investasiService } from './services/investasi.service';

import { useInvestasiByPeriod, useCreateInvestasi, useUpdateInvestasi, useDeleteInvestasi, useSections, useCreateSection, useUpdateSection, useDeleteSection } from './hooks/investasi/investasi.hook';
import { investasiService } from './service/new-investasi.service';

// ===================== Brand =====================
const PNM_BRAND = {
  primary: '#0068B3',
  primarySoft: '#E6F1FA',
  gradient: 'bg-gradient-to-r from-[#0076C6]/90 via-[#00A3DA]/90 to-[#33C2B5]/90',
};

// ===================== Investasi: fallback empty row =====================
const invFallbackEmpty = (year, quarter) => ({
  year,
  quarter,
  no: '1',
  subNo: '1.1',
  sectionLabel: '',
  indikator: '',
  bobotSection: 0,
  bobotIndikator: 0,
  sumberRisiko: '',
  dampak: '',
  low: 'x ≤ 1%',
  lowToModerate: '1% < x ≤ 2%',
  moderate: '2% < x ≤ 3%',
  moderateToHigh: '3% < x ≤ 4%',
  high: 'x > 4%',
  numeratorLabel: '',
  numeratorValue: '',
  denominatorLabel: '',
  denominatorValue: '',
  mode: 'RASIO',
  formula: '',
  isPercent: false,
  hasil: '',
  peringkat: 1,
  weighted: '',
  keterangan: '',
});

// ===== helper number =====
const fmtNumber = (v) => {
  if (v === '' || v == null) return '';
  const n = Number(String(v).replace(/,/g, ''));
  if (isNaN(n)) return String(v);
  return new Intl.NumberFormat('en-US').format(n);
};

const parseNum = (v) => {
  if (v == null || v === '') return 0;
  const s = String(v).replace(/,/g, '').trim();
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
};

const computeInvestasiHasil = (row) => {
  const mode = row.mode || 'RASIO';
  const pemb = parseNum(row.numeratorValue);
  const peny = parseNum(row.denominatorValue);

  // rumus custom
  if (row.formula && row.formula.trim() !== '') {
    try {
      const expr = row.formula.replace(/\bpemb\b/g, 'pemb').replace(/\bpeny\b/g, 'peny');
      const fn = new Function('pemb', 'peny', `return (${expr});`);
      const res = fn(pemb, peny);
      if (!isFinite(res) || isNaN(res)) return '';
      return Number(res);
    } catch (e) {
      console.warn('Invalid formula (Investasi):', row.formula, e);
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

export default function Investasi() {
  const [viewYear, setViewYear] = useState(getCurrentYear ? getCurrentYear() : new Date().getFullYear());
  const [viewQuarter, setViewQuarter] = useState(getCurrentQuarter ? getCurrentQuarter() : 'Q1');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [notification, setNotification] = useState({
    type: '',
    message: '',
    show: false,
  });

  const { data: sections = [], isLoading: sectionsLoading, refetch: refetchSections } = useSections();
  const { data: rows = [], isLoading: investasiLoading, refetch: refetchInvestasi, error: investasiError } = useInvestasiByPeriod(viewYear, viewQuarter);

  const createInvestasiMutation = useCreateInvestasi();
  const updateInvestasiMutation = useUpdateInvestasi();
  const deleteInvestasiMutation = useDeleteInvestasi();
  const createSectionMutation = useCreateSection();
  const updateSectionMutation = useUpdateSection();
  const deleteSectionMutation = useDeleteSection();

  // ----- SECTION FORM -----
  const [sectionForm, setSectionForm] = useState({
    id: '',
    no: '',
    bobotSection: 0,
    sectionLabel: '',
  });

  // handle notifikasi
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ type: '', message: '', show: false });
      }, 3000); // Hilang setelah 3 detik
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const showNotification = (type, message) => {
    setNotification({ type, message, show: true });
  };

  const hideNotification = () => {
    setNotification({ type: '', message: '', show: false });
  };

  // ----- ROW & FORM -----
  const invMakeRow = () => invFallbackEmpty(viewYear, viewQuarter);

  const [form, setForm] = useState(invMakeRow());
  const [editingRow, setEditingRow] = useState(null);

  // Effect untuk handle error dari backend
  useEffect(() => {
    if (investasiError) {
      setError('Gagal memuat data investasi');
    }
  }, [investasiError]);

  const filtered = useMemo(() => {
    return rows
      .filter((r) => r.year === viewYear && r.quarter === viewQuarter)
      .filter((r) => `${r.no} ${r.subNo} ${r.sectionLabel} ${r.indikator} ${r.keterangan || ''} ${r.sumberRisiko || ''} ${r.dampak || ''}`.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => `${a.subNo}`.localeCompare(`${b.subNo}`, undefined, { numeric: true }));
  }, [rows, viewYear, viewQuarter, query]);

  const totalWeighted = useMemo(() => filtered.reduce((sum, r) => sum + (Number(r.weighted || 0) || 0), 0), [filtered]);

  const resetForm = () => {
    setForm(invMakeRow());
    setEditingRow(null);
    setSectionForm({
      id: '',
      no: '',
      bobotSection: 0,
      sectionLabel: '',
    });
    setSelectedSectionId('');
  };

  const selectSection = (id) => {
    const s = sections.find((x) => x.id.toString() === id);
    if (s) {
      setSectionForm({
        id: s.id.toString(),
        no: s.no,
        bobotSection: s.bobotSection,
        sectionLabel: s.parameter,
      });
      setSelectedSectionId(id);

      // Reset form dengan data section yang dipilih
      setForm((prev) => ({
        ...prev,
        no: s.no,
        sectionLabel: s.parameter,
        bobotSection: s.bobotSection,
      }));
    } else {
      setSelectedSectionId('');
    }
  };

  const handleAddSection = async () => {
    try {
      if (!sectionForm.no || !sectionForm.sectionLabel) {
        setError('No Section dan Section Label harus diisi');
        return;
      }

      const sectionData = {
        no: sectionForm.no,
        bobotSection: Number(sectionForm.bobotSection || 0),
        parameter: sectionForm.sectionLabel,
      };

      await createSectionMutation.mutateAsync(sectionData);
      showNotification('success', `✅ Section "${sectionForm.no}" berhasil ditambahkan`);
      setError('');
      // Reset section form setelah berhasil
      setSectionForm({
        id: '',
        no: '',
        bobotSection: 0,
        sectionLabel: '',
      });
      setSelectedSectionId('');
    } catch (err) {
      console.error('❌ Create section error:', err);
      const errorMessage = investasiService.handleError(err);
      showNotification('error', errorMessage || 'Gagal menambah section');
    }
  };

  const handleSaveSection = async () => {
    if (!sectionForm.id) {
      setError('Pilih section yang akan diedit');
      return;
    }

    try {
      const sectionData = {
        no: sectionForm.no,
        bobotSection: Number(sectionForm.bobotSection || 0),
        parameter: sectionForm.sectionLabel,
      };

      await updateSectionMutation.mutateAsync({
        id: Number(sectionForm.id),
        data: sectionData,
      });
      showNotification('success', `✅ Section "${sectionForm.no}" berhasil diperbarui`);
    } catch (err) {
      console.error('❌ Update section error:', err);
      const errorMessage = investasiService.handleError(err);
      showNotification('error', errorMessage || 'Gagal menyimpan section');
    }
  };

  const handleRemoveSection = async (id) => {
    try {
      await deleteSectionMutation.mutateAsync(Number(id));
      showNotification('success', '✅ Section berhasil dihapus');
      setSectionForm({
        id: '',
        no: '',
        bobotSection: 0,
        sectionLabel: '',
      });
      setSelectedSectionId('');
      setError('');
    } catch (err) {
      console.error('❌ Delete section error:', err);
      const errorMessage = investasiService.handleError(err);
      showNotification('error', errorMessage || 'Gagal menghapus section');
    }
  };

  // Perbaiki buildBaseRow() di investasi-page.jsx
  // const buildBaseRow = () => {
  //   console.log('🔧 Building base row...');
  //   console.log('Form data:', form);
  //   console.log('Section form:', sectionForm);

  //   // Validasi minimal sebelum build
  //   if (!sectionForm.no) {
  //     console.error('❌ sectionForm.no is empty!');
  //     setError('No Section harus diisi');
  //     return null;
  //   }

  //   if (!form.subNo) {
  //     console.error('❌ form.subNo is empty!');
  //     setError('Sub No harus diisi');
  //     return null;
  //   }

  //   // Pastikan selectedSectionId ada
  //   if (!selectedSectionId) {
  //     setError('Section belum dipilih');
  //     return null;
  //   }

  //   const peringkatNum = form.peringkat === '' || form.peringkat == null ? 1 : Number(form.peringkat);
  //   const rawHasil = computeInvestasiHasil(form);
  //   const weightedAuto = investasiService.calculateWeighted(sectionForm.bobotSection, Number(form.bobotIndikator || 0), peringkatNum);

  //   // Buat objek section untuk formatInvestasiData
  //   const sectionData = {
  //     id: Number(selectedSectionId),
  //     no: sectionForm.no,
  //     bobotSection: sectionForm.bobotSection,
  //     parameter: sectionForm.sectionLabel,
  //   };

  //   try {
  //     const data = investasiService.formatInvestasiData(
  //       {
  //         ...form,
  //         hasil: rawHasil === '' || rawHasil == null ? 0 : Number(rawHasil),
  //         weighted: Number(form.weighted === '' || form.weighted == null ? weightedAuto : form.weighted) || 0,
  //       },
  //       sectionData
  //     );

  //     console.log('📤 Data untuk backend:', JSON.stringify(data, null, 2));

  //     // Validasi data
  //     if (!data.sectionId || data.sectionId === 0) {
  //       setError('Section ID tidak valid');
  //       return null;
  //     }

  //     if (!data.denominatorLabel || data.denominatorLabel.trim() === '') {
  //       setError('Faktor Penyebut harus diisi');
  //       return null;
  //     }

  //     if (data.denominatorValue === 0) {
  //       setError('Nilai Penyebut tidak boleh 0');
  //       return null;
  //     }

  //     return data;
  //   } catch (error) {
  //     console.error('❌ Error formatting data:', error);
  //     setError('Format data tidak valid: ' + error.message);
  //     return null;
  //   }
  // };

  const buildBaseRow = () => {
    console.log('🔧 Building base row...');
    console.log('Form data:', form);
    console.log('Section form:', sectionForm);

    // Validasi minimal sebelum build
    if (!sectionForm.no) {
      console.error('❌ sectionForm.no is empty!');
      setError('No Section harus diisi');
      return null;
    }

    if (!form.subNo) {
      console.error('❌ form.subNo is empty!');
      setError('Sub No harus diisi');
      return null;
    }

    // Pastikan selectedSectionId ada
    if (!selectedSectionId) {
      setError('Section belum dipilih');
      return null;
    }

    const peringkatNum = form.peringkat === '' || form.peringkat == null ? 1 : Number(form.peringkat);
    const rawHasil = computeInvestasiHasil(form);
    const weightedAuto = investasiService.calculateWeighted(sectionForm.bobotSection, Number(form.bobotIndikator || 0), peringkatNum);

    // Buat objek section untuk formatInvestasiData
    const sectionData = {
      id: Number(selectedSectionId),
      no: sectionForm.no,
      bobotSection: sectionForm.bobotSection,
      parameter: sectionForm.sectionLabel,
    };

    try {
      // 🔹 PREPARE DATA: Untuk NILAI_TUNGGAL, pastikan numerator undefined
      const dataForFormatting = {
        ...form,
        hasil: rawHasil === '' || rawHasil == null ? 0 : Number(rawHasil),
        weighted: Number(form.weighted === '' || form.weighted == null ? weightedAuto : form.weighted) || 0,
      };

      // 🔹 EXPLICITLY SET untuk NILAI_TUNGGAL
      if (form.mode === 'NILAI_TUNGGAL') {
        dataForFormatting.numeratorLabel = undefined;
        dataForFormatting.numeratorValue = undefined;
      }

      const data = investasiService.formatInvestasiData(dataForFormatting, sectionData);

      console.log('📤 Data untuk backend:', JSON.stringify(data, null, 2));
      console.log('Mode:', data.mode);
      console.log('numeratorLabel:', data.numeratorLabel);
      console.log('numeratorValue:', data.numeratorValue);

      // Validasi data
      if (!data.sectionId || data.sectionId === 0) {
        setError('Section ID tidak valid');
        return null;
      }

      if (!data.denominatorLabel || data.denominatorLabel.trim() === '') {
        setError('Faktor Penyebut harus diisi');
        return null;
      }

      if (data.denominatorValue === 0) {
        setError('Nilai Penyebut tidak boleh 0');
        return null;
      }

      return data;
    } catch (error) {
      console.error('❌ Error formatting data:', error);
      setError('Format data tidak valid: ' + error.message);
      return null;
    }
  };

  // const startEdit = (row) => {
  //   if (!row) return;

  //   console.log('Editing row data:', row);

  //   setEditingRow(row);

  //   // Mapping balik dari response backend
  //   setForm({
  //     year: row.year,
  //     quarter: row.quarter,
  //     no: row.no,
  //     subNo: row.subNo || row.no_indikator || '',
  //     sectionLabel: row.sectionLabel || '',
  //     bobotSection: row.bobotSection || 0,
  //     indikator: row.indikator || '',
  //     bobotIndikator: row.bobotIndikator || row.bobot_indikator || 0,
  //     sumberRisiko: row.sumberRisiko || row.sumber_resiko || '',
  //     dampak: row.dampak || '',
  //     low: row.low || 'x ≤ 1%',
  //     lowToModerate: row.lowToModerate || row.low_to_moderate || '1% < x ≤ 2%',
  //     moderate: row.moderate || '2% < x ≤ 3%',
  //     moderateToHigh: row.moderateToHigh || row.moderate_to_high || '3% < x ≤ 4%',
  //     high: row.high || 'x > 4%',
  //     mode: row.mode || 'RASIO',
  //     numeratorLabel: row.numeratorLabel || row.nama_pembilang || '',
  //     numeratorValue: row.numeratorValue?.toString() || row.total_pembilang?.toString() || '',
  //     denominatorLabel: row.denominatorLabel || row.nama_penyebut || '',
  //     denominatorValue: row.denominatorValue?.toString() || row.total_penyebut?.toString() || '',
  //     formula: row.formula || '',
  //     isPercent: row.isPercent || false,
  //     hasil: row.hasil?.toString() || '',
  //     peringkat: row.peringkat || 1,
  //     weighted: row.weighted?.toString() || '',
  //     keterangan: row.keterangan || '',
  //   });

  //   // Set section form
  //   if (row.section) {
  //     setSectionForm({
  //       id: row.section.id?.toString() || '',
  //       no: row.section.no || row.no || '',
  //       bobotSection: row.section.bobotSection || row.bobotSection || 0,
  //       sectionLabel: row.section.parameter || row.sectionLabel || '',
  //     });
  //     setSelectedSectionId(row.section.id?.toString() || '');
  //   } else if (row.sectionId) {
  //     const foundSection = sections.find((s) => s.id === row.sectionId);
  //     if (foundSection) {
  //       setSectionForm({
  //         id: foundSection.id.toString(),
  //         no: foundSection.no,
  //         bobotSection: foundSection.bobotSection,
  //         sectionLabel: foundSection.parameter,
  //       });
  //       setSelectedSectionId(foundSection.id.toString());
  //     }
  //   }
  // };

  const startEdit = (row) => {
    if (!row) return;

    console.log('Editing row data:', row);
    console.log('Row mode:', row.mode);

    setEditingRow(row);

    // Untuk NILAI_TUNGGAL, set numerator ke undefined
    const isNilaiTunggal = row.mode === 'NILAI_TUNGGAL';

    setForm({
      year: row.year,
      quarter: row.quarter,
      no: row.no,
      subNo: row.subNo || row.no_indikator || '',
      sectionLabel: row.sectionLabel || '',
      bobotSection: row.bobotSection || 0,
      indikator: row.indikator || '',
      bobotIndikator: row.bobotIndikator || row.bobot_indikator || 0,
      sumberRisiko: row.sumberRisiko || row.sumber_resiko || '',
      dampak: row.dampak || '',
      low: row.low || 'x ≤ 1%',
      lowToModerate: row.lowToModerate || row.low_to_moderate || '1% < x ≤ 2%',
      moderate: row.moderate || '2% < x ≤ 3%',
      moderateToHigh: row.moderateToHigh || row.moderate_to_high || '3% < x ≤ 4%',
      high: row.high || 'x > 4%',
      mode: row.mode || 'RASIO',

      // 🔹 Untuk NILAI_TUNGGAL, set ke undefined
      numeratorLabel: isNilaiTunggal ? undefined : row.numeratorLabel || row.nama_pembilang || '',
      numeratorValue: isNilaiTunggal ? undefined : row.numeratorValue?.toString() || row.total_pembilang?.toString() || '',

      denominatorLabel: row.denominatorLabel || row.nama_penyebut || '',
      denominatorValue: row.denominatorValue?.toString() || row.total_penyebut?.toString() || '',
      formula: row.formula || '',
      isPercent: row.isPercent || false,
      hasil: row.hasil?.toString() || '',
      peringkat: row.peringkat || 1,
      weighted: row.weighted?.toString() || '',
      keterangan: row.keterangan || '',
    });

    // Set section form
    if (row.section) {
      setSectionForm({
        id: row.section.id?.toString() || '',
        no: row.section.no || row.no || '',
        bobotSection: row.section.bobotSection || row.bobotSection || 0,
        sectionLabel: row.section.parameter || row.sectionLabel || '',
      });
      setSelectedSectionId(row.section.id?.toString() || '');
    } else if (row.sectionId) {
      const foundSection = sections.find((s) => s.id === row.sectionId);
      if (foundSection) {
        setSectionForm({
          id: foundSection.id.toString(),
          no: foundSection.no,
          bobotSection: foundSection.bobotSection,
          sectionLabel: foundSection.parameter,
        });
        setSelectedSectionId(foundSection.id.toString());
      }
    }
  };

  const handleAddRow = async () => {
    try {
      console.log('🚀 START handleAddRow');

      // 1. Validasi section dipilih
      if (!selectedSectionId || !sectionForm.no) {
        setError('Pilih section terlebih dahulu');
        return;
      }

      // 2. Build data sesuai DTO
      const baseRow = buildBaseRow();
      if (!baseRow) return;

      console.log('📋 Data yang akan dikirim ke backend:', JSON.stringify(baseRow, null, 2));

      // 3. Kirim ke backend
      const result = await createInvestasiMutation.mutateAsync(baseRow);
      console.log('✅ Sukses! Response dari backend:', result);

      showNotification('success', `✅ Indikator "${form.indikator}" berhasil ditambahkan`);

      resetForm();
      setError('');
    } catch (err) {
      console.error('❌ ERROR DETAIL:', err);
      const errorMessage = investasiService.handleError(err);
      showNotification('error', errorMessage || 'Gagal menambah data investasi');
    }
  };

  const handleSaveEdit = async () => {
    if (!editingRow) return;

    try {
      const baseRow = buildBaseRow();
      if (!baseRow) return;

      await updateInvestasiMutation.mutateAsync({
        id: editingRow.id,
        data: baseRow,
      });

      showNotification('success', `✅ Indikator berhasil diperbarui`);

      resetForm();
      setError('');
    } catch (err) {
      console.error('❌ Update error:', err);
      const errorMessage = investasiService.handleError(err);
      showNotification('error', errorMessage || 'Gagal menyimpan perubahan');
    }
  };

  const handleRemoveRow = async (row) => {
    if (!row) return;

    try {
      await deleteInvestasiMutation.mutateAsync(row.id);
      showNotification('success', '✅ Data berhasil dihapus');
      if (editingRow === row) resetForm();
      setError('');
    } catch (err) {
      console.error('❌ Delete error:', err);
      const errorMessage = investasiService.handleError(err);
      showNotification('error', errorMessage || 'Gagal menghapus data');
    }
  };

  const exportExcel = () => {
    if (exportInvestasiToExcel) {
      exportInvestasiToExcel(filtered, viewYear, viewQuarter);
    }
  };

  const isLoading = sectionsLoading || investasiLoading;
  const isMutating = createInvestasiMutation.isPending || updateInvestasiMutation.isPending || deleteInvestasiMutation.isPending || createSectionMutation.isPending || updateSectionMutation.isPending || deleteSectionMutation.isPending;

  // Helper untuk menghitung weighted preview
  const calculateWeightedPreview = () => {
    const peringkatNum = form.peringkat === '' || form.peringkat == null ? 0 : Number(form.peringkat);
    return investasiService.calculateWeighted(sectionForm.bobotSection, Number(form.bobotIndikator || 0), peringkatNum);
  };

  return (
    <div className=" overflow-x-hidden">
      {/* Error Display */}
      {/* {notification.show && (
        <div className={`fixed top-4 right-4 z-50 min-w-72 max-w-md rounded-lg shadow-xl border ${notification.type === 'success' ? 'bg-green-500 border-green-600 text-white' : 'bg-red-500 border-red-600 text-white'}`}>
          <div className="p-4 flex items-start gap-3">
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>{notification.type === 'success' ? '✅' : '❌'}</div>
            <div className="flex-1">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <button onClick={hideNotification} className="text-white/80 hover:text-white transition-colors text-sm">
              ✕
            </button>
          </div>
        </div>
      )} */}

      {/* HERO / TITLE */}

      <div className="bg-white rounded-2xl ">
        {/* ================= TAB: INVESTASI ================= */}
        <header className="flex items-center justify-between gap-3 px-4 py-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Form – Investasi</h2>
          <div className="flex items-end gap-4">
            {/* tahun + triwulan */}
            <div className="hidden md:flex items-end gap-4">
              <div className="flex flex-col gap-1">
                <YearInput
                  value={viewYear}
                  onChange={(v) => {
                    setViewYear(v);
                    setForm((f) => ({ ...f, year: v }));
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <QuarterSelect
                  value={viewQuarter}
                  onChange={(v) => {
                    setViewQuarter(v);
                    setForm((f) => ({ ...f, quarter: v }));
                  }}
                />
              </div>
            </div>

            {/* search + export */}
            <div className="flex items-end gap-2">
              <div className="relative">
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari no/sub/indikator/keterangan…" className="pl-9 pr-3 py-2 rounded-xl border w-64" />
                <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              <button onClick={exportExcel} disabled={isLoading || filtered.length === 0} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-gray-900 text-white hover:bg-black disabled:opacity-50">
                <Download size={18} />
                {isLoading ? 'Loading...' : `Export ${viewYear}-${viewQuarter}`}
              </button>
            </div>
          </div>
        </header>

        {notification.show && (
          <div className={`mx-4 mb-4 rounded-lg shadow-md border ${notification.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="p-4 flex items-start gap-3">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {notification.type === 'success' ? '✓' : '✕'}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>{notification.message}</p>
              </div>
              <button onClick={hideNotification} className="text-gray-400 hover:text-gray-600 transition-colors text-sm">
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Memuat data...</p>
          </div>
        )}

        {/* ===== FORM SECTION + INDIKATOR ===== */}
        {!isLoading && (
          <>
            <div className="relative rounded-2xl overflow-hidden mb-6 shadow-sm bg-gradient-to-r from-[#0076C6]/90 via-[#00A3DA]/90 to-[#33C2B5]/90">
              {/* SECTION HEADER */}
              <div className="rounded-2xl border-2 border-gray-300 p-4 shadow-sm mb-6">
                <h2 className="text-white font-semibold text-lg sm:text-xl mb-4">Form Section – Investasi</h2>

                <div className="flex items-end gap-4 mb-4">
                  {/* No Sec */}
                  <div className="flex flex-col">
                    <label className="text-xs text-white font-medium mb-1">No Sec</label>
                    <input
                      className="w-20 h-10 px-3 rounded-lg border-2 border-gray-300 text-center font-medium bg-white"
                      value={sectionForm.no}
                      onChange={(e) =>
                        setSectionForm((f) => ({
                          ...f,
                          no: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Bobot Sec */}
                  <div className="flex flex-col">
                    <label className="text-xs text-white font-medium mb-1">Bobot Sec (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-28 h-10 px-3 rounded-lg border-2 border-gray-300 text-center font-medium bg-white"
                      value={sectionForm.bobotSection ?? ''}
                      onChange={(e) =>
                        setSectionForm((f) => ({
                          ...f,
                          bobotSection: e.target.value === '' ? 0 : Number(e.target.value),
                        }))
                      }
                    />
                  </div>

                  {/* Section */}
                  <div className="flex-1 flex flex-col">
                    <label className="text-xs text-white font-medium mb-1">Section Label</label>
                    <input
                      className="w-full h-10 px-4 rounded-lg border-2 border-gray-300 font-medium bg-white"
                      value={sectionForm.sectionLabel}
                      onChange={(e) =>
                        setSectionForm((f) => ({
                          ...f,
                          sectionLabel: e.target.value,
                        }))
                      }
                      placeholder="Uraian section risiko investasi"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 self-end">
                    <button className="w-10 h-10 rounded-lg bg-green-500 hover:bg-green-600 text-white flex items-center justify-center disabled:opacity-50" onClick={handleAddSection} title="Tambah Section" disabled={isMutating}>
                      <Plus size={20} />
                    </button>
                    <button
                      className="w-10 h-10 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white flex items-center justify-center disabled:opacity-50"
                      onClick={handleSaveSection}
                      title="Edit Section"
                      disabled={!sectionForm.id || isMutating}
                    >
                      <Edit3 size={20} />
                    </button>
                    <button
                      className="w-10 h-10 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center disabled:opacity-50"
                      onClick={() => sectionForm.id && handleRemoveSection(sectionForm.id)}
                      title="Hapus Section"
                      disabled={!sectionForm.id || isMutating}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Dropdown daftar section */}
                <div className="relative">
                  <label className="text-xs text-white font-medium mb-1 block">Pilih Section</label>
                  <select
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 font-medium appearance-none bg-white cursor-pointer pr-10"
                    value={selectedSectionId || ''}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      if (selectedId) {
                        selectSection(selectedId);
                      } else {
                        setSelectedSectionId('');
                        setSectionForm({
                          id: '',
                          no: '',
                          bobotSection: 0,
                          sectionLabel: '',
                        });
                        setForm(invMakeRow());
                      }
                    }}
                  >
                    <option value="">-- Pilih Section --</option>
                    {sections.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.no} - {s.parameter} (Bobot: {s.bobotSection}%)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-9 pointer-events-none text-gray-400" size={20} />
                </div>
              </div>

              {/* ===== FORM INDIKATOR (Hanya muncul jika section dipilih) ===== */}
              {selectedSectionId && (
                <div className="rounded-xl border-2 border-gray-300 shadow-sm p-6 mb-6">
                  {/* Section Info */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-blue-800">Section Terpilih</h3>
                        <p className="text-sm text-blue-600">
                          {sectionForm.no} - {sectionForm.sectionLabel} (Bobot: {sectionForm.bobotSection}%)
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedSectionId('');
                          setForm(invMakeRow());
                        }}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Ubah Section
                      </button>
                    </div>
                  </div>

                  {/* Sub No + Indikator + Bobot */}
                  <div className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-3">
                      <label className="text-sm font-medium mb-2 block text-white">Sub No *</label>
                      <input className="w-full rounded-lg border-2 border-gray-300 px-3 py-3 text-sm bg-white" value={form.subNo} onChange={(e) => setForm((f) => ({ ...f, subNo: e.target.value }))} placeholder="1.1" />
                    </div>
                    <div className="col-span-6">
                      <label className="text-sm font-medium mb-2 block text-white">Indikator *</label>
                      <input
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                        value={form.indikator}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            indikator: e.target.value,
                          }))
                        }
                        placeholder="Nama indikator investasi…"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="text-sm font-medium mb-2 block text-white">Bobot Indikator (%) *</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm text-right bg-white"
                        value={form.bobotIndikator ?? ''}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            bobotIndikator: e.target.value === '' ? '' : e.target.value,
                          }))
                        }
                        placeholder="50"
                      />
                    </div>
                  </div>

                  {/* Metode Perhitungan + Rumus + Persen */}
                  <div className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-4">
                      <label className="text-sm font-medium mb-2 block text-white">Metode Perhitungan</label>
                      <select
                        className="w-full rounded-lg border-2 border-gray-300 px-3 py-3 text-sm bg-white"
                        value={form.mode || 'RASIO'}
                        onChange={(e) => {
                          const v = e.target.value;
                          setForm((f) => ({
                            ...f,
                            mode: v,
                            ...(v === 'NILAI_TUNGGAL' ? { numeratorLabel: '', numeratorValue: '' } : {}),
                          }));
                        }}
                      >
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
                          placeholder={form.mode === 'RASIO' ? 'Contoh default: pemb / peny — atau rumus custom (pemb, peny)' : 'Contoh default: peny — atau rumus custom (peny / 1000)'}
                          value={form.formula || ''}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              formula: e.target.value,
                            }))
                          }
                        />

                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={form.isPercent || false}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                isPercent: e.target.checked,
                              }))
                            }
                            className="w-6 h-6 rounded-full border-2 border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-gray-300 bg-gray-100 text-lg font-bold">%</div>
                        </label>
                      </div>
                      <div className="text-xs text-white/80 mt-2">Aktifkan checkbox untuk mengubah hasil menjadi persentase (hasil × 100). Weighted tetap angka (bukan persen).</div>
                    </div>
                  </div>

                  {/* Faktor Pembilang (hanya RASIO) */}
                  {form.mode !== 'NILAI_TUNGGAL' && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block text-white">Faktor Pembilang</label>
                        <input
                          className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                          value={form.numeratorLabel}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              numeratorLabel: e.target.value,
                            }))
                          }
                          placeholder="Misal: Total Outstanding (OS) Non-Investment Grade"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block text-white">Nilai Pembilang</label>
                        <input
                          className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                          value={form.numeratorValue ?? ''}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              numeratorValue: e.target.value,
                            }))
                          }
                          placeholder="250"
                        />
                      </div>
                    </div>
                  )}

                  {/* Faktor Penyebut */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block text-white">Faktor Penyebut *</label>
                      <input
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                        value={form.denominatorLabel}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            denominatorLabel: e.target.value,
                          }))
                        }
                        placeholder={form.mode === 'RASIO' ? 'Total Asset (Jutaan)' : 'Jumlah kejadian, jumlah kasus, dll.'}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block text-white">Nilai Penyebut *</label>
                      <input
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                        value={form.denominatorValue ?? ''}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            denominatorValue: e.target.value,
                          }))
                        }
                        placeholder={form.mode === 'RASIO' ? '10000' : '5'}
                      />
                    </div>
                  </div>

                  {/* Sumber Risiko & Dampak */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block text-white">Sumber Risiko *</label>
                      <textarea
                        rows={4}
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm resize-none bg-white"
                        value={form.sumberRisiko}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            sumberRisiko: e.target.value,
                          }))
                        }
                        placeholder="Contoh: kelemahan proses, human error, kegagalan sistem, dsb."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block text-white">Dampak</label>
                      <textarea
                        rows={4}
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm resize-none bg-white"
                        value={form.dampak}
                        onChange={(e) => setForm((f) => ({ ...f, dampak: e.target.value }))}
                        placeholder="Contoh: kerugian finansial, penurunan layanan, risiko hukum, dsb."
                      />
                    </div>
                  </div>

                  {/* Hasil Preview, Peringkat, Weighted, Keterangan */}
                  <div className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-6 flex gap-4">
                      <div className="flex-1">
                        <label className="text-sm font-medium block text-white h-10 flex items-end">Hasil Preview {form.mode === 'RASIO' ? ' (Pembilang / Penyebut)' : ' (Nilai Penyebut)'}</label>
                        <input
                          className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-gray-50"
                          value={(() => {
                            const raw = computeInvestasiHasil(form);
                            if (raw === '' || raw == null) return '';
                            if (form.isPercent) {
                              const pct = Number(raw) * 100;
                              if (!isFinite(pct) || isNaN(pct)) return '';
                              return `${pct.toFixed(2)}%`;
                            }
                            if (form.mode === 'NILAI_TUNGGAL') {
                              return fmtNumber(raw);
                            }
                            return Number(raw).toFixed(4);
                          })()}
                          readOnly
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-sm font-medium block text-white h-10 flex items-end">Peringkat (1 – 5) *</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                          value={form.peringkat ?? ''}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              peringkat: e.target.value === '' ? 0 : Number(e.target.value),
                            }))
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-sm font-medium block text-white h-10 flex items-end">Weighted (auto)</label>
                        <input className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-gray-50" value={calculateWeightedPreview().toFixed(4)} readOnly />
                      </div>
                    </div>

                    <div className="col-span-6">
                      <div className="mt-4 grid grid-cols-5 gap-3">
                        <RiskField
                          className="w-full"
                          label="Low"
                          value={form.low}
                          onChange={(v) =>
                            setForm((f) => ({
                              ...f,
                              low: v,
                            }))
                          }
                          color="#C6E0B4"
                          textColor="#000000"
                          placeholder="x ≤ 1%"
                        />

                        <RiskField
                          className="w-full"
                          label="Low to Moderate"
                          value={form.lowToModerate}
                          onChange={(v) =>
                            setForm((f) => ({
                              ...f,
                              lowToModerate: v,
                            }))
                          }
                          color="#DDEBF7"
                          textColor="#000000"
                          placeholder="1% < x ≤ 2%"
                        />

                        <RiskField
                          className="w-full"
                          label="Moderate"
                          value={form.moderate}
                          onChange={(v) =>
                            setForm((f) => ({
                              ...f,
                              moderate: v,
                            }))
                          }
                          color="#FFF2CC"
                          textColor="#000000"
                          placeholder="2% < x ≤ 3%"
                        />

                        <RiskField
                          className="w-full"
                          label="Moderate to High"
                          value={form.moderateToHigh}
                          onChange={(v) =>
                            setForm((f) => ({
                              ...f,
                              moderateToHigh: v,
                            }))
                          }
                          color="#FFE699"
                          textColor="#000000"
                          placeholder="3% < x ≤ 4%"
                        />

                        <RiskField
                          className="w-full"
                          label="High"
                          value={form.high}
                          onChange={(v) =>
                            setForm((f) => ({
                              ...f,
                              high: v,
                            }))
                          }
                          color="#F8CBAD"
                          textColor="#000000"
                          placeholder="x > 4%"
                        />
                      </div>
                    </div>
                  </div>

                  <label className="text-sm font-medium block text-white h-10 flex items-end">Keterangan</label>
                  <textarea
                    rows={3}
                    className="w-[705px] rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                    value={form.keterangan}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        keterangan: e.target.value,
                      }))
                    }
                  />

                  {/* Tombol Tambah / Simpan */}
                  <div className="mt-6 flex justify-end">
                    {!editingRow ? (
                      <button onClick={handleAddRow} disabled={isMutating || !sectionForm.no} className="px-8 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold disabled:opacity-50">
                        {createInvestasiMutation.isPending ? 'Menyimpan...' : '+ Tambah Indikator'}
                      </button>
                    ) : (
                      <div className="flex gap-3">
                        <button onClick={handleSaveEdit} disabled={isMutating} className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50">
                          {updateInvestasiMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                        <button onClick={resetForm} className="px-8 py-3 rounded-lg border-2 border-gray-300 hover:bg-gray-50 font-semibold">
                          Batal
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Pesan jika belum memilih section */}
              {!selectedSectionId && (
                <div className="rounded-xl border-2 border-dashed border-gray-300 shadow-sm p-8 mb-6 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Pilih Section Terlebih Dahulu</h3>
                  <p className="text-white/80 mb-4">Silakan pilih section dari dropdown di atas atau buat section baru untuk mulai menambahkan indikator.</p>
                  <div className="text-sm text-white/60">
                    <p>Langkah-langkah:</p>
                    <ol className="list-decimal list-inside mt-1">
                      <li>Tambahkan section baru atau pilih dari daftar section</li>
                      <li>Form indikator akan muncul setelah section dipilih</li>
                      <li>Isi data indikator dan klik "Tambah Indikator"</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>

            <section className="mt-4">
              <div className="bg-white rounded-2xl shadow overflow-hidden">
                <div className="relative h-[350px]">
                  <div className="absolute inset-0 overflow-auto">
                    <DataTable rows={filtered} totalWeighted={totalWeighted} viewYear={viewYear} viewQuarter={viewQuarter} startEdit={startEdit} removeRow={handleRemoveRow} loading={isMutating} />
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
