import React from 'react';
import { Pencil, Trash2, FileText } from 'lucide-react';

export default function DataTableRAS({
  rows,
  onEdit,
  onDelete 
}) {
  if (!rows || rows.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-gray-50">
        <div className="inline-flex p-4 bg-white rounded-full mb-3 shadow-sm">
          <FileText className="w-6 h-6 text-gray-400" />
        </div>
        <p>Belum ada data RAS yang tersedia.</p>
      </div>
    );
  }

  const getStanceBadgeColor = (stance) => {
  const s = stance?.toLowerCase() || '';
  if (s.includes('tidak toleran')) return 'bg-red-100 text-red-700 border-red-200';
  if (s.includes('konservatif')) return 'bg-amber-100 text-amber-700 border-amber-200';
  if (s.includes('moderat')) return 'bg-blue-100 text-blue-700 border-blue-200';
  if (s.includes('strategis')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 text-gray-600 text-sm leading-normal border-b border-gray-200">
            <th className="py-4 px-6 font-bold w-16 text-center">No</th>
            <th className="py-4 px-6 font-bold">Kategori & Parameter</th>
            <th className="py-4 px-6 font-bold w-32">Target RKAP</th>
            <th className="py-4 px-6 font-bold w-32">RAS Limit</th>
            <th className="py-4 px-6 font-bold w-40">Sikap Risiko</th>
            <th className="py-4 px-6 font-bold w-1/3">Statement</th>
            <th className="py-4 px-6 font-bold w-32">Realisasi</th>
            <th className="py-4 px-6 font-bold text-center w-32">Aksi</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm">
          {rows.map((row, index) => (
            <tr key={row.id || index} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors duration-150">
              <td className="py-4 px-6 text-center font-medium bg-gray-50/30">
                {row.no}
              </td>
              <td className="py-4 px-6">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">{row.riskCategory}</span>
                  <span className="font-semibold text-gray-800 leading-snug">{row.parameter}</span>
                  {row.dataTypeExplanation && (
                    <span className="text-xs text-gray-500 mt-1 italic">{row.dataTypeExplanation}</span>
                  )}
                </div>
              </td>
              <td className="py-4 px-6 font-medium text-gray-600">
                {row.rkapTarget || '-'}
              </td>
              <td className="py-4 px-6 font-bold text-gray-800">
                {row.rasLimit}
              </td>
              <td className="py-4 px-6">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStanceBadgeColor(row.riskStance)}`}>
                  {row.riskStance}
                </span>
              </td>
              <td className="py-4 px-6">
                <p className="text-gray-600 text-xs leading-relaxed line-clamp-3 hover:line-clamp-none transition-all">
                  {row.statement}
                </p>
                {row.notes && (
                  <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                    <span>Note: {row.notes}</span>
                  </div>
                )}
              </td>
              <td className="py-4 px-6 font-bold text-blue-600">
                 {row.actualValue || '-'}
              </td>
              <td className="py-4 px-6 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit(row)}
                    className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(row)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}