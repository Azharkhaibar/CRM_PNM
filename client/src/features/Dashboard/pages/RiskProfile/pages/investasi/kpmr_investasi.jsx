// import React, { useMemo, useState } from 'react';
// import { Download, Plus, Check, X, Trash2, Edit3, Search } from 'lucide-react';

// // ============================================================================
// // CONSTANTS
// // ============================================================================
// const EMPTY_FORM: KpmrInvestasi = {
//   year: new Date().getFullYear(),
//   quarter: 'Q1',
//   aspekNo: 'Aspek 1',
//   aspekTitle: 'Tata Kelola Risiko',
//   aspekBobot: 30,
//   sectionNo: '1',
//   sectionTitle: 'Bagaimana perumusan tingkat risiko yang akan diambil (risk appetite) dan toleransi risiko (risk tolerance) terkait risiko investasi?',
//   sectionSkor: '',
//   level1: '',
//   level2: '',
//   level3: '',
//   level4: '',
//   level5: '',
//   evidence: '',
// };

// const LEVEL_CONFIG = [
//   { level: 1, key: 'level1', title: 'Strong', color: 'from-green-500 to-emerald-600', bg: 'bg-green-50', border: 'border-green-200' },
//   { level: 2, key: 'level2', title: 'Satisfactory', color: 'from-lime-500 to-green-500', bg: 'bg-lime-50', border: 'border-lime-200' },
//   { level: 3, key: 'level3', title: 'Fair', color: 'from-yellow-500 to-amber-500', bg: 'bg-yellow-50', border: 'border-yellow-200' },
//   { level: 4, key: 'level4', title: 'Marginal', color: 'from-orange-500 to-red-500', bg: 'bg-orange-50', border: 'border-orange-200' },
//   { level: 5, key: 'level5', title: 'Unsatisfactory', color: 'from-red-500 to-rose-600', bg: 'bg-red-50', border: 'border-red-200' },
// ];

// // ============================================================================
// // UTILITY FUNCTIONS
// // ============================================================================
// const calculateAverage = (values: (number | string)[]) => {
//   const nums = values.map((v) => (v === '' ? null : Number(v))).filter((v) => v != null && !isNaN(v));

//   return nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2) : '';
// };

// const sortRows = (rows: KpmrInvestasi[]) => {
//   return [...rows].sort((a, b) => {
//     const aspekCompare = `${a.aspekNo}`.localeCompare(`${b.aspekNo}`, undefined, { numeric: true });
//     if (aspekCompare !== 0) return aspekCompare;
//     return `${a.sectionNo}`.localeCompare(`${b.sectionNo}`, undefined, { numeric: true });
//   });
// };

// const filterRows = (rows: KpmrInvestasi[], query: string) => {
//   if (!query) return rows;

//   return rows.filter((r) => {
//     const searchText = `${r.aspekNo} ${r.aspekTitle} ${r.sectionNo} ${r.sectionTitle} ${r.evidence} ${r.level1} ${r.level2} ${r.level3} ${r.level4} ${r.level5}`.toLowerCase();
//     return searchText.includes(query.toLowerCase());
//   });
// };

// const groupByAspek = (rows: KpmrInvestasi[]) => {
//   const groups = new Map();

//   rows.forEach((r) => {
//     const key = `${r.aspekNo}|${r.aspekTitle}|${r.aspekBobot}`;
//     if (!groups.has(key)) groups.set(key, []);
//     groups.get(key).push(r);
//   });

//   return Array.from(groups.entries()).map(([key, items]) => {
//     const [aspekNo, aspekTitle, aspekBobot] = key.split('|');
//     return {
//       aspekNo,
//       aspekTitle,
//       aspekBobot: Number(aspekBobot),
//       items,
//     };
//   });
// };

// // ============================================================================
// // COMPONENTS
// // ============================================================================

// // Input Components
// const TextField = ({ label, value, onChange, placeholder, className = '' }) => (
//   <div className={`space-y-2 ${className}`}>
//     <label className="block text-sm font-semibold text-gray-700">{label}</label>
//     <input
//       type="text"
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//     />
//   </div>
// );

// const TextAreaField = ({ label, value, onChange, placeholder, className = '' }) => (
//   <div className={`space-y-2 ${className}`}>
//     {label && <label className="block text-sm font-semibold text-gray-700">{label}</label>}
//     <textarea
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       rows={3}
//       className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
//     />
//   </div>
// );

// const NumberField = ({ label, value, onChange, min, max, placeholder }) => (
//   <div className="space-y-2">
//     <label className="block text-sm font-semibold text-gray-700">{label}</label>
//     <input
//       type="number"
//       value={value}
//       onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
//       placeholder={placeholder}
//       min={min}
//       max={max}
//       className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//     />
//   </div>
// );

// const ReadOnlyField = ({ label, value }) => (
//   <div className="space-y-2">
//     <label className="block text-sm font-semibold text-gray-700">{label}</label>
//     <div className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-gray-50 text-gray-600">{value || '-'}</div>
//   </div>
// );

// const YearInput = ({ value, onChange, className = '' }) => <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className={`px-4 py-2.5 rounded-xl border ${className}`} placeholder="Tahun" />;

// const QuarterSelect = ({ value, onChange, className = '' }) => (
//   <select value={value} onChange={(e) => onChange(e.target.value)} className={`px-4 py-2.5 rounded-xl border ${className}`}>
//     <option value="Q1">Q1</option>
//     <option value="Q2">Q2</option>
//     <option value="Q3">Q3</option>
//     <option value="Q4">Q4</option>
//   </select>
// );

// // Level Card Component
// const LevelCard = ({ config, value, onChange }) => (
//   <div className={`rounded-2xl border-2 ${config.border} ${config.bg} overflow-hidden transition-all duration-200 hover:shadow-md`}>
//     <div className={`bg-gradient-to-r ${config.color} px-4 py-3`}>
//       <div className="flex items-center gap-2">
//         <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
//           <span className="text-white text-xs font-bold">{config.level}</span>
//         </div>
//         <span className="text-white font-semibold text-sm">{config.title}</span>
//       </div>
//     </div>
//     <div className="p-4">
//       <TextAreaField value={value} onChange={onChange} placeholder={`Deskripsi level ${config.title}...`} className="mb-0" />
//     </div>
//   </div>
// );

// // Header Component
// const Header = ({ viewYear, viewQuarter, query, onYearChange, onQuarterChange, onQueryChange, onExport }) => (
//   <header className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg text-white p-6">
//     <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
//       <div className="flex items-center gap-3">
//         <div className="p-2 bg-white/20 rounded-xl">
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
//             />
//           </svg>
//         </div>
//         <h1 className="text-2xl font-bold">KPMR – Investasi</h1>
//       </div>

//       <div className="flex flex-wrap items-center gap-3">
//         <YearInput value={viewYear} onChange={onYearChange} className="bg-white/10 border-white/20 text-white placeholder-white/70" />
//         <QuarterSelect value={viewQuarter} onChange={onQuarterChange} className="bg-white/10 border-white/20 text-white" />

//         <div className="relative">
//           <input
//             value={query}
//             onChange={(e) => onQueryChange(e.target.value)}
//             placeholder="Cari aspek/section/evidence…"
//             className="pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/70 w-64 backdrop-blur-sm"
//           />
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
//         </div>

//         <button onClick={onExport} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl">
//           <Download className="w-5 h-5" />
//           Export {viewYear}-{viewQuarter}
//         </button>
//       </div>
//     </div>
//   </header>
// );

// // Form Component
// const KPMRForm = ({ form, onFormChange, onSubmit, filtered }) => {
//   const skorAverage = useMemo(() => {
//     const sameAspek = filtered.filter((r) => r.aspekNo === form.aspekNo && r.aspekTitle === form.aspekTitle);
//     const scores = sameAspek.map((r) => r.sectionSkor);
//     return calculateAverage(scores);
//   }, [filtered, form.aspekNo, form.aspekTitle]);

//   return (
//     <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//       <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-blue-100 rounded-lg">
//               <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//             </div>
//             <h2 className="text-xl font-bold text-gray-800">Form KPMR – Investasi</h2>
//           </div>
//           <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
//             <span className="text-sm font-medium text-gray-600">Periode: </span>
//             <span className="text-sm font-bold text-blue-600">
//               {form.year}-{form.quarter}
//             </span>
//           </div>
//         </div>
//       </div>

//       <div className="p-6">
//         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//           {/* Left Side - Meta Aspek & Section */}
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <TextField label="Aspek (No)" value={form.aspekNo} onChange={(value) => onFormChange('aspekNo', value)} placeholder="Masukkan nomor aspek" />

//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">Bobot Aspek</label>
//                 <div className="relative">
//                   <input
//                     type="number"
//                     className="w-full rounded-xl border border-gray-300 pl-4 pr-12 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                     value={form.aspekBobot}
//                     onChange={(e) => onFormChange('aspekBobot', e.target.value === '' ? '' : Number(e.target.value))}
//                     placeholder="0"
//                     min="0"
//                     max="100"
//                   />
//                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">%</span>
//                 </div>
//               </div>
//             </div>

//             <TextField label="Judul Aspek" value={form.aspekTitle} onChange={(value) => onFormChange('aspekTitle', value)} placeholder="Masukkan judul aspek" />

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <TextField label="No Section" value={form.sectionNo} onChange={(value) => onFormChange('sectionNo', value)} placeholder="Nomor section" />

//               <NumberField label="Skor Section" value={form.sectionSkor} onChange={(value) => onFormChange('sectionSkor', value)} min={0} max={5} placeholder="0" />

//               <ReadOnlyField label="Skor Average" value={skorAverage} />
//             </div>

//             <TextAreaField label="Pertanyaan Section" value={form.sectionTitle} onChange={(value) => onFormChange('sectionTitle', value)} placeholder="Masukkan pertanyaan section" />

//             <TextAreaField label="Evidence" value={form.evidence} onChange={(value) => onFormChange('evidence', value)} placeholder="Masukkan evidence yang diperlukan" />
//           </div>

//           {/* Right Side - 5 Levels */}
//           <div className="space-y-4">
//             {LEVEL_CONFIG.map((config) => (
//               <LevelCard key={config.level} config={config} value={form[`level${config.level}`]} onChange={(value) => onFormChange(`level${config.level}`, value)} />
//             ))}
//           </div>
//         </div>

//         <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
//           <button
//             onClick={onSubmit}
//             className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
//           >
//             <Check className="w-5 h-5" />
//             Simpan Data
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };

// // Table Component
// const DataTable = ({ groups, onEdit, onDelete }) => (
//   <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//     <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b">
//       <div className="flex items-center gap-3">
//         <div className="p-2 bg-blue-100 rounded-lg">
//           <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//           </svg>
//         </div>
//         <h3 className="text-lg font-bold text-gray-800">Data KPMR – Investasi</h3>
//       </div>
//     </div>

//     <div className="overflow-x-auto">
//       <table className="w-full text-sm min-w-full">
//         <thead>
//           <tr className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
//             <th className="border border-blue-500 px-4 py-3 text-left font-semibold text-sm" colSpan={2}>
//               KUALITAS PENERAPAN MANAJEMEN RISIKO
//             </th>
//             <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-20" rowSpan={2}>
//               Skor
//             </th>
//             <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-32" rowSpan={2}>
//               1 (Strong)
//             </th>
//             <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-32" rowSpan={2}>
//               2 (Satisfactory)
//             </th>
//             <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-32" rowSpan={2}>
//               3 (Fair)
//             </th>
//             <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-32" rowSpan={2}>
//               4 (Marginal)
//             </th>
//             <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-36" rowSpan={2}>
//               5 (Unsatisfactory)
//             </th>
//             <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-48" rowSpan={2}>
//               Evidence
//             </th>
//           </tr>
//           <tr className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
//             <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-16">No</th>
//             <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm">Pertanyaan / Indikator</th>
//           </tr>
//         </thead>

//         <tbody>
//           {groups.length === 0 ? (
//             <tr>
//               <td className="border border-gray-200 px-4 py-8 text-center text-gray-500" colSpan={9}>
//                 <div className="flex flex-col items-center gap-2">
//                   <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
//                     />
//                   </svg>
//                   <span className="text-lg font-medium text-gray-400">Belum ada data</span>
//                 </div>
//               </td>
//             </tr>
//           ) : (
//             groups.map((group, groupIndex) => {
//               const scores = group.items.map((it) => it.sectionSkor);
//               const skorAspek = calculateAverage(scores);

//               return (
//                 <React.Fragment key={groupIndex}>
//                   <tr className="bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-colors duration-150">
//                     <td className="border border-gray-200 px-4 py-3 font-semibold text-gray-800" colSpan={2}>
//                       <div className="flex items-center gap-2">
//                         <span>
//                           {group.aspekNo} : {group.aspekTitle}
//                         </span>
//                         <span className="text-sm text-gray-600 font-normal">(Bobot: {group.aspekBobot}%)</span>
//                       </div>
//                     </td>
//                     <td className="border border-gray-200 px-4 py-3 text-center font-bold text-gray-800 bg-green-100">{skorAspek}</td>
//                     <td className="border border-gray-200 px-4 py-3" colSpan={5}></td>
//                     <td className="border border-gray-200 px-4 py-3"></td>
//                   </tr>

//                   {group.items.map((row, rowIndex) => (
//                     <tr key={`${groupIndex}-${rowIndex}`} className="hover:bg-blue-50 transition-colors duration-150 group">
//                       <td className="border border-gray-200 px-4 py-3 text-center font-medium text-gray-700">{row.sectionNo}</td>
//                       <td className="border border-gray-200 px-4 py-3 whitespace-pre-wrap text-gray-600 text-sm">{row.sectionTitle}</td>
//                       <td className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-800">{row.sectionSkor}</td>
//                       <td className="border border-gray-200 px-4 py-3 whitespace-pre-wrap text-xs text-gray-600 max-w-32 truncate">{row.level1}</td>
//                       <td className="border border-gray-200 px-4 py-3 whitespace-pre-wrap text-xs text-gray-600 max-w-32 truncate">{row.level2}</td>
//                       <td className="border border-gray-200 px-4 py-3 whitespace-pre-wrap text-xs text-gray-600 max-w-32 truncate">{row.level3}</td>
//                       <td className="border border-gray-200 px-4 py-3 whitespace-pre-wrap text-xs text-gray-600 max-w-32 truncate">{row.level4}</td>
//                       <td className="border border-gray-200 px-4 py-3 whitespace-pre-wrap text-xs text-gray-600 max-w-32 truncate">{row.level5}</td>
//                       <td className="border border-gray-200 px-4 py-3">
//                         <div className="flex items-center justify-between gap-3">
//                           <span className="flex-1 text-xs text-gray-600 whitespace-pre-wrap max-w-48 truncate">{row.evidence}</span>
//                           <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                             <button
//                               onClick={() => onEdit(row)}
//                               className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-150 text-xs font-medium"
//                             >
//                               <Edit3 className="w-3 h-3" />
//                               Edit
//                             </button>
//                             <button
//                               onClick={() => onDelete(row)}
//                               className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-150 text-xs font-medium"
//                             >
//                               <Trash2 className="w-3 h-3" />
//                               Hapus
//                             </button>
//                           </div>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </React.Fragment>
//               );
//             })
//           )}
//         </tbody>
//       </table>
//     </div>
//   </section>
// );

// // ============================================================================
// // MAIN COMPONENT
// // ============================================================================
// export default function KPMR() {
//   const [viewYear, setViewYear] = useState(new Date().getFullYear());
//   const [viewQuarter, setViewQuarter] = useState('Q1');
//   const [query, setQuery] = useState('');
//   const [rows, setRows] = useState([]);
//   const [form, setForm] = useState({ ...EMPTY_FORM, year: viewYear, quarter: viewQuarter });

//   const handleFormChange = (key, value) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleYearChange = (year) => {
//     setViewYear(year);
//     setForm((prev) => ({ ...prev, year }));
//   };

//   const handleQuarterChange = (quarter) => {
//     setViewQuarter(quarter);
//     setForm((prev) => ({ ...prev, quarter }));
//   };

//   const filtered = useMemo(() => {
//     const filteredData = filterRows(rows, viewYear, viewQuarter, query);
//     return sortRows(filteredData);
//   }, [rows, viewYear, viewQuarter, query]);

//   const groups = useMemo(() => groupByAspek(filtered), [filtered]);

//   const resetForm = () => {
//     setForm((prev) => ({
//       ...EMPTY_FORM,
//       year: viewYear,
//       quarter: viewQuarter,
//       aspekNo: prev.aspekNo,
//       aspekTitle: prev.aspekTitle,
//       aspekBobot: prev.aspekBobot,
//     }));
//   };

//   const handleAddRow = () => {
//     setRows((prev) => [...prev, { ...form }]);
//     resetForm();
//   };

//   const handleEditRow = (row) => {
//     setForm({ ...row });
//   };

//   const handleDeleteRow = (rowToDelete) => {
//     setRows((prev) => prev.filter((r) => !(r.year === rowToDelete.year && r.quarter === rowToDelete.quarter && r.aspekNo === rowToDelete.aspekNo && r.sectionNo === rowToDelete.sectionNo && r.sectionTitle === rowToDelete.sectionTitle)));
//   };

//   const handleExport = () => {
//     alert(`Export functionality for ${viewYear}-${viewQuarter} would be implemented here`);
//   };

//   return (
//     <div className="space-y-6 max-w-full overflow-hidden">
//       <Header viewYear={viewYear} viewQuarter={viewQuarter} query={query} onYearChange={handleYearChange} onQuarterChange={handleQuarterChange} onQueryChange={setQuery} onExport={handleExport} />

//       <KPMRForm form={form} onFormChange={handleFormChange} onSubmit={handleAddRow} filtered={filtered} />

//       <DataTable groups={groups} onEdit={handleEditRow} onDelete={handleDeleteRow} />
//     </div>
//   );
// }

import React, { useMemo, useState } from 'react';
import { Download, Plus, Check, X, Trash2, Edit3, Search, Loader2, AlertCircle } from 'lucide-react';
import { useKpmrInvestasi } from './hooks/KPMR/kpmr-investasi.hook';

// ============================================================================
// CONSTANTS
// ============================================================================
const EMPTY_FORM = {
  year: new Date().getFullYear(),
  quarter: 'Q1',
  aspekNo: 'Aspek 1',
  aspekTitle: 'Tata Kelola Risiko',
  aspekBobot: 30,
  sectionNo: '1',
  sectionTitle: '',
  sectionSkor: '',
  indikator: 'Bagaimana perumusan tingkat risiko yang akan diambil (risk appetite) dan toleransi risiko (risk tolerance) terkait risiko investasi?',
  level1: '',
  level2: '',
  level3: '',
  level4: '',
  level5: '',
  evidence: '',
};

const LEVEL_CONFIG = [
  { level: 1, key: 'level1', title: 'Strong', color: 'from-green-500 to-emerald-600', bg: 'bg-green-50', border: 'border-green-200' },
  { level: 2, key: 'level2', title: 'Satisfactory', color: 'from-lime-500 to-green-500', bg: 'bg-lime-50', border: 'border-lime-200' },
  { level: 3, key: 'level3', title: 'Fair', color: 'from-yellow-500 to-amber-500', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  { level: 4, key: 'level4', title: 'Marginal', color: 'from-orange-500 to-red-500', bg: 'bg-orange-50', border: 'border-orange-200' },
  { level: 5, key: 'level5', title: 'Unsatisfactory', color: 'from-red-500 to-rose-600', bg: 'bg-red-50', border: 'border-red-200' },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const calculateAverage = (values) => {
  const nums = values.map((v) => (v === '' ? null : Number(v))).filter((v) => v != null && !isNaN(v));

  return nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2) : '';
};

const sortRows = (rows) => {
  return [...rows].sort((a, b) => {
    const aspekCompare = `${a.aspekNo}`.localeCompare(`${b.aspekNo}`, undefined, { numeric: true });
    if (aspekCompare !== 0) return aspekCompare;
    return `${a.sectionNo}`.localeCompare(`${b.sectionNo}`, undefined, { numeric: true });
  });
};

const filterRows = (rows, query) => {
  if (!query) return rows;

  return rows.filter((r) => {
    const searchText = `${r.aspekNo} ${r.aspekTitle} ${r.sectionNo} ${r.sectionTitle} ${r.evidence} ${r.level1} ${r.level2} ${r.level3} ${r.level4} ${r.level5}`.toLowerCase();
    return searchText.includes(query.toLowerCase());
  });
};

const groupByAspek = (rows) => {
  const groups = new Map();

  rows.forEach((r) => {
    const key = `${r.aspekNo}|${r.aspekTitle}|${r.aspekBobot}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  });

  return Array.from(groups.entries()).map(([key, items]) => {
    const [aspekNo, aspekTitle, aspekBobot] = key.split('|');
    return {
      aspekNo,
      aspekTitle,
      aspekBobot: Number(aspekBobot),
      items,
    };
  });
};



// ============================================================================
// COMPONENTS
// ============================================================================

// Input Components
const TextField = ({ label, value, onChange, placeholder, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    <label className="block text-sm font-semibold text-gray-700">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
    />
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {label && <label className="block text-sm font-semibold text-gray-700">{label}</label>}
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
    />
  </div>
);

const NumberField = ({ label, value, onChange, min, max, placeholder }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-700">{label}</label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
      placeholder={placeholder}
      min={min}
      max={max}
      className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
    />
  </div>
);

const ReadOnlyField = ({ label, value }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-700">{label}</label>
    <div className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-gray-50 text-gray-600">{value || '-'}</div>
  </div>
);

const YearInput = ({ value, onChange, className = '' }) => <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className={`px-4 py-2.5 rounded-xl border ${className}`} placeholder="Tahun" />;

const QuarterSelect = ({ value, onChange, className = '' }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} className={`px-4 py-2.5 rounded-xl border ${className}`}>
    <option value="Q1">Q1</option>
    <option value="Q2">Q2</option>
    <option value="Q3">Q3</option>
    <option value="Q4">Q4</option>
  </select>
);

const LevelCard = ({ config, value, onChange }) => (
  <div className={`rounded-2xl border-2 ${config.border} ${config.bg} overflow-hidden transition-all duration-200 hover:shadow-md`}>
    <div className={`bg-gradient-to-r ${config.color} px-4 py-3`}>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">{config.level}</span>
        </div>
        <span className="text-white font-semibold text-sm">{config.title}</span>
      </div>
    </div>
    <div className="p-4">
      <TextAreaField value={value} onChange={onChange} placeholder={`Deskripsi level ${config.title}...`} className="mb-0" />
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
  </div>
);

const ErrorAlert = ({ message, onDismiss }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
    <div className="flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-red-800">Error</h4>
        <p className="text-sm text-red-600 mt-1">{message}</p>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="text-red-400 hover:text-red-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  </div>
);

// Header Component
const Header = ({ viewYear, viewQuarter, query, onYearChange, onQuarterChange, onQueryChange, onExport }) => (
  <header className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg text-white p-6">
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-xl">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">KPMR – Investasi</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <YearInput value={viewYear} onChange={onYearChange} className="bg-white/10 border-white/20 text-white placeholder-white/70" />
        <QuarterSelect value={viewQuarter} onChange={onQuarterChange} className="bg-white/10 border-white/20 text-white" />

        <div className="relative">
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Cari aspek/section/evidence…"
            className="pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/70 w-64 backdrop-blur-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
        </div>

        <button onClick={onExport} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl">
          <Download className="w-5 h-5" />
          Export {viewYear}-{viewQuarter}
        </button>
      </div>
    </div>
  </header>
);

// Form Component
const KPMRForm = ({ form, onFormChange, onSubmit, filtered }) => {
  const skorAverage = useMemo(() => {
    const sameAspek = filtered.filter((r) => r.aspekNo === form.aspekNo && r.aspekTitle === form.aspekTitle);
    const scores = sameAspek.map((r) => r.sectionSkor);
    return calculateAverage(scores);
  }, [filtered, form.aspekNo, form.aspekTitle]);

  return (
    <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Form KPMR – Investasi</h2>
          </div>
          <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
            <span className="text-sm font-medium text-gray-600">Periode: </span>
            <span className="text-sm font-bold text-blue-600">
              {form.year}-{form.quarter}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Side - Meta Aspek & Section */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField label="Aspek (No)" value={form.aspekNo} onChange={(value) => onFormChange('aspekNo', value)} placeholder="Masukkan nomor aspek" />

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Bobot Aspek</label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full rounded-xl border border-gray-300 pl-4 pr-12 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    value={form.aspekBobot}
                    onChange={(e) => onFormChange('aspekBobot', e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">%</span>
                </div>
              </div>
            </div>

            <TextField label="Judul Aspek" value={form.aspekTitle} onChange={(value) => onFormChange('aspekTitle', value)} placeholder="Masukkan judul aspek" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField label="No Section" value={form.sectionNo} onChange={(value) => onFormChange('sectionNo', value)} placeholder="Nomor section" />

              <NumberField label="Skor Section" value={form.sectionSkor} onChange={(value) => onFormChange('sectionSkor', value)} min={0} max={5} placeholder="0" />

              <ReadOnlyField label="Skor Average" value={skorAverage} />
            </div>

            <TextAreaField label="Pertanyaan Section" value={form.sectionTitle} onChange={(value) => onFormChange('sectionTitle', value)} placeholder="Masukkan pertanyaan section" />

            <TextAreaField label="Evidence" value={form.evidence} onChange={(value) => onFormChange('evidence', value)} placeholder="Masukkan evidence yang diperlukan" />
          </div>

          {/* Right Side - 5 Levels */}
          <div className="space-y-4">
            {LEVEL_CONFIG.map((config) => (
              <LevelCard key={config.level} config={config} value={form[`level${config.level}`]} onChange={(value) => onFormChange(`level${config.level}`, value)} />
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
          <button
            onClick={onSubmit}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <Check className="w-5 h-5" />
            Simpan Data
          </button>
        </div>
      </div>
    </section>
  );
};

// Table Component
const DataTable = ({ groups, onEdit, onDelete }) => (
  <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
    <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800">Data KPMR – Investasi</h3>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-full">
        <thead>
          <tr className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <th className="border border-blue-500 px-4 py-3 text-left font-semibold text-sm" colSpan={2}>
              KUALITAS PENERAPAN MANAJEMEN RISIKO
            </th>
            <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-20" rowSpan={2}>
              Skor
            </th>
            <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-32" rowSpan={2}>
              1 (Strong)
            </th>
            <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-32" rowSpan={2}>
              2 (Satisfactory)
            </th>
            <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-32" rowSpan={2}>
              3 (Fair)
            </th>
            <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-32" rowSpan={2}>
              4 (Marginal)
            </th>
            <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-36" rowSpan={2}>
              5 (Unsatisfactory)
            </th>
            <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-48" rowSpan={2}>
              Evidence
            </th>
          </tr>
          <tr className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-16">No</th>
            <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm">Pertanyaan / Indikator</th>
          </tr>
        </thead>

        <tbody>
          {groups.length === 0 ? (
            <tr>
              <td className="border border-gray-200 px-4 py-8 text-center text-gray-500" colSpan={9}>
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <span className="text-lg font-medium text-gray-400">Belum ada data</span>
                </div>
              </td>
            </tr>
          ) : (
            groups.map((group, groupIndex) => {
              const scores = group.items.map((it) => it.sectionSkor);
              const skorAspek = calculateAverage(scores);

              return (
                <React.Fragment key={groupIndex}>
                  <tr className="bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-colors duration-150">
                    <td className="border border-gray-200 px-4 py-3 font-semibold text-gray-800" colSpan={2}>
                      <div className="flex items-center gap-2">
                        <span>
                          {group.aspekNo} : {group.aspekTitle}
                        </span>
                        <span className="text-sm text-gray-600 font-normal">(Bobot: {group.aspekBobot}%)</span>
                      </div>
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center font-bold text-gray-800 bg-green-100">{skorAspek}</td>
                    <td className="border border-gray-200 px-4 py-3" colSpan={5}></td>
                    <td className="border border-gray-200 px-4 py-3"></td>
                  </tr>

                  {group.items.map((row, rowIndex) => (
                    <tr key={`${groupIndex}-${rowIndex}`} className="hover:bg-blue-50 transition-colors duration-150 group">
                      <td className="border border-gray-200 px-4 py-3 text-center font-medium text-gray-700">{row.sectionNo}</td>
                      <td className="border border-gray-200 px-4 py-3 whitespace-pre-wrap text-gray-600 text-sm">{row.sectionTitle}</td>
                      <td className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-800">{row.sectionSkor}</td>
                      <td className="border border-gray-200 px-4 py-3 whitespace-pre-wrap text-xs text-gray-600 max-w-32 truncate">{row.level1}</td>
                      <td className="border border-gray-200 px-4 py-3 whitespace-pre-wrap text-xs text-gray-600 max-w-32 truncate">{row.level2}</td>
                      <td className="border border-gray-200 px-4 py-3 whitespace-pre-wrap text-xs text-gray-600 max-w-32 truncate">{row.level3}</td>
                      <td className="border border-gray-200 px-4 py-3 whitespace-pre-wrap text-xs text-gray-600 max-w-32 truncate">{row.level4}</td>
                      <td className="border border-gray-200 px-4 py-3 whitespace-pre-wrap text-xs text-gray-600 max-w-32 truncate">{row.level5}</td>
                      <td className="border border-gray-200 px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="flex-1 text-xs text-gray-600 whitespace-pre-wrap max-w-48 truncate">{row.evidence}</span>
                          <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              onClick={() => onEdit(row)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-150 text-xs font-medium"
                            >
                              <Edit3 className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => onDelete(row)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-150 text-xs font-medium"
                            >
                              <Trash2 className="w-3 h-3" />
                              Hapus
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  </section>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function KPMR() {
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewQuarter, setViewQuarter] = useState('Q1');
  const [query, setQuery] = useState('');
  const [form, setForm] = useState({
    year: new Date().getFullYear(),
    quarter: 'Q1',
    aspekNo: '',
    aspekBobot: 0,
    aspekTitle: '',
    sectionNo: '',
    sectionSkor: 0,
    tata_kelola_resiko: '',
    evidence: '',
    strong: '',
    satisfactory: '',
    fair: '',
    marginal: '',
    unsatisfactory: '',
    level1: '',
    level2: '',
    level3: '',
    level4: '',
    level5: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [localError, setLocalError] = useState(null);

  const filters = useMemo(() => ({ year: viewYear, quarter: viewQuarter }), [viewYear, viewQuarter]);
  // 🔥 INTEGRASI BACKEND
  const { data, loading, error, createKpmr, updateKpmr, deleteKpmr } = useKpmrInvestasi(filters);

  const groups = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return [
      {
        aspekNo: '1',
        aspekTitle: 'KPMR Investasi',
        aspekBobot: data[0]?.aspek_bobot || data[0]?.aspekBobot || 0,
        rows: data.map((item, idx) => ({
          id_kpmr_investasi: item.id_kpmr_investasi,
          sectionNo: idx + 1,
          indikator: item.indikator || item.tata_kelola_resiko || '-', // ✅ tampilkan indikator
          aspekBobot: item.aspek_bobot || item.aspekBobot || 0,
          sectionSkor: item.section_skor || item.sectionSkor || '-',
          strong: item.strong || '-',
          satisfactory: item.satisfactory || '-',
          fair: item.fair || '-',
          marginal: item.marginal || '-',
          unsatisfactory: item.unsatisfactory || '-',
          evidence: item.evidence || '-',
        })),
      },
    ];
  }, [data]);
// indikator
  const handleFormChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleYearChange = (year) => {
    setViewYear(year);
    setForm((prev) => ({ ...prev, year }));
  };

  const handleQuarterChange = (quarter) => {
    setViewQuarter(quarter);
    setForm((prev) => ({ ...prev, quarter }));
  };

  // Filter dan sort data
  const filtered = useMemo(() => {
    const filteredData = filterRows(data, query);
    return sortRows(filteredData);
  }, [data, query]);

  const resetForm = () => {
    setForm({
      ...EMPTY_FORM,
      year: viewYear,
      quarter: viewQuarter,
    });
    setEditingId(null);
    setLocalError(null);
  };

  // 🔥 CREATE / UPDATE
  const handleSubmit = async () => {
    try {
      setLocalError(null);
      console.log('Submitting form:', form);

      // Mapping level ke kolom database
      const mappedData = {
        ...form,
        strong: form.level1,
        satisfactory: form.level2,
        fair: form.level3,
        marginal: form.level4,
        unsatisfactory: form.level5,
      };

      if (!mappedData.aspekNo || !mappedData.aspekTitle || !mappedData.sectionNo || !mappedData.indikator) {
        setLocalError('Mohon lengkapi semua field yang diperlukan');
        return;
      }

      if (editingId) {
        // UPDATE
        await updateKpmr(editingId, mappedData);
      } else {
        // CREATE
        await createKpmr(mappedData);
      }

      resetForm();
    } catch (err) {
      console.error('Submit error:', err);
      setLocalError(err.message || 'Gagal menyimpan data');
    }
  };

  // 🔥 EDIT
  const handleEdit = (row) => {
    setForm({ ...row });
    setEditingId(row.id_kpmr_investasi || null);
    setLocalError(null);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🔥 DELETE
  const handleDelete = async (row) => {
    if (!row.id_kpmr_investasi) return;

    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        setLocalError(null);
        await deleteKpmr(row.id_kpmr_investasi);

        // Reset form jika sedang edit data yang dihapus
        if (editingId === row.id_kpmr_investasi) {
          resetForm();
        }
      } catch (err) {
        setLocalError(err.message || 'Gagal menghapus data');
      }
    }
  };

  const handleExport = () => {
    alert(`Export functionality for ${viewYear}-${viewQuarter} akan diimplementasikan`);
  };

  // Calculate average for current form aspek
  const skorAverage = useMemo(() => {
    const sameAspek = filtered.filter((r) => r.aspekNo === form.aspekNo && r.aspekTitle === form.aspekTitle);
    const scores = sameAspek.map((r) => r.sectionSkor);
    return calculateAverage(scores);
  }, [filtered, form.aspekNo, form.aspekTitle]);

  return (
    <div className="space-y-6 max-w-full overflow-hidden p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg text-white p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">KPMR – Investasi</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <YearInput value={viewYear} onChange={handleYearChange} className="bg-white/10 border-white/20 text-white placeholder-white/70" />
            <QuarterSelect value={viewQuarter} onChange={handleQuarterChange} className="bg-white/10 border-white/20 text-white" />

            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari aspek/section/evidence…"
                className="pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/70 w-64 backdrop-blur-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
            </div>

            <button
              onClick={handleExport}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              Export {viewYear}-{viewQuarter}
            </button>
          </div>
        </div>
      </header>

      {/* Error Alert */}
      {(error || localError) && <ErrorAlert message={error || localError} onDismiss={() => setLocalError(null)} />}

      {/* Form */}
      <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">{editingId ? 'Edit Data' : 'Form KPMR – Investasi'}</h2>
            </div>
            <div className="flex items-center gap-2">
              {editingId && (
                <button onClick={resetForm} className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
                  Batal Edit
                </button>
              )}
              <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                <span className="text-sm font-medium text-gray-600">Periode: </span>
                <span className="text-sm font-bold text-blue-600">
                  {form.year}-{form.quarter}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FORM KPMR */}

        <div className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Left Side */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField label="Aspek (No)" value={form.aspekNo} onChange={(value) => handleFormChange('aspekNo', value)} placeholder="Masukkan nomor aspek" />

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Bobot Aspek</label>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full rounded-xl border border-gray-300 pl-4 pr-12 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      value={form.aspekBobot}
                      onChange={(e) => handleFormChange('aspekBobot', e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">%</span>
                  </div>
                </div>
              </div>

              <TextField label="Judul Aspek" value={form.aspekTitle} onChange={(value) => handleFormChange('aspekTitle', value)} placeholder="Masukkan judul aspek" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextField label="No Section" value={form.sectionNo} onChange={(value) => handleFormChange('sectionNo', value)} placeholder="Nomor section" />

                <NumberField label="Skor Section" value={form.sectionSkor} onChange={(value) => handleFormChange('sectionSkor', value)} min={0} max={5} placeholder="0" />

                <ReadOnlyField label="Skor Average" value={skorAverage} />
              </div>

              <TextAreaField label="Indikator" value={form.indikator} onChange={(value) => handleFormChange('indikator', value)} placeholder="Masukkan pertanyaan section" />

              <TextAreaField label="Evidence" value={form.evidence} onChange={(value) => handleFormChange('evidence', value)} placeholder="Masukkan evidence yang diperlukan" />
            </div>

            {/* Right Side - Levels */}
            <div className="space-y-4">
              {LEVEL_CONFIG.map((config) => (
                <LevelCard key={config.level} config={config} value={form[config.key]} onChange={(value) => handleFormChange(config.key, value)} />
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {editingId ? 'Mengupdate...' : 'Menyimpan...'}
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  {editingId ? 'Update Data' : 'Simpan Data'}
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                Data KPMR – Investasi ({viewYear}-{viewQuarter})
              </h3>
            </div>
            <div className="text-sm text-gray-600">
              Total: <span className="font-bold text-blue-600">{filtered.length}</span> data
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                  <th className="border border-blue-500 px-4 py-3 text-left font-semibold text-sm" colSpan={2}>
                    KUALITAS PENERAPAN MANAJEMEN RISIKO
                  </th>
                  <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-20" rowSpan={2}>
                    Skor
                  </th>
                  <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-32" rowSpan={2}>
                    1 (Strong)
                  </th>
                  <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-32" rowSpan={2}>
                    2 (Satisfactory)
                  </th>
                  <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-32" rowSpan={2}>
                    3 (Fair)
                  </th>
                  <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-32" rowSpan={2}>
                    4 (Marginal)
                  </th>
                  <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-36" rowSpan={2}>
                    5 (Unsatisfactory)
                  </th>
                  <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-48" rowSpan={2}>
                    Evidence
                  </th>
                </tr>
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                  <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-16">No</th>
                  <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm">Pertanyaan / Indikator</th>
                </tr>
              </thead>

              <tbody>
                {(groups ?? []).map((group, idx) => (
                  <React.Fragment key={idx}>
                    {/* Header Aspek */}
                    <tr className="bg-blue-50 font-semibold text-gray-700">
                      <td colSpan={10} className="border border-gray-200 px-4 py-2 text-left">
                        {group.aspekNo}. {group.aspekTitle} — <span className="text-blue-600">Bobot: {group.aspekBobot}%</span>
                      </td>
                    </tr>

                    {/* Baris Section */}
                    {(group.rows ?? []).map((row, i) => (
                      <tr key={row.id_kpmr_investasi || i} className="hover:bg-blue-50 transition-colors">
                        <td className="border border-gray-200 px-4 py-2 text-center text-sm text-gray-700 w-16">{row.sectionNo}</td>
                        <td className="border border-gray-200 px-4 py-2 text-gray-800 text-sm">{row.indikator}</td>
                        <td className="border border-gray-200 px-4 py-2 text-center font-semibold text-blue-700">{row.sectionSkor}</td>
                        <td className="border border-gray-200 px-4 py-2 text-sm">{row.strong || '-'}</td>
                        <td className="border border-gray-200 px-4 py-2 text-sm">{row.satisfactory || '-'}</td>
                        <td className="border border-gray-200 px-4 py-2 text-sm">{row.fair || '-'}</td>
                        <td className="border border-gray-200 px-4 py-2 text-sm">{row.marginal || '-'}</td>
                        <td className="border border-gray-200 px-4 py-2 text-sm">{row.unsatisfactory || '-'}</td>
                        <td className="border border-gray-200 px-4 py-2 text-sm">{row.evidence || '-'}</td>

                        {/* 🔹 Aksi (Edit / Hapus) */}
                        <td className="border border-gray-200 px-4 py-2 text-center space-x-2">
                          <button onClick={() => handleEdit(row)} className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition">
                            ✏️ Edit
                          </button>

                          <button onClick={() => handleDelete(row)} className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition">
                            🗑️ Hapus
                          </button>
                        </td>
                      </tr>
                    ))}

                    {/* Rata-rata Aspek */}
                    <tr className="bg-gray-50 font-semibold text-gray-700">
                      <td colSpan={2} className="border border-gray-200 px-4 py-2 text-right">
                        Rata-rata Aspek
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-center text-blue-700" colSpan={8}>
                        {calculateAverage((group.rows ?? []).map((r) => r.sectionSkor))}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
