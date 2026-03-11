import { useState, useEffect } from 'react';
import { loadInherent, loadKpmr, loadDerived } from '../pages/RiskProfile-OJK/utils/storage/riskStorageNilai';
import { computeDerived } from '../pages/RiskProfile-OJK/utils/compute/computeDerived';

// INHERENT Risk Indicators (Low - High)
const INHERENT_RISK_INDICATORS = [
  { label: "Low", value: "low", color: "#4F6228", text: "#FFFFFF", min: 0, max: 1.49, score: 1 },
  { label: "Low To Moderate", value: "lowToModerate", color: "#92D050", text: "#000000", min: 1.50, max: 2.49, score: 2 },
  { label: "Moderate", value: "moderate", color: "#FFFF00", text: "#000000", min: 2.50, max: 3.49, score: 3 },
  { label: "Moderate To High", value: "moderateToHigh", color: "#FFC000", text: "#000000", min: 3.50, max: 4.49, score: 4 },
  { label: "High", value: "high", color: "#FF0000", text: "#FFFFFF", min: 4.50, max: Infinity, score: 5 },
];

// KPMR Risk Indicators (Strong - Unsatisfactory)
const KPMR_RISK_INDICATORS = [
  { label: "Strong", value: "strong", color: "#4F6228", text: "#FFFFFF", min: 0, max: 1.49, score: 1 },
  { label: "Satisfactory", value: "satisfactory", color: "#92D050", text: "#000000", min: 1.50, max: 2.49, score: 2 },
  { label: "Fair", value: "fair", color: "#FFFF00", text: "#000000", min: 2.50, max: 3.49, score: 3 },
  { label: "Marginal", value: "marginal", color: "#FFC000", text: "#000000", min: 3.50, max: 4.49, score: 4 },
  { label: "Unsatisfactory", value: "unsatisfactory", color: "#FF0000", text: "#FFFFFF", min: 4.50, max: Infinity, score: 5 },
];

// PTK/Composite Risk Indicators (Peringkat 1 - Peringkat 5)
const PTK_RISK_INDICATORS = [
  { label: "Peringkat 1", value: "peringkat1", color: "#4F6228", text: "#FFFFFF", min: 0, max: 1.49, score: 1 },
  { label: "Peringkat 2", value: "peringkat2", color: "#92D050", text: "#000000", min: 1.50, max: 2.49, score: 2 },
  { label: "Peringkat 3", value: "peringkat3", color: "#FFFF00", text: "#000000", min: 2.50, max: 3.49, score: 3 },
  { label: "Peringkat 4", value: "peringkat4", color: "#FFC000", text: "#000000", min: 3.50, max: 4.49, score: 4 },
  { label: "Peringkat 5", value: "peringkat5", color: "#FF0000", text: "#FFFFFF", min: 4.50, max: Infinity, score: 5 },
];

const CATEGORIES = [
  { id: "pasar-produk", label: "Pasar Produk" },
  { id: "likuiditas-produk", label: "Likuiditas Produk" },
  { id: "kredit-produk", label: "Kredit Produk" },
  { id: "konsentrasi-produk", label: "Konsentrasi Produk" },
  { id: "operasional-regulatory", label: "Operasional" },
  { id: "hukum-regulatory", label: "Hukum" },
  { id: "kepatuhan-regulatory", label: "Kepatuhan" },
  { id: "reputasi-regulatory", label: "Reputasi" },
  { id: "strategis-regulatory", label: "Strategis" },
  { id: "investasi-regulatory", label: "Investasi" },
  { id: "rentabilitas-regulatory", label: "Rentabilitas" },
  { id: "permodalan-regulatory", label: "Permodalan" },
  { id: "tatakelola-regulatory", label: "Tata Kelola" },
];

const defaultBhz = (id) =>
  id === "operasional-regulatory" || id === "strategis-regulatory" ? 20 : 10;

const truncateToTwoDecimals = (num) => {
  if (num === undefined || num === null || isNaN(num)) return 0;
  return Math.floor(num * 100) / 100;
};

function normalizeItemWithDerived(item, param) {
  if (!item) return null;
  const judul = item?.judul || {};
  const normalizedItem = {
    ...item,
    id: item?.id ?? crypto.randomUUID(),
    bobot: Number(item?.bobot ?? 0),
    judul: {
      ...judul,
      text: judul?.text ?? judul?.label ?? "",
      pembilang: judul?.pembilang ?? "",
      penyebut: judul?.penyebut ?? "",
      type: judul?.type || "",
      value: judul?.value ?? judul?.valuePembilang ?? "",
      valuePembilang: judul?.valuePembilang ?? "",
      valuePenyebut: judul?.valuePenyebut ?? "",
    },
    riskindikator: item?.riskindikator ?? judul?.riskindikator ?? "",
    targetrisiko: item?.targetrisiko ?? judul?.targetrisiko ?? "",
    riskkategori: item?.riskkategori ?? judul?.riskkategori ?? "",
  };
  normalizedItem.derived = computeDerived(normalizedItem, param);
  return normalizedItem;
}

function normalizeInherentRowsWithDerived(rows) {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((r) => {
      if (!r) return null;
      const hasNilaiList = Array.isArray(r.nilaiList);
      const normalizedRow = {
        ...r,
        id: r.id || crypto.randomUUID(),
        bobot: Number(r.bobot ?? 0),
        kategori: r.kategori || { model: "", prinsip: "", jenis: "", underlying: [] },
        nilaiList: hasNilaiList
          ? r.nilaiList.map((item) => (item ? normalizeItemWithDerived(item, r) : null)).filter(Boolean)
          : [],
        indicatorList: []
      };
      return normalizedRow;
    })
    .filter(Boolean);
}

function calculateInherentSummary(rows) {
  let totalWeighted = 0;
  let count = 0;
  rows.forEach(param => {
    if (param.nilaiList && Array.isArray(param.nilaiList)) {
      param.nilaiList.forEach(item => {
        if (item.derived && typeof item.derived.weighted === 'number' && !isNaN(item.derived.weighted)) {
          totalWeighted += item.derived.weighted;
          count++;
        }
      });
    }
  });
  return count > 0 ? totalWeighted / count : 0;
}

function calculateInherentIndicatorCounts(rows) {
  const counts = { high: 0, moderateToHigh: 0, moderate: 0, lowToModerate: 0, low: 0 };

  rows.forEach((param, pIdx) => {
    param.nilaiList?.forEach((item, iIdx) => {
      console.log(`Item [${pIdx}-${iIdx}]:`, {
        id: item.id,
        derived: item.derived,
        riskindikator: item.riskindikator,
        peringkat: item.derived?.peringkat,
        weighted: item.derived?.weighted,
      });

      // Deteksi peringkat
      let peringkat = null;
      if (item.derived?.peringkat !== undefined) peringkat = item.derived.peringkat;
      else if (item.peringkat !== undefined) peringkat = item.peringkat;
      else if (item.score !== undefined) peringkat = item.score;
      else if (item.nilai !== undefined) peringkat = item.nilai;

      if (peringkat !== null && !isNaN(peringkat) && peringkat > 0) {
        console.log(`  → peringkat = ${peringkat}`);
        if (peringkat >= 4.5) counts.high++;
        else if (peringkat >= 3.5) counts.moderateToHigh++;
        else if (peringkat >= 2.5) counts.moderate++;
        else if (peringkat >= 1.5) counts.lowToModerate++;
        else counts.low++;
      } else {
        console.log('  → peringkat null or non-positive, skipping from counts');
      }
    });
  });

  console.log('Final counts:', counts);
  return counts;
}

const getRiskIndicator = (score, type = "inherent", hasData = true) => {
  if (!hasData || score === undefined || score === null || isNaN(score) || score <= 0) {
    return {
      label: "Data Tidak Ditemukan",
      value: "no-data",
      color: "#9ca3af",
      text: "#FFFFFF",
      score: 0,
      hasData: false
    };
  }

  let indicators;
  if (type === "kpmr") {
    indicators = KPMR_RISK_INDICATORS;
  } else if (type === "ptk") {
    indicators = PTK_RISK_INDICATORS;
  } else {
    indicators = INHERENT_RISK_INDICATORS;
  }

  const truncatedScore = truncateToTwoDecimals(score);
  for (const indicator of indicators) {
    if (truncatedScore >= indicator.min && truncatedScore <= indicator.max) {
      return { ...indicator, hasData: true };
    }
  }

  // Fallback for edge cases where score might be outside ranges but > 0
  return {
    label: "Data Tidak Ditemukan",
    value: "no-data",
    color: "#9ca3af",
    text: "#FFFFFF",
    score: 0,
    hasData: false
  };
};

export function useOjkData(year, quarter) {
  const [data, setData] = useState({
    kompositA: 0,
    kompositB: 0,
    total: 0,
    kompositAIndicator: null,
    kompositBIndicator: null,
    totalIndicator: null,
    risks: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!year || !quarter) {
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchData = () => {
      try {
        let inherentFooter = 0;
        let kpmrFooter = 0;
        let categoriesWithInherentData = 0;
        let categoriesWithKpmrData = 0;

        const risks = [];

        CATEGORIES.forEach((category) => {
          // INHERENT - Gunakan loadDerived seperti di RekapData1
          let inherentSummary = 0;
          let normalizedRows = [];

          // Coba load dari derived terlebih dahulu
          const derivedData = loadDerived({
            categoryId: category.id,
            year: year.toString(),
            quarter: quarter.toLowerCase(),
          });

          if (derivedData && typeof derivedData.summary === 'number' && derivedData.summary > 0) {
            inherentSummary = derivedData.summary;

            // Jika pakai derived, kita perlu load rows untuk hitung distribusi
            try {
              const rows = loadInherent({
                categoryId: category.id,
                year: year.toString(),
                quarter: quarter.toLowerCase(),
              });
              if (Array.isArray(rows) && rows.length > 0) {
                normalizedRows = normalizeInherentRowsWithDerived(rows);

                // Debug: lihat struktur data Pasar Produk
                if (category.label === 'Pasar Produk') {
                  console.log('Pasar Produk - RAW rows:', rows);
                  console.log('Pasar Produk - Normalized rows:', normalizedRows);

                  // Tampilkan setiap item di nilaiList
                  normalizedRows.forEach((param, idx) => {
                    console.log(`Parameter ${idx}:`, param);
                    if (param.nilaiList) {
                      param.nilaiList.forEach((item, itemIdx) => {
                        console.log(`  Item ${itemIdx}:`, {
                          derived: item.derived,
                          riskindikator: item.riskindikator,
                          score: item.score,
                          nilai: item.nilai
                        });
                      });
                    }
                  });
                }
              }
            } catch (e) {
              console.error(`Error loading rows for ${category.id}:`, e);
            }
          } else {
            try {
              const rows = loadInherent({
                categoryId: category.id,
                year: year.toString(),
                quarter: quarter.toLowerCase(),
              });
              if (Array.isArray(rows) && rows.length > 0) {
                normalizedRows = normalizeInherentRowsWithDerived(rows);
                inherentSummary = calculateInherentSummary(normalizedRows);
              }
            } catch (e) {
              console.error(`Error calculating inherent for ${category.id}:`, e);
            }
          }

          // Hitung distribusi indikator inherent menggunakan fungsi baru
          const inherentIndicatorCounts = calculateInherentIndicatorCounts(normalizedRows);

          // Debug: log counts untuk Pasar Produk
          if (category.label === 'Pasar Produk') {
            console.log(`Pasar Produk counts:`, inherentIndicatorCounts);
          }

          // KPMR - Pastikan format quarter benar
          let kpmrSummary = 0;
          try {
            const kpmrRows = loadKpmr({
              categoryId: category.id,
              year: year.toString(),
            });

            if (Array.isArray(kpmrRows) && kpmrRows.length > 0) {
              let total = 0;
              let count = 0;
              kpmrRows.forEach((aspek) => {
                aspek.pertanyaanList?.forEach((p) => {
                  const quarterKey = quarter.toLowerCase();
                  const quarterUpper = quarter.toUpperCase();
                  const v = p.skor?.[quarterKey] ?? p.skor?.[quarterUpper] ?? p.skor?.[quarter];
                  const num = Number(v);
                  if (!isNaN(num) && num >= 1 && num <= 5) {
                    total += num;
                    count++;
                  }
                });
              });
              if (count > 0) {
                kpmrSummary = total / count;
              }
            }
          } catch (e) {
            console.error(`Error calculating KPMR for ${category.id}:`, e);
          }

          const bhz = defaultBhz(category.id);
          const weight = bhz / 100;
          const bvt = 100;

          const inherentSkor = truncateToTwoDecimals(inherentSummary * (bvt / 100));
          const kpmrSkor = truncateToTwoDecimals(kpmrSummary);

          const hasInherent = inherentSkor > 0;
          const hasKpmr = kpmrSkor > 0;

          if (hasInherent) {
            inherentFooter += inherentSkor * weight;
            categoriesWithInherentData++;
          }

          if (hasKpmr) {
            kpmrFooter += kpmrSkor * weight;
            categoriesWithKpmrData++;
          }

          risks.push({
            label: category.label,
            inherent: inherentSkor,
            kpmr: kpmrSkor,
            inherentIndicator: getRiskIndicator(inherentSkor, "inherent", hasInherent),
            kpmrIndicator: getRiskIndicator(kpmrSkor, "kpmr", hasKpmr),
            bhz,
            hasInherentData: hasInherent,
            hasKpmrData: hasKpmr,
            inherentIndicatorCounts: inherentIndicatorCounts
          });
        });

        const inherentDisplay = truncateToTwoDecimals(inherentFooter);
        const kpmrDisplay = truncateToTwoDecimals(kpmrFooter);
        const totalDisplay = truncateToTwoDecimals((inherentDisplay + kpmrDisplay) / 2);

        setData({
          kompositA: inherentDisplay,
          kompositB: kpmrDisplay,
          total: totalDisplay,
          kompositAIndicator: getRiskIndicator(inherentDisplay, "inherent", categoriesWithInherentData > 0),
          kompositBIndicator: getRiskIndicator(kpmrDisplay, "kpmr", categoriesWithKpmrData > 0),
          totalIndicator: getRiskIndicator(totalDisplay, "ptk", categoriesWithInherentData > 0 || categoriesWithKpmrData > 0),
          risks: risks.filter(r => r.hasInherentData || r.hasKpmrData),
          loading: false,
          error: null
        });

      } catch (error) {
        console.error("Error in useOjkData:", error);
        setData({
          kompositA: 0,
          kompositB: 0,
          total: 0,
          kompositAIndicator: null,
          kompositBIndicator: null,
          totalIndicator: null,
          risks: [],
          loading: false,
          error: error.message
        });
      }
    };

    fetchData();

    const handleUpdate = () => fetchData();
    window.addEventListener("risk-data-updated", handleUpdate);
    return () => window.removeEventListener("risk-data-updated", handleUpdate);

  }, [year, quarter]);

  return data;
}