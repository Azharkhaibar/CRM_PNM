import * as XLSX from "xlsx-js-style";

export function exportKPMRInvestasiToExcel({ year, quarter, rows }) {
    const aoa = [];

    // ===== HEADER TANPA "TW …" =====
    // Row 1: judul kiri + label kolom kanan
    aoa.push([
        "KUALITAS PENERAPAN MANAJEMEN RISIKO", "", // A,B (A1:B1 merge)
        "Skor",                                     // C
        "1 (Strong)", "2 (Satisfactory)", "3 (Fair)", "4 (Marginal)", "5 (Unsatisfactory)", // D..H
        "Evidence",                                  // I
    ]);

    // Row 2: label untuk A,B saja; kolom C..I dikosongi (akan di-merge vertikal dari baris-1)
    aoa.push([
        "No", "Pertanyaan / Indikator",  // A,B
        "", "", "", "", "", "", ""       // C..I (kosong; header vertikal)
    ]);

    // ===== GROUP DATA PER ASPEK =====
    const key = (r) => `${r.aspekNo}|${r.aspekTitle}|${r.aspekBobot}`;
    const by = new Map();
    for (const r of rows) {
        const k = key(r);
        if (!by.has(k)) by.set(k, []);
        by.get(k).push(r);
    }

    for (const [k, items] of by.entries()) {
        const [aspekNo, aspekTitle, bobotStr] = k.split("|");
        const nums = items
            .map(it => (it.sectionSkor === "" ? null : Number(it.sectionSkor)))
            .filter(v => v != null && !isNaN(v));
        const skorAspek = nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length) : "";

        // Baris Aspek (judul aspek merge A..B, skor aspek di C hijau)
        aoa.push([
            `${aspekNo} : ${aspekTitle} (Bobot : ${bobotStr}%)`, "", // A,B (merge)
            skorAspek === "" ? "" : Number(skorAspek.toFixed(2)),    // C
            "", "", "", "", "",                                      // D..H kosong
            ""                                                       // I
        ]);

        // Baris Section (data)
        for (const it of items) {
            aoa.push([
                it.sectionNo,
                it.sectionTitle,
                it.sectionSkor === "" ? "" : Number(it.sectionSkor),
                it.level1, it.level2, it.level3, it.level4, it.level5,
                it.evidence,
            ]);
        }
    }

    // ===== Sheet =====
    const ws = XLSX.utils.aoa_to_sheet(aoa);

    // Column widths
    ws["!cols"] = [
        { wch: 8 },   // A No / judul aspek
        { wch: 60 },  // B Indikator
        { wch: 10 },  // C Skor
        { wch: 28 },  // D
        { wch: 28 },  // E
        { wch: 28 },  // F
        { wch: 28 },  // G
        { wch: 32 },  // H
        { wch: 40 },  // I Evidence
    ];

    // ===== Merges =====
    ws["!merges"] = [
        // Header: A1..B1 merge (judul kiri)
        { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
        // Header: merge vertikal untuk C..I (row1..row2)
        ...Array.from({ length: 7 + 1 }, (_, i) => ({ // C(2)..I(8)
            s: { r: 0, c: 2 + i }, e: { r: 1, c: 2 + i }
        })),
    ];

    // ===== Styling =====
    const border = { top: { style: "thin" }, right: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" } };
    const center = { alignment: { horizontal: "center", vertical: "center", wrapText: true } };
    const leftTop = { alignment: { horizontal: "left", vertical: "top", wrapText: true } };
    const headFill = {
        fill: { patternType: "solid", fgColor: { rgb: "FF1f4e79" } },
        font: { color: { rgb: "FFFFFFFF" }, bold: true },
        ...center, border,
    };

    // Header row 1 & 2 (kolom A..I)
    for (let r = 0; r <= 1; r++) {
        for (let c = 0; c <= 8; c++) {
            const addr = XLSX.utils.encode_cell({ r, c });
            if (ws[addr]) ws[addr].s = headFill;
        }
    }

    // Iterasi semua sel utk border + alignment default
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let R = 2; R <= range.e.r; R++) {
        for (let C = 0; C <= range.e.c; C++) {
            const addr = XLSX.utils.encode_cell({ r: R, c: C });
            if (!ws[addr]) continue;
            ws[addr].s = { ...(ws[addr].s || {}), border, ...(C === 0 ? center : leftTop) };
        }

        // Baris Aspek: deteksi "Aspek" di kolom A → merge A..B & style
        const aAddr = XLSX.utils.encode_cell({ r: R, c: 0 });
        const bAddr = XLSX.utils.encode_cell({ r: R, c: 1 });
        const cAddr = XLSX.utils.encode_cell({ r: R, c: 2 });

        const isAspek = ws[aAddr] && typeof ws[aAddr].v === "string" && ws[aAddr].v.toLowerCase().includes("aspek");
        if (isAspek) {
            // merge A..B
            ws["!merges"].push({ s: { r: R, c: 0 }, e: { r: R, c: 1 } });

            // judul aspek: hijau muda + bold
            const aspekStyle = {
                ...(ws[aAddr].s || {}),
                fill: { patternType: "solid", fgColor: { rgb: "FFE9F5E1" } },
                font: { bold: true },
                alignment: { horizontal: "left", vertical: "center", wrapText: true },
                border,
            };
            ws[aAddr].s = aspekStyle;
            if (ws[bAddr]) ws[bAddr].s = aspekStyle;

            // skor aspek di C: hijau terang + bold + center
            if (ws[cAddr]) {
                ws[cAddr].s = {
                    ...(ws[cAddr].s || {}),
                    fill: { patternType: "solid", fgColor: { rgb: "FF93D150" } },
                    font: { bold: true },
                    ...center, border,
                };
            }
        }
    }

    // Workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `KPMR ${year}-${quarter}`);
    XLSX.writeFile(wb, `KPMR-Investasi-${year}-${quarter}.xlsx`);
}