export const classifyRowPrompt = (payload: {
  noCell?: string;
  indikatorCell?: string;
  row: string[];
}) => `
Kamu adalah AI parser untuk FILE EXCEL RISIKO REPUTASI BANK.

KONTEKS STRUKTUR DATA:
- Section memiliki nomor seperti: 8.1, 8.2
- Indikator memiliki nomor seperti: 8.1.1, 8.1.2
- Section berisi:
  - nomor section
  - bobot section (%)
  - nama parameter (judul panjang)
- Indikator berisi:
  - subNo (8.1.1)
  - deskripsi indikator (bisa multi-baris, bernomor 1., 2., 3.)
- Baris SETELAH indikator bisa berisi:
  - pembilang / penyebut
  - nilai hasil
  - ringkasan (peringkat, weighted, keterangan)

TUGAS:
Klasifikasikan SATU baris Excel berikut menjadi salah satu tipe:

SECTION
→ jika berisi nomor seperti "8.1" dan judul parameter panjang

INDICATOR
→ jika berisi nomor seperti "8.1.1" dan deskripsi indikator

LABEL
→ jika berisi label seperti:
  "Jumlah Keluhan", "Jumlah Transaksi", "Pembilang", "Penyebut"

VALUE
→ jika berisi angka (0, 1.102, 25%, 50%)

SUMMARY
→ jika berisi peringkat, weighted, keterangan, atau kesimpulan

OTHER
→ jika tidak relevan

ATURAN PENTING:
- Jika teks mengandung pola X.Y.Z → PASTI INDIKATOR
- Jika teks mengandung pola X.Y dan kalimat panjang → PASTI SECTION
- Jangan menebak jika ragu → gunakan OTHER

BALASAN:
- HARUS JSON MURNI
- TANPA markdown
- TANPA penjelasan

FORMAT OUTPUT:
{"type":"INDICATOR","confidence":0.95}

DATA:
noCell: ${payload.noCell ?? ''}
indikatorCell: ${payload.indikatorCell ?? ''}
row: ${payload.row.join(' | ')}
`;
