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
      
      if (typeof v === 'number') return v;
      
      if (typeof v === "string") {
        let cleaned = v.trim();
        cleaned = cleaned.replace(/\s/g, "");
        
        // Handle format seperti "100.000.000" (pemisah ribuan dengan titik)
        const hasThousandSeparators = /^\d{1,3}(\.\d{3})*(,\d+)?$/.test(cleaned) || /^\d{1,3}(\.\d{3})*$/.test(cleaned);
        
        if (hasThousandSeparators) {
          // Hapus semua titik sebagai pemisah ribuan
          cleaned = cleaned.replace(/\./g, "");
        }
        
        const isPercent = cleaned.includes("%");
        cleaned = cleaned.replace("%", "");
        cleaned = cleaned.replace(/,/g, ".");
        
        const num = Number(cleaned);
        
        if (!isNaN(num) && isPercent) {
          return num / 100; // Konversi persentase ke desimal
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
      
      // Jika persentase, kalikan dengan 100 terlebih dahulu
      let displayNum = num;
      if (isPercent) {
        displayNum = num * 100;
      }
      
      let formatted;
      
      if (Number.isInteger(displayNum)) {
        formatted = displayNum.toLocaleString('id-ID', {
          useGrouping: true,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        });
      } else {
        formatted = displayNum.toLocaleString('id-ID', {
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
      
      const num = parseNumber(value);
      if (!isNaN(num)) {
        return formatNumberWithSeparators(num, isPercent);
      }
      
      return String(value);
    };

    /* ========= PARSE RANGE ========= */
    const parseRange = (text) => {
      if (!text || typeof text !== 'string') return null;
      
      let processedText = text.replace(/≤/g, '<=').replace(/≥/g, '>=');

      const rawText = processedText.trim();
      if (rawText === "") return null;
      
      // Coba parse angka dari teks, termasuk dengan pemisah ribuan dan persentase
      const extractNumberFromText = (str) => {
        if (!str) return NaN;
        
        let numStr = str.trim();
        
        // Handle persentase
        const isPercent = numStr.includes('%');
        numStr = numStr.replace(/%/g, '');
        
        // Hapus semua spasi
        numStr = numStr.replace(/\s/g, '');
        
        // Tangani format dengan koma sebagai desimal (Indonesia)
        // Ganti koma dengan titik untuk parsing JavaScript
        numStr = numStr.replace(/,/g, '.');
        
        // Hapus karakter non-angka kecuali titik dan tanda minus
        numStr = numStr.replace(/[^\d.\-]/g, '');
        
        if (!numStr) return NaN;
        
        // Cek apakah ada pemisah ribuan dengan titik
        const hasThousandSeparators = /^\d{1,3}(\.\d{3})*(\.\d+)?$/.test(numStr);
        
        if (hasThousandSeparators) {
          // Untuk membedakan pemisah ribuan dan desimal:
          // Jika ada lebih dari satu titik, hapus semua kecuali yang terakhir
          const parts = numStr.split('.');
          if (parts.length > 2) {
            // Semua kecuali bagian terakhir adalah pemisah ribuan
            const integerPart = parts.slice(0, -1).join('');
            const decimalPart = parts[parts.length - 1];
            numStr = integerPart + '.' + decimalPart;
          }
        }
        
        // Tangani angka negatif
        const isNegative = numStr.startsWith('-');
        if (isNegative) {
          numStr = numStr.substring(1);
        }
        
        const num = Number(numStr);
        if (isNaN(num)) return NaN;
        
        let result = isNegative ? -num : num;
        
        // Jika persentase, bagi dengan 100
        return isPercent ? result / 100 : result;
      };
      
      const lowerCaseText = rawText.toLowerCase();
      
      // Format: x > 0
      if (lowerCaseText.includes('>') && !lowerCaseText.includes('<') && !lowerCaseText.includes('=')) {
        const parts = rawText.split('>');
        if (parts.length >= 2) {
          const afterGreater = parts.slice(1).join('>').trim();
          const num = extractNumberFromText(afterGreater);
          if (isNaN(num)) return null;
          
          return { min: num, max: Infinity, type: 'greater-than', isExclusive: true };
        }
      }
      
      // Format: x >= value
      if (lowerCaseText.includes('>=')) {
        const parts = rawText.split('>=');
        if (parts.length >= 2) {
          const afterGreaterEqual = parts.slice(1).join('>=').trim();
          const num = extractNumberFromText(afterGreaterEqual);
          if (isNaN(num)) return null;
          
          return { min: num, max: Infinity, type: 'greater-equal' };
        }
      }
      
      // Format: x < -7%
      if (lowerCaseText.includes('<') && !lowerCaseText.includes('>') && !lowerCaseText.includes('=')) {
        const parts = rawText.split('<');
        if (parts.length >= 2) {
          const afterLess = parts.slice(1).join('<').trim();
          const num = extractNumberFromText(afterLess);
          if (isNaN(num)) return null;
          
          return { min: -Infinity, max: num, type: 'less-than', isExclusive: true };
        }
      }
      
      // Format: x <= value
      if (lowerCaseText.includes('<=')) {
        const parts = rawText.split('<=');
        if (parts.length >= 2) {
          const afterLessEqual = parts.slice(1).join('<=').trim();
          const num = extractNumberFromText(afterLessEqual);
          if (isNaN(num)) return null;
          
          return { min: -Infinity, max: num, type: 'less-equal' };
        }
      }
      
      // Format: -3% < x < 0 (range dengan dua operator)
      if (lowerCaseText.includes('<') && lowerCaseText.includes('>')) {
        // Cari pola: value1 < x < value2
        const match = rawText.match(/([^<]+)<\s*x\s*<\s*([^>]+)/i);
        if (match) {
          const leftValue = extractNumberFromText(match[1].trim());
          const rightValue = extractNumberFromText(match[2].trim());
          
          if (!isNaN(leftValue) && !isNaN(rightValue)) {
            return { 
              min: leftValue, 
              max: rightValue, 
              type: 'range', 
              isExclusive: true 
            };
          }
        }
        
        // Coba pola lain: value1 > x > value2
        const match2 = rawText.match(/([^>]+)>\s*x\s*>\s*([^<]+)/i);
        if (match2) {
          const leftValue = extractNumberFromText(match2[1].trim());
          const rightValue = extractNumberFromText(match2[2].trim());
          
          if (!isNaN(leftValue) && !isNaN(rightValue)) {
            return { 
              min: rightValue, 
              max: leftValue, 
              type: 'range', 
              isExclusive: true 
            };
          }
        }
      }
      
      // Format: 0 - 100.000.000 atau 0-100.000.000 (range sederhana)
      if (rawText.includes('-') && !rawText.includes('>') && !rawText.includes('<')) {
        const parts = rawText.split('-').map(p => p.trim());
        if (parts.length === 2) {
          const min = extractNumberFromText(parts[0]);
          const max = extractNumberFromText(parts[1]);
          if (!isNaN(min) && !isNaN(max)) {
            return { min, max, type: 'range', isExclusive: false };
          }
        }
      }
      
      // Coba ekstrak angka tunggal
      const num = extractNumberFromText(rawText);
      if (!isNaN(num)) {
        return { min: num, max: num, type: 'exact' };
      }
      
      return null;
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
      // Urutan pengecekan
      for (const { key, rank } of ranges) {
        const rawText = String(ri[key] ?? "").trim();
        
        if (rawText) {
          const range = parseRange(rawText);
          
          if (range) {
            const { min, max, type, isExclusive } = range;
            let isMatch = false;
            
            if (type === 'greater-than') {
              isMatch = isExclusive ? rawValue > min : rawValue >= min;
            } else if (type === 'greater-equal') {
              isMatch = rawValue >= min;
            } else if (type === 'less-than') {
              isMatch = isExclusive ? rawValue < max : rawValue <= max;
            } else if (type === 'less-equal') {
              isMatch = rawValue <= max;
            } else if (type === 'range') {
              if (isExclusive) {
                isMatch = rawValue > min && rawValue < max;
              } else {
                isMatch = rawValue >= min && rawValue <= max;
              }
            } else if (type === 'exact') {
              isMatch = rawValue === min;
            }
            
            if (isMatch) {
              peringkat = rank;
              matchedIndex = ranges.findIndex(r => r.key === key);
              break;
            }
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
          matchedIndex = ranges.findIndex(r => r.key === key);
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