import React, { useState, useEffect, useMemo } from 'react';

import { Risk_attitude_info, Unit_types } from '../utils/ras-constant';

const FormGroup = ({ label, children, required, subLabel }) => (
  <div className="mb-4">
    <div className="flex justify-between items-end mb-1.5">
      <label className="block text-sm font-semibold text-white">
        {label} {required && <span className="text-red-200">*</span>}
      </label>
      {subLabel && <span className="text-xs text-blue-100 italic">{subLabel}</span>}
    </div>
    {children}
  </div>
);

const Input = ({ className = '', ...props }) => (
  <input className={`w-full rounded-xl border-0 bg-white/90 text-gray-800 px-4 py-2.5 focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all shadow-sm placeholder:text-gray-400 text-sm ${className}`} {...props} />
);

const Select = ({ className = '', children, ...props }) => (
  <select className={`w-full rounded-xl border-0 bg-white/90 text-gray-800 px-4 py-2.5 focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all shadow-sm text-sm ${className}`} {...props}>
    {children}
  </select>
);

const TextArea = ({ className = '', ...props }) => (
  <textarea className={`w-full rounded-xl border-0 bg-white/90 text-gray-800 px-4 py-2.5 focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all shadow-sm resize-none text-sm ${className}`} {...props} />
);

const initialFormState = {
  riskCategory: '',
  isNewCategory: false,
  no: '',
  parameter: '',

  // Target & Limit
  rkapTarget: '',
  dataTypeExplanation: '',
  rasLimit: '',

  // Attitude & Statement
  riskStance: 'Moderat',
  statement: '',
  notes: '',

  // Calculation Logic
  unitType: 'PERCENTAGE', // PERCENTAGE, RUPIAH, X
  hasNumeratorDenominator: false,
  numeratorLabel: '',
  numeratorValue: '',
  denominatorLabel: '',
  denominatorValue: '',
  manualQuarterValue: '',
};

export default function RasForm({ existingCategories = [], onSubmit, onCancel, initialData = null }) {
  const [form, setForm] = useState(initialFormState);

  // --- Initialize Form Data ---
  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialFormState,
        ...initialData,
        isNewCategory: false,
      });
    } else {
      // Default: Pilih kategori pertama jika ada
      if (existingCategories.length > 0) {
        setForm((prev) => ({
          ...initialFormState,
          riskCategory: existingCategories[0],
        }));
      }
    }
  }, [initialData, existingCategories]);

  // --- Auto Calculation Logic ---
  const calculatedResult = useMemo(() => {
    // Jika tipe X, tidak ada kalkulasi otomatis
    if (form.unitType === 'X') return null;

    // Jika tidak pakai pembilang/penyebut, tidak ada kalkulasi
    if (!form.hasNumeratorDenominator) return null;

    const num = parseFloat(form.numeratorValue);
    const den = parseFloat(form.denominatorValue);

    if (isNaN(num) || isNaN(den) || den === 0) return 0;

    const result = num / den;

    if (form.unitType === 'PERCENTAGE') {
      return (result * 100).toFixed(2) + '%';
    } else if (form.unitType === 'RUPIAH') {
      return 'Rp ' + new Intl.NumberFormat('id-ID').format(result);
    }

    return result;
  }, [form.numeratorValue, form.denominatorValue, form.unitType, form.hasNumeratorDenominator]);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    if (val === '__NEW__') {
      setForm((prev) => ({ ...prev, isNewCategory: true, riskCategory: '' }));
    } else {
      setForm((prev) => ({ ...prev, isNewCategory: false, riskCategory: val }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validasi sederhana
    if (!form.parameter) {
      alert('Parameter wajib diisi!');
      return;
    }
    if (!form.riskCategory) {
      alert('Kategori Risiko wajib diisi!');
      return;
    }

    // Jika hasil auto-calc ada, simpan ke manualQuarterValue agar konsisten di data table
    const finalData = {
      ...form,
      manualQuarterValue: calculatedResult || form.manualQuarterValue,
    };

    onSubmit(finalData);
  };

  const isEditing = !!initialData;

  return (
    <section className="relative rounded-2xl overflow-hidden mb-8 shadow-lg bg-gradient-to-r from-[#0076C6]/95 via-[#00A3DA]/95 to-[#33C2B5]/95 animate-fade-in">
      <div className="p-6 sm:p-8">
        {/* HEADER FORM */}
        <div className="flex items-center justify-between mb-6 border-b border-white/20 pb-4">
          <h2 className="text-white font-bold text-xl flex items-center gap-2">
            {isEditing ? (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Data RAS
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Input Data RAS Baru
              </>
            )}
          </h2>
          <div className="text-white/80 text-sm italic bg-white/10 px-3 py-1 rounded-lg">* Field wajib diisi</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* === KOLOM KIRI: Identifikasi & Parameter === */}
            <div className="space-y-5">
              <div className="bg-white/10 p-5 rounded-xl border border-white/10 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
                  <span className="w-1.5 h-6 bg-yellow-400 rounded-full block"></span>
                  Identifikasi Risiko
                </h3>

                {/* Kategori Risiko */}
                <FormGroup label="Kategori Risiko" required>
                  {!form.isNewCategory ? (
                    <div className="flex gap-2">
                      <Select name="riskCategory" value={form.riskCategory} onChange={handleCategoryChange}>
                        <option value="" disabled>
                          -- Pilih Kategori --
                        </option>
                        {existingCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                        <option value="__NEW__" className="font-bold text-blue-600 bg-blue-50">
                          + Tambah Kategori Baru...
                        </option>
                      </Select>
                    </div>
                  ) : (
                    <div className="flex gap-2 animate-fade-in">
                      <Input type="text" name="riskCategory" value={form.riskCategory} onChange={handleChange} placeholder="Ketik nama kategori baru..." autoFocus />
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, isNewCategory: false, riskCategory: existingCategories[0] || '' }))}
                        className="px-4 py-2 text-sm bg-white/20 text-white rounded-xl hover:bg-white/30 border border-white/30 transition-all"
                      >
                        Batal
                      </button>
                    </div>
                  )}
                </FormGroup>

                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <FormGroup label="No">
                      <Input
                        type="number"
                        name="no"
                        value={form.no}
                        onChange={handleChange}
                        placeholder="Auto"
                        // disabled
                        title="Nomor akan diurutkan otomatis"
                      />
                    </FormGroup>
                  </div>
                  <div className="col-span-3">
                    <FormGroup label="Parameter" required>
                      <TextArea name="parameter" value={form.parameter} onChange={handleChange} rows={2} placeholder="Deskripsi parameter risiko..." />
                    </FormGroup>
                  </div>
                </div>

                {/* Toggle Pembilang/Penyebut */}
                <div className="flex items-center gap-3 mb-4 bg-white/10 p-3 rounded-lg border border-white/10">
                  <input type="checkbox" id="hasCalc" name="hasNumeratorDenominator" checked={form.hasNumeratorDenominator} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded focus:ring-yellow-400 cursor-pointer" />
                  <label htmlFor="hasCalc" className="text-white text-sm font-medium cursor-pointer select-none">
                    Gunakan Pembilang & Penyebut (Opsional)
                  </label>
                </div>

                {/* Detail Pembilang & Penyebut (Conditional) */}
                {form.hasNumeratorDenominator && (
                  <div className="space-y-3 pl-4 border-l-2 border-yellow-400/50 animate-fade-in">
                    <div className="grid grid-cols-2 gap-4">
                      <Input name="numeratorLabel" value={form.numeratorLabel} onChange={handleChange} placeholder="Label Pembilang" className="text-xs" />
                      <Input type="number" name="numeratorValue" value={form.numeratorValue} onChange={handleChange} placeholder="Nilai Pembilang" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input name="denominatorLabel" value={form.denominatorLabel} onChange={handleChange} placeholder="Label Penyebut" className="text-xs" />
                      <Input type="number" name="denominatorValue" value={form.denominatorValue} onChange={handleChange} placeholder="Nilai Penyebut" />
                    </div>
                  </div>
                )}
              </div>

              {/* Target & Limit Section */}
              <div className="bg-white/10 p-5 rounded-xl border border-white/10 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
                  <span className="w-1.5 h-6 bg-purple-400 rounded-full block"></span>
                  Target & Limit
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormGroup label="Target RKAP">
                    <Input name="rkapTarget" value={form.rkapTarget} onChange={handleChange} placeholder="Contoh: 0.05" />
                  </FormGroup>
                  <FormGroup label="RAS Limit">
                    <Input name="rasLimit" value={form.rasLimit} onChange={handleChange} placeholder="Contoh: 6X" className="font-bold text-red-600" />
                  </FormGroup>
                </div>
                <FormGroup label="Penjelasan Tipe Data">
                  <Input name="dataTypeExplanation" value={form.dataTypeExplanation} onChange={handleChange} placeholder="Contoh: Nilai % akhir bulan" />
                </FormGroup>
              </div>
            </div>

            {/* === KOLOM KANAN: Hasil & Sikap === */}
            <div className="space-y-5">
              {/* Hasil & Kalkulasi */}
              <div className="bg-white/10 p-5 rounded-xl border border-white/10 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
                  <span className="w-1.5 h-6 bg-green-400 rounded-full block"></span>
                  Hasil & Realisasi
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <FormGroup label="Tipe Unit">
                    <Select name="unitType" value={form.unitType} onChange={handleChange}>
                      {Unit_types.map((u) => (
                        <option key={u.value} value={u.value}>
                          {u.label}
                        </option>
                      ))}
                    </Select>
                  </FormGroup>

                  <FormGroup label="Value Triwulan" subLabel={form.unitType !== 'X' && form.hasNumeratorDenominator ? '(Auto Calc)' : '(Manual Input)'}>
                    {form.unitType !== 'X' && form.hasNumeratorDenominator ? (
                      // Read Only Auto Calculated Field
                      <div className="w-full rounded-xl border-0 bg-black/20 text-white px-4 py-2.5 font-bold text-lg text-center border border-white/10 shadow-inner">{calculatedResult || '-'}</div>
                    ) : (
                      // Manual Input Field
                      <Input name="manualQuarterValue" value={form.manualQuarterValue} onChange={handleChange} placeholder={form.unitType === 'X' ? 'Input Manual (X)...' : 'Masukkan nilai...'} className="font-bold text-blue-700 bg-white" />
                    )}
                  </FormGroup>
                </div>
              </div>

              {/* Analisis & Sikap */}
              <div className="bg-white/10 p-5 rounded-xl border border-white/10 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
                  <span className="w-1.5 h-6 bg-orange-400 rounded-full block"></span>
                  Analisis & Sikap Risiko
                </h3>

                <FormGroup label="Sikap Terhadap Risiko">
                  <Select name="riskStance" value={form.riskStance} onChange={handleChange}>
                    {Risk_attitude_info.map((r) => (
                      <option key={r.label} value={r.label}>
                        {r.label}
                      </option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup label="Risk Appetite Statement">
                  <TextArea name="statement" value={form.statement} onChange={handleChange} rows={4} placeholder="Tuliskan pernyataan selera risiko..." />
                </FormGroup>

                <FormGroup label="Keterangan / Notes">
                  <Input name="notes" value={form.notes} onChange={handleChange} placeholder="Catatan tambahan..." />
                </FormGroup>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/20 mt-8">
                <button type="button" onClick={onCancel} className="px-6 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 border border-white/30 transition-all backdrop-blur-sm">
                  Batal
                </button>

                <button
                  type="submit"
                  className={`
                    px-8 py-3 rounded-xl text-white font-bold shadow-lg transform active:scale-95 transition-all flex items-center gap-2
                    ${
                      isEditing
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 ring-2 ring-green-300/50'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 ring-2 ring-blue-300/50'
                    }
                  `}
                >
                  {isEditing ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Edit Data
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Tambah Data
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
