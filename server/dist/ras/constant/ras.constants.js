"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TINDAK_LANJUT_STATUS = exports.DEFAULT_RISK_CATEGORIES = exports.MONTH_OPTIONS = exports.UNIT_TYPES = exports.RISK_ATTITUDE_INFO = void 0;
exports.RISK_ATTITUDE_INFO = [
    {
        label: 'Tidak Toleran',
        desc: [
            'Tidak ada toleransi terhadap penyimpangan',
            'Monitoring ketat dan tindakan korektif segera',
            'Target harus tercapai tanpa exception',
        ],
    },
    {
        label: 'Konservatif',
        desc: [
            'Rendah toleransi terhadap risiko',
            'Fokus pada pengendalian dan compliance',
            'Perubahan harus melalui approval ketat',
        ],
    },
    {
        label: 'Moderat',
        desc: [
            'Seimbang antara risk dan return',
            'Menerima risiko terkendali untuk pertumbuhan',
            'Monitoring berkala dengan threshold jelas',
        ],
    },
    {
        label: 'Strategis',
        desc: [
            'Menerima risiko tinggi untuk peluang strategis',
            'Fokus pada pencapaian tujuan jangka panjang',
            'Fleksibel dengan perubahan kondisi',
        ],
    },
];
exports.UNIT_TYPES = [
    { value: 'PERCENTAGE', label: 'Persen (%)' },
    { value: 'RUPIAH', label: 'Rupiah (Rp)' },
    { value: 'X', label: 'Kali (X)' },
    { value: 'REAL', label: 'Bilangan Real' },
    { value: 'HOUR', label: 'Jam' },
];
exports.MONTH_OPTIONS = [
    { value: 0, label: 'Januari' },
    { value: 1, label: 'Februari' },
    { value: 2, label: 'Maret' },
    { value: 3, label: 'April' },
    { value: 4, label: 'Mei' },
    { value: 5, label: 'Juni' },
    { value: 6, label: 'Juli' },
    { value: 7, label: 'Agustus' },
    { value: 8, label: 'September' },
    { value: 9, label: 'Oktober' },
    { value: 10, label: 'November' },
    { value: 11, label: 'Desember' },
];
exports.DEFAULT_RISK_CATEGORIES = [
    'Likuiditas',
    'Operasional',
    'Kredit',
    'Pasar',
    'Strategis',
    'Kepatuhan',
    'Reputasi',
];
exports.TINDAK_LANJUT_STATUS = {
    ON_PROGRESS: 'On Progress',
    DONE: 'Done',
};
//# sourceMappingURL=ras.constants.js.map