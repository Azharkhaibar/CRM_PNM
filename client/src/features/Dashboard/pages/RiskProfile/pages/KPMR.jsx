import React, { useMemo, useState } from "react";
import { Download, Trash2, Edit3, Search } from "lucide-react";
import {
    TextField,
    TextAreaField,
    NumberField,
    YearInput,
    QuarterSelect,
} from "../../../components/Inputs";
import { exportKPMRInvestasiToExcel } from "../utils/exportExcelKPMR";

/** Struktur form per section */
const EMPTY_FORM = {
    year: new Date().getFullYear(),
    quarter: "Q1",

    // Aspek
    aspekNo: "Aspek 1",
    aspekTitle: "Tata Kelola Risiko",
    aspekBobot: 30,

    // Section
    sectionNo: "1",
    sectionTitle:
        "Bagaimana perumusan tingkat risiko yang akan diambil (risk appetite) dan toleransi risiko (risk tolerance) terkait risiko investasi?",
    sectionSkor: "",

    // Isi level 1..5
    level1: "",
    level2: "",
    level3: "",
    level4: "",
    level5: "",

    evidence: "",
};

export default function KPMR() {
    // Periode + tools
    const [viewYear, setViewYear] = useState(new Date().getFullYear());
    const [viewQuarter, setViewQuarter] = useState("Q1");
    const [query, setQuery] = useState("");

    // Data
    const [rows, setRows] = useState([]);
    const [form, setForm] = useState({ ...EMPTY_FORM, year: viewYear, quarter: viewQuarter });
    const [editingIndex, setEditingIndex] = useState(null);

    const handleChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    // Filter + sort untuk tampilan
    const filtered = useMemo(() => {
        return rows
            .filter((r) => r.year === viewYear && r.quarter === viewQuarter)
            .filter((r) =>
                `${r.aspekNo} ${r.aspekTitle} ${r.sectionNo} ${r.sectionTitle} ${r.evidence} ${r.level1} ${r.level2} ${r.level3} ${r.level4} ${r.level5}`
                    .toLowerCase()
                    .includes(query.toLowerCase())
            )
            .sort((a, b) => {
                const aA = `${a.aspekNo}`.localeCompare(`${b.aspekNo}`, undefined, { numeric: true });
                if (aA !== 0) return aA;
                return `${a.sectionNo}`.localeCompare(`${b.sectionNo}`, undefined, { numeric: true });
            });
    }, [rows, viewYear, viewQuarter, query]);

    // Group by Aspek
    const groups = useMemo(() => {
        const g = new Map();
        for (const r of filtered) {
            const k = `${r.aspekNo}|${r.aspekTitle}|${r.aspekBobot}`;
            if (!g.has(k)) g.set(k, []);
            g.get(k).push(r);
        }
        return Array.from(g.entries()).map(([k, items]) => {
            const [aspekNo, aspekTitle, aspekBobot] = k.split("|");
            return {
                aspekNo,
                aspekTitle,
                aspekBobot: Number(aspekBobot),
                items,
            };
        });
    }, [filtered]);

    // Rata-rata per-aspek lalu rata-rata seluruh aspek (hanya aspek yang punya angka valid)
    const totalAverageAllAspek = useMemo(() => {
        if (!groups || groups.length === 0) return "";
        const perAspek = groups
            .map((g) => {
                const vals = g.items
                    .map((it) => (it.sectionSkor === "" ? null : Number(it.sectionSkor)))
                    .filter((v) => v != null && !isNaN(v));
                return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
            })
            .filter((v) => v != null && !isNaN(v));
        return perAspek.length
            ? (perAspek.reduce((a, b) => a + b, 0) / perAspek.length).toFixed(2)
            : "";
    }, [groups]);

    const resetForm = () =>
        setForm((prev) => ({
            ...EMPTY_FORM,
            year: viewYear,
            quarter: viewQuarter,
            aspekNo: prev.aspekNo,
            aspekTitle: prev.aspekTitle,
            aspekBobot: prev.aspekBobot,
        }));

    const addRow = () => {
        setRows((r) => [...r, { ...form }]);
        resetForm();
    };

    const startEdit = (idx) => {
        setEditingIndex(idx);
        setForm({ ...filtered[idx] });
    };

    const saveEdit = () => {
        if (editingIndex === null) return;
        const target = filtered[editingIndex];
        const id = rows.findIndex(
            (x) =>
                x.year === target.year &&
                x.quarter === target.quarter &&
                x.aspekNo === target.aspekNo &&
                x.sectionNo === target.sectionNo &&
                x.sectionTitle === target.sectionTitle
        );
        const updated = [...rows];
        if (id !== -1) updated[id] = { ...form };
        setRows(updated);
        setEditingIndex(null);
        resetForm();
    };

    const removeRow = (idx) => {
        const target = filtered[idx];
        const id = rows.findIndex(
            (x) =>
                x.year === target.year &&
                x.quarter === target.quarter &&
                x.aspekNo === target.aspekNo &&
                x.sectionNo === target.sectionNo &&
                x.sectionTitle === target.sectionTitle
        );
        if (id !== -1) {
            setRows((r) => r.filter((_, i) => i !== id));
            if (editingIndex === idx) {
                setEditingIndex(null);
                resetForm();
            }
        }
    };

    const exportExcel = () =>
        exportKPMRInvestasiToExcel({
            year: viewYear,
            quarter: viewQuarter,
            rows: filtered,
        });

    return (
        <div className="space-y-6">
            {/* Header tools */}
            <header className="bg-white rounded-xl border shadow-sm">
                <div className="px-4 py-4 flex items-center justify-between gap-3">
                    <h1 className="text-2xl font-bold">KPMR – Investasi</h1>

                    <div className="flex items-center gap-2">
                        <YearInput
                            value={viewYear}
                            onChange={(v) => {
                                setViewYear(v);
                                setForm((f) => ({ ...f, year: v }));
                            }}
                        />
                        <QuarterSelect
                            value={viewQuarter}
                            onChange={(v) => {
                                setViewQuarter(v);
                                setForm((f) => ({ ...f, quarter: v }));
                            }}
                        />

                        <div className="relative">
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Cari aspek/section/evidence…"
                                className="pl-9 pr-3 py-2 rounded-xl border w-64"
                            />
                            <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>

                        <button
                            onClick={exportExcel}
                            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-gray-900 text-white hover:bg-black"
                        >
                            <Download size={18} /> Export {viewYear}-{viewQuarter}
                        </button>
                    </div>
                </div>
            </header>

            {/* ===== FORM (UI KPMR) ===== */}
            <section className="rounded-xl border shadow p-4 bg-[#DBDBDB]">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">Form KPMR – Investas</h2>
                    <div className="text-sm text-gray-500">
                        Periode: <span className="font-medium">{form.year}-{form.quarter}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* KIRI – Meta Aspek & Section */}
                    <div className="space-y-3">
                        {/* Aspek (No) & Bobot */}
                        <div className="grid grid-cols-2 gap-3">
                            <label className="block">
                                <div className="mb-1 text-sm text-gray-600 font-medium">Aspek (No)</div>
                                <input
                                    className="w-full rounded-xl border px-3 py-2 bg-white"
                                    value={form.aspekNo}
                                    onChange={(e) => handleChange("aspekNo", e.target.value)}
                                />
                            </label>

                            <label className="block">
                                <div className="mb-1 text-sm text-gray-600 font-medium">Bobot Aspek</div>
                                <div className="relative">
                                    <input
                                        type="number"
                                        className="w-full rounded-xl border pl-3 pr-10 py-2 bg-white"
                                        value={form.aspekBobot}
                                        onChange={(e) =>
                                            handleChange("aspekBobot", e.target.value === "" ? "" : Number(e.target.value))
                                        }
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                                </div>
                            </label>
                        </div>

                        {/* Judul Aspek */}
                        <label className="block">
                            <div className="mb-1 text-sm text-gray-600 font-medium">Judul Aspek</div>
                            <input
                                className="w-full rounded-xl border px-3 py-2 bg-white"
                                value={form.aspekTitle}
                                onChange={(e) => handleChange("aspekTitle", e.target.value)}
                            />
                        </label>

                        {/* No Section, Skor Section, Skor Average */}
                        <div className="grid grid-cols-3 gap-3">
                            <label className="block">
                                <div className="mb-1 text-sm text-gray-600 font-medium">No Section</div>
                                <input
                                    className="w-full rounded-xl border px-3 py-2 bg-white"
                                    value={form.sectionNo}
                                    onChange={(e) => handleChange("sectionNo", e.target.value)}
                                />
                            </label>

                            <label className="block">
                                <div className="mb-1 text-sm text-gray-600 font-medium">Skor Section</div>
                                <input
                                    type="number"
                                    className="w-full rounded-xl border px-3 py-2 bg-white"
                                    value={form.sectionSkor}
                                    onChange={(e) =>
                                        handleChange("sectionSkor", e.target.value === "" ? "" : Number(e.target.value))
                                    }
                                />
                            </label>

                            <label className="block">
                                <div className="mb-1 text-sm text-gray-600 font-medium">Skor Average</div>
                                <input
                                    className="w-full rounded-xl border px-3 py-2 bg-gray-50"
                                    value={(() => {
                                        const sameAspek = filtered.filter(
                                            (r) => r.aspekNo === form.aspekNo && r.aspekTitle === form.aspekTitle
                                        );
                                        const nums = sameAspek
                                            .map((r) => (r.sectionSkor === "" ? null : Number(r.sectionSkor)))
                                            .filter((v) => v != null && !isNaN(v));
                                        return nums.length
                                            ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2)
                                            : "";
                                    })()}
                                    readOnly
                                />
                            </label>
                        </div>

                        {/* Pertanyaan Section */}
                        <label className="block">
                            <div className="mb-1 text-sm text-gray-600 font-medium">Pertanyaan Section</div>
                            <textarea
                                className="w-full rounded-xl border px-3 py-2 bg-white min-h-[64px]"
                                value={form.sectionTitle}
                                onChange={(e) => handleChange("sectionTitle", e.target.value)}
                            />
                        </label>

                        {/* Evidence */}
                        <label className="block">
                            <div className="mb-1 text-sm text-gray-600 font-medium">Evidence</div>
                            <textarea
                                className="w-full rounded-xl border px-3 py-2 bg-white min-h-[56px]"
                                value={form.evidence}
                                onChange={(e) => handleChange("evidence", e.target.value)}
                            />
                        </label>
                    </div>

                    {/* KANAN – 5 Level (kartu kecil) */}
                    <div className="space-y-3">
                        {/* 1 */}
                        <div className="rounded-xl border shadow-sm bg-white">
                            <div className="px-3 pt-3 text-[13px] font-semibold">1. Strong</div>
                            <div className="p-3">
                                <textarea
                                    className="w-full rounded-lg border px-3 py-2 bg-white min-h-[56px]"
                                    value={form.level1}
                                    onChange={(e) => handleChange("level1", e.target.value)}
                                    placeholder="Deskripsi 1 (Strong)…"
                                />
                            </div>
                        </div>

                        {/* 2 */}
                        <div className="rounded-xl border shadow-sm bg-white">
                            <div className="px-3 pt-3 text-[13px] font-semibold">2. Satisfactory</div>
                            <div className="p-3">
                                <textarea
                                    className="w-full rounded-lg border px-3 py-2 bg-white min-h-[56px]"
                                    value={form.level2}
                                    onChange={(e) => handleChange("level2", e.target.value)}
                                    placeholder="Deskripsi 2 (Satisfactory)…"
                                />
                            </div>
                        </div>

                        {/* 3 */}
                        <div className="rounded-xl border shadow-sm bg-white">
                            <div className="px-3 pt-3 text-[13px] font-semibold">3. Fair</div>
                            <div className="p-3">
                                <textarea
                                    className="w-full rounded-lg border px-3 py-2 bg-white min-h-[56px]"
                                    value={form.level3}
                                    onChange={(e) => handleChange("level3", e.target.value)}
                                    placeholder="Deskripsi 3 (Fair)…"
                                />
                            </div>
                        </div>

                        {/* 4 */}
                        <div className="rounded-xl border shadow-sm bg-white">
                            <div className="px-3 pt-3 text-[13px] font-semibold">4. Marginal</div>
                            <div className="p-3">
                                <textarea
                                    className="w-full rounded-lg border px-3 py-2 bg-white min-h-[56px]"
                                    value={form.level4}
                                    onChange={(e) => handleChange("level4", e.target.value)}
                                    placeholder="Deskripsi 4 (Marginal)…"
                                />
                            </div>
                        </div>

                        {/* 5 */}
                        <div className="rounded-xl border shadow-sm bg-white">
                            <div className="px-3 pt-3 text-[13px] font-semibold">5. Unsatisfactory</div>
                            <div className="p-3">
                                <textarea
                                    className="w-full rounded-lg border px-3 py-2 bg-white min-h-[56px]"
                                    value={form.level5}
                                    onChange={(e) => handleChange("level5", e.target.value)}
                                    placeholder="Deskripsi 5 (Unsatisfactory)…"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tombol kanan bawah */}
                <div className="flex justify-end gap-2 mt-4">
                    {editingIndex === null ? (
                        <button
                            onClick={addRow}
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-lg shadow mt-7"
                        >
                            Simpan
                        </button>
                    ) : (
                        <div className="flex gap-2 mt-7">
                            <button
                                onClick={saveEdit}
                                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Simpan
                            </button>
                            <button
                                onClick={() => {
                                    setEditingIndex(null);
                                    resetForm();
                                }}
                                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border hover:bg-gray-50"
                            >
                                Batal
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* TABEL HASIL */}
            <section className="bg-white rounded-xl shadow overflow-hidden">
                <div className="px-4 py-3 bg-gray-100 border-b">
                    <div className="font-semibold">Data KPMR – Investasi ({viewYear}-{viewQuarter})</div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-[1400px] text-sm border border-gray-300 border-collapse">
                        <thead>
                            {/* BARIS 1 */}
                            <tr className="bg-[#1f4e79] text-white">
                                <th className="border px-3 py-2 text-left" colSpan={2}>
                                    KUALITAS PENERAPAN MANAJEMEN RISIKO
                                </th>
                                <th className="border px-3 py-2 text-center w-24" rowSpan={2}>Skor</th>
                                <th className="border px-3 py-2 text-center w-40" rowSpan={2}>1 (Strong)</th>
                                <th className="border px-3 py-2 text-center w-40" rowSpan={2}>2 (Satisfactory)</th>
                                <th className="border px-3 py-2 text-center w-40" rowSpan={2}>3 (Fair)</th>
                                <th className="border px-3 py-2 text-center w-40" rowSpan={2}>4 (Marginal)</th>
                                <th className="border px-3 py-2 text-center w-44" rowSpan={2}>5 (Unsatisfactory)</th>
                                <th className="border px-3 py-2 text-center w-[260px]" rowSpan={2}>Evidence</th>
                            </tr>
                            {/* BARIS 2 */}
                            <tr className="bg-[#1f4e79] text-white">
                                <th className="border px-3 py-2 w-20">No</th>
                                <th className="border px-3 py-2">Pertanyaan / Indikator</th>
                            </tr>
                        </thead>

                        <tbody>
                            {groups.length === 0 ? (
                                <tr>
                                    <td className="border px-3 py-6 text-center text-gray-500" colSpan={9}>
                                        Belum ada data
                                    </td>
                                </tr>
                            ) : (
                                groups.map((g, gi) => {
                                    const vals = g.items
                                        .map((it) => (it.sectionSkor === "" ? null : Number(it.sectionSkor)))
                                        .filter((v) => v != null && !isNaN(v));
                                    const skorAspek = vals.length
                                        ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2)
                                        : "";

                                    return (
                                        <React.Fragment key={gi}>
                                            {/* baris aspek */}
                                            <tr className="bg-[#e9f5e1]">
                                                <td className="border px-3 py-2 font-semibold" colSpan={2}>
                                                    {g.aspekNo} : {g.aspekTitle}{" "}
                                                    <span className="text-gray-600">(Bobot: {g.aspekBobot}%)</span>
                                                </td>
                                                <td className="border px-3 py-2 text-center font-bold" style={{ backgroundColor: "#93d150" }}>
                                                    {skorAspek}
                                                </td>
                                                <td className="border px-3 py-2" colSpan={5}></td>
                                                <td className="border px-3 py-2"></td>
                                            </tr>

                                            {/* baris section */}
                                            {g.items.map((r, idx) => {
                                                const filteredIndex = filtered.findIndex(
                                                    (x) =>
                                                        x.year === r.year &&
                                                        x.quarter === r.quarter &&
                                                        x.aspekNo === r.aspekNo &&
                                                        x.sectionNo === r.sectionNo &&
                                                        x.sectionTitle === r.sectionTitle
                                                );
                                                return (
                                                    <tr key={`${gi}-${idx}`} className="align-top hover:bg-gray-50">
                                                        <td className="border px-2 py-2 text-center">{r.sectionNo}</td>
                                                        <td className="border px-2 py-2 whitespace-pre-wrap">{r.sectionTitle}</td>
                                                        <td className="border px-2 py-2 text-center">{r.sectionSkor}</td>
                                                        <td className="border px-2 py-2 whitespace-pre-wrap">{r.level1}</td>
                                                        <td className="border px-2 py-2 whitespace-pre-wrap">{r.level2}</td>
                                                        <td className="border px-2 py-2 whitespace-pre-wrap">{r.level3}</td>
                                                        <td className="border px-2 py-2 whitespace-pre-wrap">{r.level4}</td>
                                                        <td className="border px-2 py-2 whitespace-pre-wrap">{r.level5}</td>
                                                        <td className="border px-2 py-2 whitespace-pre-wrap">
                                                            {/* tombol edit/hapus kamu */}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </React.Fragment>
                                    );
                                })
                            )}

                            {/* BARIS RATA-RATA TOTAL SEMUA ASPEK (tanpa teks di kiri) */}
                            <tr className="bg-[#c9daf8] font-semibold">
                                {/* kosongkan kiri */}
                                <td colSpan={2} className="border px-3 py-2"></td>
                                {/* hanya angka rata-rata di kolom skor */}
                                <td
                                    className="border px-3 py-2 text-center font-bold"
                                    style={{ backgroundColor: "#93d150" }}
                                >
                                    {totalAverageAllAspek}
                                </td>
                                {/* kosongkan kolom deskripsi */}
                                <td colSpan={6} className="border px-3 py-2"></td>
                            </tr>

                            {/* BARIS RATA-RATA DARI SEMUA SKOR AVERAGE PER ASPEK */}
                            <tr className="bg-[#fce5cd] font-semibold">
                                <td colSpan={2} className="border px-3 py-2 text-right pr-3">
                                    Rata-rata dari semua skor average per aspek:
                                </td>
                                <td className="border px-3 py-2 text-center font-bold" style={{ backgroundColor: "#f1c232" }}>
                                    {(() => {
                                        // Hitung rata-rata dari semua skor average per aspek
                                        const aspekAverages = groups
                                            .map(g => {
                                                const vals = g.items
                                                    .map(it => (it.sectionSkor === "" ? null : Number(it.sectionSkor)))
                                                    .filter(v => v != null && !isNaN(v));
                                                return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
                                            })
                                            .filter(avg => avg != null);

                                        if (aspekAverages.length === 0) return "";

                                        const total = aspekAverages.reduce((a, b) => a + b, 0);
                                        return (total / aspekAverages.length).toFixed(2);
                                    })()}
                                </td>
                                <td colSpan={6} className="border px-3 py-2"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
