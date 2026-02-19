"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRasValue = calculateRasValue;
exports.formatRasDisplayValue = formatRasDisplayValue;
exports.getMonthName = getMonthName;
exports.parseNumber = parseNumber;
exports.needsFollowUp = needsFollowUp;
exports.generateGroupId = generateGroupId;
function calculateRasValue(num, den, unitType, manual) {
    if (manual !== undefined && manual !== null && manual !== '') {
        return parseNumber(manual);
    }
    const numerator = parseNumber(num);
    const denominator = parseNumber(den);
    if (numerator !== null && denominator !== null && denominator !== 0) {
        const result = numerator / denominator;
        if (unitType === 'PERCENTAGE') {
            return result * 100;
        }
        return result;
    }
    return null;
}
function formatRasDisplayValue(value, unitType) {
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
function getMonthName(monthIndex) {
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
function parseNumber(input) {
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
function needsFollowUp(actual, limit) {
    if (actual === null)
        return false;
    const limitNum = parseNumber(limit);
    if (limitNum === null)
        return false;
    return actual < limitNum;
}
function generateGroupId() {
    return `GID-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
//# sourceMappingURL=ras.utils.js.map