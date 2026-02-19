import React, { useState, useEffect } from 'react';
import { X, Save, Edit3, AlertTriangle, Download, FileText, Loader2 } from 'lucide-react';
import { rasApi, downloadFile } from '../service/rasService/ras.service';

export default function TindakLanjut({ isOpen, onClose, data, onSave }) {
  const [formData, setFormData] = useState({
    korektifOwner: '',
    antisipasiOwner: '',
    korektifSupport: '',
    antisipasiSupport: '',
    statusKorektifOwner: 'On Progress',
    statusAntisipasiOwner: 'On Progress',
    statusKorektifSupport: 'On Progress',
    statusAntisipasiSupport: 'On Progress',
    targetKorektifOwner: '',
    targetAntisipasiOwner: '',
    targetKorektifSupport: '',
    targetAntisipasiSupport: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && data) {
      if (data.tindakLanjut) {
        setFormData({
          korektifOwner: data.tindakLanjut.korektifOwner || '',
          antisipasiOwner: data.tindakLanjut.antisipasiOwner || '',
          korektifSupport: data.tindakLanjut.korektifSupport || '',
          antisipasiSupport: data.tindakLanjut.antisipasiSupport || '',
          statusKorektifOwner: data.tindakLanjut.statusKorektifOwner || 'On Progress',
          statusAntisipasiOwner: data.tindakLanjut.statusAntisipasiOwner || 'On Progress',
          statusKorektifSupport: data.tindakLanjut.statusKorektifSupport || 'On Progress',
          statusAntisipasiSupport: data.tindakLanjut.statusAntisipasiSupport || 'On Progress',
          targetKorektifOwner: data.tindakLanjut.targetKorektifOwner || '',
          targetAntisipasiOwner: data.tindakLanjut.targetAntisipasiOwner || '',
          targetKorektifSupport: data.tindakLanjut.targetKorektifSupport || '',
          targetAntisipasiSupport: data.tindakLanjut.targetAntisipasiSupport || '',
        });
      } else {
        // Reset form jika data baru/kosong
        setFormData({
          korektifOwner: '',
          antisipasiOwner: '',
          korektifSupport: '',
          antisipasiSupport: '',
          statusKorektifOwner: 'On Progress',
          statusAntisipasiOwner: 'On Progress',
          statusKorektifSupport: 'On Progress',
          statusAntisipasiSupport: 'On Progress',
          targetKorektifOwner: '',
          targetAntisipasiOwner: '',
          targetKorektifSupport: '',
          targetAntisipasiSupport: '',
        });
      }
      setIsEditing(false);
      setError(null);
      setLoading(false);
      setSaving(false);
      setExporting(false);
    }
  }, [data, isOpen]);

  if (!isOpen || !data) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Panggil API service untuk update tindak lanjut
      await rasApi.updateTindakLanjut(data.id, formData);

      // Notify parent component
      await onSave(data.id, formData);

      setIsEditing(false);
      onClose();
    } catch (err) {
      setError(err.message || 'Gagal menyimpan tindak lanjut');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      setError(null);

      // Gunakan endpoint export yang tersedia di backend
      // Jika tidak ada endpoint khusus, kita bisa buat file secara manual
      const exportData = {
        ...data,
        tindakLanjut: formData,
        exportDate: new Date().toISOString(),
      };

      // Buat file Excel secara manual menggunakan fungsi utility
      const { exportTindakLanjut } = await import('../utils/export-excel');
      exportTindakLanjut(exportData);
    } catch (err) {
      setError(err.message || 'Gagal export data');
      console.error('Export error:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden border border-gray-200 flex flex-col">
        {/* HEADER MODAL */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-[#1f4e79] text-white rounded-t-2xl flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <AlertTriangle className="text-yellow-400" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Tindak Lanjut Pelampauan Limit RAS</h2>
              <p className="text-xs text-blue-100 opacity-90">Silakan lengkapi rencana tindak lanjut di bawah ini.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={saving || exporting}>
            <X size={20} />
          </button>
        </div>

        {/* CONTENT AREA (SCROLLABLE) */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50 space-y-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle size={18} />
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* 1. INFO PARAMETER (READ ONLY) */}
          <div className="bg-white border-l-4 border-l-red-500 border border-gray-200 rounded-xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Jenis Risiko</label>
              <p className="font-bold text-gray-800 text-sm mt-1">{data?.riskCategory || '-'}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Parameter</label>
              <p className="font-bold text-gray-800 text-sm mt-1 leading-snug">{data?.parameter || '-'}</p>
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Status Limit</label>
              <div className="flex flex-col gap-1 mt-1">
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>Limit:</span>
                  <span className="font-bold text-gray-700">{data?.limitDisplay || '-'}</span>
                </div>
                <div className="text-sm text-red-600 font-bold bg-red-50 px-2 py-1 rounded border border-red-100 flex justify-between">
                  <span>Realisasi:</span>
                  <span>{data?.actualDisplay || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. FORM INPUT */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
            {saving && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-xl z-10">
                <div className="flex flex-col items-center">
                  <Loader2 className="animate-spin text-blue-600" size={32} />
                  <p className="mt-2 text-gray-600 font-medium">Menyimpan data...</p>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-700 text-lg flex items-center gap-2">
                <Edit3 size={18} className="text-blue-600" />
                Form Rencana Tindak Lanjut
              </h3>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-5 py-2 bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-lg font-bold hover:bg-yellow-200 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={saving || exporting}
                >
                  <Edit3 size={16} /> Edit Data
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-semibold hover:bg-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={saving || exporting}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all shadow-md text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={saving || exporting}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save size={16} /> Simpan
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
              {/* Risk Owner */}
              <div className={`p-5 rounded-xl border transition-colors ${isEditing ? 'bg-blue-50/50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                <h4 className="font-bold text-blue-800 border-b border-blue-200/50 pb-2 mb-4 text-sm uppercase tracking-wide">Risk Owner Unit</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Tindakan Korektif</label>
                    <textarea
                      disabled={!isEditing || saving}
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 resize-none transition-colors"
                      rows={3}
                      value={formData.korektifOwner}
                      onChange={handleChange}
                      name="korektifOwner"
                      placeholder={isEditing ? 'Rencana perbaikan...' : '-'}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Tindakan Antisipasi</label>
                    <textarea
                      disabled={!isEditing || saving}
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 resize-none transition-colors"
                      rows={3}
                      value={formData.antisipasiOwner}
                      onChange={handleChange}
                      name="antisipasiOwner"
                      placeholder={isEditing ? 'Rencana pencegahan...' : '-'}
                    />
                  </div>
                </div>
              </div>

              {/* Risk Support */}
              <div className={`p-5 rounded-xl border transition-colors ${isEditing ? 'bg-green-50/50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <h4 className="font-bold text-green-800 border-b border-green-200/50 pb-2 mb-4 text-sm uppercase tracking-wide">Risk Supporting Unit</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Tindakan Korektif</label>
                    <textarea
                      disabled={!isEditing || saving}
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:text-gray-500 resize-none transition-colors"
                      rows={3}
                      value={formData.korektifSupport}
                      onChange={handleChange}
                      name="korektifSupport"
                      placeholder={isEditing ? 'Rencana perbaikan...' : '-'}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Tindakan Antisipasi</label>
                    <textarea
                      disabled={!isEditing || saving}
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:text-gray-500 resize-none transition-colors"
                      rows={3}
                      value={formData.antisipasiSupport}
                      onChange={handleChange}
                      name="antisipasiSupport"
                      placeholder={isEditing ? 'Rencana pencegahan...' : '-'}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Target & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              {/* 1. Owner Korektif */}
              <div>
                <label className="block text-xs font-bold text-blue-800 mb-1">Status (Owner - Korektif)</label>
                <select
                  disabled={!isEditing || saving}
                  value={formData.statusKorektifOwner}
                  onChange={handleChange}
                  name="statusKorektifOwner"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:bg-gray-100 focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="On Progress">On Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-blue-800 mb-1">Target (Owner - Korektif)</label>
                <input
                  type="text"
                  disabled={!isEditing || saving}
                  value={formData.targetKorektifOwner}
                  onChange={handleChange}
                  name="targetKorektifOwner"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:bg-gray-100 focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="YYYY-MM-DD"
                />
              </div>

              {/* 2. Owner Antisipasi */}
              <div>
                <label className="block text-xs font-bold text-blue-800 mb-1">Status (Owner - Antisipasi)</label>
                <select
                  disabled={!isEditing || saving}
                  value={formData.statusAntisipasiOwner}
                  onChange={handleChange}
                  name="statusAntisipasiOwner"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:bg-gray-100 focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="On Progress">On Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-blue-800 mb-1">Target (Owner - Antisipasi)</label>
                <input
                  type="text"
                  disabled={!isEditing || saving}
                  value={formData.targetAntisipasiOwner}
                  onChange={handleChange}
                  name="targetAntisipasiOwner"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:bg-gray-100 focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="YYYY-MM-DD"
                />
              </div>

              {/* 3. Support Korektif */}
              <div>
                <label className="block text-xs font-bold text-green-800 mb-1">Status (Support - Korektif)</label>
                <select
                  disabled={!isEditing || saving}
                  value={formData.statusKorektifSupport}
                  onChange={handleChange}
                  name="statusKorektifSupport"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:bg-gray-100 focus:ring-2 focus:ring-green-500 transition-colors"
                >
                  <option value="On Progress">On Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-green-800 mb-1">Target (Support - Korektif)</label>
                <input
                  type="text"
                  disabled={!isEditing || saving}
                  value={formData.targetKorektifSupport}
                  onChange={handleChange}
                  name="targetKorektifSupport"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:bg-gray-100 focus:ring-2 focus:ring-green-500 transition-colors"
                  placeholder="YYYY-MM-DD"
                />
              </div>

              {/* 4. Support Antisipasi */}
              <div>
                <label className="block text-xs font-bold text-green-800 mb-1">Status (Support - Antisipasi)</label>
                <select
                  disabled={!isEditing || saving}
                  value={formData.statusAntisipasiSupport}
                  onChange={handleChange}
                  name="statusAntisipasiSupport"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:bg-gray-100 focus:ring-2 focus:ring-green-500 transition-colors"
                >
                  <option value="On Progress">On Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-green-800 mb-1">Target (Support - Antisipasi)</label>
                <input
                  type="text"
                  disabled={!isEditing || saving}
                  value={formData.targetAntisipasiSupport}
                  onChange={handleChange}
                  name="targetAntisipasiSupport"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:bg-gray-100 focus:ring-2 focus:ring-green-500 transition-colors"
                  placeholder="YYYY-MM-DD"
                />
              </div>
            </div>
          </form>

          {/* 3. TABEL DATA (MENCERMINKAN ISI FORM) */}
          <div className="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <FileText size={18} className="text-gray-600" />
                Tabel Tindak Lanjut (Preview)
              </h3>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-green-600 rounded-lg text-xs font-bold text-green-700 hover:bg-green-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={exporting || saving}
              >
                {exporting ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download size={14} /> Export Excel
                  </>
                )}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-gray-300">
                <thead className="bg-[#1f4e79] text-white text-xs uppercase font-bold sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 border border-gray-400 text-center w-48">Parameter</th>
                    <th className="px-4 py-3 border border-gray-400 text-center w-25">Unit</th>
                    <th className="px-4 py-3 border border-gray-400 text-center w-24">Tipe</th>
                    <th className="px-4 py-3 border border-gray-400 text-center">Korektif / Antisipasi</th>
                    <th className="px-4 py-3 border border-gray-400 text-center w-30">Status</th>
                    <th className="px-4 py-3 border border-gray-400 text-center w-24">Target</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700 bg-white">
                  {/* BARIS 1: Risk Owner - Korektif */}
                  <tr className="border-b border-gray-300">
                    <td rowSpan={4} className="px-4 py-3 border-r border-gray-300 font-medium align-middle bg-white">
                      {data?.parameter || '-'}
                    </td>
                    <td rowSpan={2} className="px-4 py-3 border-r border-gray-300 font-medium align-middle text-center text-blue-900 bg-blue-50">
                      Risk Owner Unit
                    </td>
                    <td className="px-4 py-2 border-r border-gray-300 text-center text-xs font-bold text-gray-500 uppercase">Korektif</td>
                    <td className="px-4 py-2 border-r border-gray-300">{formData.korektifOwner || '-'}</td>
                    <td className="px-4 py-3 border-r border-gray-300 align-middle text-center bg-white">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${formData.statusKorektifOwner === 'Done' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                        {formData.statusKorektifOwner}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300 align-middle text-center font-mono text-xs bg-white">{formData.targetKorektifOwner || '-'}</td>
                  </tr>

                  {/* BARIS 2: Risk Owner - Antisipasi */}
                  <tr className="border-b border-gray-300">
                    <td className="px-4 py-2 border-r border-gray-300 text-center text-xs font-bold text-gray-500 uppercase">Antisipasi</td>
                    <td className="px-4 py-2 border-r border-gray-300">{formData.antisipasiOwner || '-'}</td>
                    <td className="px-4 py-3 border-r border-gray-300 align-middle text-center bg-white">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${formData.statusAntisipasiOwner === 'Done' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                        {formData.statusAntisipasiOwner}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300 align-middle text-center font-mono text-xs bg-white">{formData.targetAntisipasiOwner || '-'}</td>
                  </tr>

                  {/* BARIS 3: Risk Support - Korektif */}
                  <tr className="border-b border-gray-300">
                    <td rowSpan={2} className="px-4 py-3 border-r border-gray-300 font-medium align-middle text-center text-green-900 bg-green-50">
                      Risk Supporting Unit
                    </td>
                    <td className="px-4 py-2 border-r border-gray-300 text-center text-xs font-bold text-gray-500 uppercase">Korektif</td>
                    <td className="px-4 py-2 border-r border-gray-300">{formData.korektifSupport || '-'}</td>
                    <td className="px-4 py-3 border-r border-gray-300 align-middle text-center bg-white">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${formData.statusKorektifSupport === 'Done' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                        {formData.statusKorektifSupport}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300 align-middle text-center font-mono text-xs bg-white">{formData.targetKorektifSupport || '-'}</td>
                  </tr>

                  {/* BARIS 4: Risk Support - Antisipasi */}
                  <tr>
                    <td className="px-4 py-2 border-r border-gray-300 text-center text-xs font-bold text-gray-500 uppercase">Antisipasi</td>
                    <td className="px-4 py-2 border-r border-gray-300">{formData.antisipasiSupport || '-'}</td>
                    <td className="px-4 py-3 border-r border-gray-300 align-middle text-center bg-white">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold border ${formData.statusAntisipasiSupport === 'Done' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}
                      >
                        {formData.statusAntisipasiSupport}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300 align-middle text-center font-mono text-xs bg-white">{formData.targetAntisipasiSupport || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
