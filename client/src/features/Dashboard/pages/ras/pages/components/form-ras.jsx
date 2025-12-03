import React from 'react';

const RISK_CATEGORIES = [
  'Investasi', 'Pasar', 'Likuiditas', 'Operasional Non IT', 
  'Operasional IT', 'Hukum', 'Stratejik', 'Kepatuhan', 'Reputasi'
];

const RISK_STANCES = [
  { value: 'Tidak Toleran', label: 'Tidak Toleran', color: 'red' },
  { value: 'Konservatif', label: 'Konservatif', color: 'yellow' },
  { value: 'Moderat', label: 'Moderat', color: 'blue' },
  { value: 'Strategis', label: 'Strategis', color: 'green' }
];

export default function FormRAS({ form, setForm, onAdd, onSave, onReset, editing, loading }) {
  
  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    // Validasi sederhana
    if (!form.parameter || !form.riskCategory) {
      alert("Mohon lengkapi parameter dan kategori risiko.");
      return;
    }
    
    if (editing) {
      onSave(form);
    } else {
      onAdd(form);
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {editing ? 'Edit Data RAS' : 'Input Data RAS'}
          </h2>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* Kolom Kiri: Identifikasi */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Identifikasi Risiko
              </h3>
              
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">No</label>
                  <input
                    type="number"
                    value={form.no}
                    onChange={(e) => handleChange('no', e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="1"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori Risiko</label>
                  <select
                    value={form.riskCategory}
                    onChange={(e) => handleChange('riskCategory', e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    {RISK_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Parameter / Indikator</label>
                <textarea
                  rows={2}
                  value={form.parameter}
                  onChange={(e) => handleChange('parameter', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  placeholder="Contoh: Maks. Outstanding Emiten..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Penjelasan Tipe Data</label>
                <input
                  type="text"
                  value={form.dataTypeExplanation}
                  onChange={(e) => handleChange('dataTypeExplanation', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Contoh: Nilai % di akhir bulan periode"
                />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Target & Limit
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Target RKAP</label>
                  <input
                    type="text"
                    value={form.rkapTarget}
                    onChange={(e) => handleChange('rkapTarget', e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-purple-500 transition-all"
                    placeholder="Contoh: 0.05 atau N/A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Limit RAS</label>
                  <input
                    type="text"
                    value={form.rasLimit}
                    onChange={(e) => handleChange('rasLimit', e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-purple-500 transition-all"
                    placeholder="Contoh: 6X"
                  />
                </div>
              </div>
               <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Realisasi (Actual)</label>
                  <input
                    type="text"
                    value={form.actualValue}
                    onChange={(e) => handleChange('actualValue', e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-purple-500 transition-all"
                    placeholder="Masukkan nilai realisasi saat ini"
                  />
                </div>
            </div>
          </div>

          {/* Kolom Kanan: Sikap & Statement */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-full">
               <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Analisis & Sikap Risiko
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sikap Terhadap Risiko</label>
                <div className="grid grid-cols-2 gap-3">
                  {RISK_STANCES.map((stance) => (
                    <button
                      key={stance.value}
                      onClick={() => handleChange('riskStance', stance.value)}
                      className={`
                        px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200
                        ${form.riskStance === stance.value 
                          ? `bg-${stance.color}-50 border-${stance.color}-500 text-${stance.color}-700 ring-1 ring-${stance.color}-500` 
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}
                      `}
                    >
                      {stance.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Risk Appetite Statement</label>
                <textarea
                  rows={6}
                  value={form.statement}
                  onChange={(e) => handleChange('statement', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-green-500 transition-all resize-none text-sm leading-relaxed"
                  placeholder="Deskripsikan selera risiko secara detail..."
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Keterangan / Notes</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-green-500 transition-all"
                  placeholder="Catatan tambahan (misal: referensi regulasi)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
          {editing ? (
            <>
              <button
                onClick={onReset}
                disabled={loading}
                className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              {loading ? 'Menambahkan...' : 'Tambah Data RAS'}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}