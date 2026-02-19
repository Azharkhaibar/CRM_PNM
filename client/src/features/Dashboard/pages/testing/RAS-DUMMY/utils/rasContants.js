export const RISK_ATTITUDE_INFO = [
  {
    label: "Tidak Toleran",
    color: "red",
    desc: [
      "Sangat berhati-hati dalam mengambil Risiko dan lebih memilih menjaga stabilitas dan konsistensi dalam operasi bisnis;",
      "konsistensi dalam operasi bisnis;",
      "Keputusan bisnis didasarkan pada pemeliharaan modal."
    ]
  },
  {
    label: "Konservatif",
    color: "yellow",
    desc: [
      "Berhati-hati dalam mengambil Risiko, dengan memilih beberapa Risiko yang terkendali tetapi tetap memprioritaskan kestabilan usaha;",
      "tetap memprioritaskan kestabilan usaha;",
      "Keputusan bisnis didasarkan pada upaya untuk melindungi nilai dari Risiko besar yang tidak terduga termasuk didalamnya menghindari paparan terhadap fluktuasi pasar yang signifikan serta dapat menanggung beban yang kecil."
    ]
  },
  {
    label: "Moderat",
    color: "blue",
    desc: [
      "Bersedia mengambil Risiko dalam batas tertentu untuk mencapai pertumbuhan dan keuntungan, tetapi tetap memperhatikan perlindungan terhadap kerugian besar;",
      "Keputusan bisnis mempertimbangkan peluang pertumbuhan dan dampak Risiko secara bersamaan dan dapat menanggung beban yang sedang."
    ]
  },
  {
    label: "Strategis",
    color: "green",
    desc: [
      "Secara aktif menerapkan strategi yang melibatkan pengelolaan Risiko sebagai bagian integral dari rencana bisnis, mengambil Risiko lebih tinggi dalam rangka mencapai pertumbuhan dan inovasi yang lebih besar;",
      "Keputusan bisnis didasarkan pada analisis Risiko dan potensi pengembalian investasi jangka panjang serta dapat menanggung beban yang besar."
    ]
  }
];

export const UNIT_TYPES = [
  { value: 'PERCENTAGE', label: 'Persen (%)' },
  { value: 'RUPIAH', label: 'Rupiah (Rp)' },
  { value: 'X', label: 'X (Dikali)' },
  { value: 'REAL', label: 'Bilangan Real' },
  { value: 'HOUR', label: 'Jam (hour)' },
];

export const MONTH_OPTIONS = [
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
  { value: 11, label: 'Desember' }
];

// --- NEW: Kategori Risiko Default ---
export const DEFAULT_RISK_CATEGORIES = [
  "Investasi",
  "Pasar",
  "Likuiditas",
  "Operasional",
  "Hukum",
  "Stratejik",
  "Kepatuhan",
  "Reputasi"
];