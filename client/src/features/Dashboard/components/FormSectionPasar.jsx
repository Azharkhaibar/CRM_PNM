// FormSectionPasar.jsx
import React, { useMemo } from "react";

/**
 Props:
 - sections: array of sections { id, no, title, bobot, indicators: [...] }
 - setSections: setter
 - indicatorDraft: object (current indicator form)
 - setIndicatorDraft: setter
 - selectedSectionId, setSelectedSectionId
 - onAddIndicator(), onUpdateIndicator(), onCancelEditIndicator()
 - editingIndicatorIndex (null or index)
*/
export default function FormSectionPasar({
    sections = [],
    setSections,
    indicatorDraft,
    setIndicatorDraft,
    selectedSectionId,
    setSelectedSectionId,
    onAddIndicator,
    onUpdateIndicator,
    editingIndicatorIndex,
    onCancelEdit,
}) {
    // helper to reset draft - caller should do it too (we still display preview)
    const handleChangeDraft = (k, v) => setIndicatorDraft((d) => ({ ...(d || {}), [k]: v }));

    // get selected section object (or undefined)
    const selSection = sections.find((s) => s.id === selectedSectionId);

    const previewHasil = useMemo(() => {
        const num = Number(indicatorDraft?.numeratorValue || 0);
        const den = Number(indicatorDraft?.denominatorValue || 0);
        const r = den ? num / den : 0;
        return (r * 100).toFixed(2) + "%";
    }, [indicatorDraft?.numeratorValue, indicatorDraft?.denominatorValue]);

    const autoWeighted = useMemo(() => {
        // computeWeighted(bobotSection, bobotIndikator, peringkat)
        if (!indicatorDraft) return "";
        const sb = Number(selSection?.bobot || 0);
        const bi = Number(indicatorDraft.bobotIndikator || 0);
        const p = Number(indicatorDraft.peringkat || 0);
        // same formula as your computeWeighted: (sb * bi * p) / 10000
        const w = sb && bi && p ? ((sb * bi * p) / 10000) : 0;
        return w ? `${w.toFixed(2)}%` : "";
    }, [indicatorDraft, selSection]);

    return (
        <section className="rounded-xl bg-[#DBDBDB] p-4">
            <h2 className="text-2xl font-semibold mb-4">Form Pasar (Section & Indicator)</h2>

            {/* SECTION SELECTOR (dropdown yang juga bisa menambah section baru) */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Section / Parameter</label>
                <div className="flex gap-2">
                    <select
                        value={selectedSectionId || ""}
                        onChange={(e) => setSelectedSectionId(e.target.value || null)}
                        className="rounded-xl border px-3 py-2 bg-white flex-1"
                    >
                        <option value="">-- Pilih atau Buat Section Baru --</option>
                        {sections.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.no} — {s.title} ({s.bobot}%)
                            </option>
                        ))}
                        <option value="__new">-- Buat Section Baru --</option>
                    </select>

                    {/* If new, show inline input for new section name & bobot */}
                    {selectedSectionId === "__new" ? (
                        <div className="flex gap-2 flex-1">
                            <input
                                placeholder="Judul section baru..."
                                className="rounded-xl border px-3 py-2 flex-1"
                                onChange={(e) => {
                                    // temp store new name in indicatorDraft.__newSectionTitle
                                    setSections((prev) => prev); // noop to satisfy lint; actual create happens on 'Buat Section'
                                    setIndicatorDraft((d) => ({ ...(d || {}), __newSectionTitle: e.target.value }));
                                }}
                                value={indicatorDraft?.__newSectionTitle || ""}
                            />
                            <input
                                type="number"
                                placeholder="Bobot %"
                                className="w-32 rounded-xl border px-3 py-2"
                                onChange={(e) => setIndicatorDraft((d) => ({ ...(d || {}), __newSectionBobot: e.target.value }))}
                                value={indicatorDraft?.__newSectionBobot || ""}
                            />
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                                onClick={() => {
                                    // create new section and select it
                                    const title = (indicatorDraft?.__newSectionTitle || "").trim();
                                    const b = Number(indicatorDraft?.__newSectionBobot || 0);
                                    if (!title) return alert("Masukkan judul section");
                                    const id = `s-${Date.now()}`;
                                    const newSection = { id, no: `${sections.length + 1}`, title, bobot: b, indicators: [] };
                                    setSections((prev) => [...prev, newSection]);
                                    setIndicatorDraft((d) => ({ ...(d || {}), __newSectionTitle: "", __newSectionBobot: "" }));
                                    setTimeout(() => setSelectedSectionId(id), 0);
                                }}
                            >
                                Buat Section
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* SECTION META (show selected section details) */}
            {selSection ? (
                <div className="mb-4 rounded-lg p-3 bg-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-gray-500">No Section</div>
                            <div className="font-medium">{selSection.no}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Judul Section</div>
                            <div className="font-medium">{selSection.title}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Bobot Section</div>
                            <div className="font-medium">{selSection.bobot}%</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-4 text-sm text-gray-600">Belum memilih section. Pilih section di dropdown atau buat baru.</div>
            )}

            {/* INDICATOR FORM (satu form saja) */}
            <div className="rounded-lg p-4 bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-600">Nama Indikator</label>
                        <input
                            className="w-full rounded-xl border px-3 py-2"
                            value={indicatorDraft?.title || ""}
                            onChange={(e) => handleChangeDraft("title", e.target.value)}
                        />

                        <div className="grid grid-cols-2 gap-3 mt-3">
                            <div>
                                <label className="block text-sm text-gray-600">Bobot Indikator (%)</label>
                                <input
                                    type="number"
                                    className="w-full rounded-xl border px-3 py-2"
                                    value={indicatorDraft?.bobotIndikator || ""}
                                    onChange={(e) => handleChangeDraft("bobotIndikator", e.target.value === "" ? "" : Number(e.target.value))}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600">Peringkat (1-5)</label>
                                <input
                                    type="number"
                                    min={1}
                                    max={5}
                                    className="w-full rounded-xl border px-3 py-2"
                                    value={indicatorDraft?.peringkat || 1}
                                    onChange={(e) => handleChangeDraft("peringkat", Number(e.target.value || 1))}
                                />
                            </div>
                        </div>

                        <div className="mt-3">
                            <label className="block text-sm text-gray-600">Faktor Pembilang (label)</label>
                            <input
                                className="w-full rounded-xl border px-3 py-2"
                                value={indicatorDraft?.numeratorLabel || ""}
                                onChange={(e) => handleChangeDraft("numeratorLabel", e.target.value)}
                            />
                            <label className="block text-sm text-gray-600 mt-2">Total Pembilang (value)</label>
                            <input
                                type="number"
                                className="w-full rounded-xl border px-3 py-2"
                                value={indicatorDraft?.numeratorValue || ""}
                                onChange={(e) => handleChangeDraft("numeratorValue", e.target.value)}
                            />
                        </div>

                        <div className="mt-3">
                            <label className="block text-sm text-gray-600">Faktor Penyebut (label)</label>
                            <input
                                className="w-full rounded-xl border px-3 py-2"
                                value={indicatorDraft?.denominatorLabel || ""}
                                onChange={(e) => handleChangeDraft("denominatorLabel", e.target.value)}
                            />
                            <label className="block text-sm text-gray-600 mt-2">Total Penyebut (value)</label>
                            <input
                                type="number"
                                className="w-full rounded-xl border px-3 py-2"
                                value={indicatorDraft?.denominatorValue || ""}
                                onChange={(e) => handleChangeDraft("denominatorValue", e.target.value)}
                            />
                        </div>

                        <div className="mt-3">
                            <label className="block text-sm text-gray-600">Keterangan</label>
                            <textarea
                                className="w-full rounded-xl border px-3 py-2"
                                value={indicatorDraft?.keterangan || ""}
                                onChange={(e) => handleChangeDraft("keterangan", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* right column: risk scale inputs + preview hasil + weighted */}
                    <div>
                        <div>
                            <label className="block text-sm text-gray-600">Skala Risiko - Low</label>
                            <input className="w-full rounded-xl border px-3 py-2" value={indicatorDraft?.low || ""} onChange={(e) => handleChangeDraft("low", e.target.value)} />
                        </div>
                        <div className="mt-2">
                            <label className="block text-sm text-gray-600">Low to Moderate</label>
                            <input className="w-full rounded-xl border px-3 py-2" value={indicatorDraft?.lowToModerate || ""} onChange={(e) => handleChangeDraft("lowToModerate", e.target.value)} />
                        </div>
                        <div className="mt-2">
                            <label className="block text-sm text-gray-600">Moderate</label>
                            <input className="w-full rounded-xl border px-3 py-2" value={indicatorDraft?.moderate || ""} onChange={(e) => handleChangeDraft("moderate", e.target.value)} />
                        </div>
                        <div className="mt-2">
                            <label className="block text-sm text-gray-600">Moderate to High</label>
                            <input className="w-full rounded-xl border px-3 py-2" value={indicatorDraft?.moderateToHigh || ""} onChange={(e) => handleChangeDraft("moderateToHigh", e.target.value)} />
                        </div>
                        <div className="mt-2">
                            <label className="block text-sm text-gray-600">High</label>
                            <input className="w-full rounded-xl border px-3 py-2" value={indicatorDraft?.high || ""} onChange={(e) => handleChangeDraft("high", e.target.value)} />
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-2">
                            <div>
                                <label className="block text-sm text-gray-600">Preview Hasil (%)</label>
                                <input className="w-full rounded-xl border px-3 py-2 bg-gray-50" value={previewHasil} readOnly />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600">Weighted (auto)</label>
                                <input className="w-full rounded-xl border px-3 py-2 bg-gray-50" value={autoWeighted} readOnly />
                            </div>

                            <div className="flex gap-2 mt-3">
                                {editingIndicatorIndex == null ? (
                                    <button
                                        className="bg-green-600 text-white px-4 py-2 rounded-xl"
                                        onClick={() => {
                                            if (!selectedSectionId || selectedSectionId === "__new") return alert("Pilih section terlebih dulu");
                                            if (!indicatorDraft?.title) return alert("Isi nama indikator");
                                            onAddIndicator();
                                        }}
                                    >
                                        Tambah Indikator
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                                            onClick={() => onUpdateIndicator()}
                                        >
                                            Simpan Perubahan
                                        </button>
                                        <button className="border px-4 py-2 rounded-xl" onClick={onCancelEdit}>
                                            Batal
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
