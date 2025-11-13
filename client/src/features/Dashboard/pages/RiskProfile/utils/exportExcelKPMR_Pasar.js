import * as XLSX from "xlsx-js-style";

export function exportKPMRPasarToExcel({ year, quarter, rows }) {
    const aoa = [];

    // HEADER
    aoa.push([
        "KUALITAS PENERAPAN MANAJEMEN RISIKO", "", // A,B (merge)
        "Skor",
        "1 (Strong)", "2 (Satisfactory)", "3 (Fair)", "4 (Marginal)", "5 (Unsatisfactory)",
        "Evidence",
    ]);
    aoa.push([
        "No", "Pertanyaan / Indikator",
        "", "", "", "", "", "", ""
    ]);

    // GROUP BY ASPEK
    const key = (r) => `${r.aspekNo}|${r.aspekTitle}|${r.aspekBobot}`;
    const by = new Map();
    for (const r of rows) {
        const k = key(r);
        if (!by.has(k)) by.set(k, []);
        by.get(k).push(r);
    }

    // keep track per-aspek score for total later
    const perAspekScores = [];

    for (const [k, items] of by.entries()) {
        const [aspekNo, aspekTitle, bobotStr] = k.split("|");
        const nums = items
            .map((it) => (it.sectionSkor === "" ? null : Number(it.sectionSkor)))
            .filter((v) => v != null && !isNaN(v));
        const skorAspek = nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length) : "";

        if (skorAspek !== "") perAspekScores.push(skorAspek);

        // baris Aspek
        aoa.push([
            `${aspekNo} : ${aspekTitle} (Bobot : ${bobotStr}%)`, "",
            skorAspek === "" ? "" : Number(skorAspek.toFixed(2)),
            "", "", "", "", "",
            ""
        ]);

        // baris Section
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

    // BARIS: TOTAL AVERAGE SEMUA ASPEK (seperti di web – angka di kolom C saja)
    const totalAverage =
        perAspekScores.length
            ? Number((perAspekScores.reduce((a, b) => a + b, 0) / perAspekScores.length).toFixed(2))
            : "";

    aoa.push([
        "", "", // A,B kosong
        totalAverage, // C
        "", "", "", "", "", // D..H
        "" // I
    ]);

    // SHEET
    const ws = XLSX.utils.aoa_to_sheet(aoa);

    // Kolom
    ws["!cols"] = [
        { wch: 8 },   // A
        { wch: 60 },  // B
        { wch: 10 },  // C
        { wch: 28 },  // D
        { wch: 28 },  // E
        { wch: 28 },  // F
        { wch: 28 },  // G
        { wch: 32 },  // H
        { wch: 40 },  // I
    ];

    // MERGES header
    ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }, // A1:B1
        ...Array.from({ length: 8 - 2 + 1 }, (_, i) => ({
            s: { r: 0, c: 2 + i }, e: { r: 1, c: 2 + i } // C1..I2
        })),
    ];

    // STYLES
    const border = { top: { style: "thin" }, right: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" } };
    const center = { alignment: { horizontal: "center", vertical: "center", wrapText: true } };
    const leftTop = { alignment: { horizontal: "left", vertical: "top", wrapText: true } };
    const headFill = {
        fill: { patternType: "solid", fgColor: { rgb: "FF1f4e79" } },
        font: { color: { rgb: "FFFFFFFF" }, bold: true },
        ...center, border,
    };

    // header rows
    for (let r = 0; r <= 1; r++) {
        for (let c = 0; c <= 8; c++) {
            const addr = XLSX.utils.encode_cell({ r, c });
            if (ws[addr]) ws[addr].s = headFill;
        }
    }

    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let R = 2; R <= range.e.r; R++) {
        for (let C = 0; C <= range.e.c; C++) {
            const addr = XLSX.utils.encode_cell({ r: R, c: C });
            if (!ws[addr]) continue;
            ws[addr].s = { ...(ws[addr].s || {}), border, ...(C === 0 ? center : leftTop) };
        }

        // deteksi baris Aspek: merge A..B, style khusus + kolom C hijau
        const aAddr = XLSX.utils.encode_cell({ r: R, c: 0 });
        const bAddr = XLSX.utils.encode_cell({ r: R, c: 1 });
        const cAddr = XLSX.utils.encode_cell({ r: R, c: 2 });

        const isAspek =
            ws[aAddr] && typeof ws[aAddr].v === "string" && ws[aAddr].v.toLowerCase().includes("aspek");

        // deteksi "Total Average Semua Aspek": baris terakhir (A kosong, C angka)
        const isTotalRow =
            (!ws[aAddr] || ws[aAddr].v === "") &&
            ws[cAddr] &&
            (typeof ws[cAddr].v === "number" || ws[cAddr].v === "");

        if (isAspek) {
            ws["!merges"].push({ s: { r: R, c: 0 }, e: { r: R, c: 1 } });
            const aspekStyle = {
                ...(ws[aAddr].s || {}),
                fill: { patternType: "solid", fgColor: { rgb: "FFE9F5E1" } },
                font: { bold: true },
                alignment: { horizontal: "left", vertical: "center", wrapText: true },
                border,
            };
            ws[aAddr].s = aspekStyle;
            if (ws[bAddr]) ws[bAddr].s = aspekStyle;

            if (ws[cAddr]) {
                ws[cAddr].s = {
                    ...(ws[cAddr].s || {}),
                    fill: { patternType: "solid", fgColor: { rgb: "FF93D150" } },
                    font: { bold: true },
                    ...center, border,
                };
            }
        } else if (isTotalRow) {
            // style total average row: kolom C hijau & bold, baris kebiruan
            for (let C = 0; C <= range.e.c; C++) {
                const addr = XLSX.utils.encode_cell({ r: R, c: C });
                if (!ws[addr]) continue;
                ws[addr].s = {
                    ...(ws[addr].s || {}),
                    fill: { patternType: "solid", fgColor: { rgb: "FFC9DAF8" } },
                    border,
                    alignment: { horizontal: C === 2 ? "center" : "left", vertical: "center", wrapText: true },
                    font: { bold: C === 2 ? true : false },
                };
            }
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

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `KPMR Pasar ${year}-${quarter}`);
    XLSX.writeFile(wb, `KPMR-Pasar-${year}-${quarter}.xlsx`);
}
