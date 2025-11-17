import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';

export default function DataTable({
  rows,
  totalWeighted,
  viewYear,
  viewQuarter,
  startEdit,
  removeRow,
  logAudit, 
}) {
  const filtered = rows;

  const handleEdit = (rowData) => {
    if (logAudit) {
      logAudit({
        aksi: 'EDIT',
        module: 'INVESTASI',
        deskripsi: `Memulai edit data investasi - Parameter: "${rowData.parameter || rowData.sectionLabel}", Indicator: "${rowData.indikator}", Sub No: ${rowData.no_indikator || rowData.subNo}`,
        status: 'SUKSES',
      });
    }
    startEdit(rowData);
  };


  const handleDelete = async (rowData) => {
    const isConfirmed = window.confirm(`Apakah Anda yakin ingin menghapus data investasi?\nParameter: ${rowData.parameter || rowData.sectionLabel}\nIndicator: ${rowData.indikator}`);

    if (isConfirmed) {
      try {
  
        if (logAudit) {
          logAudit({
            aksi: 'HAPUS',
            module: 'INVESTASI',
            deskripsi: `Menghapus data investasi - Parameter: "${rowData.parameter || rowData.sectionLabel}", Indicator: "${rowData.indikator}", Sub No: ${rowData.no_indikator || rowData.subNo}`,
            status: 'SUKSES',
          });
        }

        await removeRow(rowData);
      } catch (error) {
        // Log jika gagal
        if (logAudit) {
          logAudit({
            aksi: 'HAPUS',
            module: 'INVESTASI',
            deskripsi: `Gagal menghapus data investasi - Parameter: "${rowData.parameter || rowData.sectionLabel}", Indicator: "${rowData.indikator}"`,
            status: 'GAGAL',
          });
        }
        console.error('Error deleting row:', error);
      }
    } else {
      if (logAudit) {
        logAudit({
          aksi: 'HAPUS',
          module: 'INVESTASI',
          deskripsi: `Dibatalkan: Menghapus data investasi - Parameter: "${rowData.parameter || rowData.sectionLabel}"`,
          status: 'DIBATALKAN',
        });
      }
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-[1400px] text-sm border border-gray-400 border-collapse">
          <thead>
            <tr className="text-white">
              <th rowSpan={2} className="px-3 py-2 border border-gray-400 bg-[#1f4e79] text-left">
                No
              </th>
              <th rowSpan={2} className="px-3 py-2 border border-gray-400 bg-[#1f4e79] text-left">
                Bobot
              </th>
              <th colSpan={3} className="px-3 py-2 border border-gray-400 bg-[#1f4e79] text-left">
                Parameter atau Indikator
              </th>
              <th rowSpan={2} className="px-3 py-2 border border-gray-400 bg-[#1f4e79] text-left">
                Bobot
              </th>
              <th rowSpan={2} className="px-3 py-2 border border-gray-400 bg-[#1f4e79] text-left">
                Sumber Risiko
              </th>
              <th rowSpan={2} className="px-3 py-2 border border-gray-400 bg-[#1f4e79] text-left">
                Dampak
              </th>
              <th rowSpan={2} className="px-3 py-2 border border-gray-400 bg-[#b7d7a8] text-left text-black">
                Low
              </th>
              <th rowSpan={2} className="px-3 py-2 border border-gray-400 bg-[#c9daf8] text-left text-black">
                Low to Moderate
              </th>
              <th rowSpan={2} className="px-3 py-2 border border-gray-400 bg-[#fff2cc] text-left text-black">
                Moderate
              </th>
              <th rowSpan={2} className="px-3 py-2 border border-gray-400 bg-[#f9cb9c] text-left text-black">
                Moderate to High
              </th>
              <th rowSpan={2} className="px-3 py-2 border border-gray-400 bg-[#e06666] text-left">
                High
              </th>
              <th rowSpan={2} className="px-3 py-2 border border-gray-400 bg-[#2e75b6] text-left">
                Hasil
              </th>
              <th rowSpan={2} className="px-3 py-2 border border-gray-400 bg-[#385723] text-left">
                Peringkat
              </th>
              <th rowSpan={2} className="px-3 py-2 border border-gray-400 bg-[#d9d9d9] text-left text-black">
                Weighted
              </th>
              <th rowSpan={2} className="px-3 py-2 border border-gray-400 bg-[#1f4e79] text-left">
                Keterangan
              </th>
              <th rowSpan={2} className="px-3 py-2 border border-gray-400 bg-[#1f4e79] text-left">
                Aksi
              </th>
            </tr>
            <tr className="text-white">
              <th className="px-3 py-2 border border-gray-400 bg-[#1f4e79] text-left">Section</th>
              <th className="px-3 py-2 border border-gray-400 bg-[#1f4e79] text-left">Sub No</th>
              <th className="px-3 py-2 border border-gray-400 bg-[#1f4e79] text-left">Indikator</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={18} className="px-3 py-6 text-center text-gray-500 border border-gray-400">
                  Belum ada data untuk {viewYear}-{viewQuarter}
                </td>
              </tr>
            ) : (
              filtered.map((r, i) => (
                <React.Fragment key={r.id_investasi || i}>
                  <tr className="align-top hover:bg-gray-50">
                    <td className="border border-gray-400 px-3 py-2">{r.no}</td>
                    <td className="border border-gray-400 px-3 py-2">{String(r.bobot || r.bobotSection)}%</td>
                    <td className="border border-gray-400 px-3 py-2 bg-[#d9eefb]">{r.parameter || r.sectionLabel}</td>
                    <td className="border border-gray-400 px-3 py-2 bg-[#d9eefb]">{r.no_indikator || r.subNo}</td>
                    <td className="border border-gray-400 px-3 py-2 bg-[#d9eefb] whitespace-pre-wrap">{r.indikator}</td>
                    <td className="border border-gray-400 px-3 py-2">{String(r.bobot_indikator || r.bobotIndikator)}%</td>
                    <td className="border border-gray-400 px-3 py-2 whitespace-pre-wrap">{r.sumber_resiko || r.sumberRisiko}</td>
                    <td className="border border-gray-400 px-3 py-2 whitespace-pre-wrap">{r.dampak}</td>
                    <td className="border border-gray-400 px-3 py-2">{r.low}</td>
                    <td className="border border-gray-400 px-3 py-2">{r.low_to_moderate || r.lowToModerate}</td>
                    <td className="border border-gray-400 px-3 py-2">{r.moderate}</td>
                    <td className="border border-gray-400 px-3 py-2">{r.moderate_to_high || r.moderateToHigh}</td>
                    <td className="border border-gray-400 px-3 py-2">{r.high}</td>
                    <td className="border border-gray-400 px-3 py-2 text-right">{typeof r.hasil === 'number' ? r.hasil.toFixed(2) + '%' : r.hasil}</td>
                    <td className="border border-gray-400 px-3 py-2">{String(r.peringkat)}</td>
                    <td className="border border-gray-400 px-3 py-2 text-right">{r.weighted !== '' && r.weighted !== null ? `${r.weighted}%` : ''}</td>
                    <td className="border border-gray-400 px-3 py-2">{r.keterangan}</td>
                    <td className="border border-gray-400 px-3 py-2">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(r)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border hover:bg-gray-50">
                          <Edit3 size={16} /> Edit
                        </button>
                        <button onClick={() => handleDelete(r)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border hover:bg-red-50 text-red-600">
                          <Trash2 size={16} /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Pembilang */}
                  <tr>
                    <td className="border border-gray-300 px-3 py-2" colSpan={3}></td>
                    <td className="border border-gray-300 px-3 py-2"></td>
                    <td className="border border-gray-300 px-3 py-2">{r.nama_pembilang || r.numeratorLabel}</td>
                    <td className="border border-gray-300 px-3 py-2" colSpan={9}></td>
                    <td className="border border-gray-300 px-3 py-2 bg-[#c6d9a7] text-right">{String(r.total_pembilang || r.numeratorValue || 0)}</td>
                    <td className="border border-gray-300 px-3 py-2" colSpan={3}></td>
                  </tr>
                  {/* Penyebut */}
                  <tr>
                    <td className="border border-gray-300 px-3 py-2" colSpan={3}></td>
                    <td className="border border-gray-300 px-3 py-2"></td>
                    <td className="border border-gray-300 px-3 py-2">{r.nama_penyebut || r.denominatorLabel}</td>
                    <td className="border border-gray-300 px-3 py-2" colSpan={9}></td>
                    <td className="border border-gray-300 px-3 py-2 bg-[#c6d9a7] text-right">{String(r.total_penyebut || r.denominatorValue || 0)}</td>
                    <td className="border border-gray-300 px-3 py-2" colSpan={3}></td>
                  </tr>
                </React.Fragment>
              ))
            )}
          </tbody>

          <tfoot>
            <tr>
              <td className="border border-gray-400" colSpan={14}></td>
              <td className="border border-gray-400 text-white font-semibold text-center bg-[#0b3861]" colSpan={2}>
                Summary
              </td>
              <td className="border border-gray-400 text-white font-semibold text-center bg-[#8fce00]">{totalWeighted.toFixed(2)}</td>
              <td className="border border-gray-400"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
