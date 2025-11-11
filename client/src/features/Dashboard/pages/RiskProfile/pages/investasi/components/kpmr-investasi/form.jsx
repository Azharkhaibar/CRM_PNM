import React, { useMemo } from 'react';
import { TextField, TextAreaField, NumberField, ReadOnlyField, QuarterSelect, YearInput, RiskField } from './Inputs';
import { computeWeighted } from '../../Dashboard/pages/RiskProfile/utils/calc';

const FALLBACK_FORM = {
  year: new Date().getFullYear(),
  quarter: 'Q1',
  no: '',
  subNo: '',
  sectionLabel: '',
  indikator: '',
  bobotSection: 0,
  bobotIndikator: 0,
  sumberRisiko: '',
  dampak: '',
  low: '',
  lowToModerate: '',
  moderate: '',
  moderateToHigh: '',
  high: '',
  numeratorLabel: '',
  numeratorValue: '',
  denominatorLabel: '',
  denominatorValue: '',
  hasil: '',
  peringkat: 1,
  weighted: '',
  keterangan: '',
};

export default function FormSection({ form: incomingForm, setForm = () => {}, onAdd = () => {}, onSave = () => {}, onReset = () => {}, editing = false }) {
  const form = { ...FALLBACK_FORM, ...(incomingForm || {}) };

  const autoWeighted = useMemo(() => computeWeighted(Number(form.bobotSection || 0), Number(form.bobotIndikator || 0), Number(form.peringkat || 0)) || '', [form.bobotSection, form.bobotIndikator, form.peringkat]);

  const previewHasilPercent = useMemo(() => {
    const num = Number(form.numeratorValue || 0);
    const den = Number(form.denominatorValue || 0);
    const r = den ? num / den : 0;
    return (r * 100).toFixed(2) + '%';
  }, [form.numeratorValue, form.denominatorValue]);

  const handleChange = (k, v) => setForm((prev) => ({ ...(prev || FALLBACK_FORM), [k]: v }));

  return (
    <section className="rounded-xl bg-[#DBDBDB] p-4">
      <h2 className="text-2xl font-semibold mb-4">Investasi</h2>

      <div className="rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <TextField label="No" value={form.no} onChange={(v) => handleChange('no', v)} />
              <TextField label="No Parameter" value={form.subNo} onChange={(v) => handleChange('subNo', v)} />
            </div>

            <TextField label="Parameter" value={form.sectionLabel} onChange={(v) => handleChange('sectionLabel', v)} />
            <TextAreaField label="Sumber risiko" value={form.sumberRisiko} onChange={(v) => handleChange('sumberRisiko', v)} />

            <TextField label="Faktor Penyebut" value={form.denominatorLabel} onChange={(v) => handleChange('denominatorLabel', v)} />
            <TextField label="Total penyebut" value={form.denominatorValue} onChange={(v) => handleChange('denominatorValue', v)} />

            <div className="grid grid-cols-3 gap-3">
              <ReadOnlyField label="Preview Hasil(%)" value={previewHasilPercent} />
              <NumberField label="Peringkat(1-5)" value={form.peringkat} onChange={(v) => handleChange('peringkat', v)} />
              <ReadOnlyField label="Weighted(auto)" value={form.weighted !== '' ? `${form.weighted}%` : autoWeighted !== '' ? `${autoWeighted}%` : ''} hint="Weighted = Bobot Section × Bobot Indikator × Peringkat ÷ 10000" />
            </div>

            <TextAreaField label="Keterangan" value={form.keterangan} onChange={(v) => handleChange('keterangan', v)} />
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <NumberField label="Bobot" value={form.bobotSection} onChange={(v) => handleChange('bobotSection', v)} />
              <NumberField label="Bobot Indikator" value={form.bobotIndikator} onChange={(v) => handleChange('bobotIndikator', v)} />
            </div>

            <TextAreaField label="Indikator" value={form.indikator} onChange={(v) => handleChange('indikator', v)} />
            <TextAreaField label="Dampak" value={form.dampak} onChange={(v) => handleChange('dampak', v)} />

            <TextField label="Faktor pembilang" value={form.numeratorLabel} onChange={(v) => handleChange('numeratorLabel', v)} />
            <TextField label="Total pembilang" value={form.numeratorValue} onChange={(v) => handleChange('numeratorValue', v)} />

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <RiskField
                label="Low"
                value={form.low}
                onChange={(v) => handleChange('low', v)}
                color="#B7E1A1" // hijau muda
                textColor="#0B3D2E"
                placeholder="x ≤ 1%"
              />
              <RiskField
                label="Low to Moderate"
                value={form.lowToModerate}
                onChange={(v) => handleChange('lowToModerate', v)}
                color="#CFE0FF" // biru muda
                textColor="#0B2545"
                placeholder="1% < x ≤ 2%"
              />
              <RiskField
                label="Moderate"
                value={form.moderate}
                onChange={(v) => handleChange('moderate', v)}
                color="#FFEEAD" // kuning muda
                textColor="#4B3A00"
                placeholder="2% < x ≤ 3%"
              />
              <RiskField
                label="Moderate to High"
                value={form.moderateToHigh}
                onChange={(v) => handleChange('moderateToHigh', v)}
                color="#FAD2A7" // oranye muda
                textColor="#5A2E00"
                placeholder="3% < x ≤ 4%"
              />
              <RiskField
                label="High"
                value={form.high}
                onChange={(v) => handleChange('high', v)}
                color="#E57373" // merah soft
                textColor="#FFFFFF"
                placeholder="x > 4%"
              />
            </div>
          </div>
        </div>
      </div>

      {/* tombol */}
      <div className="flex justify-end mt-5">
        {!editing ? (
          <button onClick={onAdd} className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-lg shadow">
            Simpan
          </button>
        ) : (
          <div className="flex gap-3">
            <button onClick={onSave} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow">
              Simpan
            </button>
            <button onClick={onReset} className="border border-gray-400 hover:bg-gray-100 px-5 py-2 rounded-lg shadow text-gray-700">
              Batal
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
