/*
  Menghitung nilai berdasarkan pembilang, penyebut, dan tipe unit.
 */

export const calculateRasValue = (num, den, unitType, manualValue) => {
  // Jika tipe X, selalu gunakan input manual (sesuai request)
  if (unitType === 'X') return manualValue;

  const n = parseFloat(num);
  const d = parseFloat(den);

  // Jika pembilang/penyebut tidak valid, gunakan manual value (fallback)
  if (isNaN(n) || isNaN(d) || d === 0) {
    return manualValue;
  }

  let result = 0;
  if (unitType === 'PERCENTAGE') {
    result = (n / d) * 100;
    return result.toFixed(2) + '%';
  } else if (unitType === 'RUPIAH') {
    result = n / d;
    return 'Rp ' + result.toLocaleString('id-ID');
  }

  return manualValue;
};

/**
 * Mendapatkan nama bulan terakhir berdasarkan Kuartal
 */
export const getQuarterMonthName = (quarter) => {
  switch (quarter) {
    case 'Q1':
      return 'Maret';
    case 'Q2':
      return 'Juni';
    case 'Q3':
      return 'September';
    case 'Q4':
      return 'Desember';
    default:
      return 'Desember';
  }
};
