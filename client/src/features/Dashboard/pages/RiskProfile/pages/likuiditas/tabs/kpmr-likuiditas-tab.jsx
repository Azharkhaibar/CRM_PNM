// KPMRLikuiditasTab.jsx - FULL CODE DENGAN PERBAIKAN INDIKATOR
import React, { useState, useMemo, useEffect } from 'react';
import { Download, Trash2, Edit3, Search, Plus, X } from 'lucide-react';
import { exportKPMRInvestasiToExcel } from '../../investasi/utils/investasi/exportexcelkpmrinvest.jsx';
import { PNM_BRAND, KPMR_EMPTY_FORM } from '../../pasar/constant/constant.jsx';
import { useKpmrLikuiditasByPeriod, useCreateKpmrLikuiditas, useUpdateKpmrLikuiditas, useDeleteKpmrLikuiditas, useKpmrLikuiditasCalculations, useKpmrLikuiditasForm } from '../hooks/kpmr-likuiditas/kpmr-likuiditas.hook.js';
import { kpmrLikuiditasService, transformFormToDto } from '../service/kpmr-likuiditas/kpmr-likuiditas.service.js';

// ✅ IMPORT UNTUK AUDIT LOG
import { useAuditLog } from '../../../../audit-log/hooks/audit-log.hooks.js';
import { useAuth } from '../../../../../../auth/hooks/useAuth.hook.js';

export default function KPMRLikuiditasTab({ viewYear, setViewYear, viewQuarter, setViewQuarter, query, setQuery }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [KPMR_editingId, setKPMR_editingId] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // Hooks untuk data operations
  const { data: groupedData = { data: [], groups: [], overallAverage: 0 }, isLoading, error, refetch } = useKpmrLikuiditasByPeriod(viewYear, viewQuarter);

  const createMutation = useCreateKpmrLikuiditas();
  const updateMutation = useUpdateKpmrLikuiditas();
  const deleteMutation = useDeleteKpmrLikuiditas();
  const { validateFormData, calculateAspekAverage } = useKpmrLikuiditasCalculations();

  // Form management hook
  const {
    formData: KPMR_form,
    errors,
    updateField,
    validate,
    reset: resetForm,
    setFormData,
  } = useKpmrLikuiditasForm({
    year: viewYear,
    quarter: viewQuarter,
  });

  // ✅ HOOK UNTUK AUDIT LOG
  const { user: authUser } = useAuth();
  const { logCreate, logUpdate, logDelete, logExport } = useAuditLog();

  // Transform grouped data menjadi flat array untuk filtering
  const KPMR_rows = useMemo(() => {
    return groupedData.data || [];
  }, [groupedData]);

  // PERBAIKAN: Transform data untuk table dengan struktur yang benar
  const tableData = useMemo(() => {
    if (!groupedData.groups || groupedData.groups.length === 0) {
      return [];
    }

    const result = [];

    groupedData.groups.forEach((group) => {
      // Tambahkan baris aspek
      result.push({
        type: 'aspek',
        data: group,
        id: `aspek-${group.aspekNo}`,
      });

      // Tambahkan baris section untuk aspek ini
      group.items.forEach((item, idx) => {
        result.push({
          type: 'section',
          data: item,
          aspekData: group,
          id: `section-${item.id_kpmr_likuiditas}`,
        });
      });
    });

    return result;
  }, [groupedData]);

  // Filter data berdasarkan query
  const KPMR_filtered = useMemo(() => {
    return KPMR_rows.filter((r) =>
      `${r.aspekNo || ''} ${r.aspekTitle || ''} ${r.sectionNo || ''} ${r.indikator || ''} ${r.evidence || ''} ${r.strong || ''} ${r.satisfactory || ''} ${r.fair || ''} ${r.marginal || ''} ${r.unsatisfactory || ''}`
        .toLowerCase()
        .includes(query.toLowerCase())
    ).sort((a, b) => {
      const aA = `${a.aspekNo}`.localeCompare(`${b.aspekNo}`, undefined, { numeric: true });
      if (aA !== 0) return aA;
      return `${a.sectionNo}`.localeCompare(`${b.sectionNo}`, undefined, { numeric: true });
    });
  }, [KPMR_rows, query]);

  // Filter table data berdasarkan query
  const filteredTableData = useMemo(() => {
    return tableData.filter((row) => {
      if (row.type === 'aspek') {
        const group = row.data;
        return `${group.aspekNo || ''} ${group.aspekTitle || ''}`.toLowerCase().includes(query.toLowerCase());
      } else {
        const item = row.data;
        return `${item.aspekNo || ''} ${item.aspekTitle || ''} ${item.sectionNo || ''} ${item.indikator || ''} ${item.evidence || ''}`.toLowerCase().includes(query.toLowerCase());
      }
    });
  }, [tableData, query]);

  // ✅ FUNGSI AUDIT LOG YANG EFISIEN
  const handleAuditLog = async (action, description, isSuccess = true, metadata = {}) => {
    try {
      const userId = authUser?.user_id || authUser?.id;
      const auditData = {
        action,
        module: 'LIKUIDITAS',
        description: `KPMR - ${description}`,
        isSuccess,
        userId,
        metadata: {
          year: viewYear,
          quarter: viewQuarter,
          authUserId: userId,
          submodule: 'KPMR',
          ...metadata,
        },
      };

      const logFunctions = {
        CREATE: logCreate,
        UPDATE: logUpdate,
        DELETE: logDelete,
        EXPORT: logExport,
      };

      const logFunction = logFunctions[action] || logCreate;
      await logFunction('LIKUIDITAS', `KPMR - ${description}`, {
        isSuccess,
        userId,
        metadata: auditData.metadata,
      });
    } catch (error) {
      console.error('❌ [KPMR-LIKUIDITAS-AUDIT] Audit failed:', error);
    }
  };

  // Reset form
  const KPMR_resetForm = () => {
    resetForm();
    setKPMR_editingId(null);
  };

  // ✅ HANDLE SUBMIT DENGAN AUDIT LOG
  const KPMR_handleSubmit = async () => {
    if (!validate()) {
      setSubmitError('Harap perbaiki error di form sebelum submit');
      console.log('❌ [VALIDATION FAILED] Form validation errors:', errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const dto = transformFormToDto(KPMR_form);

      // ✅ DETAILED DEBUG LOGGING
      console.group('🚀 [KPMR SUBMIT] Data Submission Details');
      console.log('📋 Form Data:', {
        year: KPMR_form.year,
        quarter: KPMR_form.quarter,
        aspekNo: KPMR_form.aspekNo,
        aspekBobot: KPMR_form.aspekBobot,
        aspekTitle: KPMR_form.aspekTitle,
        sectionNo: KPMR_form.sectionNo,
        indikator: KPMR_form.indikator,
        sectionSkor: KPMR_form.sectionSkor,
        evidence: KPMR_form.evidence,
        level1: KPMR_form.level1?.substring(0, 50) + '...',
        level2: KPMR_form.level2?.substring(0, 50) + '...',
        level3: KPMR_form.level3?.substring(0, 50) + '...',
        level4: KPMR_form.level4?.substring(0, 50) + '...',
        level5: KPMR_form.level5?.substring(0, 50) + '...',
      });
      console.log('📤 DTO to be sent:', dto);
      console.log('🔍 Key validations:', {
        hasIndikator: !!KPMR_form.indikator,
        indikatorLength: KPMR_form.indikator?.length,
        indikatorValue: KPMR_form.indikator,
        isEditing: !!KPMR_editingId,
        editingId: KPMR_editingId,
      });
      console.groupEnd();

      if (KPMR_editingId) {
        console.log(`🔄 [UPDATE] Updating record ID: ${KPMR_editingId}`);
        const result = await updateMutation.mutateAsync({
          id: KPMR_editingId,
          data: dto,
        });
        console.log('✅ [UPDATE SUCCESS] Response:', result);

        await handleAuditLog('UPDATE', `Mengupdate data - Aspek: "${dto.aspekTitle}", Section: ${dto.sectionNo}`, true, {
          id_kpmr_likuiditas: KPMR_editingId,
          aspek: dto.aspekTitle,
          section: dto.sectionNo,
          skor: dto.sectionSkor,
          indikator: dto.indikator,
          indikator_length: dto.indikator?.length,
        });
      } else {
        console.log('🆕 [CREATE] Creating new record');
        const result = await createMutation.mutateAsync(dto);
        console.log('✅ [CREATE SUCCESS] Response:', result);

        await handleAuditLog('CREATE', `Menambahkan data - Aspek: "${dto.aspekTitle}", Section: ${dto.sectionNo}`, true, {
          aspek: dto.aspekTitle,
          section: dto.sectionNo,
          skor: dto.sectionSkor,
          bobot: dto.aspekBobot,
          indikator: dto.indikator,
          indikator_length: dto.indikator?.length,
        });
      }

      console.log('🎉 [SUCCESS] Operation completed, resetting form...');
      KPMR_resetForm();
      refetch(); // Refresh data setelah submit berhasil
    } catch (error) {
      console.group('❌ [SUBMIT ERROR] Detailed Error Information');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      console.error('Error config:', error.config);
      console.groupEnd();

      const action = KPMR_editingId ? 'UPDATE' : 'CREATE';
      const errorMessage = error.response?.data?.message || error.message || 'Gagal menyimpan data';

      console.log(`📛 [AUDIT ERROR] Logging failed ${action} attempt`);
      await handleAuditLog(action, `Gagal ${KPMR_editingId ? 'update' : 'tambah'} data - Aspek: "${KPMR_form.aspekTitle}", Section: ${KPMR_form.sectionNo}`, false, {
        error: errorMessage,
        aspek: KPMR_form.aspekTitle,
        section: KPMR_form.sectionNo,
        indikator: KPMR_form.indikator,
        indikator_length: KPMR_form.indikator?.length,
        error_details: {
          response_status: error.response?.status,
          response_data: error.response?.data,
        },
      });

      setSubmitError('Gagal menyimpan data: ' + errorMessage);
    } finally {
      console.log('🏁 [SUBMIT COMPLETE] Setting isSubmitting to false');
      setIsSubmitting(false);
    }
  };

  // ✅ HANDLE EDIT DENGAN AUDIT LOG
  const KPMR_startEdit = (id) => {
    const item = KPMR_rows.find((r) => r.id_kpmr_likuiditas === id);
    if (item) {
      // Update form dengan data yang akan diedit menggunakan setFormData langsung
      setFormData({
        year: item.year,
        quarter: item.quarter,
        aspekNo: item.aspekNo || '',
        aspekBobot: item.aspekBobot || 0,
        aspekTitle: item.aspekTitle || '',
        sectionNo: item.sectionNo || '',
        indikator: item.indikator || '', // ✅ PASTIKAN INDIKATOR DI-SET
        sectionSkor: item.sectionSkor || 0,
        strong: item.strong || '',
        satisfactory: item.satisfactory || '',
        fair: item.fair || '',
        marginal: item.marginal || '',
        unsatisfactory: item.unsatisfactory || '',
        evidence: item.evidence || '',
      });

      setKPMR_editingId(id);

      // Audit log untuk memulai edit
      handleAuditLog('UPDATE', `Memulai edit data - Aspek: "${item.aspekTitle}", Section: ${item.sectionNo}`, true, {
        id_kpmr_likuiditas: id,
        aspek: item.aspekTitle,
        section: item.sectionNo,
        indikator: item.indikator, // ✅ TAMBAHKAN INDIKATOR DI AUDIT LOG
      });
    }
  };

  // ✅ HANDLE DELETE DENGAN AUDIT LOG
  // ✅ HANDLE DELETE DENGAN OPTIMISTIC UPDATE
  const KPMR_handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      return;
    }

    try {
      const item = KPMR_rows.find((r) => r.id_kpmr_likuiditas === id);

      if (item) {
        await handleAuditLog('DELETE', `Menghapus data - Aspek: "${item.aspekTitle}", Section: ${item.sectionNo}`, true, {
          id_kpmr_likuiditas: id,
          aspek: item.aspekTitle,
          section: item.sectionNo,
          indikator: item.indikator,
        });
      }

      // ✅ GUNAKAN MUTATE (BUKAN MUTATEASYNC) UNTUK OPTIMISTIC UPDATE
      deleteMutation.mutate(id, {
        onSuccess: () => {
          console.log('✅ Data berhasil dihapus (optimistically)');

          if (KPMR_editingId === id) {
            KPMR_resetForm();
          }
        },
        onError: (error) => {
          console.error('❌ Gagal menghapus data:', error);
          alert('Gagal menghapus data: ' + error.message);
        },
      });
    } catch (error) {
      console.error('Error in delete handler:', error);
      alert('Terjadi error: ' + error.message);
    }
  };

  // ✅ HANDLE EXPORT DENGAN AUDIT LOG
  const handleExportKPMR = () => {
    try {
      if (typeof exportKPMRInvestasiToExcel === 'function') {
        exportKPMRInvestasiToExcel({
          year: viewYear,
          quarter: viewQuarter,
          rows: KPMR_filtered,
        });

        handleAuditLog('EXPORT', `Export data periode ${viewYear}-${viewQuarter}`, true, {
          total_records: KPMR_filtered.length,
          file_type: 'EXCEL',
        });
      } else {
        handleAuditLog('EXPORT', `Gagal export data - fungsi tidak ditemukan`, false, {
          error: 'Fungsi exportKPMRInvestasiToExcel tidak ditemukan',
        });
        alert('Fungsi exportKPMRInvestasiToExcel tidak ditemukan.');
      }
    } catch (error) {
      handleAuditLog('EXPORT', `Error export data`, false, {
        error: error.message,
        year: viewYear,
        quarter: viewQuarter,
      });
      alert('Terjadi error saat export: ' + error.message);
    }
  };

  // ✅ PERBAIKAN: Effect untuk update form ketika periode berubah
  useEffect(() => {
    // Hanya update jika form sedang tidak dalam mode edit
    if (!KPMR_editingId) {
      setFormData((prev) => ({
        ...prev,
        year: viewYear,
        quarter: viewQuarter,
      }));
    }
  }, [viewYear, viewQuarter, KPMR_editingId, setFormData]);

  // Calculate aspek average untuk form
  const aspekAverage = useMemo(() => {
    const sameAspek = KPMR_filtered.filter((r) => r.aspekNo === KPMR_form.aspekNo && r.aspekTitle === KPMR_form.aspekTitle);
    return calculateAspekAverage(sameAspek);
  }, [KPMR_filtered, KPMR_form.aspekNo, KPMR_form.aspekTitle, calculateAspekAverage]);

  // Handler untuk form changes
  const KPMR_handleChange = (field, value) => {
    updateField(field, value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="rounded-xl shadow-sm bg-white">
        <div className="px-4 py-4 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-gray-800">KPMR – Likuiditas</h1>

          <div className="flex items-center gap-2">
            <div>
              <input
                type="number"
                value={viewYear}
                onChange={(e) => {
                  const v = Number(e.target.value || new Date().getFullYear());
                  setViewYear(v);
                }}
                className="w-20 rounded-xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                min="2000"
                max="2100"
              />
            </div>

            <div>
              <select
                value={viewQuarter}
                onChange={(e) => {
                  const v = e.target.value;
                  setViewQuarter(v);
                }}
                className="rounded-xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="Q1">Q1</option>
                <option value="Q2">Q2</option>
                <option value="Q3">Q3</option>
                <option value="Q4">Q4</option>
              </select>
            </div>

            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari aspek/section/evidence…"
                className="pl-9 pr-3 py-2 rounded-xl border border-gray-300 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
                aria-label="Cari data KPMR"
              />
              <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <button onClick={handleExportKPMR} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border border-gray-300 bg-gray-900 text-white hover:bg-black transition-colors" disabled={KPMR_filtered.length === 0}>
              <Download size={18} /> Export {viewYear}-{viewQuarter}
            </button>
          </div>
        </div>
      </header>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Memuat data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-800 font-medium">Error: {error.message}</p>
          <button onClick={() => refetch()} className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Coba Lagi
          </button>
        </div>
      )}

      {/* FORM KPMR */}
      {!isLoading && (
        <section className={`rounded-2xl border shadow p-4 ${PNM_BRAND.gradient} text-white`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold drop-shadow">{KPMR_editingId ? 'Edit Data KPMR – Likuiditas' : 'Form KPMR – Likuiditas'}</h2>
            <div className="text-sm text-white/90">
              Periode:{' '}
              <span className="font-semibold">
                {KPMR_form.year}-{KPMR_form.quarter}
              </span>
            </div>
          </div>

          {/* Error Messages */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              {Object.entries(errors).map(([field, message]) => (
                <p key={field} className="text-white text-sm">
                  {message}
                </p>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Kolom kiri */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <div className="mb-1 text-[13px] text-white/90 font-medium">Aspek (No)</div>
                  <input
                    className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40 border-0"
                    value={KPMR_form.aspekNo}
                    onChange={(e) => KPMR_handleChange('aspekNo', e.target.value)}
                    placeholder="A1"
                  />
                </label>

                <label className="block">
                  <div className="mb-1 text-[13px] text-white/90 font-medium">Bobot Aspek</div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      className="w-full rounded-xl pl-3 pr-10 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40 border-0"
                      value={KPMR_form.aspekBobot}
                      onChange={(e) => KPMR_handleChange('aspekBobot', e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0.00"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                  </div>
                </label>
              </div>

              <label className="block">
                <div className="mb-1 text-[13px] text-white/90 font-medium">Judul Aspek</div>
                <input
                  className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40 border-0"
                  value={KPMR_form.aspekTitle}
                  onChange={(e) => KPMR_handleChange('aspekTitle', e.target.value)}
                  placeholder="Masukkan judul aspek..."
                />
              </label>

              <div className="grid grid-cols-3 gap-3">
                <label className="block">
                  <div className="mb-1 text-[13px] text-white/90 font-medium">No Section</div>
                  <input
                    className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40 border-0"
                    value={KPMR_form.sectionNo}
                    onChange={(e) => KPMR_handleChange('sectionNo', e.target.value)}
                    placeholder="A1.1"
                  />
                </label>

                <label className="block">
                  <div className="mb-1 text-[13px] text-white/90 font-medium">Skor Section</div>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40 border-0"
                    value={KPMR_form.sectionSkor}
                    onChange={(e) => KPMR_handleChange('sectionSkor', e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="1-5"
                  />
                </label>

                <label className="block">
                  <div className="mb-1 text-[13px] text-white/90 font-medium">Skor Average Aspek</div>
                  <input className="w-full rounded-xl px-3 py-2 bg-white/70 text-gray-900 border-0 cursor-not-allowed" value={aspekAverage} readOnly />
                </label>
              </div>

              <label className="block">
                <div className="mb-1 text-[13px] text-white/90 font-medium">Pertanyaan Section (Indikator)</div>
                <textarea
                  className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 min-h-[64px] focus:outline-none focus:ring-2 focus:ring-white/40 border-0 resize-none"
                  value={KPMR_form.indikator}
                  onChange={(e) => KPMR_handleChange('indikator', e.target.value)}
                  placeholder="Masukkan pertanyaan atau indikator penilaian..."
                />
              </label>

              <label className="block">
                <div className="mb-1 text-[13px] text-white/90 font-medium">Evidence</div>
                <textarea
                  className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 min-h-[56px] focus:outline-none focus:ring-2 focus:ring-white/40 border-0 resize-none"
                  value={KPMR_form.evidence}
                  onChange={(e) => KPMR_handleChange('evidence', e.target.value)}
                  placeholder="Masukkan bukti pendukung..."
                />
              </label>
            </div>

            {/* Kolom kanan: 5 level */}
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((v) => (
                <div key={v} className="rounded-xl shadow-sm bg-white/95 backdrop-blur border border-white/20">
                  <div className="px-3 pt-3 text-[13px] font-semibold text-gray-800">
                    {v}. {['Strong', 'Satisfactory', 'Fair', 'Marginal', 'Unsatisfactory'][v - 1]}
                  </div>
                  <div className="p-3">
                    <textarea
                      className="w-full rounded-lg px-3 py-2 bg-white min-h-[56px] focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-gray-900 border-0 resize-none"
                      value={KPMR_form[`level${v}`]}
                      onChange={(e) => KPMR_handleChange(`level${v}`, e.target.value)}
                      placeholder={`Deskripsi ${v} (${['Strong', 'Satisfactory', 'Fair', 'Marginal', 'Unsatisfactory'][v - 1]})…`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tombol aksi */}
          <div className="flex justify-end gap-2 mt-4">
            {KPMR_editingId ? (
              <div className="flex gap-2">
                <button onClick={KPMR_handleSubmit} disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-white text-gray-900 hover:bg-gray-100 disabled:opacity-50 transition-colors font-medium">
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
                <button
                  onClick={KPMR_resetForm}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border border-white/30 bg-transparent text-white hover:bg-white/10 disabled:opacity-50 transition-colors"
                >
                  <X size={16} /> Batal
                </button>
              </div>
            ) : (
              <button
                onClick={KPMR_handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 bg-white/90 text-gray-900 font-semibold px-5 py-2 rounded-lg shadow mt-7 hover:bg-white disabled:opacity-50 transition-colors"
              >
                <Plus size={16} /> {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
              </button>
            )}
          </div>
        </section>
      )}

      {/* Tabel hasil KPMR - BAGIAN YANG DIPERBAIKI */}
      {!isLoading && (
        <section className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="px-4 py-3 bg-gray-100 border-b flex justify-between items-center">
            <div className="font-semibold text-gray-800">
              Data KPMR – Likuiditas ({viewYear}-{viewQuarter}) - {KPMR_filtered.length} records
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Rata-rata Total: <span className="font-bold text-green-600">{groupedData.overallAverage?.toFixed(2) || '0.00'}</span>
              </span>
              <button onClick={() => refetch()} className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                Refresh Data
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1400px] text-sm border border-gray-300 border-collapse">
              <thead>
                <tr className="bg-[#1f4e79] text-white">
                  <th className="border px-3 py-2 text-left" colSpan={2}>
                    KUALITAS PENERAPAN MANAJEMEN RISIKO
                  </th>
                  <th className="border px-3 py-2 text-center w-24" rowSpan={2}>
                    Skor
                  </th>
                  <th className="border px-3 py-2 text-center w-40" rowSpan={2}>
                    1 (Strong)
                  </th>
                  <th className="border px-3 py-2 text-center w-40" rowSpan={2}>
                    2 (Satisfactory)
                  </th>
                  <th className="border px-3 py-2 text-center w-40" rowSpan={2}>
                    3 (Fair)
                  </th>
                  <th className="border px-3 py-2 text-center w-40" rowSpan={2}>
                    4 (Marginal)
                  </th>
                  <th className="border px-3 py-2 text-center w-44" rowSpan={2}>
                    5 (Unsatisfactory)
                  </th>
                  <th className="border px-3 py-2 text-center w-[260px]" rowSpan={2}>
                    Evidence
                  </th>
                  <th className="border px-3 py-2 text-center w-28" rowSpan={2}>
                    Aksi
                  </th>
                </tr>
                <tr className="bg-[#1f4e79] text-white">
                  <th className="border px-3 py-2 w-20 text-center">No</th>
                  <th className="border px-3 py-2">Pertanyaan / Indikator</th>
                </tr>
              </thead>

              <tbody>
                {filteredTableData.length === 0 ? (
                  <tr>
                    <td className="border px-3 py-8 text-center text-gray-500" colSpan={10}>
                      {isLoading ? 'Memuat data...' : 'Belum ada data untuk periode ini'}
                    </td>
                  </tr>
                ) : (
                  filteredTableData.map((row) => {
                    if (row.type === 'aspek') {
                      // RENDER BARIS ASPEK
                      const group = row.data;
                      return (
                        <tr key={row.id} className="bg-[#e9f5e1] hover:bg-[#d4e9c6] transition-colors">
                          <td className="border px-3 py-2 font-semibold" colSpan={2}>
                            {group.aspekNo} : {group.aspekTitle} <span className="text-gray-600">(Bobot: {group.aspekBobot}%)</span>
                          </td>
                          <td className="border px-3 py-2 text-center font-bold" style={{ backgroundColor: '#93d150' }}>
                            {group.skorAverage?.toFixed(2) || '0.00'}
                          </td>
                          <td className="border px-3 py-2" colSpan={6}></td>
                          <td className="border px-3 py-2"></td>
                        </tr>
                      );
                    } else {
                      // RENDER BARIS SECTION
                      const item = row.data;
                      return (
                        <tr key={row.id} className="align-top hover:bg-gray-50 transition-colors">
                          <td className="border px-2 py-2 text-center font-medium">{item.sectionNo}</td>
                          <td className="border px-2 py-2 whitespace-pre-wrap">{item.indikator || <span className="text-gray-400 italic">- Tidak ada indikator -</span>}</td>
                          <td className="border px-2 py-2 text-center font-semibold">{item.sectionSkor}</td>
                          <td className="border px-2 py-2 whitespace-pre-wrap text-sm">{item.strong || '-'}</td>
                          <td className="border px-2 py-2 whitespace-pre-wrap text-sm">{item.satisfactory || '-'}</td>
                          <td className="border px-2 py-2 whitespace-pre-wrap text-sm">{item.fair || '-'}</td>
                          <td className="border px-2 py-2 whitespace-pre-wrap text-sm">{item.marginal || '-'}</td>
                          <td className="border px-2 py-2 whitespace-pre-wrap text-sm">{item.unsatisfactory || '-'}</td>
                          <td className="border px-2 py-2 whitespace-pre-wrap text-sm">{item.evidence || '-'}</td>
                          <td className="border px-2 py-2">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => KPMR_startEdit(item.id_kpmr_likuiditas)}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                                title="Edit baris ini"
                                disabled={isSubmitting}
                              >
                                <Edit3 size={14} /> Edit
                              </button>
                              <button
                                onClick={() => KPMR_handleDelete(item.id_kpmr_likuiditas)}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded border border-red-300 hover:bg-red-50 text-red-600 transition-colors"
                                title="Hapus baris ini"
                                disabled={isSubmitting}
                              >
                                <Trash2 size={14} /> Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  })
                )}

                {/* Baris rata-rata total */}
                {groupedData.groups && groupedData.groups.length > 0 && (
                  <tr className="bg-[#c9daf8] font-semibold hover:bg-[#b8cff5] transition-colors">
                    <td colSpan={2} className="border px-3 py-2 text-right">
                      Rata-rata Total:
                    </td>
                    <td className="border px-3 py-2 text-center font-bold text-lg" style={{ backgroundColor: '#93d150' }}>
                      {groupedData.overallAverage?.toFixed(2) || '0.00'}
                    </td>
                    <td colSpan={7} className="border px-3 py-2"></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
