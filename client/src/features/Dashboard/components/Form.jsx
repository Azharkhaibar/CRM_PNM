import React, { useMemo } from "react";
import {
    TextField,
    TextAreaField,
    NumberField,
    ReadOnlyField,
    RiskField,
} from "./Inputs";
import { computeWeighted } from "../pages/RiskProfile/utils/calc";

const FALLBACK_FORM = {
    year: new Date().getFullYear(),
    quarter: "Q1",
    no: "",
    subNo: "",
    sectionLabel: "",
    indikator: "",
    bobotSection: 0,
    bobotIndikator: 0,
    sumberRisiko: "",
    dampak: "",
    low: "",
    lowToModerate: "",
    moderate: "",
    moderateToHigh: "",
    high: "",
    numeratorLabel: "",
    numeratorValue: "",
    denominatorLabel: "",
    denominatorValue: "",
    hasil: "",
    peringkat: 1,
    weighted: "",
    keterangan: "",
};

export default function FormSection({
    form: incomingForm,
    setForm = () => { },
    onAdd = () => { },
    onSave = () => { },
    onReset = () => { },
    editing = false,
    title = "Form Investasi",
}) {
    const form = { ...FALLBACK_FORM, ...(incomingForm || {}) };

    const autoWeighted = useMemo(
        () =>
            computeWeighted(
                Number(form.bobotSection || 0),
                Number(form.bobotIndikator || 0),
                Number(form.peringkat || 0)
            ) || "",
        [form.bobotSection, form.bobotIndikator, form.peringkat]
    );

    const previewHasilPercent = useMemo(() => {
        const num = Number(form.numeratorValue || 0);
        const den = Number(form.denominatorValue || 0);
        const r = den ? num / den : 0;
        return (r * 100).toFixed(2) + "%";
    }, [form.numeratorValue, form.denominatorValue]);

    const handleChange = (k, v) =>
        setForm((prev) => ({ ...(prev || FALLBACK_FORM), [k]: v }));

    return (
        <section className="relative rounded-2xl overflow-hidden mb-6 shadow-sm bg-gradient-to-r from-[#0076C6]/90 via-[#00A3DA]/90 to-[#33C2B5]/90">
            <div className="p-6 sm:p-7">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-white font-semibold text-lg sm:text-xl">
                        {title}
                    </h2>
                    <div className="text-white/90 text-xs sm:text-sm">
                        Periode:{" "}
                        <span className="font-semibold">
                            {form.year}-{form.quarter}
                        </span>
                    </div>
                </div>

                {/* GRID DUA KOLOM */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* === KIRI === */}
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <TextField
                                label={<span className="text-white">No</span>}
                                value={form.no}
                                onChange={(v) => handleChange("no", v)}
                            />
                            <TextField
                                label={<span className="text-white">No Parameter</span>}
                                value={form.subNo}
                                onChange={(v) => handleChange("subNo", v)}
                            />
                        </div>

                        <TextField
                            label={<span className="text-white">Parameter</span>}
                            value={form.sectionLabel}
                            onChange={(v) => handleChange("sectionLabel", v)}
                        />

                        <TextAreaField
                            label={<span className="text-white">Sumber Risiko</span>}
                            value={form.sumberRisiko}
                            onChange={(v) => handleChange("sumberRisiko", v)}
                        />

                        <TextField
                            label={<span className="text-white">Faktor Penyebut</span>}
                            value={form.denominatorLabel}
                            onChange={(v) => handleChange("denominatorLabel", v)}
                        />
                        <TextField
                            label={<span className="text-white">Total Penyebut</span>}
                            value={form.denominatorValue}
                            onChange={(v) => handleChange("denominatorValue", v)}
                        />

                        <div className="grid grid-cols-3 gap-3">
                            <ReadOnlyField
                                label={<span className="text-white">Preview Hasil(%)</span>}
                                value={previewHasilPercent}
                            />
                            <NumberField
                                label={<span className="text-white">Peringkat(1–5)</span>}
                                value={form.peringkat}
                                onChange={(v) => handleChange("peringkat", v)}
                            />
                            <ReadOnlyField
                                label={<span className="text-white">Weighted(auto)</span>}
                                value={
                                    form.weighted !== ""
                                        ? `${form.weighted}%`
                                        : autoWeighted !== ""
                                            ? `${autoWeighted}%`
                                            : ""
                                }
                                hint="Weighted = Bobot Section × Bobot Indikator × Peringkat ÷ 10000"
                            />
                        </div>

                        <TextAreaField
                            label={<span className="text-white">Keterangan</span>}
                            value={form.keterangan}
                            onChange={(v) => handleChange("keterangan", v)}
                        />
                    </div>

                    {/* === KANAN === */}
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <NumberField
                                label={<span className="text-white">Bobot</span>}
                                value={form.bobotSection}
                                onChange={(v) => handleChange("bobotSection", v)}
                            />
                            <NumberField
                                label={<span className="text-white">Bobot Indikator</span>}
                                value={form.bobotIndikator}
                                onChange={(v) => handleChange("bobotIndikator", v)}
                            />
                        </div>

                        <TextAreaField
                            label={<span className="text-white">Indikator</span>}
                            value={form.indikator}
                            onChange={(v) => handleChange("indikator", v)}
                        />

                        <TextAreaField
                            label={<span className="text-white">Dampak</span>}
                            value={form.dampak}
                            onChange={(v) => handleChange("dampak", v)}
                        />

                        <TextField
                            label={<span className="text-white">Faktor Pembilang</span>}
                            value={form.numeratorLabel}
                            onChange={(v) => handleChange("numeratorLabel", v)}
                        />
                        <TextField
                            label={<span className="text-white">Total Pembilang</span>}
                            value={form.numeratorValue}
                            onChange={(v) => handleChange("numeratorValue", v)}
                        />

                        {/* === SKALA RISIKO === */}
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                            <RiskField
                                label="Low"
                                value={form.low}
                                onChange={(v) => handleChange("low", v)}
                                color="#B7E1A1"
                                textColor="#0B3D2E"
                                placeholder="x ≤ 1%"
                            />
                            <RiskField
                                label="Low to Moderate"
                                value={form.lowToModerate}
                                onChange={(v) => handleChange("lowToModerate", v)}
                                color="#CFE0FF"
                                textColor="#0B2545"
                                placeholder="1% < x ≤ 2%"
                            />
                            <RiskField
                                label="Moderate"
                                value={form.moderate}
                                onChange={(v) => handleChange("moderate", v)}
                                color="#FFEEAD"
                                textColor="#4B3A00"
                                placeholder="2% < x ≤ 3%"
                            />
                            <RiskField
                                label="Moderate to High"
                                value={form.moderateToHigh}
                                onChange={(v) => handleChange("moderateToHigh", v)}
                                color="#FAD2A7"
                                textColor="#5A2E00"
                                placeholder="3% < x ≤ 4%"
                            />
                            <RiskField
                                label="High"
                                value={form.high}
                                onChange={(v) => handleChange("high", v)}
                                color="#E57373"
                                textColor="#FFFFFF"
                                placeholder="x > 4%"
                            />
                        </div>
                    </div>
                </div>

                {/* === TOMBOL === */}
                <div className="flex justify-end gap-2 mt-6">
                    {!editing ? (
                        <button
                            onClick={onAdd}
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-lg shadow"
                        >
                            Simpan
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={onSave}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow"
                            >
                                Simpan
                            </button>
                            <button
                                onClick={onReset}
                                className="border bg-white hover:bg-gray-50 font-semibold px-5 py-2 rounded-lg shadow-sm"
                            >
                                Batal
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
