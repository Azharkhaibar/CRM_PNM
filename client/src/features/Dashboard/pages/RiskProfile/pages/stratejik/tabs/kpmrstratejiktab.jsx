import React, { useState, useMemo } from "react";
import { Download, Trash2, Edit3, Search } from "lucide-react";
// import { exportKPMRInvestasiToExcel } from "../utils/exportExcelKPMR";
import { exportKPMRInvestasiToExcel } from "../../investasi/utils/investasi/exportexcelkpmrinvest";
const KPMR_EMPTY_FORM = {
  year: new Date().getFullYear(),
  quarter: "Q1",
  aspekNo: "Aspek 1",
  aspekTitle: "Tata Kelola Risiko",
  aspekBobot: 30,
  sectionNo: "1",
  sectionTitle: "Bagaimana perumusan tingkat risiko yang akan diambil (risk appetite) dan toleransi risiko (risk tolerance) terkait risiko stratejik?",
  sectionSkor: "",
  level1: "",
  level2: "",
  level3: "",
  level4: "",
  level5: "",
  evidence: "",
};

export default function KPMRStratejikTab() {
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewQuarter, setViewQuarter] = useState("Q1");
  const [query, setQuery] = useState("");

  const [KPMR_rows, setKPMR_rows] = useState([]);
  const [KPMR_form, setKPMR_form] = useState({
    ...KPMR_EMPTY_FORM,
    year: viewYear,
    quarter: viewQuarter,
  });
  const [KPMR_editingIndex, setKPMR_editingIndex] = useState(null);

  const KPMR_handleChange = (k, v) => setKPMR_form((f) => ({ ...f, [k]: v }));

  const KPMR_filtered = useMemo(
    () =>
      KPMR_rows.filter((r) => r.year === viewYear && r.quarter === viewQuarter)
        .filter((r) =>
          `${r.aspekNo} ${r.aspekTitle} ${r.sectionNo} ${r.sectionTitle} ${r.evidence} ${r.level1} ${r.level2} ${r.level3} ${r.level4} ${r.level5}`
            .toLowerCase()
            .includes(query.toLowerCase())
        )
        .sort((a, b) => {
          const aA = `${a.aspekNo}`.localeCompare(`${b.aspekNo}`, undefined, {
            numeric: true,
          });
          if (aA !== 0) return aA;
          return `${a.sectionNo}`.localeCompare(`${b.sectionNo}`, undefined, {
            numeric: true,
          });
        }),
    [KPMR_rows, viewYear, viewQuarter, query]
  );

  const KPMR_groups = useMemo(() => {
    const g = new Map();
    for (const r of KPMR_filtered) {
      const k = `${r.aspekNo}|${r.aspekTitle}|${r.aspekBobot}`;
      if (!g.has(k)) g.set(k, []);
      g.get(k).push(r);
    }
    return Array.from(g.entries()).map(([k, items]) => {
      const [aspekNo, aspekTitle, aspekBobot] = k.split("|");
      return { aspekNo, aspekTitle, aspekBobot: Number(aspekBobot), items };
    });
  }, [KPMR_filtered]);

  const KPMR_resetForm = () =>
    setKPMR_form((prev) => ({
      ...KPMR_EMPTY_FORM,
      year: viewYear,
      quarter: viewQuarter,
      aspekNo: prev.aspekNo,
      aspekTitle: prev.aspekTitle,
      aspekBobot: prev.aspekBobot,
    }));

  const KPMR_addRow = () => {
    setKPMR_rows((r) => [...r, { ...KPMR_form }]);
    setKPMR_editingIndex(null);
    KPMR_resetForm();
  };

  const KPMR_startEdit = (idx) => {
    setKPMR_editingIndex(idx);
    setKPMR_form({ ...KPMR_filtered[idx] });
  };

  const KPMR_saveEdit = () => {
    if (KPMR_editingIndex === null) return;
    const target = KPMR_filtered[KPMR_editingIndex];
    const id = KPMR_rows.findIndex(
      (x) =>
        x.year === target.year &&
        x.quarter === target.quarter &&
        x.aspekNo === target.aspekNo &&
        x.sectionNo === target.sectionNo &&
        x.sectionTitle === target.sectionTitle
    );
    if (id !== -1) {
      const updated = [...KPMR_rows];
      updated[id] = { ...KPMR_form };
      setKPMR_rows(updated);
    }
    setKPMR_editingIndex(null);
    KPMR_resetForm();
  };

  const KPMR_removeRow = (idx) => {
    const target = KPMR_filtered[idx];
    const id = KPMR_rows.findIndex(
      (x) =>
        x.year === target.year &&
        x.quarter === target.quarter &&
        x.aspekNo === target.aspekNo &&
        x.sectionNo === target.sectionNo &&
        x.sectionTitle === target.sectionTitle
    );
    if (id !== -1) setKPMR_rows((arr) => arr.filter((_, i) => i !== id));
    if (KPMR_editingIndex === idx) {
      setKPMR_editingIndex(null);
      KPMR_resetForm();
    }
  };

  const handleExportKPMR = () => {
    if (typeof exportKPMRInvestasiToExcel === "function") {
      exportKPMRInvestasiToExcel({
        year: viewYear,
        quarter: viewQuarter,
        rows: KPMR_filtered,
      });
    } else {
      alert("Fungsi exportKPMRInvestasiToExcel tidak ditemukan.");
    }
  };

  return (
    <div className="space-y-6">
      <header className="rounded-xl shadow-sm">
        <div className="px-4 py-4 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">KPMR – Stratejik</h1>

          <div className="flex items-center gap-2">
            <div>
              <input
                type="number"
                value={viewYear}
                onChange={(e) => {
                  const v = Number(e.target.value || new Date().getFullYear());
                  setViewYear(v);
                  setKPMR_form((f) => ({ ...f, year: v }));
                }}
                className="w-20 rounded-xl px-3 py-2 border"
              />
            </div>

            <div>
              <select
                value={viewQuarter}
                onChange={(e) => {
                  const v = e.target.value;
                  setViewQuarter(v);
                  setKPMR_form((f) => ({ ...f, quarter: v }));
                }}
                className="rounded-xl px-3 py-2 border"
              >
                <option>Q1</option>
                <option>Q2</option>
                <option>Q3</option>
                <option>Q4</option>
              </select>
            </div>

            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari aspek/section/evidence…"
                className="pl-9 pr-3 py-2 rounded-xl border w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
                aria-label="Cari data KPMR"
              />
              <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <button
              onClick={handleExportKPMR}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-gray-900 text-white hover:bg-black"
            >
              <Download size={18} /> Export {viewYear}-{viewQuarter}
            </button>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border shadow p-4 bg-gradient-to-r from-[#0076C6]/90 via-[#00A3DA]/90 to-[#33C2B5]/90 text-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold drop-shadow">Form KPMR – Stratejik</h2>
          <div className="text-sm text-white/90">
            Periode:{" "}
            <span className="font-semibold">
              {KPMR_form.year}-{KPMR_form.quarter}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <div className="mb-1 text-[13px] text-white/90 font-medium">Aspek (No)</div>
                <input
                  className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40"
                  value={KPMR_form.aspekNo}
                  onChange={(e) => KPMR_handleChange("aspekNo", e.target.value)}
                />
              </label>

              <label className="block">
                <div className="mb-1 text-[13px] text-white/90 font-medium">Bobot Aspek</div>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full rounded-xl pl-3 pr-10 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40"
                    value={KPMR_form.aspekBobot}
                    onChange={(e) =>
                      KPMR_handleChange("aspekBobot", e.target.value === "" ? "" : Number(e.target.value))
                    }
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                </div>
              </label>
            </div>

            <label className="block">
              <div className="mb-1 text-[13px] text-white/90 font-medium">Judul Aspek</div>
              <input
                className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40"
                value={KPMR_form.aspekTitle}
                onChange={(e) => KPMR_handleChange("aspekTitle", e.target.value)}
              />
            </label>

            <div className="grid grid-cols-3 gap-3">
              <label className="block">
                <div className="mb-1 text-[13px] text-white/90 font-medium">No Section</div>
                <input
                  className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40"
                  value={KPMR_form.sectionNo}
                  onChange={(e) => KPMR_handleChange("sectionNo", e.target.value)}
                />
              </label>

              <label className="block">
                <div className="mb-1 text-[13px] text-white/90 font-medium">Skor Section</div>
                <input
                  type="number"
                  className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40"
                  value={KPMR_form.sectionSkor}
                  onChange={(e) =>
                    KPMR_handleChange("sectionSkor", e.target.value === "" ? "" : Number(e.target.value))
                  }
                />
              </label>

              <label className="block">
                <div className="mb-1 text-[13px] text-white/90 font-medium">Skor Average</div>
                <input
                  className="w-full rounded-xl px-3 py-2 bg-white/70 text-gray-900"
                  value={(() => {
                    const sameAspek = KPMR_filtered.filter(
                      (r) => r.aspekNo === KPMR_form.aspekNo && r.aspekTitle === KPMR_form.aspekTitle
                    );
                    const nums = sameAspek
                      .map((r) => (r.sectionSkor === "" ? null : Number(r.sectionSkor)))
                      .filter((v) => v != null && !isNaN(v));
                    return nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2) : "";
                  })()}
                  readOnly
                />
              </label>
            </div>

            <label className="block">
              <div className="mb-1 text-[13px] text-white/90 font-medium">Pertanyaan Section</div>
              <textarea
                className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 min-h-[64px] focus:outline-none focus:ring-2 focus:ring-white/40"
                value={KPMR_form.sectionTitle}
                onChange={(e) => KPMR_handleChange("sectionTitle", e.target.value)}
              />
            </label>

            <label className="block">
              <div className="mb-1 text-[13px] text-white/90 font-medium">Evidence</div>
              <textarea
                className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 min-h-[56px] focus:outline-none focus:ring-2 focus:ring-white/40"
                value={KPMR_form.evidence}
                onChange={(e) => KPMR_handleChange("evidence", e.target.value)}
              />
            </label>
          </div>

          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((v) => (
              <div key={v} className="rounded-xl shadow-sm bg-white/95 backdrop-blur">
                <div className="px-3 pt-3 text-[13px] font-semibold text-gray-800">
                  {v}. {["Strong", "Satisfactory", "Fair", "Marginal", "Unsatisfactory"][v - 1]}
                </div>
                <div className="p-3">
                  <textarea
                    className="w-full rounded-lg px-3 py-2 bg-white min-h-[56px] focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-gray-900"
                    value={KPMR_form[`level${v}`]}
                    onChange={(e) => KPMR_handleChange(`level${v}`, e.target.value)}
                    placeholder={`Deskripsi ${v} (${["Strong", "Satisfactory", "Fair", "Marginal", "Unsatisfactory"][v - 1]})…`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          {KPMR_editingIndex === null ? (
            <button
              onClick={KPMR_addRow}
              className="bg-white/90 text-gray-900 font-semibold px-5 py-2 rounded-lg shadow mt-7"
            >
              Simpan
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={KPMR_saveEdit}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-white text-gray-900 hover:bg-gray-100"
              >
                Simpan
              </button>
              <button
                onClick={() => {
                  setKPMR_editingIndex(null);
                  KPMR_resetForm();
                }}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-transparent hover:bg-white/10"
              >
                Batal
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="px-4 py-3 bg-gray-100 border-b">
          <div className="font-semibold">Data KPMR – Stratejik ({viewYear}-{viewQuarter})</div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1400px] text-sm border border-gray-300 border-collapse">
            <thead>
              <tr className="bg-[#1f4e79] text-white">
                <th className="border px-3 py-2 text-left" colSpan={2}>
                  KUALITAS PENERAPAN MANAJEMEN RISIKO
                </th>
                <th className="border px-3 py-2 text-center w-24" rowSpan={2}>
                  Skor
                </th>
                <th className="border px-3 py-2 text-center w-40" rowSpan={2}>
                  1 (Strong)
                </th>
                <th className="border px-3 py-2 text-center w-40" rowSpan={2}>
                  2 (Satisfactory)
                </th>
                <th className="border px-3 py-2 text-center w-40" rowSpan={2}>
                  3 (Fair)
                </th>
                <th className="border px-3 py-2 text-center w-40" rowSpan={2}>
                  4 (Marginal)
                </th>
                <th className="border px-3 py-2 text-center w-44" rowSpan={2}>
                  5 (Unsatisfactory)
                </th>
                <th className="border px-3 py-2 text-center w-[260px]" rowSpan={2}>
                  Evidence
                </th>
              </tr>
              <tr className="bg-[#1f4e79] text-white">
                <th className="border px-3 py-2 w-20">No</th>
                <th className="border px-3 py-2">Pertanyaan / Indikator</th>
              </tr>
            </thead>

            <tbody>
              {KPMR_groups.length === 0 ? (
                <tr>
                  <td className="border px-3 py-6 text-center text-gray-500" colSpan={9}>
                    Belum ada data
                  </td>
                </tr>
              ) : (
                KPMR_groups.map((g, gi) => {
                  const vals = g.items
                    .map((it) => (it.sectionSkor === "" ? null : Number(it.sectionSkor)))
                    .filter((v) => v != null && !isNaN(v));
                  const skorAspek = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : "";

                  return (
                    <React.Fragment key={gi}>
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

                      {g.items.map((r, idx) => {
                        const filteredIndex = KPMR_filtered.findIndex(
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
                              <div className="flex items-center justify-between gap-2">
                                <span className="flex-1">{r.evidence || "-"}</span>
                                <div className="flex gap-2 shrink-0">
                                  <button
                                    onClick={() => KPMR_startEdit(filteredIndex)}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded border hover:bg-gray-50"
                                    title="Edit baris ini"
                                  >
                                    <Edit3 size={14} /> Edit
                                  </button>
                                  <button
                                    onClick={() => KPMR_removeRow(filteredIndex)}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded border hover:bg-red-50 text-red-600"
                                    title="Hapus baris ini"
                                  >
                                    <Trash2 size={14} /> Hapus
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  );
                })
              )}

              <tr className="bg-[#c9daf8] font-semibold">
                <td colSpan={2} className="border px-3 py-2"></td>
                <td className="border px-3 py-2 text-center font-bold" style={{ backgroundColor: "#93d150" }}>
                  {(() => {
                    if (!KPMR_groups || KPMR_groups.length === 0) return "";
                    const perAspek = KPMR_groups
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