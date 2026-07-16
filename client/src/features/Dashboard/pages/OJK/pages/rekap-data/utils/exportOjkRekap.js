import * as XLSX from 'xlsx-js-style';

const hexToARGB = (hex) => {
  const h = hex.replace('#', '').toUpperCase();
  const full = h.length === 3 ? h.split('').map((x) => x + x).join('') : h;
  return 'FF' + full;
};

const borderThin = {
  top: { style: 'thin', color: { rgb: 'FFBFBFBF' } },
  bottom: { style: 'thin', color: { rgb: 'FFBFBFBF' } },
  left: { style: 'thin', color: { rgb: 'FFBFBFBF' } },
  right: { style: 'thin', color: { rgb: 'FFBFBFBF' } },
};

const headerStyle = (bg, fg = '#FFFFFF') => ({
  fill: { patternType: 'solid', fgColor: { rgb: hexToARGB(bg) } },
  font: { bold: true, color: { rgb: hexToARGB(fg) } },
  alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
  border: borderThin,
});

const bodyStyle = {
  alignment: { vertical: 'center', wrapText: true },
  border: borderThin,
};

const setStyle = (ws, r, c, style) => {
  const addr = XLSX.utils.encode_cell({ r, c });
  if (!ws[addr]) ws[addr] = { t: 's', v: '' };
  ws[addr].s = { ...(ws[addr].s || {}), ...style };
};

const COLORS = {
  headerDarkBlue: '#1f4e79',
  blueFill: '#cfe2f3',
  blueFillLight: '#e6f4ff',
  white: '#ffffff',
};

const QUARTER_LABEL = {
  1: 'MAR',
  2: 'JUN',
  3: 'SEP',
  4: 'DES',
};

export function exportOjkRekapDataToExcel(flattenedRows, viewYear, viewQuarter) {
  console.log('📅 OJK Export Parameters:', { viewYear, viewQuarter });

  const dataRows = [];
  const rowTypes = [];
  const merges = [];
  let currentRow = 0;

  // Group by Category and Parameter to compute merges
  const byCategory = {};
  flattenedRows.forEach((row) => {
    const catId = row._categoryId;
    if (!byCategory[catId]) {
      byCategory[catId] = {
        label: row._categoryLabel,
        params: {},
        totalRows: 0,
      };
    }

    const paramId = row.id;
    if (!byCategory[catId].params[paramId]) {
      byCategory[catId].params[paramId] = {
        judul: row.judul,
        items: [],
        totalRows: 0,
      };
    }

    byCategory[catId].params[paramId].items.push(row);
  });

  // Loop through grouped structure to generate rows and calculate merges
  Object.keys(byCategory).forEach((catId) => {
    const cat = byCategory[catId];
    const catStartRow = currentRow;

    let isFirstForCat = true;

    Object.keys(cat.params).forEach((paramId) => {
      const param = cat.params[paramId];
      const paramStartRow = currentRow;

      let paramRowsCount = 0;

      param.items.forEach((paramRow) => {
        (paramRow.nilaiList || []).forEach((item) => {
          const itemType = item.judul?.type || 'Tanpa Faktor';
          let indicatorRows = 1;
          if (itemType === 'Satu Faktor') indicatorRows = 2;
          if (itemType === 'Dua Faktor') indicatorRows = 3;

          paramRowsCount += indicatorRows;
          cat.totalRows += indicatorRows;

          // Row 1: Main Row
          const isFirst = isFirstForCat;
          if (isFirstForCat) isFirstForCat = false;

          const mainRow = [
            isFirst ? cat.label : '',
            currentRow === paramStartRow ? param.judul : '',
            item.judul?.text || '',
            itemType,
          ];

          if (itemType === 'Tanpa Faktor') {
            mainRow.push(item.judul?.value ?? '');
          } else {
            mainRow.push(item.derived?.hasilDisplay ?? '');
          }

          dataRows.push(mainRow);
          rowTypes.push('main');
          currentRow++;

          // Row 2: Pembilang
          if (itemType === 'Satu Faktor' || itemType === 'Dua Faktor') {
            const pembRow = ['', '', item.judul?.pembilang || 'Pembilang', '', item.judul?.valuePembilang ?? ''];
            dataRows.push(pembRow);
            rowTypes.push('detail');
            currentRow++;
          }

          // Row 3: Penyebut
          if (itemType === 'Dua Faktor') {
            const penyRow = ['', '', item.judul?.penyebut || 'Penyebut', '', item.judul?.valuePenyebut ?? ''];
            dataRows.push(penyRow);
            rowTypes.push('detail');
            currentRow++;
          }
        });
      });

      if (paramRowsCount > 0) {
        merges.push({ s: { r: paramStartRow + 1, c: 1 }, e: { r: paramStartRow + paramRowsCount - 1 + 1, c: 1 } });
      }
    });

    if (cat.totalRows > 0) {
      merges.push({ s: { r: catStartRow + 1, c: 0 }, e: { r: catStartRow + cat.totalRows - 1 + 1, c: 0 } });
    }
  });

  const headerRow1 = ['Jenis Risiko', 'Parameter', 'Nilai atau Indicator', 'Type', `${QUARTER_LABEL[viewQuarter]} ${viewYear}`];

  const ws = XLSX.utils.aoa_to_sheet([headerRow1, ...dataRows]);

  ws['!cols'] = [{ wch: 15 }, { wch: 35 }, { wch: 50 }, { wch: 15 }, { wch: 18 }];
  ws['!merges'] = merges;
  ws['!freeze'] = { xSplit: 0, ySplit: 1 };

  // Style header
  for (let c = 0; c < headerRow1.length; c++) setStyle(ws, 0, c, headerStyle(COLORS.headerDarkBlue));

  // Style body
  const headerRowCount = 1;
  const totalRows = dataRows.length;

  for (let r = headerRowCount; r < totalRows + headerRowCount; r++) {
    const rowIndex = r - headerRowCount;
    const rowType = rowTypes[rowIndex];

    for (let c = 0; c < 5; c++) {
      const addr = XLSX.utils.encode_cell({ r, c });
      const cell = ws[addr];
      if (!cell) continue;

      cell.s = { ...(cell.s || {}), ...bodyStyle };

      if (c === 0 || c === 1) {
        if (cell.v) {
          cell.s.fill = { patternType: 'solid', fgColor: { rgb: hexToARGB(COLORS.blueFillLight) } };
          cell.s.font = { bold: true };
          cell.s.alignment = { horizontal: 'center', vertical: 'center' };
          if (c === 0) cell.s.alignment.textRotation = 90;
        } else if (rowType === 'main') {
          cell.s.fill = { patternType: 'solid', fgColor: { rgb: hexToARGB(COLORS.blueFill) } };
        }
      } else if (c === 2) {
        cell.s.alignment = { horizontal: 'left', vertical: 'center' };
        if (rowType === 'main') {
          cell.s.font = { bold: true };
          cell.s.fill = { patternType: 'solid', fgColor: { rgb: hexToARGB(COLORS.blueFill) } };
        } else {
          cell.s.font = { size: 10, color: { rgb: 'FF666666' } };
        }
      } else if (c === 3) {
        cell.s.alignment = { horizontal: 'center', vertical: 'center' };
        if (rowType === 'main' && cell.v) {
          cell.s.font = { bold: true };
          cell.s.fill = { patternType: 'solid', fgColor: { rgb: hexToARGB('#E8F5E9') } };
        }
      } else {
        cell.s.alignment = { horizontal: 'right', vertical: 'center' };
        if (rowType === 'main') {
          cell.s.fill = { patternType: 'solid', fgColor: { rgb: hexToARGB(COLORS.blueFill) } };
        } else {
          cell.s.fill = { patternType: 'solid', fgColor: { rgb: hexToARGB(COLORS.white) } };
        }

        if (typeof cell.v === 'number') {
          cell.t = 'n';
          cell.z = '#,##0.00';
        }
      }
    }
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Rekap OJK');
  XLSX.writeFile(wb, `REKAPDATA-OJK-${QUARTER_LABEL[viewQuarter]}-${viewYear}.xlsx`);
}
