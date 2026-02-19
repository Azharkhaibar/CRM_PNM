// src/modules/ras/utils/ras.utils.ts

/**
 * Calculate RAS value from numerator, denominator, or manual value
 */
export function calculateRasValue(
  num: any,
  den: any,
  unitType: string,
  manual: any,
): number | null {
  // If manual value provided, use it
  if (manual !== undefined && manual !== null && manual !== '') {
    return parseNumber(manual);
  }

  // Calculate from numerator and denominator
  const numerator = parseNumber(num);
  const denominator = parseNumber(den);

  if (numerator !== null && denominator !== null && denominator !== 0) {
    const result = numerator / denominator;

    // Convert to percentage if needed
    if (unitType === 'PERCENTAGE') {
      return result * 100;
    }

    return result;
  }

  return null;
}

/**
 * Format RAS display value based on unit type
 */
export function formatRasDisplayValue(
  value: number | null,
  unitType: string,
): string {
  if (value === null || isNaN(value)) {
    return '-';
  }

  switch (unitType) {
    case 'PERCENTAGE':
      return `${value.toFixed(2)}%`;
    case 'RUPIAH':
      return `Rp ${value.toLocaleString('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;
    case 'X':
      return value.toFixed(2) + 'x';
    case 'REAL':
      return value.toLocaleString('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    case 'HOUR':
      return `${value.toFixed(0)} Jam`;
    default:
      return value.toString();
  }
}

/**
 * Get month name
 */
export function getMonthName(monthIndex: number): string {
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  return months[monthIndex] || '';
}

/**
 * Parse numeric value from string
 */
export function parseNumber(input: any): number | null {
  if (input === null || input === undefined || input === '') {
    return null;
  }

  if (typeof input === 'number') {
    return input;
  }

  if (typeof input === 'string') {
    const cleanStr = input
      .toString()
      .replace(/[^0-9,.-]/g, '')
      .replace(',', '.');
    const val = parseFloat(cleanStr);
    return isNaN(val) ? null : val;
  }

  return null;
}

/**
 * Check if actual value is below limit (needs follow-up)
 */
export function needsFollowUp(
  actual: number | null,
  limit: string | null,
): boolean {
  if (actual === null) return false;

  const limitNum = parseNumber(limit);
  if (limitNum === null) return false;

  return actual < limitNum;
}

/**
 * Generate group ID for new items
 */
export function generateGroupId(): string {
  return `GID-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
