import React, { useState, useEffect } from 'react';
import { Copy } from 'lucide-react';
import { rekapDataAPI } from '../pages/rekapdata/services/rekap-data-api';

export const HOLDING_INHERENT_CATEGORIES = [
  { id: 'INVESTASI', label: 'Investasi' },
  { id: 'PASAR', label: 'Pasar' },
  { id: 'LIKUIDITAS', label: 'Likuiditas' },
  { id: 'OPERASIONAL', label: 'Operasional' },
  { id: 'HUKUM', label: 'Hukum' },
  { id: 'STRATEJIK', label: 'Stratejik' },
  { id: 'KEPATUHAN', label: 'Kepatuhan' },
  { id: 'REPUTASI', label: 'Reputasi' },
];

export default function HoldingCloneDialog({
  isOpen,
  onClose,
  onSuccess,
  defaultCategory, // e.g. 'LIKUIDITAS'
  currentYear,
  currentQuarter,
}) {
  const [sourceYear, setSourceYear] = useState(currentYear || new Date().getFullYear());
  const [sourceQuarter, setSourceQuarter] = useState(currentQuarter || 'Q1');
  const [targetYear, setTargetYear] = useState(currentYear || new Date().getFullYear());
  const [targetQuarter, setTargetQuarter] = useState(currentQuarter || 'Q1');
  const [overrideExisting, setOverrideExisting] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync year and quarter, and set default source to previous quarter
  useEffect(() => {
    if (currentYear) {
      setTargetYear(currentYear);
      setSourceYear(currentYear);
    }
    if (currentQuarter) {
      setTargetQuarter(currentQuarter);
      if (currentQuarter === 'Q1') {
        setSourceYear((currentYear || new Date().getFullYear()) - 1);
        setSourceQuarter('Q4');
      } else {
        const qNum = parseInt(currentQuarter.replace('Q', ''), 10);
        setSourceQuarter(`Q${qNum - 1}`);
      }
    }
  }, [currentYear, currentQuarter]);

  // Set selected categories based on defaultCategory or select all
  useEffect(() => {
    if (isOpen) {
      if (defaultCategory) {
        setSelectedCategories([defaultCategory.toUpperCase()]);
      } else {
        setSelectedCategories(HOLDING_INHERENT_CATEGORIES.map(c => c.id));
      }
    }
  }, [isOpen, defaultCategory]);

  if (!isOpen) return null;

  const handleSelectAll = () => {
    setSelectedCategories(HOLDING_INHERENT_CATEGORIES.map(c => c.id));
  };

  const handleDeselectAll = () => {
    setSelectedCategories([]);
  };

  const toggleCategory = (id) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleCloneConfirm = async () => {
    if (selectedCategories.length === 0) {
      alert('Pilih minimal satu modul untuk disalin.');
      return;
    }
    if (sourceYear === targetYear && sourceQuarter === targetQuarter) {
      alert('Periode Asal dan Periode Tujuan tidak boleh sama.');
      return;
    }

    setLoading(true);
    try {
      const response = await rekapDataAPI.clonePeriod({
        sourceYear,
        sourceQuarter,
        targetYear,
        targetQuarter,
        overrideExisting,
        sources: selectedCategories,
      });

      if (onSuccess) {
        onSuccess({
          from: `${sourceYear}-${sourceQuarter}`,
          count: response.data?.sectionsCloned || response.data?.data?.sectionsCloned || 0,
          targetYear,
          targetQuarter,
          categories: selectedCategories,
        });
      }
      onClose();
    } catch (err) {
      console.error(err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Gagal menyalin data';
      
      // Jika data target sudah ada dan overrideExisting = false, tawarkan opsi konfirmasi untuk overwrite secara langsung
      if (!overrideExisting && (errorMessage.includes('sudah ada') || errorMessage.includes('overrideExisting'))) {
        const confirmOverwrite = window.confirm(
          `Perhatian:\nData target sudah ada di periode tujuan.\n\nApakah Anda ingin menimpa (overwrite) data target tersebut?`
        );
        if (confirmOverwrite) {
          try {
            setOverrideExisting(true);
            
            const response = await rekapDataAPI.clonePeriod({
              sourceYear,
              sourceQuarter,
              targetYear,
              targetQuarter,
              overrideExisting: true,
              sources: selectedCategories,
            });
            if (onSuccess) {
              onSuccess({
                from: `${sourceYear}-${sourceQuarter}`,
                count: response.data?.sectionsCloned || response.data?.data?.sectionsCloned || 0,
                targetYear,
                targetQuarter,
                categories: selectedCategories,
              });
            }
            onClose();
            return;
          } catch (retryErr) {
            console.error(retryErr);
            const retryMessage = retryErr?.response?.data?.message || retryErr?.message || 'Gagal menyalin data';
            alert(`Gagal menyalin data: ${retryMessage}`);
          }
        }
      } else {
        alert(`Gagal menyalin data: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-10">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-xl w-full mx-4 border border-gray-100 my-auto text-black">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
            <Copy size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Salin Data Profil Risiko Holding</h2>
            <p className="text-xs text-gray-500 mt-0.5 font-normal">Duplikasi data parameter dan nilai antar periode</p>
          </div>
        </div>

        <div className="space-y-4 text-left">
          <div className="grid grid-cols-2 gap-4">
            {/* Periode Asal */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Periode Asal (Sumber)</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-gray-400 font-medium">Tahun</span>
                  <input
                    type="number"
                    className="rounded-lg px-2 py-1.5 border text-sm font-medium focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none bg-white text-black"
                    value={sourceYear}
                    onChange={(e) => setSourceYear(Number(e.target.value))}
                    disabled={loading}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-gray-400 font-medium">Triwulan</span>
                  <select
                    className="rounded-lg px-2 py-1.5 border text-sm font-medium focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none bg-white text-black"
                    value={sourceQuarter}
                    onChange={(e) => setSourceQuarter(e.target.value)}
                    disabled={loading}
                  >
                    <option value="Q1">Q1</option>
                    <option value="Q2">Q2</option>
                    <option value="Q3">Q3</option>
                    <option value="Q4">Q4</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Periode Tujuan */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Periode Tujuan (Target)</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-gray-400 font-medium">Tahun</span>
                  <input
                    type="number"
                    className="rounded-lg px-2 py-1.5 border text-sm font-medium focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none bg-white text-black"
                    value={targetYear}
                    onChange={(e) => setTargetYear(Number(e.target.value))}
                    disabled={loading}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-gray-400 font-medium">Triwulan</span>
                  <select
                    className="rounded-lg px-2 py-1.5 border text-sm font-medium focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none bg-white text-black"
                    value={targetQuarter}
                    onChange={(e) => setTargetQuarter(e.target.value)}
                    disabled={loading}
                  >
                    <option value="Q1">Q1</option>
                    <option value="Q2">Q2</option>
                    <option value="Q3">Q3</option>
                    <option value="Q4">Q4</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Checklist Categories */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Modul yang akan disalin</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-[10px] font-bold text-blue-600 hover:underline"
                  disabled={loading}
                >
                  Pilih Semua
                </button>
                <span className="text-gray-300 text-xs">|</span>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="text-[10px] font-bold text-red-500 hover:underline"
                  disabled={loading}
                >
                  Hapus Pilihan
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border rounded-xl p-3 max-h-[160px] overflow-y-auto bg-gray-50/50 text-black">
              {HOLDING_INHERENT_CATEGORIES.map((cat) => {
                const checked = selectedCategories.includes(cat.id);
                return (
                  <label key={cat.id} className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer hover:text-purple-600 transition-colors select-none">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCategory(cat.id)}
                      className="h-3.5 w-3.5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
                      disabled={loading}
                    />
                    <span>{cat.label}</span>
                  </label>
                );
              })}
            </div>
            <div className="mt-1.5 text-[10px] text-gray-500">
              {selectedCategories.length} dari {HOLDING_INHERENT_CATEGORIES.length} modul terpilih untuk disalin.
            </div>
          </div>

          {/* Checkbox Overwrite */}
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2.5">
            <input
              type="checkbox"
              id="overrideCheckbox"
              className="mt-0.5 h-3.5 w-3.5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              checked={overrideExisting}
              onChange={(e) => setOverrideExisting(e.target.checked)}
              disabled={loading}
            />
            <label htmlFor="overrideCheckbox" className="text-[11px] text-amber-800 font-medium select-none cursor-pointer leading-normal">
              Tulis ulang data yang ada (Overwrite)
              <span className="block text-[9px] text-amber-600 font-normal mt-0.5">Peringatan: Data pada periode tujuan untuk modul yang terpilih akan digantikan seluruhnya.</span>
            </label>
          </div>
        </div>

        <div className="flex gap-2.5 justify-end mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold transition-colors focus:outline-none"
            disabled={loading}
          >
            Batal
          </button>
          <button
            onClick={handleCloneConfirm}
            className="px-4 py-2 text-xs rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center gap-1.5 shadow-sm hover:shadow transition-all focus:outline-none"
            disabled={loading || selectedCategories.length === 0}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-0.5 mr-1 h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menyalin...
              </>
            ) : (
              'Salin Sekarang'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
