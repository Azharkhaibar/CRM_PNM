import { MONTH_OPTIONS } from "./rasConstant";

export const formatRasDisplayValue = (value, unitType) => {
  if (value === '' || value === null || value === undefined) return '-';
  
  const num = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;

  if (isNaN(num)) return value; 

  switch (unitType) {
    case 'PERCENTAGE':
      return num.toFixed(2).replace('.', ',') + '%';

    case 'X':
      return (Number.isInteger(num) ? num : num.toFixed(2).toString().replace('.', ',')) + 'X';

    case 'HOUR':
      const hours = Math.floor(num);
      const minutes = Math.round((num - hours) * 60);

      if (minutes === 60) {
        return (hours + 1) + ' Jam 0 Mnt';
      }
      return `${hours} Jam ${minutes} Mnt`;

      // Opsi: Jam only dengan 2 desimal di belakang
      // Contoh: 2,34 Jam
      // return (Number.isInteger(num) ? num : num.toFixed(2).toString().replace('.', ',')) + ' Jam';

    case 'RUPIAH':
      const absVal = Math.abs(num);
      if (absVal >= 1_000_000_000_000) {
        return 'Rp ' + (num / 1_000_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 }) + ' Triliun';
      }
      if (absVal >= 1_000_000_000) {
        return 'Rp ' + (num / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 }) + ' Miliar';
      }
      if (absVal >= 1_000_000) {
        return 'Rp ' + (num / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 }) + ' Juta';
      }
      return 'Rp ' + num.toLocaleString('id-ID');

    case 'REAL':
    default:
      return num.toLocaleString('id-ID');
  }
};

/*
  Menghitung nilai berdasarkan pembilang, penyebut, dan tipe unit.
 */
export const calculateRasValue = (num, den, unitType, manualValue) => {

  const n = parseFloat(num); // numerator -> pembilang
  const d = parseFloat(den); // denominator -> penyebut

  if (isNaN(n) || isNaN(d) || d === 0) {
    return manualValue;
  }

  let result = n / d;

  if (unitType === 'PERCENTAGE') result = result * 100;

  return result;
};

/**
 * Mendapatkan nama bulan
 */
export const getMonthName = (monthIndex) => {
  const monthObj = MONTH_OPTIONS.find(m => m.value === Number(monthIndex));
  return monthObj ? monthObj.label : 'Desember';
};

export const getMonthlyData = (item, monthIndex) => {
  if (!item.monthlyValues || !item.monthlyValues[monthIndex]) {
    return {
      numerator: item.numeratorValue,
      denominator: item.denominatorValue,
      manual: item.manualQuarterValue
    };
  }
  return item.monthlyValues[monthIndex];
};