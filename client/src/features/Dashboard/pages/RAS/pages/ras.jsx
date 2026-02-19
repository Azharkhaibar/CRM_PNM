// src/features/Dashboard/pages/RAS/ras.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Download, Search, ShieldAlert, Plus, Check, X, Info, Upload, Calendar, BarChart3, Layers, LayoutList, Trash2, ChevronDown, ChevronUp, RotateCcw, AlertTriangle, Loader2 } from 'lucide-react';

// Import komponen
import RiskAttitude from '../components/risk-attitude.jsx';
import TindakLanjut from '../components/tindak-lanjut.jsx';
import RasForm from '../components/ras-form.jsx';
import RasYearlyTable from '../components/ras-yearly-table.jsx';
import RasMonthlyTable from '../components/ras-monthly-table.jsx';
import MultiMonthSelector from '../components/multi-month-selector.jsx';
import { useAuditLog } from '../../audit-log/hooks/audit-log.hooks.js';
import useRas from '../hook/useRas.hook.js';
import { useAuth } from '../../../../auth/hooks/useAuth.hook.js';
// Import utils
import { exportRasMonthly, exportRasYearly } from '../utils/export-excel.js';
import { parseExcelFile } from '../utils/import-excel.js';
import { MONTH_OPTIONS } from '../utils/ras-constant.js';

const getCurrentYear = () => new Date().getFullYear();
const getCurrentMonthIndex = () => new Date().getMonth();

const YearInput = ({ selectedYear, onChange }) => {
  return (
    <div className="flex items-center bg-white rounded-xl border border-gray-300 px-3 py-2 shadow-sm h-[46px] w-[140px]">
      <input type="number" value={selectedYear} onChange={(e) => onChange(parseInt(e.target.value) || '')} className="w-full text-sm font-medium text-black bg-transparent outline-none border-none p-0 focus:ring-0" min="2000" max="2100" />
    </div>
  );
};

export default function Ras() {
  const [viewYear, setViewYear] = useState(getCurrentYear());
  const [selectedMonths, setSelectedMonths] = useState([getCurrentMonthIndex()]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('monthly');
  const [showForm, setShowForm] = useState(false);
  const [showRiskInfo, setShowRiskInfo] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const fileInputRef = useRef(null);
  const [showNumDenom, setShowNumDenom] = useState(true);
  const [showDetailColumns, setShowDetailColumns] = useState(true);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUpData, setFollowUpData] = useState(null);

  // Auth dan Audit Log
  const { user: authUser } = useAuth();
  const { logCreate, logUpdate, logDelete, logExport } = useAuditLog();

  // Fungsi untuk mendapatkan user yang login
  const getCurrentUser = () => {
    // Priority: Gunakan user dari useAuth hook
    if (authUser && authUser.user_id) {
      return {
        id: authUser.user_id,
        user_id: authUser.user_id,
        name: authUser.userID || authUser.username || 'Unknown User',
        role: authUser.role || 'User',
      };
    }

    // Fallback: localStorage
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser && storedUser.user_id) {
        return {
          id: storedUser.user_id,
          user_id: storedUser.user_id,
          name: storedUser.userID || storedUser.username || 'Unknown User',
          role: storedUser.role || 'User',
        };
      }
    } catch (e) {
      console.warn('Cannot parse user from localStorage:', e);
    }

    // Default jika tidak ditemukan
    return {
      id: null,
      user_id: null,
      name: 'System',
      role: 'System',
    };
  };

  const currentUser = getCurrentUser();

  const { data, loading, error, categories, fetchByYear, fetchByYearAndMonth, createData, updateData, updateMonthlyValues, updateTindakLanjut, deleteData, importData, testConnection, clearError } = useRas();

  // Fetch data berdasarkan tab aktif
  useEffect(() => {
    const fetchData = async () => {
      if (activeTab === 'monthly') {
        await fetchByYearAndMonth(viewYear);
      } else if (activeTab === 'yearly') {
        await fetchByYear(viewYear);
      }
    };

    fetchData();
  }, [activeTab, viewYear, fetchByYearAndMonth, fetchByYear]);

  // Filter data untuk search
  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.filter((item) => {
      if (item.year !== viewYear) return false;

      const matchSearch = (item.parameter?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || (item.riskCategory?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [data, searchQuery, viewYear]);

  // Handler untuk form CREATE/UPDATE
  const handleSubmit = async (formData) => {
    try {
      let result;
      let isUpdate = !!editingData;

      console.log('Data dari form:', {
        formMonthlyValues: formData.monthlyValues,
        existingMonthlyValues: editingData?.monthlyValues,
        activeTab: activeTab,
      });

      if (editingData) {
        // UPDATE DATA - gabungkan monthlyValues dengan data existing
        const beforeData = { ...editingData };

        // Gabungkan monthlyValues: data lama + data baru dari form
        const mergedMonthlyValues = {
          ...editingData.monthlyValues, // Data existing dari database
          ...formData.monthlyValues, // Data baru dari form (akan override jika ada konflik)
        };

        // Pastikan semua nilai kosong diubah menjadi null
        Object.keys(mergedMonthlyValues).forEach((month) => {
          const monthData = mergedMonthlyValues[month];
          if (monthData) {
            mergedMonthlyValues[month] = {
              num: monthData.num === '' || monthData.num === undefined ? null : monthData.num,
              den: monthData.den === '' || monthData.den === undefined ? null : monthData.den,
              man: monthData.man === '' || monthData.man === undefined ? null : monthData.man,
              calculatedValue: monthData.calculatedValue || null,
            };
          }
        });

        // Siapkan data untuk update
        const updatePayload = {
          ...formData,
          monthlyValues: mergedMonthlyValues,
        };

        console.log('Data yang akan diupdate:', {
          mergedMonthlyValues,
          monthCount: Object.keys(mergedMonthlyValues).length,
        });

        result = await updateData(editingData.id, updatePayload);

        // Log UPDATE ke audit log dengan detail monthly values
        const changedMonths = Object.keys(formData.monthlyValues || {}).filter((month) => formData.monthlyValues[month]?.num || formData.monthlyValues[month]?.den || formData.monthlyValues[month]?.man);

        await logUpdate('RAS', `Update data RAS: ${beforeData.parameter} (ID: ${editingData.id})`, {
          userId: currentUser.id,
          isSuccess: true,
          metadata: {
            id: editingData.id,
            parameter: beforeData.parameter,
            year: viewYear,
            tab: activeTab,
            changedMonths: changedMonths.map((m) => ({
              month: MONTH_OPTIONS[parseInt(m)]?.label || `Bulan ${parseInt(m) + 1}`,
              num: formData.monthlyValues[m]?.num,
              den: formData.monthlyValues[m]?.den,
              man: formData.monthlyValues[m]?.man,
            })),
            before: {
              parameter: beforeData.parameter,
              riskCategory: beforeData.riskCategory,
              rkapTarget: beforeData.rkapTarget,
              rasLimit: beforeData.rasLimit,
              monthlyValuesCount: Object.keys(beforeData.monthlyValues || {}).length,
            },
            after: {
              parameter: formData.parameter,
              riskCategory: formData.riskCategory,
              rkapTarget: formData.rkapTarget,
              rasLimit: formData.rasLimit,
              monthlyValuesCount: Object.keys(mergedMonthlyValues || {}).length,
            },
          },
        });
      } else {
        // CREATE DATA BARU
        console.log('Membuat data baru:', {
          monthlyValues: formData.monthlyValues,
          parameter: formData.parameter,
        });

        // Bersihkan data bulanan sebelum dikirim
        const cleanedMonthlyValues = {};
        if (formData.monthlyValues) {
          Object.keys(formData.monthlyValues).forEach((month) => {
            const monthData = formData.monthlyValues[month];
            if (monthData && (monthData.num || monthData.den || monthData.man)) {
              cleanedMonthlyValues[month] = {
                num: monthData.num === '' ? null : monthData.num,
                den: monthData.den === '' ? null : monthData.den,
                man: monthData.man === '' ? null : monthData.man,
                calculatedValue: monthData.calculatedValue || null,
              };
            }
          });
        }

        const createPayload = {
          ...formData,
          year: viewYear,
          monthlyValues: cleanedMonthlyValues,
        };

        result = await createData(createPayload);

        // Log CREATE ke audit log
        const filledMonths = Object.keys(cleanedMonthlyValues).map((m) => MONTH_OPTIONS[parseInt(m)]?.label || `Bulan ${parseInt(m) + 1}`);

        await logCreate('RAS', `Tambah data RAS baru: ${formData.parameter}`, {
          userId: currentUser.id,
          isSuccess: true,
          metadata: {
            parameter: formData.parameter,
            riskCategory: formData.riskCategory,
            year: viewYear,
            tab: activeTab,
            filledMonths: filledMonths,
            hasNumeratorDenominator: formData.hasNumeratorDenominator,
            rkapTarget: formData.rkapTarget,
            rasLimit: formData.rasLimit,
          },
        });
      }

      setShowForm(false);
      setEditingData(null);

      // Refresh data setelah submit
      if (activeTab === 'monthly') {
        await fetchByYearAndMonth(viewYear);
      } else {
        await fetchByYear(viewYear);
      }

      return result;
    } catch (err) {
      console.error('Gagal menyimpan data:', err);
      console.error('Error details:', err.response?.data || err.message);

      // Log ERROR ke audit log
      const logAction = editingData ? logUpdate : logCreate;
      const actionName = editingData ? 'update' : 'tambah';

      await logAction('RAS', `Gagal ${actionName} data RAS: ${formData.parameter || 'Unknown'}`, {
        userId: currentUser.id,
        isSuccess: false,
        metadata: {
          error: err.message,
          errorDetails: err.response?.data,
          attemptedAction: actionName.toUpperCase(),
          parameter: formData.parameter,
          year: viewYear,
          monthlyValues: formData.monthlyValues,
        },
      });

      alert(err.message || 'Gagal menyimpan data');
      throw err;
    }
  };

  const handleEdit = (item) => {
    setEditingData(item);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah yakin ingin menghapus data ini?')) {
      return;
    }

    try {
      const itemToDelete = data?.find((x) => x.id === id);

      if (!itemToDelete) {
        throw new Error('Data tidak ditemukan');
      }

      // Log sebelum delete untuk menyimpan data
      await logDelete('RAS', `Hapus data RAS: ${itemToDelete.parameter} (ID: ${id})`, {
        userId: currentUser.id,
        isSuccess: true,
        metadata: {
          before: {
            id: itemToDelete.id,
            parameter: itemToDelete.parameter,
            riskCategory: itemToDelete.riskCategory,
            year: itemToDelete.year,
            numerator: itemToDelete.numerator,
            denominator: itemToDelete.denominator,
            target: itemToDelete.target,
          },
        },
      });

      // Eksekusi delete
      await deleteData(id);

      alert('Data berhasil dihapus');

      // Refresh data
      if (activeTab === 'monthly') {
        await fetchByYearAndMonth(viewYear);
      } else {
        await fetchByYear(viewYear);
      }
    } catch (err) {
      console.error('Delete error:', err);

      // Log delete error
      await logDelete('RAS', `Gagal hapus data RAS (ID: ${id})`, {
        userId: currentUser.id,
        isSuccess: false,
        metadata: { error: err.message, id: id },
      });

      alert(err.message || 'Gagal menghapus data');
    }
  };

  const handleInlineUpdate = async (id, field, value) => {
    try {
      const item = data.find((item) => item.id === id);
      if (!item) return;

      const beforeValue = item[field];

      await updateData(id, { [field]: value });

      // Log inline update
      await logUpdate('RAS', `Update inline ${field}: ${item.parameter}`, {
        userId: currentUser.id,
        isSuccess: true,
        metadata: {
          id: id,
          parameter: item.parameter,
          field: field,
          before: beforeValue,
          after: value,
        },
      });
    } catch (err) {
      console.error('Gagal update inline:', err);
      alert('Gagal update data');
    }
  };

  const handleCellClick = (item) => {
    setFollowUpData(item);
    setShowFollowUp(true);
  };

  const handleSaveFollowUp = async (id, followUpResult) => {
    try {
      const item = data.find((item) => item.id === id);
      if (!item) return;

      const beforeFollowUp = item.tindakLanjut || null;

      await updateTindakLanjut(id, followUpResult);

      // Log update tindak lanjut
      await logUpdate('RAS', `Update tindak lanjut: ${item.parameter}`, {
        userId: currentUser.id,
        isSuccess: true,
        metadata: {
          id: id,
          parameter: item.parameter,
          before: beforeFollowUp,
          after: followUpResult,
        },
      });

      setShowFollowUp(false);
      alert('Tindak lanjut berhasil disimpan');

      // Refresh data
      if (activeTab === 'monthly') {
        await fetchByYearAndMonth(viewYear);
      } else {
        await fetchByYear(viewYear);
      }
    } catch (err) {
      console.error('Save follow-up error:', err);

      // Log error
      await logUpdate('RAS', `Gagal update tindak lanjut (ID: ${id})`, {
        userId: currentUser.id,
        isSuccess: false,
        metadata: { error: err.message, id: id },
      });

      alert(err.message || 'Gagal menyimpan tindak lanjut');
    }
  };

  const handleExport = async () => {
    try {
      if (filteredData.length === 0) {
        alert('Tidak ada data untuk diexport');
        return;
      }

      let exportResult;

      if (activeTab === 'monthly') {
        exportResult = exportRasMonthly(filteredData, viewYear, selectedMonths);
        await logExport('RAS', `Export data RAS bulanan tahun ${viewYear}`, {
          userId: currentUser.id,
          isSuccess: true,
          metadata: {
            year: viewYear,
            monthCount: selectedMonths.length,
            dataCount: filteredData.length,
            type: 'monthly',
            months: selectedMonths.map((m) => MONTH_OPTIONS[m]?.label || m),
          },
        });
      } else {
        exportResult = exportRasYearly(filteredData, viewYear, data);
        await logExport('RAS', `Export data RAS tahunan tahun ${viewYear}`, {
          userId: currentUser.id,
          isSuccess: true,
          metadata: {
            year: viewYear,
            dataCount: filteredData.length,
            type: 'yearly',
          },
        });
      }

      return exportResult;
    } catch (err) {
      console.error('Gagal export:', err);

      await logExport('RAS', `Gagal export data RAS`, {
        userId: currentUser.id,
        isSuccess: false,
        metadata: {
          error: err.message,
          year: viewYear,
          tab: activeTab,
        },
      });

      alert('Gagal mengekspor data');
      throw err;
    }
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Parse file Excel
      const importedData = await parseExcelFile(file);

      // Import ke backend (TANPA LOG IMPORT)
      await importData({
        year: viewYear,
        data: importedData,
        overrideExisting: true,
        file: file,
      });

      alert(`Import berhasil! ${importedData.length} data diproses.`);

      // Refresh data
      if (activeTab === 'monthly') {
        await fetchByYearAndMonth(viewYear);
      } else {
        await fetchByYear(viewYear);
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Gagal import: ' + error.message);
    } finally {
      e.target.value = '';
    }
  };

  // Handler untuk update nilai bulanan
  const handleUpdateMonthlyValue = async (id, month, values) => {
    try {
      const item = data.find((item) => item.id === id);
      if (!item) return;

      await updateMonthlyValues(id, month, values);

      // Log update nilai bulanan
      await logUpdate('RAS', `Update nilai bulanan: ${item.parameter} - ${MONTH_OPTIONS[month]?.label || `Bulan ${month + 1}`}`, {
        userId: currentUser.id,
        isSuccess: true,
        metadata: {
          id: id,
          parameter: item.parameter,
          month: month,
          monthName: MONTH_OPTIONS[month]?.label,
          values: values,
          year: viewYear,
        },
      });
    } catch (err) {
      console.error('Gagal update nilai bulanan:', err);
      alert('Gagal update nilai bulanan');
    }
  };

  const handleResetData = async () => {
    if (!window.confirm(`PERINGATAN: Apakah Anda yakin ingin menghapus SELURUH data RAS untuk tahun ${viewYear}? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    try {
      const itemsToDelete = data.filter((item) => item.year === viewYear);

      if (itemsToDelete.length === 0) {
        alert('Tidak ada data untuk tahun ini');
        return;
      }

      // Log batch delete
      await logDelete('RAS', `Reset data RAS tahun ${viewYear} - ${itemsToDelete.length} data`, {
        userId: currentUser.id,
        isSuccess: true,
        metadata: {
          year: viewYear,
          totalItems: itemsToDelete.length,
          items: itemsToDelete.map((item) => ({
            id: item.id,
            parameter: item.parameter,
            riskCategory: item.riskCategory,
          })),
        },
      });

      // Hapus semua data untuk tahun ini
      for (const item of itemsToDelete) {
        try {
          await deleteData(item.id);
        } catch (err) {
          console.error(`Error deleting item ${item.id}:`, err);
        }
      }

      alert(`${itemsToDelete.length} data berhasil dihapus dari tahun ${viewYear}`);
    } catch (err) {
      console.error('Reset error:', err);

      await logDelete('RAS', `Gagal reset data RAS tahun ${viewYear}`, {
        userId: currentUser.id,
        isSuccess: false,
        metadata: { error: err.message, year: viewYear },
      });

      alert('Gagal menghapus data: ' + err.message);
    }
  };

  // Loading state
  if (loading && !showForm) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat data RAS...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !showForm) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-center gap-3 text-red-700 mb-4">
          <AlertTriangle className="w-6 h-6" />
          <h3 className="font-bold text-lg">Koneksi Gagal</h3>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <div className="flex gap-3">
          <button onClick={() => testConnection()} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Test Koneksi
          </button>
          <button onClick={() => clearError()} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            Tutup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mx-auto pb-12">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg text-white p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Risk Appetite Statement</h1>
              <p className="text-blue-100 text-sm">Monitoring Profil Risiko & RAS</p>
            </div>
          </div>

          <div className="flex bg-white/10 p-1 rounded-xl backdrop-blur-sm border border-white/10">
            <button
              onClick={() => setActiveTab('monthly')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'monthly' ? 'bg-white text-blue-700 shadow-sm' : 'text-white hover:bg-white/10'}`}
            >
              <Calendar size={16} />
              RAS (Bulan)
            </button>
            <button
              onClick={() => setActiveTab('yearly')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'yearly' ? 'bg-white text-blue-700 shadow-sm' : 'text-white hover:bg-white/10'}`}
            >
              <BarChart3 size={16} />
              RAS (Tahun)
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-6">
          <YearInput selectedYear={viewYear} onChange={setViewYear} />

          {activeTab === 'monthly' && <MultiMonthSelector selectedMonths={selectedMonths} onChange={setSelectedMonths} />}

          <div className="relative group ml-auto">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari parameter..."
              className="pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/70 w-48 focus:w-64 transition-all h-[46px]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleResetData}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-red-500/80 text-white font-semibold hover:bg-red-600 transition-all shadow-lg h-[46px] border border-red-400/50"
              title="Reset Data"
              disabled={loading}
            >
              <Trash2 className="w-5 h-5" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-all shadow-lg h-[46px]"
              disabled={loading || filteredData.length === 0}
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Export {activeTab === 'monthly' ? 'Bulanan' : 'Tahunan'}</span>
            </button>

            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".xlsx, .xls" className="hidden" />
            <button onClick={handleImportClick} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-green-500 text-white font-semibold hover:bg-green-600 transition-all shadow-lg h-[46px]" disabled={loading}>
              <Upload className="w-5 h-5" />
              <span className="hidden sm:inline">Import</span>
            </button>
          </div>
        </div>
      </header>

      {activeTab === 'monthly' ? (
        <div className="animate-fade-in">
          <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3 text-sm w-full sm:w-auto">
                <span className="text-gray-500">Periode:</span>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-100">{viewYear}</span>
                <span className="text-gray-300">|</span>
                <span className="font-bold text-gray-800">{filteredData.length} Data</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setShowRiskInfo(!showRiskInfo)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-sm border transition-all text-sm font-medium ${
                    showRiskInfo ? 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-2 ring-indigo-100' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                  disabled={loading}
                >
                  {showRiskInfo ? <ChevronUp size={18} /> : <Info size={18} />}
                  <span className="hidden sm:inline">{showRiskInfo ? 'Tutup Info' : 'Info Sikap'}</span>
                </button>

                {!showForm && (
                  <button
                    onClick={() => {
                      setEditingData(null);
                      setShowForm(true);
                    }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-blue-700 font-semibold text-sm transition-transform active:scale-95"
                    disabled={loading}
                  >
                    <Plus size={18} /> <span className="hidden sm:inline">Tambah Data</span>
                    <span className="sm:hidden">Tambah</span>
                  </button>
                )}
              </div>
            </div>

            {showRiskInfo && (
              <div className="animate-fade-in-up mt-4 bg-gray-50 rounded-xl border border-indigo-100 p-4 shadow-inner">
                <RiskAttitude />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-gray-100 mt-3">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tampilan:</div>
              <button
                onClick={() => setShowNumDenom(!showNumDenom)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${showNumDenom ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
              >
                {showNumDenom ? <Layers size={14} /> : <Layers size={14} className="opacity-50" />}
                {showNumDenom ? 'Sembunyikan Pembilang/Penyebut' : 'Tampilkan Pembilang/Penyebut'}
              </button>
              <button
                onClick={() => setShowDetailColumns(!showDetailColumns)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${showDetailColumns ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
              >
                {showDetailColumns ? <LayoutList size={14} /> : <LayoutList size={14} className="opacity-50" />}
                {showDetailColumns ? 'Sembunyikan Detail' : 'Tampilkan Detail'}
              </button>
            </div>
          </div>

          {showForm && (
            <div className="animate-fade-in-down mb-8">
              <RasForm
                existingCategories={categories}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingData(null);
                }}
                initialData={editingData}
                allData={data}
                loading={loading}
              />
            </div>
          )}

          <section className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8">
            <div className="p-1">
              <RasMonthlyTable
                rows={filteredData}
                year={viewYear}
                selectedMonths={selectedMonths}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCellClick={handleCellClick}
                showNumDenom={showNumDenom}
                showDetailColumns={showDetailColumns}
                loading={loading}
                onUpdateMonthlyValue={handleUpdateMonthlyValue}
              />
            </div>
          </section>

          <TindakLanjut isOpen={showFollowUp} onClose={() => setShowFollowUp(false)} data={followUpData} onSave={handleSaveFollowUp} loading={loading} />
        </div>
      ) : (
        <div className="animate-fade-in">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 shadow-sm flex items-start gap-3">
            <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-orange-900 font-bold text-sm">Mode Perencanaan RAS Tahunan</h3>
              <p className="text-orange-800 text-xs mt-1">
                Anda sedang melihat dan merencanakan target untuk Tahun <b>{viewYear}</b>. Data historis dan statistik diambil dari realisasi Tahun <b>{viewYear - 1}</b> dan <b>{viewYear - 2}</b>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6">
            <span className="text-gray-500">Target Tahun:</span>
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">{viewYear}</span>
            <span className="text-gray-400 italic ml-auto text-xs">*Statistik dihitung berdasarkan data historis yang tersedia (Group ID / Nama Parameter sama)</span>
          </div>

          <section className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="p-1">
              <RasYearlyTable rows={filteredData} allData={data} year={viewYear} onUpdate={handleInlineUpdate} loading={loading} />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
