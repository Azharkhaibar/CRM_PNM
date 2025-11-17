import React, { useState, useMemo, useEffect } from 'react';
import { Download, Search, BarChart3 } from 'lucide-react';
import FormSection from './components/investasi/form-investasi';
import DataTable from './components/investasi/datatable-investasi';
import { getCurrentQuarter, getCurrentYear } from './utils/investasi/time';
import { computeWeighted } from './utils/investasi/calc';
import { exportInvestasiToExcel } from './utils/investasi/exportExcel';
import { useInvestasi } from './hooks/investasi/investasi.hook';
import { useAuditLog } from '../../../audit-log/hooks/audit-log.hooks';
import { useAuth } from '../../../../../auth/hooks/useAuth.hook';

const YearInput = ({ value, onChange }) => (
  <select value={value} onChange={(e) => onChange(Number(e.target.value))} className="rounded-xl border border-gray-300 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium">
    {[2022, 2023, 2024, 2025].map((y) => (
      <option key={y} value={y}>
        {y}
      </option>
    ))}
  </select>
);

const QuarterSelect = ({ value, onChange }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-xl border border-gray-300 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium">
    {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
      <option key={q} value={q}>
        {q}
      </option>
    ))}
  </select>
);

const invFallbackEmpty = (year, quarter) => ({
  year,
  quarter,
  no: '',
  subNo: '',
  sectionLabel: '',
  indikator: '',
  bobotSection: 0,
  bobotIndikator: 0,
  sumberRisiko: '',
  dampak: '',
  low: '',
  lowToModerate: '',
  moderate: '',
  moderateToHigh: '',
  high: '',
  numeratorLabel: '',
  numeratorValue: '',
  denominatorLabel: '',
  denominatorValue: '',
  hasil: '',
  peringkat: 1,
  weighted: '',
  keterangan: '',
});

export default function InvestasiPage() {
  // ====== Periode + Search ======
  const [viewYear, setViewYear] = useState(getCurrentYear());
  const [viewQuarter, setViewQuarter] = useState(getCurrentQuarter());
  const [query, setQuery] = useState('');
  const [localerror, setLocalError] = useState(null);

  // ====== Service Integration ======
  const { user: authUser } = useAuth();
  const { loading, investasiDt, error, createInvestasi, updateInvestasi, deleteInvestasiDt, fetchInvestDt } = useInvestasi({
    year: viewYear,
    quarter: viewQuarter,
    query: query,
  });

  const { logUpdate, logDelete, logExport } = useAuditLog();

  // ====== Form State ======
  const [INVESTASI_form, setINVESTASI_form] = useState(invFallbackEmpty(viewYear, viewQuarter));
  const [INVESTASI_editingId, setINVESTASI_editingId] = useState(null);

  useEffect(() => {
    setLocalError(null);
  }, [INVESTASI_form]);

  const handleAuditLog = async (action, description, isSuccess = true, metadata = {}) => {
    try {
      console.log('🔍 [AUTH DEBUG] useAuth hook data:', {
        authUser,
        hasAuthUser: !!authUser,
        authUserType: typeof authUser,
        authUserKeys: authUser ? Object.keys(authUser) : 'No authUser',
      });

      const localStorageUser = localStorage.getItem('user');
      console.log('🔍 [AUTH DEBUG] localStorage user:', localStorageUser);

      if (localStorageUser) {
        const parsedLocalUser = JSON.parse(localStorageUser);
        console.log('🔍 [AUTH DEBUG] Parsed localStorage user:', {
          user_id: parsedLocalUser.user_id,
          userID: parsedLocalUser.userID,
          role: parsedLocalUser.role,
          allFields: Object.keys(parsedLocalUser),
        });
      }

      const userId = authUser?.user_id || authUser?.id;
      console.log('🔍 [AUTH DEBUG] Final userId for audit:', userId);

      const auditData = {
        action,
        module: 'INVESTASI',
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

      console.log('📝 [AUTH DEBUG] Final audit data:', auditData);

      switch (action) {
        // case 'CREATE':
        //   await logCreate('INVESTASI', description, {
        //     isSuccess,
        //     userId: userId || null,
        //     metadata: auditData.metadata,
        //   });
        //   break;
        case 'UPDATE':
          await logUpdate('INVESTASI', description, {
            isSuccess,
            userId: userId || null,
            metadata: auditData.metadata,
          });
          break;
        case 'DELETE':
          await logDelete('INVESTASI', description, {
            isSuccess,
            userId: userId || null,
            metadata: auditData.metadata,
          });
          break;
        case 'EXPORT':
          await logExport('INVESTASI', description, {
            isSuccess,
            userId: userId || null,
            metadata: auditData.metadata,
          });
          break;
        default:
          break;
      }

      console.log('✅ [AUTH DEBUG] Audit logged with userId:', userId);
    } catch (error) {
      console.error('❌ [AUTH DEBUG] Audit failed:', error);
    }
  };

  // Convert service data to form format
  const convertFormToService = (formData) => {
    const num = Number(formData.numeratorValue || 0);
    const den = Number(formData.denominatorValue || 0);
    const hasil = den !== 0 ? (num / den) * 100 : 0;
    const weightedAuto = computeWeighted(Number(formData.bobotSection || 0), Number(formData.bobotIndikator || 0), Number(formData.peringkat || 1));

    let no_indikator;
    try {
      no_indikator = Number(formData.subNo);
      if (isNaN(no_indikator)) {
        const match = formData.subNo?.match(/(\d+\.?\d*)/);
        no_indikator = match ? parseFloat(match[1]) : 1.1;
      }
    } catch (e) {
      no_indikator = 1.1;
    }

    const serviceData = {
      no: Number(formData.no || 1),
      parameter: formData.sectionLabel?.trim() || 'Default Parameter',
      bobot: Number(formData.bobotSection || 0),
      no_indikator: no_indikator,
      indikator: formData.indikator?.trim() || 'Default Indikator',
      bobot_indikator: Number(formData.bobotIndikator || 0),
      sumber_resiko: formData.sumberRisiko?.trim() || '',
      dampak: formData.dampak?.trim() || '',
      low: formData.low?.trim() || '',
      low_to_moderate: formData.lowToModerate?.trim() || '',
      moderate: formData.moderate?.trim() || '',
      moderate_to_high: formData.moderateToHigh?.trim() || '',
      high: formData.high?.trim() || '',
      hasil: hasil,
      peringkat: Number(formData.peringkat || 1),
      weighted: Number(weightedAuto || 0),
      keterangan: formData.keterangan?.trim() || '',
      total_pembilang: Number(formData.numeratorValue || 0),
      total_penyebut: Number(formData.denominatorValue || 0),
      nama_pembilang: formData.numeratorLabel?.trim() || '',
      nama_penyebut: formData.denominatorLabel?.trim() || '',
      pereview_hasil: hasil,
    };

    console.log('Converted service data - no_indikator:', serviceData.no_indikator, 'type:', typeof serviceData.no_indikator);
    return serviceData;
  };

  const INVESTASI_resetForm = () => {
    setINVESTASI_form(invFallbackEmpty(viewYear, viewQuarter));
    setINVESTASI_editingId(null);
  };

  // ====== ✅ FIXED: Enhanced INVESTASI_addRow dengan Audit Log ======
  // const INVESTASI_addRow = async () => {
  //   try {
  //     const validationErrors = [];

  //     if (!INVESTASI_form.sectionLabel?.trim()) {
  //       validationErrors.push('Nama Parameter harus diisi');
  //     }
  //     if (!INVESTASI_form.indikator?.trim()) {
  //       validationErrors.push('Indikator Kinerja harus diisi');
  //     }
  //     if (!INVESTASI_form.no || isNaN(Number(INVESTASI_form.no))) {
  //       validationErrors.push('Nomor harus berupa angka yang valid');
  //     }
  //     if (!INVESTASI_form.subNo?.trim()) {
  //       validationErrors.push('Sub Nomor harus diisi');
  //     } else {
  //       const subNoNumber = Number(INVESTASI_form.subNo);
  //       if (isNaN(subNoNumber)) {
  //         validationErrors.push('Sub Nomor harus berupa angka yang valid (contoh: 1.1, 2.3, dll)');
  //       }
  //     }
  //     if (isNaN(Number(INVESTASI_form.bobotSection))) {
  //       validationErrors.push('Bobot Section harus berupa angka');
  //     }
  //     if (isNaN(Number(INVESTASI_form.bobotIndikator))) {
  //       validationErrors.push('Bobot Indikator harus berupa angka');
  //     }
  //     if (isNaN(Number(INVESTASI_form.peringkat))) {
  //       validationErrors.push('Peringkat harus berupa angka');
  //     }

  //     if (validationErrors.length > 0) {
  //       await handleAuditLog('CREATE', `Gagal validasi tambah data investasi - ${validationErrors.join(', ')}`, false, { validationErrors });
  //       alert('Silakan perbaiki kesalahan berikut:\n\n' + validationErrors.join('\n'));
  //       return;
  //     }

  //     const serviceData = convertFormToService(INVESTASI_form);
  //     console.log('Sending data to server - no_indikator:', serviceData.no_indikator, 'type:', typeof serviceData.no_indikator);

  //     // ✅ Log audit sebelum create
  //     await handleAuditLog('CREATE', `Menambahkan data investasi - Parameter: "${serviceData.parameter}", Indikator: "${serviceData.indikator}", Sub No: ${serviceData.no_indikator}`, true, {
  //       parameter: serviceData.parameter,
  //       indikator: serviceData.indikator,
  //       no_indikator: serviceData.no_indikator,
  //       bobot: serviceData.bobot,
  //       bobot_indikator: serviceData.bobot_indikator,
  //     });

  //     await createInvestasi(serviceData);
  //     INVESTASI_resetForm();
  //     alert('Data berhasil ditambahkan!');
  //   } catch (err) {
  //     await handleAuditLog('CREATE', `Gagal menambah data investasi - Parameter: "${INVESTASI_form.sectionLabel}", Indikator: "${INVESTASI_form.indikator}"`, false, {
  //       error: err.message,
  //       parameter: INVESTASI_form.sectionLabel,
  //       indikator: INVESTASI_form.indikator,
  //     });
  //     console.error('Gagal menambah data:', err);
  //     alert('Gagal menambah data. Silakan coba lagi.');
  //   }
  // };

  const INVESTASI_addRow = async () => {
    try {
      const validationErrors = [];

      if (!INVESTASI_form.sectionLabel?.trim()) {
        validationErrors.push('Nama Parameter harus diisi');
      }
      if (!INVESTASI_form.indikator?.trim()) {
        validationErrors.push('Indikator Kinerja harus diisi');
      }
      if (!INVESTASI_form.no || isNaN(Number(INVESTASI_form.no))) {
        validationErrors.push('Nomor harus berupa angka yang valid');
      }
      if (!INVESTASI_form.subNo?.trim()) {
        validationErrors.push('Sub Nomor harus diisi');
      } else {
        const subNoNumber = Number(INVESTASI_form.subNo);
        if (isNaN(subNoNumber)) {
          validationErrors.push('Sub Nomor harus berupa angka yang valid (contoh: 1.1, 2.3, dll)');
        }
      }
      if (isNaN(Number(INVESTASI_form.bobotSection))) {
        validationErrors.push('Bobot Section harus berupa angka');
      }
      if (isNaN(Number(INVESTASI_form.bobotIndikator))) {
        validationErrors.push('Bobot Indikator harus berupa angka');
      }
      if (isNaN(Number(INVESTASI_form.peringkat))) {
        validationErrors.push('Peringkat harus berupa angka');
      }

      if (validationErrors.length > 0) {
        alert('Silakan perbaiki kesalahan berikut:\n\n' + validationErrors.join('\n'));
        return;
      }

      const serviceData = convertFormToService(INVESTASI_form);
      console.log('Sending data to server - no_indikator:', serviceData.no_indikator, 'type:', typeof serviceData.no_indikator);

      await createInvestasi(serviceData);
      INVESTASI_resetForm();
      alert('Data berhasil ditambahkan!');
    } catch (err) {
      console.error('Gagal menambah data:', err);
      alert('Gagal menambah data. Silakan coba lagi.');
    }
  };

  const INVESTASI_startEdit = (investasi) => {
    setINVESTASI_form(convertFormToService(investasi));
    setINVESTASI_editingId(investasi.id_investasi);

  };

  const INVESTASI_saveEdit = async () => {
    if (!INVESTASI_editingId) return;

    try {
      const serviceData = convertFormToService(INVESTASI_form);

      // await handleAuditLog('UPDATE', `Mengupdate data investasi - Parameter: "${serviceData.parameter}", Indikator: "${serviceData.indikator}", Sub No: ${serviceData.no_indikator}`, true, {
      //   id_investasi: INVESTASI_editingId,
      //   parameter: serviceData.parameter,
      //   indikator: serviceData.indikator,
      //   no_indikator: serviceData.no_indikator,
      //   changes: serviceData,
      // });

      await updateInvestasi(INVESTASI_editingId, serviceData);
      INVESTASI_resetForm();
      alert('Data berhasil diupdate!');
    } catch (err) {
      await handleAuditLog('UPDATE', `Gagal update data investasi - Parameter: "${INVESTASI_form.sectionLabel}", Indikator: "${INVESTASI_form.indikator}"`, false, {
        id_investasi: INVESTASI_editingId,
        error: err.message,
        parameter: INVESTASI_form.sectionLabel,
        indikator: INVESTASI_form.indikator,
      });
      console.error('Gagal mengupdate data:', err);
      alert('Gagal mengupdate data. Silakan coba lagi.');
    }
  };

 
  const INVESTASI_removeRow = async (investasi) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        await handleAuditLog('DELETE', `Menghapus data investasi - Parameter: "${investasi.parameter || investasi.sectionLabel}", Indikator: "${investasi.indikator}", Sub No: ${investasi.no_indikator || investasi.subNo}`, true, {
          id_investasi: investasi.id_investasi,
          parameter: investasi.parameter,
          indikator: investasi.indikator,
          no_indikator: investasi.no_indikator,
        });

        await deleteInvestasiDt(investasi.id_investasi);

        if (INVESTASI_editingId === investasi.id_investasi) {
          INVESTASI_resetForm();
        }

        alert('Data berhasil dihapus!');
      } catch (err) {
        await handleAuditLog('DELETE', `Gagal menghapus data investasi - Parameter: "${investasi.parameter || investasi.sectionLabel}", Indikator: "${investasi.indikator}"`, false, {
          id_investasi: investasi.id_investasi,
          error: err.message,
          parameter: investasi.parameter,
          indikator: investasi.indikator,
        });
        console.error('Gagal menghapus data:', err);
        alert('Gagal menghapus data. Silakan coba lagi.');
      }
    } else {
      //  untuk menghindari duplikasi
    }
  };

  const INVESTASI_exportExcel = () => {
    try {
      if (exportInvestasiToExcel) {
        handleAuditLog('EXPORT', `Export data Excel investasi - Periode: ${viewYear}-${viewQuarter}, Jumlah Data: ${investasiDt.length}`, true, {
          year: viewYear,
          quarter: viewQuarter,
          total_records: investasiDt.length,
          file_type: 'excel',
        });

        exportInvestasiToExcel(investasiDt, viewYear, viewQuarter);
      }
    } catch (err) {
      handleAuditLog('EXPORT', `Gagal export data Excel investasi - Periode: ${viewYear}-${viewQuarter}`, false, {
        year: viewYear,
        quarter: viewQuarter,
        error: err.message,
      });
      console.error('Gagal export Excel:', err);
    }
  };

  // ====== useEffect untuk log search ======
  // useEffect(() => {
  //   if (query) {
  //     handleAuditLog('VIEW', `Mencari data investasi - Keyword: "${query}", Periode: ${viewYear}-${viewQuarter}`, true, {
  //       search_query: query,
  //       year: viewYear,
  //       quarter: viewQuarter,
  //     });
  //   }
  // }, [query]);

  // ====== useEffect untuk log periode change ======
  // useEffect(() => {
  //   handleAuditLog('VIEW', `Mengubah periode view investasi - Periode: ${viewYear}-${viewQuarter}`, true, {
  //     year: viewYear,
  //     quarter: viewQuarter,
  //     action: 'period_change',
  //   });
  // }, [viewYear, viewQuarter]);

  const INVESTASI_filtered = useMemo(() => {
    return investasiDt.sort((a, b) => (a.no_indikator || a.subNo).localeCompare(b.no_indikator || b.subNo, undefined, { numeric: true }));
  }, [investasiDt]);

  const INVESTASI_totalWeighted = useMemo(() => {
    return INVESTASI_filtered.reduce((sum, r) => sum + (Number(r.weighted || 0) || 0), 0);
  }, [INVESTASI_filtered]);

  useEffect(() => {
    fetchInvestDt();
  }, [viewYear, viewQuarter, query]);

  return (
    <div className="space-y-6 mx-auto">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg text-white p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold">Investasi</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <YearInput value={viewYear} onChange={(v) => setViewYear(v)} />
          <QuarterSelect value={viewQuarter} onChange={(v) => setViewQuarter(v)} />
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari indikator / parameter / keterangan…"
              className="pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/70 w-64 backdrop-blur-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
          </div>
          <button onClick={INVESTASI_exportExcel} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg">
            <Download className="w-5 h-5" />
            Export {viewYear}-{viewQuarter}
          </button>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Error: {error}</span>
          </div>
        </div>
      )}

      <FormSection
        form={INVESTASI_form}
        setForm={setINVESTASI_form}
        onAdd={INVESTASI_addRow}
        onSave={INVESTASI_saveEdit}
        onReset={INVESTASI_resetForm}
        editing={INVESTASI_editingId !== null}
        loading={loading}
        title={INVESTASI_editingId !== null ? 'Edit Data Investasi' : 'Tambah Data Investasi'}
      />

      <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <span className="font-medium text-gray-700">Tampilkan Periode:</span>
          <YearInput value={viewYear} onChange={setViewYear} />
          <QuarterSelect value={viewQuarter} onChange={setViewQuarter} />
        </div>
        <div className="text-sm font-semibold text-green-600">Total Weighted: {Number(INVESTASI_totalWeighted || 0).toFixed(4)}</div>
      </section>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Memuat data...</span>
        </div>
      )}


      {!loading && <DataTable rows={INVESTASI_filtered} totalWeighted={INVESTASI_totalWeighted} viewYear={viewYear} viewQuarter={viewQuarter} startEdit={INVESTASI_startEdit} removeRow={INVESTASI_removeRow} logAudit={handleAuditLog} />}
    </div>
  );
}
