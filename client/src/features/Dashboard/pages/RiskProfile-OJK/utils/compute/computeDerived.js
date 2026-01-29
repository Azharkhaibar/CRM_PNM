export function computeDerived(nilai, param) {
  try {
    if (!nilai) {
      return emptyResult();
    }

    const judul = nilai.judul || {};

    const paramBobotFraction = Number(param?.bobot ?? 0) / 100;
    const nilaiBobotFraction = Number(nilai?.bobot ?? 0) / 100;

    /* HELPERS */

    const parseNumber = (v) => {
      if (v == null || v === "" || v === undefined) return NaN;
      
      // Jika sudah number, return langsung
      if (typeof v === 'number') return v;
      
      if (typeof v === "string") {
        let cleaned = v.trim();
        
        // Hapus spasi
        cleaned = cleaned.replace(/\s/g, "");
        
        // Tangani persen
        const isPercent = cleaned.includes("%");
        cleaned = cleaned.replace("%", "");
        
        // Untuk perhitungan: hapus semua titik (anggap titik sebagai pemisah ribuan)
        cleaned = cleaned.replace(/\./g, "");
        
        // Ganti koma dengan titik (untuk desimal)
        cleaned = cleaned.replace(/,/g, ".");
        
        const num = Number(cleaned);
        
        if (!isNaN(num) && isPercent) {
          return num / 100;
        }
        
        return num;
      }
      
      return Number(v);
    };

    const normalize = (v) =>
      String(v ?? "")
        .trim()
        .toLowerCase();

    const evaluateFormula = (expr, subs = {}) => {
      if (!expr || typeof expr !== "string" || expr.trim() === "") return NaN;

      let e = expr.trim();
      
      for (const [token, value] of Object.entries(subs)) {
        const re = new RegExp(`\\b${token}\\b`, "gi");
        e = e.replace(re, String(value));
      }

      const safeRe = /^[0-9eE\.\+\-\*\/\(\)\s]+$/;
      if (!safeRe.test(e)) {
        console.warn("Formula contains unsafe characters:", e);
        return NaN;
      }

      try {
        const fn = new Function(`"use strict"; try { return (${e}); } catch(err) { return NaN; }`);
        const val = fn();
        
        // Pastikan hasilnya finite
        if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
          return val;
        }
        
        console.warn("Formula returned invalid result:", val);
        return NaN;
      } catch (error) {
        console.error("Formula evaluation error:", error);
        return NaN;
      }
    };

    // Helper function untuk format angka dengan pemisah ribuan
    const formatNumberWithSeparators = (num, isPercent = false) => {
      if (isNaN(num)) return "";
      
      // Format untuk display: pisah ribuan dengan titik, desimal dengan koma
      let formatted;
      
      if (Number.isInteger(num)) {
        // Integer: 1.000.000
        formatted = num.toLocaleString('id-ID', {
          useGrouping: true,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        });
      } else {
        // Desimal: 1.000.000,50
        formatted = num.toLocaleString('id-ID', {
          useGrouping: true,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      }
      
      if (isPercent) {
        return formatted + "%";
      }
      
      return formatted;
    };

    // Helper function untuk format input jika berupa angka
    const formatIfNumber = (value, isPercent = false) => {
      if (value == null || value === "") return "";
      
      // Coba parse sebagai number
      const num = parseNumber(value);
      if (!isNaN(num)) {
        return formatNumberWithSeparators(num, isPercent);
      }
      
      // Jika bukan number, kembalikan aslinya
      return String(value);
    };

    let rawValue = NaN;
    let rawString = null;
    let hasilDisplay = "";
    let hasilRows = [];

    if (judul.type === "Tanpa Faktor") {
      const v = judul.value;
      const formula = (judul.formula || "").trim();
      const parsed = parseNumber(v);
      
      if (!isNaN(parsed)) {
        rawValue = formula
          ? evaluateFormula(formula, { pem: parsed })
          : parsed;
      } else if (typeof v === "string" && v.trim() !== "") {
        rawString = normalize(v);
      }

      finalizeDisplay("Tanpa Faktor", v);
      hasilRows = [hasilDisplay, v ?? "", formula || ""];
    }

    /* ========= SATU FAKTOR ========= */
    else if (judul.type === "Satu Faktor") {
      const v = judul.valuePembilang;
      const formula = (judul.formula || "").trim();
      const parsed = parseNumber(v);
      
      if (!isNaN(parsed)) {
        rawValue = formula
          ? evaluateFormula(formula, { pem: parsed })
          : parsed;
      } else if (typeof v === "string" && v.trim() !== "") {
        rawString = normalize(v);
      }

      finalizeDisplay("Satu Faktor", v, null);
      hasilRows = [hasilDisplay, v ?? "", formula || ""];
    }

    /* ========= DUA FAKTOR ========= */
    else if (judul.type === "Dua Faktor") {
      const vPem = judul.valuePembilang;
      const vPen = judul.valuePenyebut;
      const formula = (judul.formula || "").trim();

      const pem = parseNumber(vPem);
      const pen = parseNumber(vPen);

      if (!isNaN(pem) && !isNaN(pen)) {
        rawValue = formula
          ? evaluateFormula(formula, { pem, pen })
          : pen !== 0
            ? pem / pen
            : NaN;
      } else if (typeof vPem === "string" && vPem.trim() !== "") {
        rawString = normalize(vPem);
      }

      finalizeDisplay("Dua Faktor", vPem, vPen);
      hasilRows = [
        hasilDisplay,
        vPem ?? "",
        vPen ?? "",
        formula || "pem / pen",
      ];
    }


    /*  RANKING */

    let peringkat = null;
    let matchedIndex = null;

    const ri = nilai.riskindikator || {};
    const ranges = [
      { key: "low", rank: 1 },
      { key: "lowToModerate", rank: 2 },
      { key: "moderate", rank: 3 },
      { key: "moderateToHigh", rank: 4 },
      { key: "high", rank: 5 },
    ];

    if (!isNaN(rawValue)) {
      const highText = String(ri.high ?? "").trim();
      const isGreaterThanFormat = /^[xX]?\s*>|≥?>\s*\d+/i.test(highText);
      
      if (isGreaterThanFormat) {
        const match = highText.match(/(\d+(\.\d+)?)/);
        if (match) {
          const threshold = Number(match[1]);
          if (rawValue >= threshold) {
            peringkat = 5;
            matchedIndex = 0;
          }
        }
      }
      
      if (peringkat === null) {
        for (const { key, rank } of ranges) {
          const rawText = String(ri[key] ?? "");
          const nums = rawText.match(/-?\d+(\.\d+)?/g);
          if (!nums || nums.length === 0) continue;

          let min = -Infinity;
          let max = Infinity;

          if (nums.length === 1) {
            const n = Number(nums[0]);
            if (/≤|<=/.test(rawText)) max = n;
            else if (/≥|>=/.test(rawText)) min = n;
            else if (/^[xX]?\s*>|>\s*\d+/i.test(rawText)) {
              min = n;
              max = Infinity;
            } else if (/^[xX]?\s*<|<\s*\d+/i.test(rawText)) {
              min = -Infinity;
              max = n;
            } else {
              min = n;
              max = n;
            }
          } else {
            min = Number(nums[0]);
            max = Number(nums[1]);
          }

          if (rawValue >= min && rawValue <= max) {
            peringkat = rank;
            matchedIndex = 0;
            break;
          }
        }
      }
    }

    if (isNaN(rawValue) && rawString) {
      for (const { key, rank } of ranges) {
        const riValue = normalize(ri[key]);
        if (!riValue) continue;

        if (riValue === rawString) {
          peringkat = rank;
          matchedIndex = 0;
          break;
        }
      }
    }

    const weighted = !isNaN(peringkat)
      ? paramBobotFraction * nilaiBobotFraction * peringkat
      : null;

    const weightedDisplay = !isNaN(weighted) ? weighted.toFixed(2) : "";


    return {
      hasilDisplay,
      hasilRows,
      peringkat,
      weighted,
      weightedDisplay,
      matchedIndex,
      _internal: {
        rawValue,
        rawString,
        paramBobotFraction,
        nilaiBobotFraction,
      },
    };

    function finalizeDisplay(type, originalValue, originalValuePen = null) {
      
      if (!isNaN(rawValue)) {
        // Untuk angka hasil perhitungan (hasil formula atau pembagian)
        hasilDisplay = formatNumberWithSeparators(rawValue, judul.percent);
        return;
      }

      if (rawString) {
        // Tampilkan string asli yang sudah dinormalisasi
        if (type === "Tanpa Faktor") {
          hasilDisplay = judul.value ?? rawString;
        } else if (type === "Satu Faktor") {
          hasilDisplay = judul.valuePembilang ?? rawString;
        } else if (type === "Dua Faktor") {
          if (judul.formula && judul.formula.trim() !== "") {
            hasilDisplay = judul.formula;
          } else {
            hasilDisplay = judul.valuePembilang 
              ? `${judul.valuePembilang} / ${judul.valuePenyebut || "?"}`
              : rawString;
          }
        }
        return;
      }

      // Tampilkan value asli dengan format ribuan
      if (type === "Tanpa Faktor" && originalValue !== null && originalValue !== undefined && originalValue !== "") {
        hasilDisplay = formatIfNumber(originalValue, judul.percent);
      } else if (type === "Satu Faktor" && originalValue !== null && originalValue !== undefined && originalValue !== "") {
        hasilDisplay = formatIfNumber(originalValue, judul.percent);
      } else if (type === "Dua Faktor") {
        if (judul.formula && judul.formula.trim() !== "") {
          hasilDisplay = judul.formula;
        } else if (originalValue || originalValuePen) {
          const pem = formatIfNumber(originalValue, false);
          const pen = formatIfNumber(originalValuePen, false);
          hasilDisplay = pem && pen ? `${pem} / ${pen}` : pem || pen || "";
        } else {
          hasilDisplay = "";
        }
      } else {
        hasilDisplay = "";
      }
    }
  } catch (error) {
    console.error("Error in computeDerived:", error);
    return emptyResult();
  }
}

function emptyResult() {
  return {
    hasilDisplay: "",
    hasilRows: [],
    peringkat: null,
    weighted: null,
    weightedDisplay: "",
    matchedIndex: null,
    _internal: {
      rawValue: NaN,
      rawString: null,
      paramBobotFraction: 0,
      nilaiBobotFraction: 0,
    },
  };
}

export default computeDerived;