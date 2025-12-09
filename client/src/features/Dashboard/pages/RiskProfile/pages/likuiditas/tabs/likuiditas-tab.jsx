// // LikuiditasTab.jsx
// import React, { useState, useMemo, useEffect } from 'react';
// import { Download, Trash2, Edit3, Search, Plus, ChevronDown } from 'lucide-react';
// import { RiskField, YearInput, QuarterSelect } from '../../pasar/components/Inputs';
// import { exportKPMRPasarToExcel } from '../../pasar/utils/excelexportpasar';
// import { useLikuiditasDataManagement, useUpdateSection, useUpdateIndikator, useDeleteIndikator, useDeleteSection, useLikuiditasCalculations } from '../hooks/likuiditas/likuiditas.hook';
// import { useAuditLog } from '../../../../audit-log/hooks/audit-log.hooks';
// import { useAuth } from '../../../../../../auth/hooks/useAuth.hook';

// // ===================== Constants =====================
// const PNM_BRAND = {
//   primary: '#0068B3',
//   primarySoft: '#E6F1FA',
//   gradient: 'bg-gradient-to-r from-[#0076C6]/90 via-[#00A3DA]/90 to-[#33C2B5]/90',
// };

// // Formatters
// const fmtNumber = (v) => {
//   if (v === '' || v == null) return '';
//   const n = Number(v);
//   if (isNaN(n)) return String(v);
//   return new Intl.NumberFormat('en-US').format(n);
// };

// const fmtPercentFromDecimal = (v) => {
//   if (v === '' || v == null || isNaN(Number(v))) return '';
//   return (Number(v) * 100).toFixed(2) + '%';
// };

// const emptyIndicator = {
//   id: null,
//   sub_no: '',
//   nama_indikator: '',
//   bobot_indikator: 0,
//   sumber_risiko: '',
//   dampak: '',
//   pembilang_label: '',
//   pembilang_value: '',
//   penyebut_label: '',
//   penyebut_value: '',
//   low: '',
//   low_to_moderate: '',
//   moderate: '',
//   moderate_to_high: '',
//   high: '',
//   peringkat: 1,
//   keterangan: '',
// };

// // Transform functions untuk likuiditas
// const transformIndicatorToBackend = (indicatorData) => {
//   return {
//     section_id: indicatorData.sectionId,
//     sub_no: indicatorData.sub_no,
//     nama_indikator: indicatorData.nama_indikator,
//     bobot_indikator: Number(indicatorData.bobot_indikator || 0),
//     pembilang_label: indicatorData.pembilang_label,
//     pembilang_value: Number(indicatorData.pembilang_value || 0),
//     penyebut_label: indicatorData.penyebut_label,
//     penyebut_value: Number(indicatorData.penyebut_value || 0),
//     sumber_risiko: indicatorData.sumber_risiko,
//     dampak: indicatorData.dampak,
//     low: indicatorData.low,
//     low_to_moderate: indicatorData.low_to_moderate,
//     moderate: indicatorData.moderate,
//     moderate_to_high: indicatorData.moderate_to_high,
//     high: indicatorData.high,
//     peringkat: Number(indicatorData.peringkat || 1),
//     keterangan: indicatorData.keterangan,
//   };
// };

// const transformIndicatorToFrontend = (indikator) => {
//   return {
//     id: indikator.id,
//     sub_no: indikator.sub_no,
//     nama_indikator: indikator.nama_indikator,
//     bobot_indikator: indikator.bobot_indikator,
//     sumber_risiko: indikator.sumber_risiko,
//     dampak: indikator.dampak,
//     pembilang_label: indikator.pembilang_label,
//     pembilang_value: indikator.pembilang_value,
//     penyebut_label: indikator.penyebut_label,
//     penyebut_value: indikator.penyebut_value,
//     low: indikator.low,
//     low_to_moderate: indikator.low_to_moderate,
//     moderate: indikator.moderate,
//     moderate_to_high: indikator.moderate_to_high,
//     high: indikator.high,
//     peringkat: indikator.peringkat,
//     weighted: indikator.weighted,
//     hasil: indikator.hasil,
//     keterangan: indikator.keterangan,
//   };
// };

// export default function LikuiditasTab({ viewYear, setViewYear, viewQuarter, setViewQuarter, query, setQuery }) {
//   // ====== Audit Log Integration ======
//   const { user: authUser } = useAuth();
//   const { logUpdate, logDelete, logExport, logCreate } = useAuditLog();

//   // Hooks untuk data management
//   const {
//     sections,
//     summary,
//     createSection,
//     createIndikator,
//     deleteSection: deleteSectionMutation,
//     deleteIndikator: deleteIndikatorMutation,
//     isCreatingSection,
//     isCreatingIndikator,
//     isDeletingSection,
//     isDeletingIndikator,
//     refetch,
//     isLoading,
//     isFetching,
//     error: dataError,
//   } = useLikuiditasDataManagement({ tahun: viewYear, triwulan: viewQuarter });

//   const { mutate: updateSection } = useUpdateSection();
//   const { mutate: updateIndikator } = useUpdateIndikator();
//   const { calculateHasil, calculateWeighted, determineRiskLevel } = useLikuiditasCalculations();

//   // State untuk form
//   const [sectionForm, setSectionForm] = useState({
//     id: null,
//     no_sec: '',
//     nama_section: '',
//     bobot_par: 0,
//     tahun: viewYear,
//     triwulan: viewQuarter,
//   });

//   const [indicatorForm, setIndicatorForm] = useState({
//     ...emptyIndicator,
//     sectionId: null,
//   });

//   const [isEditingSection, setIsEditingSection] = useState(false);
//   const [isEditingIndicator, setIsEditingIndicator] = useState(false);
//   const [error, setError] = useState(null);

//   // ====== Fungsi Audit Log ======
//   const handleAuditLog = async (action, description, isSuccess = true, metadata = {}) => {
//     try {
//       const userId = authUser?.user_id || authUser?.id;

//       const auditData = {
//         action,
//         module: 'LIKUIDITAS',
//         description,
//         isSuccess,
//         userId: userId || null,
//         metadata: {
//           year: viewYear,
//           quarter: viewQuarter,
//           authUserId: userId,
//           authUserAvailable: !!authUser,
//           ...metadata,
//         },
//       };

//       console.log('📝 [LIKUIDITAS AUDIT] Audit data:', auditData);

//       switch (action) {
//         case 'CREATE':
//           await logCreate('LIKUIDITAS', description, {
//             isSuccess,
//             userId: userId || null,
//             metadata: auditData.metadata,
//           });
//           break;
//         case 'UPDATE':
//           await logUpdate('LIKUIDITAS', description, {
//             isSuccess,
//             userId: userId || null,
//             metadata: auditData.metadata,
//           });
//           break;
//         case 'DELETE':
//           await logDelete('LIKUIDITAS', description, {
//             isSuccess,
//             userId: userId || null,
//             metadata: auditData.metadata,
//           });
//           break;
//         case 'EXPORT':
//           await logExport('LIKUIDITAS', description, {
//             isSuccess,
//             userId: userId || null,
//             metadata: auditData.metadata,
//           });
//           break;
//         default:
//           break;
//       }

//       console.log('✅ [LIKUIDITAS AUDIT] Audit logged successfully');
//     } catch (error) {
//       console.error('❌ [LIKUIDITAS AUDIT] Audit failed:', error);
//     }
//   };

//   // ====== EFFECTS ======
//   useEffect(() => {
//     setSectionForm((prev) => ({
//       ...prev,
//       tahun: viewYear,
//       triwulan: viewQuarter,
//     }));
//   }, [viewYear, viewQuarter]);

//   useEffect(() => {
//     if (error) setError(null);
//   }, [sectionForm, indicatorForm]);

//   // ====== UTILITY FUNCTIONS ======
//   const setIndicatorField = (field, value) => {
//     setIndicatorForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const selectSection = (id) => {
//     const section = sections.find((s) => s.id === id);
//     if (section) {
//       setSectionForm({
//         id: section.id,
//         no_sec: section.no_sec,
//         nama_section: section.nama_section,
//         bobot_par: section.bobot_par,
//         tahun: section.tahun,
//         triwulan: section.triwulan,
//       });
//       setIsEditingSection(true);
//       setIndicatorForm((prev) => ({
//         ...prev,
//         sectionId: Number(section.id),
//       }));
//     }
//   };

//   const resetSectionForm = () => {
//     setSectionForm({
//       id: null,
//       no_sec: '',
//       nama_section: '',
//       bobot_par: 0,
//       tahun: viewYear,
//       triwulan: viewQuarter,
//     });
//     setIsEditingSection(false);
//     setIndicatorForm((prev) => ({ ...prev, sectionId: null }));
//   };

//   const resetIndicatorForm = () => {
//     setIndicatorForm({
//       ...emptyIndicator,
//       sectionId: sectionForm.id,
//     });
//     setIsEditingIndicator(false);
//   };

//   // ====== VALIDATION FUNCTIONS ======
//   const validateSectionForm = () => {
//     if (!sectionForm.no_sec || !sectionForm.nama_section) {
//       setError('No Section dan Nama Section harus diisi');
//       return false;
//     }

//     if (sectionForm.bobot_par <= 0) {
//       setError('Bobot Section harus lebih dari 0');
//       return false;
//     }

//     return true;
//   };

//   const validateIndicatorForm = () => {
//     if (!sectionForm.id) {
//       setError('Pilih section terlebih dahulu');
//       return false;
//     }

//     if (!indicatorForm.nama_indikator || !indicatorForm.bobot_indikator) {
//       setError('Nama Indikator dan Bobot Indikator harus diisi');
//       return false;
//     }

//     if (Number(indicatorForm.bobot_indikator) <= 0) {
//       setError('Bobot Indikator harus lebih dari 0');
//       return false;
//     }

//     return true;
//   };

//   // ====== SECTION CRUD OPERATIONS ======
//   const handleCreateSection = () => {
//     setError(null);

//     if (!validateSectionForm()) return;

//     createSection(
//       {
//         no_sec: sectionForm.no_sec,
//         nama_section: sectionForm.nama_section,
//         bobot_par: Number(sectionForm.bobot_par),
//         tahun: viewYear,
//         triwulan: viewQuarter,
//       },
//       {
//         onSuccess: () => {
//           handleAuditLog('CREATE', `Menambahkan section likuiditas - No: ${sectionForm.no_sec}, Nama: "${sectionForm.nama_section}", Bobot: ${sectionForm.bobot_par}%`, true, {
//             section_no: sectionForm.no_sec,
//             section_name: sectionForm.nama_section,
//             bobot_par: sectionForm.bobot_par,
//           });

//           resetSectionForm();
//           refetch();
//         },
//         onError: (error) => {
//           handleAuditLog('CREATE', `Gagal menambah section likuiditas - No: ${sectionForm.no_sec}, Nama: "${sectionForm.nama_section}"`, false, {
//             section_no: sectionForm.no_sec,
//             section_name: sectionForm.nama_section,
//             error: error.message,
//           });
//           setError(`Gagal membuat section: ${error.message}`);
//         },
//       }
//     );
//   };

//   const handleUpdateSection = () => {
//     setError(null);
//     if (!sectionForm.id) return;

//     if (!validateSectionForm()) return;

//     updateSection(
//       {
//         id: sectionForm.id,
//         data: {
//           no_sec: sectionForm.no_sec,
//           nama_section: sectionForm.nama_section,
//           bobot_par: Number(sectionForm.bobot_par),
//         },
//       },
//       {
//         onSuccess: () => {
//           handleAuditLog('UPDATE', `Mengupdate section likuiditas - No: ${sectionForm.no_sec}, Nama: "${sectionForm.nama_section}", Bobot: ${sectionForm.bobot_par}%`, true, {
//             section_id: sectionForm.id,
//             section_no: sectionForm.no_sec,
//             section_name: sectionForm.nama_section,
//             bobot_par: sectionForm.bobot_par,
//           });

//           resetSectionForm();
//           refetch();
//         },
//         onError: (error) => {
//           handleAuditLog('UPDATE', `Gagal update section likuiditas - No: ${sectionForm.no_sec}, Nama: "${sectionForm.nama_section}"`, false, {
//             section_id: sectionForm.id,
//             section_no: sectionForm.no_sec,
//             section_name: sectionForm.nama_section,
//             error: error.message,
//           });
//           setError(`Gagal update section: ${error.message}`);
//         },
//       }
//     );
//   };

//   const handleDeleteSection = (id) => {
//     if (!confirm('Apakah Anda yakin ingin menghapus section ini? Semua indikator dalam section ini juga akan dihapus.')) return;

//     const sectionToDelete = sections.find((s) => s.id === id);

//     deleteSectionMutation(id, {
//       onSuccess: () => {
//         handleAuditLog('DELETE', `Menghapus section likuiditas - No: ${sectionToDelete?.no_sec}, Nama: "${sectionToDelete?.nama_section}"`, true, {
//           section_id: id,
//           section_no: sectionToDelete?.no_sec,
//           section_name: sectionToDelete?.nama_section,
//           total_indicators: sectionToDelete?.indikators?.length || 0,
//         });

//         resetSectionForm();
//         refetch();
//       },
//       onError: (error) => {
//         handleAuditLog('DELETE', `Gagal menghapus section likuiditas - No: ${sectionToDelete?.no_sec}, Nama: "${sectionToDelete?.nama_section}"`, false, {
//           section_id: id,
//           section_no: sectionToDelete?.no_sec,
//           section_name: sectionToDelete?.nama_section,
//           error: error.message,
//         });
//         setError(`Gagal menghapus section: ${error.message}`);
//       },
//     });
//   };

//   // ====== INDICATOR CRUD OPERATIONS ======
//   const handleCreateIndicator = () => {
//     setError(null);

//     if (!validateIndicatorForm()) return;

//     const createData = transformIndicatorToBackend({
//       ...indicatorForm,
//       sectionId: sectionForm.id,
//     });

//     createIndikator(createData, {
//       onSuccess: () => {
//         handleAuditLog('CREATE', `Menambahkan indikator likuiditas - "${indicatorForm.nama_indikator}", Bobot: ${indicatorForm.bobot_indikator}%`, true, {
//           section_id: sectionForm.id,
//           section_no: sectionForm.no_sec,
//           indicator_name: indicatorForm.nama_indikator,
//           bobot_indikator: indicatorForm.bobot_indikator,
//           peringkat: indicatorForm.peringkat,
//         });

//         resetIndicatorForm();
//         refetch();
//       },
//       onError: (error) => {
//         handleAuditLog('CREATE', `Gagal menambah indikator likuiditas - "${indicatorForm.nama_indikator}"`, false, {
//           section_id: sectionForm.id,
//           section_no: sectionForm.no_sec,
//           indicator_name: indicatorForm.nama_indikator,
//           error: error.message,
//         });
//         setError(`Gagal membuat indikator: ${error.message}`);
//       },
//     });
//   };

//   const handleEditIndicator = (indikator) => {
//     const frontendData = transformIndicatorToFrontend(indikator);
//     setIndicatorForm({
//       ...frontendData,
//       sectionId: sectionForm.id,
//     });
//     setIsEditingIndicator(true);
//   };

//   const handleUpdateIndicator = () => {
//     setError(null);
//     if (!indicatorForm.id) return;

//     if (!validateIndicatorForm()) return;

//     const updateData = transformIndicatorToBackend({
//       ...indicatorForm,
//       sectionId: sectionForm.id,
//     });

//     updateIndikator(
//       {
//         id: indicatorForm.id,
//         data: updateData,
//       },
//       {
//         onSuccess: () => {
//           handleAuditLog('UPDATE', `Mengupdate indikator likuiditas - "${indicatorForm.nama_indikator}", Bobot: ${indicatorForm.bobot_indikator}%`, true, {
//             indicator_id: indicatorForm.id,
//             section_id: sectionForm.id,
//             section_no: sectionForm.no_sec,
//             indicator_name: indicatorForm.nama_indikator,
//             bobot_indikator: indicatorForm.bobot_indikator,
//             peringkat: indicatorForm.peringkat,
//           });

//           resetIndicatorForm();
//           refetch();
//         },
//         onError: (error) => {
//           handleAuditLog('UPDATE', `Gagal update indikator likuiditas - "${indicatorForm.nama_indikator}"`, false, {
//             indicator_id: indicatorForm.id,
//             section_id: sectionForm.id,
//             section_no: sectionForm.no_sec,
//             indicator_name: indicatorForm.nama_indikator,
//             error: error.message,
//           });
//           setError(`Gagal update indikator: ${error.message}`);
//         },
//       }
//     );
//   };

//   const handleDeleteIndicator = (indikatorId) => {
//     if (!confirm('Apakah Anda yakin ingin menghapus indikator ini?')) return;

//     const indicatorToDelete = sections.flatMap((s) => s.indikators || []).find((it) => it.id === indikatorId);

//     deleteIndikatorMutation(indikatorId, {
//       onSuccess: () => {
//         handleAuditLog('DELETE', `Menghapus indikator likuiditas - "${indicatorToDelete?.nama_indikator}"`, true, {
//           indicator_id: indikatorId,
//           section_id: sectionForm.id,
//           section_no: sectionForm.no_sec,
//           indicator_name: indicatorToDelete?.nama_indikator,
//         });

//         refetch();
//       },
//       onError: (error) => {
//         handleAuditLog('DELETE', `Gagal menghapus indikator likuiditas - "${indicatorToDelete?.nama_indikator}"`, false, {
//           indicator_id: indikatorId,
//           section_id: sectionForm.id,
//           section_no: sectionForm.no_sec,
//           indicator_name: indicatorToDelete?.nama_indikator,
//           error: error.message,
//         });
//         setError(`Gagal menghapus indikator: ${error.message}`);
//       },
//     });
//   };

//   // ====== EXPORT FUNCTION ======
//   const handleExportLikuiditas = () => {
//     const selectedSection = sections.find((s) => s.id === sectionForm.id) || sections[0];

//     if (!selectedSection) {
//       alert('Belum ada section untuk diexport.');
//       return;
//     }

//     const rows = selectedSection.indikators || [];
//     if (!rows.length) {
//       alert('Section ini belum punya indikator untuk diexport.');
//       return;
//     }

//     try {
//       const exportData = rows.map((indikator) => ({
//         subNo: indikator.sub_no,
//         indikator: indikator.nama_indikator,
//         bobotIndikator: indikator.bobot_indikator,
//         sumberRisiko: indikator.sumber_risiko,
//         dampak: indikator.dampak,
//         pembilangLabel: indikator.pembilang_label,
//         pembilangValue: indikator.pembilang_value,
//         penyebutLabel: indikator.penyebut_label,
//         penyebutValue: indikator.penyebut_value,
//         low: indikator.low,
//         lowToModerate: indikator.low_to_moderate,
//         moderate: indikator.moderate,
//         moderateToHigh: indikator.moderate_to_high,
//         high: indikator.high,
//         peringkat: indikator.peringkat,
//         weighted: indikator.weighted,
//         hasil: indikator.hasil,
//         keterangan: indikator.keterangan,
//       }));

//       handleAuditLog('EXPORT', `Export data Excel likuiditas - Periode: ${viewYear}-${viewQuarter}, Section: ${selectedSection.no_sec}, Jumlah Data: ${rows.length}`, true, {
//         year: viewYear,
//         quarter: viewQuarter,
//         section_id: selectedSection.id,
//         section_no: selectedSection.no_sec,
//         section_name: selectedSection.nama_section,
//         total_records: rows.length,
//         file_type: 'excel',
//       });

//       exportKPMRPasarToExcel({
//         year: viewYear,
//         quarter: viewQuarter,
//         sectionNo: selectedSection.no_sec,
//         sectionLabel: selectedSection.nama_section,
//         bobotSection: selectedSection.bobot_par,
//         rows: exportData,
//       });
//     } catch (err) {
//       handleAuditLog('EXPORT', `Gagal export data Excel likuiditas - Periode: ${viewYear}-${viewQuarter}`, false, {
//         year: viewYear,
//         quarter: viewQuarter,
//         section_id: selectedSection?.id,
//         section_no: selectedSection?.no_sec,
//         error: err.message,
//       });
//       console.error('Gagal export Excel:', err);
//       alert('Gagal melakukan export. Silakan coba lagi.');
//     }
//   };

//   // ====== MEMOIZED VALUES ======
//   const filteredSections = useMemo(() => {
//     if (!query.trim()) return sections;
//     const q = query.toLowerCase();
//     return sections
//       .map((s) => {
//         const matchedIndicators = s.indikators?.filter((it) => {
//           return `${it.nama_indikator} ${it.pembilang_label} ${it.penyebut_label} ${it.sumber_risiko} ${it.dampak} ${it.keterangan}`.toLowerCase().includes(q);
//         });
//         if (s.nama_section.toLowerCase().includes(q) || matchedIndicators?.length > 0) {
//           return { ...s, indikators: matchedIndicators?.length ? matchedIndicators : s.indikators };
//         }
//         return null;
//       })
//       .filter(Boolean);
//   }, [sections, query]);

//   // PERBAIKAN: Handle case ketika summary tidak ada atau total_weighted bukan number
//   const totalWeighted = useMemo(() => {
//     const total = summary?.total_weighted;

//     // Pastikan total adalah number yang valid
//     if (typeof total === 'number' && !isNaN(total)) {
//       return total;
//     }

//     // Jika summary tidak ada, hitung manual dari sections
//     if (sections && sections.length > 0) {
//       const calculatedTotal = sections.reduce((sum, section) => {
//         const sectionTotal =
//           section.indikators?.reduce((sectionSum, indikator) => {
//             return sectionSum + (Number(indikator.weighted) || 0);
//           }, 0) || 0;
//         return sum + sectionTotal;
//       }, 0);

//       return calculatedTotal;
//     }

//     // Default fallback
//     return 0;
//   }, [summary, sections]);

//   const hasilPreview = useMemo(() => {
//     const pembilang = Number(indicatorForm.pembilang_value || 0);
//     const penyebut = Number(indicatorForm.penyebut_value || 1);
//     if (!penyebut || penyebut === 0) return 0;
//     return calculateHasil(pembilang, penyebut);
//   }, [indicatorForm.pembilang_value, indicatorForm.penyebut_value]);

//   const weightedPreview = useMemo(() => {
//     if (!sectionForm.id) return 0;
//     return calculateWeighted(hasilPreview, Number(indicatorForm.bobot_indikator || 0));
//   }, [sectionForm.id, indicatorForm.bobot_indikator, hasilPreview]);

//   const rowsPerIndicator = 3;

//   // ====== RENDER ======
//   return (
//     <>
//       <header className="px-4 py-4 flex items-center justify-between gap-3">
//         <h2 className="text-xl sm:text-2xl font-semibold">Form – Likuiditas</h2>
//         <div className="flex items-center gap-3">
//           {/* tahun + triwulan */}
//           <div className="hidden md:flex items-center gap-3">
//             <div className="flex items-center gap-2">
//               <label className="sr-only">Tahun</label>
//               <YearInput value={viewYear} onChange={(v) => setViewYear(v)} />
//             </div>

//             <div className="flex items-center gap-2">
//               <label className="sr-only">Triwulan</label>
//               <QuarterSelect value={viewQuarter} onChange={(v) => setViewQuarter(v)} />
//             </div>
//           </div>

//           {/* group search + export */}
//           <div className="flex items-center gap-2 transform -translate-y-1">
//             <div className="relative">
//               <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari no/sub/indikator/keterangan…" className="pl-9 pr-3 py-2 rounded-xl border w-64" />
//               <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
//             </div>

//             <button
//               onClick={handleExportLikuiditas}
//               className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-gray-900 text-white hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed"
//               disabled={sections.length === 0}
//             >
//               <Download size={18} /> Export {viewYear}-{viewQuarter}
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Error Display */}
//       {(error || dataError) && <div className="mx-4 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error || dataError?.message}</div>}

//       {/* Loading Indicator */}
//       {isLoading && (
//         <div className="mx-4 mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded flex items-center gap-2">
//           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//           Memuat data...
//         </div>
//       )}

//       {/* top toolbar with section */}
//       <div className="relative rounded-2xl overflow-hidden mb-6 shadow-sm bg-gradient-to-r from-[#0076C6]/90 via-[#00A3DA]/90 to-[#33C2B5]/90">
//         <div className="rounded-2xl border-2 border-gray-300 p-4 shadow-sm mb-6">
//           <h2 className="text-white font-semibold text-lg sm:text-xl mb-6">Form Likuiditas</h2>

//           {/* Section Form */}
//           <div className="flex items-center gap-3 mb-4">
//             <div className="flex items-center gap-2">
//               <div className="text-xs text-white font-medium">No Sec</div>
//               <input className="w-20 px-3 py-2 rounded-lg border-2 border-gray-300 text-center font-medium bg-white" value={sectionForm.no_sec} onChange={(e) => setSectionForm((f) => ({ ...f, no_sec: e.target.value }))} placeholder="3.1" />
//             </div>

//             <div className="flex items-center gap-2">
//               <div className="text-xs text-white font-medium">Bobot Par</div>
//               <input
//                 type="number"
//                 className="w-24 px-3 py-2 rounded-lg border-2 border-gray-300 text-center font-medium bg-white"
//                 value={sectionForm.bobot_par}
//                 onChange={(e) => setSectionForm((f) => ({ ...f, bobot_par: e.target.value }))}
//                 min="0"
//                 max="100"
//                 step="0.01"
//               />
//             </div>

//             <div className="flex-1">
//               <div className="text-xs text-white font-medium mb-1">Section</div>
//               <input
//                 className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 font-medium bg-white"
//                 value={sectionForm.nama_section}
//                 onChange={(e) => setSectionForm((f) => ({ ...f, nama_section: e.target.value }))}
//                 placeholder="Komposisi Aset dan Liabilitas Jangka Pendek termasuk Transaksi Rekening Administratif"
//               />
//             </div>

//             <div className="flex items-center gap-2 pt-5">
//               {!isEditingSection ? (
//                 <button className="w-10 h-10 rounded-lg bg-green-500 hover:bg-green-600 text-white flex items-center justify-center disabled:bg-gray-400" onClick={handleCreateSection} disabled={isCreatingSection} title="Tambah Section">
//                   {isCreatingSection ? '...' : <Plus size={20} />}
//                 </button>
//               ) : (
//                 <>
//                   <button className="w-10 h-10 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center disabled:bg-gray-400" onClick={handleUpdateSection} disabled={isCreatingSection} title="Update Section">
//                     {isCreatingSection ? '...' : <Edit3 size={20} />}
//                   </button>
//                   <button className="w-10 h-10 rounded-lg bg-gray-500 hover:bg-gray-600 text-white flex items-center justify-center" onClick={resetSectionForm} title="Batal">
//                     ✕
//                   </button>
//                 </>
//               )}
//               {isEditingSection && (
//                 <button
//                   className="w-10 h-10 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center disabled:bg-gray-400"
//                   onClick={() => handleDeleteSection(sectionForm.id)}
//                   disabled={isDeletingSection}
//                   title="Hapus Section"
//                 >
//                   {isDeletingSection ? '...' : <Trash2 size={20} />}
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Section Dropdown */}
//           <div className="relative">
//             <label className="text-xs text-white font-medium mb-1 block">Pilih Section</label>
//             <select
//               className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 font-medium appearance-none bg-white cursor-pointer pr-10"
//               value={sectionForm.id || ''}
//               onChange={(e) => {
//                 const selectedId = e.target.value ? Number(e.target.value) : null;
//                 if (selectedId) {
//                   selectSection(selectedId);
//                 } else {
//                   resetSectionForm();
//                 }
//               }}
//             >
//               <option value="">-- Pilih Section --</option>
//               {sections.map((s) => (
//                 <option key={s.id} value={s.id}>
//                   {s.no_sec} - {s.nama_section}
//                 </option>
//               ))}
//             </select>
//             <ChevronDown className="absolute right-4 top-9 pointer-events-none text-gray-400" size={20} />
//           </div>
//         </div>

//         {/* main body: indicator form - Hanya tampil jika section dipilih */}
//         {sectionForm.id && (
//           <div className="rounded-xl border-2 border-gray-300 shadow-sm p-6 mb-6">
//             <h3 className="text-white font-semibold text-lg mb-4">Tambah Indikator</h3>

//             {/* Sub No, Indikator & Bobot Indikator Row */}
//             <div className="grid grid-cols-12 gap-4 mb-4">
//               <div className="col-span-2">
//                 <label className="text-sm font-medium mb-2 block text-white">Sub No</label>
//                 <input className="w-full rounded-lg border-2 border-gray-300 px-3 py-3 text-sm bg-white" value={indicatorForm.sub_no} onChange={(e) => setIndicatorField('sub_no', e.target.value)} placeholder="3.1.1" />
//               </div>
//               <div className="col-span-7">
//                 <label className="text-sm font-medium mb-2 block text-white">Indikator</label>
//                 <input
//                   className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
//                   value={indicatorForm.nama_indikator}
//                   onChange={(e) => setIndicatorField('nama_indikator', e.target.value)}
//                   placeholder="Rasio Lancar (Current Ratio)…"
//                 />
//               </div>
//               <div className="col-span-3">
//                 <label className="text-sm font-medium mb-2 block text-right text-white">Bobot Indikator</label>
//                 <input
//                   type="number"
//                   className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm text-right bg-white"
//                   value={indicatorForm.bobot_indikator}
//                   onChange={(e) => setIndicatorField('bobot_indikator', e.target.value)}
//                   placeholder="50"
//                   min="0"
//                   max="100"
//                   step="0.01"
//                 />
//               </div>
//             </div>

//             {/* Faktor Penyebut & Value Row */}
//             <div className="grid grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="text-sm font-medium mb-2 block text-white">Faktor Penyebut</label>
//                 <input
//                   className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
//                   value={indicatorForm.penyebut_label}
//                   onChange={(e) => setIndicatorField('penyebut_label', e.target.value)}
//                   placeholder="Hutang Lancar (Jutaan)"
//                 />
//               </div>
//               <div>
//                 <label className="text-sm font-medium mb-2 block text-white">Value Penyebut</label>
//                 <input
//                   type="number"
//                   className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
//                   value={indicatorForm.penyebut_value}
//                   onChange={(e) => setIndicatorField('penyebut_value', e.target.value)}
//                   placeholder="4000"
//                   step="0.01"
//                 />
//               </div>
//             </div>

//             {/* Faktor Pembilang & Value Row */}
//             <div className="grid grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="text-sm font-medium mb-2 block text-white">Faktor Pembilang</label>
//                 <input
//                   className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
//                   value={indicatorForm.pembilang_label}
//                   onChange={(e) => setIndicatorField('pembilang_label', e.target.value)}
//                   placeholder="Aktiva Lancar (Jutaan)"
//                 />
//               </div>
//               <div>
//                 <label className="text-sm font-medium mb-2 block text-white">Value Pembilang</label>
//                 <input
//                   type="number"
//                   className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
//                   value={indicatorForm.pembilang_value}
//                   onChange={(e) => setIndicatorField('pembilang_value', e.target.value)}
//                   placeholder="5000"
//                   step="0.01"
//                 />
//               </div>
//             </div>

//             {/* Sumber Resiko & Dampak Row */}
//             <div className="grid grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="text-sm font-medium mb-2 block text-white">Sumber Resiko</label>
//                 <textarea
//                   rows={4}
//                   className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm resize-none bg-white"
//                   value={indicatorForm.sumber_risiko}
//                   onChange={(e) => setIndicatorField('sumber_risiko', e.target.value)}
//                   placeholder="Penurunan nilai aset lancar atau peningkatan kewajiban lancar akibat aktivitas bisnis"
//                 />
//               </div>
//               <div>
//                 <label className="text-sm font-medium mb-2 block text-white">Dampak</label>
//                 <textarea
//                   rows={4}
//                   className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm resize-none bg-white"
//                   value={indicatorForm.dampak}
//                   onChange={(e) => setIndicatorField('dampak', e.target.value)}
//                   placeholder="Penurunan tingkat kesehatan perusahaan hingga kegagalan memenuhi kewajiban kepada pihak ketiga"
//                 />
//               </div>
//             </div>

//             {/* Bottom Section: Hasil Preview, Peringkat, Weighted, Legend & Button */}
//             <div className="grid grid-cols-12 gap-4">
//               {/* Left side: Preview boxes */}
//               <div className="col-span-6 flex gap-4">
//                 <div className="flex-1">
//                   <label className="text-sm font-medium mb-2 block text-white">Hasil Preview (Rasio)</label>
//                   <input className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-gray-50" value={hasilPreview.toFixed(4)} readOnly />
//                 </div>
//                 <div className="flex-1">
//                   <label className="text-sm font-medium mb-2 block text-white">Peringkat (1 - 5)</label>
//                   <input type="number" min="1" max="5" className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white" value={indicatorForm.peringkat} onChange={(e) => setIndicatorField('peringkat', e.target.value)} />
//                 </div>
//                 <div className="flex-1">
//                   <label className="text-sm font-medium mb-2 block text-white">Weighted(auto)</label>
//                   <input className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-gray-50" value={weightedPreview.toFixed(2)} readOnly />
//                 </div>
//               </div>

//               {/* Right side: Legend */}
//               <div className="col-span-6 grid grid-cols-5 gap-3 items-stretch">
//                 <RiskField className="w-full" label="Low" value={indicatorForm.low} onChange={(v) => setIndicatorField('low', v)} color="#B7E1A1" textColor="#0B3D2E" placeholder="x ≥ 1.5" />
//                 <RiskField className="w-full" label="Low to Moderate" value={indicatorForm.low_to_moderate} onChange={(v) => setIndicatorField('low_to_moderate', v)} color="#CFE0FF" textColor="#0B2545" placeholder="1.3 ≤ x < 1.5" />
//                 <RiskField className="w-full" label="Moderate" value={indicatorForm.moderate} onChange={(v) => setIndicatorField('moderate', v)} color="#FFEEAD" textColor="#4B3A00" placeholder="1.1 ≤ x < 1.3" />
//                 <RiskField className="w-full" label="Moderate to High" value={indicatorForm.moderate_to_high} onChange={(v) => setIndicatorField('moderate_to_high', v)} color="#FAD2A7" textColor="#5A2E00" placeholder="1.0 ≤ x < 1.1" />
//                 <RiskField className="w-full" label="High" value={indicatorForm.high} onChange={(v) => setIndicatorField('high', v)} color="#E57373" textColor="#FFFFFF" placeholder="x < 1.0" />
//               </div>
//             </div>

//             {/* Keterangan */}
//             <div className="mt-4">
//               <label className="text-sm font-medium mb-2 block text-white">Keterangan</label>
//               <input className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white" value={indicatorForm.keterangan} onChange={(e) => setIndicatorField('keterangan', e.target.value)} placeholder="Loading" />
//             </div>

//             {/* Add/Save Button */}
//             <div className="mt-6 flex justify-end">
//               {!isEditingIndicator ? (
//                 <button onClick={handleCreateIndicator} disabled={isCreatingIndikator} className="px-8 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold disabled:bg-gray-400">
//                   {isCreatingIndikator ? 'Menyimpan...' : '+ Tambah Indikator'}
//                 </button>
//               ) : (
//                 <div className="flex gap-3">
//                   <button onClick={handleUpdateIndicator} disabled={isCreatingIndikator} className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:bg-gray-400">
//                     {isCreatingIndikator ? 'Menyimpan...' : 'Simpan Perubahan'}
//                   </button>
//                   <button onClick={resetIndicatorForm} className="px-8 py-3 rounded-lg border-2 border-gray-300 hover:bg-gray-50 font-semibold">
//                     Batal
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* table area */}
//       <div className="rounded-xl border bg-white shadow-sm overflow-auto">
//         <table className="min-w-[1400px] text-sm border border-gray-300 border-collapse">
//           <thead>
//             <tr className="bg-[#1f4e79] text-white">
//               <th className="border px-3 py-2 text-left" style={{ width: 60 }}>
//                 No
//               </th>
//               <th className="border px-3 py-2 text-left" style={{ width: 80 }}>
//                 Bobot
//               </th>
//               <th className="border px-3 py-2 text-left" style={{ width: 340 }}>
//                 Parameter / Section
//               </th>
//               <th className="border px-3 py-2 text-left" style={{ width: 360 }}>
//                 Indikator & Pembilang/Penyebut
//               </th>
//               <th className="border px-3 py-2 text-center" style={{ width: 90 }}>
//                 Bobot Indikator
//               </th>
//               <th className="border px-3 py-2 text-left" style={{ width: 220 }}>
//                 Sumber Risiko
//               </th>
//               <th className="border px-3 py-2 text-left" style={{ width: 240 }}>
//                 Dampak
//               </th>
//               <th className="px-3 py-2 bg-[#b7d7a8] text-left text-black">Low</th>
//               <th className="px-3 py-2 bg-[#c9daf8] text-left text-black">Low to Moderate</th>
//               <th className="px-3 py-2 bg-[#fff2cc] text-left text-black">Moderate</th>
//               <th className="px-3 py-2 bg-[#f9cb9c] text-left text-black">Moderate to High</th>
//               <th className="px-3 py-2 bg-[#e06666] text-left text-white">High</th>
//               <th className="px-3 py-2 bg-[#2e75b6] text-left text-white" style={{ width: 100 }}>
//                 Hasil
//               </th>
//               <th className="px-3 py-2 bg-[#385723] text-left text-white" style={{ width: 70 }}>
//                 Peringkat
//               </th>
//               <th className="px-3 py-2 bg-[#d9d9d9] text-left text-black" style={{ width: 90 }}>
//                 Weighted
//               </th>
//               <th className="px-3 py-2 bg-[#1f4e79] text-left text-white" style={{ width: 220 }}>
//                 Keterangan
//               </th>
//               <th className="border px-3 py-2 text-center" style={{ width: 80 }}>
//                 Aksi
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {isLoading ? (
//               <tr>
//                 <td className="border px-3 py-8 text-center text-gray-500" colSpan={17}>
//                   <div className="flex items-center justify-center gap-2">
//                     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//                     Memuat data...
//                   </div>
//                 </td>
//               </tr>
//             ) : filteredSections.length === 0 ? (
//               <tr>
//                 <td className="border px-3 py-6 text-center text-gray-500" colSpan={17}>
//                   {sections.length === 0 ? 'Belum ada data section' : 'Tidak ada data yang sesuai dengan pencarian'}
//                 </td>
//               </tr>
//             ) : (
//               filteredSections.map((s) => {
//                 const inds = s.indikators || [];
//                 if (!inds.length) {
//                   return (
//                     <tr key={s.id} className="bg-[#e9f5e1]">
//                       <td className="border px-3 py-3 text-center">{s.no_sec}</td>
//                       <td className="border px-3 py-3 text-center">{s.bobot_par}%</td>
//                       <td className="border px-3 py-3">{s.nama_section}</td>
//                       <td className="border px-3 py-3 text-center" colSpan={14}>
//                         Belum ada indikator
//                       </td>
//                     </tr>
//                   );
//                 }

//                 return (
//                   <React.Fragment key={s.id}>
//                     {inds.map((it, idx) => {
//                       const firstOfSection = idx === 0;
//                       const hasilDisplay = it.hasil != null ? Number(it.hasil).toFixed(4) : '';
//                       const weightedDisplay = it.weighted != null ? Number(it.weighted).toFixed(2) : '';

//                       return (
//                         <React.Fragment key={it.id}>
//                           <tr>
//                             {firstOfSection && (
//                               <>
//                                 <td rowSpan={inds.length * rowsPerIndicator} className="border px-3 py-3 align-top bg-[#e9f5e1] text-center font-semibold">
//                                   {s.no_sec}
//                                 </td>
//                                 <td rowSpan={inds.length * rowsPerIndicator} className="border px-3 py-3 align-top bg-[#e9f5e1] text-center">
//                                   {s.bobot_par}%
//                                 </td>
//                                 <td rowSpan={inds.length * rowsPerIndicator} className="border px-3 py-3 align-top bg-[#e9f5e1]">
//                                   {s.nama_section}
//                                 </td>
//                               </>
//                             )}

//                             <td className="border px-3 py-3 align-top">
//                               <div className="font-medium">
//                                 {it.sub_no} - {it.nama_indikator}
//                               </div>
//                             </td>
//                             <td className="border px-3 py-3 text-center align-top">{it.bobot_indikator}%</td>
//                             <td className="border px-3 py-3 align-top">{it.sumber_risiko}</td>
//                             <td className="border px-3 py-3 align-top">{it.dampak}</td>

//                             <td className="border px-3 py-3 text-center">{it.low}</td>
//                             <td className="border px-3 py-3 text-center">{it.low_to_moderate}</td>
//                             <td className="border px-3 py-3 text-center">{it.moderate}</td>
//                             <td className="border px-3 py-3 text-center">{it.moderate_to_high}</td>
//                             <td className="border px-3 py-3 text-center">{it.high}</td>

//                             <td className="border px-3 py-3 text-right font-semibold">{hasilDisplay}</td>

//                             <td className="border px-3 py-3 text-center">
//                               <div className="inline-block rounded bg-yellow-300 px-2 py-1 min-w-[36px] font-semibold">{it.peringkat}</div>
//                             </td>

//                             <td className="border px-3 py-3 text-right font-semibold">{weightedDisplay}</td>
//                             <td className="border px-3 py-3">{it.keterangan}</td>

//                             <td className="border px-3 py-3 text-center">
//                               <div className="flex items-center justify-center gap-2">
//                                 <button onClick={() => handleEditIndicator(it)} className="p-1 rounded border hover:bg-blue-50 transition-colors" title="Edit Indikator">
//                                   <Edit3 size={14} />
//                                 </button>
//                                 <button onClick={() => handleDeleteIndicator(it.id)} className="p-1 rounded border text-red-600 hover:bg-red-50 transition-colors" title="Hapus Indikator">
//                                   <Trash2 size={14} />
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>

//                           {/* Pembilang row */}
//                           <tr className="bg-gray-50">
//                             <td className="border px-3 py-2">
//                               <div className="text-sm text-gray-700">
//                                 <span className="font-medium">Pembilang:</span> {it.pembilang_label || '-'}
//                               </div>
//                             </td>
//                             <td className="border px-3 py-2" colSpan={8}></td>
//                             <td className="border px-3 py-2 bg-[#c6d9a7] text-right font-medium">{it.pembilang_value ? fmtNumber(it.pembilang_value) : '-'}</td>
//                             <td className="border px-3 py-2" colSpan={4}></td>
//                           </tr>

//                           {/* Penyebut row */}
//                           <tr className="bg-gray-50">
//                             <td className="border px-3 py-2">
//                               <div className="text-sm text-gray-700">
//                                 <span className="font-medium">Penyebut:</span> {it.penyebut_label || '-'}
//                               </div>
//                             </td>
//                             <td className="border px-3 py-2" colSpan={8}></td>
//                             <td className="border px-3 py-2 bg-[#c6d9a7] text-right font-medium">{it.penyebut_value ? fmtNumber(it.penyebut_value) : '-'}</td>
//                             <td className="border px-3 py-2" colSpan={4}></td>
//                           </tr>
//                         </React.Fragment>
//                       );
//                     })}
//                   </React.Fragment>
//                 );
//               })
//             )}
//           </tbody>

//           <tfoot>
//             <tr>
//               <td className="border border-gray-400" colSpan={12}></td>
//               <td className="border border-gray-400 text-white font-semibold text-center bg-[#0b3861]" colSpan={2}>
//                 Total Weighted
//               </td>
//               <td className="border border-gray-400 text-white font-semibold text-center bg-[#8fce00]">
//                 {/* PERBAIKAN: Gunakan Number() dan fallback ke 0 */}
//                 {Number(totalWeighted || 0).toFixed(2)}
//               </td>
//               <td className="border border-gray-400" colSpan={2}></td>
//             </tr>
//           </tfoot>
//         </table>
//       </div>
//     </>
//   );
// }

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Download, Trash2, Edit3, Search, Plus, ChevronDown } from 'lucide-react';
import { YearInput, QuarterSelect } from '../../pasar/components/Inputs.jsx';
import { exportKPMRPasarToExcel } from '../../pasar/utils/excelexportpasar.jsx';
import { useLikuiditas } from '../hooks/likuiditas/likuiditas.hook.js';
import { useAuditLog } from '../../../../audit-log/hooks/audit-log.hooks';
import { useAuth } from '../../../../../../auth/hooks/useAuth.hook.js';

// ===================== Brand =====================
const PNM_BRAND = {
  primary: '#0068B3',
  primarySoft: '#E6F1FA',
  gradient: 'bg-gradient-to-r from-[#0076C6]/90 via-[#00A3DA]/90 to-[#33C2B5]/90',
};

// Formatters
const fmtNumber = (v) => {
  if (v === '' || v == null) return '';
  const n = Number(v);
  if (isNaN(n)) return String(v);
  return new Intl.NumberFormat('en-US').format(n);
};

const parseNum = (v) => {
  if (v == null || v === '') return 0;
  if (typeof v === 'number') return v;

  const cleaned = String(v).replace(/,/g, '').replace(/\s/g, '');

  if (cleaned.includes('%')) {
    const numValue = Number(cleaned.replace('%', ''));
    if (isNaN(numValue)) return 0;
    return numValue / 100;
  }

  const n = Number(cleaned);
  return isNaN(n) ? 0 : n;
};

// Empty indicator template
const emptyIndicator = {
  id: null,
  subNo: '',
  indikator: '',
  mode: 'RASIO',
  formula: '',
  isPercent: false,
  bobotIndikator: 0,
  sumberRisiko: '',
  dampak: '',
  pembilangLabel: '',
  pembilangValue: '',
  penyebutLabel: '',
  penyebutValue: '',
  low: '',
  lowToModerate: '',
  moderate: '',
  moderateToHigh: '',
  high: '',
  peringkat: 1,
  weighted: '',
  hasil: '',
  keterangan: '',
};

// Transform functions untuk likuiditas
const transformIndicatorToBackend = (indicatorData, year, quarter, sectionId) => {
  const prepareValue = (value) => {
    if (value === undefined || value === null || value === '') {
      return null;
    }
    return value;
  };

  const prepareNumber = (value) => {
    if (value === undefined || value === null || value === '') {
      return null;
    }
    const num = Number(value);
    return isNaN(num) ? null : num;
  };

  return {
    sectionId: Number(sectionId),
    year: Number(year),
    quarter: quarter,
    subNo: prepareValue(indicatorData.subNo) || '',
    namaIndikator: prepareValue(indicatorData.indikator) || '',
    bobotIndikator: Number(indicatorData.bobotIndikator || 0),

    // Data perhitungan
    mode: indicatorData.mode || 'RASIO',
    pembilangLabel: prepareValue(indicatorData.pembilangLabel),
    pembilangValue: prepareNumber(indicatorData.pembilangValue),
    penyebutLabel: prepareValue(indicatorData.penyebutLabel),
    penyebutValue: prepareNumber(indicatorData.penyebutValue),
    formula: prepareValue(indicatorData.formula),
    isPercent: Boolean(indicatorData.isPercent || false),

    // Data risiko
    sumberRisiko: prepareValue(indicatorData.sumberRisiko),
    dampak: prepareValue(indicatorData.dampak),

    // Thresholds Likuiditas
    low: prepareValue(indicatorData.low),
    lowToModerate: prepareValue(indicatorData.lowToModerate),
    moderate: prepareValue(indicatorData.moderate),
    moderateToHigh: prepareValue(indicatorData.moderateToHigh),
    high: prepareValue(indicatorData.high),

    // Peringkat
    peringkat: Number(indicatorData.peringkat || 1),

    keterangan: prepareValue(indicatorData.keterangan),
  };
};

const transformIndicatorToFrontend = (indikator) => {
  return {
    id: indikator.id,
    subNo: indikator.subNo || indikator.sub_no || '',
    indikator: indikator.namaIndikator || indikator.nama_indikator || '',
    bobotIndikator: indikator.bobotIndikator || indikator.bobot_indikator || 0,
    sumberRisiko: indikator.sumberRisiko || indikator.sumber_risiko || '',
    dampak: indikator.dampak || '',
    pembilangLabel: indikator.pembilangLabel || indikator.pembilang_label || '',
    pembilangValue: indikator.pembilangValue || indikator.pembilang_value || '',
    penyebutLabel: indikator.penyebutLabel || indikator.penyebut_label || '',
    penyebutValue: indikator.penyebutValue || indikator.penyebut_value || '',
    low: indikator.low || '',
    lowToModerate: indikator.lowToModerate || indikator.low_to_moderate || '',
    moderate: indikator.moderate || '',
    moderateToHigh: indikator.moderateToHigh || indikator.moderate_to_high || '',
    high: indikator.high || '',
    peringkat: indikator.peringkat || 1,
    weighted: indikator.weighted || '',
    hasil: indikator.hasil || '',
    keterangan: indikator.keterangan || '',
    isPercent: indikator.isPercent || false,
    mode: indikator.mode || 'RASIO',
    formula: indikator.formula || '',
  };
};

// Transform functions untuk section
const transformSectionToBackend = (sectionData, year, quarter) => {
  return {
    no: sectionData.no,
    bobotSection: Number(sectionData.bobotSection || 0),
    parameter: sectionData.parameter,
    year,
    quarter,
  };
};

const renderIndicatorForTable = (indikator) => {
  return {
    id: indikator.id,
    subNo: indikator.subNo || indikator.sub_no || '',
    indikator: indikator.namaIndikator || indikator.nama_indikator || '',
    bobotIndikator: indikator.bobotIndikator || indikator.bobot_indikator || 0,
    sumberRisiko: indikator.sumberRisiko || indikator.sumber_risiko || '',
    dampak: indikator.dampak || '',
    pembilangLabel: indikator.pembilangLabel || indikator.pembilang_label || '',
    pembilangValue: indikator.pembilangValue || indikator.pembilang_value || '',
    penyebutLabel: indikator.penyebutLabel || indikator.penyebut_label || '',
    penyebutValue: indikator.penyebutValue || indikator.penyebut_value || '',
    low: indikator.low || '',
    lowToModerate: indikator.lowToModerate || indikator.low_to_moderate || '',
    moderate: indikator.moderate || '',
    moderateToHigh: indikator.moderateToHigh || indikator.moderate_to_high || '',
    high: indikator.high || '',
    peringkat: indikator.peringkat || 1,
    weighted: indikator.weighted || 0,
    hasil: indikator.hasil || '',
    keterangan: indikator.keterangan || '',
    isPercent: indikator.isPercent || false,
    mode: indikator.mode || 'RASIO',
    formula: indikator.formula || '',
  };
};

// ===================== FUNGSI KALKULASI =====================
const computeHasil = (ind) => {
  const mode = ind.mode || 'RASIO';
  const pemb = parseNum(ind.pembilangValue);
  const peny = parseNum(ind.penyebutValue);

  // custom formula
  if (ind.formula && typeof ind.formula === 'string' && ind.formula.trim() !== '') {
    try {
      const expr = ind.formula.replace(/\bpemb\b/g, 'pemb').replace(/\bpeny\b/g, 'peny');
      if (!/^[\d\.\+\-\*\/\(\)\spenbmycubrEPBSajklnt,_%]+$/.test(expr) && !/pemb|peny/.test(expr)) {
        // but we won't block if it contains pemb/peny - keep minimal
      }
      const fn = new Function('pemb', 'peny', `return (${expr});`);
      const res = fn(pemb, peny);
      if (!isFinite(res) || isNaN(res)) return '';
      return Number(res);
    } catch (err) {
      console.warn('Invalid formula:', ind.formula, err);
      return '';
    }
  }

  if (mode === 'NILAI_TUNGGAL') {
    if (peny === 0) return '';
    return Number(peny);
  }

  if (peny === 0) return '';
  const result = pemb / peny;
  if (!isFinite(result) || isNaN(result)) return '';
  return Number(result);
};

const computeWeightedAuto = (ind, sectionBobot) => {
  const sectionB = Number(sectionBobot || 0);
  const bobotInd = Number(ind.bobotIndikator || 0);
  const peringkat = Number(ind.peringkat || 0);
  const res = (sectionB * bobotInd * peringkat) / 10000;
  if (!isFinite(res) || isNaN(res)) return 0;
  return res;
};

// total baris per indikator
const rowsPerIndicator = (ind) => {
  return 1 + (ind.mode === 'RASIO' ? 2 : 1);
};

export default function LikuiditasTab({ viewYear, setViewYear, viewQuarter, setViewQuarter, query, setQuery }) {
  // ====== Hooks ======
  const { user: authUser } = useAuth();
  const { logUpdate, logDelete, logExport, logCreate } = useAuditLog();
  const { loading, error, getSectionsByPeriod, getAllSections, createSection, updateSection, deleteSection, createIndikator, updateIndikator, deleteIndikator, getSummaryByPeriod, clearError } =
    useLikuiditas();

  // ====== States ======
  const [sections, setSections] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [allSections, setAllSections] = useState([]);
  const [loadingAllSections, setLoadingAllSections] = useState(false);

  // State section form
  const [sectionForm, setSectionForm] = useState({
    id: null,
    no: '',
    bobotSection: 100,
    parameter: '',
    year: viewYear,
    quarter: viewQuarter,
  });

  const [indicatorForm, setIndicatorForm] = useState({
    ...emptyIndicator,
    sectionId: null,
  });

  const [isEditingSection, setIsEditingSection] = useState(false);
  const [isEditingIndicator, setIsEditingIndicator] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ====== Fungsi untuk load data ======
  const loadData = useCallback(async () => {
    console.log('🔄 [LIKUIDITAS LOAD] Starting to load data...', viewYear, viewQuarter);

    setLoadingData(true);
    setLocalError(null);

    try {
      setSections([]);
      const sectionsData = await getSectionsByPeriod(viewYear, viewQuarter);
      console.log('📥 [LIKUIDITAS LOAD] Raw data length:', sectionsData.length);

      sectionsData.forEach((section, idx) => {
        console.log(`   📋 Section ${idx + 1}:`, {
          id: section.id,
          no: section.no,
          indikators: section.indikators?.length || 0,
          indikatorsList: section.indikators?.map((i) => ({
            id: i.id,
            nama: i.namaIndikator,
            updatedAt: i.updatedAt,
          })),
        });
      });

      const transformedSections = sectionsData.map((section) => {
        const inds = section.indikators || [];
        return {
          id: section.id,
          no: section.no || section.no_sec,
          parameter: section.parameter || section.nama_section,
          bobotSection: Number(section.bobotSection || section.bobot_par || 0),
          indikators: inds,
        };
      });

      console.log('✅ [LIKUIDITAS LOAD] Setting new sections:', transformedSections.length);
      setSections([...transformedSections]);
    } catch (err) {
      console.error('❌ [LIKUIDITAS LOAD] Error:', err);
      setLocalError(err.message || 'Gagal memuat data likuiditas');
    } finally {
      setLoadingData(false);
      console.log('🏁 [LIKUIDITAS LOAD] Finished');
    }
  }, [viewYear, viewQuarter, getSectionsByPeriod]);

  // load semua data dari database
  const loadAllSections = useCallback(async () => {
    setLoadingAllSections(true);
    try {
      console.log('🔄 [LIKUIDITAS] Loading all sections from database...');
      const allSectionsData = await getAllSections();

      const transformedAllSections = allSectionsData.map((section) => ({
        id: section.id,
        no: section.no || section.no_sec,
        parameter: section.parameter || section.nama_section,
        bobotSection: Number(section.bobotSection || section.bobot_par || 0),
        year: section.year,
        quarter: section.quarter,
      }));

      console.log('✅ [LIKUIDITAS] Total sections in database:', transformedAllSections.length);
      setAllSections(transformedAllSections);
    } catch (err) {
      console.error('❌ [LIKUIDITAS] Error loading all sections:', err);
    } finally {
      setLoadingAllSections(false);
    }
  }, [getAllSections]);

  // ====== Effects ======
  useEffect(() => {
    loadData();
    loadAllSections();
  }, [loadData, loadAllSections]);

  useEffect(() => {
    setSectionForm((prev) => ({
      ...prev,
      year: viewYear,
      quarter: viewQuarter,
    }));
  }, [viewYear, viewQuarter]);

  // Effect untuk auto-calculate
  useEffect(() => {
    if (sectionForm.id) {
      const hasil = computeHasil(indicatorForm);
      const weighted = computeWeightedAuto(indicatorForm, sectionForm.bobotSection);

      setIndicatorForm((prev) => ({
        ...prev,
        hasil: hasil,
        weighted: weighted,
      }));
    }
  }, [indicatorForm.pembilangValue, indicatorForm.penyebutValue, indicatorForm.mode, indicatorForm.formula, indicatorForm.peringkat, indicatorForm.bobotIndikator, sectionForm.bobotSection]);

  // ====== Helper Functions untuk Sections ======
  const getUniqueSections = useMemo(() => {
    const combinedSections = [...sections];

    allSections.forEach((dbSection) => {
      const exists = combinedSections.some((s) => s.no === dbSection.no && s.parameter === dbSection.parameter);

      if (!exists) {
        combinedSections.push(dbSection);
      }
    });

    const uniqueMap = new Map();
    combinedSections.forEach((section) => {
      const key = `${section.no}-${section.parameter}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, {
          id: section.id,
          no: section.no,
          name: section.parameter,
          bobotSection: section.bobotSection,
          year: section.year,
          quarter: section.quarter,
        });
      }
    });

    return Array.from(uniqueMap.values()).sort((a, b) => {
      const numA = parseInt(a.no) || 0;
      const numB = parseInt(b.no) || 0;
      return numA - numB;
    });
  }, [sections, allSections]);

  const getUnusedSections = useMemo(() => {
    const usedSectionIds = sections.map((s) => s.id).filter(Boolean);

    return getUniqueSections.filter(
      (section) =>
        !usedSectionIds.includes(section.id) ||
        (!section.id && !sections.some((s) => s.no === section.no && s.parameter === section.name))
    );
  }, [sections, getUniqueSections]);

  // ====== Audit Log Function ======
  const handleAuditLog = async (action, description, isSuccess = true, metadata = {}) => {
    try {
      const userId = authUser?.user_id || authUser?.id;

      switch (action) {
        case 'CREATE':
          await logCreate('LIKUIDITAS', description, {
            isSuccess,
            userId: userId || null,
            metadata: {
              year: viewYear,
              quarter: viewQuarter,
              ...metadata,
            },
          });
          break;
        case 'UPDATE':
          await logUpdate('LIKUIDITAS', description, {
            isSuccess,
            userId: userId || null,
            metadata: {
              year: viewYear,
              quarter: viewQuarter,
              ...metadata,
            },
          });
          break;
        case 'DELETE':
          await logDelete('LIKUIDITAS', description, {
            isSuccess,
            userId: userId || null,
            metadata: {
              year: viewYear,
              quarter: viewQuarter,
              ...metadata,
            },
          });
          break;
        case 'EXPORT':
          await logExport('LIKUIDITAS', description, {
            isSuccess,
            userId: userId || null,
            metadata: {
              year: viewYear,
              quarter: viewQuarter,
              ...metadata,
            },
          });
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('❌ [LIKUIDITAS AUDIT] Audit failed:', error);
    }
  };

  // ====== Helper Functions ======
  const setIndicatorField = (field, value) => {
    setIndicatorForm((prev) => ({
      ...prev,
      [field]: value === null ? '' : value,
    }));
  };

  const selectSection = (id) => {
    const section = sections.find((s) => s.id === id);
    if (section) {
      setSectionForm({
        id: section.id,
        no: section.no || section.no_sec,
        bobotSection: section.bobotSection || section.bobot_par,
        parameter: section.parameter || section.nama_section,
        year: section.year || section.tahun,
        quarter: section.quarter || section.triwulan,
      });
      setIsEditingSection(true);
      setIndicatorForm((prev) => ({
        ...prev,
        sectionId: Number(section.id),
      }));
    }
  };

  const resetSectionForm = () => {
    setSectionForm({
      id: null,
      no: '',
      bobotSection: 100,
      parameter: '',
      year: viewYear,
      quarter: viewQuarter,
    });
    setIsEditingSection(false);
    setIndicatorForm((prev) => ({ ...prev, sectionId: null }));
  };

  const resetIndicatorForm = () => {
    setIndicatorForm({
      ...emptyIndicator,
      sectionId: sectionForm.id,
    });
    setIsEditingIndicator(false);
    setLocalError(null);
  };

  const handleEditIndicator = (indikator) => {
    console.log('📝 [LIKUIDITAS EDIT] HandleEditIndicator:', indikator);

    const formData = {
      id: indikator.id,
      subNo: indikator.subNo || indikator.sub_no || '',
      indikator: indikator.namaIndikator || indikator.nama_indikator || '',
      bobotIndikator: indikator.bobotIndikator || indikator.bobot_indikator || 0,
      sumberRisiko: indikator.sumberRisiko || indikator.sumber_risiko || '',
      dampak: indikator.dampak || '',
      pembilangLabel: indikator.pembilangLabel || indikator.pembilang_label || '',
      pembilangValue: indikator.pembilangValue || indikator.pembilang_value || '',
      penyebutLabel: indikator.penyebutLabel || indikator.penyebut_label || '',
      penyebutValue: indikator.penyebutValue || indikator.penyebut_value || '',
      low: indikator.low || '',
      lowToModerate: indikator.lowToModerate || indikator.low_to_moderate || '',
      moderate: indikator.moderate || '',
      moderateToHigh: indikator.moderateToHigh || indikator.moderate_to_high || '',
      high: indikator.high || '',
      peringkat: indikator.peringkat || 1,
      weighted: indikator.weighted || '',
      hasil: indikator.hasil || '',
      keterangan: indikator.keterangan || '',
      isPercent: Boolean(indikator.isPercent),
      mode: indikator.mode || 'RASIO',
      formula: indikator.formula || '',
      sectionId: sectionForm.id,
    };

    console.log('📝 [LIKUIDITAS EDIT] Setting form data:', formData);
    setIndicatorForm(formData);
    setIsEditingIndicator(true);
  };

  // ====== Validation Functions ======
  const validateSectionForm = () => {
    if (!sectionForm.no || !sectionForm.parameter) {
      setLocalError('No Section dan Nama Section harus diisi');
      return false;
    }

    if (sectionForm.bobotSection <= 0) {
      setLocalError('Bobot Section harus lebih dari 0');
      return false;
    }

    return true;
  };

  const validateIndicatorForm = () => {
    if (!sectionForm.id) {
      setLocalError('Pilih section terlebih dahulu');
      return false;
    }

    if (!indicatorForm.indikator || !indicatorForm.bobotIndikator) {
      setLocalError('Nama Indikator dan Bobot Indikator harus diisi');
      return false;
    }

    if (Number(indicatorForm.bobotIndikator) <= 0) {
      setLocalError('Bobot Indikator harus lebih dari 0');
      return false;
    }

    if (indicatorForm.mode === 'RASIO' && !indicatorForm.penyebutValue) {
      setLocalError('Nilai penyebut harus diisi untuk mode RASIO');
      return false;
    }

    if (indicatorForm.mode === 'NILAI_TUNGGAL' && !indicatorForm.penyebutValue) {
      setLocalError('Nilai penyebut harus diisi untuk mode NILAI_TUNGGAL');
      return false;
    }

    return true;
  };

  // ====== CRUD Operations ======
  const handleCreateSection = async () => {
    setLocalError(null);

    if (!validateSectionForm()) return;

    const isDuplicate = sections.some((s) => s.year === viewYear && s.quarter === viewQuarter && s.no === sectionForm.no);

    if (isDuplicate) {
      setLocalError(`Section dengan nomor ${sectionForm.no} sudah ada untuk periode ${viewYear}-${viewQuarter}`);
      return;
    }

    setIsCreating(true);
    try {
      const sectionData = transformSectionToBackend(sectionForm, viewYear, viewQuarter);
      await createSection(sectionData);

      handleAuditLog('CREATE', `Menambahkan section likuiditas - No: ${sectionForm.no}, Nama: "${sectionForm.parameter}", Bobot: ${sectionForm.bobotSection}%`, true, {
        section_no: sectionForm.no,
        section_name: sectionForm.parameter,
        bobotSection: sectionForm.bobotSection,
      });

      resetSectionForm();
      await loadData();
      await loadAllSections();
    } catch (err) {
      handleAuditLog('CREATE', `Gagal menambah section likuiditas - No: ${sectionForm.no}, Nama: "${sectionForm.parameter}"`, false, {
        section_no: sectionForm.no,
        section_name: sectionForm.parameter,
        error: err.message,
      });
      setLocalError(`Gagal membuat section: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateSection = async () => {
    setLocalError(null);
    if (!sectionForm.id) return;

    if (!validateSectionForm()) return;

    setIsUpdating(true);
    try {
      const updateData = {
        no: sectionForm.no,
        parameter: sectionForm.parameter,
        bobotSection: Number(sectionForm.bobotSection),
      };

      await updateSection(sectionForm.id, updateData);

      handleAuditLog('UPDATE', `Mengupdate section likuiditas - No: ${sectionForm.no}, Nama: "${sectionForm.parameter}", Bobot: ${sectionForm.bobotSection}%`, true, {
        section_id: sectionForm.id,
        section_no: sectionForm.no,
        section_name: sectionForm.parameter,
        bobotSection: sectionForm.bobotSection,
      });

      resetSectionForm();
      await loadData();
      await loadAllSections();
    } catch (err) {
      handleAuditLog('UPDATE', `Gagal update section likuiditas - No: ${sectionForm.no}, Nama: "${sectionForm.parameter}"`, false, {
        section_id: sectionForm.id,
        section_no: sectionForm.no,
        section_name: sectionForm.parameter,
        error: err.message,
      });
      setLocalError(`Gagal update section: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus section ini? Semua indikator dalam section ini juga akan dihapus.')) return;

    const sectionToDelete = sections.find((s) => s.id === sectionId);

    setIsDeleting(true);
    try {
      await deleteSection(sectionId);

      handleAuditLog('DELETE', `Menghapus section likuiditas - No: ${sectionToDelete?.no}, Nama: "${sectionToDelete?.parameter}"`, true, {
        section_id: sectionId,
        section_no: sectionToDelete?.no,
        section_name: sectionToDelete?.parameter,
      });

      resetSectionForm();
      await loadData();
      await loadAllSections();
    } catch (err) {
      handleAuditLog('DELETE', `Gagal menghapus section likuiditas - No: ${sectionToDelete?.no}, Nama: "${sectionToDelete?.parameter}"`, false, {
        section_id: sectionId,
        section_no: sectionToDelete?.no,
        section_name: sectionToDelete?.parameter,
        error: err.message,
      });
      setLocalError(`Gagal menghapus section: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateIndicator = async () => {
    setLocalError(null);

    if (!validateIndicatorForm()) return;

    setIsCreating(true);
    try {
      const indicatorData = transformIndicatorToBackend(indicatorForm, viewYear, viewQuarter, sectionForm.id);

      await createIndikator(indicatorData);

      handleAuditLog('CREATE', `Menambahkan indikator likuiditas - "${indicatorForm.indikator}", Bobot: ${indicatorForm.bobotIndikator}%`, true, {
        section_id: sectionForm.id,
        section_no: sectionForm.no,
        indicator_name: indicatorForm.indikator,
        bobotIndikator: indicatorForm.bobotIndikator,
        peringkat: indicatorForm.peringkat,
      });

      resetIndicatorForm();
      await loadData();
    } catch (err) {
      handleAuditLog('CREATE', `Gagal menambah indikator likuiditas - "${indicatorForm.indikator}"`, false, {
        section_id: sectionForm.id,
        section_no: sectionForm.no,
        indicator_name: indicatorForm.indikator,
        error: err.message,
      });
      setLocalError(`Gagal membuat indikator: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateIndicator = async () => {
    console.log('🔄 [LIKUIDITAS UPDATE] Starting update for indicator ID:', indicatorForm.id);

    if (!indicatorForm.id) {
      setLocalError('ID indikator tidak ditemukan');
      return;
    }

    if (!indicatorForm.indikator?.trim()) {
      setLocalError('Nama indikator tidak boleh kosong');
      return;
    }

    setIsUpdating(true);
    setLocalError(null);

    try {
      const updateData = {
        namaIndikator: indicatorForm.indikator.trim(),
        bobotIndikator: parseFloat(indicatorForm.bobotIndikator) || 0,
        peringkat: parseInt(indicatorForm.peringkat) || 1,

        subNo: indicatorForm.subNo?.trim() || null,
        sumberRisiko: indicatorForm.sumberRisiko?.trim() || null,
        dampak: indicatorForm.dampak?.trim() || null,
        keterangan: indicatorForm.keterangan?.trim() || null,

        pembilangLabel: indicatorForm.pembilangLabel?.trim() || null,
        pembilangValue: indicatorForm.pembilangValue !== '' ? parseFloat(indicatorForm.pembilangValue) : null,
        penyebutLabel: indicatorForm.penyebutLabel?.trim() || null,
        penyebutValue: indicatorForm.penyebutValue !== '' ? parseFloat(indicatorForm.penyebutValue) : null,

        // Field khusus likuiditas
        low: indicatorForm.low?.trim() || null,
        lowToModerate: indicatorForm.lowToModerate?.trim() || null,
        moderate: indicatorForm.moderate?.trim() || null,
        moderateToHigh: indicatorForm.moderateToHigh?.trim() || null,
        high: indicatorForm.high?.trim() || null,

        // Field tambahan
        isPercent: Boolean(indicatorForm.isPercent),
        mode: indicatorForm.mode || 'RASIO',
        formula: indicatorForm.formula?.trim() || null,
      };

      console.log('📤 [LIKUIDITAS UPDATE] Data untuk update:', updateData);

      await updateIndikator(indicatorForm.id, updateData);

      console.log('✅ [LIKUIDITAS UPDATE] API call successful');

      resetIndicatorForm();

      setTimeout(async () => {
        console.log('🔄 [LIKUIDITAS UPDATE] Reloading data...');
        await loadData();
        console.log('✅ [LIKUIDITAS UPDATE] Data reloaded');

        alert('✅ Data berhasil diupdate!');
      }, 300);
    } catch (err) {
      console.error('❌ [LIKUIDITAS UPDATE] Error updating:', err);

      let errorMessage = 'Gagal update data';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setLocalError(`Update gagal: ${errorMessage}`);
      alert(`❌ ${errorMessage}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteIndicator = async (indikatorId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus indikator ini?')) return;

    const indicatorToDelete = sections.flatMap((s) => s.indikators || []).find((it) => it.id === indikatorId);

    if (!indicatorToDelete) {
      setLocalError('Indikator tidak ditemukan');
      return;
    }

    setIsDeleting(true);
    try {
      await deleteIndikator(indikatorId);

      handleAuditLog('DELETE', `Menghapus indikator likuiditas - "${indicatorToDelete.namaIndikator || indicatorToDelete.nama_indikator}"`, true, {
        indicator_id: indikatorId,
        section_id: sectionForm.id,
        section_no: sectionForm.no,
        indicator_name: indicatorToDelete.namaIndikator || indicatorToDelete.nama_indikator,
      });

      await loadData();
    } catch (err) {
      console.error('❌ Error deleting indicator:', err);

      let errorMessage = 'Terjadi kesalahan';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      handleAuditLog('DELETE', `Gagal menghapus indikator likuiditas - "${indicatorToDelete.namaIndikator || indicatorToDelete.nama_indikator}"`, false, {
        indicator_id: indikatorId,
        section_id: sectionForm.id,
        section_no: sectionForm.no,
        indicator_name: indicatorToDelete.namaIndikator || indicatorToDelete.nama_indikator,
        error: errorMessage,
      });

      setLocalError(`Gagal menghapus indikator: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // ====== Export Function ======
  const handleExportLikuiditas = () => {
    const selectedSection = sections.find((s) => s.id === sectionForm.id) || sections[0];

    if (!selectedSection) {
      alert('Belum ada section untuk diexport.');
      return;
    }

    const rows = selectedSection.indikators || [];
    if (!rows.length) {
      alert('Section ini belum punya indikator untuk diexport.');
      return;
    }

    try {
      const exportData = rows.map((indikator) => {
        const transformed = transformIndicatorToFrontend(indikator);
        return {
          subNo: transformed.subNo,
          indikator: transformed.indikator,
          bobotIndikator: transformed.bobotIndikator,
          sumberRisiko: transformed.sumberRisiko,
          dampak: transformed.dampak,
          pembilangLabel: transformed.pembilangLabel,
          pembilangValue: transformed.pembilangValue,
          penyebutLabel: transformed.penyebutLabel,
          penyebutValue: transformed.penyebutValue,
          low: transformed.low,
          lowToModerate: transformed.lowToModerate,
          moderate: transformed.moderate,
          moderateToHigh: transformed.moderateToHigh,
          high: transformed.high,
          peringkat: transformed.peringkat,
          weighted: transformed.weighted,
          hasil: transformed.hasil,
          keterangan: transformed.keterangan,
        };
      });

      handleAuditLog('EXPORT', `Export data Excel likuiditas - Periode: ${viewYear}-${viewQuarter}, Section: ${selectedSection.no}, Jumlah Data: ${rows.length}`, true, {
        year: viewYear,
        quarter: viewQuarter,
        section_id: selectedSection.id,
        section_no: selectedSection.no,
        section_name: selectedSection.parameter,
        total_records: rows.length,
        file_type: 'excel',
      });

      exportKPMRPasarToExcel({
        year: viewYear,
        quarter: viewQuarter,
        sectionNo: selectedSection.no || selectedSection.no_sec,
        sectionLabel: selectedSection.parameter || selectedSection.nama_section,
        bobotSection: selectedSection.bobotSection || selectedSection.bobot_par,
        rows: exportData,
      });
    } catch (err) {
      handleAuditLog('EXPORT', `Gagal export data Excel likuiditas - Periode: ${viewYear}-${viewQuarter}`, false, {
        year: viewYear,
        quarter: viewQuarter,
        section_id: selectedSection?.id,
        section_no: selectedSection?.no,
        error: err.message,
      });
      console.error('Gagal export Excel:', err);
      alert('Gagal melakukan export. Silakan coba lagi.');
    }
  };

  // ====== Memoized Values ======
  const filteredSections = useMemo(() => {
    if (!query.trim()) return sections;
    const q = query.toLowerCase();

    return sections
      .map((s) => {
        const inds = s.indikators || [];
        const matchedIndicators = inds.filter((it) => {
          const indikatorText = it.namaIndikator || it.nama_indikator || '';
          const subNo = it.subNo || it.sub_no || '';
          const pembilangLabel = it.pembilangLabel || it.pembilang_label || '';
          const penyebutLabel = it.penyebutLabel || it.penyebut_label || '';
          const sumberRisiko = it.sumberRisiko || it.sumber_risiko || '';
          const dampak = it.dampak || '';
          const keterangan = it.keterangan || '';

          return `${subNo} ${indikatorText} ${pembilangLabel} ${penyebutLabel} ${sumberRisiko} ${dampak} ${keterangan}`.toLowerCase().includes(q);
        });

        const sectionName = s.parameter || s.nama_section || '';
        if (sectionName.toLowerCase().includes(q) || matchedIndicators.length > 0) {
          return { ...s, indikators: matchedIndicators.length ? matchedIndicators : inds };
        }
        return null;
      })
      .filter(Boolean);
  }, [sections, query]);

  const totalWeighted = useMemo(() => {
    return sections.reduce((sum, section) => {
      const inds = section.indikators || [];
      const sectionTotal = inds.reduce((sectionSum, indikator) => {
        const transformed = transformIndicatorToFrontend(indikator);
        const weighted = Number(transformed.weighted);
        return sectionSum + (isNaN(weighted) ? 0 : weighted);
      }, 0);
      return sum + sectionTotal;
    }, 0);
  }, [sections]);

  const hasilPreview = useMemo(() => {
    const raw = computeHasil(indicatorForm);
    if (raw === '' || raw == null) return '';
    // jika checkbox persen aktif: tampilkan percent (raw * 100)
    if (indicatorForm.isPercent) {
      const pct = Number(raw) * 100;
      if (!isFinite(pct) || isNaN(pct)) return '';
      return `${pct.toFixed(2)}%`;
    }
    // formatting default:
    if (indicatorForm.mode === 'NILAI_TUNGGAL') {
      return fmtNumber(raw);
    }
    return Number(raw).toFixed(4);
  }, [indicatorForm]);

  const weightedPreview = useMemo(() => {
    if (!sectionForm.id) return 0;
    const weighted = computeWeightedAuto(indicatorForm, sectionForm.bobotSection);
    return weighted;
  }, [sectionForm.id, indicatorForm, sectionForm.bobotSection]);

  // ====== Render ======
  return (
    <>
      <header className="px-4 py-4 flex items-center justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-semibold">Form – Risiko Likuiditas</h2>
        <div className="flex items-center gap-3">
          {/* tahun + triwulan */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="sr-only">Tahun</label>
              <YearInput value={viewYear} onChange={(v) => setViewYear(v)} />
            </div>

            <div className="flex items-center gap-2">
              <label className="sr-only">Triwulan</label>
              <QuarterSelect value={viewQuarter} onChange={(v) => setViewQuarter(v)} />
            </div>
          </div>

          {/* group search + export */}
          <div className="flex items-center gap-2 transform -translate-y-1">
            <div className="relative">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari no/sub/indikator…" className="pl-9 pr-3 py-2 rounded-xl border w-64" />
              <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <button
              onClick={handleExportLikuiditas}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-gray-900 text-white hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={sections.length === 0}
            >
              <Download size={18} /> Export {viewYear}-{viewQuarter}
            </button>
          </div>
        </div>
      </header>

      {/* Error Display */}
      {(localError || error) && (
        <div className="mx-4 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {localError || error}
          <button
            onClick={() => {
              setLocalError(null);
              clearError();
            }}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {(loadingData || loading || isCreating || isUpdating || isDeleting || loadingAllSections) && (
        <div className="mx-4 mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          {loadingAllSections ? 'Memuat semua section...' : 'Memuat data...'}
        </div>
      )}

      {/* top toolbar with section */}
      <div className="relative rounded-2xl overflow-hidden mb-6 shadow-sm bg-gradient-to-r from-[#0076C6]/90 via-[#00A3DA]/90 to-[#33C2B5]/90">
        <div className="rounded-2xl border-2 border-gray-300 p-4 shadow-sm mb-6">
          <h2 className="text-white font-semibold text-lg sm:text-xl mb-6">Form Section – Likuiditas</h2>

          {/* Row untuk memilih section yang sudah ada */}
          <div className="mb-4">
            <label className="text-xs text-white font-medium mb-1 block">Pilih Section yang Sudah Ada</label>
            <div className="relative">
              <select
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 font-medium appearance-none bg-white cursor-pointer pr-10"
                value={sectionForm.id || ''}
                onChange={(e) => {
                  const selectedId = e.target.value ? Number(e.target.value) : null;
                  if (selectedId) {
                    // Cari section di semua data
                    const selectedSection = [...sections, ...allSections].find((s) => s.id === selectedId);
                    if (selectedSection) {
                      setSectionForm({
                        id: selectedSection.id,
                        no: selectedSection.no,
                        bobotSection: selectedSection.bobotSection,
                        parameter: selectedSection.parameter || selectedSection.name,
                        year: viewYear,
                        quarter: viewQuarter,
                      });
                      setIsEditingSection(true);
                      setIndicatorForm((prev) => ({
                        ...prev,
                        sectionId: Number(selectedSection.id),
                      }));
                    }
                  } else {
                    resetSectionForm();
                  }
                }}
                disabled={loadingAllSections}
              >
                <option value="">-- Pilih Section yang sudah ada --</option>

                {/* Section yang sudah ada di periode ini */}
                {sections.length > 0 && (
                  <optgroup label={`Section di periode ${viewYear}-${viewQuarter}`}>
                    {sections.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.no} - {s.parameter} ({s.bobotSection}%)
                      </option>
                    ))}
                  </optgroup>
                )}

                {/* Section dari database yang belum digunakan */}
                {getUnusedSections.length > 0 && (
                  <optgroup label="Section dari database">
                    {getUnusedSections.map((section) => (
                      <option key={`db-${section.no}-${section.name}`} value={section.id || `new-${section.no}`}>
                        {section.no} - {section.name} ({section.bobotSection}%)
                        {!section.id && ' [Baru]'}
                      </option>
                    ))}
                  </optgroup>
                )}

                {/* Pilihan untuk membuat section baru */}
                <option value="new">+ Buat Section Baru</option>
              </select>
              <ChevronDown className="absolute right-4 top-9 pointer-events-none text-gray-400" size={20} />

              {loadingAllSections && (
                <div className="absolute right-12 top-9">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>

            <div className="text-xs text-white/80 mt-1">
              Total tersedia: {getUniqueSections.length} section ({sections.length} di periode ini)
            </div>
          </div>

          {/* Form input untuk edit section */}
          <div className="flex items-end gap-4 mb-4">
            {/* No Sec */}
            <div className="flex flex-col">
              <label className="text-xs text-white font-medium mb-1">No Sec</label>
              <input
                className="w-20 h-10 px-3 rounded-lg border-2 border-gray-300 text-center font-medium bg-white"
                value={sectionForm.no}
                onChange={(e) => setSectionForm((f) => ({ ...f, no: e.target.value }))}
                placeholder="3.1"
                list="section-no-suggestions"
              />
              <datalist id="section-no-suggestions">
                {getUniqueSections.map((section) => (
                  <option key={`no-${section.no}`} value={section.no} />
                ))}
              </datalist>
            </div>

            {/* Bobot Sec */}
            <div className="flex flex-col">
              <label className="text-xs text-white font-medium mb-1">Bobot Sec (%)</label>
              <input
                type="number"
                className="w-28 h-10 px-3 rounded-lg border-2 border-gray-300 text-center font-medium bg-white"
                value={sectionForm.bobotSection}
                onChange={(e) => setSectionForm((f) => ({ ...f, bobotSection: e.target.value }))}
                min="0"
                max="100"
                step="0.01"
              />
            </div>

            {/* Section */}
            <div className="flex-1 flex flex-col">
              <label className="text-xs text-white font-medium mb-1">Nama Section</label>
              <input
                className="w-full h-10 px-4 rounded-lg border-2 border-gray-300 font-medium bg-white"
                value={sectionForm.parameter}
                onChange={(e) => setSectionForm((f) => ({ ...f, parameter: e.target.value }))}
                placeholder="Uraian section risiko likuiditas"
                list="section-name-suggestions"
              />
              <datalist id="section-name-suggestions">
                {getUniqueSections.map((section) => (
                  <option key={`name-${section.no}`} value={section.name} />
                ))}
              </datalist>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 self-end">
              {!isEditingSection ? (
                <button
                  className="w-10 h-10 rounded-lg bg-green-500 hover:bg-green-600 text-white flex items-center justify-center disabled:bg-gray-400"
                  onClick={handleCreateSection}
                  disabled={isCreating || !sectionForm.no || !sectionForm.parameter}
                  title="Tambah Section"
                >
                  {isCreating ? '...' : <Plus size={20} />}
                </button>
              ) : (
                <>
                  <button className="w-10 h-10 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white flex items-center justify-center disabled:bg-gray-400" onClick={handleUpdateSection} disabled={isUpdating} title="Update Section">
                    {isUpdating ? '...' : <Edit3 size={20} />}
                  </button>
                  <button className="w-10 h-10 rounded-lg bg-gray-500 hover:bg-gray-600 text-white flex items-center justify-center" onClick={resetSectionForm} title="Batal">
                    ✕
                  </button>
                </>
              )}
              {isEditingSection && (
                <button
                  className="w-10 h-10 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center disabled:bg-gray-400"
                  onClick={() => handleDeleteSection(sectionForm.id)}
                  disabled={isDeleting}
                  title="Hapus Section"
                >
                  {isDeleting ? '...' : <Trash2 size={20} />}
                </button>
              )}
            </div>
          </div>

          {/* Info Section yang dipilih */}
          {sectionForm.id && (
            <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
              <div className="text-sm text-blue-800">
                <span className="font-medium">Section dipilih:</span> {sectionForm.no} - {sectionForm.parameter}
              </div>
              <div className="text-xs text-blue-600">
                Bobot: {sectionForm.bobotSection}% | Periode: {viewYear}-{viewQuarter}
              </div>
            </div>
          )}

          {/* Warning jika section sudah ada */}
          {sections.some((s) => s.no === sectionForm.no && s.year === viewYear && s.quarter === viewQuarter) && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
              <div className="flex items-center gap-2 text-yellow-700">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">
                  Section ini sudah ada di periode {viewYear}-{viewQuarter}. Anda bisa memilihnya dari dropdown di atas.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* main body: indicator form */}
        {sectionForm.id && (
          <div className="rounded-xl border-2 border-gray-300 shadow-sm p-6 mb-6">
            <h3 className="text-white font-semibold text-lg mb-4">{isEditingIndicator ? 'Edit Indikator' : 'Tambah Indikator'}</h3>

            {/* Sub No & Indikator & Bobot Par Row */}
            <div className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-3">
                <label className="text-sm font-medium mb-2 block text-white">Sub No</label>
                <input className="w-full rounded-lg border-2 border-gray-300 px-3 py-3 text-sm bg-white" value={indicatorForm.subNo} onChange={(e) => setIndicatorField('subNo', e.target.value)} placeholder="3.1.1" />
              </div>
              <div className="col-span-6">
                <label className="text-sm font-medium mb-2 block text-white">Indikator</label>
                <input
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                  value={indicatorForm.indikator}
                  onChange={(e) => setIndicatorField('indikator', e.target.value)}
                  placeholder="Nama indikator likuiditas…"
                />
              </div>
              <div className="col-span-3">
                <label className="text-sm font-medium mb-2 block text-right text-white">Bobot Indikator (%)</label>
                <input
                  type="number"
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm text-right bg-white"
                  value={indicatorForm.bobotIndikator}
                  onChange={(e) => setIndicatorField('bobotIndikator', e.target.value)}
                  placeholder="50"
                />
              </div>
            </div>

            {/* Mode Perhitungan + Formula */}
            <div className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-4">
                <label className="text-sm font-medium mb-2 block text-white">Metode Perhitungan</label>
                <select className="w-full rounded-lg border-2 border-gray-300 px-3 py-3 text-sm bg-white" value={indicatorForm.mode} onChange={(e) => setIndicatorField('mode', e.target.value)}>
                  <option value="RASIO">Rasio (Pembilang / Penyebut)</option>
                  <option value="NILAI_TUNGGAL">Nilai tunggal (hanya penyebut)</option>
                </select>
              </div>

              <div className="col-span-8">
                <label className="text-sm font-medium mb-2 block text-white">Rumus perhitungan (opsional — kosong = pakai default)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                    placeholder={indicatorForm.mode === 'RASIO' ? 'Contoh default: pemb / peny  — atau rumus custom (pemb, peny)' : 'Contoh default: peny  — atau rumus custom (peny / 1000)'}
                    value={indicatorForm.formula || ''}
                    onChange={(e) => setIndicatorField('formula', e.target.value)}
                  />
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={indicatorForm.isPercent || false}
                      onChange={(e) => setIndicatorField('isPercent', e.target.checked)}
                      className="w-6 h-6 rounded-full border-2 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div
                      className="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-gray-300 bg-gray-100 text-lg font-bold cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIndicatorField('isPercent', !indicatorForm.isPercent);
                      }}
                    >
                      %
                    </div>
                  </label>
                </div>
                <div className="text-xs text-white/80 mt-2">Aktifkan checkbox untuk mengubah hasil menjadi persentase (hasil × 100).</div>
              </div>
            </div>

            {/* Pembilang (hanya untuk RASIO) */}
            {indicatorForm.mode === 'RASIO' && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-white">Faktor Pembilang</label>
                  <input
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                    value={indicatorForm.pembilangLabel}
                    onChange={(e) => setIndicatorField('pembilangLabel', e.target.value)}
                    placeholder="Aktiva lancar (juta rupiah)"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-white">Nilai Pembilang</label>
                  <input className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white" value={indicatorForm.pembilangValue} onChange={(e) => setIndicatorField('pembilangValue', e.target.value)} placeholder="5000" />
                </div>
              </div>
            )}

            {/* Penyebut (selalu ada) */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-white">Faktor Penyebut</label>
                <input
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                  value={indicatorForm.penyebutLabel}
                  onChange={(e) => setIndicatorField('penyebutLabel', e.target.value)}
                  placeholder={indicatorForm.mode === 'RASIO' ? 'Kewajiban lancar (juta rupiah)' : 'Jumlah transaksi, nilai portofolio, dll.'}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-white">Nilai Penyebut</label>
                <input
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                  value={indicatorForm.penyebutValue}
                  onChange={(e) => setIndicatorField('penyebutValue', e.target.value)}
                  placeholder={indicatorForm.mode === 'RASIO' ? '4000' : '100'}
                />
              </div>
            </div>

            {/* Threshold Likuiditas - KOLOM TAMBAHAN */}
            <div className="grid grid-cols-5 gap-4 mb-4">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <label className="text-sm font-medium mb-2 block text-green-800">Low</label>
                <input
                  className="w-full rounded border border-green-300 px-3 py-2 text-sm bg-white"
                  value={indicatorForm.low}
                  onChange={(e) => setIndicatorField('low', e.target.value)}
                  placeholder="≥ 1.5"
                />
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <label className="text-sm font-medium mb-2 block text-blue-800">Low to Moderate</label>
                <input
                  className="w-full rounded border border-blue-300 px-3 py-2 text-sm bg-white"
                  value={indicatorForm.lowToModerate}
                  onChange={(e) => setIndicatorField('lowToModerate', e.target.value)}
                  placeholder="1.3 ≤ x < 1.5"
                />
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <label className="text-sm font-medium mb-2 block text-yellow-800">Moderate</label>
                <input
                  className="w-full rounded border border-yellow-300 px-3 py-2 text-sm bg-white"
                  value={indicatorForm.moderate}
                  onChange={(e) => setIndicatorField('moderate', e.target.value)}
                  placeholder="1.1 ≤ x < 1.3"
                />
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <label className="text-sm font-medium mb-2 block text-orange-800">Moderate to High</label>
                <input
                  className="w-full rounded border border-orange-300 px-3 py-2 text-sm bg-white"
                  value={indicatorForm.moderateToHigh}
                  onChange={(e) => setIndicatorField('moderateToHigh', e.target.value)}
                  placeholder="1.0 ≤ x < 1.1"
                />
              </div>
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <label className="text-sm font-medium mb-2 block text-red-800">High</label>
                <input
                  className="w-full rounded border border-red-300 px-3 py-2 text-sm bg-white"
                  value={indicatorForm.high}
                  onChange={(e) => setIndicatorField('high', e.target.value)}
                  placeholder="x < 1.0"
                />
              </div>
            </div>

            {/* Sumber risiko & dampak */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-white">Sumber Risiko</label>
                <textarea
                  rows={4}
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm resize-none bg-white"
                  value={indicatorForm.sumberRisiko}
                  onChange={(e) => setIndicatorField('sumberRisiko', e.target.value)}
                  placeholder="Contoh: fluktuasi pasar, penarikan dana besar, kegagalan pembayaran, dsb."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-white">Dampak</label>
                <textarea
                  rows={4}
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm resize-none bg-white"
                  value={indicatorForm.dampak}
                  onChange={(e) => setIndicatorField('dampak', e.target.value)}
                  placeholder="Contoh: gagal memenuhi kewajiban jangka pendek, penalti keterlambatan, reputasi buruk, dsb."
                />
              </div>
            </div>

            {/* Preview + peringkat + weighted */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6 flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium block text-white h-10 flex items-end">
                    Hasil Preview
                    {indicatorForm.mode === 'RASIO' ? ' (Pembilang / Penyebut)' : ' (Nilai Penyebut)'}
                  </label>
                  <input className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-gray-50" value={hasilPreview} readOnly />
                </div>

                <div className="flex-1">
                  <label className="text-sm font-medium block text-white h-10 flex items-end">Peringkat (1 - 5)</label>
                  <input type="number" min="1" max="5" className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white" value={indicatorForm.peringkat} onChange={(e) => setIndicatorField('peringkat', e.target.value)} />
                </div>

                <div className="flex-1">
                  <label className="text-sm font-medium block text-white h-10 flex items-end">Weighted (auto)</label>
                  <input className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-gray-50" value={weightedPreview.toFixed(2)} readOnly />
                </div>
              </div>
            </div>

            {/* Keterangan */}
            <div className="mt-4">
              <label className="text-sm font-medium mb-2 block text-white">Keterangan</label>
              <input className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white" value={indicatorForm.keterangan} onChange={(e) => setIndicatorField('keterangan', e.target.value)} placeholder="Keterangan tambahan" />
            </div>

            {/* Add/Save Button */}
            <div className="mt-6 flex justify-end">
              {!isEditingIndicator ? (
                <button onClick={handleCreateIndicator} disabled={isCreating} className="px-8 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold disabled:bg-gray-400">
                  {isCreating ? 'Menyimpan...' : '+ Tambah'}
                </button>
              ) : (
                <div className="flex gap-3">
                  <button onClick={handleUpdateIndicator} disabled={isUpdating} className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:bg-gray-400">
                    {isUpdating ? 'Menyimpan...' : 'Simpan'}
                  </button>
                  <button onClick={resetIndicatorForm} className="px-8 py-3 rounded-lg border-2 border-gray-300 hover:bg-gray-50 font-semibold">
                    Batal
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* table area - SAMA PERSIS DENGAN OPERATIONAL */}
      <section className="mt-4">
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="relative h-[350px]">
            <div className="absolute inset-0 overflow-x-auto overflow-y-auto">
              <table className="min-w-[1550px] text-sm border border-gray-300 border-collapse">
                <thead>
                  <tr className="bg-[#1f4e79] text-white">
                    <th className="border border-black px-3 py-2 text-left" rowSpan={2} style={{ width: 60 }}>
                      No
                    </th>
                    <th className="border border-black px-3 py-2 text-left" rowSpan={2} style={{ width: 80 }}>
                      Bobot
                    </th>
                    <th className="border border-black px-3 py-2 text-left" colSpan={3}>
                      Parameter atau Indikator
                    </th>
                    <th className="border border-black px-3 py-2 text-center" rowSpan={2} style={{ width: 90 }}>
                      Bobot Indikator
                    </th>
                    <th className="border border-black px-3 py-2 text-left" rowSpan={2} style={{ minWidth: 220 }}>
                      Sumber Risiko
                    </th>
                    <th className="border border-black px-3 py-2 text-left" rowSpan={2} style={{ minWidth: 240 }}>
                      Dampak
                    </th>
                    <th className="border border-black px-3 py-2 bg-[#b7d7a8] text-left text-black" rowSpan={2}>
                      Low
                    </th>
                    <th className="border border-black px-3 py-2 bg-[#c9daf8] text-left text-black" rowSpan={2}>
                      Low to Moderate
                    </th>
                    <th className="border border-black px-3 py-2 bg-[#fff2cc] text-left text-black" rowSpan={2}>
                      Moderate
                    </th>
                    <th className="border border-black px-3 py-2 bg-[#f9cb9c] text-left text-black" rowSpan={2}>
                      Moderate to High
                    </th>
                    <th className="border border-black px-3 py-2 bg-[#e06666] text-left text-white" rowSpan={2}>
                      High
                    </th>
                    <th className="border border-black px-3 py-2 bg-[#2e75b6] text-white" rowSpan={2} style={{ width: 100 }}>
                      Hasil
                    </th>
                    <th className="border border-black px-3 py-2 bg-[#2e75b6] text-white" rowSpan={2} style={{ width: 80 }}>
                      Peringkat
                    </th>
                    <th className="border border-black px-3 py-2 bg-[#2e75b6] text-white" rowSpan={2} style={{ width: 90 }}>
                      Weighted
                    </th>
                    <th className="border border-black px-3 py-2 text-center" rowSpan={2} style={{ width: 80 }}>
                      Aksi
                    </th>
                  </tr>
                  <tr className="bg-[#1f4e79] text-white">
                    <th className="border border-black px-3 py-2 text-left" style={{ minWidth: 260 }}>
                      Section
                    </th>
                    <th className="border border-black px-3 py-2 text-left" style={{ width: 70 }}>
                      Sub No
                    </th>
                    <th className="border border-black px-3 py-2 text-left" style={{ minWidth: 260 }}>
                      Indikator
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loadingData ? (
                    <tr>
                      <td className="border px-3 py-6 text-center text-gray-500" colSpan={17}>
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          Memuat data...
                        </div>
                      </td>
                    </tr>
                  ) : filteredSections.length === 0 ? (
                    <tr>
                      <td className="border px-3 py-6 text-center text-gray-500" colSpan={17}>
                        Belum ada data
                      </td>
                    </tr>
                  ) : (
                    filteredSections.map((s) => {
                      const inds = s.indikators || [];
                      if (!inds.length) {
                        return (
                          <tr key={s.id} className="bg-[#e9f5e1]">
                            <td className="border px-3 py-3 text-center">{s.no || s.no_sec}</td>
                            <td className="border px-3 py-3 text-center">{s.bobotSection || s.bobot_par}%</td>
                            <td className="border px-3 py-3" colSpan={15}>
                              {s.parameter || s.nama_section} – Belum ada indikator
                            </td>
                          </tr>
                        );
                      }

                      // ====== PERBAIKAN UTAMA: Hitung sectionRowSpan ======
                      const sectionRowSpan = inds.reduce((acc, it) => {
                        const transformed = transformIndicatorToFrontend(it);
                        return acc + rowsPerIndicator(transformed);
                      }, 0);

                      return (
                        <React.Fragment key={s.id}>
                          {inds.map((it, idx) => {
                            const firstOfSection = idx === 0;
                            const transformed = transformIndicatorToFrontend(it);

                            // ====== PERBAIKAN: Format hasil display ======
                            const hasilDisplay = (() => {
                              const raw = transformed.hasil === '' || transformed.hasil == null ? computeHasil(transformed) : transformed.hasil;
                              if (raw === '' || raw == null) return '';
                              const num = Number(raw);
                              if (!isFinite(num) || isNaN(num)) return String(raw);

                              if (transformed.isPercent) {
                                const pct = num * 100;
                                return `${pct.toFixed(2)}%`;
                              }

                              if (transformed.mode === 'RASIO') {
                                return num.toFixed(4);
                              } else {
                                return '';
                              }
                            })();

                            const weightedDisplay =
                              typeof transformed.weighted === 'number' || (typeof transformed.weighted === 'string' && transformed.weighted !== '' && !isNaN(Number(transformed.weighted)))
                                ? Number(transformed.weighted).toFixed(2)
                                : '';

                            return (
                              <React.Fragment key={transformed.id}>
                                {/* BARIS UTAMA INDIKATOR */}
                                <tr>
                                  {firstOfSection && (
                                    <>
                                      <td rowSpan={sectionRowSpan} className="border px-3 py-3 align-top bg-[#d9eefb] text-center font-semibold">
                                        {s.no || s.no_sec}
                                      </td>
                                      <td rowSpan={sectionRowSpan} className="border px-3 py-3 align-top bg-[#d9eefb] text-center">
                                        {s.bobotSection || s.bobot_par}%
                                      </td>
                                      <td rowSpan={sectionRowSpan} className="border px-3 py-3 align-top bg-[#d9eefb]">
                                        {s.parameter || s.nama_section}
                                      </td>
                                    </>
                                  )}

                                  {/* Sub No & Indikator */}
                                  <td className="border px-3 py-3 text-center align-top bg-[#d9eefb]">{transformed.subNo}</td>
                                  <td className="border px-3 py-3 align-top bg-[#d9eefb]">
                                    <div className="font-medium">{transformed.indikator}</div>
                                  </td>

                                  {/* Bobot indikator */}
                                  <td className="border px-3 py-3 text-center align-top bg-[#d9eefb]">{transformed.bobotIndikator}%</td>

                                  <td className="border px-3 py-3 align-top bg-[#d9eefb]">{transformed.sumberRisiko}</td>
                                  <td className="border px-3 py-3 align-top bg-[#d9eefb]">{transformed.dampak}</td>

                                  {/* Thresholds Likuiditas */}
                                  <td className="border px-3 py-3 text-center bg-green-700/10">{transformed.low}</td>
                                  <td className="border px-3 py-3 text-center bg-blue-700/10">{transformed.lowToModerate}</td>
                                  <td className="border px-3 py-3 text-center bg-yellow-700/10">{transformed.moderate}</td>
                                  <td className="border px-3 py-3 text-center bg-orange-700/10">{transformed.moderateToHigh}</td>
                                  <td className="border px-3 py-3 text-center bg-red-700/10">{transformed.high}</td>

                                  {/* Hasil */}
                                  <td className="border px-3 py-3 text-right bg-gray-400/20">{hasilDisplay}</td>

                                  <td className="border px-3 py-3 text-center">
                                    <div style={{ minWidth: 36, minHeight: 24 }} className="inline-block rounded bg-yellow-300 px-2">
                                      {transformed.peringkat}
                                    </div>
                                  </td>

                                  <td className="border px-3 py-3 text-right bg-gray-400/20">{weightedDisplay}</td>

                                  <td className="border px-3 py-3 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                      <button onClick={() => handleEditIndicator(it)} className="px-2 py-1 rounded border hover:bg-blue-50" title="Edit Indikator">
                                        <Edit3 size={14} />
                                      </button>
                                      <button onClick={() => handleDeleteIndicator(transformed.id)} className="px-2 py-1 rounded border text-red-600 hover:bg-red-50" title="Hapus Indikator">
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>

                                {/* BARIS PEMBILANG – hanya kalau mode RASIO */}
                                {transformed.mode === 'RASIO' && (
                                  <tr className="bg-white">
                                    <td className="border px-3 py-2 text-center"></td>
                                    <td className="border px-3 py-2">
                                      <div className="text-sm text-gray-700 mt-1">{transformed.pembilangLabel || '-'}</div>
                                    </td>
                                    <td className="border px-3 py-2 text-center"></td>
                                    <td className="border px-3 py-2" colSpan={9}></td>
                                    <td className="border px-3 py-2 bg-[#c6d9a7] text-right">{transformed.pembilangValue ? fmtNumber(transformed.pembilangValue) : ''}</td>
                                    <td className="border px-3 py-2" colSpan={3}></td>
                                  </tr>
                                )}

                                {/* BARIS PENYEBUT – selalu ada */}
                                <tr className="bg-white">
                                  <td className="border px-3 py-2 text-center"></td>
                                  <td className="border px-3 py-2">
                                    <div className="text-sm text-gray-700 mt-1">{transformed.penyebutLabel || '-'}</div>
                                  </td>
                                  <td className="border px-3 py-2 text-center"></td>
                                  <td className="border px-3 py-2" colSpan={9}></td>
                                  <td className="border px-3 py-2 bg-[#c6d9a7] text-right">{transformed.penyebutValue ? fmtNumber(transformed.penyebutValue) : ''}</td>
                                  <td className="border px-3 py-2" colSpan={3}></td>
                                </tr>
                              </React.Fragment>
                            );
                          })}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>

                <tfoot>
                  <tr>
                    <td className="border border-gray-400" colSpan={13}></td>
                    <td className="border border-gray-400 text-white font-semibold text-center bg-[#0b3861]" colSpan={2}>
                      Summary
                    </td>
                    <td className="border border-gray-400 text-white font-semibold text-center bg-[#8fce00]">{Number(totalWeighted || 0).toFixed(2)}</td>
                    <td className="border border-gray-400"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}