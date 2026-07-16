// src/ojk/rekap/pages/rekap-data-main.jsx
import React, { useMemo, useState, useRef, useEffect } from 'react';
import Header from '../../components/ui/header';
import { useHeaderStore } from '../../store/header';
import { Button } from '@/components/ui/button';
import { ArrowBigLeftDash, ArrowBigRightDash, Save, Copy, Download, Upload, Trash2 } from 'lucide-react';
import UnsaveChangesModal from '../../components/unsave-changed-modal';
import OjkCloneDialog from '../../components/OjkCloneDialog';
import { KategoriFilter, SimpleTable } from './components/rekap-data.components';
import { CATEGORIES, PAGE_SIZE } from './contants/rekap-data.contants.js';
import { useRekapData, useScrollDrag, useHorizontalScroll } from './hooks/rekap-data.hook.ts';
import { calculateGlobalSummary } from './utils/rekap-data.utils.js';
import rekapApiService from './services/rekap-data.service';
import { exportOjkRekapDataToExcel } from './utils/exportOjkRekap.js';

export default function RekapData() {
  const { year, activeQuarter, search } = useHeaderStore();

  const {
    dataMap,
    isLoading,
    error,
    selectedPages,
    hasUnsavedChanges,
    filter,
    flattenedRows,
    showUnsaveModal,
    saveAllChanges,
    selectAllPages,
    deselectAllPages,
    togglePage,
    updateFilter,
    confirmAction,
    cancelAction,
    updateRawValue,
    setHasUnsavedChanges,
    setShowUnsaveModal,
    setPendingAction,
    setFilter,
    refreshData,
  } = useRekapData(year, activeQuarter);

  // ====================== CLONING STATES ======================
  const [cloneDialogOpen, setCloneDialogOpen] = useState(false);
  const [inheritInfo, setInheritInfo] = useState(null);

  // ====================== KATEGORI FILTER STATE ======================
  const [kategoriFilter, setKategoriFilter] = useState({
    model: filter.model || '',
    prinsip: filter.prinsip || '',
    jenis: filter.jenis || '',
    underlying: filter.underlying || [],
  });

  // ====================== REFS ======================
  const kategoriScrollRef = useRef(null);
  const paginationRef = useRef(null);
  const fileInputRef = useRef(null);
  const [importing, setImporting] = useState(false);

  const handleExport = () => {
    exportOjkRekapDataToExcel(flattenedRows, year, activeQuarter);
  };

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('year', String(year));
    formData.append('quarter', String(activeQuarter));

    try {
      const result = await rekapApiService.importExcel(formData);
      alert(result.message || `✅ Berhasil mengimpor data!`);
      await refreshData();
    } catch (err) {
      console.error('Import error:', err);
      alert(`❌ Error: ${err.message || 'Gagal mengimpor file Excel.'}`);
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  // ====================== SCROLL HOOKS ======================
  const { handleMouseDown, handleMouseLeave } = useScrollDrag(kategoriScrollRef);
  useHorizontalScroll(kategoriScrollRef);

  // ====================== PAGINATION ======================
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(flattenedRows.length / PAGE_SIZE));

  const pagedRows = flattenedRows.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // ====================== GLOBAL SUMMARY ======================
  const globalSummary = useMemo(() => {
    return calculateGlobalSummary(dataMap, selectedPages, kategoriFilter);
  }, [dataMap, selectedPages, kategoriFilter]);

  // ====================== HANDLERS ======================

  const toggleAllPages = () => {
    if (selectedPages.length === CATEGORIES.length) {
      deselectAllPages();
    } else {
      selectAllPages();
    }
  };

  const handleFilterChange = (newFilter) => {
    if (hasUnsavedChanges) {
      setPendingAction(() => () => {
        setKategoriFilter(newFilter);
        setFilter(newFilter);
        setHasUnsavedChanges(false);
      });
      setShowUnsaveModal(true);
    } else {
      setKategoriFilter(newFilter);
      setFilter(newFilter);
    }
  };

  // HANYA update state, TIDAK save (batch save)
  const handleUpdateRawValue = ({ categoryId, paramId, itemId, field, value }) => {
    updateRawValue({ categoryId, paramId, itemId, field, value });
  };

  const handleSaveAllChanges = () => {
    saveAllChanges();
  };

  const handlePageClick = (page) => {
    if (hasUnsavedChanges) {
      setPendingAction(() => () => {
        setCurrentPage(page);
        setHasUnsavedChanges(false);
      });
      setShowUnsaveModal(true);
    } else {
      setCurrentPage(page);
    }
  };

  const scrollPaginationLeft = () => {
    paginationRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollPaginationRight = () => {
    paginationRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  };

  // ====================== MODAL HANDLERS ======================

  const handleModalSave = () => {
    handleSaveAllChanges();
    confirmAction();
  };

  const handleModalDontSave = () => {
    confirmAction();
    setHasUnsavedChanges(false);
  };

  const handleModalClose = () => {
    cancelAction();
  };

  const handleUndoClone = async () => {
    if (!inheritInfo) return;
    try {
      await rekapApiService.undoClonePeriodData({
        targetYear: inheritInfo.targetYear,
        targetQuarter: inheritInfo.targetQuarter,
        categories: inheritInfo.categories,
      });
      setInheritInfo(null);
      await refreshData();
      alert('Kloning berhasil dibatalkan');
    } catch (err) {
      console.error('Error undoing clone:', err);
      alert('Gagal membatalkan clone');
    }
  };

  const handleResetQuarterData = async () => {
    const confirmReset = window.confirm(
      `Apakah Anda yakin ingin menghapus/mereset semua data profil risiko inherent OJK untuk periode ${year}-Q${activeQuarter}? Tindakan ini tidak dapat dibatalkan.`
    );
    if (!confirmReset) return;

    try {
      await rekapApiService.undoClonePeriodData({
        targetYear: year,
        targetQuarter: activeQuarter,
      });
      setInheritInfo(null);
      await refreshData();
      alert('Data periode ini berhasil direset / dihapus.');
    } catch (err) {
      console.error('Error resetting quarter data:', err);
      alert('Gagal mereset / menghapus data periode ini.');
    }
  };

  // ====================== RENDER ======================
  return (
    <div className="space-y-4">
      <Header title="Rekap Data" />

      {inheritInfo && (
        <div className="mb-4 rounded-lg bg-yellow-50 border border-yellow-300 px-4 py-3 text-sm flex justify-between items-start gap-4 text-black">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-500"></span>
              <strong>Kloning Berhasil</strong>
            </div>
            <p className="text-gray-700">
              Data untuk periode{' '}
              <strong>
                {inheritInfo.targetYear}-Q{inheritInfo.targetQuarter}
              </strong>{' '}
              telah berhasil disalin dari <strong>{inheritInfo.from}</strong> ({inheritInfo.count} modul).
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button 
              onClick={handleUndoClone} 
              className="px-3 py-1.5 rounded border border-red-200 bg-white hover:bg-red-50 text-red-600 text-sm font-medium whitespace-nowrap"
            >
              Undo Clone
            </button>
            <button 
              onClick={() => setInheritInfo(null)} 
              className="px-3 py-1.5 rounded border border-blue-600 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium whitespace-nowrap"
            >
              Confirm Clone
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg p-4 shadow space-y-4">
        {/* CATEGORY SELECTION */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Kategori Halaman</h3>
            <div className="flex gap-2">
              <button
                onClick={toggleAllPages}
                className="px-3 py-1.5 text-xs bg-blue-900 text-white rounded-md hover:bg-gray-500 transition-colors"
              >
                {selectedPages.length === CATEGORIES.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-700 to-sky-600 p-2 rounded-lg">
            <div className="max-w-[1560px] mx-auto">
              <div
                ref={kategoriScrollRef}
                className="flex gap-4 overflow-x-auto pb-2 cursor-grab scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-200"
                style={{
                  scrollBehavior: 'smooth',
                  WebkitOverflowScrolling: 'touch',
                }}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
              >
                {CATEGORIES.map((c) => {
                  const Icon = c.Icon;
                  const active = selectedPages.includes(c.id);
                  return (
                    <Button
                      key={c.id}
                      onClick={() => togglePage(c.id)}
                      className={
                        active
                          ? 'bg-blue-900 text-white flex-shrink-0 hover:bg-gray-300 hover:text-black'
                          : 'bg-white text-black flex-shrink-0 hover:bg-blue-900 hover:text-white'
                      }
                    >
                      {Icon && <Icon className="w-4 h-4 mr-2" />}
                      {c.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-2 text-sm text-gray-600">
            {selectedPages.length} dari {CATEGORIES.length} kategori terpilih
          </div>
        </div>

        {/* KATEGORI FILTER */}
        {selectedPages.length > 0 && (
          <KategoriFilter
            filter={kategoriFilter}
            setFilter={setKategoriFilter}
            onFilterChange={handleFilterChange}
          />
        )}

        {/* SAVE & CLONE BUTTONS */}
        <div className="flex justify-end gap-2">
          {hasUnsavedChanges && (
            <div className="flex items-center mr-4 text-yellow-600 text-sm">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Ada perubahan yang belum disimpan
            </div>
          )}

          <Button
            onClick={handleExport}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={isLoading || flattenedRows.length === 0}
          >
            <Download className="w-4 h-4" />
            Export Excel
          </Button>

          <Button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white"
            disabled={isLoading || importing}
          >
            <Upload className="w-4 h-4" />
            {importing ? 'Mengimpor...' : 'Import Excel'}
          </Button>

          <Button
            onClick={() => setCloneDialogOpen(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
            disabled={hasUnsavedChanges}
            title={hasUnsavedChanges ? "Simpan perubahan terlebih dahulu sebelum menyalin data" : "Salin data dari periode lain"}
          >
            <Copy className="w-4 h-4" />
            Salin / Clone Periode
          </Button>

          <Button
            onClick={handleResetQuarterData}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
            disabled={isLoading || hasUnsavedChanges || flattenedRows.length === 0}
            title={
              hasUnsavedChanges
                ? "Simpan perubahan terlebih dahulu sebelum mereset data"
                : flattenedRows.length === 0
                ? "Tidak ada data untuk direset di periode ini"
                : "Hapus semua data di periode/quarter ini"
            }
          >
            <Trash2 className="w-4 h-4" />
            Reset / Hapus Data Periode
          </Button>

          <Button
            onClick={handleSaveAllChanges}
            className={`flex items-center gap-2 ${hasUnsavedChanges ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            disabled={!hasUnsavedChanges}
          >
            <Save className="w-4 h-4" />
            Simpan Perubahan
          </Button>
        </div>

        {/* SIMPLE TABLE */}
        {selectedPages.length === 0 ? (
          <div className="border rounded-xl p-6 text-center text-gray-500">
            Pilih kategori halaman terlebih dahulu
          </div>
        ) : isLoading ? (
          <div className="border rounded-xl p-6 text-center text-gray-500">
            Memuat data...
          </div>
        ) : error ? (
          <div className="border rounded-xl p-6 text-center text-red-500">
            Error: {error}
            <button onClick={refreshData} className="ml-2 text-blue-600 underline">
              Coba lagi
            </button>
          </div>
        ) : (
          <SimpleTable
            rows={pagedRows}
            onUpdateRawValue={handleUpdateRawValue}
            filterKategori={kategoriFilter}
            key={`simple-table-${currentPage}`}
          />
        )}

        {/* PAGINATION */}
        {flattenedRows.length > PAGE_SIZE && (
          <div className="mt-3 flex justify-center items-center gap-4">
            {totalPages > 7 && (
              <button type="button" onClick={scrollPaginationLeft}
                className="h-10 w-10 flex items-center justify-center rounded-md border bg-white text-blue-600 font-bold hover:bg-blue-500 hover:text-white">
                <ArrowBigLeftDash className="w-4 h-4" />
              </button>
            )}

            <div className="max-w-[420px] overflow-x-hidden">
              <div ref={paginationRef} className="flex gap-2 px-2 py-1 overflow-x-auto scroll-smooth">
                {Array.from({ length: totalPages }, (_, i) => {
                  const page = i + 1;
                  const isActive = page === currentPage;
                  return (
                    <button key={page} type="button" onClick={() => handlePageClick(page)}
                      className={
                        'min-w-8 h-8 px-3 flex items-center justify-center rounded-md border text-sm font-semibold transition-colors duration-150 shrink-0 hover:bg-blue-600 hover:text-white ' +
                        (isActive ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 text-blue-600')
                      }>
                      {page}
                    </button>
                  );
                })}
              </div>
            </div>

            {totalPages > 7 && (
              <button type="button" onClick={scrollPaginationRight}
                className="h-10 w-10 flex items-center justify-center rounded-md border bg-white text-blue-600 font-bold hover:bg-blue-500 hover:text-white">
                <ArrowBigRightDash className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* UNSAVED CHANGES MODAL */}
      <UnsaveChangesModal
        isOpen={showUnsaveModal}
        onClose={handleModalClose}
        onSave={handleModalSave}
        onDontSave={handleModalDontSave}
        title="Ada Perubahan yang Belum Disimpan"
        message="Anda memiliki perubahan yang belum disimpan. Apa yang ingin Anda lakukan?"
        saveText="Simpan dan Lanjutkan"
        dontSaveText="Lanjutkan Tanpa Simpan"
        cancelText="Batal"
      />

      {/* CLONE DIALOG */}
      <OjkCloneDialog
        isOpen={cloneDialogOpen}
        onClose={() => setCloneDialogOpen(false)}
        onSuccess={(cloneInfo) => {
          setInheritInfo(cloneInfo);
          refreshData();
        }}
        currentYear={year}
        currentQuarter={activeQuarter}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleImportFile}
        style={{ display: 'none' }}
      />
    </div>
  );
}