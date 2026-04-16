// import { normalizeInherentRows, normalizeInherentParameter } from '../../utils/normalize/normalizeInherentRows';
// import { normalizeKpmrRows, normalizeKpmrAspek, normalizeKpmrPertanyaan } from '../../utils/normalize/normalizeKpmrRows';
import { normalizeInherentRows, normalizeInherentParameter } from '../normalize/normalize-inherent-rows';
import { normalizeKpmrRows, normalizeKpmrAspek, normalizeKpmrPertanyaan } from '../normalize/normalize-kpmr-rows';
export function buildRiskKeys({ categoryId, year, quarter }) {
  return {
    inherentKey: `risk:${categoryId}:inherent:${year}:${quarter}`,
    derivedKey: `derived_${categoryId}_${year}_${quarter}`,
    kpmrKey: `risk:${categoryId}:kpmr:${year}`,
  };
}

function safeParse(json, fallback) {
  try {
    if (!json) return fallback;
    return JSON.parse(json);
  } catch (e) {
    console.error('[riskStorage] JSON parse error:', e);
    return fallback;
  }
}

export function loadInherent({ categoryId, year, quarter }) {
  const { inherentKey } = buildRiskKeys({ categoryId, year, quarter });
  const rawData = safeParse(localStorage.getItem(inherentKey), []);
  return normalizeInherentRows(rawData);
}

export function saveInherent({ categoryId, year, quarter, rows }) {
  const { inherentKey } = buildRiskKeys({ categoryId, year, quarter });

  const dataToSave = (rows || []).map((row) => ({
    id: row.id,
    nomor: row.nomor,
    judul: row.judul,
    bobot: row.bobot,
    kategori: row.kategori || {
      model: '',
      prinsip: '',
      jenis: '',
      underlying: [],
    },
    nilaiList: (row.nilaiList || []).map((nilai) => ({
      id: nilai.id,
      nomor: nilai.nomor,
      bobot: nilai.bobot,
      portofolio: nilai.portofolio,
      keterangan: nilai.keterangan,
      kodeEmiten: nilai.kodeEmiten,
      kepemilikan: nilai.kepemilikan,
      sumberRisiko: nilai.sumberRisiko,
      dampak: nilai.dampak,

      judul: {
        type: nilai.judul?.type || 'Tanpa Faktor',
        text: nilai.judul?.text || '',
        value: nilai.judul?.value || '',
        pembilang: nilai.judul?.pembilang || '',
        valuePembilang: nilai.judul?.valuePembilang || '',
        penyebut: nilai.judul?.penyebut || '',
        valuePenyebut: nilai.judul?.valuePenyebut || '',
        formula: nilai.judul?.formula || '',
        percent: nilai.judul?.percent || false,
      },

      riskindikator: {
        low: nilai.riskindikator?.low || '',
        lowToModerate: nilai.riskindikator?.lowToModerate || '',
        moderate: nilai.riskindikator?.moderate || '',
        moderateToHigh: nilai.riskindikator?.moderateToHigh || '',
        high: nilai.riskindikator?.high || '',
      },

      derived: nilai.derived ?? null,
    })),
  }));

  localStorage.setItem(inherentKey, JSON.stringify(dataToSave));
}

export function saveDerived({ categoryId, year, quarter, snapshot, values }) {
  if (!snapshot || typeof snapshot.summary !== 'number') {
    console.warn('[saveDerived] Invalid snapshot, aborted:', snapshot);

    // Tetapi tetap simpan jika ada values
    if (values && Array.isArray(values)) {
      const fallbackSnapshot = {
        summary: values.reduce((sum, val) => sum + (val?.weighted || 0), 0),
        meta: { formula: 'SUM(values.weighted)' },
      };

      const dataToSave = {
        summary: fallbackSnapshot.summary,
        snapshot: fallbackSnapshot,
        lastUpdated: Date.now(),
        categoryId,
        year,
        quarter,
      };

      localStorage.setItem(derivedKey, JSON.stringify(dataToSave));
      console.log(`[saveDerived] Saved fallback → ${derivedKey}`, dataToSave);
      return true;
    }

    return false;
  }

  const { derivedKey } = buildRiskKeys({ categoryId, year, quarter });

  const dataToSave = {
    summary: snapshot.summary,
    snapshot,
    lastUpdated: Date.now(),
    categoryId,
    year,
    quarter,
  };

  localStorage.setItem(derivedKey, JSON.stringify(dataToSave));
  console.log(`[saveDerived] Saved → ${derivedKey}`, dataToSave);
  return true;
}

export function loadDerived({ categoryId, year, quarter }) {
  const { derivedKey } = buildRiskKeys({ categoryId, year, quarter });
  return safeParse(localStorage.getItem(derivedKey), null);
}

export function loadKpmr({ categoryId, year }) {
  const { kpmrKey } = buildRiskKeys({ categoryId, year });
  const rawData = safeParse(localStorage.getItem(kpmrKey), []);

  // ✅ CONVERT STRING KE NUMBER UNTUK SKOR
  const converted = rawData.map((row) => ({
    ...row,
    bobot: typeof row.bobot === 'string' ? parseFloat(row.bobot) || 0 : row.bobot || 0,
    pertanyaanList: (row.pertanyaanList || []).map((q) => ({
      ...q,
      skor: {
        Q1: q.skor?.Q1 !== undefined ? Number(q.skor.Q1) : undefined,
        Q2: q.skor?.Q2 !== undefined ? Number(q.skor.Q2) : undefined,
        Q3: q.skor?.Q3 !== undefined ? Number(q.skor.Q3) : undefined,
        Q4: q.skor?.Q4 !== undefined ? Number(q.skor.Q4) : undefined,
      },
    })),
  }));

  return normalizeKpmrRows(converted);
}

export function saveKpmr({ categoryId, year, rows }) {
  const { kpmrKey } = buildRiskKeys({ categoryId, year });

  const dataToSave = (rows || []).map((row) => ({
    id: row.id,
    nomor: row.nomor,
    judul: row.judul,
    bobot: row.bobot,
    pertanyaanList: (row.pertanyaanList || []).map((q) => ({
      id: q.id,
      nomor: q.nomor,
      pertanyaan: q.pertanyaan,
      skor: {
        // ✅ JANGAN PAKAI || '' KARENA SKOR BISA 0!
        Q1: q.skor?.Q1 !== undefined ? q.skor.Q1 : undefined,
        Q2: q.skor?.Q2 !== undefined ? q.skor.Q2 : undefined,
        Q3: q.skor?.Q3 !== undefined ? q.skor.Q3 : undefined,
        Q4: q.skor?.Q4 !== undefined ? q.skor.Q4 : undefined,
      },
      indicator: {
        strong: q.indicator?.strong || '',
        satisfactory: q.indicator?.satisfactory || '',
        fair: q.indicator?.fair || '',
        marginal: q.indicator?.marginal || '',
        unsatisfactory: q.indicator?.unsatisfactory || '',
      },
      evidence: q.evidence || '',
      catatan: q.catatan || '', // ✅ TAMBAHKAN INI!
      orderIndex: q.orderIndex || 0, // ✅ TAMBAHKAN INI!
    })),
    orderIndex: row.orderIndex || 0, // ✅ TAMBAHKAN INI!
    deskripsi: row.deskripsi || '', // ✅ TAMBAHKAN INI!
  }));

  localStorage.setItem(kpmrKey, JSON.stringify(dataToSave));
  console.log(`💾 [saveKpmr] Saved to localStorage:`, {
    key: kpmrKey,
    rowsCount: rows?.length,
  });
}

export function notifyRiskUpdated() {
  window.dispatchEvent(new Event('risk-data-updated'));
}

export function clearCategoryData({ categoryId }) {
  const removed = [];

  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key?.includes(categoryId)) {
      localStorage.removeItem(key);
      removed.push(key);
    }
  }

  return removed;
}
